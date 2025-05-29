import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { Product } from "../../app/models/product";
import { Link } from "react-router-dom";
import { useAddCartItemMutation } from "../cart/cartApi";
import { currencyFormat } from "../../lib/util";

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  const [addCartItem, { isLoading }] = useAddCartItemMutation();

  return (
    <Card
      elevation={3}
      sx={{
        width: {
          xs: "100%",       // full width on extra-small screens
          sm: 300,          // slightly larger on small screens
          md: 280,          // fixed size on medium and up
        },
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        m: 1,               // margin for spacing in a responsive grid
      }}
    >
      <CardMedia
        component="img"
        sx={{
          height: {
            xs: 200,
            sm: 220,
            md: 240,
          },
          objectFit: "cover",
        }}
        image={product.pictureUrl}
        title={product.name}
      />
      <CardContent>
        <Typography
          gutterBottom
          sx={{ textTransform: "uppercase" }}
          variant="subtitle2"
        >
          {product.name}
        </Typography>
        <Typography variant="h6" sx={{ color: "secondary.main" }}>
          {currencyFormat(product.price)}
        </Typography>
      </CardContent>
      <CardActions
        sx={{
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1,
          px: 2,
          pb: 2,
        }}
      >
        <Button
          disabled={isLoading}
          onClick={() => addCartItem({ product, quantity: 1 })}
          variant="contained"
          size="small"
        >
          Add to cart
        </Button>
        <Button
          component={Link}
          to={`/catalog/${product.id}`}
          variant="outlined"
          size="small"
        >
          View
        </Button>
      </CardActions>
    </Card>
  );
}
