'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface PdfViewerProps {
  fileUrl: string;
  title?: string;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ fileUrl, title }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExternalUrl, setIsExternalUrl] = useState(false);

  useEffect(() => {
    const checkPdfAvailability = async () => {
      try {
        // Check if this is an external URL (S3)
        const isExternal = fileUrl.startsWith('http') && !fileUrl.includes(window.location.hostname);
        setIsExternalUrl(isExternal);
        
        // For external URLs like S3, we can't easily make HEAD requests due to CORS
        // So we'll just assume it exists and handle errors in the iframe
        if (isExternal) {
          setLoading(false);
          return;
        }
        
        // For local files, check if the file exists by making a HEAD request
        const response = await fetch(fileUrl, { method: 'HEAD' });
        if (!response.ok) {
          setError(`Failed to load PDF: ${response.statusText}`);
          toast.error('Failed to load PDF file');
        }
      } catch (err) {
        // Don't set error for external URLs as they might still load in the iframe
        if (!isExternalUrl) {
          setError('Failed to load PDF: network error');
          toast.error('Network error while loading PDF');
        }
      } finally {
        setLoading(false);
      }
    };

    if (fileUrl) {
      checkPdfAvailability();
    } else {
      setError('No file URL provided');
      setLoading(false);
    }
  }, [fileUrl]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 bg-gray-800 rounded-lg">
        <svg 
          className="h-12 w-12 text-red-500 mb-4" 
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
        <p className="text-red-500 mb-2">{error}</p>
        <a 
          href={fileUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-500 hover:text-blue-700 underline"
        >
          Download PDF Instead
        </a>
      </div>
    );
  }

  // For external URLs (like S3), we need to use an object tag or embed instead of iframe
  // because iframe might not work well with PDFs from external domains
  if (isExternalUrl) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 relative min-h-[300px]">
          <object
            data={fileUrl}
            type="application/pdf"
            className="w-full h-full border-0 rounded-md"
            style={{ minHeight: '300px' }}
          >
            <p className="text-center text-gray-400 p-4">
              Your browser doesn't support embedded PDFs. 
              <a 
                href={fileUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-500 hover:text-blue-700 ml-1 underline"
              >
                Click here to download the PDF.
              </a>
            </p>
          </object>
        </div>
        <div className="flex justify-between mt-3">
          <a 
            href={fileUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            Open in new tab
          </a>
          <a 
            href={fileUrl} 
            download 
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            Download
          </a>
        </div>
      </div>
    );
  }

  // For local files, use iframe
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 relative min-h-[300px]">
        <iframe
          src={`${fileUrl}#view=FitH`}
          title={title || "PDF Viewer"}
          className="w-full h-full border-0 rounded-md"
          style={{ minHeight: '300px' }}
        />
      </div>
      <div className="flex justify-between mt-3">
        <a 
          href={fileUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-sm text-blue-400 hover:text-blue-300"
        >
          Open in new tab
        </a>
        <a 
          href={fileUrl} 
          download 
          className="text-sm text-blue-400 hover:text-blue-300"
        >
          Download
        </a>
      </div>
    </div>
  );
};

export default PdfViewer; 