/**
 * Orchestrator Agents Detail - Enterprise++ Standard
 * 
 * Detail-Ansicht aller Agenten mit DSGVO-Scope und Risk-Level
 */

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";

interface Agent {
    name: string;
    type: string;
    capabilities: string[];
    dsgvoScope: string[];
    riskProfile: string;
    enabled?: boolean;
}

export default function OrchestratorAgentsPage() {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updating, setUpdating] = useState<Record<string, boolean>>({});

    useEffect(() => {
        loadAgents();
    }, []);

    const loadAgents = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch("/api/orchestrator/agents");
            const data = await response.json();

            if (data.success) {
                setAgents(data.data.agents);
            } else {
                setError("Fehler beim Laden der Agenten");
            }
        } catch (err) {
            console.error("Fehler beim Laden der Agenten:", err);
            setError("Fehler beim Laden der Agenten");
        } finally {
            setLoading(false);
        }
    };

    const toggleAgent = async (agentName: string, currentEnabled: boolean) => {
        setUpdating(prev => ({ ...prev, [agentName]: true }));
        
        try {
            // In Produktion: API-Call zum Aktivieren/Deaktivieren
            // Hier: Mock-Update
            setAgents(prev => prev.map(agent => 
                agent.name === agentName 
                    ? { ...agent, enabled: !currentEnabled }
                    : agent
            ));
            
            // Simuliere API-Call
            await new Promise(resolve => setTimeout(resolve, 500));
        } catch (err) {
            console.error("Fehler beim Toggle des Agenten:", err);
        } finally {
            setUpdating(prev => ({ ...prev, [agentName]: false }));
        }
    };

    const getRiskColor = (risk: string) => {
        switch (risk) {
            case "low":
                return "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200";
            case "medium":
                return "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200";
            case "high":
                return "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200";
            default:
                return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:text-white mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Lade Agenten...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
                    <Button onClick={loadAgents}>Erneut laden</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Agenten-Verwaltung
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Detail-Ansicht aller registrierten KI-Agenten
                    </p>
                </div>

                <div className="space-y-6">
                    {agents.map((agent) => (
                        <div key={agent.name} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        {agent.name}
                                    </h2>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        Typ: {agent.type}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`px-3 py-1 rounded text-sm ${getRiskColor(agent.riskProfile)}`}>
                                        Risk: {agent.riskProfile}
                                    </span>
                                    <Button
                                        onClick={() => toggleAgent(agent.name, agent.enabled !== false)}
                                        disabled={updating[agent.name]}
                                        variant={agent.enabled !== false ? "destructive" : "primary"}
                                        size="sm"
                                    >
                                        {updating[agent.name] 
                                            ? "..." 
                                            : (agent.enabled !== false ? "Deaktivieren" : "Aktivieren")
                                        }
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Capabilities
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {agent.capabilities.map((cap) => (
                                            <span
                                                key={cap}
                                                className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded text-xs"
                                            >
                                                {cap}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        DSGVO-Scope
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {agent.dsgvoScope.map((scope) => (
                                            <span
                                                key={scope}
                                                className="px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-200 rounded text-xs"
                                            >
                                                {scope}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        Status:
                                    </span>
                                    <span className={`px-2 py-1 rounded text-xs ${
                                        agent.enabled !== false
                                            ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200"
                                            : "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200"
                                    }`}>
                                        {agent.enabled !== false ? "Aktiv" : "Deaktiviert"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6">
                    <Button onClick={loadAgents} variant="outline" disabled={loading}>
                        {loading ? "Lädt..." : "Aktualisieren"}
                    </Button>
                </div>
            </div>
        </div>
    );
}



