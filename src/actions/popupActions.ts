"use server";

import dbConnect from "@/lib/db";
import Popup from "@/models/Popup";
import { revalidatePath } from "next/cache";

export async function getPopup() {
  await dbConnect();
  let popup = await Popup.findOne();
  if (!popup) {
    popup = await Popup.create({
      title: "Welcome",
      description: "...",
      images: [],
      isActive: false
    });
  }
  return JSON.parse(JSON.stringify(popup));
}

export async function updatePopup(formData: FormData) {
  await dbConnect();

  const imagesJSON = formData.get("images") as string; // Receive as JSON string
  
  const data = {
    title: formData.get("title"),
    description: formData.get("description"),
    images: JSON.parse(imagesJSON || "[]"), // Convert back to Array
    isActive: formData.get("isActive") === "true",
  };

  await Popup.findOneAndUpdate({}, data, { upsert: true });

  revalidatePath("/");
  return { success: true };
}