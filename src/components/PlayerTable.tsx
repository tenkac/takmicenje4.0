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

// --- PLAYER THEMES (PNG Avatars) ---
const PLAYER_THEMES: Record<string, { bg: string, text: string, icon: string }> = {
  "Vlado":  { bg: "bg-blue-600",   text: "text-blue-600",   icon: "/Avatars/vlado.png" },
  "Fika":   { bg: "bg-red-600",    text: "text-red-600",    icon: "/Avatars/fika.png" },
  "Labud":  { bg: "bg-green-600",  text: "text-green-600",  icon: "/Avatars/labud.png" },
  "Ilija":  { bg: "bg-purple-600", text: "text-purple-600", icon: "/Avatars/ilija.png" },
  "Dzoni":  { bg: "bg-yellow-500", text: "text-yellow-600", icon: "/Avatars/dzoni.png" },
};

// --- SPORTS LIST (Emojis) ---
const SPORTS = [
  { icon: "⚽", name: "Football" },
  { icon: "🏀", name: "Basketball" },
  { icon: "🎾", name: "Tennis" },
  { icon: "🎯", name: "Darts" },
  { icon: "🏒", name: "Ice Hockey" },
  { icon: "🏐", name: "Volleyball" },
  { icon: "🤾", name: "Handball" },
  { icon: "⚾", name: "Baseball" },
  { icon: "🏓", name: "Table Tennis" },
  { icon: "🥅", name: "Futsal" },
  { icon: "🤽", name: "Waterpolo" },
  { icon: "🏑", name: "Floorball" },
  { icon: "🏏", name: "Cricket" },
  { icon: "🎱", name: "Snooker" },
  { icon: "🥊", name: "Fighting" },
];

export default function PlayerTable({ allBets, activePlayer, setActivePlayer, onAddPick, onToggleStatus, onBack }: Props) {
  
  const theme = PLAYER_THEMES[activePlayer] || PLAYER_THEMES["Vlado"];

  const [form, setForm] = useState({
    date: new Date().toLocaleDateString('en-CA'),
    sport: "⚽", 
    matchName: "",
    tip: "",
    odds: ""
  });

  const handleAdd = () => {
    if (!form.date || !form.matchName || !form.odds) return alert("Fill all fields");
    onAddPick(form.date, form.sport, form.matchName, form.tip, parseFloat(form.odds));
    setForm({ ...form, matchName: "", tip: "", odds: "" }); 
  };

  const calculateTotal = () => {
    let total = 0;
    allBets[activePlayer].forEach((row) => {
      if (row.match1.status === "win") total += row.match1.odds;
      if (row.match2.status === "win") total += row.match2.odds;
    });
    return total.toFixed(2);
  };

  const getStatusStyle = (status: MatchStatus) => {
    if (status === "win") return "bg-green-500 text-black";
    if (status === "loss") return "bg-red-600 text-white";
    if (status === "empty") return "bg-[#fbe5d6]"; 
    return "bg-gray-300 text-gray-700";
  };
  const getStatusText = (s: MatchStatus) => (s === "win" ? "Da" : s === "loss" ? "Ne" : s === "empty" ? "" : "?");

  return (
    <div className="h-screen bg-gray-200 font-sans text-sm text-black flex flex-col overflow-hidden">
      
      {/* TOP HEADER */}
      <div className="bg-black text-white p-3 flex justify-between items-center shadow-lg z-20 flex-shrink-0">
        <h1 className="text-xl font-bold text-[#f4b084] uppercase tracking-widest pl-4">Betting League</h1>
        <button onClick={onBack} className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded text-white font-bold text-xs transition border border-gray-600">
          ← Back to Menu
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        
        {/* --- LEFT SIDEBAR (Fixed & Independent) --- */}
        <div className="w-80 h-full flex flex-col py-8 gap-6 z-10 overflow-y-auto custom-scrollbar px-6 border-r border-gray-300/50">
          {PLAYERS.map((p) => {
            const isActive = activePlayer === p;
            const pTheme = PLAYER_THEMES[p] || { bg: "bg-gray-500", text: "text-gray-500", icon: "" };
            return (
              <button
                key={p}
                onClick={() => setActivePlayer(p)}
                className={`
                  relative w-full rounded-3xl flex items-center gap-6 px-6 py-6 transition-all duration-300 transform group
                  ${isActive 
                    ? `${pTheme.bg} text-white shadow-2xl scale-105 ring-4 ring-white` 
                    : "bg-white text-gray-500 shadow-lg hover:scale-105 hover:shadow-xl"
                  }
                `}
              >
                <div className={`
                    w-16 h-16 min-w-[4rem] rounded-full flex items-center justify-center overflow-hidden shadow-md transition-all border-2 border-white
                    ${isActive ? "bg-white/20" : pTheme.bg}
                `}>
                   <img src={pTheme.icon} alt={p} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex flex-col items-start">
                  <span className={`text-xl font-black uppercase tracking-wider leading-none ${isActive ? "text-white" : "text-gray-700 group-hover:text-black"}`}>
                    {p}
                  </span>
                  {isActive && <span className="text-xs opacity-80 font-bold mt-1">Selected</span>}
                </div>
              </button>
            );
          })}
        </div>

        {/* --- RIGHT CONTENT --- */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-100">
            
            {/* INPUT FORM */}
            <div className="max-w-6xl mx-auto mb-8 p-6 border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] rounded-lg">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-3">
                 <span className="text-gray-500 uppercase text-xs font-bold tracking-wider">Adding picks for</span>
                 <span className={`${theme.bg} text-white px-3 py-1 rounded-md uppercase text-xl font-black shadow-sm transform -rotate-1`}>{activePlayer}</span>
              </h2>
              
              <div className="flex flex-wrap gap-4 items-end">
                <div className="flex flex-col w-32">
                  <label className="font-bold text-xs uppercase mb-1 text-gray-500">Date</label>
                  <input type="date" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} className="border-2 border-gray-300 focus:border-black rounded p-2 font-bold outline-none transition-colors" />
                </div>

                <div className="flex flex-col w-32">
                    <label className="font-bold text-xs uppercase mb-1 text-gray-500">Sport</label>
                    <select 
                        value={form.sport}
                        onChange={(e) => setForm({...form, sport: e.target.value})}
                        className="border-2 border-gray-300 focus:border-black rounded p-2 text-md outline-none bg-white h-[42px] cursor-pointer"
                        title="Select Sport"
                    >
                        {SPORTS.map(s => (
                          <option key={s.name} value={s.icon} title={s.name}>
                             {s.icon} {s.name}
                          </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col flex-grow min-w-[200px]">
                  <label className="font-bold text-xs uppercase mb-1 text-gray-500">Match Name</label>
                  <input value={form.matchName} onChange={(e) => setForm({...form, matchName: e.target.value})} className="border-2 border-gray-300 focus:border-black rounded p-2 outline-none transition-colors h-[42px]" placeholder="e.g. Chelsea - Liverpool" />
                </div>
                <div className="flex flex-col w-24">
                   <label className="font-bold text-xs uppercase mb-1 text-gray-500">Tip</label>
                  <input value={form.tip} onChange={(e) => setForm({...form, tip: e.target.value})} className="border-2 border-gray-300 focus:border-black rounded p-2 text-center outline-none transition-colors h-[42px]" placeholder="GG" />
                </div>
                <div className="flex flex-col w-24">
                   <label className="font-bold text-xs uppercase mb-1 text-gray-500">Odds</label>
                  <input type="number" step="0.01" value={form.odds} onChange={(e) => setForm({...form, odds: e.target.value})} className="border-2 border-gray-300 focus:border-black rounded p-2 text-center font-bold outline-none transition-colors h-[42px]" placeholder="1.00" />
                </div>
                <button onClick={handleAdd} className="bg-green-600 text-white font-bold py-3 px-6 rounded-md shadow-md hover:bg-green-700 hover:shadow-lg hover:-translate-y-0.5 transition-all uppercase tracking-wider h-[42px] flex items-center">
                  Add +
                </button>
              </div>
            </div>

            {/* TABLE */}
            <div className="max-w-6xl mx-auto border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white mb-20">
              
              {/* --- HEADER WITH BIGGER ICON --- */}
              <div className={`${theme.bg} p-6 text-center text-5xl font-black uppercase tracking-widest border-b-2 border-black text-white flex items-center justify-center gap-6`}>
                 <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white bg-white shadow-xl">
                    <img src={theme.icon} alt="Avatar" className="w-full h-full object-cover" />
                 </div>
                 {activePlayer}
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-black text-white text-center font-bold border-b border-gray-700">
                      <th className="border-r border-gray-700 px-2 py-2 w-24">Datum</th>
                      <th className="border-r border-gray-700 px-2 py-2" colSpan={4}>1. Utakmica</th>
                      <th className="px-2 py-2" colSpan={4}>2. Utakmica</th>
                    </tr>
                     <tr className="bg-gray-800 text-gray-200 text-center text-xs font-bold border-b-2 border-black">
                      <th className="border-r border-gray-700 p-2"></th> 
                      <th className="border-r border-gray-700 p-2 w-64">Par</th>
                      <th className="border-r border-gray-700 p-2">Tip</th>
                      <th className="border-r border-gray-700 p-2">Kvota</th>
                      <th className="border-r border-gray-700 p-2 w-16">Dobitan</th>
                      <th className="border-r border-gray-700 p-2 w-64">Par</th>
                      <th className="border-r border-gray-700 p-2">Tip</th>
                      <th className="border-r border-gray-700 p-2">Kvota</th>
                      <th className="p-2 w-16">Dobitan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allBets[activePlayer].length === 0 ? (
                      <tr><td colSpan={9} className="p-12 text-center text-gray-400 italic">No bets placed yet.</td></tr>
                    ) : (
                      allBets[activePlayer].map((row) => (
                        <tr key={row.date} className="border-b border-gray-300 bg-[#fbe5d6] hover:bg-[#eddcd0] transition-colors">
                          <td className="border-r border-gray-400 px-2 py-2 text-center bg-[#fff2cc] text-black font-bold">{row.date}</td>
                          
                          {/* Match 1 */}
                          <td className="border-r border-gray-400 px-2 py-2 text-black font-medium">
                            <span className="mr-2 text-lg" title="Sport">{row.match1.sport}</span> 
                            {row.match1.name}
                          </td>
                          <td className="border-r border-gray-400 px-2 py-2 text-center text-black">{row.match1.tip}</td>
                          <td className="border-r border-gray-400 px-2 py-2 text-center text-black font-mono">{row.match1.status !== 'empty' ? row.match1.odds.toFixed(2) : ''}</td>
                          <td onClick={() => onToggleStatus(row.date, "match1")} className={`border-r border-gray-400 px-2 py-2 text-center font-bold cursor-pointer select-none ${getStatusStyle(row.match1.status)} hover:opacity-80`}>{getStatusText(row.match1.status)}</td>
                          
                          {/* Match 2 */}
                          <td className="border-r border-gray-400 px-2 py-2 text-black font-medium">
                             <span className="mr-2 text-lg" title="Sport">{row.match2.sport}</span>
                             {row.match2.name}
                          </td>
                          <td className="border-r border-gray-400 px-2 py-2 text-center text-black">{row.match2.tip}</td>
                          <td className="border-r border-gray-400 px-2 py-2 text-center text-black font-mono">{row.match2.status !== 'empty' ? row.match2.odds.toFixed(2) : ''}</td>
                          <td onClick={() => onToggleStatus(row.date, "match2")} className={`px-2 py-2 text-center font-bold cursor-pointer select-none ${getStatusStyle(row.match2.status)} hover:opacity-80`}>{getStatusText(row.match2.status)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                  <tfoot>
                    <tr className={`${theme.bg} font-black text-2xl border-t-2 border-black text-white`}>
                      <td className="px-4 py-3 text-right uppercase" colSpan={1}>Total:</td>
                      <td className="px-4 py-3 text-center" colSpan={8}>{calculateTotal()}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}