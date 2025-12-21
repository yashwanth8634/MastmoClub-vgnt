import dbConnect from "@/lib/db";
import Event from "@/models/Event";
import Navbar from "@/components/ui/Navbar";
import { Calendar, ImageOff } from "lucide-react";
import HoverExpandGallery from "@/components/ui/HoverExpandGallery";
import GallerySkeleton from "@/components/ui/GallerySkeleton";
import { Suspense } from "react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";


export const metadata: Metadata = {
  title: "Event Gallery",
  description: "Relive the moments! Explore our collection of photos from past hackathons, workshops, and club events.",
  openGraph: {
    title: "MASTMO Gallery - Our Memories",
    description: "Check out the highlights from the Mathematical & Statistical Modeling Club events.",
    images: ["/images/team-banner.png"], // Ensure you have a default image here
  },
};

export default async function GalleryPage() {
  await dbConnect();
  
  // Fetch events that actually have photos
  const events = await Event.find({ gallery: { $exists: true, $not: { $size: 0 } } })
                        .select('title category date gallery') 
                        .sort({ date: -1 })
                        .lean();

  return (
    <main className="min-h-screen bg-black text-white selection:bg-[#00f0ff]/30">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-32 pb-20">
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-4">
          Event <span className="text-[#00f0ff]">Gallery</span>
        </h1>
        <p className="text-center text-gray-400 mb-20 max-w-2xl mx-auto">
          Hover (or tap) the cards to explore memories from our past events.
        </p>

        <div className="space-y-24">
          {events.length > 0 ? (
            events.map((event: any) => (
              <section key={event._id} className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                
                {/* Header */}
                <div className="max-w-6xl mx-auto mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/40 pb-4">
                  <div>
                    <span className="inline-block px-3 py-1 mb-3 rounded-full bg-[#00f0ff]/10 text-[#00f0ff] text-xs font-bold uppercase tracking-widest">
                        {event.category || "Event"}
                    </span>
                    <h2 className="text-2xl md:text-4xl font-bold text-white">
                      {event.title}
                    </h2>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-400 font-mono text-sm">
                    <Calendar size={16} className="text-[#00f0ff]" />
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                </div>

                {/* Gallery Component - NO 'optimize-visibility' here! */}
                <div className="w-full">
                     <Suspense fallback={<GallerySkeleton />}>
                        <HoverExpandGallery photos={event.gallery} />
                     </Suspense>
                </div>

              </section>
            ))
          ) : (
            <div className="text-center py-32 bg-white/5 rounded-3xl border border-white/10">
              <p className="text-gray-300 text-lg">No photos uploaded yet.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}