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
import { failureResult, getErrorMessage, successResult, type ActionResult } from "@/lib/actionState";
import type { IClubRegistration } from "@/models/ClubRegistration";
import type { ITeamMember } from "@/models/EventRegistration";
import { logger } from "@/lib/logger";

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

export async function registerForEvent(
  _prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    await dbConnect();

    // 0. Rate Limit Check (10 requests per minute)
    const isAllowed = await rateLimit(10, 60000);
    if (!isAllowed) {
      return failureResult("Too many requests. Please try again later.");
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
    if (mainUserError) return failureResult(mainUserError);

    const mainMember = await Member.findOne({ "member.rollNo": rollNo });
    
    if (!mainMember) {
      return failureResult("Access Denied: You are not a registered Club Member.");
    }

    if (mainMember.status === "rejected") {
      return failureResult("Access Denied: Your club membership application has been rejected.");
    }

    if (mainMember.status !== "approved") {
      return failureResult(
        `Access Denied: Your club membership status is '${mainMember.status}'. Please wait for approval.`,
      );
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
                return failureResult("Invalid Team: You cannot add yourself as a team member.");
            }

            if (processedRolls.has(member.rollNo)) {
                return failureResult(`Duplicate Entry: Member '${member.name}' is added twice.`);
            }
            processedRolls.add(member.rollNo);

            const formatError = validateRollNo(member.rollNo);
            if (formatError) return failureResult(`Member '${member.name}' has invalid Roll No.`);

            const memberBranchCode = getBranchCodeFromRoll(member.rollNo);
            
            if (memberBranchCode !== teamLeadBranchCode) {
                return failureResult(
                  `Branch Mismatch: Member '${member.name}' is not from the same branch as the Team Lead.`,
                );
            }
        }

        const teamRollNos = teamMembers.map((m) => m.rollNo);
        const foundMembers = await Member.find({
          "member.rollNo": { $in: teamRollNos },
        }) as IClubRegistration[];
        
        const foundRollNos = foundMembers.map((memberRecord) => memberRecord.member.rollNo);
        const missingMembers = teamMembers.filter((m) => !foundRollNos.includes(m.rollNo));

        if (missingMembers.length > 0) {
            return failureResult(
              `Access Denied: The following members are not in the club: ${missingMembers.map((m) => m.name).join(", ")}`,
            );
        }

        const rejectedMembers = foundMembers.filter(
          (memberRecord) => memberRecord.status === "rejected",
        );
        if (rejectedMembers.length > 0) {
             return failureResult(
               `Access Denied: The following members have been rejected from the club: ${rejectedMembers.map((memberRecord) => memberRecord.member.fullName).join(", ")}`,
             );
        }

        const notApprovedMembers = foundMembers.filter(
          (memberRecord) => memberRecord.status !== "approved",
        );
        if (notApprovedMembers.length > 0) {
            return failureResult(
              `Access Denied: The following members are not approved yet: ${notApprovedMembers.map((memberRecord) => memberRecord.member.fullName).join(", ")}`,
            );
        }

        const differentSectionMembers = foundMembers.filter(
          (memberRecord) => memberRecord.member.section !== leaderSection,
        );
        if (differentSectionMembers.length > 0) {
            return failureResult(
              `Section Mismatch: The following members are not in Section '${leaderSection}': ${differentSectionMembers.map((memberRecord) => memberRecord.member.fullName).join(", ")}`,
            );
        }
    }

    // 4. Event Checks
    const event = await Event.findById(eventId);
    if (!event) return failureResult("Event not found");
    if (!event.registrationRequired) return failureResult("This event does not require registration.");
    if (!event.registrationOpen) return failureResult("Registration is closed.");
    if (event.maxRegistrations > 0) {
      const actualCount = await EventRegistration.countDocuments({ eventId });
      if (actualCount >= event.maxRegistrations) {
        return failureResult("Event is full.");
      }
    }

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
            existingParticipation.teamMembers?.some((member: ITeamMember) => member.rollNo === r)
        );
        return failureResult(
          `Registration Failed: User '${conflictRoll}' is already registered for this event.`,
        );
    }

    if (teamName) {
        const existingTeam = await EventRegistration.findOne({ 
            eventId, 
            teamName: { $regex: new RegExp(`^${teamName}$`, "i") } 
        });

        if (existingTeam) {
            return failureResult(`Team name '${teamName}' is already taken.`);
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
           logger.info("Event confirmation email sent", {
             eventId,
             userEmail,
           });
       
       } catch (emailError) {
           logger.error("Failed to send event confirmation email", emailError, {
             eventId,
             userEmail,
           });
       }
    }
    revalidatePath(`/events/${eventId}`);
    return successResult("Registration Successful!");

  } catch (error: unknown) {
    logger.error("Event registration failed", error);
    return failureResult(getErrorMessage(error, "Failed to register"));
  }
}
