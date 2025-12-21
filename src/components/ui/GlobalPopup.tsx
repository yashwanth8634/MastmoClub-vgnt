"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation"; // 👈 Import this
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function GlobalPopup({ popupData }: { popupData: any }) {
  const pathname = usePathname(); // 👈 Get current URL
  const [isOpen, setIsOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const images = popupData?.images || [];

  useEffect(() => {
    // 1. If no data or not active, return.
    if (!popupData?.isActive) return;

    // 2. 🚫 ADMIN CHECK: If we are on any admin page, DO NOT show popup.
    if (pathname?.startsWith("/admin")) return; 

    // 3. Otherwise, show it after 1 second
    const timer = setTimeout(() => setIsOpen(true), 1000); 
    return () => clearTimeout(timer);
  }, [popupData, pathname]);

  const handleClose = () => setIsOpen(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Keyboard Support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, nextSlide, prevSlide]);

  // If hidden or path is admin, render nothing
  if (!isOpen || !popupData || pathname?.startsWith("/admin")) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] h-screen w-screen flex items-center justify-center p-4">
          
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={handleClose} 
            className="absolute inset-0 bg-black/90 backdrop-blur-md" 
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-[95%] md:w-full md:max-w-xl lg:max-w-2xl"
          >
             <div className="relative overflow-hidden rounded-3xl p-[2px]">
                <div className="absolute inset-[-100%] animate-[spin_10s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#000000_50%,#FFD700_100%)] opacity-100" />
                
                <div className="relative h-full w-full bg-[#050505] rounded-[22px] overflow-hidden max-h-[85vh] flex flex-col">
                    
                    <button 
                        onClick={handleClose} 
                        className="absolute top-4 right-4 z-50 p-2 bg-black/60 text-white rounded-full hover:bg-[#FFD700] hover:text-black transition-all border border-white/10 shadow-lg"
                    >
                        <X size={18} />
                    </button>

                    <div className="flex flex-col p-6 overflow-y-auto custom-scrollbar">
                        
                        <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden border border-[#FFD700]/30 shadow-lg shadow-black/50 mb-6 bg-black group shrink-0">
                            
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentSlide}
                                    initial={{ opacity: 0, scale: 1.05 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="relative w-full h-full"
                                >
                                    {images.length > 0 ? (
                                        <Image 
                                            src={images[currentSlide]} 
                                            alt="Event Slide" 
                                            fill 
                                            className="object-contain"
                                            sizes="(max-width: 768px) 100vw, 600px"
                                            priority={true}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-700">No Image</div>
                                    )}
                                </motion.div>
                            </AnimatePresence>

                            {/* Arrows - Only if > 1 image */}
                            {images.length > 1 && (
                                <>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-[#FFD700] hover:text-black transition-all border border-white/10 backdrop-blur-sm group-hover:opacity-100 md:opacity-0 transition-opacity duration-300"
                                    >
                                        <ChevronLeft size={24} />
                                    </button>

                                    <button 
                                        onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-[#FFD700] hover:text-black transition-all border border-white/10 backdrop-blur-sm group-hover:opacity-100 md:opacity-0 transition-opacity duration-300"
                                    >
                                        <ChevronRight size={24} />
                                    </button>

                                    {/* ✅ FIXED TYPESCRIPT ERROR HERE */}
                                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                                        {images.map((_: any, idx: number) => (
                                            <div 
                                                key={idx} 
                                                className={`h-1.5 rounded-full transition-all duration-300 ${currentSlide === idx ? "w-6 bg-[#FFD700]" : "w-1.5 bg-white/30"}`} 
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="text-center shrink-0">
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 tracking-wide drop-shadow-lg leading-tight">
                                {popupData.title}
                            </h2>
                            
                            <div className="h-1 w-16 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent mx-auto mb-5 rounded-full"></div>
                            
                            <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6 opacity-90 max-w-lg mx-auto">
                                {popupData.description}
                            </p>
                            
                            <button 
                                onClick={handleClose} 
                                className="w-full py-3.5 bg-[#FFD700] text-black font-bold text-sm uppercase tracking-widest rounded-xl hover:bg-white transition-colors shadow-[0_0_15px_rgba(255,215,0,0.4)]"
                            >
                                Enter Site
                            </button>
                        </div>
                    </div>
                </div>
             </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}