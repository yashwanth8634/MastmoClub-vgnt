"use client";

import { useFormState } from "react-dom";
import { loginAdmin } from "@/actions/auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import SubmitButton from "@/components/SubmitButton"; // Use the component we made earlier

export default function AdminLoginPage() {
  const [state, formAction] = useFormState(loginAdmin, { success: false, message: "" });
  const router = useRouter();

  // ✅ Watch for success and redirect
  useEffect(() => {
    if (state?.success) {
      router.push("/admin/dashboard-group");
    }
  }, [state?.success, router]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-sm">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#00f0ff] mb-2">Admin Login</h1>
          <p className="text-gray-400">Restricted Access Only</p>
        </div>

        {/* Error Message */}
        {state?.message && (
          <div className="p-3 mb-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg text-center">
            {state.message}
          </div>
        )}

        <form action={formAction} className="space-y-4">
          
          {/* Username */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Username</label>
            <input 
              name="username" 
              required 
              type="text" 
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 focus:border-[#00f0ff] outline-none transition-colors" 
              placeholder="admin" 
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Password</label>
            <input 
              name="password" 
              required 
              type="password" 
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 focus:border-[#00f0ff] outline-none transition-colors" 
              placeholder="••••••••" 
            />
          </div>

          <div className="pt-4">
            <SubmitButton text="Login" loadingText="Verifying..." />
          </div>

        </form>
      </div>
    </div>
  );
}