-- =====================================================
-- MIGRATION: KI-Felder für lopez_business_media
-- =====================================================
-- Erstellt: 2025-11-25
-- Zweck: Erweiterung der Medien-Tabelle um KI-Funktionen
-- MySQL 8.0+ kompatibel
-- Enterprise++ Standard
-- =====================================================

USE lopez_it_welt;

-- Verknüpfung zum File-System (Hash-ID)
ALTER TABLE lopez_business_media 
ADD COLUMN media_hash_id VARCHAR(16) NULL AFTER id;

-- KI-Tags (JSON-Array für schnelle Suche)
ALTER TABLE lopez_business_media 
ADD COLUMN ai_tags JSON NULL AFTER tags;

-- KI-generierter Alt-Text
ALTER TABLE lopez_business_media 
ADD COLUMN ai_description TEXT NULL AFTER alt_text;

-- Qualitäts-Score (0-100)
-- Hinweis: CHECK-Constraint wird separat hinzugefügt (MySQL 8.0.16+)
ALTER TABLE lopez_business_media 
ADD COLUMN ai_quality_score DECIMAL(5,2) NULL;

-- Qualitäts-Warnungen (JSON-Array)
ALTER TABLE lopez_business_media 
ADD COLUMN ai_quality_warnings JSON NULL;

-- KI-Kategorie-Vorschlag
ALTER TABLE lopez_business_media 
ADD COLUMN ai_category_suggestion VARCHAR(50) NULL;

-- Personenerkennung (DSGVO-Flag)
ALTER TABLE lopez_business_media 
ADD COLUMN has_person BOOLEAN DEFAULT FALSE;

-- Text-Erkennung im Bild
ALTER TABLE lopez_business_media 
ADD COLUMN has_text_in_image BOOLEAN DEFAULT FALSE;

-- CI-Compliance (JSON)
ALTER TABLE lopez_business_media 
ADD COLUMN ai_ci_compliance JSON NULL;

-- Similarity-Hash für Dublettenerkennung
ALTER TABLE lopez_business_media 
ADD COLUMN similarity_hash VARCHAR(64) NULL;

-- KI-Metadaten (flexibles JSON)
ALTER TABLE lopez_business_media 
ADD COLUMN ai_metadata JSON NULL;

-- Timestamp für KI-Analyse
ALTER TABLE lopez_business_media 
ADD COLUMN ai_analyzed_at TIMESTAMP NULL;

-- Admin-Freigaben (KI-Vorschläge)
ALTER TABLE lopez_business_media 
ADD COLUMN tags_approved BOOLEAN DEFAULT FALSE;

ALTER TABLE lopez_business_media 
ADD COLUMN alt_approved BOOLEAN DEFAULT FALSE;

ALTER TABLE lopez_business_media 
ADD COLUMN category_approved BOOLEAN DEFAULT FALSE;

-- DSGVO-Freigabe (wichtig für Personenerkennung)
ALTER TABLE lopez_business_media 
ADD COLUMN dsgvo_approved_by_admin BOOLEAN DEFAULT FALSE;

ALTER TABLE lopez_business_media 
ADD COLUMN dsgvo_approved_at TIMESTAMP NULL;

ALTER TABLE lopez_business_media 
ADD COLUMN dsgvo_approved_by VARCHAR(36) NULL;

-- Indizes für Performance
CREATE INDEX idx_media_hash_id ON lopez_business_media(media_hash_id);
CREATE INDEX idx_ai_category ON lopez_business_media(ai_category_suggestion);
CREATE INDEX idx_has_person ON lopez_business_media(has_person);
CREATE INDEX idx_similarity_hash ON lopez_business_media(similarity_hash);
CREATE INDEX idx_ai_analyzed_at ON lopez_business_media(ai_analyzed_at);
CREATE INDEX idx_dsgvo_approved ON lopez_business_media(dsgvo_approved_by_admin);

-- JSON-Index für ai_tags (MySQL 8.0.17+)
-- Hinweis: Funktioniert nur wenn JSON-Array vorhanden
-- ALTER TABLE lopez_business_media ADD INDEX idx_ai_tags ((CAST(ai_tags AS CHAR(255) ARRAY)));

-- =====================================================
-- MIGRATION ABGESCHLOSSEN
-- =====================================================

