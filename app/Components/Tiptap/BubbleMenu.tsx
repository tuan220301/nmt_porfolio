import { useEffect, useState } from "react";
import { BubbleMenuProps, SelectionMenuType } from "./type";
import { BubbleMenu as BubbleMenuReact } from "@tiptap/react";
import SelectionMenu from "./SelectionMenu";
export const BubbleMenu = ({ editor, containerRef }: BubbleMenuProps) => {
  const [selectionType, setSelectionType] = useState<SelectionMenuType>(null);
  useEffect(() => {
    if (selectionType !== "link") setSelectionType(null);
  }, [selectionType]);
  if (!editor || !containerRef.current) return null;
  return (
    <BubbleMenuReact
      pluginKey="bubbleMenu"
      editor={editor}
      className="bg-white dark:bg-gray-800 shadow-lg rounded-lg flex space-x-2 p-2 border border-gray-200 dark:border-gray-700"
      tippyOptions={{
        appendTo: containerRef.current,
      }}
    >
      <SelectionMenu
        editor={editor}
        selectionType={selectionType}
        setSelectionType={setSelectionType}
      />
    </BubbleMenuReact>
  );
};

