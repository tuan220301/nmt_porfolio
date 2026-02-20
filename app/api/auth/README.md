# Auth Folder - Authentication API Routes

## Overview

Contains authentication endpoints for user login, registration, logout, and session management.

## Endpoints

### /api/auth/login (POST)

- **Purpose**: Authenticate user and create session
- **Request Body**:
  - email/username
  - password
- **Response**:
  - Success: Auth token, user data
  - Error: Invalid credentials message
- **Features**:
  - Validates credentials against database
  - Creates secure session cookie
  - Returns user information

### /api/auth/register (POST)

- **Purpose**: Register new user account
- **Request Body**:
  - email
  - password
  - name (optional)
- **Response**:
  - Success: Registration confirmation, auto-login
  - Error: Validation errors, duplicate account
- **Features**:
  - User validation
  - Password hashing
  - Account creation in database

### /api/auth/logout (POST)

- **Purpose**: End user session
- **Request Body**: None (uses session cookie)
- **Response**: Success message
- **Features**:
  - Clears session cookie
  - Logs user out globally

### /api/auth/cookie (GET)

- **Purpose**: Verify if user is logged in
- **Request Body**: None (checks cookies)
- **Response**:
  - true: User is logged in
  - false: User is not logged in
- **Features**:
  - Server-side session validation
  - Used by Navbar to check auth status
  - CORS enabled for client requests

## Session Management

- Uses HTTP-only cookies for security
- Session validation on each request
- Automatic cookie expiration

## Security Features

- Password hashing before storage
- HTTP-only cookies (can't be accessed via JavaScript)
- CORS filters for API access
- Server-side session validation

## Integration Points

- Login page calls `/api/auth/login`
- Navbar calls `/api/auth/cookie` to check auth
- Navbar logout button calls `/api/auth/logout`
- Work page uses auth status to show edit/delete buttons
