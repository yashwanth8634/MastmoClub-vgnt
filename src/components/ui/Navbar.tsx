"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-6 py-5 transition-all duration-300 bg-transparent">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="relative w-16 h-16 md:w-20 md:h-20 hover:scale-105 transition-transform z-50">
          <Image 
            src="/mastmo-logo.png" 
            alt="Mastmo Logo" 
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-contain drop-shadow-[0_0_15px_rgba(0,240,255,0.4)]"
            priority
          />
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-8 bg-black backdrop-blur-md px-8 py-3 rounded-full border border-white/10">
          <Link href="/events" className="text-sm font-bold tracking-widest text-gray-300 hover:text-[#00f0ff] uppercase transition-colors">
            Events
          </Link>
          <Link href="/about" className="text-sm font-bold tracking-widest text-gray-300 hover:text-[#00f0ff] uppercase transition-colors">
            About Us
          </Link>
          <Link 
            href="/join" 
            className="text-sm font-bold tracking-widest text-[#00f0ff] hover:text-white uppercase transition-colors"
          >
            Join Us
          </Link>
        </div>

        {/* MOBILE MENU ICON */}
        <button 
          className="md:hidden text-white z-50 p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* MOBILE MENU OVERLAY (Animated Glass) */}
      <div 
        className={`fixed h-screen w-screen inset-0 bg-black/95 backdrop-blur-xl z-40 flex flex-col items-center justify-center gap-5 transition-all duration-500 ease-in-out ${
          isOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-10 invisible"
        }`}
      >
        <Link 
          href="/events" 
          className="text-2xl font-bold text-white tracking-widest uppercase hover:text-[#00f0ff]" 
          onClick={() => setIsOpen(false)}
        >
          Events
        </Link>
        <Link 
          href="/about" 
          className="text-2xl font-bold text-white tracking-widest uppercase hover:text-[#00f0ff]" 
          onClick={() => setIsOpen(false)}
        >
          About Us
        </Link>
        <Link 
          href="/team" 
          className="text-2xl font-bold text-white tracking-widest uppercase hover:text-[#00f0ff]" 
          onClick={() => setIsOpen(false)}
        >
          Team
        </Link>
        <Link 
          href="/join" 
          className="px-10 py-4 border border-[#00f0ff] text-[#00f0ff] font-bold text-xl tracking-widest uppercase rounded-full hover:bg-[#00f0ff] hover:text-black transition-all"
          onClick={() => setIsOpen(false)}
        >
          Join Us
        </Link>
      </div>
    </nav>
  );
}