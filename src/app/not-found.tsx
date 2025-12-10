"use client";

import Link from "next/link";
import { Home, AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 font-sans overflow-hidden text-center">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00f0ff]/20 rounded-full blur-[100px] -z-10"></div>

      {/* 404 Text */}
      <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10 tracking-tighter mb-4">
        404
      </h1>

      <div className="flex items-center gap-2 text-[#00f0ff] mb-6 animate-pulse">
        <AlertTriangle size={20} />
        <span className="font-mono text-sm tracking-widest uppercase">Calculation Error</span>
      </div>

      <h2 className="text-2xl md:text-3xl font-bold mb-4">
        Lost in the Matrix?
      </h2>
      
      <p className="text-gray-400 max-w-md mb-10 leading-relaxed">
        The coordinates you entered do not exist in our dataset. It seems you have ventured into undefined territory.
      </p>

      <Link 
        href="/" 
        className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-[#00f0ff] transition-all flex items-center gap-2"
      >
        <Home size={18} /> Return to Base
      </Link>

    </div>
  );
}