import { createSuggestionsItems } from "@harshtalks/slash-tiptap";

export const SuggestionsTipTap = createSuggestionsItems([
  {
    title: "text",
    searchTerms: ["paragraph"],
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleNode("paragraph", "paragraph")
        .run();
    },
  },
  {
    title: "Bullet List",
    searchTerms: ["unordered", "point"],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run();
    },
  },
  {
    title: "Ordered List",
    searchTerms: ["ordered", "point", "numbers"],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run();
    },
  },
  {
    title: "Heading 1",
    searchTerms: ["h1", "title"],
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleHeading({ level: 1 })
        .run();
    },
  },
  {
    title: "Heading 2",
    searchTerms: ["h2", "subtitle"],
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleHeading({ level: 2 })
        .run();
    },
  },
  {
    title: "Heading 3",
    searchTerms: ["h3", "section"],
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleHeading({ level: 3 })
        .run();
    },
  },
]);
