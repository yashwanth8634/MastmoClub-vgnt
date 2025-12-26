"use client";

import { useState } from "react";
import { deleteEvent } from "@/actions/EventActions"; 
import { Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DeleteButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this event?")) return;
    setIsDeleting(true);
    await deleteEvent(id);
    // Router refresh handles the UI update without full reload
    router.refresh(); 
    setIsDeleting(false);
  }

  return (
    <button 
      onClick={handleDelete} 
      disabled={isDeleting}
      className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all"
      title="Delete Event"
    >
      {isDeleting ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
    </button>
  );
}