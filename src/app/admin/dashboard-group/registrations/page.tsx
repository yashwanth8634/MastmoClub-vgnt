import dbConnect from "@/lib/db";
import Registration from "@/models/Registration";
import Event from "@/models/Event";
import MemberExportButton from "@/components/admin/MemberExportButton";

export const dynamic = "force-dynamic";

// Helper to calculate year from Roll No (Assuming 2025 is current academic context)
const getYearFromRoll = (rollNo: string) => {
  if (!rollNo) return "N/A";
  const prefix = rollNo.substring(0, 2);
  const yearMap: { [key: string]: string } = {
    "25": "1st",
    "24": "2nd",
    "23": "3rd",
    "22": "4th"
  };
  return yearMap[prefix] || "N/A";
};

export default async function RegistrationsPage() {
  await dbConnect();
  
  const events = await Event.find({}).sort({ createdAt: -1 }).lean();

  const eventsWithData = await Promise.all(
    events.map(async (event) => {
      const regs = await Registration.find({ eventId: event._id }).lean();
      return { ...event, registrations: regs };
    })
  );

  return (
    <div className="pb-20">
      <h1 className="text-3xl font-bold mb-8">Event Registrations</h1>

      <div className="space-y-12">
        {eventsWithData.map((event: any) => {
          const regs = event.registrations;
          if (!regs || regs.length === 0) return null;

          // 3. PREPARE DATA FOR PDF (With Auto-Calculated Year)
          const allParticipants = regs.flatMap((reg: any) => 
            reg.members.map((member: any) => {
              // Calculate Year if missing
              const calculatedYear = member.year || getYearFromRoll(member.rollNo);
              
              return {
                name: member.fullName,
                rollNumber: member.rollNo,
                email: member.email,
                phone: member.phone || member.mobile || "N/A",
                branch: member.branch || "N/A",
                year: calculatedYear, // ✅ Now sends "1st", "2nd" etc.
                section: member.section || "N/A"
              };
            })
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
                           {/* Display calculated year in table too */}
                           {getYearFromRoll(reg.members[0]?.rollNo)} Year - {reg.members[0]?.branch}
                        </td>
                        <td className="p-4">{reg.members[0]?.section}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}