# Modals Folder - Modal Dialog Components

## Overview

Contains modal/dialog components for user interactions that require confirmation or additional input.

## Files

### DeleteModal.tsx

- **Purpose**: Confirmation modal for delete operations
- **Features**:
  - Yes/No confirmation buttons
  - Warning message display
  - Closes on backdrop click
  - Loading state during deletion
  - Error handling
- **Props**:
  - `isOpen` - Boolean to show/hide modal
  - `onConfirm` - Callback when user confirms delete
  - `onCancel` - Callback when user cancels
  - `title` - Modal title
  - `message` - Deletion warning message
  - `isLoading` - Show loading during deletion
- **Usage**: Project detail page for delete confirmation
- **Styling**: Centered modal with overlay, responsive design

## Modal Patterns

- Built with React state management
- Can be opened/closed via Recoil atoms or local state
- Accept callbacks for actions
- Show loading states during async operations
- Accessible with keyboard navigation (consider adding)

## Future Modals

Similar structures can be used for:

- Confirmation modals for other actions
- Form modals for additional input
- Info/warning modals for alerts
