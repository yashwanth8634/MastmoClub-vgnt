"use client";

import { useFormStatus } from "react-dom";
import { Check, X } from "lucide-react";

interface MembershipActionButtonProps {
  id: string;
  status: "approved" | "rejected";
  action: (formData: FormData) => Promise<void>;
}

export default function MembershipActionButton({ id, status, action }: MembershipActionButtonProps) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={status} />
      <SubmitButton status={status} />
    </form>
  );
}

function SubmitButton({ status }: { status: "approved" | "rejected" }) {
  const { pending } = useFormStatus();

  return (
    <>
      {status === "approved" ? (
        <button 
          type="submit"
          disabled={pending}
          className="p-2 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 cursor-pointer transition-colors w-[36px] h-[36px] flex items-center justify-center disabled:opacity-50"
        >
          {pending ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-green-400 border-t-transparent" /> : <Check size={18} />}
        </button>
      ) : (
        <button 
          type="submit"
          disabled={pending}
          className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 cursor-pointer transition-colors w-[36px] h-[36px] flex items-center justify-center disabled:opacity-50"
        >
          {pending ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-400 border-t-transparent" /> : <X size={18} />}
        </button>
      )}
    </>
  );
}
