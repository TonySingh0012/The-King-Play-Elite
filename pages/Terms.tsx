
import React, { useEffect, useState } from 'react';
import { Section } from '../components/Section';
import { api } from '../utils/api';
import { Loader, Scale } from 'lucide-react';

export const Terms: React.FC = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
        // Force a slight delay to ensure api.get uses defaults if needed
        const data = await api.get('/settings', {});
        if (data && data.termsContent) {
            setContent(data.termsContent);
        }
        setLoading(false);
    };
    fetchContent();
  }, []);

  return (
    <div className="min-h-screen bg-black pt-32 pb-20">
      <Section>
        <div className="container mx-auto px-4 max-w-4xl">
           <div className="flex items-center gap-4 mb-10 border-b border-white/10 pb-6">
                <Scale className="w-10 h-10 text-brand-gold"/>
                <div>
                    <h1 className="text-3xl md:text-5xl font-serif text-white">Terms of Service</h1>
                    <p className="text-gray-500 text-sm mt-2">Compliance: IT Act 2000 & Immoral Traffic (Prevention) Act 1956</p>
                </div>
           </div>
           
           {loading ? (
             <div className="flex justify-center py-20"><Loader className="animate-spin text-brand-gold"/></div>
           ) : (
             <div className="bg-white/5 border border-white/10 p-8 rounded-sm">
                <div className="prose prose-invert prose-lg max-w-none text-gray-300 font-light whitespace-pre-wrap leading-relaxed">
                    {content}
                </div>
             </div>
           )}
        </div>
      </Section>
    </div>
  );
};
