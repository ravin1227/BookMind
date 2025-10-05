import { create } from 'zustand';
import { authService, RegisterData, LoginData, DeviceData } from '../services/authService';
import { User, APIResponse, AuthResponse, API_CONFIG } from '../config/api';
import { APIError } from '../services/apiClient';

interface AuthState {
  // Auth state
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  register: (data: RegisterData) => Promise<boolean>;
  login: (data: LoginData) => Promise<boolean>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<boolean>;
  registerDevice: (deviceData: DeviceData) => Promise<boolean>;
  updateProfile: (updates: Partial<Pick<User, 'name' | 'email'>>) => Promise<boolean>;
  clearError: () => void;

  // Initialization
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Register new user
  register: async (data: RegisterData): Promise<boolean> => {
    set({ isLoading: true, error: null });

    try {
      const response: AuthResponse = await authService.register(data);

      if (response.success && response.data) {
        set({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return true;
      } else {
        set({
          error: response.message || 'Registration failed',
          isLoading: false,
        });
        return false;
      }
    } catch (error) {
      let errorMessage = 'Registration failed. Please try again.';

      if (error instanceof APIError) {
        // Try to get specific error messages from the API response
        if (error.data && error.data.errors && Array.isArray(error.data.errors)) {
          errorMessage = error.data.errors.join(', ');
        } else if (error.data && error.data.message) {
          errorMessage = error.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      if (API_CONFIG.DEBUG_AUTH) {
        console.error('❌ Registration error details:', error);
      }

      set({
        error: errorMessage,
        isLoading: false,
      });
      return false;
    }
  },

  // Login user
  login: async (data: LoginData): Promise<boolean> => {
    set({ isLoading: true, error: null });

    try {
      const response: AuthResponse = await authService.login(data);

      if (response.success && response.data) {
        set({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return true;
      } else {
        set({
          error: response.message || 'Login failed',
          isLoading: false,
        });
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof APIError
        ? error.message
        : 'Login failed. Please check your credentials.';

      set({
        error: errorMessage,
        isLoading: false,
      });
      return false;
    }
  },

  // Logout user
  logout: async (): Promise<void> => {
    set({ isLoading: true });

    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  // Get current user profile
  getCurrentUser: async (): Promise<boolean> => {
    if (!authService.isAuthenticated()) {
      return false;
    }

    set({ isLoading: true, error: null });

    try {
      const response = await authService.getCurrentUser();

      if (response.success && response.data) {
        set({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return true;
      } else {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: response.message || 'Failed to get user profile',
        });
        return false;
      }
    } catch (error) {
      console.error('Get current user error:', error);
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null, // Don't show error for this, just logout silently
      });
      return false;
    }
  },

  // Register device for push notifications
  registerDevice: async (deviceData: DeviceData): Promise<boolean> => {
    try {
      const response = await authService.registerDevice(deviceData);
      return response.success;
    } catch (error) {
      console.error('Device registration error:', error);
      return false;
    }
  },

  // Update user profile
  updateProfile: async (updates: Partial<Pick<User, 'name' | 'email'>>): Promise<boolean> => {
    set({ isLoading: true, error: null });

    try {
      const response = await authService.updateProfile(updates);

      if (response.success && response.data) {
        set({
          user: response.data.user,
          isLoading: false,
          error: null,
        });
        return true;
      } else {
        set({
          error: response.message || 'Profile update failed',
          isLoading: false,
        });
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof APIError
        ? error.message
        : 'Profile update failed. Please try again.';

      set({
        error: errorMessage,
        isLoading: false,
      });
      return false;
    }
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },

  // Initialize auth state on app startup
  initialize: async (): Promise<void> => {
    set({ isLoading: true });

    // Check if user is already authenticated
    if (authService.isAuthenticated()) {
      const userData = authService.getCurrentUserData();
      if (userData) {
        set({
          user: userData,
          isAuthenticated: true,
          isLoading: false,
        });

        // Optionally refresh user data from server
        get().getCurrentUser();
      } else {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } else {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));

// Legacy export for compatibility
export const useAppStore = create<{
  isReady: boolean;
  setReady: (ready: boolean) => void;
}>((set) => ({
  isReady: false,
  setReady: (ready: boolean) => set({ isReady: ready }),
}));