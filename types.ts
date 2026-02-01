
export interface Plan {
  id: number | string; // ID comes from DB as number
  name: string;
  price: string;
  duration: string;
  features: string[];
  description?: string; // Added description
  isPopular?: boolean;
}

export interface BookingFormState {
  fullName: string;
  phone: string;
  email: string;
  dob: string;
  age: number | '';
  state: string;
  city: string;
  address: string;
  time: string;
  planId: string;
  specialRequirements: string;
}

export interface StateCityMap {
  [key: string]: string[];
}

export interface AdminStats {
  totalBookings: number;
  newBookings: number;
  activePlans: number;
  messages: number;
}

export interface Booking {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  dob: string;
  age: number;
  state: string;
  city: string;
  address: string;
  time: string;
  plan: string;
  specialRequirements: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  date: string;
}

export interface Offer {
  id: number;
  title: string;
  description: string;
  isActive: boolean;
  created_at?: string;
}

export interface SiteSettings {
  id?: number;
  siteTitle: string;
  termsContent: string;
  privacyPolicyContent: string; // Added Privacy Policy
  disclaimerText: string;
  disclaimerPages: string[]; // Array of paths e.g., ['/', '/booking']
  // Age Gate Settings
  ageGateEnabled: boolean;
  ageGateTitle: string;
  ageGateContent: string;
}