
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Section } from '../components/Section';
import { Star, ArrowRight, ShieldCheck, Heart, Wine, Sparkles, Crown, Lock, X } from 'lucide-react';
import { TESTIMONIALS, PLANS } from '../constants';
import { Plan, Offer } from '../types';
import { api } from '../utils/api';

export const Home: React.FC = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [activeOffers, setActiveOffers] = useState<Offer[]>([]);
  const [showOffer, setShowOffer] = useState(true);

  useEffect(() => {
    api.get('/plans', PLANS.slice(0, 3)).then(setPlans);
    api.get('/offers', []).then((offers: Offer[]) => {
      // Filter only active offers
      setActiveOffers(offers.filter(o => o.isActive));
    });
  }, []);

  return (
    <>
      {/* Hero Section - The Gentleman's Arrival */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
        {/* Parallax Background */}
        <motion.div 
          style={{ y: y1 }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/50 to-transparent z-10"></div>
          {/* Concrete Romantic Image: Man in suit, luxury setting */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504194921103-f8b80cadd5e4?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-70"></div>
        </motion.div>

        <div className="container mx-auto px-4 relative z-20 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <div className="flex justify-center mb-6">
               <motion.div 
                 animate={{ rotate: [0, 5, -5, 0] }}
                 transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
               >
                 <Crown className="w-12 h-12 text-brand-gold drop-shadow-[0_0_20px_rgba(212,175,55,0.6)]" />
               </motion.div>
            </div>
            
            <h2 className="text-brand-gold font-serif text-xs md:text-sm tracking-[0.4em] mb-4 uppercase inline-block border-b border-brand-gold/30 pb-2">
              For the Discerning Woman
            </h2>
            
            <h1 className="text-5xl md:text-7xl lg:text-9xl font-serif font-bold text-white mb-6 leading-[0.9] tracking-tight">
              A GENTLEMAN<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-red-600">AWAITS</span>
            </h1>
            
            <p className="text-gray-300 text-base md:text-xl max-w-xl mx-auto mb-10 font-light leading-relaxed font-serif italic">
              "Indulge in an evening of chivalry, safety, and undeniable charm. We provide the perfect social partner, curated strictly for your comfort."
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
              <Link to="/booking" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-10 py-4 bg-brand-red text-white uppercase tracking-[0.2em] text-xs font-bold transition-all duration-300 hover:bg-red-800 hover:shadow-[0_0_30px_rgba(185,28,28,0.5)] border border-transparent">
                  Secure Reservation
                </button>
              </Link>
              <Link to="/plans" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-10 py-4 border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-black transition-all duration-300 uppercase tracking-[0.2em] text-xs font-bold bg-black/50 backdrop-blur-sm">
                  View Experiences
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- ACTIVE OFFERS & ADVERTISEMENTS SECTION --- */}
      <AnimatePresence>
        {showOffer && activeOffers.length > 0 && (
          <Section className="bg-gradient-to-r from-brand-red/10 to-transparent border-y border-brand-gold/20 py-10 relative">
             <div className="container mx-auto px-4 relative">
                <button 
                  onClick={() => setShowOffer(false)} 
                  className="absolute top-0 right-4 text-gray-500 hover:text-white"
                >
                  <X className="w-5 h-5"/>
                </button>
                
                {activeOffers.map((offer) => (
                  <div key={offer.id} className="text-center max-w-3xl mx-auto py-2">
                    <motion.div
                       initial={{ scale: 0.9, opacity: 0 }}
                       animate={{ scale: 1, opacity: 1 }}
                       transition={{ duration: 0.5 }}
                    >
                      <h3 className="text-brand-gold font-serif text-2xl md:text-3xl font-bold mb-2 flex items-center justify-center gap-3">
                        <Sparkles className="w-6 h-6 animate-pulse" /> {offer.title} <Sparkles className="w-6 h-6 animate-pulse" />
                      </h3>
                      <p className="text-white text-lg font-light italic mb-4">
                        {offer.description}
                      </p>
                      <Link to="/booking">
                         <button className="text-xs uppercase tracking-widest border-b border-brand-red text-brand-red hover:text-white hover:border-white transition-colors pb-1">
                           Claim This Offer
                         </button>
                      </Link>
                    </motion.div>
                  </div>
                ))}
             </div>
          </Section>
        )}
      </AnimatePresence>

      {/* Why Choose Us - The Gentleman's Code */}
      <Section className="bg-[#080808] relative overflow-hidden py-24">
        {/* Background Details */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-b from-brand-red/5 to-transparent rounded-full blur-[100px] pointer-events-none"></div>

        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h3 className="text-brand-gold text-xs uppercase tracking-[0.3em] mb-3">The Gold Standard</h3>
            <h2 className="text-3xl md:text-5xl font-serif text-white">Why Choose The King Play Elite?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
             {[
               { icon: ShieldCheck, title: "Verified & Safe", desc: "Every gentleman is vetted, background-checked, and interviewed to ensure your absolute safety and legal compliance." },
               { icon: Heart, title: "Emotional IQ", desc: "Our companions are masters of conversation, empathy, and making you feel like the center of the world." },
               { icon: Lock, title: "Complete Discretion", desc: "Your identity and your secrets are safe with us. A private affair remains private, always." },
               { icon: Crown, title: "Pure Chivalry", desc: "Old-school manners. He opens doors, pulls out chairs, and treats you with the respect of a queen." },
             ].map((item, idx) => (
               <motion.div 
                 key={idx}
                 whileHover={{ y: -10 }}
                 className="p-8 bg-gradient-to-b from-white/5 to-transparent border border-white/5 hover:border-brand-gold/30 transition-all duration-500 group"
               >
                 <div className="w-14 h-14 bg-black border border-brand-red/30 rounded-full flex items-center justify-center mb-6 group-hover:bg-brand-red group-hover:border-brand-red transition-colors duration-500 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                   <item.icon className="w-6 h-6 text-brand-gold group-hover:text-white transition-colors" />
                 </div>
                 <h3 className="text-xl font-serif text-white mb-3 group-hover:text-brand-gold transition-colors">{item.title}</h3>
                 <p className="text-gray-500 text-sm leading-relaxed group-hover:text-gray-400">{item.desc}</p>
               </motion.div>
             ))}
          </div>
        </div>
      </Section>

      {/* Neo-Romantic Visual Section */}
      <section className="py-24 bg-black relative">
        <div className="container mx-auto px-4">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="relative">
                 <div className="absolute inset-0 bg-brand-gold/10 transform -translate-x-4 -translate-y-4"></div>
                 <img 
                   src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1000&auto=format&fit=crop" 
                   alt="Romantic Dinner" 
                   className="relative z-10 w-full shadow-2xl grayscale hover:grayscale-0 transition-all duration-700" 
                 />
              </div>
              <div className="md:pl-10">
                 <h2 className="text-4xl md:text-5xl font-serif text-white mb-6 leading-tight">
                    An Atmosphere of <br/> <span className="text-brand-red italic">Seduction.</span>
                 </h2>
                 <p className="text-gray-400 mb-6 font-light leading-relaxed">
                    Imagine a night where you don't have to plan a thing. The reservation is made, the wine is selected, and the company is impeccable.
                 </p>
                 <p className="text-gray-400 mb-10 font-light leading-relaxed">
                    Whether it's a high-profile gala, a quiet dinner, or a night out in the city, our gentlemen adapt to your rhythm, ensuring you shine brighter than ever.
                 </p>
                 <Link to="/booking">
                   <div className="inline-flex items-center gap-3 text-brand-gold uppercase tracking-widest text-xs font-bold hover:text-white transition-colors cursor-pointer group">
                      Book Your Experience <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform"/>
                   </div>
                 </Link>
              </div>
           </div>
        </div>
      </section>

      {/* Plans Preview */}
      <Section className="py-24 bg-[#0a0a0a]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif text-white mb-4">Select Your Desire</h2>
            <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-brand-red to-transparent mx-auto"></div>
          </div>

          {plans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan, idx) => (
                <div key={plan.id} className={`relative group ${plan.isPopular ? 'md:-mt-8' : ''}`}>
                  <div className={`h-full bg-black border ${plan.isPopular ? 'border-brand-gold' : 'border-white/10'} p-8 hover:bg-[#111] transition-all duration-500 flex flex-col items-center text-center group-hover:shadow-[0_0_30px_rgba(127,29,29,0.2)]`}>
                    
                    {plan.isPopular && (
                      <div className="bg-brand-gold text-black px-4 py-1 text-[10px] uppercase font-bold tracking-widest mb-6">
                        Most Desired
                      </div>
                    )}

                    <h3 className="text-2xl font-serif text-white mb-2">{plan.name}</h3>
                    <div className="text-[10px] font-bold text-gray-500 mb-6 uppercase tracking-[0.2em]">{plan.duration}</div>
                    
                    <div className="text-3xl font-serif text-brand-red mb-8">{plan.price}</div>
                    
                    <ul className="space-y-4 mb-10 text-left w-full pl-2">
                      {plan.features.slice(0, 4).map((feat, i) => (
                        <li key={i} className="flex items-start gap-3 text-gray-400 text-xs font-light">
                          <Sparkles className="w-3 h-3 text-brand-gold shrink-0 mt-0.5" />
                          {feat}
                        </li>
                      ))}
                    </ul>

                    <Link to="/booking" className="w-full mt-auto">
                      <button className={`w-full py-3 uppercase tracking-[0.2em] text-[10px] font-bold transition-all duration-300 border ${
                        plan.isPopular 
                          ? 'bg-brand-gold text-black border-brand-gold hover:bg-white' 
                          : 'bg-transparent text-white border-white/20 hover:border-brand-red hover:text-brand-red'
                      }`}>
                        Select
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
             <div className="text-center text-gray-500">Loading experiences...</div>
          )}
        </div>
      </Section>

      {/* Testimonials */}
      <Section className="pb-24 pt-12 relative bg-black">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
             <Star className="w-6 h-6 text-brand-gold mx-auto mb-4 fill-current" />
             <h2 className="text-2xl md:text-4xl font-serif text-white">Client Confessions</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t) => (
              <div key={t.id} className="text-center px-4">
                <p className="text-gray-400 italic mb-6 leading-relaxed font-serif text-lg">
                  "{t.text}"
                </p>
                <h4 className="text-brand-gold font-serif font-bold tracking-wide text-sm">{t.name}</h4>
                <span className="text-gray-600 text-[10px] uppercase tracking-wider">{t.role}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
};
