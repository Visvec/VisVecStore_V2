import React, { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import { useDispatch } from 'react-redux';
import { saveShippingAddress } from '../../redux/slices/cartSlice';

export interface ShippingAddress {
  hostel: string;
  landmark: string;
  city: string;
  contact: string;
  region: string;
}

interface ShippingAddressFormProps {
  onAddressSubmit: (address: ShippingAddress) => void;
}

const ShippingAddressForm: React.FC<ShippingAddressFormProps> = ({ onAddressSubmit }) => {
  const dispatch = useDispatch();

  const [address, setAddress] = useState<ShippingAddress>({
    hostel: '',
    landmark: '',
    city: '',
    contact: '',
    region: '',
  });

  const addressFields: (keyof ShippingAddress)[] = [
    'hostel',
    'landmark',
    'city',
    'contact',
    'region',
  ];

  const validateForm = () => {
    return Object.values(address).every(field => field.trim() !== '');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress(prevState => ({
      ...prevState,
      [name]: value,
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
  };

  const getLabel = (field: keyof ShippingAddress): string => {
    const labels: Record<keyof ShippingAddress, string> = {
      hostel: 'Hostel',
      landmark: 'Landmark',
      city: 'City',
      contact: 'Active Contact Number',
      region: 'Region',
    };
    return labels[field];
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: { xs: '90%', sm: 480 },
        mx: 'auto',
        mt: 4,
        px: { xs: 2, sm: 3 },
      }}
    >
      <Typography
        variant="h6"
        gutterBottom
        sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' }, textAlign: 'center' }}
      >
        Shipping Address
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {addressFields.map((field) => (
          <TextField
            key={field}
            label={getLabel(field)}
            variant="outlined"
            fullWidth
            required
            name={field}
            value={address[field]}
            onChange={handleChange}
            inputProps={{ style: { fontSize: '1rem' } }}
          />
        ))}

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
