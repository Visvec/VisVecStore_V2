// components/viewOrder/PaymentDetails.tsx
import { Box, Typography } from '@mui/material';

const PaymentDetails = () => {
  const payment = JSON.parse(localStorage.getItem('paymentDetails') || '{}');

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6">Payment Details</Typography>
      <Typography>
        Email: {payment.email} <br />
        Phone: {payment.phone} <br />
        Provider: {payment.provider} <br />
        Reference: {payment.reference || 'N/A'}
      </Typography>
    </Box>
  );
};

export default PaymentDetails;
