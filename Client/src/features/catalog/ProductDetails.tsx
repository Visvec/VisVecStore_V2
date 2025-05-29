import { useParams } from "react-router-dom";
import {
  Box,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import {
  useAddCartItemMutation,
  useFetchCartQuery,
  useRemoveCartItemMutation,
} from "../cart/cartApi";
import { useFetchProductDetailsQuery } from "./catalogApi";
import { ChangeEvent, useEffect, useState } from "react";

export default function ProductDetails() {
  const { id } = useParams();
  const [removeCartItem] = useRemoveCartItemMutation();
  const [addCartItem] = useAddCartItemMutation();
  const { data: cart } = useFetchCartQuery();
  const item = cart?.items.find((x) => x.productId === +id!);
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    if (item) setQuantity(item.quantity);
  }, [item]);

  const { data: product, isLoading } = useFetchProductDetailsQuery(id ? +id : 0);
  if (!product || isLoading) return <div>Loading...</div>;

  const handleUpdateCart = () => {
    const updatedQuantity = item ? Math.abs(quantity - item.quantity) : quantity;
    if (!item || quantity > item.quantity) {
      addCartItem({ product, quantity: updatedQuantity });
    } else {
      removeCartItem({ productId: product.id, quantity: updatedQuantity });
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = +event.currentTarget.value;
    if (value >= 0) setQuantity(value);
  };

  const productDetails = [
    { label: "Name", value: product.name },
    { label: "Description", value: product.description },
    { label: "Type", value: product.type },
    { label: "Brand", value: product.brand },
    { label: "Quantity in stock", value: product.quantityInStock },
  ];

  return (
    <Box
      maxWidth="lg"
      mx="auto"
      display="flex"
      flexDirection={{ xs: "column", md: "row" }}
      gap={6}
      px={2}
      py={4}
    >
      {/* Left Image Section */}
      <Box flex={1}>
        <img
          src={product.pictureUrl}
          alt={product.name}
          style={{ width: "100%", borderRadius: 8, objectFit: "contain" }}
        />
      </Box>

      {/* Right Details Section */}
      <Box flex={1} display="flex" flexDirection="column">
        <Typography variant="h3" component="h1" gutterBottom>
          {product.name}
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Typography variant="h4" color="secondary" gutterBottom>
          GH₵ {(product.price / 100).toFixed(2)}
        </Typography>

        <TableContainer>
          <Table
            sx={{
              "& td": { fontSize: "1rem" },
              mb: 3,
            }}
            aria-label="product details"
          >
            <TableBody>
              {productDetails.map((detail, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ fontWeight: "bold", width: "40%" }}>
                    {detail.label}
                  </TableCell>
                  <TableCell>{detail.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Quantity and Button Row */}
        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          gap={2}
          mt={3}
          alignItems="center"
        >
          <Box flex={1}>
            <TextField
              variant="outlined"
              type="number"
              label="Quantity in cart"
              fullWidth
              value={quantity}
              onChange={handleInputChange}
              inputProps={{ min: 0 }}
            />
          </Box>

          <Box flex={1}>
            <Button
              onClick={handleUpdateCart}
              disabled={quantity === item?.quantity || (!item && quantity === 0)}
              sx={{ height: "55px" }}
              color="primary"
              size="large"
              variant="contained"
              fullWidth
            >
              {item ? "Update quantity" : "Add to Cart"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
