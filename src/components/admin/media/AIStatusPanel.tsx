"use client";

/**
 * AIStatusPanel - Enterprise++ Standard
 * 
 * Zeigt KI-Status-Informationen an
 */

import AIStatusBadge, { type AIStatus } from "./AIStatusBadge";

interface AIStatusPanelProps {
    status: AIStatus;
    errorMessage?: string | null;
    retryCount?: number;
    analyzedAt?: string | null;
}

export default function AIStatusPanel({
    status,
    errorMessage,
    retryCount = 0,
    analyzedAt,
}: AIStatusPanelProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("de-DE", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">KI-Status</h3>
            <div className="space-y-2">
                <div>
                    <AIStatusBadge status={status} errorMessage={errorMessage} analyzedAt={analyzedAt} />
                </div>
                {analyzedAt && (
                    <div className="text-sm text-gray-600">
                        <span className="font-medium">Letzte Analyse:</span> {formatDate(analyzedAt)}
                    </div>
                )}
                {status === "error" && errorMessage && (
                    <div className="text-sm text-red-600 mt-2">
                        <span className="font-medium">Fehlermeldung:</span> {errorMessage}
                    </div>
                )}
                {status === "error" && retryCount > 0 && (
                    <div className="text-sm text-gray-600">
                        <span className="font-medium">Wiederholungsversuche:</span> {retryCount}
                    </div>
                )}
            </div>
        </div>
    );
}





