"use client";

import { useEffect, useState } from "react";
import { puzzles } from "@/data/puzzles";
import { getGameState } from "@/lib/storage";
import { GameState } from "@/types/game";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

export default function ArchivePage() {
  const [gameState, setGameState] = useState<GameState | null>(null);

  useEffect(() => {
    setGameState(getGameState());
  }, []);

  if (!gameState) return null;

  // Sort puzzles by date descending (newest first)
  const sortedPuzzles = [...puzzles].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="max-w-2xl mx-auto w-full animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black text-neutral-800 dark:text-neutral-100">
          Puzzle Archive
        </h1>
        
        <div className="text-right">
          <div className="text-sm text-neutral-500 dark:text-neutral-400 font-medium uppercase tracking-wider">
            Current Streak
          </div>
          <div className="text-2xl font-bold text-orange-500 flex items-center justify-end gap-1">
            🔥 {gameState.currentStreak}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {sortedPuzzles.map(puzzle => {
          const result = gameState.completedPuzzles[puzzle.id];
          const isCompleted = !!result;

          return (
            <Link 
              key={puzzle.id} 
              href={isCompleted ? `/play/${puzzle.id}` : `/play/${puzzle.id}?archive=true`}
              className={cn(
                "block p-6 rounded-2xl border transition-all hover:scale-[1.02]",
                isCompleted 
                  ? "bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 shadow-sm"
                  : "bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900 shadow-sm hover:shadow-md"
              )}
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-bold tracking-wider uppercase text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded">
                      {puzzle.category}
                    </span>
                    <span className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">
                      {new Date(puzzle.date).toLocaleDateString(undefined, {
                        month: 'short', day: 'numeric', year: 'numeric'
                      })}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg text-neutral-800 dark:text-neutral-200 line-clamp-2">
                    {puzzle.question}
                  </h3>
                </div>

                {isCompleted ? (
                  <div className="flex flex-col items-end gap-1 min-w-[60px]">
                    <CheckCircle2 className="text-green-500" size={24} />
                    <span className="text-sm font-bold text-neutral-600 dark:text-neutral-300">
                      {result.score}/5
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-10 px-4 bg-blue-600 text-white font-semibold rounded-full text-sm">
                    Play
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
