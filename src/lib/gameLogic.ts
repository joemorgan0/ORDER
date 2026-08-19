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


const CATEGORY_EMOJIS: Record<string, string> = {
  'Movies': '🎬',
  'Video Games': '🎮',
  'Geography': '🌍',
  'Music': '🎵',
  'Science': '🔬',
  'History': '🏛️',
  'Sports': '⚽',
  'Literature': '📚',
  'Art': '🎨',
  'Technology': '💻',
  'Nature': '🌲'
};

/**
 * Generates spoiler-free text for sharing the full daily challenge result
 */
export function generateDailyShareText(
  dailyPuzzles: Puzzle[],
  completedPuzzles: Record<string, PuzzleResult>,
  stats: PlayerStats
): string {
  let text = "ORDER — Daily Challenge\n\n";
  let totalScore = 0;
  
  for (const puzzle of dailyPuzzles) {
    const result = completedPuzzles[puzzle.id];
    if (!result) continue; // Should only be called when all 5 are done
    
    totalScore += result.score;
    const correctOrder = getCorrectOrder(puzzle);
    
    const emoji = CATEGORY_EMOJIS[puzzle.category] || '🔹';
    let grid = "";
    for (let i = 0; i < result.submittedOrder.length; i++) {
      grid += result.submittedOrder[i] === correctOrder[i] ? "🟩" : "🟥";
    }
    text += `${emoji} ${grid}\n`;
  }
  
  text += "\n";
  
  const maxScore = dailyPuzzles.length * 5;
  
  if (totalScore === maxScore) {
    text += `💎 PERFECT DAY\n${totalScore}/${maxScore}\n\n`;
  } else {
    text += `${totalScore}/${maxScore}\n\n`;
  }
  
  text += `🔥 ${stats.playStreak} day streak\n\n`;
  
  if (totalScore === maxScore) {
    text += `Can you get ${maxScore}/${maxScore}?\nhttps://joemorgan0.github.io/ORDER`;
  } else {
    text += `Can you beat me?\nhttps://joemorgan0.github.io/ORDER`;
  }
  
  return text;
}

export interface PlayerStats {
  playStreak: number;
  bestPlayStreak: number;
  perfectStreak: number;
  bestPerfectStreak: number;
  perfectDays: number;
}

/**
 * Computes all streaks and stats dynamically from the history of completed puzzles
 */
export function computePlayerStats(completedPuzzles: Record<string, PuzzleResult>, puzzles: Puzzle[]): PlayerStats {
  let playStreak = 0;
  let bestPlayStreak = 0;
  let perfectStreak = 0;
  let bestPerfectStreak = 0;
  let perfectDays = 0;

  // Group puzzles by date
  const puzzlesByDate: Record<string, Puzzle[]> = {};
  for (const p of puzzles) {
    if (!puzzlesByDate[p.date]) puzzlesByDate[p.date] = [];
    puzzlesByDate[p.date].push(p);
  }

  // Sort dates chronologically
  const sortedDates = Object.keys(puzzlesByDate).sort();
  const today = getTodayDateString();

  for (const date of sortedDates) {
    // Ignore future dates that shouldn't affect current streaks
    if (date > today) continue;

    const dailyPuzzles = puzzlesByDate[date];
    const totalPuzzles = dailyPuzzles.length;
    let completedCount = 0;
    let dailyScore = 0;

    for (const p of dailyPuzzles) {
      if (completedPuzzles[p.id]) {
        completedCount++;
        dailyScore += completedPuzzles[p.id].score;
      }
    }

    if (totalPuzzles > 0 && completedCount === totalPuzzles) {
      // Completed all puzzles for this day!
      playStreak++;
      bestPlayStreak = Math.max(bestPlayStreak, playStreak);

      if (dailyScore === totalPuzzles * 5) {
        perfectStreak++;
        bestPerfectStreak = Math.max(bestPerfectStreak, perfectStreak);
        perfectDays++;
      } else {
        perfectStreak = 0;
      }
    } else {
      // Did not complete all puzzles for this day.
      // Break streaks, unless the date is today (they might still be playing today).
      if (date !== today) {
        playStreak = 0;
        perfectStreak = 0;
      }
    }
  }

  return { playStreak, bestPlayStreak, perfectStreak, bestPerfectStreak, perfectDays };
}
