// =====================================================
// AI CENTER - MULTI-TENANT SERVICE
// =====================================================
// Enterprise++ Mandanten- und Projekt-Verwaltung
// SaaS-Ready Architektur
// =====================================================

import { getConnection } from "@/lib/database";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";

// =====================================================
// TYPEN
// =====================================================

export type TenantStatus = "active" | "suspended" | "trial" | "cancelled";

export interface Tenant {
  id: number;
  code: string;              // Eindeutiger Code z.B. "LOPEZ-IT" oder "KUNDE-XYZ"
  name: string;
  description: string;
  status: TenantStatus;
  
  // Limits
  cost_limit_daily: number;
  cost_limit_monthly: number;
  rate_limit_per_minute: number;
  storage_limit_mb: number;
  
  // Features
  features_enabled: string[];   // z.B. ["workflows", "playbooks", "agents"]
  ai_providers_allowed: string[]; // z.B. ["openai", "anthropic"]
  
  // Kontakt
  contact_email: string;
  contact_name: string;
  
  // Statistik
  current_cost_daily: number;
  current_cost_monthly: number;
  
  // Meta
  created_at: Date;
  updated_at: Date;
}

export interface TenantContext {
  tenant_id: number;
  tenant_code: string;
  project_code?: string;
  user_id: number;
  limits: {
    cost_limit_daily: number;
    cost_limit_monthly: number;
    rate_limit_per_minute: number;
  };
  features: string[];
  providers: string[];
}

export interface Project {
  id: number;
  tenant_id: number;
  code: string;
  name: string;
  description: string;
  status: "active" | "archived" | "paused";
  settings: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

// =====================================================
// DEFAULT TENANT (Lopez IT Welt)
// =====================================================

export const DEFAULT_TENANT: Omit<Tenant, "id" | "created_at" | "updated_at" | "current_cost_daily" | "current_cost_monthly"> = {
  code: "LOPEZ-IT-WELT",
  name: "Lopez IT Welt",
  description: "Enterprise++ Hauptsystem",
  status: "active",
  cost_limit_daily: 50,
  cost_limit_monthly: 500,
  rate_limit_per_minute: 100,
  storage_limit_mb: 10240, // 10 GB
  features_enabled: [
    "agents", "workflows", "playbooks", "monitoring",
    "dev_tasks", "project_analyzer", "risk_to_task"
  ],
  ai_providers_allowed: ["openai", "anthropic", "local"],
  contact_email: "admin@lopez-it-welt.de",
  contact_name: "Admin"
};

// =====================================================
// TENANT SERVICE
// =====================================================

export class TenantService {
  
  // -------------------------------------------------
  // TENANT CRUD
  // -------------------------------------------------
  
  /**
   * Erstellt einen neuen Mandanten
   */
  static async createTenant(tenant: Omit<Tenant, "id" | "created_at" | "updated_at" | "current_cost_daily" | "current_cost_monthly">): Promise<Tenant> {
    const pool = await getConnection();
    
    const [result] = await pool.execute<ResultSetHeader>(`
      INSERT INTO ai_tenants 
        (code, name, description, status, cost_limit_daily, cost_limit_monthly, 
         rate_limit_per_minute, storage_limit_mb, features_enabled, ai_providers_allowed,
         contact_email, contact_name)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      tenant.code,
      tenant.name,
      tenant.description,
      tenant.status,
      tenant.cost_limit_daily,
      tenant.cost_limit_monthly,
      tenant.rate_limit_per_minute,
      tenant.storage_limit_mb,
      JSON.stringify(tenant.features_enabled),
      JSON.stringify(tenant.ai_providers_allowed),
      tenant.contact_email,
      tenant.contact_name
    ]);
    
    return this.getTenantById(result.insertId) as Promise<Tenant>;
  }
  
  /**
   * Holt Mandant nach ID
   */
  static async getTenantById(id: number): Promise<Tenant | null> {
    const pool = await getConnection();
    
    const [rows] = await pool.execute<RowDataPacket[]>(`
      SELECT * FROM ai_tenants WHERE id = ?
    `, [id]);
    
    if (rows.length === 0) return null;
    return this.mapRowToTenant(rows[0]);
  }
  
  /**
   * Holt Mandant nach Code
   */
  static async getTenantByCode(code: string): Promise<Tenant | null> {
    const pool = await getConnection();
    
    const [rows] = await pool.execute<RowDataPacket[]>(`
      SELECT * FROM ai_tenants WHERE code = ?
    `, [code]);
    
    if (rows.length === 0) return null;
    return this.mapRowToTenant(rows[0]);
  }
  
  /**
   * Listet alle Mandanten
   */
  static async listTenants(status?: TenantStatus): Promise<Tenant[]> {
    const pool = await getConnection();
    
    let query = "SELECT * FROM ai_tenants";
    const params: any[] = [];
    
    if (status) {
      query += " WHERE status = ?";
      params.push(status);
    }
    
    query += " ORDER BY name ASC";
    
    const [rows] = await pool.execute<RowDataPacket[]>(query, params);
    return rows.map(row => this.mapRowToTenant(row));
  }
  
  /**
   * Aktualisiert Mandant
   */
  static async updateTenant(id: number, updates: Partial<Tenant>): Promise<Tenant | null> {
    const pool = await getConnection();
    
    const fields: string[] = [];
    const values: any[] = [];
    
    if (updates.name !== undefined) { fields.push("name = ?"); values.push(updates.name); }
    if (updates.description !== undefined) { fields.push("description = ?"); values.push(updates.description); }
    if (updates.status !== undefined) { fields.push("status = ?"); values.push(updates.status); }
    if (updates.cost_limit_daily !== undefined) { fields.push("cost_limit_daily = ?"); values.push(updates.cost_limit_daily); }
    if (updates.cost_limit_monthly !== undefined) { fields.push("cost_limit_monthly = ?"); values.push(updates.cost_limit_monthly); }
    if (updates.rate_limit_per_minute !== undefined) { fields.push("rate_limit_per_minute = ?"); values.push(updates.rate_limit_per_minute); }
    if (updates.features_enabled !== undefined) { fields.push("features_enabled = ?"); values.push(JSON.stringify(updates.features_enabled)); }
    if (updates.ai_providers_allowed !== undefined) { fields.push("ai_providers_allowed = ?"); values.push(JSON.stringify(updates.ai_providers_allowed)); }
    
    if (fields.length === 0) return this.getTenantById(id);
    
    values.push(id);
    
    await pool.execute(`
      UPDATE ai_tenants SET ${fields.join(", ")}, updated_at = NOW() WHERE id = ?
    `, values);
    
    return this.getTenantById(id);
  }
  
  // -------------------------------------------------
  // PROJEKT-VERWALTUNG
  // -------------------------------------------------
  
  /**
   * Erstellt ein Projekt für einen Mandanten
   */
  static async createProject(tenantId: number, project: Omit<Project, "id" | "tenant_id" | "created_at" | "updated_at">): Promise<Project> {
    const pool = await getConnection();
    
    const [result] = await pool.execute<ResultSetHeader>(`
      INSERT INTO ai_tenant_projects (tenant_id, code, name, description, status, settings)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      tenantId,
      project.code,
      project.name,
      project.description,
      project.status,
      JSON.stringify(project.settings || {})
    ]);
    
    return this.getProjectById(result.insertId) as Promise<Project>;
  }
  
  /**
   * Holt Projekt nach ID
   */
  static async getProjectById(id: number): Promise<Project | null> {
    const pool = await getConnection();
    
    const [rows] = await pool.execute<RowDataPacket[]>(`
      SELECT * FROM ai_tenant_projects WHERE id = ?
    `, [id]);
    
    if (rows.length === 0) return null;
    return this.mapRowToProject(rows[0]);
  }
  
  /**
   * Listet Projekte eines Mandanten
   */
  static async listProjects(tenantId: number): Promise<Project[]> {
    const pool = await getConnection();
    
    const [rows] = await pool.execute<RowDataPacket[]>(`
      SELECT * FROM ai_tenant_projects WHERE tenant_id = ? ORDER BY name ASC
    `, [tenantId]);
    
    return rows.map(row => this.mapRowToProject(row));
  }
  
  // -------------------------------------------------
  // CONTEXT & ISOLATION
  // -------------------------------------------------
  
  /**
   * Erstellt einen Tenant-Context für API-Requests
   */
  static async getTenantContext(tenantCode: string, userId: number, projectCode?: string): Promise<TenantContext | null> {
    const tenant = await this.getTenantByCode(tenantCode);
    
    if (!tenant || tenant.status !== "active") {
      return null;
    }
    
    return {
      tenant_id: tenant.id,
      tenant_code: tenant.code,
      project_code: projectCode,
      user_id: userId,
      limits: {
        cost_limit_daily: tenant.cost_limit_daily,
        cost_limit_monthly: tenant.cost_limit_monthly,
        rate_limit_per_minute: tenant.rate_limit_per_minute
      },
      features: tenant.features_enabled,
      providers: tenant.ai_providers_allowed
    };
  }
  
  /**
   * Prüft ob ein Feature für den Mandanten aktiviert ist
   */
  static async isFeatureEnabled(tenantId: number, feature: string): Promise<boolean> {
    const tenant = await this.getTenantById(tenantId);
    if (!tenant) return false;
    return tenant.features_enabled.includes(feature);
  }
  
  /**
   * Prüft ob ein Provider für den Mandanten erlaubt ist
   */
  static async isProviderAllowed(tenantId: number, provider: string): Promise<boolean> {
    const tenant = await this.getTenantById(tenantId);
    if (!tenant) return false;
    return tenant.ai_providers_allowed.includes(provider);
  }
  
  /**
   * Aktualisiert Kosten für Mandanten
   */
  static async updateTenantCosts(tenantId: number, cost: number): Promise<void> {
    const pool = await getConnection();
    
    await pool.execute(`
      UPDATE ai_tenants 
      SET current_cost_daily = current_cost_daily + ?,
          current_cost_monthly = current_cost_monthly + ?
      WHERE id = ?
    `, [cost, cost, tenantId]);
  }
  
  /**
   * Setzt tägliche Kosten zurück (für Cron-Job)
   */
  static async resetDailyCosts(): Promise<void> {
    const pool = await getConnection();
    await pool.execute("UPDATE ai_tenants SET current_cost_daily = 0");
  }
  
  /**
   * Setzt monatliche Kosten zurück (für Cron-Job)
   */
  static async resetMonthlyCosts(): Promise<void> {
    const pool = await getConnection();
    await pool.execute("UPDATE ai_tenants SET current_cost_monthly = 0");
  }
  
  // -------------------------------------------------
  // HELPER
  // -------------------------------------------------
  
  private static mapRowToTenant(row: RowDataPacket): Tenant {
    return {
      id: row.id,
      code: row.code,
      name: row.name,
      description: row.description,
      status: row.status,
      cost_limit_daily: Number(row.cost_limit_daily),
      cost_limit_monthly: Number(row.cost_limit_monthly),
      rate_limit_per_minute: row.rate_limit_per_minute,
      storage_limit_mb: row.storage_limit_mb,
      features_enabled: JSON.parse(row.features_enabled || "[]"),
      ai_providers_allowed: JSON.parse(row.ai_providers_allowed || "[]"),
      contact_email: row.contact_email,
      contact_name: row.contact_name,
      current_cost_daily: Number(row.current_cost_daily) || 0,
      current_cost_monthly: Number(row.current_cost_monthly) || 0,
      created_at: row.created_at,
      updated_at: row.updated_at
    };
  }
  
  private static mapRowToProject(row: RowDataPacket): Project {
    return {
      id: row.id,
      tenant_id: row.tenant_id,
      code: row.code,
      name: row.name,
      description: row.description,
      status: row.status,
      settings: JSON.parse(row.settings || "{}"),
      created_at: row.created_at,
      updated_at: row.updated_at
    };
  }
}

export default TenantService;







