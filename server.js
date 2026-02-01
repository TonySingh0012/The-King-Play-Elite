
/* eslint-disable no-console */
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import XLSX from 'xlsx';

const app = express();
const PORT = 5000;
const DB_FILE = 'database.xlsx';

// Middleware
app.use(cors());
app.use(express.json());

// ----------------------------------------------------
// EXCEL HELPER FUNCTIONS
// ----------------------------------------------------

// 1. Initialize Database (Create Excel file if not exists)
const initDatabase = () => {
    try {
        if (!fs.existsSync(DB_FILE)) {
            console.log("⚡ Creating new Excel Database...");
            const wb = XLSX.utils.book_new();

            // Default Data
            const plans = [
                { id: 1, name: 'The Twilight Spark', price: '₹2,999', duration: '2 Hours', features: JSON.stringify(["Stimulating Conversation", "Coffee or Cocktail Date", "Safe & Secure Company"]), description: 'A perfect introduction.', isPopular: false },
                { id: 2, name: 'Moonlight Romance', price: '₹5,999', duration: '5 Hours', features: JSON.stringify(["Dinner Partner", "Chauffeur Driven", "Red Rose Greeting"]), description: 'Our most requested experience.', isPopular: true },
                { id: 3, name: 'The Royal Affair', price: '₹14,999', duration: 'Full Day', features: JSON.stringify(["VIP Event Companion", "5-Star Hospitality", "Dedicated Concierge"]), description: 'The ultimate indulgence.', isPopular: false }
            ];

            const settings = [{
                id: 1,
                siteTitle: 'The King Play Elite',
                termsContent: 'Terms & Conditions (Excel Managed)',
                privacyPolicyContent: 'Privacy Policy (Excel Managed)',
                disclaimerText: 'Strictly 18+ Platonic Services Only.',
                disclaimerPages: JSON.stringify(['/', '/booking']),
                ageGateEnabled: true,
                ageGateTitle: 'Age Verification',
                ageGateContent: 'This website contains material intended for adults.'
            }];

            const offers = [
                { id: 1, title: 'Excel Launch Offer', description: 'System now running on Excel backend!', isActive: true, created_at: new Date().toISOString() }
            ];

            // Create Sheets
            const wsPlans = XLSX.utils.json_to_sheet(plans);
            const wsBookings = XLSX.utils.json_to_sheet([]);
            const wsMessages = XLSX.utils.json_to_sheet([]);
            const wsOffers = XLSX.utils.json_to_sheet(offers);
            const wsSettings = XLSX.utils.json_to_sheet(settings);

            // Append Sheets
            XLSX.utils.book_append_sheet(wb, wsPlans, 'plans');
            XLSX.utils.book_append_sheet(wb, wsBookings, 'bookings');
            XLSX.utils.book_append_sheet(wb, wsMessages, 'messages');
            XLSX.utils.book_append_sheet(wb, wsOffers, 'offers');
            XLSX.utils.book_append_sheet(wb, wsSettings, 'settings');

            XLSX.writeFile(wb, DB_FILE);
            console.log("✅ Database.xlsx created successfully!");
        } else {
            console.log("✅ Connected to existing Excel Database.");
        }
    } catch (error) {
        console.error("❌ CRITICAL ERROR: Could not access database.xlsx");
        console.error("👉 If the file is open in Excel, PLEASE CLOSE IT and restart the server.");
        console.error(error);
        process.exit(1);
    }
};

// 2. Read Table (Sheet)
const readTable = (tableName) => {
    try {
        const wb = XLSX.readFile(DB_FILE);
        if (!wb.Sheets[tableName]) return [];
        return XLSX.utils.sheet_to_json(wb.Sheets[tableName]);
    } catch (error) {
        if (error.code === 'EBUSY') {
            console.error(`❌ ERROR: database.xlsx is BUSY/LOCKED. Close the file in Excel!`);
        } else {
            console.error(`Error reading ${tableName}:`, error);
        }
        return [];
    }
};

// 3. Write Table (Sheet)
const writeTable = (tableName, data) => {
    try {
        const wb = XLSX.readFile(DB_FILE);
        const ws = XLSX.utils.json_to_sheet(data);
        
        // Use existing workbook structure
        if (wb.Sheets[tableName]) {
            wb.Sheets[tableName] = ws;
        } else {
            XLSX.utils.book_append_sheet(wb, ws, tableName);
        }
        
        XLSX.writeFile(wb, DB_FILE);
        return true;
    } catch (error) {
        if (error.code === 'EBUSY') {
            console.error(`❌ ERROR: database.xlsx is OPEN in another program. Close it to save data!`);
        } else {
            console.error(`Error writing ${tableName}:`, error);
        }
        return false;
    }
};

// Initialize on start
initDatabase();

// --- BROWSER HELPER ---
app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: sans-serif; text-align: center; padding: 50px; background-color: #e8f5e9; height: 100vh;">
      <h1 style="color: #1b5e20;">✅ Excel Backend is Running!</h1>
      <p>Data is being saved to: <b>${DB_FILE}</b> in your project folder.</p>
      <p style="color: #c62828;">⚠️ Important: Do not keep the Excel file open while using the website.</p>
    </div>
  `);
});

// ----------------------------------------------------
// API ENDPOINTS (Excel Based)
// ----------------------------------------------------

// 1. PLANS
app.get('/api/plans', (req, res) => {
    const plans = readTable('plans');
    const parsed = plans.map(p => ({
        ...p,
        features: typeof p.features === 'string' ? JSON.parse(p.features) : p.features,
        isPopular: p.isPopular === 'true' || p.isPopular === true
    }));
    res.json(parsed);
});

app.post('/api/plans', (req, res) => {
    const plans = readTable('plans');
    const newPlan = {
        id: Date.now(),
        ...req.body,
        features: JSON.stringify(req.body.features)
    };
    plans.push(newPlan);
    if (writeTable('plans', plans)) {
        res.json({ message: 'Plan created', id: newPlan.id });
    } else {
        res.status(500).json({ error: 'Database locked' });
    }
});

app.put('/api/plans/:id', (req, res) => {
    let plans = readTable('plans');
    const index = plans.findIndex(p => String(p.id) === String(req.params.id));
    if (index !== -1) {
        plans[index] = { 
            ...plans[index], 
            ...req.body,
            features: JSON.stringify(req.body.features)
        };
        if (writeTable('plans', plans)) {
            res.json({ message: 'Plan updated' });
        } else {
            res.status(500).json({ error: 'Database locked' });
        }
    } else {
        res.status(404).json({ error: 'Plan not found' });
    }
});

app.delete('/api/plans/:id', (req, res) => {
    let plans = readTable('plans');
    const filtered = plans.filter(p => String(p.id) !== String(req.params.id));
    if (writeTable('plans', filtered)) {
        res.json({ message: 'Plan deleted' });
    } else {
        res.status(500).json({ error: 'Database locked' });
    }
});

// 2. BOOKINGS
app.get('/api/bookings', (req, res) => {
    const bookings = readTable('bookings');
    res.json(bookings.reverse());
});

app.post('/api/bookings', (req, res) => {
    const bookings = readTable('bookings');
    const newBooking = {
        id: Date.now(),
        ...req.body,
        status: 'Pending',
        created_at: new Date().toISOString()
    };
    bookings.push(newBooking);
    if (writeTable('bookings', bookings)) {
        res.json({ message: 'Booking successful', id: newBooking.id });
    } else {
        res.status(500).json({ error: 'Database locked' });
    }
});

app.put('/api/bookings/:id', (req, res) => {
    const bookings = readTable('bookings');
    const index = bookings.findIndex(b => String(b.id) === String(req.params.id));
    if (index !== -1) {
        bookings[index].status = req.body.status;
        if (writeTable('bookings', bookings)) {
            res.json({ message: 'Status updated' });
        } else {
            res.status(500).json({ error: 'Database locked' });
        }
    } else {
        res.status(404).json({ error: 'Booking not found' });
    }
});

app.delete('/api/bookings/:id', (req, res) => {
    const bookings = readTable('bookings');
    const filtered = bookings.filter(b => String(b.id) !== String(req.params.id));
    if (writeTable('bookings', filtered)) {
        res.json({ message: 'Booking deleted' });
    } else {
        res.status(500).json({ error: 'Database locked' });
    }
});

// 3. MESSAGES
app.get('/api/messages', (req, res) => {
    const msgs = readTable('messages');
    res.json(msgs.reverse());
});

app.post('/api/messages', (req, res) => {
    const msgs = readTable('messages');
    const newMsg = {
        id: Date.now(),
        ...req.body,
        created_at: new Date().toISOString()
    };
    msgs.push(newMsg);
    writeTable('messages', msgs);
    res.json({ message: 'Message sent' });
});

app.delete('/api/messages/:id', (req, res) => {
    const msgs = readTable('messages');
    const filtered = msgs.filter(m => String(m.id) !== String(req.params.id));
    writeTable('messages', filtered);
    res.json({ message: 'Message deleted' });
});

// 4. OFFERS
app.get('/api/offers', (req, res) => {
    const offers = readTable('offers');
    const parsed = offers.map(o => ({
        ...o,
        isActive: o.isActive === 'true' || o.isActive === true
    }));
    res.json(parsed);
});

app.post('/api/offers', (req, res) => {
    const offers = readTable('offers');
    const newOffer = {
        id: Date.now(),
        ...req.body,
        created_at: new Date().toISOString()
    };
    offers.push(newOffer);
    writeTable('offers', offers);
    res.json({ message: 'Offer created' });
});

app.put('/api/offers/:id', (req, res) => {
    const offers = readTable('offers');
    const index = offers.findIndex(o => String(o.id) === String(req.params.id));
    if (index !== -1) {
        offers[index].isActive = req.body.isActive;
        writeTable('offers', offers);
        res.json({ message: 'Offer updated' });
    } else {
        res.status(404).json({ error: 'Offer not found' });
    }
});

app.delete('/api/offers/:id', (req, res) => {
    const offers = readTable('offers');
    const filtered = offers.filter(o => String(o.id) !== String(req.params.id));
    writeTable('offers', filtered);
    res.json({ message: 'Offer deleted' });
});

// 5. SETTINGS
app.get('/api/settings', (req, res) => {
    const settings = readTable('settings');
    if (settings.length > 0) {
        const s = settings[0];
        const parsed = {
            ...s,
            disclaimerPages: typeof s.disclaimerPages === 'string' ? JSON.parse(s.disclaimerPages) : (s.disclaimerPages || []),
            ageGateEnabled: s.ageGateEnabled === 'true' || s.ageGateEnabled === true
        };
        res.json(parsed);
    } else {
        res.json({});
    }
});

app.put('/api/settings', (req, res) => {
    let settings = readTable('settings');
    const newSettings = {
        id: 1,
        ...req.body,
        disclaimerPages: JSON.stringify(req.body.disclaimerPages)
    };
    
    if (settings.length > 0) {
        settings[0] = newSettings;
    } else {
        settings.push(newSettings);
    }
    
    writeTable('settings', settings);
    res.json({ message: 'Settings saved' });
});

app.listen(PORT, () => {
    console.log(`\n=========================================================`);
    console.log(`🚀 EXCEL BACKEND RUNNING ON PORT ${PORT}`);
    console.log(`   Database File: ${DB_FILE}`);
    console.log(`   Link: http://localhost:${PORT}`);
    console.log(`=========================================================\n`);
});
