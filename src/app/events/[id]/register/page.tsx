import Navbar from "@/components/ui/Navbar";
import EventRegisterForm from "@/components/features/events/EventRegisterForm"; // 👈 Ensure this path is correct
import dbConnect from "@/lib/db";
import Event from "@/models/Event";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const resolvedParams = await params;
  await dbConnect();
  const event = await Event.findById(resolvedParams.id).select("title").lean();

  if (!event) {
    return { title: "Event Not Found" };
  }

  return {
    title: `Register for ${event.title} `,
    description: `Secure your spot for ${event.title}.`,
  };
}

export default async function EventRegistrationPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const eventId = resolvedParams.id;

  await dbConnect();

  // 1. Fetch Event with .lean()
  const event = await Event.findById(eventId).lean();

  if (!event) {
    return notFound();
  }

  // 2. Logic: Status Check
  const currentRegs = event.currentRegistrations || 0;
  const isCapacityFull = event.maxRegistrations > 0 && currentRegs >= event.maxRegistrations;
  const noRegistrationRequired =
    event.registrationRequired === false ||
    (!event.registrationOpen && event.maxRegistrations === 0 && currentRegs === 0);
  const registrationRequired = !noRegistrationRequired;
  const isEventEnded = !event.isLive;
  const isRegistrationClosed = isEventEnded || !registrationRequired || !event.registrationOpen || isCapacityFull;

  if (isRegistrationClosed) {
    return (
      <main className="min-h-screen bg-black text-white font-sans flex flex-col items-center justify-center p-4">
        <Navbar />
        <div className="text-center max-w-md mx-auto p-10 border border-white/10 rounded-3xl bg-white/5 backdrop-blur-md">
          <h1 className="text-3xl font-bold mb-4 text-red-500">
            {isEventEnded ? "Event Ended" : registrationRequired ? "Registration Closed" : "No Registration Needed"}
          </h1>
          <p className="text-gray-400 mb-8">
            {isEventEnded
              ? "This event has already concluded, so registration is no longer available."
              : !registrationRequired
              ? "This event does not require registration. You can check the event details page for attendance instructions."
              : isCapacityFull
              ? "This event has reached its maximum capacity."
              : "Registration is currently disabled."}
          </p>
          <Link href="/events" className="px-8 py-3 bg-[#00f0ff] text-black font-bold rounded-xl hover:bg-white transition-all">
            Back to Events
          </Link>
        </div>
      </main>
    );
  }

  // 3. ✅ SERIALIZE DATA (Prevents "Undefined" Crash)
  const serializedEvent = {
    _id: event._id.toString(),
    title: event.title || "Untitled Event",
    isTeamEvent: !!event.isTeamEvent,
    minTeamSize: event.minTeamSize || 1,
    maxTeamSize: event.maxTeamSize || 1,
  };

  return (
    <main className="min-h-screen bg-black text-white font-sans selection:bg-[#00f0ff]/30">
      <Navbar />
      
      {/* Centering Container */}
      <div className="min-h-screen flex items-center justify-center pt-24 pb-10 px-4">
        <EventRegisterForm event={serializedEvent} />
      </div>
    </main>
  );
}
