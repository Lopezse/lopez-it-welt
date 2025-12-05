/**
 * DSGVO AI-Monitoring Page - Enterprise++ Standard
 * 
 * Anzeige für:
 * - AI Allowed / Blocked Statistik
 * - Consent-Versionen
 * - Blocker-Gründe (Top 10)
 * - Risikoentwicklung
 * - Automatische Alerts
 */

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";

interface AIStats {
    total_requests: number;
    allowed: number;
    blocked: number;
    by_reason: Record<string, number>;
    by_purpose: Record<string, number>;
    recent_events: Array<{
        id: number;
        event_type: string;
        action: string;
        user_id: string;
        timestamp: string;
        result: string;
    }>;
}

interface ConsentVersionStats {
    by_version: Record<string, number>;
    current_version: string;
    outdated_count: number;
}

interface BlockerReason {
    reason: string;
    count: number;
    percentage: number;
}

export default function AIMonitoringPage() {
    const [aiStats, setAIStats] = useState<AIStats | null>(null);
    const [consentVersions, setConsentVersions] = useState<ConsentVersionStats | null>(null);
    const [blockerReasons, setBlockerReasons] = useState<BlockerReason[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

            // Lade AI-Statistiken aus Audit-Events
            const auditResponse = await fetch("/api/dsgvo/monitoring/audit-events?limit=1000");
            const auditData = await auditResponse.json();

            if (auditData.success) {
                const events = auditData.data.recent_events;
                const aiEvents = events.filter((e: any) => 
                    e.event_type.startsWith("AI_") || 
                    e.event_type === "CONSENT_CHECK_FAILED" ||
                    e.event_type === "RBAC_CHECK_FAILED" ||
                    e.event_type === "DSGVO_BOUNDARY_VIOLATION"
                );

                const total = aiEvents.length;
                const allowed = aiEvents.filter((e: any) => e.event_type === "AI_ALLOWED" || e.event_type === "AI_PROCESSED").length;
                const blocked = aiEvents.filter((e: any) => e.event_type.startsWith("AI_BLOCKED") || e.result === "failure").length;

                // Nach Grund gruppieren
                const byReason: Record<string, number> = {};
                aiEvents.forEach((e: any) => {
                    const reason = e.event_type;
                    byReason[reason] = (byReason[reason] || 0) + 1;
                });

                // Nach Purpose gruppieren (aus Details)
                const byPurpose: Record<string, number> = {};
                aiEvents.forEach((e: any) => {
                    try {
                        const details = typeof e.details === "string" ? JSON.parse(e.details) : e.details;
                        const purpose = details?.purpose || "unknown";
                        byPurpose[purpose] = (byPurpose[purpose] || 0) + 1;
                    } catch {
                        // Ignore
                    }
                });

                setAIStats({
                    total_requests: total,
                    allowed,
                    blocked,
                    by_reason: byReason,
                    by_purpose: byPurpose,
                    recent_events: aiEvents.slice(0, 50)
                });

                // Top 10 Blocker-Gründe
                const blockerEntries = Object.entries(byReason)
                    .filter(([reason]) => reason.startsWith("AI_BLOCKED") || reason.includes("FAILED"))
                    .map(([reason, count]) => ({
                        reason,
                        count: count as number,
                        percentage: ((count as number) / total) * 100
                    }))
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 10);

                setBlockerReasons(blockerEntries);
            }

            // Lade Consent-Versionen
            const consentsResponse = await fetch("/api/dsgvo/monitoring/consents");
            const consentsData = await consentsResponse.json();

            if (consentsData.success) {
                const byVersion = consentsData.data.by_version || {};
                const currentVersion = "v1";
                const outdatedCount = Object.entries(byVersion)
                    .filter(([version]) => version !== currentVersion)
                    .reduce((sum, [, count]) => sum + (count as number), 0);

                setConsentVersions({
                    by_version: byVersion,
                    current_version: currentVersion,
                    outdated_count: outdatedCount
                });
            }
        } catch (err) {
            console.error("Fehler beim Laden der AI-Monitoring-Daten:", err);
            setError("Fehler beim Laden der Daten");
        } finally {
            setLoading(false);
        }
    };

    if (loading && !aiStats) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Lade AI-Monitoring-Daten...</p>
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

    const blockRate = aiStats && aiStats.total_requests > 0 
        ? (aiStats.blocked / aiStats.total_requests) * 100 
        : 0;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        AI-Monitoring
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Überwachung der KI-Verarbeitung und DSGVO-Compliance
                    </p>
                </div>

                {/* Alert-Panel */}
                {blockRate > 10 && (
                    <div className="mb-6 p-4 rounded-lg border-2 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500">
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                    ⚠️ Hohe Blockierungsrate
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {blockRate.toFixed(1)}% der KI-Anfragen wurden blockiert. Prüfen Sie die Blocker-Gründe.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Übersicht */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Gesamt-Anfragen</h3>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{aiStats?.total_requests || 0}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Erlaubt</h3>
                        <p className="text-3xl font-bold text-green-600">{aiStats?.allowed || 0}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Blockiert</h3>
                        <p className="text-3xl font-bold text-red-600">{aiStats?.blocked || 0}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Blockierungsrate</h3>
                        <p className="text-3xl font-bold text-yellow-600">{blockRate.toFixed(1)}%</p>
                    </div>
                </div>

                {/* Top 10 Blocker-Gründe */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        Top 10 Blocker-Gründe
                    </h2>
                    <div className="space-y-2">
                        {blockerReasons.map((blocker, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                                <div className="flex-1">
                                    <span className="text-gray-900 dark:text-white">{blocker.reason}</span>
                                    <div className="mt-1 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                        <div
                                            className="bg-red-500 h-2 rounded-full"
                                            style={{ width: `${blocker.percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <div className="ml-4 text-right">
                                    <span className="text-gray-600 dark:text-gray-400">{blocker.count}</span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                                        ({blocker.percentage.toFixed(1)}%)
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Consent-Versionen */}
                {consentVersions && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            Consent-Versionen
                        </h2>
                        <div className="space-y-2">
                            {Object.entries(consentVersions.by_version).map(([version, count]) => (
                                <div key={version} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                                    <span className="text-gray-900 dark:text-white">
                                        {version}
                                        {version === consentVersions.current_version && (
                                            <span className="ml-2 text-sm text-green-600">(Aktuell)</span>
                                        )}
                                    </span>
                                    <span className="text-gray-600 dark:text-gray-400">{count as number}</span>
                                </div>
                            ))}
                        </div>
                        {consentVersions.outdated_count > 0 && (
                            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                    ⚠️ {consentVersions.outdated_count} veraltete Consent-Versionen gefunden
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Recent Events */}
                {aiStats && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            Letzte AI-Events
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Event-Type</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Action</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">User-ID</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Result</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Timestamp</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {aiStats.recent_events.map((event) => (
                                        <tr key={event.id}>
                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{event.event_type}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{event.action}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{event.user_id || "-"}</td>
                                            <td className="px-4 py-3 text-sm">
                                                <span className={`px-2 py-1 rounded ${
                                                    event.result === "success" 
                                                        ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200" 
                                                        : "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200"
                                                }`}>
                                                    {event.result}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                                {new Date(event.timestamp).toLocaleString("de-DE")}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                <div className="mt-6">
                    <Button onClick={loadData} variant="outline" disabled={loading}>
                        {loading ? "Lädt..." : "Aktualisieren"}
                    </Button>
                </div>
            </div>
        </div>
    );
}



