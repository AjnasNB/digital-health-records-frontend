import React from 'react';
import { Button, Tooltip, Badge } from '@mui/material';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { useRouter } from 'next/navigation';

const VerificationButton = ({ recordId, verificationStatus, compact = false }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/records/${recordId}/verify`);
  };

  const getButtonColor = () => {
    if (!verificationStatus) return 'primary';
    return verificationStatus === 'verified' ? 'success' : 'primary';
  };

  const getTooltipText = () => {
    if (!verificationStatus) return 'Verify patient identity using automated call';
    return verificationStatus === 'verified' 
      ? 'Patient identity verified - View details' 
      : 'Verify patient identity using automated call';
  };

  const getBadgeContent = () => {
    if (!verificationStatus) return '';
    return verificationStatus === 'verified' ? '✓' : '?';
  };

  return (
    <Tooltip title={getTooltipText()}>
      <Badge 
        badgeContent={getBadgeContent()} 
        color={verificationStatus === 'verified' ? 'success' : 'warning'}
        invisible={!verificationStatus}
        overlap="circular"
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Button
          variant={compact ? "outlined" : "contained"}
          color={getButtonColor()}
          size={compact ? "small" : "medium"}
          startIcon={<VerifiedUserIcon />}
          onClick={handleClick}
          sx={{ 
            minWidth: compact ? 'auto' : '160px',
            px: compact ? 1 : 2
          }}
        >
          {compact ? '' : 'Verify Identity'}
        </Button>
      </Badge>
    </Tooltip>
  );
};

export default VerificationButton; 