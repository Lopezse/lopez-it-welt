-- =====================================================
-- FOOTER SYSTEM - ENTERPRISE++ DATABASE SCHEMA
-- =====================================================
-- Erstellt: 2025-01-20
-- Zweck: Dynamischer Footer für Enterprise++ Mehrsprachigkeit
-- Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
-- =====================================================

-- Footer-Tabelle erstellen (4 Spalten wie Original)
CREATE TABLE IF NOT EXISTS lopez_footer (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    section ENUM('unternehmen', 'leistungen', 'kontakt', 'rechtliches') NOT NULL,
    title VARCHAR(255) NULL,
    content TEXT NULL,
    link_url VARCHAR(500) NULL,
    language ENUM('de', 'en', 'es') NOT NULL DEFAULT 'de',
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_section_language (section, language),
    INDEX idx_language_active (language, is_active),
    INDEX idx_sort_order (sort_order)
);

-- Footer-Daten einfügen (Deutsch) - Original 4 Spalten
INSERT INTO lopez_footer (id, section, title, content, link_url, language, sort_order) VALUES
-- Spalte 1 - Unternehmen (Logo + Text)
(UUID(), 'unternehmen', 'Lopez IT Welt', 'Professionelle IT-Lösungen mit Fokus auf Barrierefreiheit und persönliche Betreuung.', NULL, 'de', 1),

-- Spalte 2 - Leistungen
(UUID(), 'leistungen', 'Leistungen', 'IT-Support', '#it-support', 'de', 1),
(UUID(), 'leistungen', NULL, 'PC-Bau & Einrichtung', '#pc-bau', 'de', 2),
(UUID(), 'leistungen', NULL, 'Webdesign', '#webdesign', 'de', 3),
(UUID(), 'leistungen', NULL, 'KI-Assistenz', '#ki-assistenz', 'de', 4),

-- Spalte 3 - Kontakt
(UUID(), 'kontakt', 'Kontakt', 'Ramiro Lopez Rodriguez', NULL, 'de', 1),
(UUID(), 'kontakt', NULL, 'Alte Bahnhofstraße 13', NULL, 'de', 2),
(UUID(), 'kontakt', NULL, '31515 Wunstorf', NULL, 'de', 3),
(UUID(), 'kontakt', NULL, 'E-Mail: info@lopez-it-welt.de', 'mailto:info@lopez-it-welt.de', 'de', 4),
(UUID(), 'kontakt', NULL, 'Telefon: +49 (0) 5031 7005576', 'tel:+4950317005576', 'de', 5),
(UUID(), 'kontakt', NULL, 'WhatsApp: +49 1525 1574657', 'https://wa.me/4915251574657', 'de', 6),

-- Spalte 4 - Rechtliches
(UUID(), 'rechtliches', 'Rechtliches', 'Impressum', '/impressum', 'de', 1),
(UUID(), 'rechtliches', NULL, 'Datenschutz', '/datenschutz', 'de', 2),
(UUID(), 'rechtliches', NULL, 'Cookie-Einstellungen', '/cookie-einstellungen', 'de', 3),
(UUID(), 'rechtliches', NULL, 'AGB', '/agb', 'de', 4);

-- Footer-Daten einfügen (Englisch) - Original 4 Spalten
INSERT INTO lopez_footer (id, section, title, content, link_url, language, sort_order) VALUES
-- Spalte 1 - Unternehmen
(UUID(), 'unternehmen', 'Lopez IT Welt', 'Professional IT solutions with focus on accessibility and personal support.', NULL, 'en', 1),

-- Spalte 2 - Leistungen
(UUID(), 'leistungen', 'Services', 'IT Support', '#it-support', 'en', 1),
(UUID(), 'leistungen', NULL, 'PC Building & Setup', '#pc-bau', 'en', 2),
(UUID(), 'leistungen', NULL, 'Web Design', '#webdesign', 'en', 3),
(UUID(), 'leistungen', NULL, 'AI Assistance', '#ki-assistenz', 'en', 4),

-- Spalte 3 - Kontakt
(UUID(), 'kontakt', 'Contact', 'Ramiro Lopez Rodriguez', NULL, 'en', 1),
(UUID(), 'kontakt', NULL, 'Alte Bahnhofstraße 13', NULL, 'en', 2),
(UUID(), 'kontakt', NULL, '31515 Wunstorf', NULL, 'en', 3),
(UUID(), 'kontakt', NULL, 'E-Mail: info@lopez-it-welt.de', 'mailto:info@lopez-it-welt.de', 'en', 4),
(UUID(), 'kontakt', NULL, 'Phone: +49 (0) 5031 7005576', 'tel:+4950317005576', 'en', 5),
(UUID(), 'kontakt', NULL, 'WhatsApp: +49 1525 1574657', 'https://wa.me/4915251574657', 'en', 6),

-- Spalte 4 - Rechtliches
(UUID(), 'rechtliches', 'Legal', 'Imprint', '/impressum', 'en', 1),
(UUID(), 'rechtliches', NULL, 'Privacy Policy', '/datenschutz', 'en', 2),
(UUID(), 'rechtliches', NULL, 'Cookie Settings', '/cookie-einstellungen', 'en', 3),
(UUID(), 'rechtliches', NULL, 'Terms & Conditions', '/agb', 'en', 4);

-- Footer-Daten einfügen (Spanisch) - Original 4 Spalten
INSERT INTO lopez_footer (id, section, title, content, link_url, language, sort_order) VALUES
-- Spalte 1 - Unternehmen
(UUID(), 'unternehmen', 'Lopez IT Welt', 'Soluciones IT profesionales con enfoque en accesibilidad y atención personal.', NULL, 'es', 1),

-- Spalte 2 - Leistungen
(UUID(), 'leistungen', 'Servicios', 'Soporte IT', '#it-support', 'es', 1),
(UUID(), 'leistungen', NULL, 'Construcción y Configuración PC', '#pc-bau', 'es', 2),
(UUID(), 'leistungen', NULL, 'Diseño Web', '#webdesign', 'es', 3),
(UUID(), 'leistungen', NULL, 'Asistencia IA', '#ki-assistenz', 'es', 4),

-- Spalte 3 - Kontakt
(UUID(), 'kontakt', 'Contacto', 'Ramiro Lopez Rodriguez', NULL, 'es', 1),
(UUID(), 'kontakt', NULL, 'Alte Bahnhofstraße 13', NULL, 'es', 2),
(UUID(), 'kontakt', NULL, '31515 Wunstorf', NULL, 'es', 3),
(UUID(), 'kontakt', NULL, 'E-Mail: info@lopez-it-welt.de', 'mailto:info@lopez-it-welt.de', 'es', 4),
(UUID(), 'kontakt', NULL, 'Teléfono: +49 (0) 5031 7005576', 'tel:+4950317005576', 'es', 5),
(UUID(), 'kontakt', NULL, 'WhatsApp: +49 1525 1574657', 'https://wa.me/4915251574657', 'es', 6),

-- Spalte 4 - Rechtliches
(UUID(), 'rechtliches', 'Legal', 'Aviso Legal', '/impressum', 'es', 1),
(UUID(), 'rechtliches', NULL, 'Política de Privacidad', '/datenschutz', 'es', 2),
(UUID(), 'rechtliches', NULL, 'Configuración de Cookies', '/cookie-einstellungen', 'es', 3),
(UUID(), 'rechtliches', NULL, 'Términos y Condiciones', '/agb', 'es', 4);

-- =====================================================
-- FOOTER SYSTEM - ERFOLGREICH ERSTELLT
-- =====================================================

