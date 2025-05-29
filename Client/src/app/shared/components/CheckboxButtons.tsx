import { Checkbox, FormControlLabel, FormGroup, Box } from "@mui/material";
import { useEffect, useState } from "react";

type Props = {
  items: string[];
  checked: string[];
  onChange: (items: string[]) => void;
};

export default function CheckboxButtons({ items, checked, onChange }: Props) {
  const [checkedItems, setCheckedItems] = useState(checked);

  useEffect(() => {
    setCheckedItems(checked);
  }, [checked]);

  const handleToggle = (value: string) => {
    const updatedChecked = checkedItems.includes(value)
      ? checkedItems.filter((item) => item !== value)
      : [...checkedItems, value];

    setCheckedItems(updatedChecked);
    onChange(updatedChecked);
  };

  return (
    <FormGroup>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
          justifyContent: { xs: "center", sm: "flex-start" },
        }}
      >
        {items.map((item) => (
          <FormControlLabel
            key={item}
            control={
              <Checkbox
                checked={checkedItems.includes(item)}
                onClick={() => handleToggle(item)}
                color="secondary"
                sx={{
                  p: 0,
                  '& svg': { fontSize: { xs: 20, sm: 28, md: 32 } },
                }}
              />
            }
            label={item}
            sx={{
              width: { xs: "45%", sm: "auto" },
              fontSize: { xs: "0.85rem", sm: "1rem" },
              m: 0,
            }}
          />
        ))}
      </Box>
    </FormGroup>
  );
}
