"use client";

import { PuzzleItem } from "@/types/game";
import { Reorder } from "framer-motion";
import { SortableItem } from "./SortableItem";
import { useEffect, useState } from "react";

interface SortableListProps {
  items: PuzzleItem[];
  onReorder: (items: PuzzleItem[]) => void;
}

export function SortableList({ items, onReorder }: SortableListProps) {
  // We need to maintain local state for framer-motion Reorder to work smoothly
  const [localItems, setLocalItems] = useState(items);

  // Sync if props change significantly (e.g. new puzzle)
  useEffect(() => {
    setLocalItems(items);
  }, [items]);

  const handleReorder = (newOrder: PuzzleItem[]) => {
    setLocalItems(newOrder);
    onReorder(newOrder);
  };

  return (
    <Reorder.Group 
      axis="y" 
      values={localItems} 
      onReorder={handleReorder} 
      className="list-none p-0 m-0 w-full"
    >
      {localItems.map((item, index) => (
        <SortableItem key={item.id} item={item} index={index} />
      ))}
    </Reorder.Group>
  );
}
