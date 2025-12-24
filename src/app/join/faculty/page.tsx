"use client";

import { useFormState } from "react-dom";
// ✅ Correct Import: Point to the public submission action
import { submitRegistration } from "@/actions/submitRegistration"; 
// ✅ Ensure you import your button (Adjust path if needed)
import SubmitButton from "@/components/SubmitButton"; 

export default function FacultyJoinPage() {
  const [state, formAction] = useFormState(submitRegistration, { success: false, message: "" });

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-sm shadow-2xl">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#00f0ff] mb-2">Faculty Registration</h1>
          <p className="text-gray-400">Join MASTMO Club as a Faculty Member</p>
        </div>

        {state.message && (
          <div className={`p-4 mb-6 rounded-lg text-sm text-center ${state.success ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
            {state.message}
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="type" value="faculty" />

          {/* Name */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Full Name</label>
            <input name="fullName" required type="text" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 focus:border-[#00f0ff] outline-none transition-colors" placeholder="Dr. John Doe" />
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email Address</label>
              <input name="email" required type="email" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 focus:border-[#00f0ff] outline-none transition-colors" placeholder="faculty@vgnt.ac.in" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Phone Number</label>
              <input name="phone" required type="tel" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 focus:border-[#00f0ff] outline-none transition-colors" placeholder="+91 98765 43210" />
            </div>
          </div>

          {/* Department & Branch */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Department</label>
              <select name="department" required className="w-full bg-black/50 border border-white/10 rounded-lg p-3 focus:border-[#00f0ff] outline-none text-white">
                <option value="" className="bg-black">Select Dept</option>
                <option value="H&S" className="bg-black">BS&H</option>
                <option value="CSE" className="bg-black">CSE</option>
                <option value="ECE" className="bg-black">ECE</option>
                <option value="EEE" className="bg-black">EEE</option>
                <option value="MECH" className="bg-black">Mechanical</option>
                <option value="CIVIL" className="bg-black">Civil</option>
                <option value="AI&DS" className="bg-black">AI & DS</option>
                <option value="AI&DS" className="bg-black">CSM</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Branch / Specialization</label>
              <input name="branch" required type="text" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 focus:border-[#00f0ff] outline-none" placeholder="e.g. Data Science" />
            </div>
          </div>

          <div className="pt-4">
            <SubmitButton />
          </div>
        </form>
      </div>
    </div>
  );
}