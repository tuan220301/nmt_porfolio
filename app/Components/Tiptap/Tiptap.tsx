"use client";
import React, { useState, useCallback, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import Underline from "@tiptap/extension-underline";
import Color from "@tiptap/extension-color";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextStyle from "@tiptap/extension-text-style";
import Placeholder from "@tiptap/extension-placeholder";
import { AnimatePresence, motion } from "framer-motion";

import "./style.css";
import { BaseHeadingCus } from "./BaseHeadingCus";
import CustomImage from "./ImageExtension";

type TiptapProps = {
  onChangeContent: (content: string) => void;
  content: string;
  isBorder?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  isActive?: boolean;
  projectTitle?: string;
};

const Tiptap = ({
  onChangeContent,
  content,
  isBorder = false,
  onFocus,
  onBlur,
  isActive = false,
  projectTitle,
}: TiptapProps) => {
  const [showColor, setShowColor] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingProgress, setUploadingProgress] = useState<string>("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Debug props on every render
  console.log(`\n📋 [Tiptap.render] Component rendered with props:`, {
    isBorder,
    isActive,
    projectTitle: projectTitle || "NOT PROVIDED",
    projectTitleType: typeof projectTitle,
    projectTitleExists: !!projectTitle,
    projectTitleLength: projectTitle?.length || 0,
    editorReady: !!useEditor ? "yes" : "no",
  });

  const editor = useEditor({
    editable: isBorder,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: "list-disc",
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: "list-decimal",
        },
      }),
      Underline.configure(),
      Image.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg",
        },
      }),
      Link.configure({
        openOnClick: true,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
      Color.configure({
        types: ["textStyle"],
      }),
      TextStyle.configure(),
      CustomImage,
      Placeholder.configure({
        placeholder: "Press / to see available commands",
      }),
    ],
    editorProps: {
      handleDOMEvents: {
        focus: () => {
          onFocus?.();
          return false;
        },
        blur: (view) => {
          // Don't blur if image upload is in progress
          if (isUploading) {
            console.log(`🛑 [Tiptap.blur] Prevented blur during upload`);
            return true; // IMPORTANT: return true to stop propagation
          }

          // Check if blur was caused by clicking file input button
          const activeElement = document.activeElement;
          if (
            activeElement?.tagName === "INPUT" &&
            (activeElement as HTMLInputElement).type === "file"
          ) {
            console.log(`🛑 [Tiptap.blur] File input focused - preventing blur`);
            return true; // IMPORTANT: return true to stop and prevent blur
          }

          onBlur?.();
          return false;
        },
      },
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none dark:prose-invert",
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

      console.log(`\n📝 [Tiptap.onUpdate] Content changed. HTML length: ${htmlContent.length}`);
      console.log(`📝 [Tiptap.onUpdate] Images detected: ${imageUrls.length}`);
      if (imageUrls.length > 0) {
        console.log(`   📸 Image URLs:`, imageUrls);
      }
      console.log(`   Preview: ${htmlContent.substring(0, 100)}...`);
      console.log(`📝 [Tiptap.onUpdate] Calling parent onChangeContent callback\n`);
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
      console.log(`\n${"═".repeat(70)}`);
      console.log(`🎯 [Tiptap.handleImageUpload] IMAGE UPLOAD STARTED`);
      console.log(`${"═".repeat(70)}`);
      console.log(`📸 [Tiptap.handleImageUpload] File details:`, {
        name: file.name,
        size: (file.size / 1024).toFixed(2) + " KB",
        type: file.type,
        lastModified: new Date(file.lastModified).toISOString(),
      });

      console.log(`📋 [Tiptap.handleImageUpload] Context:`, {
        projectTitle: projectTitle || "NOT PROVIDED",
        projectTitleExists: !!projectTitle,
        projectTitleIsString: typeof projectTitle === 'string',
        projectTitleLength: projectTitle?.length || 0,
        editorExists: !!editor,
        isUploading,
      });

      // Validate and prepare projectTitle - use fallback if empty
      const finalProjectTitle = (projectTitle && projectTitle.trim() !== '')
        ? projectTitle.trim()
        : 'Untitled';

      if (!projectTitle || projectTitle.trim() === '') {
        console.warn(`⚠️ [Tiptap.handleImageUpload] WARNING: projectTitle is empty - using fallback "${finalProjectTitle}"`);
      } else {
        console.log(`✅ [Tiptap.handleImageUpload] projectTitle is valid: "${finalProjectTitle}"`);
      }

      setIsUploading(true);
      setUploadingProgress("Uploading...");

      try {
        const formData = new FormData();
        formData.append("image", file);
        // Always append project title for S3 folder organization (uses fallback if empty)
        formData.append("projectTitle", finalProjectTitle);
        console.log(`   ✅ Added projectTitle to FormData: "${finalProjectTitle}"`);

        console.log(`📤 [Tiptap.handleImageUpload] Sending to /api/persional_project/upload`);
        console.log(`   FormData contents:`, {
          hasImage: formData.has("image"),
          imageFileName: (formData.get("image") as File)?.name || "N/A",
          hasProjectTitle: formData.has("projectTitle"),
          projectTitleValue: formData.get("projectTitle") || "NOT SET",
          allKeys: Array.from(formData.keys()),
        });
        const uploadStartTime = Date.now();

        const response = await fetch("/api/persional_project/upload", {
          method: "POST",
          body: formData,
        });

        const uploadDuration = ((Date.now() - uploadStartTime) / 1000).toFixed(
          2
        );

        console.log(
          `📊 [Tiptap.handleImageUpload] Response received (${uploadDuration}s):`,
          {
            status: response.status,
            ok: response.ok,
            statusText: response.statusText,
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error(
            `❌ [Tiptap.handleImageUpload] HTTP Error:`,
            errorData
          );
          throw new Error(
            errorData.message || `Upload failed with status ${response.status}`
          );
        }

        const data = await response.json();
        console.log(`✅ [Tiptap.handleImageUpload] API Response:`, {
          isSuccess: data.isSuccess,
          message: data.message,
          hasData: !!data.data,
          imageUrl: data.data?.substring(0, 80),
        });

        if (!data.isSuccess || !data.data) {
          throw new Error(data.message || "Upload unsuccessful");
        }

        const imageUrl = data.data;
        console.log(`✅ [Tiptap.handleImageUpload] Image URL received:`, imageUrl);

        console.log(`📝 [Tiptap.handleImageUpload] Inserting image into editor`);
        if (editor) {
          editor.chain().focus().setImage({ src: imageUrl }).run();
          console.log(`✅ [Tiptap.handleImageUpload] Image inserted into Tiptap editor`);
        } else {
          console.error(
            `❌ [Tiptap.handleImageUpload] Editor instance not available`
          );
        }

        console.log(`${"═".repeat(70)}`);
        console.log(`✅ [Tiptap.handleImageUpload] UPLOAD COMPLETE`);
        console.log(`${"═".repeat(70)}\n`);

        setUploadingProgress("Done");
        setTimeout(() => {
          setIsUploading(false);
          setUploadingProgress("");
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }, 800);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Upload failed";
        console.error(`❌ [Tiptap.handleImageUpload] Error:`, error);
        console.log(`${"═".repeat(70)}\n`);
        setIsUploading(false);
        setUploadingProgress("");
        alert(`Image upload failed: ${message}`);
      }
    },
    [editor, projectTitle, isUploading]
  );

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(isBorder);
  }, [isBorder, editor]);

  useEffect(() => {
    if (!editor) return;

    // Only update if content actually changed to avoid unnecessary re-renders
    const currentContent = editor.getHTML();
    if (content && content !== currentContent && content !== "<p></p>") {
      editor.commands.setContent(content, false);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  // Format button handler
  const toggleFormat = (format: "bold" | "italic" | "underline") => {
    if (format === "bold") {
      editor.chain().focus().toggleBold().run();
    } else if (format === "italic") {
      editor.chain().focus().toggleItalic().run();
    } else if (format === "underline") {
      editor.chain().focus().toggleUnderline().run();
    }
  };

  // Check if format is active
  const isFormatActive = (format: "bold" | "italic" | "underline") => {
    return editor.isActive(format);
  };

  // Format button component
  const FormatButton = (
    format: "bold" | "italic" | "underline",
    icon: string,
    label: string
  ) => {
    const active = isFormatActive(format);
    return (
      <button
        className={`px-3 py-1.5 text-sm border rounded-lg font-medium transition-all ${active
          ? "bg-blue-100 dark:bg-blue-900/40 border-blue-400 dark:border-blue-600 text-blue-700 dark:text-blue-300"
          : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        onClick={() => toggleFormat(format)}
        title={label}
      >
        {icon}
      </button>
    );
  };

  // Color button component
  const ColorButton = (name: string, color: string) => {
    const active = editor.isActive("textStyle", { color: color });
    return (
      <button
        onClick={() => editor.chain().focus().setColor(color).run()}
        className={`w-6 h-6 rounded-full border-2 transition-all hover:scale-110 ${active
          ? "border-gray-800 dark:border-gray-200 ring-2 ring-offset-2 dark:ring-offset-gray-800 ring-gray-400 dark:ring-gray-600"
          : "border-gray-300 dark:border-gray-600 hover:border-gray-500"
          }`}
        style={{ backgroundColor: color }}
        title={name}
      />
    );
  };

  // Set link handler
  const handleSetLink = () => {
    const previousUrl = editor.getAttributes("link").href || "";
    const url = window.prompt("Enter URL", previousUrl);

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  // Toggle bullet list
  const toggleBulletList = () => {
    editor.chain().focus().toggleBulletList().run();
  };

  // Toggle ordered list
  const toggleOrderedList = () => {
    editor.chain().focus().toggleOrderedList().run();
  };

  // Toggle heading
  const toggleHeading = (level: 1 | 2 | 3) => {
    editor.chain().focus().toggleHeading({ level }).run();
  };

  // Check if list is active
  const isBulletListActive = editor.isActive("bulletList");
  const isOrderedListActive = editor.isActive("orderedList");
  const isHeadingActive = (level: 1 | 2 | 3) => editor.isActive("heading", { level });

  return (
    <div className="p-3 space-y-3">
      {/* Toolbar - show when editor is active/focused or when in edit mode (isBorder) */}
      {(isActive || isBorder) && (
        <div className="flex items-center gap-1.5 px-2 py-2 bg-gray-50 dark:bg-black rounded-lg border border-gray-200 dark:border-gray-800 flex-wrap">
          {/* Text Formatting Group */}
          <div className="flex items-center gap-1 pr-2 border-r border-gray-300 dark:border-gray-700">
            {FormatButton("bold", "B", "Bold")}
            {FormatButton("italic", "I", "Italic")}
            {FormatButton("underline", "U", "Underline")}
          </div>

          {/* Heading & List Group */}
          <div className="flex items-center gap-1 px-2 border-r border-gray-300 dark:border-gray-700">
            {/* H1 Button */}
            <button
              className={`px-3 py-1.5 text-sm border rounded-lg font-medium transition-all ${isHeadingActive(1)
                ? "bg-blue-100 dark:bg-blue-900/40 border-blue-400 dark:border-blue-600 text-blue-700 dark:text-blue-300"
                : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              onClick={() => toggleHeading(1)}
              title="Heading 1"
            >
              H1
            </button>
            {/* H2 Button */}
            <button
              className={`px-3 py-1.5 text-sm border rounded-lg font-medium transition-all ${isHeadingActive(2)
                ? "bg-blue-100 dark:bg-blue-900/40 border-blue-400 dark:border-blue-600 text-blue-700 dark:text-blue-300"
                : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              onClick={() => toggleHeading(2)}
              title="Heading 2"
            >
              H2
            </button>
            {/* H3 Button */}
            <button
              className={`px-3 py-1.5 text-sm border rounded-lg font-medium transition-all ${isHeadingActive(3)
                ? "bg-blue-100 dark:bg-blue-900/40 border-blue-400 dark:border-blue-600 text-blue-700 dark:text-blue-300"
                : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              onClick={() => toggleHeading(3)}
              title="Heading 3"
            >
              H3
            </button>
            {/* Bullet List Button */}
            <button
              className={`px-3 py-1.5 text-sm border rounded-lg font-medium transition-all ${isBulletListActive
                ? "bg-blue-100 dark:bg-blue-900/40 border-blue-400 dark:border-blue-600 text-blue-700 dark:text-blue-300"
                : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              onClick={toggleBulletList}
              title="Bullet List"
            >
              •
            </button>
            {/* Ordered List Button */}
            <button
              className={`px-3 py-1.5 text-sm border rounded-lg font-medium transition-all ${isOrderedListActive
                ? "bg-blue-100 dark:bg-blue-900/40 border-blue-400 dark:border-blue-600 text-blue-700 dark:text-blue-300"
                : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              onClick={toggleOrderedList}
              title="Ordered List"
            >
              1.
            </button>
          </div>

          {/* Link Button */}
          <button
            onClick={handleSetLink}
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
            title={
              isUploading
                ? `Uploading... ${uploadingProgress}`
                : "Upload Image"
            }
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              console.log(`\n🖱️ [Tiptap.ImageButton] onClick triggered`);
              console.log(`   Timestamp: ${new Date().toISOString()}`);
              console.log(`   Button state:`, {
                isUploading,
                uploadingProgress,
                fileInputRefExists: !!fileInputRef.current,
                projectTitle: projectTitle || "NOT PROVIDED",
                editorExists: !!editor,
                isBorder,
                isActive,
              });

              if (!isUploading && fileInputRef.current) {
                console.log(`   ✅ Calling fileInputRef.current.click()`);
                fileInputRef.current.click();
                console.log(`   ✅ File picker should open now`);
              } else if (isUploading) {
                console.warn(
                  `   ⚠️ Cannot upload - already uploading. Wait for current upload to complete.`
                );
              } else {
                console.error(
                  `   ❌ fileInputRef.current is NULL - file input element not found!`
                );
              }
            }}
          >
            <label className="cursor-pointer inline-flex items-center justify-center pointer-events-none">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                tabIndex={-1}
                ref={fileInputRef}
              />
              {isUploading ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5 animate-spin"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                  <span className="text-xs font-medium">
                    {uploadingProgress || "Uploading..."}
                  </span>
                </>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M1 2a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2Z" />
                  <path d="M1 13a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2l-3.86-3.86a1 1 0 0 0-1.41 0L7 9.67l-2.22-2.22a1 1 0 0 0-1.41 0L1 10.33v2.67Z" />
                  <circle cx="12.5" cy="4.5" r="1.5" />
                </svg>
              )}
            </label>
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
              {ColorButton("Red", "#F98181")}
              {ColorButton("Yellow", "#FAF594")}
              {ColorButton("Orange", "#FBBC88")}
              {ColorButton("Purple", "#958DF1")}
            </div>

            {/* Divider */}
            <div className="h-5 w-px bg-gray-300 dark:bg-gray-600"></div>

            {/* Close Button */}
            <button
              onClick={() => setShowColor(false)}
              className="ml-auto p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              title="Close color picker"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="size-4"
              >
                <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
              </svg>
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Editor Content */}
      <div
        className={`rounded-lg mt-3 p-4 overflow-visible transition-all ${isBorder ? "border-2 border-blue-400 dark:border-blue-600" : ""
          }`}
      >
        <EditorContent
          editor={editor}
          className="prose prose-sm dark:prose-invert max-w-none prose-ul:list-disc prose-ol:list-decimal prose-ul:pl-6 prose-ol:pl-6"
        />
      </div>
    </div>
  );
};

export default Tiptap;
