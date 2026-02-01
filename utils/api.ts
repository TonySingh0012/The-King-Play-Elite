
import { PLANS } from '../constants';

const BASE_URL = 'http://localhost:5000/api';

// --- OFFLINE MOCK DATABASE ---
// This allows the app to work seamlessly even if the Node.js backend is not running.
const DB_PREFIX = 'kpb_local_';

// --- LEGAL TEXT CONSTANTS (INDIAN LAW COMPLIANT) ---
const TERMS_AND_CONDITIONS = `
**TERMS OF SERVICE & USER AGREEMENT**
*Last Updated: ${new Date().toLocaleDateString()}*

**1. NATURE OF SERVICE (STRICTLY PLATONIC)**
The King Play Elite ("The Service") operates strictly as a premium social concierge and event companionship agency. 
WARNING: This Service strictly adheres to the **Immoral Traffic (Prevention) Act, 1956**. 
- We DO NOT offer, facilitate, or tolerate prostitution, escort services of a sexual nature, or any form of human trafficking.
- Any client found soliciting sexual favors, engaging in inappropriate touching, or making lewd remarks will be immediately blacklisted, and their information may be reported to Cyber Crime authorities under Section 67 of the IT Act, 2000.

**2. AGE RESTRICTION**
You must be at least 18 years of age (Majority Act, 1875) to access this website or book a companion. We reserve the right to demand government-issued photo ID (Aadhar/Passport) for age verification (KYC).

**3. BOOKING & CANCELLATION**
- All bookings are for "Time and Companionship" only.
- Payment is for the companion's time, social etiquette, and conversation.
- We reserve the right to cancel any booking without refund if the client appears intoxicated, aggressive, or suspicious.

**4. SAFETY & CONDUCT**
- Meetings must take place in public or semi-public venues (Restaurants, Events, Hotels with security).
- Closed-door private residence meetings are subject to strict vetting.
- Our companions have the right to leave immediately if they feel unsafe.

**5. LIMITATION OF LIABILITY**
The Service acts as an aggregator/agency. While we vet our companions, we are not liable for personal disputes arising during the meeting. 

**6. JURISDICTION**
These terms are governed by the laws of India. Any disputes are subject to the exclusive jurisdiction of the courts in Mumbai, India.
`;

const PRIVACY_POLICY = `
**PRIVACY POLICY**
*Effective Date: ${new Date().toLocaleDateString()}*

**1. COMPLIANCE WITH DPDP ACT, 2023**
The King Play Elite is committed to protecting your privacy in accordance with India's Digital Personal Data Protection Act, 2023.

**2. DATA WE COLLECT**
- Name, Phone Number, and Email for booking coordination.
- Government ID (KYC) for safety verification (stored offline and encrypted).
- We do NOT store credit card details; all payments are processed via third-party secure gateways.

**3. HOW WE USE YOUR DATA**
- To facilitate the reservation.
- To ensure the safety of our social companions.
- To comply with legal requests from Indian Law Enforcement Agencies if a crime is reported.

**4. DATA SECURITY (OFFLINE STORAGE)**
- Unlike other platforms, your detailed booking data is primarily stored in offline Excel databases to prevent cloud leaks.
- We use 256-bit SSL encryption for data transmission.

**5. DELETION REQUESTS**
You have the "Right to be Forgotten." You may request the deletion of your personal data after your booking is complete by contacting our Concierge.

**6. THIRD-PARTY DISCLOSURE**
We do not sell, trade, or transfer your PII (Personally Identifiable Information) to outside parties unless required by a court order.
`;

const DEFAULTS: Record<string, any> = {
  '/plans': PLANS,
  '/offers': [
    { id: 1, title: 'Welcome Offer', description: 'Receive 10% off your first booking.', isActive: true }
  ],
  '/settings': {
    siteTitle: 'The King Play Elite',
    termsContent: TERMS_AND_CONDITIONS,
    privacyPolicyContent: PRIVACY_POLICY,
    disclaimerText: 'Strictly 18+ Adults Only. 100% Platonic Social Companionship Service.',
    disclaimerPages: ['/', '/booking', '/plans'],
    ageGateEnabled: true,
    ageGateTitle: 'Legal Compliance Check',
    ageGateContent: 'This website offers Platonic Social Companionship services. By entering, you confirm you are 18+ and NOT seeking illegal services prohibited under the Immoral Traffic (Prevention) Act.'
  },
  '/bookings': [],
  '/messages': []
};

const localDB = {
  get: (endpoint: string) => {
    // 1. Try Local Storage first (to get updated data)
    const key = DB_PREFIX + endpoint.replace(/^\//, '').replace(/\//g, '_');
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);

    // 2. Return Default Constant if exists
    if (DEFAULTS[endpoint]) {
        return JSON.parse(JSON.stringify(DEFAULTS[endpoint]));
    }
    return null;
  },
  
  save: (endpoint: string, data: any) => {
    const key = DB_PREFIX + endpoint.replace(/^\//, '').replace(/\//g, '_');
    localStorage.setItem(key, JSON.stringify(data));
  }
};

export const api = {
  get: async (endpoint: string, fallback: any) => {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      // Suppress error and use fallback to prevent console spam
      console.warn(`[Offline Mode] Fetch failed for ${endpoint}. Serving local data.`);
      const localData = localDB.get(endpoint);
      return localData !== null ? localData : (DEFAULTS[endpoint] || fallback);
    }
  },

  post: async (endpoint: string, data: any) => {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.warn(`[Offline Mode] Saving ${endpoint} to local storage.`);
      
      // Simulate Backend Logic
      const current = localDB.get(endpoint) || [];
      if (Array.isArray(current)) {
          const newItem = { 
              id: Date.now(), 
              ...data, 
              created_at: new Date().toISOString() 
          };
          localDB.save(endpoint, [newItem, ...current]);
          return newItem;
      }
      return data;
    }
  },

  put: async (endpoint: string, data: any) => {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
       console.warn(`[Offline Mode] Updating ${endpoint} in local storage.`);
       
       // Handle Settings (Singleton)
       if (endpoint === '/settings') {
           localDB.save(endpoint, data);
           return { message: 'Settings saved locally' };
       }

       // Handle Collections (ID update) e.g., /bookings/123
       const parts = endpoint.split('/'); 
       const id = parts[parts.length - 1];
       const collectionPath = '/' + parts[1]; // e.g., /bookings

       const list = localDB.get(collectionPath);
       if (Array.isArray(list)) {
           const updatedList = list.map((item: any) => 
               String(item.id) === String(id) ? { ...item, ...data } : item
           );
           localDB.save(collectionPath, updatedList);
       }
       return { message: 'Updated locally' };
    }
  },

  delete: async (endpoint: string) => {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.warn(`[Offline Mode] Deleting ${endpoint} from local storage.`);
      
      const parts = endpoint.split('/'); 
      const id = parts[parts.length - 1];
      const collectionPath = '/' + parts[1];

      const list = localDB.get(collectionPath);
      if (Array.isArray(list)) {
          const filteredList = list.filter((item: any) => String(item.id) !== String(id));
          localDB.save(collectionPath, filteredList);
      }
      return { message: 'Deleted locally' };
    }
  },

  // Helper to check if server is reachable
  checkHealth: async () => {
      try {
          const res = await fetch(`${BASE_URL.replace('/api', '')}/`);
          return res.ok;
      } catch(e) {
          return false;
      }
  }
};
