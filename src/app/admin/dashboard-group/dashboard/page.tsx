import dbConnect from "@/lib/db";
import Registration from "@/models/Registration";
import Event from "@/models/Event";
import { Users, Calendar, CheckCircle, GraduationCap, History } from "lucide-react";

export default async function Dashboard() {
  await dbConnect();

  // 1. EVENT REGISTRATIONS (Exclude Memberships)
  const eventRegistrations = await Registration.countDocuments({ 
    eventName: { $nin: ["General Membership", "Faculty Membership"] } 
  });
  
  // 2. MEMBER STATISTICS
  const studentPending = await Registration.countDocuments({ eventName: "General Membership", status: "pending" });
  const studentApproved = await Registration.countDocuments({ eventName: "General Membership", status: "approved" });
  
  const facultyPending = await Registration.countDocuments({ eventName: "Faculty Membership", status: "pending" });
  const facultyApproved = await Registration.countDocuments({ eventName: "Faculty Membership", status: "approved" });

  // 3. EVENT STATISTICS (✅ FIXED LOGIC)
  // Active = isPast is false (Upcoming)
  const activeEvents = await Event.countDocuments({ isPast: false });
  // Past = isPast is true (Closed/Completed)
  const pastEvents = await Event.countDocuments({ isPast: true });

  // 4. TOTALS
  const totalPending = studentPending + facultyPending;
  const totalMembers = studentApproved + facultyApproved;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {/* Event Regs */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm mb-1">Event Registrations</p>
            <h3 className="text-3xl font-bold text-white">{eventRegistrations}</h3>
          </div>
          <div className="p-4 bg-white/5 rounded-full text-blue-400">
            <Users size={24} />
          </div>
        </div>

        {/* ✅ ACTIVE EVENTS (Fixed) */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm mb-1">Active / Upcoming</p>
            <h3 className="text-3xl font-bold text-green-400">{activeEvents}</h3>
            <p className="text-xs text-gray-500 mt-1">{pastEvents} Past Events</p>
          </div>
          <div className="p-4 bg-white/5 rounded-full text-green-400">
            <Calendar size={24} />
          </div>
        </div>

        {/* Total Members */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm mb-1">Total Club Members</p>
            <h3 className="text-3xl font-bold text-white">{totalMembers}</h3>
            <p className="text-xs text-gray-500 mt-1">{facultyApproved} Faculty • {studentApproved} Students</p>
          </div>
          <div className="p-4 bg-white/5 rounded-full text-purple-400">
            <GraduationCap size={24} />
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm mb-1">Pending Approvals</p>
            <h3 className="text-3xl font-bold text-yellow-400">{totalPending}</h3>
            <p className="text-xs text-gray-500 mt-1">{facultyPending} Faculty • {studentPending} Students</p>
          </div>
          <div className="p-4 bg-white/5 rounded-full text-yellow-400">
            <CheckCircle size={24} />
          </div>
        </div>
      </div>

      {/* DETAILED SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        
        {/* Membership Breakdown */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-6 text-[#00f0ff]">Membership Status</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-black/40 rounded-lg">
              <div>
                <span className="text-gray-300 block">Students</span>
                <span className="text-xs text-gray-500">General Membership</span>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold text-white block">{studentApproved}</span>
                {studentPending > 0 && <span className="text-xs text-yellow-400">{studentPending} Pending</span>}
              </div>
            </div>

            <div className="flex justify-between items-center p-3 bg-purple-900/10 rounded-lg border border-purple-500/20">
              <div>
                <span className="text-purple-300 block">Faculty</span>
                <span className="text-xs text-purple-400/60">Faculty Membership</span>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold text-purple-300 block">{facultyApproved}</span>
                {facultyPending > 0 && <span className="text-xs text-yellow-400">{facultyPending} Pending</span>}
              </div>
            </div>
            
            <a href="/admin/dashboard-group/members" className="block text-center mt-4 p-3 bg-[#00f0ff]/10 text-[#00f0ff] rounded-lg hover:bg-[#00f0ff]/20 transition-colors font-semibold">
              Manage All Members
            </a>
          </div>
        </div>

        {/* Event Summary */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-6 text-green-400">Events Overview</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-500/10 rounded-lg border border-green-500/20">
              <span className="text-gray-300">Currently Active</span>
              <span className="text-2xl font-bold text-green-400">{activeEvents}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5">
              <span className="text-gray-400">Past / Closed</span>
              <span className="text-2xl font-bold text-gray-400">{pastEvents}</span>
            </div>

            <a href="/admin/dashboard-group/events" className="block text-center mt-4 p-3 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition-colors font-semibold">
              Manage Events
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}