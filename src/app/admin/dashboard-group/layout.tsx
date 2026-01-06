import { verifyAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar"; // Import Client Sidebar

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // 1. Server-Side Security Check
  try {
    await verifyAdmin();
  } catch (error) {
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