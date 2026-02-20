# Ults Folder - Utilities and Type Definitions

## Overview

Contains utility functions and TypeScript type definitions used across the application.

## Files

### index.ts

- **Purpose**: Main utility exports and type definitions
- **Type Exports**:
  - **LoginFormType**: Login form data structure
    - Properties: username, password (and other auth fields)
  - **LoginResponeType**: Login API response structure
    - Properties: Success status, message, token
  - **ProjectResponseType**: Project data structure
    - Properties: _id, title, des, content, image_preview, create_at, update_at
  - **ResponseApiType<T>**: Generic API response wrapper
    - Properties: isSuccess, message, data<T>

### imageCompression.ts

- **Purpose**: Client-side image compression utilities
- **Exports**:
  - `compressImageClient(blob, fileName, options)` - Compress single image on client
  - `batchCompressImages(blobs[], options)` - Batch compress multiple images
  - `canvasToBlobConvertor(canvas)` - Convert canvas to blob
- **Features**:
  - Uses Canvas API for compression in browser
  - Reduces image size before upload
  - Configurable quality and dimensions
  - Fallback for unsupported formats
  - Returns compression statistics
- **Usage**:
  - Used in useImageUpload hook
  - Client-side before server compression

## Key Patterns

- Type definitions are centralized for consistency
- Utility functions are reusable across components
- Both client and server compression available:
  - Client-side (imageCompression.ts) - faster feedback, reduces server load
  - Server-side (lib/imageCompressionServer.ts) - more reliable, server-side
- Functions are async and handle errors gracefully

## Common Types Used Throughout App

- All API responses wrapped in ResponseApiType
- ProjectResponseType used in project listing and detail pages
- LoginFormType and LoginResponeType for authentication flow
