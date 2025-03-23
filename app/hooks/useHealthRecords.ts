import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { healthRecordService } from '../services/api';

export interface HealthRecord {
  _id: string;
  userId: string;
  title: string;
  description: string;
  documentType: string;
  fileUrl: string;
  extractedData: any;
  structuredData?: any;
  processingMetadata?: any;
  patientName?: string;
  patientPhone?: string;
  createdAt: string;
  updatedAt: string;
}

export function useHealthRecords() {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, token } = useAuth();

  const fetchRecords = useCallback(async () => {
    if (!isAuthenticated || !token) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await healthRecordService.getRecords();
      setRecords(response.data.records || []);
    } catch (err) {
      console.error('Error fetching health records:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching records');
      toast.error('Failed to load health records');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, token]);

  const getRecordById = useCallback(async (id: string) => {
    if (!isAuthenticated || !token) return null;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await healthRecordService.getRecordById(id);
      return response.data.record;
    } catch (err) {
      console.error(`Error fetching health record with ID ${id}:`, err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching the record');
      toast.error('Failed to load health record');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, token]);

  const getFullRecordById = useCallback(async (id: string) => {
    if (!isAuthenticated || !token) return null;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await healthRecordService.getFullRecordById(id);
      return response.data.record;
    } catch (err) {
      console.error(`Error fetching full health record with ID ${id}:`, err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching the complete record data');
      toast.error('Failed to load detailed health record data');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, token]);

  const deleteRecord = useCallback(async (id: string) => {
    if (!isAuthenticated || !token) return false;
    
    try {
      setIsLoading(true);
      setError(null);
      
      await healthRecordService.deleteRecord(id);
      
      setRecords(prevRecords => prevRecords.filter(record => record._id !== id));
      toast.success('Record deleted successfully');
      return true;
    } catch (err) {
      console.error(`Error deleting health record with ID ${id}:`, err);
      setError(err instanceof Error ? err.message : 'An error occurred while deleting the record');
      toast.error('Failed to delete health record');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, token]);

  const uploadRecord = useCallback(async (formData: FormData) => {
    if (!isAuthenticated || !token) return null;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await healthRecordService.uploadRecord(formData);
      
      const data = response.data;
      toast.success('Health record uploaded successfully');
      
      // Add the new record to the records list
      if (data.record) {
        setRecords(prevRecords => [data.record, ...prevRecords]);
      }
      
      return data.record;
    } catch (err: any) {
      console.error('Error uploading health record:', err);
      const errorMessage = err.response?.data?.message || 'Failed to upload health record';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchRecords();
    } else {
      setRecords([]);
    }
  }, [isAuthenticated, token, fetchRecords]);

  return {
    records,
    isLoading,
    error,
    fetchRecords,
    getRecordById,
    getFullRecordById,
    deleteRecord,
    uploadRecord
  };
} 