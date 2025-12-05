"use client";

/**
 * CategorySuggestionPanel - Enterprise++ Standard
 * 
 * Zeigt KI-Kategorie-Vorschlag an
 * - Kategorie übernehmen Funktion
 */

import { FaCheck } from "react-icons/fa";

interface CategorySuggestionPanelProps {
    suggestion: string;
    currentCategory: string;
    categoryApproved: boolean;
    hasManagePermission: boolean;
    onAdoptCategory: (category: string) => void;
}

export default function CategorySuggestionPanel({
    suggestion,
    currentCategory,
    categoryApproved,
    hasManagePermission,
    onAdoptCategory,
}: CategorySuggestionPanelProps) {
    const matches = suggestion.toLowerCase() === currentCategory.toLowerCase();
    const isAdopted = matches;

    return (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900">Kategorie-Vorschlag</h3>
                {isAdopted ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✅ Kategorie übernommen
                    </span>
                ) : categoryApproved ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✅ Freigegeben
                    </span>
                ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        ⏳ Ausstehend
                    </span>
                )}
            </div>
            <div className="space-y-2 mb-3">
                <div>
                    <span className="text-xs text-gray-600">KI-Vorschlag:</span>
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                        {suggestion}
                    </span>
                </div>
                <div>
                    <span className="text-xs text-gray-600">Aktuelle Kategorie:</span>
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                        {currentCategory}
                    </span>
                </div>
                {matches && (
                    <div className="text-xs text-green-600 mt-2">✓ Vorschlag stimmt mit aktueller Kategorie überein</div>
                )}
            </div>
            {hasManagePermission && !isAdopted && (
                <button
                    onClick={() => onAdoptCategory(suggestion)}
                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-label="Kategorie übernehmen"
                >
                    <FaCheck className="mr-1" aria-hidden="true" />
                    Kategorie übernehmen
                </button>
            )}
        </div>
    );
}

