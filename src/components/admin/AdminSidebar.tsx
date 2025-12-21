"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAdmin } from "@/actions/auth"; 
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  FileText, 
  UserPlus, 
  Database, 
  LogOut, 
  Shield 
} from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();

  // ✅ Updated Menu to match your screenshot
  const menuItems = [
    { 
      name: "Dashboard", 
      href: "/admin/dashboard-group/dashboard", 
      icon: LayoutDashboard 
    },
    { 
      name: "Events Manager", 
      href: "/admin/dashboard-group/events", 
      icon: Calendar 
    },
    { 
      name: "Team Manager", 
      href: "/admin/dashboard-group/team", 
      icon: Users 
    },
    { 
      name: "Registrations", 
      href: "/admin/dashboard-group/registrations", 
      icon: FileText 
    },
    { 
      name: "Membership Requests", 
      href: "/admin/dashboard-group/members", // Mapping requests to members page
      icon: UserPlus 
    },
    { 
      name: "Backup & Recovery", 
      href: "/admin/dashboard-group/backup", 
      icon: Database 
    },
    { 
      name: "PopUp", 
      href: "/admin/dashboard-group/popup", 
      icon: Database 
    }
  ];

  return (
    <aside className="w-64 bg-black border-r border-white/10 flex flex-col h-screen fixed left-0 top-0 overflow-y-auto">
      
      {/* Header */}
      <div className="p-6 border-b border-white/10 flex items-center gap-3">
        <div className="w-10 h-10 bg-[#00f0ff]/10 rounded-lg flex items-center justify-center text-[#00f0ff]">
          <Shield size={20} />
        </div>
        <div>
          <h2 className="font-bold text-white tracking-wider">ADMIN</h2>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">Control Panel</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          // Check if the current path starts with the link (keeps it active for sub-pages)
          const isActive = pathname.startsWith(item.href);
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                isActive 
                  ? "bg-[#00f0ff] text-black shadow-[0_0_15px_rgba(0,240,255,0.4)]" 
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={() => logoutAdmin()}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all font-medium text-sm"
        >
          <LogOut size={18} /> 
          Sign Out
        </button>
      </div>
    </aside>
  );
}