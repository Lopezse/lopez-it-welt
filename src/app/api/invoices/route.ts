/**
 * GET /api/invoices
 * POST /api/invoices
 * Rechnungen verwalten (GoBD / §14 UStG)
 */

import { createConnection } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  let connection: any = null;

  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get("customer_id");
    const projectId = searchParams.get("project_id");
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    try {
      connection = await createConnection();
    } catch (dbError) {
      console.error("❌ DB-Verbindungsfehler (invoices):", dbError);
      // Fallback: Leere Liste zurückgeben statt HTTP 500
      return NextResponse.json(
        {
          success: true,
          data: {
            invoices: [],
            pagination: {
              page,
              limit,
              total: 0,
              pages: 0,
            },
          },
        },
        {
          headers: { "Content-Type": "application/json; charset=utf-8" },
        },
      );
    }

    let query = `
      SELECT i.*, 
             c.company_name, c.vorname, c.nachname, c.email as customer_email,
             p.project_name, p.project_code
      FROM lopez_invoices i
      LEFT JOIN lopez_customers c ON i.customer_id = c.id
      LEFT JOIN lopez_projects p ON i.project_id = p.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (customerId) {
      query += " AND i.customer_id = ?";
      params.push(customerId);
    }

    if (projectId) {
      query += " AND i.project_id = ?";
      params.push(projectId);
    }

    if (status) {
      query += " AND i.status = ?";
      params.push(status);
    }

    query += " ORDER BY i.issue_date DESC, i.created_at DESC LIMIT ? OFFSET ?";
    params.push(limit, (page - 1) * limit);

    let rows: any[] = [];
    let total = 0;

    try {
      const [queryRows] = await connection.execute(query, params);
      rows = Array.isArray(queryRows) ? queryRows : [];

      // Gesamtanzahl
      let countQuery = "SELECT COUNT(*) as total FROM lopez_invoices WHERE 1=1";
      const countParams: any[] = [];

      if (customerId) {
        countQuery += " AND customer_id = ?";
        countParams.push(customerId);
      }

      if (projectId) {
        countQuery += " AND project_id = ?";
        countParams.push(projectId);
      }

      if (status) {
        countQuery += " AND status = ?";
        countParams.push(status);
      }

      const [countRows] = await connection.execute(countQuery, countParams);
      total = Array.isArray(countRows) && countRows.length > 0 ? (countRows[0] as any).total : 0;
    } catch (queryError) {
      console.error("❌ SQL-Query-Fehler (invoices):", queryError);
      // Fallback: Leere Liste zurückgeben statt HTTP 500
      rows = [];
      total = 0;
    } finally {
      if (connection) {
        try {
          await connection.end();
        } catch {}
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          invoices: Array.isArray(rows) ? rows : [],
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
        },
      },
      {
        headers: { "Content-Type": "application/json; charset=utf-8" },
      },
    );
  } catch (error) {
    console.error("❌ Invoices API Fehler:", error);
    if (connection) {
      try {
        await connection.end();
      } catch {}
    }
    // Fallback: Leere Liste zurückgeben statt HTTP 500
    return NextResponse.json(
      {
        success: true,
        data: {
          invoices: [],
          pagination: {
            page: 1,
            limit: 50,
            total: 0,
            pages: 0,
          },
        },
      },
      {
        headers: { "Content-Type": "application/json; charset=utf-8" },
      },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      invoice_number,
      customer_id,
      project_id,
      order_id,
      issue_date,
      service_date,
      payment_terms,
      currency = "EUR",
      items,
      tax_rate = 19.0,
      created_by,
    } = body;

    // Validierung (§14 UStG)
    if (
      !invoice_number ||
      !customer_id ||
      !issue_date ||
      !service_date ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Pflichtfelder: invoice_number, customer_id, issue_date, service_date, items (Array mit Positionen)",
        },
        { status: 400 },
      );
    }

    const connection = await createConnection();

    // Summen berechnen
    let netAmount = 0;
    for (const item of items) {
      const lineTotal = parseFloat(item.qty || 0) * parseFloat(item.unit_price || 0);
      netAmount += lineTotal;
    }
    const taxAmount = netAmount * (tax_rate / 100);
    const grossAmount = netAmount + taxAmount;

    // Rechnung erstellen
    const [result] = await connection.execute(
      `INSERT INTO lopez_invoices 
       (invoice_number, customer_id, project_id, order_id, issue_date, service_date, payment_terms, currency, net_amount, tax_rate, tax_amount, gross_amount, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        invoice_number,
        customer_id,
        project_id || null,
        order_id || null,
        issue_date,
        service_date,
        payment_terms || "Zahlbar innerhalb 14 Tage ohne Abzug",
        currency,
        netAmount,
        tax_rate,
        taxAmount,
        grossAmount,
        created_by,
      ],
    );

    const invoiceId = (result as any).insertId;

    // Positionen einfügen
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const lineTotal = parseFloat(item.qty || 0) * parseFloat(item.unit_price || 0);

      await connection.execute(
        `INSERT INTO lopez_invoice_items 
         (invoice_id, pos, item_text, qty, unit, unit_price, net_line)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          invoiceId,
          i + 1,
          item.item_text,
          item.qty,
          item.unit || "Stk",
          item.unit_price,
          lineTotal,
        ],
      );
    }

    // Audit-Log
    await connection.execute(
      `INSERT INTO lopez_audit_logs (user_id, action, ref_table, ref_id, notes)
       VALUES (?, 'INVOICE_CREATE', 'lopez_invoices', ?, ?)`,
      [
        created_by,
        invoiceId,
        `Rechnung erstellt: ${invoice_number} (Netto: ${netAmount.toFixed(2)} EUR, Brutto: ${grossAmount.toFixed(2)} EUR)`,
      ],
    );

    await connection.end();

    return NextResponse.json(
      {
        success: true,
        data: {
          id: invoiceId,
          invoice_number,
          net_amount: netAmount,
          tax_amount: taxAmount,
          gross_amount: grossAmount,
          message: "Rechnung erfolgreich erstellt",
        },
      },
      {
        headers: { "Content-Type": "application/json; charset=utf-8" },
      },
    );
  } catch (error) {
    console.error("❌ Invoices API Fehler:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Erstellen der Rechnung" },
      { status: 500 },
    );
  }
}
