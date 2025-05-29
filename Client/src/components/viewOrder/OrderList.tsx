import { useEffect, useState } from 'react';
import { Order, deleteOrderFromLocalStorage } from '../../components/viewOrder/orderUtils';
import {
  Card,
  CardContent,
  Typography,
  Divider,
  Box,
  Button,
  Container,
} from '@mui/material';
import { Link } from 'react-router-dom';

const OrderList = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const storedOrders = localStorage.getItem('orders');
    if (storedOrders) {
      try {
        const parsed: Order[] = JSON.parse(storedOrders);
        setOrders(parsed);
      } catch (err) {
        console.error('Failed to parse stored orders:', err);
      }
    }
  }, []);

  const handleDelete = (orderId: string) => {
    const updatedOrders = orders.filter(order => order.id !== orderId);
    setOrders(updatedOrders);
    deleteOrderFromLocalStorage(orderId);
  };

  return (
    <Container maxWidth="md" sx={{ mt: { xs: 3, sm: 6 }, mb: 6 }}>
      <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
        Your Orders
      </Typography>

      {orders.length === 0 ? (
        <Box mt={4} textAlign="center" px={2}>
          <Typography variant="h6" gutterBottom>
            No orders found. Start shopping{' '}
            <Link
              to="/catalog"
              style={{
                color: '#1976d2',
                fontWeight: 500,
                textDecoration: 'none',
              }}
              onMouseOver={(e) => (e.currentTarget.style.textDecoration = 'underline')}
              onMouseOut={(e) => (e.currentTarget.style.textDecoration = 'none')}
            >
              Now!
            </Link>
            .
          </Typography>
        </Box>
      ) : (
        orders.map((order, index) => (
          <Card
            key={order.id ?? index}
            sx={{
              mb: 3,
              px: { xs: 2, sm: 3 },
              py: { xs: 2, sm: 3 },
              boxShadow: 3,
              borderRadius: 2,
            }}
          >
            <CardContent sx={{ p: 0 }}>
              <Box
                display="flex"
                flexDirection={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                px={{ xs: 1, sm: 2 }}
                pt={2}
                gap={1}
              >
                <Typography variant="h6" sx={{ wordBreak: 'break-word' }}>
                  <Link
                    to={`/order-details/${order.id}`}
                    style={{
                      color: '#1976d2',
                      textDecoration: 'none',
                      fontWeight: 500,
                      wordBreak: 'break-word',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                    onMouseOut={(e) => (e.currentTarget.style.textDecoration = 'none')}
                  >
                    Order #{order.id ?? index + 1}
                  </Link>
                </Typography>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleDelete(order.id)}
                  size="small"
                  sx={{ mt: { xs: 1, sm: 0 } }}
                >
                  Delete Order
                </Button>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Replaced Grid container and items with Box flex container */}
              <Box
                display="flex"
                flexWrap="wrap"
                px={{ xs: 1, sm: 2 }}
                gap={1}
              >
                {order.items?.map((item, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      width: { xs: '100%', sm: '50%' },
                    }}
                  >
                    <Typography
                      sx={{
                        color: '#424242',
                        fontSize: { xs: '0.9rem', sm: '1rem' },
                        wordBreak: 'break-word',
                      }}
                    >
                      {item.name} - {item.quantity} x GHS {(item.price / 100).toFixed(2)}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box px={{ xs: 1, sm: 2 }} pb={2}>
                <Typography variant="body2" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                  Subtotal: GHS {((order.subtotal ?? 0) / 100).toFixed(2)}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                  Delivery Fee: GHS {((order.deliveryFee ?? 0) / 100).toFixed(2)}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' }, fontWeight: 'bold' }}
                >
                  Total: GHS {((order.total ?? 0) / 100).toFixed(2)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))
      )}
    </Container>
  );
};

export default OrderList;
