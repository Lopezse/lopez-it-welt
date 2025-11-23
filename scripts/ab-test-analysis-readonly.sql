-- =====================================================
-- READ-ONLY ANALYSE - A/B-TESTING & HERO CONTENT
-- Datum: 2025-10-31 14:24:09
-- Zweck: Platzhalter finden, Zeichensatz prüfen
-- WICHTIG: NUR SELECT-Statements, KEINE Änderungen!
-- =====================================================

-- 1. CHARACTER SET VARIABLES prüfen
SHOW VARIABLES LIKE 'character_set_%';

-- 2. COLLATION VARIABLES prüfen
SHOW VARIABLES LIKE 'collation_%';

-- 3. SCHEMA-Informationen prüfen
SELECT 
    table_schema, 
    DEFAULT_CHARACTER_SET_NAME, 
    DEFAULT_COLLATION_NAME 
FROM information_schema.SCHEMATA 
WHERE schema_name IN ('lopez_it_welt', 'lopez_erp');

-- 4. TABELLEN-COLLATION prüfen (lopez_it_welt)
SELECT 
    TABLE_NAME, 
    TABLE_COLLATION,
    TABLE_TYPE
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = 'lopez_it_welt'
ORDER BY TABLE_NAME;

-- 5. SPALTEN-Informationen für content_hero prüfen
SELECT 
    COLUMN_NAME,
    CHARACTER_SET_NAME,
    COLLATION_NAME,
    DATA_TYPE,
    CHARACTER_MAXIMUM_LENGTH
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = 'lopez_it_welt' 
    AND TABLE_NAME = 'content_hero'
ORDER BY ORDINAL_POSITION;

-- 6. Platzhalter in content_hero suchen (alle Varianten)
SELECT 
    id,
    title,
    subtitle,
    description,
    button_text,
    button_link,
    is_active,
    created_at,
    updated_at
FROM content_hero 
WHERE 
    title LIKE '%Lösungen Test%' 
    OR title LIKE '%Test 1%'
    OR title LIKE '%Test 2%'
    OR title LIKE '%?%'
    OR subtitle LIKE '%Lösungen Test%'
    OR subtitle LIKE '%Test 1%'
    OR subtitle LIKE '%Test 2%'
    OR subtitle LIKE '%?%'
    OR description LIKE '%Lösungen Test%'
    OR description LIKE '%Test 1%'
    OR description LIKE '%Test 2%'
    OR description LIKE '%?%'
    OR button_text LIKE '%Lösungen Test%'
    OR button_text LIKE '%Test 1%'
    OR button_text LIKE '%Test 2%'
    OR button_text LIKE '%?%';

-- 7. ALLE content_hero Einträge (Vollständige Übersicht)
SELECT 
    id,
    title,
    subtitle,
    description,
    button_text,
    button_link,
    is_active,
    created_at,
    updated_at
FROM content_hero 
ORDER BY id;

-- 8. A/B-Test Konfiguration prüfen
SELECT 
    id,
    test_name,
    description,
    is_active,
    traffic_split,
    auto_activate_winner,
    auto_activate_threshold,
    auto_activate_days,
    variant_a_id,
    variant_b_id,
    created_at,
    updated_at
FROM ab_test_config
ORDER BY id;

-- 9. Hero A/B-Test Varianten prüfen (falls Tabelle existiert)
SELECT 
    id,
    test_id,
    variant_key,
    variant_name,
    weight,
    is_active,
    hero_content_id,
    created_at,
    updated_at
FROM hero_ab_tests
ORDER BY test_id, variant_key;

-- 10. Alternative Tabellen prüfen (falls content_hero nicht existiert)
SELECT TABLE_NAME 
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = 'lopez_it_welt' 
    AND (
        TABLE_NAME LIKE '%text%' 
        OR TABLE_NAME LIKE '%cms%' 
        OR TABLE_NAME LIKE '%marketing%'
        OR TABLE_NAME LIKE '%hero%'
        OR TABLE_NAME LIKE '%content%'
    )
ORDER BY TABLE_NAME;

-- 11. Aktive A/B-Test Statistiken prüfen
SELECT 
    hero_id,
    variant_name,
    device_type,
    impressions,
    clicks,
    conversions,
    ctr,
    conversion_rate,
    last_updated
FROM hero_test_stats
ORDER BY hero_id, variant_name, device_type;


