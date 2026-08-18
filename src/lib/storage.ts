import { GameState } from "@/types/game";

const STORAGE_KEY = "order-game-state";

export const getGameState = (): GameState => {
  if (typeof window === "undefined") {
    return {
      completedPuzzles: {},
      playStreak: 0,
      bestPlayStreak: 0,
      perfectStreak: 0,
      bestPerfectStreak: 0,
      lastPlayedDate: null,
    };
  }
  
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      // Migration from old state
      if (parsed.currentStreak !== undefined) {
        parsed.playStreak = parsed.currentStreak;
        parsed.bestPlayStreak = parsed.bestStreak;
        parsed.perfectStreak = 0;
        parsed.bestPerfectStreak = 0;
        delete parsed.currentStreak;
        delete parsed.bestStreak;
      }
      return parsed;
    } catch (e) {
      console.error("Failed to parse game state", e);
    }
  }
  
  return {
    completedPuzzles: {},
    playStreak: 0,
    bestPlayStreak: 0,
    perfectStreak: 0,
    bestPerfectStreak: 0,
    lastPlayedDate: null,
  };
};

export const saveGameState = (state: GameState): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};
