import { Box, Typography } from '@mui/material';

const PaymentDetails = () => {
  const payment = JSON.parse(localStorage.getItem('paymentDetails') || '{}');

  return (
    <Box sx={{ mb: 3, px: { xs: 1, sm: 2 }, py: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
      <Typography variant="h6" gutterBottom>
        Payment Details
      </Typography>
      <Typography
        component="div"
        sx={{ 
          fontSize: { xs: '0.9rem', sm: '1rem' }, 
          lineHeight: 1.5,
          wordBreak: 'break-word',
        }}
      >
        <div>Email: {payment.email || 'N/A'}</div>
        <div>Phone: {payment.phone || 'N/A'}</div>
        <div>Provider: {payment.provider || 'N/A'}</div>
        <div>Reference: {payment.reference || 'N/A'}</div>
      </Typography>
    </Box>
  );
};

export default PaymentDetails;
