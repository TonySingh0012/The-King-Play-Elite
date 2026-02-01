
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Section } from '../components/Section';
import { Check, Crown, Star, Info, ChevronDown, ChevronUp, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plan } from '../types';
import { PLANS } from '../constants';
import { api } from '../utils/api';

export const Plans: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedPlan, setExpandedPlan] = useState<number | string | null>(null);

  useEffect(() => {
    api.get('/plans', PLANS)
      .then(setPlans)
      .finally(() => setLoading(false));
  }, []);

  const toggleDetails = (id: number | string) => {
    setExpandedPlan(expandedPlan === id ? null : id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader className="w-10 h-10 text-brand-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-[#050505]">
      {/* Header */}
      <div className="relative py-32 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519671482538-518b78db1966?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6">Curated Experiences</h1>
            <p className="text-gray-400 max-w-xl mx-auto text-lg font-light font-serif italic">
              "We don't sell time; we create moments. Select the ambiance that fits your desire."
            </p>
          </motion.div>
        </div>
      </div>

      <Section>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div key={plan.id} className="flex flex-col">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className={`flex flex-col relative bg-[#0a0a0a] border overflow-hidden group rounded-t-sm
                    ${plan.isPopular ? 'border-brand-gold/50 shadow-[0_0_50px_rgba(212,175,55,0.1)]' : 'border-white/5 hover:border-brand-red/50'}
                  `}
                >
                  {plan.isPopular && (
                    <div className="bg-brand-gold text-black text-center py-3 font-bold text-xs uppercase tracking-[0.2em] relative z-20">
                      The Gentleman's Choice
                    </div>
                  )}
                  
                  <div className="p-10 flex-grow relative z-10">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                       <Crown className="w-20 h-20 text-white" />
                    </div>

                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-3xl font-serif text-white group-hover:text-brand-red transition-colors">{plan.name}</h3>
                    </div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest mb-8">{plan.duration}</div>
                    
                    <div className="mb-8">
                      <span className="text-5xl font-serif text-brand-gold">{plan.price}</span>
                    </div>

                    <div className="w-12 h-0.5 bg-white/10 mb-8 group-hover:w-full transition-all duration-700"></div>

                    <ul className="space-y-5">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-4 text-gray-300 font-light text-sm">
                          <div className={`p-1 rounded-full border ${plan.isPopular ? 'border-brand-gold text-brand-gold' : 'border-brand-red text-brand-red'}`}>
                            <Check className="w-3 h-3" />
                          </div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-10 pt-0 relative z-10 space-y-3">
                    <Link to={`/booking?plan=${plan.id}`} className="block">
                      <button className={`w-full py-5 text-sm uppercase tracking-[0.2em] font-bold transition-all duration-500
                        ${plan.isPopular 
                          ? 'bg-brand-gold text-black hover:bg-white' 
                          : 'bg-white/5 border border-white/10 text-white hover:bg-brand-red hover:border-brand-red'}
                      `}>
                        Reserve This Date
                      </button>
                    </Link>
                    
                    <button 
                      onClick={() => toggleDetails(plan.id)}
                      className="w-full flex items-center justify-center gap-2 text-xs text-gray-500 hover:text-white uppercase tracking-widest py-2"
                    >
                      {expandedPlan === plan.id ? 'Hide Details' : 'View Full Details'}
                      {expandedPlan === plan.id ? <ChevronUp className="w-3 h-3"/> : <ChevronDown className="w-3 h-3"/>}
                    </button>
                  </div>
                </motion.div>

                {/* Expanded Details Section */}
                <AnimatePresence>
                  {expandedPlan === plan.id && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-brand-gray/20 border-x border-b border-white/10 p-8 rounded-b-sm overflow-hidden"
                    >
                      <h4 className="text-brand-gold font-serif mb-4 flex items-center gap-2">
                        <Info className="w-4 h-4" /> About This Experience
                      </h4>
                      <p className="text-gray-300 leading-relaxed font-light text-sm">
                        {plan.description || "Experience pure elegance and chivalry with this exclusive package."}
                      </p>
                      
                      <div className="mt-6 pt-6 border-t border-white/5">
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Perfect For:</p>
                        <p className="text-white text-sm">Anniversaries, Galas, or simply feeling cherished.</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
};
