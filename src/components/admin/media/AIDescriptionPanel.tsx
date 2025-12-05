"use client";

/**
 * AIDescriptionPanel - Enterprise++ Standard
 * 
 * Zeigt KI-Vorschlag für Alt-Text an
 * - Alt-Text übernehmen Funktion
 */

import { useState } from "react";
import { FaCheck, FaEdit } from "react-icons/fa";

interface AIDescriptionPanelProps {
    description: string;
    altApproved: boolean;
    currentAlt?: string;
    hasManagePermission: boolean;
    onAdoptAltText: (text: string) => void;
}

export default function AIDescriptionPanel({
    description,
    altApproved,
    currentAlt,
    hasManagePermission,
    onAdoptAltText,
}: AIDescriptionPanelProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(description);
    const isAdopted = currentAlt === description;

    const handleAdopt = () => {
        onAdoptAltText(editedText);
        setIsEditing(false);
    };

    return (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-900">KI-Vorschlag für Alt-Text</h3>
                {isAdopted ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✅ Alt-Text übernommen
                    </span>
                ) : altApproved ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✅ Freigegeben
                    </span>
                ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        ⏳ Ausstehend
                    </span>
                )}
            </div>
            <p className="text-xs text-gray-600 mb-3">
                Dieser Text wurde von der KI erzeugt und sollte redaktionell geprüft werden, bevor er als offizieller
                Alt-Text verwendet wird.
            </p>
            <div className="bg-white rounded-md p-3 border border-gray-200">
                {isEditing ? (
                    <textarea
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                        className="w-full text-sm text-gray-900 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        aria-label="Alt-Text bearbeiten"
                    />
                ) : (
                    <p className="text-sm text-gray-900">{description}</p>
                )}
            </div>
            {hasManagePermission && (
                <div className="mt-3 flex gap-2">
                    {isEditing ? (
                        <>
                            <button
                                onClick={handleAdopt}
                                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                aria-label="Alt-Text übernehmen"
                            >
                                <FaCheck className="mr-1" aria-hidden="true" />
                                Alt-Text übernehmen
                            </button>
                            <button
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditedText(description);
                                }}
                                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                            >
                                Abbrechen
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                aria-label="Alt-Text bearbeiten"
                            >
                                <FaEdit className="mr-1" aria-hidden="true" />
                                Alt-Text bearbeiten
                            </button>
                            <button
                                onClick={() => onAdoptAltText(description)}
                                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                aria-label="Alt-Text übernehmen"
                            >
                                <FaCheck className="mr-1" aria-hidden="true" />
                                Alt-Text übernehmen
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

