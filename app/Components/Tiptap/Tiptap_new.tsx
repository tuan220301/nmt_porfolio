"use client";
import {
  useEditor,
  EditorContent,
  BubbleMenu,
  FloatingMenu,
} from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline,
  Document,
  Paragraph,
  Text,
  BulletList,
  OrderedList,
  ListItem,
  Link,
  Color,
  Placeholder,
  Image,
  Dropcursor,
  TextStyle,
} from "@tiptap/extension-starter-kit";
import React, { useState, useCallback, useMemo } from "react";
import { enableKeyboardNavigation } from "./SelectionMenu";
import {
  SlashTiptap,
} from "@harshtalks/slash-tiptap";

import "./style.css";
import { SuggestionsTipTap } from "./suggestions_slash_tiptap";
import { BaseHeadingCus } from "./BaseHeadingCus";
import CustomImage from "./ImageExtension";
import { AnimatePresence, motion } from "framer-motion";

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

  console.log(`\n📋 [Tiptap] Toolbar visibility:`, {
    isActive,
    toolbarVisible: isActive === true,
    reason: !isActive ? `isActive is ${isActive}, toolbar hidden` : 'isActive is true, toolbar should be visible',
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
      SlashTiptap.configure({
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
            console.log(`⏸️ [Tiptap.onBlur] Ignoring blur - image upload in progress`);
            return false;
          }
          
          const activeElement = document.activeElement;
          if (activeElement?.tagName === 'INPUT' && (activeElement as HTMLInputElement).type === 'file') {
            console.log(`⏸️ [Tiptap.onBlur] Ignoring blur - focus moved to file input`);
            return false;
          }
          
          console.log(`🔍 [Tiptap.onBlur] Executing blur`);
          setTimeout(() => onBlur?.(), 50);
          return false;
        },
      },
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none",
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
        console.log(`   Image URLs:`, imageUrls);
      }
      console.log(`📝 [Tiptap.onUpdate] Full HTML content:`, htmlContent);
      onChangeContent(htmlContent);
    },
  });

  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log(`\n🎯 [Tiptap.handleImageUpload] CALLBACK TRIGGERED`);
      console.log(`   Event type: ${e.type}`);
      console.log(`   Files available: ${e.target.files?.length || 0}`);
      
      const startTime = Date.now();
      console.log(`\n${'═'.repeat(70)}`);
      console.log(`[Tiptap.handleImageUpload] START | ${new Date().toISOString()}`);
      console.log(`${'═'.repeat(70)}`);

      const file = e.target.files?.[0];

      if (!file) {
        console.error('❌ [Tiptap.handleImageUpload] No file selected');
        console.log(`${'═'.repeat(70)}\n`);
        return;
      }

      console.log(`📄 [Tiptap.handleImageUpload] File validation:`, {
        name: file.name,
        type: file.type,
        sizeBytes: file.size,
        sizeKB: (file.size / 1024).toFixed(2),
        sizeMB: (file.size / 1024 / 1024).toFixed(2),
      });

      if (!editor) {
        console.error('❌ [Tiptap.handleImageUpload] Editor instance not available');
        console.log(`${'═'.repeat(70)}\n`);
        alert('❌ Editor not ready. Please try again.');
        return;
      }
      console.log(`✅ [Tiptap.handleImageUpload] Editor instance validated`);

      const uploadFolderName = projectTitle && projectTitle.trim() !== ''
        ? projectTitle
        : 'untitled';
      console.log(`📁 [Tiptap.handleImageUpload] Folder configuration:`, {
        projectTitleProp: projectTitle || 'undefined',
        finalFolderName: uploadFolderName,
      });

      setIsUploading(true);
      setUploadingProgress('Preparing file...');

      try {
        console.log(`\n📝 [Tiptap.handleImageUpload] FormData created:`, {
          fileName: file.name,
          fileSizeKB: (file.size / 1024).toFixed(2),
          projectTitle: uploadFolderName,
          endpoint: '/api/persional_project/upload',
          method: 'POST',
        });

        setUploadingProgress('Uploading to S3...');
        console.log(`\n📤 [Tiptap.handleImageUpload] BEFORE fetch`);
        const fetchStartTime = Date.now();
        
        const formData = new FormData();
        formData.append('image', file);
        formData.append('projectTitle', uploadFolderName);

        const response = await fetch('/api/persional_project/upload', {
          method: 'POST',
          body: formData,
        });
        const fetchDuration = ((Date.now() - fetchStartTime) / 1000).toFixed(2);

        console.log(`📊 [Tiptap.handleImageUpload] AFTER fetch (${fetchDuration}s):`, {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`❌ [Tiptap.handleImageUpload] HTTP Error ${response.status}:`, {
            status: response.status,
            statusText: response.statusText,
            errorBody: errorText,
          });
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        setUploadingProgress('Processing response...');
        console.log(`📨 [Tiptap.handleImageUpload] Response parsed`);
        const data = await response.json();
        
        console.log(`   Response object:`, {
          isSuccess: data.isSuccess,
          message: data.message,
          hasData: !!data.data,
          dataType: typeof data.data,
        });

        if (!data.isSuccess || !data.data) {
          console.error('❌ [Tiptap.handleImageUpload] Invalid response structure:', {
            isSuccess: data.isSuccess,
            message: data.message,
            data: data.data,
          });
          throw new Error(data.message || 'Server returned invalid response');
        }

        const imageUrl = data.data;
        console.log(`\n🔗 [Tiptap.handleImageUpload] Image URL received:`, {
          url: imageUrl,
          length: imageUrl.length,
          isHttps: imageUrl.startsWith('https'),
        });

        setUploadingProgress('Inserting into editor...');
        console.log(`\n📄 [Tiptap.handleImageUpload] Editor HTML BEFORE insert:`, {
          length: editor.getHTML().length,
          imageCount: (editor.getHTML().match(/<img/g) || []).length,
        });

        console.log(`\n➕ [Tiptap.handleImageUpload] Inserting image into editor...`);
        console.log(`   Insertion config:`, {
          type: 'image',
          attrs: {
            src: imageUrl,
            alt: 'Uploaded image',
          },
        });

        const insertStartTime = Date.now();
        editor
          .chain()
          .focus()
          .insertContent({
            type: 'image',
            attrs: {
              src: imageUrl,
              alt: 'Uploaded image',
              dataUrl: imageUrl,
            },
          })
          .run();
        const insertDuration = ((Date.now() - insertStartTime) / 1000).toFixed(2);
        console.log(`✅ [Tiptap.handleImageUpload] Insert completed (${insertDuration}s)`);

        await new Promise(resolve => setTimeout(resolve, 100));

        const editorHtmlAfter = editor.getHTML();
        console.log(`\n📄 [Tiptap.handleImageUpload] Editor HTML AFTER insert:`, {
          length: editorHtmlAfter.length,
          imageCount: (editorHtmlAfter.match(/<img/g) || []).length,
        });

        const imgSrcRegex = new RegExp(`src=["']${imageUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`);
        if (!imgSrcRegex.test(editorHtmlAfter)) {
          console.warn(`   Warning: Expected image URL not found in editor HTML after insert`);
          console.warn(`   Editor state: ${JSON.stringify(editor.getAttributes('image'))}`);
        } else {
          console.log('✅ [Tiptap.handleImageUpload] Image tag successfully inserted');
          const imgTagMatches = editorHtmlAfter.match(/<img[^>]*>/g);
          if (imgTagMatches) {
            imgTagMatches.forEach((tag, idx) => {
              console.log(`   Image tag ${idx + 1}: ${tag}`);
            });
          }
        }

        console.log(`\n${'═'.repeat(70)}`);
        console.log(`[Tiptap.handleImageUpload] SUCCESS ✅`);
        console.log(`${'═'.repeat(70)}`);
        setUploadingProgress('');
      } catch (error) {
        console.error('❌ [Tiptap.handleImageUpload] EXCEPTION:', error);
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        console.log(`💥 [Tiptap.handleImageUpload] Error details:`, {
          message: errorMsg,
          type: error instanceof Error ? error.name : typeof error,
        });
        console.log(`${'═'.repeat(70)}`);
        console.log(`[Tiptap.handleImageUpload] FAILED ❌`);
        console.log(`${'═'.repeat(70)}`);
        alert(`Failed to upload image: ${errorMsg}`);
        setUploadingProgress('');
      } finally {
        console.log(`\n🔌 [Tiptap.handleImageUpload] Finally block: cleanup`);
        setIsUploading(false);
        console.log(`   isUploading = false`);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
          console.log(`   File input reset via ref`);
        }
        const totalDuration = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(`   Total duration: ${totalDuration}s`);
        
        setTimeout(() => {
          if (editor && editor.view) {
            console.log(`   Restoring focus to editor...`);
            editor.view.focus();
            console.log(`   ✅ Focus restored`);
          }
        }, 50);
      }
    },
    [editor, projectTitle]
  );

  useEffect(() => {
    if (isBorder && editor) {
      editor.setOptions({ editable: true });
    } else if (!isBorder && editor) {
      editor.setOptions({ editable: false });
    }
  }, [isBorder, editor]);

  useEffect(() => {
    if (editor && content && editor.getHTML() !== content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const CheckForBoldWhenActive = (item: any) => {
    if (item.content) {
      const tag = item.content;
      const regexBold = /<strong>(.*)?<\/strong>/;
      return regexBold.test(tag);
    }
    return false;
  };

  if (!editor) {
    return null;
  }

  const isSelected = (format: "bold" | "italic" | "underline") => {
    return editor.isActive(format) ? true : false;
  };

  const OptionButton = (
    nameActive: "bold" | "italic" | "underline",
    children: React.ReactNode,
  ) => (
    <button
      onClick={() => {
        if (nameActive === "bold") {
          editor.chain().focus().toggleBold().run();
        } else if (nameActive === "italic") {
          editor.chain().focus().toggleItalic().run();
        } else if (nameActive === "underline") {
          editor.chain().focus().toggleUnderline().run();
        }
      }}
      className={`px-3 py-1.5 border rounded-lg transition-colors ${
        isSelected(nameActive)
          ? "bg-blue-100 border-blue-400 dark:bg-blue-900/30 dark:border-blue-500"
          : "border-gray-300 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/30"
      }`}
    >
      {children}
    </button>
  );

  const ButtonColor = (name: string, color: string) => (
    <button
      key={`color-${name}`}
      onClick={() => editor.chain().focus().setColor(color).run()}
      className={`w-6 h-6 rounded-md border-2 transition-all ${
        editor.isActive("textStyle", { color }) ? "border-gray-800 dark:border-white scale-110" : "border-gray-300"
      }`}
      style={{ backgroundColor: color }}
      title={name}
    />
  );

  const setLink = () => {
    const url = prompt("Enter URL");
    if (url) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    }
  };

  return (
    <div
      className={`prose prose-sm sm:prose lg:prose-lg xl:prose-2xl rounded-lg ${
        isBorder
          ? "border-2 border-blue-400 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-500"
          : "border-none"
      }`}
    >
      {isActive && (
        <div className="sticky top-0 z-10 flex flex-wrap gap-2 bg-white dark:bg-slate-900 p-2 rounded-t-lg border-b border-gray-200 dark:border-gray-700">
          {OptionButton("bold", <strong>B</strong>)}
          {OptionButton("italic", <em>I</em>)}
          {OptionButton("underline", <u>U</u>)}

          <div className="h-5 w-px bg-gray-300 dark:bg-gray-600"></div>

          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`px-3 py-1.5 border rounded-lg transition-colors ${
              editor.isActive("bulletList")
                ? "bg-blue-100 border-blue-400 dark:bg-blue-900/30 dark:border-blue-500"
                : "border-gray-300 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/30"
            }`}
          >
            • List
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`px-3 py-1.5 border rounded-lg transition-colors ${
              editor.isActive("orderedList")
                ? "bg-blue-100 border-blue-400 dark:bg-blue-900/30 dark:border-blue-500"
                : "border-gray-300 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/30"
            }`}
          >
            1. List
          </button>

          <div className="h-5 w-px bg-gray-300 dark:bg-gray-600"></div>

          <button
            onClick={() => setLink()}
            className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
            title="Add Link"
          >
            <p className="font-medium">L</p>
          </button>

          <div className="h-5 w-px bg-gray-300 dark:bg-gray-600"></div>

          {/* Image Upload Button with Loading */}
          <button
            className="p-1.5 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            disabled={isUploading}
            title={isUploading ? `Uploading... ${uploadingProgress}` : "Upload Image"}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              console.log(`\n🖱️ [Tiptap.ImageButton] onClick triggered`);
              console.log(`   isUploading: ${isUploading}`);
              console.log(`   fileInputRef.current exists: ${!!fileInputRef.current}`);
              console.log(`   Attempting to click file input...`);
              
              if (fileInputRef.current) {
                console.log(`   ✅ Calling fileInputRef.current.click()`);
                fileInputRef.current.click();
                console.log(`   ✅ click() method executed`);
              } else {
                console.error(`   ❌ fileInputRef.current is NULL - cannot click!`);
              }
            }}
          >
            <label className="cursor-pointer inline-flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-5 h-5">
                <path d="M.5 1a.5.5 0 0 0-.5.5v12a.5.5 0 0 0 .5.5h15a.5.5 0 0 0 .5-.5v-12a.5.5 0 0 0-.5-.5H.5ZM1 12.5v-11h14v11H1Z" />
                <path d="M1 2a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2Z" />
                <path d="M1 13a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2l-3.86-3.86a1 1 0 0 0-1.41 0L7 9.67l-2.22-2.22a1 1 0 0 0-1.41 0L1 10.33v2.67Z" />
                <circle cx="12.5" cy="4.5" r="1.5" />
              </svg>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                ref={fileInputRef}
              />
            </label>
            {isUploading && <span className="text-sm text-amber-600 dark:text-amber-400">{uploadingProgress}</span>}
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

      {showColor && (
        <div className="flex flex-wrap gap-2 p-2 bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700">
          {ButtonColor("Red", "#FF0000")}
          {ButtonColor("Green", "#00FF00")}
          {ButtonColor("Blue", "#0000FF")}
          {ButtonColor("Black", "#000000")}
          {ButtonColor("Gray", "#888888")}
        </div>
      )}

      <EditorContent editor={editor} />
    </div>
  );
};

// Add useEffect import
import { useEffect } from "react";

export default Tiptap;
