"use client";

import { updateTeamMember } from "@/actions/teamActions";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, Image as ImageIcon, Trash2, Loader2, ListOrdered } from "lucide-react";
import { UploadDropzone } from "@/utils/uploadthing"; // ✅ Integrated Uploader
import Link from "next/link";
import Image from "next/image";

interface TeamMemberData {
  _id: string;
  name: string;
  role: string;
  category: string;
  details?: string;
  image?: string;
  order?: number;
  socials?: {
    email?: string;
    linkedin?: string;
    github?: string;
    instagram?: string;
  };
}

export default function EditTeamForm({ member }: { member: TeamMemberData }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // ✅ Image Logic: Initialize with existing member image URL
  const [imageUrl, setImageUrl] = useState(member?.image || ""); 

  // ✅ Safety Guard: Prevents the "Cannot read properties of undefined (reading 'name')" crash
  if (!member) {
    return (
      <div className="p-20 text-center text-white bg-black min-h-screen">
        <p className="text-red-500 mb-4 font-bold">Error: Member data could not be loaded.</p>
        <Link href="/admin/dashboard-group/team" className="text-[#00f0ff] underline">
          Go Back to Manager
        </Link>
      </div>
    );
  }

  async function handleSubmit(formData: FormData) {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    // ✅ Image Logic: Ensure the form receives the URL from state
    formData.set("image", imageUrl);
    
    const result = await updateTeamMember(member._id, formData); //
    
    if (result && result.success) {
      router.push("/admin/dashboard-group/team"); //
      router.refresh(); //
    } else {
      alert(result?.message || "Failed to update");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto pb-20">
      <Link href="/admin/dashboard-group/team" className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
        <ArrowLeft size={18} /> Back to Team
      </Link>

      <h1 className="text-3xl font-bold mb-8">
        Edit: <span className="text-[#00f0ff]">{member.name}</span>
      </h1>

      <form action={handleSubmit} className="space-y-6">
        
        {/* Name & Role */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-400">Full Name</label>
            <input name="name" defaultValue={member.name} required className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-[#00f0ff] outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-400">Role</label>
            <input name="role" defaultValue={member.role} required className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-[#00f0ff] outline-none" />
          </div>
        </div>

        {/* Display Order (Rank) */}
        <div className="p-4 bg-[#00f0ff]/5 border border-[#00f0ff]/20 rounded-xl flex items-center gap-4">
            <div className="p-3 bg-[#00f0ff]/10 rounded-lg text-[#00f0ff]">
                <ListOrdered size={24} />
            </div>
            <div className="flex-1">
                <label className="text-xs font-bold uppercase text-[#00f0ff] mb-1 block">Display Order (Rank)</label>
                <input 
                    name="order" 
                    type="number" 
                    defaultValue={member.order || 0} 
                    className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-[#00f0ff] outline-none font-mono text-lg" 
                />
            </div>
        </div>

        {/* Category & Details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-400">Category</label>
            <select name="category" defaultValue={member.category} className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-[#00f0ff] outline-none cursor-pointer">
              <option value="faculty">Faculty Board</option>
              <option value="core">Core Council</option>
              <option value="coordinator">Coordinator/Lead</option>
              <option value="support">Supporting Team</option>
              <option value="patron">Patron / Guest</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-400">Details</label>
            <input name="details" defaultValue={member.details} className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-[#00f0ff] outline-none" />
          </div>
        </div>

        {/* ✅ Updated Photo Section: Integrated UploadDropzone */}
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase text-gray-400 flex items-center gap-2">
                    <ImageIcon size={14} /> Profile Picture
                </label>
                {imageUrl && (
                    <button type="button" onClick={() => setImageUrl("")} className="text-xs text-red-400 flex items-center gap-1 hover:text-red-300">
                        <Trash2 size={12} /> Remove Current Photo
                    </button>
                )}
            </div>
            
            {!imageUrl ? (
                <div className="bg-white/5 border border-dashed border-white/20 rounded-xl overflow-hidden hover:border-[#00f0ff]/50 transition-colors">
                    <UploadDropzone
                        endpoint="teamImage"
                        onClientUploadComplete={(res) => {
                            if (res && res[0]) {
                                setImageUrl(res[0].url);
                            }
                        }}
                        onUploadError={(error: Error) => alert(`Error: ${error.message}`)}
                        appearance={{
                            container: { padding: "30px" },
                            label: { color: "#00f0ff" },
                            button: { background: "#00f0ff", color: "black" }
                        }}
                    />
                </div>
            ) : (
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[#00f0ff]">
                        <Image src={imageUrl} alt="Current" fill className="object-cover" />
                    </div>
                    <div className="flex-1 text-sm">
                        <p className="font-bold text-white">Active Profile Photo</p>
                        <p className="text-gray-500">Remove above to upload a different one.</p>
                    </div>
                </div>
            )}
        </div>

        {/* Social Links */}
        <div className="p-6 bg-white/5 rounded-xl border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-gray-400 uppercase">Social Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="email" defaultValue={member.socials?.email} placeholder="Email" className="bg-black border border-white/10 rounded-lg p-3 text-sm text-white focus:border-[#00f0ff] outline-none" />
            <input name="linkedin" defaultValue={member.socials?.linkedin} placeholder="LinkedIn" className="bg-black border border-white/10 rounded-lg p-3 text-sm text-white focus:border-[#00f0ff] outline-none" />
            <input name="github" defaultValue={member.socials?.github} placeholder="GitHub" className="bg-black border border-white/10 rounded-lg p-3 text-sm text-white focus:border-[#00f0ff] outline-none" />
            <input name="instagram" defaultValue={member.socials?.instagram} placeholder="Instagram" className="bg-black border border-white/10 rounded-lg p-3 text-sm text-white focus:border-[#00f0ff] outline-none" />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting} 
          className="w-full bg-[#00f0ff] text-black font-bold py-4 rounded-xl hover:bg-white transition-colors flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.2)]"
        >
          {isSubmitting ? <Loader2 className="animate-spin" /> : <Save size={20} />} 
          Update Member Details
        </button>
      </form>
    </div>
  );
}