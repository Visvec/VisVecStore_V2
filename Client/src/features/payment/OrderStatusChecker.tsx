import { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { Order } from '../../components/viewOrder/orderUtils';
import { API_URLS } from '../../app/api/apiURLs';

interface OrderStatusCheckerProps {
  reference: string;
}

const OrderStatusChecker = ({ reference }: OrderStatusCheckerProps) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderStatus = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(API_URLS.getOrderStatus(reference));
        if (!response.ok) throw new Error('Could not fetch order status');
        const result = await response.json();
        setOrder(result);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || 'Error fetching order status');
        } else {
          setError('Error fetching order status');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrderStatus();
  }, [reference]);

  return (
    <Box
      sx={{
        mt: 4,
        mx: 'auto',
        maxWidth: 600,
        px: { xs: 2, sm: 3, md: 4 }, // padding responsive
      }}
    >
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
          {error}
        </Alert>
      )}

      {order && (
        <Box>
          <Typography
            variant="h6"
            sx={{
              wordBreak: 'break-word', // prevents overflow on small devices
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
              mb: 1,
            }}
          >
            Order Reference: {reference}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mt: 1,
              fontSize: { xs: '1rem', sm: '1.125rem' },
              wordBreak: 'break-word',
            }}
          >
            <strong>Status:</strong> {order.status}
          </Typography>
          {order.status === 'Paid' ? (
            <Alert
              severity="success"
              sx={{ mt: 2, fontSize: { xs: '0.9rem', sm: '1rem' }, borderRadius: 1 }}
            >
              Payment confirmed! Your order is being processed.
            </Alert>
          ) : (
            <Alert
              severity="info"
              sx={{ mt: 2, fontSize: { xs: '0.9rem', sm: '1rem' }, borderRadius: 1 }}
            >
              Payment not confirmed yet. Please wait or try again.
            </Alert>
          )}
        </Box>
      )}
    </Box>
  );
};

export default OrderStatusChecker;
