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
    <Typography variant="h3">
       Your cart is empty.{' '}
       <Link to = '/catalog' style = {{ fontStyle: 'italic', fontSize: '0.8em', color: 'blue'}} >
          Continue shopping
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