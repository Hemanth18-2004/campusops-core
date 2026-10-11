"use client";

import { useEffect, useState } from "react";
import { User, Mail, Shield, Calendar, CheckCircle2, Lock } from "lucide-react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const [user, setUser] = useState<{
    _id?: string;
    name?: string;
    email?: string;
    role?: string;
    isActive?: boolean;
    createdAt?: string;
  } | null>(null);

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

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Account Profile</h1>
        <p className="text-sm text-slate-500">View and verify your registered academic credentials.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Cover banner */}
        <div className="h-32 bg-linear-to-r from-indigo-600 via-indigo-700 to-purple-700 relative">
          <div className="absolute -bottom-10 left-8">
            <div className="w-20 h-20 rounded-2xl bg-white p-1.5 shadow-md">
              <div className="w-full h-full rounded-xl bg-linear-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-2xl uppercase">
                {user?.name ? user.name.charAt(0) : "U"}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-14 pb-8 px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">{user?.name || "Campus Member"}</h2>
              <p className="text-sm text-slate-500">{user?.email || "No email"}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                <Shield className="w-3.5 h-3.5" />
                {user?.role || "Student"}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Active Account
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
            <div className="space-y-1.5 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-4 h-4 text-slate-500" />
                Full Name
              </div>
              <div className="text-base font-semibold text-slate-800">{user?.name || "N/A"}</div>
            </div>

            <div className="space-y-1.5 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-slate-500" />
                Email Address
              </div>
              <div className="text-base font-semibold text-slate-800">{user?.email || "N/A"}</div>
            </div>

            <div className="space-y-1.5 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-slate-500" />
                Assigned Role
              </div>
              <div className="text-base font-semibold text-slate-800 capitalize">{user?.role || "Student"}</div>
            </div>

            <div className="space-y-1.5 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-slate-500" />
                Unique User Identifier
              </div>
              <div className="text-xs font-mono font-medium text-slate-700 truncate">{user?._id || "Local Session"}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
