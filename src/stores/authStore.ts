import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '../services/api/auth';
import { userApi } from '../services/api/user';
import type { User, UserRegistrationRequest, UserLoginRequest, TokenPair } from '../types/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: UserLoginRequest) => Promise<void>;
  register: (data: UserRegistrationRequest) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials: UserLoginRequest) => {
        set({ isLoading: true, error: null });
        try {
          const tokenPair = await authApi.login(credentials);

          // Verify tokenPair structure
          if (!tokenPair || !tokenPair.access || !tokenPair.refresh) {
            throw new Error('Invalid token response from server');
          }

          // Store tokens
          localStorage.setItem('access_token', tokenPair.access);
          localStorage.setItem('refresh_token', tokenPair.refresh);

          // Verify tokens are stored
          const storedToken = localStorage.getItem('access_token');
          if (!storedToken) {
            throw new Error('Failed to store access token');
          }

          // Small delay to ensure localStorage is synced
          await new Promise(resolve => setTimeout(resolve, 10));

          // Get user profile with explicit token in headers
          const user = await userApi.getProfile();

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          // Clear tokens on error
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          set({
            error: error.response?.data?.detail || error.message || 'Login failed',
            isLoading: false,
            isAuthenticated: false,
            user: null,
          });
          throw error;
        }
      },

      register: async (data: UserRegistrationRequest) => {
        set({ isLoading: true, error: null });
        try {
          const user = await authApi.register(data);
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.detail || 'Registration failed',
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      refreshToken: async () => {
        try {
          const refreshToken = localStorage.getItem('refresh_token');
          if (!refreshToken) {
            throw new Error('No refresh token');
          }

          const tokenPair = await authApi.refresh(refreshToken);
          localStorage.setItem('access_token', tokenPair.access);
          localStorage.setItem('refresh_token', tokenPair.refresh);
        } catch (error) {
          // Refresh failed, logout
          get().logout();
          throw error;
        }
      },

      checkAuth: async () => {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
          set({ isAuthenticated: false });
          return;
        }

        try {
          // Try to get user profile to verify token is valid
          const user = await userApi.getProfile();
          set({ user, isAuthenticated: true });
        } catch (error) {
          // Token is invalid, try refresh
          try {
            await get().refreshToken();
            // After refresh, fetch user profile again
            const user = await userApi.getProfile();
            set({ user, isAuthenticated: true });
          } catch (refreshError) {
            get().logout();
          }
        }
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
);
