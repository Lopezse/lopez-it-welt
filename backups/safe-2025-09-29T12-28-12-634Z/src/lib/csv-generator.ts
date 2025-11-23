// =====================================================
// CSV GENERATOR - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-01-19
// Zweck: CSV-Export für Rohdaten
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================

interface Customer {
  id: string;
  customer_type: "privat" | "firma" | "behörde" | "partner";
  anrede: string;
  titel?: string;
  vorname: string;
  nachname: string;
  company_name?: string;
  ust_id?: string;
  email: string;
  telefon?: string;
  strasse?: string;
  hausnummer?: string;
  plz?: string;
  ort?: string;
  land?: string;
  status: "aktiv" | "inaktiv" | "gesperrt";
  support_level: "Basic" | "Standard" | "Premium" | "Enterprise";
  notes?: string;
  created_at: string;
  updated_at: string;
}

export class CSVGenerator {
  private companyName = "LOPEZ IT WELT";

  // =====================================================
  // MANAGEMENT REPORT (CSV)
  // =====================================================
  async generateManagementReport(customers: Customer[], options: any = {}) {
    console.log("📊 CSV Generator: Management Report gestartet");
    console.log("- Kunden Anzahl:", customers.length);

    // CSV-Header
    const headers = [
      "ID",
      "Kundentyp",
      "Anrede",
      "Titel",
      "Vorname",
      "Nachname",
      "Firma",
      "UST-ID",
      "E-Mail",
      "Telefon",
      "Strasse",
      "Hausnummer",
      "PLZ",
      "Ort",
      "Land",
      "Status",
      "Support Level",
      "Notizen",
      "Erstellt",
      "Aktualisiert",
    ];

    // CSV-Daten
    const csvData = customers.map((customer) => [
      customer.id,
      customer.customer_type,
      customer.anrede,
      customer.titel || "",
      customer.vorname,
      customer.nachname,
      customer.company_name || "",
      customer.ust_id || "",
      customer.email,
      customer.telefon || "",
      customer.strasse || "",
      customer.hausnummer || "",
      customer.plz || "",
      customer.ort || "",
      customer.land || "",
      customer.status,
      customer.support_level,
      customer.notes || "",
      customer.created_at,
      customer.updated_at,
    ]);

    // CSV-String erstellen
    let csvContent = "";

    // BOM für UTF-8 (für Excel-Kompatibilität)
    csvContent += "\uFEFF";

    // Header
    csvContent += headers.map((header) => this.escapeCsvField(header)).join(",") + "\n";

    // Daten
    csvData.forEach((row) => {
      csvContent += row.map((field) => this.escapeCsvField(field)).join(",") + "\n";
    });

    const csvBuffer = Buffer.from(csvContent, "utf8");

    console.log("✅ CSV Generator: Management Report erfolgreich generiert");
    console.log("- Buffer Länge:", csvBuffer.length);
    console.log("- Kunden Anzahl:", customers.length);

    return {
      content: csvBuffer,
      fileName: `Lopez_IT_Welt_Management_Report_${new Date().toISOString().split("T")[0]}.csv`,
      mimeType: "text/csv",
    };
  }

  // =====================================================
  // CSV HELPER
  // =====================================================
  private escapeCsvField(field: any): string {
    if (field === null || field === undefined) {
      return "";
    }

    const fieldStr = String(field);

    // Wenn das Feld Komma, Anführungszeichen oder Zeilenumbruch enthält, in Anführungszeichen setzen
    if (
      fieldStr.includes(",") ||
      fieldStr.includes('"') ||
      fieldStr.includes("\n") ||
      fieldStr.includes("\r")
    ) {
      return '"' + fieldStr.replace(/"/g, '""') + '"';
    }

    return fieldStr;
  }
}
