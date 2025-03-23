import axios from 'axios';

const API_URL = 'https://docxbackend.ajnasnb.com/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    // Special handling for network errors
    if (!error.response) {
      return Promise.reject({ 
        response: { 
          data: { message: 'Network error. Please check your connection.' } 
        } 
      });
    }
    
    return Promise.reject(error);
  }
);

// Auth Service
export const authService = {
  register: async (userData: any) => {
    try {
      return await api.post('/users', userData);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  login: async (email: string, password: string) => {
    try {
      return await api.post('/users/login', { email, password });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  getProfile: async () => {
    try {
      return await api.get('/users/profile');
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },
};

// Health Records Service
export const healthRecordService = {
  uploadRecord: async (formData: FormData) => {
    try {
      return await api.post('/health-records/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      console.error('Upload record error:', error);
      throw error;
    }
  },
  getRecords: async () => {
    try {
      return await api.get('/health-records');
    } catch (error) {
      console.error('Get records error:', error);
      throw error;
    }
  },
  getRecordById: async (id: string) => {
    try {
      return await api.get(`/health-records/${id}`);
    } catch (error) {
      console.error('Get record error:', error);
      throw error;
    }
  },
  getFullRecordById: async (id: string) => {
    try {
      return await api.get(`/health-records/${id}/full`);
    } catch (error) {
      console.error('Get full record error:', error);
      throw error;
    }
  },
  deleteRecord: async (id: string) => {
    try {
      return await api.delete(`/health-records/${id}`);
    } catch (error) {
      console.error('Delete record error:', error);
      throw error;
    }
  },
};

export default api; 