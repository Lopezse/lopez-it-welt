/**
 * Migration 011: Admin Navigation Tables
 *
 * Erstellt die Tabellen für dynamische Admin-Navigation
 *
 * Tabellen:
 * - admin_navigation_items: Haupt-Navigationspunkte
 * - admin_navigation_sub_items: Unter-Navigationspunkte
 *
 * Enterprise++ Standard - ISO 27001-konform
 */

-- =====================================================
-- 1. ADMIN_NAVIGATION_ITEMS - Haupt-Navigationspunkte
-- =====================================================

CREATE TABLE IF NOT EXISTS admin_navigation_items (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL COMMENT 'Anzeigename',
  href VARCHAR(500) DEFAULT NULL COMMENT 'URL (optional, wenn kein href, dann nur Container)',
  icon_name VARCHAR(100) DEFAULT NULL COMMENT 'Icon-Name (z.B. "FaHome", "FaUsers")',
  description TEXT DEFAULT NULL COMMENT 'Beschreibung',
  order_index INT DEFAULT 0 COMMENT 'Reihenfolge',
  badge_text VARCHAR(50) DEFAULT NULL COMMENT 'Badge-Text (optional)',
  badge_color VARCHAR(50) DEFAULT NULL COMMENT 'Badge-Farbe (z.B. "bg-red-500")',
  dynamic_badge BOOLEAN DEFAULT FALSE COMMENT 'Badge wird dynamisch geladen',
  badge_api_endpoint VARCHAR(500) DEFAULT NULL COMMENT 'API-Endpoint für dynamisches Badge',
  is_active BOOLEAN DEFAULT TRUE,
  requires_permission VARCHAR(255) DEFAULT NULL COMMENT 'Benötigte Berechtigung (optional)',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_order_index (order_index),
  INDEX idx_is_active (is_active),
  INDEX idx_requires_permission (requires_permission)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Admin Navigation Items';

-- =====================================================
-- 2. ADMIN_NAVIGATION_SUB_ITEMS - Unter-Navigationspunkte
-- =====================================================

CREATE TABLE IF NOT EXISTS admin_navigation_sub_items (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  navigation_item_id BIGINT NOT NULL COMMENT 'Zugehöriger Haupt-Navigationspunkt',
  name VARCHAR(255) NOT NULL COMMENT 'Anzeigename',
  href VARCHAR(500) NOT NULL COMMENT 'URL',
  icon_name VARCHAR(100) DEFAULT NULL COMMENT 'Icon-Name',
  order_index INT DEFAULT 0 COMMENT 'Reihenfolge',
  badge_text VARCHAR(50) DEFAULT NULL COMMENT 'Badge-Text (optional)',
  badge_color VARCHAR(50) DEFAULT NULL COMMENT 'Badge-Farbe',
  dynamic_badge BOOLEAN DEFAULT FALSE COMMENT 'Badge wird dynamisch geladen',
  badge_api_endpoint VARCHAR(500) DEFAULT NULL COMMENT 'API-Endpoint für dynamisches Badge',
  is_active BOOLEAN DEFAULT TRUE,
  requires_permission VARCHAR(255) DEFAULT NULL COMMENT 'Benötigte Berechtigung (optional)',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (navigation_item_id) REFERENCES admin_navigation_items(id) ON DELETE CASCADE,
  INDEX idx_navigation_item_id (navigation_item_id),
  INDEX idx_order_index (order_index),
  INDEX idx_is_active (is_active),
  INDEX idx_requires_permission (requires_permission)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Admin Navigation Sub Items';

-- =====================================================
-- 3. INITIAL DATA - Standard-Navigation einfügen
-- =====================================================

-- Dashboard
INSERT INTO admin_navigation_items (name, href, icon_name, description, order_index) VALUES
('Dashboard', '/admin', 'FaHome', 'Übersicht & KPIs', 1);

-- Content Management
INSERT INTO admin_navigation_items (name, icon_name, description, order_index) VALUES
('Content Management', 'FaFileAlt', 'Inhalte verwalten & bearbeiten', 2);

SET @content_mgmt_id = LAST_INSERT_ID();

INSERT INTO admin_navigation_sub_items (navigation_item_id, name, href, icon_name, order_index) VALUES
(@content_mgmt_id, 'Seitenverwaltung', '/admin/content/pages', 'FaFileAlt', 1),
(@content_mgmt_id, 'Header & Footer', '/admin/content/header-footer', 'FaCog', 2),
(@content_mgmt_id, 'Hero-Section', '/admin/content/hero', 'FaChartLine', 3),
(@content_mgmt_id, 'Texte & Übersetzungen', '/admin/content/texts', 'FaBook', 4),
(@content_mgmt_id, 'Medien-Upload', '/admin/content/media', 'FaDatabase', 5),
(@content_mgmt_id, 'Menü-Navigation', '/admin/content/navigation', 'FaProjectDiagram', 6),
(@content_mgmt_id, 'A/B-Testing & Experimente', '/admin/ab-experiments', 'FaChartLine', 7);

-- Kundenverwaltung
INSERT INTO admin_navigation_items (name, icon_name, description, order_index) VALUES
('Kundenverwaltung', 'FaUsers', 'Zentrale Kunden- und Firmenverwaltung', 3);

SET @customers_id = LAST_INSERT_ID();

INSERT INTO admin_navigation_sub_items (navigation_item_id, name, href, icon_name, order_index) VALUES
(@customers_id, 'Kundenliste', '/admin/customers', 'FaUsers', 1),
(@customers_id, 'Neuen Kunden hinzufügen', '/admin/customers/new', 'FaPlus', 2),
(@customers_id, 'Kunden-Import', '/admin/customers/import', 'FaDatabase', 3),
(@customers_id, 'Kunden-Statistiken', '/admin/customers/stats', 'FaChartLine', 4);

-- Compliance
INSERT INTO admin_navigation_items (name, icon_name, description, order_index) VALUES
('Compliance', 'FaShieldAlt', 'Compliance & Datenschutz', 4);

SET @compliance_id = LAST_INSERT_ID();

INSERT INTO admin_navigation_sub_items (navigation_item_id, name, href, icon_name, order_index) VALUES
(@compliance_id, 'DSGVO-Compliance', '/admin/compliance/dsgvo', 'FaShieldAlt', 1),
(@compliance_id, 'GoBD-Compliance', '/admin/compliance/gobd', 'FaShieldAlt', 2),
(@compliance_id, 'Audit-Logs', '/admin/audit-logs', 'FaHistory', 3),
(@compliance_id, 'Policy-Management', '/admin/policies', 'FaFileAlt', 4);

-- System-Einstellungen
INSERT INTO admin_navigation_items (name, icon_name, description, order_index) VALUES
('System-Einstellungen', 'FaCog', 'System-Konfiguration', 5);

SET @system_id = LAST_INSERT_ID();

INSERT INTO admin_navigation_sub_items (navigation_item_id, name, href, icon_name, order_index) VALUES
(@system_id, 'Rollen & Berechtigungen', '/admin/roles', 'FaUsers', 1),
(@system_id, 'Admin-Privilegien', '/admin/privileges', 'FaShieldAlt', 2),
(@system_id, 'Navigation-Verwaltung', '/admin/navigation', 'FaProjectDiagram', 3),
(@system_id, 'Qualitäts-Dashboard', '/admin/quality', 'FaCheckCircle', 4),
(@system_id, 'Pre-Release Checklisten', '/admin/release/checklist', 'FaCheckSquare', 5),
(@system_id, 'Versions-Freigaben', '/admin/release/approval', 'FaCheckCircle', 6);

-- Marketing & Kommunikation
INSERT INTO admin_navigation_items (name, icon_name, description, order_index) VALUES
('Marketing & Kommunikation', 'FaBell', 'Marketing-Tools & Content', 6);

SET @marketing_id = LAST_INSERT_ID();

INSERT INTO admin_navigation_sub_items (navigation_item_id, name, href, icon_name, order_index) VALUES
(@marketing_id, 'Blog-Artikel', '/admin/marketing/blog', 'FaFileAlt', 1),
(@marketing_id, 'News & Updates', '/admin/marketing/news', 'FaBell', 2),
(@marketing_id, 'Newsletter', '/admin/marketing/newsletter', 'FaBell', 3),
(@marketing_id, 'SEO & Meta-Tags', '/admin/marketing/seo', 'FaChartLine', 4),
(@marketing_id, 'LinkedIn-Content-Plan', '/admin/marketing/linkedin-content-plan', 'LinkedInIcon', 5);

-- Projekte
INSERT INTO admin_navigation_items (name, icon_name, description, order_index) VALUES
('Projekte', 'FaProjectDiagram', 'Projektmanagement', 7);

SET @projects_id = LAST_INSERT_ID();

INSERT INTO admin_navigation_sub_items (navigation_item_id, name, href, icon_name, order_index) VALUES
(@projects_id, 'Projektübersicht', '/admin/projects', 'FaProjectDiagram', 1),
(@projects_id, 'Kanban', '/admin/projects/kanban', 'FaChartLine', 2),
(@projects_id, 'Kalender', '/admin/projects/calendar', 'FaCalendarAlt', 3);

-- Support
INSERT INTO admin_navigation_items (name, icon_name, description, order_index) VALUES
('Support', 'FaTools', 'IT-Support & Tickets', 8);

SET @support_id = LAST_INSERT_ID();

INSERT INTO admin_navigation_sub_items (navigation_item_id, name, href, icon_name, order_index, badge_text, badge_color, dynamic_badge, badge_api_endpoint) VALUES
(@support_id, 'Tickets', '/admin/support', 'FaTicketAlt', 1, '7', 'bg-red-500', FALSE, NULL),
(@support_id, 'Kontakt-Nachrichten', '/admin/support/contact-messages', 'FaEnvelope', 2, '0', 'bg-red-500', TRUE, '/api/admin/support/contact-stats'),
(@support_id, 'Wissensdatenbank', '/admin/support/knowledge', 'FaBook', 3, NULL, NULL, FALSE, NULL);

-- Dokumentation
INSERT INTO admin_navigation_items (name, icon_name, description, order_index) VALUES
('Dokumentation', 'FaBook', 'System-Dokumentation', 9);

SET @docs_id = LAST_INSERT_ID();

INSERT INTO admin_navigation_sub_items (navigation_item_id, name, href, icon_name, order_index) VALUES
(@docs_id, 'System-Dokumentation', '/admin/docs', 'FaBook', 1),
(@docs_id, 'How-To Anleitungen', '/admin/docs/howto', 'FaFileAlt', 2),
(@docs_id, 'Change-Log', '/admin/docs/changelog', 'FaHistory', 3),
(@docs_id, 'Interne Hinweise', '/admin/docs/internal', 'FaStickyNote', 4);

-- Hilfe & Support
INSERT INTO admin_navigation_items (name, icon_name, description, order_index) VALUES
('Hilfe & Support', 'FaBook', 'Hilfe-Center', 10);

SET @help_id = LAST_INSERT_ID();

INSERT INTO admin_navigation_sub_items (navigation_item_id, name, href, icon_name, order_index) VALUES
(@help_id, 'Hilfe-Center', '/admin/help', 'FaBook', 1),
(@help_id, 'FAQ', '/admin/help/faq', 'FaListAlt', 2),
(@help_id, 'Tutorials', '/admin/help/tutorials', 'FaBook', 3);

-- Reports
INSERT INTO admin_navigation_items (name, icon_name, description, order_index) VALUES
('Reports', 'FaChartLine', 'Berichte & Analysen', 11);

SET @reports_id = LAST_INSERT_ID();

INSERT INTO admin_navigation_sub_items (navigation_item_id, name, href, icon_name, order_index) VALUES
(@reports_id, 'Umsatz-Reports', '/admin/reports/revenue', 'FaChartLine', 1),
(@reports_id, 'Media AI Performance', '/admin/reports/media-ai', 'FaChartLine', 2),
(@reports_id, 'Backup-Verlauf', '/admin/reports/backups', 'FaDatabase', 3),
(@reports_id, 'Systemmeldungen', '/admin/reports/system-messages', 'FaBell', 4),
(@reports_id, 'Monitoring-Übersicht', '/admin/reports/monitoring', 'FaChartLine', 5);

