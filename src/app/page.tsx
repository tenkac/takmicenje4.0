"use client";
import React, { useState, useEffect } from "react";
import { AllPlayersData, Match, BettingRow, EMPTY_MATCH } from "../types";
import LandingPage from "../components/LandingPage";
import Leaderboard from "../components/Leaderboard";
import PlayerTable from "../components/PlayerTable";
import Login from "../components/Login"; // <--- NEW IMPORT
import { supabase } from "../lib/supabase"; 

export default function BettingApp() {
  // --- STATE ---
  const [currentView, setCurrentView] = useState<"landing" | "leaderboard" | "tables">("landing");
  const [activePlayer, setActivePlayer] = useState<string>("Vlado");
  
  // DATA STATE
  const [allBets, setAllBets] = useState<AllPlayersData>({
    Vlado: [], Fika: [], Labud: [], Ilija: [], Dzoni: [],
  });

  // AUTH STATE <--- NEW
  const [session, setSession] = useState<any>(null);
  const [appLoading, setAppLoading] = useState(true); // Renamed to cover both Auth & Data

  // --- 1. INITIALIZATION (Auth & Data) ---
  useEffect(() => {
    const initApp = async () => {
      setAppLoading(true);

      // A. Check for existing session
      const { data: { session: existingSession } } = await supabase.auth.getSession();
      setSession(existingSession);

      // B. Fetch Data (We do this regardless of login since your DB is public-read)
      const { data: betsData, error } = await supabase
        .from('player_bets')
        .select('player_name, bets');

      if (betsData) {
        const newAllBets: AllPlayersData = { ...allBets };
        betsData.forEach((row: any) => {
          if (newAllBets[row.player_name]) {
            newAllBets[row.player_name] = row.bets || [];
          }
        });
        setAllBets(newAllBets);
      }

      setAppLoading(false);
    };

    initApp();

    // C. Listen for Auth Changes (Login/Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);


  // --- 2. SAVE TO DB ---
  const savePlayerToDb = async (playerName: string, updatedRows: BettingRow[]) => {
    const { error } = await supabase
      .from('player_bets')
      .update({ bets: updatedRows })
      .eq('player_name', playerName);

    if (error) console.error("Error saving:", error);
  };

  // --- 3. ADD PICK LOGIC ---
  const addPick = (date: string, sport: string, matchName: string, tip: string, odds: number) => {
    // Optional: Double check ownership here if you want extra security
    // if (session?.user.email !== OWNER_EMAILS[activePlayer]) return;

    const newMatch: Match = { sport, name: matchName, tip, odds, status: "pending" };

    setAllBets((prev) => {
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

      savePlayerToDb(activePlayer, rows);
      return { ...prev, [activePlayer]: rows };
    });
  };

  // --- 4. TOGGLE LOGIC ---
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

      savePlayerToDb(activePlayer, rows);
      return { ...prev, [activePlayer]: rows };
    });
  };

  // --- 5. RENDER HELPERS ---

  // A. Loading Screen
  if (appLoading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-black to-blue-900 text-white font-sans p-6 text-center">
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-orange-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="relative z-10 animate-pulse">
        <h1 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter leading-none mb-4">
          TAKMICENJE <span className="text-blue-500">LIVE</span>
        </h1>
        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
        </div>
        <p className="mt-6 text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-[0.4em]">
          Authenticating
        </p>
      </div>
    </div>
  );

  // B. Login Wall (If not logged in, STOP here)
  if (!session) {
    return <Login onLogin={() => { /* Session updates automatically via onAuthStateChange */ }} />;
  }

  // C. Main App Views
  if (currentView === "landing") {
     return <LandingPage onNavigate={setCurrentView} />;
  }
  
  if (currentView === "leaderboard") {
    return (
        <Leaderboard 
            allBets={allBets} 
            onBack={() => { 
                // Refresh data when coming back from leaderboard
                // (Optional, but good practice)
                setCurrentView("landing"); 
            }} 
        />
    );
  }
  
  // D. Player Table (The Arena)
  return (
    <PlayerTable
      allBets={allBets}
      activePlayer={activePlayer}
      setActivePlayer={setActivePlayer}
      onAddPick={addPick}
      onToggleStatus={toggleStatus}
      onBack={() => setCurrentView("landing")}
      userEmail={session.user.email} // <--- PASS EMAIL DOWN
    />
  );
}