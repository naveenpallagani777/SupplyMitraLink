import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// API functions
const feedbackAPI = {
  submitFeedback: async (feedbackData, token) => {
    const response = await fetch(`${API_BASE_URL}/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(feedbackData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to submit feedback');
    }
    
    return response.json();
  },

  getFeedback: async (params = {}, token) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/feedback?${queryString}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch feedback');
    }
    
    return response.json();
  },
};

// Sample data for development
const sampleFeedback = [
  {
    id: 'feedback-1',
    fromUserId: 'vendor-1',
    fromUserName: 'Fresh Market Vendor',
    toUserId: 'supplier-1',
    toUserName: 'Fresh Farm Supplies',
    role: 'vendor',
    rating: 5,
    comment: 'Excellent quality products and timely delivery. Highly recommended!',
    date: '2024-01-19T14:30:00Z',
    orderId: 'order-003',
    helpful: 3,
    reported: false,
  },
  {
    id: 'feedback-2',
    fromUserId: 'vendor-1',
    fromUserName: 'Fresh Market Vendor',
    toUserId: 'supplier-1',
    toUserName: 'Fresh Farm Supplies',
    role: 'vendor',
    rating: 4,
    comment: 'Good quality vegetables, but delivery was slightly delayed.',
    date: '2024-01-18T16:45:00Z',
    orderId: 'order-001',
    helpful: 1,
    reported: false,
  },
  {
    id: 'feedback-3',
    fromUserId: 'supplier-1',
    fromUserName: 'Fresh Farm Supplies',
    toUserId: 'vendor-1',
    toUserName: 'Fresh Market Vendor',
    role: 'supplier',
    rating: 5,
    comment: 'Great customer to work with. Clear communication and prompt payments.',
    date: '2024-01-17T11:20:00Z',
    orderId: 'order-002',
    helpful: 2,
    reported: false,
  },
  {
    id: 'feedback-4',
    fromUserId: 'vendor-1',
    fromUserName: 'Fresh Market Vendor',
    toUserId: 'supplier-2',
    toUserName: 'Green Valley Farms',
    role: 'vendor',
    rating: 3,
    comment: 'Products were fresh but packaging could be better.',
    date: '2024-01-16T09:15:00Z',
    orderId: 'order-004',
    helpful: 0,
    reported: false,
  },
];

export const useFeedbackStore = create(
  devtools(
    (set, get) => ({
      // State
      feedback: [],
      userFeedback: [],
      loading: false,
      error: null,

      // Actions
      submitFeedback: async (feedbackData, token) => {
        set({ loading: true, error: null });
        
        try {
          if (import.meta.env.DEV) {
            await new Promise(resolve => setTimeout(resolve, 800));
            
            const newFeedback = {
              id: `feedback-${Date.now()}`,
              ...feedbackData,
              date: new Date().toISOString(),
              helpful: 0,
              reported: false,
            };
            
            set((state) => ({
              feedback: [newFeedback, ...state.feedback],
              loading: false,
            }));
            
            return { success: true, feedback: newFeedback };
          } else {
            const response = await feedbackAPI.submitFeedback(feedbackData, token);
            
            if (response.success) {
              set((state) => ({
                feedback: [response.feedback, ...state.feedback],
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

      fetchFeedback: async (params = {}, token) => {
        set({ loading: true, error: null });
        
        try {
          if (import.meta.env.DEV) {
            await new Promise(resolve => setTimeout(resolve, 500));
            
            let filteredFeedback = [...sampleFeedback];
            
            // Apply filters
            if (params.userId) {
              filteredFeedback = filteredFeedback.filter(feedback =>
                feedback.toUserId === params.userId || feedback.fromUserId === params.userId
              );
            }
            
            if (params.role) {
              filteredFeedback = filteredFeedback.filter(feedback =>
                feedback.role === params.role
              );
            }
            
            if (params.rating) {
              filteredFeedback = filteredFeedback.filter(feedback =>
                feedback.rating >= params.rating
              );
            }
            
            // Sort by date (newest first)
            filteredFeedback.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            set({ feedback: filteredFeedback, loading: false });
            return filteredFeedback;
          } else {
            const response = await feedbackAPI.getFeedback(params, token);
            set({ feedback: response.feedback, loading: false });
            return response.feedback;
          }
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      fetchUserFeedback: async (userId, token) => {
        set({ loading: true, error: null });
        
        try {
          if (import.meta.env.DEV) {
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const userFeedback = sampleFeedback.filter(feedback =>
              feedback.toUserId === userId
            );
            
            set({ userFeedback, loading: false });
            return userFeedback;
          } else {
            const response = await feedbackAPI.getFeedback({ userId }, token);
            set({ userFeedback: response.feedback, loading: false });
            return response.feedback;
          }
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      markHelpful: (feedbackId) => {
        set((state) => ({
          feedback: state.feedback.map(feedback =>
            feedback.id === feedbackId
              ? { ...feedback, helpful: feedback.helpful + 1 }
              : feedback
          ),
          userFeedback: state.userFeedback.map(feedback =>
            feedback.id === feedbackId
              ? { ...feedback, helpful: feedback.helpful + 1 }
              : feedback
          ),
        }));
      },

      reportFeedback: (feedbackId) => {
        set((state) => ({
          feedback: state.feedback.map(feedback =>
            feedback.id === feedbackId
              ? { ...feedback, reported: true }
              : feedback
          ),
          userFeedback: state.userFeedback.map(feedback =>
            feedback.id === feedbackId
              ? { ...feedback, reported: true }
              : feedback
          ),
        }));
      },

      clearError: () => {
        set({ error: null });
      },

      // Utility functions
      getFeedbackById: (feedbackId) => {
        const { feedback } = get();
        return feedback.find(f => f.id === feedbackId);
      },

      getFeedbackByUser: (userId) => {
        const { feedback } = get();
        return feedback.filter(f => f.toUserId === userId);
      },

      getFeedbackByRole: (role) => {
        const { feedback } = get();
        return feedback.filter(f => f.role === role);
      },

      getAverageRating: (userId) => {
        const { feedback } = get();
        const userFeedback = feedback.filter(f => f.toUserId === userId);
        
        if (userFeedback.length === 0) return 0;
        
        const totalRating = userFeedback.reduce((sum, f) => sum + f.rating, 0);
        return Math.round((totalRating / userFeedback.length) * 10) / 10;
      },

      getRatingDistribution: (userId) => {
        const { feedback } = get();
        const userFeedback = feedback.filter(f => f.toUserId === userId);
        
        const distribution = {
          5: 0, 4: 0, 3: 0, 2: 0, 1: 0
        };
        
        userFeedback.forEach(f => {
          distribution[f.rating] = (distribution[f.rating] || 0) + 1;
        });
        
        return distribution;
      },

      getRecentFeedback: (limit = 5) => {
        const { feedback } = get();
        return feedback
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, limit);
      },

      getPositiveFeedback: (userId) => {
        const { feedback } = get();
        return feedback.filter(f => 
          f.toUserId === userId && f.rating >= 4
        );
      },

      getNegativeFeedback: (userId) => {
        const { feedback } = get();
        return feedback.filter(f => 
          f.toUserId === userId && f.rating <= 2
        );
      },
    }),
    {
      name: 'feedback-store',
    }
  )
); 