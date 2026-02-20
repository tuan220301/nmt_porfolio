"use client";

import { Color } from "@tiptap/extension-color";
import BulletList from "@tiptap/extension-bullet-list";
import Document from "@tiptap/extension-document";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import Paragraph from "@tiptap/extension-paragraph";
import Dropcursor from "@tiptap/extension-dropcursor";
import Image from "@tiptap/extension-image";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import { EditorContent, useEditor } from "@tiptap/react";
import Placeholder from "@tiptap/extension-placeholder";
import React, { useCallback, useEffect, useState } from "react";
import {
  enableKeyboardNavigation,
  Slash,
  SlashCmd,
  SlashCmdProvider,
} from "@harshtalks/slash-tiptap";

import "./style.css";
import { SuggestionsTipTap } from "./suggestions_slash_tiptap";
import { BaseHeadingCus } from "./BaseHeadingCus";
import CustomImage from "./ImageExtension";
import { AnimatePresence, motion } from "framer-motion";
import Link from "@tiptap/extension-link";

type TipTapPropsType = {
  onChangeContent: (content: string) => void;
  content: string;
  isBorder?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  isActive?: boolean;
  projectTitle?: string;
};

const Tiptap = ({ onChangeContent, content, isBorder, onFocus, onBlur, isActive, projectTitle }: TipTapPropsType) => {
  const [showColor, setShowColor] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingProgress, setUploadingProgress] = useState<string>('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  console.log(`\n📋 [Tiptap] Component rendered`, {
    isBorder,
    isActive,
    projectTitle,
    fileInputRefExists: !!fileInputRef.current,
    editorEditable: isBorder ?? false,
    isUploading,
  });

  const editor = useEditor({
    editable: isBorder ?? false,
    extensions: [
      Document,
      Paragraph,
      Text,
      BulletList.configure({ HTMLAttributes: { class: "list-disc pl-4" } }),
      OrderedList.configure({ HTMLAttributes: { class: "list-decimal pl-4" } }),
      Bold,
      Italic,
      TextStyle,
      BaseHeadingCus,
      Underline,
      Color,
      Image,
      Dropcursor,
      ListItem,
      CustomImage,
      Slash.configure({
        suggestion: {
          items: () => SuggestionsTipTap,
        },
      }),
      Placeholder.configure({
        placeholder: "Press / to see available commands",
      }),
      Link.configure({
        openOnClick: true,
        autolink: true,
        HTMLAttributes: {
          class: "text-blue-500 underline",
        },
      }),
    ],
    editorProps: {
      handleDOMEvents: {
        keydown: (_, v) => enableKeyboardNavigation(v),
        focus: () => {
          console.log(`🔍 [Tiptap.onFocus] Editor focused`);
          onFocus?.();
          return false;
        },
        blur: (view) => {
          if (isUploading) {
            console.log(`🔍 [Tiptap.onBlur] Blur prevented - image upload in progress`);
            return true;
          }
          
          const activeElement = document.activeElement;
          if (activeElement?.tagName === 'INPUT' && (activeElement as HTMLInputElement).type === 'file') {
            console.log(`🔍 [Tiptap.onBlur] Blur prevented - file input is active`);
            return true;
          }
          
          console.log(`🔍 [Tiptap.onBlur] Blur allowed`);
          onBlur?.();
          return false;
        },
      },
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none",
      },
    },
    content: content,
    onUpdate: ({ editor }) => {
      const htmlContent = editor.getHTML();
      const imageRegex = /<img[^>]+src=["']([^"']+)["']/g;
      const imageUrls: string[] = [];
      let match;
      while ((match = imageRegex.exec(htmlContent)) !== null) {
        imageUrls.push(match[1]);
      }
      
      console.log(`📝 [Tiptap.onUpdate] Content changed. HTML length: ${htmlContent.length}`);
      console.log(`📝 [Tiptap.onUpdate] Images detected: ${imageUrls.length}`);
      if (imageUrls.length > 0) {
        console.log(`📝 [Tiptap.onUpdate] Image URLs:`, imageUrls);
      }
      onChangeContent(htmlContent);
    },
  });

  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) {
        console.log(`❌ [Tiptap.handleImageUpload] No files selected`);
        return;
      }

      const file = files[0];
      console.log(`\n${'═'.repeat(70)}`);
      console.log(`🎯 [Tiptap.handleImageUpload] IMAGE UPLOAD STARTED`);
      console.log(`${'═'.repeat(70)}`);
      console.log(`📸 [Tiptap.handleImageUpload] File details:`, {
        name: file.name,
        size: (file.size / 1024).toFixed(2) + ' KB',
        type: file.type,
      });

      setIsUploading(true);
      setUploadingProgress('Uploading...');

      try {
        const formData = new FormData();
        formData.append('image', file);

        console.log(`📤 [Tiptap.handleImageUpload] Sending to /api/persional_project/upload`);
        const uploadStartTime = Date.now();

        const response = await fetch('/api/persional_project/upload', {
          method: 'POST',
          body: formData,
        });

        const uploadDuration = ((Date.now() - uploadStartTime) / 1000).toFixed(2);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Upload failed with status ${response.status}`);
        }

        const data = await response.json();
        console.log(`✅ [Tiptap.handleImageUpload] API Response received (${uploadDuration}s):`, {
          isSuccess: data.isSuccess,
          message: data.message,
          hasData: !!data.data,
          dataLength: data.data?.length || 0,
        });

        if (!data.isSuccess || !data.data) {
          throw new Error(data.message || 'Upload unsuccessful');
        }

        const imageUrl = data.data;
        console.log(`✅ [Tiptap.handleImageUpload] Image URL received:`, imageUrl);

        console.log(`📝 [Tiptap.handleImageUpload] Inserting image into editor`);
        if (editor) {
          editor
            .chain()
            .focus()
            .setImage({ src: imageUrl })
            .run();
          console.log(`✅ [Tiptap.handleImageUpload] Image inserted successfully into editor`);
        }

        console.log(`${'═'.repeat(70)}`);
        console.log(`✅ [Tiptap.handleImageUpload] UPLOAD COMPLETE`);
        console.log(`${'═'.repeat(70)}\n`);

        setUploadingProgress('Done');
        setTimeout(() => {
          setIsUploading(false);
          setUploadingProgress('');
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }, 800);

      } catch (error) {
        const message = error instanceof Error ? error.message : 'Upload failed';
        console.error(`❌ [Tiptap.handleImageUpload] Error:`, message);
        console.log(`${'═'.repeat(70)}\n`);
        setIsUploading(false);
        setUploadingProgress('');
        alert(`Image upload failed: ${message}`);
      }
    },
    [editor, projectTitle]
  );

  useEffect(() => {
    if (!editor) return;
  }, [isBorder, editor]);

  useEffect(() => {
    if (!editor) return;
    editor.setOptions({ editable: isBorder ?? false });
  }, [isBorder, editor]);

  useEffect(() => {
    if (!editor || content === editor.getHTML()) return;
    editor.commands.setContent(content);
  }, [content, editor]);

  const CheckForBoldWhenActive = (item: any) => {
    if (item.title === "Heading 1") {
      return (
        <div className="flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-4"
          >
            <path d="M5 3v18h4v-7h6v7h4V3h-4v6H9V3H5z" />
          </svg>
          <span>{item.title}</span>
        </div>
      );
    }
    return <span>{item.title}</span>;
  };

  const isSelected = (format: "bold" | "italic" | "underline") => {
    return editor?.isActive(format);
  };

  const OptionButton = (
    nameActive: "bold" | "italic" | "underline",
    children: React.ReactNode,
  ) => {
    return (
      <button
        onClick={() => isSelected(nameActive)}
        className={`px-2 py-1 border rounded transition-colors ${
          isSelected(nameActive)
            ? "bg-blue-100 border-blue-400 dark:bg-blue-900/30 dark:border-blue-500"
            : "border-gray-300 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/30"
        }`}
        title={nameActive.charAt(0).toUpperCase() + nameActive.slice(1)}
      >
        {children}
      </button>
    );
  };

  const ButtonColor = (name: string, color: string) => {
    return (
      <button
        key={`color-${name}`}
        onClick={() => editor?.chain().focus().setColor(color).run()}
        className={`w-6 h-6 rounded-full border-2 transition-all ${
          editor?.isActive("textStyle", { color }) ? "border-gray-800 dark:border-white scale-110" : "border-gray-300"
        }`}
        style={{ backgroundColor: color }}
        title={name}
      />
    );
  };

  const setLink = () => {
    const previousUrl = editor?.getAttributes("link").href;
    const url = window.prompt("Enter URL", previousUrl);

    if (url === null) return;
    if (url === "") {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  if (!editor) return null;

  return (
    <div className="p-3 space-y-3">
      <SlashCmdProvider>
        {/* Toolbar - only show when editor is focused/active */}
        {isActive && (
          <div className="flex items-center gap-1.5 px-2 py-2 bg-gray-50 dark:bg-black rounded-lg border border-gray-200 dark:border-gray-800">
            {/* Text Formatting Group */}
            <div className="flex items-center gap-1 pr-2 border-r border-gray-300 dark:border-gray-700">
              {OptionButton("bold", <p className="text-sm font-semibold">B</p>)}
              {OptionButton("italic", <p className="text-sm italic">I</p>)}
              {OptionButton("underline", <p className="text-sm underline">U</p>)}
            </div>

            {/* Link Button */}
            <button
              onClick={setLink}
              className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
              title="Add Link"
            >
              <p className="font-medium">L</p>
            </button>

            {/* Separator */}
            <div className="h-5 w-px bg-gray-300 dark:bg-gray-600"></div>

            {/* Image Upload Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={isUploading}
              title="Upload Image"
            >
              {isUploading && <span className="text-xs font-medium text-amber-600 dark:text-amber-400">{uploadingProgress}</span>}
              {!isUploading && (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-5">
                  <path d="M.5 1a.5.5 0 0 0-.5.5v12a.5.5 0 0 0 .5.5h15a.5.5 0 0 0 .5-.5v-12a.5.5 0 0 0-.5-.5H.5ZM1 12.5v-11h14v11H1Z" />
                  <path d="M1 2a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2Z" />
                  <path d="M1 13a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2l-3.86-3.86a1 1 0 0 0-1.41 0L7 9.67l-2.22-2.22a1 1 0 0 0-1.41 0L1 10.33v2.67Z" />
                  <circle cx="12.5" cy="4.5" r="1.5" />
                </svg>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                ref={fileInputRef}
              />
            </button>

            {/* Color Picker Toggle */}
            <AnimatePresence initial={false}>
              {!showColor ? (
                <motion.button
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setShowColor(!showColor)}
                  className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors flex items-center gap-2 text-sm font-medium"
                >
                  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-red-400 to-purple-500"></div>
                  Color
                </motion.button>
              ) : null}
            </AnimatePresence>
          </div>
        )}

        {/* Color Picker Panel */}
        <AnimatePresence initial={false}>
          {showColor ? (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 8 }}
              exit={{ opacity: 0, y: -10 }}
              key="colorPicker"
              transition={{ duration: 0.2 }}
              className="px-3 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg flex items-center gap-2"
            >
              {/* Color Options */}
              <div className="flex items-center gap-2">
                {ButtonColor("Red", "#F98181")}
                {ButtonColor("Yellow", "#FAF594")}
                {ButtonColor("Orange", "#FBBC88")}
                {ButtonColor("Purple", "#958DF1")}
              </div>

              {/* Divider */}
              <div className="h-5 w-px bg-gray-300 dark:bg-gray-600"></div>

              {/* Unset Button */}
              <button
                onClick={() => editor?.chain().focus().unsetColor().run()}
                className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                title="Remove color"
              >
                Clear
              </button>

              {/* Close Button */}
              <button
                onClick={() => setShowColor(false)}
                className="ml-auto p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                title="Close color picker"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                  <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
                </svg>
              </button>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className={`rounded-lg mt-3 p-3 transition-all ${isBorder ? "border-2 border-blue-400 dark:border-blue-600" : ""}`}>
          <EditorContent editor={editor} className="prose prose-sm dark:prose-invert max-w-none" />
        </div>

        <SlashCmd.Root editor={editor}>
          <SlashCmd.Cmd>
            <SlashCmd.Empty>No commands available</SlashCmd.Empty>
            <SlashCmd.List className="border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 bg-white dark:bg-gray-900 shadow-lg max-h-64 overflow-y-auto">
              {SuggestionsTipTap.map((item) => {
                return (
                  <SlashCmd.Item
                    value={item.title}
                    onCommand={(val) => {
                      item.command(val);
                    }}
                    key={item.title}
                    className="rounded px-2 py-1.5 mb-1 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                  >
                    {CheckForBoldWhenActive(item)}
                  </SlashCmd.Item>
                );
              })}
            </SlashCmd.List>
          </SlashCmd.Cmd>
        </SlashCmd.Root>
      </SlashCmdProvider>
    </div>
  );
};

export default Tiptap;
