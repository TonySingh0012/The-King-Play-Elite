
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Crown, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react';
import { motion, AnimatePresence, SVGMotionProps } from 'framer-motion';
import { DisclaimerBanner } from './DisclaimerBanner';

const NavLink: React.FC<{ to: string; children: React.ReactNode; onClick?: () => void }> = ({ to, children, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      onClick={onClick}
      className={`relative px-4 py-2 text-sm uppercase tracking-[0.15em] transition-colors duration-500 font-serif
      ${isActive ? 'text-brand-gold' : 'text-gray-400 hover:text-white'}`}
    >
      {children}
      {isActive && (
        <motion.div 
          layoutId="navbar-underline"
          className="absolute bottom-0 left-0 right-0 h-px bg-brand-gold shadow-[0_0_10px_#d4af37]"
        />
      )}
    </Link>
  );
};

// Animated Hamburger Icon Component
const MenuToggle = ({ isOpen, toggle }: { isOpen: boolean; toggle: () => void }) => {
  const pathProps: SVGMotionProps<SVGPathElement> = {
    strokeWidth: "2",
    stroke: "currentColor",
    strokeLinecap: "round"
  };

  return (
    <button
      onClick={toggle}
      className="md:hidden relative z-50 p-2 text-brand-gold hover:text-white transition-colors focus:outline-none"
      aria-label="Toggle Menu"
    >
      <svg width="24" height="24" viewBox="0 0 24 24">
        <motion.path
          {...pathProps}
          variants={{
            closed: { d: "M 4 6 L 20 6" },
            open: { d: "M 5 19 L 19 5" }
          }}
          animate={isOpen ? "open" : "closed"}
          transition={{ duration: 0.3 }}
        />
        <motion.path
          {...pathProps}
          d="M 4 12 L 20 12"
          variants={{
            closed: { opacity: 1 },
            open: { opacity: 0 }
          }}
          animate={isOpen ? "open" : "closed"}
          transition={{ duration: 0.1 }}
        />
        <motion.path
          {...pathProps}
          variants={{
            closed: { d: "M 4 18 L 20 18" },
            open: { d: "M 5 5 L 19 19" }
          }}
          animate={isOpen ? "open" : "closed"}
          transition={{ duration: 0.3 }}
        />
      </svg>
    </button>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change & Lock Body Scroll
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  return (
    <div className="min-h-screen flex flex-col bg-brand-dark text-gray-100 selection:bg-brand-red selection:text-white overflow-x-hidden font-sans">
      <DisclaimerBanner />
      {/* Navbar */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] border-b border-white/0
        ${isScrolled || isMobileMenuOpen ? 'bg-[#050505]/90 backdrop-blur-xl border-white/10 py-3 md:py-4 shadow-2xl top-[30px]' : 'bg-transparent py-5 md:py-6 top-[32px]'}`} 
        // Note: top padding adjustment to account for disclaimer banner space
      >
        <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group relative z-50">
            <div className="relative">
              <div className="absolute inset-0 bg-brand-red blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
              <Crown className="w-7 h-7 md:w-8 md:h-8 text-brand-gold relative z-10 drop-shadow-lg" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg md:text-2xl font-serif font-bold tracking-[0.15em] text-white uppercase group-hover:text-brand-gold transition-colors duration-500">
                The King Play Elite
              </span>
              <span className="text-[0.5rem] md:text-[0.6rem] uppercase tracking-[0.4em] text-brand-red hidden md:block text-right">
                Elite Companionship
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/">Sanctuary</NavLink>
            <NavLink to="/plans">Experiences</NavLink>
            <NavLink to="/booking">Reservation</NavLink>
            <NavLink to="/about">Philosophy</NavLink>
            <NavLink to="/contact">Concierge</NavLink>
          </div>

          <div className="hidden md:flex items-center gap-4">
             <Link to="/booking">
                <button className="px-6 py-2.5 bg-gradient-to-r from-brand-red to-[#450a0a] text-white text-[10px] font-bold uppercase tracking-widest hover:shadow-[0_0_25px_rgba(220,38,38,0.6)] transition-all duration-500 border border-red-900/50 hover:border-brand-red transform hover:-translate-y-0.5">
                  Reserve Date
                </button>
             </Link>
          </div>

          {/* Mobile Toggle with Animation */}
          <MenuToggle isOpen={isMobileMenuOpen} toggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: '100vh' }}
              exit={{ opacity: 0, height: 0, transition: { delay: 0.3, duration: 0.3 } }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden fixed inset-0 top-0 left-0 w-full bg-black/95 backdrop-blur-3xl z-40 flex flex-col items-center justify-center overflow-hidden"
            >
               {/* Background decoration */}
               <motion.div 
                 initial={{ opacity: 0, scale: 0.5 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ duration: 1 }}
                 className="absolute top-1/4 left-1/4 w-64 h-64 bg-brand-red/10 rounded-full blur-[80px]"
               />
               <motion.div 
                 initial={{ opacity: 0, scale: 0.5 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ duration: 1, delay: 0.2 }}
                 className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-brand-gold/10 rounded-full blur-[60px]"
               />

               <div className="flex flex-col gap-8 text-center relative z-10 w-full px-8">
                  {[
                    { to: "/", label: "The Sanctuary" },
                    { to: "/plans", label: "Experiences" },
                    { to: "/booking", label: "Private Reservation" },
                    { to: "/about", label: "Our Philosophy" },
                    { to: "/contact", label: "Concierge Support" },
                  ].map((item, i) => (
                    <motion.div
                      key={item.to}
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 20, opacity: 0 }}
                      transition={{ delay: 0.1 + i * 0.1, duration: 0.5, ease: "easeOut" }}
                    >
                      <NavLink to={item.to}>{item.label}</NavLink>
                    </motion.div>
                  ))}
                  
                  <motion.div 
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ delay: 0.6 }}
                    className="pt-8 w-full flex justify-center"
                  >
                    <Link to="/booking" className="w-full max-w-xs">
                      <button className="w-full py-4 bg-brand-red text-white uppercase tracking-widest text-sm font-bold shadow-[0_0_20px_rgba(220,38,38,0.4)] border border-brand-red hover:bg-black hover:text-brand-red transition-all duration-300">
                        Reserve Now
                      </button>
                    </Link>
                  </motion.div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-10 w-full overflow-hidden">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#050505] border-t border-brand-gold/10 pt-20 pb-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-8">
                <Crown className="w-6 h-6 text-brand-gold" />
                <span className="text-xl font-serif font-bold tracking-widest text-white">The King Play Elite</span>
              </Link>
              <p className="text-gray-500 text-sm leading-relaxed mb-8 font-light">
                Curating the art of social companionship. We provide strict professional services for events, dinners, and social gatherings.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-brand-red hover:border-brand-red transition-all duration-300 text-gray-400 hover:text-white">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-brand-red hover:border-brand-red transition-all duration-300 text-gray-400 hover:text-white">
                  <Twitter className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-white font-serif tracking-widest uppercase text-xs mb-8">Discover</h3>
              <ul className="space-y-4 text-sm text-gray-400 font-light">
                <li><Link to="/plans" className="hover:text-brand-gold transition-colors flex items-center gap-2">Premium Experiences</Link></li>
                <li><Link to="/booking" className="hover:text-brand-gold transition-colors flex items-center gap-2">Make a Reservation</Link></li>
                <li><Link to="/about" className="hover:text-brand-gold transition-colors flex items-center gap-2">Legal Code</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-serif tracking-widest uppercase text-xs mb-8">Legal</h3>
              <ul className="space-y-4 text-sm text-gray-400 font-light">
                <li><Link to="/terms" className="hover:text-brand-gold transition-colors">Terms of Service (India)</Link></li>
                <li><Link to="/privacy" className="hover:text-brand-gold transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-serif tracking-widest uppercase text-xs mb-8">Concierge</h3>
              <ul className="space-y-6 text-sm text-gray-400 font-light">
                <li className="flex items-start gap-4">
                  <MapPin className="w-4 h-4 text-brand-red" />
                  <span>Mumbai, India</span>
                </li>
                <li className="flex items-center gap-4">
                  <Phone className="w-4 h-4 text-brand-red" />
                  <span>+91 98765 43210</span>
                </li>
                <li className="flex items-center gap-4">
                  <Mail className="w-4 h-4 text-brand-red" />
                  <span>concierge@thekingplayelite.com</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-[0.2em] text-gray-600">
            <p>&copy; {new Date().getFullYear()} The King Play Elite.</p>
            <p className="mt-2 md:mt-0">18+ Only. Strictly Platonic & Compliant with Indian Law.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
