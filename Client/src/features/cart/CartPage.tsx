import { Box, Typography } from "@mui/material";
import { useFetchCartQuery } from "./cartApi";
import CartItem from "./CartItem";
import OrderSummary from "../../app/shared/components/OrderSummary";
import { Link } from "react-router-dom";

export default function CartPage() {
  const { data, isLoading } = useFetchCartQuery();

  if (isLoading) return <Typography>Loading cart...</Typography>;

  if (!data || data.items.length === 0) {
    return (
      <Typography variant="h5" gutterBottom>
        Your cart is empty. Start Shopping{' '}
        <Link
          to="/catalog"
          style={{
            color: '#1976d2',
            fontWeight: 500,
            textDecoration: 'none',
          }}
        >
          Now!
        </Link>
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' }, // stack on xs, row on md+
        gap: 2,
      }}
    >
      <Box
        sx={{
          flexBasis: { xs: '100%', md: '66.6667%' }, // 8/12
        }}
      >
        {data.items.map((item) => (
          <CartItem item={item} key={item.productId} />
        ))}
      </Box>

      <Box
        sx={{
          flexBasis: { xs: '100%', md: '33.3333%' }, // 4/12
        }}
      >
        <OrderSummary />
      </Box>
    </Box>
  );
}
