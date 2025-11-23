// =====================================================
// MANAGEMENT REPORT GENERATOR - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-01-19
// Zweck: Management-Report mit CI-Farben und Logo (wie IBM/SAP/Siemens)
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

export class ManagementReportGenerator {
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
  // MANAGEMENT-REPORT GENERIEREN
  // =====================================================
  async generateManagementReport(customers: Customer[], options: any = {}) {
    const workbook = XLSX.utils.book_new();

    // =====================================================
    // DECKBLATT MIT LOGO & CI
    // =====================================================
    const coverSheet = await this.createCoverSheet(customers);
    XLSX.utils.book_append_sheet(workbook, coverSheet, "Deckblatt");

    // =====================================================
    // KUNDENÜBERSICHT (Formatiert)
    // =====================================================
    const customerSheet = this.createCustomerOverview(customers);
    XLSX.utils.book_append_sheet(workbook, customerSheet, "Kundenübersicht");

    // =====================================================
    // STATISTIKEN & ANALYSEN
    // =====================================================
    const statsSheet = this.createStatisticsSheet(customers);
    XLSX.utils.book_append_sheet(workbook, statsSheet, "Statistiken");

    // =====================================================
    // EXCEL DATEI GENERIEREN
    // =====================================================
    const excelBuffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
      compression: true,
    });

    console.log("✅ Management Report erfolgreich generiert");
    console.log("📊 Buffer Länge:", excelBuffer.length);
    console.log("📊 Kunden Anzahl:", customers.length);

    return {
      content: excelBuffer,
      fileName: `Lopez_IT_Welt_Management_Report_${new Date().toISOString().split("T")[0]}.xlsx`,
      mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    };
  }

  // =====================================================
  // DECKBLATT MIT LOGO & CI
  // =====================================================
  private async createCoverSheet(customers: Customer[]): Promise<XLSX.WorkSheet> {
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

      // Zeile 15-18: Report-Details
      ["", "", "Erstellt am:", this.currentDate, "", "", "", "", ""],
      ["", "", "Verantwortlich:", "Management Lopez IT Welt", "", "", "", "", ""],
      ["", "", "Gesamt Kunden:", customers.length.toString(), "", "", "", "", ""],
      ["", "", "System:", "Lopez IT Welt Admin-System", "", "", "", "", ""],

      // Zeile 19-20: Leer
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],

      // Zeile 21: Kunden-Statistiken Header
      ["", "", "KUNDEN-STATISTIKEN", "", "", "", "", "", ""],

      // Zeile 22: Leer
      ["", "", "", "", "", "", "", "", ""],

      // Zeile 23-26: Kunden-Statistiken
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

    // Logo einfügen
    await this.addLogoToCover(coverSheet);

    // Styling anwenden
    this.applyCoverStyling(coverSheet, customers.length);

    return coverSheet;
  }

  // =====================================================
  // LOGO IN DECKBLATT EINFÜGEN (AUS DATEI)
  // =====================================================
  private async addLogoToCover(sheet: XLSX.WorkSheet) {
    try {
      // Logo aus Datei laden

      let logoText = "LOPEZ IT WELT";
      let logoSvg = "";

      try {
        const logoPath = path.join(process.cwd(), "public", "logo.svg");
        logoSvg = fs.readFileSync(logoPath, "utf8");
        console.log("✅ Logo aus Datei geladen:", logoPath);
      } catch (fileError) {
        console.log("⚠️ Logo-Datei nicht gefunden, verwende Text-Logo");
      }

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

      // SVG-Logo als Base64 einbetten
      if (logoSvg) {
        try {
          const base64Logo = Buffer.from(logoSvg).toString("base64");

          // Logo als Bild in Excel einbetten
          if (!sheet["!images"]) sheet["!images"] = [];
          sheet["!images"].push({
            image: `data:image/svg+xml;base64,${base64Logo}`,
            range: { s: { c: 0, r: 0 }, e: { c: 3, r: 3 } }, // A1 to D4
          });

          console.log("✅ SVG-Logo als Base64 in Excel eingebettet");
        } catch (base64Error) {
          console.log("⚠️ Fehler beim Base64-Konvertieren, verwende Text-Logo");
          // Fallback: Text-Logo
          const logoTextCell = XLSX.utils.encode_cell({ r: 1, c: 0 });
          sheet[logoTextCell] = { v: logoText, t: "s" };
          sheet[logoTextCell].s = {
            font: {
              bold: true,
              size: 20,
              color: { rgb: this.colors.primary.replace("#", "") },
            },
            alignment: { horizontal: "center", vertical: "center" },
            fill: { fgColor: { rgb: this.colors.background.replace("#", "") } },
          };
        }
      } else {
        // Fallback: Text-Logo
        const logoTextCell = XLSX.utils.encode_cell({ r: 1, c: 0 });
        sheet[logoTextCell] = { v: logoText, t: "s" };
        sheet[logoTextCell].s = {
          font: {
            bold: true,
            size: 20,
            color: { rgb: this.colors.primary.replace("#", "") },
          },
          alignment: { horizontal: "center", vertical: "center" },
          fill: { fgColor: { rgb: this.colors.background.replace("#", "") } },
        };
      }

      // Zellen A1-D4 zusammenführen für Logo-Bereich
      if (!sheet["!merges"]) sheet["!merges"] = [];
      sheet["!merges"].push({ s: { r: 0, c: 0 }, e: { r: 3, c: 3 } });

      console.log("✅ Logo in Management Report erfolgreich eingefügt");
    } catch (error) {
      console.error("❌ Fehler beim Einfügen des Logos:", error);
    }
  }

  // =====================================================
  // KUNDENÜBERSICHT (Formatiert)
  // =====================================================
  private createCustomerOverview(customers: Customer[]): XLSX.WorkSheet {
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

    const customerRows = customers.map((customer) => [
      customer.customer_type,
      customer.anrede,
      customer.company_name || `${customer.vorname} ${customer.nachname}`,
      customer.email,
      customer.telefon || "",
      `${customer.strasse || ""} ${customer.hausnummer || ""}, ${customer.plz || ""} ${customer.ort || ""}`.trim(),
      customer.status,
      customer.support_level,
      new Date(customer.created_at).toLocaleDateString("de-DE"),
    ]);

    const customerData = [headers, ...customerRows];
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
    this.applyCustomerTableStyling(customerSheet, customers.length);

    return customerSheet;
  }

  // =====================================================
  // STATISTIKEN & ANALYSEN
  // =====================================================
  private createStatisticsSheet(customers: Customer[]): XLSX.WorkSheet {
    const statsData = [
      ["KUNDEN-STATISTIKEN & ANALYSEN", ""],
      ["", ""],
      ["Gesamt Kunden:", customers.length.toString()],
      ["Aktive Kunden:", customers.filter((c) => c.status === "aktiv").length.toString()],
      ["Inaktive Kunden:", customers.filter((c) => c.status === "inaktiv").length.toString()],
      ["Gesperrte Kunden:", customers.filter((c) => c.status === "gesperrt").length.toString()],
      ["", ""],
      ["SUPPORT-LEVEL VERTEILUNG:", ""],
      ["Basic:", customers.filter((c) => c.support_level === "Basic").length.toString()],
      ["Standard:", customers.filter((c) => c.support_level === "Standard").length.toString()],
      ["Premium:", customers.filter((c) => c.support_level === "Premium").length.toString()],
      ["Enterprise:", customers.filter((c) => c.support_level === "Enterprise").length.toString()],
      ["", ""],
      ["KUNDENTYP VERTEILUNG:", ""],
      ["Privat:", customers.filter((c) => c.customer_type === "privat").length.toString()],
      ["Firma:", customers.filter((c) => c.customer_type === "firma").length.toString()],
      ["Behörde:", customers.filter((c) => c.customer_type === "behörde").length.toString()],
      ["Partner:", customers.filter((c) => c.customer_type === "partner").length.toString()],
      ["", ""],
      ["EXPORT-INFORMATIONEN:", ""],
      ["Erstellt am:", this.currentDate],
      ["System:", "Lopez IT Welt Admin-System"],
      ["Version:", "Enterprise++ 1.0.0"],
      ["", ""],
      ["© 2025 Lopez IT Welt GmbH", ""],
    ];

    const statsSheet = XLSX.utils.aoa_to_sheet(statsData);

    // Spaltenbreiten
    statsSheet["!cols"] = [{ wch: 60 }, { wch: 35 }];

    // Styling anwenden
    this.applyStatisticsStyling(statsSheet, customers.length);

    return statsSheet;
  }

  // =====================================================
  // STYLING METHODEN
  // =====================================================
  private applyCoverStyling(sheet: XLSX.WorkSheet, customerCount: number) {
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

  private applyCustomerTableStyling(sheet: XLSX.WorkSheet, customerCount: number) {
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

  private applyStatisticsStyling(sheet: XLSX.WorkSheet, customerCount: number) {
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
