import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG, APIResponse } from '../config/api';

class APIClient {
  private client: AxiosInstance;
  private authToken: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: API_CONFIG.DEFAULT_HEADERS,
    });

    this.setupInterceptors();
    this.loadStoredToken();
  }

  private setupInterceptors() {
    // Request interceptor - Add auth token
    this.client.interceptors.request.use(
      async (config) => {
        // Add auth token if available
        const token = await this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Debug logging
        if (API_CONFIG.DEBUG_REQUESTS) {
          console.log('🚀 API Request:', {
            method: config.method?.toUpperCase(),
            url: config.url,
            headers: config.headers,
            data: config.data,
          });
        }

        return config;
      },
      (error) => {
        if (API_CONFIG.DEBUG_REQUESTS) {
          console.error('❌ Request Error:', error);
        }
        return Promise.reject(error);
      }
    );

    // Response interceptor - Handle responses and errors
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        if (API_CONFIG.DEBUG_REQUESTS) {
          console.log('✅ API Response:', {
            status: response.status,
            data: response.data,
          });
        }
        return response;
      },
      async (error: AxiosError) => {
        if (API_CONFIG.DEBUG_REQUESTS) {
          console.error('❌ API Error:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
          });
        }

        // Handle authentication errors
        if (error.response?.status === API_CONFIG.HTTP_STATUS.UNAUTHORIZED) {
          await this.clearAuthToken();
          // Notify app about auth failure
          this.notifyAuthFailure();
        }

        return Promise.reject(this.transformError(error));
      }
    );
  }

  private async loadStoredToken() {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (token) {
        this.authToken = token;
        if (API_CONFIG.DEBUG_AUTH) {
          console.log('🔑 Loaded stored auth token');
        }
      }
    } catch (error) {
      console.error('Failed to load stored auth token:', error);
    }
  }

  private async getAuthToken(): Promise<string | null> {
    if (!this.authToken) {
      this.authToken = await AsyncStorage.getItem('auth_token');
    }
    return this.authToken;
  }

  public async setAuthToken(token: string): Promise<void> {
    this.authToken = token;
    try {
      await AsyncStorage.setItem('auth_token', token);
      if (API_CONFIG.DEBUG_AUTH) {
        console.log('🔑 Auth token stored');
      }
    } catch (error) {
      console.error('Failed to store auth token:', error);
    }
  }

  public async clearAuthToken(): Promise<void> {
    this.authToken = null;
    try {
      await AsyncStorage.removeItem('auth_token');
      if (API_CONFIG.DEBUG_AUTH) {
        console.log('🔑 Auth token cleared');
      }
    } catch (error) {
      console.error('Failed to clear auth token:', error);
    }
  }

  private authFailureCallback: (() => void) | null = null;

  public setAuthFailureCallback(callback: () => void) {
    this.authFailureCallback = callback;
  }

  private notifyAuthFailure() {
    if (API_CONFIG.DEBUG_AUTH) {
      console.log('🔓 Authentication failed - token cleared');
    }

    // Notify the app (e.g., AuthContext) to logout
    if (this.authFailureCallback) {
      this.authFailureCallback();
    }
  }

  private transformError(error: AxiosError): APIError {
    if (error.code === 'ECONNABORTED') {
      return new APIError('Request timeout', API_CONFIG.ERROR_CODES.TIMEOUT);
    }

    if (!error.response) {
      return new APIError('Network error', API_CONFIG.ERROR_CODES.NETWORK_ERROR);
    }

    const status = error.response.status;
    const data = error.response.data as any;

    switch (status) {
      case API_CONFIG.HTTP_STATUS.UNAUTHORIZED:
        return new APIError(
          data?.message || 'Unauthorized',
          API_CONFIG.ERROR_CODES.UNAUTHORIZED,
          status,
          data
        );

      case API_CONFIG.HTTP_STATUS.FORBIDDEN:
        return new APIError(
          data?.message || 'Forbidden',
          API_CONFIG.ERROR_CODES.FORBIDDEN,
          status,
          data
        );

      case API_CONFIG.HTTP_STATUS.NOT_FOUND:
        return new APIError(
          data?.message || 'Not found',
          API_CONFIG.ERROR_CODES.NOT_FOUND,
          status,
          data
        );

      case API_CONFIG.HTTP_STATUS.UNPROCESSABLE_ENTITY:
        return new APIError(
          data?.message || 'Validation error',
          API_CONFIG.ERROR_CODES.VALIDATION_ERROR,
          status,
          data
        );

      case API_CONFIG.HTTP_STATUS.INTERNAL_SERVER_ERROR:
        return new APIError(
          data?.message || 'Server error',
          API_CONFIG.ERROR_CODES.SERVER_ERROR,
          status,
          data
        );

      default:
        return new APIError(
          data?.message || 'Unknown error',
          API_CONFIG.ERROR_CODES.SERVER_ERROR,
          status,
          data
        );
    }
  }

  // HTTP Methods
  public async get<T = any>(url: string, params?: any): Promise<APIResponse<T>> {
    const response = await this.client.get(url, { params });
    return response.data;
  }

  public async post<T = any>(url: string, data?: any): Promise<APIResponse<T>> {
    const response = await this.client.post(url, data);
    return response.data;
  }

  public async patch<T = any>(url: string, data?: any): Promise<APIResponse<T>> {
    const response = await this.client.patch(url, data);
    return response.data;
  }

  public async put<T = any>(url: string, data?: any): Promise<APIResponse<T>> {
    const response = await this.client.put(url, data);
    return response.data;
  }

  public async delete<T = any>(url: string): Promise<APIResponse<T>> {
    const response = await this.client.delete(url);
    return response.data;
  }

  // Utility methods
  public isAuthenticated(): boolean {
    return !!this.authToken;
  }

  public getBaseURL(): string {
    return API_CONFIG.BASE_URL;
  }
}

export class APIError extends Error {
  public code: string;
  public status?: number;
  public data?: any;

  constructor(message: string, code: string, status?: number, data?: any) {
    super(message);
    this.name = 'APIError';
    this.code = code;
    this.status = status;
    this.data = data;
  }
}

// Export singleton instance
export const apiClient = new APIClient();
export default apiClient;