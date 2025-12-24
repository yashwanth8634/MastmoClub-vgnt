"use server";

import dbConnect from "@/lib/db";
import TeamMember from "@/models/TeamMember";
import { revalidatePath } from "next/cache";
import { verifyAdmin } from "@/lib/auth"; 
import { deleteFilesFromUT } from "@/lib/utapi-server"; 

const getFileKey = (url: string) => {
  if (!url || !url.includes("utfs.io")) return null;
  return url.split("/").pop();
};

// 1. CREATE MEMBER
export async function createTeamMember(formData: FormData) {
  try {
    await verifyAdmin();
    await dbConnect();

    const socials = {
      linkedin: formData.get("linkedin"),
      github: formData.get("github"),
      email: formData.get("email"),
      instagram: formData.get("instagram"),
    };

    await TeamMember.create({
      name: formData.get("name"),
      role: formData.get("role"),
      details: formData.get("details"),
      category: formData.get("category"),
      image: formData.get("image"),
      socials: socials,
      order: Number(formData.get("order")) || 0,
    });

    revalidatePath("/admin/dashboard-group/team");
    revalidatePath("/team");
    
    return { success: true };
  } catch (error: any) {
    return { success: false, message: "Failed to add member" };
  }
}

// 2. DELETE MEMBER
export async function deleteTeamMember(id: string) {
  try {
    await verifyAdmin();
    await dbConnect();

    const member = await TeamMember.findById(id);
    if (!member) return { success: false, message: "Member not found" };

    if (member.image) {
      const key = getFileKey(member.image);
      if (key) {
        await deleteFilesFromUT(key);
      }
    }
    
    await TeamMember.findByIdAndDelete(id);
    
    revalidatePath("/admin/dashboard-group/team"); 
    revalidatePath("/team");
    
    return { success: true };
  } catch (error) {
    return { success: false, message: "Failed to delete" };
  }
} 

// 3. UPDATE MEMBER
export async function updateTeamMember(id: string, formData: FormData) {
  try {
    await verifyAdmin();
    await dbConnect();

    const existingMember = await TeamMember.findById(id);
    if (!existingMember) return { success: false, message: "Member not found" };

    // ✅ FIX BUG #2 (Accidental Wipe): Safety Check
    let newImage = formData.get("image") as string;
    
    // If form sent empty/null, it's likely a mistake. Keep the old image.
    if (!newImage || newImage.trim() === "") {
        newImage = existingMember.image;
    }

    // 🗑️ Smart Deletion: Only delete if we have a valid NEW image that is DIFFERENT
    const oldImage = existingMember.image;
    if (newImage && oldImage && newImage !== oldImage) {
      const key = getFileKey(oldImage);
      if (key) {
        await deleteFilesFromUT(key);
      }
    }

    const socials = {
      linkedin: formData.get("linkedin") || "",
      github: formData.get("github") || "",
      email: formData.get("email") || "",
      instagram: formData.get("instagram") || "",
    };

    const data = {
      name: formData.get("name"),
      role: formData.get("role"),
      details: formData.get("details"),
      category: formData.get("category"),
      image: newImage, // ✅ Uses safe variable
      socials: socials,
      order: Number(formData.get("order")) || 0,
    };

    await TeamMember.findByIdAndUpdate(id, data, { new: true });

    revalidatePath("/admin/dashboard-group/team"); 
    revalidatePath("/team"); 

    return { success: true, message: "Member updated!" };
  } catch (error: any) {
    return { success: false, message: "Update failed: " + error.message };
  }
}