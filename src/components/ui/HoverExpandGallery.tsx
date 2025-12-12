"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import Image from "next/image"; // ✅ Use Next.js Image for performance
import { cn } from "@/lib/utils";

export default function HoverExpandGallery({ 
  photos, 
  className 
}: { 
  photos: any[], 
  className?: string 
}) {
  const [activeImage, setActiveImage] = useState<number | null>(0);

  // Robust Data Processing
  const processedImages = photos.map((item, index) => {
    let src = "";
    if (typeof item === 'string') src = item;
    else if (item && typeof item === 'object') src = item.src || item.imageUrl || item.url || "";

    return {
      id: index,
      src: src,
      alt: `Event photo ${index + 1}`,
      code: `#${String(index + 1).padStart(2, '0')}`
    };
  }).filter(img => img.src && img.src.startsWith("http"));

  if (processedImages.length === 0) return null;

  return (
    <div className={cn("w-full", className)}>
      <div className="flex w-full overflow-x-auto pb-6 pt-2 no-scrollbar px-2 snap-x">
        <div className="flex min-w-full items-center justify-center gap-2 md:gap-4 mx-auto">
          {processedImages.map((image, index) => (
            <motion.div
              key={image.id}
              layout
              onClick={() => setActiveImage(index)}
              onHoverStart={() => setActiveImage(index)}
              className={cn(
                "relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/5 shrink-0 snap-center",
                "h-[300px] md:h-[400px]", // Fixed height prevents layout shifts
                "will-change-[width,opacity]" // ✅ GPU Hint for smoothness
              )}
              initial={false}
              animate={{
                // Smoother width transition logic
                width: activeImage === index 
                  ? (typeof window !== 'undefined' && window.innerWidth < 768 ? "18rem" : "32rem") 
                  : (typeof window !== 'undefined' && window.innerWidth < 768 ? "3rem" : "5rem"),
                opacity: 1
              }}
              transition={{ 
                duration: 0.4, 
                ease: "easeOut" // ✅ Snappier, less "heavy" than spring
              }}
            >
              {/* Overlays */}
              <AnimatePresence mode="wait">
                {activeImage === index && (
                  <>
                     <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-transparent to-transparent" 
                     />
                     <motion.div 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} 
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-0 left-0 z-20 flex w-full flex-col justify-end p-4 md:p-6"
                     >
                        <p className="text-lg md:text-xl font-bold text-white tracking-widest font-mono">{image.code}</p>
                     </motion.div>
                  </>
                )}
              </AnimatePresence>
              
              {/* ✅ OPTIMIZED IMAGE */}
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 300px, 600px" // Download small images on mobile
                className="object-cover"
                priority={index === 0} // Load first image immediately
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}