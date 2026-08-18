"use client";

import { useEffect, useState } from "react";
import { puzzles } from "@/data/puzzles";
import { getPuzzlesByDate, getTodayDateString } from "@/lib/gameLogic";
import { getGameState } from "@/lib/storage";
import { GameState } from "@/types/game";
import Link from "next/link";
import { Play, CheckCircle2 } from "lucide-react";

// Fallback to recent date if no puzzles are available for today during development/MVP
const fallbackDate = puzzles[puzzles.length - 1]?.date;

export default function Home() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  
  const today = getTodayDateString();
  let todayPuzzles = getPuzzlesByDate(puzzles, today);
  
  // Dev fallback: if no puzzles today, use the latest available date
  if (todayPuzzles.length === 0 && fallbackDate) {
    todayPuzzles = getPuzzlesByDate(puzzles, fallbackDate);
  }

  useEffect(() => {
    setGameState(getGameState());
  }, []);

  if (!gameState) {
    return null; // avoid hydration mismatch
  }

  return (
    <div className="flex flex-col items-center max-w-2xl mx-auto w-full animate-in fade-in duration-500">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-black mb-2 text-neutral-800 dark:text-neutral-100">Daily Categories</h1>
        <p className="text-neutral-500 dark:text-neutral-400">Play all categories to keep your perfect streak alive!</p>
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
