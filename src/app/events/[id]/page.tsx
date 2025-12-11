import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import EventGallery from "@/components/ui/EventGallery"; 
import { Calendar, Clock, MapPin, ArrowLeft, ShieldCheck, Trophy, Users, Camera } from "lucide-react";
import dbConnect from "@/lib/db";
import Event from "@/models/Event";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  await dbConnect();
  
  // Fetch event just for the title/desc (MongoDB caches this so it's fast)
  const event = await Event.findById(resolvedParams.id).select('title description').lean();

  if (!event) {
    return { title: "Event Not Found" };
  }

  return {
    title: `${event.title} | MASTMO Club`,
    description: event.description?.substring(0, 150) + "...", // Trim description for preview
    openGraph: {
      title: event.title,
      description: "Register now for this event at VGNT!",
      type: "website",
    },
  };
}

export default async function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  // Await the params
  const resolvedParams = await params;
  const eventId = resolvedParams.id;

  await dbConnect();

  // Fetch event from database
  const event = await Event.findById(eventId).lean();

  if (!event) {
    return notFound();
  }

  // Format the date
  const formattedDate = event.date ? new Date(event.date).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }) : 'TBA';

  // Check if registration should be closed based on deadline or capacity
  const now = new Date();
  const deadline = event.deadline ? new Date(event.deadline) : null;
  const eventDate = event.date ? new Date(event.date) : null;
  
  // Event is past if the event date has passed
  const isPastEvent = eventDate ? now > eventDate : event.isPast;
  
  // Check if capacity is reached
  const isCapacityFull = event.maxRegistrations > 0 && event.currentRegistrations >= event.maxRegistrations;
  
  // Registration is closed if deadline passed or event is past or explicitly closed or capacity full
  const isRegistrationClosed = 
    (deadline && now > deadline) ||
    isPastEvent ||
    !event.registrationOpen ||
    isCapacityFull;

  return (
    <main className="relative min-h-screen bg-transparent font-sans text-white selection:bg-[#00f0ff]/30">
      
      <Navbar />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-20">
        
        {/* Back Button */}
        <Link 
          href="/events" 
          className="inline-flex items-center gap-2 text-gray-400 hover:text-[#00f0ff] mb-8 transition-colors"
        >
          <ArrowLeft size={20} /> Back to Events
        </Link>

        {/* Header Section */}
        <div className="mb-12 border-b border-white/10 pb-12">
          <div className="flex items-center gap-4 mb-6">
            <span className="inline-block px-3 py-1 rounded-full bg-[#00f0ff]/10 text-[#00f0ff] text-xs font-bold tracking-widest uppercase">
              {event.category || 'Event'}
            </span>
            {isPastEvent && (
              <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-gray-400 text-xs font-bold tracking-widest uppercase">
                Past Event
              </span>
            )}
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">{event.title}</h1>
          <p className="text-xl text-gray-300 max-w-3xl leading-relaxed">{event.description}</p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left: Details */}
          <div className="lg:col-span-2 space-y-10">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-black p-6 rounded-2xl border border-white/10 flex items-start gap-4">
                <Trophy className="text-[#00f0ff] shrink-0" />
                <div>
                  <h3 className="font-bold text-gray-200 mb-1">Team Size</h3>
                  <p className="text-sm text-gray-400">{event.maxTeamSize || 'Individual'}</p>
                </div>
              </div>
              <div className="bg-black p-6 rounded-2xl border border-white/10 flex items-start gap-4">
                <Users className="text-[#00f0ff] shrink-0" />
                <div>
                  <h3 className="font-bold text-gray-200 mb-1">Registration</h3>
                  <p className="text-sm text-gray-400">{event.registrationOpen ? 'Open' : 'Closed'}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <ShieldCheck className="text-[#00f0ff]" /> Rules & Guidelines
              </h3>
              <ul className="space-y-4">
                {event.rules && event.rules.length > 0 ? (
                  event.rules.map((rule: string, i: number) => (
                    <li key={i} className="flex gap-4 text-gray-300 bg-black p-4 rounded-xl border border-white/5">
                      <span className="text-[#00f0ff] font-mono">0{i + 1}.</span>
                      {rule}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-400">No specific rules provided.</li>
                )}
              </ul>
            </div>
          </div>

          {/* Right: Registration Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 p-8 rounded-3xl bg-black border border-white/10 backdrop-blur-xl">
              <h3 className="text-xl font-bold mb-6">Event Details</h3>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-center gap-3 text-gray-300">
                  <Calendar className="text-[#00f0ff]" size={20} />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Clock className="text-[#00f0ff]" size={20} />
                  <span>{event.time || 'TBA'}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <MapPin className="text-[#00f0ff]" size={20} />
                  <span>{event.location || 'TBA'}</span>
                </div>
                {event.maxRegistrations > 0 && (
                  <div className="flex items-center gap-3 text-gray-300">
                    <Users className="text-[#00f0ff]" size={20} />
                    <span>{event.currentRegistrations}/{event.maxRegistrations} registered</span>
                  </div>
                )}
              </div>

              {/* Registration Button */}
              {isPastEvent ? (
                <button 
                  disabled 
                  className="block w-full py-4 bg-gray-800 text-gray-400 text-center font-bold uppercase tracking-widest rounded-xl cursor-not-allowed"
                >
                  Event Ended
                </button>
              ) : isCapacityFull ? (
                <button 
                  disabled 
                  className="block w-full py-4 bg-gray-800 text-gray-400 text-center font-bold uppercase tracking-widest rounded-xl cursor-not-allowed"
                >
                  Registration Full
                </button>
              ) : isRegistrationClosed ? (
                <button 
                  disabled 
                  className="block w-full py-4 bg-gray-800 text-gray-400 text-center font-bold uppercase tracking-widest rounded-xl cursor-not-allowed"
                >
                  Registration Closed
                </button>
              ) : (
                <Link 
                  href={`/events/${eventId}/register`}
                  className="block w-full py-4 bg-[#00f0ff] text-black text-center font-bold uppercase tracking-widest rounded-xl hover:bg-white transition-all hover:scale-[1.02]"
                >
                  Register Now
                </Link>
              )}
              
              {!isPastEvent && !isRegistrationClosed && (
                <p className="text-center text-xs text-gray-500 mt-4">
                  Limited seats available.
                </p>
              )}
              {deadline && !isPastEvent && (
                <p className="text-center text-xs text-yellow-500 mt-4">
                  Deadline: {new Date(deadline).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              )}
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}