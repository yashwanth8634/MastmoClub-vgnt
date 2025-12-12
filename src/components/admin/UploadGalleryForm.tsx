"use client";

import { useState } from "react";
import { saveGalleryItem } from "@/actions/galleryActions"; 
import { UploadDropzone } from "@/utils/uploadthing"; // 👈 Import from YOUR lib file
import { Loader2, Image as ImageIcon, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function UploadGalleryForm() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Event");
  const [imageUrl, setImageUrl] = useState(""); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  async function handleFinalSubmit() {
    if (!imageUrl) return alert("Please upload an image first!");
    if (!title) return alert("Please enter a title!");

    setIsSubmitting(true);
    const result = await saveGalleryItem(title, category, imageUrl);
    
    if (result.success) {
      alert("Saved to Gallery!");
      setTitle("");
      setImageUrl("");
      router.refresh();
    } else {
      alert(result.message);
    }
    setIsSubmitting(false);
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-6 text-white">Upload to Cloud Gallery</h2>
      
      <div className="space-y-6">
        
        {/* Title Input */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-gray-500">Photo Title</label>
          <input 
            value={title} onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-[#00f0ff] outline-none" 
          />
        </div>

        {/* Category Select */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-gray-500">Category</label>
          <select 
            value={category} onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-[#00f0ff] outline-none"
          >
            <option value="Event">Event</option>
            <option value="Workshop">Workshop</option>
            <option value="Team">Team</option>
          </select>
        </div>

        {/* UPLOAD DROPZONE */}
        <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500">Image File</label>
            
            {!imageUrl ? (
                <UploadDropzone
                    endpoint="galleryImage"
                    onClientUploadComplete={(res) => {
                        if (res && res[0]) {
                            setImageUrl(res[0].url);
                            alert("Upload Complete!");
                        }
                    }}
                    onUploadError={(error: Error) => {
                        alert(`Error: ${error.message}`);
                    }}
                    // Styling
                    appearance={{
                        container: {
                            borderColor: "rgba(255,255,255,0.2)",
                            backgroundColor: "rgba(0,0,0,0.3)",
                        },
                        label: { color: "#00f0ff" },
                        button: { background: "#00f0ff", color: "black" },
                        uploadIcon: { color: "#00f0ff" }
                    }}
                />
            ) : (
                <div className="relative w-full h-48 border border-[#00f0ff] rounded-xl overflow-hidden group">
                    <Image src={imageUrl} alt="Uploaded" fill className="object-cover" />
                    <button 
                        onClick={() => setImageUrl("")}
                        className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <X size={16} />
                    </button>
                </div>
            )}
        </div>

        {/* Save Button */}
        {imageUrl && (
            <button 
            onClick={handleFinalSubmit}
            disabled={isSubmitting} 
            className="w-full py-4 rounded-xl font-bold bg-[#00f0ff] text-black hover:bg-white flex items-center justify-center gap-2"
            >
            {isSubmitting ? <Loader2 className="animate-spin" /> : <><ImageIcon size={20} /> Save to Gallery</>}
            </button>
        )}

      </div>
    </div>
  );
}