"use client";

import { useEffect, useState } from "react";
import { getPopup, updatePopup } from "@/actions/popupActions";
import { UploadDropzone } from "@/utils/uploadthing";
import { Save, Loader2, Trash2, Plus } from "lucide-react";
import Image from "next/image";

export default function AdminPopupPage() {
  const [data, setData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>([]); // Array of URLs

  useEffect(() => {
    getPopup().then((res) => {
        setData(res);
        setImages(res.images || []);
    });
  }, []);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    
    // Convert array to JSON string to pass via FormData
    formData.set("images", JSON.stringify(images));
    formData.set("isActive", String(formData.get("isActive") === "on"));
    
    await updatePopup(formData);
    alert("Popup Updated!");
    setIsSubmitting(false);
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  if (!data) return <div className="p-10 text-[#00f0ff]">Loading...</div>;

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
                <input type="checkbox" name="isActive" defaultChecked={data.isActive} className="sr-only peer" />
                <div className="w-14 h-7 bg-gray-700 rounded-full peer peer-checked:bg-[#00f0ff] peer-checked:after:translate-x-full after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all"></div>
            </label>
        </div>

        {/* Text Fields */}
        <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-400">Title</label>
            <input name="title" defaultValue={data.title} className="w-full bg-black border border-white/10 rounded-xl p-4 focus:border-[#00f0ff] outline-none" />
        </div>
        <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-400">Description</label>
            <textarea name="description" rows={4} defaultValue={data.description} className="w-full bg-black border border-white/10 rounded-xl p-4 focus:border-[#00f0ff] outline-none" />
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
                                className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
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

        <button disabled={isSubmitting} className="w-full bg-[#00f0ff] text-black font-bold py-4 rounded-xl hover:bg-white transition-colors flex justify-center items-center gap-2">
          {isSubmitting ? <><Loader2 className="animate-spin" /> Saving...</> : <><Save size={20} /> Update Popup</>}
        </button>

      </form>
    </div>
  );
}