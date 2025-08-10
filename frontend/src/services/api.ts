import axios from 'axios';
import type {
  User,
  Feedback,
  FeedbackCategory,
  FeedbackComment,
  AuthResponse,
  PaginatedResponse,
  FeedbackFilters,
} from '../types';

// Configure base URL - adjust this to match your Laravel backend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});
 
// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }): Promise<AuthResponse> => {
    const response = await api.post('/register', data);
    return response.data;
  },

  login: async (data: { email: string; password: string }): Promise<AuthResponse> => {
    const response = await api.post('/login', data);
    return response.data;
  },

  logout: async (): Promise<{ message: string }> => {
    const response = await api.post('/logout');
    return response.data;
  },

  me: async (): Promise<{ user: User }> => {
    const response = await api.get('/me');
    return response.data;
  },
};

// Feedback API
export const feedbackAPI = {
  list: async (filters?: FeedbackFilters): Promise<PaginatedResponse<Feedback>> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    const response = await api.get(`/feedback?${params.toString()}`);
    return response.data;
  },

  get: async (id: number): Promise<Feedback> => {
    const response = await api.get(`/feedback/${id}`);
    return response.data;
  },

  create: async (data: {
    title: string;
    description: string;
    feedback_category_id: number;
  }): Promise<{ message: string; feedback: Feedback }> => {
    const response = await api.post('/feedback', data);
    return response.data;
  },

  update: async (
    id: number,
    data: Partial<{ title: string; description: string; feedback_category_id: number }>
  ): Promise<{ message: string; feedback: Feedback }> => {
    const response = await api.put(`/feedback/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete(`/feedback/${id}`);
    return response.data;
  },

  upvote: async (id: number): Promise<{ message: string; upvotes: number; net_score: number }> => {
    const response = await api.post(`/feedback/${id}/upvote`);
    return response.data;
  },

  downvote: async (id: number): Promise<{ message: string; downvotes: number; net_score: number }> => {
    const response = await api.post(`/feedback/${id}/downvote`);
    return response.data;
  },
};

// Comments API
export const commentsAPI = {
  list: async (feedbackId: number, perPage = 20): Promise<PaginatedResponse<FeedbackComment>> => {
    const response = await api.get(`/feedback/${feedbackId}/comments?per_page=${perPage}`);
    return response.data;
  },

  get: async (id: number): Promise<FeedbackComment> => {
    const response = await api.get(`/comments/${id}`);
    return response.data;
  },

  create: async (data: {
    content: string;
    feedback_id: number;
    parent_id?: number;
  }): Promise<{ message: string; comment: FeedbackComment }> => {
    const response = await api.post('/comments', data);
    return response.data;
  },

  update: async (
    id: number,
    data: { content: string }
  ): Promise<{ message: string; comment: FeedbackComment }> => {
    const response = await api.put(`/comments/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete(`/comments/${id}`);
    return response.data;
  },

  searchUsers: async (query: string): Promise<User[]> => {
    const response = await api.get(`/users/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },
};

// Categories API
export const categoriesAPI = {
  list: async (): Promise<FeedbackCategory[]> => {
    const response = await api.get('/feedback-categories');
    return response.data;
  },
};

export default api;
