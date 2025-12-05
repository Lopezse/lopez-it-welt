/**
 * Person Detection Service - Enterprise++ Standard
 * 
 * Personenerkennung für DSGVO-Compliance
 * Stub-Implementierung (Mock)
 * 
 * WICHTIG: Keine automatische Freigabe - immer Admin-Entscheidung erforderlich
 */

import type { AIServiceResult, PersonDetectionResult } from "../types";
import { AI_CONFIG } from "../config";
import { consentService } from "@/lib/dsgvo/consent-service";

export class PersonDetectionService {
    private config = AI_CONFIG.person_detection;

    /**
     * Erkennt Personen in einem Bild
     * 
     * @param imageBuffer Bild-Daten als Buffer
     * @param mimeType MIME-Type des Bildes
     * @param userId Benutzer-ID für Consent-Prüfung (optional)
     * @returns Person-Detection-Ergebnis
     */
    async detect(
        imageBuffer: Buffer,
        mimeType: string,
        userId?: string
    ): Promise<AIServiceResult<PersonDetectionResult>> {
        if (!this.config.enabled) {
            return {
                success: false,
                error: "Person-Detection-Service ist deaktiviert",
            };
        }

        // Consent-Prüfung (DSGVO-konform)
        if (userId) {
            const hasConsent = await consentService.hasConsent(userId, "media_ki");
            if (!hasConsent) {
                return {
                    success: false,
                    error: "Keine Einwilligung für Media-KI-Verarbeitung",
                };
            }
        }

        // Mock-Implementierung (später durch echte KI ersetzbar)
        return this.mockDetect(imageBuffer, mimeType);
    }

    /**
     * Mock-Implementierung für Entwicklung
     * 
     * WICHTIG: has_person = true → requires_dsgvo_review = true (immer!)
     */
    private async mockDetect(
        imageBuffer: Buffer,
        mimeType: string
    ): Promise<AIServiceResult<PersonDetectionResult>> {
        // Simuliere Verarbeitungszeit
        await new Promise((resolve) => setTimeout(resolve, 150));

        // Mock-Personenerkennung (später durch echte KI-Analyse ersetzt)
        // In der echten Implementierung: z.B. Azure Face API, Google Vision, etc.
        const has_person = Math.random() > 0.6; // 40% Chance auf Person

        let person_count: number | undefined;
        let faces_detected: number | undefined;

        if (has_person) {
            person_count = Math.floor(Math.random() * 3) + 1; // 1-3 Personen
            faces_detected = person_count;
        }

        // ENTERPRISE++ REGEL: Person erkannt → IMMER DSGVO-Review erforderlich
        const requires_dsgvo_review = has_person;

        return {
            success: true,
            data: {
                has_person,
                person_count,
                faces_detected,
                requires_dsgvo_review, // Immer true wenn has_person = true
            },
            confidence: has_person ? 0.85 : 0.9,
        };
    }
}

// Singleton-Instanz
export const personDetectionService = new PersonDetectionService();




