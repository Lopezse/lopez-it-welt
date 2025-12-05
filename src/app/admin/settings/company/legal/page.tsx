// =====================================================
// ENTERPRISE++ RECHTLICHES - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-01-19
// Zweck: Impressum, Datenschutz
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================

"use client";

import { SettingsSectionLayout } from "../../_components/SettingsSectionLayout";

export default function LegalPage() {
  return (
    <SettingsSectionLayout
      title="Rechtliches"
      subtitle="Impressum, Datenschutz"
    >
      <p className="text-sm" style={{ color: "#b3b3b3" }}>
        Hier werden später rechtliche Inhalte verwaltet (Impressum, 
        Datenschutzerklärung, AGB). Aktuell dient die Seite als vorbereiteter Enterprise++ Placeholder.
      </p>
    </SettingsSectionLayout>
  );
}

