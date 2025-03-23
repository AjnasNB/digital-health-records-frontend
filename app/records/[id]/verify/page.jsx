'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Container, Typography, Paper, Button, Divider, Chip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VerificationCall from '../../../components/VerificationCall';
import { getRecordById } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';

export default function VerificationPage(props) {
  // Always use React.use to unwrap the params promise
  const resolvedParams = React.use(props.params);
  const recordId = resolvedParams.id;
  
  const router = useRouter();
  const { user } = useAuth();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchRecord = async () => {
      try {
        setLoading(true);
        const response = await getRecordById(recordId);
        setRecord(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching record:', err);
        setError('Failed to load health record. Please try again.');
        setLoading(false);
      }
    };

    fetchRecord();
  }, [user, recordId, router]);

  const handleVerificationComplete = (status) => {
    // Refresh the record data to show updated verification status
    if (status.status === 'ended') {
      setTimeout(() => {
        getRecordById(recordId)
          .then(response => setRecord(response.data))
          .catch(err => console.error('Error refreshing record data:', err));
      }, 2000); // Small delay to ensure backend has processed everything
    }
  };

  const getPatientPhone = () => {
    if (!record) return null;
    
    // Try to get phone from structured data if available
    if (record.structuredData?.patientInfo?.phone) {
      return record.structuredData.patientInfo.phone;
    }
    
    // Try to find phone in extracted text
    const phoneRegex = /(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/;
    const extractedText = typeof record.extractedText === 'string' 
      ? record.extractedText 
      : JSON.stringify(record.extractedText);
      
    const match = extractedText.match(phoneRegex);
    return match ? match[0] : null;
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button 
        startIcon={<ArrowBackIcon />}
        onClick={() => router.back()}
        sx={{ mb: 2 }}
      >
        Back to Record
      </Button>
      
      <Typography variant="h4" component="h1" gutterBottom>
        Verify Patient Identity
      </Typography>
      
      {loading ? (
        <Typography>Loading record data...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : record ? (
        <>
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Record Information
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1">
                Title: {record.title || 'Untitled Record'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Uploaded: {new Date(record.createdAt).toLocaleString()}
              </Typography>
              
              {record.verificationStatus && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Verification Status:
                  </Typography>
                  <Chip 
                    label={record.verificationStatus === 'verified' ? 'Verified' : 'Not Verified'} 
                    color={record.verificationStatus === 'verified' ? 'success' : 'default'}
                    sx={{ mt: 1 }}
                  />
                </Box>
              )}
            </Box>
          </Paper>
          
          <Typography variant="body1" paragraph>
            Use this tool to verify the patient's identity by initiating an automated phone call.
            The system will call the patient and ask verification questions based on the health record information.
          </Typography>
          
          <Divider sx={{ my: 3 }} />
          
          <VerificationCall 
            recordId={recordId} 
            patientPhone={getPatientPhone()}
            onVerificationComplete={handleVerificationComplete}
          />
          
          {record.verificationHistory && record.verificationHistory.length > 0 && (
            <Paper sx={{ p: 3, mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Verification History
              </Typography>
              {record.verificationHistory.map((attempt, index) => (
                <Box key={index} sx={{ mb: 2, pb: 2, borderBottom: index < record.verificationHistory.length - 1 ? '1px solid #eee' : 'none' }}>
                  <Typography variant="subtitle2">
                    {new Date(attempt.timestamp).toLocaleString()}
                  </Typography>
                  <Typography variant="body2">
                    Status: {attempt.status}
                    {attempt.verified !== undefined && (
                      <Chip 
                        size="small"
                        label={attempt.verified ? 'Verified' : 'Not Verified'} 
                        color={attempt.verified ? 'success' : 'default'}
                        sx={{ ml: 2 }}
                      />
                    )}
                  </Typography>
                  {attempt.callDuration && (
                    <Typography variant="body2" color="text.secondary">
                      Call duration: {Math.round(attempt.callDuration)} seconds
                    </Typography>
                  )}
                  {attempt.message && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {attempt.message}
                    </Typography>
                  )}
                </Box>
              ))}
            </Paper>
          )}
        </>
      ) : (
        <Typography>No record found</Typography>
      )}
    </Container>
  );
} 