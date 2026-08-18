import { Puzzle, PuzzleResult } from "@/types/game";

/**
 * Returns the correct sorted order of item IDs for a puzzle
 */
export function getCorrectOrder(puzzle: Puzzle): string[] {
  // Sort items based on numericValue. 
  // We assume the question dictates the natural numeric sorting (e.g. lowest to highest)
  const sorted = [...puzzle.items].sort((a, b) => {
    if (puzzle.order === 'desc') {
      return (b.numericValue || 0) - (a.numericValue || 0);
    }
    return (a.numericValue || 0) - (b.numericValue || 0);
  });
  return sorted.map(i => i.id);
}

/**
 * Calculates score based on exact positional match
 */
export function calculateScore(submittedOrder: string[], correctOrder: string[]): number {
  let score = 0;
  for (let i = 0; i < submittedOrder.length; i++) {
    if (submittedOrder[i] === correctOrder[i]) {
      score++;
    }
  }
  return score;
}

/**
 * Gets a specific puzzle by date
 */
export function getPuzzleByDate(puzzles: Puzzle[], dateString: string): Puzzle | undefined {
  return puzzles.find(p => p.date === dateString);
}

/**
 * Gets all puzzles for a specific date (one per category)
 */
export function getPuzzlesByDate(puzzles: Puzzle[], dateString: string): Puzzle[] {
  return puzzles.filter(p => p.date === dateString);
}

/**
 * Gets today's date formatted as YYYY-MM-DD
 */
export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Determines if two dates are consecutive days
 */
export function isConsecutiveDay(lastDateStr: string, currentDateStr: string): boolean {
  const lastDate = new Date(lastDateStr);
  const currentDate = new Date(currentDateStr);
  
  // Set times to midnight to just compare days
  lastDate.setHours(0, 0, 0, 0);
  currentDate.setHours(0, 0, 0, 0);
  
  const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  
  return diffDays === 1;
}

/**
 * Generates spoiler-free text for sharing
 */
export function generateShareText(puzzle: Puzzle, result: PuzzleResult): string {
  const correctOrder = getCorrectOrder(puzzle);
  
  let grid = "";
  for (let i = 0; i < result.submittedOrder.length; i++) {
    if (result.submittedOrder[i] === correctOrder[i]) {
      grid += "🟩 ";
    } else {
      grid += "🟥 ";
    }
  }
  
  return `ORDER #${puzzle.id}\n${puzzle.category}\n${grid.trim()}\n${result.score}/5\n\nCan you beat me?`;
}
