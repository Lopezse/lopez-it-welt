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
  let connection: any = null;

  try {
    console.log("📥 POST /api/invoices - Request empfangen");
    
    // Request-Body parsen mit Fehlerbehandlung
    let body: any = {};
    try {
      body = await request.json();
      console.log("✅ Request-Body geparst:", JSON.stringify(body, null, 2));
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
      // Draft-Modus: Optionale Felder
      debtor,
      total_gross,
      issued_at,
    } = body;

    try {
      connection = await createConnection();
    } catch (dbError) {
      console.error("❌ DB-Verbindungsfehler (invoices POST):", dbError);
      return NextResponse.json(
        {
          success: false,
          error: "Datenbankverbindung fehlgeschlagen",
        },
        { status: 500 },
      );
    }

    // Draft-Modus: Automatische Nummernkreis-Generierung (YYYY-####)
    let finalInvoiceNumber = invoice_number;
    if (!finalInvoiceNumber) {
      try {
        // Nummernkreis: Jahresbasiert (YYYY-####)
        const dateStr = issue_date || issued_at || new Date().toISOString().slice(0, 10);
        const year = dateStr.slice(0, 4);

        // Nächste Nummer im Jahr ermitteln (mit Fehlerbehandlung für nicht existierende Tabelle)
        try {
          const [maxRows] = await connection.execute(
            `SELECT MAX(CAST(SUBSTRING(invoice_number, 6) AS UNSIGNED)) as max_num 
             FROM lopez_invoices 
             WHERE invoice_number LIKE ?`,
            [`${year}-%`],
          );

          const maxNum =
            Array.isArray(maxRows) && maxRows.length > 0 ? (maxRows[0] as any).max_num || 0 : 0;
          const nextNum = maxNum + 1;
          finalInvoiceNumber = `${year}-${String(nextNum).padStart(4, "0")}`;
        } catch (sqlError: any) {
          console.error("❌ SQL-Fehler bei Nummernkreis-Generierung:", sqlError);
          // Fallback: Timestamp-basierte Nummer
          finalInvoiceNumber = `${year}-${String(Date.now()).slice(-4)}`;
        }
      } catch (error) {
        console.error("❌ Fehler bei Nummernkreis-Generierung:", error);
        // Fallback: Timestamp-basierte Nummer
        const year = new Date().getFullYear();
        finalInvoiceNumber = `${year}-${String(Date.now()).slice(-4)}`;
      }
    }

    // Draft-Modus: Fallbacks für optionale Felder
    const finalIssueDate = issue_date || issued_at || new Date().toISOString().slice(0, 10);
    const finalServiceDate = service_date || finalIssueDate;

    // customer_id ist NOT NULL in DB - prüfe ob Kunde existiert, sonst verwende ersten Kunden
    let finalCustomerId = customer_id;
    if (!finalCustomerId) {
      try {
        // Versuche ersten vorhandenen Kunden zu finden (ohne Status-Filter, da status NULL sein kann)
        const [customerRows] = await connection.execute("SELECT id FROM lopez_customers LIMIT 1");
        console.log("🔍 Customer Query Result:", JSON.stringify(customerRows, null, 2));
        
        if (Array.isArray(customerRows) && customerRows.length > 0) {
          const customerId = customerRows[0];
          // id kann VARCHAR(36) oder INT sein, immer als String konvertieren
          // MySQL2 gibt das Ergebnis als Objekt zurück: { id: 'system' }
          finalCustomerId = String(customerId.id || customerId.ID || customerId);
          console.log("✅ Customer ID gefunden:", finalCustomerId);
        } else {
          // Kein Kunde vorhanden - Fehler mit hilfreicher Meldung
          console.error("❌ Keine Kunden in der Datenbank gefunden");
          throw new Error(
            "Kein Kunde vorhanden. Bitte zuerst einen Kunden anlegen oder customer_id im Request mitgeben.",
          );
        }
      } catch (customerError: any) {
        console.error("❌ Fehler beim Prüfen des Kunden:", customerError);
        console.error("❌ Customer Error Message:", customerError?.message);
        console.error("❌ Customer Error Code:", customerError?.code);
        console.error("❌ Customer Error Stack:", customerError?.stack);
        // Wenn es bereits ein Error-Objekt ist, re-throw es
        if (customerError instanceof Error && customerError.message.includes("Kein Kunde")) {
          throw customerError;
        }
        // Andernfalls: Fehler mit hilfreicher Meldung
        throw new Error(
          `customer_id erforderlich. Fehler: ${customerError?.message || String(customerError)}`,
        );
      }
    }

    // created_by ist NOT NULL in DB - Fallback auf "system" wenn nicht vorhanden
    const finalCreatedBy = created_by || "system";

    // Draft-Modus: Items aus total_gross generieren, falls keine Items vorhanden
    let finalItems = items;
    if (!finalItems || !Array.isArray(finalItems) || finalItems.length === 0) {
      if (total_gross && typeof total_gross === "number") {
        // Demo-Item aus Brutto generieren
        const netFromGross = total_gross / (1 + tax_rate / 100);

        finalItems = [
          {
            item_text: debtor || "Demo-Position",
            qty: 1,
            unit: "Stk",
            unit_price: netFromGross.toFixed(2),
            net_line: netFromGross.toFixed(2),
          },
        ];
      } else {
        // Leeres Draft-Item
        finalItems = [
          {
            item_text: debtor || "Position 1",
            qty: 1,
            unit: "Stk",
            unit_price: 0,
            net_line: 0,
          },
        ];
      }
    }

    // Summen berechnen
    let netAmount = 0;
    for (const item of finalItems) {
      const lineTotal = parseFloat(item.qty || 0) * parseFloat(item.unit_price || 0);
      netAmount += lineTotal;
    }
    const taxAmount = netAmount * (tax_rate / 100);
    const grossAmount = netAmount + taxAmount;

    // Rechnung erstellen (Status: draft)
    let invoiceId: number | null = null;
    try {
      const [result] = await connection.execute(
        `INSERT INTO lopez_invoices 
         (invoice_number, customer_id, project_id, order_id, issue_date, service_date, payment_terms, currency, net_amount, tax_rate, tax_amount, gross_amount, status, created_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft', ?)`,
        [
          finalInvoiceNumber,
          finalCustomerId,
          project_id || null,
          order_id || null,
          finalIssueDate,
          finalServiceDate,
          payment_terms || "Zahlbar innerhalb 14 Tage ohne Abzug",
          currency,
          netAmount,
          tax_rate,
          taxAmount,
          grossAmount,
          finalCreatedBy,
        ],
      );

      invoiceId = (result as any).insertId;

      // Positionen einfügen
      if (invoiceId && finalItems.length > 0) {
        for (let i = 0; i < finalItems.length; i++) {
          const item = finalItems[i];
          const lineTotal = parseFloat(item.qty || 0) * parseFloat(item.unit_price || 0);

          try {
            await connection.execute(
              `INSERT INTO lopez_invoice_items 
               (invoice_id, pos, item_text, qty, unit, unit_price, net_line)
               VALUES (?, ?, ?, ?, ?, ?, ?)`,
              [
                invoiceId,
                i + 1,
                item.item_text || item.name || "Position",
                item.qty || 1,
                item.unit || "Stk",
                item.unit_price || item.price || 0,
                lineTotal,
              ],
            );
          } catch (itemError: any) {
            console.error(`❌ Fehler beim Einfügen der Position ${i + 1}:`, itemError);
            // Weiter mit nächster Position (nicht blockierend)
          }
        }
      }

      // Audit-Log (optional, nicht blockierend)
      if (invoiceId) {
        try {
          await connection.execute(
            `INSERT INTO lopez_audit_logs (user_id, action, ref_table, ref_id, notes)
             VALUES (?, 'INVOICE_CREATE', 'lopez_invoices', ?, ?)`,
            [
              finalCreatedBy,
              invoiceId,
              `Rechnung erstellt (draft): ${finalInvoiceNumber} (Netto: ${netAmount.toFixed(2)} EUR, Brutto: ${grossAmount.toFixed(2)} EUR)`,
            ],
          );
        } catch (auditError: any) {
          console.error("❌ Fehler beim Audit-Log:", auditError);
          // Nicht blockierend - Rechnung wurde bereits erstellt
        }
      }
    } catch (insertError: any) {
      console.error("❌ Fehler beim Erstellen der Rechnung:", insertError);
      console.error("❌ SQL Error Details:", insertError?.message, insertError?.code);

      // Spezifische Fehlermeldungen für häufige Probleme
      if (insertError?.code === "ER_NO_SUCH_TABLE") {
        throw new Error("Tabelle lopez_invoices existiert nicht. Bitte Datenbankschema ausführen.");
      }
      if (insertError?.code === "ER_BAD_FIELD_ERROR") {
        throw new Error(`Ungültiges Datenbankfeld: ${insertError?.message}`);
      }
      if (insertError?.code === "ER_FOREIGN_KEY_CONSTRAINT_FAILS") {
        throw new Error(
          `Foreign Key Constraint Fehler: ${finalCustomerId} existiert nicht in lopez_customers`,
        );
      }

      throw insertError; // Re-throw für allgemeine Fehlerbehandlung
    }

    if (connection) {
      try {
        await connection.end();
      } catch {}
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          id: invoiceId,
          invoice_number: finalInvoiceNumber,
          status: "draft",
          net_amount: netAmount,
          tax_amount: taxAmount,
          gross_amount: grossAmount,
          message: "Rechnung erfolgreich erstellt (draft)",
        },
      },
      {
        status: 201,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      },
    );
  } catch (error: any) {
    console.error("❌ Invoices API Fehler:", error);
    console.error("❌ Error Name:", error?.name);
    console.error("❌ Error Message:", error?.message);
    console.error("❌ Error Code:", error?.code);
    console.error("❌ Error SQL State:", error?.sqlState);
    console.error("❌ Stack:", error?.stack);
    
    if (connection) {
      try {
        await connection.end();
      } catch (closeError) {
        console.error("❌ Fehler beim Schließen der DB-Verbindung:", closeError);
      }
    }

    // Detailliertere Fehlermeldung für Development
    const errorMessage =
      process.env.NODE_ENV === "development"
        ? error?.message || String(error) || "Fehler beim Erstellen der Rechnung"
        : "Fehler beim Erstellen der Rechnung";

    // Stelle sicher, dass wir immer JSON zurückgeben
    try {
      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
          ...(process.env.NODE_ENV === "development" && {
            details: {
              name: error?.name,
              code: error?.code,
              sqlState: error?.sqlState,
              message: error?.message,
              stack: error?.stack?.split("\n").slice(0, 5).join("\n"), // Erste 5 Zeilen des Stacks
            },
          }),
        },
        { 
          status: 500,
          headers: { "Content-Type": "application/json; charset=utf-8" },
        },
      );
    } catch (jsonError) {
      // Fallback: Plain Text Response falls JSON-Serialisierung fehlschlägt
      console.error("❌ Fehler beim Erstellen der JSON-Antwort:", jsonError);
      return new NextResponse(
        `Internal Server Error: ${errorMessage}`,
        { 
          status: 500,
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        },
      );
    }
  }
}
