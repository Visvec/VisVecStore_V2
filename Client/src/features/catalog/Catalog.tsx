import { Box, Typography } from "@mui/material";
import ProductList from "./ProductList";
import { useFetchFiltersQuery, useFetchProductsQuery } from "./catalogApi";
import Filters from "./Filters";
import { useAppDispatch, useAppSelector } from "../../app/store/store";
import AppPagination from "../../app/shared/components/AppPagination";
import { setPageNumber } from "./catalogSlice";

export default function Catalog() {
  const productParams = useAppSelector(state => state.catalog);
  const { data, isLoading } = useFetchProductsQuery(productParams);
  const { data: filtersData, isLoading: filtersLoading } = useFetchFiltersQuery();
  const dispatch = useAppDispatch();

  if (isLoading || !data || filtersLoading || !filtersData) return <div>Loading...</div>;

  return (
    <Box
      display="grid"
      gap={4}
      sx={{
        gridTemplateColumns: {
          xs: '1fr',     // 1 column on extra small screens
          md: '1fr 3fr'  // 2 columns (1:3 ratio) on medium and up
        }
      }}
    >
      {/* Sidebar Filters */}
      <Box>
        <Filters filtersData={filtersData} />
      </Box>

      {/* Product List + Pagination */}
      <Box>
        {data.items && data.items.length > 0 ? (
          <>
            <ProductList products={data.items} />
            <AppPagination
              metadata={data.pagination}
              onPageChange={(page: number) => {
                dispatch(setPageNumber(page));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </>
        ) : (
          <Typography variant="h5">There are no results for this filter</Typography>
        )}
      </Box>
    </Box>
  );
}
