// =====================================================
// CUSTOMER SERVICE - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-01-19
// Zweck: CRUD-Operationen für Kundenverwaltung
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================

import { generateKundennummer } from "./database";
import { executeQueryPool, executeQueryPoolWithResult } from "@/lib/db";

// =====================================================
// INTERFACES
// =====================================================

export interface Customer {
  id?: number;
  kundennummer?: string;
  customer_type: "privat" | "firma" | "behörde" | "partner";
  anrede: string;
  titel?: string;
  vorname: string;
  nachname: string;
  firmenname?: string;
  email: string;
  telefon?: string;
  strasse?: string;
  plz?: string;
  ort?: string;
  land: string;
  status: "aktiv" | "inaktiv" | "gesperrt";
  support_level: "Standard" | "Premium" | "SLA 24h" | "SLA 4h";
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CustomerNote {
  id?: number;
  customer_id: number;
  note: string;
  created_by: string;
  created_at?: string;
}

export interface CustomerTag {
  id?: number;
  customer_id: number;
  tag_name: string;
  tag_color: string;
  created_at?: string;
}

export interface SearchFilters {
  customer_type?: string;
  status?: string;
  support_level?: string;
  land?: string;
  search?: string;
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: "ASC" | "DESC";
}

// =====================================================
// CUSTOMER SERVICE CLASS
// =====================================================

export class CustomerService {
  // =====================================================
  // KUNDEN CRUD-OPERATIONEN
  // =====================================================

  static async createCustomer(
    customerData: Omit<Customer, "id" | "kundennummer" | "created_at" | "updated_at">,
  ): Promise<Customer> {
    try {
      // Prüfe ob E-Mail bereits existiert
      const existingByEmail = await executeQueryPool<Customer[]>(
        "SELECT id, kundennummer FROM lopez_customers WHERE email = ?",
        [customerData.email],
      );
      
      if (existingByEmail.length > 0) {
        throw new Error(`Ein Kunde mit der E-Mail "${customerData.email}" existiert bereits (Kundennummer: ${existingByEmail[0].kundennummer})`);
      }

      const kundennummer = await generateKundennummer();

      const result = await executeQueryPoolWithResult(
        `
                INSERT INTO lopez_customers (
                    kundennummer, customer_type, anrede, titel, vorname, nachname,
                    firmenname, email, telefon, strasse, plz, ort, land,
                    status, support_level, notes
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
        [
          kundennummer,
          customerData.customer_type,
          customerData.anrede,
          customerData.titel || null,
          customerData.vorname,
          customerData.nachname,
          customerData.firmenname || null,
          customerData.email,
          customerData.telefon || null,
          customerData.strasse || null,
          customerData.plz || null,
          customerData.ort || null,
          customerData.land,
          customerData.status,
          customerData.support_level,
          customerData.notes || null,
        ],
      );

      const insertId = (result as any).insertId;
      const customer = await this.getCustomerById(insertId);

      // Audit-Log
      await this.logAudit("lopez_customers", insertId, "INSERT", null, customerData, "system");

      return customer!;
    } catch (error: any) {
      console.error("❌ Fehler beim Erstellen des Kunden:", error);
      
      // Bessere Fehlermeldung bei Duplikat-Fehler
      if (error?.code === "ER_DUP_ENTRY") {
        if (error?.sqlMessage?.includes("email")) {
          throw new Error(`Ein Kunde mit dieser E-Mail existiert bereits.`);
        } else if (error?.sqlMessage?.includes("kundennummer")) {
          throw new Error(`Kundennummer-Konflikt. Bitte versuchen Sie es erneut.`);
        } else if (error?.sqlMessage?.includes("PRIMARY")) {
          // Tabellen-Struktur-Problem - AUTO_INCREMENT fehlt
          throw new Error(`Datenbank-Struktur-Fehler. Bitte rufen Sie /api/admin/init-database auf, um die Tabelle zu reparieren.`);
        } else {
          throw new Error(`Duplikat-Eintrag: ${error?.sqlMessage}`);
        }
      }
      
      // Allgemeiner Fehler mit hilfreicher Meldung
      if (error?.message) {
        throw error;
      }
      
      throw new Error("Unbekannter Fehler beim Erstellen des Kunden. Bitte versuchen Sie es erneut.");
    }
  }

  static async getCustomerById(id: number): Promise<Customer | null> {
    try {
      const rows = await executeQueryPool<Customer[]>("SELECT * FROM lopez_customers WHERE id = ?", [id]);

      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error("❌ Fehler beim Laden des Kunden:", error);
      throw error;
    }
  }

  static async getCustomerByKundennummer(kundennummer: string): Promise<Customer | null> {
    try {
      const rows = await executeQueryPool<Customer[]>(
        "SELECT * FROM lopez_customers WHERE kundennummer = ?",
        [kundennummer],
      );

      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error("❌ Fehler beim Laden des Kunden:", error);
      throw error;
    }
  }

  static async updateCustomer(
    id: number,
    customerData: Partial<Customer>,
  ): Promise<Customer | null> {
    try {
      // Alte Daten laden für Audit-Log
      const oldCustomer = await this.getCustomerById(id);
      if (!oldCustomer) return null;

      // Update durchführen
      const updateFields: string[] = [];
      const updateValues: unknown[] = [];

      Object.entries(customerData).forEach(([key, value]) => {
        if (key !== "id" && key !== "kundennummer" && key !== "created_at" && value !== undefined) {
          updateFields.push(`${key} = ?`);
          updateValues.push(value);
        }
      });

      if (updateFields.length === 0) return oldCustomer;

      updateValues.push(id);

      await executeQueryPool(
        `
                UPDATE lopez_customers 
                SET ${updateFields.join(", ")}, updated_at = CURRENT_TIMESTAMP 
                WHERE id = ?
            `,
        updateValues,
      );

      const updatedCustomer = await this.getCustomerById(id);

      // Audit-Log
      await this.logAudit("lopez_customers", id, "UPDATE", oldCustomer, customerData, "system");

      return updatedCustomer;
    } catch (error) {
      console.error("❌ Fehler beim Aktualisieren des Kunden:", error);
      throw error;
    }
  }

  static async deleteCustomer(id: number): Promise<boolean> {
    try {
      // Alte Daten laden für Audit-Log
      const oldCustomer = await this.getCustomerById(id);
      if (!oldCustomer) return false;

      await executeQueryPool("DELETE FROM lopez_customers WHERE id = ?", [id]);

      // Audit-Log
      await this.logAudit("lopez_customers", id, "DELETE", oldCustomer, null, "system");

      return true;
    } catch (error) {
      console.error("❌ Fehler beim Löschen des Kunden:", error);
      throw error;
    }
  }

  // =====================================================
  // KUNDEN-SUCHE & FILTER
  // =====================================================

  static async searchCustomers(
    filters: SearchFilters = {},
  ): Promise<{ customers: Customer[]; total: number }> {
    try {
      const {
        customer_type,
        status,
        support_level,
        land,
        search,
        page = 1,
        limit = 50,
        sort_by = "created_at",
        sort_order = "DESC",
      } = filters;

      const offset = (page - 1) * limit;

      // WHERE-Bedingungen aufbauen
      const whereConditions = [];
      const queryParams = [];

      if (customer_type) {
        whereConditions.push("customer_type = ?");
        queryParams.push(customer_type);
      }

      if (status) {
        whereConditions.push("status = ?");
        queryParams.push(status);
      }

      if (support_level) {
        whereConditions.push("support_level = ?");
        queryParams.push(support_level);
      }

      if (land) {
        whereConditions.push("land = ?");
        queryParams.push(land);
      }

      if (search) {
        whereConditions.push(`(
                    kundennummer LIKE ? OR 
                    vorname LIKE ? OR 
                    nachname LIKE ? OR 
                    firmenname LIKE ? OR 
                    email LIKE ? OR 
                    telefon LIKE ?
                )`);
        const searchTerm = `%${search}%`;
        queryParams.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
      }

      const whereClause =
        whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";

      // Gesamtanzahl ermitteln
      const countQuery = `SELECT COUNT(*) as total FROM lopez_customers ${whereClause}`;
      const countRows = await executeQueryPool<any[]>(countQuery, queryParams);
      const total = countRows[0].total;

      // Kunden laden
      const customersQuery = `
                SELECT * FROM lopez_customers 
                ${whereClause}
                ORDER BY ${sort_by} ${sort_order}
                LIMIT ? OFFSET ?
            `;

      const customerRows = await executeQueryPool<Customer[]>(customersQuery, [
        ...queryParams,
        limit,
        offset,
      ]);

      return {
        customers: customerRows,
        total,
      };
    } catch (error) {
      console.error("❌ Fehler bei der Kundensuche:", error);
      throw error;
    }
  }

  // =====================================================
  // FUZZY SEARCH
  // =====================================================

  static async fuzzySearch(query: string, limit: number = 10): Promise<Customer[]> {
    try {
      // Fuzzy Search mit SOUNDEX und LIKE
      const searchQuery = `
                SELECT *, 
                CASE 
                    WHEN kundennummer LIKE ? THEN 100
                    WHEN vorname LIKE ? OR nachname LIKE ? OR firmenname LIKE ? THEN 80
                    WHEN email LIKE ? THEN 70
                    WHEN telefon LIKE ? THEN 60
                    ELSE 50
                END as relevance
                FROM lopez_customers 
                WHERE (
                    kundennummer LIKE ? OR 
                    vorname LIKE ? OR 
                    nachname LIKE ? OR 
                    firmenname LIKE ? OR 
                    email LIKE ? OR 
                    telefon LIKE ? OR
                    SOUNDEX(vorname) = SOUNDEX(?) OR
                    SOUNDEX(nachname) = SOUNDEX(?) OR
                    SOUNDEX(firmenname) = SOUNDEX(?)
                )
                ORDER BY relevance DESC, created_at DESC
                LIMIT ?
            `;

      const searchTerm = `%${query}%`;
      const exactTerm = query;

      const rows = await executeQueryPool<Customer[]>(searchQuery, [
        searchTerm,
        searchTerm,
        searchTerm,
        searchTerm,
        searchTerm,
        searchTerm, // relevance
        searchTerm,
        searchTerm,
        searchTerm,
        searchTerm,
        searchTerm,
        searchTerm, // WHERE
        exactTerm,
        exactTerm,
        exactTerm, // SOUNDEX
        limit,
      ]);

      return rows;
    } catch (error) {
      console.error("❌ Fehler bei der Fuzzy-Suche:", error);
      throw error;
    }
  }

  // =====================================================
  // AUDIT-LOGGING
  // =====================================================

  static async logAudit(
    tableName: string,
    recordId: number,
    action: "INSERT" | "UPDATE" | "DELETE",
    oldValues: any,
    newValues: any,
    userId: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    try {
      await executeQueryPool(
        `
                INSERT INTO lopez_audit_logs 
                (table_name, record_id, action, old_values, new_values, user_id, ip_address, user_agent)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `,
        [
          tableName,
          recordId,
          action,
          oldValues ? JSON.stringify(oldValues) : null,
          newValues ? JSON.stringify(newValues) : null,
          userId,
          ipAddress || null,
          userAgent || null,
        ],
      );
    } catch (error) {
      console.error("❌ Fehler beim Audit-Logging:", error);
      // Audit-Log-Fehler sollten nicht die Hauptoperation stoppen
    }
  }
}
