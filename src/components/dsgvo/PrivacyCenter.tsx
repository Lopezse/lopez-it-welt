/**
 * Privacy-Center Component - Enterprise++ Standard
 * 
 * DSGVO Self-Service für Betroffenenrechte
 * - Daten einsehen
 * - Daten exportieren (ZIP/JSON)
 * - Daten löschen (Recht auf Vergessenwerden)
 * - Consent ändern
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import ConsentRevokeCenter from "./ConsentRevokeCenter";

interface PrivacyCenterProps {
    userId: string;
}

export default function PrivacyCenter({ userId }: PrivacyCenterProps) {
    const [activeTab, setActiveTab] = useState<"overview" | "export" | "delete" | "consents">("overview");
    const [exporting, setExporting] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [exportData, setExportData] = useState<any>(null);

    const handleExport = async () => {
        try {
            setExporting(true);
            const response = await fetch("/api/dsgvo/privacy/export", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: userId })
            });

            const data = await response.json();
            if (data.success) {
                setExportData(data.data);
                
                // Download auslösen
                const blob = new Blob([JSON.stringify(data.data.export_data, null, 2)], {
                    type: "application/json"
                });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = data.data.export_file;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error("Fehler beim Exportieren der Daten:", error);
        } finally {
            setExporting(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Möchten Sie wirklich alle Ihre Daten löschen? Diese Aktion kann nicht rückgängig gemacht werden.")) {
            return;
        }

        if (!confirm("Sind Sie sicher? Alle Ihre Daten werden gelöscht (pseudonymisiert).")) {
            return;
        }

        try {
            setDeleting(true);
            const response = await fetch("/api/dsgvo/privacy/delete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: userId })
            });

            const data = await response.json();
            if (data.success) {
                alert("Ihre Daten wurden erfolgreich gelöscht (pseudonymisiert).");
                window.location.href = "/";
            }
        } catch (error) {
            console.error("Fehler beim Löschen der Daten:", error);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex space-x-8">
                    <button
                        onClick={() => setActiveTab("overview")}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "overview"
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        Übersicht
                    </button>
                    <button
                        onClick={() => setActiveTab("export")}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "export"
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        Daten exportieren
                    </button>
                    <button
                        onClick={() => setActiveTab("consents")}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "consents"
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        Einwilligungen
                    </button>
                    <button
                        onClick={() => setActiveTab("delete")}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "delete"
                                ? "border-red-500 text-red-600"
                                : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        Daten löschen
                    </button>
                </nav>
            </div>

            <div className="mt-6">
                {activeTab === "overview" && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Ihre Daten
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Hier können Sie Ihre personenbezogenen Daten verwalten.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                                    Daten einsehen
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                    Sehen Sie alle Ihre gespeicherten Daten ein.
                                </p>
                                <Button
                                    onClick={() => setActiveTab("export")}
                                    variant="outline"
                                >
                                    Daten anzeigen
                                </Button>
                            </div>
                            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                                    Daten exportieren
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                    Laden Sie alle Ihre Daten herunter (Art. 15 DSGVO).
                                </p>
                                <Button
                                    onClick={handleExport}
                                    disabled={exporting}
                                    variant="outline"
                                >
                                    {exporting ? "Exportiere..." : "Daten exportieren"}
                                </Button>
                            </div>
                            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                                    Einwilligungen
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                    Verwalten Sie Ihre Einwilligungen.
                                </p>
                                <Button
                                    onClick={() => setActiveTab("consents")}
                                    variant="outline"
                                >
                                    Einwilligungen verwalten
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "export" && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Daten exportieren (Art. 15 DSGVO)
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Laden Sie alle Ihre personenbezogenen Daten herunter.
                        </p>
                        <Button
                            onClick={handleExport}
                            disabled={exporting}
                            className="bg-black text-white"
                        >
                            {exporting ? "Exportiere..." : "Daten als JSON exportieren"}
                        </Button>
                        {exportData && (
                            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                                    Export erfolgreich
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Datei: {exportData.export_file}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "consents" && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Einwilligungen verwalten
                        </h2>
                        <ConsentRevokeCenter userId={userId} />
                    </div>
                )}

                {activeTab === "delete" && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-red-600">
                            Daten löschen (Art. 17 DSGVO)
                        </h2>
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <h3 className="font-medium text-red-900 dark:text-red-200 mb-2">
                                ⚠️ Wichtiger Hinweis
                            </h3>
                            <p className="text-sm text-red-800 dark:text-red-300 mb-4">
                                Wenn Sie Ihre Daten löschen, werden alle Ihre personenbezogenen Daten 
                                gelöscht (pseudonymisiert). Diese Aktion kann nicht rückgängig gemacht werden.
                            </p>
                            <p className="text-sm text-red-800 dark:text-red-300">
                                <strong>Hinweis:</strong> Aus rechtlichen Gründen (GoBD) werden einige 
                                Daten pseudonymisiert statt vollständig gelöscht.
                            </p>
                        </div>
                        <Button
                            onClick={handleDelete}
                            disabled={deleting}
                            className="bg-red-600 text-white hover:bg-red-700"
                        >
                            {deleting ? "Lösche Daten..." : "Alle Daten löschen"}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}



