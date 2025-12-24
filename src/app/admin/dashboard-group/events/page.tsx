import dbConnect from "@/lib/db";
import Event from "@/models/Event";
import Link from "next/link";
import { Plus, Pencil, Users } from "lucide-react";
import DeleteButton from "@/components/admin/DeleteEventButton"; 
import ArchiveButton from "@/components/admin/ArchiveButton";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  await dbConnect();
  // Fetch events sorted by date (newest first)
  const events = await Event.find({}).sort({ date: -1 }).lean();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage Events</h1>
        <Link 
          href="/admin/dashboard-group/events/new" 
          className="bg-[#00f0ff] text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-white transition-colors"
        >
          <Plus size={20} /> Create New
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-20 bg-white/5 rounded-xl border border-white/10">
          <p className="text-gray-400 text-lg">No events found.</p>
          <p className="text-gray-600 text-sm mt-1">Click "Create New" to get started.</p>
        </div>
      ) : (
        <div className="w-full overflow-x-auto border border-white/10 rounded-xl bg-white/5">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/50 text-gray-400 border-b border-white/10 text-sm uppercase">
                <th className="p-4">Title</th>
                <th className="p-4">Date</th>
                <th className="p-4">Registrations</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event: any) => {
                // Check if full
                const isFull = event.maxRegistrations > 0 && event.currentRegistrations >= event.maxRegistrations;
                
                return (
                  <tr key={event._id.toString()} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    
                    {/* TITLE */}
                    <td className="p-4 font-medium text-white">
                      {event.title}
                      {event.isTeamEvent && <span className="ml-2 text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded">TEAM</span>}
                    </td>

                    {/* DATE */}
                    <td className="p-4 text-gray-400 text-sm">
                      {event.date ? new Date(event.date).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      }) : 'TBA'}
                    </td>

                    {/* REGISTRATIONS (New Column) */}
                    <td className="p-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Users size={14} className="text-gray-500" />
                        <span className={isFull ? "text-red-400 font-bold" : "text-white"}>
                          {event.currentRegistrations || 0}
                        </span>
                        <span className="text-gray-600">/ {event.maxRegistrations > 0 ? event.maxRegistrations : "∞"}</span>
                        {isFull && <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded ml-1">FULL</span>}
                      </div>
                    </td>

                    {/* STATUS */}
                    <td className="p-4 text-sm">
                        {event.isPast ? (
                            <span className="inline-flex items-center px-2 py-1 rounded bg-gray-500/10 text-gray-500 text-xs font-medium">
                                Closed
                            </span>
                        ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded bg-green-500/10 text-green-400 text-xs font-medium border border-green-500/20">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
                                Active
                            </span>
                        )}
                    </td>

                    {/* ACTIONS */}
                    <td className="p-4 flex justify-end gap-2">
                      {/* Archive Button (Toggle Active/Past) */}
                      <ArchiveButton id={event._id.toString()} isPast={event.isPast} />
                      
                      {/* Edit Button */}
                      <Link href={`/admin/dashboard-group/events/${event._id}/edit`} className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition-all">
                        <Pencil size={18} />
                      </Link>
                      
                      {/* Delete Button */}
                      <DeleteButton id={event._id.toString()} />
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