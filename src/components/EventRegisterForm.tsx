"use client";

import { useState } from "react"; 
import { registerForEvent } from "@/actions/EventRegistrationAction"; 
import { Loader2, Plus, Trash2, AlertCircle, CheckCircle, User, Users } from "lucide-react";

interface EventType {
  _id: string;
  title: string;
  isTeamEvent: boolean;
  minTeamSize: number;
  maxTeamSize: number;
}

export default function EventRegisterForm({ event }: { event: EventType }) {
  
  if (!event || !event._id) {
    return (
      <div className="w-full max-w-2xl mx-auto h-64 flex flex-col items-center justify-center text-gray-500 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
        <Loader2 className="animate-spin mb-2 text-[#00f0ff]" /> 
        <span className="text-sm font-mono">Loading event data...</span>
      </div>
    );
  }

  const minSize = event.minTeamSize || 1;
  const initialExtraMembers = event.isTeamEvent ? Math.max(0, minSize - 1) : 0;
  
  const [extraMemberCount, setExtraMemberCount] = useState(initialExtraMembers);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<any>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setStatus(null);

    const formData = new FormData(e.currentTarget);
    formData.append("eventId", event._id);
    formData.append("college", "VGNT"); 

    // Handle Team Members
    const teamMembersArray = [];
    for (let i = 0; i < extraMemberCount; i++) {
        const name = formData.get(`member_name_${i}`);
        const roll = formData.get(`member_roll_${i}`);
        if (name && roll) {
            teamMembersArray.push({ name, rollNo: roll });
        }
    }
    if (teamMembersArray.length > 0) {
        formData.append("teamMembers", JSON.stringify(teamMembersArray));
    }

    const result = await registerForEvent(null, formData);
    setStatus(result);
    
    if (!result.success) setIsSubmitting(false); 
  }

  if (status?.success) {
    return (
      <div className="w-full max-w-2xl bg-black/80 backdrop-blur-xl border border-green-500/30 rounded-3xl p-10 text-center animate-in zoom-in shadow-[0_0_50px_rgba(0,255,0,0.15)]">
        <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(0,255,0,0.6)]" />
        <h2 className="text-3xl font-bold text-white mb-2">You're In!</h2>
        <p className="text-gray-400 text-lg">
           Registration confirmed for <span className="text-[#00f0ff] font-bold">{event.title}</span>.
        </p>
        <button onClick={() => window.location.reload()} className="mt-8 px-8 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white font-bold transition-all hover:scale-105 border border-white/10">
          Register Another
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
      
      {/* Background Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent opacity-50 blur-sm"></div>

      {/* HEADER */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white tracking-tight drop-shadow-md">
          Register for <br className="md:hidden" /> 
          <span className="text-[#00f0ff]">{event.title}</span>
        </h1>
        {event.isTeamEvent ? (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 text-purple-300 text-xs font-bold uppercase tracking-wider border border-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                <Users size={14} /> Team Event ({event.minTeamSize}-{event.maxTeamSize} Members)
            </div>
        ) : (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-300 text-xs font-bold uppercase tracking-wider border border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                <User size={14} /> Individual Event
            </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* TEAM NAME (Only if Team Event) */}
        {event.isTeamEvent && (
          <div className="space-y-2 animate-in slide-in-from-bottom-2">
            <label className="text-xs font-bold uppercase text-gray-500 ml-1">Team Name</label>
            <input 
              name="teamName" 
              required 
              placeholder="e.g. The Code Warriors" 
              className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-[#00f0ff] focus:bg-black outline-none transition-all placeholder:text-gray-700 font-medium" 
            />
          </div>
        )}

        {/* --- SECTION 1: PARTICIPANT DETAILS --- */}
        <div className="p-6 bg-white/[0.03] border border-white/10 rounded-2xl relative mt-6">
            <div className="absolute -top-3 left-4 bg-black px-3 text-xs font-bold text-[#00f0ff] border border-white/10 rounded-full uppercase tracking-wider shadow-lg">
                {event.isTeamEvent ? "Team Leader" : "Your Details"}
            </div>
            
            <div className="space-y-4 mt-2">
                {/* Row 1: Name & Roll No */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[10px] uppercase text-gray-500 font-bold ml-1">Full Name</label>
                        <input name="fullName" required placeholder="Full Name" className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm text-white focus:border-[#00f0ff] outline-none transition-colors" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] uppercase text-gray-500 font-bold ml-1">Roll Number</label>
                        <input name="rollNo" required placeholder="22WJ1A0..." className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm text-white focus:border-[#00f0ff] outline-none transition-colors" />
                    </div>
                </div>

                {/* Row 2: Year, Branch, Section */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                        <label className="text-[10px] uppercase text-gray-500 font-bold ml-1">Year</label>
                        <select name="year" className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm text-white focus:border-[#00f0ff] outline-none appearance-none cursor-pointer">
                            {["1", "2", "3", "4"].map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] uppercase text-gray-500 font-bold ml-1">Branch</label>
                        <select name="branch" className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm text-white focus:border-[#00f0ff] outline-none appearance-none cursor-pointer">
                            {["CSE", "CSE(AI&ML)", "CSE(DS)", "AI&ML", "CSE(IT)", "ECE", "EEE", "CIVIL", "MECH", "AI&DS"].map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] uppercase text-gray-500 font-bold ml-1">Section</label>
                        <select name="section" className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm text-white focus:border-[#00f0ff] outline-none appearance-none cursor-pointer">
                            {["A", "B", "C", "D"].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                </div>
            </div>
        </div>

        {/* --- SECTION 2: TEAM MEMBERS --- */}
        {event.isTeamEvent && (
            <div className="space-y-4">
                {Array.from({ length: extraMemberCount }).map((_, index) => (
                    <div key={index} className="p-5 bg-white/[0.03] border border-white/10 rounded-2xl relative animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="absolute -top-3 left-4 bg-black px-3 text-xs font-bold text-gray-400 border border-white/10 rounded-full uppercase tracking-wider">
                            Team Member {index + 1}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase text-gray-500 font-bold ml-1">Full Name</label>
                                <input name={`member_name_${index}`} required placeholder="Member Name" className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm text-white focus:border-[#00f0ff] outline-none" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase text-gray-500 font-bold ml-1">Roll Number</label>
                                <input name={`member_roll_${index}`} required placeholder="Member Roll No" className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm text-white focus:border-[#00f0ff] outline-none" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
        
        {/* CONTROLS */}
        {event.isTeamEvent && (
          <div className="flex justify-center gap-4 pt-2">
            {(extraMemberCount + 1) < event.maxTeamSize && (
              <button type="button" onClick={() => setExtraMemberCount(c => c + 1)} className="flex items-center gap-2 text-[#00f0ff] bg-[#00f0ff]/5 border border-[#00f0ff]/20 px-5 py-2.5 rounded-full hover:bg-[#00f0ff]/10 text-xs font-bold uppercase tracking-wider transition-all">
                <Plus size={14} /> Add Member
              </button>
            )}
            {(extraMemberCount + 1) > (event.minTeamSize || 1) && (
              <button type="button" onClick={() => setExtraMemberCount(c => c - 1)} className="flex items-center gap-2 text-red-400 bg-red-500/5 border border-red-500/20 px-5 py-2.5 rounded-full hover:bg-red-500/10 text-xs font-bold uppercase tracking-wider transition-all">
                <Trash2 size={14} /> Remove Member
              </button>
            )}
          </div>
        )}

        {/* ERROR BOX */}
        {status?.success === false && (
          <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-300 animate-in shake">
            <AlertCircle size={20} className="shrink-0" /> 
            <span className="text-sm font-medium">{status.message}</span>
          </div>
        )}

        {/* SUBMIT */}
        <button 
          type="submit" 
          disabled={isSubmitting} 
          className={`w-full py-4 font-bold text-lg rounded-xl transition-all flex justify-center items-center gap-2 shadow-lg ${
            isSubmitting 
              ? "bg-gray-800 text-gray-500 cursor-not-allowed border border-white/5" 
              : "bg-[#00f0ff] text-black hover:bg-white hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] border border-[#00f0ff]"
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" size={20} /> 
              <span>Registering...</span>
            </>
          ) : (
            "Complete Registration"
          )}
        </button>
      </form>
    </div>
  );
}