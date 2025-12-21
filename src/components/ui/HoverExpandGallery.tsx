"use client";

import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function HoverExpandGallery({ photos }: { photos: any[] }) {
  const [isMobile, setIsMobile] = useState(false);
  const [mobileIndex, setMobileIndex] = useState(0);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const processedImages = photos.map((item, index) => ({
    id: index,
    src: typeof item === 'string' ? item : item.src || item.imageUrl || "",
    alt: `Photo ${index + 1}`
  })).filter(img => img.src);

  if (processedImages.length === 0) return null;

  // --- 📱 MOBILE VIEW (Fixed Scrolling) ---
  if (isMobile) {
    const next = (e: React.MouseEvent) => {
      e.stopPropagation(); // Stop clicking through
      setMobileIndex((prev) => (prev + 1) % processedImages.length);
    };
    const prev = (e: React.MouseEvent) => {
      e.stopPropagation();
      setMobileIndex((prev) => (prev - 1 + processedImages.length) % processedImages.length);
    };

    return (
      // ✅ FIX: 'touch-pan-y' allows vertical page scroll
      // ✅ FIX: 'select-none' prevents blue highlight selection
      <div className="relative w-full aspect-video overflow-hidden rounded-xl border border-white/10 bg-black touch-pan-y select-none group">
        
        <AnimatePresence mode="wait">
          <motion.div
            key={mobileIndex}
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative w-full h-full"
          >
            <Image 
              src={processedImages[mobileIndex].src} 
              alt="Gallery" 
              fill 
              className="object-contain" 
              sizes="100vw"
              draggable={false} // Prevents ghost image drag
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons (Always visible on mobile) */}
        <button 
          onClick={prev} 
          className="absolute left-2 top-1/2 -translate-y-1/2 p-3 bg-black/60 text-white rounded-full border border-white/20 active:scale-95 transition-transform z-20"
        >
          <ChevronLeft size={20}/>
        </button>
        
        <button 
          onClick={next} 
          className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-black/60 text-white rounded-full border border-white/20 active:scale-95 transition-transform z-20"
        >
          <ChevronRight size={20}/>
        </button>

        {/* Counter Badge */}
        <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 rounded-md text-xs text-white border border-white/10">
            {mobileIndex + 1} / {processedImages.length}
        </div>
      </div>
    );
  }

  // --- 💻 DESKTOP VIEW (Original Hover Effect) ---
  return (
    <div className="flex w-full overflow-hidden justify-center gap-2">
      {processedImages.slice(0, 5).map((image, index) => (
        <motion.div
          key={image.id}
          className="relative h-[400px] rounded-2xl overflow-hidden cursor-pointer border border-white/10"
          initial={{ width: "5rem" }}
          whileHover={{ width: "25rem" }}
          transition={{ duration: 0.4, ease: "circOut" }}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover"
            sizes="30vw"
          />
        </motion.div>
      ))}
    </div>
  );
}