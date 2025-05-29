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
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        maxWidth: 'lg',
        mx: 'auto',
        width: '100%',
      }}
    >
      <Typography variant="h5" gutterBottom>
        Order Receipt
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Box
        ref={printRef}
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 2, md: 4 },
          // Ensure children stretch full width on small screens and share space on larger screens
          '& > *': {
            flex: { xs: 'unset', md: 1 },
            width: { xs: '100%', md: 'auto' },
          },
        }}
      >
        <ShippingDetails />
        <OrderDetails />
        <PaymentDetails />
      </Box>

      <Button
        variant="contained"
        onClick={handlePrint}
        sx={{ mt: 3, width: { xs: '100%', sm: 'auto' } }}
      >
        Print Receipt
      </Button>
    </Box>
  );
};

export default ViewOrderPage;
