import React from 'react';
import { AllPlayersData, PLAYERS } from '../types';

interface Props {
  allBets: AllPlayersData;
  onBack: () => void;
}

// --- PLAYER THEMES (Copying this here so it matches PlayerTable) ---
const PLAYER_THEMES: Record<string, { bg: string, text: string, icon: string }> = {
  "Vlado":  { bg: "bg-blue-600",   text: "text-blue-600",   icon: "/Avatars/vlado.jpg" },
  "Fika":   { bg: "bg-red-600",    text: "text-red-600",    icon: "/Avatars/fika.jpg" },
  "Labud":  { bg: "bg-green-600",  text: "text-green-600",  icon: "/Avatars/labud.jpg" },
  "Ilija":  { bg: "bg-purple-600", text: "text-purple-600", icon: "/Avatars/ilija.jpg" },
  "Dzoni":  { bg: "bg-yellow-500", text: "text-yellow-600", icon: "/Avatars/dzoni.jpg" },
};

export default function Leaderboard({ allBets, onBack }: Props) {
  
  // Helper to calculate score
  const calculateTotal = (playerName: string) => {
    const rows = allBets[playerName] || [];
    let total = 0;
    rows.forEach((row) => {
      if (row.match1.status === "win") total += row.match1.odds;
      if (row.match2.status === "win") total += row.match2.odds;
    });
    return parseFloat(total.toFixed(2));
  };

  // Create sorted rankings
  const rankings = PLAYERS.map(player => ({
    name: player,
    score: calculateTotal(player)
  })).sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen bg-gray-200 p-8 font-sans text-black">
      
      {/* Top Navigation */}
      <button onClick={onBack} className="mb-8 bg-black text-white px-6 py-3 rounded font-bold shadow-lg hover:bg-gray-800 transition">
        ← Back to Home
      </button>

      <div className="max-w-2xl mx-auto border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
          
          {/* Header */}
          <div className="bg-black text-[#f4b084] text-4xl font-black text-center py-6 uppercase tracking-widest border-b-4 border-black">
              🏆 Standings
          </div>

          {/* List of Players */}
          {rankings.map((rank, index) => {
              const theme = PLAYER_THEMES[rank.name] || { bg: "bg-gray-500", text: "text-gray-500", icon: "" };
              
              // Special styling for Top 3
              let rankBadge = "bg-gray-100 border-gray-300";
              let medal = `#${index + 1}`;
              
              if (index === 0) {
                  rankBadge = "bg-yellow-200 border-yellow-400";
                  medal = "🥇";
              } else if (index === 1) {
                  rankBadge = "bg-gray-300 border-gray-400";
                  medal = "🥈";
              } else if (index === 2) {
                  rankBadge = "bg-orange-200 border-orange-400";
                  medal = "🥉";
              }

              return (
                  <div key={rank.name} className={`flex justify-between items-center p-4 border-b-2 border-black last:border-b-0 ${index < 3 ? 'bg-white' : 'bg-gray-50'}`}>
                      
                      {/* Left Side: Rank + Avatar + Name */}
                      <div className="flex items-center gap-6">
                          
                          {/* Rank Badge */}
                          <div className={`w-16 h-16 flex items-center justify-center text-4xl font-black border-4 rounded-xl ${rankBadge} shadow-sm`}>
                              {medal}
                          </div>

                          {/* Player Avatar */}
                          <div className={`w-20 h-20 rounded-full border-4 border-white shadow-md overflow-hidden ${theme.bg}`}>
                              <img src={theme.icon} alt={rank.name} className="w-full h-full object-cover" />
                          </div>

                          {/* Player Name */}
                          <div className="flex flex-col">
                              <span className={`text-3xl font-black uppercase tracking-wide ${theme.text}`}>
                                  {rank.name}
                              </span>
                              {index === 0 && <span className="text-xs font-bold bg-black text-yellow-400 px-2 py-0.5 rounded w-fit">CURRENT LEADER</span>}
                          </div>
                      </div>

                      {/* Right Side: Score */}
                      <div className="text-right">
                          <span className="block text-4xl font-black">{rank.score.toFixed(2)}</span>
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Points</span>
                      </div>
                  </div>
              );
          })}
      </div>
    </div>
  );
}