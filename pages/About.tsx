
import React from 'react';
import { Section } from '../components/Section';
import { Users, Target, Shield, Crown, Sparkles, Scale, FileCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export const About: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <Section className="py-24 relative overflow-hidden bg-black">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-red/10 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent z-10"></div>
        
        {/* Abstract Background Image */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1542259681-d3d63c46e2b9?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center"></div>

        <div className="container mx-auto px-4 relative z-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-4">
               <Crown className="text-brand-gold w-8 h-8" />
               <span className="text-brand-gold font-serif tracking-widest uppercase text-sm">The Legacy</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-serif font-bold text-white mb-8">Who We Are</h1>
            <p className="text-xl md:text-3xl text-gray-300 font-serif italic max-w-4xl leading-relaxed">
              "The King Play Elite is not merely a service; it is an entry into a world where your deepest desires are met with absolute sophistication and legality."
            </p>
          </motion.div>
        </div>
      </Section>

      {/* Values */}
      <Section className="bg-brand-gray/30 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: Sparkles, title: "Our Philosophy", text: "We believe in the art of companionship. Every interaction is curated to be a masterpiece of conversation, elegance, and charm." },
              { icon: Shield, title: "Safety First", text: "We set the benchmark for privacy. Our vetting process is rigorous, ensuring only the crème de la crème join our network. Your data is stored offline." },
              { icon: Users, title: "The Experience", text: "From the moment you book, you are royalty. We handle the details, the reservations, and the atmosphere. You simply enjoy." }
            ].map((item, idx) => (
              <motion.div 
                key={idx} 
                whileHover={{ y: -5 }}
                className="bg-brand-dark p-10 border border-white/5 rounded-none relative overflow-hidden group"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-brand-red group-hover:h-full transition-all duration-300 h-0"></div>
                <item.icon className="w-12 h-12 text-brand-gold mb-8 opacity-80" />
                <h3 className="text-2xl font-serif text-white mb-4 group-hover:text-brand-red transition-colors">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed font-light">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Legal & Safety Compliance Section */}
      <Section className="py-24 bg-black border-y border-white/5">
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                    <h2 className="text-3xl md:text-5xl font-serif text-white mb-6">Uncompromising <br/> Safety & Legality</h2>
                    <p className="text-gray-400 mb-6 font-light leading-relaxed">
                        In an industry often misunderstood, The King Play Elite stands as a beacon of professionalism and compliance. We operate strictly within the legal frameworks of India and International Law.
                    </p>
                    <ul className="space-y-4">
                        <li className="flex items-start gap-3">
                            <Scale className="w-5 h-5 text-brand-gold mt-1"/>
                            <div>
                                <h4 className="text-white font-bold text-sm uppercase">100% Platonic Policy</h4>
                                <p className="text-gray-500 text-xs">We strictly adhere to the Immoral Traffic (Prevention) Act. No illegal services are offered or tolerated.</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <FileCheck className="w-5 h-5 text-brand-gold mt-1"/>
                            <div>
                                <h4 className="text-white font-bold text-sm uppercase">KYC & Verification</h4>
                                <p className="text-gray-500 text-xs">Every client and companion is ID-verified to ensure a safe environment for all parties.</p>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="relative border border-white/10 p-8 bg-brand-gray/20">
                     <div className="absolute -top-4 -right-4 w-20 h-20 bg-brand-red/20 blur-xl rounded-full"></div>
                     <h3 className="text-brand-gold font-serif text-2xl mb-4">Our Promise</h3>
                     <p className="text-gray-300 italic mb-4">
                         "We provide social partners for events, dinners, and travel. We do not provide escort services in the traditional, illegal sense. Our focus is on emotional intelligence, etiquette, and high-society companionship."
                     </p>
                     <div className="flex items-center gap-2 mt-6 border-t border-white/5 pt-4">
                         <Shield className="w-4 h-4 text-green-500"/>
                         <span className="text-xs text-green-500 uppercase tracking-widest font-bold">Legally Compliant • Verified • Safe</span>
                     </div>
                </div>
            </div>
        </div>
      </Section>

      {/* Stats with Parallax Feel */}
      <Section className="py-20 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/10">
             {[
               { num: "Elite", label: "Clientele" },
               { num: "100%", label: "Discretion" },
               { num: "24/7", label: "Concierge" },
               { num: "50+", label: "Luxury Cities" },
             ].map((stat, i) => (
               <div key={i} className="p-6">
                 <div className="text-4xl md:text-6xl font-serif font-bold text-brand-red mb-2">{stat.num}</div>
                 <div className="text-gray-400 uppercase tracking-[0.2em] text-xs md:text-sm">{stat.label}</div>
               </div>
             ))}
          </div>
        </div>
      </Section>
    </div>
  );
};
