import Navbar from "@/components/ui/Navbar";
import StarField from "@/components/3d/StarField";
import EventCard from "@/components/ui/EventCard";
import dbConnect from "@/lib/db";
import Event from "@/models/Event";

// Force dynamic update so users see new events instantly
export const dynamic = "force-dynamic";

export default async function EventsPage() {
  await dbConnect();

  // 1. FETCH ALL EVENTS
  // Sort by date descending (newest first)
  const allEvents = await Event.find({}).sort({ date: -1 }).lean();

  // 2. SEPARATE UPCOMING & PAST
  const upcomingEvents = allEvents.filter(e => !e.isPast);
  const pastEvents = allEvents.filter(e => e.isPast);

  // Helper to serialize Mongo ID and convert Date to string
  const serialize = (events: any[]) => events.map(e => ({
    ...e,
    id: e._id.toString(),
    _id: e._id.toString(),
    date: e.date ? new Date(e.date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }) : 'TBA',
    time: e.time || 'TBA',
    location: e.location || 'TBA',
    description: e.description || 'Event details coming soon',
    category: e.category || 'Event'
  }));

  return (
    <main className="relative min-h-screen bg-transparent font-sans selection:bg-[#00f0ff]/30">
      
      {/* Background & Nav */}
      <StarField />
      <Navbar />

      {/* SECTION 1: UPCOMING EVENTS */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-10">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tighter">
            Upcoming <span className="text-[#00f0ff]">Events</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Participate, compete, and learn. Check out what is happening at MASTMO.
          </p>
        </div>

        {upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {serialize(upcomingEvents).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-black rounded-2xl border border-white/10">
            <p className="text-xl text-gray-400">No upcoming events scheduled.</p>
            <p className="text-sm text-gray-600 mt-2">Stay tuned for updates!</p>
          </div>
        )}
      </div>

      {/* SECTION 2: PAST EVENTS */}
      {pastEvents.length > 0 && (
        <div className="relative z-10 w-full border-t border-white/10 py-20">
          <div className="max-w-7xl mx-auto px-6">
            
            <div className="mb-12 flex items-end gap-4">
              <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight drop-shadow-md">
                Past Archive
              </h2>
              <div className="h-px flex-1 bg-white/20 mb-4"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {serialize(pastEvents).map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>

          </div>
        </div>
      )}

    </main>
  );
}