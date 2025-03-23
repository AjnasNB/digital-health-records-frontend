import axios from 'axios';
import { refreshToken } from '../context/AuthContext';

// Create an axios instance with base URL and default headers
const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://docxbackend.ajnasnb.com/api';

const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for authentication
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for handling auth errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 (Unauthorized) and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Attempt to refresh the token
        const newToken = await refreshToken();
        
        // If token refresh was successful, retry the original request
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // Token refresh failed
        console.error('Token refresh failed:', refreshError);
        // Let the error propagate to be handled by the component
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API Service
export const authService = {
  register: async (userData) => {
    return axiosInstance.post('/users/register', userData);
  },
  
  login: async (email, password) => {
    return axiosInstance.post('/users/login', { email, password });
  },
  
  getProfile: async () => {
    return axiosInstance.get('/users/profile');
  }
};

// Health Records API Service
export const healthRecordService = {
  // Get all records for the current user
  getAllRecords: async () => {
    return axiosInstance.get('/health-records');
  },
  
  // Get a single record by ID
  getRecordById: async (id) => {
    return axiosInstance.get(`/health-records/${id}`);
  },
  
  // Get the full data for a record by ID
  getFullRecordById: async (id) => {
    return axiosInstance.get(`/health-records/${id}/full`);
  },
  
  // Upload a new health record
  uploadHealthRecord: async (formData) => {
    return axiosInstance.post('/health-records/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  // Delete a health record
  deleteRecord: async (id) => {
    return axiosInstance.delete(`/health-records/${id}`);
  },
  
  // Share a record with another user
  shareRecord: async (id, email) => {
    return axiosInstance.post(`/health-records/${id}/share`, { email });
  },
  
  // Get shared records
  getSharedRecords: async () => {
    return axiosInstance.get('/health-records/shared');
  },
  
  // Verify a health record
  initiateVerification: async (id, patientPhone = null) => {
    const data = patientPhone ? { patientPhone } : {};
    return axiosInstance.post(`/health-records/${id}/verify`, data);
  },
  
  // Get verification status for a health record
  getVerificationStatus: async (id) => {
    return axiosInstance.get(`/health-records/${id}/verify/status`);
  }
};

// Helper functions to make it easier to use the services
export const login = authService.login;
export const register = authService.register;
export const getProfile = authService.getProfile;
export const getAllRecords = healthRecordService.getAllRecords;
export const getRecordById = healthRecordService.getRecordById;
export const getFullRecordById = healthRecordService.getFullRecordById;
export const uploadHealthRecord = healthRecordService.uploadHealthRecord;
export const deleteRecord = healthRecordService.deleteRecord;
export const shareRecord = healthRecordService.shareRecord;
export const getSharedRecords = healthRecordService.getSharedRecords;
export const initiateVerification = healthRecordService.initiateVerification;
export const getVerificationStatus = healthRecordService.getVerificationStatus;

export default {
  authService,
  healthRecordService
}; 