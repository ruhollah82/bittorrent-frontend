import { apiClient } from './client';
import type { User, UserStats, PaginatedResponse } from '../../types/api';

export const userApi = {
  // Profile
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<User>('/user/profile/');
    return response.data;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const formData = new FormData();

    // Add fields to form data
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if ((value as any) instanceof File) {
          formData.append(key, value as File);
        } else {
          formData.append(key, String(value));
        }
      }
    });

    const response = await apiClient.patch<User>('/user/profile/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Avatar upload via PATCH /user/profile/
  uploadAvatar: async (file: File): Promise<User> => {
    const formData = new FormData();
    formData.append('profile_picture', file);
    const response = await apiClient.patch<User>('/user/profile/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Remove avatar by sending empty value
  removeAvatar: async (): Promise<User> => {
    const formData = new FormData();
    formData.append('profile_picture', '');
    const response = await apiClient.patch<User>('/user/profile/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Stats
  getStats: async (): Promise<UserStats> => {
    const response = await apiClient.get<UserStats>('/user/stats/');
    return response.data;
  },

  // API Tokens (if available in the API)
  getTokens: async (): Promise<any[]> => {
    const response = await apiClient.get<any[]>('/user/tokens/');
    return response.data;
  },

  createToken: async (data: { name: string; permissions?: string[] }): Promise<any> => {
    const response = await apiClient.post('/user/tokens/', data);
    return response.data;
  },

  deleteToken: async (tokenId: number): Promise<void> => {
    await apiClient.delete(`/user/tokens/${tokenId}/`);
  },
};
