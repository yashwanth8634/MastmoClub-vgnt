"use client";

import { createEvent } from "@/actions/eventActions";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewEventPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTeam, setIsTeam] = useState(false); // Toggle for team inputs
  const router = useRouter();

    async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    const result = await createEvent(formData);
    if (result && !result.success) {
      alert(result.message);
      setIsSubmitting(false);
    } else {
      router.push("/admin/dashboard-group/events");
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/admin/dashboard-group/events" className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
        <ArrowLeft size={18} /> Back to List
      </Link>      <h1 className="text-3xl font-bold mb-8">Create New Event</h1>

      <form action={handleSubmit} className="space-y-6">
        
        {/* Title */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Event Title</label>
          <input name="title" required className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-[#00f0ff] outline-none" placeholder="Math Hackathon v2.0" />
        </div>

        {/* Date, Time, Deadline */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Event Date (Text)</label>
            <input name="date" required placeholder="Oct 24, 2025" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-[#00f0ff] outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Time</label>
            <input name="time" required placeholder="10:00 AM" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-[#00f0ff] outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-red-400">Reg. Deadline</label>
            <input name="deadline" type="datetime-local" required className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-red-500 outline-none" />
          </div>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Location</label>
          <input name="location" required placeholder="VGNT Auditorium" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-[#00f0ff] outline-none" />
        </div>

        {/* Team Configuration */}
        <div className="p-6 bg-white/5 rounded-xl border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <input 
              type="checkbox" 
              name="isTeamEvent" 
              id="isTeam" 
              className="w-5 h-5 accent-[#00f0ff]"
              onChange={(e) => setIsTeam(e.target.checked)}
            />
            <label htmlFor="isTeam" className="text-white font-bold">This is a Team Event</label>
          </div>

          {isTeam && (
            <div className="grid grid-cols-2 gap-4 animate-in fade-in">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Min Members</label>
                <input name="minTeamSize" type="number" min="1" defaultValue="2" className="w-full bg-black border border-white/10 rounded-lg p-3 text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Max Members</label>
                <input name="maxTeamSize" type="number" min="1" defaultValue="4" className="w-full bg-black border border-white/10 rounded-lg p-3 text-white" />
              </div>
            </div>
          )}
        </div>

        {/* Description & Rules */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Description</label>
          <textarea name="description" required rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-[#00f0ff] outline-none" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Rules (Line separated)</label>
          <textarea name="rules" rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-[#00f0ff] outline-none font-mono text-sm" />
        </div>

        <button type="submit" disabled={isSubmitting} className="w-full bg-[#00f0ff] text-black font-bold py-4 rounded-xl hover:bg-white transition-colors flex justify-center gap-2">
          {isSubmitting ? "Saving..." : <><Save size={20} /> Publish Event</>}
        </button>

      </form>
    </div>
  );
}