"use server";

import dbConnect from "@/lib/db";
import Event from "@/models/Event"; // Import the model we just created
import { revalidatePath } from "next/cache";
import { verifyAdmin } from "@/lib/auth"; // Assuming you have this
import { deleteFilesFromUT } from "@/lib/utapi-server"; 


import { z } from "zod";

// Zod Schema for Event
const EventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  description: z.string().min(1, "Description is required."),
  date: z.string().min(1, "Date is required."),
  time: z.string().min(1, "Time is required."),
  location: z.string().min(1, "Location is required."),
  registrationOpen: z.boolean(),
  isLive: z.boolean(),
  maxRegistrations: z.number().min(0).default(0),
  isTeamEvent: z.boolean(),
  minTeamSize: z.number().min(1).default(1),
  maxTeamSize: z.number().min(1).default(1),
  rules: z.array(z.string()),
  gallery: z.array(z.string()),
});

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
    const rawData = {
      title: formData.get("title"),
      description: formData.get("description"),
      date: formData.get("date"),
      time: formData.get("time"),
      location: formData.get("location"),
      registrationOpen: formData.get("registrationOpen") === "true",
      isLive: formData.get("isLive") === "false" ? false : true,
      maxRegistrations: Number(formData.get("maxRegistrations")) || 0,
      isTeamEvent: formData.get("isTeamEvent") === "true",
      minTeamSize: Number(formData.get("minTeamSize")) || 1,
      maxTeamSize: Number(formData.get("maxTeamSize")) || 1,
      rules: formData.getAll("rules"),
      gallery: formData.getAll("gallery"),
    };

    // 3. Zod Validation
    const validatedData = EventSchema.parse(rawData);

    const newEvent = await Event.create(validatedData);

    // 4. Revalidate Frontend
    revalidatePath("/admin/dashboard-group/events");
    revalidatePath("/events");
    
    return { success: true, message: "Event Created Successfully!" };

  } catch (error: any) {
    console.error("Create Event Error:", error);
    if (error instanceof z.ZodError) {
        return { success: false, message: error.issues[0]?.message || "Validation Error" };
    }
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
    const newGallery = formData.getAll("gallery") as string[];
    const oldGallery = existingEvent.gallery || [];
    const imagesToDelete = oldGallery.filter((url: string) => !newGallery.includes(url));

    if (imagesToDelete.length > 0) {
      const keys = imagesToDelete.map(getFileKey).filter((k: string) => k !== "");
      if (keys.length > 0) {
        await deleteFilesFromUT(keys);
      }
    }

    // --- UPDATE DATABASE ---
    const rawUpdateData = {
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
      rules: formData.getAll("rules"),
      gallery: newGallery,
    };

    // Zod Validation
    const validatedData = EventSchema.parse(rawUpdateData);

    await Event.findByIdAndUpdate(id, validatedData, { new: true });

    revalidatePath("/admin/dashboard-group/events");
    revalidatePath(`/events/${id}`);
    revalidatePath("/events");

    return { success: true, message: "Event Updated Successfully!" };

  } catch (error: any) {
    console.error("Update Event Error:", error);
    if (error instanceof z.ZodError) {
        return { success: false, message: error.issues[0]?.message || "Validation Error" };
    }
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