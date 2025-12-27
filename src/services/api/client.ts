import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/api';

class ApiClient {
  private client: ReturnType<typeof axios.create>;
  private refreshPromise: Promise<any> | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      timeout: 10000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          // Ensure headers object exists
          if (!config.headers) {
            config.headers = {} as any;
          }
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Don't retry refresh token endpoint or login endpoint
        const isAuthEndpoint = originalRequest.url?.includes('/auth/login/') || 
                               originalRequest.url?.includes('/auth/refresh/');
        
        if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
          console.log('401 error detected, attempting token refresh for:', originalRequest.url);
          originalRequest._retry = true;

          try {
            await this.refreshToken();
            const token = localStorage.getItem('access_token');
            console.log('Retrying request with new token:', token ? 'present' : 'missing');
            if (token && originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return this.client(originalRequest);
          } catch (refreshError) {
            console.error('Token refresh failed, redirecting to login:', refreshError);
            // Refresh failed, redirect to login
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            // Only redirect if we're not already on the login page
            if (window.location.pathname !== '/login') {
            window.location.href = '/login';
            }
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private async refreshToken(): Promise<void> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = new Promise(async (resolve, reject) => {
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        console.log('Attempting token refresh with refresh token:', refreshToken ? 'present' : 'missing');

        // Use direct axios call to avoid interceptor loops
        const response = await axios.post(
          `${BASE_URL}/auth/refresh/`,
          { refresh: refreshToken },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        console.log('Refresh response:', response.data);

        // Check for different possible response formats
        const data = response.data;
        let access, refresh;

        if (data.access && data.refresh) {
          // Standard format: { access, refresh }
          access = data.access;
          refresh = data.refresh;
        } else if (data.token && data.refresh_token) {
          // Alternative format: { token, refresh_token }
          access = data.token;
          refresh = data.refresh_token;
        } else if (data.tokens && data.tokens.access && data.tokens.refresh) {
          // Nested format: { tokens: { access, refresh } }
          access = data.tokens.access;
          refresh = data.tokens.refresh;
        } else {
          console.error('Unexpected refresh response format:', data);
          throw new Error('Invalid token response format from refresh endpoint');
        }

        console.log('Token refresh successful, storing new tokens');
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);

        return { access, refresh };

        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);

        resolve(response.data);
      } catch (error) {
        // Clear tokens on refresh failure
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        reject(error);
      } finally {
        this.refreshPromise = null;
      }
    });

    return this.refreshPromise;
  }

  public async get<T = any>(url: string, config?: any): Promise<any> {
    return this.client.get(url, config);
  }

  public async post<T = any>(url: string, data?: any, config?: any): Promise<any> {
    return this.client.post(url, data, config);
  }

  public async put<T = any>(url: string, data?: any, config?: any): Promise<any> {
    return this.client.put(url, data, config);
  }

  public async patch<T = any>(url: string, data?: any, config?: any): Promise<any> {
    return this.client.patch(url, data, config);
  }

  public async delete<T = any>(url: string, config?: any): Promise<any> {
    return this.client.delete(url, config);
  }

  // File upload helper
  public async uploadFile(url: string, file: File, additionalData?: Record<string, any>): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });
    }

    return this.client.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
}

export const apiClient = new ApiClient();
export default apiClient;
