"use client";
import { useEffect, useState } from "react";

interface ABTestConfig {
  id: number;
  test_name: string;
  is_active: boolean;
  variant_a_id: number;
  variant_b_id: number;
  traffic_split: number;
  auto_activate_winner: boolean;
  auto_activate_threshold: number;
  auto_activate_days: number;
}

interface HeroVariant {
  id: number;
  title: string;
  subtitle: string;
  button_text: string;
}

interface ABTestStats {
  hero_id: number;
  variant_name: string;
  device_type: string;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  conversion_rate: number;
  last_updated: string;
}

interface Totals {
  total_impressions: number;
  total_clicks: number;
  total_conversions: number;
  overall_ctr: number;
  overall_conversion_rate: number;
}

export default function ABTestPage() {
  const [config, setConfig] = useState<ABTestConfig | null>(null);
  const [variants, setVariants] = useState<HeroVariant[]>([]);
  const [stats, setStats] = useState<ABTestStats[]>([]);
  const [totals, setTotals] = useState<Totals | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Daten laden
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // A/B-Test Konfiguration laden
      const configResponse = await fetch("/api/ab-test/config");
      const configData = await configResponse.json();
      setConfig(configData);

      // Hero-Varianten laden
      const variantsResponse = await fetch("/api/content/hero");
      const variantsData = await variantsResponse.json();
      setVariants(Array.isArray(variantsData) ? variantsData : [variantsData]);

      // Statistiken laden
      const statsResponse = await fetch("/api/ab-test/stats");
      const statsData = await statsResponse.json();
      setStats(statsData.stats || []);
      setTotals(statsData.totals);
    } catch (error) {
      setError(
        `Fehler beim Laden der Daten: ${error instanceof Error ? error.message : "Unbekannter Fehler"}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = async (updates: Partial<ABTestConfig>) => {
    try {
      const response = await fetch("/api/ab-test/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        await loadData(); // Daten neu laden
      } else {
        setError("Fehler beim Aktualisieren der Konfiguration");
      }
    } catch (error) {
      setError(
        `Fehler beim Aktualisieren: ${error instanceof Error ? error.message : "Unbekannter Fehler"}`,
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Lade A/B-Test Daten...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">❌ Fehler</div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={loadData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Erneut versuchen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">A/B-Testing Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Hero-Section A/B-Test verwalten und Statistiken einsehen
          </p>
        </div>

        {/* A/B-Test Konfiguration */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">A/B-Test Konfiguration</h2>

          {config && (
            <div className="space-y-4">
              {/* Test aktivieren/deaktivieren */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">A/B-Test aktivieren</label>
                  <p className="text-sm text-gray-500">
                    Test läuft derzeit: {config.is_active ? "Ja" : "Nein"}
                  </p>
                </div>
                <button
                  onClick={() => updateConfig({ is_active: !config.is_active })}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    config.is_active
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {config.is_active ? "Test stoppen" : "Test starten"}
                </button>
              </div>

              {/* Traffic Split */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Traffic Split: {config.traffic_split}% für Variante A
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={config.traffic_split}
                  onChange={(e) => updateConfig({ traffic_split: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0% A</span>
                  <span>100% A</span>
                </div>
              </div>

              {/* Auto-Activate Winner */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Gewinner automatisch aktivieren
                  </label>
                  <p className="text-sm text-gray-500">
                    Nach {config.auto_activate_threshold} Klicks oder {config.auto_activate_days}{" "}
                    Tagen
                  </p>
                </div>
                <button
                  onClick={() =>
                    updateConfig({
                      auto_activate_winner: !config.auto_activate_winner,
                    })
                  }
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    config.auto_activate_winner
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                  }`}
                >
                  {config.auto_activate_winner ? "Aktiviert" : "Deaktiviert"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Statistiken */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Gesamtstatistiken */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Gesamtstatistiken</h3>
            {totals ? (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Impressionen:</span>
                  <span className="font-semibold">{totals.total_impressions.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Klicks:</span>
                  <span className="font-semibold">{totals.total_clicks.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Conversions:</span>
                  <span className="font-semibold">{totals.total_conversions.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">CTR:</span>
                  <span className="font-semibold text-blue-600">
                    {Number(totals.overall_ctr).toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Conversion Rate:</span>
                  <span className="font-semibold text-green-600">
                    {Number(totals.overall_conversion_rate).toFixed(2)}%
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Noch keine Daten verfügbar</p>
            )}
          </div>

          {/* Hero-Varianten */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Hero-Varianten</h3>
            <div className="space-y-3">
              {variants.map((variant) => (
                <div key={variant.id} className="border rounded-lg p-3">
                  <div className="font-medium text-gray-900">Variante {variant.id}</div>
                  <div className="text-sm text-gray-600">{variant.title}</div>
                  <div className="text-sm text-gray-500">{variant.subtitle}</div>
                  <div className="text-sm text-blue-600">{variant.button_text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detaillierte Statistiken */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Detaillierte Statistiken</h3>
          {stats.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Variante
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Device
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Impressionen
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Klicks
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Conversions
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CTR
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Conversion Rate
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.map((stat, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {stat.variant_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {stat.device_type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {stat.impressions.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {stat.clicks.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {stat.conversions.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-semibold">
                        {Number(stat.ctr).toFixed(2)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                        {Number(stat.conversion_rate).toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">Noch keine detaillierten Statistiken verfügbar</p>
          )}
        </div>

        {/* Refresh Button */}
        <div className="mt-8 text-center">
          <button
            onClick={loadData}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Daten aktualisieren
          </button>
        </div>
      </div>
    </div>
  );
}
