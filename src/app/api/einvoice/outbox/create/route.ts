/**
 * POST /api/einvoice/outbox/create
 * E-Rechnung erstellen (EN-16931: XRechnung/ZUGFeRD)
 * Aus lopez_invoices generieren
 */

import { createConnection } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { invoice_id, format = "XRECHNUNG" } = body;

    if (!invoice_id) {
      return NextResponse.json(
        { success: false, error: "invoice_id ist erforderlich" },
        { status: 400 },
      );
    }

    const validFormats = ["XRECHNUNG", "ZUGFERD"];
    if (!validFormats.includes(format)) {
      return NextResponse.json(
        { success: false, error: `Ungültiges Format. Erlaubt: ${validFormats.join(", ")}` },
        { status: 400 },
      );
    }

    const connection = await createConnection();

    // Rechnung laden
    const [invoiceRows] = await connection.execute(
      `SELECT i.*, 
              c.company_name, c.vorname, c.nachname, c.email as customer_email,
              p.project_name, p.project_code
       FROM lopez_invoices i
       LEFT JOIN lopez_customers c ON i.customer_id = c.id
       LEFT JOIN lopez_projects p ON i.project_id = p.id
       WHERE i.id = ?`,
      [invoice_id],
    );

    const invoice = Array.isArray(invoiceRows) && invoiceRows.length > 0 ? invoiceRows[0] : null;

    if (!invoice) {
      return NextResponse.json(
        { success: false, error: "Rechnung nicht gefunden" },
        { status: 404 },
      );
    }

    // Positionen laden
    const [itemRows] = await connection.execute(
      "SELECT * FROM lopez_invoice_items WHERE invoice_id = ? ORDER BY pos",
      [invoice_id],
    );

    const items = Array.isArray(itemRows) ? itemRows : [];

    // TODO: XRechnung/ZUGFeRD generieren (Python-Hook)
    // Für jetzt: Platzhalter-XML generieren
    const xmlContent = generatePlaceholderXML(invoice, items, format);

    const outboxDir = path.join(process.cwd(), "uploads", "einvoice", "outbox");
    if (!fs.existsSync(outboxDir)) {
      fs.mkdirSync(outboxDir, { recursive: true });
    }

    const xmlFilename = `${invoice.invoice_number}-${format.toLowerCase()}.xml`;
    const xmlPath = path.join(outboxDir, xmlFilename);
    fs.writeFileSync(xmlPath, xmlContent, "utf-8");

    // Hash berechnen
    const hash = crypto.createHash("sha256").update(xmlContent).digest("hex");

    // In einvoice_outbox speichern
    const [result] = await connection.execute(
      `INSERT INTO einvoice_outbox 
       (customer_id, project_id, invoice_number, format, xml_path, pdf_path, hash_sha256, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        invoice.customer_id,
        invoice.project_id || null,
        invoice.invoice_number,
        format,
        xmlPath,
        null, // PDF falls ZUGFeRD
        hash,
        "entwurf",
      ],
    );

    const insertId = (result as any).insertId;

    // Audit-Log
    await connection.execute(
      `INSERT INTO lopez_audit_logs (action, ref_table, ref_id, notes)
       VALUES ('EINVOICE_OUTBOX_CREATE', 'einvoice_outbox', ?, ?)`,
      [insertId, `E-Rechnung erstellt: ${invoice.invoice_number} (Format: ${format})`],
    );

    await connection.end();

    return NextResponse.json(
      {
        success: true,
        data: {
          id: insertId,
          invoice_number: invoice.invoice_number,
          format,
          xml_path: xmlPath,
          hash_sha256: hash,
          status: "entwurf",
          message: "E-Rechnung erfolgreich erstellt",
          note: "Für vollständige XRechnung/ZUGFeRD-Generierung muss Python-Hook implementiert werden",
        },
      },
      {
        headers: { "Content-Type": "application/json; charset=utf-8" },
      },
    );
  } catch (error) {
    console.error("❌ E-Rechnung Outbox Create API Fehler:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Erstellen der E-Rechnung" },
      { status: 500 },
    );
  }
}

function generatePlaceholderXML(invoice: any, items: any[], format: string): string {
  // Platzhalter-XML (TODO: Durch Python-Hook ersetzen)
  return `<?xml version="1.0" encoding="UTF-8"?>
<Invoice xmlns="urn:cen.eu:en16931:2017#compliant#urn:xeinkaufsangaben.de:ubl:de:2.0" 
         xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" 
         xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">
  <cbc:ID>${invoice.invoice_number}</cbc:ID>
  <cbc:IssueDate>${invoice.issue_date}</cbc:IssueDate>
  <cbc:DueDate>${invoice.payment_terms}</cbc:DueDate>
  <cbc:InvoiceTypeCode>380</cbc:InvoiceTypeCode>
  <cbc:Note>PLACEHOLDER: Vollständige Generierung erfordert Python-Hook</cbc:Note>
  <cac:LegalMonetaryTotal>
    <cbc:TaxExclusiveAmount currencyID="${invoice.currency}">${invoice.net_amount}</cbc:TaxExclusiveAmount>
    <cbc:TaxInclusiveAmount currencyID="${invoice.currency}">${invoice.gross_amount}</cbc:TaxInclusiveAmount>
  </cac:LegalMonetaryTotal>
</Invoice>`;
}
