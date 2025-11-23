-- =====================================================
-- KORREKTUR - A/B-TESTING & HERO CONTENT
-- Datum: 2025-10-31 14:24:09
-- Zweck: Platzhalter entfernen, Standard-Texte wiederherstellen
-- =====================================================

-- UTF-8 für diese Sitzung erzwingen (Sicherheitsnetz)
SET NAMES utf8mb4;

-- 1. Standard-Texte bei ID=1 korrekt setzen (Umlaute + Button + Link)
UPDATE content_hero
SET
  title        = 'Lopez IT Welt',
  subtitle     = 'Professionelle IT-Lösungen',
  description  = 'Wir entwickeln maßgeschneiderte Software-Lösungen mit Fokus auf Barrierefreiheit und persönliche Betreuung.',
  button_text  = 'Jetzt beraten lassen',
  button_link  = '/kontakt',
  updated_at   = CURRENT_TIMESTAMP
WHERE id = 1;

-- 2. Platzhalter löschen
DELETE FROM content_hero WHERE id IN (2, 3);

-- 3. Überprüfung: Zeige aktualisierte Einträge
SELECT 
    id,
    title,
    subtitle,
    description,
    button_text,
    button_link,
    is_active,
    updated_at
FROM content_hero
ORDER BY id;


