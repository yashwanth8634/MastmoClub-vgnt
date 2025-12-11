"use client";

import { useState } from "react";
import { updateEvent } from "@/actions/eventActions";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

interface EventData {
  _id: string;
  title: string;
  date?: string;
  time?: string;
  location?: string;
  description: string;
  isTeamEvent?: boolean;
  minTeamSize?: number;
  maxTeamSize?: number;
  rules?: string[];
}

export default function EditEventForm({ event, id }: { event: EventData, id: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Helper to format date for input (YYYY-MM-DD)
  const defaultDate = event.date ? new Date(event.date).toISOString().split('T')[0] : "";

  async function handleSubmit(formData: FormData) {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    const result = await updateEvent(id, formData);
    
    if (result && !result.success) {
      alert(result.message);
      setIsSubmitting(false);
    } else {
      // Success - Redirect back to list
      router.push("/admin/dashboard-group/events");
      router.refresh();
    }
  }

  return (
    <div className="max-w-3xl mx-auto pb-20">
      <Link href="/admin/dashboard-group/events" className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
        <ArrowLeft size={18} /> Back to Events
      </Link>

      <h1 className="text-3xl font-bold mb-8">Edit Event: <span className="text-[#00f0ff]">{event.title}</span></h1>

      <form action={handleSubmit} className="space-y-6">
        
        {/* Title */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-gray-400">Event Title</label>
          <input name="title" defaultValue={event.title} required className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-[#00f0ff] outline-none" />
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-400">Date</label>
            <input type="date" name="date" defaultValue={defaultDate} required className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-[#00f0ff] outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-400">Time</label>
            <input type="text" name="time" defaultValue={event.time} placeholder="e.g. 2:00 PM" required className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-[#00f0ff] outline-none" />
          </div>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-gray-400">Location</label>
          <input name="location" defaultValue={event.location} required className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-[#00f0ff] outline-none" />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-gray-400">Description</label>
          <textarea name="description" defaultValue={event.description} rows={4} required className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-[#00f0ff] outline-none" />
        </div>

        {/* Team Settings */}
        <div className="p-6 bg-white/5 rounded-xl border border-white/10 space-y-4">
          <div className="flex items-center gap-3">
            <input type="checkbox" name="isTeamEvent" defaultChecked={event.isTeamEvent} id="isTeam" className="w-5 h-5 accent-[#00f0ff]" />
            <label htmlFor="isTeam" className="text-sm font-bold text-white cursor-pointer">Is this a Team Event?</label>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-400">Min Team Size</label>
              <input type="number" name="minTeamSize" defaultValue={event.minTeamSize || 1} min="1" className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-[#00f0ff] outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-400">Max Team Size</label>
              <input type="number" name="maxTeamSize" defaultValue={event.maxTeamSize || 1} min="1" className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-[#00f0ff] outline-none" />
            </div>
          </div>
        </div>

        {/* Rules */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-gray-400">Rules (One per line)</label>
          <textarea 
            name="rules" 
            defaultValue={event.rules?.join("\n")} 
            rows={5} 
            placeholder="Rule 1&#10;Rule 2&#10;Rule 3"
            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-[#00f0ff] outline-none font-mono text-sm" 
          />
        </div>

        {/* Submit Button with "Double Click" Fix */}
        <button 
          type="submit" 
          disabled={isSubmitting} 
          className={`w-full font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors ${
            isSubmitting 
              ? "bg-gray-600 text-gray-400 cursor-not-allowed" 
              : "bg-[#00f0ff] text-black hover:bg-white"
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" size={20} /> Updating...
            </>
          ) : (
            <>
              <Save size={20} /> Update Event
            </>
          )}
        </button>

      </form>
    </div>
  );
}