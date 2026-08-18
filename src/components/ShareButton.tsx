"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { Puzzle, PuzzleResult } from "@/types/game";
import { generateShareText } from "@/lib/gameLogic";

interface ShareButtonProps {
  puzzle: Puzzle;
  result: PuzzleResult;
}

export function ShareButton({ puzzle, result }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const text = generateShareText(puzzle, result);

    if (navigator.share) {
      try {
        await navigator.share({
          title: "ORDER Result",
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
      className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition-colors w-full sm:w-auto"
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
