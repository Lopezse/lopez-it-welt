// =====================================================
// TECHNICAL EXPORT GENERATOR - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-01-19
// Zweck: Rohdaten-Export für Weiterverarbeitung (wie SAP/IBM)
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

export class TechnicalExportGenerator {
  // =====================================================
  // TECHNISCHER EXCEL-EXPORT (ROHDATEN)
  // =====================================================
  generateTechnicalExcel(customers: Customer[], options: any = {}) {
    const workbook = XLSX.utils.book_new();

    // =====================================================
    // ROHDATEN-TABELLE (Minimal formatiert)
    // =====================================================
    const headers = [
      "ID",
      "Customer_Type",
      "Anrede",
      "Titel",
      "Vorname",
      "Nachname",
      "Company_Name",
      "UST_ID",
      "Email",
      "Telefon",
      "Strasse",
      "Hausnummer",
      "PLZ",
      "Ort",
      "Land",
      "Status",
      "Support_Level",
      "Notes",
      "Created_At",
      "Updated_At",
    ];

    const customerRows = customers.map((customer) => [
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

    const rawData = [headers, ...customerRows];
    const rawSheet = XLSX.utils.aoa_to_sheet(rawData);

    // Minimale Formatierung für technischen Export
    rawSheet["!cols"] = [
      { wch: 10 }, // ID
      { wch: 15 }, // Customer_Type
      { wch: 10 }, // Anrede
      { wch: 10 }, // Titel
      { wch: 20 }, // Vorname
      { wch: 20 }, // Nachname
      { wch: 30 }, // Company_Name
      { wch: 15 }, // UST_ID
      { wch: 40 }, // Email
      { wch: 20 }, // Telefon
      { wch: 30 }, // Strasse
      { wch: 10 }, // Hausnummer
      { wch: 10 }, // PLZ
      { wch: 20 }, // Ort
      { wch: 15 }, // Land
      { wch: 10 }, // Status
      { wch: 15 }, // Support_Level
      { wch: 50 }, // Notes
      { wch: 20 }, // Created_At
      { wch: 20 }, // Updated_At
    ];

    XLSX.utils.book_append_sheet(workbook, rawSheet, "Raw_Data");

    // =====================================================
    // METADATEN-TABELLE
    // =====================================================
    const metadata = [
      ["Export_Type", "Technical_Raw_Data"],
      ["Export_Date", new Date().toISOString()],
      ["Total_Records", customers.length.toString()],
      ["System", "Lopez_IT_Welt_Admin"],
      ["Version", "1.0.0"],
      ["Format", "XLSX"],
      ["Encoding", "UTF-8"],
      ["", ""],
      ["Field_Descriptions", ""],
      ["ID", "Unique customer identifier"],
      ["Customer_Type", "privat|firma|behörde|partner"],
      ["Status", "aktiv|inaktiv|gesperrt"],
      ["Support_Level", "Basic|Standard|Premium|Enterprise"],
    ];

    const metadataSheet = XLSX.utils.aoa_to_sheet(metadata);
    XLSX.utils.book_append_sheet(workbook, metadataSheet, "Metadata");

    // =====================================================
    // EXCEL DATEI GENERIEREN
    // =====================================================
    const excelBuffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
      compression: true,
    });

    console.log("✅ Technical Export erfolgreich generiert");
    console.log("📊 Buffer Länge:", excelBuffer.length);
    console.log("📊 Records:", customers.length);

    return {
      content: excelBuffer,
      fileName: `Lopez_IT_Welt_Technical_Export_${new Date().toISOString().split("T")[0]}.xlsx`,
      mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    };
  }

  // =====================================================
  // TECHNISCHER CSV-EXPORT (ROHDATEN)
  // =====================================================
  generateTechnicalCSV(customers: Customer[], options: any = {}) {
    const headers = [
      "ID",
      "Customer_Type",
      "Anrede",
      "Titel",
      "Vorname",
      "Nachname",
      "Company_Name",
      "UST_ID",
      "Email",
      "Telefon",
      "Strasse",
      "Hausnummer",
      "PLZ",
      "Ort",
      "Land",
      "Status",
      "Support_Level",
      "Notes",
      "Created_At",
      "Updated_At",
    ];

    const customerRows = customers.map((customer) => [
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

    const csvData = [headers, ...customerRows];
    const csvContent = csvData
      .map((row) => row.map((field) => `"${field.toString().replace(/"/g, '""')}"`).join(","))
      .join("\n");

    console.log("✅ Technical CSV Export erfolgreich generiert");
    console.log("📊 Records:", customers.length);

    return {
      content: csvContent,
      fileName: `Lopez_IT_Welt_Technical_Export_${new Date().toISOString().split("T")[0]}.csv`,
      mimeType: "text/csv;charset=utf-8",
    };
  }
}
