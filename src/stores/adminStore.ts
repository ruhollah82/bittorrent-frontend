import { create } from 'zustand';
import { adminApi } from '../services/api/admin';
import type {
  AdminDashboard,
  User,
  InviteCode,
  SystemConfig,
  PaginatedResponse,
} from '../types/api';

interface AdminState {
  dashboard: AdminDashboard | null;
  users: User[];
  inviteCodes: InviteCode[];
  systemConfigs: SystemConfig[];
  userPagination: {
    count: number;
    next: string | null;
    previous: string | null;
  } | null;
  inviteCodePagination: {
    count: number;
    next: string | null;
    previous: string | null;
  } | null;
  systemConfigPagination: {
    count: number;
    next: string | null;
    previous: string | null;
  } | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchDashboard: () => Promise<void>;
  fetchUsers: (params?: any) => Promise<void>;
  fetchUser: (id: number) => Promise<User>;
  updateUser: (id: number, data: Partial<User>) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
  fetchInviteCodes: (params?: any) => Promise<void>;
  createInviteCode: (data?: any) => Promise<void>;
  deleteInviteCode: (id: number) => Promise<void>;
  fetchSystemConfigs: (params?: any) => Promise<void>;
  updateSystemConfig: (id: number, data: Partial<SystemConfig>) => Promise<void>;
  generateReport: (reportType: string, params?: any) => Promise<any>;
  runMaintenance: (task: string) => Promise<void>;
  getAnalytics: (metric: string, params?: any) => Promise<any>;
  runCleanup: (cleanupType: string) => Promise<void>;
  getPerformanceMetrics: () => Promise<any>;
  clearError: () => void;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  dashboard: null,
  users: [],
  inviteCodes: [],
  systemConfigs: [],
  userPagination: null,
  inviteCodePagination: null,
  systemConfigPagination: null,
  isLoading: false,
  error: null,

  fetchDashboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const dashboard = await adminApi.getDashboard();
      set({ dashboard, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Failed to fetch dashboard',
        isLoading: false,
      });
    }
  },

  fetchUsers: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response: PaginatedResponse<User> = await adminApi.getUsers(params);
      set({
        users: response.results,
        userPagination: {
          count: response.count,
          next: response.next || null,
          previous: response.previous || null,
        },
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Failed to fetch users',
        isLoading: false,
      });
    }
  },

  fetchUser: async (id: number) => {
    set({ error: null });
    try {
      const user = await adminApi.getUser(id);
      return user;
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Failed to fetch user',
      });
      throw error;
    }
  },

  updateUser: async (id: number, data: Partial<User>) => {
    set({ isLoading: true, error: null });
    try {
      await adminApi.updateUser(id, data);
      // Refresh users list
      get().fetchUsers();
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Failed to update user',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteUser: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await adminApi.deleteUser(id);
      // Refresh users list
      get().fetchUsers();
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Failed to delete user',
        isLoading: false,
      });
      throw error;
    }
  },

  fetchInviteCodes: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response: PaginatedResponse<InviteCode> = await adminApi.getInviteCodes(params);
      set({
        inviteCodes: response.results,
        inviteCodePagination: {
          count: response.count,
          next: response.next || null,
          previous: response.previous || null,
        },
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Failed to fetch invite codes',
        isLoading: false,
      });
    }
  },

  createInviteCode: async (data = {}) => {
    set({ isLoading: true, error: null });
    try {
      await adminApi.createInviteCode(data);
      // Refresh invite codes
      get().fetchInviteCodes();
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Failed to create invite code',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteInviteCode: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await adminApi.deleteInviteCode(id);
      // Refresh invite codes
      get().fetchInviteCodes();
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Failed to delete invite code',
        isLoading: false,
      });
      throw error;
    }
  },

  fetchSystemConfigs: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response: PaginatedResponse<SystemConfig> = await adminApi.getSystemConfig(params);
      set({
        systemConfigs: response.results,
        systemConfigPagination: {
          count: response.count,
          next: response.next || null,
          previous: response.previous || null,
        },
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Failed to fetch system configs',
        isLoading: false,
      });
    }
  },

  updateSystemConfig: async (id: number, data: Partial<SystemConfig>) => {
    set({ isLoading: true, error: null });
    try {
      await adminApi.updateSystemConfig(id, data);
      // Refresh system configs
      get().fetchSystemConfigs();
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Failed to update system config',
        isLoading: false,
      });
      throw error;
    }
  },

  generateReport: async (reportType: string, params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const report = await adminApi.generateReport(reportType, params);
      set({ isLoading: false });
      return report;
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Failed to generate report',
        isLoading: false,
      });
      throw error;
    }
  },

  runMaintenance: async (task: string) => {
    set({ isLoading: true, error: null });
    try {
      await adminApi.runMaintenance(task);
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Failed to run maintenance',
        isLoading: false,
      });
      throw error;
    }
  },

  getAnalytics: async (metric: string, params = {}) => {
    set({ error: null });
    try {
      const analytics = await adminApi.getAnalytics(metric, params);
      return analytics;
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Failed to get analytics',
      });
      throw error;
    }
  },

  runCleanup: async (cleanupType: string) => {
    set({ isLoading: true, error: null });
    try {
      await adminApi.runCleanup(cleanupType);
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Failed to run cleanup',
        isLoading: false,
      });
      throw error;
    }
  },

  getPerformanceMetrics: async () => {
    set({ error: null });
    try {
      const metrics = await adminApi.getPerformanceMetrics();
      return metrics;
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Failed to get performance metrics',
      });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
