"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface PopupData {
  isActive: boolean;
  title: string;
  description: string;
  images: string[];
}

export default function GlobalPopup({ popupData }: { popupData: PopupData | null }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // 🔴 STRICT FIX 1: IMMEDIATE GUARD
  // If data says inactive, or we are in admin, render NOTHING.
  // We check this before any hooks to be absolutely sure.
  const shouldRender = popupData?.isActive && !pathname?.startsWith("/admin");

  // Touch handling refs
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const images = popupData?.images || [];

  // 1. OPEN LOGIC
  useEffect(() => {
    // If we shouldn't render, stop immediately.
    if (!shouldRender) return;

    const hasSeen = sessionStorage.getItem("hasSeenPopup");

    if (pathname === "/") {
      // Home: Always show after delay
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem("hasSeenPopup", "true");
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      // Others: Show only if not seen
      if (!hasSeen) {
        const timer = setTimeout(() => {
          setIsOpen(true);
          sessionStorage.setItem("hasSeenPopup", "true");
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [shouldRender, pathname]);

  // 2. NAVIGATION LOGIC
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Keyboard
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, nextSlide, prevSlide]);

  // Touch Logic
  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.targetTouches[0].clientX; };
  const handleTouchMove = (e: React.TouchEvent) => { touchEndX.current = e.targetTouches[0].clientX; };
  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50) nextSlide();
    if (distance < -50) prevSlide();
    touchStartX.current = 0; touchEndX.current = 0;
  };

  // 🔴 STRICT FIX 2: FINAL RENDER CHECK
  // If not supposed to render, or state is closed, return null.
  if (!shouldRender || !isOpen || !popupData) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)} 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer" 
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }} 
            animate={{ scale: 1, opacity: 1, y: 0 }} 
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg md:max-w-2xl max-h-[85vh] flex flex-col pointer-events-none"
          >
             <div className="pointer-events-auto relative rounded-3xl p-[2px] overflow-hidden shadow-2xl">
                <div className="absolute inset-[-150%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#000000_0%,#FFD700_50%,#000000_100%)]" />

                <div className="relative h-full w-full bg-[#111] rounded-[22px] overflow-hidden flex flex-col">
                    <button 
                        onClick={() => setIsOpen(false)} 
                        className="absolute top-3 right-3 z-50 p-2 bg-black/60 text-white/80 rounded-full hover:bg-red-500 hover:text-white transition-all backdrop-blur-md border border-white/10"
                    >
                        <X size={20} />
                    </button>

                    <div 
                      className="relative w-full aspect-[4/3] md:aspect-[16/9] bg-black group"
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentSlide}
                                initial={{ opacity: 0, x: 20 }} 
                                animate={{ opacity: 1, x: 0 }} 
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="relative w-full h-full"
                            >
                                {images.length > 0 ? (
                                    <Image src={images[currentSlide]} alt="Slide" fill className="object-contain" priority />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-500">No Image</div>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        {images.length > 1 && (
                          <>
                            <button onClick={(e) => { e.stopPropagation(); prevSlide(); }} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white border border-white/10 hover:bg-[#FFD700] hover:text-black transition-all"><ChevronLeft size={24} /></button>
                            <button onClick={(e) => { e.stopPropagation(); nextSlide(); }} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white border border-white/10 hover:bg-[#FFD700] hover:text-black transition-all"><ChevronRight size={24} /></button>
                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-40 bg-black/30 px-3 py-1.5 rounded-full backdrop-blur-sm">
                                {images.map((_, idx) => (
                                    <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 ${currentSlide === idx ? "w-6 bg-[#FFD700]" : "w-1.5 bg-white/50"}`} />
                                ))}
                            </div>
                          </>
                        )}
                    </div>

                    <div className="p-5 bg-gradient-to-b from-[#111] to-[#050505] border-t border-white/10">
                        <h2 className="text-xl font-bold text-white mb-2">{popupData.title}</h2>
                        <p className="text-gray-400 text-sm mb-5 leading-relaxed line-clamp-3">{popupData.description}</p>
                        <button onClick={() => setIsOpen(false)} className="w-full py-3 bg-[#FFD700] text-black font-bold text-sm uppercase tracking-wide rounded-lg hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(255,215,0,0.15)]">Enter Site</button>
                    </div>
                </div>
             </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}