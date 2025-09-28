// BookMind App Types - Starting Fresh

import { TextStyle } from 'react-native';

// Basic Navigation Types for our simple setup
export type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  BookDetail: {
    book: {
      title: string;
      author: string;
      chapter: string;
      currentPage: number;
      totalPages: number;
      progress: number;
      timeLeft: number;
      coverUrl: string;
    };
  };
  ContinueReading: {
    book: {
      title: string;
      author: string;
      chapter: string;
      currentPage: number;
      totalPages: number;
      progress: number;
      timeLeft: number;
      coverUrl: string;
    };
  };
  PostShare: {
    selectedText: string;
    bookTitle: string;
    author: string;
  };
  Profile: undefined;
  Library: undefined;
  AddBook: undefined;
  Analytics: undefined;
};

// We'll add more types as we build the app