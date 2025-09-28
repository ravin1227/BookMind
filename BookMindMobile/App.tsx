/**
 * BookMind - AI-Powered Reading Companion
 * React Native App Entry Point
 *
 * @format
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';

function AppWithTheme() {
  const { theme, colors } = useTheme();

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={theme === 'Dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.statusBar}
      />
      <AppNavigator />
    </SafeAreaProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppWithTheme />
    </ThemeProvider>
  );
}

export default App;
