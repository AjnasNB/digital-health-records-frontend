import React, { useState, useEffect } from 'react';
import { callVerificationService } from '../services/callVerification';
import { Button, Card, Typography, CircularProgress, TextField, Alert, Box, Divider } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import CallEndIcon from '@mui/icons-material/CallEnd';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import TimerIcon from '@mui/icons-material/Timer';

const VerificationCall = ({ recordId, patientPhone, onVerificationComplete }) => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [customPhone, setCustomPhone] = useState('');
  const [showPhoneInput, setShowPhoneInput] = useState(false);
  const [polling, setPolling] = useState(false);
  const [callTimer, setCallTimer] = useState(0);
  const [callStarted, setCallStarted] = useState(false);

  // Effect to handle call timer
  useEffect(() => {
    let interval;
    if (callStarted && callTimer < 180) { // 180 seconds = 3 minutes
      interval = setInterval(() => {
        setCallTimer(prevTime => {
          const newTime = prevTime + 1;
          // If we reach 3 minutes (180 seconds), show a notification
          if (newTime === 180) {
            console.log('3-minute limit reached');
          }
          return newTime;
        });
      }, 1000);
    } else if (callTimer >= 180) {
      // If call exceeds 3 minutes
      clearInterval(interval);
    }
    
    return () => clearInterval(interval);
  }, [callStarted, callTimer]);

  const handleInitiateCall = async (useCustomPhone = false) => {
    setLoading(true);
    setError(null);
    setCallTimer(0);
    
    try {
      const phone = useCustomPhone ? customPhone : patientPhone;
      await callVerificationService.initiateVerification(recordId, useCustomPhone ? phone : null);
      
      // Start polling for status updates
      setPolling(true);
      setStatus({ status: 'initiated', message: 'Call initiated. Connecting...' });
      setCallStarted(true);
      
      callVerificationService.pollVerificationStatus(
        recordId,
        (newStatus) => {
          setStatus(newStatus);
          if (['ended', 'error'].includes(newStatus.status)) {
            setPolling(false);
            setCallStarted(false);
            if (onVerificationComplete) {
              onVerificationComplete(newStatus);
            }
          }
        },
        60, // 5 minutes max (with 5-second intervals)
        5000
      );
    } catch (err) {
      console.error('Error initiating verification call:', err);
      setError(err.response?.data?.message || 'Failed to initiate verification call');
      setPolling(false);
      setCallStarted(false);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getStatusIcon = () => {
    if (!status) return null;
    
    switch (status.status) {
      case 'initiated':
        return <PhoneIcon sx={{ color: 'orange', fontSize: 40 }} />;
      case 'ringing':
        return <PhoneIcon sx={{ color: 'blue', fontSize: 40 }} />;
      case 'in-progress':
        return <PhoneIcon sx={{ color: 'green', fontSize: 40 }} />;
      case 'verifying':
        return <HourglassEmptyIcon sx={{ color: 'purple', fontSize: 40 }} />;
      case 'ended':
        return status.verified ? 
          <CheckCircleIcon sx={{ color: 'green', fontSize: 40 }} /> : 
          <CallEndIcon sx={{ color: 'gray', fontSize: 40 }} />;
      case 'error':
        return <ErrorIcon sx={{ color: 'red', fontSize: 40 }} />;
      default:
        return null;
    }
  };

  const getStatusMessage = () => {
    if (!status) return '';
    
    switch (status.status) {
      case 'initiated':
        return 'Call is being initiated...';
      case 'ringing':
        return 'Phone is ringing...';
      case 'in-progress':
        return 'Call in progress...';
      case 'verifying':
        return 'Verifying patient responses...';
      case 'ended':
        return status.verified ? 
          'Verification successful! Patient identity confirmed.' : 
          'Call ended. Patient could not be verified.';
      case 'error':
        return `Error: ${status.message || 'Unknown error during verification'}`;
      default:
        return 'Unknown status';
    }
  };

  return (
    <Card sx={{ p: 3, mb: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        Patient Verification Call
      </Typography>
      
      <Alert severity="info" sx={{ mb: 2 }}>
        <Typography variant="body2" gutterBottom>
          This system will automatically initiate a verification call to the patient.
        </Typography>
        <Typography variant="body2" fontWeight="medium">
          The call will automatically end after 3 minutes to ensure efficient verification.
        </Typography>
      </Alert>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {status && (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, flexDirection: 'column', gap: 2 }}>
          {getStatusIcon()}
          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
            {getStatusMessage()}
          </Typography>
          
          {callStarted && callTimer < 180 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TimerIcon color={callTimer > 150 ? "error" : "primary"} />
              <Typography variant="body2" color={callTimer > 150 ? "error.main" : "text.secondary"}>
                Time: {formatTime(callTimer)} / 3:00
                {callTimer > 150 && " (call will end soon)"}
              </Typography>
            </Box>
          )}
          
          {callTimer >= 180 && status.status !== 'ended' && (
            <Alert severity="warning" sx={{ width: '100%' }}>
              The 3-minute call limit has been reached. The call will end automatically.
            </Alert>
          )}
          
          {status.callDuration && (
            <Typography variant="body2" color="text.secondary">
              Call duration: {Math.round(status.callDuration)} seconds
            </Typography>
          )}
        </Box>
      )}
      
      <Divider sx={{ my: 2 }} />
      
      <Typography variant="subtitle2" gutterBottom>
        Verification Process:
      </Typography>
      <Typography variant="body2" paragraph>
        1. The system will call the patient at the number provided
      </Typography>
      <Typography variant="body2" paragraph>
        2. The automated assistant will verify patient identity and document information
      </Typography>
      <Typography variant="body2" paragraph>
        3. Call will automatically end after 3 minutes
      </Typography>
      <Typography variant="body2" paragraph>
        4. Call transcript will be processed to update records
      </Typography>
      
      <Divider sx={{ my: 2 }} />
      
      {!polling && (
        <>
          <Box sx={{ mb: 2 }}>
            {showPhoneInput ? (
              <TextField
                fullWidth
                label="Enter patient phone number"
                variant="outlined"
                value={customPhone}
                onChange={(e) => setCustomPhone(e.target.value)}
                placeholder="+1 555-555-5555"
                sx={{ mb: 1 }}
              />
            ) : patientPhone ? (
              <Typography variant="body2" sx={{ mb: 1 }}>
                Patient phone: {patientPhone}
              </Typography>
            ) : (
              <Typography variant="body2" color="error" sx={{ mb: 1 }}>
                No phone number available for this record
              </Typography>
            )}
            
            {!showPhoneInput && !patientPhone && (
              <Button 
                variant="outlined" 
                onClick={() => setShowPhoneInput(true)}
                sx={{ mb: 1 }}
              >
                Enter Phone Number
              </Button>
            )}
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            {(patientPhone || showPhoneInput) && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<PhoneIcon />}
                disabled={loading || (showPhoneInput && !customPhone)}
                onClick={() => handleInitiateCall(showPhoneInput)}
                sx={{ minWidth: 200 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Start Verification Call'}
              </Button>
            )}
            
            {showPhoneInput && (
              <Button
                variant="outlined"
                onClick={() => setShowPhoneInput(false)}
              >
                Cancel
              </Button>
            )}
          </Box>
        </>
      )}
      
      {polling && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
          <CircularProgress size={20} />
          <Typography variant="body2" color="text.secondary">
            Monitoring call status...
          </Typography>
        </Box>
      )}
    </Card>
  );
};

export default VerificationCall; 