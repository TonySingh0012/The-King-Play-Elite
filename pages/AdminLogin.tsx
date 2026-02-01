import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // HARDCODED CREDENTIALS AS PER REQUIREMENT
    if (username === 'Thekingtony0012' && password === 'Tony0012@') {
      localStorage.setItem('kpb_admin_token', 'secure_token_123');
      navigate('/admin-dashboard');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md bg-brand-gray/20 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
        <h2 className="text-3xl font-serif text-white text-center mb-8">Admin Access</h2>
        
        {error && <div className="bg-red-900/50 text-red-200 p-3 rounded mb-4 text-sm text-center">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
             <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
             <input 
              type="text" 
              placeholder="Username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:border-brand-red focus:outline-none"
             />
          </div>
          <div className="relative">
             <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
             <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:border-brand-red focus:outline-none"
             />
          </div>

          <button type="submit" className="w-full bg-brand-red text-white py-3 rounded-lg font-bold hover:bg-red-800 transition-colors">
            Login to Panel
          </button>
        </form>
      </div>
    </div>
  );
};