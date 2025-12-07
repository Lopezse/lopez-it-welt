// =====================================================
// ADMIN PORTAL CUSTOMER DETAIL API
// =====================================================
// GET /api/admin/customers/portal/[id] - Einzelner Portal-Kunde
// PATCH /api/admin/customers/portal/[id] - Kunde aktualisieren
// DELETE /api/admin/customers/portal/[id] - Kunde (soft) löschen
// =====================================================

import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/lib/database";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";

// -----------------------------------------------------
// TODO: Admin-Auth/RBAC - Security-Phase
// -----------------------------------------------------
// 1. Session-Validierung: await validateAdminSession(request)
// 2. RBAC-Check: requirePermission('customers.portal.view/edit/delete')
// 3. Audit-Logging: logAdminAction('PORTAL_CUSTOMER_*', userId)
// -----------------------------------------------------

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Einzelnen Portal-Kunden laden
export async function GET(request: NextRequest, context: RouteParams) {
  try {
    // TODO: [SECURITY-PHASE] Admin-Auth-Check
    // const session = await validateAdminSession(request);
    // if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // await requirePermission(session.userId, 'customers.portal.view');

    const { id } = await context.params;
    const customerId = parseInt(id, 10);

    if (isNaN(customerId)) {
      return NextResponse.json(
        { success: false, error: "Ungültige Kunden-ID" },
        { status: 400 }
      );
    }

    const pool = await getConnection();

    // Kunde mit allen Details laden
    const [customers] = await pool.execute<RowDataPacket[]>(
      `
      SELECT 
        c.*,
        COUNT(DISTINCT p.id) as project_count,
        COUNT(DISTINCT i.id) as invoice_count,
        COUNT(DISTINCT t.id) as ticket_count,
        COALESCE(SUM(CASE WHEN i.status = 'paid' THEN i.gross_amount ELSE 0 END), 0) as total_revenue,
        COALESCE(SUM(CASE WHEN i.status IN ('sent', 'overdue') THEN i.gross_amount ELSE 0 END), 0) as open_balance
      FROM lopez_customers c
      LEFT JOIN lopez_customer_projects p ON c.id = p.customer_id
      LEFT JOIN lopez_customer_invoices i ON c.id = i.customer_id
      LEFT JOIN lopez_customer_tickets t ON c.id = t.customer_id
      WHERE c.id = ?
      GROUP BY c.id
    `,
      [customerId]
    );

    if (customers.length === 0) {
      return NextResponse.json(
        { success: false, error: "Kunde nicht gefunden" },
        { status: 404 }
      );
    }

    const customer = customers[0];

    // Letzte Aktivitäten laden
    const [recentSessions] = await pool.execute<RowDataPacket[]>(
      `
      SELECT ip_address, user_agent, created_at, expires_at
      FROM lopez_customer_sessions
      WHERE customer_id = ?
      ORDER BY created_at DESC
      LIMIT 5
    `,
      [customerId]
    );

    // AI-Usage laden
    const [aiUsage] = await pool.execute<RowDataPacket[]>(
      `
      SELECT 
        service,
        COUNT(*) as usage_count,
        SUM(tokens_input + tokens_output) as total_tokens,
        SUM(cost) as total_cost
      FROM lopez_customer_ai_usage
      WHERE customer_id = ?
      GROUP BY service
    `,
      [customerId]
    );

    // Passwort-Hash aus Response entfernen
    const {
      password_hash: _password,
      two_factor_secret: _secret,
      ...safeCustomer
    } = customer;

    return NextResponse.json({
      success: true,
      data: {
        ...safeCustomer,
        recent_sessions: recentSessions,
        ai_usage: aiUsage,
        has_2fa_secret: !!_secret,
      },
    });
  } catch (error) {
    console.error("❌ Admin Portal Customer GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Laden des Kunden" },
      { status: 500 }
    );
  }
}

// PATCH - Portal-Kunden aktualisieren
export async function PATCH(request: NextRequest, context: RouteParams) {
  try {
    // TODO: [SECURITY-PHASE] Admin-Auth-Check
    // const session = await validateAdminSession(request);
    // if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // await requirePermission(session.userId, 'customers.portal.edit');

    const { id } = await context.params;
    const customerId = parseInt(id, 10);

    if (isNaN(customerId)) {
      return NextResponse.json(
        { success: false, error: "Ungültige Kunden-ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const pool = await getConnection();

    // Prüfen ob Kunde existiert
    const [existing] = await pool.execute<RowDataPacket[]>(
      "SELECT id, email, status FROM lopez_customers WHERE id = ?",
      [customerId]
    );

    if (existing.length === 0) {
      return NextResponse.json(
        { success: false, error: "Kunde nicht gefunden" },
        { status: 404 }
      );
    }

    // Erlaubte Felder für Update
    const allowedFields = [
      "first_name",
      "last_name",
      "company_name",
      "company_vat_id",
      "phone",
      "street",
      "city",
      "postal_code",
      "country",
      "status",
      "email_verified",
      "marketing_consent",
    ];

    const updates: string[] = [];
    const values: (string | number | boolean)[] = [];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(body[field]);
      }
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { success: false, error: "Keine Änderungen angegeben" },
        { status: 400 }
      );
    }

    // Update durchführen
    await pool.execute<ResultSetHeader>(
      `UPDATE lopez_customers SET ${updates.join(", ")}, updated_at = NOW() WHERE id = ?`,
      [...values, customerId]
    );

    // TODO: [SECURITY-PHASE] Audit-Log
    // await logAdminAction('PORTAL_CUSTOMER_UPDATED', session.userId, {
    //   customerId,
    //   changes: body,
    //   oldStatus: oldData.status,
    //   newStatus: body.status
    // });

    // Aktualisierten Kunden zurückgeben
    const [updated] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM lopez_customers WHERE id = ?",
      [customerId]
    );

    const {
      password_hash: _password,
      two_factor_secret: _secret,
      ...safeCustomer
    } = updated[0];

    return NextResponse.json({
      success: true,
      message: "Kunde erfolgreich aktualisiert",
      data: safeCustomer,
    });
  } catch (error) {
    console.error("❌ Admin Portal Customer PATCH Error:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Aktualisieren" },
      { status: 500 }
    );
  }
}

// DELETE - Portal-Kunden (soft) löschen
export async function DELETE(request: NextRequest, context: RouteParams) {
  try {
    // TODO: [SECURITY-PHASE] Admin-Auth-Check
    // const session = await validateAdminSession(request);
    // if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // await requirePermission(session.userId, 'customers.portal.delete');

    const { id } = await context.params;
    const customerId = parseInt(id, 10);

    if (isNaN(customerId)) {
      return NextResponse.json(
        { success: false, error: "Ungültige Kunden-ID" },
        { status: 400 }
      );
    }

    const pool = await getConnection();

    // Prüfen ob Kunde existiert
    const [existing] = await pool.execute<RowDataPacket[]>(
      "SELECT id, email, status FROM lopez_customers WHERE id = ?",
      [customerId]
    );

    if (existing.length === 0) {
      return NextResponse.json(
        { success: false, error: "Kunde nicht gefunden" },
        { status: 404 }
      );
    }

    // Prüfen ob offene Rechnungen existieren
    const [openInvoices] = await pool.execute<RowDataPacket[]>(
      `SELECT COUNT(*) as count FROM lopez_customer_invoices 
       WHERE customer_id = ? AND status IN ('sent', 'overdue')`,
      [customerId]
    );

    if (openInvoices[0].count > 0) {
      return NextResponse.json(
        { success: false, error: "Kunde hat noch offene Rechnungen" },
        { status: 409 }
      );
    }

    // Soft-Delete: Status auf 'deleted' setzen
    await pool.execute<ResultSetHeader>(
      `UPDATE lopez_customers SET status = 'deleted', updated_at = NOW() WHERE id = ?`,
      [customerId]
    );

    // Sessions löschen
    await pool.execute(
      "DELETE FROM lopez_customer_sessions WHERE customer_id = ?",
      [customerId]
    );

    // TODO: [SECURITY-PHASE] Audit-Log
    // await logAdminAction('PORTAL_CUSTOMER_DELETED', session.userId, {
    //   customerId,
    //   email: existing[0].email
    // });

    return NextResponse.json({
      success: true,
      message: "Kunde erfolgreich gelöscht",
    });
  } catch (error) {
    console.error("❌ Admin Portal Customer DELETE Error:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Löschen" },
      { status: 500 }
    );
  }
}







