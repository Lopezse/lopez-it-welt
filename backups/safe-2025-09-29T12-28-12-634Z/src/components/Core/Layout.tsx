/**
 * import React from 'react';
 * @description Auto-generated documentation
 */
"use client";

import { usePathname } from "next/navigation";
import React from "react";
import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

interface LayoutEigenschaften {
  children: React.ReactNode;
  seitenTitel?: string;
  seitenBeschreibung?: string;
}

const Layout: React.FC<LayoutEigenschaften> = ({ children, seitenTitel, seitenBeschreibung }) => {
  const pathname = usePathname();

  // Admin-Bereich: Nur Topbar und Sidebar, kein Header/Footer
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Topbar />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1" role="main" aria-label={seitenTitel || "Admin-Bereich"}>
            {seitenBeschreibung && <div className="sr-only">{seitenBeschreibung}</div>}
            {children}
          </main>
        </div>
      </div>
    );
  }

  // Normaler Bereich: Header und Footer wie gewohnt
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1" role="main" aria-label={seitenTitel || "Hauptinhalt"}>
        {seitenBeschreibung && <div className="sr-only">{seitenBeschreibung}</div>}
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
