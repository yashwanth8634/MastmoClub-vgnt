"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function GlobalPopup({ popupData }: { popupData: any }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const images = popupData?.images || [];

  useEffect(() => {
    // 1. Safety Checks: If no data, inactive, or Admin page -> Stop.
    if (!popupData?.isActive || pathname?.startsWith("/admin")) return;

    // 2. LOGIC: "Every time on Home, Once on others"
    const hasSeen = sessionStorage.getItem("hasSeenPopup");

    if (pathname === "/") {
      // ✅ CASE A: Homepage -> Always show (and mark as seen for other pages)
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem("hasSeenPopup", "true"); 
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // ✅ CASE B: Other Routes -> Only show if NOT seen yet
      if (!hasSeen) {
        const timer = setTimeout(() => {
          setIsOpen(true);
          sessionStorage.setItem("hasSeenPopup", "true");
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [popupData, pathname]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, nextSlide, prevSlide]);

  if (!isOpen || !popupData || pathname?.startsWith("/admin")) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed top-0 left-0 inset-0 z-[99999] h-screen w-screen flex items-center justify-center p-4">
          
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)} 
            className="absolute inset-0 bg-black/95 backdrop-blur-xl cursor-pointer" 
          />

          {/* Popup Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-[95%] md:w-full md:max-w-xl lg:max-w-2xl max-h-[90vh]"
          >
             <div className="relative overflow-hidden rounded-3xl p-[2px]">
                {/* Gold Border Animation */}
                <div className="absolute inset-[-100%] animate-[spin_10s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#000000_50%,#FFD700_100%)]" />
                
                <div className="relative h-full w-full bg-[#050505] rounded-[22px] overflow-hidden flex flex-col">
                    
                    {/* Close Button */}
                    <button 
                        onClick={() => setIsOpen(false)} 
                        className="absolute top-4 right-4 z-[100] p-2 bg-black/80 text-white rounded-full hover:bg-[#FFD700] hover:text-black transition-all border border-white/20 shadow-lg cursor-pointer"
                    >
                        <X size={20} />
                    </button>

                    {/* 🖼️ IMAGE AREA */}
                    <div className="relative w-full h-[55vh] md:h-[60vh] bg-black group shrink-0">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentSlide}
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="relative w-full h-full"
                            >
                                {images.length > 0 ? (
                                    <Image 
                                        src={images[currentSlide]} 
                                        alt="Slide" 
                                        fill 
                                        className="object-contain" 
                                        priority 
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-gray-500">No Image</div>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation Buttons (Only if > 1 image) */}
                        {images.length > 1 && (
                            <>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); prevSlide(); }} 
                                    className="absolute left-2 top-1/2 -translate-y-1/2 p-3 bg-black/80 text-white rounded-full hover:bg-[#FFD700] hover:text-black border border-white/20 z-[60] cursor-pointer shadow-xl active:scale-95 transition-all"
                                >
                                    <ChevronLeft size={28} />
                                </button>
                                
                                <button 
                                    onClick={(e) => { e.stopPropagation(); nextSlide(); }} 
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-black/80 text-white rounded-full hover:bg-[#FFD700] hover:text-black border border-white/20 z-[60] cursor-pointer shadow-xl active:scale-95 transition-all"
                                >
                                    <ChevronRight size={28} />
                                </button>

                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-[60]">
                                    {images.map((_: any, idx: number) => (
                                        <div 
                                            key={idx} 
                                            className={`h-2 rounded-full transition-all duration-300 shadow-md ${currentSlide === idx ? "w-8 bg-[#FFD700]" : "w-2 bg-white/50"}`} 
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* 📝 TEXT AREA */}
                    <div className="p-4 md:p-6 text-center bg-[#0a0a0a] border-t border-white/10 flex flex-col justify-center relative z-[70]">
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-2 line-clamp-1">{popupData.title}</h2>
                        <p className="text-gray-400 text-sm line-clamp-2 mb-4 max-w-md mx-auto">
                            {popupData.description}
                        </p>
                        <button 
                            onClick={() => setIsOpen(false)} 
                            className="w-full py-3 bg-[#FFD700] text-black font-bold text-sm uppercase rounded-xl hover:bg-white shadow-[0_0_15px_rgba(255,215,0,0.3)] transition-all cursor-pointer"
                        >
                            Enter Site
                        </button>
                    </div>

                </div>
             </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}