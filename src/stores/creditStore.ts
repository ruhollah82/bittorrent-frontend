import { create } from 'zustand';
import { creditApi } from '../services/api/credit';
import type {
  CreditTransaction,
  UserClass,
  RatioStatus,
  DownloadCheck,
  PaginatedResponse,
} from '../types/api';

interface CreditState {
  balance: { credits: string; bonus_points: string } | null;
  transactions: CreditTransaction[];
  userClasses: UserClass[];
  ratioStatus: RatioStatus | null;
  pagination: {
    count: number;
    next: string | null;
    previous: string | null;
  } | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchBalance: () => Promise<void>;
  fetchTransactions: (params?: any) => Promise<void>;
  fetchUserClasses: () => Promise<void>;
  fetchRatioStatus: () => Promise<void>;
  checkDownload: (torrentId: string) => Promise<DownloadCheck>;
  lockCredit: (torrentId: string, amount: string) => Promise<any>;
  completeDownload: (torrentId: string, transactionId: number) => Promise<any>;
  uploadCredit: (torrentId: string, size: number) => Promise<any>;
  adjustCredits: (userId: number, amount: string, reason: string) => Promise<void>;
  promoteUser: (userId: number, newClassId: number) => Promise<void>;
  clearError: () => void;
}

export const useCreditStore = create<CreditState>((set, get) => ({
  balance: null,
  transactions: [],
  userClasses: [],
  ratioStatus: null,
  pagination: null,
  isLoading: false,
  error: null,

  fetchBalance: async () => {
    set({ error: null });
    try {
      const balance = await creditApi.getBalance();
      set({ balance });
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Failed to fetch balance',
      });
    }
  },

  fetchTransactions: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response: PaginatedResponse<CreditTransaction> = await creditApi.getTransactions(params);
      set({
        transactions: response.results,
        pagination: {
          count: response.count,
          next: response.next || null,
          previous: response.previous || null,
        },
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Failed to fetch transactions',
        isLoading: false,
      });
    }
  },

  fetchUserClasses: async () => {
    set({ error: null });
    try {
      const userClasses = await creditApi.getUserClasses();
      set({ userClasses });
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Failed to fetch user classes',
      });
    }
  },

  fetchRatioStatus: async () => {
    set({ error: null });
    try {
      const ratioStatus = await creditApi.getRatioStatus();
      set({ ratioStatus });
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Failed to fetch ratio status',
      });
    }
  },

  checkDownload: async (torrentId: string) => {
    set({ error: null });
    try {
      const result = await creditApi.checkDownload(torrentId);
      return result;
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Failed to check download',
      });
      throw error;
    }
  },

  lockCredit: async (torrentId: string, amount: string) => {
    set({ error: null });
    try {
      const result = await creditApi.lockCredit(torrentId, amount);
      // Refresh balance after locking credit
      get().fetchBalance();
      return result;
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Failed to lock credit',
      });
      throw error;
    }
  },

  completeDownload: async (torrentId: string, transactionId: number) => {
    set({ error: null });
    try {
      const result = await creditApi.completeDownload(torrentId, transactionId);
      // Refresh balance and transactions after completing download
      get().fetchBalance();
      get().fetchTransactions();
      return result;
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Failed to complete download',
      });
      throw error;
    }
  },

  uploadCredit: async (torrentId: string, size: number) => {
    set({ error: null });
    try {
      const result = await creditApi.uploadCredit(torrentId, size);
      // Refresh balance after uploading
      get().fetchBalance();
      return result;
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Failed to upload credit',
      });
      throw error;
    }
  },

  adjustCredits: async (userId: number, amount: string, reason: string) => {
    set({ isLoading: true, error: null });
    try {
      await creditApi.adjustCredits(userId, amount, reason);
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Failed to adjust credits',
        isLoading: false,
      });
      throw error;
    }
  },

  promoteUser: async (userId: number, newClassId: number) => {
    set({ isLoading: true, error: null });
    try {
      await creditApi.promoteUser(userId, newClassId);
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Failed to promote user',
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
