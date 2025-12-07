// =====================================================
// AUTH LAYOUT
// =====================================================
// Layout für /register, /login, /verify-email etc.
// Minimales Layout ohne Admin-Navigation
// =====================================================

import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lopez IT Welt - Kunden-Portal",
  description: "Enterprise++ Kunden-Portal"
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-900">
      {children}
    </div>
  );
}







