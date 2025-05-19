import { Box, Typography, Divider, List, ListItem, ListItemAvatar, Avatar, ListItemText, Button } from '@mui/material';
import { currencyFormat } from '../../lib/util';
import { useFetchCartQuery } from '../../features/cart/cartApi';
import ShippingDetails from '../viewOrder/ShippingDetails';
import PrintIcon from '@mui/icons-material/Print'; // Import the print icon

const OrderDetails = () => {
  const { data: cart } = useFetchCartQuery();

  const subtotal = cart?.items.reduce((sum, item) => sum + item.quantity * item.price, 0) ?? 0;
  const deliveryFee = subtotal > 10000 ? 0 : 500;
  const total = subtotal + deliveryFee;

  // Function to handle printing
  const handlePrint = () => {
    // Add a print-specific stylesheet to hide everything except our print section
    const style = document.createElement('style');
    style.type = 'text/css';
    style.id = 'print-style';
    
    // The CSS will hide everything except our print container and properly format it
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
    
    // Trigger browser print dialog
    window.print();
    
    // Remove the print stylesheet after printing dialog is closed
    setTimeout(() => {
      const printStyle = document.getElementById('print-style');
      if (printStyle && printStyle.parentNode) {
        printStyle.parentNode.removeChild(printStyle);
      }
    }, 1000);
  };

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
          {cart?.items.map((item) => (
            <ListItem key={item.productId} disablePadding>
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
          <Typography>{currencyFormat(subtotal)}</Typography>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Typography>Delivery Fee:</Typography>
          <Typography>{currencyFormat(deliveryFee)}</Typography>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Typography fontWeight="bold">Total:</Typography>
          <Typography fontWeight="bold">{currencyFormat(total)}</Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Show shipping details from localStorage here */}
        <ShippingDetails />
      </div>
    </Box>
  );
};

export default OrderDetails;