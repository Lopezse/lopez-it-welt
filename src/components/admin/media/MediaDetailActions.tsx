"use client";

/**
 * MediaDetailActions - Enterprise++ Standard
 * 
 * Aktionen-Toolbar für KI-Analyse
 */

import { useState } from "react";
import { FaSpinner, FaPlay, FaRedo } from "react-icons/fa";
import type { AIStatus } from "./AIStatusBadge";
import ErrorMessage from "./ErrorMessage";
import SuccessMessage from "./SuccessMessage";

interface MediaDetailActionsProps {
    mediaId: string;
    aiStatus: AIStatus;
    hasManagePermission: boolean;
    onActionComplete: () => void;
}

export default function MediaDetailActions({
    mediaId,
    aiStatus,
    hasManagePermission,
    onActionComplete,
}: MediaDetailActionsProps) {
    const [loading, setLoading] = useState(false);
    const [actionType, setActionType] = useState<"start" | "retry" | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // KI-Analyse starten
    const handleStartAnalysis = async () => {
        setLoading(true);
        setActionType("start");
        try {
            const response = await fetch("/api/admin/media/ai/analyze", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    mediaId,
                    language: "de",
                }),
            });

            const data = await response.json();

            if (data.success) {
                setSuccess("KI-Analyse erfolgreich gestartet");
                // Kurz warten, dann aktualisieren
                setTimeout(() => {
                    setSuccess(null);
                    onActionComplete();
                }, 2000);
            } else {
                setError(data.message || "Fehler beim Starten der KI-Analyse");
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Fehler beim Starten der KI-Analyse";
            setError(errorMessage);
        } finally {
            setLoading(false);
            setActionType(null);
        }
    };

    // Erneut analysieren
    const handleRetryAnalysis = async () => {
        setLoading(true);
        setActionType("retry");
        try {
            const response = await fetch("/api/admin/media/ai/analyze", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    mediaId,
                    language: "de",
                }),
            });

            const data = await response.json();

            if (data.success) {
                setSuccess("KI-Analyse erfolgreich erneut gestartet");
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

    const canStart = aiStatus === "pending" || aiStatus === null || aiStatus === "idle";
    const canRetry = aiStatus === "done" || aiStatus === "error";
    const isRunning = aiStatus === "running" || loading;

    if (!hasManagePermission) {
        return null;
    }

    return (
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900">KI-Aktionen</h3>
                {isRunning && (
                    <div className="flex items-center gap-2 text-sm text-blue-600" role="status" aria-live="polite">
                        <FaSpinner className="animate-spin" aria-hidden="true" />
                        <span>KI-Analyse läuft...</span>
                    </div>
                )}
            </div>
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
            <div className="flex gap-2">
                {canStart && (
                    <button
                        onClick={handleStartAnalysis}
                        disabled={loading || isRunning}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        aria-label="KI-Analyse starten"
                    >
                        <FaPlay className="mr-2" aria-hidden="true" />
                        KI-Analyse starten
                    </button>
                )}
                {canRetry && (
                    <button
                        onClick={handleRetryAnalysis}
                        disabled={loading || isRunning}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        aria-label="Erneut analysieren"
                    >
                        <FaRedo className="mr-2" aria-hidden="true" />
                        Erneut analysieren
                    </button>
                )}
            </div>
        </div>
    );
}

