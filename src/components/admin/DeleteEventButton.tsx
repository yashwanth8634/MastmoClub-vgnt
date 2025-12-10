"use client";

import { deleteEvent } from "@/actions/eventActions";
import { Trash2, Loader2 } from "lucide-react";
import { useTransition } from "react";

export default function DeleteEventButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    // 1. Add Confirmation
    const confirmed = window.confirm("Are you sure you want to delete this event?");
    if (!confirmed) return;

    // 2. Call Server Action
    startTransition(async () => {
      await deleteEvent(id);
    });
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isPending}
      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" 
      title="Delete Event"
    >
      {isPending ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
    </button>
  );
}