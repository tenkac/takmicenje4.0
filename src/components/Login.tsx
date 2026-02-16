import React, { useState } from 'react';
import { supabase } from '../lib/supabase'; // Make sure this path is correct

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 🪄 THE TRICK: Clean the username and add fake domain
    const cleanName = username.trim().toLowerCase();
    const fakeEmail = `${cleanName}@takmicenje.com`;

    const { error } = await supabase.auth.signInWithPassword({
      email: fakeEmail,
      password: password,
    });

    if (error) {
      setError(error.message); // Will say "Invalid login credentials" if wrong
      setLoading(false);
    } else {
      onLogin(); 
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden font-sans">
      <div className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] bg-blue-600/20 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[600px] h-[600px] bg-orange-600/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white mb-2">
            TAKMICENJE <span className="text-blue-500"></span>
          </h1>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-[0.4em]">Authorized Personnel Only</p>
        </div>

        <form onSubmit={handleLogin} className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl shadow-2xl">
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-xs font-bold text-center">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black uppercase text-gray-500 mb-1 ml-2 tracking-widest">USERNAME</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-blue-500 transition-all font-bold uppercase placeholder-gray-600"
                placeholder="VLADO"
                autoFocus
              />
            </div>
            
            <div>
              <label className="block text-[10px] font-black uppercase text-gray-500 mb-1 ml-2 tracking-widest">PASSWORD</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-blue-500 transition-all font-bold placeholder-gray-600"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-black uppercase py-4 rounded-xl shadow-lg shadow-blue-500/25 transition-all active:scale-95 mt-4"
            >
              {loading ? "Authenticating..." : "Enter Arena"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}