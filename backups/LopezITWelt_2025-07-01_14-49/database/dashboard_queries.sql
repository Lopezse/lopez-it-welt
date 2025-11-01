-- =====================================================
-- Dashboard-Abfragen für Lopez IT Welt Lernsystem
-- =====================================================
-- Zweck: Nützliche SQL-Abfragen für Statistiken und Analysen
-- =====================================================

USE lopez_it_welt;

-- =====================================================
-- 1. ÜBERSICHT-ABFRAGEN
-- =====================================================

-- Letzte 10 Sessions (für Dashboard-Widget)
SELECT 
    id,
    beschreibung,
    start_time,
    end_time,
    dauer_min,
    status,
    kategorie,
    prioritaet
FROM work_sessions 
ORDER BY start_time DESC 
LIMIT 10;

-- Heute gearbeitete Zeit
SELECT 
    SUM(dauer_min) as heute_minuten,
    COUNT(*) as anzahl_sessions,
    ROUND(AVG(dauer_min), 2) as durchschnitt_dauer
FROM work_sessions 
WHERE DATE(start_time) = CURDATE() AND end_time IS NOT NULL;

-- Aktuelle Session (falls vorhanden)
SELECT 
    id,
    beschreibung,
    start_time,
    TIMESTAMPDIFF(MINUTE, start_time, NOW()) as laufzeit_min,
    kategorie,
    prioritaet,
    status
FROM work_sessions 
WHERE end_time IS NULL
ORDER BY start_time DESC
LIMIT 1;

-- =====================================================
-- 2. STATISTIK-ABFRAGEN
-- =====================================================

-- Erfolgsrate der letzten 7 Tage
SELECT 
    ROUND((SUM(CASE WHEN status = 'gut' THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) as erfolgsrate_prozent,
    COUNT(*) as gesamt_sessions,
    SUM(CASE WHEN status = 'gut' THEN 1 ELSE 0 END) as anzahl_gut,
    SUM(CASE WHEN status = 'schlecht' THEN 1 ELSE 0 END) as anzahl_schlecht,
    SUM(CASE WHEN status = 'abgebrochen' THEN 1 ELSE 0 END) as anzahl_abgebrochen
FROM work_sessions 
WHERE start_time >= DATE_SUB(NOW(), INTERVAL 7 DAY) AND end_time IS NOT NULL;

-- Wöchentliche Übersicht (letzte 4 Wochen)
SELECT 
    YEARWEEK(start_time) as woche,
    DATE(MIN(start_time)) as wochenstart,
    COUNT(*) as anzahl_sessions,
    SUM(dauer_min) as gesamt_minuten,
    ROUND(AVG(dauer_min), 2) as durchschnitt_dauer,
    SUM(CASE WHEN status = 'gut' THEN 1 ELSE 0 END) as anzahl_gut,
    SUM(CASE WHEN status = 'schlecht' THEN 1 ELSE 0 END) as anzahl_schlecht,
    ROUND((SUM(CASE WHEN status = 'gut' THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) as erfolgsrate_prozent
FROM work_sessions 
WHERE start_time >= DATE_SUB(NOW(), INTERVAL 4 WEEK) AND end_time IS NOT NULL
GROUP BY YEARWEEK(start_time)
ORDER BY woche DESC;

-- =====================================================
-- 3. KATEGORIE-ANALYSEN
-- =====================================================

-- Durchschnittliche Dauer nach Kategorie
SELECT 
    kategorie,
    COUNT(*) as anzahl_sessions,
    SUM(dauer_min) as gesamt_minuten,
    ROUND(AVG(dauer_min), 2) as durchschnitt_dauer,
    SUM(CASE WHEN status = 'gut' THEN 1 ELSE 0 END) as anzahl_gut,
    SUM(CASE WHEN status = 'schlecht' THEN 1 ELSE 0 END) as anzahl_schlecht,
    ROUND((SUM(CASE WHEN status = 'gut' THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) as erfolgsrate_prozent
FROM work_sessions 
WHERE end_time IS NOT NULL
GROUP BY kategorie 
ORDER BY gesamt_minuten DESC;

-- Zeitverteilung nach Kategorie (letzte 30 Tage)
SELECT 
    kategorie,
    SUM(dauer_min) as minuten,
    ROUND((SUM(dauer_min) / (SELECT SUM(dauer_min) FROM work_sessions WHERE start_time >= DATE_SUB(NOW(), INTERVAL 30 DAY) AND end_time IS NOT NULL)) * 100, 2) as prozent
FROM work_sessions 
WHERE start_time >= DATE_SUB(NOW(), INTERVAL 30 DAY) AND end_time IS NOT NULL
GROUP BY kategorie
ORDER BY minuten DESC;

-- =====================================================
-- 4. LERNSYSTEM-ANALYSEN
-- =====================================================

-- Häufigste Ursachen für Probleme
SELECT 
    ursache,
    COUNT(*) as haeufigkeit,
    ROUND(AVG(dauer_min), 2) as durchschnitt_dauer,
    MIN(start_time) as erstes_auftreten,
    MAX(start_time) as letztes_auftreten
FROM work_sessions 
WHERE status = 'schlecht' AND ursache IS NOT NULL 
GROUP BY ursache 
ORDER BY haeufigkeit DESC
LIMIT 10;

-- Lektionen-Trends (was wird gelernt)
SELECT 
    lektion,
    COUNT(*) as anzahl_anwendungen,
    MIN(start_time) as erstes_auftreten,
    MAX(start_time) as letztes_auftreten
FROM work_sessions 
WHERE lektion IS NOT NULL
GROUP BY lektion
ORDER BY anzahl_anwendungen DESC
LIMIT 10;

-- Nächste Schritte (was wird geplant)
SELECT 
    naechster_schritt,
    COUNT(*) as anzahl_planungen,
    MIN(start_time) as erstes_auftreten,
    MAX(start_time) as letztes_auftreten
FROM work_sessions 
WHERE naechster_schritt IS NOT NULL
GROUP BY naechster_schritt
ORDER BY anzahl_planungen DESC
LIMIT 10;

-- =====================================================
-- 5. PRODUKTIVITÄTS-ANALYSEN
-- =====================================================

-- Tagesproduktivität (letzte 30 Tage)
SELECT 
    DATE(start_time) as datum,
    COUNT(*) as anzahl_sessions,
    SUM(dauer_min) as gesamt_minuten,
    ROUND(AVG(dauer_min), 2) as durchschnitt_dauer,
    SUM(CASE WHEN status = 'gut' THEN 1 ELSE 0 END) as anzahl_gut,
    SUM(CASE WHEN status = 'schlecht' THEN 1 ELSE 0 END) as anzahl_schlecht,
    ROUND((SUM(CASE WHEN status = 'gut' THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) as erfolgsrate_prozent
FROM work_sessions 
WHERE start_time >= DATE_SUB(NOW(), INTERVAL 30 DAY) AND end_time IS NOT NULL
GROUP BY DATE(start_time)
ORDER BY datum DESC;

-- Stündliche Produktivität (durchschnittlich)
SELECT 
    HOUR(start_time) as stunde,
    COUNT(*) as anzahl_sessions,
    SUM(dauer_min) as gesamt_minuten,
    ROUND(AVG(dauer_min), 2) as durchschnitt_dauer,
    SUM(CASE WHEN status = 'gut' THEN 1 ELSE 0 END) as anzahl_gut,
    SUM(CASE WHEN status = 'schlecht' THEN 1 ELSE 0 END) as anzahl_schlecht,
    ROUND((SUM(CASE WHEN status = 'gut' THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) as erfolgsrate_prozent
FROM work_sessions 
WHERE end_time IS NOT NULL
GROUP BY HOUR(start_time)
ORDER BY stunde;

-- =====================================================
-- 6. PRIORITÄTS-ANALYSEN
-- =====================================================

-- Zeitverteilung nach Priorität
SELECT 
    prioritaet,
    COUNT(*) as anzahl_sessions,
    SUM(dauer_min) as gesamt_minuten,
    ROUND(AVG(dauer_min), 2) as durchschnitt_dauer,
    SUM(CASE WHEN status = 'gut' THEN 1 ELSE 0 END) as anzahl_gut,
    SUM(CASE WHEN status = 'schlecht' THEN 1 ELSE 0 END) as anzahl_schlecht,
    ROUND((SUM(CASE WHEN status = 'gut' THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) as erfolgsrate_prozent
FROM work_sessions 
WHERE end_time IS NOT NULL
GROUP BY prioritaet
ORDER BY FIELD(prioritaet, 'kritisch', 'hoch', 'mittel', 'niedrig');

-- =====================================================
-- 7. TREND-ANALYSEN
-- =====================================================

-- Monatliche Trends (letzte 12 Monate)
SELECT 
    DATE_FORMAT(start_time, '%Y-%m') as monat,
    COUNT(*) as anzahl_sessions,
    SUM(dauer_min) as gesamt_minuten,
    ROUND(AVG(dauer_min), 2) as durchschnitt_dauer,
    SUM(CASE WHEN status = 'gut' THEN 1 ELSE 0 END) as anzahl_gut,
    SUM(CASE WHEN status = 'schlecht' THEN 1 ELSE 0 END) as anzahl_schlecht,
    ROUND((SUM(CASE WHEN status = 'gut' THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) as erfolgsrate_prozent
FROM work_sessions 
WHERE start_time >= DATE_SUB(NOW(), INTERVAL 12 MONTH) AND end_time IS NOT NULL
GROUP BY DATE_FORMAT(start_time, '%Y-%m')
ORDER BY monat DESC;

-- =====================================================
-- 8. WARNUNGEN UND ALARME
-- =====================================================

-- Lange laufende Sessions (> 4 Stunden)
SELECT 
    id,
    beschreibung,
    start_time,
    TIMESTAMPDIFF(MINUTE, start_time, NOW()) as laufzeit_min,
    kategorie,
    prioritaet
FROM work_sessions 
WHERE end_time IS NULL AND TIMESTAMPDIFF(MINUTE, start_time, NOW()) > 240
ORDER BY laufzeit_min DESC;

-- Häufige Probleme (mehr als 3x in 30 Tagen)
SELECT 
    ursache,
    COUNT(*) as haeufigkeit
FROM work_sessions 
WHERE status = 'schlecht' 
    AND ursache IS NOT NULL 
    AND start_time >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY ursache 
HAVING COUNT(*) > 3
ORDER BY haeufigkeit DESC;

-- =====================================================
-- 9. EXPORT-ABFRAGEN
-- =====================================================

-- Vollständige Session-Daten für Export
SELECT 
    id,
    beschreibung,
    start_time,
    end_time,
    dauer_min,
    status,
    kategorie,
    prioritaet,
    bemerkung,
    ursache,
    lektion,
    naechster_schritt,
    erstellt_am,
    aktualisiert_am
FROM work_sessions 
ORDER BY start_time DESC;

-- =====================================================
-- 10. PERFORMANCE-OPTIMIERUNG
-- =====================================================

-- Sessions ohne Endzeit (möglicherweise vergessen)
SELECT 
    id,
    beschreibung,
    start_time,
    TIMESTAMPDIFF(MINUTE, start_time, NOW()) as laufzeit_min,
    kategorie,
    prioritaet
FROM work_sessions 
WHERE end_time IS NULL
ORDER BY start_time ASC;

-- =====================================================
-- ENDE DER ABFRAGEN
-- ===================================================== 