
import React, { useEffect, useState } from 'react';
import { Section } from '../components/Section';
import { api } from '../utils/api';
import { Loader, ShieldCheck } from 'lucide-react';

export const Privacy: React.FC = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/settings', {}).then(data => {
      if (data && data.privacyPolicyContent) {
        setContent(data.privacyPolicyContent);
      } else {
        setContent("Privacy Policy is currently being updated to comply with the latest Digital Personal Data Protection Act. Please contact support for details.");
      }
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-black pt-32 pb-20">
      <Section>
        <div className="container mx-auto px-4 max-w-4xl">
           <div className="flex items-center gap-4 mb-10 border-b border-white/10 pb-6">
               <ShieldCheck className="w-10 h-10 text-brand-gold"/>
               <h1 className="text-4xl md:text-5xl font-serif text-white">Privacy Policy</h1>
           </div>
           
           {loading ? (
             <div className="flex justify-center py-20"><Loader className="animate-spin text-brand-gold"/></div>
           ) : (
             <div className="prose prose-invert prose-lg max-w-none text-gray-300 font-light whitespace-pre-wrap">
               {content}
             </div>
           )}
        </div>
      </Section>
    </div>
  );
};
