/**
 * DSGVO Approval Detail - Enterprise++ Standard
 * 
 * Detail-Ansicht einer Freigabe mit Entscheidungsmatrix
 * Implementiert gemäß P7-MANUAL-APPROVAL.md
 */

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

interface Approval {
    id: string;
    use_case_id?: string;
    use_case_name: string;
    risk_category: "low" | "medium" | "high" | "critical";
    risk_score: number;
    approval_status: "pending" | "approved" | "rejected" | "needs_improvement";
    approved_by_dsfa?: string;
    approved_by_dsb?: string;
    approved_by_architect?: string;
    approval_date?: string;
    approval_reason?: string;
    approval_conditions?: string;
    measures_package?: string;
    audit_hash?: string;
    review_date?: string;
    created_at: string;
    updated_at: string;
}

export default function ApprovalDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [approval, setApproval] = useState<Approval | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [role, setRole] = useState<"dsfa" | "dsb" | "architect">("dsfa");
    const [reason, setReason] = useState("");
    const [conditions, setConditions] = useState("");

    useEffect(() => {
        if (params.id) {
            loadApproval(params.id as string);
        }
    }, [params.id]);

    const loadApproval = async (id: string) => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`/api/dsgvo/approvals/${id}`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("adm_session") || ""}`
                }
            });

            if (!response.ok) {
                throw new Error("Fehler beim Laden der Freigabe");
            }

            const data = await response.json();
            if (data.success) {
                setApproval(data.data);
            } else {
                throw new Error(data.message || "Fehler beim Laden der Freigabe");
            }
        } catch (err: any) {
            setError(err.message || "Fehler beim Laden der Freigabe");
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        if (!approval || !reason) return;

        try {
            const response = await fetch(`/api/dsgvo/approvals/${approval.id}/approve`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("adm_session") || ""}`
                },
                body: JSON.stringify({
                    role,
                    reason,
                    conditions: conditions || undefined
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Fehler beim Erteilen der Freigabe");
            }

            setShowApproveModal(false);
            setReason("");
            setConditions("");
            loadApproval(approval.id);
        } catch (err: any) {
            alert(err.message || "Fehler beim Erteilen der Freigabe");
        }
    };

    const handleReject = async () => {
        if (!approval || !reason) return;

        try {
            const response = await fetch(`/api/dsgvo/approvals/${approval.id}/reject`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("adm_session") || ""}`
                },
                body: JSON.stringify({ reason })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Fehler beim Ablehnen der Freigabe");
            }

            setShowRejectModal(false);
            setReason("");
            loadApproval(approval.id);
        } catch (err: any) {
            alert(err.message || "Fehler beim Ablehnen der Freigabe");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Lade Freigabe...</p>
                </div>
            </div>
        );
    }

    if (error || !approval) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 dark:text-red-400 mb-4">{error || "Freigabe nicht gefunden"}</p>
                    <Link href="/admin/compliance/dsgvo/approvals">
                        <Button>Zurück zur Übersicht</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const needsDSB = approval.risk_category === "high" || approval.risk_category === "critical";
    const canApprove = approval.approval_status === "pending" || approval.approval_status === "needs_improvement";

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/admin/compliance/dsgvo/approvals">
                        <Button variant="outline" className="mb-4">
                            ← Zurück zur Übersicht
                        </Button>
                    </Link>
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                {approval.use_case_name}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Freigabe-Detail für Use-Case
                            </p>
                        </div>
                        {canApprove && (
                            <div className="flex gap-2">
                                <Button
                                    variant="primary"
                                    onClick={() => setShowApproveModal(true)}
                                >
                                    Freigeben
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={() => setShowRejectModal(true)}
                                >
                                    Ablehnen
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Entscheidungsmatrix */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        Entscheidungsmatrix
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-900">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                        Kriterium
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                        Begründung
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                <tr>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                        Maßnahmen erfüllt
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        <span className="text-gray-500 dark:text-gray-400">☐</span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                        Zu prüfen
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                        Risiko ≤ High
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        <span className={approval.risk_category === "critical" ? "text-red-600" : "text-green-600"}>
                                            {approval.risk_category === "critical" ? "☒" : "☐"}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                        Höchstes Risiko: {approval.risk_score} ({approval.risk_category})
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                        DSFA dokumentiert
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        <span className="text-gray-500 dark:text-gray-400">☐</span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                        Vollständig dokumentiert
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                        DSGVO-Firewall aktiv
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        <span className="text-gray-500 dark:text-gray-400">☐</span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                        Decision Engine integriert
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                        QualityGate aktiv
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        <span className="text-gray-500 dark:text-gray-400">☐</span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                        QualityGate aktiviert
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                        Audit-Log aktiv
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        <span className="text-gray-500 dark:text-gray-400">☐</span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                        Vollständige Audit-Logs
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Freigabe-Informationen */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                            Freigabe-Informationen
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Status:</span>
                                <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${
                                    approval.approval_status === "approved" ? "bg-green-100 text-green-800" :
                                    approval.approval_status === "rejected" ? "bg-red-100 text-red-800" :
                                    approval.approval_status === "pending" ? "bg-yellow-100 text-yellow-800" :
                                    "bg-orange-100 text-orange-800"
                                }`}>
                                    {approval.approval_status}
                                </span>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Risikokategorie:</span>
                                <span className="ml-2 text-sm text-gray-900 dark:text-white">{approval.risk_category.toUpperCase()}</span>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Risikowert:</span>
                                <span className="ml-2 text-sm text-gray-900 dark:text-white">{approval.risk_score}</span>
                            </div>
                            {approval.approval_date && (
                                <div>
                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Freigabedatum:</span>
                                    <span className="ml-2 text-sm text-gray-900 dark:text-white">
                                        {new Date(approval.approval_date).toLocaleDateString("de-DE")}
                                    </span>
                                </div>
                            )}
                            {approval.review_date && (
                                <div>
                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Review-Datum:</span>
                                    <span className="ml-2 text-sm text-gray-900 dark:text-white">
                                        {new Date(approval.review_date).toLocaleDateString("de-DE")}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                            Signaturfelder
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">DSFA-Verantwortlicher:</span>
                                <span className="ml-2 text-sm text-gray-900 dark:text-white">
                                    {approval.approved_by_dsfa ? "✓ Signiert" : "☐ Ausstehend"}
                                </span>
                            </div>
                            {needsDSB && (
                                <div>
                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Datenschutzbeauftragter:</span>
                                    <span className="ml-2 text-sm text-gray-900 dark:text-white">
                                        {approval.approved_by_dsb ? "✓ Signiert" : "☐ Ausstehend (erforderlich)"}
                                    </span>
                                </div>
                            )}
                            <div>
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Systemarchitekt:</span>
                                <span className="ml-2 text-sm text-gray-900 dark:text-white">
                                    {approval.approved_by_architect ? "✓ Signiert" : "☐ Optional"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Begründung */}
                {approval.approval_reason && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                            Begründung
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                            {approval.approval_reason}
                        </p>
                    </div>
                )}

                {/* Bedingungen */}
                {approval.approval_conditions && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                            Bedingungen
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                            {approval.approval_conditions}
                        </p>
                    </div>
                )}

                {/* Audit-Hash */}
                {approval.audit_hash && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                            Audit-Hash (SHA-256)
                        </h3>
                        <p className="text-sm font-mono text-gray-700 dark:text-gray-300 break-all">
                            {approval.audit_hash}
                        </p>
                    </div>
                )}

                {/* Approve Modal */}
                {showApproveModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                Freigabe erteilen
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Rolle
                                    </label>
                                    <select
                                        value={role}
                                        onChange={(e) => setRole(e.target.value as any)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    >
                                        <option value="dsfa">DSFA-Verantwortlicher</option>
                                        {needsDSB && <option value="dsb">Datenschutzbeauftragter</option>}
                                        <option value="architect">Systemarchitekt</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Begründung *
                                    </label>
                                    <textarea
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Bedingungen (optional)
                                    </label>
                                    <textarea
                                        value={conditions}
                                        onChange={(e) => setConditions(e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <Button variant="outline" onClick={() => setShowApproveModal(false)}>
                                    Abbrechen
                                </Button>
                                <Button variant="primary" onClick={handleApprove} disabled={!reason}>
                                    Freigeben
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Reject Modal */}
                {showRejectModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                Freigabe ablehnen
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Begründung *
                                    </label>
                                    <textarea
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <Button variant="outline" onClick={() => setShowRejectModal(false)}>
                                    Abbrechen
                                </Button>
                                <Button variant="destructive" onClick={handleReject} disabled={!reason}>
                                    Ablehnen
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}






