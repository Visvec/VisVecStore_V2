import {
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Button,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ShippingDetails from "../viewOrder/ShippingDetails";
import PrintIcon from "@mui/icons-material/Print";
import { Order } from "./orderUtils";
import { currencyFormat } from "../../lib/util";

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const storedOrders = localStorage.getItem("orders");
    if (storedOrders) {
      try {
        const parsed: Order[] = JSON.parse(storedOrders);
        const found = parsed.find((o) => o.id === orderId);
        setOrder(found ?? null);
      } catch (err) {
        console.error("Error parsing stored orders:", err);
      }
    }
  }, [orderId]);

  const handlePrint = () => {
    const style = document.createElement("style");
    style.type = "text/css";
    style.id = "print-style";
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
      const printStyle = document.getElementById("print-style");
      if (printStyle && printStyle.parentNode) {
        printStyle.parentNode.removeChild(printStyle);
      }
    }, 1000);
  };

  if (!order) {
    return <Typography>Order not found.</Typography>;
  }

  return (
    <Box sx={{ mb: 3, px: { xs: 2, sm: 3, md: 6 }, py: { xs: 2, sm: 3 } }}>
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        mb={2}
        gap={2}
      >
        <Typography variant="h6" component="h2">
          Order Summary
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<PrintIcon />}
          onClick={handlePrint}
          sx={{ whiteSpace: "nowrap" }}
        >
          Print Order
        </Button>
      </Box>

      <div id="order-details-print">
        <Divider sx={{ my: 1 }} />

        <List sx={{ p: 0 }}>
          {order.items?.map((item, idx) => (
            <ListItem
              key={idx}
              disablePadding
              sx={{
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "flex-start", sm: "center" },
                py: 1,
              }}
            >
              <ListItemAvatar sx={{ minWidth: 56, mb: { xs: 1, sm: 0 } }}>
                <Avatar
                  variant="square"
                  src={item.pictureUrl}
                  alt={item.name}
                  sx={{ width: 56, height: 56, mr: { sm: 2 }, mb: { xs: 0 } }}
                />
              </ListItemAvatar>
              <ListItemText
                primary={item.name}
                secondary={`Quantity: ${item.quantity}`}
                sx={{ textAlign: { xs: "left", sm: "left" }, ml: { xs: 0, sm: 0 } }}
              />
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 1 }} />
        <Box
          display="flex"
          flexDirection="column"
          gap={1}
          maxWidth={400}
          mx="auto"
          sx={{ width: "100%" }}
        >
          <Box display="flex" justifyContent="space-between">
            <Typography>Subtotal:</Typography>
            <Typography>{currencyFormat(order.subtotal ?? 0)}</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Typography>Delivery Fee:</Typography>
            <Typography>{currencyFormat(order.deliveryFee ?? 0)}</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" fontWeight="bold">
            <Typography>Total:</Typography>
            <Typography>{currencyFormat(order.total ?? 0)}</Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />
        <ShippingDetails />
      </div>
    </Box>
  );
};

export default OrderDetails;
