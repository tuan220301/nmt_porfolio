# Lib Folder - Core Backend/Infrastructure Libraries

## Overview

Contains server-side utilities, database connections, and external service integrations.

## Files and Functions

### mongodb.ts

- **Purpose**: MongoDB database connection
- **Exports**:
  - `connectDB()` - Establishes MongoDB connection
- **Returns**: Database instance (Db type)
- **Features**: Connection pooling, error handling
- **Usage**: Used in API routes for database operations

### s3.ts

- **Purpose**: Cloudflare R2 (S3-compatible) image storage integration
- **Exports**:
  - `uploadImageToS3(file, fileKey)` - Upload single image
  - `batchUploadToS3(files[], projectTitle?)` - Upload multiple images
  - `deleteImageFromS3(fileKey)` - Delete image from storage
  - `getImageFromS3(fileKey)` - Retrieve image
  - `generateFileKey(fileName, projectTitle?)` - Generate unique file keys
- **Features**:
  - Auto-compression for files >1MB
  - Public URL generation
  - Error handling
  - Organized folder structure (uploads/{projectTitle}/{timestamp}_{random}_{name})
- **Configuration**: Environment variables
  - CLOUDFLARE_R2_URL
  - CLOUDFLARE_ACCESS_KEY_ID
  - CLOUDFLARE_SECRET_ACCESS_KEY
  - CLOUDFLARE_BUCKET_NAME
  - CLOUDFLARE_PUBLIC_URL

### imageCompressionServer.ts

- **Purpose**: Server-side image compression using Sharp
- **Exports**:
  - `compressImageServer(buffer, fileName, options)` - Compress single image
  - `batchCompressImages(buffers[], options)` - Compress multiple images
- **Interface**: `CompressionOptions` with maxWidth, maxHeight, quality
- **Features**:
  - Uses Sharp for optimized compression
  - JPEG with mozjpeg for better compression
  - Skips compression for files <1MB
  - Returns compression stats (original size, compressed size, reduction %)
  - Fallback to original if compression fails
- **Default Settings**:
  - maxWidth: 1920px
  - maxHeight: 1920px
  - quality: 80

### gridfs.ts

- **Purpose**: MongoDB GridFS for large file storage
- **Exports**:
  - `getGridFSBucket()` - Get GridFS bucket instance
- **Purpose**: Store files larger than 16MB (MongoDB doc limit)
- **Usage**: Fallback for very large files

## Key Patterns

- All async operations with error handling
- Environment variable configuration for security
- Server-side operations (not exposed to client)
- Integration with Next.js API routes
