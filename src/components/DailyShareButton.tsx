"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { Puzzle, PuzzleResult } from "@/types/game";
import { generateDailyShareText, PlayerStats } from "@/lib/gameLogic";

interface DailyShareButtonProps {
  dailyPuzzles: Puzzle[];
  completedPuzzles: Record<string, PuzzleResult>;
  stats: PlayerStats;
}

export function DailyShareButton({ dailyPuzzles, completedPuzzles, stats }: DailyShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const text = generateDailyShareText(dailyPuzzles, completedPuzzles, stats);

    if (navigator.share) {
      try {
        await navigator.share({
          title: "ORDER Daily Challenge Result",
          text: text,
        });
        return;
      } catch (err) {
        // If user cancels or share fails, fallback to clipboard
        console.log("Share failed or was cancelled", err);
      }
    }

    // Fallback to clipboard
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="mt-6 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105 shadow-md mx-auto"
    >
      {copied ? (
        <>
          <Check size={20} />
          Copied to clipboard!
        </>
      ) : (
        <>
          <Share2 size={20} />
          Share Result
        </>
      )}
    </button>
  );
}
