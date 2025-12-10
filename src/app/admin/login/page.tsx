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
    setLoading(true);
    setError("");
    
    const res = await loginAdmin(formData);
    
    if (res.success) {
      router.push("/admin/dashboard-group/dashboard");
    } else {
      setError(res.message || "An unknown error occurred");
      setLoading(false);
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
            <p className="text-red-400 text-sm text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20">
              {error}
            </p>
          )}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#00f0ff] text-black font-bold py-3 rounded-lg hover:bg-white transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : <>Sign In <ArrowRight size={18} /></>}
          </button>
        </form>

        <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-lg">
          <p className="text-xs text-gray-400 mb-2"><strong>Demo Credentials:</strong></p>
          <p className="text-xs text-gray-300">Username: <code className="bg-black/50 px-2 py-1 rounded">admin</code></p>
          <p className="text-xs text-gray-300">Password: <code className="bg-black/50 px-2 py-1 rounded">mastmo_admin_2025</code></p>
        </div>
      </div>
    </div>
  );
}