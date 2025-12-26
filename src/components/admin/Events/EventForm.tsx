"use client";

import { useState } from "react";
import { createEvent, updateEvent } from "@/actions/EventActions";
import { useRouter } from "next/navigation";
import { UploadDropzone } from "@/utils/uploadthing"; 
import { 
  Plus, ArrowLeft, Loader2, CalendarClock, Users, MapPin, Eye, 
  Image as ImageIcon, Trash2, Check, Save
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Define Data Shape
interface EventData {
  id?: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  isLive: boolean;
  registrationOpen: boolean;
  maxRegistrations: number;
  isTeamEvent: boolean;
  minTeamSize: number;
  maxTeamSize: number;
  gallery: string[];
  rules: string[];
}

interface EventFormProps {
  initialData?: EventData | null;
}

export default function EventForm({ initialData }: EventFormProps) {
  const router = useRouter();
  const isEditMode = !!initialData;
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- 1. State Initialization ---
  const [isTeamEvent, setIsTeamEvent] = useState(initialData?.isTeamEvent || false);
  const [isLive, setIsLive] = useState(initialData ? initialData.isLive : true);
  const [isRegOpen, setIsRegOpen] = useState(initialData ? initialData.registrationOpen : true);
  
  // Gallery State (Holds URL strings only)
  const [galleryUrls, setGalleryUrls] = useState<string[]>(initialData?.gallery || []);

  // --- 2. Handlers ---
  const handleRemoveImage = (indexToRemove: number) => {
    setGalleryUrls((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    const form = event.currentTarget;
    const formData = new FormData(form);

    // Validation
    if (isTeamEvent) {
      const min = parseInt(formData.get("minTeamSize") as string);
      const max = parseInt(formData.get("maxTeamSize") as string);
      if (min > max) {
        alert("Error: Minimum team size cannot be greater than maximum team size.");
        return;
      }
    }

    setIsSubmitting(true);

    try {
        // Prepare Data
        formData.set("isTeamEvent", isTeamEvent ? "true" : "false");
        formData.set("isLive", isLive ? "true" : "false");
        formData.set("registrationOpen", isRegOpen ? "true" : "false");

        // Inject Gallery URLs
        formData.delete("gallery");
        galleryUrls.forEach((url) => {
            formData.append("gallery", url);
        });

        // Rules Handling
        const rawRules = formData.get("rules") as string;
        formData.delete("rules"); 
        if (rawRules) {
            rawRules.split('\n').forEach(rule => {
                if (rule.trim()) formData.append("rules", rule.trim());
            });
        }

        // --- ACTION SWITCH LOGIC ---
        let result;
        if (isEditMode && initialData?.id) {
            // ✅ Fix: Append ID to formData so the Server Action can find it
            formData.append("id", initialData.id);
            result = await updateEvent(initialData.id,formData);
        } else {
            result = await createEvent(formData);
        }
        
        if (result && !result.success) {
            alert(result.message);
            setIsSubmitting(false);
        } else {
            router.push("/admin/dashboard-group/events");
            router.refresh();
        }

    } catch (error) {
      console.error("Submission Error:", error);
      alert("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <Link href="/admin/dashboard-group/events" className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
        <ArrowLeft size={18} /> Back to Events
      </Link>

      <h1 className="text-3xl font-bold mb-8">
        {isEditMode ? `Edit Event: ${initialData?.title}` : "Create New Event"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* SECTION 1: BASIC INFO */}
        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase mb-2 border-b border-white/10 pb-2">1. Basic Info</h3>
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-500">Event Title</label>
                <input name="title" defaultValue={initialData?.title} placeholder="e.g. Code-a-thon 2025" required className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-[#00f0ff] outline-none transition-colors" />
            </div>
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-500">Description</label>
                <textarea name="description" defaultValue={initialData?.description} placeholder="Describe the event details..." rows={4} required className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-[#00f0ff] outline-none resize-none" />
            </div>
        </div>

        {/* SECTION 2: DATE & TIME */}
        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-[#00f0ff] uppercase mb-2 border-b border-white/10 pb-2 flex items-center gap-2">
                <CalendarClock size={16} /> 2. Date, Time & Location
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-500">Event Date (String)</label>
                    <input type="text" name="date" defaultValue={initialData?.date} placeholder="e.g. 12th August 2025" required className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-[#00f0ff] outline-none" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-500">Display Time</label>
                    <input name="time" defaultValue={initialData?.time} placeholder="e.g. 10:00 AM" required className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-[#00f0ff] outline-none" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-500">Location</label>
                    <div className="relative">
                        <MapPin className="absolute left-4 top-4 text-gray-500" size={18} />
                        <input name="location" defaultValue={initialData?.location} placeholder="e.g. Main Auditorium" required className="w-full bg-black border border-white/10 rounded-xl p-4 pl-12 text-white focus:border-[#00f0ff] outline-none" />
                    </div>
                </div>
            </div>
        </div>

        {/* SECTION 3: STATUS & CAPACITY */}
        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-6">
            <h3 className="text-sm font-bold text-yellow-500 uppercase border-b border-white/10 pb-2 flex items-center gap-2">
                <Eye size={16} /> 3. Status & Capacity
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div onClick={() => setIsLive(!isLive)} className="cursor-pointer bg-black border border-white/10 rounded-xl p-4 flex items-center gap-4 hover:border-green-500/50 transition-colors select-none">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${isLive ? 'bg-green-500 text-black' : 'bg-white/10 text-gray-500'}`}>
                       <Check size={24} strokeWidth={3} />
                    </div>
                    <div>
                        <p className="font-bold text-white text-lg">Event Live?</p>
                        <p className="text-xs text-gray-500">Uncheck to hide</p>
                    </div>
                </div>
                <div onClick={() => setIsRegOpen(!isRegOpen)} className="cursor-pointer bg-black border border-white/10 rounded-xl p-4 flex items-center gap-4 hover:border-cyan-500/50 transition-colors select-none">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${isRegOpen ? 'bg-cyan-400 text-black' : 'bg-white/10 text-gray-500'}`}>
                       <Check size={24} strokeWidth={3} />
                    </div>
                    <div>
                        <p className="font-bold text-white text-lg">Reg Open?</p>
                        <p className="text-xs text-gray-500">Accepting entries</p>
                    </div>
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-gray-500 ml-1">Max Participants</label>
                    <input type="number" name="maxRegistrations" defaultValue={initialData?.maxRegistrations || 100} min="0" className="w-full bg-black border border-white/10 rounded-xl h-[76px] px-6 text-2xl font-bold text-white focus:border-yellow-500 outline-none" />
                </div>
            </div>
        </div>

        {/* SECTION 4: TEAM CONFIGURATION */}
        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-purple-400 uppercase mb-2 border-b border-white/10 pb-2 flex items-center gap-2">
                <Users size={16} /> 4. Team Settings
            </h3>
            <div className="flex items-center gap-3 mb-4 p-4 bg-black/40 rounded-xl border border-white/5">
                <input type="checkbox" id="isTeam" className="w-5 h-5 accent-purple-500" checked={isTeamEvent} onChange={(e) => setIsTeamEvent(e.target.checked)} />
                <label htmlFor="isTeam" className="text-sm font-bold text-white cursor-pointer select-none">Is this a Team Event?</label>
            </div>
            <div className={`grid grid-cols-2 gap-6 transition-opacity duration-300 ${isTeamEvent ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-500">Min Members</label>
                    <input type="number" name="minTeamSize" defaultValue={initialData?.minTeamSize || 1} min="1" disabled={!isTeamEvent} className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-purple-500 outline-none" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-500">Max Members</label>
                    <input type="number" name="maxTeamSize" defaultValue={initialData?.maxTeamSize || 1} min="1" disabled={!isTeamEvent} className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-purple-500 outline-none" />
                </div>
            </div>
        </div>

        {/* SECTION 5: EVENT GALLERY */}
        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-6">
            <h3 className="text-sm font-bold text-cyan-400 uppercase border-b border-white/10 pb-2 flex items-center gap-2">
                <ImageIcon size={16} /> 5. Event Gallery
            </h3>

            {/* Gallery Preview Grid */}
            {galleryUrls.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {galleryUrls.map((url, index) => (
                        <div key={url} className="relative aspect-video rounded-lg overflow-hidden border border-white/20 group">
                            <Image 
                                src={url} 
                                alt="Gallery" 
                                fill
                                className="object-cover"
                            />
                            {index === 0 && (
                                <span className="absolute bottom-2 left-2 bg-cyan-400 text-black text-[10px] font-bold px-2 py-0.5 rounded">Banner</span>
                            )}
                            <button 
                                type="button" 
                                onClick={() => handleRemoveImage(index)}
                                className="absolute top-2 right-2 bg-black/70 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* UploadThing Dropzone */}
            <div className="border border-white/10 rounded-2xl overflow-hidden">
                <UploadDropzone
                    endpoint="galleryImage"
                    onClientUploadComplete={(res) => {
                        if (res) {
                            const newUrls = res.map((file) => file.url);
                            setGalleryUrls((prev) => [...prev, ...newUrls]);
                        }
                    }}
                    onUploadError={(error: Error) => {
                        alert(`ERROR! ${error.message}`);
                    }}
                    appearance={{
                        container: "bg-black/20 border-0",
                        label: "text-cyan-400 hover:text-cyan-300",
                        button: "bg-cyan-400 text-black hover:bg-white",
                    }}
                />
            </div>
        </div>

        {/* SECTION 6: RULES */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-gray-400">Rules (One per line)</label>
          <textarea 
            name="rules" 
            rows={5} 
            defaultValue={Array.isArray(initialData?.rules) ? initialData?.rules.join('\n') : initialData?.rules}
            placeholder="1. Bring your own laptop&#10;2. Respect the code of conduct&#10;3. No plagiarism"
            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-[#00f0ff] outline-none font-mono text-sm leading-relaxed" 
          />
        </div>

        {/* SUBMIT BUTTON */}
        <button 
          type="submit" 
          disabled={isSubmitting} 
          className={`w-full font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all ${
            isSubmitting 
              ? "bg-gray-800 text-gray-400 cursor-not-allowed" 
              : "bg-[#00f0ff] text-black hover:bg-white hover:shadow-[0_0_20px_rgba(0,240,255,0.5)]"
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" size={20} /> 
              {isEditMode ? "Updating Event..." : "Creating Event..."}
            </>
          ) : (
            <>
              {isEditMode ? <Save size={20} /> : <Plus size={20} />} 
              {isEditMode ? "Update Event" : "Create Event"}
            </>
          )}
        </button>

      </form>
    </div>
  );
}