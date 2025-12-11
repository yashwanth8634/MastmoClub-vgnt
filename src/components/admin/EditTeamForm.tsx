"use client";

import { updateTeamMember } from "@/actions/teamActions";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface TeamMemberData {
  name: string;
  role: string;
  category: string;
  details?: string;
  image?: string;
  socials?: {
    email?: string;
    linkedin?: string;
    github?: string;
    instagram?: string;
  };
}

export default function EditTeamForm({ member, id }: { member: TeamMemberData, id: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(member.image || "");
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    if (isSubmitting) return; // Prevent double submission
    setIsSubmitting(true);
    
    const result = await updateTeamMember(id, formData);
    
    if (result && !result.success) {
      alert(result.message);
      setIsSubmitting(false);
    } else {
      // ✅ FIX 1: Correct Redirect Path
      router.push("/admin/dashboard-group/team");
      router.refresh();
    }
  }

  return (
    <div className="max-w-2xl mx-auto pb-20">
      {/* ✅ FIX 2: Correct Back Link */}
      <Link href="/admin/dashboard-group/team" className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
        <ArrowLeft size={18} /> Back to Team
      </Link>

      <h1 className="text-3xl font-bold mb-8">Edit Member: <span className="text-[#00f0ff]">{member.name}</span></h1>

      <form action={handleSubmit} className="space-y-6">
        
        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-400">Full Name</label>
            <input name="name" defaultValue={member.name} required className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-[#00f0ff] outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-400">Role</label>
            <input name="role" defaultValue={member.role} required className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-[#00f0ff] outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-400">Category</label>
            <select name="category" defaultValue={member.category} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-[#00f0ff] outline-none cursor-pointer">
              <option value="faculty" className="bg-black">Faculty Board</option>
              <option value="core" className="bg-black">Core Council</option>
              <option value="coordinator" className="bg-black">Coordinator/Lead</option>
              <option value="support" className="bg-black">Supporting Team</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-400">Details (Roll No / Dept)</label>
            <input name="details" defaultValue={member.details} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-[#00f0ff] outline-none" />
          </div>
        </div>

        {/* Image Section with Preview */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-gray-400">Profile Image URL</label>
          <div className="flex gap-4">
             {/* Preview Box */}
            <div className="w-16 h-16 bg-black rounded-lg shrink-0 border border-white/10 flex items-center justify-center overflow-hidden relative">
              {imagePreview && imagePreview.length > 5 ? (
                <Image src={imagePreview} alt="Preview" fill className="object-cover" />
              ) : (
                <ImageIcon size={24} className="text-gray-600" />
              )}
            </div>
            
            <input 
              name="image" 
              defaultValue={member.image} 
              onChange={(e) => setImagePreview(e.target.value)}
              placeholder="/images/team/member.jpg"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-[#00f0ff] outline-none" 
            />
          </div>
          <p className="text-[10px] text-gray-500">
            Tip: Put images in <code>public/images/team</code> folder.
          </p>
        </div>

        {/* Social Links */}
        <div className="p-6 bg-white/5 rounded-xl border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-gray-400 uppercase">Social Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="email" defaultValue={member.socials?.email} placeholder="Email Address" className="bg-black border border-white/10 rounded-lg p-3 text-sm text-white focus:border-[#00f0ff] outline-none" />
            <input name="linkedin" defaultValue={member.socials?.linkedin} placeholder="LinkedIn URL" className="bg-black border border-white/10 rounded-lg p-3 text-sm text-white focus:border-[#00f0ff] outline-none" />
            <input name="github" defaultValue={member.socials?.github} placeholder="GitHub URL" className="bg-black border border-white/10 rounded-lg p-3 text-sm text-white focus:border-[#00f0ff] outline-none" />
            <input name="instagram" defaultValue={member.socials?.instagram} placeholder="Instagram URL" className="bg-black border border-white/10 rounded-lg p-3 text-sm text-white focus:border-[#00f0ff] outline-none" />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting} 
          className={`w-full font-bold py-4 rounded-xl flex justify-center items-center gap-2 transition-colors ${
            isSubmitting ? "bg-gray-600 text-gray-400 cursor-not-allowed" : "bg-[#00f0ff] text-black hover:bg-white"
          }`}
        >
          {isSubmitting ? "Saving..." : <><Save size={20} /> Update Member</>}
        </button>
      </form>
    </div>
  );
}