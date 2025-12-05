/**
 * DSGVO Privacy Requests Page - Enterprise++ Standard
 * 
 * Privacy-Request-Statistiken
 */

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";

interface PrivacyRequestStats {
    total_requests: number;
    by_type: Record<string, number>;
    by_status: Record<string, number>;
    pending: number;
    completed: number;
    rejected: number;
    average_processing_time_hours: number;
    recent_requests: Array<{
        id: number;
        user_id: string;
        request_type: string;
        status: string;
        created_at: string;
    }>;
}

export default function PrivacyRequestsPage() {
    const [stats, setStats] = useState<PrivacyRequestStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch("/api/dsgvo/monitoring/privacy-requests");
            const data = await response.json();

            if (data.success) {
                setStats(data.data);
            } else {
                setError("Fehler beim Laden der Statistiken");
            }
        } catch (err) {
            console.error("Fehler beim Laden der Privacy-Request-Statistiken:", err);
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
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Lade Privacy-Request-Statistiken...</p>
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
                        Privacy-Requests
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Übersicht über alle Betroffenenanfragen
                    </p>
                </div>

                {/* Übersicht */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Gesamt</h3>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total_requests}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Ausstehend</h3>
                        <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Abgeschlossen</h3>
                        <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Abgelehnt</h3>
                        <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
                    </div>
                </div>

                {/* Durchschnittliche Bearbeitungszeit */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        Durchschnittliche Bearbeitungszeit
                    </h2>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {stats.average_processing_time_hours.toFixed(2)} Stunden
                    </p>
                </div>

                {/* Nach Typ */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        Nach Typ
                    </h2>
                    <div className="space-y-2">
                        {Object.entries(stats.by_type).map(([type, count]) => (
                            <div key={type} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                                <span className="text-gray-900 dark:text-white">{type}</span>
                                <span className="text-gray-600 dark:text-gray-400">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Nach Status */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        Nach Status
                    </h2>
                    <div className="space-y-2">
                        {Object.entries(stats.by_status).map(([status, count]) => (
                            <div key={status} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                                <span className="text-gray-900 dark:text-white">{status}</span>
                                <span className="text-gray-600 dark:text-gray-400">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Requests */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        Letzte Requests
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead>
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">ID</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">User-ID</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Typ</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Erstellt</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {stats.recent_requests.map((request) => (
                                    <tr key={request.id}>
                                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{request.id}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{request.user_id}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{request.request_type}</td>
                                        <td className="px-4 py-3 text-sm">
                                            <span className={`px-2 py-1 rounded ${
                                                request.status === "completed" 
                                                    ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200" 
                                                    : request.status === "pending"
                                                    ? "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200"
                                                    : "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200"
                                            }`}>
                                                {request.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                            {new Date(request.created_at).toLocaleString("de-DE")}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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



