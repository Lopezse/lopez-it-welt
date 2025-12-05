/**
 * DSGVO Consent Statistics Page - Enterprise++ Standard
 * 
 * Detaillierte Consent-Statistiken
 */

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";

interface ConsentStatistics {
    total_consents: number;
    active_consents: number;
    revoked_consents: number;
    by_type: Record<string, {
        total: number;
        granted: number;
        revoked: number;
        denied: number;
    }>;
    by_version: Record<string, number>;
    recent_changes: Array<{
        user_id: string;
        consent_type: string;
        action: string;
        timestamp: string;
    }>;
}

export default function ConsentStatsPage() {
    const [stats, setStats] = useState<ConsentStatistics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch("/api/dsgvo/monitoring/consents");
            const data = await response.json();

            if (data.success) {
                setStats(data.data);
            } else {
                setError("Fehler beim Laden der Statistiken");
            }
        } catch (err) {
            console.error("Fehler beim Laden der Consent-Statistiken:", err);
            setError("Fehler beim Laden der Statistiken");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Lade Consent-Statistiken...</p>
                </div>
            </div>
        );
    }

    if (error || !stats) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 dark:text-red-400 mb-4">{error || "Keine Daten verfügbar"}</p>
                    <Button onClick={loadStats}>Erneut laden</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Consent-Statistiken
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Detaillierte Übersicht über alle Einwilligungen
                    </p>
                </div>

                {/* Übersicht */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Gesamt</h3>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total_consents}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Aktiv</h3>
                        <p className="text-3xl font-bold text-green-600">{stats.active_consents}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Widerrufen</h3>
                        <p className="text-3xl font-bold text-red-600">{stats.revoked_consents}</p>
                    </div>
                </div>

                {/* Nach Typ */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        Nach Typ
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead>
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Typ</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Gesamt</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Erteilt</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Widerrufen</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Abgelehnt</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {Object.entries(stats.by_type).map(([type, data]) => (
                                    <tr key={type}>
                                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{type}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{data.total}</td>
                                        <td className="px-4 py-3 text-sm text-green-600">{data.granted}</td>
                                        <td className="px-4 py-3 text-sm text-red-600">{data.revoked}</td>
                                        <td className="px-4 py-3 text-sm text-yellow-600">{data.denied}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Nach Version */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        Nach Version
                    </h2>
                    <div className="space-y-2">
                        {Object.entries(stats.by_version).map(([version, count]) => (
                            <div key={version} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                                <span className="text-gray-900 dark:text-white">{version}</span>
                                <span className="text-gray-600 dark:text-gray-400">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Changes */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        Letzte Änderungen
                    </h2>
                    <div className="space-y-2">
                        {stats.recent_changes.map((change, index) => (
                            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                                <div>
                                    <span className="text-gray-900 dark:text-white">{change.consent_type}</span>
                                    <span className="text-gray-600 dark:text-gray-400 ml-2">({change.action})</span>
                                </div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {new Date(change.timestamp).toLocaleString("de-DE")}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-6">
                    <Button onClick={loadStats} variant="outline">
                        Aktualisieren
                    </Button>
                </div>
            </div>
        </div>
    );
}



