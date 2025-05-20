import { useEffect, useState } from 'react';
import { Order, deleteOrderFromLocalStorage } from '../../components/viewOrder/orderUtils';
import {
  Card,
  CardContent,
  Typography,
  Divider,
  Grid,
  Box,
  Button,
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
    <div>
      <Typography variant="h5" gutterBottom>
        Your Orders
      </Typography>

      {orders.length === 0 ? (
        <Box mt={4}>
          <Typography variant="h5" gutterBottom>
            No orders found. Start shopping  {'    '}
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
          <Card key={order.id ?? index} sx={{ mb: 3 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">
                  <Link
                    to={`/order-details/${order.id}`}
                    style={{
                      color: '#1976d2',
                      textDecoration: 'none',
                      fontWeight: 500,
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
                >
                  Delete Order
                </Button>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                {order.items?.map((item, idx) => (
                  <Box key={idx} sx={{ width: '100%' }}>
                    <Typography sx={{ color: '#424242' }}>
                      {item.name} - {item.quantity} x GHS {(item.price / 100).toFixed(2)}
                    </Typography>
                  </Box>
                ))}
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body2">
                Subtotal: GHS {((order.subtotal ?? 0) / 100).toFixed(2)}
              </Typography>
              <Typography variant="body2">
                Delivery Fee: GHS {((order.deliveryFee ?? 0) / 100).toFixed(2)}
              </Typography>
              <Typography variant="h6">
                Total: GHS {((order.total ?? 0) / 100).toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default OrderList;
