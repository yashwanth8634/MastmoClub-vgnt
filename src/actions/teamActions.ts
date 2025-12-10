"use server";

import dbConnect from "@/lib/db";
import TeamMember from "@/models/TeamMember";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// 1. CREATE MEMBER
export async function createTeamMember(formData: FormData) {
  await dbConnect();

  const name = formData.get("name");
  const role = formData.get("role");
  const details = formData.get("details"); // Roll No or Class
  const category = formData.get("category"); // faculty, core, coordinator, support
  const image = formData.get("image"); // URL (for now manually entered or placeholder)
  
  const socials = {
    linkedin: formData.get("linkedin"),
    github: formData.get("github"),
    email: formData.get("email"),
    instagram: formData.get("instagram"),
  };

  try {
    await TeamMember.create({
      name, role, details, category, image, socials
    });
  } catch (error) {
    return { success: false, message: "Failed to add member" };
  }

  revalidatePath("/admin/team");
  revalidatePath("/team"); // Update public page
  return { success: true };
}

// 2. DELETE MEMBER
export async function deleteTeamMember(id: string) {
  await dbConnect();
  try {
    await TeamMember.findByIdAndDelete(id);
    revalidatePath("/admin/team");
    revalidatePath("/team");
    return { success: true };
  } catch (error) {
    return { success: false, message: "Failed to delete" };
  }
}

// 3. UPDATE MEMBER
// 3. UPDATE MEMBER
export async function updateTeamMember(id: string, formData: FormData) {
  await dbConnect();

  // Construct socials object, filtering out empty strings if needed
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
    image: formData.get("image"),
    socials: socials,
  };

  try {
    await TeamMember.findByIdAndUpdate(id, data, { new: true });
  } catch (error) {
    console.error("Update failed:", error);
    return { success: false, message: "Failed to update member" };
  }

  revalidatePath("/admin/team");
  revalidatePath("/team");
  return { success: true };
}