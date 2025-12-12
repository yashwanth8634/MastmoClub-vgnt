"use client";

import { createTeamMember } from "@/actions/teamActions";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, Image as ImageIcon, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadDropzone } from "@/utils/uploadthing"; // ✅ Import Uploader
import Image from "next/image";

export default function NewMemberPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState(""); // ✅ State to store uploaded URL
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    if (!imageUrl) {
        alert("Please upload a profile picture first!");
        return;
    }
    
    setIsSubmitting(true);
    
    // ✅ Append the UploadThing URL to the form data
    formData.set("image", imageUrl);

    const result = await createTeamMember(formData);
    
    if (result && !result.success) {
      alert(result.message);
      setIsSubmitting(false);
    } else {
      router.push("/admin/dashboard-group/team");
      router.refresh();
    }
  }

  return (
    <div className="max-w-2xl mx-auto pb-20">
      
      <Link href="/admin/dashboard-group/team" className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
        <ArrowLeft size={18} /> Back to Team
      </Link>

      <h1 className="text-3xl font-bold mb-8">Add Team Member</h1>

      <form action={handleSubmit} className="space-y-6">
        
        {/* Name & Role */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-400">Full Name</label>
            <input name="name" required className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-[#00f0ff] outline-none" placeholder="John Doe" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-400">Role / Position</label>
            <input name="role" required className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-[#00f0ff] outline-none" placeholder="Technical Head" />
          </div>
        </div>

        {/* Category & Details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-400">Category</label>
            <select name="category" className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-[#00f0ff] outline-none cursor-pointer">
              <option value="core">Core Council</option>
              <option value="faculty">Faculty Board</option>
              <option value="coordinator">Coordinator/Lead</option>
              <option value="support">Supporting Team</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-400">Details (Roll No/Class)</label>
            <input name="details" className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-[#00f0ff] outline-none" placeholder="II CSE • 24891A..." />
          </div>
        </div>

        {/* ✅ PHOTO UPLOAD SECTION */}
        <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-400 flex items-center gap-2">
                <ImageIcon size={14} /> Profile Picture
            </label>
            
            {!imageUrl ? (
                <div className="bg-white/5 border border-dashed border-white/20 rounded-xl overflow-hidden hover:border-[#00f0ff]/50 transition-colors">
                    <UploadDropzone
                        endpoint="teamImage" // Uses the route with 2MB limit
                        onClientUploadComplete={(res) => {
                            if (res && res[0]) {
                                setImageUrl(res[0].url);
                            }
                        }}
                        onUploadError={(error: Error) => {
                            alert(`Error: ${error.message}`);
                        }}
                        appearance={{
                            container: { padding: "30px" },
                            label: { color: "#00f0ff" },
                            button: { background: "#00f0ff", color: "black" }
                        }}
                    />
                </div>
            ) : (
                <div className="relative w-40 h-40 mx-auto rounded-full overflow-hidden border-4 border-[#00f0ff] group">
                    <Image src={imageUrl} alt="Profile" fill className="object-cover" />
                    <button 
                        type="button"
                        onClick={() => setImageUrl("")}
                        className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <X className="text-red-500 w-8 h-8" />
                    </button>
                </div>
            )}
        </div>

        {/* Social Links */}
        <div className="p-6 bg-white/5 rounded-xl border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-gray-400 uppercase">Social Links (Optional)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="email" type="email" placeholder="Email Address" className="bg-black border border-white/10 rounded-lg p-3 text-sm text-white focus:border-[#00f0ff] outline-none" />
            <input name="linkedin" placeholder="LinkedIn URL" className="bg-black border border-white/10 rounded-lg p-3 text-sm text-white focus:border-[#00f0ff] outline-none" />
            <input name="github" placeholder="GitHub URL" className="bg-black border border-white/10 rounded-lg p-3 text-sm text-white focus:border-[#00f0ff] outline-none" />
            <input name="instagram" placeholder="Instagram URL" className="bg-black border border-white/10 rounded-lg p-3 text-sm text-white focus:border-[#00f0ff] outline-none" />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting} 
          className="w-full bg-[#00f0ff] text-black font-bold py-4 rounded-xl hover:bg-white transition-colors flex justify-center gap-2 items-center"
        >
          {isSubmitting ? (
             <><Loader2 className="animate-spin" /> Saving...</>
          ) : (
             <><Save size={20} /> Save Member</>
          )}
        </button>

      </form>
    </div>
  );
}