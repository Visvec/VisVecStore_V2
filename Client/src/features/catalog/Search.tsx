import { Box, IconButton, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/store/store";
import { setSearchTerm } from "./catalogSlice";
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";

export default function Search() {
  const { searchTerm } = useAppSelector(state => state.catalog);
  const dispatch = useAppDispatch();
  const [term, setTerm] = useState(searchTerm);

  useEffect(() => {
    setTerm(searchTerm);
  }, [searchTerm]);

  const handleSearch = () => {
    dispatch(setSearchTerm(term));
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      gap={1}
      sx={{
        flexDirection: { xs: "column", sm: "row" }, // stack on xs, row on sm+
        width: "100%",
        px: { xs: 1, sm: 0 }, // horizontal padding on small screens
      }}
    >
      <TextField
        label="Search products"
        variant="outlined"
        fullWidth
        type="search"
        value={term}
        onChange={e => setTerm(e.target.value)}
        sx={{
          width: { xs: "100%", sm: "auto" }, // full width on xs, auto on sm+
        }}
        onKeyDown={e => {
          if (e.key === "Enter") handleSearch();
        }}
      />
      <IconButton
        onClick={handleSearch}
        color="primary"
        sx={{
          height: 56,
          width: { xs: "100%", sm: "56px" }, // full width button on mobile, fixed width on larger
          mt: { xs: 1, sm: 0 }, // margin top on mobile for spacing
        }}
        aria-label="search"
      >
        <SearchIcon />
      </IconButton>
    </Box>
  );
}
