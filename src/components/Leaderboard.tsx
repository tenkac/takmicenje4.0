import React from 'react';
import { AllPlayersData, PLAYERS } from '../types';

interface Props {
  allBets: AllPlayersData;
  onBack: () => void;
}

export default function Leaderboard({ allBets, onBack }: Props) {
  const calculateTotal = (playerName: string) => {
    const rows = allBets[playerName];
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
    <div className="min-h-screen bg-white p-8 font-sans text-black">
      <button onClick={onBack} className="mb-8 text-blue-600 underline font-bold">
        ← Back to Home
      </button>

      <div className="max-w-2xl mx-auto border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="bg-black text-[#f4b084] text-4xl font-black text-center py-4 uppercase tracking-widest">
              Official Standings
          </div>
          {rankings.map((rank, index) => (
              <div key={rank.name} className={`flex justify-between items-center p-6 text-2xl border-b-2 border-black font-bold ${index === 0 ? 'bg-yellow-200' : index === 1 ? 'bg-gray-200' : index === 2 ? 'bg-orange-200' : 'bg-white'}`}>
                  <div className="flex items-center gap-4">
                      <span className="text-3xl">{index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}</span>
                      <span>{rank.name}</span>
                  </div>
                  <span className="font-black text-3xl">{rank.score.toFixed(2)}</span>
              </div>
          ))}
      </div>
    </div>
  );
}