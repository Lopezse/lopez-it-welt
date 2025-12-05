# R1 ARCHITEKTUR

## RAG-System Architektur - Phase R1

**Version:** 1.0  
**Stand:** 2025-11-29  
**Status:** 📋 **ARCHITEKTUR**  
**Enterprise++ Standard:** IBM/SAP/Siemens-Niveau

---

## 📋 ÜBERSICHT

Das RAG-System besteht aus 5 Hauptkomponenten:

1. **Knowledge Base Service** - Wissens-Verwaltung
2. **Embedding Service** - Text zu Vektoren
3. **Retrieval Service** - Semantische Suche
4. **RAG Service** - Orchestrierung
5. **Vector-Datenbank** - ChromaDB

---

## 🏗️ ARCHITEKTUR-DIAGRAMM

```
┌─────────────────────────────────────────────────────────┐
│              PRÄSENTATIONSSCHICHT (UI)                  │
│  ─────────────────────────────────────────────────────  │
│  • Admin-UI (RAG-Konfiguration, Wissens-Verwaltung)     │
│  • Chat-UI (KI-Assistent mit RAG)                       │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│            ANWENDUNGSSCHICHT (RAG-Service)               │
│  ─────────────────────────────────────────────────────  │
│  • RAGService (Zentrale Orchestrierung)                 │
│    ├─ RetrievalService (Semantische Suche)              │
│    ├─ GenerationService (LLM-Generierung)               │
│    └─ ContextBuilder (Kontext-Erstellung)              │
│  • KnowledgeBaseService (Wissens-Verwaltung)          │
│  • EmbeddingService (Text zu Vektoren)                 │
│  • DSGVO Decision Engine (KI-Firewall)                 │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│            PROVIDER-SCHICHT (AiProvider)                │
│  ─────────────────────────────────────────────────────  │
│  • LLaMAProvider (Self-Hosted)                          │
│  • OpenAIProvider (Fallback)                            │
│  • MockProvider (Tests)                                 │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│            DATEN-SCHICHT                                 │
│  ─────────────────────────────────────────────────────  │
│  • MySQL (Wissens-Datenbasis)                           │
│  • ChromaDB (Vector-Datenbank)                          │
└─────────────────────────────────────────────────────────┘
```

---

## 📦 SERVICES

### **1. RAGService**

**Zweck:** Zentrale Orchestrierung des RAG-Systems

**Methoden:**
- `query(question: string, options?: RAGOptions): Promise<RAGResponse>`
- `addKnowledge(knowledge: KnowledgeEntry): Promise<string>`
- `updateKnowledge(id: string, knowledge: Partial<KnowledgeEntry>): Promise<void>`
- `deleteKnowledge(id: string): Promise<void>`

**Abhängigkeiten:**
- RetrievalService
- GenerationService (via AiProvider)
- KnowledgeBaseService
- EmbeddingService
- DSGVO Decision Engine

---

### **2. KnowledgeBaseService**

**Zweck:** Wissens-Verwaltung (CRUD)

**Methoden:**
- `create(knowledge: KnowledgeEntry): Promise<string>`
- `read(id: string): Promise<KnowledgeEntry | null>`
- `update(id: string, knowledge: Partial<KnowledgeEntry>): Promise<void>`
- `delete(id: string): Promise<void>`
- `list(category?: string): Promise<KnowledgeEntry[]>`
- `search(query: string, limit?: number): Promise<KnowledgeEntry[]>`

**Datenbank:**
- `knowledge_base` (Haupttabelle)
- `knowledge_categories` (Kategorien)
- `knowledge_metadata` (Metadaten)

---

### **3. EmbeddingService**

**Zweck:** Text zu Vektoren konvertieren

**Methoden:**
- `generateEmbedding(text: string): Promise<number[]>`
- `generateEmbeddings(texts: string[]): Promise<number[][]>`
- `chunkText(text: string, maxChunkSize?: number): Promise<string[]>`

**Technologie:**
- sentence-transformers (lokal)
- Modell: `all-MiniLM-L6-v2` (384 Dimensionen)

---

### **4. RetrievalService**

**Zweck:** Semantische Suche in Vector-DB

**Methoden:**
- `search(query: string, limit?: number): Promise<RetrievalResult[]>`
- `addDocument(id: string, text: string, metadata?: Record<string, unknown>): Promise<void>`
- `updateDocument(id: string, text: string): Promise<void>`
- `deleteDocument(id: string): Promise<void>`

**Technologie:**
- ChromaDB (Vector-Datenbank)
- Cosine-Similarity für Relevanz-Scoring

---

### **5. GenerationService**

**Zweck:** LLM-Generierung mit Kontext

**Methoden:**
- `generate(context: string, question: string, options?: GenerationOptions): Promise<string>`

**Integration:**
- Nutzt `AiProvider` (LLaMA oder OpenAI)
- Erstellt Prompt mit Kontext

---

## 🗄️ DATENBANK-SCHEMA

### **knowledge_base**

```sql
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
```

### **knowledge_categories**

```sql
CREATE TABLE knowledge_categories (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    parent_id VARCHAR(36),
    INDEX idx_parent (parent_id)
);
```

### **knowledge_embeddings**

```sql
CREATE TABLE knowledge_embeddings (
    id VARCHAR(36) PRIMARY KEY,
    knowledge_id VARCHAR(36) NOT NULL,
    vector_db_id VARCHAR(100),
    embedding_model VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_knowledge (knowledge_id)
);
```

---

## 🔧 TECHNOLOGIE-STACK

### **Vector-Datenbank**
- **ChromaDB** (Phase R1)
- Self-Hosted, DSGVO-konform
- Docker oder lokal

### **Embeddings**
- **sentence-transformers** (Phase R1)
- Modell: `all-MiniLM-L6-v2`
- 384 Dimensionen
- Lokal, keine API-Calls

### **LLM**
- **LLaMA** (via AiProvider)
- Self-Hosted (Ollama)
- Fallback: OpenAI

---

## 🔒 DSGVO-INTEGRATION

**DSGVO Decision Engine:**
- Prüft Berechtigung vor jeder RAG-Query
- Loggt alle RAG-Aktivitäten
- Enforce-Middleware für API-Routen

**Audit-Events:**
- `RAG_QUERY_ALLOWED`
- `RAG_QUERY_BLOCKED`
- `RAG_KNOWLEDGE_ADDED`
- `RAG_KNOWLEDGE_UPDATED`
- `RAG_KNOWLEDGE_DELETED`

---

## 📊 DATA-FLOW

### **Query-Flow:**

1. **User stellt Frage** → RAGService.query()
2. **DSGVO-Prüfung** → Decision Engine
3. **Embedding generieren** → EmbeddingService
4. **Semantische Suche** → RetrievalService
5. **Relevante Dokumente** → KnowledgeBaseService
6. **Kontext erstellen** → ContextBuilder
7. **LLM-Generierung** → AiProvider
8. **Antwort zurückgeben** → User

### **Add-Knowledge-Flow:**

1. **Wissen hinzufügen** → RAGService.addKnowledge()
2. **In MySQL speichern** → KnowledgeBaseService
3. **Text chunken** → EmbeddingService
4. **Embeddings generieren** → EmbeddingService
5. **In ChromaDB speichern** → RetrievalService
6. **Metadaten verknüpfen** → KnowledgeBaseService

---

## ✅ ERFOLGSKRITERIEN

**Phase R1 gilt als erfolgreich, wenn:**

1. ✅ RAG-System kann Fragen beantworten
2. ✅ Retrieval findet relevante Dokumente
3. ✅ Generation nutzt Kontext korrekt
4. ✅ Wissens-Einträge können verwaltet werden
5. ✅ DSGVO-Integration funktioniert
6. ✅ Tests bestehen

---

**Enterprise++ KI-Architekt-Agent**  
*Phase R1 – Architektur*  
*Stand: 2025-11-29*



