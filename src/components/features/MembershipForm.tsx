"use client";

import { useState } from "react";
import { submitRegistration } from "@/actions/submitRegistration";
import { Loader2, AlertCircle, CheckCircle, User, Mail, Hash, Phone, BookOpen, Layers } from "lucide-react";

const BRANCHES = ["CSE", "CSM", "CSD", "AIML", "IT", "ECE", "EEE", "CIVIL", "MECH"];
const SECTIONS = ["A", "B", "C", "D"];

export default function MembershipForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    rollNo: "",
    branch: "",
    section: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 1. SAFETY LOCK
    if (isSubmitting) return;
    setIsSubmitting(true);

    const form = new FormData();
    form.append("type", "membership");
    form.append("fullName", formData.fullName);
    form.append("email", formData.email);
    form.append("phone", formData.phone);
    form.append("rollNo", formData.rollNo);
    form.append("branch", formData.branch);
    form.append("section", formData.section);
    
    const result = await submitRegistration(null, form);
    setStatus(result);
    
    if (result.success) {
      setFormData({ fullName: "", email: "", phone: "", rollNo: "", branch: "", section: "" });
      // Keep locked (isSubmitting=true) so they don't resubmit
    } else {
      setIsSubmitting(false); // Unlock on error
    }
  };

  if (status?.success) {
    return (
      <div className="text-center py-10 animate-in zoom-in">
        <CheckCircle className="w-20 h-20 text-[#00f0ff] mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-white">Application Sent!</h2>
        <p className="text-gray-400 mt-2">
          Your application is <strong>Pending Approval</strong>.<br/>
          You will receive a confirmation email once the Admin accepts you.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-white/5 border border-white/40 rounded-3xl p-8 shadow-2xl backdrop-blur-sm">
      <h1 className="text-3xl font-bold mb-2 text-center text-white">Join MASTMO</h1>
      <p className="text-gray-400 text-center mb-8 text-sm">Become a permanent member of the club.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Full Name */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-[#00f0ff] uppercase">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-500" size={18} />
            <input 
              name="fullName" 
              value={formData.fullName}
              onChange={handleChange}
              required 
              className="w-full bg-black border border-white/20 rounded-lg py-3 pl-10 text-white focus:border-[#00f0ff] outline-none" 
              placeholder="Yashwanth Reddy" 
            />
          </div>
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#00f0ff] uppercase">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-500" size={18} />
              <input 
                name="email" 
                type="email" 
                value={formData.email}
                onChange={handleChange}
                required 
                className="w-full bg-black border border-white/20 rounded-lg py-3 pl-10 text-white focus:border-[#00f0ff] outline-none" 
                placeholder="yashwanth@vgnt.ac.in" 
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#00f0ff] uppercase">Phone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 text-gray-500" size={18} />
              <input 
                name="phone" 
                value={formData.phone}
                onChange={handleChange}
                required 
                className="w-full bg-black border border-white/20 rounded-lg py-3 pl-10 text-white focus:border-[#00f0ff] outline-none" 
                placeholder="9876543210" 
              />
            </div>
          </div>
        </div>

        {/* Roll No */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-[#00f0ff] uppercase">Roll Number</label>
          <div className="relative">
            <Hash className="absolute left-3 top-3 text-gray-500" size={18} />
            <input 
              name="rollNo" 
              value={formData.rollNo}
              onChange={handleChange}
              required 
              className="w-full bg-black border border-white/20 rounded-lg py-3 pl-10 text-white font-mono uppercase focus:border-[#00f0ff] outline-none" 
              placeholder="24891A0593" 
            />
          </div>
        </div>

        {/* Branch & Section */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#00f0ff] uppercase">Branch</label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-3 text-gray-500" size={18} />
              <select 
                name="branch" 
                value={formData.branch}
                onChange={handleChange}
                required 
                className="w-full bg-black border border-white/20 rounded-lg py-3 pl-10 text-white focus:border-[#00f0ff] outline-none appearance-none"
              >
                <option value="">Select</option>
                {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#00f0ff] uppercase">Sec</label>
            <div className="relative">
              <Layers className="absolute left-3 top-3 text-gray-500" size={18} />
              <select 
                name="section" 
                value={formData.section}
                onChange={handleChange}
                required 
                className="w-full bg-black border border-white/20 rounded-lg py-3 pl-10 text-white focus:border-[#00f0ff] outline-none appearance-none"
              >
                <option value="">Select</option>
                {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {status?.success === false && (
          <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-200 text-sm">
            <AlertCircle size={16} /> {status.message}
          </div>
        )}

        {/* Submit Button */}
        <button 
          type="submit"
          disabled={isSubmitting} 
          className={`w-full py-4 font-bold rounded-xl transition-all flex justify-center items-center gap-2 ${
             isSubmitting 
               ? "bg-gray-600 text-gray-400 cursor-not-allowed" 
               : "bg-[#00f0ff] text-black hover:bg-white"
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" /> Processing...
            </>
          ) : (
            "Submit Application"
          )}
        </button>

      </form>
    </div>
  );
}