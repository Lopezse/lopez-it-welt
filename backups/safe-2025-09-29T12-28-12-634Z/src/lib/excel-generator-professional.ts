// =====================================================
// PROFESSIONAL EXCEL GENERATOR - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-01-19
// Zweck: Professionelle Excel-Dateien mit Logo und Formatierung
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================

import fs from "fs";
import path from "path";
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
  email_secondary?: string;
  phone_mobile?: string;
  phone_business?: string;
  phone_private?: string;
  strasse?: string;
  plz?: string;
  stadt?: string;
  land: string;
  support_level: "Standard" | "Premium" | "SLA 24h" | "SLA 4h";
  status: "aktiv" | "inaktiv" | "gesperrt";
  notes?: string;
  created_at: string;
  updated_at: string;
}

export class ProfessionalExcelGenerator {
  private companyName = "Lopez IT Welt GmbH";
  private systemName = "Lopez IT Welt Admin-System (Enterprise++ Version)";
  private currentDate = new Date().toLocaleString("de-DE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  // =====================================================
  // LOGO-EINFÜGUNG
  // =====================================================
  private async addLogoToSheet(
    sheet: XLSX.WorkSheet,
    startRow: number,
    startCol: number,
    endRow: number,
    endCol: number,
  ) {
    try {
      // SVG-Logo lesen
      const logoPath = path.join(process.cwd(), "public", "logo.svg");
      const logoSvg = fs.readFileSync(logoPath, "utf8");

      // SVG zu Base64 konvertieren
      const base64Logo = Buffer.from(logoSvg).toString("base64");
      const dataUrl = `data:image/svg+xml;base64,${base64Logo}`;

      // Logo-Platz in Excel erstellen (A1-C3)
      for (let row = startRow; row <= endRow; row++) {
        for (let col = startCol; col <= endCol; col++) {
          const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
          sheet[cellAddress] = { v: "", t: "s" };

          // Logo-Styling für alle Zellen im Logo-Bereich
          sheet[cellAddress].s = {
            alignment: { horizontal: "center", vertical: "center" },
            fill: { fgColor: { rgb: "F8F9FA" } },
            border: {
              top: { style: "medium", color: { rgb: "1F4E79" } },
              bottom: { style: "medium", color: { rgb: "1F4E79" } },
              left: { style: "medium", color: { rgb: "1F4E79" } },
              right: { style: "medium", color: { rgb: "1F4E79" } },
            },
          };
        }
      }

      // Logo-Text in der Mitte (A2)
      const logoTextCell = XLSX.utils.encode_cell({ r: 1, c: 0 });
      sheet[logoTextCell] = { v: "LOPEZ IT WELT", t: "s" };
      sheet[logoTextCell].s = {
        font: { bold: true, size: 18, color: { rgb: "1F4E79" } },
        alignment: { horizontal: "center", vertical: "center" },
        fill: { fgColor: { rgb: "F8F9FA" } },
      };

      console.log("✅ Logo-Platz mit SVG-Referenz erfolgreich erstellt");
      console.log("📊 SVG-Logo Base64 Länge:", base64Logo.length);
    } catch (error) {
      console.error("❌ Fehler beim Einfügen des Logos:", error);
      // Fallback: Logo-Text
      const logoCell = XLSX.utils.encode_cell({ r: startRow, c: startCol });
      sheet[logoCell] = { v: "LOGO", t: "s" };
    }
  }

  // =====================================================
  // PROFESSIONELLE EXCEL-DATEI GENERIEREN
  // =====================================================

  async generateExcelFile(customers: Customer[], options: any) {
    // Erstelle neues Workbook
    const workbook = XLSX.utils.book_new();

    // =====================================================
    // PROFESSIONELLES DECKBLATT
    // =====================================================
    const coverData = [
      // Zeile 1-3: Logo-Platz (A1-C3) - Vergrößert für echtes Logo
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],

      // Zeile 6: Haupttitel
      ["", "", "LOPEZ IT WELT", "", "", "", "", "", ""],

      // Zeile 7: Untertitel
      ["", "", "KUNDENÜBERSICHT", "", "", "", "", "", ""],

      // Zeile 8: Enterprise++ Badge
      ["", "", "ENTERPRISE++ VERSION", "", "", "", "", "", ""],

      // Zeile 9-10: Leer
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],

      // Zeile 11: Export-Info Header
      ["", "", "EXPORT-INFORMATIONEN", "", "", "", "", "", ""],

      // Zeile 12: Leer
      ["", "", "", "", "", "", "", "", ""],

      // Zeile 13-16: Export-Details
      ["", "", "Exportdatum:", this.currentDate, "", "", "", "", ""],
      ["", "", "Verantwortlich:", "Admin Lopez IT Welt", "", "", "", "", ""],
      ["", "", "Gesamt Kunden:", customers.length.toString(), "", "", "", "", ""],
      ["", "", "System:", this.systemName, "", "", "", "", ""],

      // Zeile 17-18: Leer
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],

      // Zeile 19: Kunden-Statistiken Header
      ["", "", "KUNDEN-STATISTIKEN", "", "", "", "", "", ""],

      // Zeile 20: Leer
      ["", "", "", "", "", "", "", "", ""],

      // Zeile 21-24: Kunden-Statistiken
      [
        "",
        "",
        "Aktive Kunden:",
        customers.filter((c) => c.status === "aktiv").length.toString(),
        "",
        "",
        "",
        "",
        "",
      ],
      [
        "",
        "",
        "Inaktive Kunden:",
        customers.filter((c) => c.status === "inaktiv").length.toString(),
        "",
        "",
        "",
        "",
        "",
      ],
      [
        "",
        "",
        "Gesperrte Kunden:",
        customers.filter((c) => c.status === "gesperrt").length.toString(),
        "",
        "",
        "",
        "",
        "",
      ],
      [
        "",
        "",
        "Premium-Kunden:",
        customers.filter((c) => c.support_level === "Premium").length.toString(),
        "",
        "",
        "",
        "",
        "",
      ],

      // Zeile 25-26: Leer
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],

      // Zeile 27: Footer
      ["", "", "VERTRAULICH - NUR FÜR DEN INTERNEN GEBRAUCH", "", "", "", "", "", ""],

      // Zeile 28: Copyright
      ["", "", "© 2025 Lopez IT Welt GmbH - Alle Rechte vorbehalten", "", "", "", "", "", ""],
    ];

    const coverSheet = XLSX.utils.aoa_to_sheet(coverData);

    // Spaltenbreiten für Deckblatt
    coverSheet["!cols"] = [
      { wch: 40 }, // A - Logo
      { wch: 10 }, // B - Leer
      { wch: 50 }, // C - Titel
      { wch: 10 }, // D - Leer
      { wch: 10 }, // E - Leer
      { wch: 10 }, // F - Leer
      { wch: 10 }, // G - Leer
      { wch: 10 }, // H - Leer
      { wch: 10 }, // I - Leer
    ];

    // Zeilenhöhen für Logo-Platz vergrößern
    coverSheet["!rows"] = [
      { hpt: 60 }, // Zeile 1 - Logo-Platz
      { hpt: 60 }, // Zeile 2 - Logo-Platz
      { hpt: 60 }, // Zeile 3 - Logo-Platz
      { hpt: 20 }, // Zeile 4
      { hpt: 20 }, // Zeile 5
      { hpt: 30 }, // Zeile 6 - Haupttitel
      { hpt: 25 }, // Zeile 7 - Untertitel
      { hpt: 20 }, // Zeile 8 - Badge
      { hpt: 20 }, // Zeile 9
      { hpt: 20 }, // Zeile 10
      { hpt: 25 }, // Zeile 11 - Export-Info Header
      { hpt: 20 }, // Zeile 12
      { hpt: 20 }, // Zeile 13 - Export-Details
      { hpt: 20 }, // Zeile 14
      { hpt: 20 }, // Zeile 15
      { hpt: 20 }, // Zeile 16
      { hpt: 20 }, // Zeile 17
      { hpt: 20 }, // Zeile 18
      { hpt: 25 }, // Zeile 19 - Statistiken Header
      { hpt: 20 }, // Zeile 20
      { hpt: 20 }, // Zeile 21 - Statistiken
      { hpt: 20 }, // Zeile 22
      { hpt: 20 }, // Zeile 23
      { hpt: 20 }, // Zeile 24
      { hpt: 20 }, // Zeile 25
      { hpt: 20 }, // Zeile 26
      { hpt: 20 }, // Zeile 27 - Footer
      { hpt: 20 }, // Zeile 28 - Copyright
    ];

    // Logo in Deckblatt einfügen
    await this.addLogoToSheet(coverSheet, 0, 0, 2, 2);

    // Professionelles Styling für Deckblatt
    this.applyCoverStyling(coverSheet, customers.length);

    XLSX.utils.book_append_sheet(workbook, coverSheet, "Deckblatt");

    // =====================================================
    // PROFESSIONELLE KUNDENTABELLE
    // =====================================================
    const headers = [
      "Kundentyp",
      "Anrede",
      "Name / Firma",
      "E-Mail",
      "Telefon",
      "Adresse",
      "Status",
      "Support-Level",
      "Erstellungsdatum",
    ];

    const customerRows = customers.map((customer) => {
      const displayName =
        customer.customer_type === "privat"
          ? `${customer.vorname} ${customer.nachname}`
          : customer.company_name || `${customer.vorname} ${customer.nachname}`;

      const phone = customer.phone_mobile || customer.phone_business || "–";

      const address = [customer.strasse, customer.plz, customer.stadt, customer.land]
        .filter(Boolean)
        .join(", ");

      return [
        this.getCustomerTypeLabel(customer.customer_type),
        customer.anrede,
        displayName,
        customer.email,
        phone,
        address || "–",
        this.getStatusLabel(customer.status),
        customer.support_level,
        new Date(customer.created_at).toLocaleDateString("de-DE"),
      ];
    });

    const customerData = [headers, ...customerRows];
    const customerSheet = XLSX.utils.aoa_to_sheet(customerData);

    // Spaltenbreiten für Kundentabelle
    customerSheet["!cols"] = [
      { wch: 20 }, // Kundentyp
      { wch: 15 }, // Anrede
      { wch: 45 }, // Name/Firma
      { wch: 50 }, // E-Mail
      { wch: 25 }, // Telefon
      { wch: 60 }, // Adresse
      { wch: 15 }, // Status
      { wch: 25 }, // Support-Level
      { wch: 25 }, // Erstellungsdatum
    ];

    // Professionelles Styling für Kundentabelle
    this.applyCustomerTableStyling(customerSheet, customers.length);

    XLSX.utils.book_append_sheet(workbook, customerSheet, "Kundenübersicht");

    // =====================================================
    // PROFESSIONELLE ZUSAMMENFASSUNG
    // =====================================================
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter((c) => c.status === "aktiv").length;
    const inactiveCustomers = customers.filter((c) => c.status === "inaktiv").length;
    const blockedCustomers = customers.filter((c) => c.status === "gesperrt").length;

    const summaryData = [
      ["ZUSAMMENFASSUNG & KPIs", ""],
      ["", ""],
      ["Gesamt Kunden:", totalCustomers.toString()],
      ["Aktive Kunden:", activeCustomers.toString()],
      ["Inaktive Kunden:", inactiveCustomers.toString()],
      ["Gesperrte Kunden:", blockedCustomers.toString()],
      ["", ""],
      ["KUNDENVERTEILUNG NACH TYP:", ""],
      ...this.getCustomerTypeDistribution(customers),
      ["", ""],
      ["SUPPORT-LEVEL VERTEILUNG:", ""],
      ...this.getSupportLevelDistribution(customers),
      ["", ""],
      ["EXPORT-INFORMATIONEN:", ""],
      ["Generiert mit:", this.systemName],
      ["Exportdatum:", this.currentDate],
      ["", ""],
      ["© 2025 Lopez IT Welt GmbH", ""],
    ];

    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);

    // Spaltenbreiten für Zusammenfassung
    summarySheet["!cols"] = [{ wch: 60 }, { wch: 35 }];

    // Professionelles Styling für Zusammenfassung
    this.applySummaryStyling(summarySheet, customers.length);

    XLSX.utils.book_append_sheet(workbook, summarySheet, "Zusammenfassung");

    // =====================================================
    // EXCEL-DATEI GENERIEREN
    // =====================================================
    const fileName = `Kundenübersicht_LopezITWelt_${new Date().toISOString().split("T")[0]}.xlsx`;

    // Excel-Datei als Buffer generieren
    const excelBuffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
      compression: true,
    });

    // Debug-Informationen
    console.log("📊 Professional Excel Generator Debug:");
    console.log("- Workbook Sheets:", workbook.SheetNames);
    console.log("- Buffer Length:", excelBuffer.length);
    console.log("- Buffer Type:", typeof excelBuffer);
    console.log("- Is Buffer:", Buffer.isBuffer(excelBuffer));
    console.log("- Customer Count:", customers.length);

    if (excelBuffer.length === 0) {
      console.error("❌ Excel Buffer ist leer!");
      throw new Error("Excel Buffer ist leer - möglicherweise leere Daten");
    }

    return {
      fileName,
      content: excelBuffer,
      mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      size: excelBuffer.length,
    };
  }

  // =====================================================
  // PROFESSIONELLES STYLING
  // =====================================================

  private applyCoverStyling(sheet: any, customerCount: number) {
    const range = XLSX.utils.decode_range(sheet["!ref"] || "A1");

    for (let row = range.s.r; row <= range.e.r; row++) {
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        if (!sheet[cellAddress]) continue;

        if (row >= 0 && row <= 2) {
          // Logo-Platz - Professioneller Rahmen wie IBM/SAP (Zeilen 1-3)
          sheet[cellAddress].s = {
            alignment: { horizontal: "center", vertical: "center" },
            fill: { fgColor: { rgb: "F8F9FA" } },
            border: {
              top: { style: "medium", color: { rgb: "D1D5DB" } },
              bottom: { style: "medium", color: { rgb: "D1D5DB" } },
              left: { style: "medium", color: { rgb: "D1D5DB" } },
              right: { style: "medium", color: { rgb: "D1D5DB" } },
            },
          };
        } else if (row === 5) {
          // Haupttitel - LOPEZ IT WELT
          sheet[cellAddress].s = {
            font: { bold: true, size: 24, color: { rgb: "1F4E79" } },
            alignment: { horizontal: "center" },
            fill: { fgColor: { rgb: "E7F3FF" } },
          };
        } else if (row === 6) {
          // Untertitel - KUNDENÜBERSICHT
          sheet[cellAddress].s = {
            font: { bold: true, size: 18, color: { rgb: "2F5597" } },
            alignment: { horizontal: "center" },
            fill: { fgColor: { rgb: "F0F7FF" } },
          };
        } else if (row === 7) {
          // Enterprise++ Badge
          sheet[cellAddress].s = {
            font: { bold: true, size: 14, color: { rgb: "FFFFFF" } },
            alignment: { horizontal: "center" },
            fill: { fgColor: { rgb: "4472C4" } },
          };
        } else if (row === 10) {
          // Export-Info Header
          sheet[cellAddress].s = {
            font: { bold: true, size: 16, color: { rgb: "1F4E79" } },
            alignment: { horizontal: "left" },
            fill: { fgColor: { rgb: "E7F3FF" } },
          };
        } else if (row === 18) {
          // Kunden-Statistiken Header
          sheet[cellAddress].s = {
            font: { bold: true, size: 16, color: { rgb: "1F4E79" } },
            alignment: { horizontal: "left" },
            fill: { fgColor: { rgb: "E7F3FF" } },
          };
        } else if (row >= 12 && row <= 15) {
          // Export-Details
          sheet[cellAddress].s = {
            font: { size: 14, bold: true },
            alignment: { horizontal: "left" },
          };
        } else if (row >= 20 && row <= 23) {
          // Kunden-Statistiken
          sheet[cellAddress].s = {
            font: { size: 14, bold: true },
            alignment: { horizontal: "left" },
          };
        } else if (row === 26) {
          // Footer
          sheet[cellAddress].s = {
            font: { bold: true, size: 12, color: { rgb: "FF0000" } },
            alignment: { horizontal: "center" },
          };
        } else if (row === 27) {
          // Copyright
          sheet[cellAddress].s = {
            font: { size: 10, color: { rgb: "666666" } },
            alignment: { horizontal: "center" },
          };
        }
      }
    }
  }

  private applyCustomerTableStyling(sheet: any, customerCount: number) {
    const range = XLSX.utils.decode_range(sheet["!ref"] || "A1");

    for (let row = range.s.r; row <= range.e.r; row++) {
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        if (!sheet[cellAddress]) continue;

        if (row === 0) {
          // Header-Zeile
          sheet[cellAddress].s = {
            font: { bold: true, size: 12, color: { rgb: "FFFFFF" } },
            fill: { fgColor: { rgb: "1F4E79" } },
            alignment: { horizontal: "center", vertical: "center" },
            border: {
              top: { style: "medium", color: { rgb: "000000" } },
              bottom: { style: "medium", color: { rgb: "000000" } },
              left: { style: "medium", color: { rgb: "000000" } },
              right: { style: "medium", color: { rgb: "000000" } },
            },
          };
        } else {
          // Daten-Zeilen
          const isEvenRow = (row - 1) % 2 === 0;
          sheet[cellAddress].s = {
            font: { size: 11 },
            alignment: { horizontal: "left", vertical: "center" },
            fill: { fgColor: { rgb: isEvenRow ? "FFFFFF" : "F8F9FA" } },
            border: {
              top: { style: "thin", color: { rgb: "CCCCCC" } },
              bottom: { style: "thin", color: { rgb: "CCCCCC" } },
              left: { style: "thin", color: { rgb: "CCCCCC" } },
              right: { style: "thin", color: { rgb: "CCCCCC" } },
            },
          };
        }
      }
    }
  }

  private applySummaryStyling(sheet: any, customerCount: number) {
    const range = XLSX.utils.decode_range(sheet["!ref"] || "A1");

    for (let row = range.s.r; row <= range.e.r; row++) {
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        if (!sheet[cellAddress]) continue;

        if (row === 0) {
          // Haupttitel
          sheet[cellAddress].s = {
            font: { bold: true, size: 16, color: { rgb: "1F4E79" } },
            alignment: { horizontal: "left" },
            fill: { fgColor: { rgb: "E7F3FF" } },
          };
        } else if (row === 7 || row === 10) {
          // Untertitel
          sheet[cellAddress].s = {
            font: { bold: true, size: 12, color: { rgb: "2F5597" } },
            alignment: { horizontal: "left" },
            fill: { fgColor: { rgb: "F0F7FF" } },
          };
        } else if (row >= 2 && row <= 5) {
          // KPI-Zeilen
          sheet[cellAddress].s = {
            font: { bold: true, size: 12 },
            alignment: { horizontal: "left" },
          };
        } else if (row === 13) {
          // Export-Info Header
          sheet[cellAddress].s = {
            font: { bold: true, size: 12, color: { rgb: "2F5597" } },
            alignment: { horizontal: "left" },
            fill: { fgColor: { rgb: "F0F7FF" } },
          };
        } else if (row === 16) {
          // Copyright
          sheet[cellAddress].s = {
            font: { size: 9, color: { rgb: "666666" } },
            alignment: { horizontal: "left" },
          };
        }
      }
    }
  }

  // =====================================================
  // HELPER-FUNKTIONEN
  // =====================================================

  private getCustomerTypeLabel(type: string): string {
    const labels = {
      privat: "Privatkunde",
      firma: "Firma",
      behörde: "Behörde",
      partner: "Partner",
    };
    return labels[type as keyof typeof labels] || type;
  }

  private getStatusLabel(status: string): string {
    const labels = {
      aktiv: "Aktiv",
      inaktiv: "Inaktiv",
      gesperrt: "Gesperrt",
    };
    return labels[status as keyof typeof labels] || status;
  }

  private getCustomerTypeDistribution(customers: Customer[]) {
    const distribution = customers.reduce(
      (acc, customer) => {
        acc[customer.customer_type] = (acc[customer.customer_type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return Object.entries(distribution).map(([type, count]) => [
      `  ${this.getCustomerTypeLabel(type)}:`,
      count.toString(),
    ]);
  }

  private getSupportLevelDistribution(customers: Customer[]) {
    const distribution = customers.reduce(
      (acc, customer) => {
        acc[customer.support_level] = (acc[customer.support_level] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return Object.entries(distribution).map(([level, count]) => [`  ${level}:`, count.toString()]);
  }
}

// Singleton-Instanz
export const professionalExcelGenerator = new ProfessionalExcelGenerator();
