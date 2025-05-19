import { useState } from 'react';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  InputAdornment,
  Typography,
  Box
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import { toast } from 'react-toastify';
import { useFetchCartQuery } from '../cart/cartApi';
import { Item } from '../../app/models/cart';
import { SelectChangeEvent } from '@mui/material';
import { Order } from '../../components/viewOrder/orderUtils'; // 

// Import saveOrderToLocalStorage from your utils file
import { saveOrderToLocalStorage } from '../../components/viewOrder/orderUtils';

interface ShippingAddress {
  hostel: string;
  landmark: string;
  city: string;
  contact: string;
  region: string;
}

export interface PaymentDetails {
  amount: number;
  email: string;
  phone: string;
  provider: string;
  reference?: string;
}

interface PaystackCheckoutProps {
  handleNext: (status: 'success' | 'failed', details: PaymentDetails) => void;
  shippingAddress: ShippingAddress;
}

const PaystackCheckout = ({ handleNext, shippingAddress }: PaystackCheckoutProps) => {
  const { data: cart } = useFetchCartQuery();

  const [form, setForm] = useState({
    email: '',
    phone: '',
    provider: 'MTN'
  });

  // Helper to convert cart items to OrderItem[]
  const mapCartItemsToOrderItems = (items: Item[]) => {
    return items.map(item => ({
      productId: item.productId,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      pictureUrl: item.pictureUrl
    }));
  };

  const subtotal =
    cart?.items.reduce((sum: number, item: Item) => sum + item.price * item.quantity, 0) ?? 0;
  const deliveryFee = subtotal > 10000 ? 0 : 500;
  const totalAmount = (subtotal + deliveryFee) / 100;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    setForm({ ...form, provider: e.target.value });
  };

  const handlePay = async () => {
    try {
      const response = await fetch('https://localhost:5001/api/payment/mobile-money', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          phone: form.phone,
          provider: form.provider,
          amount: totalAmount * 100,
          shippingAddress: shippingAddress
        })
      });

      const result = await response.json();

      const paymentDetails: PaymentDetails = {
        amount: totalAmount * 100,
        email: form.email,
        phone: form.phone,
        provider: form.provider,
        reference: result?.data?.reference || ''
      };

      localStorage.setItem('paymentDetails', JSON.stringify(paymentDetails));

      if (response.ok && result.status === true) {
        toast.success('Mobile money charge initiated!');

        // Save the order only if payment is successful
        if (cart?.items) {
          const orderItems = mapCartItemsToOrderItems(cart.items);
          const order: Order = {
  id: Date.now().toString(),
  items: orderItems, // this is your array of { productId, name, ... }
  subtotal,
  deliveryFee,
  total: subtotal + deliveryFee,
  shippingAddress,
  paymentDetails
};

saveOrderToLocalStorage(order);
        }

        handleNext('success', paymentDetails);
      } else {
        toast.error(result.message || 'Mobile money charge failed');
        handleNext('failed', paymentDetails);
      }
    } catch {
      const paymentDetails: PaymentDetails = {
        amount: totalAmount * 100,
        email: form.email,
        phone: form.phone,
        provider: form.provider
      };

      localStorage.setItem('paymentDetails', JSON.stringify(paymentDetails));

      toast.error('Error initiating mobile money payment');
      handleNext('failed', paymentDetails);
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>Shipping to:</Typography>
        <Typography variant="body2">
          {shippingAddress.hostel}, {shippingAddress.landmark}<br />
          {shippingAddress.city}, {shippingAddress.region}<br />
          Contact: {shippingAddress.contact}
        </Typography>
      </Box>

      <TextField
        label="Email"
        name="email"
        value={form.email}
        onChange={handleInputChange}
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <EmailIcon />
            </InputAdornment>
          ),
        }}
      />
      <TextField
        label="Phone Number"
        name="phone"
        value={form.phone}
        onChange={handleInputChange}
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PhoneAndroidIcon />
            </InputAdornment>
          ),
        }}
      />
      <FormControl fullWidth>
        <InputLabel>Provider</InputLabel>
        <Select
          name="provider"
          value={form.provider}
          label="Provider"
          onChange={handleSelectChange}
        >
          <MenuItem value="MTN">MTN</MenuItem>
          <MenuItem value="VODAFONE">VODAFONE</MenuItem>
          <MenuItem value="AIRTELTIGO">AIRTELTIGO</MenuItem>
        </Select>
      </FormControl>
      <Typography variant="body1">Total to be paid: GHS {totalAmount.toFixed(2)}</Typography>
      <Button variant="contained" color="primary" onClick={handlePay}>
        Pay with Mobile Money
      </Button>
    </Box>
  );
};

export default PaystackCheckout;
