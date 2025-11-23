-- =====================================================
-- LOPEZ ERP KONTAKT-SCHEMA - LOPEZ IT WELT
-- =====================================================
-- Erstellt: 2025-01-19
-- Zweck: Kontakt-Nachrichten nach lopez_erp Namenskonvention
-- Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
-- =====================================================

-- Datenbank erstellen falls nicht vorhanden
CREATE DATABASE IF NOT EXISTS lopez_erp
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE lopez_erp;

-- =====================================================
-- BUSINESS MODULE - KONTAKT-NACHRICHTEN
-- =====================================================

-- Tabelle für Kontakt-Nachrichten (nach Namenskonvention: lopez_business_contact_messages)
CREATE TABLE IF NOT EXISTS lopez_business_contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    company VARCHAR(255),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('neu', 'in_bearbeitung', 'erledigt', 'archiviert') DEFAULT 'neu',
    priority ENUM('niedrig', 'normal', 'hoch', 'dringend') DEFAULT 'normal',
    assigned_to VARCHAR(255), -- Zuweisung an Mitarbeiter/Team
    response_message TEXT,    -- Antwortnachricht an den Kunden
    response_sent_at TIMESTAMP,
    response_sent_by VARCHAR(255),
    ip_address VARCHAR(45),
    user_agent TEXT,
    referrer TEXT,
    is_spam BOOLEAN DEFAULT FALSE,
    spam_score DECIMAL(3,2),
    tags JSON, -- Für flexible Markierungen
    notes TEXT, -- Interne Notizen
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_status (status),
    INDEX idx_priority (priority),
    INDEX idx_created_at (created_at),
    INDEX idx_email (email),
    INDEX idx_is_spam (is_spam)
);

-- Tabelle für Kommentare zu Kontakt-Nachrichten
CREATE TABLE IF NOT EXISTS lopez_business_contact_comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    message_id INT NOT NULL,
    comment TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT TRUE, -- TRUE für interne Notizen, FALSE für Kundenantworten
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255), -- Wer den Kommentar hinzugefügt hat
    FOREIGN KEY (message_id) REFERENCES lopez_business_contact_messages(id) ON DELETE CASCADE,
    
    INDEX idx_message_id (message_id),
    INDEX idx_created_at (created_at)
);

-- Tabelle für Anhänge zu Kontakt-Nachrichten
CREATE TABLE IF NOT EXISTS lopez_business_contact_attachments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    message_id INT NOT NULL,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255),
    file_size INT, -- Größe in Bytes
    mime_type VARCHAR(255),
    file_path VARCHAR(255), -- Pfad zum gespeicherten Anhang
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (message_id) REFERENCES lopez_business_contact_messages(id) ON DELETE CASCADE,
    
    INDEX idx_message_id (message_id),
    INDEX idx_is_active (is_active)
);

-- View für schnelle Statistiken (optional, aber nützlich)
CREATE OR REPLACE VIEW lopez_business_contact_stats AS
SELECT
    COUNT(*) AS total_messages,
    COUNT(CASE WHEN status = 'neu' THEN 1 END) AS new_messages,
    COUNT(CASE WHEN status = 'in_bearbeitung' THEN 1 END) AS in_progress_messages,
    COUNT(CASE WHEN status = 'erledigt' THEN 1 END) AS completed_messages,
    COUNT(CASE WHEN priority = 'dringend' THEN 1 END) AS urgent_messages,
    COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR) THEN 1 END) AS messages_last_24h
FROM lopez_business_contact_messages
WHERE is_spam = FALSE;

-- =====================================================
-- CORE-SYSTEM - GRUNDLEGENDE TABELLEN
-- =====================================================

-- System-Konfiguration
CREATE TABLE IF NOT EXISTS lopez_core_config (
    id INT AUTO_INCREMENT PRIMARY KEY,
    config_key VARCHAR(255) UNIQUE NOT NULL,
    config_value LONGTEXT NOT NULL,
    config_type ENUM('string', 'json', 'boolean', 'number', 'array') NOT NULL,
    environment ENUM('development', 'staging', 'production') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(36) NOT NULL,
    
    INDEX idx_config_key (config_key),
    INDEX idx_environment (environment),
    INDEX idx_is_active (is_active)
);

-- System-Logs
CREATE TABLE IF NOT EXISTS lopez_core_system_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    log_level ENUM('DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL') NOT NULL,
    category VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    details JSON,
    user_id VARCHAR(36),
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_log_level (log_level),
    INDEX idx_category (category),
    INDEX idx_created_at (created_at),
    INDEX idx_user_id (user_id)
);

-- Benutzer
CREATE TABLE IF NOT EXISTS lopez_core_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role_id INT NOT NULL,
    language VARCHAR(5) DEFAULT 'de',
    timezone VARCHAR(50) DEFAULT 'Europe/Berlin',
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_role_id (role_id),
    INDEX idx_is_active (is_active),
    INDEX idx_last_login (last_login_at)
);

-- Rollen
CREATE TABLE IF NOT EXISTS lopez_core_roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    is_system_role BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_name (name),
    INDEX idx_is_active (is_active)
);

-- Sessions
CREATE TABLE IF NOT EXISTS lopez_core_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    refresh_token VARCHAR(255) UNIQUE,
    ip_address VARCHAR(45),
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES lopez_core_users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_session_token (session_token),
    INDEX idx_expires_at (expires_at),
    INDEX idx_is_active (is_active)
);

-- =====================================================
-- BUSINESS MODULE - CONTENT MANAGEMENT
-- =====================================================

-- Content-Seiten
CREATE TABLE IF NOT EXISTS lopez_business_content (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content LONGTEXT,
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords TEXT,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    language VARCHAR(5) NOT NULL DEFAULT 'de',
    parent_id INT NULL,
    sort_order INT DEFAULT 0,
    is_homepage BOOLEAN DEFAULT FALSE,
    seo_score INT DEFAULT 0,
    accessibility_score INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    published_at TIMESTAMP NULL,
    created_by INT NOT NULL,
    
    FOREIGN KEY (parent_id) REFERENCES lopez_business_content(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES lopez_core_users(id) ON DELETE RESTRICT,
    UNIQUE KEY unique_slug_language (slug, language),
    INDEX idx_status (status),
    INDEX idx_language (language),
    INDEX idx_parent_id (parent_id),
    INDEX idx_published_at (published_at),
    INDEX idx_is_homepage (is_homepage)
);

-- Content-Versionen
CREATE TABLE IF NOT EXISTS lopez_business_content_versions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content_id INT NOT NULL,
    version_number INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content LONGTEXT,
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT NOT NULL,
    
    FOREIGN KEY (content_id) REFERENCES lopez_business_content(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES lopez_core_users(id) ON DELETE RESTRICT,
    UNIQUE KEY unique_content_version (content_id, version_number),
    INDEX idx_content_id (content_id),
    INDEX idx_created_at (created_at)
);

-- Medien
CREATE TABLE IF NOT EXISTS lopez_business_media (
    id INT AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    alt_text TEXT,
    caption TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT NOT NULL,
    
    FOREIGN KEY (created_by) REFERENCES lopez_core_users(id) ON DELETE RESTRICT,
    INDEX idx_filename (filename),
    INDEX idx_mime_type (mime_type),
    INDEX idx_is_active (is_active),
    INDEX idx_created_at (created_at)
);

-- Sprachen
CREATE TABLE IF NOT EXISTS lopez_business_languages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(5) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    native_name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_default BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_code (code),
    INDEX idx_is_active (is_active),
    INDEX idx_is_default (is_default)
);

-- Übersetzungen
CREATE TABLE IF NOT EXISTS lopez_business_translations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    translation_key VARCHAR(255) NOT NULL,
    language_code VARCHAR(5) NOT NULL,
    translation_value TEXT NOT NULL,
    context VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT NOT NULL,
    
    FOREIGN KEY (language_code) REFERENCES lopez_business_languages(code) ON DELETE RESTRICT,
    FOREIGN KEY (created_by) REFERENCES lopez_core_users(id) ON DELETE RESTRICT,
    UNIQUE KEY unique_key_language (translation_key, language_code),
    INDEX idx_translation_key (translation_key),
    INDEX idx_language_code (language_code),
    INDEX idx_is_active (is_active)
);

-- =====================================================
-- INITIAL DATA
-- =====================================================

-- Standard-Rollen einfügen
INSERT IGNORE INTO lopez_core_roles (id, name, description, is_system_role, is_active) VALUES
(1, 'admin', 'System-Administrator mit vollständigen Rechten', TRUE, TRUE),
(2, 'editor', 'Content-Editor für Inhalte', TRUE, TRUE),
(3, 'viewer', 'Nur-Lese-Zugriff', TRUE, TRUE);

-- Standard-Sprachen einfügen
INSERT IGNORE INTO lopez_business_languages (code, name, native_name, is_active, is_default, sort_order) VALUES
('de', 'Deutsch', 'Deutsch', TRUE, TRUE, 1),
('en', 'English', 'English', TRUE, FALSE, 2),
('es', 'Español', 'Español', TRUE, FALSE, 3);

-- Standard-Konfiguration einfügen
INSERT IGNORE INTO lopez_core_config (config_key, config_value, config_type, environment, created_by) VALUES
('site_name', 'Lopez IT Welt', 'string', 'production', 'system'),
('site_description', 'Digitale Enterprise++ IT-Lösungen', 'string', 'production', 'system'),
('contact_email', 'kontakt@lopez-it-welt.de', 'string', 'production', 'system'),
('default_language', 'de', 'string', 'production', 'system');

-- =====================================================
-- VIEWS FÜR ADMIN-DASHBOARD
-- =====================================================

-- View für aktive Benutzer mit Rollen
CREATE OR REPLACE VIEW lopez_v_active_users AS
SELECT 
    u.id,
    u.email,
    u.first_name,
    u.last_name,
    r.name as role_name,
    u.language,
    u.last_login_at,
    u.created_at
FROM lopez_core_users u
JOIN lopez_core_roles r ON u.role_id = r.id
WHERE u.is_active = TRUE AND r.is_active = TRUE;

-- View für veröffentlichte Inhalte
CREATE OR REPLACE VIEW lopez_v_published_content AS
SELECT 
    c.id,
    c.slug,
    c.title,
    c.language,
    c.published_at,
    CONCAT(u.first_name, ' ', u.last_name) as author
FROM lopez_business_content c
JOIN lopez_core_users u ON c.created_by = u.id
WHERE c.status = 'published' AND c.deleted_at IS NULL;

-- =====================================================
-- ERFOLGREICH ABGESCHLOSSEN
-- =====================================================

-- Schema erfolgreich erstellt
SELECT 'Lopez ERP Schema erfolgreich erstellt!' as status;


