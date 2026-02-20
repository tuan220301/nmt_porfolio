# Personal Project Folder - Project Management API Routes

## Overview

Contains API endpoints for CRUD operations on portfolio projects. Includes image upload and batch operations.

## Endpoints

### /api/persional_project/list (GET)

- **Purpose**: Retrieve all projects
- **Request**: No body needed
- **Response**: Array of ProjectResponseType
- **Features**:
  - Returns all projects with metadata
  - Includes project images/previews
  - Sorted by creation date
- **Usage**: Work page listing

### /api/persional_project/create (POST)

- **Purpose**: Create new project
- **Request Body**:
  - title
  - des (description)
  - content (rich text)
  - image_preview (file or URL)
- **Response**: Created project data
- **Features**:
  - Requires authentication
  - Validates required fields
  - Handles image upload to Cloudflare R2
  - Auto-compression of images
- **Authentication**: Checks login cookie

### /api/persional_project/edit (PUT)

- **Purpose**: Update existing project
- **Request Body**:
  - projectId
  - title
  - des
  - content
  - image_preview (optional new image)
- **Response**: Updated project data
- **Features**:
  - Requires authentication
  - Validates project ownership
  - Handles image replacement
  - Cleans up old images from S3
- **Authentication**: Checks login cookie

### /api/persional_project/delete (DELETE)

- **Purpose**: Delete project
- **Request Body**:
  - projectId
- **Response**: Success message
- **Features**:
  - Requires authentication
  - Deletes from database
  - Deletes images from Cloudflare R2
  - Validates ownership
- **Authentication**: Checks login cookie

### /api/persional_project/upload (POST)

- **Purpose**: Single file upload
- **Request**: FormData with file
- **Response**: File URL in S3/R2
- **Features**:
  - Server-side compression
  - Generates unique filename
  - Returns public URL
- **Usage**: Image preview in edit modal

### /api/persional_project/batch-upload (POST)

- **Purpose**: Upload multiple files at once
- **Request**: FormData with multiple files
- **Response**: Array of URLs
- **Features**:
  - Parallel upload for performance
  - Batch compression
  - Returns all URLs
  - Error handling per file

### /api/persional_project/images_return/[fileId] (GET)

- **Purpose**: Retrieve project image
- **Route Parameter**: fileId - Unique image identifier
- **Response**: Image file/buffer
- **Features**:
  - Fetches from Cloudflare R2
  - Handles URL/key conversion
  - Stream response

## Image Integration

All image operations use:

- Cloudflare R2 for storage (S3-compatible)
- Server-side compression (Sharp.js)
- Optional client-side pre-compression
- Organized folder structure: `uploads/{projectTitle}/{timestamp}__{randomId}_{name}`

## Authentication

- All create/edit/delete require user authentication
- User identity verified via HTTP-only cookies
- Ownership validation prevents unauthorized changes

## Data Models

- ProjectResponseType: Complete project data
- Image handling: URL storage, server compression

## Error Handling

- 400: Bad request (missing fields)
- 401: Unauthorized (not logged in)
- 403: Forbidden (not project owner)
- 500: Server error during upload/processing
