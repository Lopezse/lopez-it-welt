-- =====================================================
-- LOPEZ IT WELT FOOTER SYSTEM - ENTERPRISE++ VERSION
-- =====================================================

-- Tabelle löschen falls vorhanden
DROP TABLE IF EXISTS `lopez_footer`;

-- Footer-Tabelle erstellen
CREATE TABLE `lopez_footer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `section` enum('unternehmen','leistungen','kontakt','rechtliches') NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text,
  `link_url` varchar(500) DEFAULT NULL,
  `language` enum('de','en','es') NOT NULL DEFAULT 'de',
  `sort_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `section_language` (`section`,`language`),
  KEY `sort_order` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- DEUTSCHE DATEN - NUR RECHTLICHES & ZUSATZ-LINKS
-- =====================================================

-- Rechtliches
INSERT INTO `lopez_footer` (`section`, `title`, `content`, `link_url`, `language`, `sort_order`) VALUES
('rechtliches', 'Impressum', 'Angaben gemäß § 5 TMG', '/impressum', 'de', 1),
('rechtliches', 'Datenschutz', 'Datenschutzerklärung', '/datenschutz', 'de', 2),
('rechtliches', 'AGB', 'Allgemeine Geschäftsbedingungen', '/agb', 'de', 3),
('rechtliches', 'Cookie-Einstellungen', 'Cookie-Verwaltung', '/cookies', 'de', 4);

-- Zusatz-Links (optional)
INSERT INTO `lopez_footer` (`section`, `title`, `content`, `link_url`, `language`, `sort_order`) VALUES
('unternehmen', 'Über uns', 'Unser Unternehmen', '/ueber-uns', 'de', 1),
('unternehmen', 'Karriere', 'Jobs & Karriere', '/karriere', 'de', 2),
('unternehmen', 'News', 'Aktuelles', '/news', 'de', 3),
('unternehmen', 'Presse', 'Pressebereich', '/presse', 'de', 4);

-- Leistungen (optional)
INSERT INTO `lopez_footer` (`section`, `title`, `content`, `link_url`, `language`, `sort_order`) VALUES
('leistungen', 'IT-Support', 'Professioneller IT-Support', '/it-support', 'de', 1),
('leistungen', 'Hardware', 'Hardware-Lösungen', '/hardware', 'de', 2),
('leistungen', 'Webdesign', 'Webdesign & Entwicklung', '/webdesign', 'de', 3),
('leistungen', 'AI & Cloud', 'KI & Cloud-Services', '/ai-cloud', 'de', 4);

-- Kontakt (optional)
INSERT INTO `lopez_footer` (`section`, `title`, `content`, `link_url`, `language`, `sort_order`) VALUES
('kontakt', 'Kontakt', 'Kontakt aufnehmen', '/kontakt', 'de', 1),
('kontakt', 'Support', '24/7 Support', '/support', 'de', 2),
('kontakt', 'Standorte', 'Unsere Standorte', '/standorte', 'de', 3),
('kontakt', 'Partner', 'Partner werden', '/partner', 'de', 4);

-- =====================================================
-- ENGLISCHE DATEN - NUR RECHTLICHES & ZUSATZ-LINKS
-- =====================================================

-- Rechtliches
INSERT INTO `lopez_footer` (`section`, `title`, `content`, `link_url`, `language`, `sort_order`) VALUES
('rechtliches', 'Imprint', 'Information according to § 5 TMG', '/imprint', 'en', 1),
('rechtliches', 'Privacy', 'Privacy Policy', '/privacy', 'en', 2),
('rechtliches', 'Terms', 'Terms and Conditions', '/terms', 'en', 3),
('rechtliches', 'Cookie Settings', 'Cookie Management', '/cookies', 'en', 4);

-- Zusatz-Links
INSERT INTO `lopez_footer` (`section`, `title`, `content`, `link_url`, `language`, `sort_order`) VALUES
('unternehmen', 'About Us', 'Our Company', '/about-us', 'en', 1),
('unternehmen', 'Careers', 'Jobs & Careers', '/careers', 'en', 2),
('unternehmen', 'News', 'Latest News', '/news', 'en', 3),
('unternehmen', 'Press', 'Press Area', '/press', 'en', 4);

-- Leistungen
INSERT INTO `lopez_footer` (`section`, `title`, `content`, `link_url`, `language`, `sort_order`) VALUES
('leistungen', 'IT Support', 'Professional IT Support', '/it-support', 'en', 1),
('leistungen', 'Hardware', 'Hardware Solutions', '/hardware', 'en', 2),
('leistungen', 'Web Design', 'Web Design & Development', '/web-design', 'en', 3),
('leistungen', 'AI & Cloud', 'AI & Cloud Services', '/ai-cloud', 'en', 4);

-- Kontakt
INSERT INTO `lopez_footer` (`section`, `title`, `content`, `link_url`, `language`, `sort_order`) VALUES
('kontakt', 'Contact', 'Get in Touch', '/contact', 'en', 1),
('kontakt', 'Support', '24/7 Support', '/support', 'en', 2),
('kontakt', 'Locations', 'Our Locations', '/locations', 'en', 3),
('kontakt', 'Partners', 'Become a Partner', '/partners', 'en', 4);

-- =====================================================
-- SPANISCHE DATEN - NUR RECHTLICHES & ZUSATZ-LINKS
-- =====================================================

-- Rechtliches
INSERT INTO `lopez_footer` (`section`, `title`, `content`, `link_url`, `language`, `sort_order`) VALUES
('rechtliches', 'Aviso Legal', 'Información según § 5 TMG', '/aviso-legal', 'es', 1),
('rechtliches', 'Privacidad', 'Política de Privacidad', '/privacidad', 'es', 2),
('rechtliches', 'Términos', 'Términos y Condiciones', '/terminos', 'es', 3),
('rechtliches', 'Configuración de Cookies', 'Gestión de Cookies', '/cookies', 'es', 4);

-- Zusatz-Links
INSERT INTO `lopez_footer` (`section`, `title`, `content`, `link_url`, `language`, `sort_order`) VALUES
('unternehmen', 'Acerca de Nosotros', 'Nuestra Empresa', '/acerca-de-nosotros', 'es', 1),
('unternehmen', 'Carreras', 'Empleos y Carreras', '/carreras', 'es', 2),
('unternehmen', 'Noticias', 'Últimas Noticias', '/noticias', 'es', 3),
('unternehmen', 'Prensa', 'Área de Prensa', '/prensa', 'es', 4);

-- Leistungen
INSERT INTO `lopez_footer` (`section`, `title`, `content`, `link_url`, `language`, `sort_order`) VALUES
('leistungen', 'Soporte IT', 'Soporte IT Profesional', '/soporte-it', 'es', 1),
('leistungen', 'Hardware', 'Soluciones de Hardware', '/hardware', 'es', 2),
('leistungen', 'Diseño Web', 'Diseño y Desarrollo Web', '/diseno-web', 'es', 3),
('leistungen', 'IA y Cloud', 'Servicios de IA y Cloud', '/ia-cloud', 'es', 4);

-- Kontakt
INSERT INTO `lopez_footer` (`section`, `title`, `content`, `link_url`, `language`, `sort_order`) VALUES
('kontakt', 'Contacto', 'Ponte en Contacto', '/contacto', 'es', 1),
('kontakt', 'Soporte', 'Soporte 24/7', '/soporte', 'es', 2),
('kontakt', 'Ubicaciones', 'Nuestras Ubicaciones', '/ubicaciones', 'es', 3),
('kontakt', 'Socios', 'Conviértete en Socio', '/socios', 'es', 4);




