// =====================================================
// EXCEL TEMPLATE GENERATOR - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-01-19
// Zweck: Excel-Vorlagen erstellen (wie IBM/SAP/Siemens)
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================

import fs from "fs";
import path from "path";
import * as XLSX from "xlsx";

export class ExcelTemplateGenerator {
  private companyName = "Lopez IT Welt GmbH";
  private tagline = "Digital Solutions. Global. Secure.";
  private currentDate = new Date().toLocaleString("de-DE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  // =====================================================
  // CI-FARBEN & DESIGN (Enterprise-Standard)
  // =====================================================
  private colors = {
    primary: "#1F4E79", // Dunkelblau (Hauptfarbe)
    secondary: "#2F5597", // Mittelblau
    accent: "#00CFFF", // Hellblau (Akzent)
    gradient: "#004CFF", // Gradient-Blau
    background: "#F8F9FA", // Heller Hintergrund
    white: "#FFFFFF", // Weiß
    text: "#222222", // Dunkler Text
    textLight: "#555555", // Heller Text
    border: "#D1D5DB", // Grauer Rahmen
    success: "#10B981", // Grün
    warning: "#F59E0B", // Orange
    error: "#EF4444", // Rot
  };

  // =====================================================
  // VORLAGE GENERIEREN
  // =====================================================
  async generateTemplate(templateType: "management" | "technical" = "management") {
    const workbook = XLSX.utils.book_new();

    if (templateType === "management") {
      // Management-Vorlage
      const coverTemplate = this.createCoverTemplate();
      XLSX.utils.book_append_sheet(workbook, coverTemplate, "Deckblatt");

      const customerTemplate = this.createCustomerTableTemplate();
      XLSX.utils.book_append_sheet(workbook, customerTemplate, "Kundenübersicht");

      const summaryTemplate = this.createSummaryTemplate();
      XLSX.utils.book_append_sheet(workbook, summaryTemplate, "Zusammenfassung");

      // Logo einfügen
      await this.addLogoToTemplate(workbook, coverTemplate);
    } else {
      // Technische Vorlage
      const rawDataTemplate = this.createRawDataTemplate();
      XLSX.utils.book_append_sheet(workbook, rawDataTemplate, "Raw_Data");

      const metadataTemplate = this.createMetadataTemplate();
      XLSX.utils.book_append_sheet(workbook, metadataTemplate, "Metadata");
    }

    // Excel-Datei generieren
    const excelBuffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
      compression: true,
    });

    return {
      content: excelBuffer,
      fileName: `Lopez_IT_Welt_Template_${templateType}_${new Date().toISOString().split("T")[0]}.xlsx`,
      mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    };
  }

  // =====================================================
  // DECKBLATT-VORLAGE
  // =====================================================
  private createCoverTemplate(): XLSX.WorkSheet {
    const coverData = [
      // Zeile 1-4: Logo-Platz
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],

      // Zeile 7: Haupttitel
      ["", "", "LOPEZ IT WELT GMBH", "", "", "", "", "", ""],

      // Zeile 8: Tagline
      ["", "", "Digital Solutions. Global. Secure.", "", "", "", "", "", ""],

      // Zeile 9: Report-Titel
      ["", "", "KUNDENÜBERSICHT", "", "", "", "", "", ""],

      // Zeile 10: Enterprise++ Badge
      ["", "", "ENTERPRISE++ VERSION", "", "", "", "", "", ""],

      // Zeile 11-12: Leer
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],

      // Zeile 13: Report-Info Header
      ["", "", "REPORT-INFORMATIONEN", "", "", "", "", "", ""],

      // Zeile 14: Leer
      ["", "", "", "", "", "", "", "", ""],

      // Zeile 15-18: Report-Details (PLATZHALTER)
      ["", "", "Erstellt am:", "{{DATUM}}", "", "", "", "", ""],
      ["", "", "Verantwortlich:", "{{VERANTWORTLICH}}", "", "", "", "", ""],
      ["", "", "Gesamt Kunden:", "{{KUNDEN_ANZAHL}}", "", "", "", "", ""],
      ["", "", "System:", "Lopez IT Welt Admin-System", "", "", "", "", ""],

      // Zeile 19-20: Leer
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],

      // Zeile 21: Kunden-Statistiken Header
      ["", "", "KUNDEN-STATISTIKEN", "", "", "", "", "", ""],

      // Zeile 22: Leer
      ["", "", "", "", "", "", "", "", ""],

      // Zeile 23-26: Kunden-Statistiken (PLATZHALTER)
      ["", "", "Aktive Kunden:", "{{AKTIVE_KUNDEN}}", "", "", "", "", ""],
      ["", "", "Inaktive Kunden:", "{{INAKTIVE_KUNDEN}}", "", "", "", "", ""],
      ["", "", "Gesperrte Kunden:", "{{GESPERRTE_KUNDEN}}", "", "", "", "", ""],
      ["", "", "Premium-Kunden:", "{{PREMIUM_KUNDEN}}", "", "", "", "", ""],

      // Zeile 27-28: Leer
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],

      // Zeile 29: Footer
      ["", "", "VERTRAULICH - NUR FÜR DEN INTERNEN GEBRAUCH", "", "", "", "", "", ""],

      // Zeile 30: Copyright
      ["", "", "© 2025 Lopez IT Welt GmbH - Alle Rechte vorbehalten", "", "", "", "", "", ""],
    ];

    const coverSheet = XLSX.utils.aoa_to_sheet(coverData);

    // Spaltenbreiten
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

    // Zeilenhöhen
    coverSheet["!rows"] = [
      { hpt: 60 }, // Zeile 1 - Logo-Platz
      { hpt: 60 }, // Zeile 2 - Logo-Platz
      { hpt: 60 }, // Zeile 3 - Logo-Platz
      { hpt: 60 }, // Zeile 4 - Logo-Platz
      { hpt: 20 }, // Zeile 5
      { hpt: 20 }, // Zeile 6
      { hpt: 35 }, // Zeile 7 - Haupttitel
      { hpt: 20 }, // Zeile 8 - Tagline
      { hpt: 30 }, // Zeile 9 - Report-Titel
      { hpt: 20 }, // Zeile 10 - Badge
      { hpt: 20 }, // Zeile 11
      { hpt: 20 }, // Zeile 12
      { hpt: 25 }, // Zeile 13 - Report-Info Header
      { hpt: 20 }, // Zeile 14
      { hpt: 20 }, // Zeile 15 - Report-Details
      { hpt: 20 }, // Zeile 16
      { hpt: 20 }, // Zeile 17
      { hpt: 20 }, // Zeile 18
      { hpt: 20 }, // Zeile 19
      { hpt: 20 }, // Zeile 20
      { hpt: 25 }, // Zeile 21 - Statistiken Header
      { hpt: 20 }, // Zeile 22
      { hpt: 20 }, // Zeile 23 - Statistiken
      { hpt: 20 }, // Zeile 24
      { hpt: 20 }, // Zeile 25
      { hpt: 20 }, // Zeile 26
      { hpt: 20 }, // Zeile 27
      { hpt: 20 }, // Zeile 28
      { hpt: 20 }, // Zeile 29 - Footer
      { hpt: 20 }, // Zeile 30 - Copyright
    ];

    // Styling anwenden
    this.applyCoverStyling(coverSheet);

    return coverSheet;
  }

  // =====================================================
  // KUNDENTABELLE-VORLAGE
  // =====================================================
  private createCustomerTableTemplate(): XLSX.WorkSheet {
    const headers = [
      "Kundentyp",
      "Anrede",
      "Name/Firma",
      "E-Mail",
      "Telefon",
      "Adresse",
      "Status",
      "Support-Level",
      "Erstellungsdatum",
    ];

    // Beispiel-Daten für Vorlage
    const exampleData = [
      [
        "{{KUNDENTYP}}",
        "{{ANREDE}}",
        "{{NAME_FIRMA}}",
        "{{EMAIL}}",
        "{{TELEFON}}",
        "{{ADRESSE}}",
        "{{STATUS}}",
        "{{SUPPORT_LEVEL}}",
        "{{ERSTELLUNGSDATUM}}",
      ],
      [
        "{{KUNDENTYP}}",
        "{{ANREDE}}",
        "{{NAME_FIRMA}}",
        "{{EMAIL}}",
        "{{TELEFON}}",
        "{{ADRESSE}}",
        "{{STATUS}}",
        "{{SUPPORT_LEVEL}}",
        "{{ERSTELLUNGSDATUM}}",
      ],
      [
        "{{KUNDENTYP}}",
        "{{ANREDE}}",
        "{{NAME_FIRMA}}",
        "{{EMAIL}}",
        "{{TELEFON}}",
        "{{ADRESSE}}",
        "{{STATUS}}",
        "{{SUPPORT_LEVEL}}",
        "{{ERSTELLUNGSDATUM}}",
      ],
    ];

    const customerData = [headers, ...exampleData];
    const customerSheet = XLSX.utils.aoa_to_sheet(customerData);

    // Spaltenbreiten
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

    // Styling anwenden
    this.applyCustomerTableStyling(customerSheet);

    return customerSheet;
  }

  // =====================================================
  // ZUSAMMENFASSUNG-VORLAGE
  // =====================================================
  private createSummaryTemplate(): XLSX.WorkSheet {
    const summaryData = [
      ["KUNDEN-STATISTIKEN & ANALYSEN", ""],
      ["", ""],
      ["Gesamt Kunden:", "{{GESAMT_KUNDEN}}"],
      ["Aktive Kunden:", "{{AKTIVE_KUNDEN}}"],
      ["Inaktive Kunden:", "{{INAKTIVE_KUNDEN}}"],
      ["Gesperrte Kunden:", "{{GESPERRTE_KUNDEN}}"],
      ["", ""],
      ["SUPPORT-LEVEL VERTEILUNG:", ""],
      ["Basic:", "{{BASIC_KUNDEN}}"],
      ["Standard:", "{{STANDARD_KUNDEN}}"],
      ["Premium:", "{{PREMIUM_KUNDEN}}"],
      ["Enterprise:", "{{ENTERPRISE_KUNDEN}}"],
      ["", ""],
      ["KUNDENTYP VERTEILUNG:", ""],
      ["Privat:", "{{PRIVAT_KUNDEN}}"],
      ["Firma:", "{{FIRMA_KUNDEN}}"],
      ["Behörde:", "{{BEHOERDE_KUNDEN}}"],
      ["Partner:", "{{PARTNER_KUNDEN}}"],
      ["", ""],
      ["EXPORT-INFORMATIONEN:", ""],
      ["Erstellt am:", "{{DATUM}}"],
      ["System:", "Lopez IT Welt Admin-System"],
      ["Version:", "Enterprise++ 1.0.0"],
      ["", ""],
      ["© 2025 Lopez IT Welt GmbH", ""],
    ];

    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);

    // Spaltenbreiten
    summarySheet["!cols"] = [{ wch: 60 }, { wch: 35 }];

    // Styling anwenden
    this.applySummaryStyling(summarySheet);

    return summarySheet;
  }

  // =====================================================
  // ROHDATEN-VORLAGE
  // =====================================================
  private createRawDataTemplate(): XLSX.WorkSheet {
    const headers = [
      "id",
      "customer_type",
      "anrede",
      "titel",
      "vorname",
      "nachname",
      "company_name",
      "ust_id",
      "email",
      "telefon",
      "strasse",
      "hausnummer",
      "plz",
      "ort",
      "land",
      "status",
      "support_level",
      "notes",
      "created_at",
      "updated_at",
    ];

    // Beispiel-Daten für Vorlage
    const exampleData = [
      [
        "{{ID}}",
        "{{CUSTOMER_TYPE}}",
        "{{ANREDE}}",
        "{{TITEL}}",
        "{{VORNAME}}",
        "{{NACHNAME}}",
        "{{COMPANY_NAME}}",
        "{{UST_ID}}",
        "{{EMAIL}}",
        "{{TELEFON}}",
        "{{STRASSE}}",
        "{{HAUSNUMMER}}",
        "{{PLZ}}",
        "{{ORT}}",
        "{{LAND}}",
        "{{STATUS}}",
        "{{SUPPORT_LEVEL}}",
        "{{NOTES}}",
        "{{CREATED_AT}}",
        "{{UPDATED_AT}}",
      ],
    ];

    const rawData = [headers, ...exampleData];
    const rawSheet = XLSX.utils.aoa_to_sheet(rawData);

    // Spaltenbreiten
    rawSheet["!cols"] = headers.map(() => ({ wch: 20 }));

    return rawSheet;
  }

  // =====================================================
  // METADATA-VORLAGE
  // =====================================================
  private createMetadataTemplate(): XLSX.WorkSheet {
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

    // Spaltenbreiten
    metadataSheet["!cols"] = [
      { wch: 20 }, // Field Name
      { wch: 60 }, // Description
      { wch: 20 }, // Type
      { wch: 30 }, // Example
    ];

    return metadataSheet;
  }

  // =====================================================
  // LOGO IN VORLAGE EINFÜGEN
  // =====================================================
  private async addLogoToTemplate(workbook: XLSX.WorkBook, sheet: XLSX.WorkSheet) {
    try {
      const logoPath = path.join(process.cwd(), "public", "logo.svg");
      const logoSvg = fs.readFileSync(logoPath, "utf8");
      const base64Logo = Buffer.from(logoSvg).toString("base64");

      // Logo-Platz in Excel erstellen (A1-D4)
      for (let row = 0; row <= 3; row++) {
        for (let col = 0; col <= 3; col++) {
          const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
          sheet[cellAddress] = { v: "", t: "s" };

          // Logo-Styling für alle Zellen im Logo-Bereich
          sheet[cellAddress].s = {
            alignment: { horizontal: "center", vertical: "center" },
            fill: { fgColor: { rgb: this.colors.background.replace("#", "") } },
            border: {
              top: {
                style: "thick",
                color: { rgb: this.colors.primary.replace("#", "") },
              },
              bottom: {
                style: "thick",
                color: { rgb: this.colors.primary.replace("#", "") },
              },
              left: {
                style: "thick",
                color: { rgb: this.colors.primary.replace("#", "") },
              },
              right: {
                style: "thick",
                color: { rgb: this.colors.primary.replace("#", "") },
              },
            },
          };
        }
      }

      // Logo-Text in der Mitte (A2)
      const logoTextCell = XLSX.utils.encode_cell({ r: 1, c: 0 });
      sheet[logoTextCell] = { v: "LOPEZ IT WELT", t: "s" };
      sheet[logoTextCell].s = {
        font: {
          bold: true,
          size: 20,
          color: { rgb: this.colors.primary.replace("#", "") },
        },
        alignment: { horizontal: "center", vertical: "center" },
        fill: { fgColor: { rgb: this.colors.background.replace("#", "") } },
      };

      console.log("✅ Logo in Excel-Vorlage erfolgreich eingefügt");
    } catch (error) {
      console.error("❌ Fehler beim Einfügen des Logos in Vorlage:", error);
    }
  }

  // =====================================================
  // STYLING METHODEN
  // =====================================================
  private applyCoverStyling(sheet: XLSX.WorkSheet) {
    const range = XLSX.utils.decode_range(sheet["!ref"] || "A1");

    for (let row = range.s.r; row <= range.e.r; row++) {
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        if (!sheet[cellAddress]) continue;

        if (row >= 0 && row <= 3) {
          // Logo-Platz
          sheet[cellAddress].s = {
            alignment: { horizontal: "center", vertical: "center" },
            fill: { fgColor: { rgb: this.colors.background.replace("#", "") } },
            border: {
              top: {
                style: "thick",
                color: { rgb: this.colors.primary.replace("#", "") },
              },
              bottom: {
                style: "thick",
                color: { rgb: this.colors.primary.replace("#", "") },
              },
              left: {
                style: "thick",
                color: { rgb: this.colors.primary.replace("#", "") },
              },
              right: {
                style: "thick",
                color: { rgb: this.colors.primary.replace("#", "") },
              },
            },
          };
        } else if (row === 6) {
          // Haupttitel
          sheet[cellAddress].s = {
            font: {
              bold: true,
              size: 28,
              color: { rgb: this.colors.primary.replace("#", "") },
            },
            alignment: { horizontal: "center" },
            fill: { fgColor: { rgb: this.colors.background.replace("#", "") } },
          };
        } else if (row === 7) {
          // Tagline
          sheet[cellAddress].s = {
            font: {
              size: 16,
              color: { rgb: this.colors.textLight.replace("#", "") },
            },
            alignment: { horizontal: "center" },
            fill: { fgColor: { rgb: this.colors.background.replace("#", "") } },
          };
        } else if (row === 8) {
          // Report-Titel
          sheet[cellAddress].s = {
            font: {
              bold: true,
              size: 22,
              color: { rgb: this.colors.secondary.replace("#", "") },
            },
            alignment: { horizontal: "center" },
            fill: { fgColor: { rgb: this.colors.background.replace("#", "") } },
          };
        } else if (row === 9) {
          // Badge
          sheet[cellAddress].s = {
            font: {
              bold: true,
              size: 14,
              color: { rgb: this.colors.accent.replace("#", "") },
            },
            alignment: { horizontal: "center" },
            fill: { fgColor: { rgb: this.colors.background.replace("#", "") } },
          };
        } else if (row === 12 || row === 20) {
          // Headers
          sheet[cellAddress].s = {
            font: {
              bold: true,
              size: 18,
              color: { rgb: this.colors.primary.replace("#", "") },
            },
            alignment: { horizontal: "left" },
            fill: { fgColor: { rgb: this.colors.background.replace("#", "") } },
          };
        } else if (row >= 14 && row <= 17) {
          // Report-Details
          sheet[cellAddress].s = {
            font: {
              size: 12,
              color: { rgb: this.colors.text.replace("#", "") },
            },
            alignment: { horizontal: "left" },
            fill: { fgColor: { rgb: this.colors.background.replace("#", "") } },
          };
        } else if (row >= 22 && row <= 25) {
          // Statistiken
          sheet[cellAddress].s = {
            font: {
              size: 12,
              color: { rgb: this.colors.text.replace("#", "") },
            },
            alignment: { horizontal: "left" },
            fill: { fgColor: { rgb: this.colors.background.replace("#", "") } },
          };
        } else if (row === 28) {
          // Footer
          sheet[cellAddress].s = {
            font: {
              bold: true,
              size: 12,
              color: { rgb: this.colors.textLight.replace("#", "") },
            },
            alignment: { horizontal: "center" },
            fill: { fgColor: { rgb: this.colors.background.replace("#", "") } },
          };
        } else if (row === 29) {
          // Copyright
          sheet[cellAddress].s = {
            font: {
              size: 10,
              color: { rgb: this.colors.textLight.replace("#", "") },
            },
            alignment: { horizontal: "center" },
            fill: { fgColor: { rgb: this.colors.background.replace("#", "") } },
          };
        }
      }
    }
  }

  private applyCustomerTableStyling(sheet: XLSX.WorkSheet) {
    const range = XLSX.utils.decode_range(sheet["!ref"] || "A1");

    for (let row = range.s.r; row <= range.e.r; row++) {
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        if (!sheet[cellAddress]) continue;

        if (row === 0) {
          // Header
          sheet[cellAddress].s = {
            font: { bold: true, size: 12, color: { rgb: "FFFFFF" } },
            alignment: { horizontal: "center", vertical: "center" },
            fill: { fgColor: { rgb: this.colors.primary.replace("#", "") } },
            border: {
              top: {
                style: "thin",
                color: { rgb: this.colors.border.replace("#", "") },
              },
              bottom: {
                style: "thin",
                color: { rgb: this.colors.border.replace("#", "") },
              },
              left: {
                style: "thin",
                color: { rgb: this.colors.border.replace("#", "") },
              },
              right: {
                style: "thin",
                color: { rgb: this.colors.border.replace("#", "") },
              },
            },
          };
        } else {
          // Datenzeilen
          const isEvenRow = (row - 1) % 2 === 0;
          sheet[cellAddress].s = {
            font: {
              size: 11,
              color: { rgb: this.colors.text.replace("#", "") },
            },
            alignment: { horizontal: "left", vertical: "center" },
            fill: {
              fgColor: {
                rgb: isEvenRow ? this.colors.background.replace("#", "") : "FFFFFF",
              },
            },
            border: {
              top: {
                style: "thin",
                color: { rgb: this.colors.border.replace("#", "") },
              },
              bottom: {
                style: "thin",
                color: { rgb: this.colors.border.replace("#", "") },
              },
              left: {
                style: "thin",
                color: { rgb: this.colors.border.replace("#", "") },
              },
              right: {
                style: "thin",
                color: { rgb: this.colors.border.replace("#", "") },
              },
            },
          };
        }
      }
    }
  }

  private applySummaryStyling(sheet: XLSX.WorkSheet) {
    const range = XLSX.utils.decode_range(sheet["!ref"] || "A1");

    for (let row = range.s.r; row <= range.e.r; row++) {
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        if (!sheet[cellAddress]) continue;

        if (row === 0) {
          // Haupttitel
          sheet[cellAddress].s = {
            font: {
              bold: true,
              size: 20,
              color: { rgb: this.colors.primary.replace("#", "") },
            },
            alignment: { horizontal: "left" },
            fill: { fgColor: { rgb: this.colors.background.replace("#", "") } },
          };
        } else if (row === 2 || row === 7 || row === 12) {
          // Untertitel
          sheet[cellAddress].s = {
            font: {
              bold: true,
              size: 16,
              color: { rgb: this.colors.secondary.replace("#", "") },
            },
            alignment: { horizontal: "left" },
            fill: { fgColor: { rgb: this.colors.background.replace("#", "") } },
          };
        } else if (row >= 3 && row <= 5) {
          // Hauptstatistiken
          sheet[cellAddress].s = {
            font: {
              size: 12,
              color: { rgb: this.colors.text.replace("#", "") },
            },
            alignment: { horizontal: "left" },
            fill: { fgColor: { rgb: this.colors.background.replace("#", "") } },
          };
        } else if (row >= 8 && row <= 11) {
          // Support-Level
          sheet[cellAddress].s = {
            font: {
              size: 11,
              color: { rgb: this.colors.text.replace("#", "") },
            },
            alignment: { horizontal: "left" },
            fill: { fgColor: { rgb: this.colors.background.replace("#", "") } },
          };
        } else if (row >= 13 && row <= 16) {
          // Kundentyp
          sheet[cellAddress].s = {
            font: {
              size: 11,
              color: { rgb: this.colors.text.replace("#", "") },
            },
            alignment: { horizontal: "left" },
            fill: { fgColor: { rgb: this.colors.background.replace("#", "") } },
          };
        } else if (row >= 18 && row <= 21) {
          // Export-Info
          sheet[cellAddress].s = {
            font: {
              size: 10,
              color: { rgb: this.colors.textLight.replace("#", "") },
            },
            alignment: { horizontal: "left" },
            fill: { fgColor: { rgb: this.colors.background.replace("#", "") } },
          };
        } else if (row === 23) {
          // Copyright
          sheet[cellAddress].s = {
            font: {
              size: 10,
              color: { rgb: this.colors.textLight.replace("#", "") },
            },
            alignment: { horizontal: "left" },
            fill: { fgColor: { rgb: this.colors.background.replace("#", "") } },
          };
        }
      }
    }
  }
}
