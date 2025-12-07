// =====================================================
// ADMIN INVOICES API
// =====================================================
// GET /api/admin/invoices - Liste aller Rechnungen
// POST /api/admin/invoices - Neue Rechnung erstellen
// =====================================================

import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/lib/database";
import { InvoiceService, CreateInvoiceInput } from "@/lib/customer/invoice-service";
import { RowDataPacket } from "mysql2/promise";

// TODO: Admin-Auth-Check hinzufügen (Phase 1.6)
// Für jetzt: Basis-Implementierung

// GET - Alle Rechnungen (mit Filter)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customer_id');
    const status = searchParams.get('status');
    const year = searchParams.get('year');
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    const pool = await getConnection();
    
    let whereClause = '1=1';
    const params: (string | number)[] = [];

    if (customerId) {
      whereClause += ' AND i.customer_id = ?';
      params.push(parseInt(customerId, 10));
    }
    if (status) {
      whereClause += ' AND i.status = ?';
      params.push(status);
    }
    if (year) {
      whereClause += ' AND YEAR(i.invoice_date) = ?';
      params.push(parseInt(year, 10));
    }

    // Rechnungen mit Kundennamen
    const [invoices] = await pool.execute<RowDataPacket[]>(`
      SELECT 
        i.*,
        c.email as customer_email,
        c.company_name as customer_company,
        CONCAT(c.first_name, ' ', c.last_name) as customer_name,
        p.name as project_name
      FROM lopez_customer_invoices i
      LEFT JOIN lopez_customers c ON i.customer_id = c.id
      LEFT JOIN lopez_customer_projects p ON i.project_id = p.id
      WHERE ${whereClause}
      ORDER BY i.invoice_date DESC
      LIMIT ? OFFSET ?
    `, [...params, limit, offset]);

    // Gesamt-Anzahl
    const [countResult] = await pool.execute<RowDataPacket[]>(`
      SELECT COUNT(*) as total
      FROM lopez_customer_invoices i
      WHERE ${whereClause}
    `, params);

    // Statistiken
    const [stats] = await pool.execute<RowDataPacket[]>(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as draft,
        SUM(CASE WHEN status = 'sent' THEN 1 ELSE 0 END) as sent,
        SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) as paid,
        SUM(CASE WHEN status = 'overdue' THEN 1 ELSE 0 END) as overdue,
        COALESCE(SUM(CASE WHEN status = 'paid' THEN gross_amount ELSE 0 END), 0) as total_paid,
        COALESCE(SUM(CASE WHEN status IN ('sent', 'overdue') THEN gross_amount ELSE 0 END), 0) as total_open
      FROM lopez_customer_invoices
    `);

    // Line items parsen
    const parsed = invoices.map(inv => ({
      ...inv,
      line_items: typeof inv.line_items === 'string' ? JSON.parse(inv.line_items) : inv.line_items
    }));

    return NextResponse.json({
      success: true,
      data: parsed,
      total: countResult[0]?.total || 0,
      stats: stats[0] || {},
      pagination: {
        limit,
        offset,
        has_more: (countResult[0]?.total || 0) > offset + limit
      }
    });

  } catch (error) {
    console.error("❌ Admin Invoices GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Laden" },
      { status: 500 }
    );
  }
}

// POST - Neue Rechnung erstellen
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validierung
    if (!body.customer_id) {
      return NextResponse.json(
        { success: false, error: "customer_id ist erforderlich" },
        { status: 400 }
      );
    }

    if (!body.line_items || !Array.isArray(body.line_items) || body.line_items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Mindestens eine Position erforderlich" },
        { status: 400 }
      );
    }

    if (!body.invoice_date || !body.due_date) {
      return NextResponse.json(
        { success: false, error: "Rechnungsdatum und Fälligkeitsdatum erforderlich" },
        { status: 400 }
      );
    }

    // Line Items validieren und total berechnen
    const lineItems = body.line_items.map((item: { description: string; quantity: number; unit_price: number }) => ({
      description: item.description,
      quantity: Number(item.quantity) || 1,
      unit_price: Number(item.unit_price) || 0,
      total: (Number(item.quantity) || 1) * (Number(item.unit_price) || 0)
    }));

    const input: CreateInvoiceInput = {
      customer_id: body.customer_id,
      project_id: body.project_id,
      line_items: lineItems,
      invoice_date: body.invoice_date,
      due_date: body.due_date,
      notes: body.notes,
      internal_notes: body.internal_notes,
      tax_rate: body.tax_rate
    };

    // TODO: Admin-User-ID aus Session holen (Phase 1.6)
    const adminUserId = 1; // Placeholder

    const result = await InvoiceService.create(input, adminUserId);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Rechnung erstellt",
      data: result.invoice
    });

  } catch (error) {
    console.error("❌ Admin Invoices POST Error:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Erstellen" },
      { status: 500 }
    );
  }
}







