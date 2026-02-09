"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { useAuthStore } from "@/store/authStore";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Simple client-side auth guard
    if (!isAuthenticated) {
      router.push("/login");
    } else {
      setIsChecking(false);
    }
  }, [isAuthenticated, router]);

  if (isChecking) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#09090b] gap-4">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="text-muted-foreground text-sm font-medium animate-pulse">
          Securing session...
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto relative">
        {/* Abstract subtle background decorations for main content */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
        {children}
      </main>
    </div>
  );
}
