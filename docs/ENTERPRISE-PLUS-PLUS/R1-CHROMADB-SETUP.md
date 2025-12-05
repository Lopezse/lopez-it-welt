# ChromaDB Setup - Enterprise++ Standard

## ChromaDB Installation und Konfiguration

**Version:** 1.0  
**Stand:** 2025-11-29  
**Status:** 📋 **SETUP-ANLEITUNG**

---

## 📋 ÜBERSICHT

ChromaDB ist die Vector-Datenbank für das RAG-System. Sie speichert Embeddings und ermöglicht semantische Suche.

**Optionen:**
1. **Docker** (empfohlen für Produktion)
2. **Lokal** (für Entwicklung)
3. **In-Memory-Fallback** (für Tests, wenn ChromaDB nicht verfügbar)

---

## 🐳 DOCKER SETUP (Empfohlen)

### **1. Docker-Container starten**

```bash
docker run -d \
  --name chromadb \
  -p 8000:8000 \
  chromadb/chroma:latest
```

### **2. Prüfen ob ChromaDB läuft**

```bash
curl http://localhost:8000/api/v1/heartbeat
```

**Erwartete Antwort:**
```json
{"nanosecond heartbeat": 1234567890}
```

---

## 💻 LOKAL SETUP (Entwicklung)

### **1. Python installieren**

ChromaDB benötigt Python 3.8+.

### **2. ChromaDB installieren**

```bash
pip install chromadb
```

### **3. ChromaDB Server starten**

```bash
chroma run --path ./chroma_data --port 8000
```

---

## ⚙️ KONFIGURATION

### **Environment-Variablen**

```bash
# ChromaDB URL (Default: http://localhost:8000)
CHROMA_URL=http://localhost:8000

# Collection-Name (Default: rag_knowledge)
RAG_COLLECTION_NAME=rag_knowledge
```

### **In .env Datei**

```env
CHROMA_URL=http://localhost:8000
RAG_COLLECTION_NAME=rag_knowledge
```

---

## 🧪 TESTEN

### **1. Verfügbarkeit prüfen**

```typescript
import { retrievalService } from "@/lib/rag/services/RetrievalService";

const available = await retrievalService.isAvailable();
console.log("ChromaDB verfügbar:", available);
```

### **2. Erstes Dokument hinzufügen**

```typescript
await retrievalService.addDocument(
    "test-1",
    "Dies ist ein Test-Dokument.",
    { title: "Test" }
);
```

### **3. Suche testen**

```typescript
const results = await retrievalService.search("Test", 5);
console.log("Ergebnisse:", results);
```

---

## 🔧 TROUBLESHOOTING

### **Problem: ChromaDB nicht erreichbar**

**Lösung:**
- Prüfe ob Docker-Container läuft: `docker ps`
- Prüfe Port: `curl http://localhost:8000/api/v1/heartbeat`
- Prüfe Firewall-Einstellungen

### **Problem: Collection nicht gefunden**

**Lösung:**
- Collection wird automatisch erstellt beim ersten Zugriff
- Prüfe Collection-Name in Konfiguration

### **Problem: Embeddings haben falsche Dimension**

**Lösung:**
- Prüfe Embedding-Modell (sollte 384 Dimensionen haben)
- Prüfe EmbeddingService-Konfiguration

---

## 📊 FALLBACK-MODUS

Wenn ChromaDB nicht verfügbar ist, verwendet der RetrievalService einen **In-Memory-Fallback**. Dieser ist nur für Tests gedacht und speichert keine Daten persistent.

**Hinweis:** In Fallback-Modus gibt `search()` immer ein leeres Array zurück.

---

## ✅ ERFOLGSKRITERIEN

**ChromaDB ist korrekt eingerichtet, wenn:**

1. ✅ Docker-Container läuft oder lokaler Server läuft
2. ✅ `curl http://localhost:8000/api/v1/heartbeat` funktioniert
3. ✅ `retrievalService.isAvailable()` gibt `true` zurück
4. ✅ Dokumente können hinzugefügt werden
5. ✅ Suche funktioniert

---

**Enterprise++ KI-Architekt-Agent**  
*ChromaDB Setup*  
*Stand: 2025-11-29*



