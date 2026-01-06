import dbConnect from "@/lib/db";
import EventRegistration from "@/models/EventRegistration";
import Member from "@/models/ClubRegistration"; 
import Event from "@/models/Event";
import EventRegistrationsList from "@/components/admin/EventRegistrationsList"; 
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Event Registrations ",
  description: "View and manage event registrations.",
};

export const dynamic = "force-dynamic";

// --- HELPER 1: Calculate Year ---
const getYearFromRoll = (rollNo: string) => {
  if (!rollNo || typeof rollNo !== "string" || rollNo.length < 10) return "N/A";
  const joinYear = parseInt(rollNo.substring(0, 2)); 
  const typeCode = rollNo.substring(4, 6);           
  const currentYear = 25; 
  const yearDiff = currentYear - joinYear;

  if (typeCode === "5A") { 
    if (yearDiff === 0) return "2nd"; 
    if (yearDiff === 1) return "3rd"; 
    if (yearDiff === 2) return "4th"; 
  } else { 
    if (yearDiff === 0) return "1st"; 
    if (yearDiff === 1) return "2nd"; 
    if (yearDiff === 2) return "3rd"; 
    if (yearDiff === 3) return "4th"; 
  }
  return "Alumni"; 
};

// --- HELPER 2: Get Branch Code (EXPANDED LIST) ---
const getBranchFromRoll = (rollNo: string) => {
    if (!rollNo || rollNo.length < 10) return "Other";
    
    // Extract branch code (positions 6-8 in "24891A0501")
    const code = rollNo.substring(6, 8);

    switch(code) {
        case "01": return "CIVIL";
        case "02": return "EEE";
        case "03": return "MECH";
        case "04": return "ECE";
        case "05": return "CSE";
        case "12": return "CSE(IT)";
        case "66": return "CSE(AI&ML)"; // AI & ML
        case "67": return "CSE(DS)"; // Data Science
        case "72": return "AI&DS"; // AI & Data Science
        case "73": return "AI&ML"; // AI & Data Science
        case "33": return "CSE(IT)"; 
        default: return "Other"; // Unknown code
    }
};

export default async function RegistrationsPage() {
  await dbConnect();
  
  const events = await Event.find({}).sort({ createdAt: -1 }).limit(30).lean();

  const processedEvents = await Promise.all(
    events.map(async (event: any) => {
      const regs = await EventRegistration.find({ eventId: event._id }).lean();
      const safeRegs = JSON.parse(JSON.stringify(regs));

      // 1. Fetch Contact Info
      const allRollNos = safeRegs.flatMap((r: any) => {
         const rolls = [r.rollNo];
         if (r.teamMembers) {
            r.teamMembers.forEach((m: any) => rolls.push(m.rollNo));
         }
         return rolls;
      });

      const clubMembers = await Member.find({ "member.rollNo": { $in: allRollNos } })
                                      .select("member.rollNo member.email member.phone member.mobile")
                                      .lean();

      const contactMap = new Map();
      clubMembers.forEach((m: any) => {
         if (m.member?.rollNo) {
             contactMap.set(m.member.rollNo, {
                 email: m.member.email || "N/A",
                 phone: m.member.phone || m.member.mobile || "N/A"
             });
         }
      });

      // 2. Process Data
      const allPeople = safeRegs.flatMap((reg: any) => {
          const teamName = reg.teamName || "Individual";
          
          // ✅ USE NEW HELPER HERE
          const inheritedYear = getYearFromRoll(reg.rollNo);
          const inheritedBranch = getBranchFromRoll(reg.rollNo); 
          const inheritedSection = reg.section || "N/A";

          const createPerson = (p: any) => {
             const roll = p.rollNo || p.rollNumber || "N/A";
             const contact = contactMap.get(roll) || { email: p.email || "N/A", phone: p.phone || "N/A" };

             return {
                 rawName: p.name || p.fullName || "Unknown",
                 rawRoll: roll,
                 rawPhone: contact.phone,
                 rawEmail: contact.email,
                 realYear: inheritedYear,
                 realBranch: inheritedBranch, // ✅ Now supports IT, CSM, etc.
                 realSection: inheritedSection,
                 teamName: teamName
             };
          };

          const list = [createPerson(reg)];
          if (reg.teamMembers && Array.isArray(reg.teamMembers)) {
             reg.teamMembers.forEach((m: any) => list.push(createPerson(m)));
          }
          return list;
      });

      // 3. Class Report
      const classReportData = allPeople.map((p: any) => ({
         name: p.rawName,
         rollNumber: p.rawRoll,
         email: p.rawEmail,
         phone: p.rawPhone,
         year: p.realYear,
         branch: p.realBranch,
         section: p.realSection 
      }));

      // 4. Team Report
      const teamReportData = allPeople.map((p: any) => ({
          name: p.rawName,
          rollNumber: p.rawRoll,
          email: p.rawEmail,
          phone: p.rawPhone,
          year: p.realYear,       
          branch: p.realBranch,   
          section: `${p.realSection}           TEAM: ${p.teamName.toUpperCase()}`
      }));

      return {
        id: event._id.toString(),
        title: event.title,
        isOpen: event.registrationOpen,
        teamCount: safeRegs.length,
        studentCount: allPeople.length,
        registrations: safeRegs, 
        classReportData, 
        teamReportData   
      };
    })
  );

  return (
    <div className="pb-20 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Event Registrations</h1>
      <EventRegistrationsList events={processedEvents} />
    </div>
  );
}