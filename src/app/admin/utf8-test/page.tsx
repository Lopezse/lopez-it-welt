"use client";

import { useState } from "react";

/**
 * Einfaches UTF-8 Test Interface
 * Nur Buttons - keine Eingaben erforderlich
 *
 * @author Ramiro Lopez Rodriguez
 * @version 1.0.0
 * @date 2025-09-29
 */

export default function UTF8Test() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [testResults, setTestResults] = useState<any>(null);

  // Hero-Daten mit korrekten Umlauten speichern
  const fixHeroData = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/content/hero", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          id: 1,
          title: "Lopez IT Welt",
          subtitle: "Professionelle IT-Lösungen",
          description:
            "Wir entwickeln maßgeschneiderte Software-Lösungen mit Fokus auf Barrierefreiheit und persönliche Betreuung. Von der Konzeption bis zur Umsetzung - Ihr Partner für digitale Innovation.",
          button_text: "Jetzt beraten lassen",
          button_link: "/kontakt",
        }),
      });

      if (response.ok) {
        setMessage({ type: "success", text: "✅ Hero-Daten mit korrekten Umlauten gespeichert!" });
      } else {
        setMessage({ type: "error", text: "❌ Fehler beim Speichern der Hero-Daten" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "❌ Fehler beim Speichern der Hero-Daten" });
    } finally {
      setLoading(false);
    }
  };

  // Header-Daten mit korrekten Umlauten speichern
  const fixHeaderData = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/content/header", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          id: 1,
          logo_text: "Lopez IT Welt",
          navigation_items: [
            { label: "Leistungen", link: "/leistungen", type: "link" },
            { label: "Projekte", link: "/projekte", type: "link" },
            { label: "Kontakt", link: "/kontakt", type: "link" },
          ],
        }),
      });

      if (response.ok) {
        setMessage({
          type: "success",
          text: "✅ Header-Daten mit korrekten Umlauten gespeichert!",
        });
      } else {
        setMessage({ type: "error", text: "❌ Fehler beim Speichern der Header-Daten" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "❌ Fehler beim Speichern der Header-Daten" });
    } finally {
      setLoading(false);
    }
  };

  // Footer-Daten mit korrekten Umlauten speichern
  const fixFooterData = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/content/footer", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          id: "b2d0d6f6-9c97-11f0-aa51-bcaec52625d4",
          title: "Lopez IT Welt",
          content:
            "Professionelle IT-Lösungen mit Fokus auf Barrierefreiheit und persönliche Betreuung.",
        }),
      });

      if (response.ok) {
        setMessage({
          type: "success",
          text: "✅ Footer-Daten mit korrekten Umlauten gespeichert!",
        });
      } else {
        setMessage({ type: "error", text: "❌ Fehler beim Speichern der Footer-Daten" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "❌ Fehler beim Speichern der Footer-Daten" });
    } finally {
      setLoading(false);
    }
  };

  // Test-Umlaute einfügen
  const insertTestUmlauts = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/utf8-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      });

      if (response.ok) {
        const result = await response.json();
        setTestResults(result);
        setMessage({
          type: "success",
          text: `✅ Test-Umlaute erfolgreich eingefügt! (${result.inserted} Einträge)`,
        });
      } else {
        setMessage({ type: "error", text: "❌ Fehler beim Einfügen der Test-Umlaute" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "❌ Fehler beim Einfügen der Test-Umlaute" });
    } finally {
      setLoading(false);
    }
  };

  // Alle Daten anzeigen
  const showAllData = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const [heroResponse, headerResponse, footerResponse] = await Promise.all([
        fetch("/api/content/hero"),
        fetch("/api/content/header"),
        fetch("/api/content/footer"),
      ]);

      const hero = await heroResponse.json();
      const header = await headerResponse.json();
      const footer = await footerResponse.json();

      setTestResults({
        hero: hero,
        header: header,
        footer: footer,
      });

      setMessage({ type: "success", text: "✅ Alle Daten erfolgreich geladen!" });
    } catch (error) {
      setMessage({ type: "error", text: "❌ Fehler beim Laden der Daten" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">🔧 UTF-8 Test Interface</h1>
            <p className="text-lg text-gray-600">
              Einfache Buttons für UTF-8 Reparatur - Keine Eingaben erforderlich
            </p>
          </div>

          {/* Message */}
          {message && (
            <div
              className={`mb-6 p-4 rounded-lg text-center ${
                message.type === "success"
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : "bg-red-100 text-red-800 border border-red-200"
              }`}
            >
              <div className="text-lg font-semibold">{message.text}</div>
            </div>
          )}

          {/* Buttons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Hero Button */}
            <button
              onClick={fixHeroData}
              disabled={loading}
              className="p-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <div className="text-2xl mb-2">🎯</div>
              <div className="text-lg font-semibold">Hero-Daten reparieren</div>
              <div className="text-sm opacity-90 mt-1">Umlaute in Hero-Section korrigieren</div>
            </button>

            {/* Header Button */}
            <button
              onClick={fixHeaderData}
              disabled={loading}
              className="p-6 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <div className="text-2xl mb-2">📋</div>
              <div className="text-lg font-semibold">Header-Daten reparieren</div>
              <div className="text-sm opacity-90 mt-1">Umlaute in Header-Section korrigieren</div>
            </button>

            {/* Footer Button */}
            <button
              onClick={fixFooterData}
              disabled={loading}
              className="p-6 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <div className="text-2xl mb-2">🦶</div>
              <div className="text-lg font-semibold">Footer-Daten reparieren</div>
              <div className="text-sm opacity-90 mt-1">Umlaute in Footer-Section korrigieren</div>
            </button>

            {/* Test Umlaute Button */}
            <button
              onClick={insertTestUmlauts}
              disabled={loading}
              className="p-6 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <div className="text-2xl mb-2">🧪</div>
              <div className="text-lg font-semibold">Test-Umlaute einfügen</div>
              <div className="text-sm opacity-90 mt-1">Umlaute in Test-Tabelle testen</div>
            </button>

            {/* Show All Data Button */}
            <button
              onClick={showAllData}
              disabled={loading}
              className="p-6 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <div className="text-2xl mb-2">📊</div>
              <div className="text-lg font-semibold">Alle Daten anzeigen</div>
              <div className="text-sm opacity-90 mt-1">Aktuelle Daten aus Datenbank laden</div>
            </button>

            {/* Loading Indicator */}
            {loading && (
              <div className="p-6 bg-yellow-100 text-yellow-800 rounded-lg border border-yellow-200">
                <div className="text-2xl mb-2">⏳</div>
                <div className="text-lg font-semibold">Wird verarbeitet...</div>
                <div className="text-sm opacity-90 mt-1">Bitte warten</div>
              </div>
            )}
          </div>

          {/* Test Results */}
          {testResults && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">📊 Test-Ergebnisse:</h3>
              <div className="bg-gray-100 rounded-lg p-4 overflow-auto max-h-96">
                <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                  {JSON.stringify(testResults, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-8 bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">📋 Anleitung:</h3>
            <ol className="list-decimal list-inside space-y-2 text-blue-800">
              <li>
                <strong>Hero-Daten reparieren:</strong> Korrigiert Umlaute in der Hero-Section
              </li>
              <li>
                <strong>Header-Daten reparieren:</strong> Korrigiert Umlaute in der Header-Section
              </li>
              <li>
                <strong>Footer-Daten reparieren:</strong> Korrigiert Umlaute in der Footer-Section
              </li>
              <li>
                <strong>Test-Umlaute einfügen:</strong> Erstellt Test-Tabelle mit Umlauten
              </li>
              <li>
                <strong>Alle Daten anzeigen:</strong> Lädt aktuelle Daten aus der Datenbank
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
