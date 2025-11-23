// =====================================================
// BASIC EXCEL GENERATOR - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-01-19
// Zweck: Einfacher, funktionierender Excel-Export
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================

import * as XLSX from "xlsx";

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

export class BasicExcelGenerator {
  private companyName = "LOPEZ IT WELT";
  private tagline = "Digital Solutions. Global. Secure.";

  // =====================================================
  // MANAGEMENT REPORT (BASIC)
  // =====================================================
  generateManagementReport(customers: Customer[], options: any = {}) {
    console.log("📊 Basic Excel Generator: Management Report gestartet");
    console.log("- Kunden Anzahl:", customers.length);

    const workbook = XLSX.utils.book_new();

    // =====================================================
    // DECKBLATT
    // =====================================================
    const coverData = [
      ["LOPEZ IT WELT", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      [
        "Digital Solutions. Global. Secure.",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["KUNDENÜBERSICHT", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      [
        "Export-Datum:",
        new Date().toLocaleString("de-DE"),
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ],
      [
        "Anzahl Kunden:",
        customers.length.toString(),
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ],
      [
        "Aktive Kunden:",
        customers.filter((c) => c.status === "aktiv").length.toString(),
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ],
      [
        "Inaktive Kunden:",
        customers.filter((c) => c.status === "inaktiv").length.toString(),
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ],
      [
        "Gesperrte Kunden:",
        customers.filter((c) => c.status === "gesperrt").length.toString(),
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["Kundentypen:", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      [
        "Privat:",
        customers.filter((c) => c.customer_type === "privat").length.toString(),
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ],
      [
        "Firma:",
        customers.filter((c) => c.customer_type === "firma").length.toString(),
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ],
      [
        "Behörde:",
        customers.filter((c) => c.customer_type === "behörde").length.toString(),
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ],
      [
        "Partner:",
        customers.filter((c) => c.customer_type === "partner").length.toString(),
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["Support Levels:", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      [
        "Basic:",
        customers.filter((c) => c.support_level === "Basic").length.toString(),
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ],
      [
        "Standard:",
        customers.filter((c) => c.support_level === "Standard").length.toString(),
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ],
      [
        "Premium:",
        customers.filter((c) => c.support_level === "Premium").length.toString(),
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ],
      [
        "Enterprise:",
        customers.filter((c) => c.support_level === "Enterprise").length.toString(),
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      [
        "Lopez IT Welt GmbH – Digital Solutions Global Secure",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ],
    ];

    const coverSheet = XLSX.utils.aoa_to_sheet(coverData);

    // =====================================================
    // LOGO-BEREICH STYLING (A1-D3)
    // =====================================================
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 4; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        if (!coverSheet[cellAddress]) coverSheet[cellAddress] = { v: "", t: "s" };
        coverSheet[cellAddress].s = {
          alignment: { horizontal: "center", vertical: "center" },
          fill: { fgColor: { rgb: "E6F3FF" } }, // Hellblau
          border: {
            top: { style: "thick", color: { rgb: "1F4E79" } },
            bottom: { style: "thick", color: { rgb: "1F4E79" } },
            left: { style: "thick", color: { rgb: "1F4E79" } },
            right: { style: "thick", color: { rgb: "1F4E79" } },
          },
        };
      }
    }

    // Firmenname stylen (A1)
    if (coverSheet["A1"]) {
      coverSheet["A1"].s = {
        font: { bold: true, size: 24, color: { rgb: "1F4E79" } },
        alignment: { horizontal: "center", vertical: "center" },
        fill: { fgColor: { rgb: "E6F3FF" } },
      };
    }

    // Tagline stylen (A2)
    if (coverSheet["A2"]) {
      coverSheet["A2"].s = {
        font: { size: 14, color: { rgb: "2F5597" } },
        alignment: { horizontal: "center", vertical: "center" },
        fill: { fgColor: { rgb: "E6F3FF" } },
      };
    }

    // Zellen zusammenführen für Logo-Bereich
    if (!coverSheet["!merges"]) coverSheet["!merges"] = [];
    coverSheet["!merges"].push({ s: { r: 0, c: 0 }, e: { r: 2, c: 3 } });

    XLSX.utils.book_append_sheet(workbook, coverSheet, "Deckblatt");

    // =====================================================
    // KUNDENÜBERSICHT
    // =====================================================
    const headers = [
      "Kundentyp",
      "Anrede",
      "Name/Firma",
      "E-Mail",
      "Telefon",
      "Adresse",
      "Status",
      "Support Level",
    ];

    const customerData = customers.map((customer) => [
      customer.customer_type,
      customer.anrede,
      customer.company_name || `${customer.vorname} ${customer.nachname}`,
      customer.email,
      customer.telefon || "",
      `${customer.strasse || ""} ${customer.hausnummer || ""}, ${customer.plz || ""} ${customer.ort || ""}`,
      customer.status,
      customer.support_level,
    ]);

    console.log("📊 Kundendaten für Excel:");
    console.log("- Headers:", headers);
    console.log("- Data Rows:", customerData.length);
    console.log("- First Row:", customerData[0]);

    const customerSheet = XLSX.utils.aoa_to_sheet([headers, ...customerData]);

    // Header stylen
    headers.forEach((_, colIndex) => {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: colIndex });
      if (customerSheet[cellAddress]) {
        customerSheet[cellAddress].s = {
          font: { bold: true, color: { rgb: "FFFFFF" } },
          fill: { fgColor: { rgb: "1F4E79" } },
          alignment: { horizontal: "center", vertical: "center" },
        };
      }
    });

    // Spaltenbreiten setzen
    customerSheet["!cols"] = [
      { wch: 12 }, // Kundentyp
      { wch: 8 }, // Anrede
      { wch: 25 }, // Name/Firma
      { wch: 30 }, // E-Mail
      { wch: 15 }, // Telefon
      { wch: 40 }, // Adresse
      { wch: 10 }, // Status
      { wch: 15 }, // Support Level
    ];

    XLSX.utils.book_append_sheet(workbook, customerSheet, "Kundenübersicht");

    // =====================================================
    // ZUSAMMENFASSUNG
    // =====================================================
    const summaryData = [
      ["ZUSAMMENFASSUNG", "", ""],
      ["", "", ""],
      ["Gesamtkunden:", customers.length.toString(), ""],
      ["Aktive Kunden:", customers.filter((c) => c.status === "aktiv").length.toString(), ""],
      ["Inaktive Kunden:", customers.filter((c) => c.status === "inaktiv").length.toString(), ""],
      ["Gesperrte Kunden:", customers.filter((c) => c.status === "gesperrt").length.toString(), ""],
      ["", "", ""],
      ["Kundentypen:", "", ""],
      ["Privat:", customers.filter((c) => c.customer_type === "privat").length.toString(), ""],
      ["Firma:", customers.filter((c) => c.customer_type === "firma").length.toString(), ""],
      ["Behörde:", customers.filter((c) => c.customer_type === "behörde").length.toString(), ""],
      ["Partner:", customers.filter((c) => c.customer_type === "partner").length.toString(), ""],
      ["", "", ""],
      ["Support Levels:", "", ""],
      ["Basic:", customers.filter((c) => c.support_level === "Basic").length.toString(), ""],
      ["Standard:", customers.filter((c) => c.support_level === "Standard").length.toString(), ""],
      ["Premium:", customers.filter((c) => c.support_level === "Premium").length.toString(), ""],
      [
        "Enterprise:",
        customers.filter((c) => c.support_level === "Enterprise").length.toString(),
        "",
      ],
    ];

    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);

    // Titel stylen (A1)
    if (summarySheet["A1"]) {
      summarySheet["A1"].s = {
        font: { bold: true, size: 18, color: { rgb: "1F4E79" } },
        alignment: { horizontal: "left", vertical: "center" },
      };
    }

    XLSX.utils.book_append_sheet(workbook, summarySheet, "Zusammenfassung");

    // =====================================================
    // EXCEL BUFFER ERSTELLEN
    // =====================================================
    const excelBuffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
      compression: true,
    });

    console.log("✅ Basic Excel Generator: Management Report erfolgreich generiert");
    console.log("- Buffer Länge:", excelBuffer.length);
    console.log("- Kunden Anzahl:", customers.length);
    console.log("- Workbook Sheets:", workbook.SheetNames);

    return {
      content: excelBuffer,
      fileName: `Lopez_IT_Welt_Management_Report_${new Date().toISOString().split("T")[0]}.xlsx`,
      mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    };
  }

  // =====================================================
  // TECHNISCHER EXPORT (ROHDATEN)
  // =====================================================
  generateTechnicalExport(customers: Customer[], options: any = {}) {
    console.log("📊 Basic Excel Generator: Technical Export gestartet");

    const workbook = XLSX.utils.book_new();

    // Raw Data Sheet
    const rawHeaders = Object.keys(customers[0] || {});
    const rawData = customers.map((customer) => rawHeaders.map((header) => customer[header]));
    const rawSheet = XLSX.utils.aoa_to_sheet([rawHeaders, ...rawData]);
    XLSX.utils.book_append_sheet(workbook, rawSheet, "Raw_Data");

    // Metadata Sheet
    const metadata = [
      ["Field Name", "Description", "Type", "Example"],
      ["id", "Unique customer identifier", "string", "cust_123"],
      ["customer_type", "Type of customer (privat, firma, behörde, partner)", "enum", "firma"],
      ["anrede", "Salutation (Herr, Frau, Divers)", "string", "Herr"],
      ["titel", "Academic title", "string", "Dr."],
      ["vorname", "First name", "string", "Max"],
      ["nachname", "Last name", "string", "Mustermann"],
      [
        "company_name",
        "Company name (if customer_type is firma/behörde/partner)",
        "string",
        "Muster GmbH",
      ],
      ["ust_id", "VAT ID", "string", "DE123456789"],
      ["email", "Contact email address", "string", "max.mustermann@example.com"],
      ["telefon", "Phone number", "string", "+49 123 456789"],
      ["strasse", "Street name", "string", "Musterstr."],
      ["hausnummer", "House number", "string", "1a"],
      ["plz", "Postal code", "string", "12345"],
      ["ort", "City", "string", "Musterstadt"],
      ["land", "Country", "string", "Deutschland"],
      ["status", "Customer status (aktiv, inaktiv, gesperrt)", "enum", "aktiv"],
      [
        "support_level",
        "Customer support level (Basic, Standard, Premium, Enterprise)",
        "enum",
        "Premium",
      ],
      ["notes", "Internal notes about the customer", "string", "Wichtiger Kunde"],
      ["created_at", "Timestamp of customer creation", "datetime", "2024-01-01T10:00:00Z"],
      ["updated_at", "Timestamp of last update", "datetime", "2024-01-15T11:30:00Z"],
    ];
    const metadataSheet = XLSX.utils.aoa_to_sheet(metadata);
    XLSX.utils.book_append_sheet(workbook, metadataSheet, "Metadata");

    const excelBuffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
      compression: true,
    });

    console.log("✅ Basic Excel Generator: Technical Export erfolgreich generiert");
    console.log("- Buffer Länge:", excelBuffer.length);
    console.log("- Kunden Anzahl:", customers.length);

    return {
      content: excelBuffer,
      fileName: `Lopez_IT_Welt_Technical_Export_${new Date().toISOString().split("T")[0]}.xlsx`,
      mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    };
  }
}
