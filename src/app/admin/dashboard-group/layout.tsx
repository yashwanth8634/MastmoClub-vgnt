import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Calendar, Users, FileText, LogOut, Database } from "lucide-react";
import { logoutAdmin } from "@/actions/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // 1. SECURITY CHECK: Read the cookie
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token");

  // If no token, kick them out to login
  if (!token) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-black text-white flex font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-white/10 bg-[#050505] hidden md:flex flex-col">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold tracking-widest">MASTMO <span className="text-[#00f0ff]">ADMIN</span></h2>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <NavLink href="/admin/dashboard-group/dashboard" icon={LayoutDashboard}>Dashboard</NavLink>
          <NavLink href="/admin/dashboard-group/events" icon={Calendar}>Events Manager</NavLink>
          <NavLink href="/admin/dashboard-group/team" icon={Users}>Team Manager</NavLink>
          <NavLink href="/admin/dashboard-group/registrations" icon={FileText}>Registrations</NavLink>
          <NavLink href="/admin/dashboard-group/members" icon={Users}>Membership Requests</NavLink>
          <NavLink href="/admin/dashboard-group/backup" icon={Database}>Backup & Recovery</NavLink>
        </nav>

        <div className="p-4 border-t border-white/10">
          <form action={logoutAdmin}>
            <button className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer">
              <LogOut size={18} /> Logout
            </button>
          </form>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header (Visible only on small screens) */}
        <header className="h-16 border-b border-white/10 flex items-center px-6 md:hidden justify-between">
          <span className="font-bold">Admin Panel</span>
          <form action={logoutAdmin}>
            <button className="text-red-400 text-xs">Logout</button>
          </form>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10 bg-black">
          {children}
        </main>
      </div>

    </div>
  );
}

// Helper Component for Sidebar Links
function NavLink({ href, icon: Icon, children }: any) {
  return (
    <Link 
      href={href} 
      className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
    >
      <Icon size={18} /> {children}
    </Link>
  );
}