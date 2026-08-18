"use client";

import { PuzzleItem } from "@/types/game";
import { Reorder, useMotionValue } from "framer-motion";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface SortableItemProps {
  item: PuzzleItem;
  index: number;
}

export function SortableItem({ item, index }: SortableItemProps) {
  const y = useMotionValue(0);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <Reorder.Item
      value={item}
      id={item.id}
      style={{ y }}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      className={cn(
        "relative flex items-center gap-3 p-4 mb-3 bg-white dark:bg-neutral-800 rounded-xl border-2 transition-colors cursor-grab active:cursor-grabbing",
        isDragging ? "border-blue-500 shadow-xl z-10" : "border-neutral-200 dark:border-neutral-700 shadow-sm"
      )}
    >
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400 font-bold text-sm">
        {index + 1}
      </div>
      
      <div className="flex-1 font-medium text-lg text-neutral-800 dark:text-neutral-100">
        {item.name}
      </div>
      
      <div className="text-neutral-400 flex items-center justify-center active:cursor-grabbing">
        <GripVertical size={20} />
      </div>
    </Reorder.Item>
  );
}
