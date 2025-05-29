import { Box } from "@mui/material";
import ProductCard from "./ProductCard";
import { Product } from "../../app/models/product";

type Props = {
  products: Product[];
};

export default function ProductList({ products }: Props) {
  return (
    <Box
      display="flex"
      flexWrap="wrap"
      justifyContent="center"
      gap={3}
      px={{ xs: 1, sm: 2, md: 3 }}
    >
      {products.map((product) => (
        <Box
          key={product.id}
          flex="1 1 100%"         // Full width on xs
          maxWidth={{
            xs: "100%",          // 1 item per row on extra-small
            sm: "48%",           // 2 items per row on small
            md: "31%",           // 3 items per row on medium
            lg: "23%",           // 4 items per row on large
          }}
          display="flex"
          justifyContent="center"
        >
          <ProductCard product={product} />
        </Box>
      ))}
    </Box>
  );
}
