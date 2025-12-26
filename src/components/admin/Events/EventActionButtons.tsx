"use client";

import { toggleEventStatus, toggleEventRegistration } from "@/actions/eventActionsventActions";
import { Loader2, Eye, EyeOff, Lock, Unlock } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

// --- 1. LIVE / DEAD TOGGLE ---
export function ToggleStatusButton({ id, isLive }: { id: string, isLive: boolean }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleToggle() {
    setLoading(true);
    await toggleEventStatus(id);
    router.refresh();
    setLoading(false);
  }

  return (
    <button 
      onClick={handleToggle}
      disabled={loading}
      className={`
        flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer
        ${isLive 
          ? "bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20" 
          : "bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-500"}
      `}
    >
      {loading ? <Loader2 size={12} className="animate-spin" /> : (isLive ? <Eye size={12} /> : <EyeOff size={12} />)}
      {isLive ? "LIVE (Active)" : "HIDDEN (Dead)"}
    </button>
  );
}

// --- 2. REGISTRATION TOGGLE ---
export function ToggleRegButton({ id, isOpen, isFull }: { id: string, isOpen: boolean, isFull: boolean }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleToggle() {
    setLoading(true);
    await toggleEventRegistration(id);
    router.refresh();
    setLoading(false);
  }

  // Logic: If manually CLOSED, show Red Closed.
  // If OPEN but FULL, show Orange Warning.
  // If OPEN and Space Available, show Blue Open.

  if (!isOpen) {
    return (
      <button onClick={handleToggle} disabled={loading} className="text-[10px] flex items-center gap-1 text-red-400 hover:text-red-300 uppercase font-bold tracking-wide cursor-pointer">
        {loading ? <Loader2 size={10} className="animate-spin" /> : <Lock size={10} />}
        Reg Closed
      </button>
    );
  }

  if (isFull) {
    return (
       <div className="text-[10px] flex items-center gap-1 text-orange-400 uppercase font-bold tracking-wide cursor-not-allowed opacity-80 cursor-pointer">
          <Lock size={10} /> Full (Auto-Closed)
       </div>
    );
  }

  return (
    <button onClick={handleToggle} disabled={loading} className="text-[10px] flex items-center gap-1 text-[#00f0ff] hover:text-white uppercase font-bold tracking-wide cursor-pointer">
      {loading ? <Loader2 size={10} className="animate-spin" /> : <Unlock size={10} />}
      Reg Open
    </button>
  );
}