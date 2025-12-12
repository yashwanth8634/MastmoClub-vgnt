"use server";

import dbConnect from "@/lib/db";
import Event from "@/models/Event";
import Registration from "@/models/Registration";
import Gallery from "@/models/Gallery";
// Import Team model if you have one separately, or assume it's part of something else
// import TeamMember from "@/models/TeamMember"; 

import { verifyAdmin } from "@/lib/auth";

export async function generateBackup() {
  try {
    // 1. Security Check
    await verifyAdmin();
  } catch (e) {
    return { success: false, message: "Unauthorized access" };
  }

  await dbConnect();

  try {
    // 2. Fetch ALL Data
    // .lean() converts Mongoose objects to plain JavaScript objects (faster)
    const events = await Event.find({}).lean();
    const registrations = await Registration.find({}).lean();
    const gallery = await Gallery.find({}).lean();
    
    // Add other collections here if you have them, e.g.:
    // const team = await TeamMember.find({}).lean();

    // 3. Bundle Data
    const backupData = {
      timestamp: new Date().toISOString(),
      version: "1.0",
      stats: {
        events: events.length,
        registrations: registrations.length,
        gallery: gallery.length,
      },
      data: {
        events,
        registrations,
        gallery,
        // team
      }
    };

    // 4. Return as String
    return { 
      success: true, 
      data: JSON.stringify(backupData, null, 2) // Pretty print JSON
    };

  } catch (error: any) {
    console.error("Backup Error:", error);
    return { success: false, message: "Backup generation failed" };
  }
}