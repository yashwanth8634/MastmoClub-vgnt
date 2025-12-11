"use client";

import { useState, useRef } from "react"; // ❌ Removed useTransition
import { submitRegistration } from "@/actions/submitRegistration";
import { Loader2, Plus, Trash2, AlertCircle, CheckCircle } from "lucide-react";

interface EventType {
  _id: string;
  title: string;
  isTeamEvent: boolean;
  minTeamSize: number;
  maxTeamSize: number;
}

const BRANCHES = ["CSE", "CSM", "CSD", "AIML", "IT", "ECE", "EEE", "CIVIL", "MECH"];
const SECTIONS = ["A", "B", "C", "D"];

export default function EventRegisterForm({ event }: { event: EventType }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [memberCount, setMemberCount] = useState(event.isTeamEvent ? event.minTeamSize : 1);
  
  // ✅ FIX: Manual State Lock
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<any>(null);

  async function handleSubmit(formData: FormData) {
    // ✅ 1. SAFETY LOCK: Stop if already running
    if (isSubmitting) return;
    setIsSubmitting(true); // Lock immediately

    // Append logic data
    formData.append("type", "event");
    formData.append("eventId", event._id);
    formData.append("memberCount", memberCount.toString());
    
    // Call Server Action
    const result = await submitRegistration(null, formData);
    setStatus(result);
    
    if (result.success) {
      if (formRef.current) formRef.current.reset();
      setMemberCount(event.isTeamEvent ? event.minTeamSize : 1);
      // We keep isSubmitting = true here so they can't click again while success shows
    } else {
      setIsSubmitting(false); // Unlock only on error so they can try again
    }
  }

  if (status?.success) {
    return (
      <div className="text-center py-10 animate-in zoom-in">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-white">Registration Successful!</h2>
        <p className="text-gray-400 mt-2">Your spot for {event.title} is confirmed.</p>
        <button onClick={() => window.location.reload()} className="mt-6 text-[#00f0ff] hover:underline">
          Register Another Team
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
      <h1 className="text-3xl font-bold mb-2 text-center">Register for {event.title}</h1>
      <p className="text-center text-gray-400 mb-8 text-sm">
        {event.isTeamEvent ? `Team Event (${event.minTeamSize}-${event.maxTeamSize} Members)` : "Individual Event"}
      </p>

      <form ref={formRef} action={handleSubmit} className="space-y-8">
        
        {/* ... (Keep your existing Input Fields for Team Name & Members here) ... */}
        {/* I am omitting the inputs to save space, paste them back here exactly as they were */}
        
        {/* Team Controls */}
        {event.isTeamEvent && (
          <div className="flex gap-4">
            {memberCount < event.maxTeamSize && (
              <button type="button" onClick={() => setMemberCount(c => c + 1)} className="flex items-center gap-2 text-[#00f0ff] hover:underline text-sm font-bold"><Plus size={16} /> Add Member</button>
            )}
            {memberCount > event.minTeamSize && (
              <button type="button" onClick={() => setMemberCount(c => c - 1)} className="flex items-center gap-2 text-red-400 hover:underline text-sm font-bold"><Trash2 size={16} /> Remove</button>
            )}
          </div>
        )}

        {/* Error Message */}
        {status?.success === false && (
          <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-200">
            <AlertCircle size={20} /> {status.message}
          </div>
        )}

        {/* ✅ FIX: SUBMIT BUTTON */}
        <button 
          type="submit" // Ensure type is submit
          disabled={isSubmitting} // Lock Button
          className={`w-full py-4 font-bold text-lg rounded-xl transition-all flex justify-center items-center gap-2 ${
            isSubmitting 
              ? "bg-gray-600 text-gray-400 cursor-not-allowed" 
              : "bg-[#00f0ff] text-black hover:bg-white"
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" /> Registering...
            </>
          ) : (
            "Complete Registration"
          )}
        </button>
      </form>
    </div>
  );
}