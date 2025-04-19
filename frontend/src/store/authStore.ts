import { create } from 'zustand';
import { User } from '../types/api';
import { getUserProfile, isTokenExpired, login, register } from '../lib/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  checkAuth: () => Promise<boolean>;
  loginUser: (email: string, password: string) => Promise<void>;
  registerUser: (email: string, password: string, fullName?: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  
  checkAuth: async () => {
    try {
      set({ isLoading: true });
      const token = localStorage.getItem('access_token');
      
      // If no token or token is expired, user is not authenticated
      if (!token || isTokenExpired(token)) {
        set({ isAuthenticated: false, isLoading: false });
        return false;
      }
      
      // Token exists and is valid, fetch user profile
      const user = await getUserProfile();
      set({ user, isAuthenticated: true, isLoading: false });
      return true;
    } catch (error) {
      // If an error occurs (e.g., token is invalid), clear auth state
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      set({ user: null, isAuthenticated: false, isLoading: false });
      return false;
    }
  },
  
  loginUser: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await login({ email, password });
      
      // Store tokens in localStorage
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      
      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to login',
        isLoading: false,
      });
      throw error;
    }
  },
  
  registerUser: async (email: string, password: string, fullName?: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await register({ email, password, fullName });
      
      // Store tokens in localStorage
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      
      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to register',
        isLoading: false,
      });
      throw error;
    }
  },
  
  logout: () => {
    // Clear tokens from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    
    // Reset auth state
    set({
      user: null,
      isAuthenticated: false,
    });
  },
  
  clearError: () => {
    set({ error: null });
  }
}));