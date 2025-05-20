import { Grid, Typography } from "@mui/material";
import { useFetchCartQuery } from "./cartApi"
import CartItem from "./CartItem";
import OrderSummary from "../../app/shared/components/OrderSummary";
import { Link } from "react-router-dom";

export default function CartPage() {
  const { data, isLoading } = useFetchCartQuery();

  if (isLoading) return <Typography> Loading cart...</Typography>

  if (!data || data.items.length === 0) {
    return (
    <Typography variant="h5" gutterBottom>
       Your cart is empty. Start Shopping{' '}
       <Link to = '/catalog' style={{
                color: '#1976d2',
                fontWeight: 500,
                textDecoration: 'none',
              }} >
          Now!
       </Link>
       </Typography>
  );
}

  return (
    <Grid container spacing={2}>
      <Grid size={8}>
        {data.items.map(item => (
          <CartItem item={item} key={item.productId} />
        ))}
      </Grid>
      <Grid size={4}>
          <OrderSummary />
      </Grid>
    </Grid>
  )
}