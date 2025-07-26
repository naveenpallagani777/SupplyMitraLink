import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// API functions
const vendorAPI = {
  getProfile: async (vendorId, token) => {
    const response = await fetch(`${API_BASE_URL}/vendors/${vendorId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch vendor profile');
    }
    
    return response.json();
  },

  updateProfile: async (vendorId, updates, token) => {
    const response = await fetch(`${API_BASE_URL}/vendors/${vendorId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update vendor profile');
    }
    
    return response.json();
  },

  getStats: async (vendorId, token) => {
    const response = await fetch(`${API_BASE_URL}/vendors/${vendorId}/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch stats');
    }
    
    return response.json();
  },
};

const discoveryAPI = {
  getSuppliers: async (params = {}, token) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/suppliers?${queryString}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch suppliers');
    }
    
    return response.json();
  },

  getProducts: async (params = {}, token) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/products?${queryString}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    
    return response.json();
  },
};

// Sample data for development
const sampleVendorProfile = {
  id: 'vendor-1',
  name: 'Fresh Market Vendor',
  email: 'vendor@freshmarket.com',
  phone: '+91 98765 43210',
  address: '123 Market Street, Bangalore, Karnataka 560001',
  businessType: 'Retail Store',
  preferredCategories: ['Vegetables', 'Fruits', 'Dairy'],
  rating: 4.2,
  reviews: 45,
  registrationDate: '2022-08-15',
  businessHours: '6:00 AM - 10:00 PM',
  deliveryRadius: '5 km',
};

const sampleSuppliers = [
  {
    id: 'supplier-1',
    name: 'Fresh Farm Supplies',
    businessType: 'Agricultural Farm',
    specializations: ['Organic Vegetables', 'Fresh Fruits', 'Dairy Products'],
    rating: 4.5,
    reviews: 67,
    distance: '2.3 km',
    address: 'Farm Road, Bangalore Rural, Karnataka',
    certifications: ['Organic Certified', 'FSSAI Approved'],
    lastActive: '2024-01-20',
  },
  {
    id: 'supplier-2',
    name: 'Green Valley Farms',
    businessType: 'Organic Farm',
    specializations: ['Organic Vegetables', 'Herbs'],
    rating: 4.3,
    reviews: 34,
    distance: '3.1 km',
    address: 'Green Valley, Bangalore Rural, Karnataka',
    certifications: ['Organic Certified'],
    lastActive: '2024-01-19',
  },
  {
    id: 'supplier-3',
    name: 'Dairy Delights',
    businessType: 'Dairy Farm',
    specializations: ['Milk Products', 'Cheese', 'Yogurt'],
    rating: 4.1,
    reviews: 28,
    distance: '4.2 km',
    address: 'Dairy Lane, Bangalore Rural, Karnataka',
    certifications: ['FSSAI Approved'],
    lastActive: '2024-01-18',
  },
];

const sampleProducts = [
  {
    id: 'product-1',
    name: 'Fresh Tomatoes',
    category: 'Vegetables',
    supplier: {
      id: 'supplier-1',
      name: 'Fresh Farm Supplies',
      rating: 4.5,
    },
    price: 40,
    unit: 'kg',
    availableStock: 150,
    minOrderQuantity: 5,
    maxOrderQuantity: 50,
    description: 'Fresh organic tomatoes from our farm',
    image: '/images/tomatoes.jpg',
    inStock: true,
  },
  {
    id: 'product-2',
    name: 'Organic Onions',
    category: 'Vegetables',
    supplier: {
      id: 'supplier-1',
      name: 'Fresh Farm Supplies',
      rating: 4.5,
    },
    price: 25,
    unit: 'kg',
    availableStock: 80,
    minOrderQuantity: 2,
    maxOrderQuantity: 30,
    description: 'Fresh organic onions',
    image: '/images/onions.jpg',
    inStock: true,
  },
  {
    id: 'product-3',
    name: 'Fresh Carrots',
    category: 'Vegetables',
    supplier: {
      id: 'supplier-2',
      name: 'Green Valley Farms',
      rating: 4.3,
    },
    price: 30,
    unit: 'kg',
    availableStock: 5,
    minOrderQuantity: 1,
    maxOrderQuantity: 10,
    description: 'Fresh organic carrots',
    image: '/images/carrots.jpg',
    inStock: true,
  },
  {
    id: 'product-4',
    name: 'Organic Apples',
    category: 'Fruits',
    supplier: {
      id: 'supplier-1',
      name: 'Fresh Farm Supplies',
      rating: 4.5,
    },
    price: 120,
    unit: 'dozen',
    availableStock: 0,
    minOrderQuantity: 1,
    maxOrderQuantity: 20,
    description: 'Fresh organic apples',
    image: '/images/apples.jpg',
    inStock: false,
  },
  {
    id: 'product-5',
    name: 'Fresh Milk',
    category: 'Dairy',
    supplier: {
      id: 'supplier-3',
      name: 'Dairy Delights',
      rating: 4.1,
    },
    price: 60,
    unit: 'liter',
    availableStock: 100,
    minOrderQuantity: 5,
    maxOrderQuantity: 50,
    description: 'Fresh farm milk',
    image: '/images/milk.jpg',
    inStock: true,
  },
];

const sampleVendorStats = {
  totalOrders: 156,
  totalSpent: 89000,
  averageOrderValue: 570,
  activeSuppliers: 8,
  favoriteSuppliers: 3,
  pendingOrders: 5,
  completedOrders: 151,
};

export const useVendorStore = create(
  devtools(
    (set, get) => ({
      // State
      profile: null,
      suppliers: [],
      products: [],
      stats: null,
      loading: false,
      error: null,
      searchFilters: {
        category: '',
        location: '',
        search: '',
        rating: 0,
        distance: 10,
      },

      // Actions
      fetchProfile: async (vendorId, token) => {
        set({ loading: true, error: null });
        
        try {
          if (import.meta.env.DEV) {
            await new Promise(resolve => setTimeout(resolve, 500));
            set({ profile: sampleVendorProfile, loading: false });
            return sampleVendorProfile;
          } else {
            const response = await vendorAPI.getProfile(vendorId, token);
            set({ profile: response, loading: false });
            return response;
          }
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      updateProfile: async (vendorId, updates, token) => {
        set({ loading: true, error: null });
        
        try {
          if (import.meta.env.DEV) {
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const updatedProfile = { ...get().profile, ...updates };
            set({ profile: updatedProfile, loading: false });
            return { success: true, vendor: updatedProfile };
          } else {
            const response = await vendorAPI.updateProfile(vendorId, updates, token);
            set({ profile: response.vendor, loading: false });
            return response;
          }
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      fetchSuppliers: async (filters = {}, token) => {
        set({ loading: true, error: null });
        
        try {
          if (import.meta.env.DEV) {
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Apply filters to sample data
            let filteredSuppliers = [...sampleSuppliers];
            
            if (filters.category) {
              filteredSuppliers = filteredSuppliers.filter(supplier =>
                supplier.specializations.some(spec => 
                  spec.toLowerCase().includes(filters.category.toLowerCase())
                )
              );
            }
            
            if (filters.search) {
              filteredSuppliers = filteredSuppliers.filter(supplier =>
                supplier.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                supplier.businessType.toLowerCase().includes(filters.search.toLowerCase())
              );
            }
            
            if (filters.rating) {
              filteredSuppliers = filteredSuppliers.filter(supplier =>
                supplier.rating >= filters.rating
              );
            }
            
            if (filters.distance) {
              filteredSuppliers = filteredSuppliers.filter(supplier =>
                parseFloat(supplier.distance) <= filters.distance
              );
            }
            
            set({ suppliers: filteredSuppliers, loading: false });
            return filteredSuppliers;
          } else {
            const response = await discoveryAPI.getSuppliers(filters, token);
            set({ suppliers: response.suppliers, loading: false });
            return response.suppliers;
          }
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      fetchProducts: async (filters = {}, token) => {
        set({ loading: true, error: null });
        
        try {
          if (import.meta.env.DEV) {
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Apply filters to sample data
            let filteredProducts = [...sampleProducts];
            
            if (filters.category) {
              filteredProducts = filteredProducts.filter(product =>
                product.category.toLowerCase() === filters.category.toLowerCase()
              );
            }
            
            if (filters.supplierId) {
              filteredProducts = filteredProducts.filter(product =>
                product.supplier.id === filters.supplierId
              );
            }
            
            if (filters.search) {
              filteredProducts = filteredProducts.filter(product =>
                product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                product.description.toLowerCase().includes(filters.search.toLowerCase())
              );
            }
            
            if (filters.inStock !== undefined) {
              filteredProducts = filteredProducts.filter(product =>
                product.inStock === filters.inStock
              );
            }
            
            set({ products: filteredProducts, loading: false });
            return filteredProducts;
          } else {
            const response = await discoveryAPI.getProducts(filters, token);
            set({ products: response.products, loading: false });
            return response.products;
          }
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      fetchStats: async (vendorId, token) => {
        set({ loading: true, error: null });
        
        try {
          if (import.meta.env.DEV) {
            await new Promise(resolve => setTimeout(resolve, 500));
            set({ stats: sampleVendorStats, loading: false });
            return sampleVendorStats;
          } else {
            const response = await vendorAPI.getStats(vendorId, token);
            set({ stats: response.stats, loading: false });
            return response.stats;
          }
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      setSearchFilters: (filters) => {
        set((state) => ({
          searchFilters: { ...state.searchFilters, ...filters },
        }));
      },

      clearSearchFilters: () => {
        set({
          searchFilters: {
            category: '',
            location: '',
            search: '',
            rating: 0,
            distance: 10,
          },
        });
      },

      clearError: () => {
        set({ error: null });
      },

      // Utility functions
      getSupplierById: (supplierId) => {
        const { suppliers } = get();
        return suppliers.find(supplier => supplier.id === supplierId);
      },

      getProductsBySupplier: (supplierId) => {
        const { products } = get();
        return products.filter(product => product.supplier.id === supplierId);
      },

      getProductsByCategory: (category) => {
        const { products } = get();
        return products.filter(product => product.category === category);
      },

      getInStockProducts: () => {
        const { products } = get();
        return products.filter(product => product.inStock);
      },

      getLowStockProducts: () => {
        const { products } = get();
        return products.filter(product => product.availableStock <= 10);
      },
    }),
    {
      name: 'vendor-store',
    }
  )
); 