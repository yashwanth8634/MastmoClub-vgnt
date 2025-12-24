"use client";

import { useState, useRef } from "react"; 
import { submitRegistration } from "@/actions/submitRegistration";
import { Loader2, Plus, Trash2, AlertCircle, CheckCircle, User, Users } from "lucide-react";

interface EventType {
  _id: string;
  title: string;
  isTeamEvent: boolean;
  minTeamSize: number;
  maxTeamSize: number;
}

const BRANCHES = ["CSE", "CSM", "CSD", "AIML", "IT", "ECE", "EEE", "CIVIL", "MECH"];
const SECTIONS = ["A", "B", "C", "D"];
const YEARS = ["1", "2", "3", "4"];

export default function EventRegisterForm({ event }: { event: EventType }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [memberCount, setMemberCount] = useState(event.isTeamEvent ? event.minTeamSize : 1);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<any>(null);

  async function handleSubmit(formData: FormData) {
    if (isSubmitting) return;
    setIsSubmitting(true); 

    // Append hidden logic data
    formData.append("type", "event");
    formData.append("eventId", event._id);
    formData.append("memberCount", memberCount.toString());
    
    // Call Server Action
    const result = await submitRegistration(null, formData);
    setStatus(result);
    
    if (result.success) {
      if (formRef.current) formRef.current.reset();
      setMemberCount(event.isTeamEvent ? event.minTeamSize : 1);
      // Keep loading state true to prevent double clicks during success animation
    } else {
      setIsSubmitting(false); 
    }
  }

  if (status?.success) {
    return (
      <div className="text-center py-10 animate-in zoom-in w-full max-w-2xl bg-black/60 backdrop-blur-xl border border-green-500/20 rounded-3xl p-8">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-white">Registration Successful!</h2>
        <p className="text-gray-400 mt-2">Your spot for <span className="text-[#00f0ff]">{event.title}</span> is confirmed.</p>
        <button onClick={() => window.location.reload()} className="mt-8 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors">
          Register Another Team
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 text-white">Register for {event.title}</h1>
        {event.isTeamEvent ? (
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm border border-purple-500/30">
                <Users size={14} /> Team Event ({event.minTeamSize}-{event.maxTeamSize} Members)
            </span>
        ) : (
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm border border-blue-500/30">
                <User size={14} /> Individual Event
            </span>
        )}
      </div>

      <form ref={formRef} action={handleSubmit} className="space-y-8">
        
        {/* 1. TEAM NAME (Only if Team Event) */}
        {event.isTeamEvent && (
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-400 ml-1">Team Name</label>
            <input 
              name="teamName" 
              required 
              placeholder="e.g. The Code Warriors" 
              className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-[#00f0ff] outline-none transition-colors"
            />
          </div>
        )}

        {/* 2. MEMBER INPUT LOOP */}
        <div className="space-y-6">
          {Array.from({ length: memberCount }).map((_, index) => (
            <div key={index} className="p-5 bg-white/5 border border-white/10 rounded-2xl relative animate-in fade-in slide-in-from-bottom-4 duration-500">
               {/* Label */}
               <div className="absolute -top-3 left-4 bg-black px-2 text-xs font-bold text-[#00f0ff] border border-white/10 rounded-md">
                 {index === 0 ? (event.isTeamEvent ? "Team Leader" : "Participant Details") : `Member ${index + 1}`}
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  {/* Name */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase text-gray-500 font-bold">Full Name</label>
                    <input name={`name_${index}`} required placeholder="Full Name" className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm text-white focus:border-[#00f0ff] outline-none" />
                  </div>

                  {/* Roll Number */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase text-gray-500 font-bold">Roll Number</label>
                    <input name={`roll_${index}`} required placeholder="22WJ1A0..." className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm text-white focus:border-[#00f0ff] outline-none" />
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase text-gray-500 font-bold">Email</label>
                    <input name={`email_${index}`} type="email" required placeholder="email@college.edu" className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm text-white focus:border-[#00f0ff] outline-none" />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase text-gray-500 font-bold">Phone</label>
                    <input name={`phone_${index}`} type="tel" required placeholder="9876543210" className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm text-white focus:border-[#00f0ff] outline-none" />
                  </div>

                  {/* Branch, Year & Section (Grid of 3) */}
                  <div className="md:col-span-2 grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                        <label className="text-[10px] uppercase text-gray-500 font-bold">Year</label>
                        <select name={`year_${index}`} className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm text-white focus:border-[#00f0ff] outline-none">
                            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] uppercase text-gray-500 font-bold">Branch</label>
                        <select name={`branch_${index}`} className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm text-white focus:border-[#00f0ff] outline-none">
                            {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] uppercase text-gray-500 font-bold">Section</label>
                        <select name={`section_${index}`} className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm text-white focus:border-[#00f0ff] outline-none">
                            {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                  </div>
               </div>
            </div>
          ))}
        </div>
        
        {/* 3. TEAM CONTROLS */}
        {event.isTeamEvent && (
          <div className="flex justify-center gap-6 pt-2">
            {memberCount < event.maxTeamSize && (
              <button type="button" onClick={() => setMemberCount(c => c + 1)} className="flex items-center gap-2 text-[#00f0ff] bg-[#00f0ff]/10 px-4 py-2 rounded-full hover:bg-[#00f0ff]/20 text-sm font-bold transition-colors">
                <Plus size={16} /> Add Member
              </button>
            )}
            {memberCount > event.minTeamSize && (
              <button type="button" onClick={() => setMemberCount(c => c - 1)} className="flex items-center gap-2 text-red-400 bg-red-500/10 px-4 py-2 rounded-full hover:bg-red-500/20 text-sm font-bold transition-colors">
                <Trash2 size={16} /> Remove Member
              </button>
            )}
          </div>
        )}

        {/* ERROR MESSAGE */}
        {status?.success === false && (
          <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-200 animate-in shake">
            <AlertCircle size={20} /> {status.message}
          </div>
        )}

        {/* SUBMIT BUTTON */}
        <button 
          type="submit" 
          disabled={isSubmitting} 
          className={`w-full py-4 font-bold text-lg rounded-xl transition-all flex justify-center items-center gap-2 shadow-lg ${
            isSubmitting 
              ? "bg-gray-600 text-gray-400 cursor-not-allowed" 
              : "bg-[#00f0ff] text-black hover:bg-white hover:shadow-[#00f0ff]/20 hover:scale-[1.01]"
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