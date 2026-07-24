"use client";

import { Trash2 } from "lucide-react";
import { useTransition } from "react";
import { deleteMember } from "@/actions/ClubRegistrationAction";

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
      className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-50 cursor-pointer"
    >
      {isPending ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : <Trash2 size={18} />}
    </button>
  );
}
