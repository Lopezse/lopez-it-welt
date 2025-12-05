/**
 * Workflow-Detail - Enterprise++ Standard
 * 
 * Detail-Ansicht eines Workflows
 * Implementiert gemäß P8-UI-PHASE-2
 */

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { JSONViewer } from "@/components/ui/JSONViewer";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { WarningBanner } from "@/components/ui/WarningBanner";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useAdminPermissions } from "@/lib/hooks/useAdminPermissions";
import { useApprovalStatus } from "@/lib/hooks/useApprovalStatus";
import Link from "next/link";

interface Workflow {
  id: string;
  name: string;
  description?: string;
  steps: unknown[];
  status: string;
  current_step?: string;
  approval_required: boolean;
  approval_status?: string;
  created_at: string;
  updated_at: string;
}

interface Execution {
  id: string;
  execution_id: string;
  status: string;
  started_at: string;
  completed_at?: string;
}

export default function WorkflowDetailPage() {
  const params = useParams();
  const router = useRouter();
  const workflowId = params.id as string;
  
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | undefined>(undefined);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showStartConfirm, setShowStartConfirm] = useState(false);
  
  const { canManage } = useAdminPermissions();
  
  // Use-Case extrahieren
  const extractUseCase = (): string => {
    if (!workflow) return "unknown";
    if (Array.isArray(workflow.steps) && workflow.steps.length > 0) {
      const firstStep = workflow.steps[0] as any;
      if (firstStep.use_case && firstStep.use_case !== "unknown") return firstStep.use_case;
      if (firstStep.agent) {
        const agent = firstStep.agent.toLowerCase();
        if (agent.includes("media")) return "media-ki";
        if (agent.includes("content")) return "content-agent";
        if (agent.includes("compliance")) return "compliance-agent";
      }
    }
    const name = workflow.name.toLowerCase();
    if (name.includes("media")) return "media-ki";
    if (name.includes("content")) return "content-agent";
    if (name.includes("compliance")) return "compliance-agent";
    return "unknown";
  };

  const useCase = workflow ? extractUseCase() : null;
  const { status: approvalStatus } = useApprovalStatus(useCase);

  useEffect(() => {
    loadWorkflow();
    loadExecutions();
  }, [workflowId]);

  const loadWorkflow = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/orchestrator/workflows/${workflowId}`);
      if (!response.ok) {
        throw new Error("Fehler beim Laden des Workflows");
      }

      const data = await response.json();
      if (data.success) {
        setWorkflow(data.data);
        setError(null);
        setErrorCode(undefined);
      } else {
        setError(data.message || "Die Aktion konnte nicht ausgeführt werden. Bitte prüfen Sie P7-Freigabe und Konfiguration oder versuchen Sie es später erneut.");
        setErrorCode(data.error_code);
      }
    } catch (err: any) {
      setError("Die Aktion konnte nicht ausgeführt werden. Bitte prüfen Sie P7-Freigabe und Konfiguration oder versuchen Sie es später erneut.");
      setErrorCode(undefined);
      console.error("Fehler beim Laden des Workflows:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadExecutions = async () => {
    try {
      const response = await fetch(
        `/api/orchestrator/workflows/${workflowId}/executions?limit=10`
      );
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setExecutions(data.data.executions || []);
        }
      }
    } catch (err) {
      console.error("Fehler beim Laden der Executions:", err);
    }
  };

  const handleAction = async (action: "start" | "pause" | "resume") => {
    try {
      setActionLoading(action);
      const response = await fetch(`/api/orchestrator/workflows/${workflowId}/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        await loadWorkflow();
        await loadExecutions();
        setError(null);
        setErrorCode(undefined);
      } else {
        setError(data.message || "Die Aktion konnte nicht ausgeführt werden. Bitte prüfen Sie P7-Freigabe und Konfiguration oder versuchen Sie es später erneut.");
        setErrorCode(data.error_code);
      }
    } catch (err) {
      console.error(`Fehler beim ${action}:`, err);
      setError("Die Aktion konnte nicht ausgeführt werden. Bitte prüfen Sie P7-Freigabe und Konfiguration oder versuchen Sie es später erneut.");
      setErrorCode(undefined);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async () => {
    setShowDeleteConfirm(false);
    
    try {
      setError(null);
      setErrorCode(undefined);
      
      const response = await fetch(`/api/orchestrator/workflows/${workflowId}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (response.ok) {
        router.push("/admin/orchestrator/automation/workflows");
      } else {
        setError(data.message || "Die Aktion konnte nicht ausgeführt werden. Bitte prüfen Sie P7-Freigabe und Konfiguration oder versuchen Sie es später erneut.");
        setErrorCode(data.error_code);
      }
    } catch (err) {
      console.error("Fehler beim Löschen:", err);
      setError("Die Aktion konnte nicht ausgeführt werden. Bitte prüfen Sie P7-Freigabe und Konfiguration oder versuchen Sie es später erneut.");
      setErrorCode(undefined);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Lade Workflow...</p>
        </div>
      </div>
    );
  }

  if (error || !workflow) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error || "Workflow nicht gefunden"}</p>
          <Link href="/admin/orchestrator/automation/workflows">
            <Button variant="outline">Zurück zur Liste</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Prüfe ob Aktionen erlaubt sind
  const canExecute = approvalStatus?.can_execute ?? false;
  const approvalStatusValue = approvalStatus?.approval_status || "none";
  const showWarning = approvalStatusValue !== "approved" && approvalStatusValue !== "not_required";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin/orchestrator/automation/workflows">
            <Button variant="outline" className="mb-4">← Zurück zur Liste</Button>
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {workflow.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {workflow.description || "Workflow-Detail-Ansicht"}
              </p>
            </div>
            {canManage() && (
              <div className="flex gap-2">
                {workflow.status === "active" && (
                  <Button
                    variant="outline"
                    onClick={() => handleAction("pause")}
                    disabled={actionLoading !== null || (!canExecute && showWarning)}
                    title={!canExecute && showWarning ? "Aktion nur bei gültiger P7-Freigabe möglich." : undefined}
                  >
                    {actionLoading === "pause" ? "Wird pausiert..." : "Pausieren"}
                  </Button>
                )}
                {workflow.status === "paused" && (
                  <Button
                    variant="primary"
                    onClick={() => handleAction("resume")}
                    disabled={actionLoading !== null || (!canExecute && showWarning)}
                    title={!canExecute && showWarning ? "Aktion nur bei gültiger P7-Freigabe möglich." : undefined}
                  >
                    {actionLoading === "resume" ? "Wird fortgesetzt..." : "Fortsetzen"}
                  </Button>
                )}
                {workflow.status !== "active" && workflow.status !== "paused" && (
                  <Button
                    variant="primary"
                    onClick={() => setShowStartConfirm(true)}
                    disabled={actionLoading !== null || (!canExecute && showWarning)}
                    title={!canExecute && showWarning ? "Aktion nur bei gültiger P7-Freigabe möglich." : undefined}
                  >
                    {actionLoading === "start" ? "Wird gestartet..." : "Starten"}
                  </Button>
                )}
                <Button 
                  variant="destructive" 
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={!canExecute && showWarning}
                  title={!canExecute && showWarning ? "Aktion nur bei gültiger P7-Freigabe möglich." : undefined}
                >
                  Löschen
                </Button>
              </div>
            )}
          </div>
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

        {/* Warning Banner bei fehlender/abgelaufener P7-Freigabe */}
        {showWarning && useCase && useCase !== "unknown" && (
          <div className="mb-6">
            <WarningBanner approvalStatus={approvalStatusValue as any} useCase={useCase} />
          </div>
        )}

        {/* "unknown" Use-Case Warnung */}
        {useCase === "unknown" && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-sm font-medium text-red-800 dark:text-red-200">
              ⚠️ Konfiguration fehlerhaft – Use-Case nicht gesetzt. DSFA-konforme Ausführung ist nicht möglich.
            </p>
          </div>
        )}

        {/* Bestätigungs-Dialoge */}
        <ConfirmDialog
          open={showDeleteConfirm}
          title="Workflow löschen"
          message="Möchten Sie diesen Workflow wirklich löschen? Diese Aktion wird protokolliert und kann nicht rückgängig gemacht werden."
          confirmText="Löschen"
          cancelText="Abbrechen"
          variant="destructive"
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
        <ConfirmDialog
          open={showStartConfirm}
          title="Workflow starten"
          message="Möchten Sie diesen Workflow starten? Diese Aktion wird protokolliert."
          confirmText="Starten"
          cancelText="Abbrechen"
          onConfirm={() => {
            setShowStartConfirm(false);
            handleAction("start");
          }}
          onCancel={() => setShowStartConfirm(false)}
        />

        {/* Workflow-Informationen */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Workflow-Informationen
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">ID</label>
              <p className="text-sm text-gray-900 dark:text-white">{workflow.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Name</label>
              <p className="text-sm text-gray-900 dark:text-white">{workflow.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</label>
              <div className="mt-1">
                <StatusBadge status={workflow.status} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Aktueller Schritt</label>
              <p className="text-sm text-gray-900 dark:text-white">
                {workflow.current_step || "-"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Use-Case</label>
              {useCase === "unknown" ? (
                <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                  ⚠️ Konfiguration fehlerhaft – Use-Case nicht gesetzt
                </p>
              ) : (
                <p className="text-sm text-gray-900 dark:text-white">{useCase}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">P7-Approval-Status</label>
              <div className="mt-1">
                {approvalStatus && (
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
                )}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Approval erforderlich</label>
              <div className="mt-1">
                {workflow.approval_required ? (
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
                ) : (
                  <span className="text-sm text-gray-500 dark:text-gray-400">Nicht erforderlich</span>
                )}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Anzahl Schritte</label>
              <p className="text-sm text-gray-900 dark:text-white">
                {Array.isArray(workflow.steps) ? workflow.steps.length : 0}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Erstellt am</label>
              <p className="text-sm text-gray-900 dark:text-white">
                {new Date(workflow.created_at).toLocaleString("de-DE")}
              </p>
            </div>
          </div>
        </div>

        {/* Workflow-Schritte */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Workflow-Schritte
          </h2>
          <JSONViewer data={workflow.steps} title="Schritte (JSON)" />
        </div>

        {/* Execution-Overview */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Letzte Ausführungen
            </h2>
            <Link href={`/admin/orchestrator/automation/workflows/${workflowId}/executions`}>
              <Button variant="outline" size="sm">Alle anzeigen →</Button>
            </Link>
          </div>
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
                    Gestartet
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Abgeschlossen
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
                        {new Date(execution.started_at).toLocaleString("de-DE")}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {execution.completed_at
                          ? new Date(execution.completed_at).toLocaleString("de-DE")
                          : "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-4 text-center text-gray-500 dark:text-gray-400">
                      Keine Executions gefunden
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

