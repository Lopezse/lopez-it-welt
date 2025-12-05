"use client";

import { ReactNode } from "react";

/**
 * Enterprise++ Layout für Unternehmenseinstellungen
 * - Firmenprofile, Branding, Legal
 * - Kein SecurityRecheckGate nötig (nicht sicherheitskritisch)
 */
export default function CompanySettingsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="company-settings-layout">
      {children}
    </div>
  );
}




