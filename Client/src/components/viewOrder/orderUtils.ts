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
  const storedData = localStorage.getItem('orders');
  const existingOrders: Order[] = storedData ? JSON.parse(storedData) : [];

  const isDuplicate = existingOrders.some(order =>
    JSON.stringify(order.items) === JSON.stringify(newOrder.items)
  );

  if (!isDuplicate) {
    existingOrders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(existingOrders));
  }
};

// **New function to delete an order by id**
export const deleteOrderFromLocalStorage = (orderId: string) => {
  const storedData = localStorage.getItem('orders');
  if (!storedData) return;

  let existingOrders: Order[] = JSON.parse(storedData);
  existingOrders = existingOrders.filter(order => order.id !== orderId);
  localStorage.setItem('orders', JSON.stringify(existingOrders));
};
