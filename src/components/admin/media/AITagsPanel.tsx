"use client";

/**
 * AITagsPanel - Enterprise++ Standard
 * 
 * Zeigt KI-generierte Tags an
 * - Tags übernehmen Funktion
 */

import { FaCheck } from "react-icons/fa";

interface AITagsPanelProps {
    tags: string[];
    tagsApproved: boolean;
    currentTags?: string[];
    hasManagePermission: boolean;
    onAdoptTags: (tags: string[]) => void;
}

export default function AITagsPanel({
    tags,
    tagsApproved,
    currentTags = [],
    hasManagePermission,
    onAdoptTags,
}: AITagsPanelProps) {
    const isAdopted = tags.length > 0 && tags.every((tag) => currentTags.includes(tag)) && tags.length === currentTags.length;

    return (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900">KI-generierte Tags</h3>
                {isAdopted ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✅ Tags übernommen
                    </span>
                ) : tagsApproved ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✅ Freigegeben
                    </span>
                ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        ⏳ Ausstehend
                    </span>
                )}
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag, index) => (
                    <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                    >
                        {tag}
                    </span>
                ))}
            </div>
            {hasManagePermission && !isAdopted && (
                <div>
                    <button
                        onClick={() => onAdoptTags(tags)}
                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        aria-label="Tags übernehmen"
                    >
                        <FaCheck className="mr-1" aria-hidden="true" />
                        Tags übernehmen
                    </button>
                    <p className="text-xs text-gray-600 mt-2">
                        Sie können die übernommenen Tags jederzeit bearbeiten.
                    </p>
                </div>
            )}
        </div>
    );
}

