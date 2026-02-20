# API Folder - Next.js API Routes

## Overview

Contains server-side API endpoints following Next.js App Router structure. Each folder with a route.ts file becomes an API endpoint.

## Directory Structure

### config/

- **index.ts**: API configuration and constants

### models/

- **response.ts**: Standard API response types
- **users.ts**: User data models
- **personalProject.ts**: Project data models

### auth/

Authentication endpoints - see auth/README.md

### persional_project/

Project CRUD operations - see persional_project/README.md

## API Response Pattern

All endpoints follow a standard response format:

```typescript
{
  isSuccess: boolean,
  message: string,
  data: T // Generic data
}
```

## Common Endpoint Features

- Authentication checks (verify login cookies)
- Error handling with appropriate HTTP status codes
- Data validation
- MongoDB integration
- Image upload/compression handling
- CORS enabled for client requests

## Base URL

API endpoints are accessed at `/api/` relative to root

## Key Considerations

- All routes use Next.js App Router structure
- Route handlers are in route.ts files
- Server-side only (no client-side access to secrets)
- Environment variables for sensitive config
- Integration with MongoDB and Cloudflare R2
