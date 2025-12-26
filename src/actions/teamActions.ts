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

    // ✅ FIX: Check BOTH 'image' and 'imageUrl' keys
    // This ensures we catch the URL regardless of what the frontend named it.
    const image = (formData.get("image") as string) || (formData.get("imageUrl") as string);

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
      image: image, // ✅ Now guaranteed to have the URL if sent
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

// 2. DELETE MEMBER (Stays same - correct logic)
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

    // ✅ CATEGORY FIX: Ensure we explicitly grab the category from the form
    // If the form doesn't send it, it will default to the existing value
    const category = (formData.get("category") as string) || existingMember.category;

    // ✅ ORDER FIX: Convert to Number explicitly
    const order = formData.get("order") !== null 
      ? Number(formData.get("order")) 
      : existingMember.order;

    let newImage = (formData.get("image") as string) || (formData.get("imageUrl") as string);
    
    if (!newImage || newImage.trim() === "") {
        newImage = existingMember.image;
    }

    // Cleanup old images if changed
    const oldImage = existingMember.image;
    if (newImage && oldImage && newImage !== oldImage) {
      const key = getFileKey(oldImage);
      if (key) await deleteFilesFromUT([key]); // Pass as array if your helper expects it
    }

    const data = {
      name: formData.get("name") as string,
      role: formData.get("role") as string,
      details: formData.get("details") as string,
      category: category, // ✅ Uses resolved category
      image: newImage,
      socials: {
        linkedin: (formData.get("linkedin") as string) || "",
        github: (formData.get("github") as string) || "",
        email: (formData.get("email") as string) || "",
        instagram: (formData.get("instagram") as string) || "",
      },
      order: order, // ✅ Uses resolved order
    };

    await TeamMember.findByIdAndUpdate(id, data, { new: true });

    revalidatePath("/admin/dashboard-group/team"); 
    revalidatePath("/team"); 

    return { success: true, message: "Member updated!" };
  } catch (error: any) {
    return { success: false, message: "Update failed: " + error.message };
  }
}

export async function getTeamMember(id: string) {
  try {
    if (!id) throw new Error("No ID provided");
    
    await dbConnect();

    // 1. Fetch the member
    const member = await TeamMember.findById(id).lean();

    if (!member) {
      console.error(`❌ Team Member with ID ${id} not found.`);
      return null;
    }

    // 2. 🛡️ SERIALIZATION FIX: Convert ObjectId & Dates to String
    // Next.js Client Components cannot accept Date objects or Mongo _id objects.
    return {
      ...member,
      _id: member._id.toString(),
      createdAt: member.createdAt?.toString(),
      updatedAt: member.updatedAt?.toString(),
    };

  } catch (error) {
    console.error("❌ ERROR Fetching Team Member:", error);
    return null; // This triggers the "Could not be loaded" screen
  }
}