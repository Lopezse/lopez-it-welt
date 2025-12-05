/**
 * DSGVO KI-Usage Page - Enterprise++ Standard
 * 
 * KI-Verarbeitung-Übersicht
 */

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";

interface KIProcessingOverview {
    total_analyses: number;
    with_consent: number;
    without_consent: number;
    person_detected: number;
    dsgvo_approved: number;
    pending_approval: number;
    by_category: Record<string, number>;
    recent_analyses: Array<{
        media_id: string;
        has_person: boolean;
        dsgvo_approved: boolean;
        timestamp: string;
    }>;
}

export default function KIUsagePage() {
    const [overview, setOverview] = useState<KIProcessingOverview | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadOverview();
    }, []);

    const loadOverview = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch("/api/dsgvo/monitoring/ki-usage");
            const data = await response.json();

            if (data.success) {
                setOverview(data.data);
            } else {
                setError("Fehler beim Laden der Übersicht");
            }
        } catch (err) {
            console.error("Fehler beim Laden der KI-Verarbeitung-Übersicht:", err);
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
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Lade KI-Verarbeitung-Übersicht...</p>
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
                        KI-Verarbeitung
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Übersicht über KI-Analysen und DSGVO-Compliance
                    </p>
                </div>

                {/* Übersicht */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Gesamt-Analysen</h3>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{overview.total_analyses}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Person erkannt</h3>
                        <p className="text-3xl font-bold text-yellow-600">{overview.person_detected}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">DSGVO-Freigegeben</h3>
                        <p className="text-3xl font-bold text-green-600">{overview.dsgvo_approved}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Ausstehend</h3>
                        <p className="text-3xl font-bold text-red-600">{overview.pending_approval}</p>
                    </div>
                </div>

                {/* Nach Kategorie */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        Nach Kategorie
                    </h2>
                    <div className="space-y-2">
                        {Object.entries(overview.by_category).map(([category, count]) => (
                            <div key={category} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                                <span className="text-gray-900 dark:text-white">{category || "Unbekannt"}</span>
                                <span className="text-gray-600 dark:text-gray-400">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Analyses */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        Letzte Analysen
                    </h2>
                    <div className="space-y-2">
                        {overview.recent_analyses.map((analysis, index) => (
                            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                                <div>
                                    <span className="text-gray-900 dark:text-white">{analysis.media_id}</span>
                                    {analysis.has_person && (
                                        <span className="ml-2 px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded">
                                            Person erkannt
                                        </span>
                                    )}
                                    {analysis.dsgvo_approved && (
                                        <span className="ml-2 px-2 py-1 text-xs bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 rounded">
                                            Freigegeben
                                        </span>
                                    )}
                                </div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {new Date(analysis.timestamp).toLocaleString("de-DE")}
                                </span>
                            </div>
                        ))}
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



