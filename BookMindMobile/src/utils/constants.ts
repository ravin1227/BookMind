// App Constants and Configuration

export const APP_CONFIG = {
  name: 'BookMind',
  version: '1.0.0',
  buildNumber: 1,

  // API Configuration
  api: {
    baseUrl: __DEV__ ? 'http://localhost:3000/api/v1' : 'https://api.bookmind.app/v1',
    timeout: 10000,
    retryAttempts: 3,
  },

  // Feature Flags
  features: {
    useMockApi: true, // Set to false when real backend is ready
    enableOfflineMode: true,
    enablePushNotifications: false,
    enableAnalytics: false,
    enableCrashReporting: false,
  },

  // Reading Settings
  reading: {
    defaultFontSize: 16,
    defaultFontFamily: 'System',
    defaultTheme: 'light' as const,
    defaultPageMode: 'single' as const,
    autoBookmarkInterval: 30000, // 30 seconds
    readingGoals: {
      defaultDailyMinutes: 30,
      defaultWeeklyBooks: 1,
    },
  },

  // Highlight Configuration
  highlights: {
    colors: [
      { key: 'yellow', name: 'Important', description: 'Key concepts and ideas' },
      { key: 'blue', name: 'Questions', description: 'Areas needing clarification' },
      { key: 'green', name: 'Agreements', description: 'Positive insights' },
      { key: 'red', name: 'Disagreements', description: 'Critical points' },
      { key: 'purple', name: 'Quotes', description: 'Worth sharing' },
      { key: 'orange', name: 'Action Items', description: 'To-dos and actions' },
      { key: 'brown', name: 'Examples', description: 'Case studies and examples' },
      { key: 'pink', name: 'Personal', description: 'Personal reflections' },
    ],
  },

  // File Upload
  upload: {
    maxFileSize: 100 * 1024 * 1024, // 100MB
    supportedFormats: ['pdf', 'epub', 'mobi', 'docx', 'txt'],
    imageFormats: ['jpg', 'jpeg', 'png'], // For OCR
  },

  // Social Sharing
  social: {
    platforms: ['twitter', 'facebook', 'instagram', 'linkedin'],
    quotecardTemplates: [
      'minimal',
      'elegant',
      'bold',
      'academic',
      'creative',
      'gradient',
      'nature',
      'tech',
    ],
  },

  // Storage Keys
  storage: {
    authToken: '@bookmind_auth_token',
    refreshToken: '@bookmind_refresh_token',
    userId: '@bookmind_user_id',
    readingSettings: '@bookmind_reading_settings',
    onboardingCompleted: '@bookmind_onboarding_completed',
    lastSyncTimestamp: '@bookmind_last_sync',
  },

  // Animation Durations
  animations: {
    short: 200,
    medium: 300,
    long: 500,
    splash: 2000,
  },

  // Network Configuration
  network: {
    retryDelay: 1000,
    maxRetries: 3,
    timeoutDuration: 30000,
  },

  // Pagination
  pagination: {
    defaultLimit: 20,
    maxLimit: 100,
  },

  // External URLs
  urls: {
    website: 'https://bookmind.app',
    privacy: 'https://bookmind.app/privacy',
    terms: 'https://bookmind.app/terms',
    support: 'https://support.bookmind.app',
    feedback: 'https://bookmind.app/feedback',
  },
};

export const DEMO_CREDENTIALS = {
  email: 'demo@bookmind.app',
  password: 'demo123',
};

export const ERROR_MESSAGES = {
  network: 'Please check your internet connection and try again.',
  serverError: 'Something went wrong on our end. Please try again later.',
  notFound: 'The requested resource was not found.',
  unauthorized: 'Please log in to continue.',
  forbidden: 'You don\'t have permission to access this resource.',
  validationError: 'Please check your input and try again.',
  fileUploadError: 'Failed to upload file. Please try again.',
  fileSizeError: 'File size exceeds the maximum limit.',
  unsupportedFormat: 'This file format is not supported.',
  unknownError: 'An unexpected error occurred.',
};

export const SUCCESS_MESSAGES = {
  login: 'Welcome back! You\'ve been successfully logged in.',
  register: 'Account created successfully! Welcome to BookMind.',
  logout: 'You\'ve been logged out successfully.',
  bookUploaded: 'Book uploaded successfully! Processing will begin shortly.',
  highlightAdded: 'Highlight saved successfully.',
  bookmarkAdded: 'Bookmark saved successfully.',
  noteAdded: 'Note saved successfully.',
  settingsUpdated: 'Settings updated successfully.',
  dataSync: 'Your data has been synced successfully.',
};