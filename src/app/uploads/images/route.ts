/**
 * Uploads Images Route Guard - Enterprise++ Security
 * 
 * Blockiert direkten Zugriff auf /uploads/images (Basis-Pfad)
 * Nutzt die gebrandete 403-HTML-Seite aus public-media-guard
 */

import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

// Cache für HTML-Seite
let cached403Page: string | null = null;

async function get403Page(): Promise<string> {
    if (cached403Page) {
        return cached403Page;
    }

    try {
        const htmlPath = join(process.cwd(), "src/middleware/403-security-page.html");
        cached403Page = await readFile(htmlPath, "utf-8");
        return cached403Page;
    } catch (error) {
        // Fallback
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
}

export async function GET(request: NextRequest) {
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

// Alle HTTP-Methoden blockieren
export async function POST() {
    const html = await get403Page();
    return new NextResponse(html, {
        status: 403,
        headers: {
            "Content-Type": "text/html; charset=utf-8",
            "X-Content-Type-Options": "nosniff",
            "X-Frame-Options": "DENY",
        },
    });
}

export async function PUT() {
    const html = await get403Page();
    return new NextResponse(html, {
        status: 403,
        headers: {
            "Content-Type": "text/html; charset=utf-8",
            "X-Content-Type-Options": "nosniff",
            "X-Frame-Options": "DENY",
        },
    });
}

export async function DELETE() {
    const html = await get403Page();
    return new NextResponse(html, {
        status: 403,
        headers: {
            "Content-Type": "text/html; charset=utf-8",
            "X-Content-Type-Options": "nosniff",
            "X-Frame-Options": "DENY",
        },
    });
}








