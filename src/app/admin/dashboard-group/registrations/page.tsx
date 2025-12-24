import dbConnect from "@/lib/db";
import Registration from "@/models/Registration";
import Event from "@/models/Event";
import MemberExportButton from "@/components/admin/MemberExportButton";

// Force dynamic to get latest data
export const dynamic = "force-dynamic";

export default async function RegistrationsPage() {
  await dbConnect();
  
  // 1. Fetch Events
  const events = await Event.find({}).sort({ createdAt: -1 }).lean();

  // 2. ✅ FIX: Fetch Registrations for ALL events in parallel
  // We transform the data BEFORE rendering to avoid async issues in JSX
  const eventsWithData = await Promise.all(
    events.map(async (event) => {
      const regs = await Registration.find({ eventId: event._id }).lean();
      return { ...event, registrations: regs }; // Attach regs to the event object
    })
  );

  return (
    <div className="pb-20">
      <h1 className="text-3xl font-bold mb-8">Event Registrations</h1>

      <div className="space-y-12">
        {eventsWithData.map((event: any) => {
          const regs = event.registrations;
          
          // Skip events with no registrations
          if (!regs || regs.length === 0) return null;

          // 3. PREPARE DATA FOR PDF (Flatten Teams -> Individual Students)
          const allParticipants = regs.flatMap((reg: any) => 
            reg.members.map((member: any) => ({
              name: member.fullName,
              rollNumber: member.rollNo,
              email: member.email,
              phone: member.phone || member.mobile || "N/A",
              branch: member.branch || "N/A",
              year: member.year || "N/A",
              section: member.section || "N/A"
            }))
          );

          return (
            <div key={event._id.toString()} className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white">{event.title}</h2>
                  <p className="text-sm text-gray-400">
                    <span className="text-[#00f0ff]">{regs.length}</span> Teams / 
                    <span className="text-[#00f0ff] ml-1">{allParticipants.length}</span> Students
                  </p>
                </div>
                
                {/* PDF EXPORT BUTTON */}
                <MemberExportButton 
                  members={allParticipants} 
                  title={`EVENT REPORT: ${event.title.toUpperCase()}`}
                  fileName={`Report_${event.title.replace(/\s+/g, '_')}`}
                />
              </div>

              {/* Table Display */}
              <div className="overflow-x-auto bg-black/20 rounded-xl border border-white/5">
                <table className="w-full text-left text-sm">
                  <thead className="bg-white/5 text-gray-400 uppercase text-xs">
                    <tr>
                      <th className="p-4">Team Name</th>
                      <th className="p-4">Lead Student</th>
                      <th className="p-4">Roll No</th>
                      <th className="p-4">Class</th>
                      <th className="p-4">Section</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {regs.map((reg: any) => (
                      <tr key={reg._id.toString()} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 font-bold text-gray-300">
                          {reg.teamName || "Individual"}
                        </td>
                        <td className="p-4 text-white">{reg.members[0]?.fullName}</td>
                        <td className="p-4 font-mono text-[#00f0ff]">{reg.members[0]?.rollNo}</td>
                        <td className="p-4">
                            {reg.members[0]?.year ? `${reg.members[0].year} - ` : ""}
                            {reg.members[0]?.branch || "N/A"}
                        </td>
                        <td className="p-4">{reg.members[0]?.section || "N/A"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
        
        {/* Empty State */}
        {eventsWithData.every((e: any) => e.registrations.length === 0) && (
             <div className="text-center py-20 bg-white/5 rounded-xl border border-white/10">
               <p className="text-gray-400">No event registrations found yet.</p>
             </div>
        )}
      </div>
    </div>
  );
}