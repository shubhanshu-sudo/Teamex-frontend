import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api: AxiosInstance = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('teamex_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('teamex_token');
      localStorage.removeItem('teamex_admin');
      if (window.location.pathname.startsWith('/admin') && !window.location.pathname.endsWith('/login')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(err);
  }
);

// Auth
export const authApi = {
  login: (email: string, password: string) =>
    api.post<{ success: boolean; token: string; admin: { id: string; name: string; email: string; role: string } }>(
      '/admin/login',
      { email, password }
    ),
  register: (name: string, email: string, password: string) =>
    api.post<{ success: boolean; token: string; admin: object }>('/admin/register', { name, email, password }),
  getProfile: () => api.get<{ success: boolean; admin: object }>('/admin/profile'),
};

// Activities
export const activitiesApi = {
  list: (params?: { page?: number; limit?: number; all?: string }) =>
    api.get<{ success: boolean; data: unknown[]; pagination: { page: number; limit: number; total: number; pages: number } }>(
      '/activities',
      { params }
    ),
  getById: (id: string) =>
    api.get<{ success: boolean; data: unknown }>(`/activities/id/${id}`),
  getBySlug: (slug: string) =>
    api.get<{ success: boolean; data: unknown }>(`/activities/${slug}`),
  create: (data: FormData | object) => api.post<{ success: boolean; data: unknown }>('/activities', data),
  update: (id: string, data: FormData | object) =>
    api.put<{ success: boolean; data: unknown }>(`/activities/${id}`, data),
  delete: (id: string) => api.delete<{ success: boolean }>(`/activities/${id}`),
};

// Blogs
export const blogsApi = {
  list: (params?: { page?: number; limit?: number; all?: string }) =>
    api.get<{ success: boolean; data: unknown[]; pagination: { page: number; limit: number; total: number; pages: number } }>(
      '/blogs',
      { params }
    ),
  getById: (id: string) =>
    api.get<{ success: boolean; data: unknown }>(`/blogs/id/${id}`),
  getBySlug: (slug: string) =>
    api.get<{ success: boolean; data: unknown }>(`/blogs/${slug}`),
  create: (data: FormData | object) => api.post<{ success: boolean; data: unknown }>('/blogs', data),
  update: (id: string, data: FormData | object) =>
    api.put<{ success: boolean; data: unknown }>(`/blogs/${id}`, data),
  delete: (id: string) => api.delete<{ success: boolean }>(`/blogs/${id}`),
};

// Categories
export const categoriesApi = {
  list: (params?: { all?: string }) =>
    api.get<{ success: boolean; data: unknown[] }>('/categories', { params }),
  create: (data: object) => api.post<{ success: boolean; data: unknown }>('/categories', data),
  update: (id: string, data: object) =>
    api.put<{ success: boolean; data: unknown }>(`/categories/${id}`, data),
  delete: (id: string) => api.delete<{ success: boolean }>(`/categories/${id}`),
};

// Leads
export const leadsApi = {
  list: (params?: { page?: number; limit?: number; status?: string }) =>
    api.get<{ success: boolean; data: unknown[]; pagination: { page: number; limit: number; total: number; pages: number } }>(
      '/leads',
      { params }
    ),
  getOne: (id: string) => api.get<{ success: boolean; data: unknown }>(`/leads/${id}`),
  updateStatus: (id: string, status: string) =>
    api.patch<{ success: boolean; data: unknown }>(`/leads/${id}`, { status }),
};

// Contact (public)
export const contactApi = {
  submit: (data: { name: string; email: string; phone?: string; company?: string; message: string }) =>
    api.post<{ success: boolean; message: string }>('/contact', data),
};

export default api;
