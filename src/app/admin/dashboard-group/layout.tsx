import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar"; // Import Client Sidebar

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // 1. Server-Side Security Check
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");

  if (!session || session.value !== "true") {
    redirect("/admin/login");
  }

  // 2. Render Structure
  return (
    <div className="min-h-screen bg-black text-white font-sans flex">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}