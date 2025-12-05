// =====================================================
// PORTAL PROJEKTE API
// =====================================================
// GET /api/portal/projekte - Liste
// POST /api/portal/projekte - Erstellen
// =====================================================

import { NextRequest, NextResponse } from "next/server";
import { CustomerAuthService } from "@/lib/customer/auth-service";
import { getConnection } from "@/lib/database";
import { cookies } from "next/headers";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";

// Helper: Session prüfen
async function getCustomerId(): Promise<number | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("customer_session")?.value;
  if (!sessionToken) return null;
  const session = await CustomerAuthService.validateSession(sessionToken);
  return session.valid ? session.customer_id || null : null;
}

// GET - Projekte Liste
export async function GET() {
  try {
    const customerId = await getCustomerId();
    if (!customerId) {
      return NextResponse.json({ success: false, error: "Nicht angemeldet" }, { status: 401 });
    }

    const pool = await getConnection();
    const [projects] = await pool.execute<RowDataPacket[]>(`
      SELECT 
        id, name, description, code, status, type,
        ai_media_enabled, ai_code_audit_enabled, ai_analyzer_enabled,
        created_at, updated_at
      FROM lopez_customer_projects 
      WHERE customer_id = ?
      ORDER BY updated_at DESC
    `, [customerId]);

    return NextResponse.json({
      success: true,
      data: projects,
      total: projects.length
    });

  } catch (error) {
    console.error("❌ Projekte GET Error:", error);
    return NextResponse.json({ success: false, error: "Fehler" }, { status: 500 });
  }
}

// POST - Projekt erstellen
export async function POST(request: NextRequest) {
  try {
    const customerId = await getCustomerId();
    if (!customerId) {
      return NextResponse.json({ success: false, error: "Nicht angemeldet" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, type } = body;

    if (!name || name.length < 3) {
      return NextResponse.json({ success: false, error: "Projektname erforderlich (min. 3 Zeichen)" }, { status: 400 });
    }

    // Code generieren
    const code = name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 30) + '-' + Date.now().toString(36);

    const pool = await getConnection();
    const [result] = await pool.execute<ResultSetHeader>(`
      INSERT INTO lopez_customer_projects 
        (customer_id, name, description, code, type, status)
      VALUES (?, ?, ?, ?, ?, 'draft')
    `, [customerId, name, description || null, code, type || 'other']);

    return NextResponse.json({
      success: true,
      message: "Projekt erstellt",
      data: {
        id: result.insertId,
        code
      }
    });

  } catch (error) {
    console.error("❌ Projekte POST Error:", error);
    return NextResponse.json({ success: false, error: "Fehler" }, { status: 500 });
  }
}

