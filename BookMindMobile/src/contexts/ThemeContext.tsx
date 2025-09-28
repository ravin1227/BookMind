import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Theme = 'Light' | 'Dark';

interface ThemeColors {
  // Background colors
  background: string;
  surface: string;
  card: string;

  // Text colors
  text: string;
  textSecondary: string;
  textTertiary: string;

  // Border colors
  border: string;
  borderLight: string;

  // Action colors
  primary: string;
  onPrimary: string;
  primaryText: string;
  backgroundSecondary: string;

  // Status bar
  statusBar: string;
}

interface ThemeContextType {
  theme: Theme;
  colors: ThemeColors;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const lightTheme: ThemeColors = {
  background: '#F8F9FA',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  text: '#1F2937',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  primary: '#3B82F6',
  onPrimary: '#FFFFFF',
  primaryText: '#FFFFFF',
  backgroundSecondary: '#F9FAFB',
  statusBar: '#FFFFFF',
};

const darkTheme: ThemeColors = {
  background: '#111827',
  surface: '#1F2937',
  card: '#374151',
  text: '#F9FAFB',
  textSecondary: '#D1D5DB',
  textTertiary: '#9CA3AF',
  border: '#4B5563',
  borderLight: '#374151',
  primary: '#3B82F6',
  onPrimary: '#FFFFFF',
  primaryText: '#1F2937',
  backgroundSecondary: '#374151',
  statusBar: '#1F2937',
};

const themes = {
  Light: lightTheme,
  Dark: darkTheme,
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('Light');

  const toggleTheme = () => {
    setThemeState(prev => prev === 'Light' ? 'Dark' : 'Light');
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const colors = themes[theme];

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};