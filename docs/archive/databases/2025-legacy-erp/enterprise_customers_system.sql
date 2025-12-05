-- =====================================================
-- ENTERPRISE++ CUSTOMERS SYSTEM - LOPEZ IT WELT
-- =====================================================
-- Erstellt: 2025-01-19
-- Zweck: IBM/SAP-Level Kundenverwaltung für B2B & B2C
-- Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
-- =====================================================

USE lopez_erp;

-- =====================================================
-- 1. KUNDEN-HAUPTTABELLE
-- =====================================================

CREATE TABLE IF NOT EXISTS lopez_customers (
    id VARCHAR(36) PRIMARY KEY,
    customer_type ENUM('privat', 'firma', 'behörde', 'partner') NOT NULL,
    
    -- Anrede & Titel
    anrede ENUM('Herr', 'Frau', 'Divers', 'Mx', 'Keine Angabe') DEFAULT 'Keine Angabe',
    titel VARCHAR(50),              -- z. B. Dr., Prof., Dipl.-Ing.
    
    -- Personendaten
    vorname VARCHAR(100),
    nachname VARCHAR(100),
    
    -- Firmendaten
    company_name VARCHAR(150),      -- Pflicht wenn Typ != privat
    ust_id VARCHAR(50),             -- Umsatzsteuer-ID
    
    -- Ansprechpartner (für Firmen)
    contact_person_anrede ENUM('Herr', 'Frau', 'Divers', 'Mx', 'Keine Angabe') DEFAULT 'Keine Angabe',
    contact_person_titel VARCHAR(50),
    contact_person_vorname VARCHAR(100),
    contact_person_nachname VARCHAR(100),
    
    -- Kontakt
    email VARCHAR(150) NOT NULL UNIQUE,
    email_secondary VARCHAR(150),
    email_external VARCHAR(255),         -- lopezitwelt.de für externe Kommunikation
    email_internal VARCHAR(255),         -- lopez-team.de für interne Kommunikation
    phone_mobile VARCHAR(50),
    phone_business VARCHAR(50),
    phone_private VARCHAR(50),
    
    -- Adresse
    strasse VARCHAR(150),
    plz VARCHAR(20),
    stadt VARCHAR(100),
    land VARCHAR(100) DEFAULT 'Deutschland',
    land_iso VARCHAR(3) DEFAULT 'DE',  -- ISO 3166-1 alpha-3
    
    -- Service-Level
    support_level ENUM('Standard', 'Premium', 'SLA 24h', 'SLA 4h') DEFAULT 'Standard',
    account_manager VARCHAR(36),    -- FK zu lopez_users
    
    -- Verwaltung
    status ENUM('aktiv', 'inaktiv', 'gesperrt') DEFAULT 'aktiv',
    notes TEXT,
    
    -- Audit & Compliance
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(36) NOT NULL,
    updated_by VARCHAR(36),
    
    -- Indizes
    INDEX idx_customer_type (customer_type),
    INDEX idx_email (email),
    INDEX idx_company_name (company_name),
    INDEX idx_status (status),
    INDEX idx_support_level (support_level),
    INDEX idx_account_manager (account_manager),
    INDEX idx_land (land),
    INDEX idx_created_at (created_at)
);

-- =====================================================
-- 2. KUNDEN-KONTAKTHISTORIE
-- =====================================================

CREATE TABLE IF NOT EXISTS lopez_customer_contacts (
    id VARCHAR(36) PRIMARY KEY,
    customer_id VARCHAR(36) NOT NULL,
    contact_type ENUM('email', 'phone', 'meeting', 'support', 'sales') NOT NULL,
    contact_method VARCHAR(50),     -- z.B. 'E-Mail', 'Telefon', 'Video-Call'
    subject VARCHAR(255),
    description TEXT,
    contact_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(36) NOT NULL,
    
    FOREIGN KEY (customer_id) REFERENCES lopez_customers(id) ON DELETE CASCADE,
    INDEX idx_customer (customer_id),
    INDEX idx_contact_type (contact_type),
    INDEX idx_contact_date (contact_date)
);

-- =====================================================
-- 3. KUNDEN-DOKUMENTE
-- =====================================================

CREATE TABLE IF NOT EXISTS lopez_customer_documents (
    id VARCHAR(36) PRIMARY KEY,
    customer_id VARCHAR(36) NOT NULL,
    document_type ENUM('vertrag', 'angebot', 'rechnung', 'dsgvo', 'sonstiges') NOT NULL,
    document_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size_bytes BIGINT DEFAULT 0,
    mime_type VARCHAR(100),
    is_confidential BOOLEAN DEFAULT FALSE,
    uploaded_by VARCHAR(36) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (customer_id) REFERENCES lopez_customers(id) ON DELETE CASCADE,
    INDEX idx_customer (customer_id),
    INDEX idx_document_type (document_type),
    INDEX idx_uploaded_at (uploaded_at)
);

-- =====================================================
-- 4. KUNDEN-TAGS (für Kategorisierung)
-- =====================================================

CREATE TABLE IF NOT EXISTS lopez_customer_tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tag_name VARCHAR(100) UNIQUE NOT NULL,
    tag_color VARCHAR(7) DEFAULT '#3B82F6',  -- Hex-Farbe
    tag_description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_tag_name (tag_name),
    INDEX idx_active (is_active)
);

-- =====================================================
-- 5. KUNDEN-TAG-ZUORDNUNGEN
-- =====================================================

CREATE TABLE IF NOT EXISTS lopez_customer_tag_assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id VARCHAR(36) NOT NULL,
    tag_id INT NOT NULL,
    assigned_by VARCHAR(36) NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (customer_id) REFERENCES lopez_customers(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES lopez_customer_tags(id) ON DELETE CASCADE,
    UNIQUE KEY unique_customer_tag (customer_id, tag_id),
    INDEX idx_customer (customer_id),
    INDEX idx_tag (tag_id)
);

-- =====================================================
-- 6. KUNDEN-IMPORT-HISTORIE
-- =====================================================

CREATE TABLE IF NOT EXISTS lopez_customer_imports (
    id VARCHAR(36) PRIMARY KEY,
    import_name VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    total_records INT DEFAULT 0,
    successful_records INT DEFAULT 0,
    failed_records INT DEFAULT 0,
    import_status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
    error_log TEXT,
    imported_by VARCHAR(36) NOT NULL,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    
    INDEX idx_status (import_status),
    INDEX idx_imported_by (imported_by),
    INDEX idx_started_at (started_at)
);

-- =====================================================
-- 7. LÄNDER-REFERENZTABELLE
-- =====================================================

CREATE TABLE IF NOT EXISTS lopez_countries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    country_name VARCHAR(100) NOT NULL,
    country_name_de VARCHAR(100) NOT NULL,
    iso_alpha2 VARCHAR(2) NOT NULL,
    iso_alpha3 VARCHAR(3) NOT NULL,
    phone_code VARCHAR(10),
    currency_code VARCHAR(3),
    is_eu_member BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    
    UNIQUE KEY unique_iso2 (iso_alpha2),
    UNIQUE KEY unique_iso3 (iso_alpha3),
    INDEX idx_name (country_name),
    INDEX idx_active (is_active)
);

-- =====================================================
-- 8. STANDARD-LÄNDER EINFÜGEN
-- =====================================================

INSERT INTO lopez_countries (country_name, country_name_de, iso_alpha2, iso_alpha3, phone_code, currency_code, is_eu_member) VALUES
('Germany', 'Deutschland', 'DE', 'DEU', '+49', 'EUR', TRUE),
('Austria', 'Österreich', 'AT', 'AUT', '+43', 'EUR', TRUE),
('Switzerland', 'Schweiz', 'CH', 'CHE', '+41', 'CHF', FALSE),
('France', 'Frankreich', 'FR', 'FRA', '+33', 'EUR', TRUE),
('Italy', 'Italien', 'IT', 'ITA', '+39', 'EUR', TRUE),
('Netherlands', 'Niederlande', 'NL', 'NLD', '+31', 'EUR', TRUE),
('Belgium', 'Belgien', 'BE', 'BEL', '+32', 'EUR', TRUE),
('Luxembourg', 'Luxemburg', 'LU', 'LUX', '+352', 'EUR', TRUE),
('United Kingdom', 'Vereinigtes Königreich', 'GB', 'GBR', '+44', 'GBP', FALSE),
('United States', 'Vereinigte Staaten', 'US', 'USA', '+1', 'USD', FALSE);

-- =====================================================
-- 9. STANDARD-TAGS EINFÜGEN
-- =====================================================

INSERT INTO lopez_customer_tags (tag_name, tag_color, tag_description) VALUES
('VIP', '#DC2626', 'VIP-Kunde mit besonderen Service-Level'),
('Neukunde', '#059669', 'Neuer Kunde im System'),
('Langzeitkunde', '#7C3AED', 'Kunde seit über 5 Jahren'),
('Problematisch', '#EA580C', 'Kunde mit wiederholten Problemen'),
('Potenzial', '#0891B2', 'Kunde mit hohem Wachstumspotenzial'),
('Partner', '#7C2D12', 'Geschäftspartner'),
('Behörde', '#1E40AF', 'Öffentliche Einrichtung'),
('Startup', '#BE185D', 'Junges Unternehmen');

-- =====================================================
-- 10. DEMO-KUNDEN EINFÜGEN
-- =====================================================

INSERT INTO lopez_customers (
    id, customer_type, anrede, vorname, nachname, email, phone_mobile,
    strasse, plz, stadt, land, land_iso, support_level, status, created_by
) VALUES 
('customer_demo_1', 'privat', 'Herr', 'Max', 'Mustermann', 'max.mustermann@email.de', '+49 123 456789',
 'Musterstraße 123', '30159', 'Hannover', 'Deutschland', 'DE', 'Standard', 'aktiv', 'admin_user'),
 
('customer_demo_2', 'firma', 'Frau', 'Anna', 'Schmidt', 'anna.schmidt@beispiel-gmbh.de', '+49 511 987654',
 'Firmenstraße 456', '30159', 'Hannover', 'Deutschland', 'DE', 'Premium', 'aktiv', 'admin_user'),
 
('customer_demo_3', 'behörde', 'Herr', 'Dr.', 'Müller', 'verwaltung@stadt-hannover.de', '+49 511 555123',
 'Rathausplatz 1', '30159', 'Hannover', 'Deutschland', 'DE', 'SLA 24h', 'aktiv', 'admin_user');

-- Firmendaten für Demo-Kunde 2
UPDATE lopez_customers SET 
    company_name = 'Beispiel GmbH',
    ust_id = 'DE123456789',
    contact_person_anrede = 'Frau',
    contact_person_vorname = 'Anna',
    contact_person_nachname = 'Schmidt',
    phone_business = '+49 511 987654'
WHERE id = 'customer_demo_2';

-- =====================================================
-- 11. VIEWS FÜR EINFACHE ABFRAGEN
-- =====================================================

-- View für Kunden-Übersicht
CREATE OR REPLACE VIEW v_customers_overview AS
SELECT 
    c.id,
    c.customer_type,
    c.anrede,
    c.titel,
    c.vorname,
    c.nachname,
    c.company_name,
    c.email,
    c.phone_mobile,
    c.phone_business,
    c.stadt,
    c.land,
    c.support_level,
    c.status,
    c.created_at,
    u.first_name as account_manager_name,
    u.last_name as account_manager_lastname
FROM lopez_customers c
LEFT JOIN lopez_core_users u ON c.account_manager = u.id;

-- View für Kunden-Statistiken
CREATE OR REPLACE VIEW v_customer_stats AS
SELECT 
    customer_type,
    support_level,
    status,
    land,
    COUNT(*) as customer_count,
    COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as new_last_30_days
FROM lopez_customers
GROUP BY customer_type, support_level, status, land;

-- =====================================================
-- 12. STORED PROCEDURES
-- =====================================================

DELIMITER //

-- Procedure: Kunde erstellen
CREATE PROCEDURE sp_create_customer(
    IN p_customer_type ENUM('privat', 'firma', 'behörde', 'partner'),
    IN p_anrede ENUM('Herr', 'Frau', 'Divers', 'Mx', 'Keine Angabe'),
    IN p_titel VARCHAR(50),
    IN p_vorname VARCHAR(100),
    IN p_nachname VARCHAR(100),
    IN p_company_name VARCHAR(150),
    IN p_ust_id VARCHAR(50),
    IN p_email VARCHAR(150),
    IN p_phone_mobile VARCHAR(50),
    IN p_strasse VARCHAR(150),
    IN p_plz VARCHAR(20),
    IN p_stadt VARCHAR(100),
    IN p_land VARCHAR(100),
    IN p_land_iso VARCHAR(3),
    IN p_support_level ENUM('Standard', 'Premium', 'SLA 24h', 'SLA 4h'),
    IN p_created_by VARCHAR(36)
)
BEGIN
    DECLARE v_customer_id VARCHAR(36);
    DECLARE v_error_message VARCHAR(255);
    
    -- Validierung
    IF p_customer_type != 'privat' AND (p_company_name IS NULL OR p_company_name = '') THEN
        SET v_error_message = 'Firmenname ist für Firmen, Behörden und Partner erforderlich';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = v_error_message;
    END IF;
    
    -- Customer-ID generieren
    SET v_customer_id = CONCAT('customer_', UNIX_TIMESTAMP(), '_', SUBSTRING(MD5(RAND()), 1, 8));
    
    -- Kunde erstellen
    INSERT INTO lopez_customers (
        id, customer_type, anrede, titel, vorname, nachname, company_name, ust_id,
        email, phone_mobile, strasse, plz, stadt, land, land_iso, support_level, created_by
    ) VALUES (
        v_customer_id, p_customer_type, p_anrede, p_titel, p_vorname, p_nachname, 
        p_company_name, p_ust_id, p_email, p_phone_mobile, p_strasse, p_plz, 
        p_stadt, p_land, p_land_iso, p_support_level, p_created_by
    );
    
    SELECT v_customer_id as customer_id;
END //

DELIMITER ;

-- =====================================================
-- FERTIG: ENTERPRISE++ CUSTOMERS SYSTEM
-- =====================================================

