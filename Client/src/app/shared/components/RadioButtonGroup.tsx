import { FormControl, FormControlLabel, Radio, RadioGroup, useTheme, useMediaQuery } from "@mui/material";
import { ChangeEvent } from "react";

type Props = {
  options: { value: string; label: string }[];
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  selectedValue: string;
};

export default function RadioButtonGroup({ options, onChange, selectedValue }: Props) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm')); // true on small devices

  return (
    <FormControl
      fullWidth
      sx={{
        // optional maxWidth for larger screens
        maxWidth: 400,
        mx: 'auto',
        px: 1,
      }}
    >
      <RadioGroup
        onChange={onChange}
        value={selectedValue}
        row={!isSmallScreen} // row on medium+ screens, column on small
        sx={{
          my: 0,
          gap: isSmallScreen ? 1 : 3, // spacing between radios
          flexWrap: 'wrap',
        }}
      >
        {options.map(({ value, label }) => (
          <FormControlLabel
            key={label}
            control={<Radio color="secondary" sx={{ py: 0.7 }} />}
            label={label}
            value={value}
            sx={{
              flexBasis: isSmallScreen ? '100%' : 'auto', // full width on small screens
              '& .MuiFormControlLabel-label': {
                fontSize: isSmallScreen ? '1rem' : 'inherit',
              },
            }}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}
