import React, { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import { useDispatch } from 'react-redux';
import { saveShippingAddress } from '../../redux/slices/cartSlice';

interface ShippingAddress {
  hostel: string;
  landmark: string;
  city: string;
  contact: string;
  region: string;
}

interface ShippingAddressFormProps {
  onAddressSubmit: (address: ShippingAddress) => void;
  handleNext: () => void;
}

const ShippingAddressForm: React.FC<ShippingAddressFormProps> = ({ onAddressSubmit, handleNext }) => {
  const dispatch = useDispatch();

  const [address, setAddress] = useState<ShippingAddress>({
    hostel: '',
    landmark: '',
    city: '',
    contact: '',
    region: ''
  });

  // Simple validation: checks all fields are not empty
  const validateForm = () => {
    return Object.values(address).every(field => field.trim() !== '');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      alert('Please fill all fields');
      return;
    }

    dispatch(saveShippingAddress(address));
    localStorage.setItem('shippingAddress', JSON.stringify(address));
    onAddressSubmit(address);
    handleNext();
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: { xs: '90%', sm: 480, md: 600 }, // wider on larger screens
        mx: 'auto',
        mt: 4,
        px: { xs: 2, sm: 3 }, // horizontal padding for small devices
      }}
    >
      <Typography
        variant="h6"
        gutterBottom
        sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' }, textAlign: 'center' }}
      >
        Shipping Address
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <TextField
          label="Hostel"
          variant="outlined"
          fullWidth
          required
          name="hostel"
          value={address.hostel}
          onChange={handleChange}
          inputProps={{ style: { fontSize: '1rem' } }}
        />
        <TextField
          label="Landmark"
          variant="outlined"
          fullWidth
          required
          name="landmark"
          value={address.landmark}
          onChange={handleChange}
          inputProps={{ style: { fontSize: '1rem' } }}
        />
        <TextField
          label="City"
          variant="outlined"
          fullWidth
          required
          name="city"
          value={address.city}
          onChange={handleChange}
          inputProps={{ style: { fontSize: '1rem' } }}
        />
        <TextField
          label="Active Contact Number"
          variant="outlined"
          fullWidth
          required
          name="contact"
          value={address.contact}
          onChange={handleChange}
          inputProps={{ style: { fontSize: '1rem' } }}
        />
        <TextField
          label="Region"
          variant="outlined"
          fullWidth
          required
          name="region"
          value={address.region}
          onChange={handleChange}
          inputProps={{ style: { fontSize: '1rem' } }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            mt: 2,
            fontSize: { xs: '1rem', sm: '1.125rem' },
            py: { xs: 1.5, sm: 2 },
          }}
        >
          Continue to Payment
        </Button>
      </Box>
    </Box>
  );
};

export default ShippingAddressForm;
