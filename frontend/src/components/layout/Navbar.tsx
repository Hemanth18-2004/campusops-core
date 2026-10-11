"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, User as UserIcon, Shield, GraduationCap, BookOpen } from "lucide-react";
import toast from "react-hot-toast";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<{ name?: string; email?: string; role?: string } | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user");
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    router.push("/login");
  }

  const roleBadge = () => {
    switch (user?.role) {
      case "admin":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <Shield className="w-3.5 h-3.5" />
            Admin
          </span>
        );
      case "faculty":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <BookOpen className="w-3.5 h-3.5" />
            Faculty
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <GraduationCap className="w-3.5 h-3.5" />
            Student
          </span>
        );
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-3.5 shadow-xs">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-bold text-slate-800 tracking-tight">
          CampusOps Management Portal
        </h2>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-3 border-r border-slate-200 pr-4">
            <div className="w-9 h-9 rounded-full bg-linear-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-sm font-semibold text-slate-800 leading-tight">
                {user.name || "User"}
              </div>
              <div className="text-xs text-slate-500">{user.email}</div>
            </div>
            {roleBadge()}
          </div>
        )}

        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          title="Sign out of CampusOps"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}