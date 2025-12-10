"use client";

import { Trash2, Loader2 } from "lucide-react";
import { useTransition } from "react";
import { deleteMember } from "@/actions/registrationActions";

export default function DeleteClubMemberButton({ memberId }: { memberId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm("Are you sure you want to remove this member?")) return;
    
    startTransition(async () => {
      await deleteMember(memberId);
    });
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isPending}
      className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-50"
    >
      {isPending ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
    </button>
  );
}
