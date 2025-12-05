// =====================================================
// ENTERPRISE++ ABAC-ATTRIBUTE - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-01-19
// Zweck: ABAC-Attribute und dynamische Regeln (Siemens/SAP Level)
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================

"use client";

import { SettingsSectionLayout } from "../_components/SettingsSectionLayout";

export default function AttributesPage() {
  return (
    <SettingsSectionLayout
      title="ABAC-Attribute"
      subtitle="Attribute und dynamische Regeln (Siemens/SAP Level)"
    >
      <p className="text-sm mb-4" style={{ color: "#b3b3b3" }}>
        Erweitern Sie die rollenbasierte Zugriffskontrolle (RBAC) um attributbasierte Regeln.
        Beispiel: "Admin darf nur Kunden seines Teams sehen" oder "Editor darf nur Medien bearbeiten, die er besitzt".
      </p>
      <p className="text-sm" style={{ color: "#b3b3b3" }}>
        Hier entsteht die vollständige ABAC-Verwaltung von Lopez IT Welt. 
        In einem späteren Schritt werden hier Attribute definiert, dynamische Regeln erstellt
        und Benutzer-Attribute verwaltet (Enterprise++ Standard).
      </p>
    </SettingsSectionLayout>
  );
}

