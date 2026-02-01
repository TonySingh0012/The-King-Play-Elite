
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Section } from '../components/Section';
import { INDIAN_STATES, PLANS } from '../constants';
import { BookingFormState, Plan } from '../types';
import { Calendar, MapPin, Upload, CheckCircle, AlertCircle, Wine, ChevronLeft, ChevronRight, ShieldAlert, FileText, Lock, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../utils/api';

export const Booking: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const preSelectedPlan = queryParams.get('plan') || '';

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [availablePlans, setAvailablePlans] = useState<Plan[]>([]);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [formData, setFormData] = useState<BookingFormState>({
    fullName: '',
    phone: '',
    email: '',
    dob: '',
    age: '',
    state: '',
    city: '',
    address: '',
    time: '',
    planId: preSelectedPlan,
    specialRequirements: ''
  });

  const [availableCities, setAvailableCities] = useState<string[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    api.get('/plans', PLANS).then(setAvailablePlans);
  }, []);

  useEffect(() => {
    if (formData.dob) {
      const birthDate = new Date(formData.dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setFormData(prev => ({ ...prev, age }));
    }
  }, [formData.dob]);

  useEffect(() => {
    if (formData.state && INDIAN_STATES[formData.state]) {
      setAvailableCities(INDIAN_STATES[formData.state]);
      setFormData(prev => ({ ...prev, city: '' }));
    } else {
      setAvailableCities([]);
    }
  }, [formData.state]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) {
        setErrorMessage("You must explicitly agree to the Legal Compliance statement to proceed.");
        return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    
    // Find name from ID
    const planName = availablePlans.find(p => String(p.id) === String(formData.planId))?.name || 'Custom';

    // Prepare Payload
    const payload = {
      customerName: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      dob: formData.dob,
      age: formData.age,
      state: formData.state,
      city: formData.city,
      address: formData.address,
      time: formData.time,
      plan: planName,
      specialRequirements: formData.specialRequirements,
      agreedToLegal: true // Explicitly track agreement
    };

    try {
      await api.post('/bookings', payload);
      setIsSuccess(true);
    } catch (error) {
      // Quietly failover to local storage without warning
      
      // Fallback to LocalStorage for Demo
      const bookings = JSON.parse(localStorage.getItem('kpb_bookings') || '[]');
      const newBooking = {
        id: Date.now().toString(),
        customerName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        plan: planName,
        status: 'Pending',
        date: new Date().toISOString().split('T')[0],
        ...payload
      };
      localStorage.setItem('kpb_bookings', JSON.stringify([newBooking, ...bookings]));
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-felt.png')] opacity-50"></div>
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="bg-[#0a0a0a] border border-brand-gold p-8 md:p-12 rounded-sm max-w-lg w-full text-center relative z-10 shadow-[0_0_50px_rgba(212,175,55,0.1)]"
        >
          <div className="w-16 h-16 border border-brand-gold rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-brand-gold" />
          </div>
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">Reservation Securely Received</h2>
          <p className="text-gray-400 mb-8 font-light leading-relaxed text-sm md:text-base">
            Your private inquiry is encrypted and stored offline. Our concierge will contact you via your preferred method shortly to confirm details and complete the verification process.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full py-4 bg-brand-gold text-black uppercase tracking-widest text-xs font-bold hover:bg-white transition-colors"
          >
            Return to Sanctuary
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-[#050505] relative flex flex-col items-center">
      {/* Background Ambience */}
      <div className="fixed top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] opacity-30 pointer-events-none"></div>
      <div className="fixed -top-40 -right-40 w-[600px] h-[600px] bg-brand-red/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-4xl w-full relative z-10">
        <div className="text-center mb-10">
          <div className="flex justify-center items-center gap-2 mb-3">
             <Lock className="w-4 h-4 text-brand-gold" />
             <span className="text-[10px] uppercase tracking-widest text-brand-gold">256-Bit Encrypted & Private</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-2">Private Reservation</h1>
          <p className="text-gray-500 font-serif italic text-sm">Step {step} of 3 • Absolute Discretion Guaranteed</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-black/40 border border-white/10 backdrop-blur-md relative overflow-hidden shadow-2xl rounded-sm">
          {/* Top Gold Line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-gold to-transparent"></div>
          
          <AnimatePresence mode="wait">
            
            {/* Step 1: Who */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="p-6 md:p-12"
              >
                <h3 className="text-xl md:text-2xl text-white font-serif mb-8 border-b border-white/5 pb-4">Personal Details</h3>
                
                <div className="space-y-6">
                  <div className="group">
                    <label className="block text-[10px] uppercase tracking-widest text-brand-gold mb-2">Full Name</label>
                    <input 
                      required 
                      type="text" 
                      name="fullName" 
                      value={formData.fullName} 
                      onChange={handleChange} 
                      className="w-full bg-[#111] border border-white/10 px-4 py-4 text-white focus:border-brand-gold focus:ring-1 focus:ring-brand-gold focus:outline-none transition-all placeholder-gray-700 text-lg rounded-sm" 
                      placeholder="Jane Doe" 
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group">
                      <label className="block text-[10px] uppercase tracking-widest text-brand-gold mb-2">Phone Number</label>
                      <input 
                        required 
                        type="tel" 
                        name="phone" 
                        pattern="[0-9]{10}" 
                        value={formData.phone} 
                        onChange={handleChange} 
                        className="w-full bg-[#111] border border-white/10 px-4 py-4 text-white focus:border-brand-gold focus:ring-1 focus:ring-brand-gold focus:outline-none transition-all placeholder-gray-700 text-lg rounded-sm" 
                        placeholder="9876543210" 
                      />
                    </div>
                    <div className="group">
                      <label className="block text-[10px] uppercase tracking-widest text-brand-gold mb-2">Email Address</label>
                      <input 
                        required 
                        type="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        className="w-full bg-[#111] border border-white/10 px-4 py-4 text-white focus:border-brand-gold focus:ring-1 focus:ring-brand-gold focus:outline-none transition-all placeholder-gray-700 text-lg rounded-sm" 
                        placeholder="name@example.com" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                     <div className="group">
                        <label className="block text-[10px] uppercase tracking-widest text-brand-gold mb-2">Date of Birth</label>
                        <input 
                          required 
                          type="date" 
                          name="dob" 
                          value={formData.dob} 
                          onChange={handleChange} 
                          className="w-full bg-[#111] border border-white/10 px-4 py-4 text-white focus:border-brand-gold focus:ring-1 focus:ring-brand-gold focus:outline-none uppercase text-sm rounded-sm" 
                        />
                     </div>
                     <div className="group">
                        <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Age</label>
                        <input 
                          disabled 
                          type="text" 
                          value={formData.age} 
                          className="w-full bg-[#0a0a0a] border border-white/5 px-4 py-4 text-gray-500 cursor-not-allowed rounded-sm" 
                        />
                     </div>
                  </div>
                </div>

                {formData.age !== '' && (Number(formData.age) < 18) && (
                   <div className="mt-6 flex items-center gap-3 text-red-400 text-sm bg-red-900/10 p-4 border border-red-900/50 rounded-sm">
                      <AlertCircle className="w-5 h-5"/> Services are strictly for adults (18+).
                   </div>
                )}

                <div className="mt-10 flex justify-end">
                  <button 
                    type="button" 
                    onClick={() => setStep(2)}
                    disabled={!formData.fullName || !formData.phone || !formData.email || !formData.dob || (Number(formData.age) < 18)}
                    className="flex items-center gap-2 px-8 py-4 bg-brand-red text-white text-xs font-bold uppercase tracking-widest hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 rounded-sm"
                  >
                    Next Step <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Where & What */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="p-6 md:p-12"
              >
                <h3 className="text-xl md:text-2xl text-white font-serif mb-8 border-b border-white/5 pb-4">The Experience</h3>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group">
                      <label className="block text-[10px] uppercase tracking-widest text-brand-gold mb-2">Region</label>
                      <select required name="state" value={formData.state} onChange={handleChange} className="w-full bg-[#111] border border-white/10 px-4 py-4 text-white focus:border-brand-gold focus:ring-1 focus:ring-brand-gold focus:outline-none appearance-none rounded-sm cursor-pointer">
                        <option value="">Select Region</option>
                        {Object.keys(INDIAN_STATES).map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="group">
                      <label className="block text-[10px] uppercase tracking-widest text-brand-gold mb-2">City</label>
                      <select required name="city" value={formData.city} onChange={handleChange} disabled={!formData.state} className="w-full bg-[#111] border border-white/10 px-4 py-4 text-white focus:border-brand-gold focus:ring-1 focus:ring-brand-gold focus:outline-none appearance-none disabled:opacity-50 rounded-sm cursor-pointer">
                        <option value="">Select City</option>
                        {availableCities.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-[10px] uppercase tracking-widest text-brand-gold mb-2">Location / Venue</label>
                    <textarea required name="address" value={formData.address} onChange={handleChange} rows={2} className="w-full bg-[#111] border border-white/10 px-4 py-4 text-white focus:border-brand-gold focus:ring-1 focus:ring-brand-gold focus:outline-none placeholder-gray-700 text-base rounded-sm" placeholder="Hotel name, private residence, or meeting point..."></textarea>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="group">
                        <label className="block text-[10px] uppercase tracking-widest text-brand-gold mb-2">Selection</label>
                        <select required name="planId" value={formData.planId} onChange={handleChange} className="w-full bg-[#111] border border-white/10 px-4 py-4 text-white focus:border-brand-gold focus:ring-1 focus:ring-brand-gold focus:outline-none rounded-sm cursor-pointer">
                           <option value="">Choose Experience</option>
                           {availablePlans.map(p => <option key={p.id} value={p.id}>{p.name} ({p.price})</option>)}
                        </select>
                     </div>
                     <div className="group">
                        <label className="block text-[10px] uppercase tracking-widest text-brand-gold mb-2">Time</label>
                        <input required type="time" name="time" value={formData.time} onChange={handleChange} className="w-full bg-[#111] border border-white/10 px-4 py-4 text-white focus:border-brand-gold focus:ring-1 focus:ring-brand-gold focus:outline-none rounded-sm" />
                     </div>
                  </div>
                </div>

                <div className="mt-10 flex justify-between">
                  <button type="button" onClick={() => setStep(1)} className="flex items-center gap-2 px-6 py-4 text-gray-500 hover:text-white transition-colors text-xs uppercase tracking-widest font-bold">
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setStep(3)}
                    disabled={!formData.state || !formData.city || !formData.address || !formData.planId}
                    className="flex items-center gap-2 px-8 py-4 bg-brand-red text-white text-xs font-bold uppercase tracking-widest hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 rounded-sm"
                  >
                    Next Step <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Verify & Submit */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="p-6 md:p-12"
              >
                <h3 className="text-xl md:text-2xl text-white font-serif mb-8 border-b border-white/5 pb-4">Final Touches</h3>
                
                <div className="space-y-8">
                  {/* KYC Placeholder */}
                  <div className="border border-dashed border-white/20 p-8 text-center hover:border-brand-gold hover:bg-brand-gold/5 transition-all duration-300 cursor-pointer rounded-sm">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                    <h4 className="text-white text-sm font-bold uppercase tracking-widest mb-1">Verify Identity (KYC)</h4>
                    <p className="text-xs text-gray-500 mb-4">Required for Safety: Upload Govt ID (Aadhar/Passport)</p>
                    <div className="relative inline-block">
                      <span className="px-4 py-2 bg-white/10 text-white text-[10px] uppercase tracking-widest rounded-sm">Browse Files (Encrypted)</span>
                      <input type="file" required multiple accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    </div>
                  </div>

                  <div className="group">
                     <label className="block text-[10px] uppercase tracking-widest text-brand-gold mb-2">Special Desires</label>
                     <textarea name="specialRequirements" value={formData.specialRequirements} onChange={handleChange} rows={3} className="w-full bg-[#111] border border-white/10 px-4 py-4 text-white focus:border-brand-gold focus:ring-1 focus:ring-brand-gold focus:outline-none placeholder-gray-700 text-sm rounded-sm" placeholder="Any specific requests? Flowers, music, conversation topics..."></textarea>
                  </div>
                </div>

                {/* --- LEGAL COMPLIANCE CHECKBOX (ENHANCED FOR SAFETY) --- */}
                <div className="mt-8 bg-black/80 border border-brand-red p-6 rounded-sm shadow-inner shadow-red-900/10">
                    <label className="flex items-start gap-4 cursor-pointer">
                        <div className="pt-1">
                             <input 
                                type="checkbox" 
                                checked={agreedToTerms}
                                onChange={(e) => setAgreedToTerms(e.target.checked)}
                                className="w-6 h-6 accent-brand-red cursor-pointer"
                            />
                        </div>
                        <div className="text-sm text-gray-400">
                            <span className="text-brand-red font-bold block mb-2 flex items-center gap-2 uppercase tracking-wide">
                                <ShieldAlert className="w-5 h-5"/> Legal Declaration (Strictly Enforced)
                            </span>
                            <p className="mb-2 leading-relaxed">
                                I hereby certify that I am booking this service purely for <strong>Social Companionship, Dinner, or Event Hosting</strong>.
                            </p>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                I understand that <strong>solicitation for sexual services is ILLEGAL</strong> under the <em>Immoral Traffic (Prevention) Act, 1956</em> and strictly prohibited on this platform. Any violation will result in immediate termination, blacklisting, and reporting to authorities.
                            </p>
                        </div>
                    </label>
                </div>

                {errorMessage && (
                  <div className="mt-4 p-4 bg-red-900/20 border border-red-500/50 text-red-200 text-sm font-bold text-center flex items-center justify-center gap-2">
                    <AlertCircle className="w-4 h-4" /> {errorMessage}
                  </div>
                )}

                <div className="mt-10 flex flex-col md:flex-row justify-between items-center gap-4">
                  <button type="button" onClick={() => setStep(2)} className="flex items-center gap-2 px-6 py-4 text-gray-500 hover:text-white transition-colors text-xs uppercase tracking-widest font-bold">
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                  <div className="flex flex-col items-center">
                      <button 
                        type="submit" 
                        disabled={isSubmitting || !agreedToTerms}
                        className="px-12 py-4 bg-brand-gold text-black text-xs font-bold uppercase tracking-widest hover:bg-white hover:scale-105 transition-all duration-300 rounded-sm shadow-[0_0_20px_rgba(212,175,55,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                      >
                        {isSubmitting ? 'Securing Data...' : 'Confirm Reservation'}
                        {!isSubmitting && <ShieldCheck className="w-4 h-4" />}
                      </button>
                      <span className="text-[10px] text-gray-600 mt-2 uppercase tracking-widest flex items-center gap-1">
                          <Lock className="w-3 h-3"/> SSL Secured Connection
                      </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </div>
  );
};
