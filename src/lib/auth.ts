import { cookies } from "next/headers";

export async function verifyAdmin() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin_session")?.value === "true";
  
  if (!isAdmin) {
    throw new Error("Unauthorized: Admin access required");
  }
}