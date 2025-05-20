import { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { Order } from '../../components/viewOrder/orderUtils';

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
        const response = await fetch(`https://localhost:5001/api/orders/status/${reference}`);
        if (!response.ok) throw new Error('Could not fetch order status');
        const result = await response.json();
        setOrder(result);
      } catch (err: unknown) {
  if (err instanceof Error) {
    setError(err.message || 'Error fetching order status');
  } else {
    setError('Error fetching order status');
  }
}finally {
        setLoading(false);
      }
    };

    fetchOrderStatus();
  }, [reference]);

  return (
    <Box sx={{ mt: 4 }}>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      {order && (
        <Box>
          <Typography variant="h6">Order Reference: {reference}</Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            <strong>Status:</strong> {order.status}
          </Typography>
          {order.status === 'Paid' ? (
            <Alert severity="success" sx={{ mt: 2 }}>
              Payment confirmed! Your order is being processed.
            </Alert>
          ) : (
            <Alert severity="info" sx={{ mt: 2 }}>
              Payment not confirmed yet. Please wait or try again.
            </Alert>
          )}
        </Box>
      )}
    </Box>
  );
};

export default OrderStatusChecker;
