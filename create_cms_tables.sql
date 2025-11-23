-- CMS Content Management System Tables
-- Erstellt: 2025-09-14

USE lopez_it_welt;

-- Header Content Table
CREATE TABLE content_header (
  id INT PRIMARY KEY AUTO_INCREMENT,
  logo_text VARCHAR(100) NOT NULL,
  logo_icon TEXT,
  navigation_items JSON,
  mobile_menu_text VARCHAR(50),
  language_switch BOOLEAN DEFAULT TRUE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Index für Performance
CREATE INDEX idx_active_header ON content_header(is_active);

-- Hero Section Content Table
CREATE TABLE content_hero (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(200) NOT NULL,
  subtitle VARCHAR(300),
  description TEXT,
  button_text VARCHAR(50),
  button_link VARCHAR(200),
  background_style ENUM('solid', 'gradient', 'image') DEFAULT 'gradient',
  background_value VARCHAR(200),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Index für Performance
CREATE INDEX idx_active_hero ON content_hero(is_active);

-- Testdaten einfügen
INSERT INTO content_header (logo_text, logo_icon, navigation_items, mobile_menu_text, language_switch, is_active) VALUES 
('Lopez IT Welt', 'LW', '[{"label": "Startseite", "link": "/"}, {"label": "Über uns", "link": "/ueber-uns"}, {"label": "Services", "link": "/services"}, {"label": "Kontakt", "link": "/kontakt"}]', 'Menü', TRUE, TRUE);

INSERT INTO content_hero (title, subtitle, description, button_text, button_link, background_style, background_value, is_active) VALUES 
('Enterprise++ IT-Lösungen', 'Digitale Transformation. Global. Sicher.', 'Professionelle IT-Dienstleistungen für kleine Unternehmen, Selbstständige und Vereine. KI-Automatisierung ohne Abo, ohne Fachchinesisch.', 'Jetzt starten', '/kontakt', 'gradient', 'from-hauptblau/10 to-akzentblau/10', TRUE);

-- Tabellen anzeigen
SHOW TABLES LIKE 'content_%';



