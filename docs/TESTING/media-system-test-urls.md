# Secure Media System - Test-URLs

## 🎯 Admin-Dashboard

### Media-Verwaltung
```
http://localhost:3000/admin/media
```
- **Voraussetzung:** Als Admin eingeloggt
- **Funktionen:**
  - Medienliste mit Filterung nach Kategorie
  - Pagination
  - Detailansicht
  - Sichere Preview-Links

---

## 🔐 API-Endpunkte (mit Authentifizierung)

### 1. Medienliste abrufen
```bash
GET /api/admin/media/list
GET /api/admin/media/list?category=linkedin
GET /api/admin/media/list?limit=50&offset=0
```

**Beispiel mit curl:**
```bash
curl -X GET "http://localhost:3000/api/admin/media/list?category=linkedin" \
  -H "Cookie: adm_session=YOUR_SESSION_TOKEN" \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "media": [
      {
        "id": "acc35e30de99a806",
        "mime": "image/png",
        "category": "linkedin",
        "size": 123456,
        "createdAt": "2025-11-24T13:09:01.682Z",
        "originalFileName": "2025-11-24_enterprise-standards.png",
        "folderPath": "storage/media/linkedin/2025/11",
        "fileExists": true,
        "fileSize": 123456,
        "lastModified": "2025-11-24T13:09:01.700Z"
      }
    ],
    "pagination": {
      "total": 1,
      "limit": 100,
      "offset": 0,
      "hasMore": false
    }
  }
}
```

---

### 2. Media-Details abrufen
```bash
GET /api/admin/media/detail?id={mediaId}
```

**Beispiel:**
```bash
curl -X GET "http://localhost:3000/api/admin/media/detail?id=acc35e30de99a806" \
  -H "Cookie: adm_session=YOUR_SESSION_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "acc35e30de99a806",
    "mime": "image/png",
    "category": "linkedin",
    "size": 123456,
    "createdAt": "2025-11-24T13:09:01.682Z",
    "sha256": "...",
    "originalFileName": "2025-11-24_enterprise-standards.png",
    "alt": "Enterprise Standards",
    "thumbnail": {
      "id": "thumbnail_id",
      "mime": "image/webp",
      "size": 12345
    },
    "fileExists": true,
    "fileSize": 123456,
    "lastModified": "2025-11-24T13:09:01.700Z"
  }
}
```

---

### 3. Media ansehen (Preview)
```bash
GET /api/admin/media/view?id={mediaId}
GET /api/admin/media/view?id={mediaId}&type=thumbnail
```

**Beispiel im Browser:**
```
http://localhost:3000/api/admin/media/view?id=acc35e30de99a806
```

**Hinweis:** 
- Muss als Admin eingeloggt sein (Cookie oder Authorization Header)
- Gibt das Bild direkt zurück (Content-Type: image/png)
- Thumbnail: `?id={mediaId}&type=thumbnail`

---

### 4. Media hochladen
```bash
POST /api/admin/media/upload
```

**Beispiel mit curl:**
```bash
curl -X POST "http://localhost:3000/api/admin/media/upload" \
  -H "Cookie: adm_session=YOUR_SESSION_TOKEN" \
  -F "file=@/path/to/image.png" \
  -F "category=linkedin" \
  -F "alt=Test Image" \
  -F "postDate=2025-11-24" \
  -F "postTitle=Test Post" \
  -F "postType=Behind the Scenes"
```

**Response:**
```json
{
  "success": true,
  "mediaId": "new_hash_id",
  "sha256": "...",
  "size": 123456,
  "mime": "image/png",
  "category": "linkedin",
  "thumbnailId": "thumbnail_hash_id"
}
```

---

## 🛡️ Sicherheits-Tests (sollten 403 zurückgeben)

### 1. Directory Listing blockieren
```bash
GET /linkedin-posts/
GET /uploads/images/
GET /uploads/
```

**Erwartete Response:**
```json
{
  "success": false,
  "message": "Direkter Zugriff auf Media-Verzeichnisse nicht erlaubt",
  "error": "FORBIDDEN_DIRECTORY_ACCESS"
}
```

**Status:** `403 Forbidden`

---

### 2. Direkter Dateizugriff blockieren
```bash
GET /linkedin-posts/2025-11-24_enterprise-standards.png
GET /uploads/images/any-image.png
```

**Erwartete Response:**
```json
{
  "success": false,
  "message": "Direkter Zugriff auf Media-Dateien nicht erlaubt. Bitte verwenden Sie die sichere Admin-API.",
  "error": "FORBIDDEN_DIRECT_FILE_ACCESS",
  "hint": "Verwenden Sie /api/admin/media/view?id={mediaId} für authentifizierten Zugriff"
}
```

**Status:** `403 Forbidden`

---

## 🧪 Test-Szenarien

### Szenario 1: Als Admin eingeloggt
1. ✅ `/admin/media` öffnen → Sollte Medienliste anzeigen
2. ✅ Filter nach "linkedin" wählen → Sollte nur LinkedIn-Medien zeigen
3. ✅ "Ansehen" klicken → Sollte Bild anzeigen
4. ✅ Direkt `/api/admin/media/view?id=acc35e30de99a806` aufrufen → Sollte Bild anzeigen

### Szenario 2: Nicht eingeloggt
1. ❌ `/admin/media` öffnen → Sollte zu `/admin/login` weiterleiten
2. ❌ `/api/admin/media/list` aufrufen → Sollte `401 Unauthorized` zurückgeben
3. ❌ `/api/admin/media/view?id=acc35e30de99a806` aufrufen → Sollte `401 Unauthorized` zurückgeben

### Szenario 3: Sicherheits-Checks
1. ❌ `/linkedin-posts/` aufrufen → Sollte `403 Forbidden` zurückgeben
2. ❌ `/linkedin-posts/2025-11-24_enterprise-standards.png` aufrufen → Sollte `403 Forbidden` zurückgeben
3. ❌ `/uploads/images/` aufrufen → Sollte `403 Forbidden` zurückgeben

---

## 📝 Session-Token ermitteln

### Option 1: Browser DevTools
1. Öffne `/admin/login` und logge dich ein
2. Öffne DevTools (F12) → Application/Storage → Cookies
3. Suche nach `adm_session` Cookie
4. Kopiere den Wert

### Option 2: Network Tab
1. Öffne DevTools → Network Tab
2. Führe eine Admin-Aktion aus (z.B. `/admin/media` öffnen)
3. Klicke auf die Request → Headers
4. Suche nach `Cookie: adm_session=...` oder `Authorization: Bearer ...`

---

## 🔍 Quick Test (Browser)

1. **Als Admin einloggen:**
   ```
   http://localhost:3000/admin/login
   ```

2. **Media-Verwaltung öffnen:**
   ```
   http://localhost:3000/admin/media
   ```

3. **Direkter Preview-Link (im neuen Tab):**
   ```
   http://localhost:3000/api/admin/media/view?id=acc35e30de99a806
   ```

4. **Sicherheits-Test (sollte 403 geben):**
   ```
   http://localhost:3000/linkedin-posts/
   http://localhost:3000/linkedin-posts/2025-11-24_enterprise-standards.png
   ```

---

## ✅ Erfolgreiche Tests

- ✅ Media-Verwaltung zeigt migrierte Dateien
- ✅ Filterung nach Kategorie funktioniert
- ✅ Preview-Links funktionieren (nur als Admin)
- ✅ Direkter Zugriff auf alte Pfade wird blockiert (403)
- ✅ Directory Listing wird blockiert (403)
- ✅ Nicht-authentifizierte Anfragen werden blockiert (401)








