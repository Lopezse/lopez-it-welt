# 🤖 Media AI Services - Enterprise++ Standard

## Übersicht

KI-gestützte Medienverwaltung mit modularen Services für automatische Analyse, Tagging, Alt-Text-Generierung und mehr.

## 🏗️ Architektur

```
src/lib/media/ai/
├── MediaAIService.ts          # Orchestrator (Haupt-Service)
├── config.ts                  # Konfiguration
├── types.ts                   # TypeScript Interfaces
└── services/
    ├── TaggingService.ts      # Automatische Tags
    ├── AltTextService.ts      # Alt-Text-Generierung
    ├── QualityCheckService.ts # Qualitätsprüfung
    ├── CategoryService.ts     # Kategorie-Erkennung
    ├── SimilarityService.ts   # Dublettenerkennung
    ├── CICheckService.ts      # CI-Compliance
    └── PersonDetectionService.ts # Personenerkennung (DSGVO)
```

## 🔌 API-Endpunkte

### POST `/api/admin/media/ai/analyze`
Vollständige KI-Analyse eines Mediums.

**Request:**
```json
{
  "mediaId": "a7be3f4d9df55b21",
  "intendedUse": "hero",
  "context": "Seite: Startseite Hero",
  "language": "de"
}
```

**Response:**
```json
{
  "success": true,
  "media_id": "a7be3f4d9df55b21",
  "analysis": {
    "tags": { "tags": ["laptop", "dashboard"], ... },
    "alt_text": { "description": "...", ... },
    "quality": { "score": 85, "warnings": [], ... },
    ...
  },
  "meta_updated": true
}
```

### POST `/api/admin/media/ai/analyze-batch`
Batch-Analyse für mehrere Medien (max. 50).

**Request:**
```json
{
  "mediaIds": ["id1", "id2", "id3"],
  "intendedUse": "thumbnail",
  "language": "de"
}
```

### POST `/api/admin/media/ai/search`
Semantische Suche nach Medien.

**Request:**
```json
{
  "query": "blauer Hintergrund mit Laptop",
  "category": "linkedin",
  "limit": 20,
  "min_confidence": 0.5
}
```

### GET `/api/admin/media/ai/similar?id={mediaId}&limit=5`
Findet ähnliche Medien (Dublettenerkennung).

### POST `/api/admin/media/ai/approve`
Admin bestätigt KI-Vorschläge.

**Request:**
```json
{
  "mediaId": "a7be3f4d9df55b21",
  "approveTags": true,
  "approveAlt": true,
  "approveCategory": true,
  "approveDSGVO": true,
  "customAltText": "Optional: Custom Alt-Text",
  "customCategory": "Optional: Custom Category"
}
```

## 🔒 Enterprise++ Sicherheits-Regeln

### ✅ Was KI darf:
- Vorschläge generieren (Tags, Alt-Text, Kategorie)
- Warnungen ausgeben (Qualität, CI-Abweichung)
- Kennzeichnen (Person erkannt, Text im Bild)
- Ähnlichkeiten finden (Dubletten)

### ❌ Was KI nicht darf:
- **KEINE automatischen Löschungen**
- **KEINE rechtlichen Entscheidungen** (Lizenzen)
- **KEINE automatische DSGVO-Freigabe**
- **KEINE CI-Änderungen ohne Freigabe**

## 📋 DSGVO-Compliance

Wenn `has_person = true`:
- Flag wird gesetzt
- `dsgvo_approved_by_admin` bleibt `false`
- Admin-Dashboard zeigt Warnung
- Admin muss explizit freigeben via `/api/admin/media/ai/approve`

## 🔧 Konfiguration

Aktuell: Mock-Modus (für Entwicklung)
Später: Echte KI-Provider (OpenAI, Google, Azure, etc.)

Konfiguration in `src/lib/media/ai/config.ts`:

```typescript
export const AI_CONFIG: Record<string, AIServiceConfig> = {
    tagging: {
        enabled: true,
        provider: "mock", // Später: "openai" | "google" | "azure"
        timeout_ms: 5000,
    },
    // ...
};
```

## 🚀 Nächste Schritte

1. **Echte KI-Provider integrieren:**
   - OpenAI Vision API
   - Google Cloud Vision
   - Azure Computer Vision

2. **Vector-DB für Smart Search:**
   - Embeddings generieren
   - Ähnlichkeitssuche optimieren

3. **Batch-Processing:**
   - Bestandsbilder nachträglich analysieren
   - Background-Jobs für große Mengen

4. **Admin-UI erweitern:**
   - KI-Vorschläge anzeigen
   - Approve/Reject-Buttons
   - Smart Search UI
   - Dubletten-Ansicht

## 📝 Status

- ✅ Datenstruktur erweitert (MediaMeta + AI-Felder)
- ✅ MySQL 8 Schema erweitert
- ✅ KI-Services als Stubs implementiert
- ✅ API-Endpunkte erstellt
- ✅ DSGVO-Compliance sichergestellt
- ⏳ Echte KI-Provider (TODO)
- ⏳ Admin-UI (TODO)

**Enterprise++ Standards:** ✅ Erfüllt






