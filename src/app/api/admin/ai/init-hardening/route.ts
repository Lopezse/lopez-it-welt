// =====================================================
// AI CENTER - HARDENING TABLES INIT
// =====================================================
// GET/POST /api/admin/ai/init-hardening
// Erstellt Tabellen für Settings, Cost-Tracking, etc.
// =====================================================

import { getConnection } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_SETTINGS } from "@/lib/ai-center/settings-service";

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
    
    console.log("🚀 AI Center Hardening - Safe Migration gestartet...");
    
    // -------------------------------------------------
    // 1. AI SETTINGS TABELLE
    // -------------------------------------------------
    
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS ai_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        setting_key VARCHAR(100) NOT NULL UNIQUE,
        setting_value TEXT NOT NULL,
        value_type VARCHAR(20) DEFAULT 'string',
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_key (setting_key)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    results.ai_settings = "✅ Tabelle erstellt/existiert";
    
    // -------------------------------------------------
    // 2. AI COST TRACKING TABELLE
    // -------------------------------------------------
    
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS ai_cost_tracking (
        id INT AUTO_INCREMENT PRIMARY KEY,
        date DATE NOT NULL,
        provider VARCHAR(50) NOT NULL,
        endpoint VARCHAR(200),
        tokens_input INT DEFAULT 0,
        tokens_output INT DEFAULT 0,
        cost_total DECIMAL(10,4) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY idx_date_provider_endpoint (date, provider, endpoint),
        INDEX idx_date (date),
        INDEX idx_provider (provider)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    results.ai_cost_tracking = "✅ Tabelle erstellt/existiert";
    
    // -------------------------------------------------
    // 3. AI RATE LIMITS TABELLE (für persistente Limits)
    // -------------------------------------------------
    
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS ai_rate_limits (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        endpoint VARCHAR(200) NOT NULL,
        request_count INT DEFAULT 0,
        window_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        window_type ENUM('minute', 'hour', 'day') DEFAULT 'minute',
        UNIQUE KEY idx_user_endpoint_window (user_id, endpoint, window_type),
        INDEX idx_user (user_id),
        INDEX idx_window (window_start)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    results.ai_rate_limits = "✅ Tabelle erstellt/existiert";
    
    // -------------------------------------------------
    // 4. AI SECURITY EVENTS TABELLE
    // -------------------------------------------------
    
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS ai_security_events (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        event_type VARCHAR(50) NOT NULL,
        severity ENUM('low', 'medium', 'high', 'critical') DEFAULT 'low',
        endpoint VARCHAR(200),
        ip_address VARCHAR(50),
        details JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_user (user_id),
        INDEX idx_type (event_type),
        INDEX idx_severity (severity),
        INDEX idx_created (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    results.ai_security_events = "✅ Tabelle erstellt/existiert";
    
    // -------------------------------------------------
    // 5. DEFAULT SETTINGS EINFÜGEN
    // -------------------------------------------------
    
    let settingsInserted = 0;
    for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
      try {
        await pool.execute(`
          INSERT IGNORE INTO ai_settings (setting_key, setting_value, value_type)
          VALUES (?, ?, ?)
        `, [key, JSON.stringify(value), typeof value]);
        settingsInserted++;
      } catch (e) {
        // Ignorieren wenn bereits vorhanden
      }
    }
    results.default_settings = `✅ ${settingsInserted} Default-Settings eingefügt`;
    
    // -------------------------------------------------
    // 6. PRODUCTION-READY CHECK
    // -------------------------------------------------
    
    const productionChecks: Record<string, boolean> = {};
    
    // Check 1: Alle Tabellen existieren
    const requiredTables = [
      "ai_agents", "ai_agent_metrics", "ai_agent_capabilities",
      "ai_workflows", "ai_workflow_executions",
      "ai_playbooks", "ai_playbook_executions",
      "ai_settings", "ai_cost_tracking", "ai_rate_limits", "ai_security_events"
    ];
    
    const [tables] = await pool.execute<any[]>(`
      SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME LIKE 'ai_%'
    `);
    const existingTables = tables.map((t: any) => t.TABLE_NAME);
    
    productionChecks.all_tables_exist = requiredTables.every(t => existingTables.includes(t));
    
    // Check 2: Settings konfiguriert
    const [settingsCount] = await pool.execute<any[]>(`
      SELECT COUNT(*) as count FROM ai_settings
    `);
    productionChecks.settings_configured = settingsCount[0].count >= 10;
    
    // Check 3: Agenten registriert
    const [agentCount] = await pool.execute<any[]>(`
      SELECT COUNT(*) as count FROM ai_agents WHERE enabled = TRUE
    `);
    productionChecks.agents_registered = agentCount[0].count >= 1;
    
    // Check 4: Playbooks vorhanden
    const [playbookCount] = await pool.execute<any[]>(`
      SELECT COUNT(*) as count FROM ai_playbooks WHERE status = 'active'
    `);
    productionChecks.playbooks_available = playbookCount[0].count >= 1;
    
    // Gesamt-Status
    const allChecksPass = Object.values(productionChecks).every(v => v);
    
    results.production_checks = productionChecks;
    results.production_ready = allChecksPass;
    
    // -------------------------------------------------
    // ZUSAMMENFASSUNG
    // -------------------------------------------------
    
    console.log("🎉 AI Center Hardening - Safe Migration abgeschlossen!");
    console.log(`📊 Production-Ready: ${allChecksPass ? "✅ JA" : "⚠️ NEIN"}`);
    
    return NextResponse.json({
      success: true,
      message: "Hardening-Tabellen erfolgreich initialisiert",
      results,
      production_ready: allChecksPass,
      existing_tables: existingTables.filter(t => t.startsWith("ai_"))
    });
    
  } catch (error) {
    console.error("❌ Hardening Init Error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Fehler bei der Initialisierung"
      },
      { status: 500 }
    );
  }
}







