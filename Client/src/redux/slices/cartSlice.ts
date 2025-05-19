import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ShippingAddress {
  hostel: string;
  landmark: string;
  city: string;
  contact: string;
  region: string;
}

interface CartState {
  shippingAddress?: ShippingAddress;
}

const initialState: CartState = {};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    saveShippingAddress(state, action: PayloadAction<ShippingAddress>) {
      state.shippingAddress = action.payload;
    },
  },
});

export const { saveShippingAddress } = cartSlice.actions;
export default cartSlice.reducer;