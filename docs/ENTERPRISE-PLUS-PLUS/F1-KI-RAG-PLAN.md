# F1-KI-RAG-PLAN

## Retrieval-Augmented Generation (RAG) – Vollständige Enterprise++ Planung

**Version:** 1.0  
**Stand:** 2025-11-29  
**Status:** 📋 **PLANUNG** (Keine Implementierung)  
**Methode:** ABC-Methode (Analyse → Bauplanung → Kontrolle)  
**Enterprise++ Standard:** IBM/SAP/Siemens-Niveau  
**Referenz:** SAP Leonardo, IBM Watson Discovery, Siemens MindSphere

---

## 📋 EXECUTIVE SUMMARY

Dieses Dokument definiert die **vollständige Planung für ein RAG-System (Retrieval-Augmented Generation)** in Lopez IT Welt Enterprise++. RAG ermöglicht eine **eigene, europäische, DSGVO-konforme KI**, die auf deinem eigenen Wissen basiert, ohne Modelle zu trainieren.

**Kernprinzipien:**
- ✅ **Kein Training:** Open-Source-Modell (LLaMA/Mistral) betreiben, nicht trainieren
- ✅ **RAG statt Training:** Wissen über Retrieval einbinden (wie SAP, Siemens, IBM)
- ✅ **Self-Hosted:** Vollständige Datenkontrolle, DSGVO-konform
- ✅ **EU-basiert:** Keine US-Cloud, keine externen Datenabflüsse
- ✅ **Enterprise++:** IBM/SAP/Siemens-Standards

**Strategie:**
1. **AiProvider-System fertigstellen** (F.2) – Basis für alle KI-Aufgaben
2. **LLaMA/Mistral lokal betreiben** (Phase L0/L1) – Open-Source-Modell
3. **Wissens-Datenbasis aufbauen** – Strukturiertes Wissen speichern
4. **RAG-System integrieren** – Retrieval + Generation kombinieren

---

## 1. RAG-ÜBERSICHT

### **1.1 Was ist RAG?**

**RAG (Retrieval-Augmented Generation)** kombiniert:
- **Retrieval:** Relevante Informationen aus deiner Wissens-Datenbasis abrufen
- **Augmented:** Diese Informationen als Kontext für das LLM verwenden
- **Generation:** LLM generiert Antworten basierend auf deinem Wissen

**Vorteile:**
- ✅ Kein Training nötig (Open-Source-Modell reicht)
- ✅ Aktuelles Wissen (kann jederzeit aktualisiert werden)
- ✅ DSGVO-konform (Daten bleiben bei dir)
- ✅ Kosteneffizient (keine GPU-Cluster nötig)
- ✅ Wie SAP, Siemens, IBM es machen

**Nachteile:**
- ⚠️ Retrieval-Qualität abhängig von Wissens-Datenbasis
- ⚠️ Latenz höher als reine Generation (Retrieval + Generation)
- ⚠️ Wartung der Wissens-Datenbasis erforderlich

---

### **1.2 Warum RAG statt Training?**

**Training (nicht realistisch):**
- ❌ Braucht GPU-Cluster (€€€)
- ❌ Braucht Millionen von Datenpunkten
- ❌ Braucht Wochen/Monate Training
- ❌ Nicht für Einzelunternehmen im Aufbau

**RAG (realistisch):**
- ✅ Open-Source-Modell betreiben (LLaMA/Mistral)
- ✅ Wissen in Datenbank speichern
- ✅ Retrieval-System integrieren
- ✅ Sofort einsatzbereit
- ✅ Wie SAP, Siemens, IBM es machen

---

## 2. ARCHITEKTUR-ÜBERSICHT

### **2.1 RAG-Architektur (Enterprise++ Standard)**

```
┌─────────────────────────────────────────────────────────┐
│              PRÄSENTATIONSSCHICHT (UI)                  │
│  ─────────────────────────────────────────────────────  │
│  • Admin-UI (RAG-Konfiguration, Wissens-Verwaltung)     │
│  • Chat-UI (KI-Assistent mit RAG)                       │
│  • Media-UI (KI-Analyse mit RAG-Kontext)                │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│            ANWENDUNGSSCHICHT (RAG-Service)               │
│  ─────────────────────────────────────────────────────  │
│  • RAGService (Zentrale RAG-Orchestrierung)             │
│  • KnowledgeBaseService (Wissens-Verwaltung)            │
│  • RetrievalService (Semantische Suche)                 │
│  • GenerationService (LLM-Generierung mit Kontext)     │
│  • DSGVO Decision Engine (KI-Firewall)                  │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│            PROVIDER-SCHICHT (AiProvider)                │
│  ─────────────────────────────────────────────────────  │
│  • AiProvider (Basis-Interface)                         │
│  • LLaMAProvider (Self-Hosted)                          │
│  • OpenAIProvider (Fallback)                             │
│  • EmbeddingAiProvider (für Embeddings)                 │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│         VECTOR-DATENBANK (Embeddings)                   │
│  ─────────────────────────────────────────────────────  │
│  • ChromaDB (Self-Hosted, empfohlen)                    │
│  • Oder: Qdrant (Self-Hosted)                           │
│  • Oder: Weaviate (Self-Hosted)                         │
│  • Embeddings: sentence-transformers (lokal)           │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│         WISSENS-DATENBANK (Strukturiertes Wissen)       │
│  ─────────────────────────────────────────────────────  │
│  • MySQL (Bestehende Datenbank)                         │
│  • Tabellen:                                            │
│    - knowledge_base (Wissens-Einträge)                  │
│    - knowledge_categories (Kategorien)                  │
│    - knowledge_embeddings (Embedding-Referenzen)         │
│    - knowledge_metadata (Metadaten)                      │
└─────────────────────────────────────────────────────────┘
```

---

### **2.2 Datenfluss (RAG-Pipeline)**

```
1. User-Frage → RAGService.query()
   │
   ├─→ 2. RetrievalService.search()
   │      │
   │      ├─→ 2.1 EmbeddingAiProvider.generateEmbedding(query)
   │      │      └─→ sentence-transformers (lokal)
   │      │
   │      └─→ 2.2 Vector-DB.similaritySearch(embedding)
   │             └─→ ChromaDB (Self-Hosted)
   │
   ├─→ 3. KnowledgeBaseService.getContext(relevant_docs)
   │      └─→ MySQL (Strukturiertes Wissen)
   │
   ├─→ 4. GenerationService.generate(context + query)
   │      │
   │      ├─→ 4.1 Prompt-Building (Kontext + Frage)
   │      │
   │      └─→ 4.2 AiProvider.requestText(prompt)
   │             └─→ LLaMAProvider (Self-Hosted)
   │
   └─→ 5. Response zurückgeben
```

---

## 3. WISSENS-DATENBASIS

### **3.1 Struktur (Enterprise++ Standard)**

**Kategorien:**
1. **Rollen & Privilegien**
   - RBAC/ABAC-Regeln
   - Permission-Definitionen
   - Rollen-Hierarchien

2. **DSGVO-Prozesse**
   - DSGVO Decision Engine Regeln
   - Consent-Management
   - Audit-Log-Prozesse
   - Datenlöschungsfristen

3. **Lopez-IT-Stil**
   - Code-Style-Guide
   - Architektur-Prinzipien
   - Naming-Conventions
   - Best Practices

4. **Admin-Entscheidungslogik**
   - Business-Rules
   - Workflow-Definitionen
   - Approval-Prozesse

5. **Unternehmensregeln**
   - Enterprise++-Standards
   - Quality-Gates
   - Compliance-Regeln

6. **Systemmodule**
   - E-4 (RBAC)
   - P-8 (Orchestrator)
   - F-1 (KI-Architektur)
   - Weitere Module

---

### **3.2 Datenbank-Schema**

```sql
-- Wissens-Einträge
CREATE TABLE knowledge_base (
    id VARCHAR(36) PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    metadata JSON,
    embedding_id VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_embedding_id (embedding_id)
);

-- Kategorien
CREATE TABLE knowledge_categories (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    parent_id VARCHAR(36),
    INDEX idx_parent (parent_id)
);

-- Embedding-Referenzen (für Vector-DB)
CREATE TABLE knowledge_embeddings (
    id VARCHAR(36) PRIMARY KEY,
    knowledge_id VARCHAR(36) NOT NULL,
    vector_db_id VARCHAR(100),
    embedding_model VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_knowledge (knowledge_id)
);

-- Metadaten
CREATE TABLE knowledge_metadata (
    id VARCHAR(36) PRIMARY KEY,
    knowledge_id VARCHAR(36) NOT NULL,
    key VARCHAR(100) NOT NULL,
    value TEXT,
    INDEX idx_knowledge (knowledge_id),
    INDEX idx_key (key)
);
```

---

## 4. VECTOR-DATENBANK

### **4.1 Optionen (Self-Hosted, DSGVO-konform)**

| Option | Kosten | DSGVO | Setup | Skalierung | Empfehlung |
|--------|--------|-------|-------|------------|------------|
| **ChromaDB** | Kostenlos | ✅ Lokal | Einfach | Begrenzt | ✅ **Für Start** |
| **Qdrant** | Kostenlos | ✅ Lokal | Mittel | Gut | ✅ **Für Wachstum** |
| **Weaviate** | Kostenlos | ✅ Lokal | Mittel | Sehr gut | ⚠️ Komplexer |
| **Pinecone** | $0.10/1K | ✅ EU-Server | Einfach | Unbegrenzt | ⚠️ Cloud |

**Empfehlung:** ChromaDB für Start (Phase R1), später Qdrant für Wachstum (Phase R2)

---

### **4.2 Embeddings (Self-Hosted)**

**Option 1: sentence-transformers (lokal)**
- ✅ Kostenlos
- ✅ DSGVO-konform (lokal)
- ✅ Keine API-Calls
- ⚠️ Etwas langsamer als Cloud

**Option 2: OpenAI Embeddings (Fallback)**
- ⚠️ Kosten ($0.0001/1K Tokens)
- ⚠️ Cloud-Abhängigkeit
- ✅ Sehr schnell
- ✅ Gute Qualität

**Empfehlung:** sentence-transformers für Start (Phase R1), OpenAI als Fallback

---

## 5. IMPLEMENTIERUNGSPHASEN

### **Phase R1: Basis-Setup (2-3 Wochen)**

**Ziel:** RAG-System grundlegend funktionsfähig

**Schritte:**
1. ✅ **Vector-DB Setup**
   - ChromaDB installieren (Docker oder lokal)
   - Erste Tests durchführen

2. ✅ **Embedding-Service**
   - sentence-transformers integrieren
   - Embedding-Generierung testen

3. ✅ **Wissens-Datenbasis**
   - Datenbank-Schema erstellen
   - Erste Wissens-Einträge importieren
   - Kategorien definieren

4. ✅ **RAG-Service (Basis)**
   - `RAGService` Klasse erstellen
   - `RetrievalService` implementieren
   - `GenerationService` implementieren
   - Integration mit `AiProvider`

5. ✅ **Tests**
   - Unit-Tests für RAG-Service
   - Integrationstests mit Mock-Provider
   - Performance-Tests

**Erfolgskriterien:**
- ✅ RAG-System kann Fragen beantworten
- ✅ Retrieval findet relevante Dokumente
- ✅ Generation nutzt Kontext korrekt
- ✅ Tests bestehen

---

### **Phase R2: Wissens-Datenbasis aufbauen (laufend)**

**Ziel:** Strukturiertes Wissen systematisch einpflegen

**Schritte:**
1. ✅ **Rollen & Privilegien**
   - RBAC/ABAC-Regeln dokumentieren
   - Permission-Definitionen strukturieren
   - Rollen-Hierarchien beschreiben

2. ✅ **DSGVO-Prozesse**
   - DSGVO Decision Engine Regeln
   - Consent-Management-Prozesse
   - Audit-Log-Prozesse
   - Datenlöschungsfristen

3. ✅ **Lopez-IT-Stil**
   - Code-Style-Guide
   - Architektur-Prinzipien
   - Naming-Conventions
   - Best Practices

4. ✅ **Admin-Entscheidungslogik**
   - Business-Rules
   - Workflow-Definitionen
   - Approval-Prozesse

5. ✅ **Unternehmensregeln**
   - Enterprise++-Standards
   - Quality-Gates
   - Compliance-Regeln

6. ✅ **Systemmodule**
   - E-4 (RBAC)
   - P-8 (Orchestrator)
   - F-1 (KI-Architektur)
   - Weitere Module

**Erfolgskriterien:**
- ✅ Alle wichtigen Wissens-Bereiche abgedeckt
- ✅ Wissens-Einträge strukturiert und durchsuchbar
- ✅ Embeddings für alle Einträge generiert

---

### **Phase R3: Integration & Optimierung (2-3 Wochen)**

**Ziel:** RAG-System in Admin-UI integrieren und optimieren

**Schritte:**
1. ✅ **Admin-UI Integration**
   - RAG-Konfiguration (Admin-Bereich)
   - Wissens-Verwaltung (CRUD-UI)
   - Chat-UI (KI-Assistent)

2. ✅ **Performance-Optimierung**
   - Retrieval-Caching
   - Embedding-Caching
   - Batch-Processing für große Anfragen

3. ✅ **Quality-Gates**
   - Retrieval-Qualität messen
   - Generation-Qualität validieren
   - Feedback-Loop implementieren

4. ✅ **Monitoring**
   - RAG-Metriken (Retrieval-Zeit, Generation-Zeit)
   - Quality-Metriken (Relevanz-Score)
   - Kosten-Tracking

**Erfolgskriterien:**
- ✅ RAG-System in Admin-UI verfügbar
- ✅ Performance akzeptabel (< 3 Sekunden)
- ✅ Quality-Gates bestehen
- ✅ Monitoring funktioniert

---

### **Phase R4: Erweiterte Features (laufend)**

**Ziel:** RAG-System erweitern und verbessern

**Schritte:**
1. ✅ **Multi-Modal RAG**
   - Bilder in Wissens-Datenbasis
   - Vision-Modelle für Bild-Retrieval

2. ✅ **Fine-Tuning (optional)**
   - LoRA-Fine-Tuning für spezifische Tasks
   - Nur wenn GPU verfügbar

3. ✅ **Advanced Retrieval**
   - Hybrid Search (Keyword + Semantic)
   - Re-Ranking
   - Query-Expansion

4. ✅ **Feedback-Loop**
   - User-Feedback sammeln
   - Wissens-Datenbasis verbessern
   - Retrieval-Qualität optimieren

**Erfolgskriterien:**
- ✅ Erweiterte Features funktionieren
- ✅ Quality verbessert sich kontinuierlich
- ✅ User-Feedback positiv

---

## 6. TECHNISCHE IMPLEMENTIERUNG

### **6.1 RAG-Service (Basis)**

```typescript
// src/lib/rag/RAGService.ts

import { AiProvider, EmbeddingAiProvider } from "@/lib/ai/core/ai-provider";
import { ChromaClient } from "chromadb";

export interface RAGQuery {
    question: string;
    category?: string;
    limit?: number;
    minScore?: number;
}

export interface RAGResponse {
    answer: string;
    sources: Array<{
        id: string;
        title: string;
        content: string;
        score: number;
    }>;
    metadata: {
        retrievalTime: number;
        generationTime: number;
        totalTime: number;
    };
}

export class RAGService {
    private aiProvider: AiProvider;
    private embeddingProvider: EmbeddingAiProvider;
    private vectorDB: ChromaClient;
    private collectionName: string = "knowledge_base";

    constructor(
        aiProvider: AiProvider,
        embeddingProvider: EmbeddingAiProvider,
        vectorDB: ChromaClient
    ) {
        this.aiProvider = aiProvider;
        this.embeddingProvider = embeddingProvider;
        this.vectorDB = vectorDB;
    }

    async query(query: RAGQuery): Promise<RAGResponse> {
        const startTime = Date.now();

        // 1. Embedding für Query generieren
        const queryEmbedding = await this.embeddingProvider.generateEmbedding(
            query.question
        );

        // 2. Ähnliche Dokumente in Vector-DB finden
        const collection = await this.vectorDB.getCollection({
            name: this.collectionName,
        });

        const results = await collection.query({
            queryEmbeddings: [queryEmbedding],
            nResults: query.limit || 5,
        });

        const retrievalTime = Date.now() - startTime;

        // 3. Relevante Dokumente filtern (minScore)
        const relevantDocs = results.documents[0]
            .map((doc, index) => ({
                id: results.ids[0][index],
                content: doc,
                score: results.distances[0][index],
            }))
            .filter((doc) => doc.score >= (query.minScore || 0.7));

        // 4. Kontext aus Wissens-Datenbasis laden
        const context = await this.loadContext(relevantDocs);

        // 5. Prompt mit Kontext bauen
        const prompt = this.buildPrompt(query.question, context);

        // 6. Generation mit AiProvider
        const generationStart = Date.now();
        const answer = await this.aiProvider.requestText(prompt, {
            taskId: "rag-query",
            maxTokens: 1000,
            temperature: 0.7,
            systemPrompt: "Du bist ein Experte für Lopez IT Welt Enterprise++. Antworte präzise und basierend auf dem gegebenen Kontext.",
        });
        const generationTime = Date.now() - generationStart;

        return {
            answer,
            sources: relevantDocs.map((doc) => ({
                id: doc.id,
                title: await this.getTitle(doc.id),
                content: doc.content,
                score: doc.score,
            })),
            metadata: {
                retrievalTime,
                generationTime,
                totalTime: Date.now() - startTime,
            },
        };
    }

    private async loadContext(docs: Array<{ id: string; content: string }>): Promise<string> {
        // Lade vollständigen Kontext aus MySQL
        // ...
        return docs.map((doc) => doc.content).join("\n\n");
    }

    private buildPrompt(question: string, context: string): string {
        return `Kontext:
${context}

Frage: ${question}

Antworte basierend auf dem Kontext. Wenn die Antwort nicht im Kontext steht, sage das klar.`;
    }

    private async getTitle(id: string): Promise<string> {
        // Lade Titel aus MySQL
        // ...
        return "Titel";
    }
}
```

---

### **6.2 Knowledge-Base-Service**

```typescript
// src/lib/rag/KnowledgeBaseService.ts

export interface KnowledgeEntry {
    id: string;
    category: string;
    title: string;
    content: string;
    metadata?: Record<string, unknown>;
}

export class KnowledgeBaseService {
    async addEntry(entry: KnowledgeEntry): Promise<void> {
        // 1. In MySQL speichern
        // 2. Embedding generieren
        // 3. In Vector-DB speichern
    }

    async updateEntry(id: string, entry: Partial<KnowledgeEntry>): Promise<void> {
        // 1. MySQL aktualisieren
        // 2. Embedding neu generieren
        // 3. Vector-DB aktualisieren
    }

    async deleteEntry(id: string): Promise<void> {
        // 1. Aus MySQL löschen
        // 2. Aus Vector-DB löschen
    }

    async getEntry(id: string): Promise<KnowledgeEntry | null> {
        // Aus MySQL laden
    }

    async searchEntries(query: string, category?: string): Promise<KnowledgeEntry[]> {
        // MySQL-Suche (Keyword-basiert)
    }
}
```

---

## 7. KOSTEN & RESSOURCEN

### **7.1 Phase R1 (Basis-Setup)**

**Kosten:**
- ChromaDB: **0 €** (Self-Hosted)
- sentence-transformers: **0 €** (Open-Source)
- LLaMA (Ollama): **0 €** (bereits vorhanden)
- **Gesamt: 0 € zusätzliche Kosten**

**Ressourcen:**
- Entwicklungszeit: 2-3 Wochen
- Server: Bestehender Netcup-Server (Phase L1)

---

### **7.2 Phase R2 (Wissens-Datenbasis)**

**Kosten:**
- MySQL: **0 €** (bereits vorhanden)
- Wartungszeit: Laufend (1-2 Stunden/Woche)
- **Gesamt: 0 € zusätzliche Kosten**

---

### **7.3 Phase R3 (Integration)**

**Kosten:**
- Entwicklungszeit: 2-3 Wochen
- **Gesamt: 0 € zusätzliche Kosten**

---

### **7.4 Phase R4 (Erweiterte Features)**

**Kosten:**
- Optional: GPU für Fine-Tuning (nur wenn nötig)
- **Gesamt: 0 € (ohne Fine-Tuning)**

---

## 8. RISIKEN & MITIGATION

### **8.1 Retrieval-Qualität**

**Risiko:** Relevante Dokumente werden nicht gefunden

**Mitigation:**
- ✅ Hybrid Search (Keyword + Semantic)
- ✅ Re-Ranking
- ✅ Query-Expansion
- ✅ Feedback-Loop

---

### **8.2 Generation-Qualität**

**Risiko:** LLM generiert falsche Antworten

**Mitigation:**
- ✅ System-Prompt mit klaren Anweisungen
- ✅ Kontext-Validierung
- ✅ Quality-Gates
- ✅ User-Feedback

---

### **8.3 Performance**

**Risiko:** RAG-System zu langsam

**Mitigation:**
- ✅ Caching (Retrieval + Embeddings)
- ✅ Batch-Processing
- ✅ Optimierte Vector-DB-Queries
- ✅ Monitoring

---

## 9. ERFOLGSKRITERIEN

### **9.1 Phase R1 (Basis-Setup)**

- ✅ RAG-System kann Fragen beantworten
- ✅ Retrieval findet relevante Dokumente
- ✅ Generation nutzt Kontext korrekt
- ✅ Tests bestehen

---

### **9.2 Phase R2 (Wissens-Datenbasis)**

- ✅ Alle wichtigen Wissens-Bereiche abgedeckt
- ✅ Wissens-Einträge strukturiert und durchsuchbar
- ✅ Embeddings für alle Einträge generiert

---

### **9.3 Phase R3 (Integration)**

- ✅ RAG-System in Admin-UI verfügbar
- ✅ Performance akzeptabel (< 3 Sekunden)
- ✅ Quality-Gates bestehen
- ✅ Monitoring funktioniert

---

## 10. NÄCHSTE SCHRITTE

### **10.1 Voraussetzungen**

1. ✅ **AiProvider-System fertigstellen** (F.2)
   - Basis für alle KI-Aufgaben
   - LLaMAProvider implementieren

2. ✅ **LLaMA lokal betreiben** (Phase L0/L1)
   - Ollama installiert
   - LLaMA-Modell geladen

---

### **10.2 Phase R1 starten**

1. ⏳ Vector-DB Setup (ChromaDB)
2. ⏳ Embedding-Service (sentence-transformers)
3. ⏳ Wissens-Datenbasis (MySQL-Schema)
4. ⏳ RAG-Service (Basis-Implementierung)
5. ⏳ Tests

---

## 11. ZUSAMMENFASSUNG

**Kernpunkte:**
- ✅ **RAG statt Training:** Realistisch für Einzelunternehmen
- ✅ **Self-Hosted:** DSGVO-konform, EU-basiert
- ✅ **Enterprise++:** IBM/SAP/Siemens-Standards
- ✅ **Kostenoptimiert:** 0 € zusätzliche Kosten (Phase R1-R3)
- ✅ **Schrittweise:** Klare Phasen, messbare Erfolgskriterien

**Status:**
- 📋 **Planung abgeschlossen** (dieses Dokument)
- ⏳ **Wartet auf F.2 (AiProvider)** und Phase L0/L1 (LLaMA)
- ⏳ **Bereit für Implementierung** (Phase R1)

---

**Enterprise++ KI-Architekt-Agent**  
*Analyse → Planung → Kontrolle*  
*Stand: 2025-11-29*  
*Referenz: SAP Leonardo, IBM Watson Discovery, Siemens MindSphere*



