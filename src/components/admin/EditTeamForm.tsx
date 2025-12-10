"use client";

import { updateTeamMember } from "@/actions/teamActions";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditTeamForm({ member, id }: { member: any, id: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    const result = await updateTeamMember(id, formData);
    if (result && !result.success) {
      alert(result.message);
      setIsSubmitting(false);
    } else {
      router.push("/admin/dashboard-group/team");
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/admin/dashboard-group/team" className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
        <ArrowLeft size={18} /> Back to Team
      </Link>

      <h1 className="text-3xl font-bold mb-8">Edit Member: <span className="text-[#00f0ff]">{member.name}</span></h1>

      <form action={handleSubmit} className="space-y-6">
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
            <label className="text-xs font-bold uppercase text-gray-400">Details</label>
            <input name="details" defaultValue={member.details} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-[#00f0ff] outline-none" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-gray-400">Image Path</label>
          <input name="image" defaultValue={member.image} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-[#00f0ff] outline-none" />
        </div>

        <div className="p-6 bg-white/5 rounded-xl border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-gray-400 uppercase">Social Links</h3>
          <div className="grid grid-cols-2 gap-4">
            <input name="email" defaultValue={member.socials?.email} placeholder="Email" className="bg-black border border-white/10 rounded-lg p-3 text-sm text-white" />
            <input name="linkedin" defaultValue={member.socials?.linkedin} placeholder="LinkedIn" className="bg-black border border-white/10 rounded-lg p-3 text-sm text-white" />
            <input name="github" defaultValue={member.socials?.github} placeholder="GitHub" className="bg-black border border-white/10 rounded-lg p-3 text-sm text-white" />
            <input name="instagram" defaultValue={member.socials?.instagram} placeholder="Instagram" className="bg-black border border-white/10 rounded-lg p-3 text-sm text-white" />
          </div>
        </div>

        <button type="submit" disabled={isSubmitting} className="w-full bg-[#00f0ff] text-black font-bold py-4 rounded-xl hover:bg-white transition-colors">
          {isSubmitting ? "Saving..." : "Update Member"}
        </button>
      </form>
    </div>
  );
}