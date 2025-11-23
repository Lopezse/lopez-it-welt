"use client";
import RuleEnforcementTest from "../../../components/Features/RuleEnforcementTest";

export default function RulesAdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">🛡️ KI-Regel-Enforcement System</h1>
          <p className="text-gray-600 mt-2">
            Admin-Bereich für das Blockierungssystem - Nur für Entwickler
          </p>
        </div>

        <RuleEnforcementTest />

        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">
            ℹ️ Über das Blockierungssystem
          </h2>
          <div className="text-blue-700 space-y-2">
            <p>
              • <strong>Zweck:</strong> Verhindert, dass die KI ohne Zustimmung Aktionen durchführt
            </p>
            <p>
              • <strong>Regeln:</strong> Basierend auf QualityController.md und CursorGuide.md
            </p>
            <p>
              • <strong>Blockierung:</strong> Automatische Blockierung bei Regelverstößen
            </p>
            <p>
              • <strong>Freigabe:</strong> Explizite Benutzer-Freigabe erforderlich
            </p>
            <p>
              • <strong>Status:</strong> Alle Aktionen werden in STATUS.md dokumentiert
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
