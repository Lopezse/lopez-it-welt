// =====================================================
// EXCEL GENERATOR - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-01-19
// Zweck: Echte Excel-Dateien generieren (XLSX)
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

export class ExcelGenerator {
  private companyName = "Lopez IT Welt";
  private systemName = "Lopez IT Welt Admin-System (Enterprise++ Version)";
  private currentDate = new Date().toLocaleString("de-DE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  // =====================================================
  // EXCEL-DATEI GENERIEREN
  // =====================================================

  generateExcelFile(customers: Customer[], options: any) {
    // Erstelle neues Workbook
    const workbook = XLSX.utils.book_new();

    // =====================================================
    // DECKBLATT ERSTELLEN
    // =====================================================
    const coverData = [
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["Lopez IT Welt", "", "", "", "", "", "", "", ""],
      ["Kundenübersicht - Enterprise++", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["Exportdatum:", this.currentDate, "", "", "", "", "", "", ""],
      ["Verantwortlich:", "Admin Lopez IT Welt", "", "", "", "", "", "", ""],
      ["Gesamt Kunden:", customers.length.toString(), "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["Generiert mit:", this.systemName, "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["Vertraulich - Nur für den internen Gebrauch", "", "", "", "", "", "", "", ""],
    ];

    const coverSheet = XLSX.utils.aoa_to_sheet(coverData);

    // Spaltenbreiten setzen
    coverSheet["!cols"] = [
      { wch: 20 }, // A
      { wch: 20 }, // B
      { wch: 20 }, // C
      { wch: 20 }, // D
      { wch: 20 }, // E
      { wch: 20 }, // F
      { wch: 20 }, // G
      { wch: 20 }, // H
      { wch: 20 }, // I
    ];

    // Styling für Deckblatt
    const range = XLSX.utils.decode_range(coverSheet["!ref"] || "A1");
    for (let row = range.s.r; row <= range.e.r; row++) {
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        if (!coverSheet[cellAddress]) continue;

        if (row === 40) {
          // Haupttitel
          coverSheet[cellAddress].s = {
            font: { bold: true, size: 18, color: { rgb: "2F5597" } },
            alignment: { horizontal: "center" },
          };
        } else if (row === 41) {
          // Untertitel
          coverSheet[cellAddress].s = {
            font: { bold: true, size: 14, color: { rgb: "4472C4" } },
            alignment: { horizontal: "center" },
          };
        } else if (row >= 44 && row <= 46) {
          // Info-Zeilen
          coverSheet[cellAddress].s = {
            font: { size: 12 },
            alignment: { horizontal: "left" },
          };
        } else if (row === 49) {
          // System-Info
          coverSheet[cellAddress].s = {
            font: { size: 10, italic: true },
            alignment: { horizontal: "left" },
          };
        } else if (row === 52) {
          // Vertraulichkeitshinweis
          coverSheet[cellAddress].s = {
            font: { size: 10, bold: true, color: { rgb: "FF0000" } },
            alignment: { horizontal: "center" },
          };
        }
      }
    }

    XLSX.utils.book_append_sheet(workbook, coverSheet, "Deckblatt");

    // =====================================================
    // KUNDENTABELLE ERSTELLEN
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

      const address = [customer.strasse, customer.plz, customer.stadt, customer.land]
        .filter(Boolean)
        .join(", ");

      const phone = customer.phone_mobile || customer.phone_business || "–";

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
      { wch: 12 }, // Kundentyp
      { wch: 10 }, // Anrede
      { wch: 25 }, // Name/Firma
      { wch: 30 }, // E-Mail
      { wch: 15 }, // Telefon
      { wch: 35 }, // Adresse
      { wch: 10 }, // Status
      { wch: 12 }, // Support-Level
      { wch: 15 }, // Erstellungsdatum
    ];

    // Header-Styling
    const headerRange = XLSX.utils.decode_range(customerSheet["!ref"] || "A1");
    for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      if (customerSheet[cellAddress]) {
        customerSheet[cellAddress].s = {
          font: { bold: true, color: { rgb: "FFFFFF" } },
          fill: { fgColor: { rgb: "4472C4" } },
          alignment: { horizontal: "center" },
        };
      }
    }

    XLSX.utils.book_append_sheet(workbook, customerSheet, "Kundenübersicht");

    // =====================================================
    // ZUSAMMENFASSUNG ERSTELLEN
    // =====================================================
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter((c) => c.status === "aktiv").length;
    const inactiveCustomers = customers.filter((c) => c.status === "inaktiv").length;
    const blockedCustomers = customers.filter((c) => c.status === "gesperrt").length;

    const summaryData = [
      ["Zusammenfassung & KPIs", ""],
      ["", ""],
      ["Gesamt Kunden:", totalCustomers.toString()],
      ["Aktive Kunden:", activeCustomers.toString()],
      ["Inaktive Kunden:", inactiveCustomers.toString()],
      ["Gesperrte Kunden:", blockedCustomers.toString()],
      ["", ""],
      ["Kundenverteilung nach Typ:", ""],
      ...this.getCustomerTypeDistribution(customers),
      ["", ""],
      ["Support-Level Verteilung:", ""],
      ...this.getSupportLevelDistribution(customers),
      ["", ""],
      ["Generiert mit:", this.systemName],
      ["Exportdatum:", this.currentDate],
    ];

    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);

    // Spaltenbreiten für Zusammenfassung
    summarySheet["!cols"] = [{ wch: 30 }, { wch: 20 }];

    // Styling für Zusammenfassung
    const summaryRange = XLSX.utils.decode_range(summarySheet["!ref"] || "A1");
    for (let row = summaryRange.s.r; row <= summaryRange.e.r; row++) {
      for (let col = summaryRange.s.c; col <= summaryRange.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        if (!summarySheet[cellAddress]) continue;

        if (row === 0) {
          // Titel
          summarySheet[cellAddress].s = {
            font: { bold: true, size: 16, color: { rgb: "2F5597" } },
            alignment: { horizontal: "left" },
          };
        } else if (row >= 2 && row <= 5) {
          // KPI-Zeilen
          summarySheet[cellAddress].s = {
            font: { bold: true, size: 12 },
            alignment: { horizontal: "left" },
          };
        }
      }
    }

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
    console.log("📊 Excel Generator Debug:");
    console.log("- Workbook Sheets:", workbook.SheetNames);
    console.log("- Buffer Length:", excelBuffer.length);
    console.log("- Buffer Type:", typeof excelBuffer);
    console.log("- Is Buffer:", Buffer.isBuffer(excelBuffer));
    console.log("- Customer Count:", customers.length);
    console.log(
      "- Customer Data Preview:",
      customers.slice(0, 2).map((c) => ({
        name: c.vorname + " " + c.nachname,
        type: c.customer_type,
        status: c.status,
      })),
    );

    // Prüfe Workbook-Inhalt
    workbook.SheetNames.forEach((sheetName) => {
      const sheet = workbook.Sheets[sheetName];
      const range = XLSX.utils.decode_range(sheet["!ref"] || "A1");
      console.log(`- Sheet "${sheetName}": ${range.e.r + 1} rows, ${range.e.c + 1} cols`);
    });

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
  // HELPER-FUNKTIONEN FÜR ZUSAMMENFASSUNG
  // =====================================================

  private getCustomerTypeDistribution(customers: Customer[]) {
    const distribution = customers.reduce(
      (acc, customer) => {
        const type = this.getCustomerTypeLabel(customer.customer_type);
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return Object.entries(distribution).map(([type, count]) => [`  ${type}:`, count.toString()]);
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

  // =====================================================
  // EXCEL-INHALT ERSTELLEN (LEGACY - WIRD NICHT MEHR VERWENDET)
  // =====================================================

  private createExcelContent(customers: Customer[]): string {
    // Simulate Excel XML content
    const header = `<?xml version="1.0" encoding="UTF-8"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet">
    <DocumentProperties>
        <Title>Kundenübersicht - Lopez IT Welt</Title>
        <Author>Lopez IT Welt Admin-System</Author>
        <Created>${new Date().toISOString()}</Created>
    </DocumentProperties>
    <Styles>
        <Style ss:ID="Header">
            <Font ss:Bold="1" ss:Color="#FFFFFF"/>
            <Interior ss:Color="#4472C4" ss:Pattern="Solid"/>
        </Style>
        <Style ss:ID="Company">
            <Font ss:Bold="1" ss:Size="16" ss:Color="#2F5597"/>
        </Style>
    </Styles>`;

    const coverPage = `
    <Worksheet ss:Name="Deckblatt">
        <Table>
            <Row>
                <Cell ss:StyleID="Company">
                    <Data ss:Type="String">${this.companyName}</Data>
                </Cell>
            </Row>
            <Row>
                <Cell>
                    <Data ss:Type="String">Kundenübersicht - Enterprise++</Data>
                </Cell>
            </Row>
            <Row>
                <Cell>
                    <Data ss:Type="String">Exportdatum: ${this.currentDate}</Data>
                </Cell>
            </Row>
            <Row>
                <Cell>
                    <Data ss:Type="String">Verantwortlich: Admin Lopez IT Welt</Data>
                </Cell>
            </Row>
            <Row>
                <Cell>
                    <Data ss:Type="String">Gesamt Kunden: ${customers.length}</Data>
                </Cell>
            </Row>
        </Table>
    </Worksheet>`;

    const customerTable = `
    <Worksheet ss:Name="Kundenübersicht">
        <Table>
            <Row>
                <Cell ss:StyleID="Header">
                    <Data ss:Type="String">Kundentyp</Data>
                </Cell>
                <Cell ss:StyleID="Header">
                    <Data ss:Type="String">Anrede</Data>
                </Cell>
                <Cell ss:StyleID="Header">
                    <Data ss:Type="String">Name / Firma</Data>
                </Cell>
                <Cell ss:StyleID="Header">
                    <Data ss:Type="String">E-Mail</Data>
                </Cell>
                <Cell ss:StyleID="Header">
                    <Data ss:Type="String">Telefon</Data>
                </Cell>
                <Cell ss:StyleID="Header">
                    <Data ss:Type="String">Adresse</Data>
                </Cell>
                <Cell ss:StyleID="Header">
                    <Data ss:Type="String">Status</Data>
                </Cell>
                <Cell ss:StyleID="Header">
                    <Data ss:Type="String">Support-Level</Data>
                </Cell>
                <Cell ss:StyleID="Header">
                    <Data ss:Type="String">Erstellungsdatum</Data>
                </Cell>
            </Row>
            ${customers.map((customer) => this.generateCustomerRow(customer)).join("")}
        </Table>
    </Worksheet>`;

    const summary = `
    <Worksheet ss:Name="Zusammenfassung">
        <Table>
            <Row>
                <Cell ss:StyleID="Company">
                    <Data ss:Type="String">Zusammenfassung & KPIs</Data>
                </Cell>
            </Row>
            <Row>
                <Cell>
                    <Data ss:Type="String">Gesamt Kunden: ${customers.length}</Data>
                </Cell>
            </Row>
            <Row>
                <Cell>
                    <Data ss:Type="String">Aktive Kunden: ${customers.filter((c) => c.status === "aktiv").length}</Data>
                </Cell>
            </Row>
            <Row>
                <Cell>
                    <Data ss:Type="String">Inaktive Kunden: ${customers.filter((c) => c.status === "inaktiv").length}</Data>
                </Cell>
            </Row>
            <Row>
                <Cell>
                    <Data ss:Type="String">Gesperrte Kunden: ${customers.filter((c) => c.status === "gesperrt").length}</Data>
                </Cell>
            </Row>
            <Row>
                <Cell>
                    <Data ss:Type="String">Generiert mit ${this.systemName}</Data>
                </Cell>
            </Row>
        </Table>
    </Worksheet>`;

    const footer = `
</Workbook>`;

    return header + coverPage + customerTable + summary + footer;
  }

  // =====================================================
  // KUNDEN-ZEILE GENERIEREN
  // =====================================================

  private generateCustomerRow(customer: Customer): string {
    const displayName =
      customer.customer_type === "privat"
        ? `${customer.vorname} ${customer.nachname}`
        : customer.company_name || `${customer.vorname} ${customer.nachname}`;

    const address = [customer.strasse, customer.plz, customer.stadt, customer.land]
      .filter(Boolean)
      .join(", ");

    const phone = customer.phone_mobile || customer.phone_business || "–";

    return `
            <Row>
                <Cell>
                    <Data ss:Type="String">${this.getCustomerTypeLabel(customer.customer_type)}</Data>
                </Cell>
                <Cell>
                    <Data ss:Type="String">${customer.anrede}</Data>
                </Cell>
                <Cell>
                    <Data ss:Type="String">${displayName}</Data>
                </Cell>
                <Cell>
                    <Data ss:Type="String">${customer.email}</Data>
                </Cell>
                <Cell>
                    <Data ss:Type="String">${phone}</Data>
                </Cell>
                <Cell>
                    <Data ss:Type="String">${address || "–"}</Data>
                </Cell>
                <Cell>
                    <Data ss:Type="String">${this.getStatusLabel(customer.status)}</Data>
                </Cell>
                <Cell>
                    <Data ss:Type="String">${customer.support_level}</Data>
                </Cell>
                <Cell>
                    <Data ss:Type="String">${new Date(customer.created_at).toLocaleDateString("de-DE")}</Data>
                </Cell>
            </Row>`;
  }

  // =====================================================
  // DECKBLATT GENERIEREN
  // =====================================================

  private generateCoverPage() {
    return {
      title: "Kundenübersicht – Lopez IT Welt",
      subtitle: "Enterprise++ Kundenverwaltung",
      logo: "/assets/logo/lopez-it-welt-logo.svg",
      exportDate: this.currentDate,
      responsible: "Admin Lopez IT Welt",
      company: this.companyName,
      system: this.systemName,
    };
  }

  // =====================================================
  // KUNDENTABELLE GENERIEREN
  // =====================================================

  private generateCustomerTable(customers: Customer[]) {
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

    const rows = customers.map((customer) => {
      const displayName =
        customer.customer_type === "privat"
          ? `${customer.vorname} ${customer.nachname}`
          : customer.company_name || `${customer.vorname} ${customer.nachname}`;

      const address = [customer.strasse, customer.plz, customer.stadt, customer.land]
        .filter(Boolean)
        .join(", ");

      const phone = customer.phone_mobile || customer.phone_business || "–";

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

    return { headers, rows };
  }

  // =====================================================
  // ZUSAMMENFASSUNG GENERIEREN
  // =====================================================

  private generateSummary(customers: Customer[]) {
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter((c) => c.status === "aktiv").length;
    const inactiveCustomers = customers.filter((c) => c.status === "inaktiv").length;
    const blockedCustomers = customers.filter((c) => c.status === "gesperrt").length;

    return {
      title: "Zusammenfassung & KPIs",
      kpis: [
        { label: "Gesamt Kunden", value: totalCustomers },
        { label: "Aktive Kunden", value: activeCustomers },
        { label: "Inaktive Kunden", value: inactiveCustomers },
        { label: "Gesperrte Kunden", value: blockedCustomers },
      ],
    };
  }

  // =====================================================
  // HELPER FUNCTIONS
  // =====================================================

  private getCustomerTypeLabel(type: string): string {
    const labels = {
      privat: "Privat",
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
}

export const excelGenerator = new ExcelGenerator();
