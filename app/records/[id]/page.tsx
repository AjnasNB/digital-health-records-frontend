'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useHealthRecords, HealthRecord } from '../../hooks/useHealthRecords';
import PdfViewer from '../../components/PdfViewer';

export default function RecordDetail({ params }: { params: { id: string } }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const { getRecordById, deleteRecord, isLoading: hookLoading } = useHealthRecords();
  const [record, setRecord] = useState<HealthRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'details' | 'extracted'>('details');

  useEffect(() => {
    // Update document title
    document.title = "Health Record | Digital Health Records";

    // Redirect if not authenticated and not loading
    if (!isAuthenticated && !loading) {
      router.push('/login');
      return;
    }
    
    // Fetch record if user is authenticated
    const fetchRecord = async () => {
      if (isAuthenticated) {
        setIsLoading(true);
        const recordData = await getRecordById(params.id);
        if (recordData) {
          setRecord(recordData);
          document.title = `${recordData.title} | Digital Health Records`;
        } else {
          router.push('/dashboard');
        }
        setIsLoading(false);
      }
    };
    
    fetchRecord();
  }, [isAuthenticated, loading, params.id, router, getRecordById]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this record? This action cannot be undone.')) {
      const success = await deleteRecord(params.id);
      if (success) {
        router.push('/dashboard');
      }
    }
  };

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading record details...</p>
        </div>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center max-w-md px-4">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-12 w-12 mx-auto text-gray-500" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-white">Record Not Found</h3>
          <p className="mt-1 text-sm text-gray-400">The health record you are looking for does not exist or you don't have permission to view it.</p>
          <div className="mt-6">
            <Link
              href="/dashboard"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const renderDocumentView = () => {
    const isImage = record.fileUrl && (record.fileUrl.endsWith('.jpg') || record.fileUrl.endsWith('.jpeg') || record.fileUrl.endsWith('.png'));
    const isPdf = record.fileUrl && record.fileUrl.endsWith('.pdf');

    if (isImage) {
      return (
        <div className="mt-4 flex justify-center">
          <img 
            src={record.fileUrl} 
            alt={record.title} 
            className="max-w-full max-h-96 object-contain rounded-md shadow-md" 
          />
        </div>
      );
    } else if (isPdf) {
      return (
        <div className="mt-4">
          <PdfViewer fileUrl={record.fileUrl} title={record.title} />
        </div>
      );
    } else {
      return (
        <div className="mt-4 bg-gray-800 p-4 rounded-md text-center">
          <p className="text-gray-400 text-sm">Preview not available for this document type</p>
          {record.fileUrl && (
            <a 
              href={record.fileUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-2 inline-block px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Download Document
            </a>
          )}
        </div>
      );
    }
  };

  const renderExtractedData = () => {
    if (!record.extractedData || 
        (typeof record.extractedData === 'object' && Object.keys(record.extractedData).length === 0) ||
        (typeof record.extractedData === 'string' && !record.extractedData.trim())) {
      return (
        <div className="bg-gray-800 p-6 rounded-md text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-white">No Data Extracted</h3>
          <p className="mt-1 text-sm text-gray-400">
            This document has no extracted data available or is still being processed.
          </p>
          <Link 
            href={`/records/${params.id}/full`}
            className="mt-4 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            View Full Record Details
          </Link>
        </div>
      );
    }

    // If extractedData is a string (the full text)
    if (typeof record.extractedData === 'string') {
      return (
        <div className="bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-700">
            <h3 className="text-lg leading-6 font-medium text-white">Extracted Text</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-400">
              Raw text extracted from your document.
            </p>
          </div>
          <div className="p-4">
            <pre className="whitespace-pre-wrap overflow-x-auto text-sm text-gray-300 bg-gray-900 p-4 rounded-md max-h-96 overflow-y-auto">
              {record.extractedData}
            </pre>
          </div>
          <div className="px-4 py-3 text-right sm:px-6 border-t border-gray-700">
            <Link 
              href={`/records/${params.id}/full`}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              View Full Record Details
            </Link>
          </div>
        </div>
      );
    }

    // If extractedData is an object (with structured data)
    return (
      <div className="bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-700">
          <h3 className="text-lg leading-6 font-medium text-white">Extracted Information</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-400">
            Data automatically extracted from your document using AI.
          </p>
        </div>
        <div className="border-t border-gray-700">
          <dl>
            {record.extractedData.text && (
              <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-800">
                <dt className="text-sm font-medium text-gray-400">Text Preview</dt>
                <dd className="mt-1 text-sm text-gray-300 sm:mt-0 sm:col-span-2">
                  {record.extractedData.text.substring(0, 300)}
                  {record.extractedData.text.length > 300 && "..."}
                </dd>
              </div>
            )}
            
            {record.patientName && (
              <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-700">
                <dt className="text-sm font-medium text-gray-400">Patient Name</dt>
                <dd className="mt-1 text-sm text-gray-300 sm:mt-0 sm:col-span-2">
                  {record.patientName}
                </dd>
              </div>
            )}

            {record.patientPhone && (
              <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-800">
                <dt className="text-sm font-medium text-gray-400">Patient Phone</dt>
                <dd className="mt-1 text-sm text-gray-300 sm:mt-0 sm:col-span-2">
                  {record.patientPhone}
                </dd>
              </div>
            )}

            {record.structuredData && Object.keys(record.structuredData).length > 0 && (
              <div className="px-4 py-5 sm:px-6 border-t border-gray-700">
                <Link 
                  href={`/records/${params.id}/full`}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  View Structured Data & Full Details
                </Link>
              </div>
            )}
          </dl>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <Link
                href="/dashboard"
                className="text-blue-400 hover:text-blue-300 flex items-center"
              >
                <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
              </Link>
            </div>
            <div className="flex space-x-3">
              <Link 
                href={`/records/${params.id}/full`}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                View Detailed Info
              </Link>
              <button
                onClick={handleDelete}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 shadow overflow-hidden sm:rounded-lg border border-gray-700">
          <div className="px-4 py-5 sm:px-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl leading-6 font-medium text-white">{record.title}</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-400">
                  {record.documentType} • Created {formatDate(record.createdAt)}
                </p>
              </div>
              {record.fileUrl && (
                <a 
                  href={record.fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </a>
              )}
            </div>
          </div>

          <div className="border-t border-gray-700">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('details')}
                className={`px-6 py-3 font-medium text-sm ${
                  activeTab === 'details'
                    ? 'border-b-2 border-blue-500 text-blue-400'
                    : 'text-gray-400 hover:text-gray-300 hover:border-gray-500'
                }`}
              >
                Details
              </button>
              <button
                onClick={() => setActiveTab('extracted')}
                className={`px-6 py-3 font-medium text-sm ${
                  activeTab === 'extracted'
                    ? 'border-b-2 border-blue-500 text-blue-400'
                    : 'text-gray-400 hover:text-gray-300 hover:border-gray-500'
                }`}
              >
                Extracted Data
              </button>
            </nav>
          </div>

          <div className="px-4 py-5 sm:px-6">
            {activeTab === 'details' ? (
              <div>
                {record.description && (
                  <div className="mt-2 mb-6">
                    <p className="text-sm text-gray-300">{record.description}</p>
                  </div>
                )}
                {renderDocumentView()}
              </div>
            ) : (
              renderExtractedData()
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 