"use client";

import { useEffect, useState } from "react";
import { BarChart3, X, Flame, Trophy } from "lucide-react";
import { getGameState } from "@/lib/storage";
import { GameState } from "@/types/game";

export function StatsModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [stats, setStats] = useState<GameState | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStats(getGameState());
    }
  }, [isOpen]);

  const totalPlayed = stats ? Object.keys(stats.completedPuzzles).length : 0;
  
  // Calculate average score
  let averageScore = 0;
  if (stats && totalPlayed > 0) {
    const totalScore = Object.values(stats.completedPuzzles).reduce((acc, curr) => acc + curr.score, 0);
    averageScore = totalScore / totalPlayed;
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
        aria-label="View Statistics"
      >
        <BarChart3 className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-4 border-b border-neutral-100 dark:border-neutral-800">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-500" />
                Your Statistics
              </h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-xl text-center">
                  <div className="text-3xl font-black mb-1">{totalPlayed}</div>
                  <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Categories Played</div>
                </div>
                <div className="bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-xl text-center">
                  <div className="text-3xl font-black mb-1">{averageScore.toFixed(1)}</div>
                  <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Average Score</div>
                </div>
              </div>

              <h3 className="font-semibold text-sm text-neutral-400 uppercase tracking-wider mb-3">Play Streaks</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex flex-col items-center justify-center p-4 border border-orange-100 dark:border-orange-900/30 bg-orange-50/50 dark:bg-orange-900/10 rounded-xl">
                  <Flame className="w-6 h-6 text-orange-500 mb-2" />
                  <div className="text-2xl font-bold">{stats?.playStreak || 0}</div>
                  <div className="text-xs text-neutral-500 text-center">Current Days</div>
                </div>
                <div className="flex flex-col items-center justify-center p-4 border border-neutral-100 dark:border-neutral-800 rounded-xl">
                  <Trophy className="w-6 h-6 text-neutral-400 mb-2" />
                  <div className="text-2xl font-bold">{stats?.bestPlayStreak || 0}</div>
                  <div className="text-xs text-neutral-500 text-center">Best Days</div>
                </div>
              </div>

              <h3 className="font-semibold text-sm text-neutral-400 uppercase tracking-wider mb-3">Perfect Streaks (5/5)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center justify-center p-4 border border-blue-100 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl">
                  <Flame className="w-6 h-6 text-blue-500 mb-2" />
                  <div className="text-2xl font-bold">{stats?.perfectStreak || 0}</div>
                  <div className="text-xs text-neutral-500 text-center">Current Perfects</div>
                </div>
                <div className="flex flex-col items-center justify-center p-4 border border-neutral-100 dark:border-neutral-800 rounded-xl">
                  <Trophy className="w-6 h-6 text-neutral-400 mb-2" />
                  <div className="text-2xl font-bold">{stats?.bestPerfectStreak || 0}</div>
                  <div className="text-xs text-neutral-500 text-center">Best Perfects</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
