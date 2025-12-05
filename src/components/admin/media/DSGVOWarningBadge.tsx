"use client";

/**
 * DSGVOWarningBadge - Enterprise++ Standard
 * 
 * Zeigt DSGVO-Warnung bei Personenerkennung an
 * - hasPerson = true & !dsgvoApproved: Orange/Rot (Warnung)
 * - hasPerson = true & dsgvoApproved: Grün (Freigegeben)
 * - hasPerson = false: Nicht angezeigt
 */

import { FaUser, FaCheckCircle } from "react-icons/fa";

interface DSGVOWarningBadgeProps {
    hasPerson: boolean;
    dsgvoApproved: boolean;
}

export default function DSGVOWarningBadge({ hasPerson, dsgvoApproved }: DSGVOWarningBadgeProps) {
    // Nur anzeigen, wenn Person erkannt wurde
    if (!hasPerson) {
        return null;
    }

    // Tooltip-Text generieren
    const getTooltipText = () => {
        if (dsgvoApproved) {
            return "Person erkannt – freigegeben";
        }
        return "Person erkannt – Freigabe erforderlich";
    };

    const getLabel = () => {
        if (dsgvoApproved) {
            return "DSGVO-Freigegeben";
        }
        return "DSGVO-Relevant";
    };

    if (dsgvoApproved) {
        // Grün: Freigegeben
        return (
            <div
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200"
                title={getTooltipText()}
                aria-label={getLabel()}
            >
                <FaCheckCircle className="mr-1 text-sm" aria-hidden="true" />
                <span>{getLabel()}</span>
            </div>
        );
    }

    // Orange/Rot: Warnung
    return (
        <div
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200"
            title={getTooltipText()}
            aria-label={getLabel()}
        >
            <FaUser className="mr-1 text-sm" aria-hidden="true" />
            <span>{getLabel()}</span>
        </div>
    );
}





