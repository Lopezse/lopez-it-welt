/**
 * Cron-Job für Async-Processing von KI-Analysen - Enterprise++ Standard
 * 
 * Wird von externem Cron-Service aufgerufen (z.B. Vercel Cron, GitHub Actions)
 * Verarbeitet Medien mit ai_status = 'pending'
 * 
 * POST /api/cron/process-media-ai
 * 
 * @created 2025-01-27
 * @purpose Phase 3.1: Async-Processing
 */

import { NextRequest, NextResponse } from "next/server";
import { asyncProcessor } from "@/lib/media/ai/async-processor";

/**
 * Cron-Job-Endpoint für Async-Processing
 * 
 * Sicherheit: Sollte durch Cron-Service-Authentifizierung geschützt werden
 * (z.B. Vercel Cron mit Secret, oder GitHub Actions mit Token)
 */
export async function POST(request: NextRequest) {
    try {
        // Cron-Secret prüfen (für Sicherheit)
        // In Production MUSS CRON_SECRET gesetzt sein
        const cronSecret = request.headers.get("x-cron-secret");
        const expectedSecret = process.env.CRON_SECRET;

        // In Production: Secret ist zwingend erforderlich
        if (process.env.NODE_ENV === "production") {
            if (!expectedSecret) {
                console.error("❌ CRON_SECRET nicht gesetzt - Endpoint ist ungeschützt!");
                return NextResponse.json(
                    { success: false, message: "Cron-Secret nicht konfiguriert" },
                    { status: 500 }
                );
            }
            if (cronSecret !== expectedSecret) {
                return NextResponse.json(
                    { success: false, message: "Ungültiger Cron-Secret" },
                    { status: 401 }
                );
            }
        } else {
            // In Development: Optional, aber Warnung wenn erwartet aber nicht übereinstimmt
            if (expectedSecret && cronSecret !== expectedSecret) {
                console.warn("⚠️ Cron-Secret stimmt nicht überein (Development-Modus)");
            }
        }

        // Verarbeite pending Analysen
        const processed = await asyncProcessor.processPendingAnalyses();

        return NextResponse.json({
            success: true,
            processed,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error("❌ Cron-Job Fehler:", error);
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : "Unbekannter Fehler",
            },
            { status: 500 }
        );
    }
}

/**
 * GET-Endpoint für manuelle Auslösung (nur für Testing)
 */
export async function GET(request: NextRequest) {
    // In Production sollte dieser Endpoint deaktiviert werden
    if (process.env.NODE_ENV === "production") {
        return NextResponse.json(
            { success: false, message: "GET-Endpoint nur in Development verfügbar" },
            { status: 403 }
        );
    }

    try {
        const processed = await asyncProcessor.processPendingAnalyses();

        return NextResponse.json({
            success: true,
            processed,
            timestamp: new Date().toISOString(),
            note: "GET-Endpoint nur für Testing - in Production POST verwenden",
        });
    } catch (error) {
        console.error("❌ Cron-Job Fehler:", error);
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : "Unbekannter Fehler",
            },
            { status: 500 }
        );
    }
}

