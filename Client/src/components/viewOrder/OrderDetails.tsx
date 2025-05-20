import {
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Button
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ShippingDetails from '../viewOrder/ShippingDetails';
import PrintIcon from '@mui/icons-material/Print';
import { Order } from './orderUtils';
import { currencyFormat } from '../../lib/util';

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const storedOrders = localStorage.getItem('orders');
    if (storedOrders) {
      try {
        const parsed: Order[] = JSON.parse(storedOrders);
        const found = parsed.find(o => o.id === orderId);
        setOrder(found ?? null);
      } catch (err) {
        console.error('Error parsing stored orders:', err);
      }
    }
  }, [orderId]);

  const handlePrint = () => {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.id = 'print-style';
    const css = `
      @media print {
        body * {
          visibility: hidden;
        }
        #order-details-print, #order-details-print * {
          visibility: visible;
        }
        #order-details-print {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          padding: 20px;
        }
        @page {
          size: auto;
          margin: 20mm;
        }
      }
    `;
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
    window.print();
    setTimeout(() => {
      const printStyle = document.getElementById('print-style');
      if (printStyle && printStyle.parentNode) {
        printStyle.parentNode.removeChild(printStyle);
      }
    }, 1000);
  };

  if (!order) {
    return <Typography>Order not found.</Typography>;
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Order Summary</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<PrintIcon />}
          onClick={handlePrint}
          sx={{ ml: 2 }}
        >
          Print Order
        </Button>
      </Box>

      <div id="order-details-print">
        <Divider sx={{ my: 1 }} />

        <List>
          {order.items?.map((item, idx) => (
            <ListItem key={idx} disablePadding>
              <ListItemAvatar>
                <Avatar
                  variant="square"
                  src={item.pictureUrl}
                  alt={item.name}
                  sx={{ width: 56, height: 56, mr: 2 }}
                />
              </ListItemAvatar>
              <ListItemText
                primary={item.name}
                secondary={`Quantity: ${item.quantity}`}
              />
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 1 }} />
        <Box display="flex" justifyContent="space-between">
          <Typography>Subtotal:</Typography>
          <Typography>{currencyFormat(order.subtotal ?? 0)}</Typography>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Typography>Delivery Fee:</Typography>
          <Typography>{currencyFormat(order.deliveryFee ?? 0)}</Typography>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Typography fontWeight="bold">Total:</Typography>
          <Typography fontWeight="bold">{currencyFormat(order.total ?? 0)}</Typography>
        </Box>

        <Divider sx={{ my: 2 }} />
        <ShippingDetails />
      </div>
    </Box>
  );
};

export default OrderDetails;
