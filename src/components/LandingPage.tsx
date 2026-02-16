import React from 'react';
import { supabase } from '../lib/supabase'; // Import Supabase to handle logout

interface Props {
  onNavigate: (view: "leaderboard" | "tables") => void;
}

export default function LandingPage({ onNavigate }: Props) {

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-900 flex flex-col relative overflow-y-auto font-sans">
      
      {/* DECORATIVE BACKGROUND ELEMENTS (Fixed position so they don't scroll weirdly) */}
      <div className="fixed top-[-10%] right-[-10%] w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-10%] w-96 h-96 bg-orange-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* MAIN CONTENT WRAPPER */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 w-full max-w-7xl mx-auto space-y-12">
        
        {/* HERO SECTION */}
        <div className="text-center space-y-6 mt-8 md:mt-0">
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <span className="text-blue-400 text-xs font-black uppercase tracking-[0.3em]">Sezona 2026 • Takmičenje 1</span>
          </div>
          <div>
            <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter italic leading-none">
              <span className="text-[#f4b084] block md:inline">TAKMIČENJE</span>
            </h1>
            <p className="mt-4 text-gray-400 text-sm md:text-xl font-medium tracking-wide max-w-md mx-auto">
              Gdje šampioni nastaju i tiketi padaju. Izaberi svoj put.
            </p>
          </div>
        </div>

        {/* NAVIGATION CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          {/* LEADERBOARD CARD */}
          <button 
            onClick={() => onNavigate("leaderboard")}
            className="group relative overflow-hidden bg-white/5 border-2 border-white/10 p-8 rounded-3xl text-left hover:border-yellow-500/50 transition-all duration-500 shadow-2xl"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
              <span className="text-8xl">🏆</span>
            </div>
            <h2 className="text-3xl font-black text-white uppercase mb-2">Podijum</h2>
            <p className="text-gray-400 font-medium mb-6">Provjeri ko je šampion</p>
            <div className="inline-flex items-center gap-2 text-yellow-500 font-bold uppercase text-sm tracking-widest">
              Rang Lista <span className="group-hover:translate-x-2 transition-transform">→</span>
            </div>
          </button>

          {/* PLAYER TABLES CARD */}
          <button 
            onClick={() => onNavigate("tables")}
            className="group relative overflow-hidden bg-white/5 border-2 border-white/10 p-8 rounded-3xl text-left hover:border-blue-500/50 transition-all duration-500 shadow-2xl"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
              <span className="text-8xl">📝</span>
            </div>
            <h2 className="text-3xl font-black text-white uppercase mb-2">Tabele</h2>
            <p className="text-gray-400 font-medium mb-6">Dodaj parove i poboljšaj analizu.</p>
            <div className="inline-flex items-center gap-2 text-blue-500 font-bold uppercase text-sm tracking-widest">
              Srećno <span className="group-hover:translate-x-2 transition-transform">→</span>
            </div>
          </button>
        </div>

        {/* FOOTER STATS */}
        <div className="flex gap-8 md:gap-16 opacity-50 hover:opacity-100 transition-opacity">
          <div className="text-center">
            <div className="text-2xl font-black text-white">5</div>
            <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Igrača</div>
          </div>
          <div className="w-[1px] h-10 bg-white/10" />
          <div className="text-center">
            <div className="text-2xl font-black text-white">LIVE</div>
            <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">BAZA</div>
          </div>
          <div className="w-[1px] h-10 bg-white/10" />
          <div className="text-center">
            <div className="text-2xl font-black text-white">24/7</div>
            <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Updates</div>
          </div>
        </div>
      </div>

      {/* LOGOUT BUTTON SECTION (Pushed to bottom naturally) */}
      <div className="relative z-10 w-full flex justify-center items-center py-8 mt-auto">
        <button 
          onClick={handleLogout}
          className="group flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/5 hover:bg-red-500/10 hover:border-red-500/30 transition-all"
        >
          <div className="w-2 h-2 rounded-full bg-red-500 group-hover:animate-ping" />
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-red-400 transition-colors">
            Log Out
          </span>
        </button>
      </div>

    </div>
  );
}