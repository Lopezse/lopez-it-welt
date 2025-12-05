/**
 * Incident Detail Page - Enterprise++ Standard P8-C
 * 
 * Detailansicht eines Incidents
 */

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { SeverityBadge } from "@/components/ui/SeverityBadge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { IncidentTimeline } from "@/components/orchestrator/incidents/IncidentTimeline";
import { ResolutionDialog } from "@/components/orchestrator/incidents/ResolutionDialog";
import { useSecurityPermissions } from "@/lib/hooks/useSecurityPermissions";
import type { Incident, IncidentEvent } from "@/lib/ki-orchestrator/level2/types";
import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";

export default function IncidentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const incidentId = params.id as string;

  const [incident, setIncident] = useState<Incident | null>(null);
  const [events, setEvents] = useState<IncidentEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resolutionDialogOpen, setResolutionDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const { canManage, canView, loading: permissionsLoading } = useSecurityPermissions();

  useEffect(() => {
    if (!permissionsLoading && canView()) {
      loadIncident();
    }
  }, [incidentId, permissionsLoading]);

  const loadIncident = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/orchestrator/incidents/${incidentId}`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Fehler beim Laden des Incidents");
      }

      setIncident(data.data);
      setEvents(data.data.events || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Laden des Incidents");
    } finally {
      setLoading(false);
    }
  };

  const getSLAStatus = (incident: Incident): { time_remaining_minutes: number; status: "ok" | "warning" | "breached" } => {
    if (incident.status === "resolved" || incident.status === "closed") {
      return { time_remaining_minutes: 0, status: "ok" };
    }

    const now = new Date();
    const startedAt = new Date(incident.sla_started_at);
    const elapsedMinutes = (now.getTime() - startedAt.getTime()) / (1000 * 60);
    const remainingMinutes = incident.sla_minutes - elapsedMinutes;

    if (remainingMinutes <= 0) {
      return { time_remaining_minutes: 0, status: "breached" };
    }
    if (remainingMinutes <= incident.sla_minutes * 0.2) {
      return { time_remaining_minutes: Math.round(remainingMinutes), status: "warning" };
    }
    return { time_remaining_minutes: Math.round(remainingMinutes), status: "ok" };
  };

  const handleResolve = async (resolution: string, rootCause?: string) => {
    if (!canManage()) {
      setError("Sie haben keine Berechtigung für diese Aktion.");
      return;
    }

    try {
      setActionLoading(true);
      setError(null);

      const response = await fetch(`/api/orchestrator/incidents/${incidentId}/resolve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resolution, root_cause: rootCause }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Fehler beim Auflösen des Incidents");
      }

      await loadIncident();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Auflösen des Incidents");
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
        <ErrorBanner message="Sie haben keine Berechtigung, diesen Incident anzuzeigen." errorCode="PERMISSION_DENIED" />
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="p-6">
        <ErrorBanner message="Incident nicht gefunden." />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          href="/admin/orchestrator/incidents"
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
        >
          ← Zurück zur Liste
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{incident.title}</h1>
        <div className="mt-2 flex items-center gap-3">
          <SeverityBadge severity={incident.severity} />
          <StatusBadge status={incident.status} />
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
          {/* Incident Information */}
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Incident-Informationen
            </h2>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Eröffnet</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                  {formatDistanceToNow(new Date(incident.opened_at), {
                    addSuffix: true,
                    locale: de,
                  })}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Eskalations-Level</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                  Level {incident.escalation_level}
                </dd>
              </div>
              {incident.resolved_at && (
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Aufgelöst</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                    {formatDistanceToNow(new Date(incident.resolved_at), {
                      addSuffix: true,
                      locale: de,
                    })}
                  </dd>
                </div>
              )}
              {incident.closed_at && (
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Geschlossen</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                    {formatDistanceToNow(new Date(incident.closed_at), {
                      addSuffix: true,
                      locale: de,
                    })}
                  </dd>
                </div>
              )}
            </dl>
            {incident.description && (
              <div className="mt-4">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Beschreibung</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">{incident.description}</dd>
              </div>
            )}
            {incident.resolution && (
              <div className="mt-4">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Lösung</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">{incident.resolution}</dd>
              </div>
            )}
            {incident.root_cause && (
              <div className="mt-4">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Root Cause</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">{incident.root_cause}</dd>
              </div>
            )}
          </div>

          {/* SLA Status */}
          {incident && (
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
              <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">SLA-Status</h2>
              {(() => {
                const sla = getSLAStatus(incident);
                return (
                  <div
                    className={`rounded-lg p-4 ${
                      sla.status === "breached"
                        ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                        : sla.status === "warning"
                        ? "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
                        : "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {sla.status === "breached"
                            ? "SLA verletzt"
                            : sla.status === "warning"
                            ? "SLA-Warnung"
                            : "SLA in Ordnung"}
                        </p>
                        <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                          SLA-Zeit: {incident.sla_minutes} Minuten
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-2xl font-bold ${
                            sla.status === "breached"
                              ? "text-red-600 dark:text-red-400"
                              : sla.status === "warning"
                              ? "text-yellow-600 dark:text-yellow-400"
                              : "text-green-600 dark:text-green-400"
                          }`}
                        >
                          {sla.time_remaining_minutes}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Minuten verbleibend</p>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Timeline */}
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Timeline</h2>
            <IncidentTimeline events={events} />
          </div>
        </div>

        {/* Actions Sidebar */}
        <div className="space-y-6">
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Aktionen</h2>
            <div className="space-y-3">
              {incident.status !== "resolved" && incident.status !== "closed" && canManage() && (
                <button
                  onClick={() => setResolutionDialogOpen(true)}
                  disabled={actionLoading}
                  className="w-full rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                >
                  {actionLoading ? "Wird verarbeitet..." : "Auflösen"}
                </button>
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

      <ResolutionDialog
        open={resolutionDialogOpen}
        onClose={() => setResolutionDialogOpen(false)}
        onConfirm={handleResolve}
        incidentTitle={incident.title}
      />
    </div>
  );
}

