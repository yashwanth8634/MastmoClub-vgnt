import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  ArrowLeft, 
  ShieldCheck, 
  Trophy, 
  Users, 
  AlertTriangle, 
  Timer 
} from "lucide-react";
import dbConnect from "@/lib/db";
import Event from "@/models/Event";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  await dbConnect();

  const event = await Event.findById(resolvedParams.id).lean();
  if (!event) return notFound();

  // --- 🧠 LOGIC ENGINE (CLIENT SIDE CHECKS) ---
  const now = new Date();
  const eventDate = new Date(event.date);
  const deadline = event.deadline ? new Date(event.deadline) : null;
  
  // 1. Logic Checks
  const isEventOver = now > eventDate;
  const isDeadlinePassed = deadline ? now > deadline : false;
  const isFull = event.maxRegistrations > 0 && event.currentRegistrations >= event.maxRegistrations;
  const isRegistrationClosed = isEventOver || isDeadlinePassed || isFull || !event.registrationOpen;

  // 2. Format Dates (✅ FORCED TO IST)
  const formattedDate = eventDate.toLocaleDateString('en-US', { 
    timeZone: 'Asia/Kolkata', // 👈 Forces Indian Standard Time
    weekday: 'long', 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });

  const formattedDeadline = deadline 
    ? deadline.toLocaleString('en-US', { 
        timeZone: 'Asia/Kolkata', // 👈 Forces Indian Standard Time
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute:'2-digit' 
      }) 
    : "No Deadline";

  return (
    <main className="min-h-screen bg-black text-white selection:bg-[#00f0ff]/30 font-sans">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 pt-32 pb-20">
        
        {/* Back Button */}
        <Link href="/events" className="inline-flex items-center gap-2 text-gray-400 hover:text-[#00f0ff] mb-8 transition-colors">
          <ArrowLeft size={20} /> Back to Events
        </Link>

        {/* --- HEADER SECTION --- */}
        <div className="mb-12 border-b border-white/10 pb-12">
          {/* Badges */}
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="px-3 py-1 rounded-full bg-[#00f0ff]/10 text-[#00f0ff] text-xs font-bold uppercase tracking-widest">
              {event.category || 'Event'}
            </span>
            {event.isTeamEvent && (
              <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold uppercase tracking-widest border border-purple-500/20">
                Team Event
              </span>
            )}
            {isEventOver && <span className="px-3 py-1 rounded-full bg-gray-800 text-gray-400 text-xs font-bold uppercase border border-gray-700">Event Ended</span>}
            {isFull && !isEventOver && <span className="px-3 py-1 rounded-full bg-red-900/30 text-red-400 text-xs font-bold uppercase border border-red-500/30">Sold Out</span>}
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">{event.title}</h1>
          
          {/* Quick Info Bar */}
          <div className="flex flex-wrap gap-6 text-gray-300 text-sm md:text-base font-medium">
            <div className="flex items-center gap-2">
              <Calendar className="text-[#00f0ff]" size={20} />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="text-[#00f0ff]" size={20} />
              <span>{event.time || 'TBA'}</span>
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

            {/* Event Stats Grid (✅ Updated to Solid Black) */}
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
                  <li className="text-gray-500 italic">No specific rules provided for this event.</li>
                )}
              </ul>
            </div>
          </div>

          {/* RIGHT: Registration Card (Sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 p-8 rounded-3xl bg-[#050505] border border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.5)] z-10">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                Registration Details
              </h3>
              
              <div className="space-y-6 mb-8">
                {/* Deadline */}
                <div className="flex justify-between items-center pb-4 border-b border-white/10">
                  <span className="text-gray-400 text-sm flex items-center gap-2">
                    <Timer size={16} /> Deadline
                  </span>
                  <span className={`font-mono text-sm font-bold ${isDeadlinePassed ? "text-red-400" : "text-yellow-400"}`}>
                    {formattedDeadline}
                  </span>
                </div>

                {/* Spots Left */}
                {event.maxRegistrations > 0 && (
                  <div className="space-y-2 pb-4 border-b border-white/10">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm flex items-center gap-2">
                        <Users size={16} /> Spots Filled
                      </span>
                      <span className={`font-mono text-sm font-bold ${isFull ? "text-red-400" : "text-[#00f0ff]"}`}>
                        {event.currentRegistrations} / {event.maxRegistrations}
                      </span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${isFull ? "bg-red-500" : "bg-[#00f0ff]"}`} 
                        style={{ width: `${Math.min((event.currentRegistrations / event.maxRegistrations) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* DYNAMIC ACTION BUTTON */}
              {isEventOver ? (
                <button disabled className="w-full py-4 bg-gray-800 text-gray-500 font-bold rounded-xl cursor-not-allowed border border-white/5">
                  Event Ended
                </button>
              ) : isFull ? (
                <button disabled className="w-full py-4 bg-red-900/20 text-red-400 border border-red-900/50 font-bold rounded-xl cursor-not-allowed flex items-center justify-center gap-2">
                  <AlertTriangle size={18} /> Sold Out
                </button>
              ) : isDeadlinePassed ? (
                <button disabled className="w-full py-4 bg-yellow-900/20 text-yellow-400 border border-yellow-900/50 font-bold rounded-xl cursor-not-allowed flex items-center justify-center gap-2">
                  <Clock size={18} /> Deadline Passed
                </button>
              ) : (
                <Link 
                  href={`/events/${event._id}/register`}
                  className="block w-full py-4 bg-[#00f0ff] text-black text-center font-bold uppercase tracking-widest rounded-xl hover:bg-white transition-all hover:scale-[1.02] shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_30px_rgba(0,240,255,0.5)]"
                >
                  Register Now
                </Link>
              )}
              
              {!isEventOver && !isRegistrationClosed && (
                <p className="text-center text-xs text-gray-500 mt-4">
                  *Limited seats available on first come basis.
                </p>
              )}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}