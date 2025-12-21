import dbConnect from "@/lib/db";
import Event from "@/models/Event";
import EventCard from "@/components/ui/EventCard";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Upcoming Events",
  description: "Explore workshops, hackathons, and quizzes organized by the Maths & Stats Club.",
  openGraph: {
    title: "MASTMO Events",
    description: "Don't miss out on our upcoming tech and math events!",
  },
};



export default async function EventsPage() {
  await dbConnect();
  const events = await Event.find({}).sort({ date: 1 }).lean();
  
  const now = new Date(); // Current Real-Time

  // ✅ AUTOMATIC SORTING
  // An event is Upcoming if: Date is in future AND 'isPast' manual flag is false
  const upcomingEvents = events.filter((e: any) => {
    const eventDate = new Date(e.date);
    // Even if date is today, check if time has passed? 
    // Usually comparing just Date > Now is safer for "Upcoming"
    return eventDate >= now && !e.isPast;
  });

  // An event is Past if: Date is older than Now OR 'isPast' is manually true
  const pastEvents = events.filter((e: any) => {
    const eventDate = new Date(e.date);
    return eventDate < now || e.isPast;
  });

  return (
    <main className="min-h-screen pt-32 px-6">
      
      {/* 1. UPCOMING */}
      <section className="mb-20">
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-12 text-white">
          Upcoming <span className="text-[#00f0ff]">Events</span>
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event: any) => (
              <EventCard key={event._id.toString()} event={{ ...event, id: event._id.toString(), isPast: false }} />
            ))
          ) : (
             <p className="text-center text-gray-500 col-span-full">No upcoming events.</p>
          )}
        </div>
      </section>

      {/* 2. PAST (Only if exists) */}
      {pastEvents.length > 0 && (
        <section className="border-t border-white/40 pt-20 pb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-12 text-gray-400">Past Recaps</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto opacity-70 hover:opacity-100 transition-opacity">
            {pastEvents.map((event: any) => (
              <EventCard key={event._id.toString()} event={{ ...event, id: event._id.toString(), isPast: true }} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}