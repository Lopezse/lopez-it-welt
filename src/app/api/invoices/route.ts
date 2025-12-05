// =====================================================
// RECHNUNGEN API - LOPEZ IT WELT (ENTERPRISE++)
// =====================================================
// Phase 3: Admin Foundation - Rechnungsverwaltung
// =====================================================

import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/lib/database";
import { SessionSecurityService } from "@/lib/session-security";
import { AuditService } from "@/lib/audit-service";

// GET - Alle Rechnungen laden
export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get("adm_session")?.value;
    const jwtToken = request.cookies.get("adm_token")?.value;
    const clientIp = request.headers.get("x-forwarded-for") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    const validation = await SessionSecurityService.validateSession(
      sessionToken, jwtToken, clientIp, userAgent
    );

    if (!validation.valid) {
      return NextResponse.json({ success: false, message: "Nicht autorisiert" }, { status: 401 });
    }

    // Permission: admin.finance.invoices.view
    if (!validation.session?.permissions.includes("admin.finance.invoices.view") && 
        !validation.session?.roles.includes("Super Admin")) {
      return NextResponse.json({ success: false, message: "Keine Berechtigung" }, { status: 403 });
    }

    const pool = await getConnection();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const customerId = searchParams.get("customer_id");
    const projectId = searchParams.get("project_id");
    const search = searchParams.get("search");
    const dateFrom = searchParams.get("date_from");
    const dateTo = searchParams.get("date_to");

    let query = `
      SELECT i.*, 
             c.firmenname as company_name, 
             c.vorname, c.nachname, c.email as customer_email,
             p.project_name, p.project_code
      FROM lopez_invoices i
      LEFT JOIN lopez_customers c ON i.customer_id = c.id
      LEFT JOIN lopez_projects p ON i.project_id = p.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (status) {
      query += " AND i.status = ?";
      params.push(status);
    }

    if (customerId) {
      query += " AND i.customer_id = ?";
      params.push(customerId);
    }

    if (projectId) {
      query += " AND i.project_id = ?";
      params.push(projectId);
    }

    if (search) {
      query += " AND (i.invoice_number LIKE ? OR c.firmenname LIKE ? OR c.vorname LIKE ? OR c.nachname LIKE ?)";
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    if (dateFrom) {
      query += " AND i.issue_date >= ?";
      params.push(dateFrom);
    }

    if (dateTo) {
      query += " AND i.issue_date <= ?";
      params.push(dateTo);
    }

    query += " ORDER BY i.issue_date DESC, i.invoice_number DESC";

    const [invoices] = await pool.execute(query, params);

    // Statistiken berechnen
    const [stats] = await pool.execute(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'paid' THEN gross_amount ELSE 0 END) as total_paid,
        SUM(CASE WHEN status = 'sent' THEN gross_amount ELSE 0 END) as total_open,
        SUM(CASE WHEN status = 'overdue' THEN gross_amount ELSE 0 END) as total_overdue
      FROM lopez_invoices
      WHERE status NOT IN ('cancelled', 'storno')
    `);

    return NextResponse.json({
      success: true,
      data: {
        invoices,
        total: (invoices as any[]).length,
        stats: (stats as any[])[0],
      },
    });
  } catch (error) {
    console.error("Rechnungen API Fehler:", error);
    return NextResponse.json({
      success: false,
      message: "Fehler beim Laden der Rechnungen",
    }, { status: 500 });
  }
}

// POST - Neue Rechnung erstellen
export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get("adm_session")?.value;
    const jwtToken = request.cookies.get("adm_token")?.value;
    const clientIp = request.headers.get("x-forwarded-for") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    const validation = await SessionSecurityService.validateSession(
      sessionToken, jwtToken, clientIp, userAgent
    );

    if (!validation.valid) {
      return NextResponse.json({ success: false, message: "Nicht autorisiert" }, { status: 401 });
    }

    // Permission: admin.finance.invoices.create
    if (!validation.session?.permissions.includes("admin.finance.invoices.create") && 
        !validation.session?.roles.includes("Super Admin")) {
      return NextResponse.json({ success: false, message: "Keine Berechtigung" }, { status: 403 });
    }

    const body = await request.json();
    const {
      customer_id,
      project_id,
      issue_date,
      due_date,
      items = [],
      notes,
      payment_terms,
      tax_rate = 19.00,
      // Legacy-Support
      debtor,
      issued_at,
      total_gross,
    } = body;

    const pool = await getConnection();

    // Legacy-Support: Wenn customer_id nicht gesetzt, aber debtor vorhanden
    let finalCustomerId = customer_id;
    if (!finalCustomerId && debtor) {
      // Kunde suchen oder erstellen
      const [existingCustomers] = await pool.execute(
        "SELECT id FROM lopez_customers WHERE firmenname = ? OR CONCAT(vorname, ' ', nachname) = ? LIMIT 1",
        [debtor, debtor]
      );
      
      if ((existingCustomers as any[]).length > 0) {
        finalCustomerId = (existingCustomers as any[])[0].id;
      } else {
        // Demo-Kunde für Legacy-Support
        const [newCustomer] = await pool.execute(
          `INSERT INTO lopez_customers (kundennummer, customer_type, firmenname, status, created_at)
           VALUES (?, 'firma', ?, 'aktiv', NOW())`,
          [`K-LEGACY-${Date.now()}`, debtor]
        );
        finalCustomerId = (newCustomer as any).insertId;
      }
    }

    if (!finalCustomerId) {
      return NextResponse.json({
        success: false,
        message: "Kunde ist erforderlich",
      }, { status: 400 });
    }

    // Rechnungsnummer generieren (RE-YYYY-XXXXX)
    const year = new Date().getFullYear();
    const [countResult] = await pool.execute(
      "SELECT COUNT(*) as count FROM lopez_invoices WHERE YEAR(created_at) = ?",
      [year]
    );
    const count = (countResult as any[])[0]?.count || 0;
    const invoiceNumber = `RE-${year}-${String(count + 1).padStart(5, "0")}`;

    // Beträge berechnen
    let netAmount = 0;
    let taxAmount = 0;
    let grossAmount = 0;

    if (items.length > 0) {
      for (const item of items) {
        const itemNet = (item.qty || item.quantity || 1) * (item.price || item.unit_price || 0);
        const itemTax = itemNet * ((item.vat || item.tax_rate || tax_rate) / 100);
        netAmount += itemNet;
        taxAmount += itemTax;
      }
      grossAmount = netAmount + taxAmount;
    } else if (total_gross) {
      // Legacy: Nur Brutto angegeben
      grossAmount = parseFloat(total_gross);
      netAmount = grossAmount / (1 + tax_rate / 100);
      taxAmount = grossAmount - netAmount;
    }

    // Datum-Handling
    const finalIssueDate = issue_date || issued_at || new Date().toISOString().slice(0, 10);
    const finalDueDate = due_date || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    // Rechnung erstellen
    const [result] = await pool.execute(
      `INSERT INTO lopez_invoices 
       (invoice_number, customer_id, project_id, status, issue_date, due_date,
        net_amount, tax_amount, gross_amount, tax_rate, notes, payment_terms, created_by)
       VALUES (?, ?, ?, 'draft', ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        invoiceNumber,
        finalCustomerId,
        project_id || null,
        finalIssueDate,
        finalDueDate,
        netAmount.toFixed(2),
        taxAmount.toFixed(2),
        grossAmount.toFixed(2),
        tax_rate,
        notes || null,
        payment_terms || "Zahlbar innerhalb von 14 Tagen",
        validation.session?.userId,
      ]
    );

    const invoiceId = (result as any).insertId;

    // Positionen erstellen
    if (items.length > 0) {
      let positionNumber = 1;
      for (const item of items) {
        const quantity = item.qty || item.quantity || 1;
        const unitPrice = item.price || item.unit_price || 0;
        const itemTaxRate = item.vat || item.tax_rate || tax_rate;
        const itemNet = quantity * unitPrice;
        const itemTax = itemNet * (itemTaxRate / 100);
        const itemGross = itemNet + itemTax;

        await pool.execute(
          `INSERT INTO lopez_invoice_items 
           (invoice_id, position_number, description, quantity, unit_price, tax_rate, net_amount, tax_amount, gross_amount)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            invoiceId,
            positionNumber++,
            item.name || item.description || "Position",
            quantity,
            unitPrice.toFixed(2),
            itemTaxRate,
            itemNet.toFixed(2),
            itemTax.toFixed(2),
            itemGross.toFixed(2),
          ]
        );
      }
    }

    // Audit-Log
    await AuditService.logAudit({
      table_name: "lopez_invoices",
      record_id: invoiceId,
      action: "INVOICE_CREATE",
      user_id: validation.session?.userId || 0,
      username: validation.session?.username || "system",
      ip_address: clientIp,
      user_agent: userAgent,
      session_id: sessionToken || "jwt",
      risk_level: "MEDIUM",
      compliance_category: "FINANCE",
      new_values: JSON.stringify({ invoiceNumber, customer_id: finalCustomerId, grossAmount }),
    });

    return NextResponse.json({
      success: true,
      message: "Rechnung erfolgreich erstellt",
      data: {
        id: invoiceId,
        invoice_number: invoiceNumber,
        gross_amount: grossAmount,
      },
    });
  } catch (error) {
    console.error("Rechnung erstellen Fehler:", error);
    return NextResponse.json({
      success: false,
      message: "Fehler beim Erstellen der Rechnung",
      error: error instanceof Error ? error.message : "Unbekannter Fehler",
    }, { status: 500 });
  }
}
