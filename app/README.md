# Portfolio Application - Architecture Documentation

## Overview

This is a Next.js full-stack portfolio application built with TypeScript, React, Tailwind CSS, and MongoDB. It allows authenticated users to create, edit, and manage personal projects with rich content and images.

## Project Structure

### Core Architecture Folders

#### Frontend State & Context

- **[Atom/](Atom/README.md)** - Recoil global state atoms
- **[Provider/](Provider/README.md)** - React context providers
- **[hooks/](hooks/README.md)** - Custom React hooks

#### UI & Components

- **[Components/](Components/README.md)** - Reusable UI components
  - [Tiptap/](Components/Tiptap/README.md) - Rich text editor
  - [Modals/](Components/Modals/README.md) - Modal dialogs

#### Pages & Routing

- **[Pages/](Pages/README.md)** - Next.js page components
  - Home page (/)
  - Login page (/login)
  - Work/Projects page (/work)
  - Project detail page (/work/detail/[slug])
  - Contact page (/contact)

#### Backend & Infrastructure

- **[lib/](lib/README.md)** - Server-side libraries
  - MongoDB connection
  - Cloudflare R2 (S3) integration
  - Sharp image compression
  - GridFS for large files
- **[api/](api/README.md)** - Next.js API routes
  - [auth/](api/auth/README.md) - Authentication endpoints
  - [persional_project/](api/persional_project/README.md) - Project management endpoints

#### Utilities

- **[Ults/](Ults/README.md)** - Utility functions and types
  - Type definitions
  - Client-side image compression
  - API response types

## Technology Stack

### Frontend

- **React 18** - UI library
- **Next.js 14+** - Framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Recoil** - State management
- **Framer Motion** - Animations
- **Tiptap** - Rich text editor
- **Spline** - 3D animations

### Backend

- **Next.js API Routes** - Server endpoints
- **MongoDB** - Database
- **Mongoose** - ODM (optional, can use native MongoDB)
- **Sharp.js** - Image compression
- **AWS SDK** - Cloudflare R2 integration
- **GridFS** - Large file storage

### Storage

- **Cloudflare R2** - Image storage (S3-compatible)
- **MongoDB GridFS** - Large file backup

## Key Features

### Authentication

- Secure login/register system
- HTTP-only cookies for sessions
- Protected API endpoints
- Logout functionality

### Project Management

- Create new projects with:
  - Title and description
  - Rich text content (Tiptap editor)
  - Project thumbnail image
- Edit existing projects
- Delete projects with confirmation
- List all projects with preview cards

### Image Handling

- Client-side image compression
- Server-side compression (Sharp)
- Auto-resize for optimal web display
- Cloudflare R2 storage
- Organized folder structure per project
- Batch upload support

### User Interface

- Responsive design (mobile/tablet/desktop)
- Dark/light theme toggle
- Loading states and spinners
- Toast notifications
- Page transitions
- Mobile-optimized navigation

## Data Flow

### Project Creation Flow

1. User logs in → `/api/auth/login` → Session cookie set
2. Navigate to create project → Shows form with Tiptap editor
3. Select image → Client-side compression via useImageUpload
4. Submit → POST `/api/persional_project/create`
5. Server:
   - Validates user authentication
   - Re-compresses image with Sharp
   - Uploads to Cloudflare R2
   - Saves project to MongoDB
   - Returns project data with image URL

### Project Display Flow

1. Load /work page
2. GET `/api/persional_project/list` → Returns all projects
3. Render project cards with thumbnails
4. Click project → Navigate to `/work/detail/[slug]`
5. Show project details with full content and image

## State Management

### Recoil Atoms (Global State)

- `LoggedAtom` - User authentication status
- `IsMobileAtom` - Device responsive state
- `LoadingAtom` - Global loading indicator
- `ToastAtom` - Toast notification messages
- `WorkPageDetailStatus` - Current page mode (NEW/EDIT)
- `WorkPageDetailData` - Selected project data
- `Darkmode` - Theme preference
- `SidebarAtom` - Mobile sidebar state

### Local Component State

- Form inputs
- Modal open/close
- Editor content
- Upload progress

## API Conventions

### Response Format

```typescript
{
  isSuccess: boolean,
  message: string,
  data: T // Generic typed data
}
```

### Authentication

- Check credentials via `/api/auth/cookie`
- Verify in each protected endpoint
- Redirect to login if unauthorized

### Image Upload

- Max recommended: 10MB (auto-compressed)
- Formats: JPEG, PNG, WebP
- Output: 1920x1920px max, 80% quality
- Storage path: `uploads/{projectTitle}/{timestamp}_{random}_{name}`

## Development Notes

### Adding New Pages

1. Create folder in Pages/ with page.tsx
2. Add route.ts in api/ if needed
3. Use Recoil hooks for state
4. Implement error handling with toast
5. Add to Navbar if public

### Adding New Components

1. Create .tsx file in Components/
2. Accept props with types
3. Use Recoil for shared state
4. Responsive with IsMobileAtom
5. Export from index if needed

### Adding API Endpoints

1. Create route.ts in api/ folder structure
2. Use connectDB() for database
3. Parse and validate request body
4. Check authentication with cookie
5. Return standard response format
6. Handle errors with try/catch

### Image Optimization

- Use `compressImageClient` for client preview
- Server-side compression via `compressImageServer`
- Batch operations for efficiency
- Monitor compression % for tuning

## Environment Configuration

Required .env.local:

```
CLOUDFLARE_R2_URL=https://your-bucket.r2.cloudflarestorage.com
CLOUDFLARE_ACCESS_KEY_ID=your_access_key
CLOUDFLARE_SECRET_ACCESS_KEY=your_secret
CLOUDFLARE_BUCKET_NAME=your_bucket
CLOUDFLARE_PUBLIC_URL=https://your-public-url.com

MONGODB_URI=mongodb+srv://...
```

## Future Enhancement Opportunities

- Add project categories/tags
- Search and filter functionality
- Project comments/feedback
- Analytics dashboard
- Social sharing features
- WebP image format support
- Image CDN with caching headers
- Rate limiting for APIs
- Admin panel for content management
