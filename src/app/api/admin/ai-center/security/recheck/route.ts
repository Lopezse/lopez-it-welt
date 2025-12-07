// =====================================================
// AI CENTER - SECURITY ISSUE RECHECK
// =====================================================
// POST /api/admin/ai-center/security/recheck
// Verifiziert ob ein Security-Issue wirklich behoben ist
// 
// Enterprise++ Regel:
// "Fertig" = System hat VERIFIZIERT dass Problem behoben ist
// =====================================================

import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/lib/database";
import * as fs from "fs";
import * as path from "path";

// TODO: Admin-Auth/RBAC - Security-Phase

interface RecheckRequest {
  issueId: string;        // z.B. "SEC-01", "SEC-02"
  issueType: string;      // z.B. "drop_table", "sql_injection", "hardcoded_password"
  taskId?: number;        // dev_tasks ID - um Status zu aktualisieren
  affectedFiles?: string[];
}

interface RecheckResult {
  issueId: string;
  verified: boolean;      // true = wirklich behoben
  remainingCount: number; // Wie viele Probleme noch existieren
  details: string[];      // Details zu verbleibenden Problemen
  recommendation: string;
}

// =====================================================
// RECHECK FUNCTIONS
// =====================================================

/**
 * Prüft ob DROP TABLE Statements noch existieren
 */
function recheckDropTable(files?: string[]): RecheckResult {
  const projectRoot = process.cwd();
  const filesToCheck = files || ["src/lib/database.ts"];
  const details: string[] = [];
  let remainingCount = 0;

  for (const file of filesToCheck) {
    const fullPath = path.join(projectRoot, file);
    if (!fs.existsSync(fullPath)) continue;

    const content = fs.readFileSync(fullPath, "utf-8");
    const lines = content.split("\n");

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      // Skip Kommentare
      if (trimmed.startsWith("//") || trimmed.startsWith("*")) return;
      
      // Prüfe auf echte execute/query mit DROP TABLE
      if (/\.(execute|query)\s*\(\s*[`"'].*DROP\s+TABLE/i.test(line)) {
        remainingCount++;
        details.push(`${file}:${index + 1}: ${trimmed.slice(0, 80)}...`);
      }
    });
  }

  return {
    issueId: "SEC-01",
    verified: remainingCount === 0,
    remainingCount,
    details: details.slice(0, 10), // Max 10 Details
    recommendation: remainingCount > 0 
      ? `Noch ${remainingCount} DROP TABLE Statements gefunden. Bitte entfernen oder durch sichere Migrationen ersetzen.`
      : "✅ Alle DROP TABLE Statements wurden entfernt."
  };
}

/**
 * Prüft ob unsichere SQL-Injections noch existieren
 * 
 * Enterprise++ Regel:
 * - ALLE Template-Literals in SQL-Queries werden als potentiell unsicher gemeldet
 * - Ausnahme: @sql-safe Kommentar + ALLOWED_FIELDS Whitelist
 * - Siehe: docs/SECURITY/sql-updates.md
 */
function recheckSqlInjection(files?: string[]): RecheckResult {
  const projectRoot = process.cwd();
  const srcPath = path.join(projectRoot, "src/app/api");
  const details: string[] = [];
  let remainingCount = 0;

  // Rekursiv alle .ts Dateien finden
  function scanDir(dir: string) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scanDir(fullPath);
      } else if (entry.name.endsWith(".ts")) {
        const content = fs.readFileSync(fullPath, "utf-8");
        const lines = content.split("\n");
        
        let fileUnsafeCount = 0;
        
        lines.forEach((line, index) => {
          // Skip Kommentare
          const trimmed = line.trim();
          if (trimmed.startsWith("//") || trimmed.startsWith("*")) return;
          
          // Suche nach SQL-Queries mit Template-Literals
          if (/\.(execute|query)\s*\(/.test(line) && /\$\{/.test(line)) {
            // Enterprise++ Ausnahmen:
            // 1. @sql-safe Kommentar in der Zeile oder Zeile davor
            const prevLine = index > 0 ? lines[index - 1] : "";
            const hasSafeMarker = line.includes("@sql-safe") || prevLine.includes("@sql-safe");
            
            // 2. ALLOWED_FIELDS Pattern (Whitelist vorhanden)
            const hasWhitelist = content.includes("ALLOWED_") && 
                                 (line.includes(".map(") || line.includes(".filter("));
            
            // 3. escapeId() oder escape() verwendet
            const hasEscape = /escape(Id)?\s*\(/.test(line);
            
            if (!hasSafeMarker && !hasWhitelist && !hasEscape) {
              fileUnsafeCount++;
            }
          }
        });
        
        if (fileUnsafeCount > 0) {
          remainingCount += fileUnsafeCount;
          const relativePath = path.relative(projectRoot, fullPath);
          details.push(`${relativePath}: ${fileUnsafeCount} unsichere Queries`);
        }
      }
    }
  }

  scanDir(srcPath);

  return {
    issueId: "SEC-02",
    verified: remainingCount === 0,
    remainingCount,
    details: details.slice(0, 10),
    recommendation: remainingCount > 0
      ? `Noch ${remainingCount} unsichere SQL-Queries gefunden. Verwende ALLOWED_FIELDS Whitelist + @sql-safe Marker.`
      : "✅ Keine unsicheren SQL-Queries gefunden."
  };
}

/**
 * Prüft ob hardcoded Passwörter noch existieren
 */
function recheckHardcodedPasswords(files?: string[]): RecheckResult {
  const projectRoot = process.cwd();
  const filesToCheck = files || [
    "src/app/api/admin/quick-setup/route.ts",
    "src/app/api/admin/debug-login/route.ts"
  ];
  const details: string[] = [];
  let remainingCount = 0;

  for (const file of filesToCheck) {
    const fullPath = path.join(projectRoot, file);
    if (!fs.existsSync(fullPath)) continue;

    const content = fs.readFileSync(fullPath, "utf-8");
    const lines = content.split("\n");

    lines.forEach((line, index) => {
      // Suche nach hardcoded Passwörtern (nicht in Kommentaren)
      if (!line.trim().startsWith("//") && !line.trim().startsWith("*")) {
        if (/password\s*=\s*["'][^"']+["']/i.test(line) && 
            !line.includes("process.env") && 
            !line.includes("password_hash")) {
          remainingCount++;
          details.push(`${file}:${index + 1}: Hardcoded password found`);
        }
      }
    });
  }

  return {
    issueId: "SEC-03",
    verified: remainingCount === 0,
    remainingCount,
    details: details.slice(0, 10),
    recommendation: remainingCount > 0
      ? `Noch ${remainingCount} hardcoded Passwörter gefunden. Verwende Environment-Variablen oder generierte Passwörter.`
      : "✅ Keine hardcoded Passwörter gefunden."
  };
}

// =====================================================
// POST - Recheck durchführen
// =====================================================

export async function POST(request: NextRequest) {
  try {
    const body: RecheckRequest = await request.json();
    const { issueId, issueType, affectedFiles } = body;

    if (!issueId || !issueType) {
      return NextResponse.json(
        { success: false, error: "issueId und issueType sind erforderlich" },
        { status: 400 }
      );
    }

    let result: RecheckResult;

    // Führe den passenden Recheck durch
    switch (issueType) {
      case "drop_table":
        result = recheckDropTable(affectedFiles);
        break;
      case "sql_injection":
        result = recheckSqlInjection(affectedFiles);
        break;
      case "hardcoded_password":
        result = recheckHardcodedPasswords(affectedFiles);
        break;
      default:
        return NextResponse.json(
          { success: false, error: `Unbekannter issueType: ${issueType}` },
          { status: 400 }
        );
    }

    // Datenbank-Updates
    try {
      const pool = await getConnection();
      
      // 1. Task-Status aktualisieren wenn taskId vorhanden
      if (body.taskId) {
        if (!result.verified) {
          // Problem NICHT behoben → Status zurück auf "open"
          await pool.execute(`
            UPDATE dev_tasks 
            SET status = 'open', 
                updated_at = NOW()
            WHERE id = ?
          `, [body.taskId]);
          console.log(`📝 Task ${body.taskId} Status auf 'open' gesetzt (${result.remainingCount} Probleme verbleiben)`);
        } else {
          // Problem behoben → Status auf "done"
          await pool.execute(`
            UPDATE dev_tasks 
            SET status = 'done', 
                updated_at = NOW()
            WHERE id = ?
          `, [body.taskId]);
          console.log(`✅ Task ${body.taskId} Status auf 'done' gesetzt (verifiziert)`);
        }
      }
      
      // 2. Audit-Log
      await pool.execute(`
        INSERT INTO lopez_audit_logs 
          (user_id, action, entity_type, entity_id, details)
        VALUES (1, 'SECURITY_RECHECK', 'security_issue', ?, ?)
      `, [
        body.taskId || 0,
        JSON.stringify({
          issueId,
          issueType,
          verified: result.verified,
          remainingCount: result.remainingCount,
          statusUpdated: body.taskId ? (result.verified ? 'done' : 'open') : null
        })
      ]);
    } catch (dbError) {
      console.warn("DB-Update konnte nicht durchgeführt werden:", dbError);
    }

    return NextResponse.json({
      success: true,
      message: result.verified 
        ? `✅ ${issueId} verifiziert: Problem wurde behoben!`
        : `⚠️ ${issueId} NICHT verifiziert: ${result.remainingCount} Probleme verbleiben`,
      data: result,
      statusUpdated: body.taskId ? (result.verified ? 'done' : 'open') : null
    });

  } catch (error) {
    console.error("❌ Security Recheck Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Fehler" },
      { status: 500 }
    );
  }
}

// =====================================================
// GET - Alle verfügbaren Checks auflisten
// =====================================================

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      availableChecks: [
        {
          issueType: "drop_table",
          description: "Prüft auf DROP TABLE Statements in Production-Code",
          severity: "critical"
        },
        {
          issueType: "sql_injection",
          description: "Prüft auf unsichere SQL-Template-Literals",
          severity: "critical"
        },
        {
          issueType: "hardcoded_password",
          description: "Prüft auf hardcoded Passwörter",
          severity: "critical"
        }
      ],
      usage: {
        method: "POST",
        body: {
          issueId: "SEC-01",
          issueType: "drop_table",
          affectedFiles: ["src/lib/database.ts"] // optional
        }
      }
    }
  });
}





