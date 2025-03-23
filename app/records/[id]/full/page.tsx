'use client';

import React, { useState, useEffect } from 'react';
import DetailedHealthRecord from '../../../components/DetailedHealthRecord';
import { useRouter } from 'next/navigation';
import { useHealthRecords } from '../../../hooks/useHealthRecords';
import Link from 'next/link';

// Update to the simpler recommended pattern
export default function HealthRecordDetailPage({ params }: { params: { id: string } }) {
  const recordId = params.id;
  
  const [pageTitle, setPageTitle] = useState("Detailed Health Record");
  const { getRecordById } = useHealthRecords();
  const router = useRouter();

  useEffect(() => {
    // Fetch the record to get its title
    const fetchRecordTitle = async () => {
      const record = await getRecordById(recordId);
      if (record) {
        setPageTitle(`${record.title} - Health Record Details`);
        // Update the document title directly
        document.title = `${record.title} - Health Record Details | Docufy`;
      }
    };

    fetchRecordTitle();
  }, [recordId, getRecordById]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <Link
                href={`/records/${recordId}`}
                className="text-blue-400 hover:text-blue-300 flex items-center"
              >
                <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Record
              </Link>
            </div>
          </div>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            {pageTitle}
          </h1>
          <p className="mt-2 text-gray-400">
            View comprehensive information extracted from your health document
          </p>
        </div>
        
        <DetailedHealthRecord recordId={recordId} />
      </div>
    </div>
  );
} 