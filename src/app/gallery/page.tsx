import dbConnect from "@/lib/db";
import Event from "@/models/Event";
import Navbar from "@/components/ui/Navbar";
import { Calendar, ImageOff } from "lucide-react";
import HoverExpandGallery from "@/components/ui/HoverExpandGallery";
import GallerySkeleton from "@/components/ui/GallerySkeleton"; // ✅ Import Skeleton
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  await dbConnect();
  
  // Use .select() to only fetch needed fields (Faster DB Query)
  const events = await Event.find({})
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
          Hover over the cards to explore the memories from our past events.
        </p>

        <div className="space-y-24">
          {events.length > 0 ? (
            events.map((event: any) => (
              <section key={event._id} className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                
                {/* Header */}
                <div className="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <span className="inline-block px-3 py-1 mb-3 rounded-full bg-[#00f0ff]/10 text-[#00f0ff] text-xs font-bold uppercase tracking-widest">
                        {event.category || "Event"}
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-white">
                      {event.title}
                    </h2>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-400 font-mono text-sm">
                    <Calendar size={16} className="text-[#00f0ff]" />
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                </div>

                {/* Gallery with Loading State */}
                <div className="flex justify-center w-full">
                   {event.gallery && event.gallery.length > 0 ? (
                     <Suspense fallback={<GallerySkeleton />}>
                        <HoverExpandGallery photos={event.gallery} />
                     </Suspense>
                   ) : (
                     <div className="w-full h-40 flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5 text-gray-500">
                        <div className="p-3 bg-black rounded-full mb-3 text-gray-600">
                            <ImageOff size={24} />
                        </div>
                        <p className="text-sm font-bold uppercase tracking-widest">No photos uploaded yet</p>
                     </div>
                   )}
                </div>

              </section>
            ))
          ) : (
            <div className="text-center py-32 bg-white/5 rounded-3xl border border-white/10">
              <p className="text-gray-500 text-lg">No events created yet.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}