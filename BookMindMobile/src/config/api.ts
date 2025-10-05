import Config from 'react-native-config';

export const API_CONFIG = {
  BASE_URL: Config.API_BASE_URL || 'http://localhost:3000/api',
  TIMEOUT: parseInt(Config.API_TIMEOUT || '10000', 10),

  // Debug flags
  DEBUG_REQUESTS: Config.DEBUG_API_REQUESTS === 'true',
  DEBUG_AUTH: Config.DEBUG_AUTH === 'true',

  // App info
  APP_NAME: Config.APP_NAME || 'BookMind',
  APP_VERSION: Config.APP_VERSION || '1.0.0',

  // Request headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-App-Name': Config.APP_NAME || 'BookMind',
    'X-App-Version': Config.APP_VERSION || '1.0.0',
  },

  // Endpoints
  ENDPOINTS: {
    AUTH: {
      REGISTER: '/v1/auth/register',
      LOGIN: '/v1/auth/login',
      LOGOUT: '/v1/auth/logout',
      ME: '/v1/auth/me',
      FORGOT_PASSWORD: '/v1/auth/forgot_password',
      RESET_PASSWORD: '/v1/auth/reset_password',
    },
    USERS: {
      LIST: '/v1/users',
      GET: (uuid: string) => `/v1/users/${uuid}`,
      UPDATE: (uuid: string) => `/v1/users/${uuid}`,
      DELETE: (uuid: string) => `/v1/users/${uuid}`,
      REGISTER_DEVICE: (uuid: string) => `/v1/users/${uuid}/register_device`,
      STATS: (uuid: string) => `/v1/users/${uuid}/stats`,
      BOOKS: (uuid: string) => `/v1/users/${uuid}/books`,
      PRESIGNED_UPLOAD: (uuid: string) => `/v1/users/${uuid}/books/presigned_upload`,
    },
    BOOKS: {
      LIST: '/v1/books',
      GET: (uuid: string) => `/v1/books/${uuid}`,
      UPDATE: (uuid: string) => `/v1/books/${uuid}`,
      DELETE: (uuid: string) => `/v1/books/${uuid}`,
      CONTENT: (uuid: string) => `/v1/books/${uuid}/content`,
      PROCESS: (uuid: string) => `/v1/books/${uuid}/process`,
      HIGHLIGHTS: (uuid: string) => `/v1/books/${uuid}/highlights`,
      READING_PROGRESS: (uuid: string) => `/v1/books/${uuid}/reading_progress`,
    },
    HIGHLIGHTS: {
      GET: (uuid: string) => `/v1/highlights/${uuid}`,
      UPDATE: (uuid: string) => `/v1/highlights/${uuid}`,
      DELETE: (uuid: string) => `/v1/highlights/${uuid}`,
      TOGGLE_FAVORITE: (uuid: string) => `/v1/highlights/${uuid}/toggle_favorite`,
      SHARE: (uuid: string) => `/v1/highlights/${uuid}/share`,
    },
    READING_PROGRESS: {
      LIST: '/v1/reading_progresses',
      GET: (id: number) => `/v1/reading_progresses/${id}`,
      UPDATE: (id: number) => `/v1/reading_progresses/${id}`,
      DELETE: (id: number) => `/v1/reading_progresses/${id}`,
    },
  },

  // Error codes
  ERROR_CODES: {
    NETWORK_ERROR: 'NETWORK_ERROR',
    TIMEOUT: 'TIMEOUT',
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    NOT_FOUND: 'NOT_FOUND',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    SERVER_ERROR: 'SERVER_ERROR',
  },

  // HTTP Status codes
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
  },
} as const;

export type APIResponse<T = any> = {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
};

export type PaginatedResponse<T = any> = APIResponse<{
  items: T[];
  current_page: number;
  per_page: number;
  total_items: number;
  total_pages: number;
}>;

export type AuthResponse = APIResponse<{
  user: User;
  token: string;
  expires_at: string;
}>;

export type User = {
  uuid: string;
  email: string;
  name: string;
  display_name: string;
  email_verified: boolean;
  account_status: 'active' | 'suspended' | 'deleted';
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
  stats?: {
    total_books: number;
    books_completed: number;
    total_highlights: number;
    active_devices: number;
  };
};

export type Book = {
  uuid: string;
  title: string;
  author: string | null;
  isbn: string | null;
  file_type: 'pdf' | 'epub' | 'txt';
  file_size: number;
  file_size_mb: number;
  processing_status: 'pending' | 'processing' | 'completed' | 'failed';
  page_count: number | null;
  uploaded_at: string;
  processed_at: string | null;
  created_at: string;
  updated_at: string;
  readable: boolean;
  reading_progress?: ReadingProgress;
  stats: {
    highlights_count: number;
    favorites_count: number;
  };
};

export type ReadingProgress = {
  id: number;
  current_page: number;
  total_pages: number | null;
  progress_percentage: number;
  current_chapter: string | null;
  reading_position: number | null;
  reading_speed: number | null;
  last_read_at: string | null;
  started_reading_at: string | null;
  completed_at: string | null;
  completed: boolean;
  estimated_time_remaining: number | null;
  created_at: string;
  updated_at: string;
  book?: {
    uuid: string;
    title: string;
    author: string | null;
    file_type: string;
  };
  user?: {
    uuid: string;
    name: string;
  };
};

export type Highlight = {
  uuid: string;
  start_position: number;
  end_position: number;
  highlighted_text: string;
  color: 'yellow' | 'blue' | 'green' | 'pink' | 'orange' | 'purple';
  note: string | null;
  page_number: number | null;
  is_favorite: boolean;
  text_length: number;
  word_count: number;
  created_at: string;
  updated_at: string;
  context?: string;
  shareable_content?: string;
  book?: {
    uuid: string;
    title: string;
    author: string | null;
  };
  user?: {
    uuid: string;
    name: string;
  };
};

export type Device = {
  id: number;
  device_type: 'ios' | 'android';
  device_name: string;
  active: boolean;
  last_used_at: string;
  created_at: string;
};