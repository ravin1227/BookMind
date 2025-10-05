# API Integration Guide

This directory contains the API configuration for the BookMind mobile app.

## Files Overview

### `api.ts`
- Central API configuration and TypeScript interfaces
- Contains all API endpoints, error codes, and response types
- Defines TypeScript interfaces for User, Book, ReadingProgress, Highlight, etc.

## Environment Setup

### Development
```bash
# .env (for development)
API_BASE_URL=http://localhost:3001/api/v1
API_TIMEOUT=10000
DEBUG_API_REQUESTS=true
DEBUG_AUTH=true
```

### Production
```bash
# .env.production (for production builds)
API_BASE_URL=https://your-production-api.com/api/v1
API_TIMEOUT=15000
DEBUG_API_REQUESTS=false
DEBUG_AUTH=false
```

## Usage in Components

### Authentication
```typescript
import { useAuthStore } from '../stores/authStore';

const LoginScreen = () => {
  const { login, isLoading, error } = useAuthStore();

  const handleLogin = async (email: string, password: string) => {
    const success = await login({ email, password });
    if (success) {
      // Navigate to main app
    }
  };
};
```

### Books Management
```typescript
import { useBooksStore } from '../stores/booksStore';

const LibraryScreen = () => {
  const { books, fetchBooks, isLoading } = useBooksStore();

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);
};
```

## API Services

### AuthService (`../services/authService.ts`)
- `register(userData)` - Register new user
- `login(loginData)` - Authenticate user
- `logout()` - Sign out user
- `getCurrentUser()` - Get current user profile
- `updateProfile(updates)` - Update user information

### BooksService (`../services/booksService.ts`)
- `getBooks(filters)` - Fetch user's books
- `getBook(uuid)` - Get single book details
- `createBook(bookData)` - Upload new book
- `updateBook(uuid, updates)` - Update book information
- `deleteBook(uuid)` - Remove book
- `getBookContent(uuid, params)` - Get paginated book content for reading
- `getReadingProgress(uuid)` - Get reading progress
- `updateReadingProgress(uuid, updates)` - Update reading progress
- `getHighlights(uuid, filters)` - Get book highlights
- `createHighlight(uuid, data)` - Create new highlight
- `updateHighlight(uuid, updates)` - Update highlight
- `deleteHighlight(uuid)` - Remove highlight

## Migration from Mock Data

The stores have been updated to use real API endpoints instead of mock data. Components using these stores will automatically benefit from the real API integration:

1. **Authentication**: Login/register screens now use real backend authentication
2. **Books**: Library screens fetch real books from the backend
3. **Reading Progress**: Reading position is synced with the backend
4. **Highlights**: User highlights are stored in the backend database

## Error Handling

All API calls include proper error handling:
- Network errors are caught and displayed to users
- Authentication errors automatically clear tokens and redirect to login
- Validation errors show specific field-level feedback
- Server errors display generic error messages

## Debug Mode

When `DEBUG_API_REQUESTS=true`, all API requests and responses are logged to the console for development debugging.