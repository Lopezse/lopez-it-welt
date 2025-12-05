"use client";

/**
 * DSGVOPanel - Enterprise++ Standard
 * 
 * Zeigt DSGVO-Warnung und Freigabe-Button an
 */

import { useState, useEffect } from "react";
import { FaUser, FaCheckCircle, FaExclamationTriangle, FaSpinner } from "react-icons/fa";
import ErrorMessage from "./ErrorMessage";
import SuccessMessage from "./SuccessMessage";

interface DSGVOPanelProps {
    hasPerson: boolean;
    dsgvoApproved: boolean;
    approvedAt?: string | null;
    approvedBy?: string | null;
    mediaId: string;
    hasManagePermission: boolean;
    onApprovalComplete: () => void;
}

export default function DSGVOPanel({
    hasPerson,
    dsgvoApproved,
    approvedAt,
    approvedBy,
    mediaId,
    hasManagePermission,
    onApprovalComplete,
}: DSGVOPanelProps) {
    const [showDialog, setShowDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Focus-Management für Modal
    useEffect(() => {
        if (showDialog) {
            // Focus auf ersten Button setzen
            const firstButton = document.querySelector('[aria-label="DSGVO-Freigabe abbrechen"]') as HTMLButtonElement;
            firstButton?.focus();
        }
    }, [showDialog]);

    // Format: Date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("de-DE", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // DSGVO-Freigabe erteilen
    const handleApprove = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/admin/media/ai/approve", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    mediaId,
                    approveDSGVO: true,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setShowDialog(false);
                setSuccess("DSGVO-Freigabe erfolgreich erteilt");
                setTimeout(() => {
                    setSuccess(null);
                    onApprovalComplete();
                }, 2000);
            } else {
                setError(data.message || "Fehler bei der DSGVO-Freigabe");
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Fehler bei der DSGVO-Freigabe";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Nur anzeigen, wenn Person erkannt wurde
    if (!hasPerson) {
        return null;
    }

    return (
        <>
            <div
                className={`rounded-lg p-4 border ${
                    dsgvoApproved
                        ? "bg-green-50 border-green-200"
                        : "bg-orange-50 border-orange-200"
                }`}
            >
                <div className="flex items-start gap-3">
                    {dsgvoApproved ? (
                        <FaCheckCircle className="text-green-600 text-xl mt-0.5" aria-hidden="true" />
                    ) : (
                        <FaExclamationTriangle className="text-orange-600 text-xl mt-0.5" aria-hidden="true" />
                    )}
                    <div className="flex-1">
                        {error && (
                            <ErrorMessage
                                message={error}
                                type="error"
                                onDismiss={() => setError(null)}
                                autoDismiss={true}
                            />
                        )}
                        {success && (
                            <SuccessMessage
                                message={success}
                                onDismiss={() => setSuccess(null)}
                                autoDismiss={true}
                            />
                        )}
                        {dsgvoApproved ? (
                            <>
                                <h3 className="text-sm font-semibold text-green-900 mb-1">
                                    DSGVO-Freigabe erteilt
                                </h3>
                                <p className="text-sm text-green-700">
                                    Person im Bild erkannt – Freigabe erteilt
                                </p>
                                {approvedAt && (
                                    <p className="text-xs text-green-600 mt-2">
                                        Freigegeben am: {formatDate(approvedAt)}
                                        {approvedBy && ` von ${approvedBy}`}
                                    </p>
                                )}
                            </>
                        ) : (
                            <>
                                <h3 className="text-sm font-semibold text-orange-900 mb-1">
                                    DSGVO-Freigabe erforderlich
                                </h3>
                                <p className="text-sm text-orange-700 mb-3">
                                    Dieses Bild enthält eine erkannte Person. Bitte prüfen Sie das Bild und erteilen Sie
                                    die DSGVO-Freigabe, bevor Sie es veröffentlichen.
                                </p>
                                {hasManagePermission && (
                                    <button
                                        onClick={() => setShowDialog(true)}
                                        className="px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors"
                                        aria-label="DSGVO-Freigabe erteilen"
                                    >
                                        DSGVO-Freigabe erteilen
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Bestätigungs-Dialog */}
            {showDialog && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="dsgvo-dialog-title"
                    aria-describedby="dsgvo-dialog-description"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setShowDialog(false);
                        }
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Escape" && !loading) {
                            setShowDialog(false);
                        }
                    }}
                >
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
                        <h3 id="dsgvo-dialog-title" className="text-lg font-semibold text-gray-900 mb-4">
                            DSGVO-Freigabe bestätigen
                        </h3>
                        <p id="dsgvo-dialog-description" className="text-sm text-gray-600 mb-6">
                            Möchten Sie die DSGVO-Freigabe für dieses Bild erteilen? Dies wird protokolliert und kann
                            nicht rückgängig gemacht werden.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowDialog(false)}
                                disabled={loading}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
                                aria-label="DSGVO-Freigabe abbrechen"
                            >
                                Abbrechen
                            </button>
                            <button
                                onClick={handleApprove}
                                disabled={loading}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
                                aria-label="DSGVO-Freigabe bestätigen und erteilen"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <FaSpinner className="animate-spin" aria-hidden="true" />
                                        Wird verarbeitet...
                                    </span>
                                ) : (
                                    "Freigabe erteilen"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

