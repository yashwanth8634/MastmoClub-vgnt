"use client";

import { motion } from "framer-motion";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function HoverExpandGallery({ photos }: { photos: any[] }) {
  const [isMobile, setIsMobile] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

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

  // 🔹 SCROLL LOGIC
  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      // Scroll by about 80% of the screen width for a good step
      const scrollAmount = clientWidth * 0.8; 
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // --- 📱 MOBILE VIEW (Looks like Desktop but Scrollable) ---
  if (isMobile) {
    return (
      <div className="relative w-full group">
        
        {/* Horizontal Scroll Container */}
        <div 
          ref={scrollRef}
          className="flex w-full overflow-x-auto snap-x snap-mandatory no-scrollbar gap-4 px-2 touch-pan-x"
        >
          {processedImages.map((image, index) => (
            <motion.div 
              key={image.id}
              whileTap={{ scale: 0.98 }} // 👈 Tiny "Zoom" press effect
              className="relative min-w-[85vw] h-[300px] snap-center rounded-2xl overflow-hidden border border-white/10 shrink-0"
            >
              <Image 
                src={image.src} 
                alt={image.alt} 
                fill 
                className="object-cover"
                sizes="85vw"
                draggable={false}
              />
              {/* Counter Badge */}
              <div className="absolute bottom-3 right-3 bg-black/60 px-2 py-1 rounded-md text-xs text-white border border-white/10 z-10 backdrop-blur-md">
                 {index + 1} / {processedImages.length}
              </div>
            </motion.div>
          ))}
        </div>

        {/* ⬅️ Left Button */}
        <button 
          onClick={() => scroll("left")} 
          className="absolute left-2 top-1/2 -translate-y-1/2 p-3 bg-black/60 text-white rounded-full border border-white/20 active:scale-95 transition-transform z-20 shadow-xl backdrop-blur-sm"
        >
          <ChevronLeft size={20}/>
        </button>
        
        {/* ➡️ Right Button */}
        <button 
          onClick={() => scroll("right")} 
          className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-black/60 text-white rounded-full border border-white/20 active:scale-95 transition-transform z-20 shadow-xl backdrop-blur-sm"
        >
          <ChevronRight size={20}/>
        </button>

      </div>
    );
  }

  // --- 💻 DESKTOP VIEW (Hover Expand + Justify Start) ---
  return (
    // ✅ CHANGED: justify-start (Aligns left instead of center)
    <div className="flex w-full overflow-hidden justify-start gap-2 px-2">
      {processedImages.map((image) => (
        <motion.div
          key={image.id}
          className="relative h-[400px] rounded-2xl overflow-hidden cursor-pointer border border-white/10"
          initial={{ width: "5rem" }}
          whileHover={{ width: "25rem" }} // Expand effect
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