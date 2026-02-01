
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Booking, Plan, Offer, SiteSettings } from '../types';
import { BarChart, Users, MessageSquare, Briefcase, LogOut, RefreshCw, Trash, Edit, Eye, Power, Settings, Reply, Save, ShieldAlert, Server, X } from 'lucide-react';
import { api } from '../utils/api';

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'bookings' | 'messages' | 'plans' | 'offers' | 'settings'>('bookings');
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  
  // Settings State
  const [settings, setSettings] = useState<SiteSettings>({
    siteTitle: 'The King Play Elite',
    termsContent: '',
    privacyPolicyContent: '',
    disclaimerText: 'This website is strictly for 18+ adults only.',
    disclaimerPages: ['/'],
    ageGateEnabled: true,
    ageGateTitle: 'Age Verification',
    ageGateContent: 'This website contains material intended for adults. By entering, you acknowledge that you are at least 18 years of age.'
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Plan Form State
  const [isEditingPlan, setIsEditingPlan] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<Partial<Plan>>({
    name: '', price: '', duration: '', features: [], description: '', isPopular: false
  });
  const [featuresInput, setFeaturesInput] = useState('');
  
  // Offer Form State
  const [newOffer, setNewOffer] = useState({ title: '', description: '', isActive: true });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const dataBookings = await api.get('/bookings', []);
      setBookings(dataBookings);

      const dataMessages = await api.get('/messages', []);
      setMessages(dataMessages);

      const dataPlans = await api.get('/plans', []);
      setPlans(dataPlans);
      
      const dataOffers = await api.get('/offers', []);
      setOffers(dataOffers);

      const dataSettings = await api.get('/settings', null);
      if(dataSettings) {
        setSettings(dataSettings);
      }
      
    } catch (error) {
      console.error('Error fetching data:', error);
      alert("Error: Ensure 'node server.js' is running on port 5000");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('kpb_admin_token');
    if (!token) {
      navigate('/admin-login');
      return;
    }
    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('kpb_admin_token');
    navigate('/admin-login');
  };

  // --- BOOKING ACTIONS ---
  const updateStatus = async (id: string, status: 'Approved' | 'Rejected') => {
    try {
      await api.put(`/bookings/${id}`, { status });
      fetchData();
    } catch (e) {
       alert("Update failed. Check Server.");
    }
  };

  const deleteBooking = async (id: string) => {
    if(!confirm("Are you sure you want to delete this booking permanently?")) return;
    try {
      await api.delete(`/bookings/${id}`);
      fetchData();
      setSelectedBooking(null);
    } catch(e) {
      alert("Failed to delete booking.");
    }
  };

  // --- MESSAGE ACTIONS ---
  const deleteMessage = async (id: number) => {
    if(!confirm("Delete this message?")) return;
    try {
      await api.delete(`/messages/${id}`);
      fetchData();
    } catch(e) { alert("Failed to delete"); }
  };

  const replyToMessage = (email: string) => {
    window.location.href = `mailto:${email}?subject=Response from The King Play Elite`;
  };

  // --- PLAN MANAGEMENT ---
  const handlePlanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...currentPlan,
      features: featuresInput.split(',').map(s => s.trim()).filter(s => s !== '')
    };

    try {
      if (isEditingPlan && currentPlan.id) {
        await api.put(`/plans/${currentPlan.id}`, payload);
      } else {
        await api.post('/plans', payload);
      }

      setIsEditingPlan(false);
      setCurrentPlan({ name: '', price: '', duration: '', features: [], description: '', isPopular: false });
      setFeaturesInput('');
      fetchData();
    } catch (err) {
      alert("Failed to save plan.");
    }
  };

  const deletePlan = async (id: number | string) => {
    if (confirm("Are you sure you want to delete this plan?")) {
      try {
        await api.delete(`/plans/${id}`);
        fetchData();
      } catch (err) {
        alert("Failed to delete plan.");
      }
    }
  };

  const editPlan = (plan: Plan) => {
    setCurrentPlan(plan);
    setFeaturesInput(plan.features.join(', '));
    setIsEditingPlan(true);
    setActiveTab('plans');
    window.scrollTo(0,0);
  };

  // --- OFFERS MANAGEMENT ---
  const handleOfferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/offers', newOffer);
      setNewOffer({ title: '', description: '', isActive: true });
      fetchData();
    } catch(err) {
      alert('Failed to add offer');
    }
  };

  const deleteOffer = async (id: number) => {
    if(confirm('Delete this offer?')) {
      try {
        await api.delete(`/offers/${id}`);
        fetchData();
      } catch(err) { alert('Failed to delete'); }
    }
  };

  const toggleOffer = async (id: number, currentStatus: boolean) => {
    try {
      await api.put(`/offers/${id}`, { isActive: !currentStatus });
      fetchData();
    } catch(err) { alert('Failed to update'); }
  };

  // --- SETTINGS MANAGEMENT ---
  const handleSettingsSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        await api.put('/settings', settings);
        alert('Settings saved successfully!');
    } catch(err) {
        alert('Failed to save settings');
    }
  };

  const togglePageInDisclaimer = (page: string) => {
      const current = settings.disclaimerPages || [];
      const updated = current.includes(page) 
        ? current.filter(p => p !== page)
        : [...current, page];
      setSettings({...settings, disclaimerPages: updated});
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Nav */}
      <div className="bg-brand-gray border-b border-white/10 py-4 px-6 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
            <h1 className="text-xl font-serif font-bold">The King Play Elite <span className="text-brand-red">Admin</span></h1>
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-900/20 border border-blue-900 rounded-full">
                <Server className="w-3 h-3 text-blue-500" />
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Local MySQL</span>
            </div>
        </div>

        <div className="flex gap-4">
          <button onClick={fetchData} className="text-brand-gold hover:text-white"><RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} /></button>
          <button onClick={handleLogout} className="text-gray-400 hover:text-white flex items-center gap-2"><LogOut className="w-4 h-4" /> Logout</button>
        </div>
      </div>

      <div className="p-6 md:p-10 container mx-auto">
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-brand-gray/30 p-6 rounded-xl border border-white/5 flex justify-between">
             <div><p className="text-gray-400 text-xs">Total Bookings</p><p className="text-2xl font-bold">{bookings.length}</p></div>
             <Users className="text-brand-gold"/>
          </div>
          <div className="bg-brand-gray/30 p-6 rounded-xl border border-white/5 flex justify-between">
             <div><p className="text-gray-400 text-xs">Pending</p><p className="text-2xl font-bold">{bookings.filter(b => b.status === 'Pending').length}</p></div>
             <BarChart className="text-yellow-500"/>
          </div>
          <div className="bg-brand-gray/30 p-6 rounded-xl border border-white/5 flex justify-between">
             <div><p className="text-gray-400 text-xs">New Messages</p><p className="text-2xl font-bold">{messages.length}</p></div>
             <MessageSquare className="text-blue-500"/>
          </div>
          <div className="bg-brand-gray/30 p-6 rounded-xl border border-white/5 flex justify-between">
             <div><p className="text-gray-400 text-xs">Active Plans</p><p className="text-2xl font-bold">{plans.length}</p></div>
             <Briefcase className="text-green-500"/>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-white/10 overflow-x-auto">
           {['bookings', 'messages', 'plans', 'offers', 'settings'].map(tab => (
             <button 
               key={tab}
               onClick={() => setActiveTab(tab as any)}
               className={`pb-3 px-4 text-sm uppercase tracking-widest font-bold transition-colors whitespace-nowrap ${activeTab === tab ? 'text-brand-gold border-b-2 border-brand-gold' : 'text-gray-500 hover:text-white'}`}
             >
               {tab}
             </button>
           ))}
        </div>

        {/* --- BOOKINGS TAB --- */}
        {activeTab === 'bookings' && (
          <div className="bg-brand-gray/20 rounded-xl border border-white/5 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-white/5 text-gray-400 uppercase text-xs">
                <tr>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Plan</th>
                  <th className="p-4">Date/Time</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-300 divide-y divide-white/5">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-white/5">
                    <td className="p-4">
                      <div className="font-bold text-white">{booking.customerName}</div>
                      <div className="text-xs text-gray-500">{booking.phone}</div>
                    </td>
                    <td className="p-4">{booking.plan}</td>
                    <td className="p-4 text-xs">
                      {new Date(booking.date || booking['created_at'] || Date.now()).toLocaleDateString()} <br/> {booking.time}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${booking.status === 'Approved' ? 'text-green-400 bg-green-900/20' : booking.status === 'Rejected' ? 'text-red-400 bg-red-900/20' : 'text-yellow-400 bg-yellow-900/20'}`}>{booking.status}</span>
                    </td>
                    <td className="p-4 flex gap-2">
                       <button onClick={() => setSelectedBooking(booking)} className="p-2 bg-blue-900/20 text-blue-400 rounded hover:bg-blue-900/50" title="View"><Eye className="w-4 h-4"/></button>
                       <button onClick={() => deleteBooking(booking.id)} className="p-2 bg-red-900/20 text-red-400 rounded hover:bg-red-900/50" title="Delete"><Trash className="w-4 h-4"/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* --- MESSAGES TAB --- */}
        {activeTab === 'messages' && (
           <div className="grid gap-4">
              {messages.length === 0 && <p className="text-gray-500 text-center py-10">No messages yet.</p>}
              {messages.map(msg => (
                <div key={msg.id} className="bg-brand-gray/20 border border-white/5 p-4 rounded-xl flex justify-between items-start">
                   <div>
                       <div className="flex justify-between mb-2 gap-4">
                          <h4 className="font-bold text-brand-gold">{msg.name} <span className="text-gray-500 font-normal text-sm">&lt;{msg.email}&gt;</span></h4>
                          <span className="text-xs text-gray-600">{new Date(msg.created_at).toLocaleDateString()}</span>
                       </div>
                       <p className="text-gray-300 text-sm whitespace-pre-wrap">{msg.message}</p>
                   </div>
                   <div className="flex gap-2 ml-4">
                      <button onClick={() => replyToMessage(msg.email)} className="p-2 bg-blue-900/20 text-blue-400 rounded hover:bg-blue-900/50" title="Reply via Email"><Reply className="w-4 h-4"/></button>
                      <button onClick={() => deleteMessage(msg.id)} className="p-2 bg-red-900/20 text-red-400 rounded hover:bg-red-900/50" title="Delete Message"><Trash className="w-4 h-4"/></button>
                   </div>
                </div>
              ))}
           </div>
        )}

        {/* --- PLANS MANAGEMENT TAB --- */}
        {activeTab === 'plans' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-brand-gray/20 border border-white/10 p-6 rounded-xl sticky top-24">
                 <h3 className="text-lg font-bold mb-4 text-white">{isEditingPlan ? 'Edit Plan' : 'Add New Plan'}</h3>
                 <form onSubmit={handlePlanSubmit} className="space-y-4">
                    <input required placeholder="Plan Name" value={currentPlan.name} onChange={e => setCurrentPlan({...currentPlan, name: e.target.value})} className="w-full bg-black border border-white/10 p-3 text-sm rounded text-white"/>
                    <input required placeholder="Price" value={currentPlan.price} onChange={e => setCurrentPlan({...currentPlan, price: e.target.value})} className="w-full bg-black border border-white/10 p-3 text-sm rounded text-white"/>
                    <input required placeholder="Duration" value={currentPlan.duration} onChange={e => setCurrentPlan({...currentPlan, duration: e.target.value})} className="w-full bg-black border border-white/10 p-3 text-sm rounded text-white"/>
                    <textarea required placeholder="Description..." rows={3} value={currentPlan.description} onChange={e => setCurrentPlan({...currentPlan, description: e.target.value})} className="w-full bg-black border border-white/10 p-3 text-sm rounded text-white"/>
                    <textarea required placeholder="Features (Comma separated)" rows={3} value={featuresInput} onChange={e => setFeaturesInput(e.target.value)} className="w-full bg-black border border-white/10 p-3 text-sm rounded text-white"/>
                    <label className="flex items-center gap-2 text-sm text-gray-400">
                      <input type="checkbox" checked={currentPlan.isPopular} onChange={e => setCurrentPlan({...currentPlan, isPopular: e.target.checked})} /> Recommended?
                    </label>
                    <div className="flex gap-2 pt-2">
                       <button type="submit" className="flex-1 bg-brand-gold text-black py-2 font-bold rounded hover:bg-white">{isEditingPlan ? 'Update' : 'Add'}</button>
                       {isEditingPlan && <button type="button" onClick={() => { setIsEditingPlan(false); setCurrentPlan({name:'',price:'',duration:'',features:[],description:''}); setFeaturesInput(''); }} className="bg-gray-700 text-white px-4 rounded">Cancel</button>}
                    </div>
                 </form>
              </div>
            </div>
            <div className="lg:col-span-2 space-y-4">
              {plans.map(plan => (
                 <div key={plan.id} className="bg-brand-gray/20 border border-white/5 p-4 rounded-xl flex justify-between items-start group hover:border-brand-gold/30 transition-colors">
                    <div>
                       <h4 className="font-bold text-lg text-white">{plan.name} {plan.isPopular && <span className="text-[10px] bg-brand-gold text-black px-1 ml-2 rounded">POPULAR</span>}</h4>
                       <p className="text-brand-red font-bold text-sm">{plan.price} • {plan.duration}</p>
                    </div>
                    <div className="flex gap-2">
                       <button onClick={() => editPlan(plan)} className="p-2 bg-blue-900/20 text-blue-400 rounded hover:bg-blue-900/50"><Edit className="w-4 h-4"/></button>
                       <button onClick={() => deletePlan(plan.id)} className="p-2 bg-red-900/20 text-red-400 rounded hover:bg-red-900/50"><Trash className="w-4 h-4"/></button>
                    </div>
                 </div>
              ))}
            </div>
          </div>
        )}

        {/* --- OFFERS TAB --- */}
        {activeTab === 'offers' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-brand-gray/20 border border-white/10 p-6 rounded-xl sticky top-24">
                 <h3 className="text-lg font-bold mb-4 text-white">Add Advertisement</h3>
                 <form onSubmit={handleOfferSubmit} className="space-y-4">
                    <input required placeholder="Title" value={newOffer.title} onChange={e => setNewOffer({...newOffer, title: e.target.value})} className="w-full bg-black border border-white/10 p-3 text-sm rounded text-white"/>
                    <textarea required placeholder="Details..." rows={3} value={newOffer.description} onChange={e => setNewOffer({...newOffer, description: e.target.value})} className="w-full bg-black border border-white/10 p-3 text-sm rounded text-white"/>
                    <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                      <input type="checkbox" checked={newOffer.isActive} onChange={e => setNewOffer({...newOffer, isActive: e.target.checked})} /> Show Immediately
                    </label>
                    <button type="submit" className="w-full bg-brand-red text-white py-2 font-bold rounded">Publish</button>
                 </form>
              </div>
            </div>
            <div className="lg:col-span-2 space-y-4">
              {offers.map(offer => (
                <div key={offer.id} className="bg-brand-gray/20 border border-white/5 p-5 rounded-xl flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-lg text-white">{offer.title} <span className={`text-[10px] px-2 rounded ${offer.isActive ? 'bg-green-900 text-green-400' : 'bg-gray-800'}`}>{offer.isActive ? 'Live' : 'Hidden'}</span></h4>
                    <p className="text-gray-300 text-sm">{offer.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => toggleOffer(offer.id, offer.isActive)} className="p-2 bg-yellow-900/20 text-yellow-500 rounded"><Power className="w-4 h-4"/></button>
                    <button onClick={() => deleteOffer(offer.id)} className="p-2 bg-red-900/20 text-red-400 rounded"><Trash className="w-4 h-4"/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- SETTINGS TAB --- */}
        {activeTab === 'settings' && (
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Age Gate Settings */}
                <div className="bg-brand-gray/20 border border-white/10 p-8 rounded-xl">
                   <h3 className="text-2xl font-serif text-white mb-6 flex items-center gap-3">
                        <ShieldAlert className="w-6 h-6 text-brand-red"/> Age Verification Popup
                    </h3>
                    <div className="space-y-6">
                        <label className="flex items-center gap-3 cursor-pointer p-4 bg-white/5 rounded border border-white/10 hover:bg-white/10">
                            <input 
                                type="checkbox"
                                checked={settings.ageGateEnabled}
                                onChange={e => setSettings({...settings, ageGateEnabled: e.target.checked})}
                                className="w-5 h-5 accent-brand-red"
                            />
                            <div>
                              <span className="block text-white font-bold">Enable Age Gate Popup</span>
                              <span className="text-xs text-gray-400">Forces users to confirm they are 18+ before viewing the site.</span>
                            </div>
                        </label>

                        <div>
                            <label className="block text-sm uppercase tracking-widest text-brand-gold mb-2">Popup Title</label>
                            <input 
                                className="w-full bg-black border border-white/10 p-4 text-white rounded focus:border-brand-gold focus:outline-none"
                                value={settings.ageGateTitle}
                                onChange={e => setSettings({...settings, ageGateTitle: e.target.value})}
                                placeholder="Age Verification"
                            />
                        </div>

                        <div>
                            <label className="block text-sm uppercase tracking-widest text-brand-gold mb-2">Warning Message Content</label>
                            <textarea 
                                className="w-full bg-black border border-white/10 p-4 text-white rounded focus:border-brand-gold focus:outline-none h-32"
                                value={settings.ageGateContent}
                                onChange={e => setSettings({...settings, ageGateContent: e.target.value})}
                            />
                        </div>
                    </div>
                </div>

                {/* General Content Settings */}
                <div className="bg-brand-gray/20 border border-white/10 p-8 rounded-xl">
                    <h3 className="text-2xl font-serif text-white mb-6 flex items-center gap-3">
                        <Settings className="w-6 h-6 text-brand-gold"/> General Content
                    </h3>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm uppercase tracking-widest text-brand-gold mb-2">Website Title</label>
                            <input 
                                className="w-full bg-black border border-white/10 p-4 text-white rounded focus:border-brand-gold focus:outline-none"
                                value={settings.siteTitle}
                                onChange={e => setSettings({...settings, siteTitle: e.target.value})}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm uppercase tracking-widest text-brand-gold mb-2">Terms & Conditions Content</label>
                            <textarea 
                                className="w-full bg-black border border-white/10 p-4 text-white rounded focus:border-brand-gold focus:outline-none h-64"
                                value={settings.termsContent}
                                onChange={e => setSettings({...settings, termsContent: e.target.value})}
                                placeholder="Paste your full Terms & Conditions here..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm uppercase tracking-widest text-brand-gold mb-2">Privacy Policy Content</label>
                            <textarea 
                                className="w-full bg-black border border-white/10 p-4 text-white rounded focus:border-brand-gold focus:outline-none h-64"
                                value={settings.privacyPolicyContent}
                                onChange={e => setSettings({...settings, privacyPolicyContent: e.target.value})}
                                placeholder="Paste your full Privacy Policy here..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm uppercase tracking-widest text-brand-gold mb-2">Scrolling Disclaimer Text (Marquee)</label>
                            <input 
                                className="w-full bg-black border border-white/10 p-4 text-white rounded focus:border-brand-gold focus:outline-none"
                                value={settings.disclaimerText}
                                onChange={e => setSettings({...settings, disclaimerText: e.target.value})}
                            />
                        </div>

                        <div>
                            <label className="block text-sm uppercase tracking-widest text-brand-gold mb-4">Show Disclaimer On:</label>
                            <div className="flex gap-6 flex-wrap">
                                {['/', '/plans', '/booking', '/about', '/contact', '/terms', '/privacy'].map(path => (
                                    <label key={path} className="flex items-center gap-2 cursor-pointer bg-white/5 px-4 py-2 rounded hover:bg-white/10">
                                        <input 
                                            type="checkbox" 
                                            checked={settings.disclaimerPages?.includes(path)}
                                            onChange={() => togglePageInDisclaimer(path)}
                                        />
                                        <span className="text-sm text-gray-300">{path === '/' ? 'Home Page' : path.replace('/', '')}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="sticky bottom-4 bg-black/80 backdrop-blur p-4 border-t border-white/10 rounded-xl flex justify-end">
                    <button onClick={handleSettingsSave} className="px-8 py-3 bg-brand-gold text-black font-bold uppercase tracking-widest rounded hover:bg-white flex items-center gap-2 shadow-lg hover:shadow-brand-gold/20 transition-all">
                        <Save className="w-4 h-4" /> Save All Settings
                    </button>
                </div>
            </div>
        )}

      </div>

      {/* View Booking Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
           <div className="bg-[#111] border border-brand-gold/30 w-full max-w-lg rounded-xl p-8 relative shadow-2xl">
              <button onClick={() => setSelectedBooking(null)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X className="w-6 h-6"/></button>
              <h3 className="text-2xl font-serif text-brand-gold mb-1">Booking #{selectedBooking.id}</h3>
              <p className="text-gray-500 text-sm mb-6">Status: <span className="text-white uppercase">{selectedBooking.status}</span></p>
              
              <div className="space-y-3 text-sm text-gray-300">
                 <p><strong className="text-gray-500 uppercase text-xs block">Customer:</strong> {selectedBooking.customerName} ({selectedBooking.age} yrs)</p>
                 <p><strong className="text-gray-500 uppercase text-xs block">Contact:</strong> {selectedBooking.phone} / {selectedBooking.email}</p>
                 <p><strong className="text-gray-500 uppercase text-xs block">Experience:</strong> {selectedBooking.plan}</p>
                 <p><strong className="text-gray-500 uppercase text-xs block">Location:</strong> {selectedBooking.address}, {selectedBooking.city}, {selectedBooking.state}</p>
                 <p><strong className="text-gray-500 uppercase text-xs block">Time:</strong> {new Date(selectedBooking.date || selectedBooking['created_at'] || Date.now()).toLocaleDateString()} @ {selectedBooking.time}</p>
                 <div className="bg-white/5 p-2 rounded"><strong className="text-gray-500 uppercase text-xs block">Notes:</strong> {selectedBooking.specialRequirements || "None"}</div>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-3">
                 <button onClick={() => { updateStatus(selectedBooking.id, 'Approved'); setSelectedBooking(null); }} className="bg-green-900/30 text-green-400 py-3 rounded border border-green-900/50 hover:bg-green-900/50">Approve</button>
                 <button onClick={() => { updateStatus(selectedBooking.id, 'Rejected'); setSelectedBooking(null); }} className="bg-red-900/30 text-red-400 py-3 rounded border border-red-900/50 hover:bg-red-900/50">Reject</button>
                 <button onClick={() => deleteBooking(selectedBooking.id)} className="col-span-2 bg-gray-800 text-gray-400 py-3 rounded border border-gray-700 hover:bg-red-900 hover:text-white hover:border-red-500">Permanently Delete</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
