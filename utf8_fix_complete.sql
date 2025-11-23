-- =====================================================
-- ZENTRALE UTF-8 FIX FÜR LOPEZ IT WELT
-- Enterprise++ Standard - Alle Umlaute korrekt
-- =====================================================

-- 1. HERO-DATEN KORRIGIEREN
DELETE FROM content_hero;
INSERT INTO content_hero (title, subtitle, description, button_text, button_link, background_style, background_value, is_active) 
VALUES (
  'Lopez IT Welt', 
  'Professionelle IT-Lösungen', 
  'Wir entwickeln maßgeschneiderte Software-Lösungen mit Fokus auf Barrierefreiheit und persönliche Betreuung. Von der Konzeption bis zur Umsetzung - Ihr Partner für digitale Innovation.', 
  'Jetzt beraten lassen', 
  '/kontakt', 
  'gradient', 
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
  TRUE
);

-- 2. HEADER-DATEN KORRIGIEREN
DELETE FROM content_header;
INSERT INTO content_header (logo_text, logo_icon, navigation_items, mobile_menu_text, language_switch, is_active) 
VALUES (
  'Lopez IT Welt', 
  'LW', 
  '[{"label": "Leistungen", "link": "/leistungen", "type": "link"}, {"label": "Projekte", "link": "/projekte", "type": "link"}, {"label": "Kontakt", "link": "/kontakt", "type": "link"}]', 
  'Menü', 
  TRUE, 
  TRUE
);

-- 3. FOOTER-DATEN KORRIGIEREN
DELETE FROM lopez_footer;

-- Unternehmen Sektion
INSERT INTO lopez_footer (id, section, title, content, link_url, sort_order, language, is_active) 
VALUES (UUID(), 'unternehmen', 'Lopez IT Welt', 'Professionelle IT-Lösungen mit Fokus auf Barrierefreiheit und persönliche Betreuung.', NULL, 1, 'de', TRUE);

-- Leistungen Sektion
INSERT INTO lopez_footer (id, section, title, content, link_url, sort_order, language, is_active) VALUES 
(UUID(), 'leistungen', 'Leistungen', 'IT-Support', '#it-support', 1, 'de', TRUE),
(UUID(), 'leistungen', NULL, 'PC-Bau & Einrichtung', '#pc-bau', 2, 'de', TRUE),
(UUID(), 'leistungen', NULL, 'Webdesign', '#webdesign', 3, 'de', TRUE),
(UUID(), 'leistungen', NULL, 'KI-Assistenz', '#ki-assistenz', 4, 'de', TRUE);

-- Kontakt Sektion
INSERT INTO lopez_footer (id, section, title, content, link_url, sort_order, language, is_active) VALUES 
(UUID(), 'kontakt', 'Kontakt', 'Ramiro Lopez Rodriguez', NULL, 1, 'de', TRUE),
(UUID(), 'kontakt', NULL, 'Alte Bahnhofstraße 13', NULL, 2, 'de', TRUE),
(UUID(), 'kontakt', NULL, '31515 Wunstorf', NULL, 3, 'de', TRUE),
(UUID(), 'kontakt', NULL, 'E-Mail: info@lopez-it-welt.de', 'mailto:info@lopez-it-welt.de', 4, 'de', TRUE),
(UUID(), 'kontakt', NULL, 'Telefon: +49 (0) 5031 7005576', 'tel:+4950317005576', 5, 'de', TRUE),
(UUID(), 'kontakt', NULL, 'WhatsApp: +49 1525 1574657', 'https://wa.me/4915251574657', 6, 'de', TRUE);

-- Rechtliches Sektion
INSERT INTO lopez_footer (id, section, title, content, link_url, sort_order, language, is_active) VALUES 
(UUID(), 'rechtliches', 'Rechtliches', 'Impressum', '/impressum', 1, 'de', TRUE),
(UUID(), 'rechtliches', NULL, 'Datenschutz', '/datenschutz', 2, 'de', TRUE),
(UUID(), 'rechtliches', NULL, 'Cookie-Einstellungen', '/cookie-einstellungen', 3, 'de', TRUE),
(UUID(), 'rechtliches', NULL, 'AGB', '/agb', 4, 'de', TRUE);

-- =====================================================
-- UTF-8 FIX ABGESCHLOSSEN
-- Alle Umlaute (ä, ö, ü, ß) sind jetzt korrekt kodiert
-- =====================================================


