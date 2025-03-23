import axios from 'axios';
import { refreshToken } from '../context/AuthContext';

// Create an axios instance with base URL and default headers
const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

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

// Call Verification API Service
export const callVerificationService = {
  // Initiate verification call for a health record
  initiateVerification: async (id, patientPhone = null) => {
    const data = patientPhone ? { patientPhone } : {};
    return axiosInstance.post(`/health-records/${id}/verify`, data);
  },

  // Get verification status for a health record
  getVerificationStatus: async (id) => {
    return axiosInstance.get(`/health-records/${id}/verify/status`);
  },
  
  // Poll verification status until call ends or max attempts reached
  // Default: Poll for up to 5 minutes with 3-second intervals
  pollVerificationStatus: async (id, onStatusChange, maxAttempts = 100, intervalMs = 3000) => {
    let attempts = 0;
    let lastStatus = null;
    let threeMinuteWarningShown = false;
    const startTime = Date.now();
    const threeMinutes = 3 * 60 * 1000; // 3 minutes in milliseconds
    
    // Function to check if we've reached 3 minutes
    const isThreeMinutesElapsed = () => {
      return (Date.now() - startTime) >= threeMinutes;
    };
    
    const poll = async () => {
      if (attempts >= maxAttempts) {
        return { done: true, status: 'timeout', message: 'Polling timed out' };
      }
      
      // Check if 3 minutes have elapsed and trigger a special notification
      if (!threeMinuteWarningShown && isThreeMinutesElapsed()) {
        threeMinuteWarningShown = true;
        if (onStatusChange) {
          onStatusChange({
            status: 'timeout_warning',
            message: 'The 3-minute call limit has been reached. The call will end automatically.'
          });
        }
      }
      
      try {
        const response = await callVerificationService.getVerificationStatus(id);
        const status = response.data;
        
        // If status changed, notify caller
        if (JSON.stringify(status) !== JSON.stringify(lastStatus)) {
          lastStatus = status;
          if (onStatusChange) {
            onStatusChange(status);
          }
        }
        
        // If call has ended or errored, stop polling
        if (['ended', 'error'].includes(status.status)) {
          return { done: true, status: status.status, data: status };
        }
        
        // Increment attempts and continue polling
        attempts++;
        
        // Adjust polling interval based on call status
        // Poll more frequently during active call
        let nextInterval = intervalMs;
        if (status.status === 'in-progress') {
          nextInterval = 2000; // 2 seconds during active call
        } else if (isThreeMinutesElapsed()) {
          nextInterval = 1000; // 1 second when near timeout
        }
        
        setTimeout(() => poll(), nextInterval);
        return { done: false, status: status.status, data: status };
      } catch (error) {
        console.error('Error polling verification status:', error);
        attempts++;
        setTimeout(() => poll(), intervalMs);
        return { done: false, status: 'error', error };
      }
    };
    
    return poll();
  }
};

export default callVerificationService; 