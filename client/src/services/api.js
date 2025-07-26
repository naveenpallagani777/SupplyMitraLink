import { API_BASE_URL, API_TIMEOUT, AUTH_TOKEN_KEY, ERROR_MESSAGES } from '../utils/constants';

/**
 * Base API service class
 */
class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.timeout = API_TIMEOUT;
  }

  /**
   * Get auth token from localStorage
   */
  getAuthToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }

  /**
   * Set auth token in localStorage
   */
  setAuthToken(token) {
    if (token) {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  }

  /**
   * Create headers for API requests
   */
  createHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = this.getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  /**
   * Make API request with timeout and error handling
   */
  async makeRequest(url, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          ...this.createHeaders(options.includeAuth !== false),
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }

      return await response.text();
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error(ERROR_MESSAGES.TIMEOUT_ERROR);
      }
      
      if (error.message.includes('HTTP 401')) {
        this.setAuthToken(null);
        throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
      }
      
      if (error.message.includes('HTTP 403')) {
        throw new Error(ERROR_MESSAGES.FORBIDDEN);
      }
      
      if (error.message.includes('HTTP 404')) {
        throw new Error(ERROR_MESSAGES.NOT_FOUND);
      }
      
      if (error.message.includes('HTTP 500')) {
        throw new Error(ERROR_MESSAGES.SERVER_ERROR);
      }
      
      throw new Error(error.message || ERROR_MESSAGES.NETWORK_ERROR);
    }
  }

  /**
   * GET request
   */
  async get(endpoint, params = {}, includeAuth = true) {
    const url = new URL(`${this.baseURL}${endpoint}`);
    
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key]);
      }
    });

    return this.makeRequest(url.toString(), {
      method: 'GET',
      includeAuth,
    });
  }

  /**
   * POST request
   */
  async post(endpoint, data = {}, includeAuth = true) {
    return this.makeRequest(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      body: JSON.stringify(data),
      includeAuth,
    });
  }

  /**
   * PUT request
   */
  async put(endpoint, data = {}, includeAuth = true) {
    return this.makeRequest(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      includeAuth,
    });
  }

  /**
   * PATCH request
   */
  async patch(endpoint, data = {}, includeAuth = true) {
    return this.makeRequest(`${this.baseURL}${endpoint}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      includeAuth,
    });
  }

  /**
   * DELETE request
   */
  async delete(endpoint, includeAuth = true) {
    return this.makeRequest(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      includeAuth,
    });
  }

  /**
   * Upload file
   */
  async uploadFile(endpoint, file, includeAuth = true) {
    const formData = new FormData();
    formData.append('file', file);

    const headers = this.createHeaders(includeAuth);
    delete headers['Content-Type']; // Let browser set content-type for FormData

    return this.makeRequest(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      body: formData,
      headers,
      includeAuth,
    });
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService; 