
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Crown } from 'lucide-react';
import { api } from '../utils/api';
import { SiteSettings } from '../types';

export const AgeGate: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const init = async () => {
      // Fetch settings first
      try {
        const data = await api.get('/settings', {});
        setSettings(data);

        // Logic: If Age Gate is Enabled in settings AND User hasn't verified in local storage
        const isVerified = localStorage.getItem('kpb_age_verified');
        
        // Default to enabled if data fetch fails or key missing, to be safe.
        // But if we have data, respect the 'enabled' flag.
        const isEnabled = data?.ageGateEnabled !== false; // Defaults to true if undefined

        if (isEnabled && !isVerified) {
          setIsOpen(true);
          document.body.style.overflow = 'hidden';
        }
      } catch (e) {
        // Fallback if API fails
        const isVerified = localStorage.getItem('kpb_age_verified');
        if (!isVerified) {
            setIsOpen(true);
            document.body.style.overflow = 'hidden';
        }
      }
    };
    init();
  }, []);

  const handleVerify = () => {
    localStorage.setItem('kpb_age_verified', 'true');
    setIsOpen(false);
    document.body.style.overflow = 'unset';
  };

  const handleReject = () => {
    window.location.href = 'https://www.google.com';
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-4"
      >
        {/* Background visuals */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2000')] bg-cover bg-center opacity-20 blur-md"></div>
        <div className="absolute inset-0 bg-black/80"></div>

        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="relative z-10 bg-[#0a0a0a] border border-brand-red/50 p-8 md:p-12 max-w-lg w-full text-center shadow-[0_0_50px_rgba(127,29,29,0.3)] rounded-sm"
        >
          <Crown className="w-12 h-12 text-brand-gold mx-auto mb-6" />
          
          <h1 className="text-3xl font-serif text-white mb-2">
            {settings?.ageGateTitle || "Age Verification"}
          </h1>
          <div className="w-20 h-0.5 bg-brand-red mx-auto mb-6"></div>
          
          <div className="flex items-center justify-center gap-3 mb-6 text-brand-red bg-red-900/10 p-4 border border-red-900/30">
             <ShieldAlert className="w-6 h-6 shrink-0" />
             <p className="text-sm font-bold uppercase tracking-widest text-left">Strictly 18+ Adults Only</p>
          </div>

          <p className="text-gray-400 mb-8 leading-relaxed font-light">
            {settings?.ageGateContent || "This website contains material intended for adults. By entering, you acknowledge that you are at least 18 years of age."}
          </p>

          <div className="flex flex-col gap-4">
            <button
              onClick={handleVerify}
              className="w-full py-4 bg-brand-gold text-black font-bold uppercase tracking-widest hover:bg-white transition-colors"
            >
              I am 18 or Older - Enter
            </button>
            <button
              onClick={handleReject}
              className="w-full py-3 text-gray-500 hover:text-white uppercase tracking-widest text-xs font-bold transition-colors"
            >
              Exit Website
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
