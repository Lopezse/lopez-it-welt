/**
 * DSGVO Cookies Config API - Enterprise++ Standard
 * 
 * GET /api/dsgvo/cookies/config - Cookie-Konfiguration abrufen
 */

import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/dsgvo/cookies/config
 * Gibt Cookie-Konfiguration zurück
 */
export async function GET() {
    const cookieConfig = {
        categories: [
            {
                id: "necessary",
                name: "Notwendige Cookies",
                description: "Diese Cookies sind für die Grundfunktionen der Website erforderlich.",
                required: true,
                consent_required: false
            },
            {
                id: "functional",
                name: "Funktionale Cookies",
                description: "Diese Cookies ermöglichen erweiterte Funktionalitäten.",
                required: false,
                consent_required: true
            },
            {
                id: "analytics",
                name: "Analytics-Cookies",
                description: "Diese Cookies helfen uns, die Nutzung der Website zu analysieren.",
                required: false,
                consent_required: true
            },
            {
                id: "marketing",
                name: "Marketing-Cookies",
                description: "Diese Cookies werden für Marketing-Zwecke verwendet.",
                required: false,
                consent_required: true
            },
            {
                id: "ki_processing",
                name: "KI-Verarbeitung",
                description: "Diese Cookies ermöglichen KI-gestützte Funktionen.",
                required: false,
                consent_required: true
            },
            {
                id: "media_ki",
                name: "Media-KI",
                description: "Diese Cookies ermöglichen KI-gestützte Bildanalyse.",
                required: false,
                consent_required: true
            }
        ],
        storage_duration: {
            session: "Bis zum Schließen des Browsers",
            persistent: "Maximal 1 Jahr"
        }
    };

    return NextResponse.json({
        success: true,
        data: cookieConfig
    });
}



