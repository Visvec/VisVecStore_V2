import { Box, IconButton, Paper, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Item } from "../../app/models/cart";
import { Add, Close, Remove } from "@mui/icons-material";
import { useAddCartItemMutation, useRemoveCartItemMutation } from "./cartApi";
import { currencyFormat } from "../../lib/util";

type Props = {
  item: Item;
};

export default function CartItem({ item }: Props) {
  const [removeCartItem] = useRemoveCartItemMutation();
  const [addCartItem] = useAddCartItemMutation();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Paper sx={{ borderRadius: 3, p: 2, mb: 2 }}>
      <Box
        display="flex"
        flexDirection={isMobile ? "column" : "row"}
        alignItems={isMobile ? "flex-start" : "center"}
        justifyContent="space-between"
        gap={2}
      >
        {/* Left Section: Image and Details */}
        <Box display="flex" flexDirection={isMobile ? "column" : "row"} gap={2}>
          <Box
            component="img"
            src={item.pictureUrl}
            alt={item.name}
            sx={{
              width: 100,
              height: 100,
              objectFit: "cover",
              borderRadius: 2,
            }}
          />

          <Box display="flex" flexDirection="column" gap={1}>
            <Typography variant="h6">{item.name}</Typography>

            <Box display="flex" flexDirection={isMobile ? "column" : "row"} gap={2}>
              <Typography sx={{ fontSize: "1.1rem" }}>
                {currencyFormat(item.price)} x {item.quantity}
              </Typography>
              <Typography sx={{ fontSize: "1.1rem" }} color="primary">
                {currencyFormat(item.price * item.quantity)}
              </Typography>
            </Box>

            <Box display="flex" alignItems="center" gap={1}>
              <IconButton
                onClick={() =>
                  removeCartItem({ productId: item.productId, quantity: 1 })
                }
                color="error"
                size="small"
                sx={{ border: 1, borderRadius: 1 }}
              >
                <Remove />
              </IconButton>
              <Typography variant="h6">{item.quantity}</Typography>
              <IconButton
                onClick={() => addCartItem({ product: item, quantity: 1 })}
                color="success"
                size="small"
                sx={{ border: 1, borderRadius: 1 }}
              >
                <Add />
              </IconButton>
            </Box>
          </Box>
        </Box>

        {/* Right Section: Remove Entire Item */}
        <IconButton
          onClick={() =>
            removeCartItem({ productId: item.productId, quantity: item.quantity })
          }
          color="error"
          size="small"
          sx={{
            border: 1,
            borderRadius: 1,
            alignSelf: isMobile ? "flex-end" : "flex-start",
          }}
        >
          <Close />
        </IconButton>
      </Box>
    </Paper>
  );
}
