"use client";

/**
 * BulkActionsToolbar - Enterprise++ Standard
 * 
 * Toolbar für Bulk-Aktionen auf ausgewählten Medien
 */

import { useState, useEffect } from "react";
import { FaSpinner, FaPlay, FaRedo, FaUserCheck } from "react-icons/fa";
import type { AIStatus } from "./AIStatusBadge";
import ErrorMessage from "./ErrorMessage";
import SuccessMessage from "./SuccessMessage";

interface MediaItem {
    id: string;
    ai_status?: AIStatus;
    has_person?: boolean;
    dsgvo_approved_by_admin?: boolean;
}

interface BulkActionsToolbarProps {
    selectedMedia: MediaItem[];
    hasManagePermission: boolean;
    onActionComplete: () => void;
}

export default function BulkActionsToolbar({
    selectedMedia,
    hasManagePermission,
    onActionComplete,
}: BulkActionsToolbarProps) {
    const [loading, setLoading] = useState(false);
    const [actionType, setActionType] = useState<"analyze" | "retry" | "dsgvo" | null>(null);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [pendingAction, setPendingAction] = useState<"analyze" | "retry" | "dsgvo" | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    if (!hasManagePermission || selectedMedia.length === 0) {
        return null;
    }

    // Filtere Medien für verschiedene Aktionen
    const canAnalyze = selectedMedia.filter(
        (m) => !m.ai_status || m.ai_status === "pending" || m.ai_status === "idle" || m.ai_status === "error"
    );
    const canRetry = selectedMedia.filter((m) => m.ai_status === "done" || m.ai_status === "error");
    const canDSGVO = selectedMedia.filter(
        (m) => m.has_person && !m.dsgvo_approved_by_admin
    );

    const handleBulkAnalyze = async () => {
        if (canAnalyze.length === 0) return;

        setLoading(true);
        setActionType("analyze");
        try {
            const response = await fetch("/api/admin/media/ai/analyze-batch", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    mediaIds: canAnalyze.map((m) => m.id),
                    language: "de",
                }),
            });

            const data = await response.json();

            if (data.success) {
                setSuccess(`KI-Analyse für ${canAnalyze.length} Medien erfolgreich gestartet`);
                setTimeout(() => {
                    setSuccess(null);
                    onActionComplete();
                }, 2000);
            } else {
                setError(data.message || "Fehler bei der Bulk-Analyse");
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Fehler bei der Bulk-Analyse";
            setError(errorMessage);
        } finally {
            setLoading(false);
            setActionType(null);
        }
    };

    const handleBulkRetry = async () => {
        if (canRetry.length === 0) return;

        setLoading(true);
        setActionType("retry");
        try {
            const response = await fetch("/api/admin/media/ai/analyze-batch", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    mediaIds: canRetry.map((m) => m.id),
                    language: "de",
                }),
            });

            const data = await response.json();

            if (data.success) {
                setSuccess(`Erneute Analyse für ${canRetry.length} Medien erfolgreich gestartet`);
                setTimeout(() => {
                    setSuccess(null);
                    onActionComplete();
                }, 2000);
            } else {
                setError(data.message || "Fehler beim erneuten Analysieren");
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Fehler beim erneuten Analysieren";
            setError(errorMessage);
        } finally {
            setLoading(false);
            setActionType(null);
        }
    };

    const handleBulkDSGVO = async () => {
        if (canDSGVO.length === 0) return;

        setLoading(true);
        setActionType("dsgvo");
        try {
            // DSGVO-Freigabe für jedes Medium einzeln (kein Batch-Endpoint vorhanden)
            const results = await Promise.allSettled(
                canDSGVO.map((m) =>
                    fetch("/api/admin/media/ai/approve", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            mediaId: m.id,
                            approveDSGVO: true,
                        }),
                    })
                )
            );

            const successCount = results.filter((r) => r.status === "fulfilled").length;
            const failedCount = results.length - successCount;

            if (failedCount > 0) {
                setError(`${successCount} von ${results.length} Medien erfolgreich freigegeben. ${failedCount} Fehler aufgetreten.`);
            } else {
                setSuccess(`${successCount} Medien erfolgreich freigegeben.`);
            }

            setTimeout(() => {
                setError(null);
                setSuccess(null);
                onActionComplete();
            }, failedCount > 0 ? 5000 : 2000);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Fehler bei der DSGVO-Freigabe";
            setError(errorMessage);
        } finally {
            setLoading(false);
            setActionType(null);
        }
    };

    const openConfirmDialog = (action: "analyze" | "retry" | "dsgvo") => {
        setPendingAction(action);
        setShowConfirmDialog(true);
    };

    // Focus-Management für Modal
    useEffect(() => {
        if (showConfirmDialog) {
            // Focus auf ersten Button setzen
            const firstButton = document.querySelector('[aria-label="Aktion abbrechen"]') as HTMLButtonElement;
            firstButton?.focus();
        }
    }, [showConfirmDialog]);

    const executeAction = () => {
        setShowConfirmDialog(false);
        if (pendingAction === "analyze") {
            handleBulkAnalyze();
        } else if (pendingAction === "retry") {
            handleBulkRetry();
        } else if (pendingAction === "dsgvo") {
            handleBulkDSGVO();
        }
        setPendingAction(null);
    };

    const getActionLabel = () => {
        switch (pendingAction) {
            case "analyze":
                return `KI-Analyse für ${canAnalyze.length} Medien starten`;
            case "retry":
                return `Erneut analysieren für ${canRetry.length} Medien`;
            case "dsgvo":
                return `DSGVO-Freigabe für ${canDSGVO.length} Medien erteilen`;
            default:
                return "";
        }
    };

    return (
        <>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-4">
                {error && (
                    <ErrorMessage
                        message={error}
                        type="error"
                        onDismiss={() => setError(null)}
                        autoDismiss={true}
                        autoDismissDelay={5000}
                    />
                )}
                {success && (
                    <SuccessMessage
                        message={success}
                        onDismiss={() => setSuccess(null)}
                        autoDismiss={true}
                    />
                )}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">
                            {selectedMedia.length} Medien ausgewählt
                        </span>
                        {loading && (
                            <FaSpinner className="animate-spin text-blue-600" aria-label="Wird verarbeitet..." role="status" />
                        )}
                    </div>
                    <div className="flex gap-2">
                        {canAnalyze.length > 0 && (
                            <button
                                onClick={() => openConfirmDialog("analyze")}
                                disabled={loading}
                                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                aria-label={`KI-Analyse für ${canAnalyze.length} Medien starten`}
                            >
                                <FaPlay className="mr-1" aria-hidden="true" />
                                KI-Analyse starten ({canAnalyze.length})
                            </button>
                        )}
                        {canRetry.length > 0 && (
                            <button
                                onClick={() => openConfirmDialog("retry")}
                                disabled={loading}
                                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                aria-label={`Erneut analysieren für ${canRetry.length} Medien`}
                            >
                                <FaRedo className="mr-1" aria-hidden="true" />
                                Erneut analysieren ({canRetry.length})
                            </button>
                        )}
                        {canDSGVO.length > 0 && (
                            <button
                                onClick={() => openConfirmDialog("dsgvo")}
                                disabled={loading}
                                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                aria-label={`DSGVO-Freigabe für ${canDSGVO.length} Medien erteilen`}
                            >
                                <FaUserCheck className="mr-1" aria-hidden="true" />
                                DSGVO-Freigabe ({canDSGVO.length})
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Bestätigungs-Dialog */}
            {showConfirmDialog && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="bulk-action-dialog-title"
                    aria-describedby="bulk-action-dialog-description"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setShowConfirmDialog(false);
                            setPendingAction(null);
                        }
                    }}
                >
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
                        <h3 id="bulk-action-dialog-title" className="text-lg font-semibold text-gray-900 mb-4">
                            Bulk-Aktion bestätigen
                        </h3>
                        <p id="bulk-action-dialog-description" className="text-sm text-gray-600 mb-6">
                            Sie sind dabei, {getActionLabel()}. Fortfahren?
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => {
                                    setShowConfirmDialog(false);
                                    setPendingAction(null);
                                }}
                                disabled={loading}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
                                aria-label="Aktion abbrechen"
                            >
                                Abbrechen
                            </button>
                            <button
                                onClick={executeAction}
                                disabled={loading}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
                                aria-label="Aktion bestätigen und ausführen"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <FaSpinner className="animate-spin" aria-hidden="true" />
                                        Wird verarbeitet...
                                    </span>
                                ) : (
                                    "Fortfahren"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

