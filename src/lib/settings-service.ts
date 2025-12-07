// =====================================================
// ENTERPRISE++ DYNAMIC SETTINGS SERVICE - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-12-01
// Zweck: Zentrale Settings-Verwaltung für Enterprise++ System
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================

import { getConnection } from "./database";
import { RowDataPacket } from "mysql2/promise";

// =====================================================
// TYPEN & INTERFACES
// =====================================================

export interface SettingsGroup {
  id: number;
  key: string;
  name: string;
  description: string | null;
  section: string;
  sort_order: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface SettingsItem {
  id: number;
  group_id: number;
  key: string;
  label: string;
  description: string | null;
  type: "string" | "number" | "boolean" | "select" | "json" | "password";
  default_value: string | null;
  options_json: any | null;
  is_sensitive: boolean;
  is_ai_related: boolean;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
}

export interface SettingsValue {
  id: number;
  item_id: number;
  scope: string;
  value: string | null;
  updated_by_user_id: number | null;
  created_at: Date;
  updated_at: Date;
}

export interface SettingsItemWithValue extends SettingsItem {
  value: string | null;
  parsed_value: any;
}

export interface SettingsGroupWithItems extends SettingsGroup {
  items: SettingsItemWithValue[];
}

// =====================================================
// SETTINGS SERVICE CLASS
// =====================================================

export class SettingsService {
  /**
   * Holt alle Settings einer Gruppe mit aktuellen Werten
   */
  static async getSettingsByGroup(
    groupKey: string,
    scope: string = "global"
  ): Promise<SettingsGroupWithItems | null> {
    const pool = await getConnection();

    // Gruppe laden
    const [groups] = await pool.execute<RowDataPacket[]>(
      `SELECT * FROM lopez_settings_groups WHERE \`key\` = ? AND is_active = TRUE`,
      [groupKey]
    );

    if (groups.length === 0) {
      return null;
    }

    const group = groups[0] as SettingsGroup;

    // Items mit Werten laden
    const [items] = await pool.execute<RowDataPacket[]>(
      `SELECT 
        si.*,
        sv.value as current_value
      FROM lopez_settings_items si
      LEFT JOIN lopez_settings_values sv ON si.id = sv.item_id AND sv.scope = ?
      WHERE si.group_id = ?
      ORDER BY si.sort_order ASC`,
      [scope, group.id]
    );

    const itemsWithValues: SettingsItemWithValue[] = (items as any[]).map(
      (item) => ({
        ...item,
        value: item.current_value ?? item.default_value,
        parsed_value: this.parseValue(
          item.current_value ?? item.default_value,
          item.type
        ),
      })
    );

    return {
      ...group,
      items: itemsWithValues,
    };
  }

  /**
   * Aktualisiert mehrere Settings einer Gruppe
   */
  static async updateSettings(
    groupKey: string,
    values: Record<string, any>,
    scope: string = "global",
    userId?: number
  ): Promise<boolean> {
    const pool = await getConnection();
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Gruppe-ID ermitteln
      const [groups] = await connection.execute<RowDataPacket[]>(
        `SELECT id FROM lopez_settings_groups WHERE \`key\` = ?`,
        [groupKey]
      );

      if (groups.length === 0) {
        throw new Error(`Settings-Gruppe "${groupKey}" nicht gefunden`);
      }

      const groupId = (groups[0] as any).id;

      // Alle Items der Gruppe laden
      const [items] = await connection.execute<RowDataPacket[]>(
        `SELECT id, \`key\`, type FROM lopez_settings_items WHERE group_id = ?`,
        [groupId]
      );

      // Jeden Wert speichern/aktualisieren
      for (const item of items as any[]) {
        if (values.hasOwnProperty(item.key)) {
          const stringValue = this.stringifyValue(values[item.key], item.type);

          await connection.execute(
            `INSERT INTO lopez_settings_values (item_id, scope, value, updated_by_user_id)
             VALUES (?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE value = VALUES(value), updated_by_user_id = VALUES(updated_by_user_id)`,
            [item.id, scope, stringValue, userId || null]
          );
        }
      }

      await connection.commit();
      console.log(`✅ Settings für Gruppe "${groupKey}" aktualisiert`);
      return true;
    } catch (error) {
      await connection.rollback();
      console.error(`❌ Fehler beim Aktualisieren der Settings:`, error);
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Holt einen einzelnen Setting-Wert
   */
  static async getSetting(
    key: string,
    scope: string = "global"
  ): Promise<any | null> {
    const pool = await getConnection();

    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT 
        si.type, 
        si.default_value,
        sv.value as current_value
      FROM lopez_settings_items si
      LEFT JOIN lopez_settings_values sv ON si.id = sv.item_id AND sv.scope = ?
      WHERE si.\`key\` = ?`,
      [scope, key]
    );

    if (rows.length === 0) {
      return null;
    }

    const row = rows[0] as any;
    const value = row.current_value ?? row.default_value;
    return this.parseValue(value, row.type);
  }

  /**
   * Setzt einen einzelnen Setting-Wert
   */
  static async setSetting(
    key: string,
    value: any,
    scope: string = "global",
    userId?: number
  ): Promise<boolean> {
    const pool = await getConnection();

    // Item-ID und Typ ermitteln
    const [items] = await pool.execute<RowDataPacket[]>(
      `SELECT id, type FROM lopez_settings_items WHERE \`key\` = ?`,
      [key]
    );

    if (items.length === 0) {
      throw new Error(`Setting "${key}" nicht gefunden`);
    }

    const item = items[0] as any;
    const stringValue = this.stringifyValue(value, item.type);

    await pool.execute(
      `INSERT INTO lopez_settings_values (item_id, scope, value, updated_by_user_id)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE value = VALUES(value), updated_by_user_id = VALUES(updated_by_user_id)`,
      [item.id, scope, stringValue, userId || null]
    );

    console.log(`✅ Setting "${key}" auf "${stringValue}" gesetzt`);
    return true;
  }

  /**
   * Holt alle Settings-Gruppen
   */
  static async getAllGroups(): Promise<SettingsGroup[]> {
    const pool = await getConnection();

    const [groups] = await pool.execute<RowDataPacket[]>(
      `SELECT * FROM lopez_settings_groups WHERE is_active = TRUE ORDER BY sort_order ASC`
    );

    return groups as SettingsGroup[];
  }

  /**
   * Holt alle Settings einer Sektion (z.B. "security")
   */
  static async getSettingsBySection(
    section: string,
    scope: string = "global"
  ): Promise<SettingsGroupWithItems[]> {
    const pool = await getConnection();

    const [groups] = await pool.execute<RowDataPacket[]>(
      `SELECT * FROM lopez_settings_groups WHERE section = ? AND is_active = TRUE ORDER BY sort_order ASC`,
      [section]
    );

    const result: SettingsGroupWithItems[] = [];

    for (const group of groups as SettingsGroup[]) {
      const groupWithItems = await this.getSettingsByGroup(group.key, scope);
      if (groupWithItems) {
        result.push(groupWithItems);
      }
    }

    return result;
  }

  // =====================================================
  // HILFSFUNKTIONEN
  // =====================================================

  /**
   * Parst einen String-Wert in den richtigen Datentyp
   */
  private static parseValue(value: string | null, type: string): any {
    if (value === null || value === undefined) {
      return null;
    }

    switch (type) {
      case "number":
        return parseFloat(value) || 0;
      case "boolean":
        return value === "true" || value === "1";
      case "json":
        try {
          return JSON.parse(value);
        } catch {
          return value;
        }
      case "select":
      case "string":
      case "password":
      default:
        return value;
    }
  }

  /**
   * Konvertiert einen Wert in einen String für die DB
   */
  private static stringifyValue(value: any, type: string): string {
    if (value === null || value === undefined) {
      return "";
    }

    switch (type) {
      case "boolean":
        return value ? "true" : "false";
      case "json":
        return typeof value === "string" ? value : JSON.stringify(value);
      case "number":
        return String(value);
      default:
        return String(value);
    }
  }
}

// =====================================================
// EXPORT DEFAULT
// =====================================================
export default SettingsService;
















