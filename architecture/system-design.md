# 🏗️ BookMind - Technical Architecture & System Design

## 🎯 Architecture Overview

BookMind follows a modern, mobile-first architecture designed for iOS and Android tablets and phones with intelligent AI integration. The system prioritizes performance, offline capability, and seamless user experience across mobile devices.

**Recommended Tech Stack**: React Native + Ruby on Rails

```
┌─────────────────┐    ┌─────────────────┐
│   iOS App       │    │   Android App   │
│ (React Native)  │    │ (React Native)  │
│ Phone + Tablet  │    │ Phone + Tablet  │
└─────────────────┘    └─────────────────┘
         │                       │
         └───────────────────────┼
                                 │
              ┌─────────────────────────────────────┐
              │         Ruby on Rails API           │
              │      (JSON API + Action Cable)     │
              └─────────────────────────────────────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                       │                        │
┌───────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  User Service │    │  Book Service   │    │   AI Service    │
│ (Devise API)  │    │(Active Storage) │    │ (OpenAI/Ruby)   │
└───────────────┘    └─────────────────┘    └─────────────────┘
        │                       │                        │
┌───────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  PostgreSQL   │    │  Cloudflare R2  │    │   Pinecone      │
│ + pg_vector   │    │  File Storage   │    │ Vector Database │
└───────────────┘    └─────────────────┘    └─────────────────┘
```

## 📱 Frontend Architecture

### React Native + Expo Framework (Mobile + Tablet Focus)

**Why This Choice for Mobile/Tablet**:
- **Single Codebase**: iOS and Android from one React Native codebase
- **Native Performance**: Smooth 60fps reading experience on mobile devices
- **Tablet Optimization**: Excellent support for iPad and Android tablets
- **Touch-First Design**: Perfect for highlighting, gestures, and reading
- **Offline Capability**: Essential for reading apps
- **Development Speed**: Hot reload, over-the-air updates for quick iterations

**Core Dependencies for BookMind**:
```json
{
  "expo": "~49.0.0",
  "react-native": "0.72.6",
  "typescript": "^5.1.3",

  // Reading & File Handling
  "react-native-pdf": "^6.7.4",
  "react-native-document-picker": "^9.0.1",
  "react-native-fs": "^2.20.0",
  "expo-file-system": "~15.4.4",

  // Gestures & Interactions
  "react-native-gesture-handler": "~2.12.0",
  "react-native-reanimated": "~3.3.0",
  "react-native-vector-icons": "^10.0.0",

  // State & Data Management
  "@tanstack/react-query": "^4.32.6",
  "zustand": "^4.4.1",
  "@react-native-async-storage/async-storage": "1.19.3",

  // Navigation & UI
  "@react-navigation/native": "^6.1.7",
  "@react-navigation/bottom-tabs": "^6.5.8",
  "react-native-safe-area-context": "4.6.3"
}
```

### State Management
**Zustand + React Query**:
```typescript
// Global State Structure
interface AppState {
  auth: AuthState;           // User authentication
  library: LibraryState;     // Book collection
  reader: ReaderState;       // Current reading session
  ai: AIState;              // AI chat history & settings
  sync: SyncState;          // Synchronization status
  preferences: PrefsState;   // User customization
}

// Reading Session State
interface ReaderState {
  currentBook: Book | null;
  currentPage: number;
  highlights: Highlight[];
  bookmarks: Bookmark[];
  notes: Note[];
  aiChat: ChatMessage[];
  readingProgress: number;
}
```

### Offline-First Architecture
```typescript
// Local Database Schema (SQLite)
const localSchema = {
  books: {
    id: 'string',
    title: 'string',
    author: 'string',
    filePath: 'string',
    lastOpened: 'datetime',
    syncStatus: 'pending' | 'synced' | 'error'
  },
  annotations: {
    id: 'string',
    bookId: 'string',
    type: 'highlight' | 'bookmark' | 'note',
    position: 'object',
    content: 'text',
    createdAt: 'datetime',
    syncStatus: 'pending' | 'synced'
  },
  aiChats: {
    id: 'string',
    bookId: 'string',
    question: 'text',
    answer: 'text',
    context: 'text',
    timestamp: 'datetime'
  }
};
```

## 🔧 Backend Architecture

### Ruby on Rails API with Service Objects

#### Rails Application Structure
```ruby
# Gemfile - Core Dependencies
gem 'rails', '~> 7.1.0'
gem 'pg', '~> 1.1'                    # PostgreSQL database
gem 'devise-api'                      # Authentication
gem 'jwt'                             # JWT tokens
gem 'sidekiq'                         # Background jobs
gem 'redis'                           # Caching and sessions
gem 'image_processing'                # Image thumbnails
gem 'aws-sdk-s3'                      # File storage
gem 'ruby-openai'                     # AI integration
gem 'pg_search'                       # Full-text search
gem 'rack-cors'                       # CORS for mobile
gem 'actioncable'                     # WebSocket for real-time sync
```

#### 1. User Management (Devise API)
**Responsibilities**: Authentication, user preferences, subscription management

```ruby
# app/controllers/api/v1/auth_controller.rb
class Api::V1::AuthController < ApplicationController
  def register
    user = User.create!(user_params)
    token = generate_token(user)
    render json: { user: UserSerializer.new(user), token: token }
  end

  def login
    user = User.find_by!(email: params[:email])
    if user&.valid_password?(params[:password])
      token = generate_token(user)
      render json: { user: UserSerializer.new(user), token: token }
    else
      render json: { error: 'Invalid credentials' }, status: :unauthorized
    end
  end

  private

  def generate_token(user)
    JWT.encode({ user_id: user.id, exp: 30.days.from_now.to_i }, Rails.application.secret_key_base)
  end
end

# app/models/user.rb
class User < ApplicationRecord
  devise :database_authenticatable, :registerable

  has_many :books, dependent: :destroy
  has_many :highlights, dependent: :destroy
  has_many :bookmarks, dependent: :destroy
  has_many :reading_sessions, dependent: :destroy

  enum subscription_tier: { free: 0, pro: 1, premium: 2 }
end
```

interface UserPreferences {
  theme: 'light' | 'dark' | 'sepia';
  fontSize: number;
  fontFamily: string;
  lineSpacing: number;
  readingGoals: {
    dailyMinutes: number;
    weeklyBooks: number;
  };
  aiSettings: {
    responseLength: 'brief' | 'detailed';
    autoSummary: boolean;
    voiceEnabled: boolean;
  };
}
```

#### 2. Book Service
**Responsibilities**: Book storage, content processing, synchronization

```typescript
class BookService {
  // Book Management
  async uploadBook(userId: string, file: Buffer, metadata: BookMetadata): Promise<Book>
  async getUserBooks(userId: string): Promise<Book[]>
  async deleteBook(userId: string, bookId: string): Promise<void>

  // Content Processing
  async processBookContent(bookId: string): Promise<ProcessedContent>
  async extractText(bookId: string): Promise<string>
  async generateEmbeddings(bookId: string): Promise<void>

  // Synchronization
  async syncAnnotations(userId: string, annotations: Annotation[]): Promise<SyncResult>
  async getAnnotations(userId: string, bookId: string): Promise<Annotation[]>
}

interface ProcessedContent {
  chapters: Chapter[];
  totalPages: number;
  readingTime: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  topics: string[];
  embeddings: number[][];
}
```

#### 3. AI Service
**Responsibilities**: Natural language processing, RAG pipeline, AI responses

```typescript
class AIService {
  // Q&A System
  async askQuestion(
    userId: string,
    bookId: string,
    question: string,
    context?: string
  ): Promise<AIResponse>

  // Summarization
  async generateSummary(
    bookId: string,
    selection: TextSelection,
    length: 'brief' | 'detailed'
  ): Promise<Summary>

  // Content Analysis
  async explainConcept(
    bookId: string,
    concept: string,
    userLevel: 'beginner' | 'intermediate' | 'advanced'
  ): Promise<Explanation>

  async simplifyText(
    text: string,
    targetLevel: number
  ): Promise<SimplifiedText>
}

// RAG Pipeline Implementation
class RAGPipeline {
  async processQuery(query: string, bookId: string): Promise<AIResponse> {
    // 1. Query Understanding
    const queryEmbedding = await this.embedQuery(query);

    // 2. Context Retrieval
    const relevantChunks = await this.vectorSearch(queryEmbedding, bookId);

    // 3. Context Ranking
    const rankedContext = await this.rankContext(relevantChunks, query);

    // 4. Response Generation
    const response = await this.generateResponse(query, rankedContext);

    // 5. Citation Addition
    return this.addCitations(response, rankedContext);
  }
}
```

## 💾 Data Architecture

### Primary Database (PostgreSQL)
```sql
-- User Management
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  subscription_tier VARCHAR(50) DEFAULT 'free',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Book Metadata
CREATE TABLE books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  title VARCHAR(500) NOT NULL,
  author VARCHAR(255),
  isbn VARCHAR(17),
  page_count INTEGER,
  file_size BIGINT,
  file_type VARCHAR(10),
  upload_date TIMESTAMP DEFAULT NOW(),
  processing_status VARCHAR(50) DEFAULT 'pending'
);

-- Reading Progress
CREATE TABLE reading_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  book_id UUID REFERENCES books(id),
  start_page INTEGER,
  end_page INTEGER,
  duration_minutes INTEGER,
  session_date TIMESTAMP DEFAULT NOW()
);

-- Annotations
CREATE TABLE annotations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  book_id UUID REFERENCES books(id),
  type VARCHAR(20) NOT NULL, -- 'highlight', 'bookmark', 'note'
  page_number INTEGER,
  position_data JSONB,
  content TEXT,
  color VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- AI Interactions
CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  book_id UUID REFERENCES books(id),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  context_used TEXT,
  response_time_ms INTEGER,
  user_rating INTEGER, -- 1-5 rating for response quality
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Vector Database (Pinecone)
```typescript
// Document Embedding Structure
interface DocumentChunk {
  id: string;              // Unique chunk identifier
  bookId: string;          // Reference to book
  chapterTitle: string;    // Chapter name
  pageNumber: number;      // Page reference
  content: string;         // Actual text content
  embedding: number[];     // 1536-dim vector (OpenAI ada-002)
  metadata: {
    wordCount: number;
    difficulty: number;
    topics: string[];
    concepts: string[];
  };
}

// Vector Search Implementation
class VectorSearch {
  async searchSimilar(
    query: string,
    bookId: string,
    topK: number = 5
  ): Promise<DocumentChunk[]> {
    const queryEmbedding = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: query
    });

    const results = await pinecone.query({
      vector: queryEmbedding.data[0].embedding,
      filter: { bookId: { $eq: bookId } },
      topK,
      includeMetadata: true
    });

    return results.matches.map(match => ({
      ...match.metadata as DocumentChunk,
      similarity: match.score
    }));
  }
}
```

### File Storage (CloudFlare R2)
```typescript
// File Organization Structure
const fileStructure = {
  books: {
    original: '/books/original/{userId}/{bookId}.{extension}',
    processed: '/books/processed/{userId}/{bookId}/',
    thumbnails: '/books/thumbnails/{userId}/{bookId}.jpg'
  },
  assets: {
    covers: '/covers/{bookId}.jpg',
    userContent: '/users/{userId}/'
  }
};

// CDN Configuration
const cdnConfig = {
  caching: {
    books: '7 days',      // Original files
    processed: '30 days', // Processed content
    thumbnails: '90 days' // Cover images
  },
  compression: {
    enabled: true,
    gzip: true,
    brotli: true
  }
};
```

## 🔄 Synchronization Architecture

### Real-Time Sync with Conflict Resolution
```typescript
interface SyncManager {
  // Device-to-Server Sync
  async pushChanges(changes: LocalChange[]): Promise<SyncResult>

  // Server-to-Device Sync
  async pullChanges(lastSyncTimestamp: Date): Promise<RemoteChange[]>

  // Conflict Resolution
  async resolveConflicts(conflicts: SyncConflict[]): Promise<ResolvedChange[]>
}

// Operational Transform for Real-time Annotations
class AnnotationSync {
  async syncAnnotation(annotation: Annotation): Promise<void> {
    const operation = {
      type: 'annotation_create',
      bookId: annotation.bookId,
      position: annotation.position,
      content: annotation.content,
      timestamp: Date.now(),
      deviceId: this.deviceId
    };

    // Send via WebSocket for real-time sync
    this.websocket.send(JSON.stringify(operation));

    // Store locally with pending status
    await this.localDB.insertAnnotation({
      ...annotation,
      syncStatus: 'pending'
    });
  }
}
```

## 🚀 Performance Optimizations

### Frontend Performance
```typescript
// Virtualized Reading
const VirtualizedReader = () => {
  const [visiblePages, setVisiblePages] = useState([]);

  // Only render visible pages + buffer
  const renderPage = useCallback((pageIndex: number) => {
    if (isPageVisible(pageIndex)) {
      return <Page index={pageIndex} />;
    }
    return <PlaceholderPage />;
  }, []);

  // Preload adjacent pages
  useEffect(() => {
    preloadPages(currentPage - 1, currentPage + 1);
  }, [currentPage]);
};

// Lazy AI Features
const useLazyAI = () => {
  const [aiModule, setAIModule] = useState(null);

  const loadAI = useCallback(async () => {
    if (!aiModule) {
      const module = await import('./ai/AIProcessor');
      setAIModule(module);
    }
    return aiModule;
  }, [aiModule]);

  return { loadAI };
};
```

### Backend Performance
```typescript
// Response Caching
class CacheManager {
  // Cache AI responses for common questions
  async getCachedResponse(
    bookId: string,
    questionHash: string
  ): Promise<AIResponse | null> {
    const key = `ai:${bookId}:${questionHash}`;
    return await redis.get(key);
  }

  async cacheResponse(
    bookId: string,
    questionHash: string,
    response: AIResponse
  ): Promise<void> {
    const key = `ai:${bookId}:${questionHash}`;
    await redis.setex(key, 3600, JSON.stringify(response)); // 1 hour cache
  }
}

// Database Query Optimization
class BookRepository {
  // Optimized query for user's book library
  async getUserBooksWithProgress(userId: string): Promise<BookWithProgress[]> {
    return await db.query(`
      SELECT
        b.*,
        COALESCE(rs.progress, 0) as reading_progress,
        COUNT(a.id) as annotation_count,
        MAX(rs.session_date) as last_read_date
      FROM books b
      LEFT JOIN reading_sessions rs ON b.id = rs.book_id
      LEFT JOIN annotations a ON b.id = a.book_id
      WHERE b.user_id = $1
      GROUP BY b.id, rs.progress
      ORDER BY last_read_date DESC NULLS LAST
    `, [userId]);
  }
}
```

## 🔒 Security Architecture

### Authentication & Authorization
```typescript
// JWT Token Strategy
interface AuthTokens {
  accessToken: string;  // 15-minute expiry
  refreshToken: string; // 30-day expiry
}

class AuthService {
  async generateTokens(userId: string): Promise<AuthTokens> {
    const accessToken = jwt.sign(
      { userId, type: 'access' },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId, type: 'refresh' },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '30d' }
    );

    return { accessToken, refreshToken };
  }
}

// Row-Level Security (PostgreSQL)
-- Ensure users can only access their own data
CREATE POLICY user_isolation ON books
  FOR ALL TO authenticated_user
  USING (user_id = auth.uid());

CREATE POLICY user_isolation ON annotations
  FOR ALL TO authenticated_user
  USING (user_id = auth.uid());
```

### Data Privacy
```typescript
// Encryption for Sensitive Data
class EncryptionService {
  async encryptBookContent(content: string, userId: string): Promise<string> {
    const key = await this.getUserEncryptionKey(userId);
    return crypto.encrypt(content, key);
  }

  async encryptAnnotation(annotation: string, userId: string): Promise<string> {
    const key = await this.getUserEncryptionKey(userId);
    return crypto.encrypt(annotation, key);
  }
}

// GDPR Compliance
class DataPrivacyService {
  async exportUserData(userId: string): Promise<UserDataExport> {
    return {
      profile: await this.getUserProfile(userId),
      books: await this.getUserBooks(userId),
      annotations: await this.getUserAnnotations(userId),
      aiHistory: await this.getUserAIHistory(userId),
      createdAt: new Date().toISOString()
    };
  }

  async deleteUserData(userId: string): Promise<void> {
    // Cascade delete all user data
    await Promise.all([
      this.deleteUserBooks(userId),
      this.deleteUserAnnotations(userId),
      this.deleteUserAIHistory(userId),
      this.deleteUserProfile(userId)
    ]);
  }
}
```

## 📊 Monitoring & Analytics

### Application Monitoring
```typescript
// Performance Tracking
class PerformanceMonitor {
  trackReadingSession(userId: string, sessionData: ReadingSession): void {
    analytics.track('reading_session', {
      userId,
      bookId: sessionData.bookId,
      duration: sessionData.duration,
      pagesRead: sessionData.pagesRead,
      annotationsCreated: sessionData.annotations.length,
      aiQueriesUsed: sessionData.aiQueries.length
    });
  }

  trackAIPerformance(query: string, responseTime: number, userRating?: number): void {
    metrics.histogram('ai_response_time', responseTime, {
      queryType: this.classifyQuery(query)
    });

    if (userRating) {
      metrics.gauge('ai_response_rating', userRating);
    }
  }
}

// Error Tracking
class ErrorReporter {
  reportError(error: Error, context: ErrorContext): void {
    sentry.captureException(error, {
      tags: {
        feature: context.feature,
        userId: context.userId,
        bookId: context.bookId
      },
      extra: context.additionalData
    });
  }
}
```

This comprehensive technical architecture provides the foundation for building a scalable, performant, and secure BookMind application that can handle the complex requirements of AI-powered reading while maintaining excellent user experience across all platforms.