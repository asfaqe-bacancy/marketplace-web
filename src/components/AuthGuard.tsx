"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Skip redirect for login and register pages
    if (
      !isLoading &&
      !isAuthenticated &&
      !pathname.includes("/auth/login") &&
      !pathname.includes("/auth/register")
    ) {
      router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  // Show loading or children based on auth state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1c219e]"></div>
      </div>
    );
  }

  // If on auth pages or authenticated, show children
  if (pathname.includes("/auth/") || isAuthenticated) {
    return <>{children}</>;
  }

  // Otherwise show nothing while redirecting
  return null;
}
