// =====================================================
// ENTERPRISE++ PASSWORT-POLICY - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-01-19
// Aktualisiert: 2025-12-01 - DB-gesteuerte Settings
// Zweck: Passwort-Policy Einstellungen (Enterprise++ Standard)
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT - DB-GESTEUERT
// =====================================================

"use client";

import { useState, useEffect } from "react";
import { FaKey, FaSave, FaDatabase, FaSpinner } from "react-icons/fa";
import Link from "next/link";

interface SettingsItem {
  id: number;
  key: string;
  label: string;
  description: string | null;
  type: string;
  parsed_value: any;
}

interface PolicyData {
  minLength: number;
  maxLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  expirationDays: number;
  preventReuse: boolean;
  maxFailedAttempts: number;
  lockoutDuration: number;
}

export default function PasswordPolicyPage() {
  const [policy, setPolicy] = useState<PolicyData>({
    minLength: 12,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    expirationDays: 180,
    preventReuse: true,
    maxFailedAttempts: 5,
    lockoutDuration: 15,
  });
  const [items, setItems] = useState<SettingsItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dbConnected, setDbConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Laden der Settings aus der DB
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/settings/security/password-policy", {
        credentials: "include",
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setPolicy(data.data.policy);
          setItems(data.data.items || []);
          setDbConnected(true);
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Fehler beim Laden");
        setDbConnected(false);
      }
    } catch (error) {
      console.error("Fehler beim Laden:", error);
      setError("Verbindungsfehler - DB nicht erreichbar");
      setDbConnected(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/settings/security/password-policy", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(policy),
      });

      if (response.ok) {
        alert("✅ Passwort-Policy erfolgreich in DB gespeichert");
        setDbConnected(true);
      } else {
        const errorData = await response.json();
        alert(`❌ Fehler: ${errorData.message || "Fehler beim Speichern"}`);
      }
    } catch (error) {
      console.error("Fehler:", error);
      alert("❌ Fehler beim Speichern");
    } finally {
      setSaving(false);
    }
  };

  // Hilfsfunktion: Label aus DB-Items holen
  const getLabel = (key: string, fallback: string): string => {
    const item = items.find(i => i.key === key);
    return item?.label || fallback;
  };

  // Hilfsfunktion: Description aus DB-Items holen
  const getDescription = (key: string, fallback: string): string => {
    const item = items.find(i => i.key === key);
    return item?.description || fallback;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#050509" }}>
        <div className="text-center">
          <FaSpinner className="animate-spin h-8 w-8 mx-auto mb-4" style={{ color: "#007bff" }} />
          <p style={{ color: "#8a8a8a" }}>Lade Einstellungen aus Datenbank...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#050509" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link href="/admin/settings" className="text-sm mb-2 inline-block" style={{ color: "#8a8a8a" }}>
            ← Zurück zu Einstellungen
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2" style={{ color: "#f4f4f4" }}>
                Passwort-Policy
              </h1>
              <p className="text-sm" style={{ color: "#8a8a8a" }}>
                Enterprise++ Passwort-Regeln und Ablauf
              </p>
            </div>
            {/* DB-Status Badge */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium"
              style={{ 
                backgroundColor: dbConnected ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.15)",
                color: dbConnected ? "#22c55e" : "#ef4444"
              }}>
              <FaDatabase className="h-3 w-3" />
              {dbConnected ? "DB-gesteuert" : "Keine DB-Verbindung"}
            </div>
          </div>
        </div>

        {/* Fehleranzeige */}
        {error && (
          <div className="mb-6 p-4 rounded-lg border" style={{ backgroundColor: "rgba(239, 68, 68, 0.1)", borderColor: "#ef4444" }}>
            <p className="text-sm" style={{ color: "#ef4444" }}>{error}</p>
            <p className="text-xs mt-2" style={{ color: "#8a8a8a" }}>
              Bitte <code>/api/admin/init-database</code> aufrufen um die Tabellen zu erstellen.
            </p>
          </div>
        )}

        {/* Policy-Einstellungen */}
        <div className="space-y-6">
          {/* Mindestlänge */}
          <div className="rounded-lg border p-6" style={{ backgroundColor: "#111217", borderColor: "#272a33" }}>
            <label className="block text-sm font-medium mb-2" style={{ color: "#f4f4f4" }}>
              {getLabel("min_length", "Mindestlänge (Zeichen)")}
            </label>
            <input
              type="number"
              min="8"
              max="32"
              value={policy.minLength}
              onChange={(e) => setPolicy({ ...policy, minLength: parseInt(e.target.value) || 12 })}
              className="w-full px-4 py-2 rounded-md text-sm border"
              style={{
                backgroundColor: "#1a1d24",
                borderColor: "#272a33",
                color: "#f4f4f4",
              }}
            />
            <p className="text-xs mt-1" style={{ color: "#8a8a8a" }}>
              {getDescription("min_length", "Enterprise++ Standard: 12 Zeichen")}
            </p>
          </div>

          {/* Komplexitätsregeln */}
          <div className="rounded-lg border p-6" style={{ backgroundColor: "#111217", borderColor: "#272a33" }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: "#f4f4f4" }}>
              Komplexitätsregeln
            </h3>
            <div className="space-y-3">
              {[
                { key: "requireUppercase", dbKey: "require_uppercase", label: "Großbuchstaben (A-Z) erforderlich" },
                { key: "requireLowercase", dbKey: "require_lowercase", label: "Kleinbuchstaben (a-z) erforderlich" },
                { key: "requireNumbers", dbKey: "require_numbers", label: "Zahlen (0-9) erforderlich" },
                { key: "requireSpecialChars", dbKey: "require_special_chars", label: "Sonderzeichen (!@#$%^&*) erforderlich" },
              ].map((rule) => (
                <label key={rule.key} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={policy[rule.key as keyof typeof policy] as boolean}
                    onChange={(e) =>
                      setPolicy({ ...policy, [rule.key]: e.target.checked })
                    }
                    className="mr-3"
                  />
                  <span className="text-sm" style={{ color: "#f4f4f4" }}>
                    {getLabel(rule.dbKey, rule.label)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Ablauf */}
          <div className="rounded-lg border p-6" style={{ backgroundColor: "#111217", borderColor: "#272a33" }}>
            <label className="block text-sm font-medium mb-2" style={{ color: "#f4f4f4" }}>
              {getLabel("expiration_days", "Passwort-Ablauf (Tage)")}
            </label>
            <input
              type="number"
              min="0"
              max="365"
              value={policy.expirationDays}
              onChange={(e) => setPolicy({ ...policy, expirationDays: parseInt(e.target.value) || 180 })}
              className="w-full px-4 py-2 rounded-md text-sm border"
              style={{
                backgroundColor: "#1a1d24",
                borderColor: "#272a33",
                color: "#f4f4f4",
              }}
            />
            <p className="text-xs mt-1" style={{ color: "#8a8a8a" }}>
              {getDescription("expiration_days", "0 = Kein Ablauf")}
            </p>
          </div>

          {/* Historie */}
          <div className="rounded-lg border p-6" style={{ backgroundColor: "#111217", borderColor: "#272a33" }}>
            <label className="flex items-center mb-4">
              <input
                type="checkbox"
                checked={policy.preventReuse}
                onChange={(e) => setPolicy({ ...policy, preventReuse: e.target.checked })}
                className="mr-3"
              />
              <span className="text-sm font-medium" style={{ color: "#f4f4f4" }}>
                {getLabel("prevent_reuse", "Verbot alter Passwörter (Historie)")}
              </span>
            </label>
            <p className="text-xs" style={{ color: "#8a8a8a" }}>
              {getDescription("prevent_reuse", "Verhindert die Wiederverwendung der letzten 5 Passwörter")}
            </p>
          </div>

          {/* Brute-Force-Schutz */}
          <div className="rounded-lg border p-6" style={{ backgroundColor: "#111217", borderColor: "#272a33" }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: "#f4f4f4" }}>
              Brute-Force-Schutz
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#f4f4f4" }}>
                  {getLabel("max_failed_attempts", "Maximale Fehlversuche")}
                </label>
                <input
                  type="number"
                  min="3"
                  max="10"
                  value={policy.maxFailedAttempts}
                  onChange={(e) => setPolicy({ ...policy, maxFailedAttempts: parseInt(e.target.value) || 5 })}
                  className="w-full px-4 py-2 rounded-md text-sm border"
                  style={{
                    backgroundColor: "#1a1d24",
                    borderColor: "#272a33",
                    color: "#f4f4f4",
                  }}
                />
                <p className="text-xs mt-1" style={{ color: "#8a8a8a" }}>
                  {getDescription("max_failed_attempts", "Brute-Force-Schutz")}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#f4f4f4" }}>
                  {getLabel("lockout_duration", "Sperrdauer (Minuten)")}
                </label>
                <input
                  type="number"
                  min="5"
                  max="60"
                  value={policy.lockoutDuration}
                  onChange={(e) => setPolicy({ ...policy, lockoutDuration: parseInt(e.target.value) || 15 })}
                  className="w-full px-4 py-2 rounded-md text-sm border"
                  style={{
                    backgroundColor: "#1a1d24",
                    borderColor: "#272a33",
                    color: "#f4f4f4",
                  }}
                />
                <p className="text-xs mt-1" style={{ color: "#8a8a8a" }}>
                  {getDescription("lockout_duration", "Dauer der Kontosperre nach Fehlversuchen")}
                </p>
              </div>
            </div>
          </div>

          {/* Speichern-Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center px-6 py-3 rounded-md text-sm font-medium transition-all duration-200"
              style={{ backgroundColor: "#007bff", color: "#ffffff" }}
              onMouseEnter={(e) => {
                if (!saving) e.currentTarget.style.backgroundColor = "#0056b3";
              }}
              onMouseLeave={(e) => {
                if (!saving) e.currentTarget.style.backgroundColor = "#007bff";
              }}
            >
              <FaSave className="mr-2" />
              {saving ? "Speichere..." : "Speichern"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

