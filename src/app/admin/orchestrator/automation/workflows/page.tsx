/**
 * Workflow-Liste - Enterprise++ Standard
 * 
 * Liste aller Workflows mit Filter und Aktionen
 * Implementiert gemäß P8-UI-HANDBOOK-FOR-BUILDER.md
 */

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { useAdminPermissions } from "@/lib/hooks/useAdminPermissions";
import Link from "next/link";

interface Workflow {
  id: string;
  name: string;
  description?: string;
  status: string;
  approval_required: boolean;
  approval_status?: string;
  created_at: string;
  updated_at: string;
}

export default function WorkflowsListPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | undefined>(undefined);
  const [filters, setFilters] = useState({
    status: "",
  });
  
  const { canManage } = useAdminPermissions();

  useEffect(() => {
    loadWorkflows();
  }, [filters]);

  const loadWorkflows = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);

      const response = await fetch(`/api/orchestrator/workflows?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Fehler beim Laden der Workflows");
      }

      const data = await response.json();
      if (data.success) {
        setWorkflows(data.data || []);
        setError(null);
        setErrorCode(undefined);
      } else {
        setError(data.message || "Die Aktion konnte nicht ausgeführt werden. Bitte prüfen Sie P7-Freigabe und Konfiguration oder versuchen Sie es später erneut.");
        setErrorCode(data.error_code);
      }
    } catch (err: any) {
      console.error("Fehler beim Laden der Workflows:", err);
      setError("Die Aktion konnte nicht ausgeführt werden. Bitte prüfen Sie P7-Freigabe und Konfiguration oder versuchen Sie es später erneut.");
      setErrorCode(undefined);
    } finally {
      setLoading(false);
    }
  };

  if (loading && workflows.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Lade Workflows...</p>
        </div>
      </div>
    );
  }

  if (error && workflows.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          <div className="text-center">
            <Button onClick={loadWorkflows}>Erneut laden</Button>
          </div>
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
              Workflow-Verwaltung
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Verwalten Sie alle Multi-Step-Workflows
            </p>
          </div>
          {canManage() && (
            <Link href="/admin/orchestrator/automation/workflows/new">
              <Button variant="primary">Neuer Workflow</Button>
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

        {/* Workflow-Liste */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Beschreibung
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
                {workflows.length > 0 ? (
                  workflows.map((workflow) => (
                    <tr key={workflow.id}>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                        <Link
                          href={`/admin/orchestrator/automation/workflows/${workflow.id}`}
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          {workflow.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {workflow.description || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <StatusBadge status={workflow.status} />
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {workflow.approval_required && (
                          <StatusBadge
                            status={workflow.approval_status || "pending"}
                            variant={
                              workflow.approval_status === "approved"
                                ? "success"
                                : workflow.approval_status === "rejected"
                                ? "error"
                                : "warning"
                            }
                          />
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <Link
                          href={`/admin/orchestrator/automation/workflows/${workflow.id}/executions`}
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Executions →
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-4 text-center text-gray-500 dark:text-gray-400">
                      Keine Workflows gefunden
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

