-- =====================================================
-- MIGRATION: Async-Processing-Felder für KI-Analyse
-- =====================================================
-- Erstellt: 2025-01-27
-- Zweck: Erweiterung um Async-Processing-Felder
-- MySQL 8.0+ kompatibel
-- Enterprise++ Standard
-- =====================================================

USE lopez_it_welt;

-- AI-Status für Async-Processing
-- pending: Wartet auf Verarbeitung
-- running: Wird aktuell verarbeitet
-- done: Erfolgreich abgeschlossen
-- error: Fehler aufgetreten
ALTER TABLE lopez_business_media 
ADD COLUMN ai_status ENUM('pending', 'running', 'done', 'error') DEFAULT 'pending' AFTER ai_analyzed_at;

-- Fehlermeldung bei fehlgeschlagener Analyse
ALTER TABLE lopez_business_media 
ADD COLUMN ai_error_message TEXT NULL AFTER ai_status;

-- Retry-Zähler (wie oft wurde bereits retry versucht)
ALTER TABLE lopez_business_media 
ADD COLUMN ai_retry_count INT DEFAULT 0 AFTER ai_error_message;

-- Timestamp des letzten Retry-Versuchs
ALTER TABLE lopez_business_media 
ADD COLUMN ai_last_retry_at TIMESTAMP NULL AFTER ai_retry_count;

-- Indizes für Performance
-- Wichtig: ai_status wird häufig für Queries verwendet
CREATE INDEX idx_ai_status ON lopez_business_media(ai_status);

-- Kombinierter Index für effiziente Pending-Query
-- Holt Medien mit ai_status = 'pending' und ai_retry_count < max
CREATE INDEX idx_ai_pending_retry ON lopez_business_media(ai_status, ai_retry_count);

-- =====================================================
-- MIGRATION ABGESCHLOSSEN
-- =====================================================

