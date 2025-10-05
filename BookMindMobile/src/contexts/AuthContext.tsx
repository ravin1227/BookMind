import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/authService';
import { apiClient } from '../services/apiClient';

interface User {
  id: string;
  email: string;
  name: string;
  uuid: string;
  display_name: string;
  email_verified: boolean;
  account_status: string;
  last_login_at: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean; // For initial auth check only
  isAuthenticating: boolean; // For login/register operations
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// API Configuration
const API_BASE_URL = 'http://localhost:3000/api/v1'; // Update this to your server URL

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // For initial auth check only
  const [isAuthenticating, setIsAuthenticating] = useState(false); // For login/register

  // Check for existing auth on mount
  useEffect(() => {
    checkExistingAuth();

    // Setup auth failure handler - logout when API returns 401
    apiClient.setAuthFailureCallback(() => {
      console.log('🔓 API returned 401 - logging out');
      logout();
    });
  }, []);

  const checkExistingAuth = async () => {
    try {
      console.log('🔍 Checking for existing auth in AsyncStorage...');
      const storedToken = await AsyncStorage.getItem('auth_token');
      const storedUser = await AsyncStorage.getItem('user');

      if (storedToken && storedUser) {
        console.log('📦 Found stored token and user, validating...');

        // Sync token with apiClient to use for validation
        await apiClient.setAuthToken(storedToken);

        // Validate token by calling /auth/me
        try {
          const meResponse = await authService.getCurrentUser();
          if (meResponse.success && meResponse.data) {
            // Token is valid, set authenticated state
            setToken(storedToken);
            setUser(meResponse.data.user);
            console.log('✅ Token validated, user authenticated:', meResponse.data.user.display_name);
          } else {
            throw new Error('Invalid token response');
          }
        } catch (validationError) {
          console.log('⚠️ Token validation failed, clearing auth...', validationError);
          // Token is invalid, clear everything
          await apiClient.clearAuthToken();
          await AsyncStorage.removeItem('auth_token');
          await AsyncStorage.removeItem('user');
          setToken(null);
          setUser(null);
        }
      } else {
        console.log('ℹ️ No stored auth found');
        // Ensure state is cleared
        setToken(null);
        setUser(null);
      }
    } catch (error) {
      console.error('❌ Failed to check existing auth:', error);
      // On error, clear auth to be safe
      await apiClient.clearAuthToken();
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
      console.log('✅ Auth check complete');
    }
  };

  const login = async (email: string, password: string) => {
    setIsAuthenticating(true);

    try {
      console.log('🔐 Logging in with real API...');

      // authService.login already stores the token via apiClient.setAuthToken()
      const response = await authService.login({ email, password });

      if (response.success && response.data) {
        const userData = response.data.user;
        const authToken = response.data.token;

        // Update context state only (token already stored by authService)
        setUser(userData);
        setToken(authToken);

        console.log('✅ Login successful!');
        console.log('👤 User:', userData.display_name);
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('❌ Login error:', error);
      throw error;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsAuthenticating(true);

    try {
      console.log('📝 Registering with real API...');

      // authService.register already stores the token via apiClient.setAuthToken()
      const response = await authService.register({
        name,
        email,
        password,
        password_confirmation: password,
      });

      if (response.success && response.data) {
        const userData = response.data.user;
        const authToken = response.data.token;

        // Update context state only (token already stored by authService)
        setUser(userData);
        setToken(authToken);

        console.log('✅ Registration successful!');
        console.log('👤 User:', userData.display_name);
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error: any) {
      console.error('❌ Registration error:', error);
      throw error;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const logout = async () => {
    try {
      // authService.logout already clears token and user from AsyncStorage
      await authService.logout();

      // Clear context state
      setUser(null);
      setToken(null);

      console.log('✅ Logged out and cleared storage');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isLoading,
      isAuthenticating,
      login,
      register,
      logout,
      isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
