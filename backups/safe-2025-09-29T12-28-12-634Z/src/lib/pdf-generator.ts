// =====================================================
// PDF GENERATOR - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-01-19
// Zweck: PDF-Reports für Rechnungen
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================

import fs from "fs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import path from "path";

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

export class PDFGenerator {
  private companyName = "LOPEZ IT WELT";
  private tagline = "Digital Solutions. Global. Secure.";

  // =====================================================
  // CI-FARBEN & DESIGN
  // =====================================================
  private colors = {
    primary: "#1F4E79", // Dunkelblau
    secondary: "#2F5597", // Mittelblau
    accent: "#4A90E2", // Hellblau
    background: "#F8FAFC", // Sehr helles Grau
    text: "#2C3E50", // Dunkelgrau
    textLight: "#7F8C8D", // Mittelgrau
    success: "#27AE60", // Grün
    warning: "#F39C12", // Orange
    danger: "#E74C3C", // Rot
    white: "#FFFFFF", // Weiß
  };

  // =====================================================
  // MANAGEMENT REPORT (PDF) - ENTERPRISE VERSION
  // =====================================================
  async generateManagementReport(customers: Customer[], options: any = {}) {
    console.log("📊 PDF Generator: Management Report gestartet");
    console.log("- Kunden Anzahl:", customers.length);

    const doc = new jsPDF("p", "mm", "a4");

    // =====================================================
    // TITELSEITE (COVER PAGE)
    // =====================================================
    this.createCoverPage(doc);

    // =====================================================
    // MANAGEMENT-ZUSAMMENFASSUNG
    // =====================================================
    doc.addPage();
    this.createManagementSummary(doc, customers);

    // =====================================================
    // KUNDENDETAILS
    // =====================================================
    doc.addPage();
    this.createCustomerDetails(doc, customers);

    // =====================================================
    // SCHLUSSZEILE
    // =====================================================
    doc.addPage();
    this.createClosingPage(doc);

    // =====================================================
    // FOOTER FÜR ALLE SEITEN
    // =====================================================
    this.addPageFooter(doc);

    const pdfBuffer = doc.output("arraybuffer");

    console.log("✅ PDF Generator: Management Report erfolgreich generiert");
    console.log("- Buffer Länge:", pdfBuffer.byteLength);
    console.log("- Kunden Anzahl:", customers.length);

    return {
      content: Buffer.from(pdfBuffer),
      fileName: `Lopez_IT_Welt_Management_Report_${new Date().toISOString().split("T")[0]}.pdf`,
      mimeType: "application/pdf",
    };
  }

  // =====================================================
  // HILFSMETHODEN FÜR ENTERPRISE PDF
  // =====================================================

  private createCoverPage(doc: jsPDF): void {
    // Logo laden und einfügen - Korrekte Logo-Auswahl
    try {
      // Versuche PNG zuerst, dann SVG
      let logoPath = path.join(process.cwd(), "public", "logo-hell.png");
      if (!fs.existsSync(logoPath)) {
        logoPath = path.join(process.cwd(), "public", "logo-cookie-banner.svg");
      }

      if (fs.existsSync(logoPath)) {
        const logoData = fs.readFileSync(logoPath);
        const logoBase64 = logoData.toString("base64");
        const mimeType = logoPath.endsWith(".svg") ? "svg" : "png";
        doc.addImage(
          `data:image/${mimeType};base64,${logoBase64}`,
          mimeType.toUpperCase(),
          20,
          20,
          40,
          20,
        );
        console.log("✅ PDF Logo erfolgreich geladen:", logoPath);
      }
    } catch (error) {
      console.log("⚠️ PDF Logo konnte nicht geladen werden:", error);
    }

    // Titel
    doc.setFontSize(28);
    doc.setTextColor(this.colors.primary);
    doc.setFont("helvetica", "bold");
    doc.text("Kunden-Management Report", 20, 80);

    // Untertitel
    doc.setFontSize(16);
    doc.setTextColor(this.colors.secondary);
    doc.setFont("helvetica", "normal");
    doc.text(this.companyName, 20, 95);
    doc.text(this.tagline, 20, 105);

    // Datum/Zeit
    doc.setFontSize(12);
    doc.text(`Stand: ${new Date().toLocaleString("de-DE")}`, 20, 120);

    // Zentrierte Informationen
    const pageWidth = doc.internal.pageSize.width;
    doc.setFontSize(14);
    doc.setTextColor(this.colors.primary);
    doc.text("Enterprise Report System", pageWidth / 2, 150, {
      align: "center",
    });
    doc.text("Lopez IT Welt Admin-System", pageWidth / 2, 160, {
      align: "center",
    });
  }

  private createManagementSummary(doc: jsPDF, customers: Customer[]): void {
    // Header
    this.addPageHeader(doc, "Management-Zusammenfassung");

    // KPI-Boxen
    const activeCustomers = customers.filter((c) => c.status === "aktiv").length;
    const premiumCustomers = customers.filter((c) => c.support_level === "Premium").length;
    const enterpriseCustomers = customers.filter((c) => c.support_level === "Enterprise").length;

    // KPI-Box 1
    this.createKPIBox(
      doc,
      20,
      60,
      "Gesamt-Kunden",
      customers.length.toString(),
      this.colors.primary,
    );
    this.createKPIBox(doc, 80, 60, "Aktiv", activeCustomers.toString(), this.colors.accent);
    this.createKPIBox(doc, 140, 60, "Premium", premiumCustomers.toString(), this.colors.accent);
    this.createKPIBox(
      doc,
      20,
      100,
      "Enterprise",
      enterpriseCustomers.toString(),
      this.colors.primary,
    );

    // Verteilung nach Support-Level
    doc.setFontSize(14);
    doc.setTextColor(this.colors.primary);
    doc.setFont("helvetica", "bold");
    doc.text("Verteilung nach Support-Level:", 20, 140);

    // Einfaches Balkendiagramm
    this.createSimpleBarChart(doc, 20, 150, [
      { label: "Premium", value: premiumCustomers, color: this.colors.accent },
      {
        label: "Enterprise",
        value: enterpriseCustomers,
        color: this.colors.primary,
      },
      {
        label: "Standard",
        value: customers.length - premiumCustomers - enterpriseCustomers,
        color: this.colors.secondary,
      },
    ]);
  }

  private createCustomerDetails(doc: jsPDF, customers: Customer[]): void {
    // Header
    this.addPageHeader(doc, "Kundendetails");

    // Tabelle vorbereiten
    const tableData = customers.map((customer) => [
      customer.company_name || `${customer.vorname} ${customer.nachname}`,
      customer.email,
      customer.telefon || "-",
      customer.support_level,
      customer.status === "aktiv" ? "Aktiv" : "Inaktiv",
    ]);

    // Tabelle erstellen
    autoTable(doc, {
      head: [["Firma/Name", "E-Mail", "Telefon", "Support-Level", "Status"]],
      body: tableData,
      startY: 60,
      styles: {
        fontSize: 10,
        cellPadding: 4,
        overflow: "linebreak",
      },
      headStyles: {
        fillColor: this.colors.primary,
        textColor: this.colors.white,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: this.colors.background,
      },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: 50 },
        2: { cellWidth: 30 },
        3: { cellWidth: 25 },
        4: { cellWidth: 20 },
      },
    });
  }

  private createClosingPage(doc: jsPDF): void {
    // Header
    this.addPageHeader(doc, "Zusammenfassung");

    // Schlusstext
    doc.setFontSize(12);
    doc.setTextColor(this.colors.textLight);
    doc.setFont("helvetica", "normal");

    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    doc.text("Dieser Report wurde automatisch durch das", pageWidth / 2, 100, {
      align: "center",
    });
    doc.text("Lopez IT Welt Admin-System generiert.", pageWidth / 2, 110, {
      align: "center",
    });

    doc.text("Für weitere Informationen wenden Sie sich an:", pageWidth / 2, 130, {
      align: "center",
    });
    doc.text("admin@lopez-it-welt.de", pageWidth / 2, 140, { align: "center" });
  }

  private addPageHeader(doc: jsPDF, title: string): void {
    // Logo in Kopfzeile - Korrekte Logo-Auswahl
    try {
      // Versuche PNG zuerst, dann SVG
      let logoPath = path.join(process.cwd(), "public", "logo-hell.png");
      if (!fs.existsSync(logoPath)) {
        logoPath = path.join(process.cwd(), "public", "logo-cookie-banner.svg");
      }

      if (fs.existsSync(logoPath)) {
        const logoData = fs.readFileSync(logoPath);
        const logoBase64 = logoData.toString("base64");
        const mimeType = logoPath.endsWith(".svg") ? "svg" : "png";
        doc.addImage(
          `data:image/${mimeType};base64,${logoBase64}`,
          mimeType.toUpperCase(),
          20,
          10,
          20,
          10,
        );
      }
    } catch (error) {
      console.log("⚠️ Header Logo konnte nicht geladen werden:", error);
    }

    // Firmenname und Titel
    doc.setFontSize(10);
    doc.setTextColor(this.colors.primary);
    doc.setFont("helvetica", "bold");
    doc.text(this.companyName, 50, 15);

    doc.setFontSize(12);
    doc.text(title, 20, 30);

    // Linie unter Header
    doc.setDrawColor(this.colors.primary);
    doc.setLineWidth(0.5);
    doc.line(20, 35, doc.internal.pageSize.width - 20, 35);
  }

  private addPageFooter(doc: jsPDF): void {
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);

      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;

      // Linie über Footer
      doc.setDrawColor(this.colors.textLight);
      doc.setLineWidth(0.3);
      doc.line(20, pageHeight - 20, pageWidth - 20, pageHeight - 20);

      // Footer-Text
      doc.setFontSize(8);
      doc.setTextColor(this.colors.textLight);
      doc.setFont("helvetica", "normal");

      // Links: Copyright
      doc.text("© Lopez IT Welt", 20, pageHeight - 10);

      // Mitte: Vertraulich
      doc.text("Vertraulich", pageWidth / 2, pageHeight - 10, {
        align: "center",
      });

      // Rechts: Seitenzahl
      doc.text(`Seite ${i} von ${pageCount}`, pageWidth - 20, pageHeight - 10, {
        align: "right",
      });
    }
  }

  private createKPIBox(
    doc: jsPDF,
    x: number,
    y: number,
    label: string,
    value: string,
    color: string,
  ): void {
    // Box zeichnen
    doc.setFillColor(color);
    doc.roundedRect(x, y, 50, 30, 3, 3, "F");

    // Text
    doc.setFontSize(10);
    doc.setTextColor(this.colors.white);
    doc.setFont("helvetica", "bold");
    doc.text(value, x + 25, y + 15, { align: "center" });

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(label, x + 25, y + 22, { align: "center" });
  }

  private createSimpleBarChart(
    doc: jsPDF,
    x: number,
    y: number,
    data: Array<{ label: string; value: number; color: string }>,
  ): void {
    const maxValue = Math.max(...data.map((d) => d.value));
    const barWidth = 20;
    const barHeight = 30;
    const spacing = 50;

    data.forEach((item, index) => {
      const barX = x + index * spacing;
      const barY = y + (barHeight - (item.value / maxValue) * barHeight);
      const actualHeight = (item.value / maxValue) * barHeight;

      // Balken zeichnen
      doc.setFillColor(item.color);
      doc.rect(barX, barY, barWidth, actualHeight, "F");

      // Label
      doc.setFontSize(8);
      doc.setTextColor(this.colors.textLight);
      doc.setFont("helvetica", "normal");
      doc.text(item.label, barX + barWidth / 2, y + barHeight + 10, {
        align: "center",
      });
      doc.text(item.value.toString(), barX + barWidth / 2, barY - 5, {
        align: "center",
      });
    });
  }
}
