import { Box, IconButton, TextField} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/store/store";
import { setSearchTerm } from "./catalogSlice";
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";

export default function Search() {
    const {searchTerm} = useAppSelector(state => state.catalog);
    const dispatch = useAppDispatch();
    const [term, setTerm] = useState(searchTerm);

    useEffect(() => {
        setTerm(searchTerm)

    }, [searchTerm]);

  const handleSearch = () => {
    dispatch(setSearchTerm(term));
  };

    return (
        <Box display = "flex" alignItems = "center" gap={1}>
        <TextField
            label='Search products'
            variant="outlined"
            fullWidth
            type = "search"
            value = {term}
            onChange={e => setTerm(e.target.value)}
        />
        <IconButton onClick={handleSearch} color="primary" sx={{ height: '56px' }}>
        <SearchIcon />
            </IconButton>
        </Box>
    )
}