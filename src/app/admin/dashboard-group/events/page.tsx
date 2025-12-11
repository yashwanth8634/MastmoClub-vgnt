import Link from "next/link";
import dbConnect from "@/lib/db";
import Event from "@/models/Event";
import { Plus, Pencil } from "lucide-react";
// ✅ Import the new Client Components
import DeleteEventButton from "@/components/admin/DeleteEventButton";
import ToggleEventButton from "@/components/admin/ToggleEventButton";

export default async function EventsManager() {
  await dbConnect();
  const events = await Event.find({}).sort({ createdAt: -1 }).lean();

  // Format dates for display
  const formattedEvents = events.map((event: any) => ({
    ...event,
    dateFormatted: event.date ? new Date(event.date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }) : 'N/A'
  }));

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Events</h1>
        <Link 
          href="/admin/dashboard-group/events/new" 
          className="bg-[#00f0ff] text-black px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-white transition-colors"
        >
          <Plus size={20} /> Add Event
        </Link>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 text-gray-400 text-sm uppercase tracking-widest">
              <th className="p-6 whitespace-nowrap">Event Name</th>
              <th className="p-6 whitespace-nowrap">Date</th>
              <th className="p-6 whitespace-nowrap">Status</th>
              <th className="p-6 whitespace-nowrap text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {formattedEvents.map((event: any) => (
              <tr key={event._id.toString()} className="hover:bg-white/5 transition-colors">
                <td className="p-6 font-bold text-white">
                  {event.title}
                  <div className="text-xs text-gray-500 font-mono mt-1 uppercase">{event.category}</div>
                </td>
                <td className="p-6 text-gray-300">{event.dateFormatted}</td>
                <td className="p-6">
                  {event.isPast ? (
                    <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 rounded-full text-xs font-bold border border-yellow-500/20">
                      Archived
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-bold border border-green-500/20">
                      Active
                    </span>
                  )}
                </td>
                <td className="p-6 flex justify-end gap-2">
                  
                  {/* 1. Edit Button (Link is fine) */}
                  <Link 
                    href={`/admin/dashboard-group/events/${event._id.toString()}/edit`} 
                    className="p-2 text-gray-400 hover:text-[#00f0ff] hover:bg-[#00f0ff]/10 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Pencil size={18} />
                  </Link>

                  {/* 2. Toggle Status (Client Component) */}
                  <ToggleEventButton id={event._id.toString()} isPast={event.isPast} />

                  {/* 3. Delete (Client Component) */}
                  <DeleteEventButton id={event._id.toString()} />

                </td>
              </tr>
            ))}
            
            {formattedEvents.length === 0 && (
              <tr>
                <td colSpan={4} className="p-12 text-center text-gray-500">
                  No events found. Click "Add Event" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}