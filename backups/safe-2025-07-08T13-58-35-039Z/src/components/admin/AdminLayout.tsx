"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>("");

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Client-seitige Zeit-Updates
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

  return (
    <div className="flex h-screen bg-gradient-to-br from-dunkelgrau via-hauptblau to-dunkelgrau">
      {/* Sidebar */}
      <AdminSidebar isCollapsed={sidebarCollapsed} onToggleCollapse={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="backdrop-blur-xl bg-weiss/10 shadow-2xl border-b border-weiss/20">
          <div className="flex items-center justify-between px-8 py-6">
            <div className="flex items-center space-x-6">
              <button
                onClick={toggleSidebar}
                className="p-3 rounded-xl bg-weiss/10 backdrop-blur-sm border border-weiss/20 hover:bg-weiss/20 transition-all duration-300 hover:scale-110"
              >
                <svg
                  className="w-5 h-5 text-weiss"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-weiss to-hellgrau bg-clip-text text-transparent">
                  Lopez IT Welt Admin
                </h1>
                <p className="text-hellgrau text-sm">Verwaltung</p>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              {/* Notifications */}
              <button className="relative p-3 rounded-xl bg-weiss/10 backdrop-blur-sm border border-weiss/20 hover:bg-weiss/20 transition-all duration-300 hover:scale-110">
                <svg
                  className="w-5 h-5 text-weiss"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-5 5v-5zM4.19 4.19A4 4 0 004 6v6a4 4 0 004 4h6a4 4 0 004-4V6a4 4 0 00-4-4H8a4 4 0 00-2.83 1.17z"
                  />
                </svg>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-rot rounded-full animate-pulse"></span>
              </button>

              {/* User Menu */}
              <div className="relative">
                <button className="flex items-center space-x-3 p-3 rounded-xl bg-weiss/10 backdrop-blur-sm border border-weiss/20 hover:bg-weiss/20 transition-all duration-300">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-r from-hauptblau to-akzentblau rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-weiss font-bold text-lg">A</span>
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-r from-hauptblau to-akzentblau rounded-xl blur opacity-25 animate-pulse"></div>
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-weiss">Admin</p>
                    <p className="text-xs text-hellgrau">Administrator</p>
                  </div>
                  <svg
                    className="w-4 h-4 text-hellgrau"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center space-x-3">
                <Link
                  href="/admin/monitoring"
                  className="p-3 bg-gradient-to-r from-hauptblau to-akzentblau text-weiss rounded-xl hover:scale-110 transition-all duration-300 shadow-lg"
                  title="Monitoring"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </Link>
                <Link
                  href="/admin/backups"
                  className="p-3 bg-gradient-to-r from-gruen to-akzentblau text-weiss rounded-xl hover:scale-110 transition-all duration-300 shadow-lg"
                  title="Backups"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Breadcrumb */}
        <nav className="backdrop-blur-sm bg-weiss/5 border-b border-weiss/10 px-8 py-3">
          <div className="flex items-center space-x-3 text-sm text-hellgrau">
            <Link href="/admin" className="hover:text-akzentblau transition-colors">
              Admin
            </Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-weiss">Dashboard</span>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">{children}</main>

        {/* Footer */}
        <footer className="backdrop-blur-sm bg-weiss/5 border-t border-weiss/10 px-8 py-4">
          <div className="flex items-center justify-between text-sm text-hellgrau">
            <div className="flex items-center space-x-6">
              <span>© 2025 Lopez IT Welt</span>
              <span>•</span>
              <span>Version 1.0.0</span>
            </div>
            <div className="flex items-center space-x-6">
              <span className="flex items-center space-x-2">
                <div className="relative">
                  <div className="w-2 h-2 bg-gruen rounded-full animate-pulse"></div>
                  <div className="absolute -inset-1 bg-gruen rounded-full blur opacity-25 animate-pulse"></div>
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
