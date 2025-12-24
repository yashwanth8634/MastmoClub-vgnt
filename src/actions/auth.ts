"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// 1. LOGIN ACTION
// Added 'prevState' to make it compatible with the useFormState hook
export async function loginAdmin(prevState: any, formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  // 🔒 SECURITY FIX: Removed console.log of the password.
  // Never log sensitive credentials!

  const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD; 

  // Safety Check: Ensure .env variables exist
  if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
    console.error("❌ Admin credentials are missing in .env file");
    return { success: false, message: "Server Configuration Error" };
  }

  // Credentials Check
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const cookieStore = await cookies();
    
    // Set the cookie
    cookieStore.set("admin_session", "true", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    return { success: true };
  } else {
    return { success: false, message: "Invalid Username or Password" };
  }
}

// 2. LOGOUT ACTION
export async function logoutAdmin() {
  const cookieStore = await cookies();
  
  // Delete the session cookie
  cookieStore.delete("admin_session");

  // Redirect back to login page
  redirect("/admin/login");
}