# Project Knowledge Base - For Next AI Model Context

This document helps future AI models understand the project structure and continue development work without needing re-explanation.

## Quick Navigation

### Most Important Files

- **[app/README.md](app/README.md)** - MAIN: Complete architecture overview
- **[app/api/README.md](app/api/README.md)** - API structure and patterns
- **[app/lib/](app/lib/)** - Backend libraries (MongoDB, S3, image compression)
- **[app/hooks/](app/hooks/)** - Reusable custom hooks
- **[app/Atom/](app/Atom/)** - Global state management with Recoil

### Folder Overview

```
app/
├── api/                    # Next.js API routes
│   ├── auth/              # Authentication endpoints
│   ├── persional_project/ # Project CRUD operations
│   └── models/            # TypeScript types for API
├── Atom/                  # Recoil global state atoms
├── Components/            # React UI components
│   ├── Tiptap/           # Rich text editor (project content)
│   └── Modals/           # Modal dialogs
├── hooks/                # Custom React hooks
├── lib/                  # Backend utilities (DB, S3, compression)
├── Pages/                # Next.js page components (routes)
├── Provider/             # Context providers (Recoil, Theme)
└── Ults/                 # Utility functions and types
```

## Quick Reference

### Common Tasks

#### Add New Feature

1. Start with understanding **[app/README.md](app/README.md)** architecture
2. Check existing patterns in Components/ for UI
3. Use existing hooks (useApi, useImageUpload) if applicable
4. Follow Recoil atom pattern for state
5. Add API endpoint if needed in api/ folder

#### Fix Image Issues

1. Check **[app/lib/imageCompressionServer.ts](app/lib/imageCompressionServer.ts)** for server compression
2. Check **[app/hooks/useImageUpload.ts](app/hooks/useImageUpload.ts)** for hook
3. Check **[app/lib/s3.ts](app/lib/s3.ts)** for S3/R2 upload
4. Environment variables in .env.local for Cloudflare R2 config

#### Add API Endpoint

1. Create folder structure under app/api/
2. Create route.ts with POST/GET/PUT/DELETE handler
3. Use connectDB() from app/lib/mongodb.ts
4. Return ResponseApi type from app/Ults/
5. Update corresponding hooks/pages

#### Debug User Authentication

1. Check app/Atom/IsLogged.ts - LoggedAtom state
2. Check app/api/auth/ - Login/logout endpoints
3. Check Navbar.tsx - This calls /api/auth/cookie to verify session

### Key Patterns

#### API Response Pattern (Always Follow)

```typescript
{
  isSuccess: boolean,
  message: string,
  data: T
}
```

#### Recoil State Usage

```typescript
// Read only
const value = useRecoilValue(AtomName);

// Write only
const setValue = useSetRecoilState(AtomName);

// Read and write
const [value, setValue] = useRecoilState(AtomName);
```

#### API Hook Usage

```typescript
const { callApi } = useApi();
const response = await callApi('/api/endpoint', 'GET', optionalBody);
```

#### Image Upload Pattern

```typescript
const { uploadImage, uploading } = useImageUpload();
const urls = await uploadImage(file);
```

### File Naming Conventions

- `.tsx` - React components (with JSX)
- `.ts` - TypeScript utilities, hooks, atoms
- `page.tsx` - Next.js page components
- `route.ts` - Next.js API route handlers
- `[slug].tsx` - Dynamic routes
- `README.md` - Folder documentation

## State Flow

### Project Creation Lifecycle

```
User Input (Components/Tiptap)
    ↓
Form Submission (Pages/work/detail)
    ↓
useImageUpload (client compression)
    ↓
API Call: /api/persional_project/create
    ↓
Server: connectDB() → S3 upload → MongoDB insert
    ↓
Response with Project URL
    ↓
Update UI with Toast notification
```

### Authentication Flow

```
Login Form (Pages/login)
    ↓
POST /api/auth/login
    ↓
Server: Validate → Create session → Set cookie
    ↓
Client: Set LoggedAtom = true
    ↓
Navbar shows edit/delete buttons
```

## Recent Changes (Latest Work)

### Image Compression Fix (When implemented)

- Fixed imageCompressionServer.ts - added missing closing brace and PutObjectCommand
- Fixed type mismatch in batchCompressImages return type
- Both functions now properly handle compression with correct typing

## Common Issues & Solutions

### Issue: Images not uploading

- Check CLOUDFLARE_R2_URL in .env.local
- Verify CLOUDFLARE_BUCKET_NAME exists
- Check app/lib/s3.ts configuration
- Review upload API logs in app/api/persional_project/upload/route.ts

### Issue: Authentication not working

- Check HTTP-only cookie in browser DevTools
- Verify /api/auth/cookie endpoint returns correct boolean
- Check LoggedAtom state in components
- Review app/api/auth/ endpoints

### Issue: Pages not responsive

- Check IsMobileAtom usage in component
- Verify responsive classes in Tailwind
- Review height/width logic for mobile
- Check Components/Navbar.tsx for pattern

### Issue: Rich text not saving

- Check Tiptap component in Components/Tiptap/Tiptap.tsx
- Verify onChangeContent callback is wired
- Check API endpoint for content field saving
- Review app/Pages/work/detail/ for implementation

## Testing Checklist

Before deploying changes:

- [ ] All TypeScript compiles (no red squiggles)
- [ ] Images upload and compress properly
- [ ] API responses return correct format
- [ ] Mobile/desktop layout works (check IsMobileAtom)
- [ ] Authentication flow working (login → protected page → logout)
- [ ] Toast notifications appear on user actions
- [ ] Project CRUD operations complete successfully
- [ ] Image compression reduces file size by >50%

## Database Models (MongoDB)

### User Model

- email
- password (hashed)
- name
- created_at
- updated_at

### Project Model

- title
- des (description)
- content (rich HTML)
- image_preview (S3 URL)
- created_at
- updated_at
- userId (reference)

## Environment Setup

Required for running locally:

1. Node.js 18+
2. MongoDB local or MongoDB Atlas connection
3. Cloudflare R2 account and credentials
4. .env.local with all variables from app/lib/s3.ts comments

## Future Improvements Documented In

See [app/README.md](app/README.md) → "Future Enhancement Opportunities" section

## For Next AI Model

When you encounter a task:

1. **First**: Read [app/README.md](app/README.md) for overview
2. **Then**: Find relevant folder README.md (e.g., [app/api/README.md](app/api/README.md))
3. **Then**: Look at existing code patterns in similar files
4. **Finally**: Implement following established conventions

This knowledge base saves context tokens and ensures consistency!
