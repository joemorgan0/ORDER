"use client";

import { useEffect, useState } from "react";
import { Puzzle, PuzzleResult, GameState, PuzzleItem } from "@/types/game";
import { SortableList } from "./SortableList";
import { ResultView } from "./ResultView";
import { getCorrectOrder, calculateScore, isConsecutiveDay } from "@/lib/gameLogic";
import { getGameState, saveGameState } from "@/lib/storage";

interface GameContainerProps {
  puzzle: Puzzle;
  isArchive?: boolean;
}

export function GameContainer({ puzzle, isArchive = false }: GameContainerProps) {
  const [mounted, setMounted] = useState(false);
  const [items, setItems] = useState<PuzzleItem[]>(puzzle.items);
  const [gameState, setGameState] = useState<GameState | null>(null);
  
  // Is this puzzle already completed?
  const completedResult = gameState?.completedPuzzles[puzzle.id];

  useEffect(() => {
    // Only access localStorage on the client
    const state = getGameState();
    setGameState(state);
    
    // If we haven't played, shuffle items slightly so they aren't in the correct order or starting order
    // But since the starting order in data isn't necessarily correct, we just use it as is for simplicity, 
    // or we can randomly shuffle them once on mount if not played.
    if (!state.completedPuzzles[puzzle.id]) {
      const shuffled = [...puzzle.items].sort(() => Math.random() - 0.5);
      setItems(shuffled);
    }
    
    setMounted(true);
  }, [puzzle]);

  if (!mounted || !gameState) return null; // Avoid hydration mismatch

  if (completedResult) {
    return <ResultView puzzle={puzzle} result={completedResult} />;
  }

  const handleSubmit = () => {
    const submittedOrder = items.map(i => i.id);
    const correctOrder = getCorrectOrder(puzzle);
    const score = calculateScore(submittedOrder, correctOrder);
    
    const result: PuzzleResult = {
      score,
      submittedOrder,
      dateCompleted: new Date().toISOString(),
    };

    let newCurrentStreak = gameState.currentStreak;
    let newBestStreak = gameState.bestStreak;
    let newLastPlayed = gameState.lastPlayedDate;

    // Only update streak if it's not an archive play
    if (!isArchive) {
      if (gameState.lastPlayedDate && isConsecutiveDay(gameState.lastPlayedDate, result.dateCompleted)) {
        newCurrentStreak += 1;
      } else {
        newCurrentStreak = 1;
      }
      newBestStreak = Math.max(gameState.bestStreak, newCurrentStreak);
      newLastPlayed = result.dateCompleted;
    }

    const newState: GameState = {
      ...gameState,
      completedPuzzles: {
        ...gameState.completedPuzzles,
        [puzzle.id]: result
      },
      currentStreak: newCurrentStreak,
      bestStreak: newBestStreak,
      lastPlayedDate: newLastPlayed
    };

    setGameState(newState);
    saveGameState(newState);
  };

  return (
    <div className="flex flex-col items-center max-w-lg w-full mx-auto animate-in fade-in duration-500">
      
      <div className="mb-8 text-center">
        <span className="inline-block px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 text-sm font-bold tracking-wider uppercase rounded-full mb-4">
          {puzzle.category}
        </span>
        <h2 className="text-xl md:text-2xl font-semibold text-neutral-800 dark:text-neutral-100">
          {puzzle.question}
        </h2>
      </div>

      <div className="w-full mb-8">
        <SortableList items={items} onReorder={setItems} />
      </div>

      <button
        onClick={handleSubmit}
        className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-full shadow-lg shadow-blue-500/30 transition-all hover:scale-105 active:scale-95"
      >
        Submit Answer
      </button>

    </div>
  );
}
