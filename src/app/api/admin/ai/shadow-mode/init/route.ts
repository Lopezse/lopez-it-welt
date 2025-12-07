// =====================================================
// SHADOW-MODE - TABELLEN INITIALISIERUNG
// =====================================================
// GET/POST /api/admin/ai/shadow-mode/init
// Erstellt Tabellen für Code-Proposals
// =====================================================

import { getConnection } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return await POST(request);
}

export async function POST(request: NextRequest) {
  try {
    const pool = await getConnection();
    const results: Record<string, any> = {};
    
    console.log("🚀 Shadow-Mode - Safe Migration gestartet...");
    
    // -------------------------------------------------
    // CODE-PROPOSALS TABELLE
    // -------------------------------------------------
    
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS lopez_code_proposals (
        id INT AUTO_INCREMENT PRIMARY KEY,
        task_id INT NOT NULL,
        step_id INT,
        
        file_path VARCHAR(500) NOT NULL,
        action ENUM('create', 'modify', 'delete') NOT NULL,
        original_content LONGTEXT,
        proposed_content LONGTEXT NOT NULL,
        
        agent_version VARCHAR(20),
        model_used VARCHAR(50),
        tokens_used INT DEFAULT 0,
        generation_time_ms INT DEFAULT 0,
        
        status ENUM('pending', 'approved', 'rejected', 'modified', 'applied') DEFAULT 'pending',
        
        agent_c_review JSON,
        agent_c_score INT,
        agent_c_reviewed_at TIMESTAMP NULL,
        
        cursor_review JSON,
        cursor_approved BOOLEAN,
        cursor_reviewed_at TIMESTAMP NULL,
        
        human_decision ENUM('pending', 'approved', 'rejected', 'modified') DEFAULT 'pending',
        human_notes TEXT,
        decided_by VARCHAR(100),
        decided_at TIMESTAMP NULL,
        
        applied_at TIMESTAMP NULL,
        
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        INDEX idx_task (task_id),
        INDEX idx_status (status),
        INDEX idx_human_decision (human_decision)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    results.lopez_code_proposals = "✅ Tabelle erstellt/existiert";
    
    // -------------------------------------------------
    // REVIEW-HISTORY TABELLE
    // -------------------------------------------------
    
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS lopez_code_review_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        proposal_id INT NOT NULL,
        
        reviewer_type ENUM('agent_c', 'cursor', 'human') NOT NULL,
        reviewer_id VARCHAR(100),
        
        action ENUM('reviewed', 'approved', 'rejected', 'modified', 'comment') NOT NULL,
        
        review_data JSON,
        score INT,
        comments TEXT,
        
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        INDEX idx_proposal (proposal_id),
        INDEX idx_reviewer (reviewer_type)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    results.lopez_code_review_history = "✅ Tabelle erstellt/existiert";
    
    // -------------------------------------------------
    // SHADOW-MODE SETTINGS in ai_settings einfügen
    // -------------------------------------------------
    
    const shadowSettings = [
      { key: "shadow_mode_enabled", value: "true", type: "boolean" },
      { key: "auto_apply_disabled", value: "true", type: "boolean" },
      { key: "require_cursor_review", value: "true", type: "boolean" },
      { key: "require_human_approval", value: "true", type: "boolean" }
    ];
    
    for (const setting of shadowSettings) {
      await pool.execute(`
        INSERT IGNORE INTO ai_settings (setting_key, setting_value, value_type)
        VALUES (?, ?, ?)
      `, [setting.key, setting.value, setting.type]);
    }
    results.shadow_settings = "✅ Shadow-Mode Settings eingefügt";
    
    console.log("🎉 Shadow-Mode - Migration abgeschlossen!");
    
    return NextResponse.json({
      success: true,
      message: "✅ Shadow-Mode Tabellen erfolgreich initialisiert",
      results,
      workflow: {
        step1: "AI Center → Task erstellen",
        step2: "Agent-A → Task planen",
        step3: "Agent-B → Code-Vorschlag (Shadow Mode)",
        step4: "Agent-C → Qualitätsprüfung",
        step5: "Cursor → Senior Review",
        step6: "Mensch → Finale Freigabe"
      }
    });
    
  } catch (error) {
    console.error("❌ Shadow-Mode Init Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Fehler" },
      { status: 500 }
    );
  }
}







