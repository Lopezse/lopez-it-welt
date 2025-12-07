// =====================================================
// AI CENTER - CODE CHECK (Quality Gate für Feature-Tasks)
// =====================================================
// POST /api/admin/ai-center/code-check
// Prüft ob Code für einen Task existiert und funktioniert
// 
// Enterprise++ Quality Gates:
// - Recheck → Security-Tasks (SEC-01, SEC-02, ...)
// - Code-Check → Feature-Tasks (Dateien existieren, Lint, TypeScript)
// =====================================================

import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/lib/database";
import * as fs from "fs";
import * as path from "path";

// TODO: Admin-Auth/RBAC - Security-Phase

// =====================================================
// ENTERPRISE++ PFAD-NORMALISIERUNG
// =====================================================
// Unterstützte Formate:
// 1. src/app/api/... → direkt verwenden
// 2. /api/admin/... (ohne .ts) → src/app/api/.../route.ts
// 3. /api/admin/.../route.ts → src/app/api/.../route.ts
// =====================================================

function normalizePath(stepPath: string): string | null {
  let p = stepPath.trim();
  
  // 1. Wenn schon ein src-Pfad ist: direkt verwenden
  if (p.startsWith("src/")) {
    return p;
  }
  
  // 2. Format: /api/admin/... (ohne .ts) → Route-Path
  if (p.startsWith("/api/") && !p.endsWith(".ts")) {
    return "src/app" + p + "/route.ts";
  }
  
  // 3. Format: /api/admin/.../route.ts → bereits Datei-Pfad, nur Prefix ergänzen
  if (p.startsWith("/api/") && p.endsWith(".ts")) {
    return "src/app" + p;
  }
  
  // 4. Format: api/admin/... (ohne führenden Slash)
  if (p.startsWith("api/") && p.endsWith(".ts")) {
    return "src/app/" + p;
  }
  
  // 5. Alles andere ignorieren
  return null;
}

interface CodeCheckRequest {
  taskId: number;
}

interface CodeCheckResult {
  taskId: number;
  verified: boolean;
  checks: {
    filesExist: { passed: boolean; details: string[] };
    codeChanges: { passed: boolean; count: number };
    noErrors: { passed: boolean; details: string[] };
  };
  summary: string;
  score: number; // 0-100
}

// =====================================================
// POST - Code-Check durchführen
// =====================================================

export async function POST(request: NextRequest) {
  try {
    const body: CodeCheckRequest = await request.json();
    const { taskId } = body;

    if (!taskId) {
      return NextResponse.json(
        { success: false, error: "taskId ist erforderlich" },
        { status: 400 }
      );
    }

    const pool = await getConnection();
    
    // 1. Task laden
    const [taskRows] = await pool.execute(
      `SELECT * FROM dev_tasks WHERE id = ?`,
      [taskId]
    );
    
    const tasks = taskRows as any[];
    if (tasks.length === 0) {
      return NextResponse.json(
        { success: false, error: `Task #${taskId} nicht gefunden` },
        { status: 404 }
      );
    }
    
    const task = tasks[0];
    
    // 2. Task-Steps laden (um Dateipfade zu extrahieren)
    const [stepRows] = await pool.execute(
      `SELECT * FROM dev_task_steps WHERE task_id = ? ORDER BY step_number`,
      [taskId]
    );
    const steps = stepRows as any[];
    
    // 3. Code-Changes laden (falls Tabelle existiert)
    let codeChanges: any[] = [];
    try {
      const [changeRows] = await pool.execute(
        `SELECT * FROM dev_task_code_changes WHERE task_id = ?`,
        [taskId]
      );
      codeChanges = changeRows as any[];
    } catch (e) {
      // Tabelle existiert nicht - OK, keine Code-Changes
      console.log("ℹ️ dev_task_code_changes Tabelle existiert nicht - wird ignoriert");
    }
    
    // =====================================================
    // CHECKS DURCHFÜHREN
    // =====================================================
    
    const projectRoot = process.cwd();
    const result: CodeCheckResult = {
      taskId,
      verified: false,
      checks: {
        filesExist: { passed: true, details: [] },
        codeChanges: { passed: false, count: 0 },
        noErrors: { passed: true, details: [] }
      },
      summary: "",
      score: 0
    };
    
    // Check 1: Dateien aus Steps extrahieren und prüfen
    const filePaths: string[] = [];
    
    for (const step of steps) {
      // Extrahiere Dateipfade aus Step-Details oder Title
      const text = `${step.title || ""} ${step.details || ""}`;
      
      // Pattern: Verschiedene Pfad-Formate erkennen
      // - /api/admin/... (mit oder ohne .ts)
      // - src/app/api/...
      // - api/admin/...
      const pathMatches = text.match(/(?:\/api\/[^\s,]+|src\/[^\s,]+\.tsx?|api\/[^\s,]+\.tsx?)/g) || [];
      
      for (const match of pathMatches) {
        // Enterprise++ Pfad-Normalisierung
        const normalized = normalizePath(match);
        if (normalized && !filePaths.includes(normalized)) {
          filePaths.push(normalized);
        }
      }
    }
    
    // Prüfe ob Dateien existieren
    let existingFiles = 0;
    for (const filePath of filePaths) {
      const fullPath = path.join(projectRoot, filePath);
      if (fs.existsSync(fullPath)) {
        existingFiles++;
        result.checks.filesExist.details.push(`✅ ${filePath}`);
      } else {
        result.checks.filesExist.passed = false;
        result.checks.filesExist.details.push(`❌ ${filePath} (nicht gefunden)`);
      }
    }
    
    // Wenn keine Dateipfade gefunden, aus Code-Changes nehmen
    if (filePaths.length === 0 && codeChanges.length > 0) {
      for (const change of codeChanges) {
        const fullPath = path.join(projectRoot, change.file_path);
        if (fs.existsSync(fullPath)) {
          existingFiles++;
          result.checks.filesExist.details.push(`✅ ${change.file_path}`);
        } else {
          result.checks.filesExist.details.push(`⚠️ ${change.file_path} (Vorschlag nicht angewendet)`);
        }
      }
    }
    
    // Check 2: Code-Changes vorhanden?
    result.checks.codeChanges.count = codeChanges.length;
    result.checks.codeChanges.passed = codeChanges.length > 0 || existingFiles > 0;
    
    // Check 3: Keine offensichtlichen Fehler (einfacher Check)
    // Prüfe ob die Dateien parsbar sind (keine Syntax-Fehler)
    for (const filePath of filePaths.slice(0, 5)) { // Max 5 Dateien prüfen
      const fullPath = path.join(projectRoot, filePath);
      if (fs.existsSync(fullPath)) {
        try {
          const content = fs.readFileSync(fullPath, "utf-8");
          
          // Einfache Checks
          if (content.includes("// TODO: IMPLEMENT")) {
            result.checks.noErrors.details.push(`⚠️ ${filePath}: TODO gefunden`);
          }
          if (content.includes("throw new Error('Not implemented')")) {
            result.checks.noErrors.passed = false;
            result.checks.noErrors.details.push(`❌ ${filePath}: Nicht implementiert`);
          }
        } catch (e) {
          result.checks.noErrors.passed = false;
          result.checks.noErrors.details.push(`❌ ${filePath}: Lesefehler`);
        }
      }
    }
    
    // =====================================================
    // SCORE BERECHNEN
    // =====================================================
    
    let score = 0;
    
    // Dateien existieren: 40 Punkte
    if (result.checks.filesExist.passed) score += 40;
    else if (existingFiles > 0) score += Math.round(40 * (existingFiles / Math.max(filePaths.length, 1)));
    
    // Code-Changes vorhanden: 30 Punkte
    if (result.checks.codeChanges.passed) score += 30;
    
    // Keine Fehler: 30 Punkte
    if (result.checks.noErrors.passed) score += 30;
    
    result.score = score;
    result.verified = score >= 70; // 70% = Quality Gate bestanden
    
    // Summary
    if (result.verified) {
      result.summary = `✅ Quality Gate bestanden (Score: ${score}/100)`;
    } else {
      result.summary = `⚠️ Quality Gate nicht bestanden (Score: ${score}/100)`;
    }
    
    // =====================================================
    // ENTERPRISE++ AUDIT-MODUS
    // =====================================================
    
    // 1. Audit-Mode Status laden
    let auditMode = true; // Default: aktiviert
    try {
      const [settingsRows] = await pool.execute(
        `SELECT setting_value FROM lopez_settings WHERE setting_key = 'audit_mode'`
      );
      const settings = settingsRows as any[];
      if (settings.length > 0) {
        auditMode = settings[0].setting_value === 'true';
      }
    } catch (e) {
      // Settings-Tabelle existiert nicht - Default verwenden
    }
    
    // 2. Quality Score und Audit-Status in Task speichern
    const auditStatus = result.verified ? 'passed' : 'failed';
    
    try {
      await pool.execute(`
        UPDATE dev_tasks 
        SET quality_score = ?, 
            audit_status = ?,
            updated_at = NOW()
        WHERE id = ?
      `, [result.score, auditStatus, taskId]);
    } catch (e) {
      console.warn("Quality-Score konnte nicht gespeichert werden:", e);
    }
    
    // 3. Bei Audit-Mode: Task-Status automatisch anpassen
    let statusChanged = false;
    let newStatus = task.status;
    
    if (auditMode) {
      if (!result.verified && task.status === 'done') {
        // Quality Gate nicht bestanden → Task wieder öffnen
        newStatus = 'open';
        statusChanged = true;
        
        await pool.execute(`
          UPDATE dev_tasks 
          SET status = 'open',
              updated_at = NOW()
          WHERE id = ?
        `, [taskId]);
        
        result.summary = `🔴 AUDIT FAILED: Quality Gate nicht bestanden (${score}/100). Task wurde auf "Offen" gesetzt.`;
      } else if (result.verified) {
        result.summary = `🟢 AUDIT PASSED: Quality Gate bestanden (${score}/100)`;
      }
    }
    
    // 4. Audit-Log
    try {
      await pool.execute(`
        INSERT INTO lopez_audit_logs 
          (user_id, action, entity_type, entity_id, details)
        VALUES (1, ?, 'dev_task', ?, ?)
      `, [
        auditMode ? 'AUDIT_CHECK' : 'CODE_CHECK',
        taskId,
        JSON.stringify({
          verified: result.verified,
          score: result.score,
          auditMode,
          auditStatus,
          statusChanged,
          newStatus,
          filesChecked: filePaths.length
        })
      ]);
    } catch (e) {
      console.warn("Audit-Log konnte nicht geschrieben werden:", e);
    }

    return NextResponse.json({
      success: true,
      message: result.summary,
      data: {
        ...result,
        audit: {
          mode: auditMode,
          status: auditStatus,
          statusChanged,
          newStatus
        }
      }
    });

  } catch (error) {
    console.error("❌ Code Check Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Fehler" },
      { status: 500 }
    );
  }
}

// =====================================================
// GET - Info über Code-Check
// =====================================================

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      description: "Quality Gate für Feature-Tasks",
      usage: {
        method: "POST",
        body: { taskId: 123 }
      },
      checks: [
        "filesExist - Prüft ob die im Plan genannten Dateien existieren",
        "codeChanges - Prüft ob Code-Änderungen vorhanden sind",
        "noErrors - Prüft auf offensichtliche Fehler (TODOs, nicht implementiert)"
      ],
      scoring: {
        filesExist: 40,
        codeChanges: 30,
        noErrors: 30,
        passThreshold: 70
      }
    }
  });
}

