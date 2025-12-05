"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminNavigation from "./AdminNavigation";
import UserInfo from "./UserInfo";
import { FaLock, FaSpinner } from "react-icons/fa";

interface AdminLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
}

export default function AdminLayout({ children, pageTitle }: AdminLayoutProps) {
  const [currentTime, setCurrentTime] = useState<string>("");
  const pathname = usePathname();
  const router = useRouter();
  
  // =====================================================
  // ENTERPRISE++ AUTH CHECK
  // =====================================================
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Auth-Check Effect - Enterprise++ mit Server-Validierung
  useEffect(() => {
    const checkAuth = async () => {
      // Login-Seite braucht keine Auth-Prüfung
      if (pathname === "/admin/login" || pathname === "/admin/setup-2fa") {
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      }

      // Token aus Cookie prüfen (Client-seitig)
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("adm_token="))
        ?.split("=")[1];
      
      const sessionToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("adm_session="))
        ?.split("=")[1];

      // Keine Cookies = direkt zum Login
      if (!token && !sessionToken) {
        console.log("🔒 Keine Auth-Tokens gefunden");
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      // Enterprise++ Server-Validierung (DB, Timeout, IP-Check)
      try {
        const response = await fetch("/api/auth/check-session", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
          console.log("✅ Enterprise++ Session gültig:", data.user?.username);
          setIsAuthenticated(true);
        } else {
          console.log("🔒 Session ungültig:", data.errorCode || data.message);
          // Cookies löschen bei ungültiger Session
          document.cookie = "adm_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          document.cookie = "adm_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("❌ Session-Check fehlgeschlagen:", error);
        setIsAuthenticated(false);
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, [pathname]);

  // Redirect zu Login wenn nicht authentifiziert
  useEffect(() => {
    if (isLoading) return;
    
    if (!isAuthenticated && pathname !== "/admin/login" && pathname !== "/admin/setup-2fa") {
      const redirectUrl = encodeURIComponent(pathname || "/admin");
      router.push(`/admin/login?redirect=${redirectUrl}`);
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  // Client-seitige Zeit-Updates - MUSS vor bedingten returns sein!
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleString("de-DE"));
    };

    // Initial setzen
    updateTime();

    // Jede Sekunde aktualisieren
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  // Seitentitel dynamisch ermitteln
  const getPageTitle = () => {
    if (pageTitle) return pageTitle;
    
    // Aus Pfad ableiten
    const path = pathname || "";
    if (path === "/admin" || path === "/admin/") return "Dashboard";
    
    const segments = path.split("/").filter(Boolean);
    if (segments.length >= 2) {
      const lastSegment = segments[segments.length - 1];
      return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1).replace(/-/g, " ");
    }
    
    return "Admin";
  };

  // =====================================================
  // BEDINGTE RETURNS (nach allen Hooks!)
  // =====================================================

  // Loading-State anzeigen während Auth-Check
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#050509" }}>
        <div className="text-center">
          <FaSpinner className="animate-spin h-8 w-8 mx-auto mb-4" style={{ color: "#ffd700" }} />
          <p style={{ color: "#b3b3b3" }}>Authentifizierung wird geprüft...</p>
        </div>
      </div>
    );
  }

  // Nicht authentifiziert - Zugriff verweigert (während Redirect)
  if (!isAuthenticated && pathname !== "/admin/login" && pathname !== "/admin/setup-2fa") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#050509" }}>
        <div className="text-center p-8 rounded-lg" style={{ backgroundColor: "#111217", borderColor: "#272a33", border: "1px solid" }}>
          <FaLock className="h-12 w-12 mx-auto mb-4" style={{ color: "#da1e28" }} />
          <h2 className="text-xl font-bold mb-2" style={{ color: "#f4f4f4" }}>Zugriff verweigert</h2>
          <p className="mb-4" style={{ color: "#b3b3b3" }}>Sie müssen sich anmelden, um auf den Admin-Bereich zuzugreifen.</p>
          <p className="text-sm" style={{ color: "#8a8a8a" }}>Weiterleitung zum Login...</p>
        </div>
      </div>
    );
  }

  // =====================================================
  // MAIN LAYOUT (authentifiziert)
  // =====================================================
  return (
    <div className="flex h-screen" style={{ backgroundColor: "#050509" }}>
      {/* Sidebar */}
      <AdminNavigation />

      {/* Main Content - mit Margin für Sidebar auf Desktop (w-64 = 256px) */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-64 transition-all duration-300" style={{ backgroundColor: "#050509" }}>
        {/* Header */}
        <header className="border-b" style={{ backgroundColor: "#111217", borderColor: "#272a33" }}>
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-xl font-semibold" style={{ color: "#f4f4f4" }}>
                  {getPageTitle()}
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 rounded-lg transition-colors" style={{ color: "#b3b3b3" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#1f2329"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-5 5v-5zM4.19 4.19A4 4 0 004 6v6a4 4 0 004 4h6a4 4 0 004-4V6a4 4 0 00-4-4H8a4 4 0 00-2.83 1.17z"
                  />
                </svg>
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: "#da1e28" }}></span>
              </button>

              {/* User Info */}
              <UserInfo />
            </div>
          </div>
        </header>

        {/* Breadcrumb */}
        <nav className="border-b px-6 py-3" style={{ backgroundColor: "#111217", borderColor: "#272a33" }}>
          <div className="flex items-center space-x-3 text-sm" style={{ color: "#b3b3b3" }}>
            <Link href="/admin" className="transition-colors hover:text-[#ffd700]" style={{ color: "#b3b3b3" }}>
              Admin
            </Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span style={{ color: "#f4f4f4" }}>{getPageTitle()}</span>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto" style={{ backgroundColor: "#050509" }}>{children}</main>

        {/* Footer */}
        <footer className="border-t px-6 py-4" style={{ backgroundColor: "#111217", borderColor: "#272a33" }}>
          <div className="flex items-center justify-between text-sm" style={{ color: "#b3b3b3" }}>
            <div className="flex items-center space-x-6">
              <span>© 2025 Lopez IT Welt</span>
              <span>•</span>
              <span>Version 1.0.0</span>
            </div>
            <div className="flex items-center space-x-6">
              <span className="flex items-center space-x-2">
                <div className="relative">
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "#24a148" }}></div>
                  <div className="absolute -inset-1 rounded-full blur opacity-25 animate-pulse" style={{ backgroundColor: "#24a148" }}></div>
                </div>
                <span>System Online</span>
              </span>
              <span>•</span>
              <span>{currentTime || "Lade..."}</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
