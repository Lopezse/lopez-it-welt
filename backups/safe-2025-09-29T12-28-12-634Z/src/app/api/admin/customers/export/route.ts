import { CSVGenerator } from "@/lib/csv-generator";
import { ExcelJSGenerator } from "@/lib/exceljs-generator";
import { PDFGenerator } from "@/lib/pdf-generator";
import { NextRequest, NextResponse } from "next/server";

// =====================================================
// KUNDEN EXPORT API ROUTE
// =====================================================

export async function POST(request: NextRequest) {
  try {
    // Kunden Export Request gestartet

    const body = await request.json();
    const { format } = body;

    // Export Format: ${format}

    // Demo-Kundendaten
    const demoCustomers = [
      {
        id: "cust_001",
        customer_type: "firma" as const,
        anrede: "Herr",
        titel: "Dr.",
        vorname: "Max",
        nachname: "Mustermann",
        company_name: "Muster GmbH",
        ust_id: "DE123456789",
        email: "max.mustermann@muster.de",
        telefon: "+49 123 456789",
        strasse: "Musterstraße",
        hausnummer: "12",
        plz: "12345",
        ort: "Musterstadt",
        land: "Deutschland",
        status: "aktiv" as const,
        support_level: "Premium" as const,
        notes: "Wichtiger Kunde",
        created_at: "2024-01-01T10:00:00Z",
        updated_at: "2024-01-15T11:30:00Z",
      },
      {
        id: "cust_002",
        customer_type: "privat" as const,
        anrede: "Frau",
        titel: "",
        vorname: "Anna",
        nachname: "Schmidt",
        company_name: "",
        ust_id: "",
        email: "anna.schmidt@example.com",
        telefon: "+49 987 654321",
        strasse: "Beispielweg",
        hausnummer: "5",
        plz: "54321",
        ort: "Beispielstadt",
        land: "Deutschland",
        status: "aktiv" as const,
        support_level: "Standard" as const,
        notes: "Privatkunde",
        created_at: "2024-01-02T14:30:00Z",
        updated_at: "2024-01-16T09:15:00Z",
      },
      {
        id: "cust_003",
        customer_type: "behörde" as const,
        anrede: "Herr",
        titel: "Prof.",
        vorname: "Thomas",
        nachname: "Müller",
        company_name: "Stadtverwaltung Musterstadt",
        ust_id: "DE987654321",
        email: "thomas.mueller@musterstadt.de",
        telefon: "+49 555 123456",
        strasse: "Rathausplatz",
        hausnummer: "1",
        plz: "12345",
        ort: "Musterstadt",
        land: "Deutschland",
        status: "aktiv" as const,
        support_level: "Enterprise" as const,
        notes: "Behördenkunde",
        created_at: "2024-01-03T08:45:00Z",
        updated_at: "2024-01-17T16:20:00Z",
      },
      {
        id: "cust_004",
        customer_type: "partner" as const,
        anrede: "Herr",
        titel: "",
        vorname: "Michael",
        nachname: "Weber",
        company_name: "Partner Solutions GmbH",
        ust_id: "DE456789123",
        email: "michael.weber@partner-solutions.de",
        telefon: "+49 777 888999",
        strasse: "Partnerstraße",
        hausnummer: "42",
        plz: "67890",
        ort: "Partnerstadt",
        land: "Deutschland",
        status: "inaktiv" as const,
        support_level: "Basic" as const,
        notes: "Partnerkunde",
        created_at: "2024-01-04T12:00:00Z",
        updated_at: "2024-01-18T10:30:00Z",
      },
    ];

    let result;

    switch (format) {
      case "xlsx":
      case "management-xlsx":
        // Generiere Management Excel Report...
        const excelGenerator = new ExcelJSGenerator();
        result = await excelGenerator.generateManagementReport(demoCustomers);
        break;

      case "technical-xlsx":
        // Generiere Technical Excel Export...
        const techExcelGenerator = new ExcelJSGenerator();
        result = await techExcelGenerator.generateTechnicalExport(demoCustomers);
        break;

      case "pdf":
        // Generiere PDF Report...
        const pdfGenerator = new PDFGenerator();
        result = await pdfGenerator.generateManagementReport(demoCustomers);
        break;

      case "csv":
      case "technical-csv":
        // Generiere CSV Export...
        const csvGenerator = new CSVGenerator();
        result = await csvGenerator.generateManagementReport(demoCustomers);
        break;

      default:
        return NextResponse.json({ error: "Unbekanntes Format" }, { status: 400 });
    }

    // Buffer zu Base64 konvertieren
    const base64Content = Buffer.from(result.content).toString("base64");

    // Base64 Konvertierung Debug:
    // Original Buffer Length: ${result.content.length}
    // Base64 Length: ${base64Content.length}
    // Base64 Preview (first 100 chars): ${base64Content.substring(0, 100)}

    return NextResponse.json({
      success: true,
      fileName: result.fileName,
      mimeType: result.mimeType,
      content: base64Content,
    });
  } catch (error) {
    // Export Fehler: ${error}
    return NextResponse.json({ error: "Fehler beim Generieren des Exports" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json(
    { error: "GET nicht unterstützt. Verwenden Sie POST." },
    { status: 405 },
  );
}
