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
  Slash,
} from "@harshtalks/slash-tiptap";

import "./style.css";
import { SuggestionsTipTap } from "./suggestions_slash_tiptap";
import { BaseHeadingCus } from "./BaseHeadingCus";
import CustomImage from "./ImageExtension";
import { AnimatePresence, motion } from "framer-motion";
import LinkExtension from "@tiptap/extension-link";

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
      Slash.configure({
        suggestion: {
          items: () => SuggestionsTipTap,
        },
      }),
      Placeholder.configure({
        placeholder: "Press / to see available commands",
      }),
      LinkExtension.configure({
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
            console.log(`🔍 [Tiptap.onBlur] Blur prevented - file input focused`);
            return true;
          }
          
          console.log(`🔍 [Tiptap.onBlur] Blur allowed`);
          onBlur?.();
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
        console.log(`   Image URLs:`, imageUrls.map(url => url.substring(0, 80) + '...'));
      }
      onChangeContent(htmlContent);
    },
  });

  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log(`\n🎯 [Tiptap.handleImageUpload] CALLBACK TRIGGERED - this function was called!`);
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

      console.log(`📁 [Tiptap.handleImageUpload] Project title received:`, {
        projectTitleProp: projectTitle || 'undefined',
        note: 'Direct upload to S3 (bypassing folder structure per Bugs.md)',
      });

      setIsUploading(true);
      setUploadingProgress('Preparing file...');

      try {
        const formData = new FormData();
        formData.append('image', file);

        console.log(`\n📝 [Tiptap.handleImageUpload] FormData created:`, {
          fileName: file.name,
          fileSizeKB: (file.size / 1024).toFixed(2),
          endpoint: '/api/persional_project/upload',
          method: 'POST',
          note: 'No projectTitle sent - direct S3 upload',
        });

        setUploadingProgress('Uploading to S3...');
        console.log(`\n📤 [Tiptap.handleImageUpload] BEFORE fetch`);
        const fetchStartTime = Date.now();
        
        const response = await fetch('/api/persional_project/upload', {
          method: 'POST',
          body: formData,
        });
        const fetchDuration = ((Date.now() - fetchStartTime) / 1000).toFixed(2);

        console.log(`📊 [Tiptap.handleImageUpload] AFTER fetch (${fetchDuration}s):`, {
          status: response.status,
          statusText: response.statusText,
          contentType: response.headers.get('content-type'),
          ok: response.ok,
        });

        setUploadingProgress('Processing response...');
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`❌ [Tiptap.handleImageUpload] HTTP Error ${response.status}:`, {
            status: response.status,
            statusText: response.statusText,
            body: errorText,
          });
          
          try {
            const errorData = JSON.parse(errorText);
            throw new Error(`Upload failed: ${response.status} - ${errorData?.message || response.statusText}`);
          } catch {
            throw new Error(`Upload failed with status ${response.status}. Response: ${errorText}`);
          }
        }

        const data = await response.json();
        console.log(`📨 [Tiptap.handleImageUpload] Response parsed:`, {
          isSuccess: data.isSuccess,
          message: data.message,
          dataExists: !!data.data,
          dataType: typeof data.data,
        });

        if (!data.data || !data.isSuccess) {
          console.error('❌ [Tiptap.handleImageUpload] Invalid response structure:', {
            isSuccess: data.isSuccess,
            hasData: !!data.data,
            message: data.message,
          });
          throw new Error(data.message || 'Upload returned invalid response');
        }

        const imageUrl = data.data;
        console.log(`🔗 [Tiptap.handleImageUpload] Image URL received:`, {
          url: imageUrl,
          length: imageUrl.length,
          isHttps: imageUrl.startsWith('https'),
          domain: new URL(imageUrl).hostname,
        });

        setUploadingProgress('Inserting into editor...');
        const editorHtmlBefore = editor.getHTML();
        console.log(`\n📄 [Tiptap.handleImageUpload] Editor HTML BEFORE insert:`, {
          length: editorHtmlBefore.length,
          content: editorHtmlBefore.substring(0, 200),
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
        console.log(`\n📄 [Tiptap.handleImageUpload] Editor HTML AFTER insert (after 100ms delay):`, {
          length: editorHtmlAfter.length,
          fullContent: editorHtmlAfter,
        });

        const hasImage = editorHtmlAfter.includes('<img');
        const imgCount = (editorHtmlAfter.match(/<img/g) || []).length;
        console.log(`🔍 [Tiptap.handleImageUpload] Image verification:`, {
          htmlContainsImg: hasImage,
          imageCountInHtml: imgCount,
          htmlContainsSrc: editorHtmlAfter.includes(`src="${imageUrl}"`),
          imageUrl: imageUrl,
        });

        if (!hasImage) {
          console.warn('⚠️ [Tiptap.handleImageUpload] WARNING: No <img> tag found in editor HTML after insert!');
          console.warn('   Expected <img> tag but editor HTML does not contain it');
          console.warn('   This indicates the insertContent() call did not work as expected');
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
    if (!editor || content === editor.getHTML()) return;
    editor.commands.setContent(content);
  }, [content, editor]);

  const CheckForBoldWhenActive = (item: any) => {
    if (item.isActive("bold")) {
      return true;
    } else {
      return false;
    }
  };

  if (!editor) {
    return null;
  }

  const isSelected = (format: "bold" | "italic" | "underline") => {
    if (format === "bold") {
      return editor.isActive("bold");
    }
    if (format === "italic") {
      return editor.isActive("italic");
    }
    if (format === "underline") {
      return editor.isActive("underline");
    }
  };

  const OptionButton = (
    nameActive: "bold" | "italic" | "underline",
    children: React.ReactNode,
  ) => {
    return (
      <button
        onClick={() => {
          if (nameActive === "bold") {
            editor.chain().focus().toggleBold().run();
          }
          if (nameActive === "italic") {
            editor.chain().focus().toggleItalic().run();
          }
          if (nameActive === "underline") {
            editor.chain().focus().toggleUnderline().run();
          }
        }}
        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
          isSelected(nameActive)
            ? "bg-blue-500 text-white border-blue-500"
            : "border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
        }`}
      >
        {children}
      </button>
    );
  };

  const ButtonColor = (name: string, color: string) => {
    return (
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
  };

  const setLink = () => {
    const url = window.prompt('URL');
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  };

  return (
    <div className="p-3 space-y-3">
      {/* Toolbar - only show when editor is focused/active */}
      {isActive && (
        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg border border-gray-300 dark:border-gray-600 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Text Formatting */}
            {OptionButton("bold", <p className="text-sm font-bold">B</p>)}
            {OptionButton("italic", <p className="text-sm italic">I</p>)}
            {OptionButton("underline", <p className="text-sm underline">U</p>)}

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
              className="p-1.5 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={isUploading}
              title={isUploading ? `Uploading... ${uploadingProgress}` : "Upload Image"}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                console.log(`\n🖱️ [Tiptap.ImageButton] onClick triggered`);
                console.log(`   Button state:`, {
                  isUploading,
                  uploadingProgress,
                  fileInputRefExists: !!fileInputRef.current,
                });
                
                if (!isUploading && fileInputRef.current) {
                  console.log(`   ✅ Calling fileInputRef.current.click()`);
                  fileInputRef.current.click();
                  console.log(`   ✅ File picker should open now`);
                } else if (isUploading) {
                  console.warn(`   ⚠️ Cannot upload - already uploading. Wait for current upload to complete.`);
                } else {
                  console.error(`   ❌ fileInputRef.current is NULL - file input element not found!`);
                }
              }}
            >
              <label className="cursor-pointer inline-flex items-center justify-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  ref={fileInputRef}
                />
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-5 h-5">
                  <path d="M.5 1a.5.5 0 0 0-.5.5v12a.5.5 0 0 0 .5.5h15a.5.5 0 0 0 .5-.5v-12a.5.5 0 0 0-.5-.5H.5ZM1 12.5v-11h14v11H1Z" />
                  <path d="M1 2a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2Z" />
                </svg>
              </label>
            </button>

            {isUploading && <span className="text-xs font-medium text-amber-600 dark:text-amber-400">{uploadingProgress}</span>}

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
                </motion.button>
              ) : null}
            </AnimatePresence>
          </div>

          {/* Color Picker */}
          <AnimatePresence initial={false}>
            {showColor && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-wrap gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded"
              >
                {ButtonColor("Red", "#FF0000")}
                {ButtonColor("Green", "#00FF00")}
                {ButtonColor("Blue", "#0000FF")}
                {ButtonColor("Black", "#000000")}
                {ButtonColor("Gray", "#888888")}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Editor Content */}
      <EditorContent editor={editor} />
    </div>
  );
};

export default Tiptap;
