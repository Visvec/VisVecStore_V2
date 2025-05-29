import { Box, Typography, Divider, Button, TextField, Paper } from "@mui/material";
import { currencyFormat } from "../../../lib/util";
import { useFetchCartQuery } from "../../../features/cart/cartApi";
import { Item } from "../../models/cart";
import { Link, useLocation } from "react-router-dom";

export default function OrderSummary() {
  const { data: cart } = useFetchCartQuery();
  const subtotal = cart?.items.reduce((sum: number, item: Item) => sum + item.quantity * item.price, 0) ?? 0;
  const deliveryFee = subtotal > 10000 ? 0 : 500;
  const location = useLocation();

  return (
    <Box
      display="flex"
      flexDirection={{ xs: "column", md: "row" }}
      alignItems="flex-start"
      justifyContent="center"
      maxWidth="lg"
      mx="auto"
      gap={{ xs: 2, md: 4 }}
      px={{ xs: 2, sm: 3, md: 0 }}
      py={3}
      width="100%"
    >
      {/* Order Summary Section */}
      <Paper
        sx={{
          p: 3,
          borderRadius: 3,
          width: { xs: "100%", md: "50%" },
          boxSizing: "border-box",
        }}
        elevation={3}
      >
        <Typography variant="h6" component="p" fontWeight="bold" mb={1}>
          Order summary
        </Typography>
        <Typography variant="body2" sx={{ fontStyle: "italic", mb: 2 }}>
          Orders over GH₵100 qualify for free delivery!
        </Typography>
        <Box>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography color="textSecondary">Subtotal</Typography>
            <Typography>{currencyFormat(subtotal)}</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography color="textSecondary">Discount</Typography>
            <Typography color="success.main">-GH₵0.00</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography color="textSecondary">Delivery fee</Typography>
            <Typography>{currencyFormat(deliveryFee)}</Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box display="flex" justifyContent="space-between" mb={1} fontWeight="bold">
            <Typography>Total</Typography>
            <Typography>{currencyFormat(subtotal + deliveryFee)}</Typography>
          </Box>
        </Box>

        <Box mt={3}>
          {!location.pathname.includes("checkout") && (
            <Button
              component={Link}
              to="/checkout"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mb: 1 }}
            >
              Checkout
            </Button>
          )}
          <Button component={Link} to="/catalog" fullWidth>
            Continue Shopping
          </Button>
        </Box>
      </Paper>

      {/* Coupon Code Section */}
      <Paper
        sx={{
          p: 3,
          borderRadius: 3,
          width: { xs: "100%", md: "40%" },
          boxSizing: "border-box",
          alignSelf: { md: "flex-start" },
        }}
        elevation={3}
      >
        <form>
          <Typography variant="subtitle1" component="label" htmlFor="voucher-code" sx={{ display: "block", mb: 1 }}>
            Do you have a voucher code?
          </Typography>

          <TextField
            id="voucher-code"
            label="Voucher code"
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
          />

          <Button type="submit" variant="contained" color="primary" fullWidth>
            Apply code
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
