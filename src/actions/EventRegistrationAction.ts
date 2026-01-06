"use server";

import dbConnect from "@/lib/db";
import EventRegistration from "@/models/EventRegistration";
import Event from "@/models/Event";
import Member from "@/models/ClubRegistration"; 
import { validateRollNo, getBranchCodeFromRoll } from "@/lib/validator"; 
import { revalidatePath } from "next/cache";
import { sendEmail } from "@/lib/email";
import { emailTemplates } from "@/lib/emailTemplates"
import { rateLimit } from "@/lib/rateLimit";

import { z } from "zod";

// Zod Schema for Registration
const RegistrationSchema = z.object({
  eventId: z.string().min(1, "Event ID is required"),
  fullName: z.string().min(1, "Full Name is required"),
  rollNo: z.string().min(1, "Roll No is required"),
  year: z.string().min(1, "Year is required"),
  branch: z.string().min(1, "Branch is required"),
  section: z.string().min(1, "Section is required"),
  teamName: z.string().optional(),
  teamMembers: z.array(z.object({
    name: z.string(),
    rollNo: z.string(),
    section: z.string(),
    branch: z.string()
  })).default([]),
});

export async function registerForEvent(prevState: any, formData: FormData) {
  try {
    await dbConnect();

    // 0. Rate Limit Check (10 requests per minute)
    const isAllowed = await rateLimit(10, 60000);
    if (!isAllowed) {
      return { success: false, message: "Too many requests. Please try again later." };
    }

    // 1. Extract & Parse Data
    const rawData = {
      eventId: formData.get("eventId"),
      fullName: formData.get("fullName"),
      rollNo: formData.get("rollNo"),
      year: formData.get("year"),
      branch: formData.get("branch"),
      section: formData.get("section"),
      teamName: formData.get("teamName") || undefined,
      teamMembers: formData.get("teamMembers") 
        ? JSON.parse(formData.get("teamMembers") as string) 
        : [],
    };

    // Zod Validation
    const validatedData = RegistrationSchema.parse(rawData);
    const { eventId, rollNo, teamName, teamMembers, fullName, year, branch, section } = validatedData;

    // 2. Validate Main User Logic
    const mainUserError = validateRollNo(rollNo, branch);
    if (mainUserError) return { success: false, message: mainUserError };

    const mainMember = await Member.findOne({ "member.rollNo": rollNo });
    
    if (!mainMember) {
      return { success: false, message: "Access Denied: You are not a registered Club Member." };
    }

    if (mainMember.status === "rejected") {
      return { success: false, message: "Access Denied: Your club membership application has been rejected." };
    }

    if (mainMember.status !== "approved") {
      return { success: false, message: `Access Denied: Your club membership status is '${mainMember.status}'. Please wait for approval.` };
    }
    
    const userEmail = mainMember.member?.email;
    const dbMemberData = mainMember.member || {}; 
    const leaderSection = dbMemberData.section || section; 

    // 3. 🛡️ TEAM VALIDATION 🛡️
    if (teamMembers && teamMembers.length > 0) {
        const teamLeadBranchCode = getBranchCodeFromRoll(rollNo); 
        const processedRolls = new Set();

        for (const member of teamMembers) {
            if (member.rollNo === rollNo) {
                return { success: false, message: "Invalid Team: You cannot add yourself as a team member." };
            }

            if (processedRolls.has(member.rollNo)) {
                return { success: false, message: `Duplicate Entry: Member '${member.name}' is added twice.` };
            }
            processedRolls.add(member.rollNo);

            const formatError = validateRollNo(member.rollNo);
            if (formatError) return { success: false, message: `Member '${member.name}' has invalid Roll No.` };

            const memberBranchCode = getBranchCodeFromRoll(member.rollNo);
            
            if (memberBranchCode !== teamLeadBranchCode) {
                return { 
                    success: false, 
                    message: `Branch Mismatch: Member '${member.name}' is not from the same branch as the Team Lead.` 
                };
            }
        }

        const teamRollNos = teamMembers.map((m) => m.rollNo);
        const foundMembers = await Member.find({ "member.rollNo": { $in: teamRollNos } });
        
        const foundRollNos = foundMembers.map((m: any) => m.member.rollNo);
        const missingMembers = teamMembers.filter((m) => !foundRollNos.includes(m.rollNo));

        if (missingMembers.length > 0) {
            return { success: false, message: `Access Denied: The following members are not in the club: ${missingMembers.map((m) => m.name).join(", ")}` };
        }

        const rejectedMembers = foundMembers.filter((m: any) => m.status === "rejected");
        if (rejectedMembers.length > 0) {
             return { 
                 success: false, 
                 message: `Access Denied: The following members have been rejected from the club: ${rejectedMembers.map((m: any) => m.member.fullName).join(", ")}` 
             };
        }

        const notApprovedMembers = foundMembers.filter((m: any) => m.status !== "approved");
        if (notApprovedMembers.length > 0) {
            return { 
                success: false, 
                message: `Access Denied: The following members are not approved yet: ${notApprovedMembers.map((m: any) => m.member.fullName).join(", ")}` 
            };
        }

        const differentSectionMembers = foundMembers.filter((m: any) => m.member.section !== leaderSection);
        if (differentSectionMembers.length > 0) {
            return { 
                success: false, 
                message: `Section Mismatch: The following members are not in Section '${leaderSection}': ${differentSectionMembers.map((m: any) => m.member.fullName).join(", ")}` 
            };
        }
    }

    // 4. Event Checks
    const event = await Event.findById(eventId);
    if (!event) return { success: false, message: "Event not found" };
    if (!event.registrationOpen) return { success: false, message: "Registration is closed." };
    if (event.maxRegistrations > 0 && event.currentRegistrations >= event.maxRegistrations) return { success: false, message: "Event is full." };

    // 5. 🛡️ RACE CONDITION & DUPLICATE CHECK 🛡️
    // Check if ANY of the participants (Lead + Members) are already registered for this event.
    const allParticipants = [rollNo, ...teamMembers.map(m => m.rollNo)];
    
    const existingParticipation = await EventRegistration.findOne({
        eventId,
        $or: [
            { rollNo: { $in: allParticipants } },
            { "teamMembers.rollNo": { $in: allParticipants } }
        ]
    }).select("rollNo teamMembers.rollNo"); // Optimization: Select only needed fields

    if (existingParticipation) {
        // Identify who caused the conflict
        const conflictRoll = allParticipants.find(r => 
            r === existingParticipation.rollNo || 
            existingParticipation.teamMembers?.some((m: any) => m.rollNo === r)
        );
        return { success: false, message: `Registration Failed: User '${conflictRoll}' is already registered for this event.` };
    }

    if (teamName) {
        const existingTeam = await EventRegistration.findOne({ 
            eventId, 
            teamName: { $regex: new RegExp(`^${teamName}$`, "i") } 
        });

        if (existingTeam) {
            return { success: false, message: `Team name '${teamName}' is already taken.` };
        }
    }

    // 6. Save
    await EventRegistration.create({ 
        eventId, 
        fullName, 
        rollNo, 
        year, 
        branch, 
        section, 
        teamName, 
        teamMembers 
    });
    
    // Increment count (Note: this is still slightly racy for maxRegistrations, but acceptable for this use case)
    await Event.findByIdAndUpdate(eventId, { $inc: { currentRegistrations: 1 } });

    if (userEmail) {
       try {
           const { subject, html } = emailTemplates.eventRegistrationConfirmed(
               fullName, 
               event.title, 
               teamName || undefined
           );

           await sendEmail(userEmail, subject, html);
           console.log(`✅ Email sent to ${userEmail}`);
       
       } catch (emailError) {
           console.error("Failed to send event confirmation email:", emailError);
       }
    }
    revalidatePath(`/events/${eventId}`);
    return { success: true, message: "Registration Successful!" };

  } catch (error: any) {
    console.error("Registration Error:", error);
    if (error instanceof z.ZodError) {
        return { success: false, message: error.issues[0]?.message || "Validation Error" };
    }
    return { success: false, message: error.message || "Failed to register" };
  }
}