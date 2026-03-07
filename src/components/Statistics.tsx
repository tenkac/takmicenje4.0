import React from 'react';
import { AllPlayersData, PLAYERS } from '../types';

interface Props {
  allBets: AllPlayersData;
  onBack: () => void;
}

// 1. IMPORT THE SAME THEMES USED ON THE LEADERBOARD
const PLAYER_THEMES: Record<string, { bg: string, text: string, border: string, icon: string, gradient: string }> = {
  "Vlado":  { bg: "bg-blue-600",   text: "text-blue-500",   border: "border-blue-500/30",   icon: "/Avatars/vlado.jpg", gradient: "from-blue-600 to-blue-400" },
  "Fika":   { bg: "bg-red-600",    text: "text-red-500",    border: "border-red-500/30",    icon: "/Avatars/fika.jpg", gradient: "from-red-600 to-red-400" },
  "Labud":  { bg: "bg-green-600",  text: "text-green-500",  border: "border-green-500/30",  icon: "/Avatars/labud.jpg", gradient: "from-green-600 to-green-400" },
  "Ilija":  { bg: "bg-purple-600", text: "text-purple-500", border: "border-purple-500/30", icon: "/Avatars/ilija.jpg", gradient: "from-purple-600 to-purple-400" },
  "Dzoni":  { bg: "bg-yellow-500", text: "text-yellow-500", border: "border-yellow-500/30", icon: "/Avatars/dzoni.jpg", gradient: "from-yellow-600 to-yellow-400" },
};

export default function Statistics({ allBets, onBack }: Props) {
  // --- CALCULATE STATS ---
  const playerStats = PLAYERS.map(player => {
    const rows = allBets[player] || [];
    let totalResolved = 0;
    let wins = 0;
    let totalPlayedOdds = 0;
    let totalPlayedCount = 0;
    let totalWonOdds = 0;

    rows.forEach(row => {
      [row.match1, row.match2].forEach(m => {
        if (m.status !== 'empty') {
          totalPlayedOdds += m.odds;
          totalPlayedCount++;
          
          if (m.status === 'win' || m.status === 'loss') {
            totalResolved++;
            if (m.status === 'win') {
              wins++;
              totalWonOdds += m.odds;
            }
          }
        }
      });
    });

    const hitRate = totalResolved > 0 ? ((wins / totalResolved) * 100).toFixed(1) : "0.0";
    const avgPlayed = totalPlayedCount > 0 ? (totalPlayedOdds / totalPlayedCount).toFixed(2) : "0.00";
    const avgWon = wins > 0 ? (totalWonOdds / wins).toFixed(2) : "0.00";

    return { player, hitRate, avgPlayed, avgWon, wins, totalResolved };
  }).sort((a, b) => parseFloat(b.hitRate) - parseFloat(a.hitRate)); 

  // --- WALL OF SHAME (Smallest Odds) ---
  const allMatchesList: any[] = [];
  PLAYERS.forEach(player => {
    (allBets[player] || []).forEach(row => {
      [row.match1, row.match2].forEach(m => {
        if (m.status !== 'empty') {
          allMatchesList.push({ player, odd: m.odds, name: m.name, status: m.status });
        }
      });
    });
  });
  
  const smallestOdds = allMatchesList.sort((a, b) => a.odd - b.odd).slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4 md:p-8 font-sans text-white relative overflow-hidden">
      
      {/* GLOW EFFECT TO MATCH LEADERBOARD */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* HEADER */}
      <div className="relative z-10 flex justify-between items-center mb-8 max-w-5xl mx-auto">
        <button 
            onClick={onBack} 
            className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl border border-white/10 transition-all text-xs font-bold uppercase tracking-widest"
        >
          ← Nazad
        </button>
        <div className="text-center">
            <h2 className="text-sm font-bold text-blue-500 uppercase tracking-widest">Brojke Ne Lažu</h2>
            <h1 className="text-2xl md:text-4xl font-black italic uppercase tracking-tighter">Statistika</h1>
        </div>
        <div className="w-[88px]"></div> 
      </div>

      <div className="relative z-10 max-w-5xl mx-auto space-y-8">
        
        {/* PLAYER STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {playerStats.map((stat, idx) => {
            const theme = PLAYER_THEMES[stat.player];
            return (
              <div key={stat.player} className={`bg-white/5 border ${theme.border} p-6 rounded-3xl backdrop-blur-md relative overflow-hidden hover:bg-white/10 transition-all shadow-xl`}>
                
                {/* Top colored line for 1st place */}
                {idx === 0 && <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${theme.gradient}`}></div>}
                
                {/* Player Header with Avatar */}
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-12 h-12 rounded-full border-2 border-white/20 overflow-hidden bg-gray-900 shadow-lg`}>
                      <img src={theme.icon} alt={stat.player} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h2 className={`text-xl font-black uppercase tracking-widest ${theme.text} leading-none`}>{stat.player}</h2>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                        {idx === 0 ? "🏆 Najveći Hit Rate" : `Rank #${idx + 1}`}
                    </span>
                  </div>
                </div>
                
                {/* Stats Rows */}
                <div className="space-y-3 bg-black/40 p-4 rounded-2xl border border-white/5">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-[10px] md:text-xs text-gray-400 uppercase font-bold tracking-widest">Hit % (Pogođeno)</span>
                    <span className={`font-black ${parseFloat(stat.hitRate) >= 50 ? 'text-green-400' : 'text-red-400'}`}>
                      {stat.hitRate}% <span className="text-[10px] text-gray-500">({stat.wins}/{stat.totalResolved})</span>
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-[10px] md:text-xs text-gray-400 uppercase font-bold tracking-widest">Pros. Igrana Kvota</span>
                    <span className="font-black text-white">{stat.avgPlayed}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] md:text-xs text-gray-400 uppercase font-bold tracking-widest">Pros. Pogođena Kvota</span>
                    <span className={`font-black ${theme.text}`}>{stat.avgWon}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* WALL OF SHAME (SMALLEST ODDS) */}
        <div className="bg-gradient-to-r from-red-900/20 to-black border border-red-500/30 p-6 rounded-3xl backdrop-blur-md relative overflow-hidden shadow-xl mt-8">
          <div className="absolute top-0 right-0 p-4 opacity-5 text-8xl rotate-12 select-none">🤡</div>
          
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <span className="text-3xl drop-shadow-lg">🤡</span>
            <div>
              <h3 className="text-xl font-black uppercase tracking-widest text-red-500 italic">Zid Srama</h3>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Najmanja muda</p>
            </div>
          </div>
          
          <div className="space-y-3 relative z-10">
            {smallestOdds.map((match, idx) => {
              const theme = PLAYER_THEMES[match.player];
              return (
                <div key={idx} className="flex items-center justify-between bg-black/60 p-3 md:p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <span className="text-xl font-black text-red-500 w-12 text-center drop-shadow-[0_0_10px_rgba(239,68,68,0.4)]">
                      {match.odd.toFixed(2)}
                    </span>
                    <div className="w-px h-8 bg-white/10 mx-2 hidden md:block"></div>
                    <div className="flex flex-col">
                      <span className="text-xs md:text-sm font-bold text-white uppercase truncate max-w-[150px] md:max-w-xs">{match.name}</span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${theme.text}`}>
                          Igrao: {match.player}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-2xl px-2">
                    {match.status === 'loss' ? '❌' : match.status === 'win' ? '✅' : '⏳'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}