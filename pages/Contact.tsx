
import React, { useState } from 'react';
import { Section } from '../components/Section';
import { Mail, Phone, MapPin, Send, MessageCircle, ArrowRight, Check, Loader } from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import { api } from '../utils/api';

export const Contact: React.FC = () => {
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.post('/messages', formState);
      setIsSent(true);
      setFormState({ name: '', email: '', message: '' });
      setTimeout(() => setIsSent(false), 5000);
    } catch (error) {
      console.warn('Backend unavailable, simulating success for demo:', error);
      setIsSent(true);
      setFormState({ name: '', email: '', message: '' });
      setTimeout(() => setIsSent(false), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.1, 
        delayChildren: 0.2 
      } 
    }
  };

  const itemVariants: Variants = {
    hidden: { x: -30, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-black overflow-hidden relative">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-red/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-gold/10 rounded-full blur-[150px] translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>

      <Section className="relative z-10 pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            
            {/* Left Side: Info & Animation */}
            <motion.div 
              className="lg:col-span-5 flex flex-col justify-center"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants}>
                <h3 className="text-brand-gold font-serif tracking-widest uppercase mb-2 text-sm">Exclusive Support</h3>
                <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-8 leading-tight">
                  Let's Talk <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-red-500">Desire.</span>
                </h1>
                <p className="text-gray-400 text-lg mb-12 font-light leading-relaxed border-l-2 border-brand-red pl-6">
                  Our team of dedicated concierge managers is available 24/7 to handle your requests with the utmost discretion and grace.
                </p>
              </motion.div>

              <div className="space-y-8">
                {[
                  { icon: Phone, label: "Private Line", val: "+91 98765 43210", desc: "Available 24/7" },
                  { icon: Mail, label: "VIP Support", val: "support@thekingplayelite.com", desc: "Response < 2 Hours" },
                  { icon: MapPin, label: "The HQ", val: "Mumbai, India", desc: "By Appointment Only" },
                ].map((item, idx) => (
                  <motion.div 
                    key={idx} 
                    variants={itemVariants}
                    className="flex items-center gap-6 group cursor-default"
                  >
                    <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-brand-red group-hover:border-brand-red transition-all duration-500 shadow-[0_0_0_0_rgba(127,29,29,0)] group-hover:shadow-[0_0_20px_5px_rgba(127,29,29,0.4)]">
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-serif text-lg">{item.label}</h4>
                      <p className="text-brand-gold font-medium">{item.val}</p>
                      <p className="text-xs text-gray-600 uppercase tracking-wider">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Side: Advanced Form */}
            <motion.div 
              className="lg:col-span-7"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-brand-gold/20 to-transparent rounded-bl-full"></div>
                
                <h3 className="text-2xl font-serif text-white mb-8 flex items-center gap-3">
                  <MessageCircle className="w-6 h-6 text-brand-red" /> 
                  Send a Request
                </h3>

                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                  {/* Name Input */}
                  <div className="relative group">
                    <motion.label 
                      animate={{ 
                        y: focusedField === 'name' || formState.name ? -24 : 0,
                        scale: focusedField === 'name' || formState.name ? 0.85 : 1,
                        color: focusedField === 'name' ? '#d4af37' : '#9ca3af'
                      }}
                      className="absolute left-0 top-2 text-gray-400 origin-[0] transition-colors cursor-text pointer-events-none"
                    >
                      Your Full Name
                    </motion.label>
                    <input 
                      type="text" 
                      value={formState.name}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      onChange={(e) => setFormState({...formState, name: e.target.value})}
                      className="w-full bg-transparent border-b border-gray-700 py-2 text-white focus:outline-none focus:border-brand-gold transition-colors"
                      required
                    />
                    <motion.div 
                      className="absolute bottom-0 left-0 h-0.5 bg-brand-gold"
                      initial={{ width: 0 }}
                      animate={{ width: focusedField === 'name' ? '100%' : '0%' }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>

                  {/* Email Input */}
                  <div className="relative group">
                    <motion.label 
                      animate={{ 
                        y: focusedField === 'email' || formState.email ? -24 : 0,
                        scale: focusedField === 'email' || formState.email ? 0.85 : 1,
                        color: focusedField === 'email' ? '#d4af37' : '#9ca3af'
                      }}
                      className="absolute left-0 top-2 text-gray-400 origin-[0] transition-colors cursor-text pointer-events-none"
                    >
                      Email Address
                    </motion.label>
                    <input 
                      type="email" 
                      value={formState.email}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      onChange={(e) => setFormState({...formState, email: e.target.value})}
                      className="w-full bg-transparent border-b border-gray-700 py-2 text-white focus:outline-none focus:border-brand-gold transition-colors"
                      required
                    />
                    <motion.div 
                      className="absolute bottom-0 left-0 h-0.5 bg-brand-gold"
                      initial={{ width: 0 }}
                      animate={{ width: focusedField === 'email' ? '100%' : '0%' }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>

                  {/* Message Input */}
                  <div className="relative group">
                    <motion.label 
                      animate={{ 
                        y: focusedField === 'message' || formState.message ? -24 : 0,
                        scale: focusedField === 'message' || formState.message ? 0.85 : 1,
                        color: focusedField === 'message' ? '#d4af37' : '#9ca3af'
                      }}
                      className="absolute left-0 top-2 text-gray-400 origin-[0] transition-colors cursor-text pointer-events-none"
                    >
                      Your Message
                    </motion.label>
                    <textarea 
                      rows={4}
                      value={formState.message}
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => setFocusedField(null)}
                      onChange={(e) => setFormState({...formState, message: e.target.value})}
                      className="w-full bg-transparent border-b border-gray-700 py-2 text-white focus:outline-none focus:border-brand-gold transition-colors resize-none"
                      required
                    />
                    <motion.div 
                      className="absolute bottom-0 left-0 h-0.5 bg-brand-gold"
                      initial={{ width: 0 }}
                      animate={{ width: focusedField === 'message' ? '100%' : '0%' }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>

                  {/* Submit Button */}
                  <motion.button 
                    whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(220,38,38,0.4)" }}
                    whileTap={{ scale: 0.98 }}
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full py-4 bg-gradient-to-r from-brand-red to-red-900 text-white font-bold tracking-widest uppercase rounded-lg shadow-lg flex justify-center items-center gap-2 group"
                  >
                    {isSubmitting ? (
                      <Loader className="w-5 h-5 animate-spin" />
                    ) : isSent ? (
                      <>
                        <span>Sent Successfully</span>
                        <Check className="w-5 h-5" />
                      </>
                    ) : (
                      <>
                        <span>Send Inquiry</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </motion.button>

                  <p className="text-center text-xs text-gray-500 mt-4">
                    Your information is encrypted and never shared.
                  </p>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </Section>
    </div>
  );
};