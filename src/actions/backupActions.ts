"use server";

import dbConnect from "@/lib/db";
import Event from "@/models/Event";
import Registration from "@/models/ClubRegistration";
import Popup from "@/models/Popup"; // ✅ Added Popup Model
// import Gallery from "@/models/Gallery"; // Uncomment if you have a standalone Gallery model

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
    // .lean() converts to plain JSON (Faster & saves memory)
    const events = await Event.find({}).lean();
    const registrations = await Registration.find({}).lean();
    const popups = await Popup.find({}).lean(); // ✅ Backup Popup configs too
    
    // 3. Bundle Data
    const backupData = {
      timestamp: new Date().toISOString(),
      version: "1.1", // Bumped version
      stats: {
        events: events.length,
        registrations: registrations.length,
        popups: popups.length,
        // Calculate Faculty count just for info (Faculty have eventName="Faculty Membership")
        faculty: registrations.filter((r: any) => r.eventName === "Faculty Membership").length
      },
      data: {
        events,
        registrations, // This includes Students AND Faculty
        popups,
      }
    };

    // 4. Return as String
    return { 
      success: true, 
      data: JSON.stringify(backupData, null, 2) // Pretty print JSON
    };

  } catch (error: any) {
    console.error("Backup Error:", error);
    return { success: false, message: "Backup generation failed: " + error.message };
  }
}