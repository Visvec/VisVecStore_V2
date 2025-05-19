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
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h6" gutterBottom>Shipping Address</Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Hostel"
          variant="outlined"
          fullWidth
          required
          name="hostel"
          value={address.hostel}
          onChange={handleChange}
        />
        <TextField
          label="Landmark"
          variant="outlined"
          fullWidth
          required
          name="landmark"
          value={address.landmark}
          onChange={handleChange}
        />
        <TextField
          label="City"
          variant="outlined"
          fullWidth
          required
          name="city"
          value={address.city}
          onChange={handleChange}
        />
        <TextField
          label="Active Contact Number"
          variant="outlined"
          fullWidth
          required
          name="contact"
          value={address.contact}
          onChange={handleChange}
        />
        <TextField
          label="Region"
          variant="outlined"
          fullWidth
          required
          name="region"
          value={address.region}
          onChange={handleChange}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Continue to Payment
        </Button>
      </Box>
    </Box>
  );
};

export default ShippingAddressForm;
