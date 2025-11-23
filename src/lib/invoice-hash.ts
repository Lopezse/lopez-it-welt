/**
 * Invoice Hash Service
 * SHA-256 Hash-Berechnung für Rechnungen (GoBD-konform)
 * 
 * Format: SHA-256(invoice_date + amount + recipient + status)
 */

import { createHash } from "crypto";

export interface InvoiceHashData {
  invoice_date: string; // ISO-Format: YYYY-MM-DD
  amount: string; // Bruttobetrag mit 2 Dezimalstellen
  recipient: string; // Kunden-ID oder Name
  status: string; // draft, sent, paid, cancelled
}

/**
 * Berechnet SHA-256-Hash für Rechnungsdaten
 * 
 * @param data Rechnungsdaten (invoice_date, amount, recipient, status)
 * @returns SHA-256-Hash (64 Zeichen, hexadezimal)
 */
export function calculateInvoiceHash(data: InvoiceHashData): string {
  // JSON-String erstellen (sortiert, ohne Leerzeichen)
  const jsonString = JSON.stringify(data, Object.keys(data).sort());

  // SHA-256-Hash berechnen
  const hash = createHash("sha256").update(jsonString, "utf8").digest("hex");

  return hash;
}

/**
 * Verifiziert Hash für Rechnungsdaten
 * 
 * @param data Rechnungsdaten
 * @param expectedHash Erwarteter Hash
 * @returns true wenn Hash übereinstimmt, sonst false
 */
export function verifyInvoiceHash(
  data: InvoiceHashData,
  expectedHash: string,
): boolean {
  const calculatedHash = calculateInvoiceHash(data);
  return calculatedHash === expectedHash;
}

/**
 * Erstellt Hash-Daten aus Rechnungs-Objekt
 * 
 * @param invoice Rechnungs-Objekt (aus Datenbank)
 * @returns InvoiceHashData
 */
export function createHashDataFromInvoice(invoice: any): InvoiceHashData {
  return {
    invoice_date: invoice.issue_date || invoice.invoice_date || "",
    amount: invoice.gross_amount
      ? parseFloat(invoice.gross_amount).toFixed(2)
      : "0.00",
    recipient: invoice.customer_id || invoice.recipient || "",
    status: invoice.status || "draft",
  };
}


 * Invoice Hash Service
 * SHA-256 Hash-Berechnung für Rechnungen (GoBD-konform)
 * 
 * Format: SHA-256(invoice_date + amount + recipient + status)
 */

import { createHash } from "crypto";

export interface InvoiceHashData {
  invoice_date: string; // ISO-Format: YYYY-MM-DD
  amount: string; // Bruttobetrag mit 2 Dezimalstellen
  recipient: string; // Kunden-ID oder Name
  status: string; // draft, sent, paid, cancelled
}

/**
 * Berechnet SHA-256-Hash für Rechnungsdaten
 * 
 * @param data Rechnungsdaten (invoice_date, amount, recipient, status)
 * @returns SHA-256-Hash (64 Zeichen, hexadezimal)
 */
export function calculateInvoiceHash(data: InvoiceHashData): string {
  // JSON-String erstellen (sortiert, ohne Leerzeichen)
  const jsonString = JSON.stringify(data, Object.keys(data).sort());

  // SHA-256-Hash berechnen
  const hash = createHash("sha256").update(jsonString, "utf8").digest("hex");

  return hash;
}

/**
 * Verifiziert Hash für Rechnungsdaten
 * 
 * @param data Rechnungsdaten
 * @param expectedHash Erwarteter Hash
 * @returns true wenn Hash übereinstimmt, sonst false
 */
export function verifyInvoiceHash(
  data: InvoiceHashData,
  expectedHash: string,
): boolean {
  const calculatedHash = calculateInvoiceHash(data);
  return calculatedHash === expectedHash;
}

/**
 * Erstellt Hash-Daten aus Rechnungs-Objekt
 * 
 * @param invoice Rechnungs-Objekt (aus Datenbank)
 * @returns InvoiceHashData
 */
export function createHashDataFromInvoice(invoice: any): InvoiceHashData {
  return {
    invoice_date: invoice.issue_date || invoice.invoice_date || "",
    amount: invoice.gross_amount
      ? parseFloat(invoice.gross_amount).toFixed(2)
      : "0.00",
    recipient: invoice.customer_id || invoice.recipient || "",
    status: invoice.status || "draft",
  };
}



















