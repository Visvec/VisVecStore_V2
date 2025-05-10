import React, { useState } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import Box from '@mui/material/Box';

interface ShippingAddressFormProps {
  onAddressSubmit: (address: {
    hostel: string;
    landmark: string;
    city: string;
    contact: string;
    region: string;
  }) => void;
}

const ShippingAddressForm: React.FC<ShippingAddressFormProps> = ({ onAddressSubmit }) => {
  const [address, setAddress] = useState({
    hostel: '',
    landmark: '',
    city: '',
    contact: '',
    region: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Instead of making the API call here, we pass the address up to the parent
    onAddressSubmit(address);
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