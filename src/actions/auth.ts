"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT } from "jose";
import bcrypt from "bcrypt";
import connectToDatabase from "@/lib/db";
import Admin from "@/models/Admin";

const JWT_SECRET = process.env.JWT_SECRET;

// 1. LOGIN ACTION
export async function loginAdmin(prevState: any, formData: FormData) {
  if (!JWT_SECRET) {
    console.error("JWT_SECRET is not defined in environment variables.");
    return { success: false, message: "Server Configuration Error" };
  }

  // The form uses 'username' for the email field
  const email = (formData.get("username") as string).toLowerCase().trim();
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, message: "Email and password are required." };
  }

  try {
    await connectToDatabase();

    const admin = await Admin.findOne({ email });
    if (!admin) {
      // Use a generic message to prevent email enumeration attacks
      return { success: false, message: "Invalid credentials." };
    }

    // Robustly retrieve password hash (handles Mongoose schema caching issues in dev)
    // If the schema is stale (lowercase 'passwordhash'), admin.passwordHash might be undefined
    // even if the DB document has it. admin.toObject() gives us the raw data.
    const hash = admin.passwordHash || (admin.toObject() as any).passwordHash;

    if (!hash) {
        console.error(`❌ Admin found (${email}) but password hash is missing.`);
        return { success: false, message: "Account configuration error." };
    }

    const isPasswordValid = await bcrypt.compare(password, hash);
    if (!isPasswordValid) {
      return { success: false, message: "Invalid credentials." };
    }

    // Credentials are valid, create JWT
    const secret = new TextEncoder().encode(JWT_SECRET);
    const token = await new SignJWT({ id: admin._id, role: admin.role, email: admin.email })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1d")
      .sign(secret);

    // Set the JWT in a secure, http-only cookie
    const cookieStore = await cookies();

    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return { success: true };
  } catch (error) {
    console.error("Login Error:", error);
    return { success: false, message: "An internal server error occurred." };
  }
}

// 2. LOGOUT ACTION
export async function logoutAdmin() {
  // Delete the new authentication token
  cookieStore.delete("auth_token");

  // Redirect back to login page for a better UX
  redirect("/admin/login");
}