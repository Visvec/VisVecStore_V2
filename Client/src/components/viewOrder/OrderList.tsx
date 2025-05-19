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
    // Remove order from state
    const updatedOrders = orders.filter(order => order.id !== orderId);
    setOrders(updatedOrders);

    // Remove order from localStorage
    deleteOrderFromLocalStorage(orderId);
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Your Orders
      </Typography>
      {orders.map((order, index) => (
        <Card key={order.id ?? index} sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6">Order #{order.id ?? index + 1}</Typography>

            <Button
              variant="outlined"
              color="error"
              onClick={() => handleDelete(order.id)}
              sx={{ float: 'right', mb: 1 }}
            >
              Delete Order
            </Button>
        
            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2}>
              {order.items?.map((item, idx) => (
                <Box key={idx} sx={{ width: '100%' }}>
                  <Typography>
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
      ))}
    </div>
  );
};

export default OrderList;
