import dbConnect from "@/lib/db";
import Registration from "@/models/Registration";
import Event from "@/models/Event";
import { Users, Calendar, CheckCircle } from "lucide-react";

export default async function Dashboard() {
  await dbConnect();

  // Fetch real counts from database
  // Event Registrations (auto-approved)
  const eventRegistrations = await Registration.countDocuments({ eventName: { $ne: "General Membership" } });
  
  // Membership Applications (pending/approved/rejected)
  const membershipTotal = await Registration.countDocuments({ eventName: "General Membership" });
  const membershipPending = await Registration.countDocuments({ eventName: "General Membership", status: "pending" });
  const membershipApproved = await Registration.countDocuments({ eventName: "General Membership", status: "approved" });
  
  // Event count
  const eventCount = await Event.countDocuments();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm mb-1">Event Registrations</p>
            <h3 className="text-3xl font-bold text-white">{eventRegistrations}</h3>
          </div>
          <div className="p-4 bg-white/5 rounded-full text-blue-400">
            <Users size={24} />
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm mb-1">Active Events</p>
            <h3 className="text-3xl font-bold text-white">{eventCount}</h3>
          </div>
          <div className="p-4 bg-white/5 rounded-full text-purple-400">
            <Calendar size={24} />
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm mb-1">Pending Member Approvals</p>
            <h3 className="text-3xl font-bold text-white">{membershipPending}</h3>
          </div>
          <div className="p-4 bg-white/5 rounded-full text-yellow-400">
            <CheckCircle size={24} />
          </div>
        </div>
      </div>

      {/* MEMBERSHIP & REGISTRATIONS SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {/* Club Membership Summary */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-6 text-[#00f0ff]">Club Membership</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-black/40 rounded-lg">
              <span className="text-gray-400">Total Members</span>
              <span className="text-2xl font-bold text-white">{membershipApproved}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <span className="text-gray-400">Pending Approvals</span>
              <span className="text-2xl font-bold text-yellow-400">{membershipPending}</span>
            </div>
            <a 
              href="/admin/dashboard-group/members"
              className="block text-center mt-4 p-3 bg-[#00f0ff]/10 text-[#00f0ff] rounded-lg hover:bg-[#00f0ff]/20 transition-colors font-semibold"
            >
              Manage Members
            </a>
          </div>
        </div>

        {/* Event Registrations Summary */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-6 text-blue-400">Event Registrations</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-black/40 rounded-lg">
              <span className="text-gray-400">Total Registrations</span>
              <span className="text-2xl font-bold text-white">{eventRegistrations}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-500/10 rounded-lg border border-green-500/20">
              <span className="text-gray-400">Auto-Approved</span>
              <span className="text-2xl font-bold text-green-400">{eventRegistrations}</span>
            </div>
            <a 
              href="/admin/dashboard-group/registrations"
              className="block text-center mt-4 p-3 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors font-semibold"
            >
              View Registrations
            </a>
          </div>
        </div>
      </div>

      {/* RECENT ACTIVITY */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4">Information</h2>
        <ul className="space-y-2 text-gray-400 text-sm">
          <li>• <strong>Event Registrations:</strong> Auto-approved, limited by capacity and deadline</li>
          <li>• <strong>Club Membership:</strong> Requires admin approval before becoming active member</li>
          <li>• <strong>Pending Approvals:</strong> Only applies to membership applications, not event registrations</li>
        </ul>
      </div>
    </div>
  );
}