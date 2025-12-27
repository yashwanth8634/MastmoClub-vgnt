"use client";

import { useState } from "react";
import Navbar from "@/components/ui/Navbar";
import { submitClubRegistration } from "@/actions/ClubRegistrationAction";
import { Loader2, CheckCircle, AlertCircle, School, User, Building2 } from "lucide-react";

// Dropdown Constants
const BRANCHES = ["CSE", "CSE(AI&ML)", "CSE(DS)", "AI&ML", "CSE(IT)", "ECE", "EEE", "CIVIL", "MECH", "AI&DS"];
const DEPARTMENTS = ["BS&H","CSE", "CSE(AI&ML)", "CSE(DS)", "AI&ML", "CSE(IT)", "ECE", "EEE", "CIVIL", "MECH", "AI&DS"];
const SECTIONS = ["A", "B", "C", "D"];
const YEARS = ["1", "2", "3", "4"];

export default function JoinClubPage() {
  const [activeTab, setActiveTab] = useState<"student" | "faculty">("student");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<any>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setStatus(null);

    const formData = new FormData(event.currentTarget);
    // Append the type based on the active tab
    formData.append("type", activeTab);

    const result = await submitClubRegistration(null, formData);
    setStatus(result);
    setIsSubmitting(false);
  }

  // --- Success View ---
  if (status?.success) {
    return (
      <main className="min-h-screen bg-black text-white font-sans flex items-center justify-center p-4">
        <Navbar />
        <div className="text-center w-full max-w-md bg-white/5 border border-white/10 p-10 rounded-3xl animate-in zoom-in">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-2">Application Sent!</h1>
          <p className="text-gray-400 mb-8">{status.message}</p>
          <button onClick={() => window.location.reload()} className="px-6 py-3 bg-[#00f0ff] text-black font-bold rounded-xl hover:bg-white transition-all">
            Submit Another
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white font-sans pt-32 pb-20 px-4 selection:bg-[#00f0ff]/30">
      <Navbar />
      
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
          Join <span className="text-[#00f0ff]">MASTMO</span>
        </h1>
        <p className="text-gray-400 text-center mb-10">
          Become a member of the most active tech club on campus.
        </p>

        {/* --- TABS --- */}
        <div className="flex p-1 bg-white/5 rounded-2xl mb-8 border border-white/10">
          <button 
            onClick={() => { setActiveTab("student"); setStatus(null); }}
            className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-all ${activeTab === "student" ? "bg-[#00f0ff] text-black shadow-lg" : "text-gray-400 hover:text-white"}`}
          >
            <User size={18} /> Student
          </button>
          <button 
            onClick={() => { setActiveTab("faculty"); setStatus(null); }}
            className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-all ${activeTab === "faculty" ? "bg-[#00f0ff] text-black shadow-lg" : "text-gray-400 hover:text-white"}`}
          >
            <School size={18} /> Faculty
          </button>
        </div>

        {/* --- FORM CONTAINER --- */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 relative overflow-hidden">
          
          <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 key={activeTab}">
            
            {/* Common Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-500 ml-1">Full Name</label>
                <input name="fullName" required placeholder="Yashwanth Reddy" className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-[#00f0ff] outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-500 ml-1">Email Address</label>
                <input name="email" type="email" required placeholder="yash@vgnt.in" className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-[#00f0ff] outline-none" />
              </div>
            </div>

            <div className="space-y-2">
               <label className="text-xs font-bold uppercase text-gray-500 ml-1">Phone Number</label>
               <input name="phone" type="tel" required placeholder="9876543210" className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-[#00f0ff] outline-none" />
            </div>

            {/* --- STUDENT SPECIFIC FIELDS --- */}
            {activeTab === "student" && (
              <>
                <div className="space-y-2">
                   <label className="text-xs font-bold uppercase text-gray-500 ml-1">Roll Number</label>
                   <input name="rollNo" required placeholder="24891A0593" className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-[#00f0ff] outline-none font-mono" />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-500 ml-1">Year</label>
                    <select name="year" className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-[#00f0ff] outline-none appearance-none">
                      {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-500 ml-1">Branch</label>
                    <select name="branch" className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-[#00f0ff] outline-none appearance-none">
                      {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-500 ml-1">Section</label>
                    <select name="section" className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-[#00f0ff] outline-none appearance-none">
                      {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* --- FACULTY SPECIFIC FIELDS --- */}
            {activeTab === "faculty" && (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-500 ml-1">Department</label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-4 text-gray-500" size={20} />
                  <select name="department" className="w-full bg-black border border-white/10 rounded-xl p-4 pl-12 text-white focus:border-[#00f0ff] outline-none appearance-none">
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
            )}

            {/* ERROR MESSAGE */}
            {status?.success === false && (
              <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-300 animate-in shake">
                <AlertCircle size={20} /> {status.message}
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className={`w-full py-4 font-bold rounded-xl transition-all flex justify-center items-center gap-2 ${
                isSubmitting 
                  ? "bg-gray-800 text-gray-500 cursor-not-allowed" 
                  : "bg-[#00f0ff] text-black hover:bg-white hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]"
              }`}
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : "Submit Application"}
            </button>
          
          </form>
        </div>
      </div>
    </main>
  );
}