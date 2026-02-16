"use client";
import React, { useState, useEffect } from "react";
import { AllPlayersData, Match, BettingRow, EMPTY_MATCH, PLAYERS } from "../types";
import LandingPage from "../components/LandingPage";
import Leaderboard from "../components/Leaderboard";
import PlayerTable from "../components/PlayerTable";
import { supabase } from "../lib/supabase"; // Import the DB connection

export default function BettingApp() {
  const [currentView, setCurrentView] = useState<"landing" | "leaderboard" | "tables">("landing");
  const [activePlayer, setActivePlayer] = useState<string>("Vlado");
  const [loading, setLoading] = useState(true); // Loading state

  const [allBets, setAllBets] = useState<AllPlayersData>({
    Vlado: [], Fika: [], Labud: [], Ilija: [], Dzoni: [],
  });

  // --- 1. FETCH DATA FROM DATABASE ---
  const fetchBets = async () => {
    setLoading(true);
    // Get all rows from the 'player_bets' table
    const { data, error } = await supabase
      .from('player_bets')
      .select('player_name, bets');

    if (error) {
      console.error('Error fetching:', error);
    } else if (data) {
      // Convert database rows back to our app format
      const newAllBets: AllPlayersData = { ...allBets };
      data.forEach((row: any) => {
        if (newAllBets[row.player_name]) {
            newAllBets[row.player_name] = row.bets || [];
        }
      });
      setAllBets(newAllBets);
    }
    setLoading(false);
  };

  // Run fetch when the app starts
  useEffect(() => {
    fetchBets();
  }, []);

  // --- 2. SAVE SPECIFIC PLAYER TO DATABASE ---
  const savePlayerToDb = async (playerName: string, updatedRows: BettingRow[]) => {
    const { error } = await supabase
      .from('player_bets')
      .update({ bets: updatedRows })     // Update the 'bets' column
      .eq('player_name', playerName);    // Where name equals the player

    if (error) console.error("Error saving:", error);
  };


  // --- LOGIC: Add Pick ---
  const addPick = (date: string, sport: string, matchName: string, tip: string, odds: number) => {
    const newMatch: Match = { sport, name: matchName, tip, odds, status: "pending" };

    setAllBets((prev) => {
      // 1. Calculate the new state locally (so the UI feels instant)
      const rows = prev[activePlayer] ? [...prev[activePlayer]] : [];
      const index = rows.findIndex((r) => r.date === date);

      if (index !== -1) {
        const existingRow = { ...rows[index] };
        if (existingRow.match1.status === "empty") {
            existingRow.match1 = newMatch;
            rows[index] = existingRow;
        } else if (existingRow.match2.status === "empty") {
            existingRow.match2 = newMatch;
            rows[index] = existingRow;
        } else {
            alert("Maximum 2 picks per day allowed!");
            return prev; 
        }
      } else {
        rows.push({ 
            id: Date.now(), 
            date, 
            match1: newMatch, 
            match2: { ...EMPTY_MATCH } 
        });
        rows.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      }

      // 2. Save to Database immediately
      savePlayerToDb(activePlayer, rows);

      return { ...prev, [activePlayer]: rows };
    });
  };

  // --- LOGIC: Toggle Status ---
  const toggleStatus = (date: string, matchKey: "match1" | "match2") => {
    setAllBets((prev) => {
      const rows = prev[activePlayer].map((row) => {
        if (row.date === date && row[matchKey].status !== "empty") {
          const s = row[matchKey].status;
          const next = s === "pending" ? "win" : s === "win" ? "loss" : "pending";
          return { ...row, [matchKey]: { ...row[matchKey], status: next } };
        }
        return row;
      });

      // Save to Database immediately
      savePlayerToDb(activePlayer, rows);

      return { ...prev, [activePlayer]: rows };
    });
  };

if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-black to-blue-900 text-white font-sans p-6 text-center">
      {/* Background Glows for consistency */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-orange-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 animate-pulse">
        <h1 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter leading-none mb-4">
          TAKMICENJE <span className="text-blue-500"></span>
        </h1>
        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
        </div>
        <p className="mt-6 text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-[0.4em]">
          Entering the Arena
        </p>
      </div>
    </div>
  );
  if (currentView === "landing") return <LandingPage onNavigate={setCurrentView} />;
  
  if (currentView === "leaderboard") {
    // When viewing leaderboard, refresh data first to see other players' updates
    return <Leaderboard allBets={allBets} onBack={() => { fetchBets(); setCurrentView("landing"); }} />;
  }
  
 // Inside src/app/page.tsx, update the return statement for PlayerTable:

  return (
    <PlayerTable
      allBets={allBets}
      activePlayer={activePlayer}
      setActivePlayer={setActivePlayer}
      onAddPick={addPick}
      onToggleStatus={toggleStatus}
      // FIX: Just change the view. Don't trigger extra logic that might conflict with the state.
      onBack={() => setCurrentView("landing")}
    />
  );
}