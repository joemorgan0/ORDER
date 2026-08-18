# ORDER

ORDER is a daily trivia game where you put five items in the correct order. 
It's a minimalist, offline-capable progressive web application built for fun.

## How it works

- **Daily Puzzles**: A new puzzle is available every day.
- **Goal**: Drag and drop the five items into the correct order based on the question (e.g. "Release date, oldest to newest").
- **Scoring**: You get 1 point for every item that is in the correct position, up to a maximum of 5.
- **Streaks**: Play on consecutive days to build your streak.
- **Local Storage**: Your progress, scores, and streak are saved automatically in your browser. No account needed.
- **Archive**: Missed a day? You can play past puzzles in the Archive without affecting your daily streak.

## Tech Stack

- **Next.js (App Router)**
- **React & TypeScript**
- **Tailwind CSS**
- **Framer Motion** (for fluid drag and drop animations)
- **Lucide React** (icons)

## Project Structure

- `src/app/`: Next.js pages and routing (Home and Archive).
- `src/components/`: Reusable UI components (`GameContainer`, `SortableList`, `ResultView`, etc).
- `src/data/puzzles.ts`: Static puzzle data.
- `src/lib/`: Core game logic and local storage utilities.
- `src/types/`: TypeScript definitions for the data model.

## How to add a puzzle

Open `src/data/puzzles.ts` and add a new object to the `puzzles` array. 
The date must be unique and in `YYYY-MM-DD` format.
The game will automatically pick up the puzzle on that date.

```typescript
{
  id: "unique-id",
  date: "2026-10-01",
  category: "Space",
  question: "Put these planets in order of distance from the sun, closest to furthest.",
  items: [
    { id: "1", name: "Mercury", value: "58 million km", numericValue: 58 },
    { id: "2", name: "Venus", value: "108 million km", numericValue: 108 },
    // ... exactly 5 items
  ]
}
```

## AI Puzzle Generation

The project includes an automated script that uses Google Gemini to generate new puzzles. 
This script runs automatically every night at midnight via a **GitHub Action** (`.github/workflows/daily-puzzle.yml`), appending a new puzzle for the next day to `src/data/puzzles.json`.

**To run the AI generator locally:**

1. Create a `.env` file in the root directory.
2. Add your Google Gemini API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```
3. Run the generator script:
   ```bash
   npm run generate-puzzle
   ```

## Running locally

Make sure you have Node.js installed.

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open `http://localhost:3000` in your browser.

## Testing

To test the core game logic:

```bash
npm test
```
