// =====================================================
// AI CENTER - COMPLIANCE TABLES INIT
// =====================================================
// GET/POST /api/admin/ai/init-compliance
// Multi-Tenant, AI Model Registry, EU AI Act
// =====================================================

import { getConnection } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_TENANT } from "@/lib/ai-center/tenant-service";
import { DEFAULT_AI_MODELS } from "@/lib/ai-center/ai-model-registry";

// =====================================================
// GET & POST - Tabellen initialisieren
// =====================================================

export async function GET(request: NextRequest) {
  return await POST(request);
}

export async function POST(request: NextRequest) {
  try {
    const pool = await getConnection();
    const results: Record<string, any> = {};
    
    console.log("🚀 AI Center Compliance - Safe Migration gestartet...");
    
    // -------------------------------------------------
    // 1. TENANTS TABELLE
    // -------------------------------------------------
    
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS ai_tenants (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(50) NOT NULL UNIQUE,
        name VARCHAR(200) NOT NULL,
        description TEXT,
        status ENUM('active', 'suspended', 'trial', 'cancelled') DEFAULT 'active',
        
        cost_limit_daily DECIMAL(10,2) DEFAULT 10,
        cost_limit_monthly DECIMAL(10,2) DEFAULT 100,
        rate_limit_per_minute INT DEFAULT 30,
        storage_limit_mb INT DEFAULT 1024,
        
        features_enabled JSON,
        ai_providers_allowed JSON,
        
        contact_email VARCHAR(200),
        contact_name VARCHAR(200),
        
        current_cost_daily DECIMAL(10,4) DEFAULT 0,
        current_cost_monthly DECIMAL(10,4) DEFAULT 0,
        
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        INDEX idx_code (code),
        INDEX idx_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    results.ai_tenants = "✅ Tabelle erstellt/existiert";
    
    // -------------------------------------------------
    // 2. TENANT PROJECTS TABELLE
    // -------------------------------------------------
    
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS ai_tenant_projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        tenant_id INT NOT NULL,
        code VARCHAR(50) NOT NULL,
        name VARCHAR(200) NOT NULL,
        description TEXT,
        status ENUM('active', 'archived', 'paused') DEFAULT 'active',
        settings JSON,
        
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        UNIQUE KEY idx_tenant_code (tenant_id, code),
        INDEX idx_tenant (tenant_id),
        INDEX idx_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    results.ai_tenant_projects = "✅ Tabelle erstellt/existiert";
    
    // -------------------------------------------------
    // 3. AI MODEL REGISTRY TABELLE
    // -------------------------------------------------
    
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS ai_model_registry (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(50) NOT NULL UNIQUE,
        name VARCHAR(200) NOT NULL,
        provider ENUM('openai', 'anthropic', 'google', 'local', 'custom') NOT NULL,
        version VARCHAR(50),
        
        risk_category ENUM('unacceptable', 'high', 'limited', 'minimal') NOT NULL,
        risk_justification TEXT,
        dsfa_required BOOLEAN DEFAULT FALSE,
        dsfa_document_url VARCHAR(500),
        
        status ENUM('draft', 'testing', 'approved', 'deprecated', 'blocked') DEFAULT 'draft',
        approved_by VARCHAR(100),
        approved_at TIMESTAMP NULL,
        approval_notes TEXT,
        
        allowed_use_cases JSON,
        prohibited_use_cases JSON,
        requires_human_oversight BOOLEAN DEFAULT TRUE,
        max_autonomy_level INT DEFAULT 3,
        
        input_types JSON,
        output_types JSON,
        max_tokens INT DEFAULT 4096,
        cost_per_1k_input DECIMAL(10,6) DEFAULT 0,
        cost_per_1k_output DECIMAL(10,6) DEFAULT 0,
        
        gdpr_compliant BOOLEAN DEFAULT TRUE,
        data_processing_location VARCHAR(200),
        data_retention_policy TEXT,
        documentation_url VARCHAR(500),
        
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        INDEX idx_provider (provider),
        INDEX idx_status (status),
        INDEX idx_risk (risk_category)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    results.ai_model_registry = "✅ Tabelle erstellt/existiert";
    
    // -------------------------------------------------
    // 4. DSFA ASSESSMENTS TABELLE
    // -------------------------------------------------
    
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS ai_dsfa_assessments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        model_id INT NOT NULL,
        
        assessment_date DATE NOT NULL,
        assessor_name VARCHAR(200) NOT NULL,
        
        data_types_processed JSON,
        processing_purposes JSON,
        data_subjects JSON,
        
        identified_risks JSON,
        technical_measures JSON,
        organizational_measures JSON,
        
        overall_risk_level ENUM('acceptable', 'acceptable_with_measures', 'unacceptable') NOT NULL,
        recommendation ENUM('approve', 'approve_with_conditions', 'reject') NOT NULL,
        conditions JSON,
        
        status ENUM('draft', 'review', 'approved', 'rejected') DEFAULT 'draft',
        approved_by VARCHAR(100),
        approved_at TIMESTAMP NULL,
        
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        INDEX idx_model (model_id),
        INDEX idx_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    results.ai_dsfa_assessments = "✅ Tabelle erstellt/existiert";
    
    // -------------------------------------------------
    // 5. DEFAULT TENANT EINFÜGEN
    // -------------------------------------------------
    
    try {
      await pool.execute(`
        INSERT IGNORE INTO ai_tenants 
          (code, name, description, status, cost_limit_daily, cost_limit_monthly,
           rate_limit_per_minute, storage_limit_mb, features_enabled, ai_providers_allowed,
           contact_email, contact_name)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        DEFAULT_TENANT.code,
        DEFAULT_TENANT.name,
        DEFAULT_TENANT.description,
        DEFAULT_TENANT.status,
        DEFAULT_TENANT.cost_limit_daily,
        DEFAULT_TENANT.cost_limit_monthly,
        DEFAULT_TENANT.rate_limit_per_minute,
        DEFAULT_TENANT.storage_limit_mb,
        JSON.stringify(DEFAULT_TENANT.features_enabled),
        JSON.stringify(DEFAULT_TENANT.ai_providers_allowed),
        DEFAULT_TENANT.contact_email,
        DEFAULT_TENANT.contact_name
      ]);
      results.default_tenant = "✅ Default-Tenant eingefügt";
    } catch (e) {
      results.default_tenant = "⏭️ Übersprungen (bereits vorhanden)";
    }
    
    // -------------------------------------------------
    // 6. DEFAULT AI MODELS EINFÜGEN
    // -------------------------------------------------
    
    let modelsInserted = 0;
    for (const model of DEFAULT_AI_MODELS) {
      try {
        await pool.execute(`
          INSERT IGNORE INTO ai_model_registry 
            (code, name, provider, version, risk_category, risk_justification,
             dsfa_required, status, approved_by, approval_notes,
             allowed_use_cases, prohibited_use_cases, requires_human_oversight, max_autonomy_level,
             input_types, output_types, max_tokens, cost_per_1k_input, cost_per_1k_output,
             gdpr_compliant, data_processing_location, data_retention_policy)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          model.code, model.name, model.provider, model.version,
          model.risk_category, model.risk_justification,
          model.dsfa_required, model.status, model.approved_by || null, model.approval_notes || null,
          JSON.stringify(model.allowed_use_cases), JSON.stringify(model.prohibited_use_cases),
          model.requires_human_oversight, model.max_autonomy_level,
          JSON.stringify(model.input_types), JSON.stringify(model.output_types),
          model.max_tokens, model.cost_per_1k_input, model.cost_per_1k_output,
          model.gdpr_compliant, model.data_processing_location, model.data_retention_policy
        ]);
        modelsInserted++;
      } catch (e) {
        // Ignorieren wenn bereits vorhanden
      }
    }
    results.default_models = `✅ ${modelsInserted} AI-Modelle registriert`;
    
    // -------------------------------------------------
    // ZUSAMMENFASSUNG
    // -------------------------------------------------
    
    console.log("🎉 AI Center Compliance - Safe Migration abgeschlossen!");
    
    // Tabellen-Status
    const [tables] = await pool.execute<any[]>(`
      SELECT TABLE_NAME, TABLE_ROWS
      FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME IN ('ai_tenants', 'ai_tenant_projects', 'ai_model_registry', 'ai_dsfa_assessments')
    `);
    
    const tableStatus: Record<string, number> = {};
    for (const table of tables) {
      tableStatus[table.TABLE_NAME] = table.TABLE_ROWS || 0;
    }
    
    return NextResponse.json({
      success: true,
      message: "Compliance-Tabellen erfolgreich initialisiert",
      results,
      tables: tableStatus
    });
    
  } catch (error) {
    console.error("❌ Compliance Init Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Fehler" },
      { status: 500 }
    );
  }
}







