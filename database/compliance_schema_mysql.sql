-- =====================================================
-- Compliance Schema für Lopez IT Welt
-- =====================================================
-- Erstellt: 2025-07-02
-- Zweck: Zentrale Verwaltung aller Compliance-Regeln
-- =====================================================

-- Datenbank erstellen
CREATE DATABASE IF NOT EXISTS lopez_it_welt_compliance;
USE lopez_it_welt_compliance;

-- =====================================================
-- TABELLEN FÜR COMPLIANCE-MANAGEMENT
-- =====================================================

-- Policies Tabelle (Unternehmensrichtlinien)
CREATE TABLE IF NOT EXISTS policies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    key_title VARCHAR(255) NOT NULL UNIQUE,
    category VARCHAR(100) NOT NULL,
    content LONGTEXT NOT NULL,
    source_file VARCHAR(500),
    enforced BOOLEAN DEFAULT TRUE,
    priority ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') DEFAULT 'MEDIUM',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(100) DEFAULT 'system',
    version VARCHAR(20) DEFAULT '1.0',
    INDEX idx_category (category),
    INDEX idx_enforced (enforced),
    INDEX idx_priority (priority),
    INDEX idx_created_at (created_at)
);

-- Laws Tabelle (Gesetze und rechtliche Vorgaben)
CREATE TABLE IF NOT EXISTS laws (
    id INT AUTO_INCREMENT PRIMARY KEY,
    key_title VARCHAR(255) NOT NULL UNIQUE,
    category VARCHAR(100) NOT NULL,
    content LONGTEXT NOT NULL,
    source_file VARCHAR(500),
    enforced BOOLEAN DEFAULT TRUE,
    priority ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') DEFAULT 'HIGH',
    jurisdiction VARCHAR(100) DEFAULT 'DE',
    law_type ENUM('GDPR', 'DSGVO', 'TMG', 'UWG', 'OTHER') DEFAULT 'OTHER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(100) DEFAULT 'system',
    version VARCHAR(20) DEFAULT '1.0',
    INDEX idx_category (category),
    INDEX idx_enforced (enforced),
    INDEX idx_jurisdiction (jurisdiction),
    INDEX idx_law_type (law_type)
);

-- CI Rules Tabelle (Continuous Integration Regeln)
CREATE TABLE IF NOT EXISTS ci_rules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    key_title VARCHAR(255) NOT NULL UNIQUE,
    category VARCHAR(100) NOT NULL,
    content LONGTEXT NOT NULL,
    source_file VARCHAR(500),
    enforced BOOLEAN DEFAULT TRUE,
    priority ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') DEFAULT 'MEDIUM',
    rule_type ENUM('CODE_QUALITY', 'SECURITY', 'PERFORMANCE', 'ACCESSIBILITY', 'SEO', 'TESTING', 'DEPLOYMENT', 'OTHER') DEFAULT 'OTHER',
    automated_check BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(100) DEFAULT 'system',
    version VARCHAR(20) DEFAULT '1.0',
    INDEX idx_category (category),
    INDEX idx_enforced (enforced),
    INDEX idx_rule_type (rule_type),
    INDEX idx_automated_check (automated_check)
);

-- Compliance Audit Log
CREATE TABLE IF NOT EXISTS compliance_audit_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rule_id INT NOT NULL,
    rule_type ENUM('POLICY', 'LAW', 'CI_RULE') NOT NULL,
    check_type VARCHAR(100) NOT NULL,
    status ENUM('PASS', 'FAIL', 'WARNING', 'INFO') NOT NULL,
    message TEXT,
    details JSON,
    checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    checked_by VARCHAR(100) DEFAULT 'system',
    INDEX idx_rule_id (rule_id),
    INDEX idx_rule_type (rule_type),
    INDEX idx_status (status),
    INDEX idx_checked_at (checked_at)
);

-- Agent Activity Log
CREATE TABLE IF NOT EXISTS agent_activity_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    agent_name VARCHAR(100) NOT NULL,
    activity_type VARCHAR(100) NOT NULL,
    description TEXT,
    status ENUM('SUCCESS', 'FAILURE', 'WARNING', 'INFO') NOT NULL,
    execution_time_ms INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    details JSON,
    INDEX idx_agent_name (agent_name),
    INDEX idx_activity_type (activity_type),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- =====================================================
-- VIEWS FÜR EINFACHE ABFRAGEN
-- =====================================================

-- View für alle aktiven Regeln
CREATE OR REPLACE VIEW active_rules AS
SELECT 'POLICY' as rule_type, id, key_title, category, priority, enforced, created_at
FROM policies WHERE enforced = TRUE
UNION ALL
SELECT 'LAW' as rule_type, id, key_title, category, priority, enforced, created_at
FROM laws WHERE enforced = TRUE
UNION ALL
SELECT 'CI_RULE' as rule_type, id, key_title, category, priority, enforced, created_at
FROM ci_rules WHERE enforced = TRUE;

-- View für Compliance-Status
CREATE OR REPLACE VIEW compliance_status AS
SELECT 
    'POLICY' as rule_type,
    COUNT(*) as total_rules,
    SUM(CASE WHEN enforced = TRUE THEN 1 ELSE 0 END) as active_rules,
    SUM(CASE WHEN enforced = FALSE THEN 1 ELSE 0 END) as inactive_rules
FROM policies
UNION ALL
SELECT 
    'LAW' as rule_type,
    COUNT(*) as total_rules,
    SUM(CASE WHEN enforced = TRUE THEN 1 ELSE 0 END) as active_rules,
    SUM(CASE WHEN enforced = FALSE THEN 1 ELSE 0 END) as inactive_rules
FROM laws
UNION ALL
SELECT 
    'CI_RULE' as rule_type,
    COUNT(*) as total_rules,
    SUM(CASE WHEN enforced = TRUE THEN 1 ELSE 0 END) as active_rules,
    SUM(CASE WHEN enforced = FALSE THEN 1 ELSE 0 END) as inactive_rules
FROM ci_rules;

-- =====================================================
-- STORED PROCEDURES FÜR AGENTEN-OPERATIONEN
-- =====================================================

DELIMITER //

-- Procedure: Regeln nach Kategorie abrufen
CREATE PROCEDURE GetRulesByCategory(IN rule_category VARCHAR(100))
BEGIN
    SELECT 'POLICY' as rule_type, id, key_title, category, content, priority, enforced
    FROM policies 
    WHERE category = rule_category AND enforced = TRUE
    UNION ALL
    SELECT 'LAW' as rule_type, id, key_title, category, content, priority, enforced
    FROM laws 
    WHERE category = rule_category AND enforced = TRUE
    UNION ALL
    SELECT 'CI_RULE' as rule_type, id, key_title, category, content, priority, enforced
    FROM ci_rules 
    WHERE category = rule_category AND enforced = TRUE;
END //

-- Procedure: Compliance-Check protokollieren
CREATE PROCEDURE LogComplianceCheck(
    IN p_rule_id INT,
    IN p_rule_type ENUM('POLICY', 'LAW', 'CI_RULE'),
    IN p_check_type VARCHAR(100),
    IN p_status ENUM('PASS', 'FAIL', 'WARNING', 'INFO'),
    IN p_message TEXT,
    IN p_details JSON
)
BEGIN
    INSERT INTO compliance_audit_log (rule_id, rule_type, check_type, status, message, details)
    VALUES (p_rule_id, p_rule_type, p_check_type, p_status, p_message, p_details);
END //

-- Procedure: Agent-Aktivität protokollieren
CREATE PROCEDURE LogAgentActivity(
    IN p_agent_name VARCHAR(100),
    IN p_activity_type VARCHAR(100),
    IN p_description TEXT,
    IN p_status ENUM('SUCCESS', 'FAILURE', 'WARNING', 'INFO'),
    IN p_execution_time_ms INT,
    IN p_details JSON
)
BEGIN
    INSERT INTO agent_activity_log (agent_name, activity_type, description, status, execution_time_ms, details)
    VALUES (p_agent_name, p_activity_type, p_description, p_status, p_execution_time_ms, p_details);
END //

DELIMITER ;

-- =====================================================
-- BEISPIEL-DATEN FÜR TESTING
-- =====================================================

-- Beispiel-Policy
INSERT INTO policies (key_title, category, content, source_file, priority) VALUES
('Datenschutz-Policy', 'DATENSCHUTZ', 'Alle personenbezogenen Daten müssen verschlüsselt gespeichert werden.', 'docs/datenschutz.md', 'HIGH');

-- Beispiel-Gesetz
INSERT INTO laws (key_title, category, content, source_file, jurisdiction, law_type) VALUES
('DSGVO-Compliance', 'DATENSCHUTZ', 'Einhaltung der DSGVO-Richtlinien für alle Datenverarbeitungen.', 'docs/compliance.md', 'DE', 'DSGVO');

-- Beispiel-CI-Regel
INSERT INTO ci_rules (key_title, category, content, source_file, rule_type, automated_check) VALUES
('Code-Qualität', 'QUALITÄT', 'Alle Code-Änderungen müssen Tests bestehen.', 'docs/development-guidelines.md', 'CODE_QUALITY', TRUE);

-- =====================================================
-- BERECHTIGUNGEN FÜR AGENTEN
-- =====================================================

-- Agent-Benutzer erstellen (falls nicht vorhanden)
-- CREATE USER IF NOT EXISTS 'agent_user'@'localhost' IDENTIFIED BY 'secure_password';

-- Berechtigungen für Agenten
-- GRANT SELECT, INSERT, UPDATE ON lopez_it_welt_compliance.* TO 'agent_user'@'localhost';
-- GRANT EXECUTE ON PROCEDURE lopez_it_welt_compliance.* TO 'agent_user'@'localhost';

-- =====================================================
-- INDEXES FÜR PERFORMANCE
-- =====================================================

-- Zusätzliche Indexes für bessere Performance
CREATE INDEX idx_policies_key_title ON policies(key_title);
CREATE INDEX idx_laws_key_title ON laws(key_title);
CREATE INDEX idx_ci_rules_key_title ON ci_rules(key_title);

-- =====================================================
-- TRIGGER FÜR AUTOMATISCHE UPDATES
-- =====================================================

DELIMITER //

-- Trigger für updated_at bei Policies
CREATE TRIGGER policies_update_trigger
BEFORE UPDATE ON policies
FOR EACH ROW
SET NEW.updated_at = CURRENT_TIMESTAMP;

-- Trigger für updated_at bei Laws
CREATE TRIGGER laws_update_trigger
BEFORE UPDATE ON laws
FOR EACH ROW
SET NEW.updated_at = CURRENT_TIMESTAMP;

-- Trigger für updated_at bei CI Rules
CREATE TRIGGER ci_rules_update_trigger
BEFORE UPDATE ON ci_rules
FOR EACH ROW
SET NEW.updated_at = CURRENT_TIMESTAMP;

DELIMITER ;

-- =====================================================
-- FINALISIERUNG
-- =====================================================

-- Status anzeigen
SELECT 'Compliance Schema erfolgreich erstellt!' as status;
SELECT COUNT(*) as total_tables FROM information_schema.tables WHERE table_schema = 'lopez_it_welt_compliance'; 