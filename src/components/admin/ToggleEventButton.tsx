"use client";

import { toggleEventStatus } from "@/actions/eventActions";
import { Archive, Loader2, RotateCcw } from "lucide-react";
import { useTransition } from "react";

interface Props {
  id: string;
  isPast: boolean;
}

export default function ToggleEventButton({ id, isPast }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      await toggleEventStatus(id, isPast);
    });
  };

  return (
    <button 
      onClick={handleToggle}
      disabled={isPending}
      className={`p-2 rounded-lg transition-colors ${
        isPast 
          ? "text-yellow-400 hover:bg-yellow-500/10" // Yellow for Restore
          : "text-gray-400 hover:text-white hover:bg-white/10" // Gray for Archive
      }`}
      title={isPast ? "Restore to Active" : "Move to Archive"}
    >
      {isPending ? (
        <Loader2 size={18} className="animate-spin" /> 
      ) : isPast ? (
        <RotateCcw size={18} /> // Restore Icon
      ) : (
        <Archive size={18} />   // Archive Icon
      )}
    </button>
  );
}