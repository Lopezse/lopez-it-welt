/**
 * Root Cause Analysis View Component - Enterprise++ Standard P9
 * 
 * Root-Cause-Analysis-View für UOC
 */

"use client";

import { useEffect, useState } from "react";
import { TimelineChart } from "./TimelineChart";
import { ImpactVisualization } from "./ImpactVisualization";
import { SolutionList } from "./SolutionList";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import type { RootCauseAnalysisView as RootCauseAnalysisViewType } from "@/lib/ki-orchestrator/level2/uoc/types";

interface RootCauseAnalysisViewProps {
  incidentId: string;
  rootCause?: RootCauseAnalysisViewType;
  onSolutionClick?: (solution: unknown) => void;
}

export function RootCauseAnalysisView({
  incidentId,
  rootCause: initialRootCause,
  onSolutionClick,
}: RootCauseAnalysisViewProps) {
  const [rootCause, setRootCause] = useState<RootCauseAnalysisViewType | null>(initialRootCause || null);
  const [loading, setLoading] = useState(!initialRootCause);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialRootCause) return;

    const fetchRootCause = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/orchestrator/uoc/root-cause/${incidentId}`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch root cause analysis");
        }

        const result = await response.json();
        setRootCause(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchRootCause();
  }, [incidentId, initialRootCause]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Laden...</p>
      </div>
    );
  }

  if (error) {
    return <ErrorBanner message={error} />;
  }

  if (!rootCause) {
    return (
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">Keine Root-Cause-Analyse verfügbar</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Root-Cause-Analyse
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Incident: {rootCause.incident.title}
        </p>
      </div>

      {/* Root-Cause */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Root-Cause</h2>
        <div className="space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">Typ:</span> {rootCause.rootCause.type}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">Kategorie:</span> {rootCause.rootCause.category}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">Severity:</span> {rootCause.rootCause.severity}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">Zeitstempel:</span>{" "}
            {rootCause.rootCause.timestamp.toLocaleString("de-DE")}
          </p>
        </div>
      </div>

      {/* Timeline */}
      {rootCause.timeline && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Timeline</h2>
          <TimelineChart
            events={rootCause.timeline.events}
            rootCause={rootCause.rootCause}
          />
        </div>
      )}

      {/* Impact */}
      {rootCause.impact && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Impact</h2>
          <ImpactVisualization impact={rootCause.impact} rootCause={rootCause.rootCause} />
        </div>
      )}

      {/* Solutions */}
      {rootCause.solutions && rootCause.solutions.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Lösung-Vorschläge
          </h2>
          <SolutionList solutions={rootCause.solutions} onSolutionClick={onSolutionClick} />
        </div>
      )}
    </div>
  );
}




