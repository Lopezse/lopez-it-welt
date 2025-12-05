/**
 * Automation Dashboard - Enterprise++ Standard
 * 
 * Haupt-Dashboard für Automation-Verwaltung
 * Implementiert gemäß P8-UI-HANDBOOK-FOR-BUILDER.md
 */

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { WarningBanner } from "@/components/ui/WarningBanner";
import { useAdminPermissions } from "@/lib/hooks/useAdminPermissions";
import { useApprovalStatus } from "@/lib/hooks/useApprovalStatus";
import Link from "next/link";

interface AutomationStatus {
  use_case: string;
  automation_enabled: boolean;
  last_triggered?: string;
  last_workflow?: string;
}

interface AutomationStats {
  total_triggers: number;
  active_triggers: number;
  total_workflows: number;
  active_workflows: number;
  trigger_firings_today: number;
  workflow_executions_today: number;
}

interface Trigger {
  id: string;
  name: string;
  type: string;
  enabled: boolean;
  last_fired?: string;
}

interface Workflow {
  id: string;
  name: string;
  status: string;
  last_executed?: string;
}

// Komponente für P7-Approval-Status pro Use-Case
function UseCaseApprovalStatus({ useCase }: { useCase: string }) {
  const { status: approvalStatus } = useApprovalStatus(useCase);
  
  if (!approvalStatus) return null;
  
  const approvalStatusValue = approvalStatus.approval_status || "none";
  const showWarning = approvalStatusValue !== "approved" && approvalStatusValue !== "not_required";
  
  return (
    <>
      <div className="mb-2">
        <StatusBadge
          status={
            approvalStatusValue === "approved"
              ? "Freigegeben"
              : approvalStatusValue === "pending"
              ? "Ausstehend"
              : approvalStatusValue === "expired"
              ? "Abgelaufen"
              : approvalStatusValue === "rejected"
              ? "Abgelehnt"
              : "Keine Freigabe"
          }
          variant={
            approvalStatusValue === "approved"
              ? "success"
              : approvalStatusValue === "pending"
              ? "warning"
              : approvalStatusValue === "expired" || approvalStatusValue === "rejected"
              ? "error"
              : "default"
          }
        />
      </div>
      {showWarning && useCase !== "unknown" && (
        <div className="mb-2">
          <WarningBanner approvalStatus={approvalStatusValue as any} useCase={useCase} />
        </div>
      )}
    </>
  );
}

export default function AutomationDashboardPage() {
  const [automationStatus, setAutomationStatus] = useState<AutomationStatus[]>([]);
  const [stats, setStats] = useState<AutomationStats | null>(null);
  const [recentTriggers, setRecentTriggers] = useState<Trigger[]>([]);
  const [recentWorkflows, setRecentWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | undefined>(undefined);
  
  const { canManage } = useAdminPermissions();

  useEffect(() => {
    loadData();
    // Auto-Refresh alle 30 Sekunden
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Automation Status
      const statusResponse = await fetch("/api/orchestrator/automation/status");
      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        if (statusData.success) {
          setAutomationStatus(statusData.data || []);
        }
      }

      // Automation Stats
      const statsResponse = await fetch("/api/orchestrator/automation/stats");
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        if (statsData.success) {
          setStats(statsData.data);
        }
      }

      // Recent Triggers
      const triggersResponse = await fetch("/api/orchestrator/triggers?limit=10");
      if (triggersResponse.ok) {
        const triggersData = await triggersResponse.json();
        if (triggersData.success) {
          setRecentTriggers(triggersData.data || []);
        }
      }

      // Recent Workflows
      const workflowsResponse = await fetch("/api/orchestrator/workflows?limit=10");
      if (workflowsResponse.ok) {
        const workflowsData = await workflowsResponse.json();
        if (workflowsData.success) {
          setRecentWorkflows(workflowsData.data || []);
        }
      }
    } catch (err) {
      console.error("Fehler beim Laden der Automation-Daten:", err);
      setError("Fehler beim Laden der Daten");
    } finally {
      setLoading(false);
    }
  };

  const toggleAutomation = async (useCase: string, enabled: boolean) => {
    try {
      const endpoint = enabled ? "/api/orchestrator/automation/enable" : "/api/orchestrator/automation/disable";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ use_case: useCase }),
      });

      const data = await response.json();
      if (response.ok) {
        await loadData();
        setError(null);
        setErrorCode(undefined);
      } else {
        setError(data.message || "Die Aktion konnte nicht ausgeführt werden. Bitte prüfen Sie P7-Freigabe und Konfiguration oder versuchen Sie es später erneut.");
        setErrorCode(data.error_code);
      }
    } catch (err) {
      console.error("Fehler beim Toggle Automation:", err);
      setError("Die Aktion konnte nicht ausgeführt werden. Bitte prüfen Sie P7-Freigabe und Konfiguration oder versuchen Sie es später erneut.");
      setErrorCode(undefined);
    }
  };

  if (loading && !stats) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Lade Automation-Daten...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <Button onClick={loadData}>Erneut laden</Button>
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
              Automation Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Verwaltung von Triggern, Workflows und Automation
            </p>
          </div>
          {canManage() && (
            <div className="flex gap-2">
              <Link href="/admin/orchestrator/automation/triggers/new">
                <Button variant="primary">Neuer Trigger</Button>
              </Link>
              <Link href="/admin/orchestrator/automation/workflows/new">
                <Button variant="primary">Neuer Workflow</Button>
              </Link>
            </div>
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

        {/* Statistik-Karten */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Trigger gesamt</h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total_triggers || 0}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Aktive Trigger</h3>
              <p className="text-3xl font-bold text-green-600">{stats.active_triggers || 0}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Workflows gesamt</h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total_workflows || 0}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Aktive Workflows</h3>
              <p className="text-3xl font-bold text-green-600">{stats.active_workflows || 0}</p>
            </div>
          </div>
        )}

        {/* Automation-Status pro Use-Case */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Automation-Status (pro Use-Case)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {automationStatus.length > 0 ? (
              automationStatus.map((status) => (
                <div
                  key={status.use_case}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900 dark:text-white">{status.use_case}</h3>
                    <StatusBadge
                      status={status.automation_enabled ? "Aktiv" : "Inaktiv"}
                      variant={status.automation_enabled ? "success" : "default"}
                    />
                  </div>
                  <UseCaseApprovalStatus useCase={status.use_case} />
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {status.automation_enabled ? "Aktiviert" : "Deaktiviert"}
                    </span>
                    {canManage() ? (
                      <button
                        onClick={() => toggleAutomation(status.use_case, !status.automation_enabled)}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {status.automation_enabled ? "Deaktivieren" : "Aktivieren"}
                      </button>
                    ) : (
                      <span className="text-sm text-gray-400 dark:text-gray-500">Nur Ansicht</span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 col-span-3 text-center py-4">
                Keine Automation-Status gefunden
              </p>
            )}
          </div>
        </div>

        {/* Letzte Trigger-Auslösungen */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Letzte Trigger
            </h2>
            <Link href="/admin/orchestrator/automation/triggers">
              <Button variant="outline" size="sm">Alle anzeigen →</Button>
            </Link>
          </div>
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
                    Letzte Auslösung
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {recentTriggers.length > 0 ? (
                  recentTriggers.map((trigger) => (
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
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {trigger.last_fired
                          ? new Date(trigger.last_fired).toLocaleString("de-DE")
                          : "Nie"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-4 text-center text-gray-500 dark:text-gray-400">
                      Keine Trigger gefunden
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Letzte Workflow-Ausführungen */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Letzte Workflows
            </h2>
            <Link href="/admin/orchestrator/automation/workflows">
              <Button variant="outline" size="sm">Alle anzeigen →</Button>
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Letzte Ausführung
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {recentWorkflows.length > 0 ? (
                  recentWorkflows.map((workflow) => (
                    <tr key={workflow.id}>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                        <Link
                          href={`/admin/orchestrator/automation/workflows/${workflow.id}`}
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          {workflow.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <StatusBadge status={workflow.status} />
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {workflow.last_executed
                          ? new Date(workflow.last_executed).toLocaleString("de-DE")
                          : "Nie"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-4 py-4 text-center text-gray-500 dark:text-gray-400">
                      Keine Workflows gefunden
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6">
          <Button onClick={loadData} variant="outline" disabled={loading}>
            {loading ? "Lädt..." : "Aktualisieren"}
          </Button>
        </div>
      </div>
    </div>
  );
}

