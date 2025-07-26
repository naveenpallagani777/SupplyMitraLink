import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// API functions
const orderAPI = {
  placeOrder: async (orderData, token) => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to place order');
    }
    
    return response.json();
  },

  getOrders: async (params = {}, token) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/orders?${queryString}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }
    
    return response.json();
  },

  updateOrderStatus: async (orderId, updates, token) => {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update order status');
    }
    
    return response.json();
  },

  getOrderDetails: async (orderId, token) => {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch order details');
    }
    
    return response.json();
  },
};

// Sample data for development
const sampleOrders = [
  {
    id: 'order-001',
    vendorId: 'vendor-1',
    supplierId: 'supplier-1',
    vendorName: 'Fresh Market Vendor',
    supplierName: 'Fresh Farm Supplies',
    items: [
      {
        id: 'item-1',
        name: 'Fresh Tomatoes',
        quantity: 10,
        unit: 'kg',
        price: 40,
        total: 400,
      },
      {
        id: 'item-2',
        name: 'Organic Onions',
        quantity: 5,
        unit: 'kg',
        price: 25,
        total: 125,
      },
    ],
    totalAmount: 525,
    orderDate: '2024-01-20T10:30:00Z',
    expectedDelivery: '2024-01-21T14:00:00Z',
    status: 'confirmed',
    statusHistory: [
      {
        status: 'pending',
        timestamp: '2024-01-20T10:30:00Z',
        note: 'Order placed',
      },
      {
        status: 'confirmed',
        timestamp: '2024-01-20T11:15:00Z',
        note: 'Order confirmed by supplier',
      },
    ],
    deliveryAddress: '123 Market Street, Bangalore, Karnataka 560001',
    paymentStatus: 'pending',
    paymentMethod: 'cash_on_delivery',
    notes: 'Please deliver in the morning',
  },
  {
    id: 'order-002',
    vendorId: 'vendor-1',
    supplierId: 'supplier-2',
    vendorName: 'Fresh Market Vendor',
    supplierName: 'Green Valley Farms',
    items: [
      {
        id: 'item-3',
        name: 'Fresh Carrots',
        quantity: 3,
        unit: 'kg',
        price: 30,
        total: 90,
      },
    ],
    totalAmount: 90,
    orderDate: '2024-01-19T15:45:00Z',
    expectedDelivery: '2024-01-20T12:00:00Z',
    status: 'in_transit',
    statusHistory: [
      {
        status: 'pending',
        timestamp: '2024-01-19T15:45:00Z',
        note: 'Order placed',
      },
      {
        status: 'confirmed',
        timestamp: '2024-01-19T16:20:00Z',
        note: 'Order confirmed by supplier',
      },
      {
        status: 'packed',
        timestamp: '2024-01-20T08:30:00Z',
        note: 'Items packed and ready',
      },
      {
        status: 'in_transit',
        timestamp: '2024-01-20T09:15:00Z',
        note: 'Order picked up for delivery',
      },
    ],
    deliveryAddress: '123 Market Street, Bangalore, Karnataka 560001',
    paymentStatus: 'pending',
    paymentMethod: 'cash_on_delivery',
    notes: '',
  },
  {
    id: 'order-003',
    vendorId: 'vendor-1',
    supplierId: 'supplier-3',
    vendorName: 'Fresh Market Vendor',
    supplierName: 'Dairy Delights',
    items: [
      {
        id: 'item-5',
        name: 'Fresh Milk',
        quantity: 10,
        unit: 'liter',
        price: 60,
        total: 600,
      },
    ],
    totalAmount: 600,
    orderDate: '2024-01-18T09:20:00Z',
    expectedDelivery: '2024-01-19T07:00:00Z',
    status: 'delivered',
    statusHistory: [
      {
        status: 'pending',
        timestamp: '2024-01-18T09:20:00Z',
        note: 'Order placed',
      },
      {
        status: 'confirmed',
        timestamp: '2024-01-18T10:05:00Z',
        note: 'Order confirmed by supplier',
      },
      {
        status: 'packed',
        timestamp: '2024-01-19T06:00:00Z',
        note: 'Items packed and ready',
      },
      {
        status: 'in_transit',
        timestamp: '2024-01-19T06:30:00Z',
        note: 'Order picked up for delivery',
      },
      {
        status: 'out_for_delivery',
        timestamp: '2024-01-19T06:45:00Z',
        note: 'Out for delivery',
      },
      {
        status: 'delivered',
        timestamp: '2024-01-19T07:15:00Z',
        note: 'Order delivered successfully',
      },
    ],
    deliveryAddress: '123 Market Street, Bangalore, Karnataka 560001',
    paymentStatus: 'completed',
    paymentMethod: 'cash_on_delivery',
    notes: 'Early morning delivery preferred',
    deliveredAt: '2024-01-19T07:15:00Z',
  },
  {
    id: 'order-004',
    vendorId: 'vendor-1',
    supplierId: 'supplier-1',
    vendorName: 'Fresh Market Vendor',
    supplierName: 'Fresh Farm Supplies',
    items: [
      {
        id: 'item-1',
        name: 'Fresh Tomatoes',
        quantity: 15,
        unit: 'kg',
        price: 40,
        total: 600,
      },
      {
        id: 'item-2',
        name: 'Organic Onions',
        quantity: 8,
        unit: 'kg',
        price: 25,
        total: 200,
      },
    ],
    totalAmount: 800,
    orderDate: '2024-01-17T14:20:00Z',
    expectedDelivery: '2024-01-18T16:00:00Z',
    status: 'cancelled',
    statusHistory: [
      {
        status: 'pending',
        timestamp: '2024-01-17T14:20:00Z',
        note: 'Order placed',
      },
      {
        status: 'cancelled',
        timestamp: '2024-01-17T16:30:00Z',
        note: 'Order cancelled by vendor',
      },
    ],
    deliveryAddress: '123 Market Street, Bangalore, Karnataka 560001',
    paymentStatus: 'refunded',
    paymentMethod: 'cash_on_delivery',
    notes: '',
    cancelledAt: '2024-01-17T16:30:00Z',
    cancellationReason: 'Changed mind',
  },
];

const samplePendingOrders = [
  {
    id: 'order-005',
    vendorId: 'vendor-1',
    supplierId: 'supplier-1',
    vendorName: 'Fresh Market Vendor',
    supplierName: 'Fresh Farm Supplies',
    items: [
      {
        id: 'item-1',
        name: 'Fresh Tomatoes',
        quantity: 20,
        unit: 'kg',
        price: 40,
        total: 800,
      },
    ],
    totalAmount: 800,
    orderDate: '2024-01-20T16:45:00Z',
    expectedDelivery: '2024-01-21T18:00:00Z',
    status: 'pending',
    statusHistory: [
      {
        status: 'pending',
        timestamp: '2024-01-20T16:45:00Z',
        note: 'Order placed',
      },
    ],
    deliveryAddress: '123 Market Street, Bangalore, Karnataka 560001',
    paymentStatus: 'pending',
    paymentMethod: 'cash_on_delivery',
    notes: 'Large quantity order',
  },
];

export const useOrderStore = create(
  devtools(
    (set, get) => ({
      // State
      orders: [],
      pendingOrders: [],
      activeOrders: [],
      completedOrders: [],
      currentOrder: null,
      loading: false,
      error: null,

      // Actions
      placeOrder: async (orderData, token) => {
        set({ loading: true, error: null });
        
        try {
          if (import.meta.env.DEV) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const newOrder = {
              id: `order-${Date.now()}`,
              ...orderData,
              orderDate: new Date().toISOString(),
              expectedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
              status: 'pending',
              statusHistory: [
                {
                  status: 'pending',
                  timestamp: new Date().toISOString(),
                  note: 'Order placed',
                },
              ],
              paymentStatus: 'pending',
            };
            
            set((state) => ({
              orders: [newOrder, ...state.orders],
              pendingOrders: [newOrder, ...state.pendingOrders],
              loading: false,
            }));
            
            return { success: true, order: newOrder };
          } else {
            const response = await orderAPI.placeOrder(orderData, token);
            
            if (response.success) {
              set((state) => ({
                orders: [response.order, ...state.orders],
                pendingOrders: [response.order, ...state.pendingOrders],
                loading: false,
              }));
            }
            
            return response;
          }
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      fetchOrders: async (params = {}, token) => {
        set({ loading: true, error: null });
        
        try {
          if (import.meta.env.DEV) {
            await new Promise(resolve => setTimeout(resolve, 500));
            
            let filteredOrders = [...sampleOrders, ...samplePendingOrders];
            
            // Apply filters
            if (params.supplierId) {
              filteredOrders = filteredOrders.filter(order => order.supplierId === params.supplierId);
            }
            
            if (params.vendorId) {
              filteredOrders = filteredOrders.filter(order => order.vendorId === params.vendorId);
            }
            
            if (params.status) {
              filteredOrders = filteredOrders.filter(order => order.status === params.status);
            }
            
            // Categorize orders
            const pendingOrders = filteredOrders.filter(order => order.status === 'pending');
            const activeOrders = filteredOrders.filter(order => 
              ['confirmed', 'packed', 'in_transit', 'out_for_delivery'].includes(order.status)
            );
            const completedOrders = filteredOrders.filter(order => 
              ['delivered', 'cancelled'].includes(order.status)
            );
            
            set({
              orders: filteredOrders,
              pendingOrders,
              activeOrders,
              completedOrders,
              loading: false,
            });
            
            return filteredOrders;
          } else {
            const response = await orderAPI.getOrders(params, token);
            
            // Categorize orders
            const pendingOrders = response.orders.filter(order => order.status === 'pending');
            const activeOrders = response.orders.filter(order => 
              ['confirmed', 'packed', 'in_transit', 'out_for_delivery'].includes(order.status)
            );
            const completedOrders = response.orders.filter(order => 
              ['delivered', 'cancelled'].includes(order.status)
            );
            
            set({
              orders: response.orders,
              pendingOrders,
              activeOrders,
              completedOrders,
              loading: false,
            });
            
            return response.orders;
          }
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      updateOrderStatus: async (orderId, status, note = '', token) => {
        set({ loading: true, error: null });
        
        try {
          if (import.meta.env.DEV) {
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const statusUpdate = {
              status,
              timestamp: new Date().toISOString(),
              note,
            };
            
            set((state) => ({
              orders: state.orders.map(order =>
                order.id === orderId
                  ? {
                      ...order,
                      status,
                      statusHistory: [...order.statusHistory, statusUpdate],
                      ...(status === 'delivered' && { deliveredAt: new Date().toISOString() }),
                      ...(status === 'cancelled' && { 
                        cancelledAt: new Date().toISOString(),
                        cancellationReason: note,
                      }),
                    }
                  : order
              ),
              pendingOrders: state.pendingOrders.filter(order => order.id !== orderId),
              activeOrders: state.activeOrders.filter(order => order.id !== orderId),
              completedOrders: state.completedOrders.filter(order => order.id !== orderId),
              loading: false,
            }));
            
            // Re-categorize orders
            const { orders } = get();
            const pendingOrders = orders.filter(order => order.status === 'pending');
            const activeOrders = orders.filter(order => 
              ['confirmed', 'packed', 'in_transit', 'out_for_delivery'].includes(order.status)
            );
            const completedOrders = orders.filter(order => 
              ['delivered', 'cancelled'].includes(order.status)
            );
            
            set({
              pendingOrders,
              activeOrders,
              completedOrders,
            });
            
            return { success: true };
          } else {
            const response = await orderAPI.updateOrderStatus(orderId, { status, note }, token);
            
            if (response.success) {
              // Update the order in the store
              set((state) => ({
                orders: state.orders.map(order =>
                  order.id === orderId ? response.order : order
                ),
                loading: false,
              }));
              
              // Re-fetch orders to update categorization
              await get().fetchOrders({}, token);
            }
            
            return response;
          }
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      getOrderDetails: async (orderId, token) => {
        set({ loading: true, error: null });
        
        try {
          if (import.meta.env.DEV) {
            await new Promise(resolve => setTimeout(resolve, 300));
            
            const order = [...sampleOrders, ...samplePendingOrders].find(o => o.id === orderId);
            
            if (!order) {
              throw new Error('Order not found');
            }
            
            set({ currentOrder: order, loading: false });
            return order;
          } else {
            const response = await orderAPI.getOrderDetails(orderId, token);
            set({ currentOrder: response.order, loading: false });
            return response.order;
          }
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      clearCurrentOrder: () => {
        set({ currentOrder: null });
      },

      clearError: () => {
        set({ error: null });
      },

      // Utility functions
      getOrderById: (orderId) => {
        const { orders } = get();
        return orders.find(order => order.id === orderId);
      },

      getOrdersByStatus: (status) => {
        const { orders } = get();
        return orders.filter(order => order.status === status);
      },

      getOrdersBySupplier: (supplierId) => {
        const { orders } = get();
        return orders.filter(order => order.supplierId === supplierId);
      },

      getOrdersByVendor: (vendorId) => {
        const { orders } = get();
        return orders.filter(order => order.vendorId === vendorId);
      },

      getOrderStats: () => {
        const { orders } = get();
        const totalOrders = orders.length;
        const pendingOrders = orders.filter(o => o.status === 'pending').length;
        const activeOrders = orders.filter(o => 
          ['confirmed', 'packed', 'in_transit', 'out_for_delivery'].includes(o.status)
        ).length;
        const completedOrders = orders.filter(o => 
          ['delivered', 'cancelled'].includes(o.status)
        ).length;
        const totalAmount = orders.reduce((sum, order) => sum + order.totalAmount, 0);
        
        return {
          totalOrders,
          pendingOrders,
          activeOrders,
          completedOrders,
          totalAmount,
        };
      },
    }),
    {
      name: 'order-store',
    }
  )
); 