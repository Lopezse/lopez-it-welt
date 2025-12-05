/**
 * Trigger-Liste - Enterprise++ Standard
 * 
 * Liste aller Trigger mit Filter und Aktionen
 * Implementiert gemäß P8-UI-HANDBOOK-FOR-BUILDER.md
 */

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { useAdminPermissions } from "@/lib/hooks/useAdminPermissions";
import Link from "next/link";

interface Trigger {
  id: string;
  name: string;
  type: string;
  enabled: boolean;
  approval_required: boolean;
  approval_status?: string;
  created_at: string;
  updated_at: string;
}

export default function TriggersListPage() {
  const [triggers, setTriggers] = useState<Trigger[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | undefined>(undefined);
  const [filters, setFilters] = useState({
    enabled: "",
    type: "",
  });
  
  const { canManage } = useAdminPermissions();

  useEffect(() => {
    loadTriggers();
  }, [filters]);

  const loadTriggers = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters.enabled) params.append("enabled", filters.enabled);
      if (filters.type) params.append("type", filters.type);

      const response = await fetch(`/api/orchestrator/triggers?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Fehler beim Laden der Trigger");
      }

      const data = await response.json();
      if (data.success) {
        setTriggers(data.data || []);
      } else {
        throw new Error(data.message || "Fehler beim Laden der Trigger");
      }
    } catch (err: any) {
      setError(err.message || "Fehler beim Laden der Trigger");
    } finally {
      setLoading(false);
    }
  };

  const toggleTrigger = async (triggerId: string, enabled: boolean) => {
    try {
      const response = await fetch(`/api/orchestrator/triggers/${triggerId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled }),
      });

      const data = await response.json();
      if (response.ok) {
        await loadTriggers();
        setError(null);
        setErrorCode(undefined);
      } else {
        setError(data.message || "Die Aktion konnte nicht ausgeführt werden. Bitte prüfen Sie P7-Freigabe und Konfiguration oder versuchen Sie es später erneut.");
        setErrorCode(data.error_code);
      }
    } catch (err) {
      console.error("Fehler beim Toggle Trigger:", err);
      setError("Die Aktion konnte nicht ausgeführt werden. Bitte prüfen Sie P7-Freigabe und Konfiguration oder versuchen Sie es später erneut.");
      setErrorCode(undefined);
    }
  };

  if (loading && triggers.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Lade Trigger...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <Button onClick={loadTriggers}>Erneut laden</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Trigger-Verwaltung
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Verwalten Sie alle Event-basierten und Zeit-basierten Trigger
            </p>
          </div>
          {canManage() && (
            <Link href="/admin/orchestrator/automation/triggers/new">
              <Button variant="primary">Neuer Trigger</Button>
            </Link>
          )}
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-6">
            <ErrorBanner 
              message={error} 
              errorCode={errorCode}
              onDismiss={() => {
                setError(null);
                setErrorCode(undefined);
              }}
            />
          </div>
        )}

        {/* Filter */}
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={filters.enabled}
                onChange={(e) => setFilters({ ...filters, enabled: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Alle</option>
                <option value="true">Aktiv</option>
                <option value="false">Inaktiv</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Typ
              </label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Alle</option>
                <option value="event-based">Event-basiert</option>
                <option value="time-based">Zeit-basiert</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => setFilters({ enabled: "", type: "" })}
              >
                Filter zurücksetzen
              </Button>
            </div>
          </div>
        </div>

        {/* Trigger-Liste */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Typ
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Approval
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Aktionen
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {triggers.length > 0 ? (
                  triggers.map((trigger) => (
                    <tr key={trigger.id}>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                        <Link
                          href={`/admin/orchestrator/automation/triggers/${trigger.id}`}
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          {trigger.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{trigger.type}</td>
                      <td className="px-4 py-3 text-sm">
                        <StatusBadge
                          status={trigger.enabled ? "Aktiv" : "Inaktiv"}
                          variant={trigger.enabled ? "success" : "default"}
                        />
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {trigger.approval_required && (
                          <StatusBadge
                            status={trigger.approval_status || "pending"}
                            variant={
                              trigger.approval_status === "approved"
                                ? "success"
                                : trigger.approval_status === "rejected"
                                ? "error"
                                : "warning"
                            }
                          />
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {canManage() && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => toggleTrigger(trigger.id, !trigger.enabled)}
                              className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              {trigger.enabled ? "Deaktivieren" : "Aktivieren"}
                            </button>
                          </div>
                        )}
                        {!canManage() && (
                          <span className="text-gray-400 dark:text-gray-500 text-xs">Nur Ansicht</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-4 text-center text-gray-500 dark:text-gray-400">
                      Keine Trigger gefunden
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

