import { create } from 'zustand';
import { userApi } from '../services/api/user';
import type { User, UserStats } from '../types/api';

interface UserState {
  profile: User | null;
  stats: UserStats | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchProfile: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  fetchStats: () => Promise<void>;
  clearError: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  profile: null,
  stats: null,
  isLoading: false,
  error: null,

  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const profile = await userApi.getProfile();
      set({ profile, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Failed to fetch profile',
        isLoading: false,
      });
    }
  },

  updateProfile: async (data: Partial<User>) => {
    set({ isLoading: true, error: null });
    try {
      const updatedProfile = await userApi.updateProfile(data);
      set({
        profile: updatedProfile,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Failed to update profile',
        isLoading: false,
      });
      throw error;
    }
  },

  fetchStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const stats = await userApi.getStats();
      set({ stats, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Failed to fetch stats',
        isLoading: false,
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
