import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Sample API functions
const authAPI = {
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    if (!response.ok) {
      throw new Error('Login failed');
    }
    
    return response.json();
  },

  signup: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      throw new Error('Signup failed');
    }
    
    return response.json();
  },

  getCurrentUser: async (token) => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to get current user');
    }
    
    return response.json();
  },
};

// Sample data for development
const sampleUsers = {
  supplier: {
    id: 'supplier-1',
    name: 'Fresh Farm Supplies',
    email: 'supplier@freshfarm.com',
    role: 'supplier',
    phone: '+91 98765 12345',
    address: 'Farm Road, Bangalore Rural, Karnataka 562123',
    businessType: 'Agricultural Farm',
    farmSize: '25 acres',
    specializations: ['Organic Vegetables', 'Fresh Fruits', 'Dairy Products'],
    certifications: ['Organic Certified', 'FSSAI Approved', 'ISO 22000'],
    rating: 4.5,
    reviews: 67,
  },
  vendor: {
    id: 'vendor-1',
    name: 'Fresh Market Vendor',
    email: 'vendor@freshmarket.com',
    role: 'vendor',
    phone: '+91 98765 43210',
    address: '123 Market Street, Bangalore',
    businessType: 'Retail Store',
    preferredCategories: ['Vegetables', 'Fruits', 'Dairy'],
    rating: 4.2,
    reviews: 45,
  },
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      loading: false,
      error: null,
      isAuthenticated: false,

      // Actions
      login: async (email, password, role) => {
        set({ loading: true, error: null });
        
        try {
          // In development, use sample data
          if (import.meta.env.DEV) {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const user = sampleUsers[role];
            const token = `sample-token-${role}-${Date.now()}`;
            
            set({
              user,
              token,
              isAuthenticated: true,
              loading: false,
            });
            
            return { success: true, user, token };
          } else {
            // Production API call
            const response = await authAPI.login({ email, password, role });
            
            if (response.success) {
              set({
                user: response.user,
                token: response.token,
                isAuthenticated: true,
                loading: false,
              });
            }
            
            return response;
          }
        } catch (error) {
          set({
            error: error.message,
            loading: false,
          });
          return { success: false, error: error.message };
        }
      },

      signup: async (userData) => {
        set({ loading: true, error: null });
        
        try {
          // In development, use sample data
          if (import.meta.env.DEV) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const user = {
              id: `${userData.role}-${Date.now()}`,
              ...userData,
              rating: 0,
              reviews: 0,
            };
            const token = `sample-token-${userData.role}-${Date.now()}`;
            
            set({
              user,
              token,
              isAuthenticated: true,
              loading: false,
            });
            
            return { success: true, user, token };
          } else {
            // Production API call
            const response = await authAPI.signup(userData);
            
            if (response.success) {
              set({
                user: response.user,
                token: response.token,
                isAuthenticated: true,
                loading: false,
              });
            }
            
            return response;
          }
        } catch (error) {
          set({
            error: error.message,
            loading: false,
          });
          return { success: false, error: error.message };
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      getCurrentUser: async () => {
        const { token } = get();
        if (!token) return;

        set({ loading: true });
        
        try {
          if (import.meta.env.DEV) {
            // Return existing user from store
            const { user } = get();
            set({ loading: false });
            return user;
          } else {
            const response = await authAPI.getCurrentUser(token);
            set({
              user: response.user,
              loading: false,
            });
            return response.user;
          }
        } catch (error) {
          set({
            error: error.message,
            loading: false,
            user: null,
            token: null,
            isAuthenticated: false,
          });
        }
      },

      clearError: () => {
        set({ error: null });
      },

      updateUser: (updates) => {
        set((state) => ({
          user: { ...state.user, ...updates },
        }));
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
); 