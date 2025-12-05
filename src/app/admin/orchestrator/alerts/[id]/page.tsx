/**
 * Alert Detail Page - Enterprise++ Standard P8-C
 * 
 * Detailansicht eines Alerts
 */

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { SeverityBadge } from "@/components/ui/SeverityBadge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { JSONViewer } from "@/components/ui/JSONViewer";
import { EscalationDialog } from "@/components/orchestrator/alerts/EscalationDialog";
import { useSecurityPermissions } from "@/lib/hooks/useSecurityPermissions";
import type { Alert } from "@/lib/ki-orchestrator/level2/types";
import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";

export default function AlertDetailPage() {
  const params = useParams();
  const router = useRouter();
  const alertId = params.id as string;

  const [alert, setAlert] = useState<Alert | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [escalationDialogOpen, setEscalationDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const { canManage, canView, loading: permissionsLoading } = useSecurityPermissions();

  useEffect(() => {
    if (!permissionsLoading && canView()) {
      loadAlert();
    }
  }, [alertId, permissionsLoading]);

  const loadAlert = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/orchestrator/alerts/${alertId}`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Fehler beim Laden des Alerts");
      }

      setAlert(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Laden des Alerts");
    } finally {
      setLoading(false);
    }
  };

  const handleAcknowledge = async () => {
    if (!canManage()) {
      setError("Sie haben keine Berechtigung für diese Aktion.");
      return;
    }

    try {
      setActionLoading(true);
      setError(null);

      const response = await fetch(`/api/orchestrator/alerts/${alertId}/ack`, {
        method: "PATCH",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Fehler beim Bestätigen des Alerts");
      }

      await loadAlert();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Bestätigen des Alerts");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEscalate = async (reason: string) => {
    if (!canManage()) {
      setError("Sie haben keine Berechtigung für diese Aktion.");
      return;
    }

    try {
      setActionLoading(true);
      setError(null);

      const response = await fetch(`/api/orchestrator/alerts/${alertId}/escalate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Fehler beim Eskalieren des Alerts");
      }

      // Redirect to incident if created
      if (data.data.incident_id) {
        router.push(`/admin/orchestrator/incidents/${data.data.incident_id}`);
      } else {
        await loadAlert();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Eskalieren des Alerts");
    } finally {
      setActionLoading(false);
    }
  };

  if (permissionsLoading || loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Laden...</p>
      </div>
    );
  }

  if (!canView()) {
    return (
      <div className="p-6">
        <ErrorBanner message="Sie haben keine Berechtigung, diesen Alert anzuzeigen." errorCode="PERMISSION_DENIED" />
      </div>
    );
  }

  if (!alert) {
    return (
      <div className="p-6">
        <ErrorBanner message="Alert nicht gefunden." />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          href="/admin/orchestrator/alerts"
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
        >
          ← Zurück zur Liste
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{alert.title}</h1>
        <div className="mt-2 flex items-center gap-3">
          <SeverityBadge severity={alert.severity} />
          <StatusBadge status={alert.status} />
        </div>
      </div>

      {error && (
        <div className="mb-6">
          <ErrorBanner message={error} onDismiss={() => setError(null)} />
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Alert Information */}
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Alert-Informationen
            </h2>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Alert-Rule ID</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">{alert.alert_rule_id}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Kategorie</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">{alert.category}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Event-Typ</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">{alert.event_type || "—"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Ausgelöst</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                  {formatDistanceToNow(new Date(alert.triggered_at), {
                    addSuffix: true,
                    locale: de,
                  })}
                </dd>
              </div>
              {alert.acknowledged_at && (
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Bestätigt</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                    {formatDistanceToNow(new Date(alert.acknowledged_at), {
                      addSuffix: true,
                      locale: de,
                    })}
                  </dd>
                </div>
              )}
              {alert.escalated_at && (
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Eskaliert</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                    {formatDistanceToNow(new Date(alert.escalated_at), {
                      addSuffix: true,
                      locale: de,
                    })}
                  </dd>
                </div>
              )}
            </dl>
            {alert.description && (
              <div className="mt-4">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Beschreibung</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">{alert.description}</dd>
              </div>
            )}
          </div>

          {/* Payload (Sanitized) */}
          {alert.payload && Object.keys(alert.payload).length > 0 && (
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
              <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Payload</h2>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Hinweis: Personenbezogene Daten wurden entfernt (DSGVO-konform). Payload ist bereits sanitized.
              </p>
              <JSONViewer data={alert.payload} />
            </div>
          )}

          {/* Incident Link */}
          {alert.incident_id && (
            <div className="rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-4">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Dieser Alert wurde zu einem Incident eskaliert:{" "}
                <Link
                  href={`/admin/orchestrator/incidents/${alert.incident_id}`}
                  className="font-medium underline"
                >
                  Incident {alert.incident_id}
                </Link>
              </p>
            </div>
          )}
        </div>

        {/* Actions Sidebar */}
        <div className="space-y-6">
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Aktionen</h2>
            <div className="space-y-3">
              {alert.status === "open" && canManage() && (
                <>
                  <button
                    onClick={handleAcknowledge}
                    disabled={actionLoading}
                    className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    {actionLoading ? "Wird verarbeitet..." : "Bestätigen"}
                  </button>
                  <button
                    onClick={() => setEscalationDialogOpen(true)}
                    disabled={actionLoading}
                    className="w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    Eskaliert
                  </button>
                </>
              )}
              {!canManage() && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Sie haben keine Berechtigung für Aktionen. Nur Ansicht möglich.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <EscalationDialog
        open={escalationDialogOpen}
        onClose={() => setEscalationDialogOpen(false)}
        onConfirm={handleEscalate}
        alertTitle={alert.title}
      />
    </div>
  );
}

