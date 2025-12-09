
import React, { useState } from 'react';
import { ShieldCheck, Lock, Fingerprint, Loader2 } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate auth delay for "security check"
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-10 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
        
        <div className="flex flex-col items-center mb-10">
          <div className="p-4 bg-green-50 rounded-2xl mb-4">
            <ShieldCheck size={40} className="text-brand-primary" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Smart Waste Security</h1>
          <p className="text-slate-500 text-sm mt-2">Authorized Personnel Access Only</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wide ml-1">Identity</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Fingerprint size={20} />
              </div>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all font-medium"
                placeholder="Operative ID"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wide ml-1">Credentials</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock size={20} />
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all font-medium"
                placeholder="••••••••••••"
                required
              />
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-brand-primary hover:bg-emerald-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <Lock size={20} />
                  <span>Secure Sign In</span>
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center pt-8 border-t border-slate-50">
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest flex items-center justify-center gap-2">
            <ShieldCheck size={12} /> AES-256 Encrypted Connection
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
