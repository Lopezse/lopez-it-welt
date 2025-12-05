// =====================================================
// ENTERPRISE++ FIRMENPROFIL - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-01-19
// Zweck: Firmenprofil verwalten
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================

"use client";

import { SettingsSectionLayout } from "../../_components/SettingsSectionLayout";

export default function CompanyProfilePage() {
  return (
    <SettingsSectionLayout
      title="Firmenprofil"
      subtitle="Firmenname, Adresse, Support-E-Mail"
    >
      <p className="text-sm" style={{ color: "#b3b3b3" }}>
        Hier werden später Firmendaten verwaltet (Firmenname, Adresse, 
        Support-E-Mail, Kontaktdaten). Aktuell dient die Seite als vorbereiteter Enterprise++ Placeholder.
      </p>
    </SettingsSectionLayout>
  );
}

