import dbConnect from "@/lib/db";
import Event from "@/models/Event";
import EventCard from "@/components/ui/EventCard";

export const dynamic = "force-dynamic"; // Ensures new events show up immediately

export default async function EventsPage() {
  await dbConnect();
  // Fetch raw data from DB
  const events = await Event.find({}).sort({ date: 1 }).lean();

  return (
    <main className="min-h-screen pt-32 px-6 bg-black">
      <h1 className="text-4xl md:text-6xl font-bold text-center mb-12">Upcoming Events</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto pb-20">
        {events.length > 0 ? (
          events.map((event: any) => (
            <EventCard 
              key={event._id.toString()} 
              event={{
                id: event._id.toString(),
                title: event.title,
                date: event.date?.toString(), // Safely convert date to string
                time: event.time,
                location: event.location,
                category: event.category,
                description: event.description,
                isPast: event.isPast
              }} 
            />
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">No upcoming events found.</p>
        )}
      </div>
    </main>
  );
}