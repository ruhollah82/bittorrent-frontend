import { create } from 'zustand';
import { torrentApi } from '../services/api/torrent';
import type { Torrent, TorrentCategory, TorrentStats, PaginatedResponse } from '../types/api';

interface TorrentState {
  torrents: Torrent[];
  myTorrents: Torrent[];
  categories: TorrentCategory[];
  popularTorrents: Torrent[];
  selectedTorrent: Torrent | null;
  torrentStats: TorrentStats | null;
  pagination: {
    count: number;
    next: string | null;
    previous: string | null;
  } | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchTorrents: (params?: any) => Promise<void>;
  fetchMyTorrents: (params?: any) => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchPopularTorrents: (limit?: number) => Promise<void>;
  fetchTorrent: (infoHash: string) => Promise<void>;
  fetchTorrentStats: (infoHash: string) => Promise<void>;
  uploadTorrent: (data: any) => Promise<Torrent>;
  deleteTorrent: (infoHash: string) => Promise<void>;
  downloadTorrent: (infoHash: string) => Promise<Blob>;
  searchTorrents: (query: string) => Promise<void>;
  clearError: () => void;
}

export const useTorrentStore = create<TorrentState>((set, get) => ({
  torrents: [],
  myTorrents: [],
  categories: [],
  popularTorrents: [],
  selectedTorrent: null,
  torrentStats: null,
  pagination: null,
  isLoading: false,
  error: null,

  fetchTorrents: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response: PaginatedResponse<Torrent> = await torrentApi.getTorrents(params);
      set({
        torrents: response.results,
        pagination: {
          count: response.count,
          next: response.next || null,
          previous: response.previous || null,
        },
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Failed to fetch torrents',
        isLoading: false,
      });
    }
  },

  fetchMyTorrents: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response: PaginatedResponse<Torrent> = await torrentApi.getMyTorrents(params);
      set({
        myTorrents: response.results,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Failed to fetch your torrents',
        isLoading: false,
      });
    }
  },

  fetchCategories: async () => {
    set({ error: null });
    try {
      const categories = await torrentApi.getCategories();
      set({ categories });
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Failed to fetch categories',
      });
    }
  },

  fetchPopularTorrents: async (limit = 10) => {
    set({ error: null });
    try {
      const popularTorrents = await torrentApi.getPopularTorrents(limit);
      set({ popularTorrents });
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Failed to fetch popular torrents',
      });
    }
  },

  fetchTorrent: async (infoHash: string) => {
    set({ isLoading: true, error: null });
    try {
      const torrent = await torrentApi.getTorrent(infoHash);
      set({
        selectedTorrent: torrent,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Failed to fetch torrent',
        isLoading: false,
      });
    }
  },

  fetchTorrentStats: async (infoHash: string) => {
    set({ error: null });
    try {
      const stats = await torrentApi.getTorrentStats(infoHash);
      set({ torrentStats: stats });
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Failed to fetch torrent stats',
      });
    }
  },

  uploadTorrent: async (data: any) => {
    set({ isLoading: true, error: null });
    try {
      const torrent = await torrentApi.uploadTorrent(data);
      // Refresh my torrents after upload
      get().fetchMyTorrents();
      set({ isLoading: false });
      return torrent;
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Failed to upload torrent',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteTorrent: async (infoHash: string) => {
    set({ isLoading: true, error: null });
    try {
      await torrentApi.deleteTorrent(infoHash);
      // Refresh torrents after deletion
      get().fetchMyTorrents();
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Failed to delete torrent',
        isLoading: false,
      });
      throw error;
    }
  },

  downloadTorrent: async (infoHash: string) => {
    set({ error: null });
    try {
      const blob = await torrentApi.downloadTorrent(infoHash);
      return blob;
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Failed to download torrent',
      });
      throw error;
    }
  },

  searchTorrents: async (query: string) => {
    await get().fetchTorrents({ search: query });
  },

  clearError: () => {
    set({ error: null });
  },
}));
