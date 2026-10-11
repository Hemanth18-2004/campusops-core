"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user");
      if (stored) {
        try {
          const user = JSON.parse(stored);
          if (user.role === "admin") {
            router.replace("/dashboard/admin");
            return;
          }
          if (user.role === "faculty") {
            router.replace("/dashboard/faculty");
            return;
          }
          router.replace("/dashboard/student");
          return;
        } catch (e) {
          console.error(e);
        }
      }
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="flex h-96 flex-col items-center justify-center gap-3">
      <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      <p className="text-sm text-slate-500 font-medium">Navigating to your dashboard...</p>
    </div>
  );
}