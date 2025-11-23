-- =====================================================
-- LOPEZ IT WELT SHOP - PRODUKTE DATEN
-- =====================================================

-- Kategorien einfügen
INSERT INTO lopez_shop_categories (name, description, icon, sort_order) VALUES
('IT-Support', 'Professioneller IT-Support und Wartung', 'FaCog', 1),
('Hardware', 'PC-Bau und Hardware-Lösungen', 'FaDesktop', 2),
('Webdesign', 'Webentwicklung und Design', 'FaCode', 3),
('KI-Lösungen', 'Künstliche Intelligenz und Automatisierung', 'FaRobot', 4),
('Cloud-Services', 'Cloud-Migration und -Management', 'FaCloud', 5),
('Cybersecurity', 'Sicherheitslösungen und -beratung', 'FaShieldAlt', 6);

-- Produkte einfügen
INSERT INTO lopez_shop_products (uuid, category_id, name, description, short_description, flow_type, price_model, base_price, is_featured, meta_title, meta_description) VALUES
-- IT-Support Produkte
('prod-001', 1, 'IT-Support – Remote 1h', 'Professioneller Remote-IT-Support pro Stunde. Schnelle Hilfe bei technischen Problemen, Software-Installation, Systemoptimierung und mehr.', 'Direkter Remote-Support pro Stunde', 'direct_buy', 'fixed', 99.00, TRUE, 'IT-Support Remote 1 Stunde - Lopez IT Welt', 'Professioneller Remote-IT-Support pro Stunde. Schnelle Hilfe bei technischen Problemen.'),
('prod-002', 1, 'IT-Support – Wartungsvertrag', 'Monatliches Support-Paket für Firmen und Privatkunden. Inklusive Remote-Support, Systemwartung und Präventivmaßnahmen.', 'Monatliches Support-Paket für Firmen & Privat', 'direct_buy', 'subscription', 299.00, TRUE, 'IT-Support Wartungsvertrag - Lopez IT Welt', 'Monatliches Support-Paket für Firmen und Privatkunden. Inklusive Remote-Support und Systemwartung.'),

-- Hardware Produkte
('prod-003', 2, 'PC-Bau – Gaming/Workstation', 'Maßgeschneiderte PC-Konfiguration für Gaming oder professionelle Workstations. Individuelle Beratung und optimale Hardware-Auswahl.', 'Maßgeschneiderte PC-Konfiguration inkl. Beratung', 'request_quote', 'custom', NULL, TRUE, 'PC-Bau Gaming Workstation - Lopez IT Welt', 'Maßgeschneiderte PC-Konfiguration für Gaming oder professionelle Workstations. Individuelle Beratung.'),

-- Webdesign Produkte
('prod-004', 3, 'Webdesign – Starterpaket', 'Komplettes Webdesign-Paket mit 5 Seiten, CI-Design und SEO-Basics. Perfekt für kleine Unternehmen und Startups.', '5 Seiten, CI-Design, SEO-Basics', 'request_quote', 'custom', 2500.00, TRUE, 'Webdesign Starterpaket - Lopez IT Welt', 'Komplettes Webdesign-Paket mit 5 Seiten, CI-Design und SEO-Basics. Perfekt für kleine Unternehmen.'),

-- KI-Lösungen
('prod-005', 4, 'KI-Assistent – Chatbot', 'Intelligente KI-Lösung für Kundenservice oder Automatisierung. Maßgeschneiderte Chatbot-Entwicklung für Ihr Unternehmen.', 'KI-Lösung für Kundenservice oder Automatisierung', 'request_quote', 'custom', NULL, TRUE, 'KI-Assistent Chatbot - Lopez IT Welt', 'Intelligente KI-Lösung für Kundenservice oder Automatisierung. Maßgeschneiderte Chatbot-Entwicklung.'),

-- Cloud-Services
('prod-006', 5, 'Cloud-Migration – M365 Paket', 'Professionelle Einrichtung und Umzug in Microsoft 365. Inklusive Datenmigration, Benutzerschulung und Support.', 'Einrichtung & Umzug in Microsoft 365', 'request_quote', 'custom', 1500.00, TRUE, 'Cloud-Migration M365 - Lopez IT Welt', 'Professionelle Einrichtung und Umzug in Microsoft 365. Inklusive Datenmigration und Benutzerschulung.'),

-- Cybersecurity
('prod-007', 6, 'Cybersecurity Check', 'Umfassende Sicherheits-Analyse Ihres Systems inklusive detailliertem Report und konkreten Empfehlungen zur Verbesserung.', 'Sicherheits-Analyse inkl. Report & Empfehlung', 'direct_buy', 'fixed', 799.00, TRUE, 'Cybersecurity Check - Lopez IT Welt', 'Umfassende Sicherheits-Analyse Ihres Systems inklusive detailliertem Report und konkreten Empfehlungen.');

-- Produktvarianten für Wartungsvertrag
INSERT INTO lopez_shop_product_variants (product_id, name, description, price, is_default) VALUES
(2, 'Basic Support', '5 Stunden Remote-Support pro Monat', 199.00, FALSE),
(2, 'Standard Support', '10 Stunden Remote-Support pro Monat', 299.00, TRUE),
(2, 'Premium Support', '20 Stunden Remote-Support pro Monat', 499.00, FALSE),
(2, 'Enterprise Support', 'Unbegrenzter Support + On-Site', 799.00, FALSE);

-- Produktvarianten für Webdesign Starterpaket
INSERT INTO lopez_shop_product_variants (product_id, name, description, price, is_default) VALUES
(4, 'Basic', '3 Seiten, Standard-Design', 1500.00, FALSE),
(4, 'Standard', '5 Seiten, CI-Design, SEO-Basics', 2500.00, TRUE),
(4, 'Premium', '8 Seiten, CI-Design, SEO-Advanced, CMS', 3999.00, FALSE);

-- Produktvarianten für Cloud-Migration M365
INSERT INTO lopez_shop_product_variants (product_id, name, description, price, is_default) VALUES
(6, 'Small Business', 'Bis zu 10 Benutzer', 1500.00, TRUE),
(6, 'Medium Business', 'Bis zu 50 Benutzer', 3500.00, FALSE),
(6, 'Enterprise', 'Unbegrenzte Benutzer + Custom Setup', 7500.00, FALSE);











