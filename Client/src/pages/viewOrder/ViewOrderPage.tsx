// pages/viewOrder/ViewOrderPage.tsx
import { Box, Button, Divider, Typography } from '@mui/material';
import { useRef } from 'react';
import OrderDetails from '../../components/viewOrder/OrderDetails';
import { useReactToPrint } from 'react-to-print';
import ShippingDetails from '../../components/viewOrder/ShippingDetails';
import PaymentDetails from '../../components/viewOrder/PaymentDetails';

const ViewOrderPage = () => {
  const printRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Order Receipt
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Box ref={printRef}>
        <ShippingDetails />
        <OrderDetails />
        <PaymentDetails />
      </Box>

      <Button variant="contained" onClick={handlePrint} sx={{ mt: 3 }}>
        Print Receipt
      </Button>
    </Box>
  );
};

export default ViewOrderPage;
