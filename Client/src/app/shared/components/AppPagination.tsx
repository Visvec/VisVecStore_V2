import { Box, Pagination, Typography } from "@mui/material";
import { Pagination as PaginationType } from "../../models/pagination";

type Props = {
  metadata: PaginationType;
  onPageChange: (page: number) => void;
};

export default function AppPagination({ metadata, onPageChange }: Props) {
  const { currentPage, totalPages, pageSize, totalCount } = metadata;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  return (
    <Box
      display="flex"
      flexDirection={{ xs: "column", sm: "row" }}
      justifyContent="space-between"
      alignItems="center"
      mt={3}
      gap={1}
    >
      <Typography
        sx={{ textAlign: { xs: "center", sm: "left" }, width: { xs: "100%", sm: "auto" } }}
      >
        Displaying {startItem}-{endItem} of {totalCount} items
      </Typography>
      <Pagination
        color="secondary"
        size="large"
        count={totalPages}
        page={currentPage}
        onChange={(_, page) => onPageChange(page)}
        sx={{ mx: { xs: "auto", sm: 0 } }}
      />
    </Box>
  );
}
