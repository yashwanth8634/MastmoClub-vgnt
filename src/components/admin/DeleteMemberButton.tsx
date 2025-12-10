"use client";

import { deleteTeamMember } from "@/actions/teamActions";
import { Trash2, Loader2 } from "lucide-react";
import { useTransition } from "react";

export default function DeleteMemberButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm("Remove this member?")) return;
    
    startTransition(async () => {
      await deleteTeamMember(id);
    });
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isPending}
      className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
    >
      {isPending ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
    </button>
  );
}