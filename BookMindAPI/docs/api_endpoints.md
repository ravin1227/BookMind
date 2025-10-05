# 📱 BookMind API Endpoints

## Base URL
```
Development: http://localhost:3001/api/v1
Production: https://your-domain.com/api/v1
```

## 🔐 Authentication

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "user": {
    "email": "user@example.com",
    "name": "John Doe",
    "password": "password123",
    "password_confirmation": "password123"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "uuid": "32cf97b7-78ab-4030-8d19-2cd28eac3fcc",
      "email": "user@example.com",
      "name": "John Doe",
      "display_name": "John Doe",
      "email_verified": false,
      "account_status": "active",
      "last_login_at": null,
      "created_at": "2025-09-28T10:13:09.450Z",
      "updated_at": "2025-09-28T10:13:09.450Z"
    },
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "expires_at": "2025-09-29T10:17:51.078Z"
  },
  "message": "Registration successful"
}
```

### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "auth": {
    "email": "user@example.com",
    "password": "password123"
  }
}
```

**Response:** Same as registration

### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "uuid": "32cf97b7-78ab-4030-8d19-2cd28eac3fcc",
      "email": "user@example.com",
      "name": "John Doe",
      "display_name": "John Doe",
      "email_verified": false,
      "account_status": "active",
      "last_login_at": "2025-09-28T10:19:32.467Z",
      "created_at": "2025-09-28T10:17:51.073Z",
      "updated_at": "2025-09-28T10:19:32.473Z",
      "stats": {
        "total_books": 5,
        "books_completed": 2,
        "total_highlights": 47,
        "active_devices": 2
      }
    }
  }
}
```

### Forgot Password
```http
POST /auth/forgot_password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### Reset Password
```http
POST /auth/reset_password
Content-Type: application/json

{
  "reset_token": "yqedJ1RdiZPV7MqVWsVzmA",
  "password": "newpassword123",
  "password_confirmation": "newpassword123"
}
```

### Logout
```http
POST /auth/logout
Authorization: Bearer <token>
```

## 👤 Users Management

### Get User by UUID
```http
GET /users/{uuid}
```

### Update User
```http
PATCH /users/{uuid}
Content-Type: application/json

{
  "user": {
    "name": "Updated Name"
  }
}
```

### Register Device (Push Notifications)
```http
POST /users/{uuid}/register_device
Content-Type: application/json

{
  "device": {
    "device_token": "fcm_token_123",
    "device_type": "ios", // or "android"
    "device_name": "iPhone 15 Pro"
  }
}
```

### Get User Stats
```http
GET /users/{uuid}/stats
```

## 📚 Books Management

### Get User's Books
```http
GET /users/{user_uuid}/books
Query Parameters:
  - status: pending|processing|completed|failed
  - file_type: pdf|epub|txt
  - search: search term
  - sort: title|author|oldest (default: newest)
  - page: page number
```

### Upload Book
```http
POST /users/{user_uuid}/books
Content-Type: application/json

{
  "book": {
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "isbn": "9780743273565",
    "file_path": "/uploads/books/gatsby.pdf",
    "file_type": "pdf",
    "file_size": 2048000,
    "metadata": {
      "page_count": 180,
      "language": "en"
    }
  }
}
```

### Get Book Details
```http
GET /books/{uuid}
Query Parameters:
  - include_content: true (to include full text)
```

### Get Book Content (Paginated)
```http
GET /books/{uuid}/content
Query Parameters:
  - page: page number (default: 1)
  - words_per_page: words per page (default: 300)
```

### Update Book
```http
PATCH /books/{uuid}
Content-Type: application/json

{
  "book": {
    "title": "Updated Title",
    "author": "Updated Author"
  }
}
```

### Delete Book
```http
DELETE /books/{uuid}
```

## 📖 Reading Progress

### Get Reading Progress
```http
GET /books/{book_uuid}/reading_progress
Query Parameters:
  - user_uuid: required
```

### Create Reading Progress
```http
POST /books/{book_uuid}/reading_progress
Content-Type: application/json

{
  "reading_progress": {
    "user_uuid": "user-uuid-here",
    "current_page": 25,
    "total_pages": 180,
    "current_chapter": "Chapter 3",
    "reading_speed": 250
  }
}
```

### Update Reading Progress
```http
PATCH /books/{book_uuid}/reading_progress
Content-Type: application/json

{
  "reading_progress": {
    "user_uuid": "user-uuid-here",
    "current_page": 30,
    "reading_position": 1250
  }
}
```

### Get Recent Reading Activity
```http
GET /reading_progresses
Query Parameters:
  - user_uuid: filter by user
  - status: completed|in_progress
```

## 🎨 Highlights

### Get Book Highlights
```http
GET /books/{book_uuid}/highlights
Query Parameters:
  - user_uuid: filter by user
  - color: yellow|blue|green|pink|orange|purple
  - favorites: true
  - with_notes: true
  - search: search in text or notes
  - sort: position|oldest (default: recent)
```

### Create Highlight
```http
POST /books/{book_uuid}/highlights
Content-Type: application/json

{
  "highlight": {
    "user_uuid": "user-uuid-here",
    "start_position": 1250,
    "end_position": 1350,
    "highlighted_text": "This is the highlighted text",
    "color": "yellow",
    "note": "My thoughts on this passage",
    "page_number": 25
  }
}
```

### Update Highlight
```http
PATCH /highlights/{uuid}
Content-Type: application/json

{
  "highlight": {
    "color": "blue",
    "note": "Updated note",
    "is_favorite": true
  }
}
```

### Toggle Favorite
```http
PATCH /highlights/{uuid}/toggle_favorite
```

### Get Highlight for Sharing
```http
GET /highlights/{uuid}/share
```

### Delete Highlight
```http
DELETE /highlights/{uuid}
```

### Bulk Create Highlights
```http
POST /highlights/bulk_create
Content-Type: application/json

{
  "book_uuid": "book-uuid-here",
  "user_uuid": "user-uuid-here",
  "highlights": [
    {
      "start_position": 100,
      "end_position": 200,
      "highlighted_text": "Text 1",
      "color": "yellow"
    },
    {
      "start_position": 300,
      "end_position": 400,
      "highlighted_text": "Text 2",
      "color": "blue"
    }
  ]
}
```

## 🔗 Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Specific error 1", "Specific error 2"]
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (account suspended)
- `404` - Not Found
- `422` - Unprocessable Entity (validation errors)
- `500` - Internal Server Error

## 🚀 React Native Integration

### 1. Install HTTP Client
```bash
npm install axios
# or
npm install @react-native-async-storage/async-storage
```

### 2. API Service Setup
```javascript
// services/api.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://localhost:3001/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('auth_token');
      // Navigate to login screen
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 3. Authentication Service
```javascript
// services/auth.js
import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authService = {
  async register(userData) {
    const response = await api.post('/auth/register', { user: userData });
    if (response.data.success) {
      await AsyncStorage.setItem('auth_token', response.data.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  async login(email, password) {
    const response = await api.post('/auth/login', { auth: { email, password } });
    if (response.data.success) {
      await AsyncStorage.setItem('auth_token', response.data.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  async logout() {
    await api.post('/auth/logout');
    await AsyncStorage.removeItem('auth_token');
    await AsyncStorage.removeItem('user');
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  async forgotPassword(email) {
    const response = await api.post('/auth/forgot_password', { email });
    return response.data;
  }
};
```

### 4. Usage Examples
```javascript
// In your React Native screens

// Login
const handleLogin = async () => {
  try {
    const result = await authService.login(email, password);
    if (result.success) {
      navigation.navigate('Home');
    }
  } catch (error) {
    Alert.alert('Error', error.response?.data?.message || 'Login failed');
  }
};

// Get books
const fetchBooks = async () => {
  try {
    const response = await api.get(`/users/${userUuid}/books`);
    setBooks(response.data.data.books);
  } catch (error) {
    console.error('Failed to fetch books:', error);
  }
};

// Create highlight
const createHighlight = async (bookUuid, highlightData) => {
  try {
    const response = await api.post(`/books/${bookUuid}/highlights`, {
      highlight: { ...highlightData, user_uuid: userUuid }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to create highlight:', error);
  }
};
```

## 🔄 Next Steps

1. **File Upload**: Implement actual file upload endpoint for books
2. **Push Notifications**: Set up FCM/APNS integration
3. **Real-time Updates**: WebSocket for live sync across devices
4. **Offline Support**: Cache API responses for offline reading
5. **Search**: Implement full-text search across books and highlights

Your login, signup, and user recovery screens are now ready to integrate with these endpoints! 🚀