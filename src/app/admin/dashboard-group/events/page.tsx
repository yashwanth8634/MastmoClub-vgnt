import dbConnect from "@/lib/db";
import Event from "@/models/Event";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import DeleteButton from "@/components/admin/DeleteEventButton"; 

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  await dbConnect();
  const events = await Event.find({}).sort({ date: -1 }).lean();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage Events</h1>
        <Link href="/admin/dashboard-group/events/create" className="bg-[#00f0ff] text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-white transition-colors">
          <Plus size={20} /> Create New
        </Link>
      </div>

      <div className="w-full overflow-x-auto border border-white/10 rounded-xl bg-white/5">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black/50 text-gray-400 border-b border-white/10">
              <th className="p-4">Title</th>
              <th className="p-4">Date</th>
              <th className="p-4">Location</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event: any) => (
              <tr key={event._id.toString()} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-4 font-medium text-white">{event.title}</td>
                <td className="p-4 text-gray-400">{event.date ? new Date(event.date).toLocaleDateString() : 'TBA'}</td>
                <td className="p-4 text-gray-400">{event.location}</td>
                <td className="p-4 flex justify-end gap-2">
                  <Link href={`/admin/dashboard-group/events/${event._id}/edit`} className="p-2 bg-white/10 text-blue-400 rounded-lg hover:bg-[#00f0ff] hover:text-black transition-all">
                    <Pencil size={18} />
                  </Link>
                  {/* ✅ Only the delete button carries Client-Side JS */}
                  <DeleteButton id={event._id.toString()} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}