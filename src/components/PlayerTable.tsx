import React, { useState } from 'react';
import { AllPlayersData, PLAYERS, MatchStatus } from '../types';

interface Props {
  allBets: AllPlayersData;
  activePlayer: string;
  setActivePlayer: (player: string) => void;
  onAddPick: (date: string, sport: string, matchName: string, tip: string, odds: number) => void;
  onToggleStatus: (date: string, matchKey: "match1" | "match2") => void;
  onBack: () => void;
}

const PLAYER_THEMES: Record<string, { bg: string, text: string, border: string, icon: string }> = {
  "Vlado":  { bg: "bg-blue-600", text: "text-blue-400", border: "border-blue-500/50", icon: "/Avatars/vlado.jpg" },
  "Fika":   { bg: "bg-red-600", text: "text-red-400", border: "border-red-500/50", icon: "/Avatars/fika.jpg" },
  "Labud":  { bg: "bg-green-600", text: "text-green-400", border: "border-green-500/50", icon: "/Avatars/labud.jpg" },
  "Ilija":  { bg: "bg-purple-600", text: "text-purple-400", border: "border-purple-500/50", icon: "/Avatars/ilija.jpg" },
  "Dzoni":  { bg: "bg-yellow-500", text: "text-yellow-400", border: "border-yellow-500/50", icon: "/Avatars/dzoni.jpg" },
};

export default function PlayerTable({ allBets, activePlayer, setActivePlayer, onAddPick, onToggleStatus, onBack }: Props) {
  const theme = PLAYER_THEMES[activePlayer] || PLAYER_THEMES["Vlado"];
  const [form, setForm] = useState({ date: new Date().toLocaleDateString('en-CA'), sport: "⚽", matchName: "", tip: "", odds: "" });

  const handleAdd = () => {
    if (!form.matchName || !form.odds) return alert("Missing info!");
    onAddPick(form.date, form.sport, form.matchName, form.tip, parseFloat(form.odds));
    setForm({ ...form, matchName: "", tip: "", odds: "" });
  };

  const getStatusColor = (s: MatchStatus) => {
    if (s === "win") return "bg-green-500/20 text-green-400 border-green-500/50";
    if (s === "loss") return "bg-red-500/20 text-red-400 border-red-500/50";
    return "bg-white/5 text-gray-400 border-white/10";
  };
  const isDateLocked = (rowDate: string) => {
  const today = new Date().toLocaleDateString('en-CA'); 
  return rowDate < today;
};
  return (
    // UPDATED MAIN CONTAINER WITH LANDING PAGE GLOW
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-900 text-white font-sans selection:bg-orange-500/30 relative overflow-hidden">
      
      {/* DECORATIVE BACKGROUND GLOWS (Copied from LandingPage) */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-orange-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* CONTENT WRAPPER (z-10 ensures it sits above the glow) */}
      <div className="relative z-10">
        
        {/* GLASS HEADER */}
        <div className="sticky top-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/10 p-4 flex justify-between items-center">
          <button onClick={onBack} className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl border border-white/10 transition-all text-xs font-bold uppercase tracking-widest">
            ← Menu
          </button>
          <div className="flex flex-col items-center">
            <h1 className="text-xl md:text-2xl font-black tracking-tighter italic uppercase text-white">KLANICA <span className="text-blue-500">LIVE</span></h1>
          </div>
          <div className="w-20"></div> {/* Spacer */}
        </div>

        <div className="max-w-7xl mx-auto p-4 lg:p-8 flex flex-col lg:flex-row gap-8">
                  {/* PLAYER NAV */}
                  <div className="
                                    /* Sidebar Container */
                                    w-full lg:w-80           /* Increased desktop width to 320px */
                                    flex lg:flex-col         /* Row on mobile, Column on desktop */
                                    gap-3 lg:gap-4 
                                    p-4 lg:p-6
                                    
                                    /* Scrolling Logic */
                                    overflow-x-auto          /* Enable horizontal scroll on mobile */
                                    lg:overflow-x-hidden     /* Kill horizontal scroll on desktop */
                                    lg:overflow-y-auto       /* Allow vertical scroll if many players */
                                    
                                    scrollbar-hide           /* Keep it clean */
                                    flex-shrink-0            /* Prevent the sidebar from being squashed */
                                    "
                    >
                      {PLAYERS.map(p => {
                          const isActive = activePlayer === p;
                          const pTheme = PLAYER_THEMES[p];

                          return (
                              <button
                                  key={p}
                                  onClick={() => setActivePlayer(p)}
                                  className={`
                                            flex-shrink-0 flex items-center 
                                            gap-4 lg:gap-6 
                                            p-3 lg:p-5 
                                            rounded-2xl lg:rounded-[2.5rem] 
                                            border transition-all duration-300
                                            w-auto lg:w-full      /* Auto width on mobile, Full width on desktop */
                                            ${isActive
                                          ? `${pTheme.border} bg-white/10 backdrop-blur-md shadow-2xl scale-100 lg:scale-105`
                                          : "border-transparent opacity-40 hover:opacity-100 hover:bg-white/5"
                                                }
                                             `}
                              >
                                  {/* AVATAR CONTAINER */}
                                  <div className={`
                                                relative flex-shrink-0 rounded-full overflow-hidden border-2 border-white/20 shadow-lg
                                                w-10 h-10       /* Mobile */
                                                lg:w-20 lg:h-20 /* Large Desktop */
                                                ${isActive ? "ring-4 ring-orange-500/20" : ""}
                                                `}>
                                      <img
                                          src={pTheme.icon}
                                          className="w-full h-full object-cover"
                                          alt={p}
                                      />
                                  </div>

                                  {/* PLAYER NAME */}
                                    <span className={`
                                        font-black uppercase tracking-widest whitespace-nowrap /* Prevents text from cutting off or wrapping */
                                        text-xs         /* Mobile */
                                        lg:text-xl      /* Desktop */
                                        ${isActive ? pTheme.text : "text-white"}
                                                 `}>
                                      {p}
                                  </span>
                              </button>
                          );
                      })}
                  </div>

          {/* MAIN ARENA */}
          <div className="flex-1 space-y-8">
            {/* QUICK ADD FORM */}
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md shadow-xl">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500 mb-4">Dodaj par</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="bg-black/40 border border-white/10 rounded-xl p-3 text-sm outline-none focus:border-orange-500 transition-all text-white/80" />
                <input placeholder="Utakmica" value={form.matchName} onChange={e => setForm({...form, matchName: e.target.value})} className="bg-black/40 border border-white/10 rounded-xl p-3 text-sm outline-none focus:border-orange-500 col-span-2 md:col-span-1 text-white" />
                <input placeholder="Tip" value={form.tip} onChange={e => setForm({...form, tip: e.target.value})} className="bg-black/40 border border-white/10 rounded-xl p-3 text-sm outline-none focus:border-orange-500 text-center text-white" />
                <input type="number" placeholder="Kvota" value={form.odds} onChange={e => setForm({...form, odds: e.target.value})} className="bg-black/40 border border-white/10 rounded-xl p-3 text-sm outline-none focus:border-orange-500 text-center font-bold text-white" />
                <button onClick={handleAdd} className="col-span-2 md:col-span-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-black font-black uppercase rounded-xl transition-all active:scale-95 py-3 shadow-lg shadow-blue-500/20">DODAJ</button>
              </div>
            </div>

            {/* TABLE FEED */}
            <div className="space-y-4">
              {allBets[activePlayer].map((row) => (
                <div key={row.date} className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col md:flex-row gap-6 items-center hover:bg-white/[0.07] transition-all backdrop-blur-sm">
                  <div className="flex flex-col items-center justify-center md:border-r border-white/10 pr-6">
                    <span className="text-[10px] font-black uppercase text-gray-500 tracking-tighter">DATUM</span>
                    <span className="text-lg font-black text-orange-500">{row.date.split('-').reverse().slice(0,2).join('.')}</span>
                  </div>

                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    {[row.match1, row.match2].map((m, idx) => (
                      <div key={idx} onClick={() => onToggleStatus(row.date, idx === 0 ? "match1" : "match2")} className={`p-4 rounded-2xl border cursor-pointer transition-all backdrop-blur-sm ${getStatusColor(m.status)} ${m.status === 'empty' ? 'opacity-30 grayscale' : 'hover:scale-[1.02] shadow-lg'}`}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">{m.sport || "⚽"} UTAKMICA {idx + 1}</span>
                          {m.status !== 'empty' && <span className="font-black text-lg">{m.odds.toFixed(2)}</span>}
                        </div>
                        <div className="text-sm font-bold truncate uppercase">{m.name || "---"}</div>
                        <div className="text-[10px] font-black text-white/40 uppercase">TIP: <span className="text-white">{m.tip || "---"}</span></div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}