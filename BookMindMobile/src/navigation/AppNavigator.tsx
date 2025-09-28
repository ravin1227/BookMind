import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import screens
import SplashScreen from '../screens/SplashScreen';
import HomeScreen from '../screens/HomeScreen';
import BookDetailScreen from '../screens/BookDetailScreen';
import ContinueReadingScreen from '../screens/ContinueReadingScreen';
import PostShareScreen from '../screens/PostShareScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LibraryScreen from '../screens/LibraryScreen';
import AddBookScreen from '../screens/AddBookScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';

const RootStack = createNativeStackNavigator();

// Simple Navigator
export default function AppNavigator() {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Show splash screen for 3 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {isLoading ? (
          <RootStack.Screen name="Splash" component={SplashScreen} />
        ) : (
          <>
            <RootStack.Screen name="Home" component={HomeScreen} />
            <RootStack.Screen name="BookDetail" component={BookDetailScreen} />
            <RootStack.Screen name="ContinueReading" component={ContinueReadingScreen} />
            <RootStack.Screen name="PostShare" component={PostShareScreen} />
            <RootStack.Screen name="Profile" component={ProfileScreen} />
            <RootStack.Screen name="Library" component={LibraryScreen} />
            <RootStack.Screen name="AddBook" component={AddBookScreen} />
            <RootStack.Screen name="Analytics" component={AnalyticsScreen} />
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}