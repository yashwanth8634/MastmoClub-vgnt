"use client";

import { deleteRegistration } from "@/actions/registrationActions";
import { Trash2, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";

export default function DeleteRegButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this registration?");
    if (!confirmed) return;

    startTransition(async () => {
      const result = await deleteRegistration(id);
      if (!result.success) {
        alert(result.message);
      }
    });
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isPending}
      className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-50"
      title="Delete Entry"
    >
      {isPending ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
    </button>
  );
}