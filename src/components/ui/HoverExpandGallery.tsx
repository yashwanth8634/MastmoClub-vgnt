"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ImageOff } from "lucide-react";

export default function HoverExpandGallery({ 
  photos, 
  className 
}: { 
  photos: any[], 
  className?: string 
}) {
  const [activeImage, setActiveImage] = useState<number | null>(0);
  const [imageStatus, setImageStatus] = useState<Record<number, 'loading' | 'loaded' | 'error'>>({});

  // ✅ 1. Function to handle success
  const handleImageLoad = (index: number) => {
    setImageStatus(prev => ({ ...prev, [index]: 'loaded' }));
  };

  // ✅ 2. Function to handle failure (THIS WAS MISSING)
  const handleImageError = (index: number) => {
    setImageStatus(prev => ({ ...prev, [index]: 'error' }));
    console.error(`Failed to load image at index ${index}`);
  };

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
      <div className="flex w-full overflow-x-auto pb-6 pt-2 no-scrollbar px-2 snap-x touch-pan-x">
        <div className="flex min-w-full w-max items-center justify-start gap-2 md:gap-4 mx-auto">
          {processedImages.map((image, index) => {
            const status = imageStatus[index] || 'loading';

            return (
            <motion.div
              key={image.id}
              layout
              onClick={() => setActiveImage(index)}
              onHoverStart={() => setActiveImage(index)}
              className={cn(
                "relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 shrink-0 snap-center",
                "h-[300px] md:h-[400px]", 
                "will-change-[width]",
                status === 'loading' ? "bg-white/5 animate-pulse" : "bg-black"
              )}
              initial={false}
              animate={{
                width: activeImage === index 
                  ? (typeof window !== 'undefined' && window.innerWidth < 768 ? "85vw" : "32rem") 
                  : (typeof window !== 'undefined' && window.innerWidth < 768 ? "4rem" : "5rem"),
                opacity: 1
              }}
              transition={{ duration: 0.4, ease: "circOut" }}
            >
              <AnimatePresence mode="wait">
                {activeImage === index && status === 'loaded' && (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
                    className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" 
                  >
                     <div className="absolute bottom-0 left-0 p-4 md:p-6">
                        <p className="text-xl md:text-2xl font-bold text-white tracking-widest font-mono">{image.code}</p>
                     </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="relative w-full h-full flex items-center justify-center">
                {status === 'error' && (
                    <div className="flex flex-col items-center text-gray-500">
                        <ImageOff size={24} />
                    </div>
                )}

                <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 768px) 85vw, 600px"
                    quality={60}
                    priority={index < 2} 
                    onLoad={() => handleImageLoad(index)}
                    onError={() => handleImageError(index)} // ✅ Now this works!
                    className={cn(
                        "object-cover transition-opacity duration-500",
                        status === 'loaded' ? "opacity-100" : "opacity-0"
                    )}
                />
              </div>
            </motion.div>
          )})}
        </div>
      </div>
    </div>
  );
}