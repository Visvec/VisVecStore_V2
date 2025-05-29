import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Divider, 
  Alert, 
  Button 
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useNavigate } from 'react-router-dom';

interface ReviewProps {
  paymentStatus: 'success' | 'failed' | 'pending';
  shippingAddress: {
    hostel: string;
    landmark: string;
    city: string;
    contact: string;
    region: string;
  };
  paymentDetails: {
    amount: number;
    email: string;
    phone: string;
    provider: string;
    reference?: string;
  };
  onTryAgain: () => void;
}

const Review: React.FC<ReviewProps> = ({ 
  paymentStatus, 
  shippingAddress, 
  paymentDetails,
  onTryAgain
}) => {
  const navigate = useNavigate();

  const handleViewOrders = () => {
    navigate('/orders');
  };

  return (
    <Box sx={{ 
      maxWidth: { xs: '90%', sm: 600 }, 
      mx: 'auto', 
      mt: 2, 
      px: { xs: 1, sm: 0 } // small padding on mobile so edges don't touch
    }}>
      {paymentStatus === 'success' && (
        <Alert 
          icon={<CheckCircleOutlineIcon fontSize="inherit" />} 
          severity="success"
          sx={{ mb: 3 }}
        >
          Payment was successful! Your order has been placed.
        </Alert>
      )}
      
      {paymentStatus === 'failed' && (
        <Alert 
          icon={<ErrorOutlineIcon fontSize="inherit" />} 
          severity="error"
          sx={{ mb: 3 }}
          action={
            <Button 
              color="inherit" 
              size="small" 
              onClick={onTryAgain}
            >
              Try Again
            </Button>
          }
        >
          Payment processing failed. Please try again.
        </Alert>
      )}
      
      {paymentStatus === 'pending' && (
        <Alert 
          severity="info"
          sx={{ mb: 3 }}
        >
          Payment is being processed. Please wait...
        </Alert>
      )}
      
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>
          Order Summary
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Shipping Information
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
            {shippingAddress.hostel}{'\n'}
            {shippingAddress.landmark}{'\n'}
            {shippingAddress.city}, {shippingAddress.region}{'\n'}
            Contact: {shippingAddress.contact}
          </Typography>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Payment Details
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, flexWrap: 'wrap' }}>
            <Typography variant="body1">Payment Method:</Typography>
            <Typography variant="body1">{paymentDetails.provider} Mobile Money</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, flexWrap: 'wrap' }}>
            <Typography variant="body1">Email:</Typography>
            <Typography variant="body1">{paymentDetails.email}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, flexWrap: 'wrap' }}>
            <Typography variant="body1">Phone:</Typography>
            <Typography variant="body1">{paymentDetails.phone}</Typography>
          </Box>
          {paymentDetails.reference && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, flexWrap: 'wrap' }}>
              <Typography variant="body1">Reference:</Typography>
              <Typography variant="body1">{paymentDetails.reference}</Typography>
            </Box>
          )}
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="h6">Total Amount:</Typography>
          <Typography variant="h6">GHS {(paymentDetails.amount / 100).toFixed(2)}</Typography>
        </Box>
      </Paper>
      
      {paymentStatus === 'success' && (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleViewOrders}
            sx={{
              width: { xs: '100%', sm: 'auto' },
              maxWidth: { sm: 200 },
              mx: { xs: 'auto', sm: 'unset' }
            }}
          >
            View My Orders
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Review;
