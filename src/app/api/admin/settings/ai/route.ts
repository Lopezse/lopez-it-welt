import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { executeQueryPool } from "@/lib/db";

// GET /api/admin/settings/ai
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

    // KI-Einstellungen laden
    const ai = await executeQueryPool("SELECT * FROM settings_ai ORDER BY id DESC LIMIT 1", []);

    if (ai && ai.length > 0) {
      return NextResponse.json({ success: true, data: ai[0] });
    }

    // Fallback: Standardwerte
    return NextResponse.json({
      success: true,
      data: {
        provider: "openai",
        model: "gpt-4",
        temperature: 0.7,
        max_tokens: 2000,
        top_p: 1.0,
        token_limit_per_request: 4000,
        token_limit_per_day: 100000,
        token_limit_per_month: 3000000,
        rag_enabled: false,
        embedding_model: "text-embedding-ada-002",
        chunk_size: 1000,
        logging_enabled: true,
        log_level: "info",
        log_retention_days: 30,
      },
    });
  } catch (error: any) {
    console.error("Fehler beim Laden der KI-Einstellungen:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT /api/admin/settings/ai
export async function PUT(request: NextRequest) {
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

    const body = await request.json();

    // Prüfen ob Eintrag existiert
    const existing = await executeQueryPool("SELECT id FROM settings_ai ORDER BY id DESC LIMIT 1", []);

    if (existing && existing.length > 0) {
      // Aktualisieren
      await executeQueryPool(
        `UPDATE settings_ai SET 
          provider = ?, model = ?, temperature = ?, max_tokens = ?, top_p = ?,
          token_limit_per_request = ?, token_limit_per_day = ?, token_limit_per_month = ?,
          rag_enabled = ?, embedding_model = ?, chunk_size = ?,
          logging_enabled = ?, log_level = ?, log_retention_days = ?, updated_at = NOW()
        WHERE id = ?`,
        [
          body.provider || "openai",
          body.model || "gpt-4",
          body.temperature || 0.7,
          body.max_tokens || 2000,
          body.top_p || 1.0,
          body.token_limit_per_request || 4000,
          body.token_limit_per_day || 100000,
          body.token_limit_per_month || 3000000,
          body.rag_enabled ? 1 : 0,
          body.embedding_model || "text-embedding-ada-002",
          body.chunk_size || 1000,
          body.logging_enabled ? 1 : 0,
          body.log_level || "info",
          body.log_retention_days || 30,
          existing[0].id,
        ]
      );
    } else {
      // Erstellen
      await executeQueryPool(`
          INSERT INTO settings_ai 
          (provider, model, temperature, max_tokens, top_p, token_limit_per_request, token_limit_per_day, token_limit_per_month, rag_enabled, embedding_model, chunk_size, logging_enabled, log_level, log_retention_days, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        `, [
          body.provider || "openai",
          body.model || "gpt-4",
          body.temperature || 0.7,
          body.max_tokens || 2000,
          body.top_p || 1.0,
          body.token_limit_per_request || 4000,
          body.token_limit_per_day || 100000,
          body.token_limit_per_month || 3000000,
          body.rag_enabled ? 1 : 0,
          body.embedding_model || "text-embedding-ada-002",
          body.chunk_size || 1000,
          body.logging_enabled ? 1 : 0,
          body.log_level || "info",
          body.log_retention_days || 30,
        ]);
    }

    return NextResponse.json({ success: true, message: "KI-Einstellungen erfolgreich aktualisiert" });
  } catch (error: any) {
    console.error("Fehler beim Aktualisieren der KI-Einstellungen:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

