"use client";

import { useState, useEffect } from "react";
import { FaRobot, FaKey, FaCog, FaDatabase, FaFileAlt, FaCheckCircle } from "react-icons/fa";

interface AIData {
  provider: "openai" | "llama" | "local";
  api_key?: string;
  model: string;
  temperature: number;
  max_tokens: number;
  top_p: number;
  token_limit_per_request: number;
  token_limit_per_day: number;
  token_limit_per_month: number;
  rag_enabled: boolean;
  rag_sources?: string[];
  rag_categories?: string[];
  embedding_model: string;
  chunk_size: number;
  logging_enabled: boolean;
  log_level: "debug" | "info" | "warn" | "error";
  log_retention_days: number;
}

export default function AISettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<AIData | null>(null);
  const [testResult, setTestResult] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await fetch("/api/admin/settings/ai");
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setData(result.data);
        }
      }
    } catch (error) {
      console.error("Fehler beim Laden der KI-Einstellungen:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!data) return;

    setSaving(true);
    try {
      const response = await fetch("/api/admin/settings/ai", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          alert("KI-Einstellungen erfolgreich aktualisiert.");
        }
      } else {
        alert("Fehler beim Aktualisieren der KI-Einstellungen.");
      }
    } catch (error) {
      console.error("Fehler beim Speichern:", error);
      alert("Fehler beim Speichern.");
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    if (!data) return;

    setTestResult(null);
    try {
      const response = await fetch("/api/admin/settings/ai/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider: data.provider }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setTestResult("Verbindung erfolgreich!");
        } else {
          setTestResult(`Fehler: ${result.error}`);
        }
      } else {
        setTestResult("Fehler beim Testen der Verbindung.");
      }
    } catch (error) {
      console.error("Fehler beim Testen:", error);
      setTestResult("Fehler beim Testen der Verbindung.");
    }
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center py-12">
        <p style={{ color: "#b3b3b3" }}>Lade KI-Einstellungen...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Provider */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center" style={{ color: "#f4f4f4" }}>
          <FaRobot className="mr-2" style={{ width: "18px", height: "18px" }} />
          Provider-Auswahl
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#f4f4f4" }}>
              Provider
            </label>
            <select
              value={data.provider}
              onChange={(e) => setData({ ...data, provider: e.target.value as any })}
              className="w-full px-4 py-2 rounded-md text-sm border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#007bff] focus:ring-offset-2 focus:ring-offset-[#111217]"
              style={{
                backgroundColor: "#1a1d24",
                borderColor: "#272a33",
                color: "#f4f4f4",
              }}
            >
              <option value="openai">OpenAI</option>
              <option value="llama">LLaMA</option>
              <option value="local">Local</option>
            </select>
          </div>
          {data.provider === "openai" && (
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#f4f4f4" }}>
                API-Key
              </label>
              <input
                type="password"
                value={data.api_key || ""}
                onChange={(e) => setData({ ...data, api_key: e.target.value })}
                placeholder="sk-..."
                className="w-full px-4 py-2 rounded-md text-sm border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#007bff] focus:ring-offset-2 focus:ring-offset-[#111217]"
                style={{
                  backgroundColor: "#1a1d24",
                  borderColor: "#272a33",
                  color: "#f4f4f4",
                }}
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#f4f4f4" }}>
              Model
            </label>
            <input
              type="text"
              value={data.model}
              onChange={(e) => setData({ ...data, model: e.target.value })}
              className="w-full px-4 py-2 rounded-md text-sm border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#007bff] focus:ring-offset-2 focus:ring-offset-[#111217]"
              style={{
                backgroundColor: "#1a1d24",
                borderColor: "#272a33",
                color: "#f4f4f4",
              }}
              placeholder="z.B. gpt-4, llama-2-7b"
            />
          </div>
        </div>
      </div>

      {/* Model Configuration */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center" style={{ color: "#f4f4f4" }}>
          <FaCog className="mr-2" style={{ width: "18px", height: "18px" }} />
          Model-Konfiguration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#f4f4f4" }}>
              Temperature (0-2)
            </label>
            <input
              type="number"
              value={data.temperature}
              onChange={(e) => setData({ ...data, temperature: parseFloat(e.target.value) || 0 })}
              min="0"
              max="2"
              step="0.1"
              className="w-full px-4 py-2 rounded-md text-sm border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#007bff] focus:ring-offset-2 focus:ring-offset-[#111217]"
              style={{
                backgroundColor: "#1a1d24",
                borderColor: "#272a33",
                color: "#f4f4f4",
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#f4f4f4" }}>
              Max Tokens
            </label>
            <input
              type="number"
              value={data.max_tokens}
              onChange={(e) => setData({ ...data, max_tokens: parseInt(e.target.value) || 0 })}
              min="1"
              className="w-full px-4 py-2 rounded-md text-sm border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#007bff] focus:ring-offset-2 focus:ring-offset-[#111217]"
              style={{
                backgroundColor: "#1a1d24",
                borderColor: "#272a33",
                color: "#f4f4f4",
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#f4f4f4" }}>
              Top-P (0-1)
            </label>
            <input
              type="number"
              value={data.top_p}
              onChange={(e) => setData({ ...data, top_p: parseFloat(e.target.value) || 0 })}
              min="0"
              max="1"
              step="0.1"
              className="w-full px-4 py-2 rounded-md text-sm border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#007bff] focus:ring-offset-2 focus:ring-offset-[#111217]"
              style={{
                backgroundColor: "#1a1d24",
                borderColor: "#272a33",
                color: "#f4f4f4",
              }}
            />
          </div>
        </div>
      </div>

      {/* Token Limits */}
      <div>
        <h3 className="text-lg font-semibold mb-4" style={{ color: "#f4f4f4" }}>
          Token-Limits
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#f4f4f4" }}>
              Pro Request
            </label>
            <input
              type="number"
              value={data.token_limit_per_request}
              onChange={(e) =>
                setData({ ...data, token_limit_per_request: parseInt(e.target.value) || 0 })
              }
              min="100"
              max="100000"
              className="w-full px-4 py-2 rounded-md text-sm border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#007bff] focus:ring-offset-2 focus:ring-offset-[#111217]"
              style={{
                backgroundColor: "#1a1d24",
                borderColor: "#272a33",
                color: "#f4f4f4",
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#f4f4f4" }}>
              Pro Tag
            </label>
            <input
              type="number"
              value={data.token_limit_per_day}
              onChange={(e) => setData({ ...data, token_limit_per_day: parseInt(e.target.value) || 0 })}
              min="100"
              max="100000"
              className="w-full px-4 py-2 rounded-md text-sm border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#007bff] focus:ring-offset-2 focus:ring-offset-[#111217]"
              style={{
                backgroundColor: "#1a1d24",
                borderColor: "#272a33",
                color: "#f4f4f4",
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#f4f4f4" }}>
              Pro Monat
            </label>
            <input
              type="number"
              value={data.token_limit_per_month}
              onChange={(e) =>
                setData({ ...data, token_limit_per_month: parseInt(e.target.value) || 0 })
              }
              min="100"
              max="100000"
              className="w-full px-4 py-2 rounded-md text-sm border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#007bff] focus:ring-offset-2 focus:ring-offset-[#111217]"
              style={{
                backgroundColor: "#1a1d24",
                borderColor: "#272a33",
                color: "#f4f4f4",
              }}
            />
          </div>
        </div>
      </div>

      {/* RAG Settings */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center" style={{ color: "#f4f4f4" }}>
          <FaDatabase className="mr-2" style={{ width: "18px", height: "18px" }} />
          RAG-Einstellungen
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-4 border-t" style={{ borderColor: "#272a33" }}>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "#f4f4f4" }}>
                RAG aktivieren
              </label>
              <p className="text-xs" style={{ color: "#8a8a8a" }}>
                Retrieval-Augmented Generation für bessere Antworten
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={data.rag_enabled}
                onChange={(e) => setData({ ...data, rag_enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div
                className="w-11 h-6 rounded-full peer transition-colors duration-200"
                style={{
                  backgroundColor: data.rag_enabled ? "#007bff" : "#272a33",
                }}
              >
                <div
                  className="w-5 h-5 rounded-full transition-transform duration-200 mt-0.5 ml-0.5"
                  style={{
                    backgroundColor: "#ffffff",
                    transform: data.rag_enabled ? "translateX(20px)" : "translateX(0)",
                  }}
                />
              </div>
            </label>
          </div>
          {data.rag_enabled && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#f4f4f4" }}>
                  Embedding-Model
                </label>
                <input
                  type="text"
                  value={data.embedding_model}
                  onChange={(e) => setData({ ...data, embedding_model: e.target.value })}
                  className="w-full px-4 py-2 rounded-md text-sm border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#007bff] focus:ring-offset-2 focus:ring-offset-[#111217]"
                  style={{
                    backgroundColor: "#1a1d24",
                    borderColor: "#272a33",
                    color: "#f4f4f4",
                  }}
                  placeholder="z.B. text-embedding-ada-002"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#f4f4f4" }}>
                  Chunk-Size
                </label>
                <input
                  type="number"
                  value={data.chunk_size}
                  onChange={(e) => setData({ ...data, chunk_size: parseInt(e.target.value) || 0 })}
                  min="100"
                  max="2000"
                  className="w-full px-4 py-2 rounded-md text-sm border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#007bff] focus:ring-offset-2 focus:ring-offset-[#111217]"
                  style={{
                    backgroundColor: "#1a1d24",
                    borderColor: "#272a33",
                    color: "#f4f4f4",
                  }}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Logging */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center" style={{ color: "#f4f4f4" }}>
          <FaFileAlt className="mr-2" style={{ width: "18px", height: "18px" }} />
          KI-Logs
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-4 border-t" style={{ borderColor: "#272a33" }}>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "#f4f4f4" }}>
                Logging aktivieren
              </label>
              <p className="text-xs" style={{ color: "#8a8a8a" }}>
                KI-Interaktionen protokollieren
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={data.logging_enabled}
                onChange={(e) => setData({ ...data, logging_enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div
                className="w-11 h-6 rounded-full peer transition-colors duration-200"
                style={{
                  backgroundColor: data.logging_enabled ? "#007bff" : "#272a33",
                }}
              >
                <div
                  className="w-5 h-5 rounded-full transition-transform duration-200 mt-0.5 ml-0.5"
                  style={{
                    backgroundColor: "#ffffff",
                    transform: data.logging_enabled ? "translateX(20px)" : "translateX(0)",
                  }}
                />
              </div>
            </label>
          </div>
          {data.logging_enabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#f4f4f4" }}>
                  Log-Level
                </label>
                <select
                  value={data.log_level}
                  onChange={(e) => setData({ ...data, log_level: e.target.value as any })}
                  className="w-full px-4 py-2 rounded-md text-sm border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#007bff] focus:ring-offset-2 focus:ring-offset-[#111217]"
                  style={{
                    backgroundColor: "#1a1d24",
                    borderColor: "#272a33",
                    color: "#f4f4f4",
                  }}
                >
                  <option value="debug">Debug</option>
                  <option value="info">Info</option>
                  <option value="warn">Warn</option>
                  <option value="error">Error</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#f4f4f4" }}>
                  Log-Retention (Tage)
                </label>
                <input
                  type="number"
                  value={data.log_retention_days}
                  onChange={(e) => setData({ ...data, log_retention_days: parseInt(e.target.value) || 0 })}
                  min="1"
                  max="365"
                  className="w-full px-4 py-2 rounded-md text-sm border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#007bff] focus:ring-offset-2 focus:ring-offset-[#111217]"
                  style={{
                    backgroundColor: "#1a1d24",
                    borderColor: "#272a33",
                    color: "#f4f4f4",
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Test & Save */}
      <div className="flex justify-between items-center pt-4 border-t" style={{ borderColor: "#272a33" }}>
        <div>
          {testResult && (
            <div
              className={`inline-flex items-center px-4 py-2 rounded-md text-sm ${
                testResult.includes("erfolgreich") ? "text-green-400" : "text-red-400"
              }`}
            >
              {testResult.includes("erfolgreich") && (
                <FaCheckCircle className="mr-2" style={{ width: "14px", height: "14px" }} />
              )}
              {testResult}
            </div>
          )}
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleTest}
            className="px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-[#007bff]"
            style={{
              backgroundColor: "transparent",
              borderColor: "#272a33",
              color: "#b3b3b3",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#1f2329";
              e.currentTarget.style.borderColor = "#3a3d47";
              e.currentTarget.style.color = "#f4f4f4";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.borderColor = "#272a33";
              e.currentTarget.style.color = "#b3b3b3";
            }}
          >
            Verbindung testen
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#007bff] focus:ring-offset-2 focus:ring-offset-[#111217] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: "#007bff",
              color: "#ffffff",
            }}
            onMouseEnter={(e) => {
              if (!saving) {
                e.currentTarget.style.backgroundColor = "#0056b3";
              }
            }}
            onMouseLeave={(e) => {
              if (!saving) {
                e.currentTarget.style.backgroundColor = "#007bff";
              }
            }}
          >
            {saving ? "Speichern..." : "Änderungen speichern"}
          </button>
        </div>
      </div>
    </div>
  );
}

