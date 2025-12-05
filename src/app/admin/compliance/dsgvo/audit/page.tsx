/**
 * DSGVO Audit Events Page - Enterprise++ Standard
 * 
 * Audit-Log-Übersicht
 */

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";

interface AuditLogOverview {
    total_events: number;
    by_event_type: Record<string, number>;
    by_result: Record<string, number>;
    recent_events: Array<{
        id: number;
        event_type: string;
        action: string;
        user_id: string;
        timestamp: string;
        result: string;
    }>;
    critical_events: Array<{
        id: number;
        event_type: string;
        action: string;
        timestamp: string;
        details: Record<string, unknown>;
    }>;
}

export default function AuditEventsPage() {
    const [overview, setOverview] = useState<AuditLogOverview | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [limit, setLimit] = useState(50);

    useEffect(() => {
        loadOverview();
    }, [limit]);

    const loadOverview = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`/api/dsgvo/monitoring/audit-events?limit=${limit}`);
            const data = await response.json();

            if (data.success) {
                setOverview(data.data);
            } else {
                setError("Fehler beim Laden der Übersicht");
            }
        } catch (err) {
            console.error("Fehler beim Laden der Audit-Log-Übersicht:", err);
            setError("Fehler beim Laden der Übersicht");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Lade Audit-Log-Übersicht...</p>
                </div>
            </div>
        );
    }

    if (error || !overview) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 dark:text-red-400 mb-4">{error || "Keine Daten verfügbar"}</p>
                    <Button onClick={loadOverview}>Erneut laden</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Audit-Events
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Vollständige Übersicht über alle DSGVO-Audit-Events
                    </p>
                </div>

                {/* Übersicht */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Gesamt-Events</h3>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{overview.total_events}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Erfolgreich</h3>
                        <p className="text-3xl font-bold text-green-600">{overview.by_result.success || 0}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Kritische Events</h3>
                        <p className="text-3xl font-bold text-red-600">{overview.critical_events.length}</p>
                    </div>
                </div>

                {/* Nach Event-Type */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        Nach Event-Type
                    </h2>
                    <div className="space-y-2">
                        {Object.entries(overview.by_event_type).map(([type, count]) => (
                            <div key={type} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                                <span className="text-gray-900 dark:text-white">{type}</span>
                                <span className="text-gray-600 dark:text-gray-400">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Kritische Events */}
                {overview.critical_events.length > 0 && (
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-lg shadow p-6 mb-8 border-2 border-red-500">
                        <h2 className="text-xl font-semibold text-red-900 dark:text-red-200 mb-4">
                            ⚠️ Kritische Events
                        </h2>
                        <div className="space-y-2">
                            {overview.critical_events.map((event) => (
                                <div key={event.id} className="p-3 bg-white dark:bg-gray-800 rounded">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className="font-medium text-red-900 dark:text-red-200">{event.event_type}</span>
                                            <span className="text-gray-600 dark:text-gray-400 ml-2">{event.action}</span>
                                        </div>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {new Date(event.timestamp).toLocaleString("de-DE")}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Recent Events */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Letzte Events
                        </h2>
                        <select
                            value={limit}
                            onChange={(e) => setLimit(parseInt(e.target.value))}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>
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
                                {overview.recent_events.map((event) => (
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

                <div className="mt-6">
                    <Button onClick={loadOverview} variant="outline">
                        Aktualisieren
                    </Button>
                </div>
            </div>
        </div>
    );
}



