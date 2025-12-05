/**
 * Log Detail Page - Enterprise++ Standard P8-E
 * 
 * Detailansicht eines Logs
 */

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { LogLevelBadge } from "@/components/orchestrator/logs/LogLevelBadge";
import { CategoryBadge } from "@/components/orchestrator/logs/CategoryBadge";
import { SeverityBadge } from "@/components/ui/SeverityBadge";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { WarningBannerSimple } from "@/components/ui/WarningBannerSimple";
import { JSONViewer } from "@/components/ui/JSONViewer";
import { useLogsPermissions } from "@/lib/hooks/useLogsPermissions";
import type { Log } from "@/lib/ki-orchestrator/level2/logs/types";
import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";

export default function LogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const logId = params.id as string;

  const [log, setLog] = useState<Log & { dsfa_hint?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { canView, loading: permissionsLoading } = useLogsPermissions();

  useEffect(() => {
    if (!permissionsLoading && canView()) {
      loadLog();
    }
  }, [logId, permissionsLoading]);

  const loadLog = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/orchestrator/logs/${logId}`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Fehler beim Laden des Logs");
      }

      setLog(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Laden des Logs");
    } finally {
      setLoading(false);
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
        <ErrorBanner
          message="Sie haben keine Berechtigung, diesen Log anzuzeigen."
          onDismiss={() => {}}
          errorCode="PERMISSION_DENIED"
        />
      </div>
    );
  }

  if (!log) {
    return (
      <div className="p-6">
        <ErrorBanner message="Log nicht gefunden." onDismiss={() => {}} />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Log-Detail</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Log-ID: {log.id}</p>
          </div>
          <Link
            href="/admin/logs"
            className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            Zurück zur Liste
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-6">
          <ErrorBanner message={error} onDismiss={() => setError(null)} />
        </div>
      )}

      {log.dsfa_hint && (
        <div className="mb-6">
          <WarningBannerSimple message={log.dsfa_hint} />
        </div>
      )}

      {/* Log Information */}
      <div className="mb-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Log-Informationen</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Log-ID</label>
            <p className="mt-1 text-sm text-gray-900 dark:text-white font-mono">{log.id}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Log-Regel-ID</label>
            <p className="mt-1 text-sm text-gray-900 dark:text-white font-mono">{log.log_rule_id}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Log-Level</label>
            <div className="mt-1">
              <LogLevelBadge level={log.log_level} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Kategorie</label>
            <div className="mt-1">
              <CategoryBadge category={log.category} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Severity</label>
            <div className="mt-1">
              <SeverityBadge severity={log.severity} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Zeitstempel</label>
            <p className="mt-1 text-sm text-gray-900 dark:text-white">
              {new Date(log.timestamp).toLocaleString("de-DE")} (
              {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true, locale: de })})
            </p>
          </div>
        </div>
      </div>

      {/* Message */}
      <div className="mb-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Message</h2>
        <pre className="whitespace-pre-wrap break-words rounded-lg bg-gray-50 dark:bg-gray-900 p-4 text-sm font-mono text-gray-900 dark:text-white">
          {log.message}
        </pre>
      </div>

      {/* Context */}
      {log.context && Object.keys(log.context).length > 0 && (
        <div className="mb-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Context</h2>
          <JSONViewer data={log.context} />
        </div>
      )}

      {/* Metadata */}
      {log.metadata && Object.keys(log.metadata).length > 0 && (
        <div className="mb-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Metadata</h2>
          <JSONViewer data={log.metadata} />
        </div>
      )}

      {/* Additional Information */}
      <div className="mb-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Weitere Informationen</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {log.correlation_id && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Correlation-ID</label>
              <p className="mt-1 text-sm text-gray-900 dark:text-white font-mono">{log.correlation_id}</p>
            </div>
          )}
          {log.request_id && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Request-ID</label>
              <p className="mt-1 text-sm text-gray-900 dark:text-white font-mono">{log.request_id}</p>
            </div>
          )}
          {log.resource_type && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Resource-Type</label>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">{log.resource_type}</p>
            </div>
          )}
          {log.resource_id && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Resource-ID</label>
              <p className="mt-1 text-sm text-gray-900 dark:text-white font-mono">{log.resource_id}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

