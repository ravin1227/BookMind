import { apiClient } from './apiClient';
import { authService } from './authService';
import { API_CONFIG, Book, ReadingProgress, Highlight, APIResponse, PaginatedResponse } from '../config/api';

export interface BookFilters {
  status?: 'pending' | 'processing' | 'completed' | 'failed';
  file_type?: 'pdf' | 'epub' | 'txt';
  search?: string;
  sort?: 'title' | 'author' | 'oldest';
  page?: number;
}

export interface CreateBookData {
  title: string;
  author?: string;
  isbn?: string;
  file_path: string;
  file_type: 'pdf' | 'epub' | 'txt';
  file_size: number;
  metadata?: {
    page_count?: number;
    language?: string;
    [key: string]: any;
  };
}

export interface UpdateBookData {
  title?: string;
  author?: string;
  isbn?: string;
}

export interface CreateReadingProgressData {
  current_page?: number;
  total_pages?: number;
  current_chapter?: string;
  reading_speed?: number;
}

export interface UpdateReadingProgressData {
  current_page?: number;
  total_pages?: number;
  current_chapter?: string;
  reading_position?: number;
  reading_speed?: number;
}

export interface CreateHighlightData {
  start_position: number;
  end_position: number;
  highlighted_text: string;
  color?: 'yellow' | 'blue' | 'green' | 'pink' | 'orange' | 'purple';
  note?: string;
  page_number?: number;
  is_favorite?: boolean;
}

export interface UpdateHighlightData {
  color?: 'yellow' | 'blue' | 'green' | 'pink' | 'orange' | 'purple';
  note?: string;
  is_favorite?: boolean;
}

export interface HighlightFilters {
  color?: string;
  favorites?: boolean;
  with_notes?: boolean;
  search?: string;
  sort?: 'position' | 'oldest';
}

export interface BookContentParams {
  page?: number;
  words_per_page?: number;
}

export interface BookContent {
  text: string;
  current_page: number;
  total_pages: number;
  words_count: number;
  has_more: boolean;
  has_previous: boolean;
}

export interface PresignedUploadResponse {
  upload_url: string;
  file_key: string;
  expires_in: number;
}

export interface BookUploadParams {
  filename: string;
  content_type: string;
  file_size: number;
}

class BooksService {
  /**
   * Get user's books with filtering and pagination
   */
  public async getBooks(filters: BookFilters = {}): Promise<PaginatedResponse<Book[]>> {
    try {
      const userUuid = authService.getCurrentUserUUID();
      if (!userUuid) {
        throw new Error('User not authenticated');
      }

      const response = await apiClient.get<PaginatedResponse<Book[]>['data']>(
        API_CONFIG.ENDPOINTS.USERS.BOOKS(userUuid),
        filters
      );

      return response as PaginatedResponse<Book[]>;
    } catch (error) {
      console.error('❌ Failed to get books:', error);
      throw error;
    }
  }

  /**
   * Get a specific book by UUID
   */
  public async getBook(bookUuid: string, includeContent: boolean = false): Promise<APIResponse<{ book: Book }>> {
    try {
      const response = await apiClient.get<{ book: Book }>(
        API_CONFIG.ENDPOINTS.BOOKS.GET(bookUuid),
        includeContent ? { include_content: 'true' } : {}
      );

      return response;
    } catch (error) {
      console.error('❌ Failed to get book:', error);
      throw error;
    }
  }

  /**
   * Get presigned URL for direct upload to R2
   */
  public async getPresignedUploadUrl(params: BookUploadParams): Promise<APIResponse<PresignedUploadResponse>> {
    try {
      const userUuid = authService.getCurrentUserUUID();
      if (!userUuid) {
        throw new Error('User not authenticated');
      }

      const response = await apiClient.post<PresignedUploadResponse>(
        API_CONFIG.ENDPOINTS.USERS.PRESIGNED_UPLOAD(userUuid),
        params
      );

      return response;
    } catch (error) {
      console.error('❌ Failed to get presigned upload URL:', error);
      throw error;
    }
  }

  /**
   * Direct upload to server (Development only)
   */
  public async directUpload(
    fileUri: string,
    fileName: string,
    fileType: string,
    fileSize: number,
    title: string,
    author?: string,
    metadata?: any
  ): Promise<APIResponse<{ book: Book }>> {
    try {
      console.log('📤 Starting direct upload to server...');

      // Get auth token and user UUID from AsyncStorage
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const token = await AsyncStorage.getItem('auth_token');
      const userJson = await AsyncStorage.getItem('user');

      if (!token || !userJson) {
        throw new Error('User not authenticated - please login again');
      }

      const user = JSON.parse(userJson);
      const userUuid = user.uuid;

      if (!userUuid) {
        throw new Error('User UUID not found');
      }

      // Create FormData
      const formData = new FormData();
      formData.append('file', {
        uri: fileUri,
        type: fileType,
        name: fileName,
      } as any);
      formData.append('title', title);
      if (author) formData.append('author', author);
      if (metadata) formData.append('metadata', JSON.stringify(metadata));

      const response = await fetch(
        `${API_CONFIG.BASE_URL}/v1/users/${userUuid}/books/direct_upload`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Direct upload failed');
      }

      console.log('✅ Direct upload successful');
      return result;
    } catch (error) {
      console.error('❌ Direct upload failed:', error);
      throw error;
    }
  }

  /**
   * Upload file directly to R2 using presigned URL (or mock for development)
   */
  public async uploadFileToR2(
    uploadUrl: string,
    fileUri: string,
    contentType: string,
    onProgress?: (progress: number) => void
  ): Promise<boolean> {
    try {
      console.log('📤 Starting R2 file upload from:', fileUri);

      // Read file as binary data
      const RNFS = require('react-native-fs');

      // Check if file exists
      const fileExists = await RNFS.exists(fileUri);
      if (!fileExists) {
        console.error('❌ File does not exist at:', fileUri);
        return false;
      }

      // Get file stats
      const fileStat = await RNFS.stat(fileUri);
      console.log('📊 File stats:', {
        size: fileStat.size,
        isFile: fileStat.isFile(),
        path: fileStat.path
      });

      // Read file as base64
      const fileData = await RNFS.readFile(fileUri, 'base64');
      console.log('📖 File read successfully, size:', fileData.length, 'characters (base64)');

      // Upload to R2 using XMLHttpRequest for binary data
      console.log('🚀 Uploading to R2...');
      console.log('📍 Upload URL (full):', uploadUrl);
      console.log('📁 File URI:', fileUri);
      console.log('📄 Content Type:', contentType);
      console.log('📦 File size (bytes):', fileData.length);

      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.onload = () => {
          console.log('📡 XHR Response:', {
            status: xhr.status,
            statusText: xhr.statusText,
            response: xhr.response,
            responseText: xhr.responseText?.substring(0, 200)
          });

          if (xhr.status >= 200 && xhr.status < 300) {
            console.log('✅ Upload successful:', xhr.status);
            resolve(true);
          } else {
            console.error('❌ Upload failed with status:', xhr.status);
            console.error('Response headers:', xhr.getAllResponseHeaders());
            resolve(false);
          }
        };

        xhr.onerror = (error) => {
          console.error('❌ Upload network error:', error);
          console.error('XHR state:', {
            readyState: xhr.readyState,
            status: xhr.status,
            statusText: xhr.statusText
          });
          resolve(false);
        };

        xhr.ontimeout = () => {
          console.error('❌ Upload timeout');
          resolve(false);
        };

        xhr.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100;
            console.log('📊 Upload progress:', percentComplete.toFixed(1) + '%');
          }
        };

        xhr.open('PUT', uploadUrl);
        xhr.setRequestHeader('Content-Type', contentType);
        xhr.timeout = 60000; // 60 second timeout

        // Convert base64 to ArrayBuffer
        const binaryString = atob(fileData);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        console.log('📦 Sending', bytes.length, 'bytes...');
        xhr.send(bytes.buffer);
      });
    } catch (error) {
      console.error('❌ Upload to R2 failed:', error);
      return false;
    }
  }

  /**
   * Create book record after successful upload
   */
  public async createBookFromUpload(
    fileKey: string,
    title: string,
    author?: string,
    fileType?: string,
    fileSize?: number,
    metadata?: any
  ): Promise<APIResponse<{ book: Book }>> {
    try {
      const userUuid = authService.getCurrentUserUUID();
      if (!userUuid) {
        throw new Error('User not authenticated');
      }

      const response = await apiClient.post<{ book: Book }>(
        API_CONFIG.ENDPOINTS.USERS.BOOKS(userUuid),
        {
          file_key: fileKey,
          title,
          author,
          file_type: fileType,
          file_size: fileSize,
          metadata,
        }
      );

      return response;
    } catch (error) {
      console.error('❌ Failed to create book from upload:', error);
      throw error;
    }
  }

  /**
   * Upload a new book (legacy method)
   */
  public async createBook(bookData: CreateBookData): Promise<APIResponse<{ book: Book }>> {
    try {
      const userUuid = authService.getCurrentUserUUID();
      if (!userUuid) {
        throw new Error('User not authenticated');
      }

      const response = await apiClient.post<{ book: Book }>(
        API_CONFIG.ENDPOINTS.USERS.BOOKS(userUuid),
        { book: bookData }
      );

      return response;
    } catch (error) {
      console.error('❌ Failed to create book:', error);
      throw error;
    }
  }

  /**
   * Update book information
   */
  public async updateBook(bookUuid: string, updates: UpdateBookData): Promise<APIResponse<{ book: Book }>> {
    try {
      const response = await apiClient.patch<{ book: Book }>(
        API_CONFIG.ENDPOINTS.BOOKS.UPDATE(bookUuid),
        { book: updates }
      );

      return response;
    } catch (error) {
      console.error('❌ Failed to update book:', error);
      throw error;
    }
  }

  /**
   * Delete a book
   */
  public async deleteBook(bookUuid: string): Promise<APIResponse> {
    try {
      const response = await apiClient.delete(
        API_CONFIG.ENDPOINTS.BOOKS.DELETE(bookUuid)
      );

      return response;
    } catch (error) {
      console.error('❌ Failed to delete book:', error);
      throw error;
    }
  }

  /**
   * Get paginated book content for reading
   */
  public async getBookContent(bookUuid: string, params: BookContentParams = {}): Promise<APIResponse<{ content: BookContent; book: any }>> {
    try {
      const response = await apiClient.get<{ content: BookContent; book: any }>(
        API_CONFIG.ENDPOINTS.BOOKS.CONTENT(bookUuid),
        params
      );

      return response;
    } catch (error) {
      console.error('❌ Failed to get book content:', error);
      throw error;
    }
  }

  /**
   * Trigger book processing
   */
  public async processBook(bookUuid: string): Promise<APIResponse<{ book: Book }>> {
    try {
      const response = await apiClient.post<{ book: Book }>(
        API_CONFIG.ENDPOINTS.BOOKS.PROCESS(bookUuid)
      );

      return response;
    } catch (error) {
      console.error('❌ Failed to process book:', error);
      throw error;
    }
  }

  // Reading Progress Methods

  /**
   * Get reading progress for a book
   */
  public async getReadingProgress(bookUuid: string): Promise<APIResponse<{ reading_progress: ReadingProgress }>> {
    try {
      const userUuid = authService.getCurrentUserUUID();
      if (!userUuid) {
        throw new Error('User not authenticated');
      }

      const response = await apiClient.get<{ reading_progress: ReadingProgress }>(
        API_CONFIG.ENDPOINTS.BOOKS.READING_PROGRESS(bookUuid),
        { user_uuid: userUuid }
      );

      return response;
    } catch (error) {
      console.error('❌ Failed to get reading progress:', error);
      throw error;
    }
  }

  /**
   * Create reading progress for a book
   */
  public async createReadingProgress(bookUuid: string, progressData: CreateReadingProgressData): Promise<APIResponse<{ reading_progress: ReadingProgress }>> {
    try {
      const userUuid = authService.getCurrentUserUUID();
      if (!userUuid) {
        throw new Error('User not authenticated');
      }

      const response = await apiClient.post<{ reading_progress: ReadingProgress }>(
        API_CONFIG.ENDPOINTS.BOOKS.READING_PROGRESS(bookUuid),
        {
          reading_progress: {
            user_uuid: userUuid,
            ...progressData,
          },
        }
      );

      return response;
    } catch (error) {
      console.error('❌ Failed to create reading progress:', error);
      throw error;
    }
  }

  /**
   * Update reading progress
   */
  public async updateReadingProgress(bookUuid: string, updates: UpdateReadingProgressData): Promise<APIResponse<{ reading_progress: ReadingProgress }>> {
    try {
      const userUuid = authService.getCurrentUserUUID();
      if (!userUuid) {
        throw new Error('User not authenticated');
      }

      const response = await apiClient.patch<{ reading_progress: ReadingProgress }>(
        API_CONFIG.ENDPOINTS.BOOKS.READING_PROGRESS(bookUuid),
        {
          reading_progress: {
            user_uuid: userUuid,
            ...updates,
          },
        }
      );

      return response;
    } catch (error) {
      console.error('❌ Failed to update reading progress:', error);
      throw error;
    }
  }

  // Highlights Methods

  /**
   * Get highlights for a book
   */
  public async getHighlights(bookUuid: string, filters: HighlightFilters = {}): Promise<PaginatedResponse<Highlight[]>> {
    try {
      const userUuid = authService.getCurrentUserUUID();
      if (!userUuid) {
        throw new Error('User not authenticated');
      }

      const response = await apiClient.get<PaginatedResponse<Highlight[]>['data']>(
        API_CONFIG.ENDPOINTS.BOOKS.HIGHLIGHTS(bookUuid),
        { user_uuid: userUuid, ...filters }
      );

      return response as PaginatedResponse<Highlight[]>;
    } catch (error) {
      console.error('❌ Failed to get highlights:', error);
      throw error;
    }
  }

  /**
   * Create a new highlight
   */
  public async createHighlight(bookUuid: string, highlightData: CreateHighlightData): Promise<APIResponse<{ highlight: Highlight }>> {
    try {
      const userUuid = authService.getCurrentUserUUID();
      if (!userUuid) {
        throw new Error('User not authenticated');
      }

      const response = await apiClient.post<{ highlight: Highlight }>(
        API_CONFIG.ENDPOINTS.BOOKS.HIGHLIGHTS(bookUuid),
        {
          highlight: {
            user_uuid: userUuid,
            ...highlightData,
          },
        }
      );

      return response;
    } catch (error) {
      console.error('❌ Failed to create highlight:', error);
      throw error;
    }
  }

  /**
   * Update a highlight
   */
  public async updateHighlight(highlightUuid: string, updates: UpdateHighlightData): Promise<APIResponse<{ highlight: Highlight }>> {
    try {
      const response = await apiClient.patch<{ highlight: Highlight }>(
        API_CONFIG.ENDPOINTS.HIGHLIGHTS.UPDATE(highlightUuid),
        { highlight: updates }
      );

      return response;
    } catch (error) {
      console.error('❌ Failed to update highlight:', error);
      throw error;
    }
  }

  /**
   * Delete a highlight
   */
  public async deleteHighlight(highlightUuid: string): Promise<APIResponse> {
    try {
      const response = await apiClient.delete(
        API_CONFIG.ENDPOINTS.HIGHLIGHTS.DELETE(highlightUuid)
      );

      return response;
    } catch (error) {
      console.error('❌ Failed to delete highlight:', error);
      throw error;
    }
  }

  /**
   * Toggle highlight favorite status
   */
  public async toggleHighlightFavorite(highlightUuid: string): Promise<APIResponse<{ highlight: Highlight; is_favorite: boolean }>> {
    try {
      const response = await apiClient.patch<{ highlight: Highlight; is_favorite: boolean }>(
        API_CONFIG.ENDPOINTS.HIGHLIGHTS.TOGGLE_FAVORITE(highlightUuid)
      );

      return response;
    } catch (error) {
      console.error('❌ Failed to toggle highlight favorite:', error);
      throw error;
    }
  }

  /**
   * Get highlight sharing data
   */
  public async getHighlightShareData(highlightUuid: string): Promise<APIResponse<{ share: any }>> {
    try {
      const response = await apiClient.get<{ share: any }>(
        API_CONFIG.ENDPOINTS.HIGHLIGHTS.SHARE(highlightUuid)
      );

      return response;
    } catch (error) {
      console.error('❌ Failed to get highlight share data:', error);
      throw error;
    }
  }

  /**
   * Get recent reading activity
   */
  public async getRecentReading(): Promise<PaginatedResponse<ReadingProgress[]>> {
    try {
      const userUuid = authService.getCurrentUserUUID();
      if (!userUuid) {
        throw new Error('User not authenticated');
      }

      const response = await apiClient.get<PaginatedResponse<ReadingProgress[]>['data']>(
        API_CONFIG.ENDPOINTS.READING_PROGRESS.LIST,
        { user_uuid: userUuid }
      );

      return response as PaginatedResponse<ReadingProgress[]>;
    } catch (error) {
      console.error('❌ Failed to get recent reading:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const booksService = new BooksService();
export default booksService;