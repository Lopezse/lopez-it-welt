/**
 * A/B-Testing & Experimente - Admin Dashboard
 * Enterprise++ Standard für Experiment-Management
 */

"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FaChartLine,
  FaPlay,
  FaPause,
  FaStop,
  FaEdit,
  FaPlus,
  FaTrash,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
} from "react-icons/fa";

interface Experiment {
  id: number;
  name: string;
  description: string;
  goal: string;
  status: "draft" | "running" | "paused" | "completed";
  split_a: number;
  auto_winner_days: number;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
  variants?: Variant[];
}

interface Variant {
  id: number;
  experiment_id: number;
  variant_key: string;
  title: string;
  subtitle: string;
  description: string;
  button_text: string;
  button_link: string;
  impressions: number;
  clicks: number;
  conversions: number;
}

interface Config {
  id: number;
  ab_active: boolean;
  default_split: number;
  auto_winner_enabled: boolean;
  auto_winner_threshold: number;
  auto_winner_days: number;
}

export default function ABExperimentsPage() {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [config, setConfig] = useState<Config | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedExperiment, setSelectedExperiment] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Experimente laden
      const expResponse = await fetch("/api/ab/experiments");
      const expData = await expResponse.json();
      setExperiments(expData.experiments || []);

      // Konfiguration laden
      const configResponse = await fetch("/api/ab/config");
      const configData = await configResponse.json();
      setConfig(configData);
    } catch (error) {
      setError(
        `Fehler beim Laden der Daten: ${error instanceof Error ? error.message : "Unbekannter Fehler"}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const startExperiment = async (experimentId: number) => {
    try {
      const response = await fetch("/api/ab/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ experiment_id: experimentId }),
      });

      if (response.ok) {
        await loadData();
      } else {
        setError("Fehler beim Starten des Experiments");
      }
    } catch (error) {
      setError("Fehler beim Starten des Experiments");
    }
  };

  const stopExperiment = async (experimentId: number) => {
    try {
      const response = await fetch("/api/ab/stop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ experiment_id: experimentId, status: "paused" }),
      });

      if (response.ok) {
        await loadData();
      } else {
        setError("Fehler beim Stoppen des Experiments");
      }
    } catch (error) {
      setError("Fehler beim Stoppen des Experiments");
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      draft: "bg-gray-100 text-gray-800",
      running: "bg-green-100 text-green-800",
      paused: "bg-yellow-100 text-yellow-800",
      completed: "bg-blue-100 text-blue-800",
    };
    return badges[status as keyof typeof badges] || "bg-gray-100 text-gray-800";
  };

  const getStatusText = (status: string) => {
    const texts = {
      draft: "Entwurf",
      running: "Läuft",
      paused: "Pausiert",
      completed: "Abgeschlossen",
    };
    return texts[status as keyof typeof texts] || status;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-blue-600 text-4xl mx-auto mb-4" />
          <p className="text-gray-600">Lade Experimente...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaTimesCircle className="text-red-600 text-4xl mx-auto mb-4" />
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
          <h1 className="text-3xl font-bold text-gray-900">A/B-Testing & Experimente</h1>
          <p className="mt-2 text-gray-600">
            Verwalten Sie Ihre A/B-Tests und analysieren Sie die Ergebnisse
          </p>
        </div>

        {/* Globale Konfiguration */}
        {config && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Globale Einstellungen</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  A/B-Testing aktiv
                </label>
                <div className="flex items-center">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      config.ab_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {config.ab_active ? "Aktiv" : "Inaktiv"}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Standard Traffic Split
                </label>
                <p className="text-gray-900 font-semibold">{config.default_split}%</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Auto-Winner aktiviert
                </label>
                <div className="flex items-center">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      config.auto_winner_enabled
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {config.auto_winner_enabled ? "Ja" : "Nein"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Experimente Liste */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Experimente</h2>
            <Link
              href="/admin/ab-experiments/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <FaPlus className="mr-2" />
              Neues Experiment
            </Link>
          </div>

          {experiments.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <FaChartLine className="text-4xl mx-auto mb-4 text-gray-400" />
              <p>Keine Experimente vorhanden</p>
              <Link
                href="/admin/ab-experiments/new"
                className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Erstes Experiment erstellen
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {experiments.map((experiment) => (
                <div key={experiment.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{experiment.name}</h3>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(
                            experiment.status,
                          )}`}
                        >
                          {getStatusText(experiment.status)}
                        </span>
                      </div>
                      {experiment.description && (
                        <p className="text-gray-600 mb-2">{experiment.description}</p>
                      )}
                      {experiment.goal && (
                        <p className="text-sm text-gray-500">
                          <strong>Ziel:</strong> {experiment.goal}
                        </p>
                      )}
                      {experiment.variants && experiment.variants.length > 0 && (
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          {experiment.variants.map((variant) => (
                            <div key={variant.id} className="border rounded-lg p-4 bg-gray-50">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-gray-900">
                                  Variante {variant.variant_key}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {variant.impressions} Impressionen
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-1">{variant.title}</p>
                              <div className="flex gap-2 text-xs text-gray-500 mt-2">
                                <span>
                                  CTR:{" "}
                                  {variant.impressions > 0
                                    ? ((variant.clicks / variant.impressions) * 100).toFixed(2)
                                    : 0}
                                  %
                                </span>
                                <span>Klicks: {variant.clicks}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      {experiment.status === "draft" && (
                        <button
                          onClick={() => startExperiment(experiment.id)}
                          className="p-2 bg-green-600 text-white rounded hover:bg-green-700"
                          title="Experiment starten"
                        >
                          <FaPlay />
                        </button>
                      )}
                      {experiment.status === "running" && (
                        <button
                          onClick={() => stopExperiment(experiment.id)}
                          className="p-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                          title="Experiment pausieren"
                        >
                          <FaPause />
                        </button>
                      )}
                      <Link
                        href={`/admin/ab-experiments/${experiment.id}`}
                        className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        title="Details anzeigen"
                      >
                        <FaEdit />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/admin/ab-experiments/stats"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <FaChartLine className="text-2xl text-blue-600 mb-2" />
            <h3 className="font-semibold text-gray-900">Statistiken</h3>
            <p className="text-sm text-gray-600 mt-2">Detaillierte Analyse und Reports</p>
          </Link>
          <Link
            href="/admin/ab-experiments/settings"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <FaChartLine className="text-2xl text-blue-600 mb-2" />
            <h3 className="font-semibold text-gray-900">Einstellungen</h3>
            <p className="text-sm text-gray-600 mt-2">Globale Konfiguration anpassen</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
