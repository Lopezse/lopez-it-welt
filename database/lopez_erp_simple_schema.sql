-- =====================================================
-- LOPEZ ERP EINFACHES SCHEMA - LOPEZ IT WELT
-- =====================================================
-- Erstellt: 2025-01-19
-- Zweck: Einfaches Schema für Kontakt-Integration
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

-- View für schnelle Statistiken
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
-- ERFOLGREICH ABGESCHLOSSEN
-- =====================================================

SELECT 'Lopez ERP Schema erfolgreich erstellt!' as status;


