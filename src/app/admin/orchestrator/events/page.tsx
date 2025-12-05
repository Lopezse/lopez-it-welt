/**
 * Orchestrator Events - Enterprise++ Standard
 * 
 * Liste der ORCH_* Audit-Events mit Filtern
 */

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";

interface OrchestratorEvent {
    id: number;
    event_type: string;
    action: string;
    resource_id: string;
    user_id?: string; // DSGVO: Wird NICHT im UI angezeigt
    timestamp: string;
    result: string;
    details?: Record<string, unknown>;
}

export default function OrchestratorEventsPage() {
    const [events, setEvents] = useState<OrchestratorEvent[]>([]);
    const [filteredEvents, setFilteredEvents] = useState<OrchestratorEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState({
        timeRange: "all",
        agent: "all",
        status: "all",
        event_type: "",
        severity: "",
        use_case: "",
        quick_filter: ""
    });

    useEffect(() => {
        loadEvents();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [events, filters]);

    const loadEvents = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Verwende Orchestrator Events API falls verfügbar, sonst Fallback
            let response;
            try {
                response = await fetch("/api/orchestrator/events?limit=1000");
                if (!response.ok) throw new Error("Orchestrator API nicht verfügbar");
                const data = await response.json();
                if (data.success) {
                    setEvents(data.data || []);
                    return;
                }
            } catch {
                // Fallback auf Audit-Events
            }
            
            response = await fetch("/api/dsgvo/monitoring/audit-events?limit=1000");
            const data = await response.json();

            if (data.success) {
                // Filtere nur ORCH_* Events
                const orchEvents = data.data.recent_events.filter((e: any) =>
                    e.event_type.startsWith("ORCH_")
                );
                setEvents(orchEvents);
            } else {
                setError("Fehler beim Laden der Events");
            }
        } catch (err) {
            console.error("Fehler beim Laden der Events:", err);
            setError("Fehler beim Laden der Events");
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...events];

        // Quick-Filter (hat Priorität)
        if (filters.quick_filter) {
            switch (filters.quick_filter) {
                case "ORCH_TRIGGER_AUTO_BLOCKED":
                    filtered = filtered.filter(e => e.event_type === "ORCH_TRIGGER_AUTO_BLOCKED");
                    break;
                case "ORCH_USE_CASE_UNKNOWN":
                    filtered = filtered.filter(e => e.event_type === "ORCH_USE_CASE_UNKNOWN");
                    break;
                case "APPROVAL_REQUIRED":
                    filtered = filtered.filter(e => 
                        e.event_type.includes("APPROVAL") || 
                        e.event_type.includes("BLOCKED") ||
                        (typeof e.details === "object" && e.details && "error_code" in e.details && e.details.error_code === "APPROVAL_REQUIRED")
                    );
                    break;
            }
        }

        // Event-Type-Filter
        if (filters.event_type) {
            filtered = filtered.filter(e => 
                e.event_type.toLowerCase().includes(filters.event_type.toLowerCase())
            );
        }

        // Severity-Filter (aus Details oder Event-Type ableiten)
        if (filters.severity) {
            filtered = filtered.filter(e => {
                try {
                    const details = typeof e.details === "string" ? JSON.parse(e.details) : e.details;
                    const severity = details?.severity || 
                                   (e.event_type.includes("BLOCKED") ? "high" : 
                                    e.event_type.includes("ERROR") ? "high" : 
                                    e.event_type.includes("WARNING") ? "medium" : "low");
                    return severity === filters.severity;
                } catch {
                    return false;
                }
            });
        }

        // Use-Case-Filter (aus Details)
        if (filters.use_case) {
            filtered = filtered.filter(e => {
                try {
                    const details = typeof e.details === "string" ? JSON.parse(e.details) : e.details;
                    const useCase = details?.use_case || "";
                    return useCase.toLowerCase().includes(filters.use_case.toLowerCase());
                } catch {
                    return false;
                }
            });
        }

        // Zeitraum-Filter
        if (filters.timeRange !== "all") {
            const now = new Date();
            const cutoff = new Date();
            switch (filters.timeRange) {
                case "1h":
                    cutoff.setHours(now.getHours() - 1);
                    break;
                case "24h":
                    cutoff.setHours(now.getHours() - 24);
                    break;
                case "7d":
                    cutoff.setDate(now.getDate() - 7);
                    break;
            }
            filtered = filtered.filter(e => new Date(e.timestamp) >= cutoff);
        }

        // Agent-Filter (aus Details)
        if (filters.agent !== "all") {
            filtered = filtered.filter(e => {
                try {
                    const details = typeof e.details === "string" ? JSON.parse(e.details) : e.details;
                    return details?.agentName === filters.agent;
                } catch {
                    return false;
                }
            });
        }

        // Status-Filter
        if (filters.status !== "all") {
            filtered = filtered.filter(e => e.result === filters.status);
        }

        setFilteredEvents(filtered);
    };

    const getUniqueAgents = (): string[] => {
        const agents = new Set<string>();
        events.forEach(e => {
            try {
                const details = typeof e.details === "string" ? JSON.parse(e.details) : e.details;
                if (details?.agentName) {
                    agents.add(details.agentName);
                }
            } catch {
                // Ignore
            }
        });
        return Array.from(agents);
    };

    if (loading && events.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:text-white mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Lade Events...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
                    <Button onClick={loadEvents}>Erneut laden</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Orchestrator-Events
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Liste aller ORCH_* Audit-Events
                    </p>
                </div>

                {/* Filter */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Filter
                    </h2>
                    
                    {/* Quick-Filter */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Quick-Filter
                        </label>
                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => setFilters({ ...filters, quick_filter: filters.quick_filter === "ORCH_TRIGGER_AUTO_BLOCKED" ? "" : "ORCH_TRIGGER_AUTO_BLOCKED" })}
                                className={`px-3 py-1 rounded-lg text-sm ${
                                    filters.quick_filter === "ORCH_TRIGGER_AUTO_BLOCKED"
                                        ? "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-300 dark:border-red-700"
                                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
                                }`}
                            >
                                Trigger Auto-Blocked
                            </button>
                            <button
                                type="button"
                                onClick={() => setFilters({ ...filters, quick_filter: filters.quick_filter === "ORCH_USE_CASE_UNKNOWN" ? "" : "ORCH_USE_CASE_UNKNOWN" })}
                                className={`px-3 py-1 rounded-lg text-sm ${
                                    filters.quick_filter === "ORCH_USE_CASE_UNKNOWN"
                                        ? "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-300 dark:border-red-700"
                                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
                                }`}
                            >
                                Use-Case Unknown
                            </button>
                            <button
                                type="button"
                                onClick={() => setFilters({ ...filters, quick_filter: filters.quick_filter === "APPROVAL_REQUIRED" ? "" : "APPROVAL_REQUIRED" })}
                                className={`px-3 py-1 rounded-lg text-sm ${
                                    filters.quick_filter === "APPROVAL_REQUIRED"
                                        ? "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-300 dark:border-red-700"
                                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
                                }`}
                            >
                                Approval Required
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Event-Typ
                            </label>
                            <input
                                type="text"
                                value={filters.event_type}
                                onChange={(e) => setFilters({ ...filters, event_type: e.target.value })}
                                placeholder="z.B. ORCH_TRIGGER"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Severity
                            </label>
                            <select
                                value={filters.severity}
                                onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            >
                                <option value="">Alle</option>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Use-Case
                            </label>
                            <input
                                type="text"
                                value={filters.use_case}
                                onChange={(e) => setFilters({ ...filters, use_case: e.target.value })}
                                placeholder="z.B. media-ki"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Zeitraum
                            </label>
                            <select
                                value={filters.timeRange}
                                onChange={(e) => setFilters({ ...filters, timeRange: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            >
                                <option value="all">Alle</option>
                                <option value="1h">Letzte Stunde</option>
                                <option value="24h">Letzte 24 Stunden</option>
                                <option value="7d">Letzte 7 Tage</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Agent
                            </label>
                            <select
                                value={filters.agent}
                                onChange={(e) => setFilters({ ...filters, agent: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            >
                                <option value="all">Alle</option>
                                {getUniqueAgents().map(agent => (
                                    <option key={agent} value={agent}>{agent}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Status
                            </label>
                            <select
                                value={filters.status}
                                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            >
                                <option value="all">Alle</option>
                                <option value="success">Erfolgreich</option>
                                <option value="failure">Fehlgeschlagen</option>
                                <option value="pending">Ausstehend</option>
                            </select>
                        </div>
                    </div>
                    <div className="mt-4">
                        <Button
                            variant="outline"
                            onClick={() => setFilters({
                                timeRange: "all",
                                agent: "all",
                                status: "all",
                                event_type: "",
                                severity: "",
                                use_case: "",
                                quick_filter: ""
                            })}
                        >
                            Alle Filter zurücksetzen
                        </Button>
                    </div>
                </div>

                {/* Events-Liste */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        Events ({filteredEvents.length})
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead>
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Event-Type</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Action</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Resource-ID</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Timestamp</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredEvents.map((event) => (
                                    <tr key={event.id}>
                                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{event.event_type}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{event.action}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{event.resource_id || "-"}</td>
                                        <td className="px-4 py-3 text-sm">
                                            <span className={`px-2 py-1 rounded ${
                                                event.result === "success"
                                                    ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200"
                                                    : event.result === "failure"
                                                    ? "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200"
                                                    : "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200"
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
                    {filteredEvents.length === 0 && (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                            Keine Events gefunden
                        </p>
                    )}
                </div>

                <div className="mt-6">
                    <Button onClick={loadEvents} variant="outline" disabled={loading}>
                        {loading ? "Lädt..." : "Aktualisieren"}
                    </Button>
                </div>
            </div>
        </div>
    );
}



