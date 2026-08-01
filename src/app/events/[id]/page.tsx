import Link from "next/link";
import type { Metadata } from "next";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  ArrowLeft, 
  ShieldCheck, 
  Trophy, 
  Users, 
  AlertTriangle 
} from "lucide-react";
import dbConnect from "@/lib/db";
import Event from "@/models/Event";
import EventRegistration from "@/models/EventRegistration";
import { notFound } from "next/navigation";
import { formatEventTime } from "@/lib/utils";
import { cache } from "react";

export const revalidate = 300;

type Props = {
  params: Promise<{ id: string }>;
};

const getCachedEventById = cache(async (id: string) => {
  await dbConnect();

  return Event.findById(id)
    .select(
      "title description date time location rules isTeamEvent minTeamSize maxTeamSize maxRegistrations registrationRequired registrationOpen isLive",
    )
    .lean()
    .maxTimeMS(2500);
});

// ✅ SEO Metadata
export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const event = await getCachedEventById(id);

  if (!event) {
    return { title: "Event Not Found | MASTMO" };
  }

  return {
    title: `${event.title} | MASTMO Events`,
    description: `Join us for ${event.title}. ${event.description.substring(0, 150)}...`,
    openGraph: {
      title: event.title,
      description: "Register now for this event!",
    },
  };
}

export default async function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const event = await getCachedEventById(resolvedParams.id);
  if (!event) return notFound();

  // --- 🧠 LOGIC ENGINE (UPDATED) ---
  
  // 1. Capacity Check — count actual registrations from EventRegistration collection
  const currentRegs = await EventRegistration.countDocuments({ eventId: event._id });
  const isFull = event.maxRegistrations > 0 && currentRegs >= event.maxRegistrations;
  const noRegistrationRequired =
    event.registrationRequired === false ||
    (!event.registrationOpen && event.maxRegistrations === 0 && currentRegs === 0);
  const registrationRequired = !noRegistrationRequired;

  // 2. Status Check
  const isRegOpen = registrationRequired && event.registrationOpen; 

  // 3. Visual "Event Ended" Badge
  const isEventEnded = !event.isLive;

  // 4. Date Formatting (Fix for Object Date Error)
  // We try to create a date object. If it fails (invalid string), we fallback to the raw string.
  const eventDateObj = new Date(event.date);
  const isValidDate = !isNaN(eventDateObj.getTime());

  const formattedDate = isValidDate 
    ? eventDateObj.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }) 
    : String(event.date); // 👈 Force conversion to string if it's raw text

  return (
    <main className="min-h-screen bg-black text-white selection:bg-[#00f0ff]/30 font-sans">
      <div className="max-w-6xl mx-auto px-6 pt-32 pb-20">
        
        {/* Back Button */}
        <Link href="/events" className="inline-flex items-center gap-2 text-gray-400 hover:text-[#00f0ff] mb-8 transition-colors">
          <ArrowLeft size={20} /> Back to Events
        </Link>

        {/* --- HEADER SECTION --- */}
        <div className="mb-12 border-b border-white/10 pb-12">
          {/* Badges */}
          <div className="flex flex-wrap gap-3 mb-6">
            {event.isTeamEvent && (
              <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold uppercase tracking-widest border border-purple-500/20">
                Team Event
              </span>
            )}
            
            {isEventEnded && <span className="px-3 py-1 rounded-full bg-gray-800 text-gray-400 text-xs font-bold uppercase border border-gray-700">Event Ended</span>}

            {!isEventEnded && !registrationRequired && (
              <span className="px-3 py-1 rounded-full bg-blue-900/30 text-blue-300 text-xs font-bold uppercase border border-blue-500/30">
                No Registration Required
              </span>
            )}
            
            {!isEventEnded && isFull && <span className="px-3 py-1 rounded-full bg-red-900/30 text-red-400 text-xs font-bold uppercase border border-red-500/30">Sold Out</span>}
            
            {!isEventEnded && registrationRequired && !isFull && !isRegOpen && <span className="px-3 py-1 rounded-full bg-yellow-900/30 text-yellow-400 text-xs font-bold uppercase border border-yellow-500/30">Reg Closed</span>}
            
            {!isEventEnded && registrationRequired && !isFull && isRegOpen && <span className="px-3 py-1 rounded-full bg-green-900/30 text-green-400 text-xs font-bold uppercase border border-green-500/30">Open</span>}
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-white">{event.title}</h1>
          
          {/* Quick Info Bar */}
          <div className="flex flex-wrap gap-6 text-gray-300 text-sm md:text-base font-medium">
            <div className="flex items-center gap-2">
              <Calendar className="text-[#00f0ff]" size={20} />
              {/* ✅ FIX: Use formattedDate string instead of raw object */}
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="text-[#00f0ff]" size={20} />
              <span>{formatEventTime(event.time)}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="text-[#00f0ff]" size={20} />
              <span>{event.location || 'TBA'}</span>
            </div>
          </div>
        </div>

        {/* --- TWO COLUMN LAYOUT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* LEFT: Description & Rules */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Description */}
            <div className="prose prose-invert max-w-none">
              <h3 className="text-2xl font-bold text-white mb-4">About Event</h3>
              <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">{event.description}</p>
            </div>

            {/* Event Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#050505] border border-white/10 p-5 rounded-2xl flex items-center gap-4">
                <div className="p-3 bg-black rounded-xl text-[#00f0ff] border border-white/5"><Users size={24} /></div>
                <div>
                  <div className="text-xs text-gray-400 uppercase font-bold">Participation</div>
                  <div className="text-white font-bold">{event.isTeamEvent ? 'Team Based' : 'Individual'}</div>
                </div>
              </div>
              {event.isTeamEvent && (
                <div className="bg-[#050505] border border-white/10 p-5 rounded-2xl flex items-center gap-4">
                  <div className="p-3 bg-black rounded-xl text-purple-400 border border-white/5"><Trophy size={24} /></div>
                  <div>
                    <div className="text-xs text-gray-400 uppercase font-bold">Team Size</div>
                    <div className="text-white font-bold">{event.minTeamSize} - {event.maxTeamSize} Members</div>
                  </div>
                </div>
              )}
            </div>

            {/* Rules Section */}
            <div>
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <ShieldCheck className="text-[#00f0ff]" /> Rules & Guidelines
              </h3>
              <ul className="space-y-4">
                {event.rules && event.rules.length > 0 ? (
                  event.rules.map((rule: string, i: number) => (
                    <li key={i} className="flex gap-4 text-gray-300 bg-[#050505] p-4 rounded-xl border border-white/10 hover:border-white/20 transition-colors">
                      <span className="text-[#00f0ff] font-mono font-bold">0{i + 1}.</span>
                      {rule}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500 italic">No specific rules provided.</li>
                )}
              </ul>
            </div>
          </div>

          {/* RIGHT: Registration Card (Sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 p-8 rounded-3xl bg-[#050505] border border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.5)] z-10">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                {isEventEnded
                  ? "Event Status"
                  : registrationRequired
                    ? "Registration Details"
                    : "Event Access"}
              </h3>
              
              <div className="space-y-6 mb-8">
                {/* Spots Left */}
                {isEventEnded ? (
                  <div className="flex justify-between items-center pb-4 border-b border-white/10">
                    <span className="text-gray-400 text-sm flex items-center gap-2">
                      <AlertTriangle size={16} /> Current Status
                    </span>
                    <span className="text-gray-300 font-bold text-sm">Event Ended</span>
                  </div>
                ) : !registrationRequired ? (
                  <div className="space-y-4 border-b border-white/10 pb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm flex items-center gap-2">
                        <Users size={16} /> Entry
                      </span>
                      <span className="text-blue-300 font-bold text-sm">No prior registration</span>
                    </div>
                    <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4 text-sm text-blue-200">
                      This event does not require registration. You can attend directly at the venue.
                    </div>
                  </div>
                ) : event.maxRegistrations > 0 ? (
                  <div className="space-y-2 pb-4 border-b border-white/10">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm flex items-center gap-2">
                        <Users size={16} /> {event.isTeamEvent ? "Teams Registered" : "Spots Filled"}
                      </span>
                      <span className={`font-mono text-sm font-bold ${isFull ? "text-red-400" : "text-[#00f0ff]"}`}>
                        {currentRegs} / {event.maxRegistrations}
                      </span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${isFull ? "bg-red-500" : "bg-[#00f0ff]"}`} 
                        style={{ width: `${Math.min((currentRegs / event.maxRegistrations) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center pb-4 border-b border-white/10">
                    <span className="text-gray-400 text-sm flex items-center gap-2">
                      <Users size={16} /> Capacity
                    </span>
                    <span className="text-[#00f0ff] font-bold text-sm">
                      Unlimited {event.isTeamEvent ? "Teams" : "Participants"}
                    </span>
                  </div>
                )}
              </div>

              {/* --- ACTION BUTTON LOGIC --- */}
              {isEventEnded ? (
                <button disabled className="w-full py-4 bg-gray-800/70 text-gray-300 border border-gray-700 font-bold rounded-xl cursor-not-allowed flex items-center justify-center gap-2">
                  <AlertTriangle size={18} /> Event Ended
                </button>
              ) : !registrationRequired ? (
                <div className="space-y-3">
                  <div className="w-full py-4 bg-blue-900/20 text-blue-300 border border-blue-900/50 font-bold rounded-xl text-center">
                    No Registration Required
                  </div>
                  <p className="text-center text-xs text-gray-500">
                    Walk in at the scheduled time and venue.
                  </p>
                </div>
              ) : isFull ? (
                <button disabled className="w-full py-4 bg-red-900/20 text-red-400 border border-red-900/50 font-bold rounded-xl cursor-not-allowed flex items-center justify-center gap-2">
                  <AlertTriangle size={18} /> Sold Out
                </button>
              ) : !isRegOpen ? (
                <button disabled className="w-full py-4 bg-yellow-900/20 text-yellow-400 border border-yellow-900/50 font-bold rounded-xl cursor-not-allowed flex items-center justify-center gap-2">
                   Registration Closed
                </button>
              ) : (
                <Link 
                  href={`/events/${event._id}/register`}
                  className="block w-full py-4 bg-[#00f0ff] text-black text-center font-bold uppercase tracking-widest rounded-xl hover:bg-white transition-all hover:scale-[1.02] shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_30px_rgba(0,240,255,0.5)]"
                >
                  Register Now
                </Link>
              )}
              
              {registrationRequired && !isFull && isRegOpen && (
                <p className="text-center text-xs text-gray-500 mt-4">
                  *Limited seats available on first come basis.
                </p>
              )}

              {isEventEnded && (
                <p className="text-center text-xs text-gray-500 mt-4">
                  This event has already concluded. Check the events page for upcoming sessions.
                </p>
              )}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
