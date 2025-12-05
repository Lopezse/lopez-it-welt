// =====================================================
// LOGIN LAYOUT - LOPEZ IT WELT
// =====================================================
// Zweck: Separates Layout für Login-Seite OHNE Sidebar
// Status: ✅ ENTERPRISE++ STANDARD
// =====================================================

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin-Login - Lopez IT Welt",
  description: "Sicherer Login für den Administrationsbereich",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  // Login-Seite hat KEIN AdminLayout (keine Sidebar)
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#050509" }}>
      {children}
    </div>
  );
}










