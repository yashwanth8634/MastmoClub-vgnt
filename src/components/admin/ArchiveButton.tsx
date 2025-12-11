"use client";

import { useState } from "react";
import { toggleEventStatus } from "@/actions/eventActions";
import { Archive, RefreshCcw, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface ArchiveButtonProps {
  id: string;
  isPast: boolean;
}

export default function ArchiveButton({ id, isPast }: ArchiveButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleToggle() {
    setIsLoading(true);
    await toggleEventStatus(id, isPast);
    router.refresh(); // Refresh UI to show new status
    setIsLoading(false);
  }

  return (
    <button 
      onClick={handleToggle} 
      disabled={isLoading}
      className={`p-2 rounded-lg transition-all ${
        isPast 
          ? "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500 hover:text-black" // Yellow for "Restore"
          : "bg-gray-500/10 text-gray-400 hover:bg-gray-500 hover:text-white"    // Gray for "Archive"
      }`}
      title={isPast ? "Restore to Active" : "Archive Event"}
    >
      {isLoading ? (
        <Loader2 className="animate-spin" size={18} />
      ) : isPast ? (
        <RefreshCcw size={18} /> // Icon for Restore
      ) : (
        <Archive size={18} />    // Icon for Archive
      )}
    </button>
  );
}