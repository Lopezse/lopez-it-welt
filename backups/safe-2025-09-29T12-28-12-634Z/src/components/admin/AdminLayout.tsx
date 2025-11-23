"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AdminNavigation from "./AdminNavigation";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [currentTime, setCurrentTime] = useState<string>("");

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
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminNavigation />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 lg:ml-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-xl font-semibold">
                  <span style={{ color: "#FFD700" }}>Lopez</span>
                  <span style={{ color: "#007BFF" }}> IT Welt</span>
                  <span className="text-gray-900 ml-2">- Dashboard</span>
                </h1>
                <p className="text-sm text-gray-500">Systemübersicht</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-5 5v-5zM4.19 4.19A4 4 0 004 6v6a4 4 0 004 4h6a4 4 0 004-4V6a4 4 0 00-4-4H8a4 4 0 00-2.83 1.17z"
                  />
                </svg>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
              </button>

              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">Admin</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Breadcrumb */}
        <nav className="bg-gray-50 border-b border-gray-200 px-6 py-3">
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <Link href="/admin" className="hover:text-blue-600 transition-colors">
              Admin
            </Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900">Dashboard</span>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto bg-gray-50">{children}</main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-6">
              <span>© 2025 Lopez IT Welt</span>
              <span>•</span>
              <span>Version 1.0.0</span>
            </div>
            <div className="flex items-center space-x-6">
              <span className="flex items-center space-x-2">
                <div className="relative">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <div className="absolute -inset-1 bg-green-500 rounded-full blur opacity-25 animate-pulse"></div>
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
