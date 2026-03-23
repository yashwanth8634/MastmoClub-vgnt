import dbConnect from "@/lib/db";
import Event from "@/models/Event";
import EventCard from "@/components/ui/EventCard";
import type { Metadata } from "next";
import { unstable_cache } from "next/cache";

interface EventListItem {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  isPast: boolean;
}

const getCachedPublicEvents = unstable_cache(
  async (): Promise<{
    upcomingEvents: EventListItem[];
    pastEvents: EventListItem[];
  }> => {
    await dbConnect();

    const eventSelection = "title description date time location isTeamEvent";

    const [upcomingEvents, pastEvents] = await Promise.all([
      Event.find({ isLive: true })
        .select(eventSelection)
        .sort({ date: 1, time: 1 })
        .lean()
        .maxTimeMS(2500),
      Event.find({ isLive: false })
        .select(eventSelection)
        .sort({ date: -1, time: -1 })
        .lean()
        .limit(24)
        .maxTimeMS(2500),
    ]);

    const serializeEvents = (
      events: Array<{
        _id: { toString(): string };
        title: string;
        description: string;
        date: string;
        time: string;
        location: string;
        isTeamEvent: boolean;
      }>,
      isPast: boolean,
    ): EventListItem[] =>
      events.map((event) => ({
        id: event._id.toString(),
        title: event.title,
        description: event.description,
        date: event.date,
        time: event.time,
        location: event.location,
        category: event.isTeamEvent ? "Team Event" : "Solo Event",
        isPast,
      }));

    return {
      upcomingEvents: serializeEvents(upcomingEvents, false),
      pastEvents: serializeEvents(pastEvents, true),
    };
  },
  ["public-events-page"],
  { revalidate: 300, tags: ["events"] },
);

export const metadata: Metadata = {
  title: "Upcoming Events",
  description:
    "Explore workshops, hackathons, and quizzes organized by the Mathematical and Stastistical Modeling Club (MASTMO).",
  openGraph: {
    title: "MASTMO Events",
    description: "Don't miss out on our upcoming tech and math events!",
  },
};

export default async function EventsPage() {
  const { upcomingEvents, pastEvents } = await getCachedPublicEvents();

  return (
    <main className="min-h-screen pt-32 px-6 pb-20">
      {/* 1. UPCOMING SECTION (isLive: true) */}
      <section className="mb-24">
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-4 text-white">
          Upcoming <span className="text-math-cyan">Events</span>
        </h1>
        <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
          Join us for the latest workshops, competitions, and sessions.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center border border-white/10 rounded-3xl bg-black">
              <p className="text-2xl text-gray-300 font-bold mb-2">
                No active events.
              </p>
              <p className="text-gray-500">
                New events will appear here when they go live.
              </p>
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
            {pastEvents.map((event) => (
              <div
                key={event.id}
                className="opacity-60 hover:opacity-100 transition-opacity duration-300"
              >
                <EventCard event={event} />
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
