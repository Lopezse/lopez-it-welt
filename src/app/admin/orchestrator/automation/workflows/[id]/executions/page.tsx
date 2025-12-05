/**
 * Workflow Executions - Enterprise++ Standard
 * 
 * Liste der Workflow-Ausführungen
 * Implementiert gemäß P8-UI-PHASE-2
 */

"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import Link from "next/link";

interface Execution {
  id: string;
  execution_id: string;
  status: string;
  current_step?: string;
  started_at: string;
  completed_at?: string;
  error?: string;
}

export default function WorkflowExecutionsPage() {
  const params = useParams();
  const workflowId = params.id as string;
  
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [workflowName, setWorkflowName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: "",
  });

  useEffect(() => {
    loadWorkflow();
    loadExecutions();
  }, [workflowId, filters]);

  const loadWorkflow = async () => {
    try {
      const response = await fetch(`/api/orchestrator/workflows/${workflowId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setWorkflowName(data.data.name);
        }
      }
    } catch (err) {
      console.error("Fehler beim Laden des Workflows:", err);
    }
  };

  const loadExecutions = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      params.append("limit", "100");

      const response = await fetch(
        `/api/orchestrator/workflows/${workflowId}/executions?${params.toString()}`
      );
      if (!response.ok) {
        throw new Error("Fehler beim Laden der Executions");
      }

      const data = await response.json();
      if (data.success) {
        setExecutions(data.data.executions || []);
      } else {
        throw new Error(data.message || "Fehler beim Laden der Executions");
      }
    } catch (err: any) {
      setError(err.message || "Fehler beim Laden der Executions");
    } finally {
      setLoading(false);
    }
  };

  const calculateDuration = (started: string, completed?: string): string => {
    if (!completed) return "-";
    const start = new Date(started).getTime();
    const end = new Date(completed).getTime();
    const duration = Math.floor((end - start) / 1000); // Sekunden
    if (duration < 60) return `${duration}s`;
    if (duration < 3600) return `${Math.floor(duration / 60)}m ${duration % 60}s`;
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  if (loading && executions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Lade Executions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <Button onClick={loadExecutions}>Erneut laden</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href={`/admin/orchestrator/automation/workflows/${workflowId}`}>
            <Button variant="outline" className="mb-4">← Zurück zum Workflow</Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Workflow-Executions
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {workflowName && `Ausführungen für: ${workflowName}`}
          </p>
        </div>

        {/* Filter */}
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Alle</option>
                <option value="active">Aktiv</option>
                <option value="paused">Pausiert</option>
                <option value="completed">Abgeschlossen</option>
                <option value="failed">Fehlgeschlagen</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => setFilters({ status: "" })}
              >
                Filter zurücksetzen
              </Button>
            </div>
          </div>
        </div>

        {/* Executions-Liste */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Execution-ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Aktueller Schritt
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Gestartet
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Abgeschlossen
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Dauer
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {executions.length > 0 ? (
                  executions.map((execution) => (
                    <tr key={execution.id}>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                        {execution.execution_id}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <StatusBadge status={execution.status} />
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {execution.current_step || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {new Date(execution.started_at).toLocaleString("de-DE")}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {execution.completed_at
                          ? new Date(execution.completed_at).toLocaleString("de-DE")
                          : "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {calculateDuration(execution.started_at, execution.completed_at)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-4 text-center text-gray-500 dark:text-gray-400">
                      Keine Executions gefunden
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6">
          <Button onClick={loadExecutions} variant="outline" disabled={loading}>
            {loading ? "Lädt..." : "Aktualisieren"}
          </Button>
        </div>
      </div>
    </div>
  );
}






