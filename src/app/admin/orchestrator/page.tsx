/**
 * Orchestrator Overview - Enterprise++ Standard
 * 
 * Übersicht über alle Agenten und letzte Orchestrator-Events
 */

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

interface Agent {
    name: string;
    type: string;
    capabilities: string[];
    dsgvoScope: string[];
    riskProfile: string;
    enabled?: boolean;
}

interface OrchestratorEvent {
    id: number;
    event_type: string;
    action: string;
    resource_id: string;
    timestamp: string;
    result: string;
}

export default function OrchestratorOverviewPage() {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [events, setEvents] = useState<OrchestratorEvent[]>([]);
    const [stats, setStats] = useState<Record<string, number>>({});
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

            // Agenten laden
            const agentsResponse = await fetch("/api/orchestrator/agents");
            const agentsData = await agentsResponse.json();

            if (agentsData.success) {
                setAgents(agentsData.data.agents);
                
                // Statistik berechnen
                const taskStats: Record<string, number> = {};
                agentsData.data.agents.forEach((agent: Agent) => {
                    taskStats[agent.name] = 0; // In Produktion: Echte Task-Zählung
                });
                setStats(taskStats);
            }

            // Events laden
            const eventsResponse = await fetch("/api/dsgvo/monitoring/audit-events?limit=50");
            const eventsData = await eventsResponse.json();

            if (eventsData.success) {
                // Filtere nur ORCH_* Events
                const orchEvents = eventsData.data.recent_events.filter((e: any) =>
                    e.event_type.startsWith("ORCH_")
                );
                setEvents(orchEvents.slice(0, 10));
            }
        } catch (err) {
            console.error("Fehler beim Laden der Orchestrator-Daten:", err);
            setError("Fehler beim Laden der Daten");
        } finally {
            setLoading(false);
        }
    };

    const getRiskColor = (risk: string) => {
        switch (risk) {
            case "low":
                return "text-green-600";
            case "medium":
                return "text-yellow-600";
            case "high":
                return "text-red-600";
            default:
                return "text-gray-600";
        }
    };

    if (loading && agents.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Lade Orchestrator-Daten...</p>
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

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        KI-Orchestrator
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Zentrale Steuerung aller KI-Agenten
                    </p>
                </div>

                {/* Statistik */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Registrierte Agenten</h3>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{agents.length}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Aktive Agenten</h3>
                        <p className="text-3xl font-bold text-green-600">
                            {agents.filter(a => a.enabled !== false).length}
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Letzte Events</h3>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{events.length}</p>
                    </div>
                </div>

                {/* Agenten-Liste */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Registrierte Agenten
                        </h2>
                        <Link
                            href="/admin/orchestrator/agents"
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        >
                            Details anzeigen →
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead>
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Name</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Typ</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Risk</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Tasks</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {agents.map((agent) => (
                                    <tr key={agent.name}>
                                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{agent.name}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{agent.type}</td>
                                        <td className="px-4 py-3 text-sm">
                                            <span className={getRiskColor(agent.riskProfile)}>
                                                {agent.riskProfile}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            <span className={`px-2 py-1 rounded ${
                                                agent.enabled !== false
                                                    ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200"
                                                    : "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200"
                                            }`}>
                                                {agent.enabled !== false ? "Aktiv" : "Deaktiviert"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                            {stats[agent.name] || 0}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Letzte Events */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Letzte Orchestrator-Events
                        </h2>
                        <Link
                            href="/admin/orchestrator/events"
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        >
                            Alle Events anzeigen →
                        </Link>
                    </div>
                    <div className="space-y-2">
                        {events.length > 0 ? (
                            events.map((event) => (
                                <div key={event.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                                    <div>
                                        <span className="text-gray-900 dark:text-white">{event.event_type}</span>
                                        <span className="text-gray-600 dark:text-gray-400 ml-2">{event.action}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-2 py-1 rounded text-xs ${
                                            event.result === "success"
                                                ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200"
                                                : "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200"
                                        }`}>
                                            {event.result}
                                        </span>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {new Date(event.timestamp).toLocaleString("de-DE")}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                                Keine Events gefunden
                            </p>
                        )}
                    </div>
                </div>

                <div className="mt-6">
                    <Button onClick={loadData} variant="outline" disabled={loading}>
                        {loading ? "Lädt..." : "Aktualisieren"}
                    </Button>
                </div>
            </div>
        </div>
    );
}



