/**
 * DSGVO Approvals Overview - Enterprise++ Standard
 * 
 * Übersicht aller High/Critical-Risk Use-Cases
 * Implementiert gemäß P7-MANUAL-APPROVAL.md
 */

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
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
    audit_hash?: string;
    review_date?: string;
    created_at: string;
    updated_at: string;
}

export default function ApprovalsOverviewPage() {
    const [approvals, setApprovals] = useState<Approval[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState({
        risk_category: "" as string,
        approval_status: "" as string
    });
    const router = useRouter();

    useEffect(() => {
        loadApprovals();
    }, [filters]);

    const loadApprovals = async () => {
        try {
            setLoading(true);
            setError(null);

            const params = new URLSearchParams();
            if (filters.risk_category) params.append("risk_category", filters.risk_category);
            if (filters.approval_status) params.append("approval_status", filters.approval_status);

            const response = await fetch(`/api/dsgvo/approvals?${params.toString()}`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("adm_session") || ""}`
                }
            });

            if (!response.ok) {
                throw new Error("Fehler beim Laden der Freigaben");
            }

            const data = await response.json();
            if (data.success) {
                setApprovals(data.data);
            } else {
                throw new Error(data.message || "Fehler beim Laden der Freigaben");
            }
        } catch (err: any) {
            setError(err.message || "Fehler beim Laden der Freigaben");
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "approved":
                return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
            case "rejected":
                return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
            case "pending":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
            case "needs_improvement":
                return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
        }
    };

    const getRiskColor = (category: string) => {
        switch (category) {
            case "critical":
                return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
            case "high":
                return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
            case "medium":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
            case "low":
                return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Lade Freigaben...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
                    <Button onClick={loadApprovals}>Erneut versuchen</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Manual Approval - Freigaben
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Übersicht aller High/Critical-Risk Use-Cases
                        </p>
                    </div>
                    <Link href="/admin/compliance/dsgvo/approvals/new">
                        <Button variant="primary">
                            Neue Freigabe erstellen
                        </Button>
                    </Link>
                </div>

                {/* Filter */}
                <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Risikokategorie
                            </label>
                            <select
                                value={filters.risk_category}
                                onChange={(e) => setFilters({ ...filters, risk_category: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            >
                                <option value="">Alle</option>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="critical">Critical</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Status
                            </label>
                            <select
                                value={filters.approval_status}
                                onChange={(e) => setFilters({ ...filters, approval_status: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            >
                                <option value="">Alle</option>
                                <option value="pending">Ausstehend</option>
                                <option value="approved">Freigegeben</option>
                                <option value="rejected">Abgelehnt</option>
                                <option value="needs_improvement">Nachbesserung</option>
                            </select>
                        </div>
                        <div className="flex items-end">
                            <Button
                                variant="outline"
                                onClick={() => setFilters({ risk_category: "", approval_status: "" })}
                            >
                                Filter zurücksetzen
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Tabelle */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-900">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Use-Case
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Risikokategorie
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Risikowert
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Freigegeben von
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Erstellt am
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Aktionen
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {approvals.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                            Keine Freigaben gefunden
                                        </td>
                                    </tr>
                                ) : (
                                    approvals.map((approval) => (
                                        <tr key={approval.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {approval.use_case_name}
                                                </div>
                                                {approval.use_case_id && (
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        ID: {approval.use_case_id}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRiskColor(approval.risk_category)}`}>
                                                    {approval.risk_category.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                {approval.risk_score}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(approval.approval_status)}`}>
                                                    {approval.approval_status === "pending" && "Ausstehend"}
                                                    {approval.approval_status === "approved" && "Freigegeben"}
                                                    {approval.approval_status === "rejected" && "Abgelehnt"}
                                                    {approval.approval_status === "needs_improvement" && "Nachbesserung"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {approval.approved_by_dsfa ? "DSFA" : "-"}
                                                {approval.approved_by_dsb && " + DSB"}
                                                {approval.approved_by_architect && " + Architekt"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {new Date(approval.created_at).toLocaleDateString("de-DE")}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <Link href={`/admin/compliance/dsgvo/approvals/${approval.id}`}>
                                                    <Button variant="outline" size="sm">
                                                        Details
                                                    </Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}






