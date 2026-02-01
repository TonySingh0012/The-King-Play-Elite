
import { Plan, StateCityMap } from './types';

export const PLANS: Plan[] = [
  {
    id: 'basic',
    name: 'The Twilight Spark',
    price: '₹2,999',
    duration: '2 Hours',
    features: ['Stimulating Conversation', 'Coffee or Cocktail Date', 'Safe & Secure Company', 'Social Etiquette Expert'],
    isPopular: false,
    description: "A perfect choice for social gatherings or a relaxed evening of conversation."
  },
  {
    id: 'premium',
    name: 'Moonlight Social',
    price: '₹5,999',
    duration: '5 Hours',
    features: ['Dinner Companion', 'Event Partner', 'Chauffeur Driven Entry', 'Formal Attire', 'Undivided Attention'],
    isPopular: true,
    description: "Ideal for weddings, parties, or formal dinners where you need a charming plus-one."
  },
  {
    id: 'vip',
    name: 'The Royal Affair',
    price: '₹14,999',
    duration: 'Full Day',
    features: ['City Tour Guide', 'VIP Event Companion', '5-Star Hospitality', 'Corporate Social Partner', 'Dedicated Concierge Manager'],
    isPopular: false,
    description: "The ultimate platonic companionship experience for full-day events or city exploration."
  },
];

export const INDIAN_STATES: StateCityMap = {
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik'],
  'Delhi': ['New Delhi', 'North Delhi', 'South Delhi'],
  'Karnataka': ['Bangalore', 'Mysore', 'Hubli'],
  'Telangana': ['Hyderabad', 'Warangal'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai'],
  'West Bengal': ['Kolkata', 'Howrah'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara'],
  'Rajasthan': ['Jaipur', 'Udaipur', 'Jodhpur'],
  'Goa': ['Panaji', 'Margao', 'Calangute'],
};

export const TESTIMONIALS = [
  {
    id: 1,
    name: "Ananya R.",
    role: "CEO, Tech Startup",
    text: "I needed a companion for a charity gala who was articulate and respectful. The King Play Elite provided a true gentleman who helped me network with confidence."
  },
  {
    id: 2,
    name: "Priya S.",
    role: "Surgeon",
    text: "Safety was my primary concern. The verification process is excellent. The 'Moonlight Social' experience was perfect for my cousin's wedding reception."
  },
  {
    id: 3,
    name: "Meera K.",
    role: "Fashion Designer",
    text: "Finally, a service that understands social anxiety. My companion was incredibly supportive and made attending the gallery opening an absolute joy."
  }
];

export const GALLERY_IMAGES = [];
