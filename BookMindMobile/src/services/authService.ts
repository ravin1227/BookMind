import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from './apiClient';
import { API_CONFIG, AuthResponse, User, Device, APIResponse } from '../config/api';

export interface RegisterData {
  email: string;
  name: string;
  password: string;
  password_confirmation: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface DeviceData {
  device_token: string;
  device_type: 'ios' | 'android';
  device_name: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  reset_token: string;
  password: string;
  password_confirmation: string;
}

class AuthService {
  private currentUser: User | null = null;

  constructor() {
    this.loadStoredUser();
  }

  private async loadStoredUser(): Promise<void> {
    try {
      const userJson = await AsyncStorage.getItem('user');
      if (userJson) {
        this.currentUser = JSON.parse(userJson);
        if (API_CONFIG.DEBUG_AUTH) {
          console.log('👤 Loaded stored user:', this.currentUser?.email);
        }
      }
    } catch (error) {
      console.error('Failed to load stored user:', error);
    }
  }

  private async storeUser(user: User): Promise<void> {
    try {
      this.currentUser = user;
      await AsyncStorage.setItem('user', JSON.stringify(user));
      if (API_CONFIG.DEBUG_AUTH) {
        console.log('👤 User stored:', user.email);
      }
    } catch (error) {
      console.error('Failed to store user:', error);
    }
  }

  private async clearStoredUser(): Promise<void> {
    try {
      this.currentUser = null;
      await AsyncStorage.removeItem('user');
      if (API_CONFIG.DEBUG_AUTH) {
        console.log('👤 User data cleared');
      }
    } catch (error) {
      console.error('Failed to clear user data:', error);
    }
  }

  /**
   * Register a new user account
   */
  public async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse['data']>(
        API_CONFIG.ENDPOINTS.AUTH.REGISTER,
        { user: userData }
      );

      if (response.success && response.data) {
        // Store auth token and user data
        await apiClient.setAuthToken(response.data.token);
        await this.storeUser(response.data.user);

        if (API_CONFIG.DEBUG_AUTH) {
          console.log('✅ Registration successful:', response.data.user.email);
        }
      }

      return response as AuthResponse;
    } catch (error) {
      if (API_CONFIG.DEBUG_AUTH) {
        console.error('❌ Registration failed:', error);
      }
      throw error;
    }
  }

  /**
   * Login with email and password
   */
  public async login(loginData: LoginData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse['data']>(
        API_CONFIG.ENDPOINTS.AUTH.LOGIN,
        { auth: loginData }
      );

      if (response.success && response.data) {
        // Store auth token and user data
        await apiClient.setAuthToken(response.data.token);
        await this.storeUser(response.data.user);

        if (API_CONFIG.DEBUG_AUTH) {
          console.log('✅ Login successful:', response.data.user.email);
        }
      }

      return response as AuthResponse;
    } catch (error) {
      if (API_CONFIG.DEBUG_AUTH) {
        console.error('❌ Login failed:', error);
      }
      throw error;
    }
  }

  /**
   * Logout current user
   */
  public async logout(): Promise<void> {
    try {
      // Call logout endpoint (optional, since JWT is stateless)
      await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      // Ignore logout API errors
      console.warn('Logout API call failed:', error);
    } finally {
      // Always clear local data
      await apiClient.clearAuthToken();
      await this.clearStoredUser();

      if (API_CONFIG.DEBUG_AUTH) {
        console.log('✅ Logout completed');
      }
    }
  }

  /**
   * Get current user profile from server
   */
  public async getCurrentUser(): Promise<APIResponse<{ user: User }>> {
    try {
      const response = await apiClient.get<{ user: User }>(
        API_CONFIG.ENDPOINTS.AUTH.ME
      );

      if (response.success && response.data) {
        await this.storeUser(response.data.user);
      }

      return response;
    } catch (error) {
      if (API_CONFIG.DEBUG_AUTH) {
        console.error('❌ Failed to get current user:', error);
      }
      throw error;
    }
  }

  /**
   * Request password reset
   */
  public async forgotPassword(data: ForgotPasswordData): Promise<APIResponse> {
    try {
      const response = await apiClient.post(
        API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD,
        data
      );

      if (API_CONFIG.DEBUG_AUTH) {
        console.log('✅ Password reset requested:', data.email);
      }

      return response;
    } catch (error) {
      if (API_CONFIG.DEBUG_AUTH) {
        console.error('❌ Password reset request failed:', error);
      }
      throw error;
    }
  }

  /**
   * Reset password with token
   */
  public async resetPassword(data: ResetPasswordData): Promise<APIResponse> {
    try {
      const response = await apiClient.post(
        API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD,
        data
      );

      if (API_CONFIG.DEBUG_AUTH) {
        console.log('✅ Password reset successful');
      }

      return response;
    } catch (error) {
      if (API_CONFIG.DEBUG_AUTH) {
        console.error('❌ Password reset failed:', error);
      }
      throw error;
    }
  }

  /**
   * Register device for push notifications
   */
  public async registerDevice(deviceData: DeviceData): Promise<APIResponse<{ device: Device }>> {
    try {
      if (!this.currentUser) {
        throw new Error('User not authenticated');
      }

      const response = await apiClient.post<{ device: Device }>(
        API_CONFIG.ENDPOINTS.USERS.REGISTER_DEVICE(this.currentUser.uuid),
        { device: deviceData }
      );

      if (API_CONFIG.DEBUG_AUTH) {
        console.log('✅ Device registered:', deviceData.device_name);
      }

      return response;
    } catch (error) {
      if (API_CONFIG.DEBUG_AUTH) {
        console.error('❌ Device registration failed:', error);
      }
      throw error;
    }
  }

  /**
   * Update user profile
   */
  public async updateProfile(updates: Partial<Pick<User, 'name' | 'email'>>): Promise<APIResponse<{ user: User }>> {
    try {
      if (!this.currentUser) {
        throw new Error('User not authenticated');
      }

      const response = await apiClient.patch<{ user: User }>(
        API_CONFIG.ENDPOINTS.USERS.UPDATE(this.currentUser.uuid),
        { user: updates }
      );

      if (response.success && response.data) {
        await this.storeUser(response.data.user);
      }

      return response;
    } catch (error) {
      if (API_CONFIG.DEBUG_AUTH) {
        console.error('❌ Profile update failed:', error);
      }
      throw error;
    }
  }

  /**
   * Get user statistics
   */
  public async getUserStats(): Promise<APIResponse<{ stats: User['stats'] }>> {
    try {
      if (!this.currentUser) {
        throw new Error('User not authenticated');
      }

      const response = await apiClient.get<{ stats: User['stats'] }>(
        API_CONFIG.ENDPOINTS.USERS.STATS(this.currentUser.uuid)
      );

      return response;
    } catch (error) {
      if (API_CONFIG.DEBUG_AUTH) {
        console.error('❌ Failed to get user stats:', error);
      }
      throw error;
    }
  }

  // Utility methods
  public isAuthenticated(): boolean {
    return apiClient.isAuthenticated() && !!this.currentUser;
  }

  public getCurrentUserData(): User | null {
    return this.currentUser;
  }

  public getCurrentUserUUID(): string | null {
    return this.currentUser?.uuid || null;
  }

  public isEmailVerified(): boolean {
    return this.currentUser?.email_verified || false;
  }

  public getAccountStatus(): User['account_status'] | null {
    return this.currentUser?.account_status || null;
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;