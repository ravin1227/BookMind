// Centralized Book Data Library
// This file contains all book data used across the app

export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  description: string;
  rating: number;
  downloadCount: number;
  category: string;
  pages: number;
  publishedYear: number;
  isFree: boolean;
  price?: number;
  
  // Additional properties for different screens
  isOwned?: boolean;
  currentPage?: number;
  progress?: number;
  timeLeft?: number;
  chapter?: string;
  bookmarksCount?: number;
  highlightsCount?: number;
  lastReadAt?: string;
  readingTime?: string;
  isFavorite?: boolean;
  isbn?: string;
  publisher?: string;
  language?: string;
  tags?: string[];
}

// Comprehensive Book Library
export const BOOK_LIBRARY: Book[] = [
  // FREE CLASSICS
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780743273565-M.jpg',
    description: 'A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream through the eyes of Nick Carraway.',
    rating: 4.5,
    downloadCount: 1250000,
    category: 'Classic Literature',
    pages: 180,
    publishedYear: 1925,
    isFree: true,
    isbn: '9780743273565',
    publisher: 'Scribner',
    language: 'English',
    tags: ['classic', 'american', 'jazz age', 'wealth'],
  },
  {
    id: '2',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780061120084-M.jpg',
    description: 'A gripping tale of racial injustice and childhood innocence in the American South, told through the eyes of Scout Finch.',
    rating: 4.8,
    downloadCount: 2100000,
    category: 'Classic Literature',
    pages: 281,
    publishedYear: 1960,
    isFree: true,
    isbn: '9780061120084',
    publisher: 'J.B. Lippincott & Co.',
    language: 'English',
    tags: ['classic', 'american', 'social justice', 'coming of age'],
  },
  {
    id: '3',
    title: '1984',
    author: 'George Orwell',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780451524935-M.jpg',
    description: 'A dystopian social science fiction novel about totalitarian control and surveillance in a world where independent thinking is a crime.',
    rating: 4.7,
    downloadCount: 1800000,
    category: 'Science Fiction',
    pages: 328,
    publishedYear: 1949,
    isFree: true,
    isbn: '9780451524935',
    publisher: 'Secker & Warburg',
    language: 'English',
    tags: ['dystopian', 'political', 'surveillance', 'totalitarian'],
  },
  {
    id: '4',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780141439518-M.jpg',
    description: 'A romantic novel of manners that critiques the British landed gentry through the story of Elizabeth Bennet and Mr. Darcy.',
    rating: 4.6,
    downloadCount: 1500000,
    category: 'Romance',
    pages: 432,
    publishedYear: 1813,
    isFree: true,
    isbn: '9780141439518',
    publisher: 'T. Egerton',
    language: 'English',
    tags: ['romance', 'classic', 'british', 'social commentary'],
  },
  {
    id: '5',
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780316769174-M.jpg',
    description: 'A coming-of-age story about teenage rebellion and alienation, told through the voice of Holden Caulfield.',
    rating: 4.4,
    downloadCount: 1200000,
    category: 'Classic Literature',
    pages: 224,
    publishedYear: 1951,
    isFree: true,
    isbn: '9780316769174',
    publisher: 'Little, Brown and Company',
    language: 'English',
    tags: ['coming of age', 'rebellion', 'alienation', 'teenage'],
  },

  // PAID BESTSELLERS
  {
    id: '6',
    title: 'The Lean Startup',
    author: 'Eric Ries',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780307887894-M.jpg',
    description: 'A methodology for developing businesses and products that aims to shorten product development cycles and rapidly discover if a proposed business model is viable.',
    rating: 4.5,
    downloadCount: 850000,
    category: 'Business',
    pages: 336,
    publishedYear: 2011,
    isFree: false,
    price: 12.99,
    isbn: '9780307887894',
    publisher: 'Crown Business',
    language: 'English',
    tags: ['business', 'entrepreneurship', 'startup', 'innovation'],
    // Owned book properties
    isOwned: true,
    currentPage: 142,
    progress: 73,
    timeLeft: 23,
    chapter: 'Chapter 9: Metrics',
    bookmarksCount: 8,
    highlightsCount: 47,
    lastReadAt: '2024-01-16T14:30:00Z',
    readingTime: '24h',
    isFavorite: true,
  },
  {
    id: '7',
    title: 'Atomic Habits',
    author: 'James Clear',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780735211292-M.jpg',
    description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones. A transformative book about the compound effect of small changes.',
    rating: 4.8,
    downloadCount: 1200000,
    category: 'Self-Help',
    pages: 320,
    publishedYear: 2018,
    isFree: false,
    price: 14.99,
    isbn: '9780735211292',
    publisher: 'Avery',
    language: 'English',
    tags: ['self-help', 'productivity', 'psychology', 'habits'],
    // Owned book properties
    isOwned: true,
    currentPage: 98,
    progress: 45,
    timeLeft: 45,
    chapter: 'Chapter 6: Advanced Tactics',
    bookmarksCount: 12,
    highlightsCount: 23,
    lastReadAt: '2024-01-17T20:45:00Z',
    readingTime: '12h',
    isFavorite: false,
  },
  {
    id: '8',
    title: 'The Let Them Theory',
    author: 'Mel Robbins',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780593422186-M.jpg',
    description: 'A transformative self-help book offering powerful insights into personal growth and letting go of control.',
    rating: 4.9,
    downloadCount: 650000,
    category: 'Self-Help',
    pages: 256,
    publishedYear: 2024,
    isFree: false,
    price: 15.99,
    isbn: '9780593422186',
    publisher: 'Hay House',
    language: 'English',
    tags: ['self-help', 'personal growth', 'psychology', 'control'],
  },
  {
    id: '9',
    title: 'Sunrise on the Reaping',
    author: 'Suzanne Collins',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9781339015735-M.jpg',
    description: 'The highly anticipated return to The Hunger Games universe with a compelling new story set in Panem.',
    rating: 4.8,
    downloadCount: 1200000,
    category: 'Young Adult',
    pages: 384,
    publishedYear: 2024,
    isFree: false,
    price: 16.99,
    isbn: '9781339015735',
    publisher: 'Scholastic Press',
    language: 'English',
    tags: ['young adult', 'dystopian', 'adventure', 'hunger games'],
  },
  {
    id: '10',
    title: 'Onyx Storm',
    author: 'Rebecca Yarros',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9781649374172-M.jpg',
    description: 'The third installment in the Empyrean series, blending romance and fantasy in a thrilling narrative.',
    rating: 4.7,
    downloadCount: 950000,
    category: 'Romance',
    pages: 512,
    publishedYear: 2024,
    isFree: false,
    price: 13.99,
    isbn: '9781649374172',
    publisher: 'Entangled Publishing',
    language: 'English',
    tags: ['romance', 'fantasy', 'dragons', 'empyrean'],
  },

  // MORE PAID BOOKS
  {
    id: '11',
    title: 'Atmosphere: A Love Story',
    author: 'Brit Bennett',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780525658189-M.jpg',
    description: 'A powerful novel about family, identity, and the choices that shape our lives.',
    rating: 4.6,
    downloadCount: 780000,
    category: 'Fiction',
    pages: 288,
    publishedYear: 2024,
    isFree: false,
    price: 17.99,
    isbn: '9780525658189',
    publisher: 'Riverhead Books',
    language: 'English',
    tags: ['fiction', 'family', 'identity', 'choices'],
  },
  {
    id: '12',
    title: 'Deep Work',
    author: 'Cal Newport',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9781455586691-M.jpg',
    description: 'Rules for Focused Success in a Distracted World. Learn to focus without distraction and produce at an elite level.',
    rating: 4.3,
    downloadCount: 650000,
    category: 'Productivity',
    pages: 296,
    publishedYear: 2016,
    isFree: false,
    price: 11.99,
    isbn: '9781455586691',
    publisher: 'Grand Central Publishing',
    language: 'English',
    tags: ['productivity', 'focus', 'work', 'success'],
    // Completed book properties
    isOwned: true,
    currentPage: 296,
    progress: 100,
    timeLeft: 0,
    chapter: 'Completed',
    bookmarksCount: 15,
    highlightsCount: 34,
    lastReadAt: '2024-01-10T16:20:00Z',
    readingTime: '18h',
    isFavorite: true,
  },
  {
    id: '13',
    title: 'Think Fast and Slow',
    author: 'Daniel Kahneman',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780374533557-M.jpg',
    description: 'A groundbreaking tour of the mind and explains the two systems that drive the way we think.',
    rating: 4.4,
    downloadCount: 890000,
    category: 'Psychology',
    pages: 499,
    publishedYear: 2011,
    isFree: false,
    price: 13.99,
    isbn: '9780374533557',
    publisher: 'Farrar, Straus and Giroux',
    language: 'English',
    tags: ['psychology', 'decision making', 'cognitive science', 'behavioral economics'],
    // Currently reading
    isOwned: true,
    currentPage: 156,
    progress: 31,
    timeLeft: 67,
    chapter: 'Chapter 8: How Judgments Happen',
    bookmarksCount: 6,
    highlightsCount: 18,
    lastReadAt: '2024-01-18T09:15:00Z',
    readingTime: '32h',
    isFavorite: false,
  },
  {
    id: '14',
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780857197689-M.jpg',
    description: 'Timeless lessons on wealth, greed, and happiness. Short stories about doing well with money.',
    rating: 4.7,
    downloadCount: 720000,
    category: 'Finance',
    pages: 256,
    publishedYear: 2020,
    isFree: false,
    price: 12.99,
    isbn: '9780857197689',
    publisher: 'Harriman House',
    language: 'English',
    tags: ['finance', 'money', 'psychology', 'wealth'],
  },
  {
    id: '15',
    title: 'Dune',
    author: 'Frank Herbert',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780441013593-M.jpg',
    description: 'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world.',
    rating: 4.6,
    downloadCount: 1100000,
    category: 'Science Fiction',
    pages: 688,
    publishedYear: 1965,
    isFree: false,
    price: 14.99,
    isbn: '9780441013593',
    publisher: 'Ace Books',
    language: 'English',
    tags: ['science fiction', 'space opera', 'politics', 'religion'],
  },

  // MORE FREE CLASSICS
  {
    id: '16',
    title: 'The Adventures of Huckleberry Finn',
    author: 'Mark Twain',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780486280615-M.jpg',
    description: 'A classic American novel about a boy and a runaway slave traveling down the Mississippi River.',
    rating: 4.3,
    downloadCount: 980000,
    category: 'Classic Literature',
    pages: 366,
    publishedYear: 1884,
    isFree: true,
    isbn: '9780486280615',
    publisher: 'Chatto & Windus',
    language: 'English',
    tags: ['classic', 'american', 'adventure', 'coming of age'],
  },
  {
    id: '17',
    title: 'Moby Dick',
    author: 'Herman Melville',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780142437247-M.jpg',
    description: 'The story of Captain Ahab\'s obsessive quest for revenge against the white whale that took his leg.',
    rating: 4.2,
    downloadCount: 750000,
    category: 'Classic Literature',
    pages: 635,
    publishedYear: 1851,
    isFree: true,
    isbn: '9780142437247',
    publisher: 'Harper & Brothers',
    language: 'English',
    tags: ['classic', 'american', 'whaling', 'obsession'],
  },
  {
    id: '18',
    title: 'Jane Eyre',
    author: 'Charlotte Brontë',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780141441146-M.jpg',
    description: 'A gothic romance novel about a young governess who falls in love with her mysterious employer.',
    rating: 4.5,
    downloadCount: 1100000,
    category: 'Romance',
    pages: 532,
    publishedYear: 1847,
    isFree: true,
    isbn: '9780141441146',
    publisher: 'Smith, Elder & Co.',
    language: 'English',
    tags: ['romance', 'gothic', 'victorian', 'governess'],
  },
  {
    id: '19',
    title: 'The Picture of Dorian Gray',
    author: 'Oscar Wilde',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780141439570-M.jpg',
    description: 'A philosophical novel about a man who remains young while his portrait ages.',
    rating: 4.4,
    downloadCount: 850000,
    category: 'Classic Literature',
    pages: 254,
    publishedYear: 1890,
    isFree: true,
    isbn: '9780141439570',
    publisher: 'Ward, Lock & Co.',
    language: 'English',
    tags: ['classic', 'gothic', 'philosophy', 'aestheticism'],
  },
  {
    id: '20',
    title: 'Frankenstein',
    author: 'Mary Shelley',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780486282114-M.jpg',
    description: 'The story of Victor Frankenstein and the creature he brings to life through scientific experimentation.',
    rating: 4.3,
    downloadCount: 920000,
    category: 'Science Fiction',
    pages: 280,
    publishedYear: 1818,
    isFree: true,
    isbn: '9780486282114',
    publisher: 'Lackington, Hughes, Harding, Mavor & Jones',
    language: 'English',
    tags: ['science fiction', 'gothic', 'horror', 'creation'],
  },
];

// Helper functions to get books for different screens
export const getBooksForDiscover = (): Book[] => {
  return BOOK_LIBRARY.filter(book => !book.isOwned);
};

export const getBooksForLibrary = (): Book[] => {
  return BOOK_LIBRARY.filter(book => book.isOwned);
};

export const getBooksForHomeContinueReading = (): Book[] => {
  return BOOK_LIBRARY.filter(book => 
    book.isOwned && 
    book.progress && 
    book.progress > 0 && 
    book.progress < 100
  );
};

export const getBooksForHomeNextToRead = (): Book[] => {
  return BOOK_LIBRARY.filter(book => 
    book.isOwned && 
    (!book.progress || book.progress === 0)
  ).slice(0, 6);
};

export const getBooksForHomeRecentlyFinished = (): Book[] => {
  return BOOK_LIBRARY.filter(book => 
    book.isOwned && 
    book.progress === 100
  ).slice(0, 4);
};

export const getBooksByCategory = (category: string): Book[] => {
  return BOOK_LIBRARY.filter(book => book.category === category);
};

export const getFreeBooks = (): Book[] => {
  return BOOK_LIBRARY.filter(book => book.isFree);
};

export const getPaidBooks = (): Book[] => {
  return BOOK_LIBRARY.filter(book => !book.isFree);
};

export const getBookById = (id: string): Book | undefined => {
  return BOOK_LIBRARY.find(book => book.id === id);
};

export const searchBooks = (query: string): Book[] => {
  const lowercaseQuery = query.toLowerCase();
  return BOOK_LIBRARY.filter(book => 
    book.title.toLowerCase().includes(lowercaseQuery) ||
    book.author.toLowerCase().includes(lowercaseQuery) ||
    book.description.toLowerCase().includes(lowercaseQuery) ||
    book.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

// Categories for filtering
export const BOOK_CATEGORIES = [
  'All',
  'Classic Literature',
  'Science Fiction',
  'Romance',
  'Business',
  'Self-Help',
  'Young Adult',
  'Fiction',
  'Productivity',
  'Psychology',
  'Finance',
];

export default BOOK_LIBRARY;
