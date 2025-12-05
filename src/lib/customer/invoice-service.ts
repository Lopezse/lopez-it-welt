// =====================================================
// INVOICE SERVICE
// =====================================================
// Enterprise++ Rechnungsverwaltung
// - Immutabilität für sent/paid
// - Audit-Logging
// - AI-Ready Architektur
// =====================================================

import { getConnection } from "@/lib/database";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { generateInvoiceNumber } from "./invoice-number-generator";
import crypto from "crypto";

// =====================================================
// TYPEN
// =====================================================

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

export interface LineItem {
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface CreateInvoiceInput {
  customer_id: number;
  project_id?: number;
  line_items: LineItem[];
  invoice_date: string;
  due_date: string;
  notes?: string;
  internal_notes?: string;
  tax_rate?: number;
}

export interface Invoice {
  id: number;
  customer_id: number;
  project_id?: number;
  invoice_number: string;
  net_amount: number;
  tax_rate: number;
  tax_amount: number;
  gross_amount: number;
  invoice_date: string;
  due_date: string;
  status: InvoiceStatus;
  paid_at?: string;
  line_items: LineItem[];
  pdf_path?: string;
  pdf_generated_at?: string;
  notes?: string;
  internal_notes?: string;
  created_at: string;
  updated_at: string;
}

// Status, die keine Inhaltsänderungen mehr erlauben
const IMMUTABLE_STATUSES: InvoiceStatus[] = ['sent', 'paid'];

// Erlaubte Status-Übergänge
const ALLOWED_TRANSITIONS: Record<InvoiceStatus, InvoiceStatus[]> = {
  draft: ['sent', 'cancelled'],
  sent: ['paid', 'overdue', 'cancelled'],
  overdue: ['paid', 'cancelled'],
  paid: [], // Keine weiteren Übergänge
  cancelled: [] // Keine weiteren Übergänge
};

// =====================================================
// SERVICE
// =====================================================

export class InvoiceService {

  /**
   * Erstellt eine neue Rechnung
   */
  static async create(input: CreateInvoiceInput, adminUserId: number): Promise<{ success: boolean; invoice?: Invoice; error?: string }> {
    const pool = await getConnection();

    try {
      // Rechnungsnummer generieren
      const numberResult = await generateInvoiceNumber();
      if (!numberResult.success || !numberResult.invoice_number) {
        return { success: false, error: numberResult.error || "Nummer-Generierung fehlgeschlagen" };
      }

      // Beträge berechnen
      const taxRate = input.tax_rate ?? 19;
      const netAmount = input.line_items.reduce((sum, item) => sum + item.total, 0);
      const taxAmount = Math.round(netAmount * (taxRate / 100) * 100) / 100;
      const grossAmount = Math.round((netAmount + taxAmount) * 100) / 100;

      // Einfügen
      const [result] = await pool.execute<ResultSetHeader>(`
        INSERT INTO lopez_customer_invoices 
          (customer_id, project_id, invoice_number, net_amount, tax_rate, tax_amount, 
           gross_amount, invoice_date, due_date, status, line_items, notes, internal_notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft', ?, ?, ?)
      `, [
        input.customer_id,
        input.project_id || null,
        numberResult.invoice_number,
        netAmount,
        taxRate,
        taxAmount,
        grossAmount,
        input.invoice_date,
        input.due_date,
        JSON.stringify(input.line_items),
        input.notes || null,
        input.internal_notes || null
      ]);

      // Audit-Log
      await this.logAudit(pool, result.insertId, adminUserId, 'INVOICE_CREATED', {
        invoice_number: numberResult.invoice_number,
        customer_id: input.customer_id,
        gross_amount: grossAmount
      });

      // Rechnung laden
      const invoice = await this.getById(result.insertId);
      return { success: true, invoice: invoice || undefined };

    } catch (error) {
      console.error("❌ Invoice Create Error:", error);
      return { success: false, error: error instanceof Error ? error.message : "Fehler" };
    }
  }

  /**
   * Holt eine Rechnung nach ID
   */
  static async getById(id: number): Promise<Invoice | null> {
    const pool = await getConnection();

    const [rows] = await pool.execute<RowDataPacket[]>(`
      SELECT * FROM lopez_customer_invoices WHERE id = ?
    `, [id]);

    if (rows.length === 0) return null;

    const row = rows[0];
    return {
      ...row,
      line_items: typeof row.line_items === 'string' ? JSON.parse(row.line_items) : row.line_items
    } as Invoice;
  }

  /**
   * Holt alle Rechnungen eines Kunden
   */
  static async getByCustomerId(customerId: number): Promise<Invoice[]> {
    const pool = await getConnection();

    const [rows] = await pool.execute<RowDataPacket[]>(`
      SELECT * FROM lopez_customer_invoices 
      WHERE customer_id = ? 
      ORDER BY invoice_date DESC
    `, [customerId]);

    return rows.map(row => ({
      ...row,
      line_items: typeof row.line_items === 'string' ? JSON.parse(row.line_items) : row.line_items
    })) as Invoice[];
  }

  /**
   * Aktualisiert eine Rechnung (nur im Status 'draft')
   */
  static async update(
    id: number, 
    updates: Partial<CreateInvoiceInput>, 
    adminUserId: number
  ): Promise<{ success: boolean; error?: string }> {
    const pool = await getConnection();

    // Aktuelle Rechnung laden
    const invoice = await this.getById(id);
    if (!invoice) {
      return { success: false, error: "Rechnung nicht gefunden" };
    }

    // Immutabilität prüfen
    if (IMMUTABLE_STATUSES.includes(invoice.status)) {
      return { 
        success: false, 
        error: `Rechnung im Status '${invoice.status}' kann nicht mehr bearbeitet werden` 
      };
    }

    try {
      // Beträge neu berechnen falls line_items geändert
      let netAmount = invoice.net_amount;
      let taxAmount = invoice.tax_amount;
      let grossAmount = invoice.gross_amount;
      const taxRate = updates.tax_rate ?? invoice.tax_rate;

      if (updates.line_items) {
        netAmount = updates.line_items.reduce((sum, item) => sum + item.total, 0);
        taxAmount = Math.round(netAmount * (taxRate / 100) * 100) / 100;
        grossAmount = Math.round((netAmount + taxAmount) * 100) / 100;
      }

      await pool.execute(`
        UPDATE lopez_customer_invoices SET
          project_id = COALESCE(?, project_id),
          line_items = COALESCE(?, line_items),
          invoice_date = COALESCE(?, invoice_date),
          due_date = COALESCE(?, due_date),
          notes = COALESCE(?, notes),
          internal_notes = COALESCE(?, internal_notes),
          tax_rate = ?,
          net_amount = ?,
          tax_amount = ?,
          gross_amount = ?,
          updated_at = NOW()
        WHERE id = ?
      `, [
        updates.project_id ?? null,
        updates.line_items ? JSON.stringify(updates.line_items) : null,
        updates.invoice_date ?? null,
        updates.due_date ?? null,
        updates.notes ?? null,
        updates.internal_notes ?? null,
        taxRate,
        netAmount,
        taxAmount,
        grossAmount,
        id
      ]);

      // Audit-Log
      await this.logAudit(pool, id, adminUserId, 'INVOICE_UPDATED', { updates });

      return { success: true };

    } catch (error) {
      console.error("❌ Invoice Update Error:", error);
      return { success: false, error: "Fehler beim Aktualisieren" };
    }
  }

  /**
   * Ändert den Status einer Rechnung
   */
  static async changeStatus(
    id: number, 
    newStatus: InvoiceStatus, 
    adminUserId: number
  ): Promise<{ success: boolean; error?: string }> {
    const pool = await getConnection();

    // Aktuelle Rechnung laden
    const invoice = await this.getById(id);
    if (!invoice) {
      return { success: false, error: "Rechnung nicht gefunden" };
    }

    // Übergang prüfen
    const allowedTransitions = ALLOWED_TRANSITIONS[invoice.status];
    if (!allowedTransitions.includes(newStatus)) {
      return { 
        success: false, 
        error: `Status-Wechsel von '${invoice.status}' zu '${newStatus}' nicht erlaubt` 
      };
    }

    try {
      const updates: Record<string, unknown> = { status: newStatus };
      
      // paid_at setzen wenn Status auf 'paid' wechselt
      if (newStatus === 'paid') {
        updates.paid_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
      }

      await pool.execute(`
        UPDATE lopez_customer_invoices SET
          status = ?,
          paid_at = ?,
          updated_at = NOW()
        WHERE id = ?
      `, [newStatus, updates.paid_at || null, id]);

      // Audit-Log (wichtig für Statuswechsel!)
      await this.logAudit(pool, id, adminUserId, 'INVOICE_STATUS_CHANGED', {
        old_status: invoice.status,
        new_status: newStatus,
        invoice_number: invoice.invoice_number
      });

      return { success: true };

    } catch (error) {
      console.error("❌ Invoice Status Change Error:", error);
      return { success: false, error: "Fehler beim Status-Wechsel" };
    }
  }

  /**
   * Speichert PDF-Pfad
   */
  static async setPdfPath(id: number, pdfPath: string): Promise<void> {
    const pool = await getConnection();
    await pool.execute(`
      UPDATE lopez_customer_invoices SET
        pdf_path = ?,
        pdf_generated_at = NOW()
      WHERE id = ?
    `, [pdfPath, id]);
  }

  /**
   * Generiert einen sicheren Dateinamen für die PDF
   */
  static generatePdfFilename(invoice: Invoice): string {
    const year = new Date(invoice.invoice_date).getFullYear();
    const hash = crypto.createHash('sha256')
      .update(`${invoice.id}-${invoice.invoice_number}-${invoice.customer_id}`)
      .digest('hex')
      .slice(0, 12);
    
    return `${year}/${invoice.customer_id}/${invoice.id}-${hash}.pdf`;
  }

  /**
   * Prüft ob ein Kunde Zugriff auf eine Rechnung hat
   */
  static async canCustomerAccess(invoiceId: number, customerId: number): Promise<boolean> {
    const pool = await getConnection();
    const [rows] = await pool.execute<RowDataPacket[]>(`
      SELECT id FROM lopez_customer_invoices 
      WHERE id = ? AND customer_id = ?
    `, [invoiceId, customerId]);
    return rows.length > 0;
  }

  /**
   * Audit-Log schreiben
   */
  private static async logAudit(
    pool: Awaited<ReturnType<typeof getConnection>>,
    invoiceId: number,
    userId: number,
    action: string,
    details: Record<string, unknown>
  ): Promise<void> {
    try {
      await pool.execute(`
        INSERT INTO lopez_audit_logs 
          (table_name, record_id, action, user_id, new_values, compliance_category, severity)
        VALUES ('lopez_customer_invoices', ?, ?, ?, ?, 'BILLING', 'MEDIUM')
      `, [invoiceId, action, userId, JSON.stringify(details)]);
    } catch (error) {
      console.error("Audit Log Error:", error);
      // Nicht abbrechen, nur loggen
    }
  }

  // =====================================================
  // AI-READY METHODEN (für spätere Integration)
  // =====================================================

  /**
   * Aggregierte Statistiken für AI-Analyse
   */
  static async getAnalyticsData(customerId?: number): Promise<{
    total_invoices: number;
    total_revenue: number;
    avg_invoice_value: number;
    status_distribution: Record<InvoiceStatus, number>;
    monthly_revenue: { month: string; revenue: number }[];
  }> {
    const pool = await getConnection();
    const whereClause = customerId ? 'WHERE customer_id = ?' : '';
    const params = customerId ? [customerId] : [];

    // Basis-Statistiken
    const [stats] = await pool.execute<RowDataPacket[]>(`
      SELECT 
        COUNT(*) as total_invoices,
        COALESCE(SUM(gross_amount), 0) as total_revenue,
        COALESCE(AVG(gross_amount), 0) as avg_invoice_value
      FROM lopez_customer_invoices ${whereClause}
    `, params);

    // Status-Verteilung
    const [statusDist] = await pool.execute<RowDataPacket[]>(`
      SELECT status, COUNT(*) as count
      FROM lopez_customer_invoices ${whereClause}
      GROUP BY status
    `, params);

    // Monatlicher Umsatz (letzte 12 Monate)
    const [monthly] = await pool.execute<RowDataPacket[]>(`
      SELECT 
        DATE_FORMAT(invoice_date, '%Y-%m') as month,
        SUM(gross_amount) as revenue
      FROM lopez_customer_invoices 
      ${whereClause ? whereClause + ' AND' : 'WHERE'} 
        invoice_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 12 MONTH)
        AND status IN ('sent', 'paid')
      GROUP BY DATE_FORMAT(invoice_date, '%Y-%m')
      ORDER BY month DESC
    `, params);

    const statusDistribution: Record<InvoiceStatus, number> = {
      draft: 0, sent: 0, paid: 0, overdue: 0, cancelled: 0
    };
    statusDist.forEach(row => {
      statusDistribution[row.status as InvoiceStatus] = row.count;
    });

    return {
      total_invoices: stats[0]?.total_invoices || 0,
      total_revenue: Number(stats[0]?.total_revenue || 0),
      avg_invoice_value: Number(stats[0]?.avg_invoice_value || 0),
      status_distribution: statusDistribution,
      monthly_revenue: monthly.map(row => ({
        month: row.month,
        revenue: Number(row.revenue)
      }))
    };
  }
}

export default InvoiceService;

