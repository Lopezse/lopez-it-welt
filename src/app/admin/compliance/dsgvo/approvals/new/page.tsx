/**
 * DSGVO Approval New - Enterprise++ Standard
 * 
 * Neue Freigabe erstellen
 * Implementiert gemäß P7-MANUAL-APPROVAL.md
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function NewApprovalPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        use_case_id: "",
        use_case_name: "",
        risk_category: "medium" as "low" | "medium" | "high" | "critical",
        risk_score: 0,
        approval_reason: "",
        approval_conditions: "",
        measures_package: "",
        review_date: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/dsgvo/approvals", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("adm_session") || ""}`
                },
                body: JSON.stringify({
                    ...formData,
                    approval_status: "pending",
                    risk_score: parseInt(formData.risk_score.toString())
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Fehler beim Erstellen der Freigabe");
            }

            const data = await response.json();
            if (data.success) {
                router.push(`/admin/compliance/dsgvo/approvals/${data.data.id}`);
            } else {
                throw new Error(data.message || "Fehler beim Erstellen der Freigabe");
            }
        } catch (err: any) {
            setError(err.message || "Fehler beim Erstellen der Freigabe");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/admin/compliance/dsgvo/approvals">
                        <Button variant="outline" className="mb-4">
                            ← Zurück zur Übersicht
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Neue Freigabe erstellen
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Erstellen Sie eine neue Freigabe für einen High/Critical-Risk Use-Case
                    </p>
                </div>

                {/* Formular */}
                <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <p className="text-red-800 dark:text-red-400">{error}</p>
                        </div>
                    )}

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Use-Case Name *
                            </label>
                            <input
                                type="text"
                                value={formData.use_case_name}
                                onChange={(e) => setFormData({ ...formData, use_case_name: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Use-Case ID (optional)
                            </label>
                            <input
                                type="text"
                                value={formData.use_case_id}
                                onChange={(e) => setFormData({ ...formData, use_case_id: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Risikokategorie *
                                </label>
                                <select
                                    value={formData.risk_category}
                                    onChange={(e) => setFormData({ ...formData, risk_category: e.target.value as any })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    required
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                    <option value="critical">Critical</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Risikowert *
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={formData.risk_score}
                                    onChange={(e) => setFormData({ ...formData, risk_score: parseInt(e.target.value) || 0 })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Maßnahmenpaket (Referenz zu P5-MEASURES.md)
                            </label>
                            <input
                                type="text"
                                value={formData.measures_package}
                                onChange={(e) => setFormData({ ...formData, measures_package: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                placeholder="z.B. P5-MEASURES.md Abschnitt 4.1"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Begründung (optional)
                            </label>
                            <textarea
                                value={formData.approval_reason}
                                onChange={(e) => setFormData({ ...formData, approval_reason: e.target.value })}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Bedingungen (optional)
                            </label>
                            <textarea
                                value={formData.approval_conditions}
                                onChange={(e) => setFormData({ ...formData, approval_conditions: e.target.value })}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Review-Datum (optional)
                            </label>
                            <input
                                type="date"
                                value={formData.review_date}
                                onChange={(e) => setFormData({ ...formData, review_date: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-8">
                        <Link href="/admin/compliance/dsgvo/approvals">
                            <Button variant="outline" type="button">
                                Abbrechen
                            </Button>
                        </Link>
                        <Button variant="primary" type="submit" loading={loading}>
                            Freigabe erstellen
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}






