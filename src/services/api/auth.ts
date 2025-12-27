import { apiClient } from './client';
import type {
  UserRegistrationRequest,
  UserLoginRequest,
  TokenPair,
  User,
  InviteCode,
} from '../../types/api';

export const authApi = {
  // Authentication
  register: async (data: UserRegistrationRequest): Promise<User> => {
    const response = await apiClient.post<User>('/auth/register/', data);
    return response.data;
  },

  login: async (data: UserLoginRequest): Promise<TokenPair> => {
    const response = await apiClient.post<TokenPair>('/auth/login/', data);
    return response.data;
  },

  refresh: async (refreshToken: string): Promise<TokenPair> => {
    const response = await apiClient.post<TokenPair>('/auth/refresh/', {
      refresh: refreshToken,
    });
    return response.data;
  },

  // Invite codes
  createInvite: async (): Promise<InviteCode> => {
    const response = await apiClient.post<InviteCode>('/auth/invite/create/');
    return response.data;
  },
};
