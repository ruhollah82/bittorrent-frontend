import { apiClient } from './client';
import type {
  CreditTransaction,
  UserClass,
  RatioStatus,
  DownloadCheck,
  LockCreditResponse,
  CompleteDownloadResponse,
  PaginatedResponse,
} from '../../types/api';

export const creditApi = {
  // Balance
  getBalance: async (): Promise<{ credits: string; bonus_points: string }> => {
    const response = await apiClient.get('/credits/balance/');
    return response.data;
  },

  // Transactions
  getTransactions: async (params?: {
    page?: number;
    ordering?: string;
  }): Promise<PaginatedResponse<CreditTransaction>> => {
    const response = await apiClient.get<PaginatedResponse<CreditTransaction>>('/credits/transactions/', { params });
    return response.data;
  },

  getTransaction: async (id: number): Promise<CreditTransaction> => {
    const response = await apiClient.get<CreditTransaction>(`/credits/transactions/${id}/`);
    return response.data;
  },

  // User classes
  getUserClasses: async (): Promise<UserClass[]> => {
    const response = await apiClient.get<UserClass[]>('/credits/user-classes/');
    return response.data;
  },

  // Download operations
  checkDownload: async (torrentId: string): Promise<DownloadCheck> => {
    const response = await apiClient.post<DownloadCheck>('/credits/check-download/', {
      torrent_id: torrentId,
    });
    return response.data;
  },

  lockCredit: async (torrentId: string, amount: string): Promise<LockCreditResponse> => {
    const response = await apiClient.post<LockCreditResponse>('/credits/lock-credit/', {
      torrent_id: torrentId,
      amount,
    });
    return response.data;
  },

  completeDownload: async (torrentId: string, transactionId: number): Promise<CompleteDownloadResponse> => {
    const response = await apiClient.post<CompleteDownloadResponse>('/credits/complete-download/', {
      torrent_id: torrentId,
      transaction_id: transactionId,
    });
    return response.data;
  },

  // Upload credit
  uploadCredit: async (torrentId: string, size: number): Promise<{ credits_earned: string }> => {
    const response = await apiClient.post('/credits/upload-credit/', {
      torrent_id: torrentId,
      size,
    });
    return response.data;
  },

  // Ratio status
  getRatioStatus: async (): Promise<RatioStatus> => {
    const response = await apiClient.get<RatioStatus>('/credits/ratio-status/');
    return response.data;
  },

  // Admin operations
  adjustCredits: async (userId: number, amount: string, reason: string): Promise<CreditTransaction> => {
    const response = await apiClient.post<CreditTransaction>('/credits/admin/adjust/', {
      user_id: userId,
      amount,
      reason,
    });
    return response.data;
  },

  promoteUser: async (userId: number, newClassId: number): Promise<{ success: boolean }> => {
    const response = await apiClient.post('/credits/admin/promote/', {
      user_id: userId,
      new_class_id: newClassId,
    });
    return response.data;
  },
};
