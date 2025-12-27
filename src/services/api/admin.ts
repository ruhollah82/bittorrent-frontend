import { apiClient } from './client';
import type {
  AdminDashboard,
  User,
  InviteCode,
  SystemConfig,
  PaginatedResponse,
} from '../../types/api';

export const adminApi = {
  // Dashboard
  getDashboard: async (): Promise<AdminDashboard> => {
    const response = await apiClient.get<AdminDashboard>('/admin/dashboard/');
    return response.data;
  },

  // User management
  getUsers: async (params?: {
    page?: number;
    search?: string;
    is_active?: boolean;
    ordering?: string;
  }): Promise<PaginatedResponse<User>> => {
    const response = await apiClient.get<PaginatedResponse<User>>('/admin/users/', { params });
    return response.data;
  },

  getUser: async (id: number): Promise<User> => {
    const response = await apiClient.get<User>(`/admin/users/${id}/`);
    return response.data;
  },

  updateUser: async (id: number, data: Partial<User>): Promise<User> => {
    const response = await apiClient.patch<User>(`/admin/users/${id}/`, data);
    return response.data;
  },

  deleteUser: async (id: number): Promise<void> => {
    await apiClient.delete(`/admin/users/${id}/`);
  },

  // Invite codes
  getInviteCodes: async (params?: {
    page?: number;
    is_active?: boolean;
    ordering?: string;
  }): Promise<PaginatedResponse<InviteCode>> => {
    const response = await apiClient.get<PaginatedResponse<InviteCode>>('/admin/invite-codes/', { params });
    return response.data;
  },

  createInviteCode: async (data?: { expires_at?: string }): Promise<InviteCode> => {
    const response = await apiClient.post<InviteCode>('/admin/invite-codes/', data);
    return response.data;
  },

  deleteInviteCode: async (id: number): Promise<void> => {
    await apiClient.delete(`/admin/invite-codes/${id}/`);
  },

  // System configuration
  getSystemConfig: async (params?: {
    page?: number;
    category?: string;
    ordering?: string;
  }): Promise<PaginatedResponse<SystemConfig>> => {
    const response = await apiClient.get<PaginatedResponse<SystemConfig>>('/admin/system-config/', { params });
    return response.data;
  },

  updateSystemConfig: async (id: number, data: Partial<SystemConfig>): Promise<SystemConfig> => {
    const response = await apiClient.patch<SystemConfig>(`/admin/system-config/${id}/`, data);
    return response.data;
  },

  // Reports
  generateReport: async (reportType: string, params?: any): Promise<any> => {
    const response = await apiClient.post('/admin/reports/generate/', {
      report_type: reportType,
      ...params,
    });
    return response.data;
  },

  // Bulk actions
  massAction: async (action: string, userIds: number[], params?: any): Promise<{ success: boolean; count: number }> => {
    const response = await apiClient.post('/admin/mass-action/', {
      action,
      user_ids: userIds,
      ...params,
    });
    return response.data;
  },

  // Actions log
  getActionsLog: async (params?: {
    page?: number;
    user?: number;
    action?: string;
    ordering?: string;
  }): Promise<PaginatedResponse<any>> => {
    const response = await apiClient.get<PaginatedResponse<any>>('/admin/actions-log/', { params });
    return response.data;
  },

  // Maintenance
  runMaintenance: async (task: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post('/admin/maintenance/', { task });
    return response.data;
  },

  // Analytics
  getAnalytics: async (metric: string, params?: any): Promise<any> => {
    const response = await apiClient.get('/admin/analytics/', {
      params: { metric, ...params },
    });
    return response.data;
  },

  // Bulk torrent moderation
  bulkTorrentModeration: async (action: string, torrentIds: string[], reason?: string): Promise<{ success: boolean; count: number }> => {
    const response = await apiClient.post('/admin/bulk-torrent-moderation/', {
      action,
      torrent_ids: torrentIds,
      reason,
    });
    return response.data;
  },

  // Cleanup
  runCleanup: async (cleanupType: string): Promise<{ success: boolean; message: string; cleaned_count: number }> => {
    const response = await apiClient.post('/admin/cleanup/', { cleanup_type: cleanupType });
    return response.data;
  },

  // Performance metrics
  getPerformanceMetrics: async (): Promise<any> => {
    const response = await apiClient.get('/admin/performance-metrics/');
    return response.data;
  },
};
