"use server";

import dbConnect from "@/lib/db";
import Gallery from "@/models/Gallery";
import { revalidatePath } from "next/cache";
import { verifyAdmin } from "@/lib/auth";
import { failureResult, getErrorMessage, successResult } from "@/lib/actionState";
import { logger } from "@/lib/logger";

// 1. SAVE IMAGE (Stores the URL from UploadThing)
export async function saveGalleryItem(title: string, category: string, imageUrl: string) {
  try {
    await verifyAdmin(); 
  } catch {
    return failureResult("Unauthorized");
  }

  await dbConnect();

  try {
    // ✅ Validation: Ensure all fields are present
    if (!imageUrl || !title || !category) {
      return failureResult("Missing required fields (Title, Category, or Image)");
    }

    await Gallery.create({
      title,
      category,
      imageUrl,
    });

    revalidatePath("/gallery");
    revalidatePath("/admin/dashboard-group/gallery");

    return successResult("Gallery item saved!");

  } catch (error: unknown) {
    logger.error("Gallery save action failed", error, { title, category });
    return failureResult(`Failed to save: ${getErrorMessage(error, "Unknown error")}`);
  }
}

// 2. DELETE IMAGE
export async function deleteGalleryItem(id: string) {
  try {
    await verifyAdmin();
  } catch {
    return failureResult("Unauthorized");
  }

  await dbConnect();

  try {
    const result = await Gallery.findByIdAndDelete(id);
    
    if (!result) {
      return failureResult("Image not found");
    }

    revalidatePath("/gallery");
    revalidatePath("/admin/dashboard-group/gallery");
    
    return successResult("Image deleted");
  } catch (error: unknown) {
    logger.error("Gallery delete action failed", error, { id });
    return failureResult("Failed to delete");
  }
}
