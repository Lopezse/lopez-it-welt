# LinkedIn Posts - Geschützt

⚠️ **Dieser Ordner ist geschützt**

Alle Dateien wurden in das sichere Media-System migriert:
- **Neuer Speicherort:** `storage/media/linkedin/`
- **Zugriff:** Nur über `/api/admin/media/view?id={mediaId}` (Admin-Auth erforderlich)

## Warum?

Direkter Zugriff auf Dateien in `public/` ist nicht sicher. Das neue System:
- ✅ Hash-basierte Dateinamen (keine Klartext-Namen)
- ✅ SHA256-Integritätsprüfung
- ✅ Admin-Authentifizierung erforderlich
- ✅ Kein Directory Listing
- ✅ Sichere API-Routen

## Zugriff auf migrierte Dateien

Verwende die Media-Verwaltung im Admin-Dashboard:
```
/admin/media
```

Oder die sichere API:
```
/api/admin/media/view?id={mediaId}
```
