// =====================================================
// AI CENTER - WORKFLOW & PLAYBOOK TABLES INIT
// =====================================================
// GET/POST /api/admin/ai/init-workflows
// Erstellt Tabellen für Workflows und Playbooks
// =====================================================

import { getConnection } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";
import { PlaybookService, DEFAULT_PLAYBOOKS } from "@/lib/ai-center/playbook-service";

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
    
    console.log("🚀 AI Center Workflows & Playbooks - Safe Migration gestartet...");
    
    // -------------------------------------------------
    // 1. WORKFLOWS TABELLE
    // -------------------------------------------------
    
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS ai_workflows (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        description TEXT,
        trigger_config JSON NOT NULL,
        actions_config JSON NOT NULL,
        status ENUM('active', 'paused', 'disabled') DEFAULT 'active',
        last_run_at TIMESTAMP NULL,
        run_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_status (status),
        INDEX idx_last_run (last_run_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    results.ai_workflows = "✅ Tabelle erstellt/existiert";
    
    // -------------------------------------------------
    // 2. WORKFLOW EXECUTIONS TABELLE
    // -------------------------------------------------
    
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS ai_workflow_executions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        workflow_id INT NOT NULL,
        trigger_data JSON,
        status ENUM('running', 'completed', 'failed') DEFAULT 'running',
        started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP NULL,
        result JSON,
        error TEXT,
        INDEX idx_workflow (workflow_id),
        INDEX idx_status (status),
        INDEX idx_started (started_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    results.ai_workflow_executions = "✅ Tabelle erstellt/existiert";
    
    // -------------------------------------------------
    // 3. PLAYBOOKS TABELLE
    // -------------------------------------------------
    
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS ai_playbooks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(20) NOT NULL UNIQUE,
        name VARCHAR(200) NOT NULL,
        description TEXT,
        category ENUM('security', 'accessibility', 'performance', 'quality', 'documentation', 'compliance', 'incident', 'maintenance') NOT NULL,
        status ENUM('draft', 'active', 'deprecated') DEFAULT 'active',
        version VARCHAR(20) DEFAULT '1.0',
        steps_config JSON NOT NULL,
        tags JSON,
        estimated_duration VARCHAR(50),
        risk_level ENUM('low', 'medium', 'high') DEFAULT 'medium',
        created_by VARCHAR(100) DEFAULT 'system',
        run_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_category (category),
        INDEX idx_status (status),
        INDEX idx_code (code)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    results.ai_playbooks = "✅ Tabelle erstellt/existiert";
    
    // -------------------------------------------------
    // 4. PLAYBOOK EXECUTIONS TABELLE
    // -------------------------------------------------
    
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS ai_playbook_executions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        playbook_id INT NOT NULL,
        playbook_code VARCHAR(20) NOT NULL,
        context JSON,
        dry_run BOOLEAN DEFAULT FALSE,
        status ENUM('running', 'completed', 'failed', 'cancelled') DEFAULT 'running',
        current_step INT DEFAULT 0,
        step_results JSON,
        started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP NULL,
        executed_by VARCHAR(100) DEFAULT 'system',
        error TEXT,
        INDEX idx_playbook (playbook_id),
        INDEX idx_status (status),
        INDEX idx_started (started_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    results.ai_playbook_executions = "✅ Tabelle erstellt/existiert";
    
    // -------------------------------------------------
    // 5. STANDARD-PLAYBOOKS EINFÜGEN
    // -------------------------------------------------
    
    let playbooksInserted = 0;
    for (const playbook of DEFAULT_PLAYBOOKS) {
      try {
        await pool.execute(`
          INSERT IGNORE INTO ai_playbooks (code, name, description, category, status, version, steps_config, tags, estimated_duration, risk_level, created_by)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          playbook.code,
          playbook.name,
          playbook.description,
          playbook.category,
          playbook.status,
          playbook.version,
          JSON.stringify(playbook.steps),
          JSON.stringify(playbook.tags),
          playbook.estimated_duration,
          playbook.risk_level,
          playbook.created_by
        ]);
        playbooksInserted++;
      } catch (e) {
        // Ignorieren wenn bereits vorhanden
      }
    }
    results.default_playbooks = `✅ ${playbooksInserted} Standard-Playbooks eingefügt`;
    
    // -------------------------------------------------
    // 6. BEISPIEL-WORKFLOW EINFÜGEN
    // -------------------------------------------------
    
    try {
      await pool.execute(`
        INSERT IGNORE INTO ai_workflows (name, description, trigger_config, actions_config, status)
        VALUES 
          ('Kritisches Risiko → Task', 
           'Erstellt automatisch einen Dev-Task wenn ein kritisches Risiko erkannt wird', 
           '{"type":"risk_critical","conditions":{"severity":"critical"}}',
           '[{"type":"create_task","config":{"auto_plan":true},"order":1},{"type":"log_event","config":{"event_type":"CRITICAL_RISK_DETECTED"},"order":2}]',
           'active'),
          ('Task-Completion Notification',
           'Benachrichtigt wenn ein Dev-Task abgeschlossen wird',
           '{"type":"task_completed"}',
           '[{"type":"log_event","config":{"event_type":"TASK_COMPLETED"},"order":1}]',
           'active'),
          ('Kosten-Warnung',
           'Warnt wenn Tageskosten 80% des Limits erreichen',
           '{"type":"cost_threshold","conditions":{"threshold_percent":80}}',
           '[{"type":"send_notification","config":{"title":"Kosten-Warnung","message":"80% des Tageslimits erreicht"},"order":1}]',
           'paused')
      `);
      results.example_workflows = "✅ Beispiel-Workflows eingefügt";
    } catch (e) {
      results.example_workflows = "⏭️ Übersprungen (bereits vorhanden)";
    }
    
    // -------------------------------------------------
    // ZUSAMMENFASSUNG
    // -------------------------------------------------
    
    console.log("🎉 AI Center Workflows & Playbooks - Safe Migration abgeschlossen!");
    
    // Tabellen-Status prüfen
    const [tables] = await pool.execute<any[]>(`
      SELECT TABLE_NAME, TABLE_ROWS
      FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME IN ('ai_workflows', 'ai_workflow_executions', 'ai_playbooks', 'ai_playbook_executions')
    `);
    
    const tableStatus: Record<string, number> = {};
    for (const table of tables) {
      tableStatus[table.TABLE_NAME] = table.TABLE_ROWS || 0;
    }
    
    return NextResponse.json({
      success: true,
      message: "Workflows & Playbooks Tabellen erfolgreich initialisiert",
      results,
      tables: tableStatus
    });
    
  } catch (error) {
    console.error("❌ Workflows & Playbooks Init Error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Fehler bei der Initialisierung"
      },
      { status: 500 }
    );
  }
}

