"use client";

import { useEffect, useState } from "react";
import { puzzles } from "@/data/puzzles";
import { getPuzzlesByDate, getTodayDateString, computePlayerStats, PlayerStats } from "@/lib/gameLogic";
import { getGameState } from "@/lib/storage";
import { GameState } from "@/types/game";
import Link from "next/link";
import { Play, CheckCircle2, Trophy, Flame } from "lucide-react";
import { DailyShareButton } from "@/components/DailyShareButton";

// Fallback to recent date if no puzzles are available for today during development/MVP
const fallbackDate = puzzles[puzzles.length - 1]?.date;

export default function Home() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [derivedStats, setDerivedStats] = useState<PlayerStats | null>(null);
  
  const today = getTodayDateString();
  let todayPuzzles = getPuzzlesByDate(puzzles, today);
  
  // Dev fallback: if we haven't generated a full batch for today yet, use the latest available date
  if (todayPuzzles.length < 5 && fallbackDate) {
    todayPuzzles = getPuzzlesByDate(puzzles, fallbackDate);
  }

  useEffect(() => {
    const state = getGameState();
    setGameState(state);
    setDerivedStats(computePlayerStats(state.completedPuzzles, puzzles));
  }, []);

  if (!gameState || !derivedStats) {
    return null; // avoid hydration mismatch
  }

  // Calculate today's overall score
  let todayScore = 0;
  let completedCount = 0;
  
  todayPuzzles.forEach(puzzle => {
    const result = gameState.completedPuzzles[puzzle.id];
    if (result) {
      todayScore += result.score;
      completedCount += 1;
    }
  });

  return (
    <div className="flex flex-col items-center max-w-2xl mx-auto w-full animate-in fade-in duration-500">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-black mb-2 text-neutral-800 dark:text-neutral-100 tracking-tighter">ORDER</h1>
        <p className="text-lg font-medium text-neutral-500 dark:text-neutral-400">Can you get 25/25?</p>
      </div>

      <div className="w-full mb-8">
        {completedCount === 5 ? (
          todayScore === 25 ? (
            <div className="w-full bg-gradient-to-br from-yellow-400 to-orange-500 text-white rounded-3xl p-8 text-center shadow-lg transform transition-all hover:scale-[1.02]">
              <Trophy className="w-12 h-12 mx-auto mb-4 text-yellow-100" />
              <h2 className="text-3xl font-black mb-1 tracking-tight">PERFECT DAY</h2>
              <div className="text-5xl font-black">25/25</div>
              
              <DailyShareButton 
                dailyPuzzles={todayPuzzles}
                completedPuzzles={gameState.completedPuzzles}
                stats={derivedStats}
              />
            </div>
          ) : (
            <div className="w-full bg-neutral-900 dark:bg-neutral-800 text-white rounded-3xl p-8 text-center shadow-md">
              <h2 className="text-xl font-bold mb-2 text-neutral-400 uppercase tracking-widest">Today's Score</h2>
              <div className="text-5xl font-black mb-2">{todayScore}<span className="text-3xl text-neutral-500">/25</span></div>
              
              <DailyShareButton 
                dailyPuzzles={todayPuzzles}
                completedPuzzles={gameState.completedPuzzles}
                stats={derivedStats}
              />
            </div>
          )
        ) : (
          <div className="w-full bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 text-center shadow-sm">
            <h2 className="text-sm font-bold mb-2 text-neutral-400 uppercase tracking-widest">Today's Score</h2>
            <div className="text-5xl font-black text-neutral-800 dark:text-neutral-100">
              {completedCount === 0 ? "__" : todayScore}
              <span className="text-3xl text-neutral-300 dark:text-neutral-700">/25</span>
            </div>
          </div>
        )}
      </div>

      <div className="w-full flex items-center mb-6">
        <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">Today's Challenge</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        {todayPuzzles.map((puzzle) => {
          const isCompleted = !!gameState.completedPuzzles[puzzle.id];
          const score = gameState.completedPuzzles[puzzle.id]?.score;

          return (
            <Link 
              key={puzzle.id}
              href={`/play/${puzzle.id}`}
              className={`relative flex flex-col p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md ${
                isCompleted 
                  ? "bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 opacity-80"
                  : "bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700"
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <span className="inline-block px-3 py-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 text-xs font-bold tracking-wider uppercase rounded-full">
                  {puzzle.category}
                </span>
                
                {isCompleted ? (
                  <div className="flex items-center gap-1 text-sm font-bold text-green-600 dark:text-green-500">
                    {score}/5 <CheckCircle2 className="w-5 h-5" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Play className="w-4 h-4 ml-0.5" />
                  </div>
                )}
              </div>
              
              <h3 className={`font-semibold ${isCompleted ? 'text-neutral-500' : 'text-neutral-800 dark:text-neutral-100'}`}>
                {puzzle.question}
              </h3>
            </Link>
          );
        })}
      </div>
      
      {todayPuzzles.length === 0 && (
        <div className="text-center py-12 text-neutral-500">
          No puzzles available. Please generate some using the AI script!
        </div>
      )}
    </div>
  );
}
