import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';

const ShippingDetails = () => {
  const shippingAddress = JSON.parse(localStorage.getItem('shippingAddress') || '{}');

  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        mb: 3,
        p: { xs: 2, sm: 3 },
        borderRadius: 2,
        boxShadow: 1,
        maxWidth: 600,
        mx: 'auto',
        bgcolor: 'background.paper',
        wordBreak: 'break-word',
      }}
    >
      <Typography variant="h6" mb={2} textAlign={isSmDown ? 'center' : 'left'}>
        Delivery Details
      </Typography>

      <Typography
        variant="body1"
        sx={{ fontSize: { xs: '0.9rem', sm: '1rem' }, lineHeight: 1.5, textAlign: isSmDown ? 'center' : 'left' }}
      >
        {shippingAddress.hostel || '-'}, {shippingAddress.landmark || '-'}, {shippingAddress.city || '-'}, {shippingAddress.region || '-'}
        <br />
        Contact: {shippingAddress.contact || '-'}
      </Typography>
    </Box>
  );
};

export default ShippingDetails;
