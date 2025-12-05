"use client";

import { SettingsSectionLayout } from "../_components/SettingsSectionLayout";

export default function PoliciesSettingsPage() {
  return (
    <SettingsSectionLayout
      title="Zugriffsrichtlinien"
      subtitle="Vordefinierte Rechte-Sets & Policy-Regeln"
    >
      <p className="text-sm" style={{ color: "#b3b3b3" }}>
        Hier entsteht die Verwaltung von Zugriffsrichtlinien für Lopez IT Welt.
        In einem späteren Schritt werden hier vordefinierte Rechte-Sets, Policy-Regeln
        und granulare Zugriffskontrollen implementiert (Enterprise++ Standard).
      </p>
    </SettingsSectionLayout>
  );
}

