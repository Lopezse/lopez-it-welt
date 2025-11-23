-- =====================================================
-- ENTERPRISE++ AUDIT-SYSTEM - LOPEZ IT WELT
-- =====================================================
-- Erstellt: 2025-01-19
-- Zweck: IBM/SAP-Level Audit-System für Compliance & Sicherheit
-- Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
-- =====================================================

USE lopez_erp;

-- =====================================================
-- 1. ERWEITERTE AUDIT-LOGS TABELLE
-- =====================================================

-- Bestehende Tabelle erweitern
ALTER TABLE enterprise_audit_logs 
ADD COLUMN tenant_id VARCHAR(36) NULL COMMENT 'Multi-Tenant Support',
ADD COLUMN session_id VARCHAR(64) NULL COMMENT 'Session-ID für parallele Logins',
ADD COLUMN old_value LONGTEXT NULL COMMENT 'Vorheriger Wert (bei Updates)',
ADD COLUMN new_value LONGTEXT NULL COMMENT 'Neuer Wert (bei Updates)',
ADD COLUMN severity ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') DEFAULT 'MEDIUM' COMMENT 'Schweregrad der Aktion',
ADD COLUMN compliance_category ENUM('DSGVO', 'ISO27001', 'SOC2', 'HIPAA', 'SOX', 'SECURITY', 'ACCESS') DEFAULT 'SECURITY' COMMENT 'Compliance-Kategorie',
ADD COLUMN risk_score INT DEFAULT 0 COMMENT 'Risiko-Score 0-100',
ADD COLUMN geolocation JSON NULL COMMENT 'Geografische Daten (Land, Stadt)',
ADD COLUMN device_fingerprint VARCHAR(255) NULL COMMENT 'Geräte-Fingerprint',
ADD COLUMN correlation_id VARCHAR(36) NULL COMMENT 'Korrelations-ID für zusammengehörige Events';

-- Indizes für Performance optimieren
CREATE INDEX idx_tenant ON enterprise_audit_logs(tenant_id);
CREATE INDEX idx_session ON enterprise_audit_logs(session_id);
CREATE INDEX idx_severity ON enterprise_audit_logs(severity);
CREATE INDEX idx_compliance ON enterprise_audit_logs(compliance_category);
CREATE INDEX idx_risk_score ON enterprise_audit_logs(risk_score);
CREATE INDEX idx_correlation ON enterprise_audit_logs(correlation_id);
CREATE INDEX idx_created_date ON enterprise_audit_logs(DATE(created_at));

-- =====================================================
-- 2. AUDIT-KATEGORIEN & AKTIONEN
-- =====================================================

CREATE TABLE IF NOT EXISTS enterprise_audit_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_code VARCHAR(50) UNIQUE NOT NULL,
    category_name VARCHAR(255) NOT NULL,
    description TEXT,
    severity_default ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') DEFAULT 'MEDIUM',
    compliance_required BOOLEAN DEFAULT FALSE,
    retention_days INT DEFAULT 2555, -- 7 Jahre Standard
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_code (category_code),
    INDEX idx_active (is_active)
);

-- Standard-Kategorien einfügen
INSERT INTO enterprise_audit_categories (category_code, category_name, description, severity_default, compliance_required, retention_days) VALUES
('USER_LOGIN', 'Benutzer-Anmeldung', 'An- und Abmeldungen von Benutzern', 'MEDIUM', TRUE, 2555),
('USER_LOGOUT', 'Benutzer-Abmeldung', 'Abmeldungen von Benutzern', 'LOW', FALSE, 2555),
('USER_CREATE', 'Benutzer erstellen', 'Neue Benutzer angelegt', 'HIGH', TRUE, 2555),
('USER_UPDATE', 'Benutzer bearbeiten', 'Benutzerdaten geändert', 'HIGH', TRUE, 2555),
('USER_DELETE', 'Benutzer löschen', 'Benutzer gelöscht', 'CRITICAL', TRUE, 2555),
('ROLE_ASSIGN', 'Rolle zuweisen', 'Rollen zugewiesen/entfernt', 'HIGH', TRUE, 2555),
('PERMISSION_CHANGE', 'Berechtigung ändern', 'Berechtigungen geändert', 'CRITICAL', TRUE, 2555),
('DATA_ACCESS', 'Daten-Zugriff', 'Zugriff auf sensible Daten', 'MEDIUM', TRUE, 2555),
('DATA_EXPORT', 'Daten-Export', 'Daten exportiert', 'HIGH', TRUE, 2555),
('SYSTEM_CONFIG', 'System-Konfiguration', 'System-Einstellungen geändert', 'HIGH', TRUE, 2555),
('SECURITY_EVENT', 'Sicherheits-Ereignis', 'Sicherheitsrelevante Aktionen', 'CRITICAL', TRUE, 2555),
('COMPLIANCE_CHECK', 'Compliance-Prüfung', 'Compliance-Überprüfungen', 'MEDIUM', TRUE, 2555);

-- =====================================================
-- 3. AUDIT-FILTER & SUCHE
-- =====================================================

CREATE TABLE IF NOT EXISTS enterprise_audit_filters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    filter_name VARCHAR(255) NOT NULL,
    filter_description TEXT,
    filter_criteria JSON NOT NULL,
    created_by VARCHAR(36) NOT NULL,
    is_shared BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_created_by (created_by),
    INDEX idx_shared (is_shared),
    INDEX idx_active (is_active)
);

-- =====================================================
-- 4. AUDIT-EXPORTS (für Compliance)
-- =====================================================

CREATE TABLE IF NOT EXISTS enterprise_audit_exports (
    id VARCHAR(36) PRIMARY KEY,
    export_name VARCHAR(255) NOT NULL,
    export_type ENUM('CSV', 'JSON', 'XML', 'PDF') NOT NULL,
    filter_criteria JSON NOT NULL,
    file_path VARCHAR(500) NULL,
    file_size_bytes BIGINT DEFAULT 0,
    record_count INT DEFAULT 0,
    status ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED') DEFAULT 'PENDING',
    created_by VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    
    INDEX idx_created_by (created_by),
    INDEX idx_status (status),
    INDEX idx_created (created_at),
    INDEX idx_expires (expires_at)
);

-- =====================================================
-- 5. AUDIT-ALERTS (für kritische Events)
-- =====================================================

CREATE TABLE IF NOT EXISTS enterprise_audit_alerts (
    id VARCHAR(36) PRIMARY KEY,
    alert_name VARCHAR(255) NOT NULL,
    alert_conditions JSON NOT NULL,
    alert_severity ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') NOT NULL,
    notification_methods JSON NOT NULL, -- ['email', 'sms', 'webhook']
    notification_recipients JSON NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_triggered TIMESTAMP NULL,
    trigger_count INT DEFAULT 0,
    created_by VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_severity (alert_severity),
    INDEX idx_active (is_active),
    INDEX idx_created_by (created_by)
);

-- =====================================================
-- 6. AUDIT-STATISTIKEN (für Dashboard)
-- =====================================================

CREATE TABLE IF NOT EXISTS enterprise_audit_stats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    stat_date DATE NOT NULL,
    stat_hour TINYINT NOT NULL,
    total_events INT DEFAULT 0,
    critical_events INT DEFAULT 0,
    high_events INT DEFAULT 0,
    medium_events INT DEFAULT 0,
    low_events INT DEFAULT 0,
    unique_users INT DEFAULT 0,
    unique_sessions INT DEFAULT 0,
    failed_logins INT DEFAULT 0,
    data_exports INT DEFAULT 0,
    security_events INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_date_hour (stat_date, stat_hour),
    INDEX idx_date (stat_date),
    INDEX idx_hour (stat_hour)
);

-- =====================================================
-- 7. VIEWS FÜR EINFACHE ABFRAGEN
-- =====================================================

-- View für Audit-Logs mit Benutzer-Informationen
CREATE OR REPLACE VIEW v_audit_logs_detailed AS
SELECT 
    al.id,
    al.user_id,
    u.first_name,
    u.last_name,
    u.email,
    al.session_id,
    al.tenant_id,
    al.action,
    al.resource_type,
    al.resource_id,
    al.old_value,
    al.new_value,
    al.severity,
    al.compliance_category,
    al.risk_score,
    al.ip_address,
    al.user_agent,
    al.request_method,
    al.request_url,
    al.response_status,
    al.execution_time_ms,
    al.geolocation,
    al.device_fingerprint,
    al.correlation_id,
    al.created_at
FROM enterprise_audit_logs al
LEFT JOIN lopez_core_users u ON al.user_id = u.id;

-- View für Sicherheits-Events
CREATE OR REPLACE VIEW v_security_events AS
SELECT 
    al.*,
    u.first_name,
    u.last_name,
    u.email
FROM enterprise_audit_logs al
LEFT JOIN lopez_core_users u ON al.user_id = u.id
WHERE al.compliance_category = 'SECURITY' 
   OR al.severity IN ('HIGH', 'CRITICAL')
   OR al.action LIKE '%LOGIN%'
   OR al.action LIKE '%PERMISSION%'
   OR al.action LIKE '%DELETE%';

-- View für Compliance-Events
CREATE OR REPLACE VIEW v_compliance_events AS
SELECT 
    al.*,
    u.first_name,
    u.last_name,
    u.email
FROM enterprise_audit_logs al
LEFT JOIN lopez_core_users u ON al.user_id = u.id
WHERE al.compliance_category IN ('DSGVO', 'ISO27001', 'SOC2', 'HIPAA', 'SOX')
   OR al.compliance_required = TRUE;

-- =====================================================
-- 8. STORED PROCEDURES FÜR AUDIT-OPERATIONEN
-- =====================================================

DELIMITER //

-- Procedure: Audit-Event loggen
CREATE PROCEDURE sp_log_audit_event(
    IN p_user_id VARCHAR(36),
    IN p_session_id VARCHAR(64),
    IN p_tenant_id VARCHAR(36),
    IN p_action VARCHAR(100),
    IN p_resource_type VARCHAR(50),
    IN p_resource_id VARCHAR(36),
    IN p_old_value LONGTEXT,
    IN p_new_value LONGTEXT,
    IN p_severity ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'),
    IN p_compliance_category ENUM('DSGVO', 'ISO27001', 'SOC2', 'HIPAA', 'SOX', 'SECURITY', 'ACCESS'),
    IN p_ip_address VARCHAR(45),
    IN p_user_agent TEXT,
    IN p_request_method VARCHAR(10),
    IN p_request_url TEXT,
    IN p_response_status INT,
    IN p_execution_time_ms INT,
    IN p_correlation_id VARCHAR(36)
)
BEGIN
    DECLARE v_audit_id VARCHAR(36);
    DECLARE v_risk_score INT DEFAULT 0;
    
    -- Audit-ID generieren
    SET v_audit_id = CONCAT('audit_', UNIX_TIMESTAMP(), '_', SUBSTRING(MD5(RAND()), 1, 8));
    
    -- Risiko-Score berechnen
    SET v_risk_score = CASE 
        WHEN p_severity = 'CRITICAL' THEN 90
        WHEN p_severity = 'HIGH' THEN 70
        WHEN p_severity = 'MEDIUM' THEN 40
        WHEN p_severity = 'LOW' THEN 10
        ELSE 0
    END;
    
    -- Audit-Event einfügen
    INSERT INTO enterprise_audit_logs (
        id, user_id, session_id, tenant_id, action, resource_type, resource_id,
        old_value, new_value, severity, compliance_category, risk_score,
        ip_address, user_agent, request_method, request_url, response_status,
        execution_time_ms, correlation_id, created_at
    ) VALUES (
        v_audit_id, p_user_id, p_session_id, p_tenant_id, p_action, p_resource_type, p_resource_id,
        p_old_value, p_new_value, p_severity, p_compliance_category, v_risk_score,
        p_ip_address, p_user_agent, p_request_method, p_request_url, p_response_status,
        p_execution_time_ms, p_correlation_id, NOW()
    );
    
    -- Statistiken aktualisieren
    INSERT INTO enterprise_audit_stats (
        stat_date, stat_hour, total_events, critical_events, high_events, medium_events, low_events
    ) VALUES (
        CURDATE(), HOUR(NOW()), 1,
        CASE WHEN p_severity = 'CRITICAL' THEN 1 ELSE 0 END,
        CASE WHEN p_severity = 'HIGH' THEN 1 ELSE 0 END,
        CASE WHEN p_severity = 'MEDIUM' THEN 1 ELSE 0 END,
        CASE WHEN p_severity = 'LOW' THEN 1 ELSE 0 END
    ) ON DUPLICATE KEY UPDATE
        total_events = total_events + 1,
        critical_events = critical_events + (CASE WHEN p_severity = 'CRITICAL' THEN 1 ELSE 0 END),
        high_events = high_events + (CASE WHEN p_severity = 'HIGH' THEN 1 ELSE 0 END),
        medium_events = medium_events + (CASE WHEN p_severity = 'MEDIUM' THEN 1 ELSE 0 END),
        low_events = low_events + (CASE WHEN p_severity = 'LOW' THEN 1 ELSE 0 END);
END //

-- Procedure: Audit-Logs löschen (nur für Compliance)
CREATE PROCEDURE sp_cleanup_audit_logs(IN p_days_to_keep INT)
BEGIN
    DECLARE v_deleted_count INT DEFAULT 0;
    
    -- Alte Logs löschen (nur nach Compliance-Regeln)
    DELETE FROM enterprise_audit_logs 
    WHERE created_at < DATE_SUB(NOW(), INTERVAL p_days_to_keep DAY)
      AND severity IN ('LOW', 'MEDIUM'); -- Kritische Logs bleiben länger
    
    SET v_deleted_count = ROW_COUNT();
    
    -- Log der Bereinigung
    INSERT INTO enterprise_audit_logs (
        id, action, resource_type, severity, compliance_category,
        new_value, ip_address, created_at
    ) VALUES (
        CONCAT('cleanup_', UNIX_TIMESTAMP()),
        'AUDIT_CLEANUP',
        'SYSTEM',
        'LOW',
        'SECURITY',
        CONCAT('Gelöscht: ', v_deleted_count, ' alte Audit-Logs'),
        '127.0.0.1',
        NOW()
    );
    
    SELECT v_deleted_count as deleted_records;
END //

DELIMITER ;

-- =====================================================
-- 9. TRIGGER FÜR AUTOMATISCHE AUDIT-LOGGING
-- =====================================================

-- Trigger für Benutzer-Änderungen
DELIMITER //
CREATE TRIGGER tr_users_audit_update
AFTER UPDATE ON lopez_core_users
FOR EACH ROW
BEGIN
    IF OLD.first_name != NEW.first_name OR OLD.last_name != NEW.last_name OR OLD.email != NEW.email THEN
        CALL sp_log_audit_event(
            NEW.id,
            NULL, -- session_id
            NULL, -- tenant_id
            'USER_UPDATE',
            'lopez_core_users',
            NEW.id,
            JSON_OBJECT('first_name', OLD.first_name, 'last_name', OLD.last_name, 'email', OLD.email),
            JSON_OBJECT('first_name', NEW.first_name, 'last_name', NEW.last_name, 'email', NEW.email),
            'HIGH',
            'DSGVO',
            '127.0.0.1',
            'SYSTEM_TRIGGER',
            'UPDATE',
            '/admin/users',
            200,
            0,
            NULL
        );
    END IF;
END //
DELIMITER ;

-- =====================================================
-- 10. INITIAL-DATEN FÜR DEMO
-- =====================================================

-- Demo-Audit-Events einfügen
INSERT INTO enterprise_audit_logs (
    id, user_id, action, resource_type, severity, compliance_category,
    ip_address, user_agent, request_method, request_url, response_status,
    created_at
) VALUES 
('audit_demo_1', 'admin_user', 'USER_LOGIN', 'authentication', 'MEDIUM', 'SECURITY', 
 '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'POST', '/api/auth/login', 200, NOW() - INTERVAL 1 HOUR),
('audit_demo_2', 'admin_user', 'USER_CREATE', 'lopez_core_users', 'HIGH', 'DSGVO',
 '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'POST', '/api/admin/users', 201, NOW() - INTERVAL 30 MINUTE),
('audit_demo_3', 'admin_user', 'PERMISSION_CHANGE', 'lopez_core_roles', 'CRITICAL', 'SECURITY',
 '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'PUT', '/api/admin/roles', 200, NOW() - INTERVAL 15 MINUTE);

-- =====================================================
-- FERTIG: ENTERPRISE++ AUDIT-SYSTEM
-- =====================================================

