// =====================================================
// KUNDEN-PORTAL LAYOUT
// =====================================================
// Layout für alle /portal/* Routen
// Prüft Login & Onboarding-Status
// =====================================================

"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  FaSpinner, FaHome, FaProjectDiagram, FaBrain, FaFileInvoice, 
  FaHeadset, FaCog, FaSignOutAlt, FaUser, FaBars, FaTimes 
} from "react-icons/fa";

// =====================================================
// NAVIGATION
// =====================================================

const portalNavigation = [
  { name: "Dashboard", href: "/portal", icon: FaHome },
  { name: "Projekte", href: "/portal/projekte", icon: FaProjectDiagram },
  { name: "AI Services", href: "/portal/ai", icon: FaBrain },
  { name: "Rechnungen", href: "/portal/rechnungen", icon: FaFileInvoice },
  { name: "Support", href: "/portal/support", icon: FaHeadset },
  { name: "Einstellungen", href: "/portal/einstellungen", icon: FaCog },
];

// =====================================================
// LAYOUT
// =====================================================

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState<{
    first_name?: string;
    last_name?: string;
    company_name?: string;
    email: string;
  } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // -------------------------------------------------
  // AUTH & ONBOARDING CHECK
  // -------------------------------------------------

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // 1. Session prüfen
      const meResponse = await fetch("/api/auth/me");
      const meData = await meResponse.json();

      if (!meData.success) {
        router.push("/kunde/login");
        return;
      }

      // 2. Onboarding prüfen
      if (!meData.data.onboarding_completed) {
        router.push("/kunde/onboarding");
        return;
      }

      setCustomer(meData.data);
      setLoading(false);

    } catch {
      router.push("/kunde/login");
    }
  };

  // -------------------------------------------------
  // LOGOUT
  // -------------------------------------------------

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/kunde/login");
    } catch {
      router.push("/kunde/login");
    }
  };

  // -------------------------------------------------
  // LOADING
  // -------------------------------------------------

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 
                      flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="text-4xl text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Portal wird geladen...</p>
        </div>
      </div>
    );
  }

  // -------------------------------------------------
  // RENDER
  // -------------------------------------------------

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-slate-800/80 backdrop-blur border-r border-slate-700 
                       hidden lg:flex flex-col">
        
        {/* Logo */}
        <div className="p-6 border-b border-slate-700">
          <Link href="/portal" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 
                          flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <div>
              <span className="text-white font-bold">Lopez IT Welt</span>
              <span className="block text-xs text-slate-400">Kunden-Portal</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {portalNavigation.map((item) => {
            const isActive = pathname === item.href || 
                           (item.href !== "/portal" && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                          ${isActive 
                            ? "bg-blue-600/20 text-blue-400 border-l-4 border-blue-500 -ml-1 pl-5" 
                            : "text-slate-300 hover:bg-slate-700/50 hover:text-white"}`}
              >
                <item.icon className={isActive ? "text-blue-400" : "text-slate-400"} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
              <FaUser className="text-slate-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">
                {customer?.first_name} {customer?.last_name}
              </p>
              <p className="text-xs text-slate-400 truncate">
                {customer?.company_name || customer?.email}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/10 
                     rounded-lg transition-colors"
          >
            <FaSignOutAlt />
            <span>Abmelden</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 inset-x-0 h-16 bg-slate-800/80 backdrop-blur 
                        border-b border-slate-700 flex items-center justify-between px-4 z-40">
        <Link href="/portal" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 
                        flex items-center justify-center">
            <span className="text-white font-bold">L</span>
          </div>
          <span className="text-white font-bold">Lopez IT</span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-slate-300 hover:text-white"
        >
          {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div className={`lg:hidden fixed top-16 right-0 bottom-0 w-64 bg-slate-800 border-l border-slate-700 
                      z-40 transform transition-transform duration-300
                      ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
        <nav className="p-4 space-y-1">
          {portalNavigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                          ${isActive 
                            ? "bg-blue-600/20 text-blue-400" 
                            : "text-slate-300 hover:bg-slate-700/50"}`}
              >
                <item.icon />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 inset-x-0 p-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-400 
                     hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <FaSignOutAlt />
            <span>Abmelden</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="lg:pl-64 pt-16 lg:pt-0 min-h-screen">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}







