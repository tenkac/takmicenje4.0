"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { AllPlayersData, PLAYERS } from '../types';

interface Props {
  allBets: AllPlayersData;
  onBack: () => void;
  onPlayerClick: (playerName: string) => void;
  onViewStats: () => void;
}

const PLAYER_THEMES: Record<string, { bg: string, text: string, border: string, icon: string, hex: string }> = {
  "Vlado":  { bg: "bg-blue-600",   text: "text-blue-500",   border: "border-blue-500",   icon: "/Avatars/vlado.jpg",  hex: "#3b82f6" },
  "Fika":   { bg: "bg-red-600",    text: "text-red-500",    border: "border-red-500",    icon: "/Avatars/fika.jpg",   hex: "#ef4444" },
  "Labud":  { bg: "bg-green-600",  text: "text-green-500",  border: "border-green-500",  icon: "/Avatars/labud.jpg",  hex: "#22c55e" },
  "Ilija":  { bg: "bg-purple-600", text: "text-purple-500", border: "border-purple-500", icon: "/Avatars/ilija.jpg",  hex: "#a855f7" },
  "Dzoni":  { bg: "bg-yellow-500", text: "text-yellow-500", border: "border-yellow-500", icon: "/Avatars/dzoni.jpg",  hex: "#eab308" },
};

export default function Leaderboard({ allBets, onBack, onPlayerClick, onViewStats }: Props) {

  // Trigger animations after mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  // --- CALCULATE STATS ---
  const { playerStats, biggestOdd, mostWins } = useMemo(() => {
    let biggestOdd = { player: "---", odds: 0, match: "No Wins Yet" };
    let mostWins = { player: "---", count: 0 };

    const playerStats = PLAYERS.map(player => {
      const rows = allBets[player] || [];
      let totalScore = 0;
      let winCount = 0;
      let pendingCount = 0;

      const allMatches = rows.flatMap(r => [r.match1, r.match2]);

      allMatches.forEach(m => {
        if (m.status === 'win') {
          totalScore += m.odds;
          winCount++;
          if (m.odds > biggestOdd.odds) {
            biggestOdd = { player, odds: m.odds, match: m.name };
          }
        }
        if (m.status === 'pending') pendingCount++;
      });

      if (winCount > mostWins.count) {
        mostWins = { player, count: winCount };
      }

      const recentForm = allMatches.filter(m => m.status === 'win' || m.status === 'loss').slice(-5).reverse();

      return {
        name: player,
        score: parseFloat(totalScore.toFixed(2)),
        form: recentForm,
        pendingCount,
      };
    }).sort((a, b) => b.score - a.score);

    return { playerStats, biggestOdd, mostWins };
  }, [allBets]);

  const [first, second, third, ...chasers] = playerStats;

  // Score gap helpers
  const gapTo = (target: typeof playerStats[0] | undefined, reference: typeof playerStats[0] | undefined) => {
    if (!target || !reference) return null;
    const diff = parseFloat((reference.score - target.score).toFixed(2));
    if (diff <= 0) return null;
    return diff;
  };



  return (
    <>
      {/* KEYFRAME STYLES */}
      <style>{`
        @keyframes podium-rise {
          from { transform: translateY(60px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @keyframes avatar-drop {
          0%   { transform: translateY(-40px) scale(0.8); opacity: 0; }
          70%  { transform: translateY(4px) scale(1.05); opacity: 1; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes crown-pulse {
          0%, 100% { transform: scale(1) rotate(-5deg);  filter: drop-shadow(0 0 4px rgba(250,204,21,0.4)); }
          50%       { transform: scale(1.25) rotate(5deg); filter: drop-shadow(0 0 12px rgba(250,204,21,0.9)); }
        }
        .podium-col   { animation: podium-rise  0.6s cubic-bezier(0.22,1,0.36,1) both; }
        .avatar-card  { animation: avatar-drop  0.55s cubic-bezier(0.22,1,0.36,1) both; }
        .crown-anim   { animation: crown-pulse  2s ease-in-out infinite; display: inline-block; }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4 md:p-8 font-sans text-white relative overflow-hidden">

        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-orange-500/20 blur-[120px] rounded-full pointer-events-none" />

        {/* HEADER */}
        <div className="relative z-10 flex justify-between items-center mb-8">
          <button
            onClick={onBack}
            className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl border border-white/10 transition-all text-xs font-bold uppercase tracking-widest"
          >
            ← Menu
          </button>
          <div className="text-center">
            <h2 className="text-sm font-bold text-orange-500 uppercase tracking-widest">Sezona 2026</h2>
            <h1 className="text-2xl md:text-4xl font-black italic uppercase tracking-tighter">Podijum</h1>
          </div>
          <button
            onClick={onViewStats}
            className="bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 px-4 py-2 rounded-xl border border-blue-500/30 transition-all text-xs font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(59,130,246,0.2)]"
          >
            Stats →
          </button>
        </div>

        <div className="max-w-4xl mx-auto relative z-10">

          {/* ── PODIUM ─────────────────────────────────────────────────────── */}
          <div className="flex justify-center items-end gap-2 md:gap-6 mb-4 min-h-[350px] pb-4">
            {second && (
              <PodiumItem
                rank={2} data={second} theme={PLAYER_THEMES[second.name]}
                height="h-48 md:h-64" color="border-gray-300" badge="🥈"
                gapToAbove={gapTo(second, first)}
                mounted={mounted} delay="0.15s"
                onClick={() => onPlayerClick(second.name)}
              />
            )}
            {first && (
              <PodiumItem
                rank={1} data={first} theme={PLAYER_THEMES[first.name]}
                height="h-60 md:h-80" color="border-yellow-400" badge="👑" isWinner
                mounted={mounted} delay="0s"
                onClick={() => onPlayerClick(first.name)}
              />
            )}
            {third && (
              <PodiumItem
                rank={3} data={third} theme={PLAYER_THEMES[third.name]}
                height="h-40 md:h-52" color="border-orange-600" badge="🥉"
                gapToAbove={gapTo(third, second)}
                mounted={mounted} delay="0.25s"
                onClick={() => onPlayerClick(third.name)}
              />
            )}
          </div>





          {/* ── ACHIEVEMENTS ───────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="flex flex-col h-full">
              <div className="bg-gradient-to-r from-purple-900/40 to-black border border-purple-500/30 p-4 rounded-2xl flex items-center gap-4 relative overflow-hidden flex-grow">
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
            </div>

            <div className="bg-gradient-to-r from-green-900/40 to-black border border-green-500/30 p-4 rounded-2xl flex items-center gap-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl rotate-12">🔥</div>
              <div className="w-12 h-12 rounded-full border-2 border-green-500 overflow-hidden shrink-0 z-10 bg-gray-900">
                {mostWins.player !== "---" && <img src={PLAYER_THEMES[mostWins.player].icon} className="w-full h-full object-cover" />}
              </div>
              <div className="z-10">
                <div className="text-[10px] font-bold text-green-400 uppercase tracking-widest">Hasler</div>
                <div className="text-xl font-black uppercase italic">{mostWins.player}</div>
                <div className="text-xs text-gray-400">Konstantni Performans</div>
              </div>
              <div className="ml-auto text-right z-10">
                <div className="text-3xl font-black text-green-400">{mostWins.count}</div>
                <div className="text-[8px] uppercase font-bold tracking-widest text-green-600">Ubodenih</div>
              </div>
            </div>
          </div>

          {/* ── CHASERS ────────────────────────────────────────────────────── */}
          <div className="flex flex-col gap-3 pb-8">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 pl-2">Jahači</div>
            {chasers.map((rank, index) => {
              const theme = PLAYER_THEMES[rank.name];
              const above = playerStats[index + 2]; // the player just above in the sorted list
              const gap = gapTo(rank, above);
              return (
                <div
                  key={rank.name}
                  onClick={() => onPlayerClick(rank.name)}
                  className="flex items-center p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-blue-500/30 hover:scale-[1.01] cursor-pointer transition-all"
                >
                  <div className="w-8 text-xl font-black text-gray-500 italic">#{index + 4}</div>
                  <div className={`w-12 h-12 rounded-full border-2 ${theme.border} overflow-hidden mx-4 bg-gray-900`}>
                    <img src={theme.icon} alt={rank.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow">
                    <div className={`text-lg font-black uppercase tracking-tight ${theme.text}`}>{rank.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex gap-1">
                        {rank.form.map((p: any, i: number) => (
                          <div key={i} className={`w-1.5 h-1.5 rounded-full ${p.status === 'win' ? 'bg-green-500' : 'bg-red-500'}`} />
                        ))}
                      </div>
                      {gap !== null && (
                        <span className="text-[9px] font-bold text-gray-600 uppercase tracking-wider">
                          -{gap} pts
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <span className="block text-2xl font-black text-white">{rank.score.toFixed(2)}</span>
                    {rank.pendingCount > 0 && (
                      <span className="text-[9px] font-bold text-orange-400 uppercase tracking-widest">{rank.pendingCount} pending</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

function PodiumItem({ rank, data, theme, height, color, badge, isWinner = false, gapToAbove, mounted, delay, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className="flex flex-col items-center group w-1/3 max-w-[140px] md:max-w-none cursor-pointer"
      style={{
        animation: mounted ? `podium-rise 0.6s cubic-bezier(0.22,1,0.36,1) ${delay} both` : 'none',
        opacity: mounted ? undefined : 0,
      }}
    >
      {/* AVATAR + NAME */}
      <div
        className={`flex flex-col items-center mb-8 md:mb-14 ${isWinner ? 'scale-110 md:scale-125' : 'scale-90 md:scale-100'}`}
        style={{
          animation: mounted ? `avatar-drop 0.55s cubic-bezier(0.22,1,0.36,1) calc(${delay} + 0.2s) both` : 'none',
          opacity: mounted ? undefined : 0,
        }}
      >
        {/* BADGE / CROWN */}
        <div className={`text-2xl md:text-4xl mb-[-10px] z-20 drop-shadow-lg ${isWinner ? 'crown-anim' : ''}`}>
          {badge}
        </div>

        {/* AVATAR */}
        <div className={`w-16 h-16 md:w-24 md:h-24 rounded-full border-4 ${color} shadow-2xl overflow-hidden relative z-10 bg-gray-900`}>
          <img src={theme.icon} alt={data.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
        </div>

        <div className={`mt-3 text-sm md:text-xl font-black uppercase tracking-widest ${theme.text} bg-black/60 px-3 py-1 rounded-lg backdrop-blur-sm border border-white/10 shadow-lg`}>
          {data.name}
        </div>
      </div>

      {/* PODIUM COLUMN */}
      <div
        className={`w-full ${height} rounded-t-2xl border-x border-t relative flex flex-col justify-start items-center pt-4 backdrop-blur-sm hover:scale-[1.02] transition-transform`}
        style={isWinner ? {
          background: 'linear-gradient(to top, rgba(161,120,6,0.2), rgba(234,179,8,0.05))',
          borderColor: 'rgba(234,179,8,0.5)',
          boxShadow: '0 0 30px rgba(234,179,8,0.1)',
        } : {
          background: `linear-gradient(to top, ${theme.hex}18, ${theme.hex}05)`,
          borderColor: `${theme.hex}40`,
          boxShadow: `0 0 25px ${theme.hex}15`,
        }}
      >
        <AnimatedScore target={data.score} isWinner={isWinner} mounted={mounted} delay={delay} />
        <span className="text-[10px] md:text-xs font-bold text-white/30 uppercase tracking-[0.2em] mb-2">Poena</span>

        {/* GAP TO PLAYER ABOVE */}
        {gapToAbove !== null && gapToAbove !== undefined && (
          <div className="mb-2 px-2 py-0.5 bg-black/40 border border-white/10 rounded-full">
            <span className="text-[8px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest">
              -{gapToAbove} pts
            </span>
          </div>
        )}

        <div className="flex gap-1.5 p-2 bg-black/40 rounded-full border border-white/5">
          {data.form.map((p: any, i: number) => (
            <div key={i} className={`w-2 h-2 md:w-3 md:h-3 rounded-full shadow-lg ${p.status === 'win' ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]' : 'bg-red-500'}`} />
          ))}
          {data.form.length === 0 && <span className="text-[8px] text-gray-600 px-1">–</span>}
        </div>

        <div
          className={`absolute inset-0 flex items-center justify-center text-7xl md:text-9xl font-black select-none pointer-events-none`}
          style={{ opacity: 0.08, color: isWinner ? '#eab308' : theme.hex }}
        >
          {rank}
        </div>
      </div>
    </div>
  );
}

// ── ANIMATED SCORE COUNTER ───────────────────────────────────────────────────
function AnimatedScore({ target, isWinner, mounted, delay }: { target: number, isWinner: boolean, mounted: boolean, delay: string }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!mounted) { setDisplay(0); return; }
    const delayMs = parseFloat(delay) * 1000 + 300;
    const timer = setTimeout(() => {
      const duration = 900;
      const steps = 40;
      const interval = duration / steps;
      let step = 0;
      const id = setInterval(() => {
        step++;
        const progress = step / steps;
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(parseFloat((target * eased).toFixed(2)));
        if (step >= steps) { setDisplay(target); clearInterval(id); }
      }, interval);
    }, delayMs);
    return () => clearTimeout(timer);
  }, [target, mounted, delay]);

  return (
    <span className={`text-3xl md:text-5xl font-black tracking-tighter tabular-nums ${isWinner ? 'text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]' : 'text-white'}`}>
      {display.toFixed(2)}
    </span>
  );
}