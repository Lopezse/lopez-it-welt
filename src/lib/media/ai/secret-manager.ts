/**
 * Secret Manager - Enterprise++ Standard
 * 
 * Zentrale Klasse für Secret-Handling
 * Lädt Secrets zur Laufzeit, speichert sie niemals
 * 
 * @created 2025-01-27
 * @purpose Enterprise Secret-Handling
 */

/**
 * Secret-Referenz-Format
 * 
 * Unterstützte Formate:
 * - "ENV:VARIABLE_NAME" - Umgebungsvariable
 * - "MOCK" - Mock-Provider (kein Key nötig)
 * - Später erweiterbar: "VAULT:path/to/secret"
 */
export type SecretRef = string;

/**
 * Secret Manager Klasse
 * 
 * Kernprinzip: "Secrets are never stored, only referenced"
 */
export class SecretManager {
    /**
     * Lädt Secret basierend auf Referenz
     * 
     * @param secretRef Secret-Referenz (z.B. "ENV:OPENAI_API_KEY")
     * @returns Secret-Wert (zur Laufzeit geladen)
     * @throws Error wenn Secret nicht gefunden oder ungültiges Format
     */
    static loadSecret(secretRef: SecretRef): string {
        // Mock-Provider benötigt keinen Key
        if (secretRef === "MOCK") {
            return "";
        }

        // ENV: Format
        if (secretRef.startsWith("ENV:")) {
            const envVar = secretRef.replace("ENV:", "");
            const value = process.env[envVar];

            if (!value || value.trim().length === 0) {
                throw new Error(
                    `Environment variable '${envVar}' not found or empty. ` +
                    `Please set ${envVar} in your .env file.`
                );
            }

            return value;
        }

        // Unbekanntes Format
        throw new Error(
            `Unknown secret reference format: '${secretRef}'. ` +
            `Supported formats: 'ENV:VARIABLE_NAME' or 'MOCK'`
        );
    }

    /**
     * Prüft, ob Secret vorhanden ist (ohne es zu loggen)
     * 
     * @param secretRef Secret-Referenz
     * @returns true wenn Secret vorhanden, false sonst
     */
    static hasSecret(secretRef: SecretRef): boolean {
        try {
            const secret = this.loadSecret(secretRef);
            return secret.length > 0;
        } catch {
            return false;
        }
    }

    /**
     * Maskiert Secret für Logs
     * 
     * @param secret Secret-Wert (wird maskiert)
     * @returns Maskierter Secret-Wert (z.B. "sk-***masked***")
     */
    static maskSecret(secret: string): string {
        if (!secret || secret.length === 0) {
            return "***empty***";
        }

        // OpenAI Key Format: sk-... (mindestens 20 Zeichen)
        if (secret.startsWith("sk-") && secret.length >= 20) {
            return `sk-***masked***`;
        }

        // Generische Maskierung: Erste 4 Zeichen + ***masked***
        if (secret.length > 8) {
            return `${secret.substring(0, 4)}***masked***`;
        }

        // Kurze Secrets: Vollständig maskieren
        return "***masked***";
    }

    /**
     * Validiert Secret-Referenz-Format
     * 
     * @param secretRef Secret-Referenz
     * @returns true wenn Format gültig, false sonst
     */
    static isValidSecretRef(secretRef: SecretRef): boolean {
        if (secretRef === "MOCK") {
            return true;
        }

        if (secretRef.startsWith("ENV:") && secretRef.length > 4) {
            const envVar = secretRef.replace("ENV:", "");
            // Prüfe, ob Variablenname gültig ist (alphanumerisch + _)
            return /^[A-Z_][A-Z0-9_]*$/i.test(envVar);
        }

        return false;
    }

    /**
     * Extrahiert Umgebungsvariablen-Namen aus Secret-Referenz
     * 
     * @param secretRef Secret-Referenz (z.B. "ENV:OPENAI_API_KEY")
     * @returns Umgebungsvariablen-Name (z.B. "OPENAI_API_KEY") oder null
     */
    static extractEnvVarName(secretRef: SecretRef): string | null {
        if (secretRef.startsWith("ENV:")) {
            return secretRef.replace("ENV:", "");
        }
        return null;
    }
}





