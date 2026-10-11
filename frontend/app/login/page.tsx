"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, Shield, BookOpen, ArrowRight, Lock, Mail, Loader2, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/src/lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function performLogin(loginEmail: string, loginPass: string) {
    try {
      setLoading(true);
      setError("");

      const res = await api.post("/auth/login", {
        email: loginEmail,
        password: loginPass,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success(`Welcome back, ${res.data.user.name}!`);

      switch (res.data.user.role) {
        case "admin":
          router.push("/dashboard/admin");
          break;
        case "faculty":
          router.push("/dashboard/faculty");
          break;
        default:
          router.push("/dashboard/student");
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "Invalid email or password";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    performLogin(email, password);
  }

  // Quick Demo Logins
  function handleDemoLogin(role: "admin" | "faculty" | "student") {
    if (role === "admin") {
      setEmail("admin@campusops.com");
      setPassword("admin123");
      performLogin("admin@campusops.com", "admin123");
    } else if (role === "faculty") {
      setEmail("faculty@campusops.com");
      setPassword("faculty123");
      performLogin("faculty@campusops.com", "faculty123");
    } else {
      setEmail("student@campusops.com");
      setPassword("student123");
      performLogin("student@campusops.com", "student123");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-900 p-4 relative overflow-hidden">
      {/* Background radial gradient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md rounded-2xl bg-white p-8 sm:p-10 shadow-2xl border border-slate-100 relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-linear-to-br from-indigo-500 via-indigo-600 to-purple-600 items-center justify-center text-white shadow-lg shadow-indigo-500/25">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">CampusOps</h1>
          <p className="text-xs text-slate-500 font-medium">Academic Management & Instructional Intelligence</p>
        </div>

        {error && (
          <div className="rounded-xl bg-rose-50 border border-rose-200 p-3.5 text-xs text-rose-700 font-medium">
            {error}
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                placeholder="name@campusops.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Account Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] transition-all shadow-md shadow-indigo-600/20 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign In to Portal
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Instant Demo Logins */}
        <div className="pt-2 border-t border-slate-100 space-y-2.5">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <span>One-Click Test Accounts</span>
            <Sparkles className="w-3 h-3 text-amber-500" />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin("admin")}
              className="px-2 py-2 rounded-xl border border-rose-200 bg-rose-50/70 hover:bg-rose-100 text-rose-700 text-xs font-semibold flex flex-col items-center gap-1 transition-colors"
            >
              <Shield className="w-4 h-4 text-rose-600" />
              Admin
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin("faculty")}
              className="px-2 py-2 rounded-xl border border-amber-200 bg-amber-50/70 hover:bg-amber-100 text-amber-700 text-xs font-semibold flex flex-col items-center gap-1 transition-colors"
            >
              <BookOpen className="w-4 h-4 text-amber-600" />
              Faculty
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin("student")}
              className="px-2 py-2 rounded-xl border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold flex flex-col items-center gap-1 transition-colors"
            >
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              Student
            </button>
          </div>
        </div>

        {/* Register link */}
        <p className="text-center text-xs text-slate-500 pt-2">
          New to CampusOps?{" "}
          <Link
            href="/register"
            className="font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            Create an Account
          </Link>
        </p>
      </div>
    </main>
  );
}