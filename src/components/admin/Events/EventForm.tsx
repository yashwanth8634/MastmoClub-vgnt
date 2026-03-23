"use client";

import { useState } from "react";
import { createEvent, updateEvent } from "@/actions/eventActions";
import { useRouter } from "next/navigation";
import { UploadDropzone, getCompressedUploadFiles } from "@/utils/uploadthing"; 
import { 
  Plus, ArrowLeft, CalendarClock, Users, MapPin, Eye, 
  Image as ImageIcon, Trash2, Save
} from "lucide-react";
import MathLoader from "@/components/ui/MathLoader";
import Link from "next/link";
import Image from "next/image";
import { formatEventTime } from "@/lib/utils";

type CapacityMode = "limited" | "unlimited";

function isIsoDateString(value?: string) {
  return !!value && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function is24HourTime(value?: string) {
  return !!value && /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
}

function convert12HourTo24Hour(value?: string) {
  if (!value) return "";

  const match = value.match(/^(\d{1,2}):(\d{2})\s*([AP]M)$/i);
  if (!match) return "";

  const [, rawHour, minute, period] = match;
  const hour = Number(rawHour) % 12;
  const normalizedHour = period.toUpperCase() === "PM" ? hour + 12 : hour;

  return `${String(normalizedHour).padStart(2, "0")}:${minute}`;
}

function getTodayIsoDate() {
  return new Date().toISOString().split("T")[0];
}

function getBoundedDateRange() {
  const currentYear = new Date().getFullYear();
  return {
    min: `${currentYear - 1}-01-01`,
    max: `${currentYear + 5}-12-31`,
  };
}

// Define Data Shape
interface EventData {
  id?: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  isLive: boolean;
  registrationRequired: boolean;
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
  const [formError, setFormError] = useState<string | null>(null);

  // --- 1. State Initialization ---
  const [isTeamEvent, setIsTeamEvent] = useState(initialData?.isTeamEvent || false);
  const [isLive, setIsLive] = useState(initialData ? initialData.isLive : true);
  const [registrationRequired, setRegistrationRequired] = useState(
    initialData?.registrationRequired ?? true,
  );
  const [registrationOpen, setRegistrationOpen] = useState(
    initialData?.registrationRequired === false ? false : (initialData?.registrationOpen ?? true),
  );
  const [capacityMode, setCapacityMode] = useState<CapacityMode>(
    initialData && initialData.maxRegistrations > 0 ? "limited" : "unlimited",
  );
  
  // Gallery State (Holds URL strings only)
  const [galleryUrls, setGalleryUrls] = useState<string[]>(initialData?.gallery || []);
  const initialTime = initialData?.time;

  const initialPickerTime = is24HourTime(initialTime)
    ? initialTime
    : convert12HourTo24Hour(initialTime);
  const allowedDateRange = getBoundedDateRange();

  // --- 2. Handlers ---
  const handleRemoveImage = (indexToRemove: number) => {
    setGalleryUrls((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const date = String(formData.get("date") || "");
    const time = String(formData.get("time") || "");
    const location = String(formData.get("location") || "").trim();
    const maxRegistrations = Number(formData.get("maxRegistrations")) || 0;
    setFormError(null);

    // Validation
    if (isTeamEvent) {
      const min = parseInt(formData.get("minTeamSize") as string);
      const max = parseInt(formData.get("maxTeamSize") as string);
      if (min > max) {
        setFormError("Minimum team size cannot be greater than maximum team size.");
        return;
      }
    }

    if (!isIsoDateString(date)) {
      setFormError("Choose a valid event date from the calendar.");
      return;
    }

    if (date < allowedDateRange.min || date > allowedDateRange.max) {
      setFormError(`Event date must be between ${allowedDateRange.min} and ${allowedDateRange.max}.`);
      return;
    }

    if (!is24HourTime(time)) {
      setFormError("Choose a valid event time.");
      return;
    }

    if (location.length < 3) {
      setFormError("Location should be at least 3 characters long.");
      return;
    }

    if (isLive && date < getTodayIsoDate()) {
      setFormError("A live event cannot use a past date. Hide the event instead if it already ended.");
      return;
    }

    if (registrationOpen && !registrationRequired) {
      setFormError("Registration cannot be open when registration is not required.");
      return;
    }

    if (registrationOpen && !isLive) {
      setFormError("Hidden or past events must keep registration closed.");
      return;
    }

    if (registrationRequired && capacityMode === "limited" && maxRegistrations < 1) {
      setFormError("Limited-capacity events need at least 1 registration slot.");
      return;
    }

    setIsSubmitting(true);

    try {
        // Prepare Data
        formData.set("isTeamEvent", isTeamEvent ? "true" : "false");
        formData.set("isLive", isLive ? "true" : "false");
        formData.set("registrationRequired", registrationRequired ? "true" : "false");
        formData.set("registrationOpen", registrationOpen ? "true" : "false");
        formData.set("time", formatEventTime((formData.get("time") as string) || ""));
        if (!registrationRequired || capacityMode === "unlimited") {
          formData.set("maxRegistrations", "0");
        }

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
                <input name="title" defaultValue={initialData?.title} placeholder="e.g. CELISTA 2K25" required className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-[#00f0ff] outline-none transition-colors" />
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
                    <label className="text-xs font-bold uppercase text-gray-500">Event Date</label>
                    <input
                      type="date"
                      name="date"
                      defaultValue={isIsoDateString(initialData?.date) ? initialData?.date : ""}
                      min={allowedDateRange.min}
                      max={allowedDateRange.max}
                      required
                      className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-[#00f0ff] outline-none"
                    />
                    {!isIsoDateString(initialData?.date) && initialData?.date && (
                      <p className="text-[11px] text-yellow-400">Previous saved date was custom text: {initialData.date}</p>
                    )}
                    <p className="text-[11px] text-gray-500">
                      Allowed range: {allowedDateRange.min} to {allowedDateRange.max}.
                    </p>
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-500">Event Time</label>
                    <input
                      type="time"
                      name="time"
                      defaultValue={initialPickerTime}
                      required
                      className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-[#00f0ff] outline-none"
                    />
                    <p className="text-[11px] text-gray-500">
                      Saved and shown as 12-hour time like {formatEventTime(initialPickerTime || "14:00")}.
                    </p>
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
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-500">Event Status</label>
                    <select
                      value={isLive ? "live" : "hidden"}
                      onChange={(e) => {
                        const nextIsLive = e.target.value === "live";
                        setIsLive(nextIsLive);
                        if (!nextIsLive) {
                          setRegistrationOpen(false);
                        }
                      }}
                      className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-yellow-500 outline-none"
                    >
                      <option value="live">Live on events page</option>
                      <option value="hidden">Hidden / past event</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-500">Registration Required</label>
                    <select
                      value={registrationRequired ? "yes" : "no"}
                      onChange={(e) => {
                        const isRequired = e.target.value === "yes";
                        setRegistrationRequired(isRequired);
                        if (!isRequired) {
                          setRegistrationOpen(false);
                          setCapacityMode("unlimited");
                        }
                      }}
                      className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-yellow-500 outline-none"
                    >
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                    <p className="text-[11px] text-gray-500">
                      Set this to no for walk-in events.
                    </p>
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-gray-500 ml-1">Capacity</label>
                    <div className="space-y-3">
                      <select
                        value={!registrationRequired ? "unlimited" : capacityMode}
                        onChange={(e) => setCapacityMode(e.target.value as CapacityMode)}
                        disabled={!registrationRequired}
                        className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-yellow-500 outline-none disabled:opacity-50"
                      >
                        <option value="unlimited">Unlimited</option>
                        <option value="limited">Limited seats</option>
                      </select>
                      <input
                        type="number"
                        name="maxRegistrations"
                        defaultValue={initialData?.maxRegistrations && initialData.maxRegistrations > 0 ? initialData.maxRegistrations : 100}
                        min="1"
                        disabled={!registrationRequired || capacityMode !== "limited"}
                        className="w-full bg-black border border-white/10 rounded-xl h-[56px] px-6 text-xl font-bold text-white focus:border-yellow-500 outline-none disabled:opacity-50"
                      />
                    </div>
                    <p className="text-[11px] text-gray-500 ml-1">
                      {isTeamEvent
                        ? "Capacity counts number of teams, not individual participants."
                        : "Capacity counts number of individual participants."}
                    </p>
                </div>
            </div>
            {registrationRequired && (
              <div className="max-w-md space-y-2">
                <label className="text-xs font-bold uppercase text-gray-500">Registration Status</label>
                <select
                  value={registrationOpen ? "open" : "closed"}
                  onChange={(e) => setRegistrationOpen(e.target.value === "open")}
                  disabled={!isLive}
                  className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-yellow-500 outline-none"
                >
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
                {!isLive && (
                  <p className="text-[11px] text-gray-500">
                    Registration is forced closed while the event is hidden.
                  </p>
                )}
              </div>
            )}
            {!registrationRequired && (
              <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-4 text-sm text-blue-200">
                This event will not accept form registrations. Capacity limits and registration toggles are disabled automatically.
              </div>
            )}
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
                                className="absolute top-2 right-2 bg-black/70 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 cursor-pointer"
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
                    onBeforeUploadBegin={getCompressedUploadFiles("galleryImage")}
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
              : "bg-[#00f0ff] text-black hover:bg-white hover:shadow-[0_0_20px_rgba(0,240,255,0.5)] cursor-pointer"
          }`}
        >
          {isSubmitting ? (
            <>
              <MathLoader size="sm" /> 
              {isEditMode ? "Updating Event..." : "Creating Event..."}
            </>
          ) : (
            <>
              {isEditMode ? <Save size={20} /> : <Plus size={20} />} 
              {isEditMode ? "Update Event" : "Create Event"}
            </>
          )}
        </button>

        {formError && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {formError}
          </div>
        )}

      </form>
    </div>
  );
}
