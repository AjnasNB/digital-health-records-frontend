'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';
import { useRouter } from 'next/navigation';

interface User {
  _id: string;
  name: string;
  email: string;
  dateOfBirth: string;
  phoneNumber: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      fetchUserProfile(storedToken);
    } else {
      setLoading(false);
      setIsAuthenticated(false);
    }
  }, []);

  const fetchUserProfile = async (currentToken: string) => {
    try {
      const res = await authService.getProfile();
      setUser(res.data);
      setIsAuthenticated(true);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      localStorage.removeItem('token');
      setToken(null);
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await authService.login(email, password);
      setUser(res.data);
      const authToken = res.data.token;
      setToken(authToken);
      setIsAuthenticated(true);
      localStorage.setItem('token', authToken);
      setLoading(false);
      router.push('/dashboard');
    } catch (err: any) {
      setLoading(false);
      setIsAuthenticated(false);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  const register = async (userData: any) => {
    try {
      setLoading(true);
      setError(null);
      const res = await authService.register(userData);
      setUser(res.data);
      const authToken = res.data.token;
      setToken(authToken);
      setIsAuthenticated(true);
      localStorage.setItem('token', authToken);
      setLoading(false);
      router.push('/dashboard');
    } catch (err: any) {
      setLoading(false);
      setIsAuthenticated(false);
      
      // Enhanced error handling
      if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        // Handle validation errors array
        setError(err.response.data.errors.join(', '));
      } else if (err.response?.data?.field && err.response?.data?.message) {
        // Handle duplicate field errors
        setError(`${err.response.data.message} (${err.response.data.field})`);
      } else {
        // Generic error
        setError(err.response?.data?.message || 'Registration failed. Please try again.');
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    router.push('/login');
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        isAuthenticated,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}; 