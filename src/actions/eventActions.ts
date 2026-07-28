"use server";

import dbConnect from "@/lib/db";
import Event from "@/models/Event"; // Import the model we just created
import { revalidatePath, revalidateTag } from "next/cache";
import { verifyAdmin } from "@/lib/auth"; // Assuming you have this
import { deleteFilesFromUT } from "@/lib/utapi-server"; 
import { failureResult, getErrorMessage, successResult } from "@/lib/actionState";
import { logger } from "@/lib/logger";
import { z } from "zod";

const todayIsoDate = new Date().toISOString().split("T")[0];
const currentYear = new Date().getUTCFullYear();
const minAllowedDate = `${currentYear - 1}-01-01`;
const maxAllowedDate = `${currentYear + 5}-12-31`;

// Zod Schema for Event
const EventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  description: z.string().min(1, "Description is required."),
  date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a valid event date.")
    .refine((value) => value >= minAllowedDate && value <= maxAllowedDate, {
      message: `Event date must be between ${minAllowedDate} and ${maxAllowedDate}.`,
    }),
  time: z.string().regex(/^(0?[1-9]|1[0-2]):[0-5]\d\s?(AM|PM)$/i, "Choose a valid event time."),
  location: z.string().trim().min(3, "Location must be at least 3 characters."),
  registrationRequired: z.boolean(),
  registrationOpen: z.boolean(),
  isLive: z.boolean(),
  maxRegistrations: z.number().min(0).default(0),
  isTeamEvent: z.boolean(),
  minTeamSize: z.number().min(1).default(1),
  maxTeamSize: z.number().min(1).default(1),
  rules: z.array(z.string()),
  gallery: z.array(z.string()),
}).superRefine((data, ctx) => {
  if (data.isTeamEvent && data.minTeamSize > data.maxTeamSize) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["minTeamSize"],
      message: "Minimum team size cannot be greater than maximum team size.",
    });
  }

  if (data.isLive && data.date < todayIsoDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["date"],
      message: "A live event cannot use a past date. Hide the event instead.",
    });
  }

  if (data.registrationOpen && !data.registrationRequired) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["registrationOpen"],
      message: "Registration cannot be open when registration is not required.",
    });
  }

  if (data.registrationOpen && !data.isLive) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["registrationOpen"],
      message: "Hidden events must keep registration closed.",
    });
  }

  if (data.registrationRequired && data.maxRegistrations < 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["maxRegistrations"],
      message: "Maximum registrations cannot be negative.",
    });
  }
});

function applyEventBusinessRules<T extends {
  registrationRequired: boolean;
  registrationOpen: boolean;
  isLive: boolean;
  maxRegistrations: number;
  isTeamEvent: boolean;
  minTeamSize: number;
  maxTeamSize: number;
}>(data: T) {
  if (!data.registrationRequired) {
    data.registrationOpen = false;
    data.maxRegistrations = 0;
  }

  if (!data.isLive) {
    data.registrationOpen = false;
  }

  if (!data.isTeamEvent) {
    data.minTeamSize = 1;
    data.maxTeamSize = 1;
  }

  return data;
}

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
      registrationRequired: formData.get("registrationRequired") !== "false",
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
    const validatedData = applyEventBusinessRules(EventSchema.parse(rawData));

    await Event.create(validatedData);

    // 4. Revalidate Frontend
    revalidatePath("/admin/dashboard-group/events");
    revalidatePath("/events");
    revalidateTag("events", "max");
    
    return successResult("Event Created Successfully!");

  } catch (error: unknown) {
    logger.error("Create event action failed", error);
    return failureResult(getErrorMessage(error, "Failed to create event"));
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
      registrationRequired: formData.get("registrationRequired") !== "false",
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
    const validatedData = applyEventBusinessRules(EventSchema.parse(rawUpdateData));

    await Event.findByIdAndUpdate(id, validatedData, { new: true });

    revalidatePath("/admin/dashboard-group/events");
    revalidatePath(`/events/${id}`);
    revalidatePath("/events");
    revalidateTag("events", "max");

    return successResult("Event Updated Successfully!");

  } catch (error: unknown) {
    logger.error("Update event action failed", error, { id });
    return failureResult(getErrorMessage(error, "Failed to update event"));
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
    if (!event) return failureResult("Event not found");
    if (!event.registrationRequired) {
      return failureResult("This event does not require registration");
    }
    if (!event.isLive) {
      return failureResult("Hidden events must keep registration closed");
    }

    event.registrationOpen = !event.registrationOpen;
    await event.save();

    revalidatePath("/admin/dashboard-group/events");
    revalidatePath(`/events/${id}`);
    revalidateTag("events", "max");
    
    return successResult(
      `Registration is now ${event.registrationOpen ? "OPEN" : "CLOSED"}`,
    );
  } catch (error: unknown) {
    logger.error("Toggle event registration failed", error, { id });
    return failureResult("Failed to toggle registration");
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
    if (!event) return failureResult("Event not found");

    // Toggle the 'Alive' boolean
    event.isLive = !event.isLive;
    if (!event.isLive) {
      event.registrationOpen = false;
    }
    await event.save();

    revalidatePath("/admin/dashboard-group/events");
    revalidatePath(`/events/${id}`);
    revalidatePath("/events");
    revalidateTag("events", "max");
    
    return successResult(
      `Event is now ${event.isLive ? "ALIVE (Active)" : "DEAD (Past/Hidden)"}`,
    );
  } catch (error: unknown) {
    logger.error("Toggle event status failed", error, { id });
    return failureResult("Failed to toggle event status");
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
    if (!event) return failureResult("Event not found");

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
    revalidateTag("events", "max");
    
    return successResult("Event deleted successfully");

  } catch (error: unknown) {
    logger.error("Delete event action failed", error, { id });
    return failureResult("Failed to delete event");
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
      registrationRequired: event.registrationRequired ?? true,
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

  } catch (error: unknown) {
    logger.error("Fetch event by id failed", error, { id });
    return null;
  }
}

// ==========================================
// 6. GET ACTIVE EVENTS FOR DROPDOWN
// ==========================================
export async function getActiveEventsLight() {
  try {
    await dbConnect();
    const events = await Event.find({ isLive: true }).select("_id title").lean();
    return events.map(e => ({
      id: e._id.toString(),
      title: e.title,
    }));
  } catch (error) {
    logger.error("Failed to fetch active events", error);
    return [];
  }
}

