/**
 * POST /api/einvoice/inbox/upload
 * E-Rechnung empfangen (EN-16931: XRechnung/ZUGFeRD)
 * Validierung (Schema/Schematron), Status: neu → geprüft → gebucht
 */

import { createConnection } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const customerId = formData.get("customer_id") as string | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "XML-Datei ist erforderlich" },
        { status: 400 },
      );
    }

    // Datei speichern
    const uploadDir = path.join(process.cwd(), "uploads", "einvoice", "inbox");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filename = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadDir, filename);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(filePath, buffer);

    // Format erkennen (XRechnung oder ZUGFeRD)
    const fileContent = buffer.toString("utf-8");
    const isXRechnung = fileContent.includes("urn:cen.eu:en16931:2017");
    const format = isXRechnung ? "XRECHNUNG" : "ZUGFERD";

    // TODO: Schema/Schematron-Validierung (Python-Hook)
    // Für jetzt: Basis-Validierung
    const validationReport = {
      valid: true,
      errors: [],
      warnings: [],
      note: "Vollständige Validierung erfordert Python-Hook (validate_en16931.py)",
    };

    // TODO: Daten aus XML extrahieren (Python-Hook)
    // Für jetzt: Platzhalter
    const extractedData = {
      total_net: null,
      total_tax: null,
      total_gross: null,
      currency: "EUR",
      invoice_number: null,
    };

    const connection = await createConnection();

    // In einvoice_inbox speichern
    const [result] = await connection.execute(
      `INSERT INTO einvoice_inbox 
       (sender, customer_id, format, xml_path, pdf_path, total_net, total_tax, total_gross, currency, invoice_number, validation_report, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        "unknown", // TODO: Aus XML extrahieren
        customerId || null,
        format,
        filePath,
        null, // PDF falls vorhanden
        extractedData.total_net,
        extractedData.total_tax,
        extractedData.total_gross,
        extractedData.currency,
        extractedData.invoice_number,
        JSON.stringify(validationReport),
        "neu",
      ],
    );

    const insertId = (result as any).insertId;

    // Audit-Log
    await connection.execute(
      `INSERT INTO lopez_audit_logs (action, ref_table, ref_id, notes)
       VALUES ('EINVOICE_INBOX_UPLOAD', 'einvoice_inbox', ?, ?)`,
      [insertId, `E-Rechnung empfangen: ${filename} (Format: ${format})`],
    );

    await connection.end();

    return NextResponse.json(
      {
        success: true,
        data: {
          id: insertId,
          format,
          status: "neu",
          validation_report: validationReport,
          message: "E-Rechnung erfolgreich empfangen",
          note: "Für vollständige Validierung und Extraktion muss Python-Hook implementiert werden",
        },
      },
      {
        headers: { "Content-Type": "application/json; charset=utf-8" },
      },
    );
  } catch (error) {
    console.error("❌ E-Rechnung Inbox Upload API Fehler:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Empfangen der E-Rechnung" },
      { status: 500 },
    );
  }
}
