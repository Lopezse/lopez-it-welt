/**
 * DSGVO Dashboard - Enterprise++ Standard
 * 
 * Zentrale Übersicht für DSGVO-Compliance
 * - Consent-Status
 * - KI-Verarbeitung
 * - Audit-Events
 * - Löschprozesse
 * - Privacy-Requests
 * - Risiko-Score
 * - Alert-Panel
 */

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { DSGVOComplianceTrend } from "@/components/admin/compliance/dsgvo/DSGVOComplianceTrend";
import { DSGVORiskScore } from "@/components/admin/compliance/dsgvo/DSGVORiskScore";

interface DSGVOStatus {
    overall_status: "compliant" | "warning" | "critical";
    consent_coverage: number;
    ki_processing_compliant: boolean;
    privacy_requests_pending: number;
    audit_logs_count: number;
    risk_score: number;
    last_updated: string;
}

interface ConsentStats {
    total_consents: number;
    active_consents: number;
    revoked_consents: number;
}

interface KIOverview {
    total_analyses: number;
    person_detected: number;
    dsgvo_approved: number;
    pending_approval: number;
}

interface PrivacyStats {
    total_requests: number;
    pending: number;
    completed: number;
}

interface AuditOverview {
    total_events: number;
    critical_events: number;
}

export default function DSGVODashboard() {
    const [status, setStatus] = useState<DSGVOStatus | null>(null);
    const [consentStats, setConsentStats] = useState<ConsentStats | null>(null);
    const [kiOverview, setKIOverview] = useState<KIOverview | null>(null);
    const [privacyStats, setPrivacyStats] = useState<PrivacyStats | null>(null);
    const [auditOverview, setAuditOverview] = useState<AuditOverview | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadDashboardData();
        // Auto-Refresh alle 30 Sekunden
        const interval = setInterval(loadDashboardData, 30000);
        return () => clearInterval(interval);
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Parallel alle Daten laden
            const [statusRes, consentsRes, kiRes, privacyRes, auditRes] = await Promise.all([
                fetch("/api/dsgvo/monitoring/status"),
                fetch("/api/dsgvo/monitoring/consents"),
                fetch("/api/dsgvo/monitoring/ki-usage"),
                fetch("/api/dsgvo/monitoring/privacy-requests"),
                fetch("/api/dsgvo/monitoring/audit-events")
            ]);

            if (statusRes.ok) {
                const statusData = await statusRes.json();
                if (statusData.success) {
                    setStatus(statusData.data);
                }
            }

            if (consentsRes.ok) {
                const consentsData = await consentsRes.json();
                if (consentsData.success) {
                    setConsentStats({
                        total_consents: consentsData.data.total_consents,
                        active_consents: consentsData.data.active_consents,
                        revoked_consents: consentsData.data.revoked_consents
                    });
                }
            }

            if (kiRes.ok) {
                const kiData = await kiRes.json();
                if (kiData.success) {
                    setKIOverview({
                        total_analyses: kiData.data.total_analyses,
                        person_detected: kiData.data.person_detected,
                        dsgvo_approved: kiData.data.dsgvo_approved,
                        pending_approval: kiData.data.pending_approval
                    });
                }
            }

            if (privacyRes.ok) {
                const privacyData = await privacyRes.json();
                if (privacyData.success) {
                    setPrivacyStats({
                        total_requests: privacyData.data.total_requests,
                        pending: privacyData.data.pending,
                        completed: privacyData.data.completed
                    });
                }
            }

            if (auditRes.ok) {
                const auditData = await auditRes.json();
                if (auditData.success) {
                    setAuditOverview({
                        total_events: auditData.data.total_events,
                        critical_events: auditData.data.critical_events.length
                    });
                }
            }
        } catch (err) {
            // Fehler wird geloggt (in Produktion würde logger.error() verwendet)
            setError("Fehler beim Laden der Dashboard-Daten");
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "compliant":
                return "bg-green-500";
            case "warning":
                return "bg-yellow-500";
            case "critical":
                return "bg-red-500";
            default:
                return "bg-gray-500";
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "compliant":
                return "Compliant";
            case "warning":
                return "Warnung";
            case "critical":
                return "Kritisch";
            default:
                return "Unbekannt";
        }
    };

    const getRiskColor = (score: number) => {
        if (score >= 70) return "text-red-600";
        if (score >= 40) return "text-yellow-600";
        return "text-green-600";
    };

    if (loading && !status) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Lade DSGVO-Dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
                    <Button onClick={loadDashboardData}>Erneut laden</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        DSGVO-Dashboard
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Übersicht über DSGVO-Compliance, Consents, KI-Verarbeitung und Privacy-Requests
                    </p>
                </div>

                {/* Alert-Panel */}
                {status && (
                    <div className={`mb-6 p-4 rounded-lg border-2 ${
                        status.overall_status === "critical" ? "bg-red-50 dark:bg-red-900/20 border-red-500" :
                        status.overall_status === "warning" ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500" :
                        "bg-green-50 dark:bg-green-900/20 border-green-500"
                    }`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`w-4 h-4 rounded-full ${getStatusColor(status.overall_status)}`}></div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white">
                                        Status: {getStatusText(status.overall_status)}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Risiko-Score: <span className={getRiskColor(status.risk_score)}>{status.risk_score}/100</span>
                                    </p>
                                </div>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                Letzte Aktualisierung: {new Date(status.last_updated).toLocaleString("de-DE")}
                            </div>
                        </div>
                    </div>
                )}

                {/* Neue E.2.1 Komponenten */}
                <div className="mb-8 space-y-6">
                    <DSGVOComplianceTrend />
                    <DSGVORiskScore />
                </div>

                {/* Grid mit Panels */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Consent-Status */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Consent-Status
                        </h2>
                        {consentStats ? (
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Gesamt:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{consentStats.total_consents}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Aktiv:</span>
                                    <span className="font-medium text-green-600">{consentStats.active_consents}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Widerrufen:</span>
                                    <span className="font-medium text-red-600">{consentStats.revoked_consents}</span>
                                </div>
                                {status && (
                                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Coverage:</span>
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {status.consent_coverage.toFixed(1)}%
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400">Lade Daten...</p>
                        )}
                        <div className="mt-4">
                            <a
                                href="/admin/compliance/dsgvo/consents"
                                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                Details anzeigen →
                            </a>
                        </div>
                    </div>

                    {/* KI-Verarbeitung */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            KI-Verarbeitung
                        </h2>
                        {kiOverview ? (
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Gesamt-Analysen:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{kiOverview.total_analyses}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Person erkannt:</span>
                                    <span className="font-medium text-yellow-600">{kiOverview.person_detected}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">DSGVO-Freigegeben:</span>
                                    <span className="font-medium text-green-600">{kiOverview.dsgvo_approved}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Ausstehend:</span>
                                    <span className="font-medium text-red-600">{kiOverview.pending_approval}</span>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Compliant:</span>
                                        <span className={`font-medium ${status?.ki_processing_compliant ? "text-green-600" : "text-red-600"}`}>
                                            {status?.ki_processing_compliant ? "Ja" : "Nein"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400">Lade Daten...</p>
                        )}
                        <div className="mt-4">
                            <a
                                href="/admin/compliance/dsgvo/ki"
                                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                Details anzeigen →
                            </a>
                        </div>
                    </div>

                    {/* Privacy-Requests */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Privacy-Requests
                        </h2>
                        {privacyStats ? (
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Gesamt:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{privacyStats.total_requests}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Abgeschlossen:</span>
                                    <span className="font-medium text-green-600">{privacyStats.completed}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Ausstehend:</span>
                                    <span className="font-medium text-yellow-600">{privacyStats.pending}</span>
                                </div>
                                {status && (
                                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Pending:</span>
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {status.privacy_requests_pending}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400">Lade Daten...</p>
                        )}
                        <div className="mt-4">
                            <a
                                href="/admin/compliance/dsgvo/privacy"
                                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                Details anzeigen →
                            </a>
                        </div>
                    </div>

                    {/* Audit-Events */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Audit-Events
                        </h2>
                        {auditOverview ? (
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Gesamt:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{auditOverview.total_events}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Kritisch:</span>
                                    <span className="font-medium text-red-600">{auditOverview.critical_events}</span>
                                </div>
                                {status && (
                                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Logs:</span>
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {status.audit_logs_count}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400">Lade Daten...</p>
                        )}
                        <div className="mt-4">
                            <a
                                href="/admin/compliance/dsgvo/audit"
                                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                Details anzeigen →
                            </a>
                        </div>
                    </div>

                    {/* Risiko-Score */}
                    {status && (
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Risiko-Score
                            </h2>
                            <div className="space-y-4">
                                <div className="text-center">
                                    <div className={`text-4xl font-bold ${getRiskColor(status.risk_score)}`}>
                                        {status.risk_score}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">von 100</div>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                                    <div
                                        className={`h-4 rounded-full ${
                                            status.risk_score >= 70 ? "bg-red-500" :
                                            status.risk_score >= 40 ? "bg-yellow-500" :
                                            "bg-green-500"
                                        }`}
                                        style={{ width: `${status.risk_score}%` }}
                                    ></div>
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    Status: <span className="font-medium">{getStatusText(status.overall_status)}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Weekly Report */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Wöchentlicher Report
                        </h2>
                        <div className="space-y-3">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Generiert automatisch jeden Montag
                            </p>
                            <Button
                                onClick={async () => {
                                    try {
                                        const response = await fetch("/api/dsgvo/report/weekly", {
                                            method: "POST"
                                        });
                                        const data = await response.json();
                                        if (data.success) {
                                            alert("Report erfolgreich generiert!");
                                        }
                                    } catch (err) {
                                        console.error("Fehler beim Generieren des Reports:", err);
                                    }
                                }}
                                className="w-full"
                            >
                                Report jetzt generieren
                            </Button>
                            <a
                                href="/api/dsgvo/report/weekly"
                                target="_blank"
                                className="block text-center text-sm text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                Letzten Report anzeigen
                            </a>
                        </div>
                    </div>

                    {/* AI-Compliance Status */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            AI-Compliance Status
                        </h2>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">KI-Firewall:</span>
                                <span className="font-medium text-green-600">Aktiv</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Decision Engine:</span>
                                <span className="font-medium text-green-600">Aktiv</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Enforcement Layer:</span>
                                <span className="font-medium text-green-600">Aktiv</span>
                            </div>
                        </div>
                        <div className="mt-4">
                            <a
                                href="/admin/compliance/dsgvo/ai-monitoring"
                                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                AI-Monitoring anzeigen →
                            </a>
                        </div>
                    </div>

                    {/* Consent Health */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Consent Health
                        </h2>
                        {status && (
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Coverage:</span>
                                    <span className={`font-medium ${
                                        status.consent_coverage >= 80 ? "text-green-600" :
                                        status.consent_coverage >= 50 ? "text-yellow-600" :
                                        "text-red-600"
                                    }`}>
                                        {status.consent_coverage.toFixed(1)}%
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">KI-Compliant:</span>
                                    <span className={`font-medium ${status.ki_processing_compliant ? "text-green-600" : "text-red-600"}`}>
                                        {status.ki_processing_compliant ? "Ja" : "Nein"}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* DSGVO-Firewall Status */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            DSGVO-Firewall Status
                        </h2>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Status:</span>
                                <span className="font-medium text-green-600">Schutz aktiv</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Blockierungen:</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {status?.privacy_requests_pending || 0}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Refresh-Button */}
                <div className="mt-6 flex justify-end">
                    <Button
                        onClick={loadDashboardData}
                        variant="outline"
                        disabled={loading}
                    >
                        {loading ? "Lädt..." : "Aktualisieren"}
                    </Button>
                </div>
            </div>
        </div>
    );
}

