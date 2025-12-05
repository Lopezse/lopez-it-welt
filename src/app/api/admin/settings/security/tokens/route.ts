import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { executeQueryPool } from "@/lib/db";
import crypto from "crypto";

// GET /api/admin/settings/security/tokens
export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: "Nicht authentifiziert" }, { status: 401 });
    }

    // RBAC: Nur Owner/Admin
    const userRoles = session.roles || [];
    if (!userRoles.includes("Owner") && !userRoles.includes("Admin")) {
      return NextResponse.json({ success: false, error: "Keine Berechtigung" }, { status: 403 });
    }

    const userId = session.user.id;

    // API-Token laden
    const tokens = await executeQueryPool({
      query: `
        SELECT id, name, token_hash, expires_at, created_at, last_used_at 
        FROM api_tokens 
        WHERE user_id = ? AND (expires_at IS NULL OR expires_at > NOW())
        ORDER BY created_at DESC
      `,
      values: [userId],
    });

    return NextResponse.json({
      success: true,
      data: (tokens || []).map((token: any) => ({
        id: token.id,
        name: token.name,
        token_preview: token.token_hash ? `${token.token_hash.substring(0, 8)}...` : "N/A",
        expires_at: token.expires_at,
        last_used_at: token.last_used_at,
        created_at: token.created_at,
      })),
    });
  } catch (error: any) {
    console.error("Fehler beim Laden der API-Token:", error);
    return NextResponse.json({ success: true, data: [] });
  }
}

// POST /api/admin/settings/security/tokens
export async function POST(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: "Nicht authentifiziert" }, { status: 401 });
    }

    // RBAC: Nur Owner/Admin
    const userRoles = session.roles || [];
    if (!userRoles.includes("Owner") && !userRoles.includes("Admin")) {
      return NextResponse.json({ success: false, error: "Keine Berechtigung" }, { status: 403 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { name, expires_in_days } = body;

    if (!name || name.length < 3) {
      return NextResponse.json({ success: false, error: "Token-Name muss mindestens 3 Zeichen lang sein" }, { status: 400 });
    }

    // Token generieren
    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    // Ablaufdatum berechnen
    const expiresAt = expires_in_days
      ? new Date(Date.now() + expires_in_days * 24 * 60 * 60 * 1000)
      : null;

    // Token in Datenbank speichern
    await executeQueryPool({
      query: "INSERT INTO api_tokens (user_id, name, token_hash, expires_at, created_at) VALUES (?, ?, ?, ?, NOW())",
      values: [userId, name, tokenHash, expiresAt],
    });

    return NextResponse.json({ success: true, data: { token } });
  } catch (error: any) {
    console.error("Fehler beim Erstellen des Tokens:", error);
    return NextResponse.json({ success: false, error: error.message || "Fehler beim Erstellen des Tokens" }, { status: 500 });
  }
}

