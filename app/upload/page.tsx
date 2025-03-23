'use client';

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useHealthRecords } from '../hooks/useHealthRecords';
import Image from 'next/image';

export default function UploadRecord() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const { uploadRecord, isLoading: hookLoading } = useHealthRecords();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    documentType: 'Medical Report',
    patientName: '',
    patientPhone: '',
  });
  
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  
  const documentTypes = [
    'Medical Report',
    'Prescription',
    'Lab Result',
    'Vaccination Record',
    'Insurance Document',
    'Consultation Note',
    'Discharge Summary',
    'Medical Bill',
    'Other'
  ];

  useEffect(() => {
    // Redirect if not authenticated and not loading
    if (!isAuthenticated && !loading) {
      router.push('/login');
      toast.error('Please login to access this page');
    }
    
    // Animation trigger
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [isAuthenticated, loading, router]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check file type
      const acceptedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!acceptedTypes.includes(selectedFile.type)) {
        toast.error('Please upload a PDF or an image file (JPEG, PNG)');
        return;
      }
      
      // Check file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }
      
      setFile(selectedFile);
      
      // Create preview for images
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        // For PDF, just show a placeholder
        setPreview('/pdf-icon.png');
      }
    }
  };

  const simulateProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + 5;
      });
    }, 200);
    
    return interval;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }
    
    if (!formData.title.trim()) {
      toast.error('Please enter a title for your record');
      return;
    }
    
    try {
      setIsUploading(true);
      const progressInterval = simulateProgress();
      
      const data = new FormData();
      data.append('file', file);
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('documentType', formData.documentType);
      data.append('patientName', formData.patientName);
      data.append('patientPhone', formData.patientPhone);
      
      const record = await uploadRecord(data);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      if (record) {
        toast.success('Record uploaded successfully!');
        // Wait a moment before redirecting to show the 100% completion
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      }
    } catch (error) {
      console.error('Error uploading health record:', error);
      toast.error('Failed to upload record. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-gradient-to-r from-gray-800/80 to-gray-800/60 backdrop-blur-lg overflow-hidden shadow-xl rounded-xl border border-gray-700/50">
            <div className="px-6 py-8">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
                <div className="flex items-center">
                  <div className="hidden md:block mr-4">
                    <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white">Upload Health Record</h1>
                    <p className="text-gray-400 mt-1">Securely store and manage your medical documents</p>
                  </div>
                </div>
                <Link
                  href="/dashboard"
                  className="mt-4 md:mt-0 text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Dashboard
                </Link>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-6">
                  <div className="sm:col-span-4">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-300">
                      Title
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="title"
                        id="title"
                        required
                        value={formData.title}
                        onChange={handleChange}
                        className="shadow-sm bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm rounded-lg p-2.5"
                        placeholder="e.g. Annual Physical Examination"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="documentType" className="block text-sm font-medium text-gray-300">
                      Document Type
                    </label>
                    <div className="mt-1">
                      <select
                        id="documentType"
                        name="documentType"
                        value={formData.documentType}
                        onChange={handleChange}
                        className="shadow-sm bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm rounded-lg p-2.5"
                      >
                        {documentTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="patientName" className="block text-sm font-medium text-gray-300">
                      Patient Name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="patientName"
                        id="patientName"
                        value={formData.patientName}
                        onChange={handleChange}
                        className="shadow-sm bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm rounded-lg p-2.5"
                        placeholder="Patient's full name"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="patientPhone" className="block text-sm font-medium text-gray-300">
                      Patient Phone
                    </label>
                    <div className="mt-1">
                      <input
                        type="tel"
                        name="patientPhone"
                        id="patientPhone"
                        value={formData.patientPhone}
                        onChange={handleChange}
                        className="shadow-sm bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm rounded-lg p-2.5"
                        placeholder="e.g. 555-123-4567"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                      Description
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="description"
                        name="description"
                        rows={3}
                        value={formData.description}
                        onChange={handleChange}
                        className="shadow-sm bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm rounded-lg p-2.5"
                        placeholder="Briefly describe this health record"
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-400">
                      Brief description of the document and why it's important.
                    </p>
                  </div>

                  <div className="sm:col-span-6">
                    <label className="block text-sm font-medium text-gray-300">
                      Document
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-lg bg-gray-800/50 transition-all duration-300 hover:border-blue-500/50">
                      <div className="space-y-1 text-center">
                        {preview ? (
                          <div className="flex flex-col items-center">
                            {preview.startsWith('data:image') ? (
                              <img 
                                src={preview} 
                                alt="Preview" 
                                className="h-40 object-contain mb-4 rounded-lg" 
                              />
                            ) : (
                              <div className="flex flex-col items-center justify-center h-40 mb-4">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                                <p className="text-gray-400 mt-2">{file?.name}</p>
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                setFile(null);
                                setPreview(null);
                              }}
                              className="text-sm text-red-400 hover:text-red-300 transition-colors"
                            >
                              Remove file
                            </button>
                          </div>
                        ) : (
                          <>
                            <svg
                              className="mx-auto h-12 w-12 text-gray-400"
                              stroke="currentColor"
                              fill="none"
                              viewBox="0 0 48 48"
                              aria-hidden="true"
                            >
                              <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <div className="flex text-sm text-gray-400">
                              <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer rounded-md font-medium text-blue-400 hover:text-blue-300 focus-within:outline-none"
                              >
                                <span>Upload a file</span>
                                <input
                                  id="file-upload"
                                  name="file-upload"
                                  type="file"
                                  className="sr-only"
                                  onChange={handleFileChange}
                                  accept=".pdf,.jpg,.jpeg,.png"
                                />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">PDF, PNG, JPG up to 5MB</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {isUploading && (
                  <div className="w-full bg-gray-700 rounded-full h-2.5 my-4">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full transition-all duration-300" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                    <p className="text-xs text-gray-400 mt-1 text-right">{uploadProgress}% uploaded</p>
                  </div>
                )}

                <div className="pt-5">
                  <div className="flex justify-end">
                    <Link
                      href="/dashboard"
                      className="bg-gray-700 py-2 px-4 border border-gray-600 rounded-lg shadow-sm text-sm font-medium text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 mr-3"
                    >
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      disabled={isUploading || !file}
                      className={`py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 
                        ${isUploading || !file 
                          ? 'bg-gray-600 cursor-not-allowed' 
                          : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600'}`}
                    >
                      {isUploading ? 'Uploading...' : 'Upload Record'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 