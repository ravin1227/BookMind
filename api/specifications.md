# 🔌 BookMind - API Specifications & Data Models

## 🎯 API Overview

BookMind's REST API provides comprehensive access to reading data, AI features, and synchronization capabilities. The API follows RESTful principles with JSON payloads and supports real-time updates via WebSocket connections.

**Base URL**: `https://api.bookmind.ai/v1`
**Authentication**: JWT Bearer tokens
**Rate Limiting**: 1000 requests/hour (free), 10,000 requests/hour (pro)

## 🔐 Authentication

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Response**:
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "subscriptionTier": "free",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 900
  }
}
```

### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

### Refresh Token
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

## 📚 Books API

### Upload Book
```http
POST /books
Authorization: Bearer {accessToken}
Content-Type: multipart/form-data

file: [PDF/EPUB file]
metadata: {
  "title": "Book Title",
  "author": "Author Name",
  "isbn": "978-1234567890"
}
```

**Response**:
```json
{
  "book": {
    "id": "book-uuid",
    "title": "Book Title",
    "author": "Author Name",
    "isbn": "978-1234567890",
    "pageCount": 350,
    "fileSize": 15728640,
    "fileType": "pdf",
    "processingStatus": "processing",
    "coverUrl": "https://cdn.bookmind.ai/covers/book-uuid.jpg",
    "uploadedAt": "2024-01-15T10:30:00Z"
  }
}
```

### Get User's Books
```http
GET /books
Authorization: Bearer {accessToken}
```

**Response**:
```json
{
  "books": [
    {
      "id": "book-uuid",
      "title": "Book Title",
      "author": "Author Name",
      "readingProgress": 0.65,
      "lastReadAt": "2024-01-14T15:22:00Z",
      "annotationCount": 12,
      "processingStatus": "completed"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

### Get Book Details
```http
GET /books/{bookId}
Authorization: Bearer {accessToken}
```

**Response**:
```json
{
  "book": {
    "id": "book-uuid",
    "title": "Book Title",
    "author": "Author Name",
    "isbn": "978-1234567890",
    "pageCount": 350,
    "readingProgress": 0.65,
    "currentPage": 227,
    "chapters": [
      {
        "id": "chapter-1",
        "title": "Introduction",
        "startPage": 1,
        "endPage": 15,
        "summary": "AI-generated chapter summary..."
      }
    ],
    "metadata": {
      "difficulty": "intermediate",
      "topics": ["technology", "artificial intelligence"],
      "readingTime": 720,
      "wordCount": 85000
    }
  }
}
```

### Delete Book
```http
DELETE /books/{bookId}
Authorization: Bearer {accessToken}
```

## 🎨 Highlights API

### Create Highlight
```http
POST /books/{bookId}/highlights
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "selectedText": "This is the highlighted text passage",
  "pageNumber": 45,
  "position": {
    "start": {"x": 120, "y": 200, "page": 45, "offset": 1234},
    "end": {"x": 320, "y": 240, "page": 45, "offset": 1289}
  },
  "color": "yellow",
  "category": "important_concept",
  "tags": ["key_point", "chapter_5"],
  "note": "This concept ties into the previous chapter's discussion"
}
```

**Response**:
```json
{
  "highlight": {
    "id": "highlight-uuid",
    "selectedText": "This is the highlighted text passage",
    "pageNumber": 45,
    "color": "yellow",
    "colorHex": "#FEF3C7",
    "category": "important_concept",
    "tags": ["key_point", "chapter_5"],
    "note": "This concept ties into the previous chapter's discussion",
    "wordCount": 6,
    "characterCount": 35,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

### Get Book Highlights
```http
GET /books/{bookId}/highlights
Authorization: Bearer {accessToken}
```

**Query Parameters**:
- `color`: Filter by highlight color (yellow, blue, green, red, purple, orange, brown, pink)
- `category`: Filter by category
- `page`: Filter by page number
- `sort`: Sort order (created_asc, created_desc, page_asc, page_desc)

**Response**:
```json
{
  "highlights": [
    {
      "id": "highlight-uuid",
      "selectedText": "This is the highlighted text",
      "pageNumber": 45,
      "color": "yellow",
      "category": "important_concept",
      "tags": ["key_point"],
      "note": "Important concept",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "statistics": {
    "totalHighlights": 47,
    "colorCounts": {
      "yellow": 23,
      "blue": 12,
      "green": 8,
      "red": 4
    },
    "averagePerPage": 2.3,
    "mostHighlightedChapter": "Chapter 5"
  }
}
```

### Update Highlight
```http
PUT /books/{bookId}/highlights/{highlightId}
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "color": "blue",
  "category": "question",
  "tags": ["needs_clarification", "follow_up"],
  "note": "Updated note with new insights"
}
```

### Delete Highlight
```http
DELETE /books/{bookId}/highlights/{highlightId}
Authorization: Bearer {accessToken}
```

### Export Highlights
```http
POST /books/{bookId}/highlights/export
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "format": "markdown",
  "includeNotes": true,
  "includePageNumbers": true,
  "groupBy": "color",
  "colorFilter": ["yellow", "blue"]
}
```

**Response**:
```json
{
  "export": {
    "format": "markdown",
    "content": "# Highlights from Book Title\n\n## Important Concepts (Yellow)\n- \"This is highlighted text\" (p. 45)\n  - Note: Important concept\n\n## Questions (Blue)\n- \"Another highlight\" (p. 67)",
    "downloadUrl": "https://api.bookmind.ai/downloads/export-uuid.md",
    "expiresAt": "2024-01-15T11:30:00Z"
  }
}
```

## 🔖 Bookmarks API

### Create Bookmark
```http
POST /books/{bookId}/bookmarks
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "pageNumber": 127,
  "title": "Chapter 8: Key Insights",
  "category": "favorite",
  "note": "Great section on business models",
  "isAutoBookmark": false,
  "position": {
    "x": 0,
    "y": 150,
    "scrollOffset": 45
  }
}
```

**Response**:
```json
{
  "bookmark": {
    "id": "bookmark-uuid",
    "pageNumber": 127,
    "title": "Chapter 8: Key Insights",
    "category": "favorite",
    "note": "Great section on business models",
    "isAutoBookmark": false,
    "thumbnailUrl": "https://cdn.bookmind.ai/thumbnails/bookmark-uuid.jpg",
    "createdAt": "2024-01-15T10:30:00Z",
    "lastVisited": "2024-01-15T10:30:00Z"
  }
}
```

### Get Book Bookmarks
```http
GET /books/{bookId}/bookmarks
Authorization: Bearer {accessToken}
```

**Response**:
```json
{
  "bookmarks": [
    {
      "id": "bookmark-uuid",
      "pageNumber": 127,
      "title": "Chapter 8: Key Insights",
      "category": "favorite",
      "note": "Great section on business models",
      "isAutoBookmark": false,
      "thumbnailUrl": "https://cdn.bookmind.ai/thumbnails/bookmark-uuid.jpg",
      "createdAt": "2024-01-15T10:30:00Z",
      "lastVisited": "2024-01-15T10:30:00Z"
    }
  ],
  "categories": {
    "current_position": 1,
    "favorite": 8,
    "to_review": 3,
    "for_notes": 2
  }
}
```

### Update Reading Position (Auto-Bookmark)
```http
PUT /books/{bookId}/position
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "pageNumber": 142,
  "readingProgress": 0.73,
  "position": {
    "x": 0,
    "y": 300,
    "scrollOffset": 120
  },
  "sessionDuration": 1800,
  "wordsRead": 2450
}
```

**Response**:
```json
{
  "position": {
    "pageNumber": 142,
    "readingProgress": 0.73,
    "updatedAt": "2024-01-15T10:30:00Z",
    "autoBookmarkId": "auto-bookmark-uuid"
  },
  "readingSession": {
    "sessionId": "session-uuid",
    "duration": 1800,
    "wordsRead": 2450,
    "pagesRead": 8
  }
}
```

### Navigate to Bookmark
```http
GET /books/{bookId}/bookmarks/{bookmarkId}/navigate
Authorization: Bearer {accessToken}
```

**Response**:
```json
{
  "navigation": {
    "bookmarkId": "bookmark-uuid",
    "pageNumber": 127,
    "position": {
      "x": 0,
      "y": 150,
      "scrollOffset": 45
    },
    "context": {
      "chapterTitle": "Chapter 8: Key Insights",
      "sectionTitle": "Business Model Canvas",
      "surroundingText": "The business model canvas provides..."
    },
    "estimatedReadingTime": 15
  }
}
```

## 📝 Annotations API

### Create Text Note
```http
POST /books/{bookId}/annotations
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "type": "note",
  "pageNumber": 89,
  "position": {
    "start": {"x": 120, "y": 200, "page": 89},
    "end": {"x": 320, "y": 240, "page": 89}
  },
  "attachedText": "The key principle here is customer validation",
  "content": {
    "text": "This reminds me of the lean startup methodology. **Key insight**: Always validate before building.",
    "format": "markdown"
  },
  "tags": ["validation", "lean_startup"],
  "template": "insight"
}
```

### Create Voice Note
```http
POST /books/{bookId}/annotations
Authorization: Bearer {accessToken}
Content-Type: multipart/form-data

type: voice_note
pageNumber: 89
position: {"x": 120, "y": 200}
duration: 45
transcript: "This section really resonates with my experience at the startup"
audioFile: [audio file data]
```

### Create Drawing Annotation
```http
POST /books/{bookId}/annotations
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "type": "drawing",
  "pageNumber": 89,
  "position": {
    "x": 120,
    "y": 200,
    "width": 200,
    "height": 150
  },
  "drawingData": {
    "strokes": [
      {
        "points": [{"x": 0, "y": 0, "pressure": 0.5}, {"x": 10, "y": 5, "pressure": 0.7}],
        "color": "#FF0000",
        "width": 2,
        "tool": "pen"
      }
    ],
    "bounds": {"x": 0, "y": 0, "width": 200, "height": 150}
  }
}
```

### Get Book Annotations
```http
GET /books/{bookId}/annotations
Authorization: Bearer {accessToken}
```

**Response**:
```json
{
  "annotations": [
    {
      "id": "annotation-uuid",
      "type": "highlight",
      "pageNumber": 45,
      "selectedText": "This is the highlighted text",
      "color": "#FFD700",
      "note": "Important concept for later reference",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Update Annotation
```http
PUT /books/{bookId}/annotations/{annotationId}
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "note": "Updated note content",
  "color": "#FF6B6B"
}
```

### Delete Annotation
```http
DELETE /books/{bookId}/annotations/{annotationId}
Authorization: Bearer {accessToken}
```

## 🤖 AI Features API

### Ask Question
```http
POST /books/{bookId}/ai/question
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "question": "What are the main themes in this chapter?",
  "context": {
    "currentPage": 45,
    "chapterId": "chapter-3"
  }
}
```

**Response**:
```json
{
  "response": {
    "id": "ai-response-uuid",
    "answer": "The main themes in this chapter include...",
    "sources": [
      {
        "pageNumber": 42,
        "text": "Source text that supports the answer",
        "relevanceScore": 0.95
      }
    ],
    "confidence": 0.87,
    "responseTime": 1245,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Generate Summary
```http
POST /books/{bookId}/ai/summary
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "selection": {
    "startPage": 40,
    "endPage": 50,
    "chapterId": "chapter-3"
  },
  "length": "detailed",
  "focus": "key_concepts"
}
```

**Response**:
```json
{
  "summary": {
    "id": "summary-uuid",
    "content": "This section covers the fundamental concepts...",
    "keyPoints": [
      "First main point",
      "Second main point",
      "Third main point"
    ],
    "wordCount": 245,
    "readingTime": 2,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Explain Concept
```http
POST /books/{bookId}/ai/explain
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "text": "quantum entanglement",
  "context": {
    "pageNumber": 67,
    "surroundingText": "...context around the concept..."
  },
  "difficulty": "beginner"
}
```

**Response**:
```json
{
  "explanation": {
    "id": "explanation-uuid",
    "simpleDefinition": "Quantum entanglement is...",
    "detailedExplanation": "In more detail, this concept...",
    "examples": [
      "Real-world example 1",
      "Real-world example 2"
    ],
    "relatedConcepts": ["quantum mechanics", "superposition"],
    "difficulty": "beginner",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Get AI History
```http
GET /books/{bookId}/ai/history
Authorization: Bearer {accessToken}
```

**Response**:
```json
{
  "conversations": [
    {
      "id": "conversation-uuid",
      "question": "What are the main themes?",
      "answer": "The main themes include...",
      "createdAt": "2024-01-15T10:30:00Z",
      "userRating": 4
    }
  ]
}
```

## 📊 Reading Analytics API

### Update Reading Progress
```http
POST /books/{bookId}/progress
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "currentPage": 127,
  "sessionDuration": 1800,
  "wordsRead": 2500,
  "pagesRead": 8
}
```

### Get Reading Statistics
```http
GET /users/me/stats
Authorization: Bearer {accessToken}
```

**Response**:
```json
{
  "stats": {
    "totalBooksRead": 24,
    "totalReadingTime": 185400,
    "averageSessionDuration": 1650,
    "booksThisMonth": 3,
    "readingStreak": 12,
    "favoriteGenres": ["technology", "science", "business"],
    "readingGoals": {
      "dailyMinutes": 60,
      "monthlyBooks": 4,
      "progress": {
        "dailyProgress": 0.75,
        "monthlyProgress": 0.85
      }
    }
  }
}
```

## 🔄 Synchronization API

### Sync Annotations
```http
POST /sync/annotations
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "deviceId": "device-uuid",
  "lastSyncTimestamp": "2024-01-15T10:00:00Z",
  "changes": [
    {
      "operation": "create",
      "annotation": {
        "id": "local-annotation-uuid",
        "bookId": "book-uuid",
        "type": "highlight",
        "content": "annotation content",
        "timestamp": "2024-01-15T10:15:00Z"
      }
    }
  ]
}
```

**Response**:
```json
{
  "syncResult": {
    "conflicts": [],
    "applied": [
      {
        "localId": "local-annotation-uuid",
        "serverId": "server-annotation-uuid",
        "status": "created"
      }
    ],
    "serverChanges": [
      {
        "operation": "create",
        "annotation": {
          "id": "server-annotation-uuid",
          "content": "annotation from another device"
        }
      }
    ],
    "newSyncTimestamp": "2024-01-15T10:30:00Z"
  }
}
```

## 👤 User Preferences API

### Get User Preferences
```http
GET /users/me/preferences
Authorization: Bearer {accessToken}
```

**Response**:
```json
{
  "preferences": {
    "reading": {
      "theme": "dark",
      "fontSize": 16,
      "fontFamily": "Georgia",
      "lineSpacing": 1.5,
      "pageTransition": "slide"
    },
    "ai": {
      "responseLength": "detailed",
      "autoSummary": true,
      "contextLength": "medium",
      "language": "en"
    },
    "notifications": {
      "readingReminders": true,
      "goalNotifications": true,
      "newFeatures": false
    }
  }
}
```

### Update User Preferences
```http
PUT /users/me/preferences
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "reading": {
    "theme": "sepia",
    "fontSize": 18
  }
}
```

## 📡 WebSocket API

### Connection
```javascript
const ws = new WebSocket('wss://api.bookmind.ai/v1/ws');

// Authentication
ws.send(JSON.stringify({
  type: 'auth',
  token: 'jwt-token'
}));
```

### Real-time Events
```javascript
// Annotation sync
{
  "type": "annotation_created",
  "bookId": "book-uuid",
  "annotation": {
    "id": "annotation-uuid",
    "type": "highlight",
    "content": "annotation content"
  }
}

// Reading progress sync
{
  "type": "progress_updated",
  "bookId": "book-uuid",
  "progress": {
    "currentPage": 127,
    "percentage": 0.65
  }
}

// AI processing status
{
  "type": "ai_processing",
  "status": "completed",
  "result": {
    "type": "summary",
    "content": "Generated summary..."
  }
}
```

## 📄 Data Models

### User Model
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  subscriptionTier: 'free' | 'pro' | 'premium';
  subscriptionExpiry?: Date;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

interface UserPreferences {
  reading: ReadingPreferences;
  ai: AIPreferences;
  notifications: NotificationPreferences;
}

interface ReadingPreferences {
  theme: 'light' | 'dark' | 'sepia';
  fontSize: number; // 12-24
  fontFamily: string;
  lineSpacing: number; // 1.0-2.0
  pageTransition: 'slide' | 'fade' | 'none';
  readingGoals: {
    dailyMinutes: number;
    weeklyBooks: number;
  };
}

interface AIPreferences {
  responseLength: 'brief' | 'detailed';
  autoSummary: boolean;
  contextLength: 'short' | 'medium' | 'long';
  language: string;
  voiceEnabled: boolean;
}
```

### Book Model
```typescript
interface Book {
  id: string;
  userId: string;
  title: string;
  author: string;
  isbn?: string;
  pageCount: number;
  fileSize: number;
  fileType: 'pdf' | 'epub' | 'mobi';
  filePath: string;
  coverUrl?: string;
  processingStatus: 'pending' | 'processing' | 'completed' | 'error';
  metadata: BookMetadata;
  uploadedAt: Date;
  lastReadAt?: Date;
}

interface BookMetadata {
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  topics: string[];
  genre: string;
  language: string;
  readingTime: number; // estimated minutes
  wordCount: number;
  chapters: Chapter[];
}

interface Chapter {
  id: string;
  title: string;
  startPage: number;
  endPage: number;
  summary?: string;
  keyPoints?: string[];
}
```

### Annotation Model
```typescript
interface Annotation {
  id: string;
  userId: string;
  bookId: string;
  type: 'highlight' | 'bookmark' | 'note';
  pageNumber: number;
  position: AnnotationPosition;
  selectedText?: string;
  content?: string; // note content
  color?: string; // for highlights
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  syncStatus: 'pending' | 'synced' | 'conflict';
}

interface AnnotationPosition {
  start: Position;
  end: Position;
}

interface Position {
  x: number;
  y: number;
  page: number;
}
```

### AI Interaction Model
```typescript
interface AIConversation {
  id: string;
  userId: string;
  bookId: string;
  question: string;
  answer: string;
  context: AIContext;
  sources: AISource[];
  confidence: number; // 0-1
  responseTime: number; // milliseconds
  userRating?: number; // 1-5
  createdAt: Date;
}

interface AIContext {
  currentPage?: number;
  chapterId?: string;
  selectedText?: string;
  conversationHistory?: string[];
}

interface AISource {
  pageNumber: number;
  text: string;
  relevanceScore: number; // 0-1
}

interface AISummary {
  id: string;
  userId: string;
  bookId: string;
  selection: SummarySelection;
  content: string;
  keyPoints: string[];
  length: 'brief' | 'detailed';
  wordCount: number;
  readingTime: number; // minutes
  createdAt: Date;
}

interface SummarySelection {
  startPage: number;
  endPage: number;
  chapterId?: string;
  customText?: string;
}
```

### Reading Session Model
```typescript
interface ReadingSession {
  id: string;
  userId: string;
  bookId: string;
  startPage: number;
  endPage: number;
  startTime: Date;
  endTime: Date;
  duration: number; // seconds
  wordsRead: number;
  annotationsCreated: number;
  aiQueriesUsed: number;
  deviceType: 'mobile' | 'tablet' | 'desktop';
}

interface ReadingProgress {
  bookId: string;
  userId: string;
  currentPage: number;
  percentage: number; // 0-1
  lastPosition?: Position;
  bookmarks: number[];
  timeSpent: number; // total seconds
  sessionsCount: number;
  lastReadAt: Date;
}
```

## 🔍 Error Handling

### Standard Error Response
```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "The request is invalid",
    "details": {
      "field": "email",
      "reason": "Email format is invalid"
    },
    "timestamp": "2024-01-15T10:30:00Z",
    "requestId": "req-uuid"
  }
}
```

### Common Error Codes
- `AUTHENTICATION_REQUIRED` (401)
- `INSUFFICIENT_PERMISSIONS` (403)
- `RESOURCE_NOT_FOUND` (404)
- `RATE_LIMIT_EXCEEDED` (429)
- `SUBSCRIPTION_REQUIRED` (402)
- `PROCESSING_ERROR` (422)
- `INTERNAL_SERVER_ERROR` (500)

## 📏 Rate Limiting

### Limits by Tier
```
Free Tier:
- General API: 1,000 requests/hour
- AI Features: 50 requests/hour
- File Upload: 10 files/day

Pro Tier:
- General API: 10,000 requests/hour
- AI Features: 500 requests/hour
- File Upload: 100 files/day

Premium Tier:
- General API: 50,000 requests/hour
- AI Features: 2,000 requests/hour
- File Upload: Unlimited
```

### Rate Limit Headers
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 847
X-RateLimit-Reset: 1642251600
X-RateLimit-Tier: free
```

This comprehensive API specification provides all the endpoints and data models needed to build BookMind's frontend applications and integrate with third-party services.