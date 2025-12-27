import { apiClient } from './client';
import type {
  Torrent,
  TorrentUploadRequest,
  TorrentCategory,
  TorrentStats,
  TorrentFile,
  PaginatedResponse,
} from '../../types/api';

export const torrentApi = {
  // Torrent listing and search
  getTorrents: async (params?: {
    page?: number;
    search?: string;
    category?: string;
    ordering?: string;
  }): Promise<PaginatedResponse<Torrent>> => {
    const response = await apiClient.get<PaginatedResponse<Torrent>>('/torrents/', { params });
    return response.data;
  },

  // Individual torrent
  getTorrent: async (infoHash: string): Promise<Torrent> => {
    const response = await apiClient.get<Torrent>(`/torrents/${infoHash}/`);
    return response.data;
  },

  // Torrent stats
  getTorrentStats: async (infoHash: string): Promise<TorrentStats> => {
    const response = await apiClient.get<TorrentStats>(`/torrents/${infoHash}/stats/`);
    return response.data;
  },

  // Torrent peers
  getTorrentPeers: async (infoHash: string): Promise<any[]> => {
    const response = await apiClient.get<any[]>(`/torrents/${infoHash}/peers/`);
    return response.data;
  },

  // Torrent health
  getTorrentHealth: async (infoHash: string): Promise<{ health: string; score: number }> => {
    const response = await apiClient.get(`/torrents/${infoHash}/health/`);
    return response.data;
  },

  // Upload torrent
  uploadTorrent: async (data: TorrentUploadRequest): Promise<Torrent> => {
    const formData = new FormData();
    formData.append('torrent_file', data.torrent_file);
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('category', data.category);

    if (data.tags) {
      data.tags.forEach(tag => formData.append('tags', tag));
    }

    const response = await apiClient.post<Torrent>('/torrents/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete torrent
  deleteTorrent: async (infoHash: string): Promise<void> => {
    await apiClient.delete(`/torrents/${infoHash}/delete/`);
  },

  // Download torrent
  downloadTorrent: async (infoHash: string): Promise<Blob> => {
    const response = await apiClient.get(`/torrents/${infoHash}/download/`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Categories
  getCategories: async (): Promise<TorrentCategory[]> => {
    const response = await apiClient.get<TorrentCategory[]>('/torrents/categories/');
    return response.data;
  },

  // Popular torrents
  getPopularTorrents: async (limit?: number): Promise<Torrent[]> => {
    const response = await apiClient.get<Torrent[]>('/torrents/popular/', {
      params: { limit },
    });
    return response.data;
  },

  // User's torrents
  getMyTorrents: async (params?: {
    page?: number;
    ordering?: string;
  }): Promise<PaginatedResponse<Torrent>> => {
    const response = await apiClient.get<PaginatedResponse<Torrent>>('/torrents/my-torrents/', { params });
    return response.data;
  },
};
