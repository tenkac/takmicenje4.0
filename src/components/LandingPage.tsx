import React from 'react';

interface Props {
  onNavigate: (view: "leaderboard" | "tables") => void;
}

export default function LandingPage({ onNavigate }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <h1 className="text-4xl md:text-6xl font-black mb-12 text-[#f4b084] tracking-widest uppercase text-center">
        Takmicenje 
      </h1>

      <div className="flex flex-col md:flex-row gap-8">
        <button 
          onClick={() => onNavigate("leaderboard")}
          className="w-64 h-40 text-2xl font-bold bg-[#f4b084] text-black rounded-xl hover:scale-105 transition shadow-lg flex items-center justify-center border-4 border-orange-600"
        >
          🏆 Podijum
        </button>

        <button 
          onClick={() => onNavigate("tables")}
          className="w-64 h-40 text-2xl font-bold bg-white text-black rounded-xl hover:scale-105 transition shadow-lg flex items-center justify-center border-4 border-gray-400"
        >
          📝 Igraci
        </button>
      </div>
    </div>
  );
}