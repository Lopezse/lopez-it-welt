-- =====================================================
-- KI-Gedächtnis Schema für Lopez IT Welt
-- =====================================================
-- Erstellt: 2025-01-19
-- Zweck: Sichere MySQL-only Lösung für KI-Agenten + Gedächtnis
-- Integration: Erweitert bestehende lopez_it_welt_db
-- =====================================================

-- Datenbank verwenden (bestehende DB)
USE lopez_it_welt;

-- =====================================================
-- Tabelle: ki_rules (KI-Regeln und Compliance)
-- =====================================================
CREATE TABLE IF NOT EXISTS ki_rules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    -- Regel-Inhalt
    rule_text TEXT NOT NULL COMMENT 'Regel-Text (DSGVO, Enterprise++, etc.)',
    category VARCHAR(50) NOT NULL COMMENT 'Kategorie: compliance, enterprise, quality, security',
    tags JSON COMMENT 'Tags für bessere Kategorisierung',
    
    -- Sicherheit und Audit
    user_id INT NULL COMMENT 'Benutzer der Regel erstellt hat',
    is_active BOOLEAN DEFAULT TRUE COMMENT 'Regel aktiv/inaktiv',
    priority ENUM('niedrig', 'mittel', 'hoch', 'kritisch') DEFAULT 'mittel',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indizes für Performance
    INDEX idx_category (category),
    INDEX idx_active (is_active),
    INDEX idx_priority (priority),
    INDEX idx_created (created_at),
    
    -- Volltext-Suche für Regel-Text
    FULLTEXT(rule_text)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Tabelle: ki_memory_sessions (KI-Session-Gedächtnis)
-- =====================================================
CREATE TABLE IF NOT EXISTS ki_memory_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    -- Session-Verbindung
    session_id VARCHAR(100) NOT NULL COMMENT 'Verbindung zu work_sessions',
    context TEXT NOT NULL COMMENT 'Was wurde gemacht',
    
    -- Gedächtnis-Daten
    rules_used JSON COMMENT 'Welche Regeln wurden angewendet',
    compliance_status BOOLEAN DEFAULT TRUE COMMENT 'Compliance-Status',
    compliance_notes TEXT COMMENT 'Compliance-Notizen',
    
    -- Lernsystem
    lessons_learned TEXT COMMENT 'Was wurde gelernt',
    next_actions JSON COMMENT 'Nächste Aktionen',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Indizes
    INDEX idx_session (session_id),
    INDEX idx_compliance (compliance_status),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Tabelle: ki_audit_log (Sicherheits-Audit)
-- =====================================================
CREATE TABLE IF NOT EXISTS ki_audit_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    -- Audit-Informationen
    action VARCHAR(50) NOT NULL COMMENT 'Aktion: create, read, update, delete',
    table_name VARCHAR(50) NOT NULL COMMENT 'Betroffene Tabelle',
    record_id INT NULL COMMENT 'Betroffener Datensatz',
    user_id INT NULL COMMENT 'Benutzer der Aktion',
    
    -- Details
    old_values JSON COMMENT 'Alte Werte (bei Update/Delete)',
    new_values JSON COMMENT 'Neue Werte (bei Create/Update)',
    ip_address VARCHAR(45) COMMENT 'IP-Adresse',
    
    -- Timestamps
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Indizes
    INDEX idx_action (action),
    INDEX idx_table (table_name),
    INDEX idx_user (user_id),
    INDEX idx_timestamp (timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Trigger: Automatisches Audit-Logging
-- =====================================================

-- Trigger für ki_rules
DELIMITER //
CREATE TRIGGER ki_rules_audit_insert
AFTER INSERT ON ki_rules
FOR EACH ROW
BEGIN
    INSERT INTO ki_audit_log (action, table_name, record_id, user_id, new_values)
    VALUES ('INSERT', 'ki_rules', NEW.id, NEW.user_id, JSON_OBJECT('rule_text', NEW.rule_text, 'category', NEW.category));
END//

CREATE TRIGGER ki_rules_audit_update
AFTER UPDATE ON ki_rules
FOR EACH ROW
BEGIN
    INSERT INTO ki_audit_log (action, table_name, record_id, user_id, old_values, new_values)
    VALUES ('UPDATE', 'ki_rules', NEW.id, NEW.user_id, 
            JSON_OBJECT('rule_text', OLD.rule_text, 'category', OLD.category),
            JSON_OBJECT('rule_text', NEW.rule_text, 'category', NEW.category));
END//

CREATE TRIGGER ki_rules_audit_delete
AFTER DELETE ON ki_rules
FOR EACH ROW
BEGIN
    INSERT INTO ki_audit_log (action, table_name, record_id, user_id, old_values)
    VALUES ('DELETE', 'ki_rules', OLD.id, OLD.user_id, JSON_OBJECT('rule_text', OLD.rule_text, 'category', OLD.category));
END//
DELIMITER ;

-- =====================================================
-- Erste Regeln einfügen (DSGVO + Enterprise++)
-- =====================================================
INSERT INTO ki_rules (rule_text, category, tags, priority) VALUES
-- DSGVO Compliance
('Alle Kontaktformulare müssen DSGVO-konform sein mit Consent-Checkbox und Datenschutzerklärung', 'compliance', '["dsgvo", "formular", "consent"]', 'kritisch'),
('Personenbezogene Daten dürfen nur mit expliziter Einwilligung verarbeitet werden', 'compliance', '["dsgvo", "datenschutz", "einwilligung"]', 'kritisch'),
('Datenschutzerklärung muss auf jeder Seite verfügbar sein', 'compliance', '["dsgvo", "datenschutz", "erklärung"]', 'hoch'),

-- Enterprise++ Standards
('Enterprise++ Standards: 100% Test-Coverage, 0 Lint-Fehler, 0 Bundle-Size', 'enterprise', '["quality", "testing", "standards"]', 'kritisch'),
('Anti-Regelbruch-System: Keine Aktionen ohne explizite Freigabe', 'enterprise', '["safety", "approval", "rules"]', 'kritisch'),
('Alle Änderungen müssen in STATUS.md dokumentiert werden', 'enterprise', '["dokumentation", "tracking"]', 'hoch'),
('Strikte Datumsvalidierung: System-Zeit verwenden, niemals kopieren', 'enterprise', '["zeit", "validierung"]', 'hoch'),

-- Qualitätsstandards
('WCAG 2.1 AA Konformität für alle Komponenten', 'quality', '["accessibility", "wcag", "barrierefreiheit"]', 'hoch'),
('TypeScript Strict Mode für alle Dateien', 'quality', '["typescript", "strict", "typing"]', 'hoch'),
('Prettier-Formatierung für konsistenten Code', 'quality', '["formatting", "prettier"]', 'mittel'),

-- Sicherheit
('Keine Passwörter oder API-Keys im Code speichern', 'security', '["sicherheit", "passwort", "api-key"]', 'kritisch'),
('Alle externen APIs über HTTPS aufrufen', 'security', '["sicherheit", "https", "ssl"]', 'hoch'),
('Input-Validierung für alle Benutzereingaben', 'security', '["sicherheit", "validierung", "input"]', 'hoch');

-- =====================================================
-- Views für einfache Abfragen
-- =====================================================

-- Aktive Regeln nach Kategorie
CREATE VIEW v_active_rules AS
SELECT id, rule_text, category, priority, created_at
FROM ki_rules 
WHERE is_active = TRUE
ORDER BY priority DESC, created_at DESC;

-- Compliance-Status aller Sessions
CREATE VIEW v_compliance_status AS
SELECT 
    ws.id as session_id,
    ws.beschreibung,
    ws.status,
    kms.compliance_status,
    kms.compliance_notes,
    kms.created_at
FROM work_sessions ws
LEFT JOIN ki_memory_sessions kms ON ws.id = kms.session_id
ORDER BY ws.start_time DESC;

-- =====================================================
-- Stored Procedures für häufige Operationen
-- =====================================================

-- Regel nach Kontext suchen
DELIMITER //
CREATE PROCEDURE SearchRulesByContext(IN search_context TEXT)
BEGIN
    SELECT rule_text, category, priority
    FROM ki_rules 
    WHERE is_active = TRUE 
    AND MATCH(rule_text) AGAINST(search_context IN NATURAL LANGUAGE MODE)
    ORDER BY priority DESC, created_at DESC
    LIMIT 10;
END//

-- Compliance-Status prüfen
CREATE PROCEDURE CheckCompliance(IN action_text TEXT, OUT is_compliant BOOLEAN)
BEGIN
    DECLARE rule_count INT;
    
    SELECT COUNT(*) INTO rule_count
    FROM ki_rules 
    WHERE is_active = TRUE 
    AND category = 'compliance'
    AND MATCH(rule_text) AGAINST(action_text IN NATURAL LANGUAGE MODE);
    
    SET is_compliant = (rule_count > 0);
END//
DELIMITER ;

-- =====================================================
-- Kommentare und Dokumentation
-- =====================================================
-- COMMENT ON TABLE ki_rules IS 'KI-Regeln und Compliance-Vorgaben für Lopez IT Welt';
-- COMMENT ON TABLE ki_memory_sessions IS 'Gedächtnis für KI-Sessions und Lernsystem';
-- COMMENT ON TABLE ki_audit_log IS 'Sicherheits-Audit für alle KI-Operationen';

-- =====================================================
-- Status: Schema erfolgreich erstellt
-- =====================================================
SELECT 'KI-Gedächtnis Schema erfolgreich erstellt!' as status; 