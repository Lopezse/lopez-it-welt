// =====================================================
// ADMIN PORTAL CUSTOMERS API
// =====================================================
// GET /api/admin/customers/portal - Liste aller Portal-Kunden
// POST /api/admin/customers/portal - Neuen Portal-Kunden anlegen
// =====================================================

import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/lib/database";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { hash } from "argon2";

// -----------------------------------------------------
// TODO: Admin-Auth/RBAC - Security-Phase
// -----------------------------------------------------
// Hier muss in der Security-Phase folgendes ergänzt werden:
// 1. Session-Validierung: await validateAdminSession(request)
// 2. RBAC-Check: requirePermission('customers.portal.view')
// 3. Audit-Logging: logAdminAction('PORTAL_CUSTOMERS_LIST', userId)
// -----------------------------------------------------

// GET - Alle Portal-Kunden abrufen
export async function GET(request: NextRequest) {
  try {
    // TODO: [SECURITY-PHASE] Admin-Auth-Check
    // const session = await validateAdminSession(request);
    // if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // await requirePermission(session.userId, 'customers.portal.view');

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const verified = searchParams.get("verified");
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);
    const sortBy = searchParams.get("sort_by") || "created_at";
    const sortOrder = searchParams.get("sort_order") || "DESC";

    const pool = await getConnection();

    // Basis-Query mit Aggregationen
    let whereClause = "1=1";
    const params: (string | number)[] = [];

    if (status && status !== "all") {
      whereClause += " AND c.status = ?";
      params.push(status);
    }

    if (verified === "true") {
      whereClause += " AND c.email_verified = 1";
    } else if (verified === "false") {
      whereClause += " AND c.email_verified = 0";
    }

    if (search) {
      whereClause +=
        " AND (c.email LIKE ? OR c.first_name LIKE ? OR c.last_name LIKE ? OR c.company_name LIKE ?)";
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    // Validierung sortBy
    const allowedSortFields = [
      "created_at",
      "email",
      "last_login_at",
      "status",
      "company_name",
    ];
    const safeSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : "created_at";
    const safeSortOrder = sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC";

    // Kunden mit Aggregationen laden
    const [customers] = await pool.execute<RowDataPacket[]>(
      `
      SELECT 
        c.id,
        c.email,
        c.first_name,
        c.last_name,
        c.company_name,
        c.phone,
        c.status,
        c.email_verified,
        c.two_factor_enabled,
        c.onboarding_completed,
        c.created_at,
        c.last_login_at,
        COUNT(DISTINCT p.id) as project_count,
        COUNT(DISTINCT i.id) as invoice_count,
        COUNT(DISTINCT t.id) as ticket_count,
        COALESCE(SUM(CASE WHEN i.status = 'paid' THEN i.gross_amount ELSE 0 END), 0) as total_revenue
      FROM lopez_customers c
      LEFT JOIN lopez_customer_projects p ON c.id = p.customer_id
      LEFT JOIN lopez_customer_invoices i ON c.id = i.customer_id
      LEFT JOIN lopez_customer_tickets t ON c.id = t.customer_id
      WHERE ${whereClause}
      GROUP BY c.id
      ORDER BY c.${safeSortBy} ${safeSortOrder}
      LIMIT ? OFFSET ?
    `,
      [...params, limit, offset]
    );

    // Gesamt-Anzahl
    const [countResult] = await pool.execute<RowDataPacket[]>(
      `
      SELECT COUNT(*) as total
      FROM lopez_customers c
      WHERE ${whereClause}
    `,
      params
    );

    // Statistiken
    const [stats] = await pool.execute<RowDataPacket[]>(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'suspended' THEN 1 ELSE 0 END) as suspended,
        SUM(CASE WHEN email_verified = 1 THEN 1 ELSE 0 END) as verified,
        SUM(CASE WHEN two_factor_enabled = 1 THEN 1 ELSE 0 END) as with_2fa,
        SUM(CASE WHEN onboarding_completed = 1 THEN 1 ELSE 0 END) as onboarded
      FROM lopez_customers
      WHERE status != 'deleted'
    `);

    // TODO: [SECURITY-PHASE] Audit-Log
    // await logAdminAction('PORTAL_CUSTOMERS_LIST', session.userId, { filters: { status, search } });

    return NextResponse.json({
      success: true,
      data: customers,
      total: countResult[0]?.total || 0,
      stats: stats[0] || {},
      pagination: {
        limit,
        offset,
        has_more: (countResult[0]?.total || 0) > offset + limit,
      },
    });
  } catch (error) {
    console.error("❌ Admin Portal Customers GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Laden der Portal-Kunden" },
      { status: 500 }
    );
  }
}

// POST - Neuen Portal-Kunden anlegen (Admin-Modus)
export async function POST(request: NextRequest) {
  try {
    // TODO: [SECURITY-PHASE] Admin-Auth-Check
    // const session = await validateAdminSession(request);
    // if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // await requirePermission(session.userId, 'customers.portal.create');

    const body = await request.json();

    // Validierung
    if (!body.email) {
      return NextResponse.json(
        { success: false, error: "E-Mail ist erforderlich" },
        { status: 400 }
      );
    }

    // E-Mail-Format prüfen
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, error: "Ungültiges E-Mail-Format" },
        { status: 400 }
      );
    }

    const pool = await getConnection();

    // Prüfen ob E-Mail bereits existiert
    const [existing] = await pool.execute<RowDataPacket[]>(
      "SELECT id FROM lopez_customers WHERE email = ?",
      [body.email.toLowerCase()]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { success: false, error: "E-Mail-Adresse bereits registriert" },
        { status: 409 }
      );
    }

    // Temporäres Passwort generieren (für Admin-erstellte Accounts)
    const tempPassword = Math.random().toString(36).slice(-10);
    const passwordHash = await hash(tempPassword);

    // Kunden anlegen
    const [result] = await pool.execute<ResultSetHeader>(
      `
      INSERT INTO lopez_customers (
        email,
        password_hash,
        first_name,
        last_name,
        company_name,
        phone,
        street,
        city,
        postal_code,
        country,
        status,
        email_verified,
        dsgvo_consent,
        dsgvo_consent_at,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `,
      [
        body.email.toLowerCase(),
        passwordHash,
        body.first_name || null,
        body.last_name || null,
        body.company_name || null,
        body.phone || null,
        body.street || null,
        body.city || null,
        body.postal_code || null,
        body.country || "DE",
        body.status || "pending",
        body.email_verified ? 1 : 0,
        body.dsgvo_consent ? 1 : 0,
      ]
    );

    const customerId = result.insertId;

    // TODO: [SECURITY-PHASE] Audit-Log
    // await logAdminAction('PORTAL_CUSTOMER_CREATED', session.userId, {
    //   customerId,
    //   email: body.email
    // });

    // Optional: Willkommens-E-Mail senden
    // await sendWelcomeEmail(body.email, tempPassword);

    return NextResponse.json({
      success: true,
      message: "Portal-Kunde erfolgreich angelegt",
      data: {
        id: customerId,
        email: body.email.toLowerCase(),
        temp_password: tempPassword, // Nur einmalig anzeigen!
        status: body.status || "pending",
      },
    });
  } catch (error) {
    console.error("❌ Admin Portal Customers POST Error:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Anlegen des Portal-Kunden" },
      { status: 500 }
    );
  }
}
