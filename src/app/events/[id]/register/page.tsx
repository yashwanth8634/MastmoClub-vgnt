import Navbar from "@/components/ui/Navbar";
import EventRegisterForm from "@/components/features/EventRegisterForm";
import dbConnect from "@/lib/db";
import Event from "@/models/Event";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function EventRegistrationPage({ params }: { params: Promise<{ id: string }> }) {
  // Await the params
  const resolvedParams = await params;
  const eventId = resolvedParams.id;

  await dbConnect();

  // 1. Fetch the specific event details
  const event = await Event.findById(eventId).lean();

  // 2. If event doesn't exist, show 404
  if (!event) {
    return notFound();
  }

  // 3. Check if registration should be closed
  const now = new Date();
  const deadline = event.deadline ? new Date(event.deadline) : null;
  const eventDate = event.date ? new Date(event.date) : null;
  
  // Check if capacity is reached
  const isCapacityFull = event.maxRegistrations > 0 && event.currentRegistrations >= event.maxRegistrations;
  
  // Close registration if:
  // - Deadline has passed, OR
  // - Event date has passed, OR
  // - Registration is explicitly closed, OR
  // - Capacity is full
  const isRegistrationClosed = 
    (deadline && now > deadline) ||
    (eventDate && now > eventDate) ||
    event.isPast ||
    !event.registrationOpen ||
    isCapacityFull;

  if (isRegistrationClosed) {
    return (
      <main className="min-h-screen bg-black text-white font-sans pt-32 px-4 pb-20 flex items-center justify-center">
        <Navbar />
        <div className="text-center max-w-md mx-auto">
          <h1 className="text-4xl font-bold mb-4">Registration Closed</h1>
          <p className="text-gray-400 mb-8">
            {event.isPast 
              ? "This event has already taken place." 
              : isCapacityFull
              ? "This event has reached maximum capacity."
              : deadline && now > deadline
              ? "The registration deadline has passed."
              : "Registration for this event is currently closed."}
          </p>
          <Link 
            href="/events" 
            className="inline-block bg-white text-black px-8 py-3 rounded-lg font-bold hover:bg-[#00f0ff] transition-colors"
          >
            Back to Events
          </Link>
        </div>
      </main>
    );
  }

  // 4. Serialize data for Client Component
  const serializedEvent = {
    _id: event._id.toString(),
    title: event.title,
    isTeamEvent: event.isTeamEvent,
    minTeamSize: event.minTeamSize || 1,
    maxTeamSize: event.maxTeamSize || 1,
  };

  return (
    <main className="min-h-screen bg-black text-white font-sans pt-32 px-4 pb-20 selection:bg-[#00f0ff]/30">
      <Navbar />
      <div className="flex items-center justify-center">
        {/* Pass the specific event data to the form */}
        <EventRegisterForm event={serializedEvent} />
      </div>
    </main>
  );
}