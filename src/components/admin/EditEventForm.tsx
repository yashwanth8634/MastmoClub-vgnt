"use client";

import { useState } from "react";
import { updateEvent } from "@/actions/eventActions";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, Loader2, CalendarClock, Users, MapPin, Image as ImageIcon, X, Lock, Unlock } from "lucide-react";
import Link from "next/link";
import { UploadDropzone } from "@/utils/uploadthing"; 
import Image from "next/image";

// ✅ FIX 1: Added 'registrationOpen' to the interface
interface EventData {
  _id: string;
  title: string;
  date?: string;
  time?: string;
  location?: string;
  category?: string;
  description: string;
  isTeamEvent?: boolean;
  minTeamSize?: number;
  maxTeamSize?: number;
  rules?: string[];
  deadline?: string; 
  maxRegistrations?: number;
  gallery?: string[];
  registrationOpen?: boolean; // Added this
}

export default function EditEventForm({ event, id }: { event: EventData, id: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Gallery State Logic
  const [gallery, setGallery] = useState<string[]>(
    (event.gallery || []).map((item: any) => {
       if (typeof item === "object" && item !== null) {
         return item.src || item.imageUrl || ""; 
       }
       return item; 
    }).filter(url => typeof url === 'string' && url.length > 0)
  );
  
  const router = useRouter();

  // Helper: Format ISO date string
  const formatForInput = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset(); 
    const localDate = new Date(date.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().slice(0, 16);
  };

  async function handleSubmit(formData: FormData) {
    if (isSubmitting) return;
    setIsSubmitting(true);
    formData.set("galleryJSON", JSON.stringify(gallery));
    
    const result = await updateEvent(id, formData);
    
    if (result && !result.success) {
      alert(result.message);
      setIsSubmitting(false);
    } else {
      router.push("/admin/dashboard-group/events");
      router.refresh();
    }
  }

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <Link href="/admin/dashboard-group/events" className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
        <ArrowLeft size={18} /> Back to Events
      </Link>

      <h1 className="text-3xl font-bold mb-8">Edit Event: <span className="text-[#00f0ff]">{event.title}</span></h1>

      <form action={handleSubmit} className="space-y-8">
        
        {/* SECTION 1: BASIC DETAILS */}
        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase mb-2 border-b border-white/10 pb-2">1. Basic Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-500">Event Title</label>
                    <input name="title" defaultValue={event.title} required className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-[#00f0ff] outline-none" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-500">Category</label>
                    <select name="category" defaultValue={event.category || "Event"} className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-[#00f0ff] outline-none">
                        <option value="Event">Event</option>
                        <option value="Hackathon">Hackathon</option>
                        <option value="Workshop">Workshop</option>
                        <option value="Meetup">Meetup</option>
                        <option value="Competition">Competition</option>
                    </select>
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-500">Description</label>
                <textarea name="description" defaultValue={event.description} rows={4} required className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-[#00f0ff] outline-none" />
            </div>
        </div>

        {/* SECTION 2: TIME & LOCATION */}
        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-[#00f0ff] uppercase mb-2 border-b border-white/10 pb-2 flex items-center gap-2">
                <CalendarClock size={16} /> 2. Date, Time & Location
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-500">Event Start Date</label>
                    <input type="datetime-local" name="date" defaultValue={formatForInput(event.date)} required className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-[#00f0ff] outline-none" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-500">Display Time</label>
                    <input name="time" defaultValue={event.time} placeholder="e.g. 10:00 AM - 4:00 PM" required className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-[#00f0ff] outline-none" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-500">Location</label>
                    <div className="relative">
                        <MapPin className="absolute left-4 top-4 text-gray-500" size={18} />
                        <input name="location" defaultValue={event.location} required className="w-full bg-black border border-white/10 rounded-xl p-4 pl-12 text-white focus:border-[#00f0ff] outline-none" />
                    </div>
                </div>
            </div>
        </div>

        {/* SECTION 3: REGISTRATION LIMITS (FIXED) */}
        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-yellow-500 uppercase mb-2 border-b border-white/10 pb-2 flex items-center gap-2">
                <CalendarClock size={16} /> 3. Registration Control
            </h3>

            {/* ✅ FIX 2: ADDED REGISTRATION TOGGLE HERE */}
            <div className="flex items-center justify-between bg-black/40 border border-yellow-500/20 p-4 rounded-xl mb-4">
               <div className="flex items-center gap-3">
                  {event.registrationOpen ? <Unlock className="text-green-500" /> : <Lock className="text-red-500" />}
                  <div>
                     <p className="font-bold text-white">Registration Status</p>
                     <p className="text-xs text-gray-400">Turn ON to accept students.</p>
                  </div>
               </div>
               <label className="relative inline-flex items-center cursor-pointer">
                  {/* CRITICAL: value="true" is needed for the server to see it as true */}
                  <input 
                    type="checkbox" 
                    name="registrationOpen" 
                    defaultChecked={event.registrationOpen} 
                    value="true" 
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
               </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-yellow-500">Registration Deadline</label>
                    <input type="datetime-local" name="deadline" defaultValue={formatForInput(event.deadline)} className="w-full bg-black border border-yellow-500/30 rounded-xl p-4 text-white focus:border-yellow-500 outline-none" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-yellow-500">Max Participants</label>
                    <input type="number" name="maxRegistrations" defaultValue={event.maxRegistrations || 0} min="0" className="w-full bg-black border border-yellow-500/30 rounded-xl p-4 text-white focus:border-yellow-500 outline-none" />
                    <p className="text-[10px] text-gray-500">Set 0 for unlimited.</p>
                </div>
            </div>
        </div>

        {/* SECTION 4: TEAM CONFIGURATION */}
        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-purple-400 uppercase mb-2 border-b border-white/10 pb-2 flex items-center gap-2">
                <Users size={16} /> 4. Team Settings
            </h3>
            <div className="flex items-center gap-3 mb-4 p-3 bg-black/40 rounded-lg border border-white/5">
                <input type="checkbox" name="isTeamEvent" defaultChecked={event.isTeamEvent} id="isTeam" className="w-5 h-5 accent-[#00f0ff]" />
                <label htmlFor="isTeam" className="text-sm font-bold text-white cursor-pointer select-none">Is this a Team Event?</label>
            </div>
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-500">Min Members</label>
                    <input type="number" name="minTeamSize" defaultValue={event.minTeamSize || 1} min="1" className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-[#00f0ff] outline-none" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-500">Max Members</label>
                    <input type="number" name="maxTeamSize" defaultValue={event.maxTeamSize || 1} min="1" className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-[#00f0ff] outline-none" />
                </div>
            </div>
        </div>

        {/* SECTION 5: RULES */}
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

        {/* SECTION 6: EVENT GALLERY */}
        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-pink-500 uppercase mb-2 border-b border-white/10 pb-2 flex items-center gap-2">
                <ImageIcon size={16} /> 5. Event Gallery
            </h3>
            <div className="bg-black/40 border border-dashed border-white/20 rounded-xl overflow-hidden">
                <UploadDropzone
                    endpoint="galleryImage"
                    onClientUploadComplete={(res) => {
                        if (res) {
                            const newUrls = res.map((file) => file.url);
                            setGallery((prev) => [...prev, ...newUrls]);
                            alert("Photos uploaded! Click 'Update Event' to save.");
                        }
                    }}
                    onUploadError={(error: Error) => {
                        alert(`Error: ${error.message}`);
                    }}
                    appearance={{
                        container: { border: "none", padding: "20px" },
                        label: { color: "#00f0ff" },
                        button: { background: "#00f0ff", color: "black" }
                    }}
                />
            </div>
            {gallery.length > 0 && (
                <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                    {gallery.map((url, index) => (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-white/10 group">
                            <Image src={url} alt="Gallery" fill className="object-cover" />
                            <button
                                type="button"
                                onClick={() => setGallery(prev => prev.filter(u => u !== url))}
                                className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* SUBMIT BUTTON */}
        <button 
          type="submit" 
          disabled={isSubmitting} 
          className={`w-full font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors ${
            isSubmitting 
              ? "bg-gray-600 text-gray-400 cursor-not-allowed" 
              : "bg-[#00f0ff] text-black hover:bg-white"
          }`}
        >
          {isSubmitting ? <><Loader2 className="animate-spin" size={20} /> Saving Changes...</> : <><Save size={20} /> Update Event</>}
        </button>

      </form>
    </div>
  );
}