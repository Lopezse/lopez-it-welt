"use client";

import { ReactNode } from "react";
import { SecurityRecheckGate } from "@/components/admin/security/SecurityRecheckGate";

/**
 * Enterprise++ Layout für Benutzerverwaltung
 * - SecurityRecheckGate schützt alle Unterseiten
 * - Passwort + 2FA erforderlich für Zugang
 */
export default function UsersSettingsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SecurityRecheckGate 
      actionDescription="die Benutzerverwaltung zu öffnen"
      requiredFor="admin_users"
    >
      {children}
    </SecurityRecheckGate>
  );
}










