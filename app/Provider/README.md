# Provider Folder - Context Providers

## Overview

Contains React context providers that wrap the entire application to provide global functionality.

## Files

### recoilContextProvider.tsx

- **Purpose**: Recoil state management provider
- **Component**: `RecoidContextProvider` (note: named "Recoid" not "Recoil")
- **Features**:
  - Wraps application with RecoilRoot
  - Enables all Recoil atoms throughout app
  - Must be at application root
- **Location**: Used in root layout.tsx
- **Usage**:

  ```tsx
  <RecoidContextProvider>
    {children}
  </RecoidContextProvider>
  ```

### ThemeProvider.tsx

- **Purpose**: Theme context provider
- **Component**: `Provider` (custom name)
- **Features**:
  - Provides theme context to components
  - Manages dark/light mode context
  - Integrates with Darkmode atom
  - Ensures proper theme initialization
- **Location**: Used in root layout.tsx
- **Usage**:

  ```tsx
  <Provider>
    {children}
  </Provider>
  ```

## Provider Stack in Root Layout

The providers are layered in this order (from root layout.tsx):

1. **RecoidContextProvider** - Recoil state (outermost)
2. **Provider** - Theme context
3. **Application content** (Navbar, main, children)

This layering ensures:

- Recoil atoms are available to all components
- Theme is available across app
- Proper initialization order

## Key Concepts

- Providers eliminate prop drilling
- Enable global state access without passing props
- Can be nested for layered functionality
