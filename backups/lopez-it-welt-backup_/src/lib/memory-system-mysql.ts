// =====================================================
// MySQL Memory System für KI-Agenten + Gedächtnis
// =====================================================
// Erstellt: 2025-07-05 14:30:00
// Autor: Ramiro Lopez Rodriguez
// Zweck: Sichere MySQL-only Lösung für KI-Gedächtnis
// Integration: Erweitert bestehende lopez_it_welt_db
// =====================================================

import mysql from 'mysql2/promise';

// =====================================================
// Interfaces und Types
// =====================================================

export interface KIRule {
  id?: number;
  rule_text: string;
  category: 'compliance' | 'enterprise' | 'quality' | 'security';
  tags?: string[];
  priority?: 'niedrig' | 'mittel' | 'hoch' | 'kritisch';
  user_id?: number;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface KIMemorySession {
  id?: number;
  session_id: string;
  context: string;
  rules_used?: string[];
  compliance_status?: boolean;
  compliance_notes?: string;
  lessons_learned?: string;
  next_actions?: string[];
  created_at?: Date;
}

export interface MemoryStatistics {
  total_rules: number;
  active_rules: number;
  total_sessions: number;
  compliance_rate: number;
}

export interface ComplianceResult {
  is_compliant: boolean;
  applied_rules: KIRule[];
  violations: string[];
  score: number;
}

interface MySQLRuleRow {
  id: number;
  rule_text: string;
  category: string;
  tags: string;
  priority: string;
  created_at: Date;
}

interface MySQLSessionRow {
  id: number;
  session_id: string;
  context: string;
  rules_used: string;
  compliance_status: boolean;
  compliance_notes: string;
  lessons_learned: string;
  next_actions: string;
  created_at: Date;
}

// =====================================================
// MySQL Memory System Klasse
// =====================================================

export class MySQLMemorySystem {
  private connection: mysql.Connection | null = null;
  private isConnected: boolean = false;

  // =====================================================
  // Konfiguration
  // =====================================================

  private config = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'lopez_it_welt',
    charset: 'utf8mb4',
    timezone: '+01:00',
  };

  // =====================================================
  // Verbindung
  // =====================================================

  async connect(): Promise<void> {
    try {
      this.connection = await mysql.createConnection(this.config);
      this.isConnected = true;
      console.log('✅ MySQL Memory System verbunden');
    } catch (error) {
      console.error('❌ MySQL Memory System Verbindung fehlgeschlagen:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.end();
      this.connection = null;
      this.isConnected = false;
      console.log('🔌 MySQL Memory System getrennt');
    }
  }

  private validateConnection(): void {
    if (!this.connection || !this.isConnected) {
      throw new Error('MySQL Memory System nicht verbunden');
    }
  }

  private validateRule(rule: KIRule): void {
    if (!rule.rule_text || !rule.category) {
      throw new Error(
        'Ungültige Regel: rule_text und category sind erforderlich'
      );
    }
  }

  // =====================================================
  // Schema-Initialisierung
  // =====================================================

  async initializeSchema(): Promise<void> {
    this.validateConnection();

    try {
      // KI-Regeln Tabelle
      await this.connection!.execute(`
        CREATE TABLE IF NOT EXISTS ki_rules (
          id INT AUTO_INCREMENT PRIMARY KEY,
          rule_text TEXT NOT NULL COMMENT 'Regel-Text (DSGVO, Enterprise++, etc.)',
          category VARCHAR(50) NOT NULL COMMENT 'Kategorie: compliance, enterprise, quality, security',
          tags JSON COMMENT 'Tags für bessere Kategorisierung',
          priority ENUM('niedrig', 'mittel', 'hoch', 'kritisch') DEFAULT 'mittel',
          user_id INT NULL COMMENT 'Benutzer der Regel erstellt hat',
          is_active BOOLEAN DEFAULT TRUE COMMENT 'Regel aktiv/inaktiv',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_category (category),
          INDEX idx_active (is_active),
          INDEX idx_priority (priority),
          FULLTEXT(rule_text)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      // KI-Memory-Sessions Tabelle
      await this.connection!.execute(`
        CREATE TABLE IF NOT EXISTS ki_memory_sessions (
          id INT AUTO_INCREMENT PRIMARY KEY,
          session_id VARCHAR(100) NOT NULL COMMENT 'Verbindung zu work_sessions',
          context TEXT NOT NULL COMMENT 'Was wurde gemacht',
          rules_used JSON COMMENT 'Welche Regeln wurden angewendet',
          compliance_status BOOLEAN DEFAULT TRUE COMMENT 'Compliance-Status',
          compliance_notes TEXT COMMENT 'Compliance-Notizen',
          lessons_learned TEXT COMMENT 'Was wurde gelernt',
          next_actions JSON COMMENT 'Nächste Aktionen',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_session (session_id),
          INDEX idx_compliance (compliance_status),
          INDEX idx_created (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      // KI-Audit-Log Tabelle
      await this.connection!.execute(`
        CREATE TABLE IF NOT EXISTS ki_audit_log (
          id INT AUTO_INCREMENT PRIMARY KEY,
          action VARCHAR(50) NOT NULL COMMENT 'Aktion: create, read, update, delete',
          table_name VARCHAR(50) NOT NULL COMMENT 'Betroffene Tabelle',
          record_id INT NULL COMMENT 'Betroffener Datensatz',
          user_id INT NULL COMMENT 'Benutzer der Aktion',
          old_values JSON COMMENT 'Alte Werte (bei Update/Delete)',
          new_values JSON COMMENT 'Neue Werte (bei Create/Update)',
          ip_address VARCHAR(45) COMMENT 'IP-Adresse',
          timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_action (action),
          INDEX idx_table (table_name),
          INDEX idx_user (user_id),
          INDEX idx_timestamp (timestamp)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      console.log('✅ MySQL Memory Schema initialisiert');
    } catch (error) {
      console.error('❌ Schema-Initialisierung fehlgeschlagen:', error);
      throw error;
    }
  }

  // =====================================================
  // Regel-Management
  // =====================================================

  async storeRule(rule: KIRule): Promise<number> {
    this.validateConnection();
    this.validateRule(rule);

    try {
      const [result] = await this.connection!.execute(
        `INSERT INTO ki_rules (rule_text, category, tags, priority, user_id, is_active) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          rule.rule_text,
          rule.category,
          JSON.stringify(rule.tags || []),
          rule.priority || 'mittel',
          rule.user_id || null,
          rule.is_active !== false,
        ]
      );

      const insertResult = result as mysql.ResultSetHeader;
      return insertResult.insertId;
    } catch (error) {
      throw error;
    }
  }

  async getRulesByCategory(category: string): Promise<KIRule[]> {
    this.validateConnection();

    try {
      const [rows] = await this.connection!.execute(
        'SELECT * FROM ki_rules WHERE category = ? AND is_active = TRUE ORDER BY priority DESC, created_at DESC',
        [category]
      );

      return rows as KIRule[];
    } catch (error) {
      throw error;
    }
  }

  async searchRulesByContext(context: string): Promise<KIRule[]> {
    this.validateConnection();

    try {
      const [rows] = await this.connection!.execute(
        `SELECT * FROM ki_rules 
         WHERE is_active = TRUE 
         AND MATCH(rule_text) AGAINST(? IN NATURAL LANGUAGE MODE)
         ORDER BY priority DESC, created_at DESC
         LIMIT 10`,
        [context]
      );

      return rows as KIRule[];
    } catch (error) {
      throw error;
    }
  }

  async updateRule(id: number, updates: Partial<KIRule>): Promise<void> {
    this.validateConnection();

    try {
      const updateFields: string[] = [];
      const values: any[] = [];

      if (updates.rule_text) {
        updateFields.push('rule_text = ?');
        values.push(updates.rule_text);
      }
      if (updates.category) {
        updateFields.push('category = ?');
        values.push(updates.category);
      }
      if (updates.tags) {
        updateFields.push('tags = ?');
        values.push(JSON.stringify(updates.tags));
      }
      if (updates.priority) {
        updateFields.push('priority = ?');
        values.push(updates.priority);
      }
      if (updates.is_active !== undefined) {
        updateFields.push('is_active = ?');
        values.push(updates.is_active);
      }

      if (updateFields.length === 0) {
        throw new Error('Keine Updates angegeben');
      }

      values.push(id);

      await this.connection!.execute(
        `UPDATE ki_rules SET ${updateFields.join(', ')} WHERE id = ?`,
        values
      );
    } catch (error) {
      throw error;
    }
  }

  async deleteRule(id: number): Promise<void> {
    this.validateConnection();

    try {
      await this.connection!.execute('DELETE FROM ki_rules WHERE id = ?', [id]);
    } catch (error) {
      throw error;
    }
  }

  // =====================================================
  // Memory-Session-Management
  // =====================================================

  async storeMemorySession(session: KIMemorySession): Promise<number> {
    this.validateConnection();

    try {
      const [result] = await this.connection!.execute(
        `INSERT INTO ki_memory_sessions 
         (session_id, context, rules_used, compliance_status, compliance_notes, lessons_learned, next_actions) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          session.session_id,
          session.context,
          JSON.stringify(session.rules_used || []),
          session.compliance_status !== false,
          session.compliance_notes || null,
          session.lessons_learned || null,
          JSON.stringify(session.next_actions || []),
        ]
      );

      const insertResult = result as mysql.ResultSetHeader;
      return insertResult.insertId;
    } catch (error) {
      throw error;
    }
  }

  async getMemorySession(sessionId: string): Promise<KIMemorySession | null> {
    this.validateConnection();

    try {
      const [rows] = await this.connection!.execute(
        'SELECT * FROM ki_memory_sessions WHERE session_id = ? ORDER BY created_at DESC LIMIT 1',
        [sessionId]
      );

      const sessions = rows as KIMemorySession[];
      return sessions.length > 0 ? sessions[0] : null;
    } catch (error) {
      throw error;
    }
  }

  async getMemorySessionsByContext(
    context: string
  ): Promise<KIMemorySession[]> {
    this.validateConnection();

    try {
      const [rows] = await this.connection!.execute(
        `SELECT * FROM ki_memory_sessions 
         WHERE context LIKE ? 
         ORDER BY created_at DESC 
         LIMIT 20`,
        [`%${context}%`]
      );

      return rows as KIMemorySession[];
    } catch (error) {
      throw error;
    }
  }

  // =====================================================
  // Compliance-Prüfung
  // =====================================================

  async checkCompliance(
    action: string,
    context: string
  ): Promise<ComplianceResult> {
    this.validateConnection();

    try {
      // Relevante Regeln finden
      const relevantRules = await this.searchRulesByContext(
        action + ' ' + context
      );

      // Compliance-Status prüfen
      const complianceChecks = await Promise.all(
        relevantRules.map(async rule => {
          const isCompliant = await this.validateRuleCompliance(
            rule,
            action,
            context
          );
          return { rule, isCompliant };
        })
      );

      const compliantRules = complianceChecks
        .filter(check => check.isCompliant)
        .map(check => check.rule);
      const violations = complianceChecks
        .filter(check => !check.isCompliant)
        .map(check => check.rule.rule_text);

      const score =
        relevantRules.length > 0
          ? (compliantRules.length / relevantRules.length) * 100
          : 100;

      return {
        is_compliant: violations.length === 0,
        applied_rules: compliantRules,
        violations,
        score: Math.round(score),
      };
    } catch (error) {
      throw error;
    }
  }

  private async validateRuleCompliance(
    rule: KIRule,
    action: string,
    context: string
  ): Promise<boolean> {
    // Vereinfachte Compliance-Prüfung
    // In der Praxis würde hier eine komplexere Logik stehen

    const actionLower = action.toLowerCase();
    const contextLower = context.toLowerCase();
    const ruleLower = rule.rule_text.toLowerCase();

    // DSGVO-Compliance
    if (rule.category === 'compliance') {
      if (ruleLower.includes('dsgvo') && actionLower.includes('formular')) {
        return (
          actionLower.includes('consent') || actionLower.includes('datenschutz')
        );
      }
      if (ruleLower.includes('cookie') && actionLower.includes('cookie')) {
        return (
          actionLower.includes('consent') || actionLower.includes('opt-out')
        );
      }
    }

    // Enterprise++ Compliance
    if (rule.category === 'enterprise') {
      if (ruleLower.includes('test') && actionLower.includes('test')) {
        return actionLower.includes('coverage') || actionLower.includes('100%');
      }
      if (ruleLower.includes('lint') && actionLower.includes('code')) {
        return (
          actionLower.includes('eslint') || actionLower.includes('prettier')
        );
      }
    }

    // Standard: Regel als erfüllt betrachten
    return true;
  }

  // =====================================================
  // Audit-Logging
  // =====================================================

  async logAuditEntry(
    action: string,
    tableName: string,
    recordId: number | null,
    userId: number | null,
    oldValues?: any,
    newValues?: any
  ): Promise<void> {
    this.validateConnection();

    try {
      await this.connection!.execute(
        `INSERT INTO ki_audit_log (action, table_name, record_id, user_id, old_values, new_values) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          action,
          tableName,
          recordId,
          userId,
          oldValues ? JSON.stringify(oldValues) : null,
          newValues ? JSON.stringify(newValues) : null,
        ]
      );
    } catch (error) {
      throw error;
    }
  }

  async getAuditLog(
    tableName?: string,
    action?: string,
    limit: number = 100
  ): Promise<any[]> {
    this.validateConnection();

    try {
      let query = 'SELECT * FROM ki_audit_log WHERE 1=1';
      const params: any[] = [];

      if (tableName) {
        query += ' AND table_name = ?';
        params.push(tableName);
      }
      if (action) {
        query += ' AND action = ?';
        params.push(action);
      }

      query += ' ORDER BY timestamp DESC LIMIT ?';
      params.push(limit);

      const [rows] = await this.connection!.execute(query, params);
      return rows as any[];
    } catch (error) {
      throw error;
    }
  }

  // =====================================================
  // Statistiken
  // =====================================================

  async getStatistics(): Promise<MemoryStatistics> {
    this.validateConnection();

    try {
      // Gesamt-Regeln
      const [totalRulesResult] = await this.connection!.execute(
        'SELECT COUNT(*) as total FROM ki_rules'
      );
      const totalRules = (totalRulesResult as { total: number }[])[0].total;

      // Aktive Regeln
      const [activeRulesResult] = await this.connection!.execute(
        'SELECT COUNT(*) as active FROM ki_rules WHERE is_active = TRUE'
      );
      const activeRules = (activeRulesResult as { active: number }[])[0].active;

      // Gesamt-Sessions
      const [totalSessionsResult] = await this.connection!.execute(
        'SELECT COUNT(*) as sessions FROM ki_memory_sessions'
      );
      const totalSessions = (totalSessionsResult as { sessions: number }[])[0]
        .sessions;

      // Compliance-Rate
      const [complianceResult] = await this.connection!.execute(
        'SELECT COUNT(*) as compliant FROM ki_memory_sessions WHERE compliance_status = TRUE'
      );
      const compliantSessions = (complianceResult as { compliant: number }[])[0]
        .compliant;
      const complianceRate =
        totalSessions > 0 ? (compliantSessions / totalSessions) * 100 : 0;

      return {
        total_rules: totalRules,
        active_rules: activeRules,
        total_sessions: totalSessions,
        compliance_rate: Math.round(complianceRate),
      };
    } catch (error) {
      throw error;
    }
  }

  // =====================================================
  // DSGVO + Enterprise++ Regeln laden
  // =====================================================

  async loadDefaultRules(): Promise<void> {
    this.validateConnection();

    try {
      // DSGVO-Regeln
      const dsgvoRules: KIRule[] = [
        {
          rule_text:
            'Alle Kontaktformulare müssen DSGVO-konform sein mit Consent-Checkbox und Datenschutzerklärung',
          category: 'compliance',
          tags: ['dsgvo', 'formular', 'consent'],
          priority: 'kritisch',
        },
        {
          rule_text:
            'Personenbezogene Daten dürfen nur mit expliziter Einwilligung verarbeitet werden',
          category: 'compliance',
          tags: ['dsgvo', 'datenschutz', 'einwilligung'],
          priority: 'kritisch',
        },
        {
          rule_text: 'Datenschutzerklärung muss auf jeder Seite verfügbar sein',
          category: 'compliance',
          tags: ['dsgvo', 'datenschutz', 'erklärung'],
          priority: 'hoch',
        },
        {
          rule_text:
            'Cookie-Consent ist für alle nicht-essentiellen Cookies erforderlich',
          category: 'compliance',
          tags: ['dsgvo', 'cookie', 'consent'],
          priority: 'hoch',
        },
      ];

      // Enterprise++ Regeln
      const enterpriseRules: KIRule[] = [
        {
          rule_text:
            'Enterprise++ Standards: 100% Test-Coverage, 0 Lint-Fehler, 0 Bundle-Size',
          category: 'enterprise',
          tags: ['quality', 'testing', 'standards'],
          priority: 'kritisch',
        },
        {
          rule_text:
            'Anti-Regelbruch-System: Keine Aktionen ohne explizite Freigabe',
          category: 'enterprise',
          tags: ['safety', 'approval', 'rules'],
          priority: 'kritisch',
        },
        {
          rule_text: 'Alle Änderungen müssen in STATUS.md dokumentiert werden',
          category: 'enterprise',
          tags: ['dokumentation', 'tracking'],
          priority: 'hoch',
        },
        {
          rule_text:
            'Strikte Datumsvalidierung: System-Zeit verwenden, niemals kopieren',
          category: 'enterprise',
          tags: ['zeit', 'validierung'],
          priority: 'hoch',
        },
      ];

      // Qualitätsregeln
      const qualityRules: KIRule[] = [
        {
          rule_text: 'WCAG 2.1 AA Konformität für alle Komponenten',
          category: 'quality',
          tags: ['accessibility', 'wcag', 'barrierefreiheit'],
          priority: 'hoch',
        },
        {
          rule_text: 'TypeScript Strict Mode für alle Dateien',
          category: 'quality',
          tags: ['typescript', 'strict', 'typing'],
          priority: 'hoch',
        },
        {
          rule_text: 'Prettier-Formatierung für konsistenten Code',
          category: 'quality',
          tags: ['formatting', 'prettier'],
          priority: 'mittel',
        },
      ];

      // Sicherheitsregeln
      const securityRules: KIRule[] = [
        {
          rule_text: 'Keine Passwörter oder API-Keys im Code speichern',
          category: 'security',
          tags: ['sicherheit', 'passwort', 'api-key'],
          priority: 'kritisch',
        },
        {
          rule_text: 'Alle externen APIs über HTTPS aufrufen',
          category: 'security',
          tags: ['sicherheit', 'https', 'ssl'],
          priority: 'hoch',
        },
        {
          rule_text: 'Input-Validierung für alle Benutzereingaben',
          category: 'security',
          tags: ['sicherheit', 'validierung', 'input'],
          priority: 'hoch',
        },
      ];

      // Alle Regeln speichern
      const allRules = [
        ...dsgvoRules,
        ...enterpriseRules,
        ...qualityRules,
        ...securityRules,
      ];

      for (const rule of allRules) {
        await this.storeRule(rule);
      }

      console.log(`✅ ${allRules.length} Standard-Regeln geladen`);
    } catch (error) {
      console.error('❌ Laden der Standard-Regeln fehlgeschlagen:', error);
      throw error;
    }
  }

  // =====================================================
  // Agenten-Integration
  // =====================================================

  async getRulesForAgent(agentType: string): Promise<KIRule[]> {
    this.validateConnection();

    try {
      let category: string;

      switch (agentType) {
        case 'compliance':
          category = 'compliance';
          break;
        case 'quality':
          category = 'quality';
          break;
        case 'security':
          category = 'security';
          break;
        case 'enterprise':
          category = 'enterprise';
          break;
        default:
          // Alle Regeln für unbekannte Agenten
          const [rows] = await this.connection!.execute(
            'SELECT * FROM ki_rules WHERE is_active = TRUE ORDER BY priority DESC'
          );
          return rows as KIRule[];
      }

      return await this.getRulesByCategory(category);
    } catch (error) {
      throw error;
    }
  }

  async validateAgentAction(
    agentType: string,
    action: string,
    context: string
  ): Promise<ComplianceResult> {
    const rules = await this.getRulesForAgent(agentType);
    const complianceResult = await this.checkCompliance(action, context);

    // Agent-spezifische Validierung
    if (agentType === 'compliance') {
      // DSGVO-spezifische Prüfungen
      if (
        action.toLowerCase().includes('formular') &&
        !action.toLowerCase().includes('consent')
      ) {
        complianceResult.is_compliant = false;
        complianceResult.violations.push(
          'DSGVO: Consent-Checkbox erforderlich'
        );
      }
    }

    if (agentType === 'enterprise') {
      // Enterprise++-spezifische Prüfungen
      if (
        action.toLowerCase().includes('test') &&
        !action.toLowerCase().includes('coverage')
      ) {
        complianceResult.is_compliant = false;
        complianceResult.violations.push(
          'Enterprise++: Test-Coverage erforderlich'
        );
      }
    }

    return complianceResult;
  }
}

// =====================================================
// Export
// =====================================================

export default MySQLMemorySystem;
