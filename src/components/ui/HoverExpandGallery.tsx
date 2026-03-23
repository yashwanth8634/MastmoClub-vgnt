"use client";

import React, { useState, useEffect, useRef } from "react";

type GalleryPhotoInput =
  | string
  | {
      src?: string;
      imageUrl?: string;
    };

export default function HoverExpandGallery({
  photos,
}: {
  photos: GalleryPhotoInput[];
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // 1. Process Images
  const processedImages = Array.isArray(photos) ? photos.map((item, index) => ({
    id: index,
    src: typeof item === 'string' ? item : item.src || item.imageUrl || "",
    alt: `Photo ${index + 1}`
  })).filter(img => img.src) : [];

  // 2. Auto-Scroll Logic
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || processedImages.length === 0) return;

    let animationFrameId: number;
    const scrollSpeed = 2; // Adjust Speed: 0.5 is slow, 2 is fast

    const animateScroll = () => {
      if (!isPaused && container) {
        // Increment Scroll
        container.scrollLeft += scrollSpeed;

        // 🔄 Infinite Loop Check
        // If we have scrolled past the first set of images (half the total width), reset to 0
        // We use scrollWidth / 2 because we duplicated the list
        if (container.scrollLeft >= container.scrollWidth / 2) {
          container.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(animateScroll);
    };

    // Start Animation
    animationFrameId = requestAnimationFrame(animateScroll);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused, processedImages.length]);

  if (processedImages.length === 0) return null;

  const marqueeImages = [...processedImages, ...processedImages];

  return (
    <div className="w-full bg-black py-6 md:py-8 border-y border-white/10">
      
      {/* Scroll Container */}
      <div 
        ref={scrollRef}
        // Events to Pause/Resume
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => {
          // Add a small delay on mobile so momentum scrolling finishes before auto-scroll resumes
          setTimeout(() => setIsPaused(false), 2000);
        }}
        // CSS: Hide scrollbar but allow scrolling
        className="flex w-full overflow-x-auto no-scrollbar gap-3 md:gap-4 px-3 md:px-4 cursor-grab active:cursor-grabbing"
        style={{ scrollBehavior: isPaused ? 'smooth' : 'auto' }} // Smooth when user swipes, Auto when we animate
      >
        
        {/* Render Double List for Infinite Loop Effect */}
        {marqueeImages.map((image, idx) => {
          const isInitialSet = idx < processedImages.length;
          const shouldPrioritize = isInitialSet && idx < 2;

          return (
          <div 
            key={`${image.id}-${idx}`}
            // Responsive Height
            className="relative h-[250px] flex-shrink-0 rounded-xl overflow-hidden border border-white/20 bg-[#0a0a0a] select-none md:h-[400px]"
          >
            <img
              src={image.src}
              alt={image.alt}
              className="h-full w-auto object-contain pointer-events-none" // pointer-events-none prevents dragging the image file itself
              draggable={false}
              decoding="async"
              loading={shouldPrioritize ? "eager" : "lazy"}
              fetchPriority={shouldPrioritize ? "high" : "low"}
            />
          </div>
          );
        })}

      </div>
    </div>
  );
}
