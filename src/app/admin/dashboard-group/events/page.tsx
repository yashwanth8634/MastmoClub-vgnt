import dbConnect from "@/lib/db";
import Event from "@/models/Event";
import Link from "next/link";
import { Plus, Pencil, Users } from "lucide-react";
import DeleteEventButton from "@/components/admin/Events/DeleteEventButton"; 
import { ToggleStatusButton, ToggleRegButton } from "@/components/admin/Events/EventActionButtons";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  await dbConnect();
  
  // 1. Fetch Raw Data
  const rawEvents = await Event.find({}).sort({ createdAt: -1 }).lean();

  // 2. STRICT SERIALIZATION (The Fix)
  // This converts all Date objects (createdAt, updatedAt) and ObjectIds to simple strings.
  // This prevents the "Objects are not valid as React child" crash permanently.
  const events = JSON.parse(JSON.stringify(rawEvents));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold">Manage Events</h1>
            <p className="text-gray-400 text-sm mt-1">Control event visibility and registrations.</p>
        </div>
        <Link 
          href="/admin/dashboard-group/events/new" 
          className="bg-[#00f0ff] text-black px-4 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-white transition-colors"
        >
          <Plus size={20} /> Create Event
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-24 bg-white/5 rounded-2xl border border-dashed border-white/10">
          <p className="text-gray-400 text-lg">No events found in the database.</p>
          <Link href="/admin/dashboard-group/events/new" className="text-[#00f0ff] hover:underline mt-2 inline-block">
            Create your first event
          </Link>
        </div>
      ) : (
        <div className="w-full overflow-x-auto border border-white/10 rounded-2xl bg-black">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-gray-400 border-b border-white/10 text-xs uppercase tracking-wider">
                <th className="p-5 font-medium">Event Title</th>
                <th className="p-5 font-medium">Date & Loc</th>
                <th className="p-5 font-medium">Registrations</th>
                <th className="p-5 font-medium">Live Status</th>
                <th className="p-5 font-medium text-right">Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {events.map((event: any) => {
                const eventId = event._id; // Now safely a string
                
                // Check capacity safely
                const isFull = event.maxRegistrations > 0 && event.currentRegistrations >= event.maxRegistrations;
                
                return (
                  <tr key={eventId} className="hover:bg-white/5 transition-colors group">
                    
                    {/* TITLE */}
                    <td className="p-5">
                      <div className="font-bold text-white text-lg">{event.title}</div>
                      <div className="flex gap-2 mt-1">
                        {event.isTeamEvent && (
                            <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded font-mono border border-purple-500/20">
                                TEAM: {event.minTeamSize}-{event.maxTeamSize}
                            </span>
                        )}
                      </div>
                    </td>

                    {/* DATE & LOCATION */}
                    <td className="p-5 text-gray-400 text-sm">
                      <div className="text-white font-medium">{event.date}</div>
                      <div className="text-xs opacity-70">{event.time}</div>
                      <div className="text-xs opacity-50 mt-1">{event.location}</div>
                    </td>

                    {/* REGISTRATIONS */}
                    <td className="p-5 text-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <Users size={16} className="text-[#00f0ff]" />
                        <span className={`font-mono text-lg ${isFull ? "text-red-400" : "text-white"}`}>
                          {event.currentRegistrations}
                        </span>
                        <span className="text-gray-600">/</span>
                        <span className="text-gray-500">{event.maxRegistrations > 0 ? event.maxRegistrations : "∞"}</span>
                      </div>
                      
                      <ToggleRegButton 
                        id={eventId} 
                        isOpen={event.registrationOpen} 
                        isFull={isFull} 
                      />
                    </td>

                    {/* LIVE STATUS */}
                    <td className="p-5">
                        <ToggleStatusButton id={eventId} isLive={event.isLive} />
                    </td>

                    {/* ACTIONS */}
                    <td className="p-5">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link 
                            href={`/admin/dashboard-group/events/${eventId}/edit`} 
                            className="p-2 bg-white/5 text-gray-300 rounded-lg hover:bg-[#00f0ff] hover:text-black transition-all border border-white/10"
                            title="Edit Event"
                        >
                            <Pencil size={18} />
                        </Link>
                        
                        <DeleteEventButton id={eventId} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}