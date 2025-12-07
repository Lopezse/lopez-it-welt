// =====================================================
// RECHNUNGSNUMMER-GENERATOR
// =====================================================
// Format: LITW-YYYY-NNNNN (z.B. LITW-2025-00001)
// Eindeutig pro Jahr, fortlaufend
// =====================================================

import { getConnection } from "@/lib/database";
import { RowDataPacket } from "mysql2/promise";

export interface InvoiceNumberResult {
  success: boolean;
  invoice_number?: string;
  error?: string;
}

/**
 * Generiert eine eindeutige Rechnungsnummer im Format LITW-YYYY-NNNNN
 * Thread-safe durch Datenbank-Lock
 */
export async function generateInvoiceNumber(): Promise<InvoiceNumberResult> {
  const pool = await getConnection();
  const currentYear = new Date().getFullYear();
  const prefix = `LITW-${currentYear}-`;

  try {
    // Transaktion für Thread-Safety
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      // Höchste Nummer für aktuelles Jahr finden (mit Lock)
      const [rows] = await connection.execute<RowDataPacket[]>(`
        SELECT invoice_number 
        FROM lopez_customer_invoices 
        WHERE invoice_number LIKE ?
        ORDER BY invoice_number DESC 
        LIMIT 1
        FOR UPDATE
      `, [`${prefix}%`]);

      let nextNumber = 1;

      if (rows.length > 0) {
        const lastNumber = rows[0].invoice_number;
        // Extrahiere die Nummer aus LITW-2025-00001
        const match = lastNumber.match(/LITW-\d{4}-(\d+)/);
        if (match) {
          nextNumber = parseInt(match[1], 10) + 1;
        }
      }

      // Formatiere mit führenden Nullen (5-stellig)
      const invoiceNumber = `${prefix}${nextNumber.toString().padStart(5, '0')}`;

      await connection.commit();
      connection.release();

      return {
        success: true,
        invoice_number: invoiceNumber
      };

    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }

  } catch (error) {
    console.error("❌ Invoice Number Generator Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Fehler bei Nummern-Generierung"
    };
  }
}

/**
 * Validiert eine Rechnungsnummer
 */
export function validateInvoiceNumber(invoiceNumber: string): boolean {
  const regex = /^LITW-\d{4}-\d{5}$/;
  return regex.test(invoiceNumber);
}

/**
 * Extrahiert Jahr und Nummer aus einer Rechnungsnummer
 */
export function parseInvoiceNumber(invoiceNumber: string): { year: number; number: number } | null {
  const match = invoiceNumber.match(/^LITW-(\d{4})-(\d{5})$/);
  if (!match) return null;
  
  return {
    year: parseInt(match[1], 10),
    number: parseInt(match[2], 10)
  };
}







