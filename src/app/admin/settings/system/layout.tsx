// =====================================================
// SYSTEM SETTINGS LAYOUT - MIT RECHECK SCHUTZ
// =====================================================
// Erstellt: 2025-12-03
// Zweck: Alle System-Seiten mit Recheck-Gate schützen
// Standard: SAP/IBM/Siemens Security Level
// =====================================================

"use client";

import { ReactNode } from "react";
import { SecurityRecheckGate } from "@/components/admin/security/SecurityRecheckGate";

export default function SystemSettingsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SecurityRecheckGate actionDescription="die Systemeinstellungen zu öffnen">
      {children}
    </SecurityRecheckGate>
  );
}




