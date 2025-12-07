/**
 * ChromaDB Client Factory - Enterprise++ Standard
 * 
 * Zentrale Factory für ChromaDB-Client-Erstellung
 * 
 * @created 2025-11-29
 * @purpose Phase R1.6: ChromaDB Setup
 * @status ✅ PRODUKTIONSREIF (Phase R1.6)
 */

import { logger } from "@/lib/logger";

/**
 * ChromaDB-Konfiguration
 */
export interface ChromaConfig {
    url?: string;
    collectionName?: string;
    timeout?: number;
}

/**
 * ChromaDB-Client-Instanz (Singleton)
 */
let chromaClientInstance: any = null;
let chromaCollectionInstance: any = null;
let isInitialized: boolean = false;
let initializationError: Error | null = null;

/**
 * ChromaDB Health Status
 */
export interface ChromaHealthStatus {
    available: boolean;
    url: string;
    error?: string;
    lastCheck?: Date;
}

/**
 * Erstellt oder gibt ChromaDB-Client zurück (Singleton)
 * 
 * @param config ChromaDB-Konfiguration
 * @returns ChromaDB-Client oder null bei Fehler
 */
export async function createChromaClient(config?: ChromaConfig): Promise<any | null> {
    if (chromaClientInstance !== null) {
        return chromaClientInstance;
    }

    const url = config?.url || process.env.CHROMA_URL || "http://localhost:8000";

    try {
        // Dynamischer Import von ChromaDB
        const { ChromaClient } = await import("chromadb");

        chromaClientInstance = new ChromaClient({
            path: url,
        });

        isInitialized = true;
        initializationError = null;

        logger.info("ChromaDB-Client erfolgreich erstellt", { url });

        return chromaClientInstance;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        initializationError = error instanceof Error ? error : new Error(String(error));
        logger.error("Fehler beim Erstellen des ChromaDB-Clients", {
            url,
            error: errorMessage,
        });

        return null;
    }
}

/**
 * Erstellt oder gibt ChromaDB-Collection zurück (Singleton)
 * 
 * @param config ChromaDB-Konfiguration
 * @returns ChromaDB-Collection oder null bei Fehler
 */
export async function createChromaCollection(config?: ChromaConfig): Promise<any | null> {
    if (chromaCollectionInstance !== null) {
        return chromaCollectionInstance;
    }

    const client = await createChromaClient(config);
    if (!client) {
        return null;
    }

    const collectionName =
        config?.collectionName ||
        process.env.RAG_COLLECTION_NAME ||
        "rag_knowledge";

    try {
        // ChromaDB benötigt eine Embedding-Funktion
        // Wir verwenden DefaultEmbeddingFunction (wenn verfügbar) oder erstellen Collection ohne Embedding-Funktion
        try {
            const { DefaultEmbeddingFunction } = await import("@chroma-core/default-embed");
            const embeddingFunction = new DefaultEmbeddingFunction();
            
            chromaCollectionInstance = await client.getOrCreateCollection({
                name: collectionName,
                embeddingFunction: embeddingFunction,
                metadata: {
                    description: "RAG Knowledge Base - Enterprise++ Standard",
                    created_at: new Date().toISOString(),
                },
            });
        } catch (embeddingError) {
            // Fallback: Versuche ohne Embedding-Funktion
            // In diesem Fall müssen wir Embeddings immer selbst bereitstellen
            try {
                chromaCollectionInstance = await client.getOrCreateCollection({
                    name: collectionName,
                    metadata: {
                        description: "RAG Knowledge Base - Enterprise++ Standard",
                        created_at: new Date().toISOString(),
                    },
                });
            } catch (collectionError) {
                // Wenn Collection-Erstellung fehlschlägt, ist ChromaDB möglicherweise nicht verfügbar
                const errorMessage = collectionError instanceof Error ? collectionError.message : "Unknown error";
                logger.error("Fehler beim Erstellen der ChromaDB-Collection", {
                    collectionName,
                    error: errorMessage,
                    embeddingError: embeddingError instanceof Error ? embeddingError.message : "Unknown",
                });
                throw new Error(`Collection konnte nicht erstellt werden: ${errorMessage}`);
            }
        }

        logger.info("ChromaDB-Collection erfolgreich erstellt", { collectionName });

        return chromaCollectionInstance;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        logger.error("Fehler beim Erstellen der ChromaDB-Collection", {
            collectionName,
            error: errorMessage,
        });

        return null;
    }
}

/**
 * Prüft ChromaDB Health Status
 * 
 * @param config ChromaDB-Konfiguration
 * @returns Health Status
 */
export async function checkChromaHealth(config?: ChromaConfig): Promise<ChromaHealthStatus> {
    const url = config?.url || process.env.CHROMA_URL || "http://localhost:8000";

    try {
        // Versuche Heartbeat-Endpoint zu erreichen
        const response = await fetch(`${url}/api/v1/heartbeat`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            signal: AbortSignal.timeout(config?.timeout || 5000),
        });

        if (response.ok) {
            const data = await response.json();
            return {
                available: true,
                url,
                lastCheck: new Date(),
            };
        } else {
            return {
                available: false,
                url,
                error: `HTTP ${response.status}: ${response.statusText}`,
                lastCheck: new Date(),
            };
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return {
            available: false,
            url,
            error: errorMessage,
            lastCheck: new Date(),
        };
    }
}

/**
 * Prüft ob ChromaDB verfügbar ist
 * 
 * @param config ChromaDB-Konfiguration
 * @returns true wenn verfügbar, false sonst
 */
export async function isChromaAvailable(config?: ChromaConfig): Promise<boolean> {
    const health = await checkChromaHealth(config);
    return health.available;
}

/**
 * Gibt ChromaDB-Client zurück (falls initialisiert)
 * 
 * @returns ChromaDB-Client oder null
 */
export function getChromaClient(): any | null {
    return chromaClientInstance;
}

/**
 * Gibt ChromaDB-Collection zurück (falls initialisiert)
 * 
 * @returns ChromaDB-Collection oder null
 */
export function getChromaCollection(): any | null {
    return chromaCollectionInstance;
}

/**
 * Setzt ChromaDB-Instanzen zurück (für Tests)
 */
export function resetChromaInstances(): void {
    chromaClientInstance = null;
    chromaCollectionInstance = null;
    isInitialized = false;
    initializationError = null;
}

/**
 * Gibt Initialisierungs-Status zurück
 */
export function getInitializationStatus(): {
    initialized: boolean;
    error: Error | null;
} {
    return {
        initialized: isInitialized,
        error: initializationError,
    };
}

