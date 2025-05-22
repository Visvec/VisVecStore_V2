const BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const API_URLS = {
    api: BASE_URL,
    mobileMoneyPayment: `${BASE_URL}/payment/mobile-money`,
    getOrderStatus: (reference: string) => `${BASE_URL}/orders/status/${reference}`

};