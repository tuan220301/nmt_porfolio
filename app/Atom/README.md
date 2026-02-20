# Atom Folder - Global State Management (Recoil)

## Overview

This folder contains all Recoil atoms used for global state management across the application.

## Files and Their Functions

### IsLogged.ts

- **Purpose**: Tracks user authentication status
- **Atom**: `LoggedAtom`
- **Type**: `boolean`
- **Default**: `false`
- **Usage**: Used in Navbar, work pages, and login flows to conditionally render authenticated UI elements

### IsMobile.ts

- **Purpose**: Tracks device screen size (mobile vs desktop)
- **Atom**: `IsMobileAtom`
- **Type**: `boolean`
- **Default**: `false`
- **Usage**: Responsive design - used in Navbar, Pages to adjust layout for mobile/desktop

### IsLoading.ts

- **Purpose**: Global loading state for async operations
- **Atom**: `LoadingAtom`
- **Type**: `boolean`
- **Default**: `false`
- **Usage**: Shows/hides loading spinner during API calls

### ToastAtom.ts

- **Purpose**: Manages toast notification state
- **Atom**: `ToastAtom`
- **Type**: Object with `isOpen`, `message`, `isAutoHide`, `status` (INFO/ERROR/SUCCESS)
- **Default**: Empty/closed state
- **Usage**: Displays feedback messages for user actions

### Sidebar.ts

- **Purpose**: Controls sidebar visibility
- **Atom**: `SidebarAtom`
- **Type**: `boolean`
- **Default**: `false`
- **Usage**: Toggle open/closed state of sidebar navigation

### WorkAtom.ts

- **Purpose**: Manages work/project detail page state
- **Atoms**:
  - `WorkPageDetailStatus` - 'NEW' or 'EDIT'
  - `WorkPageDetailData` - Selected project data
- **Usage**: Stores current project being edited and mode (create vs edit)

### theme.ts

- **Purpose**: Tracks dark/light theme preference
- **Atom**: `Darkmode`
- **Type**: `boolean`
- **Default**: `false`
- **Usage**: Theme switcher component to toggle between dark and light modes

## Key Concepts

- All atoms use Recoil's `atom()` function with unique keys
- These provide application-wide state without prop drilling
- Connected through RecoilRoot in layout.tsx
