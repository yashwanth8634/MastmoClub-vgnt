"use client";

import { updateEvent } from "@/actions/eventActions";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, Plus, Trash2, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface GalleryItem {
  src: string;
  caption: string;
}

interface EventData {
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  rules?: string[];
  isTeamEvent: boolean;
  minTeamSize?: number;
  maxTeamSize?: number;
  gallery?: GalleryItem[];
  deadline?: string;
}

const formatDateForInput = (isoString?: string) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  const offset = date.getTimezoneOffset() * 60000;
  const localIso = new Date(date.getTime() - offset).toISOString();
  return localIso.slice(0, 16);
};

export default function EditEventForm({ event, id }: { event: EventData, id: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTeam, setIsTeam] = useState(event.isTeamEvent);
  
  // Gallery State
  const [gallery, setGallery] = useState<GalleryItem[]>(event.gallery || []);

  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    formData.append("galleryJSON", JSON.stringify(gallery));

    if (!isTeam) {
        formData.set("isTeamEvent", "off"); 
    }

    const result = await updateEvent(id, formData);
    
    if (result && !result.success) {
      alert(`Error: ${result.message}`);
      setIsSubmitting(false);
    } else {
      router.push("/admin/dashboard-group/events");
      router.refresh();
    }
  }

  // ✅ FIX: Robust Update Function
  const updateGalleryItem = (index: number, field: "src" | "caption", value: string) => {
    const updatedGallery = gallery.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setGallery(updatedGallery);
  };

  // ✅ FIX: Robust Delete Function with preventDefault
  const removeGalleryItem = (e: React.MouseEvent, index: number) => {
    e.preventDefault(); // Stop form submission
    e.stopPropagation(); // Stop event bubbling
    
    const updatedGallery = gallery.filter((_, i) => i !== index);
    setGallery(updatedGallery);
  };

  // ✅ FIX: Add new item
  const addGalleryItem = (e: React.MouseEvent) => {
    e.preventDefault();
    setGallery([...gallery, { src: "", caption: "" }]);
  };

  return (
    <div className="max-w-3xl mx-auto pb-20">
      <Link href="/admin/dashboard-group/events" className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
        <ArrowLeft size={18} /> Back to Events
      </Link>

      <h1 className="text-3xl font-bold mb-8">Edit Event: <span className="text-[#00f0ff]">{event.title}</span></h1>

      <form action={handleSubmit} className="space-y-8">
        
        {/* Basic Info */}
        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-6">
          <h2 className="text-lg font-bold text-gray-300 border-b border-white/10 pb-4">Basic Details</h2>
          
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-400">Title</label>
            <input name="title" defaultValue={event.title} required className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-[#00f0ff] outline-none" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-400">Date (Text)</label>
              <input name="date" defaultValue={event.date} required className="w-full bg-black border border-white/10 rounded-xl p-4 text-white" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-400">Time</label>
              <input name="time" defaultValue={event.time} required className="w-full bg-black border border-white/10 rounded-xl p-4 text-white" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-400 text-red-400">Deadline</label>
              <input 
                name="deadline" 
                type="datetime-local" 
                defaultValue={formatDateForInput(event.deadline)} 
                className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-red-500 outline-none" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-400">Location</label>
            <input name="location" defaultValue={event.location} required className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-[#00f0ff] outline-none" />
          </div>
        </div>

        {/* Team Settings */}
        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-6">
          <h2 className="text-lg font-bold text-gray-300 border-b border-white/10 pb-4">Team Configuration</h2>
          <div className="flex items-center gap-3">
            <input 
              type="checkbox" 
              name="isTeamEvent" 
              id="isTeam" 
              defaultChecked={event.isTeamEvent}
              className="w-5 h-5 accent-[#00f0ff]"
              onChange={(e) => setIsTeam(e.target.checked)}
            />
            <label htmlFor="isTeam" className="text-white font-bold">Team Event</label>
          </div>

          {isTeam && (
            <div className="grid grid-cols-2 gap-4 animate-in fade-in">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-400">Min Members</label>
                <input name="minTeamSize" type="number" defaultValue={event.minTeamSize || 1} className="w-full bg-black border border-white/10 rounded-lg p-3 text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-400">Max Members</label>
                <input name="maxTeamSize" type="number" defaultValue={event.maxTeamSize || 1} className="w-full bg-black border border-white/10 rounded-lg p-3 text-white" />
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-6">
          <h2 className="text-lg font-bold text-gray-300 border-b border-white/10 pb-4">Content</h2>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-400">Description</label>
            <textarea name="description" defaultValue={event.description} required rows={3} className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-[#00f0ff] outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-400">Rules (Line separated)</label>
            <textarea name="rules" defaultValue={event.rules?.join("\n")} rows={3} className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-[#00f0ff] outline-none font-mono text-sm" />
          </div>
        </div>

        {/* ✅ GALLERY MANAGER (FIXED) */}
        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-6">
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <h2 className="text-lg font-bold text-gray-300">Event Gallery</h2>
            <button 
              type="button"
              onClick={addGalleryItem} // ✅ Use the safe handler
              className="text-xs bg-[#00f0ff]/10 text-[#00f0ff] px-3 py-1.5 rounded-lg font-bold hover:bg-[#00f0ff]/20 flex items-center gap-2"
            >
              <Plus size={14} /> Add Photo
            </button>
          </div>

          <div className="space-y-4">
            {gallery.length === 0 && <p className="text-sm text-gray-500 italic">No photos added yet.</p>}
            
            {gallery.map((item, index) => (
              <div key={index} className="flex gap-4 items-start animate-in fade-in slide-in-from-bottom-2">
                <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-gray-600 shrink-0 border border-white/10 relative overflow-hidden">
                  {/* ✅ FIX: Only verify URL if it's long enough to avoid 400 Errors */}
                  {item.src && item.src.length > 5 ? (
                     <Image 
                       src={item.src} 
                       alt="Preview" 
                       fill 
                       className="object-cover"
                       sizes="40px"
                       onError={(e) => {
                         // Fallback logic could go here, but hiding is simpler
                         e.currentTarget.style.display = 'none'; 
                       }}
                     />
                  ) : (
                    <ImageIcon size={20} />
                  )}
                </div>
                
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                  <input 
                    placeholder="/images/event/photo.jpg" 
                    value={item.src}
                    onChange={(e) => updateGalleryItem(index, "src", e.target.value)}
                    className="bg-black border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-[#00f0ff] outline-none"
                  />
                  <input 
                    placeholder="Caption (e.g. #Winners)" 
                    value={item.caption}
                    onChange={(e) => updateGalleryItem(index, "caption", e.target.value)}
                    className="bg-black border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-[#00f0ff] outline-none"
                  />
                </div>

                <button 
                  type="button" 
                  onClick={(e) => removeGalleryItem(e, index)} // ✅ Pass Event object
                  className="p-2.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer z-10"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={isSubmitting} className="w-full bg-[#00f0ff] text-black font-bold py-4 rounded-xl hover:bg-white transition-colors flex items-center justify-center gap-2">
          {isSubmitting ? "Saving..." : <><Save size={20} /> Update Event</>}
        </button>

      </form>
    </div>
  );
}