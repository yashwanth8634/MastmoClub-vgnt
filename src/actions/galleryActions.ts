"use server";

import dbConnect from "@/lib/db";
import Gallery from "@/models/Gallery";
import { revalidatePath } from "next/cache";
import { verifyAdmin } from "@/lib/auth";

// 1. SAVE IMAGE (Stores the URL from UploadThing)
export async function saveGalleryItem(title: string, category: string, imageUrl: string) {
  try {
    await verifyAdmin(); 
  } catch (e) {
    return { success: false, message: "Unauthorized" };
  }

  await dbConnect();

  try {
    if (!imageUrl) {
      return { success: false, message: "No image URL provided" };
    }

    await Gallery.create({
      title,
      category,
      imageUrl, // 👈 We just save the link string
    });

    revalidatePath("/gallery");
    revalidatePath("/admin/dashboard-group/gallery"); // If you have an admin list

    return { success: true, message: "Gallery item saved!" };

  } catch (error: any) {
    console.error("Gallery Save Error:", error);
    return { success: false, message: "Failed to save: " + error.message };
  }
}

// 2. DELETE IMAGE
export async function deleteGalleryItem(id: string) {
  try {
    await verifyAdmin();
  } catch (e) {
    return { success: false, message: "Unauthorized" };
  }

  await dbConnect();

  try {
    // We only delete the database record.
    // (Optional: You can use utapi.deleteFiles(fileKey) if you want to clean up UploadThing too, 
    // but usually just deleting the DB entry is enough for small apps).
    await Gallery.findByIdAndDelete(id);

    revalidatePath("/gallery");
    revalidatePath("/admin/dashboard-group/gallery");
    
    return { success: true, message: "Image deleted" };
  } catch (error) {
    return { success: false, message: "Failed to delete" };
  }
}