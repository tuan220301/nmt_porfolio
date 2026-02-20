# Tiptap Folder - Rich Text Editor

## Overview

Contains a rich text editor implementation using Tiptap (Headless Vue/React rich text editor based on ProseMirror).

## Files and Functions

### Tiptap.tsx

- **Purpose**: Main rich text editor component
- **Features**:
  - WYSIWYG editor for project content
  - Formatting: Bold, Italic, Underline
  - Lists: Bullet and ordered lists
  - Text styling and color options
  - Image insertion
  - Slash commands for quick formatting
- **Props**: `content` (string), `onChangeContent` (callback), `isBorder` (boolean)
- **State**: Editor state via useEditor hook
- **Usage**: Project detail page for editing project content

### BubbleMenu.tsx

- **Purpose**: Context menu that appears when text is selected
- **Features**: Quick formatting options for selected text
- **Integration**: Works with main Tiptap editor

### SelectionMenu.tsx

- **Purpose**: Menu for managing selected content
- **Features**: Options for selected text/elements

### ImageExtension.tsx

- **Purpose**: Custom image extension for Tiptap
- **Features**: Adds image insertion capability to editor
- **Handles**: Image URL processing, display

### BaseHeadingCus.ts

- **Purpose**: Custom heading extension
- **Features**: Custom styling for headings

### suggestions_slash_tiptap.tsx

- **Purpose**: Slash command suggestions
- **Features**: Auto-complete suggestions when user types "/"
- **Commands**: Formatting options accessible via slash (e.g., /bold, /heading)

### type.ts

- **Purpose**: TypeScript type definitions for Tiptap components

### style.css

- **Purpose**: Custom Tiptap editor styling
- **Features**:
  - Editor layout styling
  - Menu styling
  - Content formatting styles
  - Responsive adjustments

## Integration

- Integrated in project detail page for creating/editing project descriptions
- Used with slash commands for power-user efficiency
- Supports rich formatting needed for portfolio project descriptions

## Dependencies

- @tiptap/react - React components
- @tiptap/extension-* - Various Tiptap extensions
- @harshtalks/slash-tiptap - Slash command functionality
- framer-motion - Animations for menus
