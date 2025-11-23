-- UTF-8 Fix Complete SQL
-- Erstellt mit UTF-8 BOM für korrekte Umlaute
-- 
-- @author Ramiro Lopez Rodriguez
-- @version 1.0.0
-- @date 2025-09-29

-- Datenbank auf UTF-8 setzen
ALTER DATABASE lopez_it_welt CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Hero-Daten mit korrekten Umlauten aktualisieren
UPDATE content_hero SET 
  title = 'Lopez IT Welt',
  subtitle = 'Professionelle IT-Lösungen',
  description = 'Wir entwickeln maßgeschneiderte Software-Lösungen mit Fokus auf Barrierefreiheit und persönliche Betreuung. Von der Konzeption bis zur Umsetzung - Ihr Partner für digitale Innovation.',
  button_text = 'Jetzt beraten lassen',
  button_link = '/kontakt',
  updated_at = CURRENT_TIMESTAMP
WHERE id = 1;

-- Header-Daten mit korrekten Umlauten aktualisieren
UPDATE content_header SET 
  logo_text = 'Lopez IT Welt',
  navigation_items = '[{"label": "Leistungen", "link": "/leistungen", "type": "link"}, {"label": "Projekte", "link": "/projekte", "type": "link"}, {"label": "Kontakt", "link": "/kontakt", "type": "link"}]',
  updated_at = CURRENT_TIMESTAMP
WHERE id = 1;

-- Footer-Daten mit korrekten Umlauten aktualisieren
UPDATE lopez_footer SET 
  title = 'Lopez IT Welt',
  content = 'Professionelle IT-Lösungen mit Fokus auf Barrierefreiheit und persönliche Betreuung.'
WHERE id = 'b2d0d6f6-9c97-11f0-aa51-bcaec52625d4';

-- Test-Tabelle für UTF-8 Tests
DROP TABLE IF EXISTS test_utf8;
CREATE TABLE test_utf8 (
  id INT AUTO_INCREMENT PRIMARY KEY,
  txt VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Test-Daten mit korrekten Umlauten einfügen
INSERT INTO test_utf8 (txt) VALUES 
  ('Lösungen Test'),
  ('maßgeschneiderte Software'),
  ('persönliche Betreuung'),
  ('für digitale Innovation'),
  ('ö, ä, ü, ß Test'),
  ('Professionelle IT-Lösungen'),
  ('Wir entwickeln maßgeschneiderte Software-Lösungen mit Fokus auf Barrierefreiheit und persönliche Betreuung.');

-- Test-Ergebnisse anzeigen
SELECT 'Hero-Daten:' as section, id, title, subtitle, description FROM content_hero WHERE id = 1
UNION ALL
SELECT 'Header-Daten:' as section, id, logo_text, navigation_items, '' FROM content_header WHERE id = 1
UNION ALL
SELECT 'Footer-Daten:' as section, id, title, content, '' FROM lopez_footer WHERE id = 'b2d0d6f6-9c97-11f0-aa51-bcaec52625d4'
UNION ALL
SELECT 'Test-Daten:' as section, id, txt, '', '' FROM test_utf8 ORDER BY id;

