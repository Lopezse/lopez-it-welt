/**
 * Status Dashboard - Enterprise++ Standard
 * 
 * Gesamt-Status-Dashboard für Orchestrator Level 2
 * Implementiert gemäß P8-UI-HANDBOOK-FOR-BUILDER.md
 */

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ErrorBanner } from "@/components/ui/ErrorBanner";

interface OrchestratorStatus {
  level: number;
  automation_enabled: boolean;
  total_triggers: number;
  active_triggers: number;
  total_workflows: number;
  active_workflows: number;
}

interface TriggerStatus {
  id: string;
  name: string;
  enabled: boolean;
  last_fired?: string;
}

interface WorkflowStatus {
  id: string;
  name: string;
  status: string;
  last_executed?: string;
}

interface QueueStatus {
  waiting: number;
  active: number;
  completed: number;
  failed: number;
}

interface ApprovalStatus {
  use_case: string;
  approval_status: string;
  expires_at?: string;
}

export default function StatusDashboardPage() {
  const [overallStatus, setOverallStatus] = useState<OrchestratorStatus | null>(null);
  const [triggerStatus, setTriggerStatus] = useState<TriggerStatus[]>([]);
  const [workflowStatus, setWorkflowStatus] = useState<WorkflowStatus[]>([]);
  const [queueStatus, setQueueStatus] = useState<QueueStatus | null>(null);
  const [approvalStatus, setApprovalStatus] = useState<ApprovalStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | undefined>(undefined);

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

      // Gesamt-Status
      const statusResponse = await fetch("/api/orchestrator/status");
      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        if (statusData.success) {
          setOverallStatus(statusData.data);
        }
      }

      // Trigger-Status
      const triggersResponse = await fetch("/api/orchestrator/status/triggers");
      if (triggersResponse.ok) {
        const triggersData = await triggersResponse.json();
        if (triggersData.success) {
          setTriggerStatus(triggersData.data || []);
        }
      }

      // Workflow-Status
      const workflowsResponse = await fetch("/api/orchestrator/status/workflows");
      if (workflowsResponse.ok) {
        const workflowsData = await workflowsResponse.json();
        if (workflowsData.success) {
          setWorkflowStatus(workflowsData.data || []);
        }
      }

      // Queue-Status
      const queueResponse = await fetch("/api/orchestrator/status/queue");
      if (queueResponse.ok) {
        const queueData = await queueResponse.json();
        if (queueData.success) {
          setQueueStatus(queueData.data);
        }
      }

      // Approval-Status
      const approvalsResponse = await fetch("/api/orchestrator/approvals/status");
      if (approvalsResponse.ok) {
        const approvalsData = await approvalsResponse.json();
        if (approvalsData.success) {
          setApprovalStatus(approvalsData.data || []);
        }
      }
    } catch (err) {
      console.error("Fehler beim Laden der Status-Daten:", err);
      setError("Die Aktion konnte nicht ausgeführt werden. Bitte prüfen Sie P7-Freigabe und Konfiguration oder versuchen Sie es später erneut.");
      setErrorCode(undefined);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !overallStatus) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Lade Status-Daten...</p>
        </div>
      </div>
    );
  }

  if (error && !overallStatus) {
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
            <Button onClick={loadData}>Erneut laden</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Orchestrator Status
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gesamt-Übersicht über Orchestrator Level 2
          </p>
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

        {/* Gesamt-Status */}
        {overallStatus && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Gesamt-Status
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Orchestrator Level</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{overallStatus.level}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Automation</p>
                <StatusBadge
                  status={overallStatus.automation_enabled ? "Aktiv" : "Inaktiv"}
                  variant={overallStatus.automation_enabled ? "success" : "default"}
                />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Trigger gesamt</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{overallStatus.total_triggers}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Aktive Trigger</p>
                <p className="text-2xl font-bold text-green-600">{overallStatus.active_triggers}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Aktive Workflows</p>
                <p className="text-2xl font-bold text-green-600">{overallStatus.active_workflows}</p>
              </div>
            </div>
          </div>
        )}

        {/* Queue-Status */}
        {queueStatus && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Queue-Status
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Wartend</p>
                <p className="text-2xl font-bold text-yellow-600">{queueStatus.waiting}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Aktiv</p>
                <p className="text-2xl font-bold text-blue-600">{queueStatus.active}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Abgeschlossen</p>
                <p className="text-2xl font-bold text-green-600">{queueStatus.completed}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Fehlgeschlagen</p>
                <p className="text-2xl font-bold text-red-600">{queueStatus.failed}</p>
              </div>
            </div>
          </div>
        )}

        {/* Trigger-Status */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Trigger-Status
          </h2>
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
                    Letzte Auslösung
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {triggerStatus.length > 0 ? (
                  triggerStatus.map((trigger) => (
                    <tr key={trigger.id}>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{trigger.name}</td>
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
                    <td colSpan={3} className="px-4 py-4 text-center text-gray-500 dark:text-gray-400">
                      Keine Trigger gefunden
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Workflow-Status */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Workflow-Status
          </h2>
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
                {workflowStatus.length > 0 ? (
                  workflowStatus.map((workflow) => (
                    <tr key={workflow.id}>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{workflow.name}</td>
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

        {/* Approval-Status */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Approval-Status
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Use-Case
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Ablaufdatum
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {approvalStatus.length > 0 ? (
                  approvalStatus.map((approval, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{approval.use_case}</td>
                      <td className="px-4 py-3 text-sm">
                        <StatusBadge status={approval.approval_status} />
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {approval.expires_at
                          ? new Date(approval.expires_at).toLocaleDateString("de-DE")
                          : "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-4 py-4 text-center text-gray-500 dark:text-gray-400">
                      Keine Approvals gefunden
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


