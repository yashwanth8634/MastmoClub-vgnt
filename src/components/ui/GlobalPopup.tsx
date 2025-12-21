"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Images, ArrowLeft } from "lucide-react";

export default function GlobalPopup({ popupData }: { popupData: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"text" | "gallery">("text");
  const [currentSlide, setCurrentSlide] = useState(0);

  const images = popupData?.images || [];

  useEffect(() => {
    if (!popupData?.isActive) return;
    const timer = setTimeout(() => setIsOpen(true), 1000); 
    return () => clearTimeout(timer);
  }, [popupData]);

  const handleClose = () => setIsOpen(false);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % images.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);

  if (!isOpen || !popupData) return null;

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
             {/* 🌟 MOVING BORDER CONTAINER */}
             <div className="relative overflow-hidden rounded-3xl p-[2px]">
                <div className="absolute inset-[-100%] animate-[spin_10s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#000000_50%,#FFD700_100%)] opacity-100" />
                
                <div className="relative h-full w-full bg-[#050505] rounded-[22px] overflow-hidden max-h-[85vh] flex flex-col">
                    
                    <button 
                        onClick={handleClose} 
                        className="absolute top-4 right-4 z-50 p-2 bg-black/60 text-white rounded-full hover:bg-[#FFD700] hover:text-black transition-all border border-white/10 shadow-lg"
                    >
                        <X size={18} />
                    </button>

                    {/* === MODE 1: STANDARD TEXT VIEW === */}
                    {viewMode === "text" && (
                        <div className="flex flex-col p-6 overflow-y-auto custom-scrollbar">
                            
                            {/* ✅ FIX: Aspect ratio container with 'object-contain' */}
                            <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden border border-[#FFD700]/30 shadow-lg shadow-black/50 mb-6 bg-black group shrink-0">
                                {images.length > 0 ? (
                                    <Image 
                                        src={images[0]} 
                                        alt="Cover" 
                                        fill 
                                        // ⚠️ CHANGED from 'object-cover' to 'object-contain'
                                        // This ensures the top/bottom are NEVER cut off.
                                        className="object-contain transition-transform duration-700 group-hover:scale-105" 
                                        
                                        // ✅ OPTIMIZATION: Use Vercel's speed (since you are on Vercel now)
                                        sizes="(max-width: 768px) 100vw, 600px"
                                        priority={true}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-700">No Image</div>
                                )}
                                
                                {images.length > 1 && (
                                    <button 
                                        onClick={() => setViewMode("gallery")}
                                        className="absolute bottom-3 right-3 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-bold text-[#FFD700] border border-[#FFD700]/30 hover:bg-[#FFD700] hover:text-black transition-all"
                                    >
                                        <Images size={12} /> +{images.length - 1} More
                                    </button>
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
                    )}

                    {/* === MODE 2: GALLERY SLIDER === */}
                    {viewMode === "gallery" && (
                        <div className="relative h-[60vh] md:h-[500px] bg-black flex flex-col">
                            <div className="absolute top-0 left-0 w-full z-20 p-4 flex items-center gap-2 bg-gradient-to-b from-black/80 to-transparent">
                                <button onClick={() => setViewMode("text")} className="text-white hover:text-[#FFD700] flex items-center gap-2 text-sm font-bold">
                                    <ArrowLeft size={16} /> Back
                                </button>
                            </div>

                            <div className="relative flex-1 bg-[#0a0a0a]">
                                <AnimatePresence mode="wait">
                                    <motion.div 
                                        key={currentSlide}
                                        initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
                                        transition={{ duration: 0.3 }}
                                        className="relative w-full h-full p-4"
                                    >
                                        <div className="relative w-full h-full rounded-xl overflow-hidden border border-white/10">
                                            {/* Gallery is also updated to use Vercel optimization */}
                                           <Image 
                                              src={images[currentSlide]} 
                                              alt="Gallery" 
                                              fill 
                                              className="object-contain" 
                                              priority={true}
                                           />
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                                
                                <button onClick={prevSlide} className="absolute left-2 top-1/2 -translate-y-1/2 p-3 bg-black/50 text-white rounded-full hover:bg-[#FFD700] hover:text-black"><ChevronLeft size={20} /></button>
                                <button onClick={nextSlide} className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-black/50 text-white rounded-full hover:bg-[#FFD700] hover:text-black"><ChevronRight size={20} /></button>
                            </div>
                        </div>
                    )}
                </div>
             </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}