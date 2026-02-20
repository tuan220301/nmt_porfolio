# Pages Folder - Application Pages/Routes

## Overview

Contains Next.js page components and their layouts. Each folder represents a route in the application.

## Top-Level Files

### middleware.ts

- **Purpose**: Next.js middleware for request handling
- **Features**: Authentication checks, redirects, request preprocessing

## Major Pages

### home/ (/)

- **Files**: `homeContent.tsx`, `home.css`
- **Purpose**: Landing/home page of portfolio
- **Features**:
  - Hero section with introduction
  - Profile image
  - CV download button (PDF export)
  - Mobile responsive layout
- **Styling**: Custom CSS in home.css

### login/ (/login)

- **File**: `page.tsx`
- **Purpose**: Authentication page
- **Features**:
  - Login form (email/password)
  - Spline 3D animation
  - Success/error notifications
  - Redirects to work page on success
  - Responsive design
- **State Management**: Uses LoggedAtom for auth state
- **API**: Calls `/api/auth/login` endpoint

### work/ (/work)

- **File**: `page.tsx`
- **Purpose**: Display all personal projects
- **Features**:
  - Lists all projects from database
  - Click to view project details
  - Create new project button (if logged in)
  - Edit/delete project buttons (if logged in)
  - Project cards with thumbnail, title, description
  - Mobile responsive grid
- **State**: Uses WorkAtom for selected project
- **API**: Calls `/api/persional_project/list`

### contact/ (/contact)

- **File**: `page.tsx`
- **Purpose**: Contact information page
- **Features**:
  - Email display with copy to clipboard
  - Contact form for messages
  - Toast notifications for user actions
  - Mobile responsive layout

## work/detail/ Sub-folder

### [slug]/ (Dynamic route for project details)

- **File**: `page.tsx`
- **Purpose**: View/edit individual project details
- **Features**:
  - Title, description, thumbnail, content editing
  - Rich text editor (Tiptap) for project content
  - Image upload with preview
  - Create new project or edit existing
  - Delete confirmation modal
  - Only accessible when logged in
  - Mobile detection (not supported on mobile)
- **State**: Uses WorkPageDetailStatus (NEW/EDIT), WorkPageDetailData
- **API**: Calls `/api/persional_project/create`, `/api/persional_project/edit`, `/api/persional_project/delete`

### layoutDetail/

- **File**: `layoutDetail.tsx`
- **Purpose**: Layout wrapper for detail pages
- **Features**: Consistent header styling with dynamic border width

### Sentiment_analysis_website/

- **File**: `page.tsx`
- **Purpose**: Specific project detail page (example)

## Key Patterns

- All pages are client components ("use client" directive)
- Use Recoil hooks for state management
- Responsive design using IsMobileAtom
- Toast notifications for user feedback
- Integration with API hooks
- Dynamic routing with [slug] for individual items
