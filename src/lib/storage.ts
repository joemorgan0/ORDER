import { GameState } from "@/types/game";

const STORAGE_KEY = "order-game-state";

export const getGameState = (): GameState => {
  if (typeof window === "undefined") {
    return {
      completedPuzzles: {},
      currentStreak: 0,
      bestStreak: 0,
      lastPlayedDate: null,
    };
  }
  
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse game state", e);
    }
  }
  
  return {
    completedPuzzles: {},
    currentStreak: 0,
    bestStreak: 0,
    lastPlayedDate: null,
  };
};

export const saveGameState = (state: GameState): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};
