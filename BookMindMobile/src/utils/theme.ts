import { Theme } from '../types';

export const lightTheme: Theme = {
  colors: {
    primary: '#6366f1',      // Indigo
    secondary: '#8b5cf6',    // Purple
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#1e293b',
    textSecondary: '#64748b',
    border: '#e2e8f0',
    error: '#ef4444',
    success: '#10b981',
    warning: '#f59e0b',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  typography: {
    h1: {
      fontSize: 28,
      fontWeight: '700',
      lineHeight: 36,
    },
    h2: {
      fontSize: 24,
      fontWeight: '600',
      lineHeight: 32,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600',
      lineHeight: 28,
    },
    body: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 24,
    },
    caption: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 20,
    },
  },
};

export const darkTheme: Theme = {
  ...lightTheme,
  colors: {
    primary: '#818cf8',      // Lighter indigo for dark mode
    secondary: '#a78bfa',    // Lighter purple
    background: '#0f172a',   // Dark slate
    surface: '#1e293b',      // Lighter dark slate
    text: '#f1f5f9',        // Light slate
    textSecondary: '#94a3b8', // Medium slate
    border: '#334155',       // Darker slate
    error: '#f87171',
    success: '#34d399',
    warning: '#fbbf24',
  },
};

export const sepiaTheme: Theme = {
  ...lightTheme,
  colors: {
    primary: '#92400e',      // Amber brown
    secondary: '#a16207',    // Yellow brown
    background: '#fefbf3',   // Warm white
    surface: '#fef7ed',      // Light amber
    text: '#451a03',         // Dark brown
    textSecondary: '#78350f', // Medium brown
    border: '#fed7aa',       // Light amber
    error: '#dc2626',
    success: '#059669',
    warning: '#d97706',
  },
};

export const highlightColors = {
  yellow: '#fef3c7',     // Important concepts
  blue: '#dbeafe',       // Questions
  green: '#d1fae5',      // Agreements
  red: '#fecaca',        // Disagreements
  purple: '#e9d5ff',     // Quotes
  orange: '#fed7aa',     // Action items
  brown: '#e7e5e4',      // Examples
  pink: '#fce7f3',       // Personal reflections
};

export const getTheme = (themeName: 'light' | 'dark' | 'sepia'): Theme => {
  switch (themeName) {
    case 'dark':
      return darkTheme;
    case 'sepia':
      return sepiaTheme;
    default:
      return lightTheme;
  }
};