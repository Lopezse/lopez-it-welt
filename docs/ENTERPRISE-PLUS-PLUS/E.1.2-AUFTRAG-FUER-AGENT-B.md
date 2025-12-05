# 🎯 DIREKTER AUFTRAG FÜR AGENT B (BUILDER)

## E.1.2: Backups komplettieren

**Version:** 1.0  
**Stand:** 29.11.2025  
**Status:** 🚀 **BEREIT FÜR IMPLEMENTIERUNG**  
**Koordiniert durch:** Agent A (Planner & Coordinator)

---

## 📋 AUFTRAG

**Agent B (Builder), bitte implementiere E.1.2 (Backups komplettieren) gemäß den folgenden Spezifikationen.**

---

## ✅ AUSGANGSLAGE

**Bereits vorhanden:**
- ✅ `/admin/backups` (Grundstruktur mit Mock-Daten)
- ✅ UI-Grundstruktur vorhanden (Status, History, Restore Points, Settings)

**Fehlt noch:**
- ❌ Backup-API-Endpoints (`/api/admin/backups`)
- ❌ "Backup jetzt erstellen" Button (funktionsfähig)
- ❌ "Backup herunterladen" Button
- ❌ "Backup wiederherstellen" (admin-only)
- ❌ Backup-Status (Dashboard, real-time)
- ❌ Backup-Logs-Viewer (UI)
- ❌ Backup-Erstellung (Backend-Logik)
- ❌ Backup-Download (Backend-Logik)
- ❌ Backup-Wiederherstellung (Backend-Logik)

---

## 🎯 ZU IMPLEMENTIEREN

### **1. Backup-API-Endpoints**

**Pfad:** `src/app/api/admin/backups/route.ts`

**Endpoints:**

#### **GET /api/admin/backups** – Backup-Liste

**Funktionen:**
- Liste aller Backups abrufen
- Filter (Zeitraum, Typ, Status)
- Pagination (limit, offset)
- Sortierung (neueste zuerst)

**Response:**
```typescript
{
  success: true,
  data: {
    backups: [
      {
        id: string;
        timestamp: string;
        type: "full" | "incremental" | "differential";
        size: number; // Bytes
        status: "success" | "error" | "running" | "corrupted";
        duration?: number; // Sekunden
        files: number;
        location: string;
        description?: string;
      }
    ],
    total: number;
    limit: number;
    offset: number;
  }
}
```

**RBAC:** `system.manage` (nur Admins)

**Referenzen:**
- `src/app/api/orchestrator/workflows/route.ts` (Pattern für GET-Endpoint mit RBAC)

---

#### **POST /api/admin/backups** – Backup erstellen

**Funktionen:**
- Backup erstellen (full, incremental, differential)
- Backup-Typ wählen
- Backup starten (asynchron)
- Backup-ID zurückgeben

**Request Body:**
```typescript
{
  type: "full" | "incremental" | "differential";
  description?: string;
  compression?: boolean; // Default: true
  encryption?: boolean; // Default: true
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    backup_id: string;
    status: "running";
    message: "Backup wurde gestartet";
  }
}
```

**RBAC:** `system.manage` (nur Admins)

**Backend-Logik:**
- Backup-Verzeichnis: `/backups/system/` (oder konfigurierbar)
- Backup-Dateiname: `backup-{type}-{timestamp}.tar.gz` (oder ähnlich)
- Backup-Prozess: Asynchron (Worker/Queue)
- Backup-Status: In Datenbank speichern (Tabelle: `system_backups`)

**Referenzen:**
- `src/app/api/orchestrator/workflows/route.ts` (Pattern für POST-Endpoint mit RBAC)

---

#### **GET /api/admin/backups/[id]** – Backup-Detail

**Funktionen:**
- Backup-Detail abrufen
- Backup-Status prüfen
- Backup-Metadaten anzeigen

**Response:**
```typescript
{
  success: true,
  data: {
    id: string;
    timestamp: string;
    type: "full" | "incremental" | "differential";
    size: number;
    status: "success" | "error" | "running" | "corrupted";
    duration?: number;
    files: number;
    location: string;
    description?: string;
    logs?: string[]; // Backup-Logs
  }
}
```

**RBAC:** `system.manage` (nur Admins)

---

#### **GET /api/admin/backups/[id]/download** – Backup herunterladen

**Funktionen:**
- Backup-Datei herunterladen
- Stream als Binary-Response
- Content-Type: `application/octet-stream` oder `application/gzip`

**Response:**
- Binary-Stream (Backup-Datei)
- Headers: `Content-Disposition: attachment; filename="backup-{type}-{timestamp}.tar.gz"`

**RBAC:** `system.manage` (nur Admins)

**Backend-Logik:**
- Backup-Datei aus `/backups/system/` lesen
- Stream zurückgeben
- Fehlerbehandlung (Datei nicht gefunden, etc.)

---

#### **POST /api/admin/backups/[id]/restore** – Backup wiederherstellen

**Pfad:** `src/app/api/admin/backups/[id]/restore/route.ts`

**Funktionen:**
- Backup wiederherstellen (admin-only)
- Bestätigung erforderlich
- Wiederherstellung starten (asynchron)
- Warnung bei laufendem System

**Request Body:**
```typescript
{
  confirm: boolean; // Muss true sein
  target_location?: string; // Optional: Ziel-Verzeichnis
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    restore_id: string;
    status: "running";
    message: "Wiederherstellung wurde gestartet";
    warning?: string; // Falls System läuft
  }
}
```

**RBAC:** `system.manage` (nur Admins)

**Backend-Logik:**
- Backup-Datei extrahieren
- Datenbank wiederherstellen (falls DB-Backup)
- Dateien wiederherstellen (falls File-Backup)
- Wiederherstellung-Status: In Datenbank speichern (Tabelle: `system_restores`)

**Sicherheit:**
- ⚠️ **KRITISCH:** Nur Admins dürfen wiederherstellen
- ⚠️ **WARNUNG:** System sollte während Wiederherstellung pausiert werden
- ⚠️ **BESTÄTIGUNG:** Explizite Bestätigung erforderlich

---

### **2. Backup-Liste (`BackupList.tsx`)**

**Pfad:** `src/components/admin/backups/BackupList.tsx`

**Props:**
```typescript
interface BackupListProps {
  backups: Backup[];
  onRefresh: () => void;
  onCreateBackup: () => void;
  onDownloadBackup: (id: string) => void;
  onRestoreBackup: (id: string) => void;
}
```

**Funktionen:**
- Backup-Liste anzeigen (Tabelle)
- "Backup jetzt erstellen" Button
- "Backup herunterladen" Button (pro Backup)
- "Backup wiederherstellen" Button (pro Backup, admin-only)
- Backup-Status (Badge: success, error, running, corrupted)
- Backup-Typ (Badge: full, incremental, differential)
- Sortierung (neueste zuerst)
- Filter (Typ, Status)

**UI-Elemente:**
- Tabelle: ID, Typ, Datum, Größe, Status, Aktionen
- Status-Badges (farbcodiert)
- Typ-Badges (farbcodiert)
- Aktionen-Buttons (Download, Restore)
- "Backup jetzt erstellen" Button (Header)

**RBAC:** `system.manage` (nur Admins)

**Dark Mode:** ✅ Vollständig unterstützt

**Referenzen:**
- `src/components/orchestrator/uoc/UnifiedAlertList.tsx` (Pattern für Liste mit Aktionen)

---

### **3. Backup-Erstellung (`BackupCreate.tsx`)**

**Pfad:** `src/components/admin/backups/BackupCreate.tsx`

**Props:**
```typescript
interface BackupCreateProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}
```

**Funktionen:**
- Dialog für Backup-Erstellung
- Backup-Typ wählen (full, incremental, differential)
- Beschreibung (optional)
- Optionen (Komprimierung, Verschlüsselung)
- Backup starten
- Fortschrittsanzeige (wenn Backup läuft)

**UI-Elemente:**
- Dialog (Modal)
- Formular: Typ (Select), Beschreibung (Textarea), Optionen (Checkboxen)
- Speichern-Button, Abbrechen-Button
- Fortschrittsanzeige (Progress Bar, wenn Backup läuft)

**API-Call:**
- `POST /api/admin/backups`

**Dark Mode:** ✅ Vollständig unterstützt

**Referenzen:**
- `src/components/ui/Dialog.tsx` (Dialog-Pattern)

---

### **4. Backup-Wiederherstellung (`BackupRestore.tsx`)**

**Pfad:** `src/components/admin/backups/BackupRestore.tsx`

**Props:**
```typescript
interface BackupRestoreProps {
  backupId: string;
  backupName: string;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}
```

**Funktionen:**
- Dialog für Backup-Wiederherstellung (admin-only)
- Backup auswählen (bereits ausgewählt)
- Warnung anzeigen (System sollte pausiert werden)
- Bestätigung erforderlich (Checkbox: "Ich bestätige, dass ich die Wiederherstellung starten möchte")
- Wiederherstellung starten
- Fortschrittsanzeige (wenn Wiederherstellung läuft)

**UI-Elemente:**
- Dialog (Modal)
- Warnung (WarningBanner): "⚠️ WARNUNG: Das System sollte während der Wiederherstellung pausiert werden."
- Bestätigungs-Checkbox
- Wiederherstellen-Button (rot, mit Warnung), Abbrechen-Button
- Fortschrittsanzeige (Progress Bar, wenn Wiederherstellung läuft)

**API-Call:**
- `POST /api/admin/backups/[id]/restore`

**RBAC:** `system.manage` (nur Admins)

**Dark Mode:** ✅ Vollständig unterstützt

**Referenzen:**
- `src/components/ui/ConfirmDialog.tsx` (Bestätigungs-Dialog-Pattern)
- `src/components/ui/WarningBanner.tsx` (Warnung-Pattern)

---

### **5. Backup-Logs-Viewer (`BackupLogs.tsx`)**

**Pfad:** `src/components/admin/backups/BackupLogs.tsx`

**Props:**
```typescript
interface BackupLogsProps {
  backupId?: string; // Optional: Logs für spezifisches Backup
}
```

**Funktionen:**
- Backup-Logs anzeigen (Liste)
- Filter (Zeitraum, Status, Typ)
- Export (CSV, PDF)
- Auto-Refresh (wenn Backup läuft)

**UI-Elemente:**
- Logs-Liste (Tabelle oder Log-Viewer)
- Filter-Bar (Zeitraum, Status, Typ)
- Export-Buttons (CSV, PDF)
- Auto-Refresh-Toggle (wenn Backup läuft)
- Spalten: Zeitstempel, Level, Nachricht, Backup-ID

**API:**
- `GET /api/admin/backups/[id]` (Logs im Detail-Response)
- Oder: `GET /api/admin/backups/logs?backup_id=[id]` (neu zu erstellen)

**Dark Mode:** ✅ Vollständig unterstützt

**Referenzen:**
- `src/components/orchestrator/logs/LogList.tsx` (Pattern für Logs-Viewer)

---

### **6. Backup-Status-Dashboard**

**Integration in:** `src/app/admin/backups/page.tsx`

**Funktionen:**
- Backup-Status (Dashboard)
- Letztes Backup (Datum, Status)
- Nächstes Backup (Datum, wenn automatisch)
- Backup-Statistik (Anzahl, Gesamtgröße, Erfolgsrate)
- Real-time Updates (wenn Backup läuft)

**UI-Elemente:**
- Status-Card (Letztes Backup, Nächstes Backup)
- Statistik-Cards (Anzahl, Gesamtgröße, Erfolgsrate)
- Auto-Refresh (wenn Backup läuft)

**API:**
- `GET /api/admin/backups?limit=1&sort=desc` (Letztes Backup)
- Oder: `GET /api/admin/backups/status` (neu zu erstellen)

**Dark Mode:** ✅ Vollständig unterstützt

---

## ✅ ERFOLGSKRITERIEN

**E.1.2 ist produktionsreif, wenn:**
- ✅ Backup-API-Endpoints funktionieren (GET, POST, GET [id], GET [id]/download, POST [id]/restore)
- ✅ Backup-Erstellung funktioniert (Dialog, API-Call, Fortschrittsanzeige)
- ✅ Backup-Download funktioniert (Button, API-Call, Download startet)
- ✅ Backup-Wiederherstellung funktioniert (Dialog, Bestätigung, API-Call, admin-only)
- ✅ Backup-Logs-Viewer funktioniert (Logs anzeigen, Filter, Export)
- ✅ Backup-Status-Dashboard funktioniert (Status, Statistik, Real-time Updates)
- ✅ RBAC korrekt implementiert (`system.manage` für alle Aktionen)
- ✅ Fehlerbehandlung korrekt (ErrorBanner, WarningBanner, ConfirmDialog)
- ✅ Dark Mode vollständig unterstützt
- ✅ 0 TypeScript-Fehler
- ✅ 0 ESLint-Fehler
- ✅ Enterprise++ Standards eingehalten
- ✅ GoBD-konform (Audit-Logs für alle Aktionen)

---

## 📚 REFERENZEN

**Hauptdokumente:**
- `E.1-HANDBOOK-FOR-BUILDER.md` E.1.2 – Vollständiger Implementierungsauftrag
- `E.1-OVERVIEW.md` – Gesamtübersicht
- `E.1-STATUS-ANALYSE.md` – Status-Analyse

**Bestehende Seiten:**
- `src/app/admin/backups/page.tsx` (Grundstruktur vorhanden)

**Bestehende Komponenten:**
- `src/components/ui/ErrorBanner.tsx` – Fehlerbehandlung
- `src/components/ui/WarningBanner.tsx` – Warnungen
- `src/components/ui/StatusBadge.tsx` – Status-Badges
- `src/components/ui/ConfirmDialog.tsx` – Bestätigungs-Dialog
- `src/components/ui/Dialog.tsx` – Dialog-Pattern

**Bestehende API-Patterns:**
- `src/app/api/orchestrator/workflows/route.ts` (GET/POST Pattern mit RBAC)
- `src/app/api/orchestrator/workflows/[id]/route.ts` (GET Pattern mit RBAC)

**Backend-Logik:**
- Backup-Verzeichnis: `/backups/system/` (oder konfigurierbar)
- Datenbank-Tabellen: `system_backups`, `system_restores` (neu zu erstellen)
- Backup-Prozess: Asynchron (Worker/Queue empfohlen)

---

## 🚀 START

**Agent B, bitte beginne mit der Implementierung von E.1.2 (Backups komplettieren).**

**Reihenfolge:**
1. Backup-API-Endpoints implementieren (`/api/admin/backups/route.ts`, `/api/admin/backups/[id]/route.ts`, `/api/admin/backups/[id]/download/route.ts`, `/api/admin/backups/[id]/restore/route.ts`)
2. Backup-Liste implementieren (`BackupList.tsx`)
3. Backup-Erstellung implementieren (`BackupCreate.tsx`)
4. Backup-Wiederherstellung implementieren (`BackupRestore.tsx`)
5. Backup-Logs-Viewer implementieren (`BackupLogs.tsx`)
6. Backup-Status-Dashboard erweitern (`/admin/backups/page.tsx`)

**Nach Abschluss:**
- Agent C prüft E.1.2 (Code-Review, Quality-Assurance, DSGVO/DSFA-Konformität)
- Agent A aktualisiert Status und bereitet E.1.3 vor

---

**Viel Erfolg bei der Implementierung! 🚀**

**Agent A (Planner & Coordinator)**  
*Status dokumentiert, E.1.2 bereit für Implementierung*



