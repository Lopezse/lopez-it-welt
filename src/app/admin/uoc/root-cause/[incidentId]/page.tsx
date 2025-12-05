/**
 * Root-Cause Analysis Page - Enterprise++ Standard P9
 * 
 * Root-Cause-Analysis-View für UOC
 */

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { RootCauseAnalysisView } from "@/components/orchestrator/uoc/RootCauseAnalysisView";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { useSecurityPermissions } from "@/lib/hooks/useSecurityPermissions";
import { useLogsPermissions } from "@/lib/hooks/useLogsPermissions";
import { useMonitoringPermissions } from "@/lib/hooks/useMonitoringPermissions";
import type { RootCauseAnalysisView as RootCauseAnalysisViewType, Event, Timeline, ImpactAnalysis, Solution, CausalRelationship } from "@/lib/ki-orchestrator/level2/uoc/types";
import type { Incident } from "@/lib/ki-orchestrator/level2/types";

export default function RootCauseAnalysisPage() {
  const params = useParams();
  const router = useRouter();
  const incidentId = params.incidentId as string;

  const [rootCause, setRootCause] = useState<RootCauseAnalysisViewType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { canView: canViewSecurity, loading: securityLoading } = useSecurityPermissions();
  const { canView: canViewLogs, loading: logsLoading } = useLogsPermissions();
  const { canView: canViewMonitoring, loading: monitoringLoading } = useMonitoringPermissions();

  // RBAC: Mindestens eine Berechtigung erforderlich
  const canView = canViewSecurity() || canViewLogs() || canViewMonitoring();
  const permissionsLoading = securityLoading || logsLoading || monitoringLoading;

  useEffect(() => {
    if (!permissionsLoading && canView && incidentId) {
      loadRootCause();
    }
  }, [canView, incidentId, permissionsLoading]);

  const loadRootCause = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/orchestrator/uoc/root-cause/${incidentId}`, {
        credentials: "include",
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Fehler beim Laden der Root-Cause-Analyse");
      }

      // Hole Incident-Daten separat
      const incidentResponse = await fetch(`/api/orchestrator/incidents/${incidentId}`, {
        credentials: "include",
      });
      const incidentData = await incidentResponse.json();
      const incident: Incident = incidentData.data || {
        id: incidentId,
        title: `Incident ${incidentId}`,
        severity: "critical",
        status: "open",
        sla_minutes: 0,
        sla_started_at: new Date().toISOString(),
        opened_at: new Date().toISOString(),
        opened_by: "system",
        escalation_level: 0,
        audit_hash: "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Mappe API-Response auf RootCauseAnalysisView-Struktur
      const rootCauseEvent: Event = {
        id: data.data.root_cause.event_id,
        type: data.data.root_cause.event_type as "alert" | "metric" | "log" | "incident",
        category: "System", // Fallback
        severity: "critical", // Fallback
        timestamp: new Date(data.data.root_cause.timestamp),
        data: data.data.root_cause,
      };

      const timelineEvents = (data.data.timeline || []).map((event: any) => ({
        id: event.id,
        type: event.type,
        timestamp: new Date(event.timestamp),
        category: event.category,
        severity: event.severity,
        message: event.message,
        data: event.data,
      }));

      const timeline: Timeline = {
        events: timelineEvents,
        rootCause: rootCauseEvent,
        impact: {
          affectedResources: [
            ...(data.data.impact?.affected_metrics || []),
            ...(data.data.impact?.affected_alerts || []),
          ],
          affectedServices: data.data.impact?.affected_components || [],
          userImpact: data.data.impact?.score ? Math.round(data.data.impact.score / 2) : 0,
          businessImpact: data.data.impact?.score ? Math.round(data.data.impact.score / 2) : 0,
          estimatedDowntime: 0, // Fallback
        },
      };

      const impact: ImpactAnalysis = {
        affectedResources: [
          ...(data.data.impact?.affected_metrics || []),
          ...(data.data.impact?.affected_alerts || []),
        ],
        affectedServices: data.data.impact?.affected_components || [],
        userImpact: data.data.impact?.score ? Math.round(data.data.impact.score / 2) : 0,
        businessImpact: data.data.impact?.score ? Math.round(data.data.impact.score / 2) : 0,
        estimatedDowntime: 0, // Fallback
      };

      const solutions: Solution[] = (data.data.solutions || []).map((sol: any) => ({
        id: sol.id || `solution-${Date.now()}`,
        title: sol.title || "Lösung",
        description: sol.description || "",
        priority: sol.priority || "medium",
        estimatedTime: sol.estimatedTime || 0,
        steps: sol.steps || [],
      }));

      const causalRelationships: CausalRelationship[] = (data.data.causal_relationships || []).map((rel: any) => ({
        from: rel.from,
        to: rel.to,
        confidence: rel.confidence || 0.5,
        type: rel.type || "correlated",
      }));

      const mappedRootCause: RootCauseAnalysisViewType = {
        incident,
        rootCause: rootCauseEvent,
        timeline,
        impact,
        solutions,
        causalRelationships,
      };

      setRootCause(mappedRootCause);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Laden der Root-Cause-Analyse");
    } finally {
      setLoading(false);
    }
  };

  if (permissionsLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Laden...</p>
      </div>
    );
  }

  if (!canView) {
    return (
      <div className="p-6">
        <ErrorBanner
          message="Keine Berechtigung: Sie benötigen mindestens eine der folgenden Berechtigungen: 'security.view', 'monitoring.view' oder 'logs.view'"
          errorCode="PERMISSION_DENIED"
        />
      </div>
    );
  }

  if (!incidentId) {
    return (
      <div className="p-6">
        <ErrorBanner message="Incident-ID fehlt" errorCode="BAD_REQUEST" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Laden...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorBanner message={error} />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Root-Cause-Analyse
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Incident: {incidentId}
        </p>
      </div>

      {rootCause && <RootCauseAnalysisView incidentId={incidentId} rootCause={rootCause} />}
    </div>
  );
}

