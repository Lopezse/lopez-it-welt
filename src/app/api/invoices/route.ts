/**
 * GET /api/invoices
 * POST /api/invoices
 * Rechnungen verwalten (GoBD / §14 UStG)
 */

import { createConnection } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { calculateInvoiceHash } from "@/lib/invoice-hash";

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
      return NextResponse.json(
        {
          success: true,
          data: {
            invoices: [],
            pagination: { page, limit, total: 0, pages: 0 },
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
          pagination: { page, limit, total, pages: Math.ceil(total / limit) },
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
    return NextResponse.json(
      {
        success: true,
        data: {
          invoices: [],
          pagination: { page: 1, limit: 50, total: 0, pages: 0 },
        },
      },
      {
        headers: { "Content-Type": "application/json; charset=utf-8" },
      },
    );
  }
}

export async function POST(request: NextRequest) {
  let connection: any = null;

  try {
    console.log("📥 POST /api/invoices - Start");
    
    // Body parsen
    let body: any = {};
    try {
      body = await request.json();
      console.log("✅ Body geparst:", JSON.stringify(body));
    } catch (parseError: any) {
      console.error("❌ JSON-Parse-Fehler:", parseError);
      return NextResponse.json(
        {
          success: false,
          error: "Ungültiges JSON im Request-Body",
        },
        {
          status: 400,
          headers: { "Content-Type": "application/json; charset=utf-8" },
        },
      );
    }

    const { debtor, issued_at, total_gross } = body;

    console.log("🔌 Versuche DB-Verbindung...");
    // DB-Verbindung
    try {
      connection = await createConnection();
      console.log("✅ DB-Verbindung erfolgreich");
    } catch (dbError: any) {
      console.error("❌ DB-Verbindungsfehler:", dbError);
      return NextResponse.json(
        {
          success: false,
          error: `Datenbankverbindung fehlgeschlagen: ${dbError?.message || String(dbError)}`,
        },
        {
          status: 500,
          headers: { "Content-Type": "application/json; charset=utf-8" },
        },
      );
    }

    console.log("👥 Suche Kunde...");
    // Kunde finden
    let customerId = "system";
    try {
      const [customers] = await connection.execute("SELECT id FROM lopez_customers LIMIT 1");
      if (Array.isArray(customers) && customers.length > 0) {
        customerId = String(customers[0].id);
        console.log("✅ Kunde gefunden:", customerId);
      } else {
        console.log("⚠️ Keine Kunden gefunden, verwende 'system'");
      }
    } catch (e: any) {
      console.error("❌ Customer query failed:", e?.message);
      // Weiter mit "system" als Fallback
    }

    console.log("🔢 Generiere Rechnungsnummer...");
    // Rechnungsnummer: YYYYMMDD-XXX (z.B. 20251101-001)
    const issueDate = issued_at || new Date().toISOString().slice(0, 10);
    const dateStr = issueDate.replace(/-/g, ""); // YYYYMMDD (z.B. 20251101)
    let invoiceNumber = `${dateStr}-001`;
    
    try {
      // Nächste Nummer für dieses Datum ermitteln
      const [maxRows] = await connection.execute(
        `SELECT MAX(CAST(SUBSTRING(invoice_number, 10) AS UNSIGNED)) as max_num 
         FROM lopez_invoices 
         WHERE invoice_number LIKE ?`,
        [`${dateStr}-%`],
      );
      if (Array.isArray(maxRows) && maxRows.length > 0 && maxRows[0].max_num) {
        const nextNum = (maxRows[0] as any).max_num + 1;
        invoiceNumber = `${dateStr}-${String(nextNum).padStart(3, "0")}`;
        console.log("✅ Rechnungsnummer:", invoiceNumber);
      } else {
        console.log("✅ Rechnungsnummer (erste):", invoiceNumber);
      }
    } catch (e: any) {
      console.error("⚠️ Invoice number query failed:", e?.message);
      // Weiter mit Standard-Nummer
    }

    console.log("💰 Berechne Werte...");
    // Werte berechnen
    const netAmount = total_gross ? total_gross / 1.19 : 0;
    const taxAmount = netAmount * 0.19;
    const grossAmount = netAmount + taxAmount;
    console.log("✅ Werte: Netto=", netAmount, "Steuer=", taxAmount, "Brutto=", grossAmount);

    console.log("📝 Erstelle Rechnung in DB...");
    
    // Hash-Berechnung (GoBD-konform)
    const issueDate = issued_at || new Date().toISOString().slice(0, 10);
    const hashData = {
      invoice_date: issueDate,
      amount: grossAmount.toFixed(2),
      recipient: customerId,
      status: "draft",
    };
    const hashSha256 = calculateInvoiceHash(hashData);
    console.log("✅ Hash berechnet:", hashSha256.substring(0, 16) + "...");
    
    // Rechnung einfügen
    const [result] = await connection.execute(
      `INSERT INTO lopez_invoices 
       (invoice_number, customer_id, issue_date, service_date, net_amount, tax_rate, tax_amount, gross_amount, status, hash_sha256, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'draft', ?, 'system')`,
      [
        invoiceNumber,
        customerId,
        issueDate,
        issueDate,
        netAmount,
        19.0,
        taxAmount,
        grossAmount,
        hashSha256,
      ],
    );

    const invoiceId = (result as any).insertId;
    console.log("✅ Rechnung erstellt, ID:", invoiceId);

    // Item einfügen
    if (invoiceId) {
      console.log("📦 Füge Position ein...");
      try {
        await connection.execute(
          `INSERT INTO lopez_invoice_items (invoice_id, pos, item_text, qty, unit, unit_price, net_line)
           VALUES (?, 1, ?, 1, 'Stk', ?, ?)`,
          [invoiceId, debtor || "Position 1", netAmount, netAmount],
        );
        console.log("✅ Position eingefügt");
      } catch (e: any) {
        console.error("⚠️ Item insert failed:", e?.message);
        // Nicht blockierend
      }
    }

    if (connection) {
      await connection.end();
      console.log("🔌 DB-Verbindung geschlossen");
    }

    console.log("✅ POST /api/invoices - Erfolgreich!");
    return NextResponse.json(
      {
        success: true,
        data: {
          id: invoiceId,
          invoice_number: invoiceNumber,
          status: "draft",
          net_amount: netAmount,
          tax_amount: taxAmount,
          gross_amount: grossAmount,
        },
      },
      {
        status: 201,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      },
    );
  } catch (error: any) {
    console.error("❌ POST /api/invoices - FEHLER!");
    console.error("❌ Error:", error);
    console.error("❌ Error message:", error?.message);
    console.error("❌ Error code:", error?.code);
    console.error("❌ Error stack:", error?.stack?.split("\n").slice(0, 10).join("\n"));

    if (connection) {
      try {
        await connection.end();
        console.log("🔌 DB-Verbindung geschlossen");
      } catch (e: any) {
        console.error("❌ Fehler beim Schließen der DB:", e?.message);
      }
    }

    // WICHTIG: Stelle sicher, dass wir IMMER JSON zurückgeben
    try {
      return NextResponse.json(
        {
          success: false,
          error: error?.message || "Internal Server Error",
          code: error?.code,
          details: process.env.NODE_ENV === "development" ? {
            name: error?.name,
            message: error?.message,
            code: error?.code,
            stack: error?.stack?.split("\n").slice(0, 5).join("\n"),
          } : undefined,
        },
        {
          status: 500,
          headers: { "Content-Type": "application/json; charset=utf-8" },
        },
      );
    } catch (jsonError: any) {
      console.error("❌ FEHLER beim Erstellen der JSON-Response:", jsonError);
      // Fallback: Plain Text (sollte nicht passieren, aber zur Sicherheit)
      return new NextResponse(
        `Internal Server Error: ${error?.message || "Unbekannter Fehler"}`,
        {
          status: 500,
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        },
      );
    }
  }
}

// Export dynamic für Next.js
export const dynamic = "force-dynamic";

    // Hash-Berechnung (GoBD-konform)
    const issueDate = issued_at || new Date().toISOString().slice(0, 10);
    const hashData = {
      invoice_date: issueDate,
      amount: grossAmount.toFixed(2),
      recipient: customerId,
      status: "draft",
    };
    const hashSha256 = calculateInvoiceHash(hashData);
    console.log("✅ Hash berechnet:", hashSha256.substring(0, 16) + "...");
    
    // Rechnung einfügen
    const [result] = await connection.execute(
      `INSERT INTO lopez_invoices 
       (invoice_number, customer_id, issue_date, service_date, net_amount, tax_rate, tax_amount, gross_amount, status, hash_sha256, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'draft', ?, 'system')`,
      [
        invoiceNumber,
        customerId,
        issueDate,
        issueDate,
        netAmount,
        19.0,
        taxAmount,
        grossAmount,
        hashSha256,
      ],
    );

    const invoiceId = (result as any).insertId;
    console.log("✅ Rechnung erstellt, ID:", invoiceId);

    // Item einfügen
    if (invoiceId) {
      console.log("📦 Füge Position ein...");
      try {
        await connection.execute(
          `INSERT INTO lopez_invoice_items (invoice_id, pos, item_text, qty, unit, unit_price, net_line)
           VALUES (?, 1, ?, 1, 'Stk', ?, ?)`,
          [invoiceId, debtor || "Position 1", netAmount, netAmount],
        );
        console.log("✅ Position eingefügt");
      } catch (e: any) {
        console.error("⚠️ Item insert failed:", e?.message);
        // Nicht blockierend
      }
    }

    if (connection) {
      await connection.end();
      console.log("🔌 DB-Verbindung geschlossen");
    }

    console.log("✅ POST /api/invoices - Erfolgreich!");
    return NextResponse.json(
      {
        success: true,
        data: {
          id: invoiceId,
          invoice_number: invoiceNumber,
          status: "draft",
          net_amount: netAmount,
          tax_amount: taxAmount,
          gross_amount: grossAmount,
        },
      },
      {
        status: 201,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      },
    );
  } catch (error: any) {
    console.error("❌ POST /api/invoices - FEHLER!");
    console.error("❌ Error:", error);
    console.error("❌ Error message:", error?.message);
    console.error("❌ Error code:", error?.code);
    console.error("❌ Error stack:", error?.stack?.split("\n").slice(0, 10).join("\n"));

    if (connection) {
      try {
        await connection.end();
        console.log("🔌 DB-Verbindung geschlossen");
      } catch (e: any) {
        console.error("❌ Fehler beim Schließen der DB:", e?.message);
      }
    }

    // WICHTIG: Stelle sicher, dass wir IMMER JSON zurückgeben
    try {
      return NextResponse.json(
        {
          success: false,
          error: error?.message || "Internal Server Error",
          code: error?.code,
          details: process.env.NODE_ENV === "development" ? {
            name: error?.name,
            message: error?.message,
            code: error?.code,
            stack: error?.stack?.split("\n").slice(0, 5).join("\n"),
          } : undefined,
        },
        {
          status: 500,
          headers: { "Content-Type": "application/json; charset=utf-8" },
        },
      );
    } catch (jsonError: any) {
      console.error("❌ FEHLER beim Erstellen der JSON-Response:", jsonError);
      // Fallback: Plain Text (sollte nicht passieren, aber zur Sicherheit)
      return new NextResponse(
        `Internal Server Error: ${error?.message || "Unbekannter Fehler"}`,
        {
          status: 500,
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        },
      );
    }
  }
}

// Export dynamic für Next.js
export const dynamic = "force-dynamic";
