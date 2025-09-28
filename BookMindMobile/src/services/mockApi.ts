// Mock API Service for BookMind Development
import { Book, User, Highlight, Bookmark, Annotation, ChatMessage, BookSummary } from '../types';

// Simulated network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'demo@bookmind.app',
    username: 'demo_user',
    firstName: 'Demo',
    lastName: 'User',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
    subscriptionTier: 'premium',
    onboardingCompleted: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    email: 'reader@example.com',
    username: 'bookworm',
    firstName: 'Jane',
    lastName: 'Reader',
    subscriptionTier: 'free',
    onboardingCompleted: false,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  }
];

export const mockBooks: Book[] = [
  {
    id: '1',
    title: 'The Lean Startup',
    author: 'Eric Ries',
    description: 'A methodology for developing businesses and products that aims to shorten product development cycles and rapidly discover if a proposed business model is viable.',
    coverUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop',
    fileName: 'lean_startup.pdf',
    fileFormat: 'pdf',
    fileSize: 2048000,
    pageCount: 336,
    wordCount: 85000,
    isbn: '9780307887894',
    publisher: 'Crown Business',
    publicationDate: '2011-09-13',
    language: 'en',
    processingStatus: 'completed',
    uploadedAt: '2024-01-15T10:00:00Z',
    lastReadAt: '2024-01-16T14:30:00Z',
    readingProgress: 43,
    estimatedReadingTime: 340,
    tags: ['business', 'entrepreneurship', 'startup', 'innovation'],
    isFavorite: true,
    aiEnhanced: true,
  },
  {
    id: '2',
    title: 'Atomic Habits',
    author: 'James Clear',
    description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones. A transformative book about the compound effect of small changes.',
    coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop',
    fileName: 'atomic_habits.epub',
    fileFormat: 'epub',
    fileSize: 3072000,
    pageCount: 320,
    wordCount: 80000,
    isbn: '9780735211292',
    publisher: 'Avery',
    publicationDate: '2018-10-16',
    language: 'en',
    processingStatus: 'completed',
    uploadedAt: '2024-01-10T09:15:00Z',
    lastReadAt: '2024-01-17T20:45:00Z',
    readingProgress: 78,
    estimatedReadingTime: 320,
    tags: ['self-help', 'productivity', 'psychology', 'habits'],
    isFavorite: true,
    aiEnhanced: false,
  },
  {
    id: '3',
    title: 'Dune',
    author: 'Frank Herbert',
    description: 'A 1965 epic science fiction novel set in the distant future amidst a feudal interstellar society.',
    coverUrl: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=300&h=400&fit=crop',
    fileName: 'dune.pdf',
    fileFormat: 'pdf',
    fileSize: 4096000,
    pageCount: 688,
    wordCount: 185000,
    isbn: '9780441172719',
    publisher: 'Ace Books',
    publicationDate: '1965-08-01',
    language: 'en',
    processingStatus: 'completed',
    uploadedAt: '2024-01-05T16:20:00Z',
    readingProgress: 12,
    estimatedReadingTime: 740,
    tags: ['science fiction', 'adventure', 'classics', 'space opera'],
    isFavorite: false,
    aiEnhanced: false,
  },
  {
    id: '4',
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    description: 'Timeless lessons on wealth, greed, and happiness from one of the most important financial writers.',
    coverUrl: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=300&h=400&fit=crop',
    fileName: 'psychology_of_money.epub',
    fileFormat: 'epub',
    fileSize: 2560000,
    pageCount: 256,
    wordCount: 60000,
    isbn: '9780857197689',
    publisher: 'Harriman House',
    publicationDate: '2020-09-08',
    language: 'en',
    processingStatus: 'completed',
    uploadedAt: '2024-01-12T11:30:00Z',
    readingProgress: 0,
    estimatedReadingTime: 240,
    tags: ['finance', 'psychology', 'investing', 'personal development'],
    isFavorite: false,
    aiEnhanced: true,
  },
  {
    id: '5',
    title: 'The Art of War',
    author: 'Sun Tzu',
    description: 'An ancient Chinese military treatise dating from the Late Spring and Autumn period, roughly 5th century BC.',
    coverUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop',
    fileName: 'art_of_war.pdf',
    fileFormat: 'pdf',
    fileSize: 2048000,
    pageCount: 156,
    wordCount: 45000,
    isbn: '9780486254944',
    publisher: 'Dover Publications',
    publicationDate: '1994-03-01',
    language: 'en',
    processingStatus: 'completed',
    uploadedAt: '2024-01-15T10:00:00Z',
    lastReadAt: '2024-01-16T14:30:00Z',
    readingProgress: 35,
    estimatedReadingTime: 180,
    tags: ['strategy', 'philosophy', 'classics', 'military'],
    isFavorite: true,
    aiEnhanced: false,
  },
  {
    id: '6',
    title: 'The Crushing Sreeinb',
    author: 'Unknown Author',
    description: 'A mysterious book with an intriguing title.',
    coverUrl: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=300&h=400&fit=crop',
    fileName: 'crushing_sreeinb.pdf',
    fileFormat: 'pdf',
    fileSize: 2048000,
    pageCount: 200,
    wordCount: 50000,
    language: 'en',
    processingStatus: 'completed',
    uploadedAt: '2024-01-15T10:00:00Z',
    readingProgress: 0,
    estimatedReadingTime: 200,
    tags: ['mystery', 'fiction'],
    isFavorite: false,
    aiEnhanced: false,
  },
  {
    id: '7',
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    description: 'A groundbreaking tour of the mind and explains the two systems that drive the way we think.',
    coverUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop',
    fileName: 'thinking_fast_slow.pdf',
    fileFormat: 'pdf',
    fileSize: 3072000,
    pageCount: 499,
    wordCount: 120000,
    isbn: '9780374533557',
    publisher: 'Farrar, Straus and Giroux',
    publicationDate: '2011-10-25',
    language: 'en',
    processingStatus: 'completed',
    uploadedAt: '2024-01-08T14:20:00Z',
    readingProgress: 25,
    estimatedReadingTime: 480,
    tags: ['psychology', 'cognitive science', 'decision making'],
    isFavorite: true,
    aiEnhanced: true,
  },
  {
    id: '8',
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    description: 'A brief history of humankind, exploring how Homo sapiens came to dominate the world.',
    coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop',
    fileName: 'sapiens.epub',
    fileFormat: 'epub',
    fileSize: 4096000,
    pageCount: 443,
    wordCount: 150000,
    isbn: '9780062316097',
    publisher: 'Harper',
    publicationDate: '2015-02-10',
    language: 'en',
    processingStatus: 'completed',
    uploadedAt: '2024-01-12T09:45:00Z',
    readingProgress: 15,
    estimatedReadingTime: 600,
    tags: ['history', 'anthropology', 'evolution', 'society'],
    isFavorite: false,
    aiEnhanced: false,
  }
];

export const mockHighlights: Record<string, Highlight[]> = {
  '1': [
    {
      id: 'h1',
      bookId: '1',
      userId: 'user1',
      text: 'All warfare is based on deception.',
      color: 'yellow',
      category: 'important',
      startPosition: 1250,
      endPosition: 1285,
      pageNumber: 15,
      note: 'Key principle of strategic thinking - applicable to business and life.',
      createdAt: '2024-01-16T10:30:00Z',
      updatedAt: '2024-01-16T10:30:00Z',
    },
    {
      id: 'h2',
      bookId: '1',
      userId: 'user1',
      text: 'Supreme excellence consists of breaking the enemy\'s resistance without fighting.',
      color: 'purple',
      category: 'quote',
      startPosition: 2100,
      endPosition: 2185,
      pageNumber: 25,
      note: 'Perfect strategy - win without conflict.',
      createdAt: '2024-01-16T11:15:00Z',
      updatedAt: '2024-01-16T11:15:00Z',
    },
    {
      id: 'h3',
      bookId: '1',
      userId: 'user1',
      text: 'Know your enemy and know yourself, and you will not be imperiled in a hundred battles.',
      color: 'blue',
      category: 'important',
      startPosition: 3400,
      endPosition: 3495,
      pageNumber: 42,
      note: 'Self-awareness is crucial for success.',
      createdAt: '2024-01-16T14:20:00Z',
      updatedAt: '2024-01-16T14:20:00Z',
    }
  ],
  '2': [
    {
      id: 'h4',
      bookId: '2',
      userId: 'user1',
      text: 'You do not rise to the level of your goals. You fall to the level of your systems.',
      color: 'yellow',
      category: 'important',
      startPosition: 5600,
      endPosition: 5690,
      pageNumber: 45,
      note: 'Focus on building systems, not just setting goals.',
      createdAt: '2024-01-17T09:20:00Z',
      updatedAt: '2024-01-17T09:20:00Z',
    },
    {
      id: 'h5',
      bookId: '2',
      userId: 'user1',
      text: 'Every action you take is a vote for the type of person you wish to become.',
      color: 'green',
      category: 'personal',
      startPosition: 8200,
      endPosition: 8285,
      pageNumber: 78,
      note: 'Identity-based habits are more powerful.',
      createdAt: '2024-01-17T15:45:00Z',
      updatedAt: '2024-01-17T15:45:00Z',
    }
  ]
};

export const mockBookmarks: Record<string, Bookmark[]> = {
  '1': [
    {
      id: 'b1',
      bookId: '1',
      userId: 'user1',
      title: 'Chapter 3: Planning Attacks',
      pageNumber: 45,
      position: 3250,
      type: 'manual',
      note: 'Important chapter on strategic planning',
      createdAt: '2024-01-16T12:00:00Z',
    },
    {
      id: 'b2',
      bookId: '1',
      userId: 'user1',
      title: 'Current Position',
      pageNumber: 55,
      position: 4100,
      type: 'auto',
      createdAt: '2024-01-16T14:30:00Z',
    }
  ],
  '2': [
    {
      id: 'b3',
      bookId: '2',
      userId: 'user1',
      title: 'The 1% Rule',
      pageNumber: 32,
      position: 2850,
      type: 'favorite',
      note: 'Core concept of the book',
      createdAt: '2024-01-17T08:15:00Z',
    },
    {
      id: 'b4',
      bookId: '2',
      userId: 'user1',
      title: 'Current Reading Position',
      pageNumber: 218,
      position: 12500,
      type: 'auto',
      createdAt: '2024-01-17T20:45:00Z',
    }
  ]
};

export const mockChatMessages: Record<string, ChatMessage[]> = {
  '1': [
    {
      id: 'msg1',
      role: 'user',
      content: 'What are the main principles of strategy according to Sun Tzu?',
      timestamp: '2024-01-16T13:00:00Z',
    },
    {
      id: 'msg2',
      role: 'assistant',
      content: 'According to Sun Tzu in "The Art of War," the main principles of strategy include:\n\n1. **Deception and Misdirection** - "All warfare is based on deception"\n2. **Winning without Fighting** - The supreme excellence is to subdue the enemy without fighting\n3. **Know Yourself and Your Enemy** - Understanding both sides prevents defeat\n4. **Speed and Timing** - Rapidity is the essence of war\n5. **Adaptability** - Like water, be flexible and adapt to circumstances\n\nThese principles apply not just to military strategy but to business, negotiations, and life decisions.',
      timestamp: '2024-01-16T13:00:15Z',
      context: {
        pageNumber: 25,
        selectedText: 'Supreme excellence consists of breaking the enemy\'s resistance without fighting.'
      }
    }
  ],
  '2': [
    {
      id: 'msg3',
      role: 'user',
      content: 'How can I apply the 1% rule to my daily routine?',
      timestamp: '2024-01-17T16:30:00Z',
    },
    {
      id: 'msg4',
      role: 'assistant',
      content: 'The 1% rule from "Atomic Habits" can be applied to your daily routine in these ways:\n\n**Start Small:**\n- Exercise: Start with 1 push-up, not 1 hour at the gym\n- Reading: Read 1 page, not 1 chapter\n- Meditation: 1 minute, not 10 minutes\n\n**Focus on Systems:**\n- Create a habit stack (link new habits to existing ones)\n- Design your environment to make good habits obvious\n- Make it satisfying with immediate rewards\n\n**Track Progress:**\n- Use a habit tracker\n- Celebrate small wins\n- Don\'t break the chain\n\nRemember: 1% better every day = 37x better in a year!',
      timestamp: '2024-01-17T16:30:20Z',
      context: {
        pageNumber: 32,
      }
    }
  ]
};

// Mock API Class
export class MockApi {
  // Authentication
  static async login(email: string, password: string): Promise<{ user: User; token: string }> {
    await delay(1000);

    const user = mockUsers.find(u => u.email === email);
    if (!user || password !== 'demo123') {
      throw new Error('Invalid credentials');
    }

    return {
      user,
      token: `mock_token_${user.id}_${Date.now()}`
    };
  }

  static async register(email: string, password: string, username: string): Promise<{ user: User; token: string }> {
    await delay(1200);

    if (mockUsers.find(u => u.email === email)) {
      throw new Error('Email already exists');
    }

    const newUser: User = {
      id: String(mockUsers.length + 1),
      email,
      username,
      subscriptionTier: 'free',
      onboardingCompleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockUsers.push(newUser);

    return {
      user: newUser,
      token: `mock_token_${newUser.id}_${Date.now()}`
    };
  }

  // Books
  static async getBooks(): Promise<Book[]> {
    await delay(800);
    return [...mockBooks];
  }

  static async getBook(bookId: string): Promise<Book | null> {
    await delay(500);
    return mockBooks.find(book => book.id === bookId) || null;
  }

  static async uploadBook(file: any): Promise<Book> {
    await delay(3000); // Simulate longer upload time

    const newBook: Book = {
      id: String(mockBooks.length + 1),
      title: file.name.split('.')[0],
      author: 'Unknown Author',
      fileName: file.name,
      fileFormat: file.name.split('.').pop() as any,
      fileSize: file.size || 1024000,
      language: 'en',
      processingStatus: 'pending',
      uploadedAt: new Date().toISOString(),
      readingProgress: 0,
      tags: [],
    };

    // Simulate processing
    setTimeout(() => {
      newBook.processingStatus = 'completed';
      newBook.pageCount = Math.floor(Math.random() * 400) + 100;
      newBook.wordCount = Math.floor(Math.random() * 80000) + 20000;
      newBook.estimatedReadingTime = Math.floor(newBook.wordCount / 250);
    }, 5000);

    mockBooks.push(newBook);
    return newBook;
  }

  // Highlights
  static async getHighlights(bookId: string): Promise<Highlight[]> {
    await delay(400);
    return mockHighlights[bookId] || [];
  }

  static async addHighlight(highlight: Omit<Highlight, 'id' | 'createdAt' | 'updatedAt'>): Promise<Highlight> {
    await delay(300);

    const newHighlight: Highlight = {
      ...highlight,
      id: `h${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (!mockHighlights[highlight.bookId]) {
      mockHighlights[highlight.bookId] = [];
    }
    mockHighlights[highlight.bookId].push(newHighlight);

    return newHighlight;
  }

  // Bookmarks
  static async getBookmarks(bookId: string): Promise<Bookmark[]> {
    await delay(400);
    return mockBookmarks[bookId] || [];
  }

  static async addBookmark(bookmark: Omit<Bookmark, 'id' | 'createdAt'>): Promise<Bookmark> {
    await delay(300);

    const newBookmark: Bookmark = {
      ...bookmark,
      id: `b${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    if (!mockBookmarks[bookmark.bookId]) {
      mockBookmarks[bookmark.bookId] = [];
    }
    mockBookmarks[bookmark.bookId].push(newBookmark);

    return newBookmark;
  }

  // AI Chat
  static async getChatHistory(bookId: string): Promise<ChatMessage[]> {
    await delay(500);
    return mockChatMessages[bookId] || [];
  }

  static async sendChatMessage(bookId: string, message: string, context?: any): Promise<ChatMessage> {
    await delay(1500); // Simulate AI processing time

    const userMessage: ChatMessage = {
      id: `msg_user_${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
      context,
    };

    // Mock AI response
    const aiResponse: ChatMessage = {
      id: `msg_ai_${Date.now()}`,
      role: 'assistant',
      content: this.generateMockAIResponse(message, bookId),
      timestamp: new Date().toISOString(),
    };

    if (!mockChatMessages[bookId]) {
      mockChatMessages[bookId] = [];
    }

    mockChatMessages[bookId].push(userMessage, aiResponse);

    return aiResponse;
  }

  private static generateMockAIResponse(question: string, bookId: string): string {
    const book = mockBooks.find(b => b.id === bookId);
    const responses = [
      `Based on "${book?.title}" by ${book?.author}, here's what I found relevant to your question...`,
      `That's an excellent question about the themes in this book. Let me break it down for you...`,
      `According to the text, this concept is explained in detail. Here's a summary...`,
      `This reminds me of a key passage from chapter 3 where the author discusses...`,
    ];

    return responses[Math.floor(Math.random() * responses.length)] +
           `\n\nI've analyzed the context around your question and found several relevant insights that might help clarify this topic for you.`;
  }

  // Summary Generation
  static async generateSummary(bookId: string, type: 'chapter' | 'section' | 'custom', content?: string): Promise<BookSummary> {
    await delay(2000); // Simulate AI processing

    const book = mockBooks.find(b => b.id === bookId);

    return {
      id: `summary_${Date.now()}`,
      bookId,
      type,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Summary`,
      content: `This is a mock summary of ${book?.title}. The key points include the main themes, important concepts, and actionable insights from this ${type}.`,
      length: 'detailed',
      generatedAt: new Date().toISOString(),
    };
  }

  // Search
  static async searchBooks(query: string): Promise<Book[]> {
    await delay(600);

    const searchTerms = query.toLowerCase().split(' ');
    return mockBooks.filter(book =>
      searchTerms.some(term =>
        book.title.toLowerCase().includes(term) ||
        book.author.toLowerCase().includes(term) ||
        book.tags.some(tag => tag.toLowerCase().includes(term))
      )
    );
  }

  static async searchHighlights(query: string, bookId?: string): Promise<Highlight[]> {
    await delay(500);

    let allHighlights: Highlight[] = [];

    if (bookId) {
      allHighlights = mockHighlights[bookId] || [];
    } else {
      allHighlights = Object.values(mockHighlights).flat();
    }

    return allHighlights.filter(highlight =>
      highlight.text.toLowerCase().includes(query.toLowerCase()) ||
      highlight.note?.toLowerCase().includes(query.toLowerCase())
    );
  }
}