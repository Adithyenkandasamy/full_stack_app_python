import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { jwtDecode } from 'jwt-decode';
import { 
  AuthResponse, 
  CreateTodoRequest, 
  LoginRequest, 
  RegisterRequest, 
  Todo, 
  UpdateTodoRequest, 
  User 
} from '../types/api';

const API_URL = '/api/v1';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        
        const response = await axios.post(
          `${API_URL}/auth/refresh`,
          { refresh_token: refreshToken },
          { headers: { 'Content-Type': 'application/json' } }
        );
        
        const { access_token, refresh_token } = response.data;
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
        
        // Update the failed request with the new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
        }
        
        // Retry the original request
        return axios(originalRequest);
      } catch (refreshError) {
        // If refresh fails, log out user
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded: { exp: number } = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch {
    return true;
  }
};

// Auth APIs
export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/users/create', data);
  return response.data;
};

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', data);
  return response.data;
};

export const getUserProfile = async (): Promise<User> => {
  const response = await api.get<User>('/users/me');
  return response.data;
};

export const updateUserProfile = async (data: Partial<User>): Promise<User> => {
  const response = await api.post<User>('/users/update', data);
  return response.data;
};

// Todo APIs
export const getTodos = async (): Promise<Todo[]> => {
  const response = await api.get<Todo[]>('/todo');
  return response.data;
};

export const getTodoById = async (id: string): Promise<Todo> => {
  const response = await api.get<Todo>(`/todo/${id}`);
  return response.data;
};

export const createTodo = async (data: CreateTodoRequest): Promise<Todo> => {
  const response = await api.post<Todo>('/todo/create', data);
  return response.data;
};

export const updateTodo = async (id: string, data: UpdateTodoRequest): Promise<Todo> => {
  const response = await api.put<Todo>(`/todo/${id}`, data);
  return response.data;
};

export const deleteTodo = async (id: string): Promise<void> => {
  await api.delete(`/todo/${id}`);
};

export default api;