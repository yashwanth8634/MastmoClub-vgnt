"use client";

import { useEffect, useState, useRef } from "react";
import { getPopup, updatePopup } from "@/actions/popupActions";
import { getActiveEventsLight } from "@/actions/eventActions";
import { UploadDropzone, getCompressedUploadFiles } from "@/utils/uploadthing";
import { Save, Trash2, Calendar, CheckCircle2 } from "lucide-react";
import Image from "next/image";

export default function PopupManager() {
  const [data, setData] = useState<Awaited<ReturnType<typeof getPopup>>>(null);
  const [activeEvents, setActiveEvents] = useState<{id: string, title: string}[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>([]); // Array of URLs
  const [toast, setToast] = useState<{ show: boolean; isActive: boolean }>({ show: false, isActive: false });
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const popupData = data ?? {
    isActive: false,
    title: "",
    description: "",
    images: [],
    enableRegistration: false,
    registrationEventId: "",
  };
  const [enableRegistration, setEnableRegistration] = useState(false);

  useEffect(() => {
    Promise.all([getPopup(), getActiveEventsLight()]).then(([popupRes, eventsRes]) => {
      setData(popupRes);
      setImages(popupRes?.images || []);
      setEnableRegistration(popupRes?.enableRegistration || false);
      setActiveEvents(eventsRes || []);
    });
  }, []);

  const showToast = (isActive: boolean) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ show: true, isActive });
    toastTimer.current = setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3500);
  };

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    
    // Convert array to JSON string to pass via FormData
    formData.set("imagesJSON", JSON.stringify(images));
    const isActive = formData.get("isActive") === "on";
    formData.set("isActive", String(isActive));
    formData.set("enableRegistration", String(enableRegistration));
    
    await updatePopup(formData);
    showToast(isActive);
    setIsSubmitting(false);
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-2xl mx-auto p-10 text-white pb-32">
      <h1 className="text-4xl font-bold mb-8">Manage <span className="text-[#00f0ff]">Popup</span></h1>

      <form action={handleSubmit} className="space-y-8 bg-white/5 p-8 rounded-3xl border border-white/10">
        
        {/* Toggle Status */}
        <div className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/10">
            <div>
                <h3 className="font-bold text-lg">Popup Status</h3>
                <p className="text-gray-400 text-sm">Turn ON to show on homepage.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="isActive" defaultChecked={popupData.isActive} className="sr-only peer" />
                <div className="w-14 h-7 bg-gray-700 rounded-full peer peer-checked:bg-[#00f0ff] peer-checked:after:translate-x-full after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all"></div>
            </label>
        </div>

        {/* Text Fields */}
        <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-400">Title</label>
            <input name="title" defaultValue={popupData.title} className="w-full bg-black border border-white/10 rounded-xl p-4 focus:border-[#00f0ff] outline-none" />
        </div>
        <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-400">Description</label>
            <textarea name="description" rows={4} defaultValue={popupData.description} className="w-full bg-black border border-white/10 rounded-xl p-4 focus:border-[#00f0ff] outline-none" />
        </div>

        {/* Registration Button Settings */}
        <div className="space-y-4 bg-black/40 p-6 rounded-xl border border-white/10">
          <div className="flex items-center justify-between">
            <div>
                <h3 className="font-bold text-lg">Registration Button</h3>
                <p className="text-gray-400 text-sm">Add a button to register for an active event.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={enableRegistration} 
                  onChange={(e) => setEnableRegistration(e.target.checked)} 
                  className="sr-only peer" 
                />
                <div className="w-14 h-7 bg-gray-700 rounded-full peer peer-checked:bg-[#00f0ff] peer-checked:after:translate-x-full after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all"></div>
            </label>
          </div>
          
          {enableRegistration && (
            <div className="space-y-2 mt-4 pt-4 border-t border-white/10">
              <label className="text-xs font-bold uppercase text-gray-400 flex items-center gap-2">
                <Calendar size={14} /> Select Event Destination
              </label>
              {activeEvents.length > 0 ? (
                <select 
                  name="registrationEventId" 
                  defaultValue={popupData.registrationEventId} 
                  className="w-full bg-black border border-white/10 rounded-xl p-4 focus:border-[#00f0ff] outline-none text-white cursor-pointer"
                  required
                >
                  <option value="" disabled>-- Select an Active Event --</option>
                  {activeEvents.map(event => (
                    <option key={event.id} value={event.id}>{event.title}</option>
                  ))}
                </select>
              ) : (
                <p className="text-sm text-yellow-500 bg-yellow-500/10 p-3 rounded-lg border border-yellow-500/20">
                  No active events found. Please create or activate an event first.
                </p>
              )}
            </div>
          )}
        </div>

        {/* MULTI-IMAGE UPLOADER */}
        <div className="space-y-4">
            <label className="text-xs font-bold uppercase text-gray-400">Gallery Images (Max 5)</label>
            
            {/* Grid of uploaded images */}
            {images.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                    {images.map((url, idx) => (
                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-white/20 group">
                            <Image src={url} alt="Uploaded" fill className="object-cover" />
                            <button 
                                type="button"
                                onClick={() => removeImage(idx)}
                                className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            >
                                <Trash2 size={12} />
                            </button>
                            {idx === 0 && <span className="absolute bottom-1 left-1 bg-black/60 text-[10px] px-2 rounded text-white">Cover</span>}
                        </div>
                    ))}
                </div>
            )}

            {/* Uploader (Only show if less than 5 images) */}
            {images.length < 5 ? (
                <div className="bg-white/5 border border-dashed border-white/20 rounded-xl overflow-hidden">
                     <UploadDropzone
                        endpoint="teamImage" // Reusing endpoint
                        onBeforeUploadBegin={getCompressedUploadFiles("teamImage")}
                        onClientUploadComplete={(res) => { 
                            if (res) {
                                const newUrls = res.map(f => f.url);
                                setImages(prev => [...prev, ...newUrls]);
                            }
                        }}
                    />
                </div>
            ) : (
                <p className="text-xs text-yellow-500">Max 5 images reached. Delete one to upload more.</p>
            )}
        </div>

        <button disabled={isSubmitting} className="w-full bg-[#00f0ff] text-black font-bold py-4 rounded-xl hover:bg-white transition-colors flex justify-center items-center gap-2 cursor-pointer">
          {isSubmitting ? <><div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> Saving...</> : <><Save size={20} /> Update Popup</>}
        </button>

      </form>

      {/* Toast Notification */}
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
          toast.show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl border shadow-2xl backdrop-blur-md ${
          toast.isActive
            ? "bg-green-950/80 border-green-500/30 shadow-green-500/20"
            : "bg-red-950/80 border-red-500/30 shadow-red-500/20"
        }`}>
          <CheckCircle2 size={20} className={toast.isActive ? "text-green-400" : "text-red-400"} />
          <div>
            <p className="font-bold text-white text-sm">Popup Updated!</p>
            <p className={`text-xs ${toast.isActive ? "text-green-400" : "text-red-400"}`}>
              Popup is now <span className="font-bold uppercase">{toast.isActive ? "ON" : "OFF"}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
