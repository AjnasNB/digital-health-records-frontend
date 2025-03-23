'use client';

import React from 'react';
import { Card, CardContent, CardActions, Typography, Button, Box, Chip, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ShareIcon from '@mui/icons-material/Share';
import { useRouter } from 'next/navigation';
import VerificationButton from './VerificationButton';

const HealthRecordCard = ({ record, onDelete, onShare }) => {
  const router = useRouter();
  
  // Format date to a more readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Get file type icon based on mimetype or filename
  const getRecordTypeLabel = () => {
    if (!record.fileInfo) return 'Document';
    
    const { mimetype, originalname } = record.fileInfo;
    if (mimetype) {
      if (mimetype.includes('pdf')) return 'PDF';
      if (mimetype.includes('image')) return 'Image';
      if (mimetype.includes('text')) return 'Text';
    }
    
    if (originalname) {
      const ext = originalname.split('.').pop().toLowerCase();
      if (['pdf'].includes(ext)) return 'PDF';
      if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return 'Image';
      if (['txt', 'csv', 'doc', 'docx'].includes(ext)) return 'Document';
    }
    
    return 'Document';
  };
  
  // Get color based on record type
  const getTypeColor = () => {
    const type = getRecordTypeLabel();
    switch (type) {
      case 'PDF': return 'error';
      case 'Image': return 'primary';
      case 'Text': return 'success';
      default: return 'default';
    }
  };
  
  const handleView = () => {
    router.push(`/records/${record._id}`);
  };
  
  const handleViewFull = () => {
    router.push(`/records/${record._id}/full`);
  };
  
  return (
    <Card sx={{ 
      mb: 2, 
      boxShadow: 2,
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        boxShadow: 4,
        transform: 'translateY(-2px)'
      }
    }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" component="div" noWrap sx={{ maxWidth: '80%' }}>
            {record.title || 'Untitled Record'}
          </Typography>
          <Chip 
            label={getRecordTypeLabel()} 
            color={getTypeColor()} 
            size="small" 
          />
        </Box>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          <Tooltip title="Upload date">
            <Chip 
              label={formatDate(record.createdAt)} 
              size="small" 
              variant="outlined" 
            />
          </Tooltip>
          
          {record.verificationStatus && (
            <Tooltip title={record.verificationStatus === 'verified' ? 'Identity verified' : 'Identity not verified'}>
              <Chip 
                label={record.verificationStatus === 'verified' ? 'Verified' : 'Unverified'} 
                color={record.verificationStatus === 'verified' ? 'success' : 'warning'} 
                size="small" 
              />
            </Tooltip>
          )}
          
          {record.sharedWith && record.sharedWith.length > 0 && (
            <Tooltip title={`Shared with ${record.sharedWith.length} user(s)`}>
              <Chip 
                label={`Shared (${record.sharedWith.length})`} 
                color="info" 
                size="small" 
              />
            </Tooltip>
          )}
        </Box>
        
        {record.structuredData?.summary && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {record.structuredData.summary.length > 120 
              ? `${record.structuredData.summary.substring(0, 120)}...` 
              : record.structuredData.summary}
          </Typography>
        )}
      </CardContent>
      
      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Box>
          <Button 
            startIcon={<VisibilityIcon />} 
            onClick={handleView}
            size="small"
          >
            View
          </Button>
          <Button 
            onClick={handleViewFull}
            size="small"
          >
            Full Report
          </Button>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <VerificationButton 
            recordId={record._id} 
            verificationStatus={record.verificationStatus}
            compact 
          />
          
          <Button 
            startIcon={<ShareIcon />} 
            size="small"
            onClick={() => onShare && onShare(record)}
          >
            Share
          </Button>
          
          <Button 
            startIcon={<DeleteIcon />} 
            color="error" 
            size="small"
            onClick={() => onDelete && onDelete(record._id)}
          >
            Delete
          </Button>
        </Box>
      </CardActions>
    </Card>
  );
};

export default HealthRecordCard; 