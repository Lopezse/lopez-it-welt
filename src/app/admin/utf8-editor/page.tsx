"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * UTF-8 Editor für MySQL-Datenbank
 * Umgeht Windows PowerShell/Terminal UTF-8 Probleme
 *
 * @author Ramiro Lopez Rodriguez
 * @version 1.0.0
 * @date 2025-09-29
 */

interface HeroData {
  title: string;
  subtitle: string;
  description: string;
  button_text: string;
  button_link: string;
}

interface HeaderData {
  logo_text: string;
  navigation_items: string;
}

interface FooterData {
  title: string;
  content: string;
}

export default function UTF8Editor() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"hero" | "header" | "footer">("hero");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Formular-Daten
  const [heroData, setHeroData] = useState<HeroData>({
    title: "",
    subtitle: "",
    description: "",
    button_text: "",
    button_link: "",
  });

  const [headerData, setHeaderData] = useState<HeaderData>({
    logo_text: "",
    navigation_items: "",
  });

  const [footerData, setFooterData] = useState<FooterData>({
    title: "",
    content: "",
  });

  // Daten laden
  const loadData = async () => {
    setLoading(true);
    try {
      // Hero-Daten laden
      const heroResponse = await fetch("/api/content/hero");
      if (heroResponse.ok) {
        const hero = await heroResponse.json();
        setHeroData({
          title: hero.title || "",
          subtitle: hero.subtitle || "",
          description: hero.description || "",
          button_text: hero.button_text || "",
          button_link: hero.button_link || "",
        });
      }

      // Header-Daten laden
      const headerResponse = await fetch("/api/content/header");
      if (headerResponse.ok) {
        const header = await headerResponse.json();
        setHeaderData({
          logo_text: header.logo_text || "",
          navigation_items: JSON.stringify(header.navigation_items || [], null, 2),
        });
      }

      // Footer-Daten laden
      const footerResponse = await fetch("/api/content/footer");
      if (footerResponse.ok) {
        const footer = await footerResponse.json();
        if (footer.length > 0) {
          setFooterData({
            title: footer[0].title || "",
            content: footer[0].content || "",
          });
        }
      }

      setMessage({ type: "success", text: "Daten erfolgreich geladen" });
    } catch (error) {
      setMessage({ type: "error", text: "Fehler beim Laden der Daten" });
    } finally {
      setLoading(false);
    }
  };

  // Hero-Daten speichern
  const saveHeroData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/content/hero", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          id: 1,
          ...heroData,
        }),
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Hero-Daten erfolgreich gespeichert" });
      } else {
        setMessage({ type: "error", text: "Fehler beim Speichern der Hero-Daten" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Fehler beim Speichern der Hero-Daten" });
    } finally {
      setLoading(false);
    }
  };

  // Header-Daten speichern
  const saveHeaderData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/content/header", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          id: 1,
          ...headerData,
          navigation_items: JSON.parse(headerData.navigation_items),
        }),
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Header-Daten erfolgreich gespeichert" });
      } else {
        setMessage({ type: "error", text: "Fehler beim Speichern der Header-Daten" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Fehler beim Speichern der Header-Daten" });
    } finally {
      setLoading(false);
    }
  };

  // Footer-Daten speichern
  const saveFooterData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/content/footer", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          id: "b2d0d6f6-9c97-11f0-aa51-bcaec52625d4",
          ...footerData,
        }),
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Footer-Daten erfolgreich gespeichert" });
      } else {
        setMessage({ type: "error", text: "Fehler beim Speichern der Footer-Daten" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Fehler beim Speichern der Footer-Daten" });
    } finally {
      setLoading(false);
    }
  };

  // Test-Umlaute einfügen
  const insertTestData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/utf8-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Test-Umlaute erfolgreich eingefügt" });
      } else {
        setMessage({ type: "error", text: "Fehler beim Einfügen der Test-Umlaute" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Fehler beim Einfügen der Test-Umlaute" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">🔧 UTF-8 Editor</h1>
            <div className="flex space-x-4">
              <button
                onClick={loadData}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                📥 Daten laden
              </button>
              <button
                onClick={insertTestData}
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                🧪 Test-Umlaute
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mb-6">
            {[
              { id: "hero", label: "🎯 Hero", component: "hero" },
              { id: "header", label: "📋 Header", component: "header" },
              { id: "footer", label: "🦶 Footer", component: "footer" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.component as any)}
                className={`px-4 py-2 rounded-lg font-medium ${
                  activeTab === tab.component
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Message */}
          {message && (
            <div
              className={`mb-4 p-4 rounded-lg ${
                message.type === "success"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Hero Tab */}
          {activeTab === "hero" && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Hero-Daten bearbeiten</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Titel</label>
                  <input
                    type="text"
                    value={heroData.title}
                    onChange={(e) => setHeroData({ ...heroData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="z.B. Lopez IT Welt"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Untertitel</label>
                  <input
                    type="text"
                    value={heroData.subtitle}
                    onChange={(e) => setHeroData({ ...heroData, subtitle: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="z.B. Professionelle IT-Lösungen"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Beschreibung
                  </label>
                  <textarea
                    value={heroData.description}
                    onChange={(e) => setHeroData({ ...heroData, description: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="z.B. Wir entwickeln maßgeschneiderte Software-Lösungen..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Button-Text
                  </label>
                  <input
                    type="text"
                    value={heroData.button_text}
                    onChange={(e) => setHeroData({ ...heroData, button_text: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="z.B. Jetzt beraten lassen"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Button-Link
                  </label>
                  <input
                    type="text"
                    value={heroData.button_link}
                    onChange={(e) => setHeroData({ ...heroData, button_link: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="z.B. /kontakt"
                  />
                </div>
              </div>

              <button
                onClick={saveHeroData}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                💾 Hero-Daten speichern
              </button>
            </div>
          )}

          {/* Header Tab */}
          {activeTab === "header" && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Header-Daten bearbeiten</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Logo-Text</label>
                  <input
                    type="text"
                    value={headerData.logo_text}
                    onChange={(e) => setHeaderData({ ...headerData, logo_text: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="z.B. Lopez IT Welt"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Navigation (JSON)
                  </label>
                  <textarea
                    value={headerData.navigation_items}
                    onChange={(e) =>
                      setHeaderData({ ...headerData, navigation_items: e.target.value })
                    }
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                    placeholder='[{"label": "Leistungen", "link": "/leistungen", "type": "link"}]'
                  />
                </div>
              </div>

              <button
                onClick={saveHeaderData}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                💾 Header-Daten speichern
              </button>
            </div>
          )}

          {/* Footer Tab */}
          {activeTab === "footer" && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Footer-Daten bearbeiten</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Titel</label>
                  <input
                    type="text"
                    value={footerData.title}
                    onChange={(e) => setFooterData({ ...footerData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="z.B. Lopez IT Welt"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Inhalt</label>
                  <textarea
                    value={footerData.content}
                    onChange={(e) => setFooterData({ ...footerData, content: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="z.B. Professionelle IT-Lösungen mit Fokus auf Barrierefreiheit..."
                  />
                </div>
              </div>

              <button
                onClick={saveFooterData}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                💾 Footer-Daten speichern
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
