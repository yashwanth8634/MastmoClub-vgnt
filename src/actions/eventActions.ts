"use server";

import dbConnect from "@/lib/db";
import Event from "@/models/Event"; // Import the model we just created
import { revalidatePath } from "next/cache";
import { verifyAdmin } from "@/lib/auth"; // Assuming you have this
import { deleteFilesFromUT } from "@/lib/utapi-server"; 

// 🛠️ HELPER: Extract Key from UploadThing URL
const getFileKey = (url: string) => {
  if (!url || !url.includes("utfs.io")) return "";
  return url.split("/").pop() || "";
};

// ==========================================
// 1. CREATE EVENT
// ==========================================
export async function createEvent(formData: FormData) {
  try {
    // 1. Security Check
    await verifyAdmin();
    await dbConnect();

    // 2. Extract & Format Data
    // We use .getAll() to handle arrays like gallery[] and rules[]
    const gallery = formData.getAll("gallery") as string[]; 
    const rules = formData.getAll("rules") as string[];

    const newEvent = await Event.create({
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      
      // Strings as requested
      date: formData.get("date") as string,
      time: formData.get("time") as string,
      location: formData.get("location") as string,

      // Logic Defaults
      registrationOpen: formData.get("registrationOpen") === "true",
      isLive: formData.get("isLive") === "false" ? false : true,
      maxRegistrations: Number(formData.get("maxRegistrations")) || 0,
      
      // Team Logic
      isTeamEvent: formData.get("isTeamEvent") === "true",
      minTeamSize: Number(formData.get("minTeamSize")) || 1,
      maxTeamSize: Number(formData.get("maxTeamSize")) || 1,

      rules: rules,
      gallery: gallery,
    });

    // 3. Revalidate Frontend
    revalidatePath("/admin/dashboard-group/events");
    revalidatePath("/events");
    
    return { success: true, message: "Event Created Successfully!" };

  } catch (error: any) {
    console.error("Create Event Error:", error);
    // Return clear message for developer/UI
    return { success: false, message: error.message || "Failed to create event" };
  }
}

// ==========================================
// 2. UPDATE EVENT
// ==========================================
export async function updateEvent(id: string, formData: FormData) {
  try {
    await verifyAdmin();
    await dbConnect();

    const existingEvent = await Event.findById(id);
    if (!existingEvent) {
      return { success: false, message: "Event not found" };
    }

    // --- SMART IMAGE CLEANUP LOGIC ---
    // 1. Get the new list of images from the form
    const newGallery = formData.getAll("gallery") as string[];
    
    // 2. Get the old list from DB
    const oldGallery = existingEvent.gallery || [];

    // 3. Find images that are in OLD but NOT in NEW (User deleted them)
    const imagesToDelete = oldGallery.filter((url: string) => !newGallery.includes(url));

    // 4. Delete them from UploadThing to save space
    if (imagesToDelete.length > 0) {
      const keys = imagesToDelete.map(getFileKey).filter((k: string) => k !== "");
      if (keys.length > 0) {
        await deleteFilesFromUT(keys);
      }
    }

    // --- UPDATE DATABASE ---
    const updateData = {
      title: formData.get("title"),
      description: formData.get("description"),
      date: formData.get("date"),
      time: formData.get("time"),
      location: formData.get("location"),

      registrationOpen: formData.get("registrationOpen") === "true",
      isLive: formData.get("isLive") === "true",
      maxRegistrations: Number(formData.get("maxRegistrations")) || 0,
      
      isTeamEvent: formData.get("isTeamEvent") === "true",
      minTeamSize: Number(formData.get("minTeamSize")) || 1,
      maxTeamSize: Number(formData.get("maxTeamSize")) || 1,

      rules: formData.getAll("rules") as string[],
      gallery: newGallery, // Save the new list
    };

    await Event.findByIdAndUpdate(id, updateData, { new: true });

    revalidatePath("/admin/dashboard-group/events");
    revalidatePath(`/events/${id}`);
    revalidatePath("/events");

    return { success: true, message: "Event Updated Successfully!" };

  } catch (error: any) {
    console.error("Update Event Error:", error);
    return { success: false, message: error.message || "Failed to update event" };
  }
}

// ==========================================
// 3. TOGGLE REGISTRATION STATUS
// ==========================================
export async function toggleEventRegistration(id: string) {
  try {
    await verifyAdmin();
    await dbConnect();
    
    const event = await Event.findById(id);
    if (!event) return { success: false, message: "Event not found" };

    event.registrationOpen = !event.registrationOpen;
    await event.save();

    revalidatePath("/admin/dashboard-group/events");
    revalidatePath(`/events/${id}`);
    
    return { 
      success: true, 
      message: `Registration is now ${event.registrationOpen ? "OPEN" : "CLOSED"}` 
    };
  } catch (error: any) {
    return { success: false, message: "Failed to toggle registration" };
  }
}

// ==========================================
// 4. ✅ NEW: TOGGLE ALIVE / DEAD STATUS
// ==========================================
export async function toggleEventStatus(id: string) {
  try {
    await verifyAdmin();
    await dbConnect();
    
    const event = await Event.findById(id);
    if (!event) return { success: false, message: "Event not found" };

    // Toggle the 'Alive' boolean
    event.isLive = !event.isLive;
    await event.save();

    revalidatePath("/admin/dashboard-group/events");
    revalidatePath(`/events/${id}`);
    revalidatePath("/events");
    
    return { 
      success: true, 
      message: `Event is now ${event.isLive ? "ALIVE (Active)" : "DEAD (Past/Hidden)"}` 
    };
  } catch (error: any) {
    console.error("Status Toggle Error:", error);
    return { success: false, message: "Failed to toggle event status" };
  }
}

// ==========================================
// 5. DELETE EVENT
// ==========================================
export async function deleteEvent(id: string) {
  try {
    await verifyAdmin();
    await dbConnect();

    const event = await Event.findById(id);
    if (!event) return { success: false, message: "Event not found" };

    // Cleanup Gallery Images
    const keysToDelete: string[] = [];
    if (event.gallery && event.gallery.length > 0) {
      event.gallery.forEach((imgUrl: string) => {
        const key = getFileKey(imgUrl);
        if (key) keysToDelete.push(key);
      });
    }

    if (keysToDelete.length > 0) await deleteFilesFromUT(keysToDelete);

    await Event.findByIdAndDelete(id);

    revalidatePath("/admin/dashboard-group/events");
    revalidatePath("/events");
    
    return { success: true, message: "Event deleted successfully" };

  } catch (error: any) {
    return { success: false, message: "Failed to delete event" };
  }
}


export async function getEventById(id: string) {
  try {
    await dbConnect();

    // 1. Find by ID
    // .lean() converts the Mongoose Document to a plain JS object instantly
    const event = await Event.findById(id).lean();

    if (!event) return null;

    // 2. Transform Data for Frontend
    // We must convert the _id (ObjectId) to a string ("id")
    return {
      id: event._id.toString(), // ⚠️ Important: Convert ObjectId to String
      title: event.title,
      description: event.description,
      
      // Strings
      date: event.date,
      time: event.time,
      location: event.location,
      
      // Booleans
      isLive: event.isLive,
      registrationOpen: event.registrationOpen,
      
      // Numbers
      maxRegistrations: event.maxRegistrations,
      
      // Team Logic
      isTeamEvent: event.isTeamEvent,
      minTeamSize: event.minTeamSize,
      maxTeamSize: event.maxTeamSize,
      
      // Arrays
      gallery: event.gallery || [],
      rules: event.rules || [],
    };

  } catch (error) {
    console.error("Error fetching event:", error);
    return null;
  }
}