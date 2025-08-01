// Main store index file
export { useAuthStore } from './useAuthStore';
export { useSupplierStore } from './useSupplierStore';
export { useVendorStore } from './useVendorStore';
export { useOrderStore } from './useOrderStore';
export { useFeedbackStore } from './useFeedbackStore';

// Store initialization helper
export const initializeStores = () => {
  // This function can be used to initialize stores with default data
  // or perform any setup required for the stores
  console.log('Stores initialized');
};

// Store reset helper
export const resetAllStores = () => {
  // This function can be used to reset all stores to their initial state
  // Useful for logout or app reset scenarios
  console.log('All stores reset');
}; 