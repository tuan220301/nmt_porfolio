import { Editor } from "@tiptap/react";
import { RefObject } from "react";

export type SelectionMenuType = "link" | null;
export interface BubbleMenuProps {
  editor: Editor;
  containerRef: RefObject<HTMLDivElement>;
}

