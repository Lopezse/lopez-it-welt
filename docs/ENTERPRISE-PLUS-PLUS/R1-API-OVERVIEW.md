# RAG API Overview - Enterprise++ Standard

**Version:** 1.0  
**Stand:** 2025-11-30  
**Status:** ✅ **PRODUKTIONSREIF** (Phase R1.7)

---

## 📋 ÜBERSICHT

Die RAG-API bietet Endpoints für:
- **Wissensverwaltung** (CRUD-Operationen)
- **RAG-Abfragen** (Frage rein, Antwort + Quellen raus)

**Base-URL:** `/api/rag`

---

## 🔐 AUTHENTIFIZIERUNG

Alle Endpoints erfordern Authentifizierung (wird in zukünftigen Phasen implementiert).

---

## 📚 WISSENSVERWALTUNG

### **POST /api/rag/knowledge**

Erstellt einen neuen Wissens-Eintrag.

**Request Body:**
```json
{
  "category": "string",
  "title": "string",
  "content": "string",
  "metadata": {
    "key": "value"
  }
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "category": "string",
    "title": "string",
    "content": "string",
    "metadata": {}
  }
}
```

**Fehler:**
- `400 Bad Request`: category, title oder content fehlen
- `500 Internal Server Error`: Fehler beim Erstellen

---

### **GET /api/rag/knowledge/[id]**

Ruft einen Wissens-Eintrag ab.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "category": "string",
    "title": "string",
    "content": "string",
    "metadata": {},
    "embeddingId": "uuid",
    "createdAt": "2025-11-30T00:00:00.000Z",
    "updatedAt": "2025-11-30T00:00:00.000Z"
  }
}
```

**Fehler:**
- `400 Bad Request`: ID fehlt
- `404 Not Found`: Eintrag nicht gefunden
- `500 Internal Server Error`: Fehler beim Abrufen

---

### **PUT /api/rag/knowledge/[id]**

Aktualisiert einen Wissens-Eintrag.

**Request Body:**
```json
{
  "category": "string",
  "title": "string",
  "content": "string",
  "metadata": {
    "key": "value"
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "category": "string",
    "title": "string",
    "content": "string",
    "metadata": {},
    "embeddingId": "uuid",
    "createdAt": "2025-11-30T00:00:00.000Z",
    "updatedAt": "2025-11-30T00:00:00.000Z"
  }
}
```

**Fehler:**
- `400 Bad Request`: ID fehlt
- `404 Not Found`: Eintrag nicht gefunden
- `500 Internal Server Error`: Fehler beim Aktualisieren

---

### **DELETE /api/rag/knowledge/[id]**

Löscht einen Wissens-Eintrag.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Wissens-Eintrag erfolgreich gelöscht"
}
```

**Fehler:**
- `400 Bad Request`: ID fehlt
- `404 Not Found`: Eintrag nicht gefunden
- `500 Internal Server Error`: Fehler beim Löschen

---

## 🔍 RAG-ABFRAGEN

### **POST /api/rag/query**

Führt eine RAG-Anfrage durch (Frage rein, Antwort + Quellen raus).

**Request Body:**
```json
{
  "question": "Was ist ein RAG-System?",
  "options": {
    "maxResults": 5,
    "minScore": 0.0,
    "category": "string",
    "userId": "uuid",
    "locale": "de",
    "maxTokens": 1000,
    "temperature": 0.7
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "answer": "Ein RAG-System ist...",
    "sources": [
      {
        "knowledgeId": "uuid",
        "title": "RAG-System Dokumentation",
        "content": "RAG steht für Retrieval-Augmented Generation...",
        "score": 0.95,
        "metadata": {}
      }
    ],
    "context": "Vollständiger Kontext für Generation...",
    "metadata": {
      "query": "Was ist ein RAG-System?",
      "retrievalCount": 3,
      "generationTime": 1234,
      "retrievalTime": 567,
      "processingTime": 1801
    }
  }
}
```

**Fehler:**
- `400 Bad Request`: question fehlt oder ist leer
- `403 Forbidden`: DSGVO-Blocker (wenn userId vorhanden)
- `500 Internal Server Error`: Fehler bei RAG-Query

---

## 📊 FEHLERSTRUKTUR

Alle Fehler folgen dieser Struktur:

```json
{
  "success": false,
  "error": "Fehlerbeschreibung",
  "details": "Detaillierte Fehlermeldung (optional)"
}
```

**HTTP-Statuscodes:**
- `200 OK`: Erfolgreich
- `201 Created`: Erfolgreich erstellt
- `400 Bad Request`: Ungültige Anfrage
- `401 Unauthorized`: Nicht authentifiziert
- `403 Forbidden`: DSGVO-Blocker
- `404 Not Found`: Ressource nicht gefunden
- `500 Internal Server Error`: Server-Fehler

---

## 🔒 DSGVO-COMPLIANCE

- Alle RAG-Queries mit `userId` werden durch die DSGVO Decision Engine geprüft
- Bei DSGVO-Blockern wird `403 Forbidden` zurückgegeben
- Alle Anfragen werden geloggt

---

## 📝 BEISPIELE

### **Wissens-Eintrag erstellen:**

```bash
curl -X POST http://localhost:3000/api/rag/knowledge \
  -H "Content-Type: application/json" \
  -d '{
    "category": "technologie",
    "title": "RAG-System",
    "content": "RAG steht für Retrieval-Augmented Generation...",
    "metadata": {
      "tags": ["rag", "ai", "nlp"]
    }
  }'
```

### **RAG-Query durchführen:**

```bash
curl -X POST http://localhost:3000/api/rag/query \
  -H "Content-Type: application/json" \
  -d '{
    "question": "Was ist ein RAG-System?",
    "options": {
      "maxResults": 5,
      "locale": "de"
    }
  }'
```

---

## 🎯 NÄCHSTE SCHRITTE

- [ ] Authentifizierung implementieren
- [ ] Rate-Limiting hinzufügen
- [ ] API-Dokumentation (OpenAPI/Swagger)
- [ ] Batch-Operationen (Bulk-Import)
- [ ] Kategorien-Verwaltung per API

---

**Enterprise++ KI-Architekt-Agent**  
*API-Overview R1.7*  
*Stand: 2025-11-30*



