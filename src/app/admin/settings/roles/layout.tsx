"use client";

import { ReactNode } from "react";
import { SecurityRecheckGate } from "@/components/admin/security/SecurityRecheckGate";

/**
 * Enterprise++ Layout für Rollenverwaltung
 * - SecurityRecheckGate schützt alle Unterseiten
 * - Passwort + 2FA erforderlich für Zugang
 */
export default function RolesSettingsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SecurityRecheckGate 
      actionDescription="die Rollenverwaltung zu öffnen"
      requiredFor="admin_roles"
    >
      {children}
    </SecurityRecheckGate>
  );
}




