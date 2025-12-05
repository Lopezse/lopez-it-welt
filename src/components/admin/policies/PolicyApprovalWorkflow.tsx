/**
 * Policy Approval Workflow Component - Enterprise++ Standard E.2.4
 * 
 * Freigabe-Workflow, Freigabe-Historie und Freigabe-Status
 */

"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { logger } from "@/lib/logger";
import { format } from "date-fns";
import { de } from "date-fns/locale";

interface ApprovalStep {
  id: string;
  step_number: number;
  approver_role: string;
  approver_name: string;
  status: "pending" | "approved" | "rejected";
  comments?: string;
  approved_at?: string;
}

interface ApprovalWorkflow {
  id: string;
  policy_id: string;
  status: "pending" | "approved" | "rejected";
  current_step: number;
  steps: ApprovalStep[];
  created_at: string;
  completed_at?: string;
}

interface PolicyApprovalWorkflowProps {
  policyId: string;
  onApprovalChange?: () => void;
}

export function PolicyApprovalWorkflow({ policyId, onApprovalChange }: PolicyApprovalWorkflowProps) {
  const [workflow, setWorkflow] = useState<ApprovalWorkflow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [approving, setApproving] = useState(false);
  const [comments, setComments] = useState("");

  useEffect(() => {
    loadWorkflow();
  }, [policyId]);

  const loadWorkflow = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/admin/policies/${policyId}/approval`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Fehler beim Laden des Freigabe-Workflows");
      }

      setWorkflow(result.data);
    } catch (err) {
      logger.error("Fehler beim Laden des Policy-Freigabe-Workflows", err);
      setError(err instanceof Error ? err.message : "Fehler beim Laden des Freigabe-Workflows");
    } finally {
      setLoading(false);
    }
  };

  const approveStep = async (stepId: string, approved: boolean) => {
    try {
      setApproving(true);
      setError(null);
      const response = await fetch(`/api/admin/policies/${policyId}/approval/${stepId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          approved,
          comments,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Fehler bei der Freigabe");
      }

      if (onApprovalChange) {
        onApprovalChange();
      }

      loadWorkflow();
      setComments("");
    } catch (err) {
      logger.error("Fehler bei der Policy-Freigabe", err);
      setError(err instanceof Error ? err.message : "Fehler bei der Freigabe");
    } finally {
      setApproving(false);
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "approved": return "text-green-600 dark:text-green-400";
      case "rejected": return "text-red-600 dark:text-red-400";
      case "pending": return "text-yellow-600 dark:text-yellow-400";
      default: return "text-gray-600 dark:text-gray-400";
    }
  };

  const getStatusBgColor = (status: string): string => {
    switch (status) {
      case "approved": return "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800";
      case "rejected": return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
      case "pending": return "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800";
      default: return "bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800";
    }
  };

  if (loading && !workflow) {
    return (
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 flex h-64 items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">Lade Freigabe-Workflow...</p>
        </div>
      </Card>
    );
  }

  if (error && !workflow) {
    return <ErrorBanner message={error} onDismiss={() => setError(null)} />;
  }

  if (!workflow) {
    return (
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6">
          <p className="text-gray-500 dark:text-gray-400">Kein Freigabe-Workflow vorhanden</p>
        </div>
      </Card>
    );
  }

  const currentStep = workflow.steps.find((s) => s.step_number === workflow.current_step);

  return (
    <div className="space-y-6">
      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

      {/* Workflow-Status */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Freigabe-Workflow</h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(workflow.status)} ${getStatusBgColor(workflow.status)}`}>
              {workflow.status === "approved" ? "Freigegeben" : workflow.status === "rejected" ? "Abgelehnt" : "Ausstehend"}
            </span>
          </div>

          <div className="space-y-2 mb-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Aktueller Schritt: {workflow.current_step} von {workflow.steps.length}
            </div>
            {workflow.completed_at && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Abgeschlossen: {format(new Date(workflow.completed_at), "dd.MM.yyyy HH:mm", { locale: de })}
              </div>
            )}
          </div>

          {/* Workflow-Schritte */}
          <div className="space-y-3">
            {workflow.steps.map((step, index) => (
              <div
                key={step.id}
                className={`border rounded-lg p-4 ${getStatusBgColor(step.status)}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      Schritt {step.step_number}: {step.approver_role}
                    </span>
                    <span className={`ml-2 text-sm font-medium ${getStatusColor(step.status)}`}>
                      {step.status === "approved" ? "✓ Freigegeben" : step.status === "rejected" ? "✗ Abgelehnt" : "⏳ Ausstehend"}
                    </span>
                  </div>
                  {step.approved_at && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {format(new Date(step.approved_at), "dd.MM.yyyy HH:mm", { locale: de })}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Freigeber: {step.approver_name}</p>
                {step.comments && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">Kommentar: {step.comments}</p>
                )}

                {/* Aktueller Schritt: Freigabe-Aktionen */}
                {currentStep && currentStep.id === step.id && step.status === "pending" && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Kommentar (optional)
                      </label>
                      <textarea
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        rows={2}
                        className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => approveStep(step.id, true)}
                        disabled={approving}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 disabled:opacity-50"
                      >
                        {approving ? "Freigeben..." : "Freigeben"}
                      </button>
                      <button
                        onClick={() => approveStep(step.id, false)}
                        disabled={approving}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
                      >
                        {approving ? "Ablehnen..." : "Ablehnen"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

