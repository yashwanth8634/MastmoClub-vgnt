"use client";

import { useState, useTransition, useRef } from "react";
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
  // Initialize member count based on event type
  const [memberCount, setMemberCount] = useState(event.isTeamEvent ? event.minTeamSize : 1);
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<any>(null);

  const handleSubmit = (formData: FormData) => {
    // Append necessary logic data for the Server Action
    formData.append("type", "event");
    formData.append("eventId", event._id);
    formData.append("memberCount", memberCount.toString());
    
    startTransition(async () => {
      const result = await submitRegistration(null, formData);
      setStatus(result);
      
      // Only reset form on successful submission
      if (result.success && formRef.current) {
        formRef.current.reset();
      }
    });
  };

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
        
        {/* Team Name (Only for Team Events) */}
        {event.isTeamEvent && (
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#00f0ff] uppercase">Team Name</label>
            <input name="teamName" required className="w-full bg-black border border-white/20 rounded-xl p-4 text-white focus:border-[#00f0ff] outline-none" placeholder="e.g. The Code Breakers" />
          </div>
        )}

        {/* Member Details Loop */}
        <div className="space-y-6">
          {Array.from({ length: memberCount }).map((_, index) => (
            <div key={index} className="p-6 bg-white/5 rounded-2xl border border-white/10 relative">
              <span className="absolute top-4 right-4 text-xs font-bold text-gray-500 uppercase">Member {index + 1}</span>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input name={event.isTeamEvent ? `member_${index}_fullName` : `fullName`} required placeholder="Full Name" className="bg-black border border-white/20 rounded-lg p-3 w-full text-sm focus:border-[#00f0ff] outline-none" />
                <input name={event.isTeamEvent ? `member_${index}_email` : `email`} required type="email" placeholder="Email" className="bg-black border border-white/20 rounded-lg p-3 w-full text-sm focus:border-[#00f0ff] outline-none" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input name={event.isTeamEvent ? `member_${index}_rollNo` : `rollNo`} required placeholder="Roll No (24891A...)" className="bg-black border border-white/20 rounded-lg p-3 w-full text-sm font-mono uppercase focus:border-[#00f0ff] outline-none" />
                <input name={event.isTeamEvent ? `member_${index}_phone` : `phone`} required placeholder="Phone" className="bg-black border border-white/20 rounded-lg p-3 w-full text-sm focus:border-[#00f0ff] outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <select name={event.isTeamEvent ? `member_${index}_branch` : `branch`} required className="bg-black border border-white/20 rounded-lg p-3 w-full text-sm">
                  <option value="">Branch</option>
                  {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
                <select name={event.isTeamEvent ? `member_${index}_section` : `section`} required className="bg-black border border-white/20 rounded-lg p-3 w-full text-sm">
                  <option value="">Sec</option>
                  {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          ))}
        </div>

        {/* Team Controls (Add/Remove) */}
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

        {/* Submit Button */}
        <button disabled={isPending} className="w-full py-4 bg-[#00f0ff] text-black font-bold text-lg rounded-xl hover:bg-white transition-all flex justify-center items-center gap-2">
          {isPending ? <Loader2 className="animate-spin" /> : "Complete Registration"}
        </button>
      </form>
    </div>
  );
}