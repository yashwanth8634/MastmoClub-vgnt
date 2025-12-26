"use server";

import dbConnect from "@/lib/db";
import EventRegistration from "@/models/EventRegistration";
import Event from "@/models/Event";
import Member from "@/models/ClubRegistration"; // Ensure this matches your export
import { RegistrationSchema, validateRollNo, getBranchCodeFromRoll } from "@/lib/validator"; 
import { revalidatePath } from "next/cache";
import { sendEmail } from "@/lib/email";
import { emailTemplates } from "@/lib/emailTemplates"

export async function registerForEvent(prevState: any, formData: FormData) {
  try {
    await dbConnect();

    const eventId = formData.get("eventId") as string;
    
    // Construct raw data (Handling nulls for optional fields)
    const rawData = {
      fullName: formData.get("fullName") as string,
      rollNo: formData.get("rollNo"),
      year: formData.get("year"),
      branch: formData.get("branch"),
      section: formData.get("section"),
      teamName: formData.get("teamName") as string || undefined, // undefined passes .optional()
      teamMembers: formData.get("teamMembers") 
        ? JSON.parse(formData.get("teamMembers") as string) 
        : [],
    };

    const validatedFields = RegistrationSchema.safeParse(rawData);
    
    if (!validatedFields.success) {
      return { success: false, message: "Invalid Input: " + validatedFields.error.issues[0].message };
    }
    
    const { rollNo, branch, section, teamMembers } = validatedFields.data;

    // 1. Validate Main User
    const mainUserError = validateRollNo(rollNo, branch);
    if (mainUserError) return { success: false, message: mainUserError };

    // 🔴 FIX: Use dot notation "member.rollNo" because it is nested in schema
    const mainMember = await Member.findOne({ "member.rollNo": rollNo });
    
    if (!mainMember) {
      return { success: false, message: "Access Denied: You are not a registered Club Member." };
    }
    
    

    // Note: In your schema, section is inside 'member', so we access mainMember.member.section
    // Use optional chaining in case mainMember.member is undefined (though it shouldn't be)
    const userEmail = mainMember.member?.email;
    const dbMemberData = mainMember.member || {}; 
    const leaderSection = dbMemberData.section || section; 



    // 2. 🛡️ TEAM VALIDATION 🛡️
    if (teamMembers && teamMembers.length > 0) {
        
        const teamLeadBranchCode = getBranchCodeFromRoll(rollNo); 

        for (const member of teamMembers) {
            // A. Check Format
            const formatError = validateRollNo(member.rollNo);
            if (formatError) return { success: false, message: `Member '${member.name}' has invalid Roll No.` };

            // B. Check Branch Consistency
            const memberBranchCode = getBranchCodeFromRoll(member.rollNo);
            
            if (memberBranchCode !== teamLeadBranchCode) {
                return { 
                    success: false, 
                    message: `Branch Mismatch: Member '${member.name}' is not from the same branch as the Team Lead.` 
                };
            }
        }

        // C. Check Membership & Section Consistency (All Team Members)
        const teamRollNos = teamMembers.map((m) => m.rollNo);
        
        // 🔴 FIX: Query using "member.rollNo"
        const foundMembers = await Member.find({ "member.rollNo": { $in: teamRollNos } });
        
        // Map back to simple array of roll numbers for checking
        const foundRollNos = foundMembers.map((m: any) => m.member.rollNo);
        const missingMembers = teamMembers.filter((m) => !foundRollNos.includes(m.rollNo));

        if (missingMembers.length > 0) {
            return { success: false, message: `Access Denied: The following members are not in the club: ${missingMembers.map(m => m.name).join(", ")}` };
        }

        // D. Check Section Consistency
        // We filter through the found DATABASE records
        const differentSectionMembers = foundMembers.filter((m: any) => m.member.section !== leaderSection);
        
        if (differentSectionMembers.length > 0) {
            return { 
                success: false, 
                message: `Section Mismatch: The following members are not in Section '${leaderSection}': ${differentSectionMembers.map((m: any) => m.member.fullName).join(", ")}` 
            };
        }
    }

    // 3. Event Checks
    const event = await Event.findById(eventId);
    if (!event) return { success: false, message: "Event not found" };
    if (!event.registrationOpen) return { success: false, message: "Registration is closed." };
    if (event.maxRegistrations > 0 && event.currentRegistrations >= event.maxRegistrations) return { success: false, message: "Event is full." };

    // 4. Duplicate Check
    const existingReg = await EventRegistration.findOne({ eventId, rollNo });
    if (existingReg) return { success: false, message: "You have already registered for this event." };

    // 5. Save
    await EventRegistration.create({ eventId, ...validatedFields.data });
    await Event.findByIdAndUpdate(eventId, { $inc: { currentRegistrations: 1 } });


 if (userEmail) {
       try {
           // ✅ Generate the email content using your template
           const { subject, html } = emailTemplates.eventRegistrationConfirmed(
               rawData.fullName, 
               event.title, 
               rawData.teamName || undefined
           );

           await sendEmail(userEmail, subject, html);
           console.log(`✅ Email sent to ${userEmail}`);
       
       } catch (emailError) {
           console.error("Failed to send event confirmation email:", emailError);
           // We do NOT stop the process here; registration is already successful
       }
    }
    revalidatePath(`/events/${eventId}`);
    return { success: true, message: "Registration Successful!" };

  } catch (error: any) {
    console.error("Registration Error:", error);
    return { success: false, message: error.message || "Failed to register" };
  }
}