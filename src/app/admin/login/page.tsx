"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin } from "@/actions/auth";
import { Lock, ArrowRight, Loader2 } from "lucide-react";

export default function AdminLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    // 1. Reset states
    setLoading(true);
    setError("");
    
    try {
      // 2. Call the server action
      const res = await loginAdmin(formData);
      
      if (res.success) {
        // 3. SUCCESS: Redirect
        // NOTE: Do NOT set loading(false) here. 
        // We want the spinner to keep spinning while the page redirects.
        router.replace("/admin/dashboard-group/dashboard");
        router.refresh(); 
      } else {
        // 4. ERROR: Stop loading and show message
        setError(res.message || "Invalid credentials");
        setLoading(false); // <--- Crucial step to stop the spinner
      }
    } catch (err) {
      // 5. CRASH: Stop loading on network/server error
      console.error(err);
      setError("Something went wrong. Please try again.");
      setLoading(false); // <--- Crucial step to stop the spinner
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white/5 border border-white/10 p-8 rounded-2xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[#00f0ff]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-[#00f0ff]">
            <Lock size={24} />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Access</h1>
          <p className="text-gray-400 text-sm mt-2">Sign in to the admin dashboard</p>
        </div>

        {/* Use action={handleSubmit} which works with Server Actions */}
        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 text-xs font-bold mb-2 uppercase tracking-widest">
              Username
            </label>
            <input 
              type="text" 
              name="username"
              placeholder="Enter admin username" 
              className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#00f0ff] focus:outline-none transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 text-xs font-bold mb-2 uppercase tracking-widest">
              Password
            </label>
            <input 
              type="password" 
              name="password"
              placeholder="Enter admin password" 
              className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#00f0ff] focus:outline-none transition-colors"
              required
            />
          </div>
          
          {error && (
            <div className="text-red-400 text-sm text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20 animate-in fade-in slide-in-from-top-1">
              {error}
            </div>
          )}
          
          <button 
            type="submit" 
            disabled={loading}
            className={`w-full font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 ${
              loading 
                ? "bg-gray-700 text-gray-500 cursor-not-allowed" 
                : "bg-[#00f0ff] text-black hover:bg-white"
            }`}
          >
            {loading ? <Loader2 className="animate-spin" /> : <>Sign In <ArrowRight size={18} /></>}
          </button>
        </form>
      </div>
    </div>
  );
}