"use client";

import { updateTeamMember } from "@/actions/teamActions";
import Link from "next/link";
import { ArrowLeft, Save, Image as ImageIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

// Define the shape of the data passed from the server
interface EditTeamFormProps {
  member: {
    _id: string;
    name: string;
    role: string;
    category: string;
    details?: string;
    image?: string;
    order?: number;
    socials?: {
      linkedin?: string;
      github?: string;
      email?: string;
      instagram?: string;
    };
  };
}

export default function EditTeamForm({ member }: EditTeamFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    // Call the Server Action
    const result = await updateTeamMember(member._id, formData);
    
    if (result && result.success) {
      router.push("/admin/dashboard-group/team");
      router.refresh(); // Refresh to show updated order/category immediately
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

      <h1 className="text-3xl font-bold mb-8">Edit Member</h1>

      <form action={handleSubmit} className="space-y-6">
        
        {/* Name & Role */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-400">Full Name</label>
            <input 
              name="name" 
              defaultValue={member.name} 
              required 
              className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-[#00f0ff] outline-none" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-400">Role</label>
            <input 
              name="role" 
              defaultValue={member.role} 
              required 
              className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-[#00f0ff] outline-none" 
            />
          </div>
        </div>

        {/* Category & Order (Rank) */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-400">Category</label>
            {/* ✅ FIX 1: defaultValue prevents it from resetting to 'Faculty' */}
            <select 
              name="category" 
              defaultValue={member.category} 
              className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-[#00f0ff] outline-none cursor-pointer"
            >
              <option value="core">Core Council</option>
              <option value="faculty">Faculty Board</option>
              <option value="coordinator">Coordinator/Lead</option>
              <option value="support">Supporting Team</option>
              <option value="patron">Patron / Guest</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-400">Display Order</label>
            {/* ✅ FIX 2: Added Input for 'order' so you can change rank */}
            <input 
              name="order" 
              type="number"
              defaultValue={member.order || 0} 
              className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-[#00f0ff] outline-none" 
            />
          </div>
        </div>

        {/* Details Field */}
        <div className="space-y-2">
           <label className="text-xs font-bold uppercase text-gray-400">Details</label>
           <input 
             name="details" 
             defaultValue={member.details} 
             className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-[#00f0ff] outline-none" 
           />
        </div>

        {/* Image URL (Editable) */}
        <div className="space-y-2">
           <label className="text-xs font-bold uppercase text-gray-400 flex items-center gap-2">
              <ImageIcon size={14} /> Profile Picture URL
           </label>
           
           {member.image && (
             <div className="mb-4 relative w-20 h-20 rounded-full overflow-hidden border-2 border-[#00f0ff]">
               <Image src={member.image} alt="Current" fill className="object-cover" />
             </div>
           )}

           <input 
             name="imageUrl" 
             defaultValue={member.image} 
             placeholder="https://utfs.io/f/..."
             className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-[#00f0ff] outline-none text-sm" 
           />
        </div>

        {/* Social Links */}
        <div className="p-6 bg-white/5 rounded-xl border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-gray-400 uppercase">Social Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="email" defaultValue={member.socials?.email} placeholder="Email" className="bg-black border border-white/10 rounded-lg p-3 text-sm text-white outline-none" />
            <input name="linkedin" defaultValue={member.socials?.linkedin} placeholder="LinkedIn" className="bg-black border border-white/10 rounded-lg p-3 text-sm text-white outline-none" />
            <input name="github" defaultValue={member.socials?.github} placeholder="GitHub" className="bg-black border border-white/10 rounded-lg p-3 text-sm text-white outline-none" />
            <input name="instagram" defaultValue={member.socials?.instagram} placeholder="Instagram" className="bg-black border border-white/10 rounded-lg p-3 text-sm text-white outline-none" />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-[#00f0ff] text-black font-bold py-4 rounded-xl hover:bg-white transition-colors flex justify-center gap-2 items-center"
        >
          {isSubmitting ? <Loader2 className="animate-spin" /> : <Save size={20} />}
          Update Member
        </button>

      </form>
    </div>
  );
}