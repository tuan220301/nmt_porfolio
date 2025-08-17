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
import React, { useEffect, useState } from "react";
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
};

const Tiptap = ({ onChangeContent, content, isBorder }: TipTapPropsType) => {
  const [showColor, setShowColor] = useState(false);

  const editor = useEditor({
    editable: false,
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
        openOnClick: true, // click sẽ mở link
        autolink: true,
        HTMLAttributes: {
          class: "text-blue-500 underline", // style mặc định
        },
      }),
    ],
    editorProps: {
      handleDOMEvents: {
        keydown: (_, v) => enableKeyboardNavigation(v),
      },
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none",
      },
      handleDrop(view, event, slice, moved) {
        if (!event.dataTransfer?.files.length) return false;

        const file = event.dataTransfer.files[0];

        if (file.type.startsWith("image/")) {
          event.preventDefault();

          const reader = new FileReader();
          reader.onload = () => {
            const src = reader.result as string;

            editor
              ?.chain()
              .focus()
              .insertContent({
                type: "customImage",
                attrs: { src },
              })
              .run();
          };
          reader.readAsDataURL(file);

          return true;
        }
        return false;
      },
    },
    content: content,
    onUpdate: ({ editor }) => {
      onChangeContent(editor.getHTML()); // Cập nhật state bên ngoài khi thay đổi nội dung
    },
  });
  useEffect(() => {
    if (isBorder) {
      editor?.setEditable(true);
    } else {
      editor?.setEditable(false);
    }
  }, [isBorder]);
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content); // Cập nhật content khi có dữ liệu từ API
    }
  }, [content, editor]);

  const CheckForBoldWhenActive = (item: any) => {
    const isActive =
      (item.title === "Bold" && editor?.isActive("bold")) ||
      (item.title === "Italic" && editor?.isActive("italic")) ||
      (item.title === "Underline" && editor?.isActive("underline"));

    return (
      <p className={`hover:font-bold ${isActive ? "italic" : ""}`}>
        {item.title}
      </p>
    );
  };
  if (!editor) {
    return null;
  }

  const isSelected = (format: "bold" | "italic" | "underline") => {
    if (editor) {
      editor.chain().focus();
      if (editor.isActive(format)) {
        // Nếu đang được chọn thì bỏ định dạng
        editor.chain().unsetMark(format).run();
      } else {
        // Nếu chưa được chọn thì áp dụng định dạng
        editor.chain().setMark(format).run();
      }
    }
  };

  const OptionButton = (
    nameActive: "bold" | "italic" | "underline",
    children: React.ReactNode,
  ) => {
    let checkStyle = "";
    switch (nameActive) {
      case "bold":
        checkStyle = "font-bold text-lg";
        break;
      case "italic":
        checkStyle = "italic text-lg";
        break;
      case "underline":
        checkStyle = "underline text-lg";
        break;
      default:
        break;
    }
    return (
      <button
        className={`border rounded-xl h-8 w-10`}
        onClick={() => isSelected(nameActive)}
      >
        <div
          className={`text-center ${editor.isActive(nameActive) ? checkStyle : ""}`}
        >
          {children}
        </div>
      </button>
    );
  };
  const ButtonColor = (name: string, color: string) => {
    return (
      <button
        onClick={() => editor.chain().focus().setColor(color).run()}
        className={`hover:font-bold ${editor.isActive("textStyle", { color: color }) ? `underline` : ""}`}
        data-testid="setRed"
      >
        {name}
      </button>
    );
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL", previousUrl);

    // Nếu không nhập gì thì bỏ link
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    // Nếu có url thì set link
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="p-2">
      <SlashCmdProvider>
        <div className="flex items-center gap-2">
          {OptionButton("underline", <p>U</p>)}
          {OptionButton("bold", <p>B</p>)}
          {OptionButton("italic", <p>I</p>)}
          <button onClick={setLink} className="border rounded-xl h-8 w-10">
            <p>L</p>
          </button>
          <div className="flex items-center justify-center">
            <AnimatePresence initial={false}>
              {showColor ? (
                <motion.div
                  initial={{ opacity: 0, x: 0 }} // Bắt đầu từ ngoài màn hình bên trái
                  animate={{ opacity: 1, x: 145 }} // Di chuyển vào vị trí gốc
                  exit={{ opacity: 0, x: 0 }} // Di chuyển ra bên phải khi ẩn
                  key="box"
                  transition={{ duration: 0.5 }}
                  className="border rounded-xl w-auto h-8 absolute flex items-center"
                >
                  <div className="flex flex-row px-2 items-center gap-2">
                    {ButtonColor("Red", "#F98181")}
                    {ButtonColor("Yellow", "#FAF594")}
                    {ButtonColor("Orange", "#FBBC88")}
                    {ButtonColor("Purple", "#958DF1")}
                    <button
                      onClick={() => editor.chain().focus().unsetColor().run()}
                      data-testid="unsetColor"
                    >
                      Unset
                    </button>
                    <button onClick={() => setShowColor(!showColor)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="size-4"
                      >
                        <path
                          fillRule="evenodd"
                          d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8Zm10.25.75a.75.75 0 0 0 0-1.5H6.56l1.22-1.22a.75.75 0 0 0-1.06-1.06l-2.5 2.5a.75.75 0 0 0 0 1.06l2.5 2.5a.75.75 0 1 0 1.06-1.06L6.56 8.75h4.69Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
            <AnimatePresence initial={false}>
              {!showColor ? (
                <motion.div
                  initial={{ opacity: 0, x: 180 }} // Bắt đầu từ ngoài màn hình bên trái
                  animate={{ opacity: 1, x: 40 }} // Di chuyển vào vị trí gốc
                  exit={{ opacity: 0, x: -10 }} // Di chuyển ra bên phải khi ẩn
                  key="box2"
                  transition={{ duration: 0.5 }}
                  className="border rounded-xl w-auto px-2 h-8 absolute flex items-center"
                >
                  <button onClick={() => setShowColor(!showColor)}>
                    <div className="flex items-center justify-center gap-2">
                      <div>Color</div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="size-4"
                      >
                        <path
                          fillRule="evenodd"
                          d="M15 8A7 7 0 1 0 1 8a7 7 0 0 0 14 0ZM4.75 7.25a.75.75 0 0 0 0 1.5h4.69L8.22 9.97a.75.75 0 1 0 1.06 1.06l2.5-2.5a.75.75 0 0 0 0-1.06l-2.5-2.5a.75.75 0 0 0-1.06 1.06l1.22 1.22H4.75Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </button>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
        <div className={`${isBorder ? "border" : ""} rounded-xl mt-2`}>
          <EditorContent editor={editor} className="m-2" marginHeight={40} />
        </div>
        <SlashCmd.Root editor={editor}>
          <SlashCmd.Cmd>
            <SlashCmd.Empty>No commands available</SlashCmd.Empty>
            <SlashCmd.List className="border rounded-xl px-2 bg-neutral-100 dark:bg-neutral-950/30 backdrop-blur-md">
              {SuggestionsTipTap.map((item) => {
                return (
                  <SlashCmd.Item
                    value={item.title}
                    onCommand={(val) => {
                      item.command(val);
                    }}
                    key={item.title}
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
