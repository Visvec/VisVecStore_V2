// components/viewOrder/ShippingDetails.tsx
import { Box, Typography } from '@mui/material';

const ShippingDetails = () => {
  const shippingAddress = JSON.parse(localStorage.getItem('shippingAddress') || '{}');

  return (
    <Box sx={{ mb: 3 }}>
        {/* Change it to Shipping Details in the future */}
      <Typography variant="h6">Delivery Details</Typography> 
      <Typography>
        {shippingAddress.hostel}, {shippingAddress.landmark}, {shippingAddress.city}, {shippingAddress.region}
        <br />
        Contact: {shippingAddress.contact}
      </Typography>
    </Box>
  );
};

export default ShippingDetails;
