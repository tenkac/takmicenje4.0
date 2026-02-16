import React from 'react';
import { AllPlayersData, PLAYERS } from '../types';

interface Props {
  allBets: AllPlayersData;
  onBack: () => void;
}

const PLAYER_THEMES: Record<string, { bg: string, text: string, icon: string }> = {
  "Vlado":  { bg: "bg-blue-600",   text: "text-blue-600",   icon: "/Avatars/vlado.jpg" },
  "Fika":   { bg: "bg-red-600",    text: "text-red-600",    icon: "/Avatars/fika.jpg" },
  "Labud":  { bg: "bg-green-600",  text: "text-green-600",  icon: "/Avatars/labud.jpg" },
  "Ilija":  { bg: "bg-purple-600", text: "text-purple-600", icon: "/Avatars/ilija.jpg" },
  "Dzoni":  { bg: "bg-yellow-500", text: "text-yellow-600", icon: "/Avatars/dzoni.jpg" },
};

export default function Leaderboard({ allBets, onBack }: Props) {
  
  const calculateTotal = (playerName: string) => {
    const rows = allBets[playerName] || [];
    let total = 0;
    rows.forEach((row) => {
      if (row.match1.status === "win") total += row.match1.odds;
      if (row.match2.status === "win") total += row.match2.odds;
    });
    return parseFloat(total.toFixed(2));
  };

  const rankings = PLAYERS.map(player => ({
    name: player,
    score: calculateTotal(player)
  })).sort((a, b) => b.score - a.score);

  return (
    // DARK CHAMPIONSHIP BACKGROUND
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 p-4 md:p-8 font-sans text-white relative overflow-hidden">
      
      {/* BACKGROUND GLOW EFFECT */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-orange-500/20 blur-[80px] md:blur-[120px] rounded-full pointer-events-none" />

      {/* NAVIGATION */}
      <button 
        onClick={onBack} 
        className="relative z-10 mb-6 bg-white/10 backdrop-blur-md text-white border border-white/20 px-4 py-2 md:px-6 md:py-3 rounded-xl font-bold shadow-xl hover:bg-white/20 transition text-xs md:text-base"
      >
        ←  Nazad
      </button>

      <div className="relative z-10 max-w-2xl mx-auto border-2 border-white/10 shadow-2xl rounded-3xl bg-black/40 backdrop-blur-xl overflow-hidden">
          
          {/* HEADER */}
          <div className="bg-gradient-to-r from-transparent via-white/5 to-transparent text-[#f4b084] text-2xl md:text-4xl font-black text-center py-6 md:py-8 uppercase tracking-[0.2em] border-b border-white/10">
              🏆 PODIJUM
          </div>

          {/* RANK LIST */}
          <div className="flex flex-col">
            {rankings.map((rank, index) => {
                const theme = PLAYER_THEMES[rank.name] || { bg: "bg-gray-500", text: "text-gray-500", icon: "" };
                
                // Styling based on position
                let rankBox = "bg-white/5 border-white/10";
                let medal = `#${index + 1}`;
                let glow = "";
                
                if (index === 0) {
                    rankBox = "bg-yellow-500/20 border-yellow-500/50 text-yellow-400";
                    medal = "🥇";
                    glow = "shadow-[0_0_20px_rgba(234,179,8,0.2)]";
                } else if (index === 1) {
                    rankBox = "bg-gray-400/20 border-gray-400/50 text-gray-300";
                    medal = "🥈";
                } else if (index === 2) {
                    rankBox = "bg-orange-400/20 border-orange-400/50 text-orange-300";
                    medal = "🥉";
                }

                return (
                    <div 
                        key={rank.name} 
                        className={`flex items-center p-4 md:p-6 border-b border-white/5 last:border-b-0 hover:bg-white/5 transition-colors group`}
                    >
                        
                        {/* RANK BADGE */}
                        <div className={`w-12 h-12 md:w-16 md:h-16 flex-shrink-0 flex items-center justify-center text-xl md:text-3xl font-black border rounded-2xl ${rankBox} ${glow} transition-transform group-hover:scale-110`}>
                            {medal}
                        </div>

                        {/* AVATAR */}
                        <div className={`ml-4 md:ml-6 w-14 h-14 md:w-20 md:h-20 flex-shrink-0 rounded-2xl border-2 border-white/20 shadow-lg overflow-hidden ${theme.bg}`}>
                            <img src={theme.icon} alt={rank.name} className="w-full h-full object-cover" />
                        </div>

                        {/* NAME & TREND */}
                        <div className="ml-4 md:ml-6 flex-grow flex flex-col justify-center">
                            <div className="flex items-center gap-2">
                                <span className={`text-xl md:text-3xl font-black uppercase tracking-tight leading-none ${index === 0 ? 'text-white' : 'text-gray-300'}`}>
                                    {rank.name}
                                </span>
                                {/* TREND INDICATOR (Simulated) */}
                                {index === 0 && <span className="animate-pulse text-green-400 text-xs md:text-sm">▲</span>}
                            </div>
                            {index === 0 && (
                                <span className="text-[10px] md:text-xs font-bold text-yellow-500 uppercase tracking-widest mt-1">
                                    Doktor Analize
                                </span>
                            )}
                        </div>

                        {/* SCORE */}
                        <div className="text-right flex-shrink-0">
                            <span className={`block text-2xl md:text-4xl font-black leading-none ${index === 0 ? 'text-yellow-500' : 'text-white'}`}>
                                {rank.score.toFixed(2)}
                            </span>
                            <span className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest">Poena</span>
                        </div>
                    </div>
                );
            })}
          </div>
      </div>
      
      {/* DECORATIVE FOOTER */}
      <div className="mt-8 text-center text-gray-600 text-[10px] uppercase tracking-[0.3em] font-bold">
        Takmicenje 1 • Sezona 2026
      </div>
    </div>
  );
}