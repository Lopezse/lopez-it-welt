-- =====================================================
-- Zentrale Textverwaltung - Datenbank-Schema
-- =====================================================
-- Erstellt: 2025-07-02
-- Zweck: Alle Texte zentral in der Datenbank verwalten
-- =====================================================

-- Haupttabelle für Textkategorien
CREATE TABLE text_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_key VARCHAR(100) UNIQUE NOT NULL,
    category_name VARCHAR(200) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Haupttabelle für alle Texte
CREATE TABLE text_content (
    id INT PRIMARY KEY AUTO_INCREMENT,
    text_key VARCHAR(200) UNIQUE NOT NULL,
    category_id INT NOT NULL,
    language_code VARCHAR(5) DEFAULT 'de',
    content_type ENUM('heading', 'paragraph', 'button', 'link', 'meta', 'footer', 'policy') NOT NULL,
    content TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    priority INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES text_categories(id),
    INDEX idx_text_key (text_key),
    INDEX idx_category_language (category_id, language_code)
);

-- Tabelle für Text-Versionen (für A/B-Tests)
CREATE TABLE text_versions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    text_content_id INT NOT NULL,
    version_name VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (text_content_id) REFERENCES text_content(id)
);

-- Tabelle für Text-Einstellungen
CREATE TABLE text_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- BEISPIEL-DATEN
-- =====================================================

-- Kategorien einfügen
INSERT INTO text_categories (category_key, category_name, description) VALUES
('hauptbereiche', 'Hauptbereiche', 'Texte für die Hauptleistungsbereiche'),
('navigation', 'Navigation', 'Menü- und Navigations-Texte'),
('footer', 'Footer', 'Footer-Texte und Links'),
('policies', 'Policies', 'Datenschutz, Impressum, AGB'),
('buttons', 'Buttons', 'Button-Texte und Call-to-Actions'),
('meta', 'Meta', 'Meta-Tags und SEO-Texte'),
('homepage', 'Homepage', 'Startseiten-Texte'),
('contact', 'Kontakt', 'Kontakt-Formular und Informationen');

-- Hauptbereiche-Texte
INSERT INTO text_content (text_key, category_id, content_type, content, description) VALUES
('hauptbereiche.title', 1, 'heading', 'Unsere Kernleistungen', 'Hauptüberschrift der Leistungsbereiche'),
('hauptbereiche.subtitle', 1, 'paragraph', 'Professionelle IT-Dienstleistungen mit Fokus auf Barrierefreiheit, Mehrsprachigkeit und persönliche Betreuung', 'Untertitel der Leistungsbereiche'),
('hauptbereiche.it_support.title', 1, 'heading', 'IT-Support', 'Titel IT-Support'),
('hauptbereiche.it_support.description', 1, 'paragraph', 'Professioneller IT-Support vor Ort und remote', 'Beschreibung IT-Support'),
('hauptbereiche.pc_bau.title', 1, 'heading', 'PC-Bau & Einrichtung', 'Titel PC-Bau'),
('hauptbereiche.pc_bau.description', 1, 'paragraph', 'Individuell zusammengestellte Systeme', 'Beschreibung PC-Bau'),
('hauptbereiche.webdesign.title', 1, 'heading', 'Webdesign & Automatisierung', 'Titel Webdesign'),
('hauptbereiche.webdesign.description', 1, 'paragraph', 'Moderne, barrierefreie Webentwicklung', 'Beschreibung Webdesign'),
('hauptbereiche.ki_assistenz.title', 1, 'heading', 'KI-Assistenz', 'Titel KI-Assistenz'),
('hauptbereiche.ki_assistenz.description', 1, 'paragraph', 'Intelligente Automatisierung für Ihren Alltag', 'Beschreibung KI-Assistenz'),
('hauptbereiche.formularservice.title', 1, 'heading', 'Formularservice', 'Titel Formularservice'),
('hauptbereiche.formularservice.description', 1, 'paragraph', 'Professionelle Hilfe bei Ämtern und Anträgen', 'Beschreibung Formularservice'),
('hauptbereiche.webshop.title', 1, 'heading', 'Webshop', 'Titel Webshop'),
('hauptbereiche.webshop.description', 1, 'paragraph', 'Digitale Produkte zum sofortigen Download', 'Beschreibung Webshop'),
('hauptbereiche.cta.title', 1, 'paragraph', 'Benötigen Sie eine individuelle Lösung?', 'Call-to-Action Text'),
('hauptbereiche.cta.button', 1, 'button', 'Beratung anfordern', 'CTA Button Text');

-- Navigation-Texte
INSERT INTO text_content (text_key, category_id, content_type, content, description) VALUES
('nav.home', 2, 'link', 'Startseite', 'Navigation Home'),
('nav.services', 2, 'link', 'Leistungen', 'Navigation Services'),
('nav.about', 2, 'link', 'Über uns', 'Navigation About'),
('nav.contact', 2, 'link', 'Kontakt', 'Navigation Contact'),
('nav.admin', 2, 'link', 'Admin', 'Navigation Admin');

-- Footer-Texte
INSERT INTO text_content (text_key, category_id, content_type, content, description) VALUES
('footer.company', 3, 'paragraph', 'Lopez IT Welt', 'Firmenname im Footer'),
('footer.address', 3, 'paragraph', 'Alte Bahnhofstraße 13, 31515 Wunstorf', 'Adresse im Footer'),
('footer.phone', 3, 'paragraph', '+49 (0) 5031 7005576', 'Telefon im Footer'),
('footer.email', 3, 'paragraph', 'info@lopez-it-welt.de', 'E-Mail im Footer'),
('footer.privacy', 3, 'link', 'Datenschutz', 'Datenschutz-Link'),
('footer.imprint', 3, 'link', 'Impressum', 'Impressum-Link'),
('footer.cookies', 3, 'link', 'Cookie-Einstellungen', 'Cookie-Link');

-- Policy-Texte
INSERT INTO text_content (text_key, category_id, content_type, content, description) VALUES
('policy.datenschutz.title', 4, 'heading', 'Datenschutzerklärung', 'Datenschutz-Titel'),
('policy.datenschutz.intro', 4, 'paragraph', 'Der Schutz Ihrer persönlichen Daten ist uns wichtig. Diese Datenschutzerklärung informiert Sie über Art, Umfang und Zweck der Verarbeitung personenbezogener Daten auf unserer Website.', 'Datenschutz-Einleitung'),
('policy.impressum.title', 4, 'heading', 'Impressum', 'Impressum-Titel'),
('policy.impressum.company', 4, 'paragraph', 'Lopez IT Welt', 'Firmenname Impressum'),
('policy.impressum.address', 4, 'paragraph', 'Alte Bahnhofstraße 13, 31515 Wunstorf', 'Adresse Impressum'),
('policy.impressum.contact', 4, 'paragraph', 'Telefon: +49 (0) 5031 7005576, E-Mail: info@lopez-it-welt.de', 'Kontakt Impressum');

-- Meta-Texte
INSERT INTO text_content (text_key, category_id, content_type, content, description) VALUES
('meta.home.title', 6, 'meta', 'Lopez IT Welt - Professionelle IT-Dienstleistungen', 'Homepage Meta-Titel'),
('meta.home.description', 6, 'meta', 'Professionelle IT-Dienstleistungen mit Fokus auf Barrierefreiheit, Mehrsprachigkeit und persönliche Betreuung. IT-Support, PC-Bau, Webdesign und mehr.', 'Homepage Meta-Description'),
('meta.home.keywords', 6, 'meta', 'IT-Support, PC-Bau, Webdesign, KI-Assistenz, Formularservice, Wunstorf', 'Homepage Keywords');

-- Einstellungen
INSERT INTO text_settings (setting_key, setting_value, description) VALUES
('default_language', 'de', 'Standard-Sprache'),
('enable_translations', 'true', 'Übersetzungen aktivieren'),
('cache_duration', '3600', 'Cache-Dauer in Sekunden'),
('admin_email', 'admin@lopez-it-welt.de', 'Admin-E-Mail für Benachrichtigungen');

-- =====================================================
-- STORED PROCEDURES FÜR TEXT-MANAGEMENT
-- =====================================================

DELIMITER //

-- Text abrufen
CREATE PROCEDURE GetText(
    IN p_text_key VARCHAR(200),
    IN p_language_code VARCHAR(5)
)
BEGIN
    SELECT 
        tc.text_key,
        tc.content,
        tc.content_type,
        tc.description,
        cat.category_name
    FROM text_content tc
    JOIN text_categories cat ON tc.category_id = cat.id
    WHERE tc.text_key = p_text_key 
    AND tc.language_code = p_language_code
    AND tc.is_active = TRUE;
END //

-- Alle Texte einer Kategorie abrufen
CREATE PROCEDURE GetTextsByCategory(
    IN p_category_key VARCHAR(100),
    IN p_language_code VARCHAR(5)
)
BEGIN
    SELECT 
        tc.text_key,
        tc.content,
        tc.content_type,
        tc.description
    FROM text_content tc
    JOIN text_categories cat ON tc.category_id = cat.id
    WHERE cat.category_key = p_category_key
    AND tc.language_code = p_language_code
    AND tc.is_active = TRUE
    ORDER BY tc.priority, tc.text_key;
END //

-- Text aktualisieren
CREATE PROCEDURE UpdateText(
    IN p_text_key VARCHAR(200),
    IN p_content TEXT,
    IN p_language_code VARCHAR(5)
)
BEGIN
    UPDATE text_content 
    SET content = p_content, updated_at = CURRENT_TIMESTAMP
    WHERE text_key = p_text_key 
    AND language_code = p_language_code;
END //

DELIMITER ; 