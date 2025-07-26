import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// API functions
const supplierAPI = {
  getProfile: async (supplierId, token) => {
    const response = await fetch(`${API_BASE_URL}/suppliers/${supplierId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch supplier profile');
    }
    
    return response.json();
  },

  updateProfile: async (supplierId, updates, token) => {
    const response = await fetch(`${API_BASE_URL}/suppliers/${supplierId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update supplier profile');
    }
    
    return response.json();
  },

  getInventory: async (supplierId, token) => {
    const response = await fetch(`${API_BASE_URL}/suppliers/${supplierId}/inventory`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch inventory');
    }
    
    return response.json();
  },

  addInventoryItem: async (supplierId, item, token) => {
    const response = await fetch(`${API_BASE_URL}/suppliers/${supplierId}/inventory`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(item),
    });
    
    if (!response.ok) {
      throw new Error('Failed to add inventory item');
    }
    
    return response.json();
  },

  updateInventoryItem: async (supplierId, itemId, updates, token) => {
    const response = await fetch(`${API_BASE_URL}/suppliers/${supplierId}/inventory/${itemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update inventory item');
    }
    
    return response.json();
  },

  deleteInventoryItem: async (supplierId, itemId, token) => {
    const response = await fetch(`${API_BASE_URL}/suppliers/${supplierId}/inventory/${itemId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete inventory item');
    }
    
    return response.json();
  },

  getStats: async (supplierId, token) => {
    const response = await fetch(`${API_BASE_URL}/suppliers/${supplierId}/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch stats');
    }
    
    return response.json();
  },

  getPriceWarnings: async (supplierId, token) => {
    const response = await fetch(`${API_BASE_URL}/suppliers/${supplierId}/price-warnings`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch price warnings');
    }
    
    return response.json();
  },
};

// Sample data for development
const sampleInventory = [
  {
    id: 'item-1',
    name: 'Fresh Tomatoes',
    category: 'Vegetables',
    currentStock: 150,
    unit: 'kg',
    price: 40,
    minStock: 20,
    maxStock: 200,
    status: 'in-stock',
    lastUpdated: '2024-01-20',
  },
  {
    id: 'item-2',
    name: 'Organic Onions',
    category: 'Vegetables',
    currentStock: 80,
    unit: 'kg',
    price: 25,
    minStock: 15,
    maxStock: 100,
    status: 'in-stock',
    lastUpdated: '2024-01-19',
  },
  {
    id: 'item-3',
    name: 'Fresh Carrots',
    category: 'Vegetables',
    currentStock: 5,
    unit: 'kg',
    price: 30,
    minStock: 10,
    maxStock: 80,
    status: 'low-stock',
    lastUpdated: '2024-01-18',
  },
  {
    id: 'item-4',
    name: 'Organic Apples',
    category: 'Fruits',
    currentStock: 0,
    unit: 'dozen',
    price: 120,
    minStock: 5,
    maxStock: 50,
    status: 'out-of-stock',
    lastUpdated: '2024-01-17',
  },
];

const sampleStats = {
  totalOrders: 89,
  totalEarnings: 125000,
  averageOrderValue: 1404,
  successfulDeliveries: 156,
  pendingOrders: 23,
  confirmedOrders: 8,
};

const samplePriceWarnings = [
  {
    id: 'warning-1',
    productId: 'item-1',
    productName: 'Fresh Tomatoes',
    message: 'Market price for tomatoes has increased by 15%',
    currentPrice: 40,
    suggestedPrice: 46,
    difference: 6,
    severity: 'medium',
    status: 'pending',
    date: '2024-01-20',
  },
  {
    id: 'warning-2',
    productId: 'item-2',
    productName: 'Organic Onions',
    message: 'Competitor prices are 20% lower',
    currentPrice: 25,
    suggestedPrice: 20,
    difference: -5,
    severity: 'high',
    status: 'pending',
    date: '2024-01-19',
  },
];

export const useSupplierStore = create(
  devtools(
    (set, get) => ({
      // State
      profile: null,
      inventory: [],
      stats: null,
      priceWarnings: [],
      loading: false,
      error: null,

      // Actions
      fetchProfile: async (supplierId, token) => {
        set({ loading: true, error: null });
        
        try {
          if (import.meta.env.DEV) {
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const profile = {
              id: supplierId,
              name: 'Fresh Farm Supplies',
              email: 'supplier@freshfarm.com',
              phone: '+91 98765 12345',
              address: 'Farm Road, Bangalore Rural, Karnataka 562123',
              businessType: 'Agricultural Farm',
              farmSize: '25 acres',
              specializations: ['Organic Vegetables', 'Fresh Fruits', 'Dairy Products'],
              certifications: ['Organic Certified', 'FSSAI Approved', 'ISO 22000'],
              rating: 4.5,
              reviews: 67,
              registrationDate: '2022-06-10',
            };
            
            set({ profile, loading: false });
            return profile;
          } else {
            const response = await supplierAPI.getProfile(supplierId, token);
            set({ profile: response, loading: false });
            return response;
          }
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      updateProfile: async (supplierId, updates, token) => {
        set({ loading: true, error: null });
        
        try {
          if (import.meta.env.DEV) {
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const updatedProfile = { ...get().profile, ...updates };
            set({ profile: updatedProfile, loading: false });
            return { success: true, supplier: updatedProfile };
          } else {
            const response = await supplierAPI.updateProfile(supplierId, updates, token);
            set({ profile: response.supplier, loading: false });
            return response;
          }
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      fetchInventory: async (supplierId, token) => {
        set({ loading: true, error: null });
        
        try {
          if (import.meta.env.DEV) {
            await new Promise(resolve => setTimeout(resolve, 500));
            set({ inventory: sampleInventory, loading: false });
            return sampleInventory;
          } else {
            const response = await supplierAPI.getInventory(supplierId, token);
            set({ inventory: response.inventory, loading: false });
            return response.inventory;
          }
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      addInventoryItem: async (supplierId, item, token) => {
        set({ loading: true, error: null });
        
        try {
          if (import.meta.env.DEV) {
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const newItem = {
              id: `item-${Date.now()}`,
              ...item,
              lastUpdated: new Date().toISOString().split('T')[0],
            };
            
            set((state) => ({
              inventory: [...state.inventory, newItem],
              loading: false,
            }));
            
            return { success: true, item: newItem };
          } else {
            const response = await supplierAPI.addInventoryItem(supplierId, item, token);
            set((state) => ({
              inventory: [...state.inventory, response.item],
              loading: false,
            }));
            return response;
          }
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      updateInventoryItem: async (supplierId, itemId, updates, token) => {
        set({ loading: true, error: null });
        
        try {
          if (import.meta.env.DEV) {
            await new Promise(resolve => setTimeout(resolve, 500));
            
            set((state) => ({
              inventory: state.inventory.map(item =>
                item.id === itemId
                  ? { ...item, ...updates, lastUpdated: new Date().toISOString().split('T')[0] }
                  : item
              ),
              loading: false,
            }));
            
            return { success: true };
          } else {
            const response = await supplierAPI.updateInventoryItem(supplierId, itemId, updates, token);
            set((state) => ({
              inventory: state.inventory.map(item =>
                item.id === itemId ? response.item : item
              ),
              loading: false,
            }));
            return response;
          }
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      deleteInventoryItem: async (supplierId, itemId, token) => {
        set({ loading: true, error: null });
        
        try {
          if (import.meta.env.DEV) {
            await new Promise(resolve => setTimeout(resolve, 500));
            
            set((state) => ({
              inventory: state.inventory.filter(item => item.id !== itemId),
              loading: false,
            }));
            
            return { success: true };
          } else {
            const response = await supplierAPI.deleteInventoryItem(supplierId, itemId, token);
            set((state) => ({
              inventory: state.inventory.filter(item => item.id !== itemId),
              loading: false,
            }));
            return response;
          }
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      fetchStats: async (supplierId, token) => {
        set({ loading: true, error: null });
        
        try {
          if (import.meta.env.DEV) {
            await new Promise(resolve => setTimeout(resolve, 500));
            set({ stats: sampleStats, loading: false });
            return sampleStats;
          } else {
            const response = await supplierAPI.getStats(supplierId, token);
            set({ stats: response.stats, loading: false });
            return response.stats;
          }
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      fetchPriceWarnings: async (supplierId, token) => {
        set({ loading: true, error: null });
        
        try {
          if (import.meta.env.DEV) {
            await new Promise(resolve => setTimeout(resolve, 500));
            set({ priceWarnings: samplePriceWarnings, loading: false });
            return samplePriceWarnings;
          } else {
            const response = await supplierAPI.getPriceWarnings(supplierId, token);
            set({ priceWarnings: response.warnings, loading: false });
            return response.warnings;
          }
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      clearError: () => {
        set({ error: null });
      },

      // Utility functions
      getInventoryItem: (itemId) => {
        const { inventory } = get();
        return inventory.find(item => item.id === itemId);
      },

      getInventoryByCategory: (category) => {
        const { inventory } = get();
        return inventory.filter(item => item.category === category);
      },

      getLowStockItems: () => {
        const { inventory } = get();
        return inventory.filter(item => item.status === 'low-stock' || item.status === 'out-of-stock');
      },
    }),
    {
      name: 'supplier-store',
    }
  )
); 