// =====================================================
// AI CENTER - SICHERE TABELLEN-INITIALISIERUNG
// =====================================================
// Erstellt: 2024-12-05
// Zweck: Enterprise++ Safe Migration für AI Center
// Standard: IBM / SAP / Siemens Migration Level
// Status: ✅ ENTERPRISE++ SAFE MODE
// =====================================================
//
// SICHERHEITSGARANTIEN:
// ❌ KEIN DROP TABLE
// ❌ KEIN DELETE
// ❌ KEIN TRUNCATE
// ✅ NUR CREATE TABLE IF NOT EXISTS
// ✅ NUR INSERT IGNORE
// ✅ NUR ALTER TABLE ADD COLUMN IF NOT EXISTS
// =====================================================

import { getConnection } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

// =====================================================
// GET - AI Center Tabellen initialisieren
// =====================================================

export async function GET(request: NextRequest) {
  return await POST(request);
}

// =====================================================
// POST - Enterprise++ Safe Migration für AI Center
// =====================================================

export async function POST(request: NextRequest) {
  const results: string[] = [];
  const errors: string[] = [];
  
  try {
    console.log("🚀 AI Center Safe Migration gestartet...");
    const pool = await getConnection();

    // =====================================================
    // 1. ai_agents - Agent-Verwaltung
    // =====================================================
    try {
      await pool.execute(`
        CREATE TABLE IF NOT EXISTS ai_agents (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100) NOT NULL UNIQUE,
          type ENUM('media', 'dev', 'doc', 'support', 'business', 'monitoring', 'admin', 'orchestrator') NOT NULL,
          description TEXT,
          dsgvo_scope JSON,
          risk_profile ENUM('low', 'medium', 'high') DEFAULT 'medium',
          enabled BOOLEAN DEFAULT TRUE,
          config JSON,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_type (type),
          INDEX idx_enabled (enabled)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
      results.push("✅ ai_agents: Tabelle erstellt/existiert");
    } catch (error: any) {
      if (error.code === 'ER_TABLE_EXISTS_ERROR') {
        results.push("✅ ai_agents: Tabelle existiert bereits");
      } else {
        errors.push(`❌ ai_agents: ${error.message}`);
      }
    }

    // =====================================================
    // 2. ai_agent_metrics - Agent-Metriken
    // =====================================================
    try {
      await pool.execute(`
        CREATE TABLE IF NOT EXISTS ai_agent_metrics (
          id INT AUTO_INCREMENT PRIMARY KEY,
          agent_name VARCHAR(100) NOT NULL,
          metric_date DATE NOT NULL,
          tasks_total INT DEFAULT 0,
          tasks_success INT DEFAULT 0,
          tasks_failed INT DEFAULT 0,
          avg_duration_ms INT DEFAULT 0,
          tokens_used INT DEFAULT 0,
          cost_estimated DECIMAL(10,4) DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE KEY uk_agent_date (agent_name, metric_date),
          INDEX idx_date (metric_date),
          INDEX idx_agent (agent_name)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
      results.push("✅ ai_agent_metrics: Tabelle erstellt/existiert");
    } catch (error: any) {
      if (error.code === 'ER_TABLE_EXISTS_ERROR') {
        results.push("✅ ai_agent_metrics: Tabelle existiert bereits");
      } else {
        errors.push(`❌ ai_agent_metrics: ${error.message}`);
      }
    }

    // =====================================================
    // 3. ai_agent_capabilities - Agent-Fähigkeiten
    // =====================================================
    try {
      await pool.execute(`
        CREATE TABLE IF NOT EXISTS ai_agent_capabilities (
          id INT AUTO_INCREMENT PRIMARY KEY,
          agent_name VARCHAR(100) NOT NULL,
          capability VARCHAR(100) NOT NULL,
          description TEXT,
          enabled BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_agent (agent_name),
          UNIQUE KEY uk_agent_capability (agent_name, capability)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
      results.push("✅ ai_agent_capabilities: Tabelle erstellt/existiert");
    } catch (error: any) {
      if (error.code === 'ER_TABLE_EXISTS_ERROR') {
        results.push("✅ ai_agent_capabilities: Tabelle existiert bereits");
      } else {
        errors.push(`❌ ai_agent_capabilities: ${error.message}`);
      }
    }

    // =====================================================
    // 4. Standard-Agenten einfügen (nur wenn nicht vorhanden)
    // =====================================================
    try {
      // INSERT IGNORE fügt nur ein wenn nicht vorhanden
      await pool.execute(`
        INSERT IGNORE INTO ai_agents (name, type, description, dsgvo_scope, risk_profile, enabled) VALUES
        ('Agent-A', 'dev', 'Planungs-Agent: Analysiert Tasks und erstellt Pläne', '["dev_tasks"]', 'low', TRUE),
        ('Agent-B', 'dev', 'Builder-Agent: Generiert Code-Vorschläge', '["dev_tasks", "code_gen"]', 'medium', TRUE),
        ('Agent-C', 'dev', 'Review-Agent: Prüft Code-Qualität', '["dev_tasks", "code_review"]', 'low', TRUE),
        ('Media-AI', 'media', 'Medien-Analyse: OCR, Tagging, DSGVO-Check', '["media_ki", "person_detection"]', 'high', TRUE),
        ('Orchestrator', 'orchestrator', 'Zentrale KI-Steuerung', '["orchestrator_ki"]', 'low', TRUE),
        ('Project-Analyzer', 'monitoring', 'Code- und Architektur-Analyse', '["analytics"]', 'low', TRUE)
      `);
      results.push("✅ Standard-Agenten: Synchronisiert (INSERT IGNORE)");
    } catch (error: any) {
      errors.push(`❌ Standard-Agenten: ${error.message}`);
    }

    // =====================================================
    // 5. Capabilities für Standard-Agenten
    // =====================================================
    try {
      await pool.execute(`
        INSERT IGNORE INTO ai_agent_capabilities (agent_name, capability, description) VALUES
        ('Agent-A', 'task_analysis', 'Analysiert Aufgabenbeschreibungen'),
        ('Agent-A', 'plan_creation', 'Erstellt Schritt-für-Schritt-Pläne'),
        ('Agent-A', 'effort_estimation', 'Schätzt Aufwand ein'),
        ('Agent-B', 'code_generation', 'Generiert TypeScript/React Code'),
        ('Agent-B', 'api_routes', 'Erstellt Next.js API-Routes'),
        ('Agent-B', 'components', 'Erstellt React-Komponenten'),
        ('Agent-C', 'code_review', 'Prüft Code auf Qualität'),
        ('Agent-C', 'security_check', 'Prüft auf Sicherheitslücken'),
        ('Agent-C', 'quality_score', 'Bewertet Code-Qualität (0-100)'),
        ('Media-AI', 'ocr', 'Texterkennung in Bildern'),
        ('Media-AI', 'tagging', 'Automatisches Tagging'),
        ('Media-AI', 'dsgvo_check', 'DSGVO-Personenerkennung'),
        ('Orchestrator', 'task_dispatch', 'Verteilt Tasks an Agenten'),
        ('Orchestrator', 'quality_gate', 'Input/Output-Qualitätsprüfung'),
        ('Orchestrator', 'dsgvo_decision', 'DSGVO-Entscheidungen'),
        ('Project-Analyzer', 'code_scan', 'Scannt Code auf Risiken'),
        ('Project-Analyzer', 'architecture_check', 'Prüft Architektur'),
        ('Project-Analyzer', 'security_audit', 'Sicherheits-Audit')
      `);
      results.push("✅ Agent-Capabilities: Synchronisiert (INSERT IGNORE)");
    } catch (error: any) {
      errors.push(`❌ Agent-Capabilities: ${error.message}`);
    }

    // =====================================================
    // ERGEBNIS
    // =====================================================
    
    const success = errors.length === 0;
    
    console.log("─".repeat(50));
    console.log(success 
      ? "🎉 AI Center Safe Migration ERFOLGREICH!" 
      : "⚠️ AI Center Migration mit Warnungen abgeschlossen"
    );
    console.log("─".repeat(50));

    return NextResponse.json({
      success,
      message: success 
        ? "✅ AI Center Tabellen erfolgreich initialisiert"
        : "⚠️ AI Center Migration mit Warnungen",
      mode: "SAFE_MIGRATION",
      note: "Bestehende Daten wurden NICHT gelöscht!",
      data: {
        safety_guarantees: [
          "❌ KEIN DROP TABLE",
          "❌ KEIN DELETE",
          "❌ KEIN TRUNCATE",
          "✅ NUR CREATE TABLE IF NOT EXISTS",
          "✅ NUR INSERT IGNORE"
        ],
        tables_created: [
          "ai_agents",
          "ai_agent_metrics", 
          "ai_agent_capabilities"
        ],
        default_agents: [
          "Agent-A (Planner)",
          "Agent-B (Builder)",
          "Agent-C (Reviewer)",
          "Media-AI",
          "Orchestrator",
          "Project-Analyzer"
        ],
        results,
        errors: errors.length > 0 ? errors : undefined
      }
    });

  } catch (error) {
    console.error("❌ AI Center Migration Fehler:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Fehler bei der AI Center Migration",
        error: error instanceof Error ? error.message : "Unbekannter Fehler",
        results,
        errors
      },
      { status: 500 }
    );
  }
}







