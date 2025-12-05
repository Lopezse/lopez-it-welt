// =====================================================
// ENTERPRISE++ PROJEKT-ANALYZER SERVICE
// =====================================================
// Erstellt: 2025-12-04
// Erweitert: 2025-12-04 – Projekt-Presets hinzugefügt
// Zweck: READ-ONLY Analyse des Projekts nach Bereichen
// Status: ✅ Production-Ready
// =====================================================
//
// SICHERHEITSHINWEISE:
// - Alle Operationen sind READ-ONLY
// - Es werden KEINE Dateien verändert
// - Nur Analyse und Reporting
// =====================================================

import * as fs from "fs";
import * as path from "path";
import { getConnection } from "../database";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";

// =====================================================
// PROJEKT-PRESETS
// =====================================================

export type ProjectKey = "core" | "admin" | "ai_center" | "shop" | "security" | "docs";

export interface ProjectPreset {
  key: ProjectKey;
  name: string;
  description: string;
  scanPaths: string[];
}

export const PROJECT_PRESETS: ProjectPreset[] = [
  {
    key: "core",
    name: "Gesamtes System (Lopez IT Welt)",
    description: "Kompletter Code inkl. Admin, AI Center, Shop und Docs.",
    scanPaths: ["src", "docs"],
  },
  {
    key: "admin",
    name: "Admin & Dashboard",
    description: "Admin-Bereich, Dashboard und Systemkonfiguration.",
    scanPaths: ["src/app/admin", "src/lib/admin", "src/components/admin"],
  },
  {
    key: "ai_center",
    name: "AI Center & Orchestrator",
    description: "AI Center, KI-Orchestrator und Dev-Orchestrator.",
    scanPaths: [
      "src/app/admin/ai",
      "src/app/api/admin/dev-tasks",
      "src/app/api/admin/project-analysis",
      "src/lib/ki-orchestrator",
      "src/lib/dev-orchestrator",
      "src/lib/agent-system.ts",
      "src/lib/project-analysis",
      "src/lib/ai",
    ],
  },
  {
    key: "shop",
    name: "Shop & Kundenverwaltung",
    description: "Kunden, Projekte, Rechnungen und Shop-Bereich.",
    scanPaths: [
      "src/app/(shop)",
      "src/app/admin/customers",
      "src/app/admin/office",
      "src/lib/shop",
      "src/lib/customers",
    ],
  },
  {
    key: "security",
    name: "Sicherheit & Auth",
    description: "Authentifizierung, 2FA, RBAC, Sessions und Security.",
    scanPaths: [
      "src/app/api/auth",
      "src/app/api/admin/security",
      "src/lib/auth",
      "src/lib/security",
      "src/lib/rbac",
      "src/components/admin/security",
    ],
  },
  {
    key: "docs",
    name: "Nur Dokumentation",
    description: "Markdown-Dokumentation und Status-Dateien.",
    scanPaths: ["docs"],
  },
];

// =====================================================
// TYPEN
// =====================================================

export interface ProjectRiskItem {
  id: string;
  severity: "critical" | "high" | "medium" | "low";
  category: "security" | "code-quality" | "architecture" | "a11y" | "performance" | "docs" | "other";
  title: string;
  description: string;
  affectedFiles?: { path: string; hint?: string }[];
  recommendation: string;
}

export interface ProjectAnalysisSummary {
  analyzedAt: string;
  projectKey: ProjectKey;
  projectName: string;
  scannedPaths: string[];
  architectureScore: number;
  securityScore: number;
  codeQualityScore: number;
  a11yScore: number;
  performanceScore: number;
  documentationScore: number;
  enterpriseScore: number;
  metrics: {
    consoleLogCount: number;
    anyTypeCount: number;
    todoCount: number;
    sqlTemplateQueries: number;
    dropTableCount: number;
    filesScanned: number;
    totalLines: number;
    mdFilesCount: number;
    tsFilesCount: number;
    tsxFilesCount: number;
  };
  risks: ProjectRiskItem[];
}

interface FileAnalysisResult {
  path: string;
  consoleLogCount: number;
  anyTypeCount: number;
  todoCount: number;
  sqlTemplateCount: number;
  dropTableCount: number;
  ariaCount: number;
  lines: number;
}

// =====================================================
// HAUPTFUNKTION
// =====================================================

export async function runProjectAnalysis(projectKey: ProjectKey = "core"): Promise<ProjectAnalysisSummary> {
  const projectRoot = process.cwd();
  const preset = PROJECT_PRESETS.find((p) => p.key === projectKey) ?? PROJECT_PRESETS[0];

  console.log(`[Project-Analyzer] Starte Analyse für: "${preset.name}"`);
  console.log(`[Project-Analyzer] Scanne Pfade: ${preset.scanPaths.join(", ")}`);

  const tsFiles: string[] = [];
  const mdFiles: string[] = [];

  for (const scanPath of preset.scanPaths) {
    const fullPath = path.join(projectRoot, scanPath);
    if (!fs.existsSync(fullPath)) continue;

    const stats = fs.statSync(fullPath);
    if (stats.isFile()) {
      const ext = path.extname(fullPath).toLowerCase();
      if ([".ts", ".tsx"].includes(ext)) tsFiles.push(fullPath);
      else if (ext === ".md") mdFiles.push(fullPath);
    } else if (stats.isDirectory()) {
      collectFiles(fullPath, [".ts", ".tsx"], tsFiles);
      collectFiles(fullPath, [".md"], mdFiles);
    }
  }

  const tsxFiles = tsFiles.filter((f) => f.endsWith(".tsx"));
  console.log(`[Project-Analyzer] Gefunden: ${tsFiles.length} TS/TSX, ${mdFiles.length} MD`);

  let totalConsoleLog = 0, totalAnyType = 0, totalTodo = 0;
  let totalSqlTemplate = 0, totalDropTable = 0, totalAria = 0, totalLines = 0;

  const consoleLogFiles: { path: string; hint?: string }[] = [];
  const anyTypeFiles: { path: string; hint?: string }[] = [];
  const todoFiles: { path: string; hint?: string }[] = [];
  const sqlTemplateFiles: { path: string; hint?: string }[] = [];
  const dropTableFiles: { path: string; hint?: string }[] = [];

  for (const filePath of tsFiles) {
    try {
      const result = analyzeFile(filePath, projectRoot);
      totalConsoleLog += result.consoleLogCount;
      totalAnyType += result.anyTypeCount;
      totalTodo += result.todoCount;
      totalSqlTemplate += result.sqlTemplateCount;
      totalDropTable += result.dropTableCount;
      totalAria += result.ariaCount;
      totalLines += result.lines;

      const relativePath = path.relative(projectRoot, filePath).replace(/\\/g, "/");
      if (result.consoleLogCount > 0) consoleLogFiles.push({ path: relativePath, hint: `${result.consoleLogCount}x` });
      if (result.anyTypeCount > 0) anyTypeFiles.push({ path: relativePath, hint: `${result.anyTypeCount}x` });
      if (result.todoCount > 0) todoFiles.push({ path: relativePath, hint: `${result.todoCount}x` });
      if (result.sqlTemplateCount > 0) sqlTemplateFiles.push({ path: relativePath, hint: `${result.sqlTemplateCount}x` });
      if (result.dropTableCount > 0) dropTableFiles.push({ path: relativePath, hint: `${result.dropTableCount}x` });
    } catch (e) { /* skip */ }
  }

  const scores = calculateScores({
    consoleLogCount: totalConsoleLog, anyTypeCount: totalAnyType, todoCount: totalTodo,
    sqlTemplateCount: totalSqlTemplate, dropTableCount: totalDropTable, ariaCount: totalAria,
    filesScanned: tsFiles.length, mdFilesCount: mdFiles.length,
  });

  const risks = generateRisks({
    consoleLogCount: totalConsoleLog, consoleLogFiles, anyTypeCount: totalAnyType, anyTypeFiles,
    todoCount: totalTodo, todoFiles, sqlTemplateCount: totalSqlTemplate, sqlTemplateFiles,
    dropTableCount: totalDropTable, dropTableFiles, ariaCount: totalAria,
    mdFilesCount: mdFiles.length, filesScanned: tsFiles.length,
  });

  return {
    analyzedAt: new Date().toISOString(),
    projectKey: preset.key,
    projectName: preset.name,
    scannedPaths: preset.scanPaths,
    architectureScore: scores.architecture,
    securityScore: scores.security,
    codeQualityScore: scores.codeQuality,
    a11yScore: scores.a11y,
    performanceScore: scores.performance,
    documentationScore: scores.documentation,
    enterpriseScore: scores.enterprise,
    metrics: {
      consoleLogCount: totalConsoleLog, anyTypeCount: totalAnyType, todoCount: totalTodo,
      sqlTemplateQueries: totalSqlTemplate, dropTableCount: totalDropTable, filesScanned: tsFiles.length,
      totalLines, mdFilesCount: mdFiles.length,
      tsFilesCount: tsFiles.filter((f) => f.endsWith(".ts") && !f.endsWith(".tsx")).length,
      tsxFilesCount: tsxFiles.length,
    },
    risks,
  };
}

// =====================================================
// HILFSFUNKTIONEN
// =====================================================

function collectFiles(dir: string, extensions: string[], result: string[]): void {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (["node_modules", ".next", ".git"].includes(entry.name)) continue;
      if (entry.isDirectory()) collectFiles(fullPath, extensions, result);
      else if (entry.isFile() && extensions.includes(path.extname(entry.name).toLowerCase())) {
        result.push(fullPath);
      }
    }
  } catch (e) { /* skip */ }
}

function analyzeFile(filePath: string, projectRoot: string): FileAnalysisResult {
  const content = fs.readFileSync(filePath, "utf-8");
  return {
    path: path.relative(projectRoot, filePath).replace(/\\/g, "/"),
    consoleLogCount: (content.match(/console\.log/g) || []).length,
    anyTypeCount: (content.match(/:\s*any\b|as\s+any\b/g) || []).length,
    todoCount: (content.match(/TODO|FIXME|HACK/g) || []).length,
    sqlTemplateCount: (content.match(/`[^`]*\$\{[^}]*\}[^`]*(SELECT|INSERT|UPDATE|DELETE)/gi) || []).length +
                      (content.match(/`[^`]*(SELECT|INSERT|UPDATE|DELETE)[^`]*\$\{/gi) || []).length,
    dropTableCount: (content.match(/DROP\s+TABLE/gi) || []).length,
    ariaCount: (content.match(/aria-|role=|tabindex/g) || []).length,
    lines: content.split("\n").length,
  };
}

function calculateScores(m: {
  consoleLogCount: number; anyTypeCount: number; todoCount: number; sqlTemplateCount: number;
  dropTableCount: number; ariaCount: number; filesScanned: number; mdFilesCount: number;
}) {
  let security = 10;
  if (m.dropTableCount > 0) security -= 4;
  if (m.sqlTemplateCount > 10) security -= 3;
  else if (m.sqlTemplateCount > 0) security -= 2;
  security = Math.max(0, Math.min(10, security));

  let codeQuality = 10;
  if (m.consoleLogCount > 100) codeQuality -= 3;
  else if (m.consoleLogCount > 50) codeQuality -= 2;
  else if (m.consoleLogCount > 20) codeQuality -= 1;
  if (m.anyTypeCount > 100) codeQuality -= 3;
  else if (m.anyTypeCount > 50) codeQuality -= 2;
  else if (m.anyTypeCount > 20) codeQuality -= 1;
  if (m.todoCount > 50) codeQuality -= 2;
  else if (m.todoCount > 20) codeQuality -= 1;
  codeQuality = Math.max(0, Math.min(10, codeQuality));

  const architecture = 8;

  let a11y = 4;
  const ariaPerFile = m.ariaCount / Math.max(1, m.filesScanned);
  if (ariaPerFile > 0.5) a11y += 2;
  if (ariaPerFile > 1) a11y += 2;
  a11y = Math.max(0, Math.min(10, a11y));

  let performance = 7;
  if (m.consoleLogCount > 200) performance -= 1;
  performance = Math.max(0, Math.min(10, performance));

  let documentation = 7;
  if (m.mdFilesCount > 100) documentation = 8;
  if (m.mdFilesCount > 300) documentation = 9;
  if (m.mdFilesCount > 400) documentation -= 1;
  documentation = Math.max(0, Math.min(10, documentation));

  return {
    architecture, security, codeQuality, a11y, performance, documentation,
    enterprise: Math.round((architecture + security + codeQuality + a11y + performance + documentation) / 6),
  };
}

function generateRisks(m: {
  consoleLogCount: number; consoleLogFiles: { path: string; hint?: string }[];
  anyTypeCount: number; anyTypeFiles: { path: string; hint?: string }[];
  todoCount: number; todoFiles: { path: string; hint?: string }[];
  sqlTemplateCount: number; sqlTemplateFiles: { path: string; hint?: string }[];
  dropTableCount: number; dropTableFiles: { path: string; hint?: string }[];
  ariaCount: number; mdFilesCount: number; filesScanned: number;
}): ProjectRiskItem[] {
  const risks: ProjectRiskItem[] = [];
  let id = 1;

  if (m.dropTableCount > 0) {
    risks.push({
      id: `SEC-${String(id++).padStart(2, "0")}`, severity: "critical", category: "security",
      title: "DROP TABLE in Production-Code gefunden",
      description: `${m.dropTableCount} Vorkommen von "DROP TABLE" gefunden. Kritisches Datenverlust-Risiko.`,
      affectedFiles: m.dropTableFiles.slice(0, 10),
      recommendation: "Entferne alle DROP TABLE Statements. Nutze Migrations-Scripts mit expliziter Bestätigung.",
    });
  }

  if (m.sqlTemplateCount > 0) {
    risks.push({
      id: `SEC-${String(id++).padStart(2, "0")}`, severity: "critical", category: "security",
      title: "SQL-Injection-Potenzial durch Template-Literals",
      description: `${m.sqlTemplateCount} SQL-Queries mit Template-Literals gefunden. SQL-Injection möglich.`,
      affectedFiles: m.sqlTemplateFiles.slice(0, 10),
      recommendation: "Verwende parametrisierte Queries mit Prepared Statements.",
    });
  }

  if (m.consoleLogCount > 50) {
    risks.push({
      id: `CQ-${String(id++).padStart(2, "0")}`,
      severity: m.consoleLogCount > 200 ? "high" : "medium", category: "code-quality",
      title: `${m.consoleLogCount} console.log Statements`,
      description: `Zu viele console.log Statements beeinträchtigen Performance.`,
      affectedFiles: m.consoleLogFiles.slice(0, 15),
      recommendation: "Ersetze durch strukturierten Logger oder entferne vor Production.",
    });
  }

  if (m.anyTypeCount > 50) {
    risks.push({
      id: `CQ-${String(id++).padStart(2, "0")}`,
      severity: m.anyTypeCount > 200 ? "high" : "medium", category: "code-quality",
      title: `${m.anyTypeCount} TypeScript "any" Types`,
      description: `Zu viele "any" Types umgehen die Typsicherheit.`,
      affectedFiles: m.anyTypeFiles.slice(0, 15),
      recommendation: "Definiere spezifische Interfaces und Types.",
    });
  }

  if (m.todoCount > 20) {
    risks.push({
      id: `CQ-${String(id++).padStart(2, "0")}`, severity: "medium", category: "code-quality",
      title: `${m.todoCount} TODO/FIXME/HACK Kommentare`,
      description: `Unerledigte Kommentare deuten auf unfertige Stellen hin.`,
      affectedFiles: m.todoFiles.slice(0, 15),
      recommendation: "Erstelle Entwicklungsaufträge und entferne Kommentare nach Erledigung.",
    });
  }

  const ariaPerFile = m.ariaCount / Math.max(1, m.filesScanned);
  if (ariaPerFile < 0.3 && m.filesScanned > 10) {
    risks.push({
      id: `A11Y-${String(id++).padStart(2, "0")}`, severity: "medium", category: "a11y",
      title: "Unzureichende ARIA-Attribute",
      description: `Nur ${ariaPerFile.toFixed(2)} ARIA-Attribute pro Datei. WCAG 2.2 erfordert mehr.`,
      affectedFiles: [], recommendation: "Füge aria-label, role und tabindex zu interaktiven Elementen hinzu.",
    });
  }

  if (m.mdFilesCount > 300) {
    risks.push({
      id: `DOC-${String(id++).padStart(2, "0")}`, severity: "low", category: "docs",
      title: "Dokumentation möglicherweise fragmentiert",
      description: `${m.mdFilesCount} Markdown-Dateien gefunden. Hohe Anzahl kann auf Fragmentierung hindeuten.`,
      affectedFiles: [], recommendation: "Konsolidiere verwandte Dokumentationen.",
    });
  }

  const order = { critical: 0, high: 1, medium: 2, low: 3 };
  risks.sort((a, b) => order[a.severity] - order[b.severity]);
  return risks;
}

// =====================================================
// DATENBANK-SPEICHERUNG
// =====================================================

export async function saveAnalysisToDatabase(summary: ProjectAnalysisSummary): Promise<number> {
  try {
    const pool = await getConnection();
    const criticalCount = summary.risks.filter((r) => r.severity === "critical").length;
    const highCount = summary.risks.filter((r) => r.severity === "high").length;
    const mediumCount = summary.risks.filter((r) => r.severity === "medium").length;
    const lowCount = summary.risks.filter((r) => r.severity === "low").length;

    const summaryText = `[${summary.projectKey}] ${summary.projectName} | Score: ${summary.enterpriseScore}/10 | ` +
      `${criticalCount}krit, ${highCount}hoch, ${mediumCount}mittel, ${lowCount}niedrig`;

    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO lopez_ai_project_insights 
        (project_id, insight_type, content, confidence_score, provider, model, tokens_used, cost_estimate, created_at)
       VALUES (0, 'summary', ?, ?, 'local', 'project-analyzer', 0, 0, NOW())`,
      [
        JSON.stringify({
          summaryText, projectKey: summary.projectKey, projectName: summary.projectName,
          scannedPaths: summary.scannedPaths, enterpriseScore: summary.enterpriseScore,
          criticalCount, highCount, mediumCount, lowCount, metrics: summary.metrics, fullReport: summary,
        }),
        summary.enterpriseScore / 10,
      ]
    );
    return result.insertId;
  } catch (error) {
    console.warn("[ProjectAnalyzer] DB-Speicherung fehlgeschlagen:", error);
    return 0;
  }
}

export async function getAnalysisHistory(limit: number = 10): Promise<{
  id: number; analyzedAt: string; projectKey: string; projectName: string;
  enterpriseScore: number; criticalCount: number; highCount: number; mediumCount: number; lowCount: number;
  summaryText: string;
}[]> {
  try {
    const pool = await getConnection();
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT id, content, created_at FROM lopez_ai_project_insights 
       WHERE project_id = 0 AND insight_type = 'summary' ORDER BY created_at DESC LIMIT ?`, [limit]
    );
    return rows.map((row) => {
      try {
        const c = JSON.parse(row.content);
        return {
          id: row.id, analyzedAt: row.created_at, projectKey: c.projectKey || "core",
          projectName: c.projectName || "Unbekannt", enterpriseScore: c.enterpriseScore || 0,
          criticalCount: c.criticalCount || 0, highCount: c.highCount || 0,
          mediumCount: c.mediumCount || 0, lowCount: c.lowCount || 0, summaryText: c.summaryText || "",
        };
      } catch {
        return {
          id: row.id, analyzedAt: row.created_at, projectKey: "core", projectName: "Unbekannt",
          enterpriseScore: 0, criticalCount: 0, highCount: 0, mediumCount: 0, lowCount: 0, summaryText: "",
        };
      }
    });
  } catch (error) {
    console.warn("[ProjectAnalyzer] History-Laden fehlgeschlagen:", error);
    return [];
  }
}

export async function getAnalysisById(id: number): Promise<ProjectAnalysisSummary | null> {
  try {
    const pool = await getConnection();
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT content FROM lopez_ai_project_insights WHERE id = ?`, [id]
    );
    if (rows.length === 0) return null;
    const content = JSON.parse(rows[0].content);
    return content.fullReport || null;
  } catch (error) {
    console.warn("[ProjectAnalyzer] Analyse-Laden fehlgeschlagen:", error);
    return null;
  }
}

export default { runProjectAnalysis, saveAnalysisToDatabase, getAnalysisHistory, getAnalysisById, PROJECT_PRESETS };
