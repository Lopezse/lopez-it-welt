// =====================================================
// AI CENTER - AI MODEL REGISTRY
// =====================================================
// Enterprise++ EU AI Act Compliance
// Modell-Verwaltung, Risiko-Kategorisierung, DSFA
// =====================================================

import { getConnection } from "@/lib/database";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";

// =====================================================
// EU AI ACT RISIKO-KATEGORIEN
// =====================================================
// Gemäß EU AI Act (2024):
// - UNACCEPTABLE: Verboten (z.B. Social Scoring, Realtime Biometrie)
// - HIGH: Hohes Risiko, strenge Anforderungen (z.B. HR-Entscheidungen)
// - LIMITED: Begrenzt, Transparenzpflichten (z.B. Chatbots)
// - MINIMAL: Minimal, freiwillige Codes of Conduct
// =====================================================

export type AIRiskCategory = "unacceptable" | "high" | "limited" | "minimal";
export type ModelStatus = "draft" | "testing" | "approved" | "deprecated" | "blocked";
export type ModelProvider = "openai" | "anthropic" | "google" | "local" | "custom";

export interface AIModel {
  id: number;
  
  // Identifikation
  code: string;              // z.B. "gpt-4o", "claude-3-opus"
  name: string;
  provider: ModelProvider;
  version: string;
  
  // EU AI Act Klassifizierung
  risk_category: AIRiskCategory;
  risk_justification: string;
  dsfa_required: boolean;     // Datenschutz-Folgenabschätzung erforderlich
  dsfa_document_url?: string;
  
  // Status & Freigabe
  status: ModelStatus;
  approved_by?: string;
  approved_at?: Date;
  approval_notes?: string;
  
  // Verwendung
  allowed_use_cases: string[];    // z.B. ["text_generation", "code_review"]
  prohibited_use_cases: string[]; // z.B. ["biometric_identification"]
  requires_human_oversight: boolean;
  max_autonomy_level: number;     // 1-5 (1=nur Vorschläge, 5=vollautomatisch)
  
  // Technische Details
  input_types: string[];          // z.B. ["text", "image"]
  output_types: string[];
  max_tokens: number;
  cost_per_1k_input: number;
  cost_per_1k_output: number;
  
  // Compliance
  gdpr_compliant: boolean;
  data_processing_location: string; // z.B. "EU", "US", "global"
  data_retention_policy: string;
  
  // Meta
  documentation_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface DSFAAssessment {
  id: number;
  model_id: number;
  
  // Assessment-Details
  assessment_date: Date;
  assessor_name: string;
  
  // Risiko-Bewertung
  data_types_processed: string[];    // z.B. ["personal_data", "biometric"]
  processing_purposes: string[];
  data_subjects: string[];           // z.B. ["employees", "customers"]
  
  // Risiko-Analyse
  identified_risks: {
    risk: string;
    likelihood: "low" | "medium" | "high";
    impact: "low" | "medium" | "high";
    mitigation: string;
  }[];
  
  // Maßnahmen
  technical_measures: string[];
  organizational_measures: string[];
  
  // Ergebnis
  overall_risk_level: "acceptable" | "acceptable_with_measures" | "unacceptable";
  recommendation: "approve" | "approve_with_conditions" | "reject";
  conditions?: string[];
  
  // Status
  status: "draft" | "review" | "approved" | "rejected";
  approved_by?: string;
  approved_at?: Date;
  
  created_at: Date;
  updated_at: Date;
}

// =====================================================
// STANDARD-MODELLE
// =====================================================

export const DEFAULT_AI_MODELS: Omit<AIModel, "id" | "created_at" | "updated_at" | "approved_at">[] = [
  {
    code: "gpt-4o",
    name: "GPT-4o (OpenAI)",
    provider: "openai",
    version: "2024-05",
    risk_category: "limited",
    risk_justification: "Allgemeiner Text-Generator ohne spezifische Hochrisiko-Anwendungen",
    dsfa_required: false,
    status: "approved",
    approved_by: "system",
    approval_notes: "Standard-Freigabe für allgemeine Textverarbeitung",
    allowed_use_cases: ["text_generation", "code_review", "documentation", "analysis"],
    prohibited_use_cases: ["biometric_identification", "social_scoring", "hr_decisions"],
    requires_human_oversight: true,
    max_autonomy_level: 3,
    input_types: ["text", "image"],
    output_types: ["text"],
    max_tokens: 128000,
    cost_per_1k_input: 0.005,
    cost_per_1k_output: 0.015,
    gdpr_compliant: true,
    data_processing_location: "US (EU Data Processing Agreement)",
    data_retention_policy: "30 Tage API-Logs, keine Trainingsdaten"
  },
  {
    code: "gpt-4o-mini",
    name: "GPT-4o Mini (OpenAI)",
    provider: "openai",
    version: "2024-07",
    risk_category: "minimal",
    risk_justification: "Leichtgewichtiges Modell für einfache Aufgaben",
    dsfa_required: false,
    status: "approved",
    approved_by: "system",
    approval_notes: "Standard-Freigabe",
    allowed_use_cases: ["text_generation", "simple_analysis", "formatting"],
    prohibited_use_cases: ["biometric_identification", "social_scoring"],
    requires_human_oversight: false,
    max_autonomy_level: 4,
    input_types: ["text"],
    output_types: ["text"],
    max_tokens: 128000,
    cost_per_1k_input: 0.00015,
    cost_per_1k_output: 0.0006,
    gdpr_compliant: true,
    data_processing_location: "US (EU Data Processing Agreement)",
    data_retention_policy: "30 Tage API-Logs"
  },
  {
    code: "claude-3-5-sonnet",
    name: "Claude 3.5 Sonnet (Anthropic)",
    provider: "anthropic",
    version: "2024-10",
    risk_category: "limited",
    risk_justification: "Allgemeiner Text-Generator mit Fokus auf Sicherheit",
    dsfa_required: false,
    status: "approved",
    approved_by: "system",
    approval_notes: "Anthropic-Modelle gelten als besonders sicher",
    allowed_use_cases: ["text_generation", "code_generation", "analysis", "documentation"],
    prohibited_use_cases: ["biometric_identification", "social_scoring"],
    requires_human_oversight: true,
    max_autonomy_level: 3,
    input_types: ["text", "image"],
    output_types: ["text"],
    max_tokens: 200000,
    cost_per_1k_input: 0.003,
    cost_per_1k_output: 0.015,
    gdpr_compliant: true,
    data_processing_location: "US (EU Data Processing Agreement)",
    data_retention_policy: "Keine Speicherung von Prompts"
  },
  {
    code: "local-llm",
    name: "Lokales LLM (Self-Hosted)",
    provider: "local",
    version: "custom",
    risk_category: "minimal",
    risk_justification: "Vollständig on-premise, keine externen Datenflüsse",
    dsfa_required: false,
    status: "testing",
    allowed_use_cases: ["text_generation", "code_review", "internal_documentation"],
    prohibited_use_cases: [],
    requires_human_oversight: true,
    max_autonomy_level: 2,
    input_types: ["text"],
    output_types: ["text"],
    max_tokens: 32000,
    cost_per_1k_input: 0,
    cost_per_1k_output: 0,
    gdpr_compliant: true,
    data_processing_location: "On-Premise (DE)",
    data_retention_policy: "Nach internen Richtlinien"
  }
];

// =====================================================
// AI MODEL REGISTRY SERVICE
// =====================================================

export class AIModelRegistry {
  
  // -------------------------------------------------
  // MODEL CRUD
  // -------------------------------------------------
  
  /**
   * Registriert ein neues AI-Modell
   */
  static async registerModel(model: Omit<AIModel, "id" | "created_at" | "updated_at">): Promise<AIModel> {
    const pool = await getConnection();
    
    const [result] = await pool.execute<ResultSetHeader>(`
      INSERT INTO ai_model_registry 
        (code, name, provider, version, risk_category, risk_justification,
         dsfa_required, dsfa_document_url, status, approved_by, approved_at, approval_notes,
         allowed_use_cases, prohibited_use_cases, requires_human_oversight, max_autonomy_level,
         input_types, output_types, max_tokens, cost_per_1k_input, cost_per_1k_output,
         gdpr_compliant, data_processing_location, data_retention_policy, documentation_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      model.code, model.name, model.provider, model.version,
      model.risk_category, model.risk_justification,
      model.dsfa_required, model.dsfa_document_url || null,
      model.status, model.approved_by || null, model.approved_at || null, model.approval_notes || null,
      JSON.stringify(model.allowed_use_cases), JSON.stringify(model.prohibited_use_cases),
      model.requires_human_oversight, model.max_autonomy_level,
      JSON.stringify(model.input_types), JSON.stringify(model.output_types),
      model.max_tokens, model.cost_per_1k_input, model.cost_per_1k_output,
      model.gdpr_compliant, model.data_processing_location, model.data_retention_policy,
      model.documentation_url || null
    ]);
    
    return this.getModelById(result.insertId) as Promise<AIModel>;
  }
  
  /**
   * Holt Modell nach ID
   */
  static async getModelById(id: number): Promise<AIModel | null> {
    const pool = await getConnection();
    
    const [rows] = await pool.execute<RowDataPacket[]>(`
      SELECT * FROM ai_model_registry WHERE id = ?
    `, [id]);
    
    if (rows.length === 0) return null;
    return this.mapRowToModel(rows[0]);
  }
  
  /**
   * Holt Modell nach Code
   */
  static async getModelByCode(code: string): Promise<AIModel | null> {
    const pool = await getConnection();
    
    const [rows] = await pool.execute<RowDataPacket[]>(`
      SELECT * FROM ai_model_registry WHERE code = ?
    `, [code]);
    
    if (rows.length === 0) return null;
    return this.mapRowToModel(rows[0]);
  }
  
  /**
   * Listet alle Modelle
   */
  static async listModels(filters?: {
    status?: ModelStatus;
    provider?: ModelProvider;
    risk_category?: AIRiskCategory;
  }): Promise<AIModel[]> {
    const pool = await getConnection();
    
    let query = "SELECT * FROM ai_model_registry WHERE 1=1";
    const params: any[] = [];
    
    if (filters?.status) {
      query += " AND status = ?";
      params.push(filters.status);
    }
    if (filters?.provider) {
      query += " AND provider = ?";
      params.push(filters.provider);
    }
    if (filters?.risk_category) {
      query += " AND risk_category = ?";
      params.push(filters.risk_category);
    }
    
    query += " ORDER BY provider, name";
    
    const [rows] = await pool.execute<RowDataPacket[]>(query, params);
    return rows.map(row => this.mapRowToModel(row));
  }
  
  /**
   * Aktualisiert Modell-Status
   */
  static async updateModelStatus(
    id: number, 
    status: ModelStatus, 
    approvedBy?: string, 
    notes?: string
  ): Promise<AIModel | null> {
    const pool = await getConnection();
    
    await pool.execute(`
      UPDATE ai_model_registry 
      SET status = ?, 
          approved_by = ?, 
          approved_at = ${status === "approved" ? "NOW()" : "NULL"},
          approval_notes = ?,
          updated_at = NOW()
      WHERE id = ?
    `, [status, approvedBy || null, notes || null, id]);
    
    return this.getModelById(id);
  }
  
  // -------------------------------------------------
  // COMPLIANCE CHECKS
  // -------------------------------------------------
  
  /**
   * Prüft ob ein Modell für einen Use-Case verwendet werden darf
   */
  static async isUseCaseAllowed(modelCode: string, useCase: string): Promise<{
    allowed: boolean;
    reason?: string;
  }> {
    const model = await this.getModelByCode(modelCode);
    
    if (!model) {
      return { allowed: false, reason: "Modell nicht registriert" };
    }
    
    if (model.status !== "approved") {
      return { allowed: false, reason: `Modell-Status: ${model.status}` };
    }
    
    if (model.risk_category === "unacceptable") {
      return { allowed: false, reason: "Modell ist gemäß EU AI Act nicht erlaubt" };
    }
    
    if (model.prohibited_use_cases.includes(useCase)) {
      return { allowed: false, reason: `Use-Case '${useCase}' ist für dieses Modell verboten` };
    }
    
    if (!model.allowed_use_cases.includes(useCase) && model.allowed_use_cases.length > 0) {
      return { allowed: false, reason: `Use-Case '${useCase}' ist nicht explizit erlaubt` };
    }
    
    return { allowed: true };
  }
  
  /**
   * Gibt Compliance-Zusammenfassung für ein Modell
   */
  static async getComplianceSummary(modelCode: string): Promise<{
    model: AIModel;
    compliant: boolean;
    checks: { check: string; passed: boolean; details?: string }[];
  } | null> {
    const model = await this.getModelByCode(modelCode);
    if (!model) return null;
    
    const checks = [
      {
        check: "Modell-Status",
        passed: model.status === "approved",
        details: `Status: ${model.status}`
      },
      {
        check: "EU AI Act Risiko-Kategorie",
        passed: model.risk_category !== "unacceptable",
        details: `Kategorie: ${model.risk_category}`
      },
      {
        check: "DSGVO-Konformität",
        passed: model.gdpr_compliant,
        details: model.gdpr_compliant ? "DSGVO-konform" : "Nicht DSGVO-konform"
      },
      {
        check: "DSFA erforderlich",
        passed: !model.dsfa_required || !!model.dsfa_document_url,
        details: model.dsfa_required 
          ? (model.dsfa_document_url ? "DSFA vorhanden" : "DSFA fehlt!") 
          : "Keine DSFA erforderlich"
      },
      {
        check: "Human Oversight",
        passed: true, // Immer OK, nur Info
        details: model.requires_human_oversight 
          ? "Menschliche Aufsicht erforderlich" 
          : "Vollautomatischer Betrieb möglich"
      },
      {
        check: "Datenverarbeitung",
        passed: model.data_processing_location.includes("EU") || model.data_processing_location.includes("DE"),
        details: `Standort: ${model.data_processing_location}`
      }
    ];
    
    const compliant = checks.every(c => c.passed);
    
    return { model, compliant, checks };
  }
  
  /**
   * Listet alle Compliance-Warnungen
   */
  static async getComplianceWarnings(): Promise<{
    model_code: string;
    model_name: string;
    warnings: string[];
  }[]> {
    const models = await this.listModels();
    const warnings: { model_code: string; model_name: string; warnings: string[] }[] = [];
    
    for (const model of models) {
      const modelWarnings: string[] = [];
      
      if (model.status === "blocked") {
        modelWarnings.push("Modell ist blockiert");
      }
      if (model.risk_category === "high" && model.status === "approved") {
        modelWarnings.push("Hochrisiko-Modell in Produktion - regelmäßige Überprüfung erforderlich");
      }
      if (model.dsfa_required && !model.dsfa_document_url) {
        modelWarnings.push("DSFA erforderlich aber nicht vorhanden");
      }
      if (!model.gdpr_compliant) {
        modelWarnings.push("Nicht DSGVO-konform");
      }
      
      if (modelWarnings.length > 0) {
        warnings.push({
          model_code: model.code,
          model_name: model.name,
          warnings: modelWarnings
        });
      }
    }
    
    return warnings;
  }
  
  // -------------------------------------------------
  // HELPER
  // -------------------------------------------------
  
  private static mapRowToModel(row: RowDataPacket): AIModel {
    return {
      id: row.id,
      code: row.code,
      name: row.name,
      provider: row.provider,
      version: row.version,
      risk_category: row.risk_category,
      risk_justification: row.risk_justification,
      dsfa_required: !!row.dsfa_required,
      dsfa_document_url: row.dsfa_document_url,
      status: row.status,
      approved_by: row.approved_by,
      approved_at: row.approved_at,
      approval_notes: row.approval_notes,
      allowed_use_cases: JSON.parse(row.allowed_use_cases || "[]"),
      prohibited_use_cases: JSON.parse(row.prohibited_use_cases || "[]"),
      requires_human_oversight: !!row.requires_human_oversight,
      max_autonomy_level: row.max_autonomy_level,
      input_types: JSON.parse(row.input_types || "[]"),
      output_types: JSON.parse(row.output_types || "[]"),
      max_tokens: row.max_tokens,
      cost_per_1k_input: Number(row.cost_per_1k_input),
      cost_per_1k_output: Number(row.cost_per_1k_output),
      gdpr_compliant: !!row.gdpr_compliant,
      data_processing_location: row.data_processing_location,
      data_retention_policy: row.data_retention_policy,
      documentation_url: row.documentation_url,
      created_at: row.created_at,
      updated_at: row.updated_at
    };
  }
}

export default AIModelRegistry;







