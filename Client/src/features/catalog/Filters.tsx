import { Box, Button, Paper, useMediaQuery, useTheme } from "@mui/material";
import Search from "./Search";
import RadioButtonGroup from "../../app/shared/components/RadioButtonGroup";
import { useAppDispatch, useAppSelector } from "../../app/store/store";
import { resetParams, setBrands, setOderBy, setTypes } from "./catalogSlice";
import CheckboxButtons from "../../app/shared/components/CheckboxButtons";

const sortOptions = [
  { value: 'name', label: 'Alphabetical' },
  { value: 'priceDesc', label: 'Price: High to low' },
  { value: 'price', label: 'Price: Low to high' }
];

type Props = {
  filtersData: { brands: string[]; types: string[]; };
};

export default function Filters({ filtersData: data }: Props) {
  const { orderBy, types, brands } = useAppSelector(state => state.catalog);
  const dispatch = useAppDispatch();

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={3}
      sx={{
        width: '100%',
        maxWidth: isSmallScreen ? '100%' : 300,  // Limit sidebar width on larger screens
        px: { xs: 1, sm: 2 },                    // Responsive horizontal padding
      }}
    >
      <Paper sx={{ p: { xs: 1.5, sm: 3 } }}>
        <Search />
      </Paper>

      <Paper sx={{ p: { xs: 1.5, sm: 3 } }}>
        <RadioButtonGroup
          selectedValue={orderBy}
          options={sortOptions}
          onChange={e => dispatch(setOderBy(e.target.value))}
        />
      </Paper>

      <Paper sx={{ p: { xs: 1.5, sm: 3 } }}>
        <CheckboxButtons
          items={data.brands}
          checked={brands}
          onChange={(items: string[]) => dispatch(setBrands(items))}
        />
      </Paper>

      <Paper sx={{ p: { xs: 1.5, sm: 3 } }}>
        <CheckboxButtons
          items={data.types}
          checked={types}
          onChange={(items: string[]) => dispatch(setTypes(items))}
        />
      </Paper>

      <Button
        variant="outlined"
        color="secondary"
        onClick={() => dispatch(resetParams())}
        fullWidth
        sx={{ mt: 1 }}
      >
        Reset Filters
      </Button>
    </Box>
  );
}
