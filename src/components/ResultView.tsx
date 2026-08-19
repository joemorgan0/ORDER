"use client";

import { Puzzle, PuzzleResult } from "@/types/game";
import { getCorrectOrder } from "@/lib/gameLogic";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ResultViewProps {
  puzzle: Puzzle;
  result: PuzzleResult;
}

export function ResultView({ puzzle, result }: ResultViewProps) {
  const correctOrderIds = getCorrectOrder(puzzle);
  
  // Find the full item details for the submitted order
  const submittedItems = result.submittedOrder.map(id => 
    puzzle.items.find(item => item.id === id)!
  );

  // Find the full item details for the correct order
  const correctItems = correctOrderIds.map(id => 
    puzzle.items.find(item => item.id === id)!
  );

  return (
    <div className="flex flex-col items-center max-w-lg w-full mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2 text-neutral-800 dark:text-neutral-100">
          Score: <span className="text-blue-600 dark:text-blue-400">{result.score}</span> / 5
        </h2>
        <p className="text-neutral-500 dark:text-neutral-400">
          {result.score === 5 ? "Perfect! Well done." : "Good try! Here is the correct order."}
        </p>
      </div>

      <div className="w-full bg-white dark:bg-neutral-800 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-700 overflow-hidden mb-8">
        <div className="bg-neutral-50 dark:bg-neutral-900 px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
          <h3 className="font-semibold text-neutral-700 dark:text-neutral-300">Your Answer</h3>
        </div>
        
        <div className="divide-y divide-neutral-100 dark:divide-neutral-700">
          {submittedItems.map((item, index) => {
            const isCorrect = item.id === correctOrderIds[index];
            return (
              <div 
                key={`sub-${item.id}`} 
                className={cn(
                  "px-6 py-4 flex justify-between items-center transition-colors",
                  isCorrect ? "bg-green-50/50 dark:bg-green-900/10" : "bg-red-50/50 dark:bg-red-900/10"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 flex justify-center text-lg">
                    {isCorrect ? "🟩" : "🟥"}
                  </div>
                  <span className="font-medium text-neutral-800 dark:text-neutral-200">
                    {item.name}
                  </span>
                </div>
                <span className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">
                  {item.value}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {result.score < 5 && (
        <div className="w-full bg-white dark:bg-neutral-800 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-700 overflow-hidden mb-8">
          <div className="bg-neutral-50 dark:bg-neutral-900 px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
            <h3 className="font-semibold text-neutral-700 dark:text-neutral-300">Correct Order</h3>
          </div>
          
          <div className="divide-y divide-neutral-100 dark:divide-neutral-700">
            {correctItems.map((item, index) => (
              <div 
                key={`correct-${item.id}`} 
                className="px-6 py-4 flex justify-between items-center bg-white dark:bg-neutral-800"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 flex justify-center text-sm font-bold text-neutral-400">
                    {index + 1}
                  </div>
                  <span className="font-medium text-neutral-800 dark:text-neutral-200">
                    {item.name}
                  </span>
                </div>
                <span className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="w-full flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Link 
          href="/"
          className="px-8 py-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold rounded-full transition-transform hover:scale-105"
        >
          Back to Categories
        </Link>
      </div>
    </div>
  );
}
