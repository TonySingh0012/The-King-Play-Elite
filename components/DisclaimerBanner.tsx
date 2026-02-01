
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../utils/api';
import { SiteSettings } from '../types';
import { motion } from 'framer-motion';

export const DisclaimerBanner: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const location = useLocation();

  useEffect(() => {
    api.get('/settings', {}).then((data) => {
      if (data && data.siteTitle) {
        setSettings(data);
      }
    });
  }, [location.pathname]); // Re-fetch or re-check on nav change if needed, mostly for visibility check

  if (!settings || !settings.disclaimerText) return null;

  // Check if current page is in the allowed list
  // If list is empty/null, assume showing on all pages OR handle as none. Let's assume show on all if not specified, 
  // OR strictly follow the array.
  const allowedPages = settings.disclaimerPages || [];
  const shouldShow = allowedPages.includes(location.pathname) || allowedPages.length === 0;

  if (!shouldShow) return null;

  return (
    <div className="bg-brand-red/90 text-white overflow-hidden py-2 border-b border-brand-red sticky top-0 z-[60]">
      <div className="whitespace-nowrap flex gap-10">
        <motion.div 
          className="flex gap-10"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        >
          {/* Repeat text to create seamless loop */}
          {[...Array(6)].map((_, i) => (
             <span key={i} className="text-xs uppercase tracking-[0.2em] font-bold flex items-center gap-4">
               ⚠️ {settings.disclaimerText} ⚠️
             </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
