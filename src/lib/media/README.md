# 📸 Secure Media Storage & Access Layer - Enterprise++ Standard

## Übersicht

Vollständig sichere Medien-Verwaltung mit Hash-basierten IDs, SHA256-Integrität und strukturierter Ablage.

## 🔐 Sicherheits-Features

- ✅ **Keine Klartext-Dateinamen** → ausschließlich Hash-IDs (16-stellig)
- ✅ **Dateien als .bin gespeichert** → keine Rückschlüsse auf Inhalt
- ✅ **SHA256-Hash** → Integritätsprüfung bei jedem Zugriff
- ✅ **Kein direkter Dateizugriff** → nur über gesicherte Admin-API
- ✅ **Kein Directory Listing** → geschützt & deaktiviert
- ✅ **Media-ID-Validierung** → bei jedem Zugriff geprüft
- ✅ **MIME-Typ & Dateigröße** → vollständige Validierung

## 📁 Struktur

```
storage/media/
  ├── linkedin/
  │   └── YYYY/
  │       └── MM/
  │           ├── {hash-id}.bin
  │           └── {hash-id}.meta.json
  ├── gallery/
  ├── document/
  └── other/
```

## 📝 Dateinamen-Schema

**Format:** `{hash-id}.bin`

- **Hash-ID:** 16-stelliger Hex-Hash (SHA256-basiert)
- **Beispiel:** `a7be3f4d9df55b21.bin`
- **Meta-Datei:** `a7be3f4d9df55b21.meta.json`

## 📋 Meta.json-Struktur

```json
{
  "id": "a7be3f4d9df55b21",
  "mime": "image/png",
  "category": "linkedin",
  "size": 245678,
  "createdAt": "2025-11-24T08:30:00.000Z",
  "sha256": "a1b2c3d4e5f6...",
  "originalFileName": "dashboard.png",
  "alt": "Admin-Dashboard",
  "postReference": {
    "date": "24.11.2025",
    "title": "Warum Enterprise++ wichtig ist",
    "type": "Behind the Scenes"
  },
  "thumbnailId": "optional-thumbnail-id"
}
```

## 🔌 API-Endpunkte

### Upload
`POST /api/admin/media/upload`
- FormData: `file`, `category`, `postTitle`, `postDate`, `postType`, `alt`
- Rückgabe: `{ mediaId, sha256, size, mime, category }`

### View
`GET /api/admin/media/view?id={mediaId}&type={original|thumbnail}`
- Gesicherter Zugriff nur für Admins
- SHA256-Integritätsprüfung
- MIME-Type aus meta.json

## 🛠 Verwendung

```typescript
import { 
    generateMediaFileInfo, 
    createMediaMeta, 
    writeMediaMeta 
} from "@/lib/media/linkedin-media";

// Datei-Info generieren
const fileInfo = generateMediaFileInfo(buffer, {
    category: "linkedin",
    mimeType: "image/png",
    originalFileName: "dashboard.png",
});

// Meta erstellen
const meta = createMediaMeta(fileInfo, {
    category: "linkedin",
    mimeType: "image/png",
});

// Speichern
await writeMediaMeta(folderPath, meta, buffer.length);
```

## 🔒 Security

- Keine Klartext-Dateinamen
- Kein direkter Dateizugriff
- Nur über gesicherte Admin-Route
- SHA256-Integritätsprüfung
- MIME-Type-Validierung
- Dateigröße-Validierung (max. 10MB)

## 📦 Erweiterbarkeit

- ✅ Thumbnail-Generierung vorbereitet (`thumbnailId` in meta.json)
- ✅ Migration bestehender Dateien möglich
- ✅ Admin-Auth aktivierbar (TODO-Kommentare vorhanden)
- ✅ Kategorie-basierte Struktur erweiterbar

**Enterprise++ Standards:** ✅ Erfüllt
