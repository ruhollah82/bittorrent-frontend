import { apiClient } from './client';
import type {
  UserRegistrationRequest,
  UserLoginRequest,
  TokenPair,
  User,
  InviteCode,
  LoginResponse,
} from '../../types/api';

export const authApi = {
  // Authentication
  register: async (data: UserRegistrationRequest): Promise<User> => {
    const response = await apiClient.post<User>('/auth/register/', data);
    return response.data;
  },

  login: async (data: UserLoginRequest): Promise<TokenPair> => {
    const response = await apiClient.post<LoginResponse>('/auth/login/', data);

    // Handle nested tokens structure
    if (!response.data || !response.data.tokens || !response.data.tokens.access || !response.data.tokens.refresh) {
      console.error('Invalid token response structure:', response.data);
      throw new Error(`Invalid token response structure. Expected nested 'tokens' object with 'access' and 'refresh' tokens, but got: ${JSON.stringify(response.data)}`);
    }

    return {
      access: response.data.tokens.access,
      refresh: response.data.tokens.refresh,
    };
  },

  refresh: async (refreshToken: string): Promise<TokenPair> => {
    const response = await apiClient.post<TokenPair>('/auth/refresh/', {
      refresh: refreshToken,
    });
    
    // According to API spec, response should be TokenRefresh with access and refresh
    if (!response.data || !response.data.access || !response.data.refresh) {
      console.error('Invalid refresh token response structure:', response.data);
      throw new Error(`Invalid refresh token response structure. Expected 'access' and 'refresh' tokens, but got: ${JSON.stringify(response.data)}`);
    }
    
    return {
      access: response.data.access,
      refresh: response.data.refresh,
    };
  },

  // Invite codes
  createInvite: async (): Promise<InviteCode> => {
    const response = await apiClient.post<InviteCode>('/auth/invite/create/');
    return response.data;
  },

  // Generate user invite codes (costs credits)
  generateInvite: async (): Promise<{ code: string; expires_at: string; is_active: boolean }> => {
    const response = await apiClient.post('/auth/invite/generate/');
    return response.data;
  },
};
