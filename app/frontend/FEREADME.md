# File Management System - Frontend Dev Info

## Overview
A modern web application built with Next.js 14 and TypeScript that provides an intuitive interface for managing case files, evidence, and entity relationships. The frontend implements a clean architecture pattern with React Server Components and client-side interactivity.

## Technical Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **State Management**: TanStack Query (React Query) for server state
- **Styling**: Tailwind CSS with dark mode support
- **Form Handling**: React Hook Form with Zod validation
- **API Integration**: Axios with custom hooks pattern

## Architecture
- **Component Structure**
  - Atomic design pattern with shared UI components
  - Server/Client component separation
  - Modular routing with dynamic segments

- **Data Flow**
  - Custom hooks for API interactions
  - Optimistic updates for better UX
  - Real-time cache invalidation
  - Type-safe API responses

- **Features**
  - Case management with hierarchical structure
  - Evidence tracking and relationships
  - Entity management system
  - Dark mode support
  - Form validation with error handling
  - Responsive design

## Performance Optimizations
- Server-side rendering for initial page loads
- Client-side navigation for smooth transitions
- Optimistic updates to reduce perceived latency
- Efficient cache management
- Code splitting and lazy loading

## Security
- Type-safe API interactions
- Input validation and sanitization
- Protected routes and authentication
- Secure data handling patterns

## Development Patterns
- Custom hook abstractions
- Shared utility functions
- Consistent error handling
- Type-safe component props
- Modular CSS with Tailwind