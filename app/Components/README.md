# Components Folder - Reusable UI Components

## Overview

Contains reusable React components used throughout the application for UI/UX rendering.

## Core UI Components

### ButtonComponent.tsx

- **Purpose**: Standard button component
- **Features**: Generic button for various actions
- **Usage**: Form submissions, action triggers across the app

### ButtonIconComponent.tsx

- **Purpose**: Icon-based button component
- **Features**: Button with icon support
- **Usage**: Icon buttons in project cards, edit/delete actions

### Input.tsx

- **Purpose**: Form input component
- **Features**: Text input field with styling
- **Usage**: Login form, project creation/editing forms

### Dropdown.tsx

- **Purpose**: Dropdown menu container
- **Props**: `children`, `open` (boolean)
- **Features**: Conditional rendering of dropdown menu
- **Usage**: User menu in navbar for logout

### Toast.tsx

- **Purpose**: Toast notification display
- **Props**: `content`, `isOpen`, `isAutoHide`, `status`
- **Features**: Auto-hide notifications, different status colors (INFO/SUCCESS/ERROR)
- **Usage**: Feedback for all user actions

### Loading.tsx

- **Purpose**: Loading spinner
- **Features**: General loading indicator
- **Usage**: Displayed during async operations

### LoadingModal.tsx

- **Purpose**: Loading modal with overlay
- **Features**: Fullscreen loading indicator
- **Usage**: During heavy operations like batch uploads

### Navbar.tsx

- **Purpose**: Main navigation bar
- **Features**:
  - Links to Home, Work, Contact, Login
  - Theme switcher
  - User dropdown menu (when logged in)
  - Mobile responsive navigation
  - Authentication status check
- **State**: Uses IsMobileAtom, LoggedAtom for conditional rendering

### ThemeSwitcher.tsx

- **Purpose**: Dark/light mode toggle
- **Features**: Theme switcher button
- **Usage**: Navbar theme switching

### PageTransitionEffect.tsx

- **Purpose**: Page transition animations
- **Features**: Animation wrapper for page changes
- **Usage**: Applied in root layout for smooth page transitions

### UploadImage.tsx

- **Purpose**: Image upload and preview component
- **Features**:
  - Drag-drop or click to upload
  - Shows image preview
  - Integrates with image compression
- **Usage**: Project detail page for project thumbnail upload

### Sidebar.tsx

- **Purpose**: Mobile sidebar navigation
- **Features**: Collapsible mobile menu
- **State**: Uses SidebarAtom for open/close state
- **Usage**: Mobile-only navigation drawer

### IntroUI.tsx

- **Purpose**: Welcome/intro section
- **Features**: Introductory content display
- **Usage**: Displayed above main content in layout

## Sub-folders

### Modals/

- **DeleteModal.tsx**: Confirmation modal for delete operations

### Tiptap/

- Rich text editor components and extensions (see Tiptap/README.md)

## Key Patterns

- All components use Recoil hooks (useRecoilValue, useSetRecoilState) for state
- Components are responsive using IsMobileAtom
- Components follow consistent styling with Tailwind CSS
