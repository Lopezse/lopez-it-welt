// =====================================================
// AI CENTER - SETTINGS SERVICE
// =====================================================
// Enterprise++ Konfigurationsverwaltung
// =====================================================

import { getConnection } from "@/lib/database";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";

// =====================================================
// TYPEN
// =====================================================

export interface AISettings {
  // Allgemein
  ai_center_enabled: boolean;
  demo_mode: boolean;
  
  // Provider
  default_provider: "openai" | "anthropic" | "local";
  openai_enabled: boolean;
  anthropic_enabled: boolean;
  local_enabled: boolean;
  
  // Kosten-Limits
  cost_limit_daily: number;
  cost_limit_monthly: number;
  cost_warning_threshold: number;  // Prozent (z.B. 80)
  
  // Rate-Limits
  rate_limit_per_minute: number;
  rate_limit_per_hour: number;
  rate_limit_per_day: number;
  
  // Timeouts
  timeout_quick_ms: number;
  timeout_normal_ms: number;
  timeout_long_ms: number;
  
  // Agenten
  agent_a_enabled: boolean;
  agent_b_enabled: boolean;
  agent_c_enabled: boolean;
  auto_planning_enabled: boolean;
  
  // Workflows
  workflows_enabled: boolean;
  auto_trigger_enabled: boolean;
  
  // Playbooks
  playbooks_enabled: boolean;
  dry_run_default: boolean;
  
  // Monitoring
  monitoring_interval_seconds: number;
  health_check_enabled: boolean;
  
  // Audit
  audit_enabled: boolean;
  audit_retention_days: number;
  
  // DSGVO
  dsgvo_strict_mode: boolean;
  require_consent_for_ai: boolean;
}

export const DEFAULT_SETTINGS: AISettings = {
  // Allgemein
  ai_center_enabled: true,
  demo_mode: true,
  
  // Provider
  default_provider: "openai",
  openai_enabled: true,
  anthropic_enabled: false,
  local_enabled: false,
  
  // Kosten-Limits
  cost_limit_daily: 10,
  cost_limit_monthly: 100,
  cost_warning_threshold: 80,
  
  // Rate-Limits
  rate_limit_per_minute: 30,
  rate_limit_per_hour: 300,
  rate_limit_per_day: 3000,
  
  // Timeouts
  timeout_quick_ms: 5000,
  timeout_normal_ms: 30000,
  timeout_long_ms: 120000,
  
  // Agenten
  agent_a_enabled: true,
  agent_b_enabled: true,
  agent_c_enabled: true,
  auto_planning_enabled: true,
  
  // Workflows
  workflows_enabled: true,
  auto_trigger_enabled: false,
  
  // Playbooks
  playbooks_enabled: true,
  dry_run_default: true,
  
  // Monitoring
  monitoring_interval_seconds: 30,
  health_check_enabled: true,
  
  // Audit
  audit_enabled: true,
  audit_retention_days: 90,
  
  // DSGVO
  dsgvo_strict_mode: true,
  require_consent_for_ai: true
};

// =====================================================
// SETTINGS SERVICE
// =====================================================

export class AISettingsService {
  
  private static cache: AISettings | null = null;
  private static cacheExpiry: number = 0;
  private static readonly CACHE_TTL = 60000; // 1 Minute
  
  /**
   * Lädt alle Settings
   */
  static async getSettings(): Promise<AISettings> {
    // Cache prüfen
    if (this.cache && Date.now() < this.cacheExpiry) {
      return this.cache;
    }
    
    try {
      const pool = await getConnection();
      
      const [rows] = await pool.execute<RowDataPacket[]>(`
        SELECT setting_key, setting_value, value_type
        FROM ai_settings
      `);
      
      // Mit Defaults starten
      const settings: AISettings = { ...DEFAULT_SETTINGS };
      
      // DB-Werte überschreiben
      for (const row of rows) {
        const key = row.setting_key as keyof AISettings;
        if (key in settings) {
          settings[key] = this.parseValue(row.setting_value, row.value_type) as any;
        }
      }
      
      // Cache aktualisieren
      this.cache = settings;
      this.cacheExpiry = Date.now() + this.CACHE_TTL;
      
      return settings;
    } catch (error) {
      console.log("AI Settings: Using defaults (table may not exist)");
      return DEFAULT_SETTINGS;
    }
  }
  
  /**
   * Aktualisiert ein Setting
   */
  static async updateSetting<K extends keyof AISettings>(
    key: K,
    value: AISettings[K]
  ): Promise<void> {
    const pool = await getConnection();
    
    const valueType = typeof value;
    const stringValue = JSON.stringify(value);
    
    await pool.execute(`
      INSERT INTO ai_settings (setting_key, setting_value, value_type, updated_at)
      VALUES (?, ?, ?, NOW())
      ON DUPLICATE KEY UPDATE
        setting_value = VALUES(setting_value),
        value_type = VALUES(value_type),
        updated_at = NOW()
    `, [key, stringValue, valueType]);
    
    // Cache invalidieren
    this.cache = null;
  }
  
  /**
   * Aktualisiert mehrere Settings
   */
  static async updateSettings(updates: Partial<AISettings>): Promise<void> {
    for (const [key, value] of Object.entries(updates)) {
      await this.updateSetting(key as keyof AISettings, value as any);
    }
  }
  
  /**
   * Setzt Settings auf Defaults zurück
   */
  static async resetToDefaults(): Promise<void> {
    const pool = await getConnection();
    
    await pool.execute("DELETE FROM ai_settings");
    
    // Cache invalidieren
    this.cache = null;
  }
  
  /**
   * Prüft ob ein Feature aktiviert ist
   */
  static async isFeatureEnabled(feature: keyof AISettings): Promise<boolean> {
    const settings = await this.getSettings();
    return !!settings[feature];
  }
  
  /**
   * Holt einen numerischen Wert
   */
  static async getNumericSetting(key: keyof AISettings): Promise<number> {
    const settings = await this.getSettings();
    return Number(settings[key]) || 0;
  }
  
  // -------------------------------------------------
  // HELPER
  // -------------------------------------------------
  
  private static parseValue(value: string, type: string): any {
    try {
      const parsed = JSON.parse(value);
      return parsed;
    } catch {
      return value;
    }
  }
}

// =====================================================
// COST TRACKER
// =====================================================

export interface CostEntry {
  date: string;
  provider: string;
  endpoint: string;
  tokens_input: number;
  tokens_output: number;
  cost: number;
}

export class AICostTracker {
  
  /**
   * Loggt Kosten für eine API-Nutzung
   */
  static async logCost(entry: Omit<CostEntry, "date">): Promise<void> {
    try {
      const pool = await getConnection();
      
      await pool.execute(`
        INSERT INTO ai_cost_tracking 
          (date, provider, endpoint, tokens_input, tokens_output, cost_total)
        VALUES (CURDATE(), ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          tokens_input = tokens_input + VALUES(tokens_input),
          tokens_output = tokens_output + VALUES(tokens_output),
          cost_total = cost_total + VALUES(cost_total)
      `, [
        entry.provider,
        entry.endpoint,
        entry.tokens_input,
        entry.tokens_output,
        entry.cost
      ]);
    } catch (error) {
      console.error("Cost Tracking Error:", error);
    }
  }
  
  /**
   * Holt Kosten für einen Zeitraum
   */
  static async getCosts(days: number = 30): Promise<{
    total: number;
    by_day: Record<string, number>;
    by_provider: Record<string, number>;
  }> {
    try {
      const pool = await getConnection();
      
      const [rows] = await pool.execute<RowDataPacket[]>(`
        SELECT 
          date,
          provider,
          SUM(cost_total) as cost
        FROM ai_cost_tracking
        WHERE date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
        GROUP BY date, provider
        ORDER BY date DESC
      `, [days]);
      
      const by_day: Record<string, number> = {};
      const by_provider: Record<string, number> = {};
      let total = 0;
      
      for (const row of rows) {
        const dateStr = new Date(row.date).toISOString().split("T")[0];
        by_day[dateStr] = (by_day[dateStr] || 0) + Number(row.cost);
        by_provider[row.provider] = (by_provider[row.provider] || 0) + Number(row.cost);
        total += Number(row.cost);
      }
      
      return { total, by_day, by_provider };
    } catch (error) {
      console.error("Cost Query Error:", error);
      return { total: 0, by_day: {}, by_provider: {} };
    }
  }
  
  /**
   * Prüft ob Kosten-Limit erreicht
   */
  static async checkCostLimit(): Promise<{
    allowed: boolean;
    current_daily: number;
    current_monthly: number;
    limit_daily: number;
    limit_monthly: number;
    warning: boolean;
  }> {
    const settings = await AISettingsService.getSettings();
    const costs = await this.getCosts(30);
    
    // Heutige Kosten
    const today = new Date().toISOString().split("T")[0];
    const current_daily = costs.by_day[today] || 0;
    
    // Monatliche Kosten (letzte 30 Tage)
    const current_monthly = costs.total;
    
    // Limits prüfen
    const daily_exceeded = current_daily >= settings.cost_limit_daily;
    const monthly_exceeded = current_monthly >= settings.cost_limit_monthly;
    
    // Warning bei Schwellenwert
    const daily_warning = (current_daily / settings.cost_limit_daily) * 100 >= settings.cost_warning_threshold;
    const monthly_warning = (current_monthly / settings.cost_limit_monthly) * 100 >= settings.cost_warning_threshold;
    
    return {
      allowed: !daily_exceeded && !monthly_exceeded,
      current_daily,
      current_monthly,
      limit_daily: settings.cost_limit_daily,
      limit_monthly: settings.cost_limit_monthly,
      warning: daily_warning || monthly_warning
    };
  }
}

export default {
  AISettingsService,
  AICostTracker,
  DEFAULT_SETTINGS
};

