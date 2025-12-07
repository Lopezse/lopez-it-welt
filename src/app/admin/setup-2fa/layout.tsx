// =====================================================
// 2FA SETUP LAYOUT - LOPEZ IT WELT
// =====================================================
// Zweck: Separates Layout für 2FA-Setup OHNE Sidebar
// Status: ✅ ENTERPRISE++ STANDARD
// =====================================================

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "2FA-Setup - Lopez IT Welt",
  description: "Zwei-Faktor-Authentifizierung einrichten",
};

export default function Setup2FALayout({ children }: { children: React.ReactNode }) {
  // 2FA-Setup hat KEIN AdminLayout (keine Sidebar)
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#050509" }}>
      {children}
    </div>
  );
}
















