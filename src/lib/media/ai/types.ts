/**
 * KI-Services TypeScript Interfaces - Enterprise++ Standard
 * 
 * Gemeinsame Typen für alle KI-Services
 */

import type { MediaAI, MediaCICompliance, MediaAIMetadata } from "@/lib/media/linkedin-media";

/**
 * Basis-Interface für alle KI-Service-Ergebnisse
 */
export interface AIServiceResult<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    confidence?: number; // 0-1 (Konfidenz-Score)
}

/**
 * Tagging-Service Ergebnis
 */
export interface TaggingResult {
    tags: string[];
    confidence_scores: Record<string, number>; // Tag -> Konfidenz (0-1)
}

/**
 * Alt-Text-Service Ergebnis
 */
export interface AltTextResult {
    description: string;
    language: string; // "de" | "en" | "es"
    confidence: number;
}

/**
 * Quality-Check-Service Ergebnis
 */
export interface QualityCheckResult {
    score: number; // 0-100
    warnings: string[];
    recommendations: string[]; // z.B. ["Für Hero-Section ungeeignet, besser nur als kleines Bild verwenden"]
    resolution?: {
        width: number;
        height: number;
    };
    isSuitableFor?: {
        hero: boolean;
        thumbnail: boolean;
        card: boolean;
    };
}

/**
 * Category-Service Ergebnis
 */
export interface CategoryResult {
    category: string; // "screenshot" | "profilbild" | "produktfoto" | "illustration" | "diagramm"
    confidence: number;
    alternatives?: string[]; // Alternative Kategorien
}

/**
 * Similarity-Service Ergebnis
 */
export interface SimilarityResult {
    similar_media: Array<{
        media_id: string;
        similarity_score: number; // 0-1
        reason?: string; // Warum ähnlich
    }>;
}

/**
 * CI-Check-Service Ergebnis
 */
export interface CICheckResult {
    logo_detected: boolean;
    color_deviation: number; // 0-100
    warnings: string[];
    recommendations?: string[];
}

/**
 * Person-Detection-Service Ergebnis
 */
export interface PersonDetectionResult {
    has_person: boolean;
    person_count?: number;
    faces_detected?: number;
    requires_dsgvo_review: boolean; // Immer true wenn has_person = true
}

/**
 * Vollständiges KI-Analyse-Ergebnis
 */
export interface FullAIAnalysisResult {
    tags?: TaggingResult;
    alt_text?: AltTextResult;
    quality?: QualityCheckResult;
    category?: CategoryResult;
    similarity?: SimilarityResult;
    ci_compliance?: CICheckResult;
    person_detection?: PersonDetectionResult;
    analyzed_at: string; // ISO 8601 UTC
    model_version?: string;
}

/**
 * Smart-Search-Parameter
 */
export interface SmartSearchParams {
    query: string; // z.B. "blauer Hintergrund mit Laptop"
    category?: string;
    limit?: number;
    min_confidence?: number;
}

/**
 * Smart-Search-Ergebnis
 */
export interface SmartSearchResult {
    media_id: string;
    relevance_score: number; // 0-1
    matched_tags?: string[];
    matched_description?: string;
}






