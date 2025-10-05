import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import screens
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import ResetCodeScreen from '../screens/ResetCodeScreen';
import NewPasswordScreen from '../screens/NewPasswordScreen';
import HomeScreen from '../screens/HomeScreen';
import DiscoverScreen from '../screens/DiscoverScreen';
import BookDetailScreen from '../screens/BookDetailScreen';
import BookDetailsScreen from '../screens/BookDetailsScreen';
import ContinueReadingScreen from '../screens/ContinueReadingScreen';
import PostShareScreen from '../screens/PostShareScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LibraryScreen from '../screens/LibraryScreen';
import AddBookScreen from '../screens/AddBookScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';

// Import stores
import { useAuth } from '../contexts/AuthContext';
import MainTabNavigator from './MainTabNavigator';

const RootStack = createNativeStackNavigator();

// Navigator with Authentication Flow
export default function AppNavigator() {
  const [isSplashDone, setIsSplashDone] = React.useState(false);
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  React.useEffect(() => {
    // Show splash screen for at least 2 seconds
    const timer = setTimeout(() => {
      setIsSplashDone(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Show splash while either splash timer or auth check is loading
  if (!isSplashDone || isAuthLoading) {
    return (
      <NavigationContainer>
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          <RootStack.Screen name="Splash" component={SplashScreen} />
        </RootStack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <>
            <RootStack.Screen name="Login" component={LoginScreen} />
            <RootStack.Screen name="SignUp" component={SignUpScreen} />
            <RootStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <RootStack.Screen name="ResetCode" component={ResetCodeScreen} />
            <RootStack.Screen name="NewPassword" component={NewPasswordScreen} />
          </>
        ) : (
          <>
            <RootStack.Screen name="MainTabs" component={MainTabNavigator} />
            <RootStack.Screen name="BookDetail" component={BookDetailScreen} />
            <RootStack.Screen name="BookDetails" component={BookDetailsScreen} />
            <RootStack.Screen name="ContinueReading" component={ContinueReadingScreen} />
            <RootStack.Screen name="PostShare" component={PostShareScreen} />
            <RootStack.Screen name="AddBook" component={AddBookScreen} />
            <RootStack.Screen name="Analytics" component={AnalyticsScreen} />
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}