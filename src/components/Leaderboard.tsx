import React from 'react';
import { AllPlayersData, PLAYERS } from '../types';

interface Props {
  allBets: AllPlayersData;
  onBack: () => void;
}

const PLAYER_THEMES: Record<string, { bg: string, text: string, border: string, icon: string }> = {
  "Vlado":  { bg: "bg-blue-600",   text: "text-blue-500",   border: "border-blue-500",   icon: "/Avatars/vlado.jpg" },
  "Fika":   { bg: "bg-red-600",    text: "text-red-500",    border: "border-red-500",    icon: "/Avatars/fika.jpg" },
  "Labud":  { bg: "bg-green-600",  text: "text-green-500",  border: "border-green-500",  icon: "/Avatars/labud.jpg" },
  "Ilija":  { bg: "bg-purple-600", text: "text-purple-500", border: "border-purple-500", icon: "/Avatars/ilija.jpg" },
  "Dzoni":  { bg: "bg-yellow-500", text: "text-yellow-500", border: "border-yellow-500", icon: "/Avatars/dzoni.jpg" },
};

export default function Leaderboard({ allBets, onBack }: Props) {
  
  // --- CALCULATE STATS ---
  let biggestOdd = { player: "---", odds: 0, match: "No Wins Yet" };
  let mostWins = { player: "---", count: 0 };

  const playerStats = PLAYERS.map(player => {
    const rows = allBets[player] || [];
    let totalScore = 0;
    let winCount = 0;
    
    const allMatches = rows.flatMap(r => [r.match1, r.match2]);
    
    allMatches.forEach(m => {
        if (m.status === 'win') {
            totalScore += m.odds;
            winCount++;
            if (m.odds > biggestOdd.odds) {
                biggestOdd = { player, odds: m.odds, match: m.name };
            }
        }
    });

    if (winCount > mostWins.count) {
        mostWins = { player, count: winCount };
    }

    const recentForm = allMatches.filter(m => m.status !== 'empty').slice(-5).reverse();

    return {
        name: player,
        score: parseFloat(totalScore.toFixed(2)),
        form: recentForm
    };
  }).sort((a, b) => b.score - a.score);

  const [first, second, third, ...chasers] = playerStats;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4 md:p-8 font-sans text-white relative overflow-hidden">
      
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-orange-500/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 flex justify-between items-center mb-8">
        <button 
            onClick={onBack} 
            className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl border border-white/10 transition-all text-xs font-bold uppercase tracking-widest"
        >
            ← Menu
        </button>
        <div className="text-center">
            <h2 className="text-sm font-bold text-orange-500 uppercase tracking-widest">Sezona 2026</h2>
            <h1 className="text-2xl md:text-4xl font-black italic uppercase tracking-tighter">Leaderboard</h1>
        </div>
        <div className="w-20" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
          
          {/* --- THE PODIUM --- */}
          {/* Increased gap and bottom padding to handle higher floating names */}
          <div className="flex justify-center items-end gap-2 md:gap-6 mb-12 min-h-[350px] pb-4">
              {second && <PodiumItem rank={2} data={second} theme={PLAYER_THEMES[second.name]} height="h-48 md:h-64" color="border-gray-300" badge="🥈" />}
              {first && <PodiumItem rank={1} data={first} theme={PLAYER_THEMES[first.name]} height="h-60 md:h-80" color="border-yellow-400" badge="👑" isWinner />}
              {third && <PodiumItem rank={3} data={third} theme={PLAYER_THEMES[third.name]} height="h-40 md:h-52" color="border-orange-600" badge="🥉" />}
          </div>

          {/* --- SPECIAL ACHIEVEMENTS --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-gradient-to-r from-purple-900/40 to-black border border-purple-500/30 p-4 rounded-2xl flex items-center gap-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl rotate-12">🎯</div>
                  <div className="w-12 h-12 rounded-full border-2 border-purple-500 overflow-hidden shrink-0 z-10 bg-gray-900">
                      {biggestOdd.player !== "---" && <img src={PLAYER_THEMES[biggestOdd.player].icon} className="w-full h-full object-cover" />}
                  </div>
                  <div className="z-10">
                      <div className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Sniper Sezone</div>
                      <div className="text-xl font-black uppercase italic">{biggestOdd.player}</div>
                      <div className="text-xs text-gray-400 truncate max-w-[200px]">{biggestOdd.match}</div>
                  </div>
                  <div className="ml-auto text-right z-10">
                      <div className="text-3xl font-black text-purple-400">{biggestOdd.odds.toFixed(2)}</div>
                  </div>
              </div>

              <div className="bg-gradient-to-r from-green-900/40 to-black border border-green-500/30 p-4 rounded-2xl flex items-center gap-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl rotate-12">🔥</div>
                  <div className="w-12 h-12 rounded-full border-2 border-green-500 overflow-hidden shrink-0 z-10 bg-gray-900">
                      {mostWins.player !== "---" && <img src={PLAYER_THEMES[mostWins.player].icon} className="w-full h-full object-cover" />}
                  </div>
                  <div className="z-10">
                      <div className="text-[10px] font-bold text-green-400 uppercase tracking-widest">Najkonstantniji</div>
                      <div className="text-xl font-black uppercase italic">{mostWins.player}</div>
                      <div className="text-xs text-gray-400">Konstantni Performans</div>
                  </div>
                  <div className="ml-auto text-right z-10">
                      <div className="text-3xl font-black text-green-400">{mostWins.count}</div>
                      <div className="text-[8px] uppercase font-bold tracking-widest text-green-600">Ubodenih</div>
                  </div>
              </div>
          </div>

          {/* --- THE CHASERS LIST --- */}
          <div className="flex flex-col gap-3 pb-8">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 pl-2">The Chasers</div>
            {chasers.map((rank, index) => {
                const theme = PLAYER_THEMES[rank.name];
                return (
                    <div key={rank.name} className="flex items-center p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all">
                        <div className="w-8 text-xl font-black text-gray-500 italic">#{index + 4}</div>
                        <div className={`w-12 h-12 rounded-full border-2 ${theme.border} overflow-hidden mx-4 bg-gray-900`}>
                            <img src={theme.icon} alt={rank.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-grow">
                            <div className={`text-lg font-black uppercase tracking-tight ${theme.text}`}>{rank.name}</div>
                            <div className="flex gap-1 mt-1">
                                {rank.form.map((p: any, i: number) => (
                                    <div key={i} className={`w-1.5 h-1.5 rounded-full ${p.status === 'win' ? 'bg-green-500' : 'bg-red-500'}`} />
                                ))}
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="block text-2xl font-black text-white">{rank.score.toFixed(2)}</span>
                        </div>
                    </div>
                );
            })}
          </div>
      </div>
    </div>
  );
}

function PodiumItem({ rank, data, theme, height, color, badge, isWinner = false }: any) {
    return (
        <div className="flex flex-col items-center group w-1/3 max-w-[140px] md:max-w-none">
            {/* SPACING FIX: 
                Changed mb-4 to mb-8 (mobile) and mb-14 (desktop) 
                This separates the Name from the top of the block.
            */}
            <div className={`flex flex-col items-center mb-8 md:mb-14 transition-transform ${isWinner ? 'scale-110 md:scale-125' : 'scale-90 md:scale-100'}`}>
                <div className="text-2xl md:text-4xl mb-[-10px] z-20 drop-shadow-lg filter">{badge}</div>
                <div className={`w-16 h-16 md:w-24 md:h-24 rounded-full border-4 ${color} shadow-2xl overflow-hidden relative z-10 bg-gray-900`}>
                    <img src={theme.icon} alt={data.name} className="w-full h-full object-cover" />
                </div>
                <div className={`mt-3 text-sm md:text-xl font-black uppercase tracking-widest ${theme.text} bg-black/60 px-3 py-1 rounded-lg backdrop-blur-sm border border-white/10 shadow-lg`}>
                    {data.name}
                </div>
            </div>

            <div className={`w-full ${height} ${isWinner ? 'bg-gradient-to-t from-yellow-600/20 to-yellow-500/5 border-yellow-500/50 shadow-[0_0_30px_rgba(234,179,8,0.1)]' : 'bg-gradient-to-t from-gray-800 to-gray-900 border-white/10'} rounded-t-2xl border-x border-t relative flex flex-col justify-start items-center pt-4 backdrop-blur-sm`}>
                <span className={`text-3xl md:text-5xl font-black tracking-tighter ${isWinner ? 'text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]' : 'text-white'}`}>
                    {data.score.toFixed(2)}
                </span>
                <span className="text-[10px] md:text-xs font-bold text-white/30 uppercase tracking-[0.2em] mb-4">Poena</span>
                <div className="flex gap-1.5 p-2 bg-black/40 rounded-full border border-white/5">
                    {data.form.map((p: any, i: number) => (
                        <div key={i} className={`w-2 h-2 md:w-3 md:h-3 rounded-full shadow-lg ${p.status === 'win' ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]' : 'bg-red-500'}`} />
                    ))}
                    {data.form.length === 0 && <span className="text-[8px] text-gray-600"></span>}
                </div>
                <div className={`absolute bottom-4 text-6xl md:text-8xl font-black opacity-10 select-none ${isWinner ? 'text-yellow-500' : 'text-white'}`}>{rank}</div>
            </div>
        </div>
    );
}