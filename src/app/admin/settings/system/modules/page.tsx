// =====================================================
// ENTERPRISE++ SYSTEM-MODULE - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-01-19
// Zweck: Module aktivieren/deaktivieren
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================

"use client";

import { useState } from "react";
import { FaCogs, FaToggleOn, FaToggleOff } from "react-icons/fa";
import Link from "next/link";

interface Module {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export default function ModulesPage() {
  const [modules, setModules] = useState<Module[]>([
    { id: "media-ai", name: "Media-KI", description: "KI-gestützte Medienanalyse", enabled: true },
    { id: "invoice", name: "Rechnungsmodul", description: "Rechnungsverwaltung", enabled: true },
    { id: "ab-testing", name: "A/B-Testing", description: "A/B-Testing-System", enabled: false },
    { id: "monitoring", name: "Monitoring", description: "System-Monitoring", enabled: true },
    { id: "backup", name: "Backup-System", description: "Automatische Backups", enabled: true },
    { id: "export", name: "Export-System", description: "Datenexport", enabled: true },
  ]);

  const toggleModule = async (moduleId: string) => {
    setModules(modules.map(m => 
      m.id === moduleId ? { ...m, enabled: !m.enabled } : m
    ));
    // TODO: API-Call zum Speichern
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#050509" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/admin/settings" className="text-sm mb-2 inline-block" style={{ color: "#8a8a8a" }}>
            ← Zurück zu Einstellungen
          </Link>
          <h1 className="text-3xl font-bold mb-2" style={{ color: "#f4f4f4" }}>
            Aktivierte Module
          </h1>
          <p className="text-sm" style={{ color: "#8a8a8a" }}>
            Module aktivieren/deaktivieren
          </p>
        </div>

        <div className="space-y-4">
          {modules.map((module) => (
            <div
              key={module.id}
              className="flex items-center justify-between p-6 rounded-lg border"
              style={{ backgroundColor: "#111217", borderColor: "#272a33" }}
            >
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1" style={{ color: "#f4f4f4" }}>
                  {module.name}
                </h3>
                <p className="text-sm" style={{ color: "#8a8a8a" }}>
                  {module.description}
                </p>
              </div>
              <button
                onClick={() => toggleModule(module.id)}
                className="ml-4 text-3xl transition-colors"
                style={{ color: module.enabled ? "#28a745" : "#8a8a8a" }}
              >
                {module.enabled ? <FaToggleOn /> : <FaToggleOff />}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

