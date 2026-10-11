"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  BookOpen,
  FolderKanban,
  FileText,
  Sparkles,
  ClipboardCheck,
  Award,
  User,
  Shield,
  Layers,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const [role, setRole] = useState<string>("student");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.role) setRole(parsed.role);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const adminLinks = [
    { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "User Management", href: "/dashboard/admin/users", icon: Users },
  ];

  const facultyLinks = [
    { label: "Faculty Hub", href: "/dashboard/faculty", icon: LayoutDashboard },
  ];

  const studentLinks = [
    { label: "Student Hub", href: "/dashboard/student", icon: LayoutDashboard },
  ];

  const roleLinks =
    role === "admin"
      ? adminLinks
      : role === "faculty"
      ? facultyLinks
      : studentLinks;

  return (
    <aside className="w-64 bg-slate-900 text-slate-200 border-r border-slate-800 flex flex-col shrink-0 min-h-screen">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
          <GraduationCap className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-1.5">
            CampusOps
          </h1>
          <span className="text-[11px] font-medium tracking-wide uppercase text-indigo-400">
            {role.toUpperCase()} PORTAL
          </span>
        </div>
      </div>

      {/* Nav List */}
      <div className="flex-1 px-3 py-6 space-y-6 overflow-y-auto">
        <div>
          <div className="px-3 mb-2 text-[11px] font-semibold tracking-wider uppercase text-slate-400">
            Navigation
          </div>
          <nav className="space-y-1">
            {roleLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Quick Portal Switcher (For Pair Testing) */}
        <div className="pt-4 border-t border-slate-800/60">
          <div className="px-3 mb-2 text-[11px] font-semibold tracking-wider uppercase text-slate-400">
            Available Dashboards
          </div>
          <div className="space-y-1">
            <Link
              href="/dashboard/admin"
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                pathname.startsWith("/dashboard/admin")
                  ? "bg-slate-800 text-rose-300 font-semibold"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-rose-400" />
              Admin Center
            </Link>
            <Link
              href="/dashboard/faculty"
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                pathname === "/dashboard/faculty"
                  ? "bg-slate-800 text-amber-300 font-semibold"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              Faculty Hub
            </Link>
            <Link
              href="/dashboard/student"
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                pathname === "/dashboard/student"
                  ? "bg-slate-800 text-indigo-300 font-semibold"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
              Student Portal
            </Link>
          </div>
        </div>

        {/* User Account */}
        <div className="pt-4 border-t border-slate-800/60">
          <div className="px-3 mb-2 text-[11px] font-semibold tracking-wider uppercase text-slate-400">
            Account
          </div>
          <Link
            href="/dashboard/profile"
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              pathname === "/dashboard/profile"
                ? "bg-indigo-600 text-white"
                : "text-slate-300 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <User className="w-4 h-4 text-slate-400" />
            My Profile
          </Link>
        </div>
      </div>

      {/* Footer info */}
      <div className="p-4 border-t border-slate-800/80 text-xs text-slate-500 text-center">
        CampusOps Core Edition v1.0
      </div>
    </aside>
  );
}