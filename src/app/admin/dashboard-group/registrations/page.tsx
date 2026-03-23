import dbConnect from "@/lib/db";
import EventRegistration from "@/models/EventRegistration";
import type { IEventRegistration, ITeamMember } from "@/models/EventRegistration";
import Member from "@/models/ClubRegistration"; 
import type { IClubRegistration } from "@/models/ClubRegistration";
import Event from "@/models/Event";
import type { IEvent } from "@/models/Event";
import EventRegistrationsList from "@/components/admin/EventRegistrationsList"; 
import type { ExportMember } from "@/components/admin/MemberExportButton";
import { Metadata } from "next";
import type { Types } from "mongoose";

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
  type LeanEvent = IEvent & { _id: Types.ObjectId };
  type LeanRegistration = IEventRegistration & { _id: Types.ObjectId };
  type ContactInfo = { email: string; phone: string };
  type ProcessedPerson = {
    rawName: string;
    rawRoll: string;
    rawPhone: string;
    rawEmail: string;
    realYear: string;
    realBranch: string;
    realSection: string;
    teamName: string;
  };
  type SerializedRegistration = {
    _id: string;
    teamName?: string;
    fullName: string;
    rollNo: string;
    section?: string;
    teamMembers: Array<{
      name: string;
      rollNo: string;
      section: string;
      branch: string;
    }>;
  };
  
  const events = (await Event.find({})
    .select("title registrationOpen registrationRequired isTeamEvent date location createdAt")
    .sort({ createdAt: -1 })
    .limit(30)
    .lean()) as LeanEvent[];

  const processedEvents = await Promise.all(
    events.map(async (event) => {
      const regs = (await EventRegistration.find({
        eventId: event._id,
      })
        .select("teamName fullName rollNo section teamMembers")
        .lean()) as LeanRegistration[];
      const safeRegs: SerializedRegistration[] = regs.map((registration) => ({
        _id: registration._id.toString(),
        teamName: registration.teamName,
        fullName: registration.fullName,
        rollNo: registration.rollNo,
        section: registration.section,
        teamMembers: (registration.teamMembers || []).map((member) => ({
          name: member.name,
          rollNo: member.rollNo,
          section: member.section,
          branch: member.branch,
        })),
      }));

      // 1. Fetch Contact Info
      const allRollNos = safeRegs.flatMap((registration) => {
         const rolls = [registration.rollNo];
         if (registration.teamMembers) {
            registration.teamMembers.forEach((member) => rolls.push(member.rollNo));
         }
         return rolls;
      });

      const clubMembers = (await Member.find({ "member.rollNo": { $in: allRollNos } })
                                      .select("member.rollNo member.email member.phone")
                                      .lean()) as IClubRegistration[];

      const contactMap = new Map<string, ContactInfo>();
      clubMembers.forEach((memberRecord) => {
         if (memberRecord.member?.rollNo) {
             contactMap.set(memberRecord.member.rollNo, {
                 email: memberRecord.member.email || "N/A",
                 phone: memberRecord.member.phone || "N/A"
             });
         }
      });

      // 2. Process Data
      const allPeople = safeRegs.flatMap((registration) => {
          const teamName = registration.teamName || "Individual";
          
          // ✅ USE NEW HELPER HERE
          const inheritedYear = getYearFromRoll(registration.rollNo);
          const inheritedBranch = getBranchFromRoll(registration.rollNo); 
          const inheritedSection = registration.section || "N/A";

          const createPerson = (
            person: Pick<LeanRegistration, "fullName" | "rollNo"> | ITeamMember,
          ): ProcessedPerson => {
             const roll = person.rollNo || "N/A";
             const contact = contactMap.get(roll) || { email: "N/A", phone: "N/A" };

             return {
                 rawName: "name" in person ? person.name : person.fullName,
                 rawRoll: roll,
                 rawPhone: contact.phone,
                 rawEmail: contact.email,
                 realYear: inheritedYear,
                 realBranch: inheritedBranch, // ✅ Now supports IT, CSM, etc.
                 realSection: inheritedSection,
                 teamName: teamName
             };
          };

          const list = [createPerson(registration)];
          if (registration.teamMembers && Array.isArray(registration.teamMembers)) {
             registration.teamMembers.forEach((member) => list.push(createPerson(member)));
          }
          return list;
      });

      // 3. Class Report
      const classReportData = allPeople.map((person): ExportMember => ({
         name: person.rawName,
         rollNumber: person.rawRoll,
         email: person.rawEmail,
         phone: person.rawPhone,
         year: person.realYear,
         branch: person.realBranch,
         section: person.realSection 
      }));

      // 4. Team Report
      const teamReportData = allPeople.map((person): ExportMember => ({
          name: person.rawName,
          rollNumber: person.rawRoll,
          email: person.rawEmail,
          phone: person.rawPhone,
          year: person.realYear,       
          branch: person.realBranch,   
          section: `${person.realSection}           TEAM: ${person.teamName.toUpperCase()}`
      }));

      return {
        id: event._id.toString(),
        title: event.title,
        isOpen: event.registrationOpen,
        registrationRequired: event.registrationRequired,
        isTeamEvent: event.isTeamEvent,
        eventDate: event.date,
        location: event.location,
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
