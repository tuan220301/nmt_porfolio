# Hooks Folder - Custom React Hooks

## Overview

Contains custom React hooks that encapsulate reusable logic across components.

## Files and Functions

### useApi.ts

- **Purpose**: Custom hook for making API calls
- **Exports**:
  - `API_BASE_URL` - Base URL for API endpoints
  - `useApi()` - Hook function
- **Features**:
  - `callApi(endpoint, method, body)` - Makes HTTP requests
  - Handles authentication (includes cookies)
  - Error handling
  - Response typing with TypeScript
- **Usage**:

  ```typescript
  const { callApi } = useApi();
  const data = await callApi('/api/endpoint', 'GET');
  ```

- **Used in**: Navbar, login page, work pages, project detail pages

### useImageUpload.ts

- **Purpose**: Hook for image upload with compression
- **Exports**:
  - `useImageUpload(options?)` - Hook function
- **Options**:
  - `maxWidth`, `maxHeight`, `quality` - Compression settings
- **Features**:
  - Client-side image compression before upload
  - Batch upload support
  - S3 integration (Cloudflare R2)
  - Progress tracking
  - Error handling
- **Returns**:
  - `uploadImage()` - Single image upload function
  - `batchUpload()` - Multiple images upload
  - `uploading` state
  - `error` state
- **Usage**:

  ```typescript
  const { uploadImage, uploading, error } = useImageUpload();
  const urls = await uploadImage(file);
  ```

- **Used in**: UploadImage component, project detail pages

## Key Patterns

- Hooks encapsulate complex logic away from components
- Reusable across multiple components
- Support TypeScript for type safety
- Integrate with Recoil for state management
