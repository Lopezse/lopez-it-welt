"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { usePathname } from "next/navigation";

// Seiten die KEIN Admin-Layout brauchen (kein Sidebar)
const NO_LAYOUT_PAGES = ["/admin/login", "/admin/setup-2fa"];

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Login und 2FA-Setup: Nur children rendern (kein AdminLayout)
  if (NO_LAYOUT_PAGES.some(page => pathname?.startsWith(page))) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "#050509" }}>
        {children}
      </div>
    );
  }
  
  // Alle anderen Admin-Seiten: Mit AdminLayout (Sidebar etc.)
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#050509" }}>
      <AdminLayout>{children}</AdminLayout>
    </div>
  );
}
