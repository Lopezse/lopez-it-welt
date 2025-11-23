// =====================================================
// EXCELJS GENERATOR - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-01-19
// Zweck: Professionelle Excel-Reports mit ExcelJS
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================

import ExcelJS from "exceljs";

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

export class ExcelJSGenerator {
  private companyName = "LOPEZ IT WELT";
  private tagline = "Digital Solutions. Global. Secure.";

  // =====================================================
  // CI-FARBEN & DESIGN - LOPEZ IT WELT
  // =====================================================
  private colors = {
    primary: "1F4E79", // Dunkelblau - Hauptfarbe
    secondary: "2F5597", // Mittelblau - Akzent
    accent: "4A90E2", // Hellblau - Highlights
    background: "F8FAFC", // Sehr helles Grau - Hintergrund
    text: "2C3E50", // Dunkelgrau - Text
    textLight: "7F8C8D", // Mittelgrau - Sekundärtext
    success: "27AE60", // Grün - Erfolg
    warning: "F39C12", // Orange - Warnung
    danger: "E74C3C", // Rot - Fehler
    white: "FFFFFF", // Weiß - Reinweiß
    lightGray: "F5F5F5", // Sehr helles Grau - Zebra-Striping
    darkBlue: "0D47A1", // Sehr dunkelblau - Header
    gold: "FFD700", // Gold - Premium-Akzent
  };

  // =====================================================
  // MANAGEMENT REPORT (PROFESSIONELL)
  // =====================================================
  async generateManagementReport(customers: Customer[], options: any = {}) {
    console.log("📊 ExcelJS Generator: Management Report gestartet");
    console.log("- Kunden Anzahl:", customers.length);

    const workbook = new ExcelJS.Workbook();

    // =====================================================
    // WORKBOOK-VIEWS FÜR KONTINUIERLICHE SEITENNUMMERIERUNG
    // =====================================================
    workbook.views = [
      {
        activeTab: 0,
        firstSheet: 0,
        tabRatio: 0.3,
        showGridLines: true,
        showRuler: true,
        showRowColHeaders: true,
        showZeros: true,
        rightToLeft: false,
        showOutlineSymbols: true,
        showWhiteSpace: true,
      },
    ];

    // =====================================================
    // LOGO LADEN FÜR HEADER
    // =====================================================
    let logoId = "";
    try {
      const fs = require("fs");
      const path = require("path");
      // Versuche PNG zuerst, dann SVG
      let logoPath = path.join(process.cwd(), "public", "logo-hell.png");
      if (!fs.existsSync(logoPath)) {
        logoPath = path.join(process.cwd(), "public", "logo-cookie-banner.svg");
      }

      if (fs.existsSync(logoPath)) {
        const logoBuffer = fs.readFileSync(logoPath);
        const extension = logoPath.endsWith(".svg") ? "svg" : "png";
        logoId = workbook.addImage({
          buffer: logoBuffer,
          extension: extension,
        });
        console.log("✅ Logo erfolgreich geladen für Excel-Header");
      }
    } catch (error) {
      console.log("⚠️ Logo konnte nicht geladen werden:", error);
    }

    // =====================================================
    // DECKBLATT
    // =====================================================
    const coverSheet = workbook.addWorksheet("Deckblatt");

    // Logo und Firmenname (A1)
    if (logoId) {
      // Logo in A1 einfügen
      coverSheet.addImage(logoId, {
        tl: { col: 0, row: 0 },
        br: { col: 2, row: 2 },
      });
    }

    // Firmenname (D1) - neben dem Logo
    const companyCell = coverSheet.getCell("D1");
    companyCell.value = this.companyName;
    companyCell.font = {
      name: "Arial",
      size: 28,
      bold: true,
      color: { argb: this.colors.primary },
    };
    companyCell.alignment = { horizontal: "left", vertical: "middle" };

    // Tagline (A2)
    const taglineCell = coverSheet.getCell("A2");
    taglineCell.value = this.tagline;
    taglineCell.font = {
      name: "Arial",
      size: 14,
      color: { argb: this.colors.secondary },
    };
    taglineCell.alignment = { horizontal: "left", vertical: "middle" };

    // Titel (A5)
    const titleCell = coverSheet.getCell("A5");
    titleCell.value = "KUNDEN-MANAGEMENT REPORT";
    titleCell.font = {
      name: "Arial",
      size: 20,
      bold: true,
      color: { argb: this.colors.primary },
    };

    // =====================================================
    // ENTERPRISE-DECKBLATT-ERWEITERUNG (KOMPAKT)
    // =====================================================

    // Report-ID und Version (A7) - Kompakt
    const reportIdCell = coverSheet.getCell("A7");
    reportIdCell.value = `Report-ID: RPT-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}${String(new Date().getDate()).padStart(2, "0")}-001 | Version: 1.0.0`;
    reportIdCell.font = {
      name: "Arial",
      size: 9,
      color: { argb: this.colors.textLight },
    };

    // Ansprechpartner (A8) - Kompakt
    const contactCell = coverSheet.getCell("A8");
    contactCell.value = "Ansprechpartner: Lopez IT Welt Admin-Team | admin@lopez-it-welt.de";
    contactCell.font = {
      name: "Arial",
      size: 9,
      color: { argb: this.colors.text },
    };

    // QR-Code Platzhalter (F7) - Kompakt
    const qrCell = coverSheet.getCell("F7");
    qrCell.value = "[QR-CODE]";
    qrCell.font = {
      name: "Arial",
      size: 8,
      color: { argb: this.colors.textLight },
    };
    qrCell.alignment = { horizontal: "center", vertical: "middle" };
    qrCell.border = {
      top: { style: "thin", color: { argb: this.colors.textLight } },
      left: { style: "thin", color: { argb: this.colors.textLight } },
      bottom: { style: "thin", color: { argb: this.colors.textLight } },
      right: { style: "thin", color: { argb: this.colors.textLight } },
    };

    // Info-Bereich (A10-A14) - Kompakt
    const infoData = [
      ["Export-Datum:", new Date().toLocaleString("de-DE")],
      ["Anzahl Kunden:", customers.length.toString()],
      ["Aktive Kunden:", customers.filter((c) => c.status === "aktiv").length.toString()],
      ["Inaktive Kunden:", customers.filter((c) => c.status === "inaktiv").length.toString()],
      ["Gesperrte Kunden:", customers.filter((c) => c.status === "gesperrt").length.toString()],
    ];

    infoData.forEach((row, index) => {
      const labelCell = coverSheet.getCell(`A${10 + index}`);
      const valueCell = coverSheet.getCell(`B${10 + index}`);

      labelCell.value = row[0];
      valueCell.value = row[1];

      labelCell.font = {
        name: "Arial",
        size: 12,
        bold: true,
        color: { argb: this.colors.text },
      };
      valueCell.font = {
        name: "Arial",
        size: 12,
        color: { argb: this.colors.primary },
      };
    });

    // Kundentypen (A14-A18)
    const typeHeaderCell = coverSheet.getCell("A14");
    typeHeaderCell.value = "Kundentypen:";
    typeHeaderCell.font = {
      name: "Arial",
      size: 14,
      bold: true,
      color: { argb: this.colors.primary },
    };

    const customerTypes = [
      ["Privat:", customers.filter((c) => c.customer_type === "privat").length.toString()],
      ["Firma:", customers.filter((c) => c.customer_type === "firma").length.toString()],
      ["Behörde:", customers.filter((c) => c.customer_type === "behörde").length.toString()],
      ["Partner:", customers.filter((c) => c.customer_type === "partner").length.toString()],
    ];

    customerTypes.forEach((row, index) => {
      const labelCell = coverSheet.getCell(`A${15 + index}`);
      const valueCell = coverSheet.getCell(`B${15 + index}`);

      labelCell.value = row[0];
      valueCell.value = row[1];

      labelCell.font = {
        name: "Arial",
        size: 12,
        color: { argb: this.colors.text },
      };
      valueCell.font = {
        name: "Arial",
        size: 12,
        color: { argb: this.colors.primary },
      };
    });

    // Support Levels (A20-A24)
    const supportHeaderCell = coverSheet.getCell("A20");
    supportHeaderCell.value = "Support Levels:";
    supportHeaderCell.font = {
      name: "Arial",
      size: 14,
      bold: true,
      color: { argb: this.colors.primary },
    };

    const supportLevels = [
      ["Basic:", customers.filter((c) => c.support_level === "Basic").length.toString()],
      ["Standard:", customers.filter((c) => c.support_level === "Standard").length.toString()],
      ["Premium:", customers.filter((c) => c.support_level === "Premium").length.toString()],
      ["Enterprise:", customers.filter((c) => c.support_level === "Enterprise").length.toString()],
    ];

    supportLevels.forEach((row, index) => {
      const labelCell = coverSheet.getCell(`A${21 + index}`);
      const valueCell = coverSheet.getCell(`B${21 + index}`);

      labelCell.value = row[0];
      valueCell.value = row[1];

      labelCell.font = {
        name: "Arial",
        size: 12,
        color: { argb: this.colors.text },
      };
      valueCell.font = {
        name: "Arial",
        size: 12,
        color: { argb: this.colors.primary },
      };
    });

    // Spaltenbreiten optimieren
    coverSheet.getColumn("A").width = 25;
    coverSheet.getColumn("B").width = 20;
    coverSheet.getColumn("C").width = 15;
    coverSheet.getColumn("D").width = 15;

    // =====================================================
    // KUNDENÜBERSICHT
    // =====================================================
    const customerSheet = workbook.addWorksheet("Kundenübersicht");

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

    // Header-Zeile - Professionelles Enterprise-Design
    const headerRow = customerSheet.getRow(1);
    headerRow.values = headers;
    headerRow.eachCell((cell) => {
      cell.font = {
        name: "Arial",
        size: 12,
        bold: true,
        color: { argb: this.colors.white },
      };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: this.colors.darkBlue }, // Dunkelblau für Header
      };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = {
        top: { style: "thin", color: { argb: this.colors.darkBlue } },
        left: { style: "thin", color: { argb: this.colors.darkBlue } },
        bottom: { style: "thin", color: { argb: this.colors.darkBlue } },
        right: { style: "thin", color: { argb: this.colors.darkBlue } },
      };
    });

    // Kundendaten
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

    customerData.forEach((row, index) => {
      const dataRow = customerSheet.getRow(index + 2);
      dataRow.values = row;

      // Professionelles Zebra-Striping
      dataRow.eachCell((cell, colNumber) => {
        // Zebra-Striping mit besseren Farben
        if (index % 2 === 0) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: this.colors.white },
          };
        } else {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: this.colors.lightGray },
          };
        }

        // Schriftart und -größe
        cell.font = {
          name: "Arial",
          size: 11,
          color: { argb: this.colors.text },
        };
        cell.alignment = { horizontal: "left", vertical: "middle" };

        // Support Level farblich hervorheben
        if (colNumber === 8) {
          // Support Level Spalte
          const supportLevel = row[7];
          if (supportLevel === "Premium") {
            cell.font = {
              name: "Arial",
              size: 11,
              bold: true,
              color: { argb: this.colors.gold },
            };
          } else if (supportLevel === "Enterprise") {
            cell.font = {
              name: "Arial",
              size: 11,
              bold: true,
              color: { argb: this.colors.primary },
            };
          }
        }
      });
    });

    // Spaltenbreiten für eine Seite optimieren
    customerSheet.getColumn("A").width = 12; // Kundentyp
    customerSheet.getColumn("B").width = 8; // Anrede
    customerSheet.getColumn("C").width = 25; // Name/Firma
    customerSheet.getColumn("D").width = 30; // E-Mail
    customerSheet.getColumn("E").width = 15; // Telefon
    customerSheet.getColumn("F").width = 35; // Adresse
    customerSheet.getColumn("G").width = 10; // Status
    customerSheet.getColumn("H").width = 15; // Support Level

    // Rahmen für alle Zellen
    const totalRows = customerData.length + 1;
    for (let row = 1; row <= totalRows; row++) {
      for (let col = 1; col <= 8; col++) {
        const cell = customerSheet.getCell(row, col);
        cell.border = {
          top: { style: "thin", color: { argb: this.colors.textLight } },
          left: { style: "thin", color: { argb: this.colors.textLight } },
          bottom: { style: "thin", color: { argb: this.colors.textLight } },
          right: { style: "thin", color: { argb: this.colors.textLight } },
        };
      }
    }

    // =====================================================
    // ZUSAMMENFASSUNG
    // =====================================================
    const summarySheet = workbook.addWorksheet("Zusammenfassung");

    // =====================================================
    // DIGITALE SIGNATUR / FIRMENSTEMPEL
    // =====================================================

    // Signatur-Bereich (A1:F8)
    const signatureArea = summarySheet.getCell("A1");
    signatureArea.value = "DIGITALE SIGNATUR & FIRMENSTEMPEL";
    signatureArea.font = {
      name: "Arial",
      size: 14,
      bold: true,
      color: { argb: this.colors.primary },
    };

    // Signatur-Details (A3)
    const signatureDetails = summarySheet.getCell("A3");
    signatureDetails.value = `Genehmigt von: Lopez IT Welt Admin-System\nDatum: ${new Date().toLocaleString("de-DE")}\nStatus: Offiziell genehmigt\n\n[ELEKTRONISCHER STEMPEL]\nLopez IT Welt - Digital Solutions Global Secure`;
    signatureDetails.font = {
      name: "Arial",
      size: 10,
      color: { argb: this.colors.text },
    };
    signatureDetails.alignment = {
      horizontal: "left",
      vertical: "top",
      wrapText: true,
    };

    // Signatur-Rahmen
    summarySheet.getCell("A1").border = {
      top: { style: "thick", color: { argb: this.colors.primary } },
      left: { style: "thick", color: { argb: this.colors.primary } },
      bottom: { style: "thick", color: { argb: this.colors.primary } },
      right: { style: "thick", color: { argb: this.colors.primary } },
    };

    // Firmenstempel-Simulation (D3)
    const stampCell = summarySheet.getCell("D3");
    stampCell.value = "OFFICIAL\nSTAMP\n✓ VERIFIED\nLOPEZ IT WELT";
    stampCell.font = {
      name: "Arial",
      size: 8,
      bold: true,
      color: { argb: this.colors.primary },
    };
    stampCell.alignment = {
      horizontal: "center",
      vertical: "middle",
      wrapText: true,
    };
    stampCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: this.colors.lightGray },
    };
    stampCell.border = {
      top: { style: "double", color: { argb: this.colors.primary } },
      left: { style: "double", color: { argb: this.colors.primary } },
      bottom: { style: "double", color: { argb: this.colors.primary } },
      right: { style: "double", color: { argb: this.colors.primary } },
    };

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

    summaryData.forEach((row, index) => {
      const dataRow = summarySheet.getRow(index + 1);
      dataRow.values = row;

      if (index === 0) {
        // Titel
        dataRow.getCell(1).font = {
          name: "Arial",
          size: 18,
          bold: true,
          color: { argb: this.colors.primary },
        };
      } else if (row[0] && row[0].endsWith(":")) {
        // Labels
        dataRow.getCell(1).font = {
          name: "Arial",
          size: 12,
          bold: true,
          color: { argb: this.colors.text },
        };
        dataRow.getCell(2).font = {
          name: "Arial",
          size: 12,
          color: { argb: this.colors.primary },
        };
      }
    });

    summarySheet.getColumn("A").width = 25;
    summarySheet.getColumn("B").width = 20;
    summarySheet.getColumn("C").width = 15;

    // =====================================================
    // HEADER & FOOTER KONFIGURATION
    // =====================================================

    // Header für alle Sheets - Professionelles CI-Design
    const headerText = `&L&"Arial,Bold"Kunden-Management Report – Lopez IT Welt&R&"Arial"${new Date().toLocaleString("de-DE")}`;

    // Footer für alle Sheets - Enterprise-Standard (kontinuierliche Seitennummerierung)
    const footerText = `&L&"Arial"© Lopez IT Welt&C&"Arial"Vertraulich&R&"Arial"Seite &P von &N`;

    // Header/Footer auf alle Sheets anwenden
    [coverSheet, customerSheet, summarySheet].forEach((sheet) => {
      sheet.headerFooter = {
        oddHeader: headerText,
        oddFooter: footerText,
        evenHeader: headerText,
        evenFooter: footerText,
      };
    });

    // =====================================================
    // INDIVIDUELLE SEITENAUFTEILUNG FÜR JEDES SHEET
    // =====================================================

    // Deckblatt - Hochformat
    coverSheet.pageSetup = {
      orientation: "portrait",
      paperSize: 9, // A4
      margins: {
        left: 0.5,
        right: 0.5,
        top: 0.75,
        bottom: 0.75,
        header: 0.3,
        footer: 0.3,
      },
      fitToPage: false,
      scale: 100,
    };

    // Zusammenfassung - Hochformat
    summarySheet.pageSetup = {
      orientation: "portrait",
      paperSize: 9, // A4
      margins: {
        left: 0.5,
        right: 0.5,
        top: 0.75,
        bottom: 0.75,
        header: 0.3,
        footer: 0.3,
      },
      fitToPage: false,
      scale: 100,
    };

    // =====================================================
    // DRUCKOPTIMIERUNG FÜR KUNDENTABELLE
    // =====================================================

    // Spezielle Konfiguration für Kundentabelle (Querformat)
    customerSheet.pageSetup = {
      orientation: "landscape", // Querformat für bessere Übersicht
      paperSize: 9, // A4
      margins: {
        left: 0.5,
        right: 0.5,
        top: 0.75,
        bottom: 0.75,
        header: 0.3,
        footer: 0.3,
      },
      fitToPage: false, // Wichtig für korrekte Seitenzahlen
      printArea: "A1:H" + (customerData.length + 1),
      scale: 85, // Skalierung für bessere Darstellung
    };

    // =====================================================
    // EXCEL BUFFER ERSTELLEN
    // =====================================================
    const excelBuffer = await workbook.xlsx.writeBuffer();

    console.log("✅ ExcelJS Generator: Management Report erfolgreich generiert");
    console.log("- Buffer Länge:", excelBuffer.length);
    console.log("- Kunden Anzahl:", customers.length);

    return {
      content: excelBuffer,
      fileName: `Lopez_IT_Welt_Management_Report_${new Date().toISOString().split("T")[0]}.xlsx`,
      mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    };
  }

  public async generateTechnicalExport(customers: Customer[], options: any = {}) {
    console.log("📊 ExcelJS Generator: Technical Export gestartet");

    const workbook = new ExcelJS.Workbook();

    // =====================================================
    // WORKBOOK-VIEWS FÜR KONTINUIERLICHE SEITENNUMMERIERUNG
    // =====================================================
    workbook.views = [
      {
        activeTab: 0,
        firstSheet: 0,
        tabRatio: 0.3,
        showGridLines: true,
        showRuler: true,
        showRowColHeaders: true,
        showZeros: true,
        rightToLeft: false,
        showOutlineSymbols: true,
        showWhiteSpace: true,
      },
    ];

    // Raw Data Sheet
    const rawSheet = workbook.addWorksheet("Raw_Data");
    const rawHeaders = Object.keys(customers[0] || {});
    const rawData = customers.map((customer) => rawHeaders.map((header) => customer[header]));

    rawSheet.addRow(rawHeaders);
    rawData.forEach((row) => rawSheet.addRow(row));

    // Metadata Sheet
    const metadataSheet = workbook.addWorksheet("Metadata");
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
        "Muster AG",
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

    metadata.forEach((row) => metadataSheet.addRow(row));

    const excelBuffer = await workbook.xlsx.writeBuffer();

    console.log("✅ ExcelJS Generator: Technical Export erfolgreich generiert");
    console.log("- Buffer Länge:", excelBuffer.length);
    console.log("- Kunden Anzahl:", customers.length);

    return {
      content: excelBuffer,
      fileName: `Lopez_IT_Welt_Technical_Export_${new Date().toISOString().split("T")[0]}.xlsx`,
      mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    };
  }

  // =====================================================
  // LOGO HELPER
  // =====================================================
  private getLogoBase64(): string {
    try {
      const fs = require("fs");
      const path = require("path");

      const logoFormats = [
        "logo-header.png",
        "logo-dunkel.png",
        "logo-hell.png",
        "ramiro-lopez.png",
      ];

      for (const format of logoFormats) {
        const logoPath = path.join(process.cwd(), "public", format);
        if (fs.existsSync(logoPath)) {
          const logoBuffer = fs.readFileSync(logoPath);
          return logoBuffer.toString("base64");
        }
      }
    } catch (error) {
      console.error("❌ Fehler beim Laden des Logos:", error);
    }

    return "";
  }
}
