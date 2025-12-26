import dbConnect from "@/lib/db";
import Event from "@/models/Event";
import EventCard from "@/components/ui/EventCard";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Upcoming Events",
  description: "Explore workshops, hackathons, and quizzes organized by the Mathematical and Stastistical Modeling Club (MASTMO).",
  openGraph: {
    title: "MASTMO Events",
    description: "Don't miss out on our upcoming tech and math events!",
  },
};

export default async function EventsPage() {
  await dbConnect();
  
  // 1. Fetch ALL events (Removed 'isLive: true' filter)
  // Sorted by creation date as requested (Newest created first)
  const events = await Event.find({})
    .sort({ createdAt: -1 }) 
    .lean();
  
  // 2. Logic Mapping based on your request:
  // "Live/Active"  -> Upcoming
  // "Hidden/Dead"  -> Past
  const upcomingEvents = events.filter((e: any) => e.isLive === true);
  const pastEvents = events.filter((e: any) => e.isLive === false);

  return (
    <main className="min-h-screen pt-32 px-6 pb-20">
      
      {/* 1. UPCOMING SECTION (isLive: true) */}
      <section className="mb-24">
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-4 text-white">
          Upcoming <span className="text-[#00f0ff]">Events</span>
        </h1>
        <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
          Join us for the latest workshops, competitions, and sessions.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event: any) => (
              <EventCard 
                key={event._id.toString()} 
                event={{ ...event, id: event._id.toString(), isPast: false }} 
              />
            ))
          ) : (
             <div className="col-span-full py-20 text-center border border-white/10 rounded-3xl bg-white/5">
                <p className="text-2xl text-gray-300 font-bold mb-2">No active events.</p>
                <p className="text-gray-500">New events will appear here when they go live.</p>
             </div>
          )}
        </div>
      </section>

      {/* 2. PAST SECTION (isLive: false) */}
      {pastEvents.length > 0 && (
        <section className="border-t border-white/10 pt-24">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-12 text-gray-500 uppercase tracking-widest">
            Past Recaps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {pastEvents.map((event: any) => (
              <div key={event._id.toString()} className="opacity-60 hover:opacity-100 transition-opacity duration-300">
                <EventCard 
                    event={{ ...event, id: event._id.toString(), isPast: true }} 
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}