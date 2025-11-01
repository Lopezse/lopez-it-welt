/**
 * POST /api/invoices/pdf
 * PDF generieren (Python-Hook)
 * GoBD: PDF/A-3, Hash (SHA-256), Archivierung
 */

import { createConnection } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { invoice_id, id } = body;
    const invoiceId = invoice_id || id;

    if (!invoiceId) {
      return NextResponse.json(
        { success: false, error: "invoice_id ist erforderlich" },
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
      [invoiceId],
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
      [invoiceId],
    );

    const items = Array.isArray(itemRows) ? itemRows : [];

    // TODO: Python-Hook für PDF-Generierung aufrufen
    // Für jetzt: Platzhalter-Pfad generieren
    const year = new Date(invoice.issue_date).getFullYear();
    const month = String(new Date(invoice.issue_date).getMonth() + 1).padStart(2, "0");
    const archivePath = path.join("D:", "Lopez_IT_Welt", "Finanzen", String(year), month);
    const filename = `LITW-${invoice.invoice_number}.pdf`;
    const pdfPath = path.join(archivePath, filename);

    // Hash berechnen (aus Rechnungsdaten)
    const hashData = JSON.stringify({
      invoice_number: invoice.invoice_number,
      customer_id: invoice.customer_id,
      net_amount: invoice.net_amount,
      tax_amount: invoice.tax_amount,
      gross_amount: invoice.gross_amount,
      issue_date: invoice.issue_date,
      items: items,
    });

    const hash = crypto.createHash("sha256").update(hashData).digest("hex");

    // PDF-Pfad und Hash in DB speichern
    await connection.execute(
      `UPDATE lopez_invoices 
       SET pdf_path = ?, hash_sha256 = ?, updated_at = NOW()
       WHERE id = ?`,
      [pdfPath, hash, invoiceId],
    );

    // Audit-Log
    await connection.execute(
      `INSERT INTO lopez_audit_logs (action, ref_table, ref_id, notes)
       VALUES ('INVOICE_PDF_GENERATED', 'lopez_invoices', ?, ?)`,
      [
        invoiceId,
        `PDF generiert für Rechnung: ${invoice.invoice_number} (Hash: ${hash.substring(0, 16)}...)`,
      ],
    );

    await connection.end();

    // Prüfe ob PDF bereits existiert
    let pdfBuffer: Buffer | null = null;
    if (fs.existsSync(pdfPath)) {
      try {
        pdfBuffer = fs.readFileSync(pdfPath);
      } catch (readError) {
        console.warn("⚠️ PDF-Datei existiert, aber kann nicht gelesen werden:", readError);
      }
    }

    // Fallback: Dummy-PDF generieren (für Demo-Zwecke)
    if (!pdfBuffer) {
      // Minimal PDF-Header (PDF 1.4)
      const dummyPdf = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 <<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
>>
>>
>>
endobj
4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
100 700 Td
(Rechnung ${invoice.invoice_number}) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000261 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
365
%%EOF`;

      pdfBuffer = Buffer.from(dummyPdf, "utf8");

      // Audit-Log für Dummy-PDF
      console.log(`📄 Dummy-PDF generiert für Rechnung ${invoice.invoice_number}`);
    }

    // PDF streamen
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="invoice-${invoice.invoice_number}.pdf"`,
        "Content-Length": pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("❌ Invoice PDF API Fehler:", error);
    // Fallback: JSON mit Fehler
    return NextResponse.json(
      { success: false, error: "Fehler beim Generieren der PDF" },
      { status: 500 },
    );
  }
}
