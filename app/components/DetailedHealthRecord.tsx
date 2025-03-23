'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useHealthRecords, HealthRecord } from '../hooks/useHealthRecords';
import PdfViewer from './PdfViewer';
import { formatDate } from '../utils/formatters';

interface DetailedHealthRecordProps {
  recordId: string;
}

const DetailedHealthRecord: React.FC<DetailedHealthRecordProps> = ({ recordId }) => {
  const [record, setRecord] = useState<HealthRecord | null>(null);
  const [activeTab, setActiveTab] = useState<'summary' | 'extracted' | 'structured' | 'processing'>('summary');
  const { getFullRecordById, isLoading, error } = useHealthRecords();
  const router = useRouter();

  useEffect(() => {
    const fetchRecord = async () => {
      const data = await getFullRecordById(recordId);
      if (data) {
        setRecord(data);
      }
    };

    fetchRecord();
  }, [recordId, getFullRecordById]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">Error loading record: {error}</p>
        <button 
          onClick={() => router.back()}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="p-4 text-center">
        <p>Record not found</p>
        <button 
          onClick={() => router.back()}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden border border-gray-700">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-2 text-white">{record.title}</h1>
        <p className="text-gray-400 mb-4">{record.description}</p>
        
        <div className="flex mb-6">
          <div className="mr-6">
            <span className="block text-gray-400 text-sm">Document Type</span>
            <span className="font-medium text-white">{record.documentType}</span>
          </div>
          <div className="mr-6">
            <span className="block text-gray-400 text-sm">Uploaded On</span>
            <span className="font-medium text-white">{formatDate(record.createdAt)}</span>
          </div>
        </div>

        <div className="flex border-b border-gray-700 mb-6">
          <button
            className={`px-4 py-2 ${activeTab === 'summary' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
            onClick={() => setActiveTab('summary')}
          >
            Summary
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'extracted' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
            onClick={() => setActiveTab('extracted')}
          >
            Extracted Data
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'structured' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
            onClick={() => setActiveTab('structured')}
          >
            Structured Data
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'processing' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
            onClick={() => setActiveTab('processing')}
          >
            Processing Info
          </button>
        </div>

        <div className="mb-6">
          {activeTab === 'summary' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                <h3 className="text-lg font-medium mb-3 text-white">Document Preview</h3>
                <div className="h-96">
                  <PdfViewer fileUrl={record.fileUrl} title={record.title} />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-3 text-white">Key Information</h3>
                <div className="space-y-4">
                  {record.patientName && (
                    <div className="bg-blue-900/50 p-3 rounded-lg border border-blue-800">
                      <h4 className="text-sm font-medium text-blue-300 mb-1">Patient Information</h4>
                      <div className="space-y-2">
                        <div>
                          <span className="text-xs text-gray-400 block">Name:</span>
                          <p className="text-sm font-medium text-white">{record.patientName}</p>
                        </div>
                        {record.patientPhone && (
                          <div>
                            <span className="text-xs text-gray-400 block">Phone:</span>
                            <p className="text-sm font-medium text-white">{record.patientPhone}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="bg-gray-900 p-3 rounded-lg border border-gray-700">
                    <h4 className="text-sm font-medium text-gray-300 mb-1">Document Details</h4>
                    <div className="space-y-2">
                      <div>
                        <span className="text-xs text-gray-400 block">Type:</span>
                        <p className="text-sm font-medium text-white">{record.documentType}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-400 block">Uploaded On:</span>
                        <p className="text-sm font-medium text-white">{formatDate(record.createdAt)}</p>
                      </div>
                      {record.processingMetadata?.fileInfo && (
                        <div>
                          <span className="text-xs text-gray-400 block">File Size:</span>
                          <p className="text-sm font-medium text-white">
                            {record.processingMetadata.fileInfo.size 
                              ? `${Math.round(record.processingMetadata.fileInfo.size / 1024)} KB` 
                              : 'Unknown'}
                          </p>
                        </div>
                      )}
                      {record.processingMetadata?.pageCount && (
                        <div>
                          <span className="text-xs text-gray-400 block">Pages:</span>
                          <p className="text-sm font-medium text-white">{record.processingMetadata.pageCount}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {record.structuredData && record.structuredData.summary && (
                    <div className="bg-green-900/50 p-3 rounded-lg border border-green-800">
                      <h4 className="text-sm font-medium text-green-300 mb-1">Summary</h4>
                      <p className="text-sm text-gray-300">{record.structuredData.summary}</p>
                    </div>
                  )}
                  
                  {record.structuredData && !record.structuredData.summary && (
                    <div className="bg-gray-900 p-3 rounded-lg border border-gray-700">
                      <p className="text-gray-400 italic">No AI-generated summary available for this document.</p>
                      <p className="text-sm text-gray-300 mt-1">
                        Check the "Extracted Data" tab to view the raw text extracted from this document.
                      </p>
                    </div>
                  )}
                  
                  {(!record.structuredData || Object.keys(record.structuredData).length === 0) && (
                    <div className="bg-gray-900 p-3 rounded-lg border border-gray-700">
                      <p className="text-gray-400 italic">No structured data available for this document.</p>
                      <p className="text-sm text-gray-300 mt-1">
                        Check the "Extracted Data" tab to view the raw text extracted from this document.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'extracted' && (
            <div>
              <h3 className="text-lg font-medium mb-3 text-white">Extracted Text</h3>
              {record.extractedData ? (
                <div className="space-y-4">
                  {record.patientName && (
                    <div className="bg-blue-900/50 p-3 rounded-lg border border-blue-800">
                      <h4 className="text-sm font-medium text-blue-300 mb-1">Patient Information</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <span className="text-xs text-gray-400">Name:</span>
                          <p className="text-sm font-medium text-white">{record.patientName}</p>
                        </div>
                        {record.patientPhone && (
                          <div>
                            <span className="text-xs text-gray-400">Phone:</span>
                            <p className="text-sm font-medium text-white">{record.patientPhone}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="bg-gray-900 p-4 rounded-lg max-h-[500px] overflow-y-auto whitespace-pre-wrap font-mono text-sm text-gray-300 border border-gray-700">
                    {typeof record.extractedData === 'string' 
                      ? record.extractedData 
                      : record.extractedData.text || 'No extracted text available'}
                  </div>
                  
                  {record.extractedData.pages && record.extractedData.pages.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-md font-medium mb-2 text-white">Pages ({record.extractedData.pages.length})</h4>
                      <div className="space-y-4">
                        {record.extractedData.pages.map((page: any, index: number) => (
                          <div key={index} className="border border-gray-700 rounded-lg">
                            <div className="bg-gray-800 py-2 px-4 border-b border-gray-700">
                              <h5 className="font-medium text-white">Page {index + 1}</h5>
                            </div>
                            <div className="p-4 bg-gray-900 max-h-96 overflow-y-auto whitespace-pre-wrap font-mono text-sm text-gray-300">
                              {page.text || 'No text on this page'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-400 italic">No extracted data available</p>
              )}
            </div>
          )}

          {activeTab === 'structured' && (
            <div>
              <h3 className="text-lg font-medium mb-3 text-white">Structured Data</h3>
              {record.structuredData ? (
                <div className="space-y-6">
                  {/* Patient information if available */}
                  {record.structuredData.patient && (
                    <div className="bg-blue-900/50 p-4 rounded-lg border border-blue-800">
                      <h4 className="font-medium text-blue-300 mb-2">Patient Information</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {Object.entries(record.structuredData.patient).map(([key, value]) => (
                          <div key={key} className="flex flex-col">
                            <span className="text-xs text-gray-400 capitalize">{key}:</span>
                            <span className="text-sm font-medium text-white">
                              {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Summary if available */}
                  {record.structuredData.summary && (
                    <div className="bg-green-900/50 p-4 rounded-lg border border-green-800">
                      <h4 className="font-medium text-green-300 mb-2">Summary</h4>
                      <p className="text-sm text-gray-300">{record.structuredData.summary}</p>
                    </div>
                  )}
                  
                  {/* Diagnoses if available */}
                  {record.structuredData.diagnoses && record.structuredData.diagnoses.length > 0 && (
                    <div className="bg-yellow-900/50 p-4 rounded-lg border border-yellow-800">
                      <h4 className="font-medium text-yellow-300 mb-2">Diagnoses</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {record.structuredData.diagnoses.map((diagnosis: any, index: number) => (
                          <li key={index} className="text-sm text-gray-300">
                            {typeof diagnosis === 'object' ? JSON.stringify(diagnosis) : String(diagnosis)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Medications if available */}
                  {record.structuredData.medications && record.structuredData.medications.length > 0 && (
                    <div className="bg-red-900/50 p-4 rounded-lg border border-red-800">
                      <h4 className="font-medium text-red-300 mb-2">Medications</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {record.structuredData.medications.map((medication: any, index: number) => (
                          <li key={index} className="text-sm text-gray-300">
                            {typeof medication === 'object' 
                              ? Object.entries(medication).map(([key, val]) => 
                                  `${key}: ${val}`).join(', ')
                              : String(medication)
                            }
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Procedures if available */}
                  {record.structuredData.procedures && record.structuredData.procedures.length > 0 && (
                    <div className="bg-purple-900/50 p-4 rounded-lg border border-purple-800">
                      <h4 className="font-medium text-purple-300 mb-2">Procedures</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {record.structuredData.procedures.map((procedure: any, index: number) => (
                          <li key={index} className="text-sm text-gray-300">
                            {typeof procedure === 'object' ? JSON.stringify(procedure) : String(procedure)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Dates if available */}
                  {record.structuredData.dates && (
                    <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                      <h4 className="font-medium text-gray-300 mb-2">Important Dates</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {Object.entries(record.structuredData.dates).map(([key, value]) => (
                          <div key={key} className="flex flex-col">
                            <span className="text-xs text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                            <span className="text-sm font-medium text-white">
                              {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Display all structured data in a collapsible pre element */}
                  <details className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                    <summary className="font-medium cursor-pointer text-white">View Raw Structured Data</summary>
                    <pre className="mt-2 whitespace-pre-wrap overflow-x-auto font-mono text-xs bg-gray-800 p-3 rounded text-gray-300">
                      {JSON.stringify(record.structuredData, null, 2)}
                    </pre>
                  </details>
                </div>
              ) : (
                <p className="text-gray-400 italic">No structured data available for this document.</p>
              )}
            </div>
          )}

          {activeTab === 'processing' && (
            <div>
              <h3 className="text-lg font-medium mb-3 text-white">Processing Metadata</h3>
              {record.processingMetadata ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                      <h4 className="font-medium mb-2 text-white">File Information</h4>
                      <ul className="space-y-1 text-gray-300">
                        <li><span className="font-medium">Original Name:</span> {record.processingMetadata.fileInfo?.originalName || 'N/A'}</li>
                        <li><span className="font-medium">File Size:</span> {record.processingMetadata.fileInfo?.size 
                          ? `${Math.round(record.processingMetadata.fileInfo.size / 1024)} KB` 
                          : 'N/A'}
                        </li>
                        <li><span className="font-medium">MIME Type:</span> {record.processingMetadata.fileInfo?.mimetype || 'N/A'}</li>
                      </ul>
                    </div>
                    <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                      <h4 className="font-medium mb-2 text-white">Processing Timeline</h4>
                      <ul className="space-y-1 text-gray-300">
                        <li>
                          <span className="font-medium">Document AI:</span>{' '}
                          {record.processingMetadata.timeline?.documentAI ? 
                            `${record.processingMetadata.timeline.documentAI.duration} ms` : 
                            'N/A'
                          }
                        </li>
                        <li>
                          <span className="font-medium">GROQ AI:</span>{' '}
                          {record.processingMetadata.timeline?.groqAI ? 
                            `${record.processingMetadata.timeline.groqAI.duration} ms` : 
                            'N/A'
                          }
                        </li>
                        <li>
                          <span className="font-medium">Total Processing:</span>{' '}
                          {record.processingMetadata.timeline?.total ? 
                            `${record.processingMetadata.timeline.total} ms` : 
                            'N/A'
                          }
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                    <h4 className="font-medium mb-2 text-white">Raw Processing Data</h4>
                    <pre className="whitespace-pre-wrap overflow-x-auto font-mono text-sm bg-gray-800 p-3 rounded text-gray-300">
                      {JSON.stringify(record.processingMetadata, null, 2)}
                    </pre>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 italic">No processing metadata available for this document.</p>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => router.back()}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
          >
            Back
          </button>
          <a
            href={record.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
          >
            Download Document
          </a>
        </div>
      </div>
    </div>
  );
};

export default DetailedHealthRecord; 