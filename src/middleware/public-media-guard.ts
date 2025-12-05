/**
 * Public Media Guard - Enterprise++ Security
 * 
 * Verhindert direkten Zugriff auf alte Media-Pfade:
 * - /linkedin-posts/*
 * - /uploads/images/*
 * - Directory Listing
 * - Rohdateien-Zugriff
 */

import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import { logger } from "@/lib/logger";

// Geschützte Pfade (alte Media-Strukturen)
const PROTECTED_PATHS = [
    "/linkedin-posts",
    "/uploads/images",
    "/uploads",
];

// Cache für HTML-Seite (wird einmal geladen)
let cached403Page: string | null = null;

/**
 * Prüft ob ein Pfad geschützt ist
 */
function isProtectedPath(pathname: string): boolean {
    return PROTECTED_PATHS.some((path) => pathname.startsWith(path));
}

/**
 * Prüft ob es sich um eine Bilddatei handelt
 */
function isImageFile(pathname: string): boolean {
    const imageExtensions = [".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"];
    return imageExtensions.some((ext) => pathname.toLowerCase().endsWith(ext));
}

/**
 * Public Media Guard Middleware
 * Blockiert direkten Zugriff auf alte Media-Pfade
 */
export async function publicMediaGuard(request: NextRequest): Promise<NextResponse | null> {
    const pathname = request.nextUrl.pathname;

    // Debug-Log (nur in Development)
    logger.debug("PublicMediaGuard: Prüfe Pfad", { pathname });

    // Nur geschützte Pfade prüfen
    if (!isProtectedPath(pathname)) {
        return null; // Weiterleitung zur Route
    }

    // Security-Event-Log
    logger.security("Protected path access attempt", { pathname });

    // Admin-Zugriff erlauben (über API)
    // Wenn der Request von einem authentifizierten Admin kommt, erlauben
    // (wird in der API-Route geprüft)
    if (pathname.startsWith("/api/")) {
        return null;
    }

    // Gebrandete 403-HTML-Seite laden (mit Caching)
    const get403Page = async (): Promise<string> => {
        // Wenn bereits gecacht, direkt zurückgeben
        if (cached403Page) {
            return cached403Page;
        }

        try {
            const htmlPath = join(process.cwd(), "src/middleware/403-security-page.html");
            cached403Page = await readFile(htmlPath, "utf-8");
            return cached403Page;
        } catch (error) {
            // Fallback, falls HTML-Datei nicht gefunden wird
            const fallback = `<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <title>Zugriff verweigert - Lopez IT Welt</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #1e3a8a; color: white; }
        .container { background: white; color: #1f2937; padding: 40px; border-radius: 12px; max-width: 600px; margin: 0 auto; }
        h1 { color: #ef4444; font-size: 48px; margin-bottom: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>403</h1>
        <h2>Zugriff verweigert</h2>
        <p>Direkter Zugriff auf Media-Ressourcen ist aus Sicherheitsgründen nicht erlaubt.</p>
        <p><strong>Lopez IT Welt</strong> – Enterprise++ Security System</p>
    </div>
</body>
</html>`;
            cached403Page = fallback;
            return fallback;
        }
    };

    // Directory Listing verhindern (Pfad endet mit /)
    if (pathname.endsWith("/") || pathname === "/linkedin-posts" || pathname === "/uploads/images" || pathname === "/uploads") {
        const html = await get403Page();
        return new NextResponse(html, {
            status: 403,
            headers: {
                "Content-Type": "text/html; charset=utf-8",
                "X-Content-Type-Options": "nosniff",
                "X-Frame-Options": "DENY",
                "Cache-Control": "no-store, no-cache, must-revalidate",
            },
        });
    }

    // Bilddateien blockieren (nur über sichere API-Route zugänglich)
    if (isImageFile(pathname)) {
        const html = await get403Page();
        return new NextResponse(html, {
            status: 403,
            headers: {
                "Content-Type": "text/html; charset=utf-8",
                "X-Content-Type-Options": "nosniff",
                "X-Frame-Options": "DENY",
                "Cache-Control": "no-store, no-cache, must-revalidate",
            },
        });
    }

    // Alle anderen Anfragen blockieren
    const html = await get403Page();
    return new NextResponse(html, {
        status: 403,
        headers: {
            "Content-Type": "text/html; charset=utf-8",
            "X-Content-Type-Options": "nosniff",
            "X-Frame-Options": "DENY",
            "Cache-Control": "no-store, no-cache, must-revalidate",
        },
    });
}

