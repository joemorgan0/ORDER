import { puzzles } from "@/data/puzzles";
import { GameContainer } from "@/components/GameContainer";
import Link from "next/link";

export async function generateStaticParams() {
  return puzzles.map((puzzle) => ({
    id: puzzle.id,
  }));
}

export default async function PlayPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  const puzzle = puzzles.find(p => p.id === resolvedParams.id);

  if (!puzzle) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 text-center py-12">
        <h1 className="text-4xl font-black mb-4">Puzzle not found</h1>
        <p className="text-xl text-neutral-500 mb-8 max-w-md">
          We couldn&apos;t find the puzzle you were looking for.
        </p>
        <Link 
          href="/" 
          className="px-8 py-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold rounded-full transition-transform hover:scale-105"
        >
          Back to Categories
        </Link>
      </div>
    );
  }

  return <GameContainer puzzle={puzzle} />;
}
