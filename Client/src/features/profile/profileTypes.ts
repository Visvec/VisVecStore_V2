// src/features/account/profileTypes.ts

export interface ShippingAddress {
  hostel: string;
  landmark: string;
  city: string;
  region: string;
  contact: string;
}

export interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
  photoUrl?: string;
  shippingAddress?: ShippingAddress;
    dateOfBirth?: string;
    firstName?: string;
    lastName?: string;
    profilePhoto?: string;
}
