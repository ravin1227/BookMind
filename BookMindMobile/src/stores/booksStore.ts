import { create } from 'zustand';
import {
  booksService,
  BookFilters,
  CreateBookData,
  UpdateBookData,
  HighlightFilters,
  CreateHighlightData,
  UpdateHighlightData,
  UpdateReadingProgressData
} from '../services/booksService';
import { Book, ReadingProgress, Highlight } from '../config/api';
import { APIError } from '../services/apiClient';

interface BooksState {
  // Books state
  books: Book[];
  currentBook: Book | null;
  isLoading: boolean;
  error: string | null;

  // Reading progress state
  readingProgresses: Record<string, ReadingProgress>; // bookUuid -> progress

  // Highlights state
  highlights: Record<string, Highlight[]>; // bookUuid -> highlights[]

  // Pagination
  pagination: {
    current_page: number;
    per_page: number;
    total_items: number;
    total_pages: number;
  } | null;

  // Actions - Books
  fetchBooks: (filters?: BookFilters) => Promise<boolean>;
  fetchBook: (bookUuid: string) => Promise<boolean>;
  createBook: (bookData: CreateBookData) => Promise<boolean>;
  updateBook: (bookUuid: string, updates: UpdateBookData) => Promise<boolean>;
  deleteBook: (bookUuid: string) => Promise<boolean>;

  // Actions - Reading Progress
  fetchReadingProgress: (bookUuid: string) => Promise<boolean>;
  updateReadingProgress: (bookUuid: string, updates: UpdateReadingProgressData) => Promise<boolean>;

  // Actions - Highlights
  fetchHighlights: (bookUuid: string, filters?: HighlightFilters) => Promise<boolean>;
  createHighlight: (bookUuid: string, highlightData: CreateHighlightData) => Promise<boolean>;
  updateHighlight: (highlightUuid: string, updates: UpdateHighlightData) => Promise<boolean>;
  deleteHighlight: (highlightUuid: string, bookUuid: string) => Promise<boolean>;
  toggleHighlightFavorite: (highlightUuid: string, bookUuid: string) => Promise<boolean>;

  // Utility actions
  clearError: () => void;
  setCurrentBook: (book: Book | null) => void;
  resetState: () => void;
}

export const useBooksStore = create<BooksState>((set, get) => ({
  // Initial state
  books: [],
  currentBook: null,
  isLoading: false,
  error: null,
  readingProgresses: {},
  highlights: {},
  pagination: null,

  // Fetch books with filters
  fetchBooks: async (filters: BookFilters = {}): Promise<boolean> => {
    set({ isLoading: true, error: null });

    try {
      const response = await booksService.getBooks(filters);

      if (response.success && response.data) {
        set({
          books: response.data.items,
          pagination: {
            current_page: response.data.current_page,
            per_page: response.data.per_page,
            total_items: response.data.total_items,
            total_pages: response.data.total_pages,
          },
          isLoading: false,
          error: null,
        });
        return true;
      } else {
        set({
          error: response.message || 'Failed to fetch books',
          isLoading: false,
        });
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof APIError
        ? error.message
        : 'Failed to fetch books. Please try again.';

      set({
        error: errorMessage,
        isLoading: false,
      });
      return false;
    }
  },

  // Fetch single book
  fetchBook: async (bookUuid: string): Promise<boolean> => {
    set({ isLoading: true, error: null });

    try {
      const response = await booksService.getBook(bookUuid);

      if (response.success && response.data) {
        const book = response.data.book;

        // Update books array if book exists there
        const currentBooks = get().books;
        const updatedBooks = currentBooks.map(b =>
          b.uuid === book.uuid ? book : b
        );

        set({
          books: updatedBooks,
          currentBook: book,
          isLoading: false,
          error: null,
        });
        return true;
      } else {
        set({
          error: response.message || 'Failed to fetch book',
          isLoading: false,
        });
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof APIError
        ? error.message
        : 'Failed to fetch book. Please try again.';

      set({
        error: errorMessage,
        isLoading: false,
      });
      return false;
    }
  },

  // Create new book
  createBook: async (bookData: CreateBookData): Promise<boolean> => {
    set({ isLoading: true, error: null });

    try {
      const response = await booksService.createBook(bookData);

      if (response.success && response.data) {
        const newBook = response.data.book;

        set({
          books: [newBook, ...get().books],
          isLoading: false,
          error: null,
        });
        return true;
      } else {
        set({
          error: response.message || 'Failed to create book',
          isLoading: false,
        });
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof APIError
        ? error.message
        : 'Failed to create book. Please try again.';

      set({
        error: errorMessage,
        isLoading: false,
      });
      return false;
    }
  },

  // Update book
  updateBook: async (bookUuid: string, updates: UpdateBookData): Promise<boolean> => {
    set({ isLoading: true, error: null });

    try {
      const response = await booksService.updateBook(bookUuid, updates);

      if (response.success && response.data) {
        const updatedBook = response.data.book;
        const currentBooks = get().books;

        set({
          books: currentBooks.map(book =>
            book.uuid === bookUuid ? updatedBook : book
          ),
          currentBook: get().currentBook?.uuid === bookUuid ? updatedBook : get().currentBook,
          isLoading: false,
          error: null,
        });
        return true;
      } else {
        set({
          error: response.message || 'Failed to update book',
          isLoading: false,
        });
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof APIError
        ? error.message
        : 'Failed to update book. Please try again.';

      set({
        error: errorMessage,
        isLoading: false,
      });
      return false;
    }
  },

  // Delete book
  deleteBook: async (bookUuid: string): Promise<boolean> => {
    set({ isLoading: true, error: null });

    try {
      const response = await booksService.deleteBook(bookUuid);

      if (response.success) {
        const currentState = get();

        set({
          books: currentState.books.filter(book => book.uuid !== bookUuid),
          currentBook: currentState.currentBook?.uuid === bookUuid ? null : currentState.currentBook,
          readingProgresses: Object.fromEntries(
            Object.entries(currentState.readingProgresses).filter(([key]) => key !== bookUuid)
          ),
          highlights: Object.fromEntries(
            Object.entries(currentState.highlights).filter(([key]) => key !== bookUuid)
          ),
          isLoading: false,
          error: null,
        });
        return true;
      } else {
        set({
          error: response.message || 'Failed to delete book',
          isLoading: false,
        });
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof APIError
        ? error.message
        : 'Failed to delete book. Please try again.';

      set({
        error: errorMessage,
        isLoading: false,
      });
      return false;
    }
  },

  // Fetch reading progress
  fetchReadingProgress: async (bookUuid: string): Promise<boolean> => {
    try {
      const response = await booksService.getReadingProgress(bookUuid);

      if (response.success && response.data) {
        set({
          readingProgresses: {
            ...get().readingProgresses,
            [bookUuid]: response.data.reading_progress,
          },
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to fetch reading progress:', error);
      return false;
    }
  },

  // Update reading progress
  updateReadingProgress: async (bookUuid: string, updates: UpdateReadingProgressData): Promise<boolean> => {
    try {
      const response = await booksService.updateReadingProgress(bookUuid, updates);

      if (response.success && response.data) {
        set({
          readingProgresses: {
            ...get().readingProgresses,
            [bookUuid]: response.data.reading_progress,
          },
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to update reading progress:', error);
      return false;
    }
  },

  // Fetch highlights
  fetchHighlights: async (bookUuid: string, filters: HighlightFilters = {}): Promise<boolean> => {
    try {
      const response = await booksService.getHighlights(bookUuid, filters);

      if (response.success && response.data) {
        set({
          highlights: {
            ...get().highlights,
            [bookUuid]: response.data.items,
          },
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to fetch highlights:', error);
      return false;
    }
  },

  // Create highlight
  createHighlight: async (bookUuid: string, highlightData: CreateHighlightData): Promise<boolean> => {
    try {
      const response = await booksService.createHighlight(bookUuid, highlightData);

      if (response.success && response.data) {
        const currentHighlights = get().highlights[bookUuid] || [];

        set({
          highlights: {
            ...get().highlights,
            [bookUuid]: [response.data.highlight, ...currentHighlights],
          },
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to create highlight:', error);
      return false;
    }
  },

  // Update highlight
  updateHighlight: async (highlightUuid: string, updates: UpdateHighlightData): Promise<boolean> => {
    try {
      const response = await booksService.updateHighlight(highlightUuid, updates);

      if (response.success && response.data) {
        const updatedHighlight = response.data.highlight;
        const currentHighlights = get().highlights;

        // Find which book this highlight belongs to and update it
        const updatedHighlights = Object.fromEntries(
          Object.entries(currentHighlights).map(([bookUuid, highlights]) => [
            bookUuid,
            highlights.map(h => h.uuid === highlightUuid ? updatedHighlight : h)
          ])
        );

        set({ highlights: updatedHighlights });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to update highlight:', error);
      return false;
    }
  },

  // Delete highlight
  deleteHighlight: async (highlightUuid: string, bookUuid: string): Promise<boolean> => {
    try {
      const response = await booksService.deleteHighlight(highlightUuid);

      if (response.success) {
        const currentHighlights = get().highlights[bookUuid] || [];

        set({
          highlights: {
            ...get().highlights,
            [bookUuid]: currentHighlights.filter(h => h.uuid !== highlightUuid),
          },
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to delete highlight:', error);
      return false;
    }
  },

  // Toggle highlight favorite
  toggleHighlightFavorite: async (highlightUuid: string, bookUuid: string): Promise<boolean> => {
    try {
      const response = await booksService.toggleHighlightFavorite(highlightUuid);

      if (response.success && response.data) {
        const updatedHighlight = response.data.highlight;
        const currentHighlights = get().highlights[bookUuid] || [];

        set({
          highlights: {
            ...get().highlights,
            [bookUuid]: currentHighlights.map(h =>
              h.uuid === highlightUuid ? updatedHighlight : h
            ),
          },
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to toggle highlight favorite:', error);
      return false;
    }
  },

  // Utility actions
  clearError: () => {
    set({ error: null });
  },

  setCurrentBook: (book: Book | null) => {
    set({ currentBook: book });
  },

  resetState: () => {
    set({
      books: [],
      currentBook: null,
      isLoading: false,
      error: null,
      readingProgresses: {},
      highlights: {},
      pagination: null,
    });
  },
}));