import { puzzles } from "@/data/puzzles";
import { getPuzzleByDate, getTodayDateString } from "@/lib/gameLogic";
import { GameContainer } from "@/components/GameContainer";
import Link from "next/link";

export default function Home() {
  const today = getTodayDateString();
  const puzzle = getPuzzleByDate(puzzles, today);

  if (!puzzle) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 text-center py-12">
        <h1 className="text-4xl font-black mb-4">You&apos;re early!</h1>
        <p className="text-xl text-neutral-500 mb-8 max-w-md">
          There isn&apos;t a puzzle available for today yet. Check back later, or play a past puzzle!
        </p>
        <Link 
          href="/archive" 
          className="px-8 py-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold rounded-full transition-transform hover:scale-105"
        >
          View Archive
        </Link>
      </div>
    );
  }

  return <GameContainer puzzle={puzzle} />;
}
