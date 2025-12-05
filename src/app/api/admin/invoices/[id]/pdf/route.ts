// =====================================================
// ADMIN INVOICE PDF GENERATION
// =====================================================
// POST /api/admin/invoices/[id]/pdf - PDF generieren
// GET /api/admin/invoices/[id]/pdf - PDF herunterladen (Admin)
// =====================================================

import { NextRequest, NextResponse } from "next/server";
import { InvoiceService } from "@/lib/customer/invoice-service";
import { InvoicePdf } from "@/lib/customer/invoice-pdf";
import { getConnection } from "@/lib/database";
import { RowDataPacket } from "mysql2/promise";
import { renderToBuffer } from "@react-pdf/renderer";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import React from "react";

// POST - PDF generieren und speichern
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const invoiceId = parseInt(id, 10);

    if (isNaN(invoiceId)) {
      return NextResponse.json(
        { success: false, error: "Ungültige ID" },
        { status: 400 }
      );
    }

    // Rechnung laden
    const invoice = await InvoiceService.getById(invoiceId);
    if (!invoice) {
      return NextResponse.json(
        { success: false, error: "Rechnung nicht gefunden" },
        { status: 404 }
      );
    }

    // Kundendaten laden
    const pool = await getConnection();
    const [customers] = await pool.execute<RowDataPacket[]>(`
      SELECT 
        company_name, first_name, last_name,
        street, postal_code, city, country, email
      FROM lopez_customers WHERE id = ?
    `, [invoice.customer_id]);

    if (customers.length === 0) {
      return NextResponse.json(
        { success: false, error: "Kunde nicht gefunden" },
        { status: 404 }
      );
    }

    const customer = customers[0];

    // PDF generieren
    const pdfBuffer = await renderToBuffer(
      React.createElement(InvoicePdf, { invoice, customer })
    );

    // Pfad generieren
    const relativePath = InvoiceService.generatePdfFilename(invoice);
    const fullPath = path.join(process.cwd(), 'storage', 'invoices', relativePath);
    
    // Verzeichnis erstellen falls nicht vorhanden
    const dir = path.dirname(fullPath);
    await mkdir(dir, { recursive: true });

    // PDF speichern
    await writeFile(fullPath, pdfBuffer);

    // Pfad in DB speichern
    await InvoiceService.setPdfPath(invoiceId, relativePath);

    return NextResponse.json({
      success: true,
      message: "PDF generiert",
      data: {
        pdf_path: relativePath,
        size_bytes: pdfBuffer.length
      }
    });

  } catch (error) {
    console.error("❌ Invoice PDF Generation Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Fehler bei PDF-Generierung" },
      { status: 500 }
    );
  }
}

// GET - PDF herunterladen (Admin)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const invoiceId = parseInt(id, 10);

    if (isNaN(invoiceId)) {
      return NextResponse.json(
        { success: false, error: "Ungültige ID" },
        { status: 400 }
      );
    }

    const invoice = await InvoiceService.getById(invoiceId);
    if (!invoice) {
      return NextResponse.json(
        { success: false, error: "Rechnung nicht gefunden" },
        { status: 404 }
      );
    }

    if (!invoice.pdf_path) {
      return NextResponse.json(
        { success: false, error: "PDF noch nicht generiert" },
        { status: 404 }
      );
    }

    // PDF lesen
    const { readFile } = await import("fs/promises");
    const fullPath = path.join(process.cwd(), 'storage', 'invoices', invoice.pdf_path);
    const pdfBuffer = await readFile(fullPath);

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${invoice.invoice_number}.pdf"`,
        'Content-Length': pdfBuffer.length.toString()
      }
    });

  } catch (error) {
    console.error("❌ Invoice PDF GET Error:", error);
    return NextResponse.json(
      { success: false, error: "PDF nicht verfügbar" },
      { status: 404 }
    );
  }
}

