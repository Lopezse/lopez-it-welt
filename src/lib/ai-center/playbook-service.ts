// =====================================================
// AI CENTER - PLAYBOOK SERVICE
// =====================================================
// Enterprise++ Playbook-System
// Wiederverwendbare Lösungstemplates
// =====================================================

import { getConnection } from "@/lib/database";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";

// =====================================================
// TYPEN
// =====================================================

export type PlaybookCategory = 
  | "security"        // Sicherheits-Playbooks (SEC-XX)
  | "accessibility"   // Barrierefreiheit (A11Y-XX)
  | "performance"     // Performance (PERF-XX)
  | "quality"         // Code-Qualität (QUAL-XX)
  | "documentation"   // Dokumentation (DOC-XX)
  | "compliance"      // Compliance (COMP-XX)
  | "incident"        // Incident Response (INC-XX)
  | "maintenance";    // Wartung (MAINT-XX)

export type PlaybookStatus = "draft" | "active" | "deprecated";

export interface PlaybookStep {
  order: number;
  title: string;
  description: string;
  action_type: "manual" | "automated" | "verification";
  automation_config?: Record<string, any>;
  expected_duration?: string;  // z.B. "15min", "1h"
  required_role?: string;
}

export interface Playbook {
  id: number;
  code: string;           // z.B. "SEC-01", "A11Y-02"
  name: string;
  description: string;
  category: PlaybookCategory;
  status: PlaybookStatus;
  version: string;
  steps: PlaybookStep[];
  tags: string[];
  estimated_duration: string;
  risk_level: "low" | "medium" | "high";
  created_by: string;
  created_at: Date;
  updated_at: Date;
  run_count: number;
}

export interface PlaybookExecution {
  id: number;
  playbook_id: number;
  playbook_code: string;
  context: Record<string, any>;
  dry_run: boolean;
  status: "running" | "completed" | "failed" | "cancelled";
  current_step: number;
  step_results: Record<string, any>[];
  started_at: Date;
  completed_at: Date | null;
  executed_by: string;
  error: string | null;
}

// =====================================================
// STANDARD-PLAYBOOKS
// =====================================================

export const DEFAULT_PLAYBOOKS: Omit<Playbook, "id" | "created_at" | "updated_at" | "run_count">[] = [
  // -------------------------------------------------
  // SECURITY PLAYBOOKS
  // -------------------------------------------------
  {
    code: "SEC-01",
    name: "XSS-Schwachstelle beheben",
    description: "Schritte zur Behebung von Cross-Site-Scripting (XSS) Schwachstellen",
    category: "security",
    status: "active",
    version: "1.0",
    tags: ["xss", "security", "critical"],
    estimated_duration: "2h",
    risk_level: "high",
    created_by: "system",
    steps: [
      {
        order: 1,
        title: "Schwachstelle analysieren",
        description: "Identifiziere den genauen Ort und Typ der XSS-Schwachstelle (Reflected, Stored, DOM-based)",
        action_type: "manual",
        expected_duration: "15min"
      },
      {
        order: 2,
        title: "Input-Validierung implementieren",
        description: "Füge serverseitige Input-Validierung hinzu. Verwende Whitelist-Ansatz wo möglich.",
        action_type: "manual",
        expected_duration: "30min"
      },
      {
        order: 3,
        title: "Output-Encoding anwenden",
        description: "Stelle sicher, dass alle Ausgaben korrekt encoded werden (HTML, JavaScript, URL, CSS)",
        action_type: "manual",
        expected_duration: "30min"
      },
      {
        order: 4,
        title: "Content Security Policy prüfen",
        description: "Überprüfe und aktualisiere CSP-Header falls nötig",
        action_type: "manual",
        expected_duration: "15min"
      },
      {
        order: 5,
        title: "Tests durchführen",
        description: "Führe manuelle und automatisierte Tests durch um die Behebung zu verifizieren",
        action_type: "verification",
        expected_duration: "30min"
      }
    ]
  },
  {
    code: "SEC-02",
    name: "SQL-Injection beheben",
    description: "Schritte zur Behebung von SQL-Injection Schwachstellen",
    category: "security",
    status: "active",
    version: "1.0",
    tags: ["sql-injection", "security", "critical", "database"],
    estimated_duration: "3h",
    risk_level: "high",
    created_by: "system",
    steps: [
      {
        order: 1,
        title: "Betroffene Queries identifizieren",
        description: "Finde alle SQL-Queries die User-Input verwenden",
        action_type: "manual",
        expected_duration: "30min"
      },
      {
        order: 2,
        title: "Prepared Statements implementieren",
        description: "Ersetze String-Konkatenation durch Prepared Statements mit Parametern",
        action_type: "manual",
        expected_duration: "1h"
      },
      {
        order: 3,
        title: "ORM/Query-Builder prüfen",
        description: "Stelle sicher, dass ORM korrekt verwendet wird und keine raw queries exponiert sind",
        action_type: "manual",
        expected_duration: "30min"
      },
      {
        order: 4,
        title: "Database-Berechtigungen prüfen",
        description: "Minimiere DB-User Berechtigungen (Principle of Least Privilege)",
        action_type: "manual",
        expected_duration: "15min"
      },
      {
        order: 5,
        title: "Penetration-Test durchführen",
        description: "Führe SQLMap oder ähnliche Tools aus um die Behebung zu verifizieren",
        action_type: "verification",
        expected_duration: "30min"
      }
    ]
  },
  {
    code: "SEC-03",
    name: "Authentifizierung härten",
    description: "Best Practices für sichere Authentifizierung implementieren",
    category: "security",
    status: "active",
    version: "1.0",
    tags: ["auth", "security", "best-practice"],
    estimated_duration: "4h",
    risk_level: "medium",
    created_by: "system",
    steps: [
      {
        order: 1,
        title: "Passwort-Hashing prüfen",
        description: "Stelle sicher, dass bcrypt/argon2 mit ausreichenden Runden verwendet wird",
        action_type: "verification",
        expected_duration: "15min"
      },
      {
        order: 2,
        title: "Session-Management prüfen",
        description: "Überprüfe Session-Timeout, Secure/HttpOnly Cookies, Session-Regeneration",
        action_type: "manual",
        expected_duration: "30min"
      },
      {
        order: 3,
        title: "Rate-Limiting implementieren",
        description: "Füge Brute-Force-Schutz für Login hinzu",
        action_type: "manual",
        expected_duration: "1h"
      },
      {
        order: 4,
        title: "2FA evaluieren",
        description: "Prüfe ob 2FA sinnvoll und implementierbar ist",
        action_type: "manual",
        expected_duration: "1h"
      },
      {
        order: 5,
        title: "Audit-Logging aktivieren",
        description: "Stelle sicher, dass Login-Versuche geloggt werden",
        action_type: "verification",
        expected_duration: "15min"
      }
    ]
  },

  // -------------------------------------------------
  // ACCESSIBILITY PLAYBOOKS
  // -------------------------------------------------
  {
    code: "A11Y-01",
    name: "Formular-Zugänglichkeit",
    description: "Formulare barrierefrei gestalten (WCAG 2.1 AA)",
    category: "accessibility",
    status: "active",
    version: "1.0",
    tags: ["forms", "wcag", "aria"],
    estimated_duration: "2h",
    risk_level: "low",
    created_by: "system",
    steps: [
      {
        order: 1,
        title: "Labels überprüfen",
        description: "Stelle sicher, dass alle Inputs ein zugehöriges <label> haben (for/id oder nesting)",
        action_type: "manual",
        expected_duration: "20min"
      },
      {
        order: 2,
        title: "Error-Handling verbessern",
        description: "Fehlermeldungen müssen mit dem Input verknüpft sein (aria-describedby)",
        action_type: "manual",
        expected_duration: "30min"
      },
      {
        order: 3,
        title: "Fokus-Reihenfolge prüfen",
        description: "Tab-Navigation muss logisch sein, keine tabindex > 0 verwenden",
        action_type: "verification",
        expected_duration: "15min"
      },
      {
        order: 4,
        title: "Required-Fields kennzeichnen",
        description: "Pflichtfelder visuell und für Screenreader markieren",
        action_type: "manual",
        expected_duration: "15min"
      },
      {
        order: 5,
        title: "Screenreader-Test",
        description: "Mit NVDA/VoiceOver testen",
        action_type: "verification",
        expected_duration: "30min"
      }
    ]
  },
  {
    code: "A11Y-02",
    name: "Tastatur-Navigation",
    description: "Vollständige Tastatur-Bedienbarkeit sicherstellen",
    category: "accessibility",
    status: "active",
    version: "1.0",
    tags: ["keyboard", "wcag", "navigation"],
    estimated_duration: "3h",
    risk_level: "low",
    created_by: "system",
    steps: [
      {
        order: 1,
        title: "Fokus-Indicator prüfen",
        description: "Alle fokussierbaren Elemente müssen einen sichtbaren Fokus-Indicator haben",
        action_type: "verification",
        expected_duration: "20min"
      },
      {
        order: 2,
        title: "Skip-Links hinzufügen",
        description: "Skip-to-Content Link für schnelle Navigation implementieren",
        action_type: "manual",
        expected_duration: "30min"
      },
      {
        order: 3,
        title: "Custom Components prüfen",
        description: "Dropdowns, Modals, Tabs müssen keyboard-accessible sein",
        action_type: "manual",
        expected_duration: "1h"
      },
      {
        order: 4,
        title: "Focus-Trap für Modals",
        description: "Modal-Dialoge müssen den Fokus fangen und bei Schließen zurückgeben",
        action_type: "manual",
        expected_duration: "30min"
      },
      {
        order: 5,
        title: "Keyboard-Only Test",
        description: "Gesamte Anwendung nur mit Tastatur durchnavigieren",
        action_type: "verification",
        expected_duration: "30min"
      }
    ]
  },

  // -------------------------------------------------
  // PERFORMANCE PLAYBOOKS
  // -------------------------------------------------
  {
    code: "PERF-01",
    name: "Frontend-Performance optimieren",
    description: "Core Web Vitals verbessern (LCP, FID, CLS)",
    category: "performance",
    status: "active",
    version: "1.0",
    tags: ["performance", "web-vitals", "frontend"],
    estimated_duration: "4h",
    risk_level: "medium",
    created_by: "system",
    steps: [
      {
        order: 1,
        title: "Lighthouse-Audit durchführen",
        description: "Baseline-Messung mit Chrome DevTools Lighthouse",
        action_type: "verification",
        expected_duration: "15min"
      },
      {
        order: 2,
        title: "Bilder optimieren",
        description: "WebP/AVIF verwenden, Lazy-Loading, korrekte Größen",
        action_type: "manual",
        expected_duration: "1h"
      },
      {
        order: 3,
        title: "JavaScript analysieren",
        description: "Bundle-Größe prüfen, Code-Splitting implementieren",
        action_type: "manual",
        expected_duration: "1h"
      },
      {
        order: 4,
        title: "Critical CSS inlinen",
        description: "Above-the-fold CSS inline, Rest async laden",
        action_type: "manual",
        expected_duration: "30min"
      },
      {
        order: 5,
        title: "Caching optimieren",
        description: "Cache-Header, Service Worker, CDN prüfen",
        action_type: "manual",
        expected_duration: "30min"
      },
      {
        order: 6,
        title: "Erneute Messung",
        description: "Lighthouse erneut ausführen und Verbesserungen dokumentieren",
        action_type: "verification",
        expected_duration: "15min"
      }
    ]
  },

  // -------------------------------------------------
  // QUALITY PLAYBOOKS
  // -------------------------------------------------
  {
    code: "QUAL-01",
    name: "TypeScript-Strict aktivieren",
    description: "Schrittweise Migration zu strict TypeScript",
    category: "quality",
    status: "active",
    version: "1.0",
    tags: ["typescript", "quality", "migration"],
    estimated_duration: "8h",
    risk_level: "medium",
    created_by: "system",
    steps: [
      {
        order: 1,
        title: "Aktuelle Konfiguration prüfen",
        description: "tsconfig.json analysieren, Baseline-Fehler zählen",
        action_type: "verification",
        expected_duration: "15min"
      },
      {
        order: 2,
        title: "noImplicitAny aktivieren",
        description: "Schrittweise any-Types eliminieren",
        action_type: "manual",
        expected_duration: "2h"
      },
      {
        order: 3,
        title: "strictNullChecks aktivieren",
        description: "Null-Checks hinzufügen, Optional Chaining nutzen",
        action_type: "manual",
        expected_duration: "2h"
      },
      {
        order: 4,
        title: "strictPropertyInitialization",
        description: "Class-Properties initialisieren",
        action_type: "manual",
        expected_duration: "1h"
      },
      {
        order: 5,
        title: "strict: true aktivieren",
        description: "Finale Migration zu strict mode",
        action_type: "manual",
        expected_duration: "1h"
      },
      {
        order: 6,
        title: "Tests durchführen",
        description: "Alle Tests laufen lassen, Regressions prüfen",
        action_type: "verification",
        expected_duration: "30min"
      }
    ]
  },

  // -------------------------------------------------
  // INCIDENT RESPONSE
  // -------------------------------------------------
  {
    code: "INC-01",
    name: "Security Incident Response",
    description: "Reaktion auf Sicherheitsvorfälle",
    category: "incident",
    status: "active",
    version: "1.0",
    tags: ["incident", "security", "emergency"],
    estimated_duration: "Variable",
    risk_level: "high",
    created_by: "system",
    steps: [
      {
        order: 1,
        title: "Erkennung & Klassifizierung",
        description: "Vorfall bestätigen, Schweregrad einschätzen (P1-P4)",
        action_type: "manual",
        expected_duration: "15min",
        required_role: "admin"
      },
      {
        order: 2,
        title: "Containment",
        description: "Betroffene Systeme isolieren, weitere Schäden verhindern",
        action_type: "manual",
        expected_duration: "30min",
        required_role: "admin"
      },
      {
        order: 3,
        title: "Analyse",
        description: "Root Cause analysieren, Umfang des Vorfalls ermitteln",
        action_type: "manual",
        expected_duration: "1h"
      },
      {
        order: 4,
        title: "Behebung",
        description: "Schwachstelle schließen, Patches anwenden",
        action_type: "manual",
        expected_duration: "Variable"
      },
      {
        order: 5,
        title: "Recovery",
        description: "Systeme wiederherstellen, Normalbetrieb aufnehmen",
        action_type: "manual",
        expected_duration: "Variable"
      },
      {
        order: 6,
        title: "Post-Mortem",
        description: "Incident dokumentieren, Lessons Learned, Prozess verbessern",
        action_type: "manual",
        expected_duration: "2h"
      }
    ]
  }
];

// =====================================================
// PLAYBOOK SERVICE
// =====================================================

export class PlaybookService {

  // -------------------------------------------------
  // PLAYBOOK CRUD
  // -------------------------------------------------

  /**
   * Initialisiert Standard-Playbooks
   */
  static async initializeDefaultPlaybooks(): Promise<void> {
    for (const playbook of DEFAULT_PLAYBOOKS) {
      await this.upsertPlaybook(playbook);
    }
  }

  /**
   * Erstellt oder aktualisiert ein Playbook
   */
  static async upsertPlaybook(playbook: Omit<Playbook, "id" | "created_at" | "updated_at" | "run_count">): Promise<Playbook> {
    const pool = await getConnection();
    
    // Prüfen ob Code bereits existiert
    const [existing] = await pool.execute<RowDataPacket[]>(`
      SELECT id FROM ai_playbooks WHERE code = ?
    `, [playbook.code]);
    
    if (existing.length > 0) {
      // Update
      await pool.execute(`
        UPDATE ai_playbooks SET
          name = ?, description = ?, category = ?, status = ?, version = ?,
          steps_config = ?, tags = ?, estimated_duration = ?, risk_level = ?,
          updated_at = NOW()
        WHERE code = ?
      `, [
        playbook.name,
        playbook.description,
        playbook.category,
        playbook.status,
        playbook.version,
        JSON.stringify(playbook.steps),
        JSON.stringify(playbook.tags),
        playbook.estimated_duration,
        playbook.risk_level,
        playbook.code
      ]);
      
      return this.getPlaybookByCode(playbook.code) as Promise<Playbook>;
    }
    
    // Insert
    const [result] = await pool.execute<ResultSetHeader>(`
      INSERT INTO ai_playbooks (code, name, description, category, status, version, steps_config, tags, estimated_duration, risk_level, created_by)
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
    
    return this.getPlaybookById(result.insertId) as Promise<Playbook>;
  }

  /**
   * Holt Playbook nach ID
   */
  static async getPlaybookById(id: number): Promise<Playbook | null> {
    const pool = await getConnection();
    
    const [rows] = await pool.execute<RowDataPacket[]>(`
      SELECT * FROM ai_playbooks WHERE id = ?
    `, [id]);
    
    if (rows.length === 0) return null;
    
    return this.mapRowToPlaybook(rows[0]);
  }

  /**
   * Holt Playbook nach Code
   */
  static async getPlaybookByCode(code: string): Promise<Playbook | null> {
    const pool = await getConnection();
    
    const [rows] = await pool.execute<RowDataPacket[]>(`
      SELECT * FROM ai_playbooks WHERE code = ?
    `, [code]);
    
    if (rows.length === 0) return null;
    
    return this.mapRowToPlaybook(rows[0]);
  }

  /**
   * Listet alle Playbooks
   */
  static async listPlaybooks(filters?: { category?: PlaybookCategory; status?: PlaybookStatus; search?: string }): Promise<Playbook[]> {
    const pool = await getConnection();
    
    let query = "SELECT * FROM ai_playbooks WHERE 1=1";
    const params: any[] = [];
    
    if (filters?.category) {
      query += " AND category = ?";
      params.push(filters.category);
    }
    if (filters?.status) {
      query += " AND status = ?";
      params.push(filters.status);
    }
    if (filters?.search) {
      query += " AND (name LIKE ? OR description LIKE ? OR code LIKE ?)";
      params.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`);
    }
    
    query += " ORDER BY category, code";
    
    const [rows] = await pool.execute<RowDataPacket[]>(query, params);
    
    return rows.map(row => this.mapRowToPlaybook(row));
  }

  // -------------------------------------------------
  // PLAYBOOK EXECUTION
  // -------------------------------------------------

  /**
   * Führt ein Playbook aus
   */
  static async executePlaybook(
    playbookId: number | string,
    context: Record<string, any>,
    options: { dry_run?: boolean; executed_by?: string } = {}
  ): Promise<PlaybookExecution> {
    const pool = await getConnection();
    
    // Playbook laden
    const playbook = typeof playbookId === 'number' 
      ? await this.getPlaybookById(playbookId)
      : await this.getPlaybookByCode(playbookId);
    
    if (!playbook) {
      throw new Error(`Playbook ${playbookId} nicht gefunden`);
    }
    
    // Execution starten
    const [execResult] = await pool.execute<ResultSetHeader>(`
      INSERT INTO ai_playbook_executions (playbook_id, playbook_code, context, dry_run, status, current_step, executed_by)
      VALUES (?, ?, ?, ?, 'running', 0, ?)
    `, [
      playbook.id,
      playbook.code,
      JSON.stringify(context),
      options.dry_run || false,
      options.executed_by || 'system'
    ]);
    
    const executionId = execResult.insertId;
    const stepResults: Record<string, any>[] = [];
    let error: string | null = null;
    let currentStep = 0;
    
    try {
      // Steps durchlaufen
      for (const step of playbook.steps) {
        currentStep = step.order;
        
        // Update current step
        await pool.execute(`
          UPDATE ai_playbook_executions SET current_step = ? WHERE id = ?
        `, [currentStep, executionId]);
        
        // Step ausführen
        const stepResult = await this.executeStep(step, context, options.dry_run || false);
        stepResults.push({
          step: step.order,
          title: step.title,
          ...stepResult
        });
      }
      
      // Erfolgreich
      await pool.execute(`
        UPDATE ai_playbook_executions 
        SET status = 'completed', completed_at = NOW(), step_results = ?
        WHERE id = ?
      `, [JSON.stringify(stepResults), executionId]);
      
      // Playbook-Counter aktualisieren
      await pool.execute(`
        UPDATE ai_playbooks SET run_count = run_count + 1 WHERE id = ?
      `, [playbook.id]);
      
    } catch (err) {
      error = err instanceof Error ? err.message : "Unbekannter Fehler";
      
      await pool.execute(`
        UPDATE ai_playbook_executions 
        SET status = 'failed', completed_at = NOW(), step_results = ?, error = ?
        WHERE id = ?
      `, [JSON.stringify(stepResults), error, executionId]);
    }
    
    // Execution zurückgeben
    return this.getExecutionById(executionId) as Promise<PlaybookExecution>;
  }

  /**
   * Führt einen einzelnen Step aus
   */
  private static async executeStep(step: PlaybookStep, context: Record<string, any>, dryRun: boolean): Promise<Record<string, any>> {
    if (dryRun) {
      return {
        status: "simulated",
        message: `[DRY-RUN] ${step.title}`,
        action_type: step.action_type
      };
    }
    
    // Für automatisierte Steps
    if (step.action_type === "automated" && step.automation_config) {
      // Hier könnte automatische Ausführung stattfinden
      return {
        status: "executed",
        message: `Automatisiert: ${step.title}`,
        config: step.automation_config
      };
    }
    
    // Manuelle Steps werden nur dokumentiert
    return {
      status: "manual",
      message: step.title,
      description: step.description,
      expected_duration: step.expected_duration
    };
  }

  /**
   * Holt Execution nach ID
   */
  static async getExecutionById(id: number): Promise<PlaybookExecution | null> {
    const pool = await getConnection();
    
    const [rows] = await pool.execute<RowDataPacket[]>(`
      SELECT * FROM ai_playbook_executions WHERE id = ?
    `, [id]);
    
    if (rows.length === 0) return null;
    
    return this.mapRowToExecution(rows[0]);
  }

  /**
   * Listet Executions
   */
  static async listExecutions(playbookId?: number, limit: number = 50): Promise<PlaybookExecution[]> {
    const pool = await getConnection();
    
    let query = "SELECT * FROM ai_playbook_executions";
    const params: any[] = [];
    
    if (playbookId) {
      query += " WHERE playbook_id = ?";
      params.push(playbookId);
    }
    
    query += " ORDER BY started_at DESC LIMIT ?";
    params.push(limit);
    
    const [rows] = await pool.execute<RowDataPacket[]>(query, params);
    
    return rows.map(row => this.mapRowToExecution(row));
  }

  // -------------------------------------------------
  // HELPER
  // -------------------------------------------------

  private static mapRowToPlaybook(row: RowDataPacket): Playbook {
    return {
      id: row.id,
      code: row.code,
      name: row.name,
      description: row.description,
      category: row.category,
      status: row.status,
      version: row.version,
      steps: JSON.parse(row.steps_config || "[]"),
      tags: JSON.parse(row.tags || "[]"),
      estimated_duration: row.estimated_duration,
      risk_level: row.risk_level,
      created_by: row.created_by,
      created_at: row.created_at,
      updated_at: row.updated_at,
      run_count: row.run_count || 0
    };
  }

  private static mapRowToExecution(row: RowDataPacket): PlaybookExecution {
    return {
      id: row.id,
      playbook_id: row.playbook_id,
      playbook_code: row.playbook_code,
      context: JSON.parse(row.context || "{}"),
      dry_run: row.dry_run,
      status: row.status,
      current_step: row.current_step,
      step_results: JSON.parse(row.step_results || "[]"),
      started_at: row.started_at,
      completed_at: row.completed_at,
      executed_by: row.executed_by,
      error: row.error
    };
  }
}

export default PlaybookService;







