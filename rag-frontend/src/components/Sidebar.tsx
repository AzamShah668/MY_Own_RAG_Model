"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  MessageSquare,
  Upload,
  History,
  Settings,
  LogOut,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";

const NAV_ITEMS = [
  { icon: BarChart3, label: "Dashboard", href: "/" },
  { icon: MessageSquare, label: "Chat", href: "/chat" },
  { icon: Upload, label: "Upload PDF", href: "/upload" },
  { icon: History, label: "History", href: "/history" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <aside className="w-64 glass-dark border-r border-white/5 flex flex-col h-screen sticky top-0">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
            <Sparkles size={18} fill="currentColor" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
            AXM Enterprises
          </h1>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1.5 mt-4">
        {NAV_ITEMS.map((item) => (
          <SidebarLink
            key={item.href}
            icon={<item.icon size={20} />}
            label={item.label}
            href={item.href}
            active={pathname === item.href}
          />
        ))}
      </nav>

      <div className="p-4 border-t border-white/5 space-y-4">
        {/* User Profile */}
        <div className="flex items-center gap-3 p-2 rounded-xl group hover:bg-white/5 transition-colors cursor-default">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center text-white font-semibold text-sm shadow-md">
            {user?.name?.slice(0, 2).toUpperCase() || "UN"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name || "Guest User"}</p>
            <p className="text-[10px] text-muted-foreground truncate uppercase font-bold tracking-wider">
              Pro Member
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all group"
        >
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

function SidebarLink({ icon, label, href, active }: { icon: React.ReactNode, label: string, href: string, active: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-300 group relative",
        active
          ? "bg-primary text-white shadow-xl shadow-primary/20"
          : "text-muted-foreground hover:text-foreground hover:bg-white/5"
      )}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      {active && <ChevronRight size={14} className="opacity-50" />}
    </Link>
  );
}
