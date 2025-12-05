# RAG System - Enterprise++ Standard

**Version:** 1.0  
**Stand:** 2025-11-29  
**Status:** 🚀 **IN ENTWICKLUNG** (Phase R1)

---

## 📋 ÜBERSICHT

Das RAG-System (Retrieval-Augmented Generation) ermöglicht eine **eigene, europäische, DSGVO-konforme KI**, die auf deinem eigenen Wissen basiert.

**Kernkomponenten:**
- ✅ Knowledge Base Service (Wissens-Verwaltung)
- ✅ Embedding Service (Text zu Vektoren)
- ✅ Retrieval Service (Semantische Suche)
- ✅ RAG Service (Orchestrierung)

---

## 🏗️ ARCHITEKTUR

```
src/lib/rag/
├── types.ts                          # TypeScript Interfaces
├── config/
│   └── chroma.ts                     # ✅ ChromaDB Factory
├── services/
│   ├── KnowledgeBaseService.ts       # ✅ Wissens-Verwaltung
│   ├── EmbeddingService.ts           # ✅ Text zu Vektoren
│   ├── RetrievalService.ts           # ✅ Semantische Suche
│   └── RAGService.ts                 # ✅ Orchestrierung
└── __tests__/
    ├── KnowledgeBaseService.test.ts  # ✅ Tests
    ├── EmbeddingService.test.ts      # ✅ Tests
    ├── RetrievalService.test.ts      # ✅ Tests
    ├── RAGService.test.ts            # ✅ Tests
    └── chroma-integration.test.ts    # ✅ ChromaDB Integrationstests
```

---

## 🚀 VERWENDUNG

### **RAG Service (Haupt-Interface)**

```typescript
import { ragService } from "@/lib/rag/services/RAGService";

// RAG-Query durchführen
const response = await ragService.query(
    "Was ist DSGVO?",
    {
        maxResults: 5,
        minScore: 0.5,
        userId: "user123", // Für DSGVO-Prüfung
        locale: "de"
    }
);

console.log("Antwort:", response.answer);
console.log("Quellen:", response.sources);
console.log("Kontext:", response.context);

// Wissen hinzufügen
const knowledgeId = await ragService.addKnowledge({
    category: "dsgvo",
    title: "DSGVO-Grundlagen",
    content: "Die DSGVO regelt...",
    metadata: { source: "intern" }
});

// Wissen aktualisieren
await ragService.updateKnowledge(knowledgeId, {
    title: "Neuer Titel"
});

// Wissen löschen
await ragService.deleteKnowledge(knowledgeId);
```

### **Embedding Service**

```typescript
import { embeddingService } from "@/lib/rag/services/EmbeddingService";

// Embedding für einen Text generieren
const embedding = await embeddingService.generateEmbedding("Dies ist ein Test-Text.");
// Ergebnis: Array von 384 Zahlen (Vektor)

// Embeddings für mehrere Texte
const embeddings = await embeddingService.generateEmbeddings([
    "Text 1",
    "Text 2",
    "Text 3"
]);

// Text in Chunks aufteilen (für lange Texte)
const chunks = await embeddingService.chunkText(
    "Sehr langer Text...",
    500, // maxChunkSize
    50   // overlap
);
```

### **Retrieval Service**

```typescript
import { retrievalService } from "@/lib/rag/services/RetrievalService";

// Dokument zur Vector-DB hinzufügen
await retrievalService.addDocument(
    "doc-1",
    "Dies ist ein Dokument.",
    { title: "Dokument 1" }
);

// Semantische Suche
const results = await retrievalService.search(
    "Was ist ein Dokument?",
    5,    // limit
    0.5   // minScore
);

// Dokument aktualisieren
await retrievalService.updateDocument("doc-1", "Neuer Text");

// Dokument löschen
await retrievalService.deleteDocument("doc-1");
```

### **Knowledge Base Service**

```typescript
import { knowledgeBaseService } from "@/lib/rag/services/KnowledgeBaseService";

// Wissens-Eintrag erstellen
const id = await knowledgeBaseService.create({
    category: "dsgvo",
    title: "DSGVO-Grundlagen",
    content: "Die DSGVO regelt...",
    metadata: { source: "intern" }
});

// Wissens-Eintrag lesen
const entry = await knowledgeBaseService.read(id);

// Wissens-Eintrag aktualisieren
await knowledgeBaseService.update(id, {
    title: "Neuer Titel"
});

// Wissens-Einträge auflisten
const entries = await knowledgeBaseService.list("dsgvo");

// Suchen
const results = await knowledgeBaseService.search("DSGVO");
```

---

## 🗄️ DATENBANK

**MySQL Migration:** `database/migrations/013_create_rag_knowledge_base_tables.sql`

**Tabellen:**
- `knowledge_base` - Wissens-Einträge
- `knowledge_categories` - Kategorien
- `knowledge_embeddings` - Embedding-Referenzen
- `knowledge_metadata` - Metadaten

**ChromaDB (Vector-DB):**
- Docker-Compose: `docker-compose.chromadb.yml`
- Port: 8000
- Volume: `chromadb_data` (persistent)
- Factory: `src/lib/rag/config/chroma.ts`

---

## 📊 STATUS

**Phase R1:**
- ✅ R1.1: RAG-Architektur finalisiert
- ✅ R1.2: Knowledge Base Service
- ✅ R1.3: Embedding Service
- ✅ R1.4: Retrieval Service
- ✅ R1.5: RAG Service
- ✅ R1.6: ChromaDB Setup

**Status:** ✅ **PHASE R1 ABGESCHLOSSEN**

---

**Enterprise++ KI-Architekt-Agent**  
*RAG-System*  
*Stand: 2025-11-29*

