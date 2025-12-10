import dbConnect from "@/lib/db";
import Registration from "@/models/Registration";
import Event from "@/models/Event";
import ExportButton from "@/components/admin/ExportButton"; // ✅ Import the new button

// Force dynamic to get latest data
export const dynamic = "force-dynamic";

export default async function RegistrationsPage() {
  await dbConnect();
  
  // Get all active events
  const events = await Event.find({}).sort({ createdAt: -1 });

  return (
    <div className="pb-20">
      <h1 className="text-3xl font-bold mb-8">Event Registrations</h1>

      <div className="space-y-12">
        {events.map(async (event) => {
          // Fetch registrations for this specific event
          // We use .lean() to pass plain JSON to the Client Component
          const regs = await Registration.find({ eventId: event._id }).lean();
          
          if (regs.length === 0) return null;

          return (
            <div key={event._id.toString()} className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">{event.title}</h2>
                  <p className="text-sm text-gray-400">Count: <span className="text-[#00f0ff]">{regs.length}</span> registrations</p>
                </div>
                
                {/* ✅ REAL EXPORT BUTTON */}
                {/* We pass the raw data so the browser can generate the Excel file */}
                <ExportButton 
                  data={JSON.parse(JSON.stringify(regs))} 
                  eventTitle={event.title} 
                />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-black/20 text-gray-400 uppercase text-xs">
                    <tr>
                      <th className="p-3">Team Name</th>
                      <th className="p-3">Student Name</th>
                      <th className="p-3">Roll No</th>
                      <th className="p-3">Branch</th>
                      <th className="p-3">Section</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {regs.map((reg: any) => (
                      <tr key={reg._id.toString()} className="hover:bg-white/5">
                        <td className="p-3 font-bold text-gray-300">
                          {reg.teamName || "-"}
                        </td>
                        <td className="p-3">{reg.members[0].fullName}</td>
                        <td className="p-3 font-mono">{reg.members[0].rollNo}</td>
                        <td className="p-3">{reg.members[0].branch}</td>
                        <td className="p-3">{reg.members[0].section}</td>
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