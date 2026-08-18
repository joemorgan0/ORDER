export interface PuzzleItem {
  id: string;
  name: string;
  value: string;
  numericValue?: number;
}

export interface Puzzle {
  id: string;
  date: string; // YYYY-MM-DD
  category: string;
  question: string;
  items: PuzzleItem[];
  difficulty?: string;
  order?: 'asc' | 'desc';
}

export interface PuzzleResult {
  score: number;
  submittedOrder: string[]; // array of item IDs
  dateCompleted: string;
}

export interface GameState {
  completedPuzzles: Record<string, PuzzleResult>; // key is puzzle id
  playStreak: number;
  bestPlayStreak: number;
  perfectStreak: number;
  bestPerfectStreak: number;
  lastPlayedDate: string | null;
}
