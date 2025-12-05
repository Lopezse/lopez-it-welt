"use client";

/**
 * QualityScorePanel - Enterprise++ Standard
 * 
 * Zeigt Quality-Score und Warnungen an
 */

interface QualityScorePanelProps {
    score: number;
    warnings: string[];
}

export default function QualityScorePanel({ score, warnings }: QualityScorePanelProps) {
    const getScoreColor = () => {
        if (score >= 80) return "text-green-600";
        if (score >= 60) return "text-yellow-600";
        return "text-red-600";
    };

    const getScoreLabel = () => {
        if (score >= 80) return "Hoch";
        if (score >= 60) return "Mittel";
        return "Niedrig";
    };

    return (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Qualitäts-Score</h3>
            <div className="space-y-3">
                <div className="flex items-center gap-4">
                    <div className={`text-3xl font-bold ${getScoreColor()}`}>{score}</div>
                    <div>
                        <div className="text-sm font-medium text-gray-900">Qualität: {getScoreLabel()}</div>
                        <div className="text-xs text-gray-600">Bewertung: 0-100</div>
                    </div>
                </div>
                {warnings.length > 0 && (
                    <div className="mt-3" role="alert" aria-live="polite">
                        <h4 className="text-xs font-semibold text-gray-700 mb-2">Warnungen:</h4>
                        <ul className="space-y-1" role="list">
                            {warnings.map((warning, index) => (
                                <li key={index} className="text-sm text-orange-600 flex items-start gap-2" role="listitem">
                                    <span aria-hidden="true">⚠️</span>
                                    <span>{warning}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

