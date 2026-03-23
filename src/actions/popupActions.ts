"use server";

import dbConnect from "@/lib/db";
import Popup from "@/models/Popup";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { verifyAdmin } from "@/lib/auth"; // ✅ Import Auth Check
import { failureResult, successResult } from "@/lib/actionState";
import { logger } from "@/lib/logger";

interface PopupData {
  isActive: boolean;
  title: string;
  description: string;
  images: string[];
}

const getCachedPopup = unstable_cache(
  async (): Promise<PopupData | null> => {
    await dbConnect();

    const popup = await Popup.findOne({})
      .select("isActive title description images")
      .lean()
      .maxTimeMS(2000);

    if (!popup) {
      return null;
    }

    return {
      isActive: Boolean(popup.isActive),
      title: String(popup.title || ""),
      description: String(popup.description || ""),
      images: Array.isArray(popup.images)
        ? popup.images.filter(
            (image: unknown): image is string => typeof image === "string",
          )
        : [],
    };
  },
  ["global-popup"],
  {
    revalidate: 300,
    tags: ["popup"],
  },
);

// 1. FETCH POPUP (Public - No Auth Needed)
export async function getPopup() {
  try {
    return await getCachedPopup();
  } catch (error: unknown) {
    logger.error("Failed to fetch popup", error);
    return null;
  }
}

// 2. TOGGLE STATUS (Protected)
export async function togglePopup(id: string, currentStatus: boolean) {
  try {
    await verifyAdmin();
  } catch {
    return failureResult("Unauthorized");
  } // ✅ Security Check
  
  await dbConnect();

  try {
    await Popup.findByIdAndUpdate(id, { isActive: !currentStatus });
    revalidatePath("/", "layout"); 
    revalidateTag("popup", "max");
    return successResult();
  } catch (error: unknown) {
    logger.error("Failed to toggle popup", error, { id, currentStatus });
    return failureResult("Failed to toggle");
  }
}

// 3. UPDATE POPUP CONTENT (Protected)
export async function updatePopup(formData: FormData) {
  try {
    await verifyAdmin();
  } catch {
    return failureResult("Unauthorized");
  } // ✅ Security Check

  await dbConnect();

  try {
    const imagesRaw = formData.get("imagesJSON") as string;
    const images = imagesRaw ? JSON.parse(imagesRaw) : [];

    const existingPopup = await Popup.findOne({});

    const data = {
      title: formData.get("title"),
      description: formData.get("description"),
      images: images,
      isActive: true, 
    };

    if (existingPopup) {
      await Popup.findByIdAndUpdate(existingPopup._id, data);
    } else {
      await Popup.create(data);
    }

    revalidatePath("/", "layout");
    revalidateTag("popup", "max");
    return successResult("Popup updated successfully");
  } catch (error: unknown) {
    logger.error("Failed to update popup", error);
    return failureResult("Failed to update popup");
  }
}
