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
    // 1. Only check if Admin turned it ON
    if (!popupData?.isActive) return;

    // ⚠️ REMOVED: The check for 'sessionStorage' (seenPopup)
    // Now it will simply run every time this component mounts (page reload)

    const timer = setTimeout(() => setIsOpen(true), 1000); // 1s delay for smooth entrance
    return () => clearTimeout(timer);
  }, [popupData]);

  const handleClose = () => {
    setIsOpen(false);
    // ⚠️ REMOVED: We don't save to storage anymore, so it forgets you closed it.
  };

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % images.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);

  if (!isOpen || !popupData) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={handleClose} 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
          />

          {/* Popup Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-lg bg-[#0a0a0a] border border-[#00f0ff]/30 rounded-3xl overflow-hidden shadow-2xl"
          >
            {/* Close Button */}
            <button onClick={handleClose} className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-red-500 text-white rounded-full transition-colors">
                <X size={20} />
            </button>

            {/* === MODE 1: STANDARD TEXT VIEW === */}
            {viewMode === "text" && (
                <div className="flex flex-col">
                    <div className="relative h-56 w-full">
                        {images.length > 0 ? (
                            <Image 
                                src={images[0]} 
                                alt="Cover" 
                                fill 
                                className="object-cover" 
                                unoptimized={true} 
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-900 flex items-center justify-center text-gray-700">No Image</div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent"></div>
                        
                        {images.length > 1 && (
                            <button 
                                onClick={() => setViewMode("gallery")}
                                className="absolute bottom-4 right-4 flex items-center gap-2 bg-white/10 hover:bg-[#00f0ff] hover:text-black backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold text-white transition-all border border-white/20"
                            >
                                <Images size={14} /> View All ({images.length})
                            </button>
                        )}
                    </div>

                    <div className="p-8 text-center -mt-4 relative z-10">
                        <h2 className="text-2xl font-bold text-white mb-2">{popupData.title}</h2>
                        <div className="h-1 w-20 bg-[#00f0ff] mx-auto mb-4 rounded-full"></div>
                        <p className="text-gray-300 text-sm leading-relaxed mb-6">{popupData.description}</p>
                        <button onClick={handleClose} className="w-full py-3 bg-[#00f0ff] text-black font-bold rounded-xl hover:bg-white transition-colors">
                            Got it!
                        </button>
                    </div>
                </div>
            )}

            {/* === MODE 2: GALLERY SLIDER === */}
            {viewMode === "gallery" && (
                <div className="relative h-[500px] bg-black flex flex-col">
                    <div className="absolute top-0 left-0 w-full z-20 p-4 flex items-center gap-2 bg-gradient-to-b from-black/80 to-transparent">
                        <button onClick={() => setViewMode("text")} className="text-white hover:text-[#00f0ff] flex items-center gap-2 text-sm font-bold">
                            <ArrowLeft size={16} /> Back
                        </button>
                    </div>

                    <div className="relative flex-1 bg-gray-900">
                        <AnimatePresence mode="wait">
                            <motion.div 
                                key={currentSlide}
                                initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.3 }}
                                className="relative w-full h-full"
                            >
                                <Image src={images[currentSlide]} alt="Gallery" fill className="object-contain" unoptimized={true} />
                            </motion.div>
                        </AnimatePresence>
                        
                        <button onClick={prevSlide} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-[#00f0ff] hover:text-black"><ChevronLeft size={24} /></button>
                        <button onClick={nextSlide} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-[#00f0ff] hover:text-black"><ChevronRight size={24} /></button>
                    </div>
                </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}