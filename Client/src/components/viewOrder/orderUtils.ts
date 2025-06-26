export interface OrderItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  pictureUrl: string; 
}

export interface ShippingAddress {
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

export interface Order {
  id: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  shippingAddress: ShippingAddress;
  paymentDetails: PaymentDetails;
  status: string;
}

export const saveOrderToLocalStorage = (newOrder: Order) => {
  try {
    const storedData = localStorage.getItem('orders');
    let existingOrders: Order[] = [];

    // Safely parse existing orders
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        // Ensure parsed data is an array
        existingOrders = Array.isArray(parsed) ? parsed : [];
      } catch (parseError) {
        console.error('Failed to parse orders from localStorage:', parseError);
        existingOrders = [];
      }
    }

    // Check for duplicates
    const isDuplicate = existingOrders.some(order =>
      JSON.stringify(order.items) === JSON.stringify(newOrder.items)
    );

    if (!isDuplicate) {
      existingOrders.push(newOrder);
      localStorage.setItem('orders', JSON.stringify(existingOrders));
      console.log('Order saved successfully:', newOrder.id);
    } else {
      console.log('Duplicate order detected, not saving:', newOrder.id);
    }

  } catch (error) {
    console.error('Error saving order to localStorage:', error);
    
    // Fallback: try to save just this order
    try {
      localStorage.setItem('orders', JSON.stringify([newOrder]));
      console.log('Saved as new orders array after error');
    } catch (fallbackError) {
      console.error('Fallback save also failed:', fallbackError);
      throw new Error('Failed to save order to localStorage');
    }
  }
};

export const deleteOrderFromLocalStorage = (orderId: string) => {
  try {
    const storedData = localStorage.getItem('orders');
    if (!storedData) return;

    let existingOrders: Order[] = [];
    
    try {
      const parsed = JSON.parse(storedData);
      existingOrders = Array.isArray(parsed) ? parsed : [];
    } catch (parseError) {
      console.error('Failed to parse orders for deletion:', parseError);
      return;
    }

    const filteredOrders = existingOrders.filter(order => order.id !== orderId);
    localStorage.setItem('orders', JSON.stringify(filteredOrders));
    console.log('Order deleted successfully:', orderId);

  } catch (error) {
    console.error('Error deleting order from localStorage:', error);
  }
};

// Helper function to get orders safely
export const getOrdersFromLocalStorage = (): Order[] => {
  try {
    const storedData = localStorage.getItem('orders');
    if (!storedData) return [];

    const parsed = JSON.parse(storedData);
    return Array.isArray(parsed) ? parsed : [];

  } catch (error) {
    console.error('Error loading orders from localStorage:', error);
    return [];
  }
};