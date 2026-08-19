import { calculateScore, getCorrectOrder, isConsecutiveDay, generateDailyShareText, getPuzzleByDate, PlayerStats } from "./gameLogic";
import { Puzzle, PuzzleResult } from "@/types/game";

describe("gameLogic", () => {
  const mockPuzzle: Puzzle = {
    id: "test",
    date: "2026-08-18",
    category: "Test",
    question: "Test question",
    items: [
      { id: "1", name: "A", value: "1", numericValue: 1 },
      { id: "2", name: "B", value: "2", numericValue: 2 },
      { id: "3", name: "C", value: "3", numericValue: 3 },
      { id: "4", name: "D", value: "4", numericValue: 4 },
      { id: "5", name: "E", value: "5", numericValue: 5 },
    ]
  };

  test("getCorrectOrder", () => {
    // Intentionally mess up the order
    const puzzle = {
      ...mockPuzzle,
      items: [mockPuzzle.items[2], mockPuzzle.items[0], mockPuzzle.items[4], mockPuzzle.items[1], mockPuzzle.items[3]]
    };
    expect(getCorrectOrder(puzzle)).toEqual(["1", "2", "3", "4", "5"]);
  });

  test("calculateScore - perfect", () => {
    expect(calculateScore(["1", "2", "3", "4", "5"], ["1", "2", "3", "4", "5"])).toBe(5);
  });

  test("calculateScore - completely wrong", () => {
    expect(calculateScore(["5", "4", "1", "2", "3"], ["1", "2", "3", "4", "5"])).toBe(0);
  });

  test("calculateScore - partial", () => {
    // 1 and 3 are in correct positions
    expect(calculateScore(["1", "4", "3", "5", "2"], ["1", "2", "3", "4", "5"])).toBe(2);
  });

  test("isConsecutiveDay", () => {
    expect(isConsecutiveDay("2026-08-17T12:00:00Z", "2026-08-18T15:00:00Z")).toBe(true);
    expect(isConsecutiveDay("2026-08-17", "2026-08-19")).toBe(false);
    expect(isConsecutiveDay("2026-08-31", "2026-09-01")).toBe(true);
  });

  test("generateDailyShareText", () => {
    const result: PuzzleResult = {
      score: 3,
      submittedOrder: ["1", "2", "5", "4", "3"],
      dateCompleted: "2026-08-18"
    };
    
    const stats: PlayerStats = {
      playStreak: 2,
      bestPlayStreak: 2,
      perfectStreak: 0,
      bestPerfectStreak: 1,
      perfectDays: 1
    };

    const text = generateDailyShareText([mockPuzzle], { "test": result }, stats);
    expect(text).toContain("ORDER — Daily Challenge");
    expect(text).toContain("🟩🟩🟥🟩🟥");
    expect(text).toContain("3/25");
    expect(text).toContain("2 day streak");
  });

  test("getPuzzleByDate", () => {
    const puzzles = [mockPuzzle];
    expect(getPuzzleByDate(puzzles, "2026-08-18")).toEqual(mockPuzzle);
    expect(getPuzzleByDate(puzzles, "2026-08-19")).toBeUndefined();
  });
});
