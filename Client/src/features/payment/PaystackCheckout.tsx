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
  Box,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import { toast } from 'react-toastify';
import { useFetchCartQuery, useRemoveCartItemMutation } from '../cart/cartApi';
import { Item } from '../../app/models/cart';
import { SelectChangeEvent } from '@mui/material';
import { Order } from '../../components/viewOrder/orderUtils';
import { saveOrderToLocalStorage } from '../../components/viewOrder/orderUtils';
import { API_URLS } from '../../app/api/apiURLs';

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
  const [removeCartItem] = useRemoveCartItemMutation();

  const [form, setForm] = useState({
    email: '',
    phone: '',
    provider: 'MTN',
  });

  const mapCartItemsToOrderItems = (items: Item[]) =>
    items.map((item) => ({
      productId: item.productId,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      pictureUrl: item.pictureUrl,
    }));

  const subtotal = cart?.items.reduce((sum: number, item: Item) => sum + item.price * item.quantity, 0) ?? 0;
  const deliveryFee = subtotal > 10000 ? 0 : 500;
  const totalAmount = (subtotal + deliveryFee) / 100; // in GHS
  const totalAmountInPesewas = totalAmount * 100; // in pesewas

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    setForm({ ...form, provider: e.target.value });
  };

  const handlePay = async () => {
    const paymentDetails: PaymentDetails = {
      amount: totalAmountInPesewas,
      email: form.email,
      phone: form.phone,
      provider: form.provider,
    };

    try {
      // Step 1: Initiate payment with Paystack
      const response = await fetch(API_URLS.mobileMoneyPayment, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          phone: form.phone,
          provider: form.provider,
          amount: totalAmountInPesewas,
          shippingAddress,
        }),
      });

      const result = await response.json();

      // Update payment details with reference if available
      paymentDetails.reference = result?.data?.reference || '';

      // Always save payment details for reference
      localStorage.setItem('paymentDetails', JSON.stringify(paymentDetails));

      // Step 2: Check if payment initiation was successful
      if (!response.ok || result.status !== true) {
        toast.error(result.message || 'Mobile money charge failed');
        handleNext('failed', paymentDetails);
        return;
      }

      // Step 3: Payment initiated successfully - now handle post-payment operations
      if (cart?.items) {
        const orderItems = mapCartItemsToOrderItems(cart.items);
        const order: Order = {
          id: Date.now().toString(),
          items: orderItems,
          subtotal,
          deliveryFee,
          total: subtotal + deliveryFee,
          shippingAddress,
          paymentDetails,
          status: 'pending',
        };

        // Save order to localStorage
        saveOrderToLocalStorage(order);

        // Remove items from cart
        for (const item of cart.items) {
          await removeCartItem({ 
            productId: item.productId, 
            quantity: item.quantity 
          }).unwrap();
        }
      }

      // All operations completed successfully
      toast.success('Mobile money charge initiated successfully!');
      handleNext('success', paymentDetails);

    } catch (networkError) {
      // Network or API call failed
      console.error('Payment initiation failed:', networkError);
      
      toast.error('Failed to initiate mobile money payment. Please check your connection and try again.');
      handleNext('failed', paymentDetails);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        width: '90%',
        mx: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        p: { xs: 2, sm: 3 },
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Shipping to:
        </Typography>
        <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
          {`${shippingAddress.hostel}, ${shippingAddress.landmark}\n${shippingAddress.city}, ${shippingAddress.region}\nContact: ${shippingAddress.contact}`}
        </Typography>
      </Box>

      <TextField
        label="Email"
        name="email"
        value={form.email}
        onChange={handleInputChange}
        fullWidth
        type="email"
        autoComplete="email"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <EmailIcon />
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiInputBase-input': {
            fontSize: { xs: '0.9rem', sm: '1rem' },
          },
        }}
      />

      <TextField
        label="Phone Number"
        name="phone"
        value={form.phone}
        onChange={handleInputChange}
        fullWidth
        type="tel"
        autoComplete="tel"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PhoneAndroidIcon />
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiInputBase-input': {
            fontSize: { xs: '0.9rem', sm: '1rem' },
          },
        }}
      />

      <FormControl fullWidth>
        <InputLabel>Provider</InputLabel>
        <Select
          name="provider"
          value={form.provider}
          label="Provider"
          onChange={handleSelectChange}
          sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
        >
          <MenuItem value="MTN" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
            MTN
          </MenuItem>
          <MenuItem value="VODAFONE" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
            VODAFONE
          </MenuItem>
          <MenuItem value="AIRTELTIGO" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
            AIRTELTIGO
          </MenuItem>
        </Select>
      </FormControl>

      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
        Total to be paid: GHS {totalAmount.toFixed(2)}
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={handlePay}
        sx={{
          py: { xs: 1.2, sm: 1.5 },
          fontSize: { xs: '1rem', sm: '1.1rem' },
        }}
      >
        Pay with Mobile Money
      </Button>

      <Typography
        variant="caption"
        sx={{
          mt: 2,
          color: 'text.secondary',
          fontStyle: 'italic',
          textAlign: 'center',
          fontSize: { xs: '0.75rem', sm: '0.85rem' },
          whiteSpace: 'pre-line',
        }}
      >
        Payment confirmation is processed securely via Paystack webhook.
        {'\n'}Your order status will update automatically once payment is confirmed.
      </Typography>
    </Box>
  );
};

export default PaystackCheckout;