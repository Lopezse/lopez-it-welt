# 🎨 ADMIN SETTINGS PAGE - PLANUNG (Agent-A)

**Datum:** 2025-11-30  
**Status:** 📋 **PLANUNG**  
**Standard:** Enterprise++ (IBM Carbon / SAP Fiori / Siemens)

---

## 📋 ÜBERSICHT

Vollständige Admin-Einstellungen-Seite mit 6 Hauptbereichen:
- A) Benutzerprofil
- B) Sicherheit & Account
- C) Unternehmen & Branding
- D) KI-Einstellungen
- E) Benachrichtigungen
- F) System

---

## 🏗️ ARCHITEKTUR

### **1. Route-Struktur**

```
/admin/settings
├── page.tsx (Hauptseite mit Tabs)
└── [tab]/page.tsx (Optional: separate Routen)
```

### **2. Komponenten-Struktur**

```
src/components/admin/settings/
├── SettingsLayout.tsx (Wrapper mit Tabs)
├── UserProfile.tsx (A)
├── SecurityAccount.tsx (B)
├── CompanyBranding.tsx (C)
├── AISettings.tsx (D)
├── Notifications.tsx (E)
└── System.tsx (F)
```

### **3. API-Routen**

```
/api/admin/settings/
├── profile (GET, PUT) - Benutzerprofil
├── security (GET, PUT) - Sicherheit
├── company (GET, PUT) - Unternehmen
├── ai (GET, PUT) - KI-Einstellungen
├── notifications (GET, PUT) - Benachrichtigungen
└── system (GET, PUT) - System
```

---

## 🎨 DESIGN-SYSTEM

### **Farben (Lopez IT Welt CI)**

- **Lopez:** `#C99700` (Gold)
- **IT Welt:** Blau-Gradient `#007bff → #0056b3`
- **Dark Theme:** Lopez Carbon Dark
- **Akzente:** Gold `#ffd700` für aktive Elemente

### **Komponenten-Style**

- IBM Carbon g100 ähnlich
- Subtile Borders (`#272a33`)
- Sanfte Hover-Effekte
- Focus-Rings für Accessibility
- Konsistente Abstände

---

## 📦 BEREICHE (DETAILPLANUNG)

### **A) Benutzerprofil**

**Komponente:** `UserProfile.tsx`

**Felder:**
- Avatar-Upload (Bild hochladen, Vorschau)
- Anzeigename (Vorname, Nachname)
- E-Mail (readonly, mit Verifizierungs-Status)
- Telefon (optional)
- Passwort ändern (Modal mit Validierung)
- 2FA aktivieren/deaktivieren (Toggle)
- Login-Historie (Tabelle: Datum, IP, Gerät, Status)

**API:**
- `GET /api/admin/settings/profile` - Profil laden
- `PUT /api/admin/settings/profile` - Profil aktualisieren
- `POST /api/admin/settings/profile/avatar` - Avatar hochladen
- `PUT /api/admin/settings/profile/password` - Passwort ändern
- `GET /api/admin/settings/profile/login-history` - Login-Historie

**Validierung:**
- E-Mail-Format
- Passwort-Stärke (min. 8 Zeichen, Groß-/Kleinbuchstaben, Zahlen)
- Avatar-Größe (max. 2MB, JPG/PNG)

---

### **B) Sicherheit & Account**

**Komponente:** `SecurityAccount.tsx`

**Bereiche:**
1. **2FA Einstellungen**
   - QR-Code anzeigen
   - Backup-Codes generieren
   - Aktivieren/Deaktivieren

2. **API-Token verwalten**
   - Liste aller Token
   - Neuen Token erstellen (Name, Ablaufdatum)
   - Token löschen
   - Token kopieren (nur einmal sichtbar)

3. **Geräteverwaltung**
   - Aktive Sessions anzeigen
   - Gerät abmelden
   - Alle anderen Geräte abmelden

**API:**
- `GET /api/admin/settings/security` - Sicherheitseinstellungen
- `PUT /api/admin/settings/security/2fa` - 2FA aktivieren/deaktivieren
- `GET /api/admin/settings/security/2fa/qr` - QR-Code generieren
- `GET /api/admin/settings/security/tokens` - API-Token auflisten
- `POST /api/admin/settings/security/tokens` - Neuen Token erstellen
- `DELETE /api/admin/settings/security/tokens/:id` - Token löschen
- `GET /api/admin/settings/security/sessions` - Aktive Sessions
- `DELETE /api/admin/settings/security/sessions/:id` - Session beenden

**Validierung:**
- Token-Name (min. 3 Zeichen)
- Ablaufdatum (mind. 1 Tag in der Zukunft)

---

### **C) Unternehmen & Branding**

**Komponente:** `CompanyBranding.tsx`

**Bereiche:**
1. **Firmeninformationen**
   - Firmenname
   - Adresse
   - Kontaktinformationen

2. **Logo-Upload**
   - Logo hell (für Light Theme)
   - Logo dunkel (für Dark Theme)
   - Vorschau
   - Empfohlene Größe: 200x200px

3. **Farben**
   - Lopez-Gold: `#C99700` (Picker)
   - IT-Welt-Blau: `#007bff` (Picker)
   - IT-Welt-Blau-Dunkel: `#0056b3` (Picker)
   - Vorschau

4. **Rechtliches**
   - Impressum (Text-Editor)
   - Datenschutz (Text-Editor)

**API:**
- `GET /api/admin/settings/company` - Unternehmensdaten
- `PUT /api/admin/settings/company` - Unternehmensdaten aktualisieren
- `POST /api/admin/settings/company/logo` - Logo hochladen
- `PUT /api/admin/settings/company/colors` - Farben aktualisieren
- `PUT /api/admin/settings/company/legal` - Rechtstexte aktualisieren

**Validierung:**
- Logo-Format (PNG, SVG, JPG)
- Logo-Größe (max. 1MB)
- Farb-Format (Hex)

---

### **D) KI-Einstellungen**

**Komponente:** `AISettings.tsx`

**Bereiche:**
1. **Provider-Auswahl**
   - OpenAI (API-Key, Model)
   - LLaMA (Local/Remote, Model)
   - Local (Model-Pfad)

2. **Model-Konfiguration**
   - Standard-Model
   - Temperature
   - Max Tokens
   - Top-P

3. **Token-Limits**
   - Pro Request
   - Pro Tag
   - Pro Monat

4. **RAG-Einstellungen**
   - Quellen aktivieren/deaktivieren
   - Kategorien verwalten
   - Embedding-Model
   - Chunk-Size

5. **KI-Logs**
   - Logging aktivieren/deaktivieren
   - Log-Level (Debug, Info, Warn, Error)
   - Log-Retention (Tage)

**API:**
- `GET /api/admin/settings/ai` - KI-Einstellungen
- `PUT /api/admin/settings/ai` - KI-Einstellungen aktualisieren
- `POST /api/admin/settings/ai/test` - Test-Verbindung

**Validierung:**
- API-Key-Format
- Model-Name
- Token-Limits (min. 100, max. 100000)
- Temperature (0-2)

---

### **E) Benachrichtigungen**

**Komponente:** `Notifications.tsx`

**Bereiche:**
1. **E-Mail-Vorlagen**
   - Liste aller Vorlagen
   - Vorlage bearbeiten
   - Variablen: {{name}}, {{email}}, etc.

2. **E-Mail-Absender**
   - Absender-Name
   - Absender-E-Mail
   - Reply-To

3. **System-Benachrichtigungen**
   - E-Mail-Benachrichtigungen aktivieren/deaktivieren
   - Benachrichtigungstypen:
     - Neue Benutzer
     - Fehler/Alerts
     - Backup-Erfolg
     - System-Updates

**API:**
- `GET /api/admin/settings/notifications` - Benachrichtigungseinstellungen
- `PUT /api/admin/settings/notifications` - Benachrichtigungen aktualisieren
- `GET /api/admin/settings/notifications/templates` - E-Mail-Vorlagen
- `PUT /api/admin/settings/notifications/templates/:id` - Vorlage aktualisieren

**Validierung:**
- E-Mail-Format
- Vorlagen-Variablen (syntaktisch korrekt)

---

### **F) System**

**Komponente:** `System.tsx`

**Bereiche:**
1. **Backups**
   - Liste aller Backups
   - Backup erstellen
   - Backup wiederherstellen
   - Backup löschen

2. **Cronjobs**
   - Liste aller Cronjobs
   - Status (aktiv/inaktiv)
   - Letzte Ausführung
   - Nächste Ausführung

3. **Systemstatus**
   - Datenbank-Status
   - API-Status
   - Queue-Status
   - Disk-Space

4. **Version**
   - Aktuelle Version
   - Changelog
   - Update-Check

5. **Cache**
   - Cache leeren (Button)
   - Cache-Statistiken

**API:**
- `GET /api/admin/settings/system` - System-Informationen
- `GET /api/admin/settings/system/backups` - Backups auflisten
- `POST /api/admin/settings/system/backups` - Backup erstellen
- `POST /api/admin/settings/system/backups/:id/restore` - Backup wiederherstellen
- `DELETE /api/admin/settings/system/backups/:id` - Backup löschen
- `GET /api/admin/settings/system/cronjobs` - Cronjobs auflisten
- `GET /api/admin/settings/system/status` - Systemstatus
- `POST /api/admin/settings/system/cache/clear` - Cache leeren

**Validierung:**
- Backup-Name (eindeutig)
- Cronjob-Syntax (Cron-Format)

---

## 🔒 RBAC (ROLE-BASED ACCESS CONTROL)

**Berechtigungen:**
- **Owner:** Vollzugriff auf alle Bereiche
- **Admin:** Vollzugriff auf alle Bereiche
- **Andere Rollen:** Kein Zugriff (403)

**Middleware:**
- `requireRole(['owner', 'admin'])` für alle Routen
- Prüfung in API-Routen und Komponenten

---

## 📊 DATENBANK-SCHEMA

### **settings_profile**
```sql
- user_id (FK)
- first_name
- last_name
- phone
- avatar_url
- updated_at
```

### **settings_security**
```sql
- user_id (FK)
- two_factor_enabled
- two_factor_secret
- backup_codes
- updated_at
```

### **api_tokens**
```sql
- id
- user_id (FK)
- name
- token_hash
- expires_at
- created_at
- last_used_at
```

### **settings_company**
```sql
- id
- company_name
- address
- contact_email
- contact_phone
- logo_light_url
- logo_dark_url
- color_lopez
- color_itwelt
- color_itwelt_dark
- impressum_text
- datenschutz_text
- updated_at
```

### **settings_ai**
```sql
- id
- provider (openai/llama/local)
- api_key_encrypted
- model
- temperature
- max_tokens
- top_p
- token_limit_per_request
- token_limit_per_day
- token_limit_per_month
- rag_enabled
- rag_sources
- rag_categories
- embedding_model
- chunk_size
- logging_enabled
- log_level
- log_retention_days
- updated_at
```

### **settings_notifications**
```sql
- id
- sender_name
- sender_email
- reply_to
- email_notifications_enabled
- notify_new_users
- notify_errors
- notify_backups
- notify_updates
- updated_at
```

### **email_templates**
```sql
- id
- name
- subject
- body_html
- body_text
- variables
- updated_at
```

---

## 🧪 TESTING

### **Unit Tests**
- Komponenten-Rendering
- Form-Validierung
- API-Calls

### **Integration Tests**
- API-Routen
- Datenbank-Operationen
- RBAC-Prüfungen

### **E2E Tests**
- Vollständiger Workflow
- Dark Mode
- Responsive Design

---

## 📝 IMPLEMENTIERUNGS-REIHENFOLGE

1. ✅ **Planung** (Agent-A) - DIESES DOKUMENT
2. ⏳ **Route & Layout** (Agent-B)
3. ⏳ **Komponente A: Benutzerprofil** (Agent-B)
4. ⏳ **Komponente B: Sicherheit** (Agent-B)
5. ⏳ **Komponente C: Unternehmen** (Agent-B)
6. ⏳ **Komponente D: KI** (Agent-B)
7. ⏳ **Komponente E: Benachrichtigungen** (Agent-B)
8. ⏳ **Komponente F: System** (Agent-B)
9. ⏳ **API-Routen** (Agent-B)
10. ⏳ **QA** (Agent-C)

---

## ✅ QUALITÄTSKRITERIEN (Agent-C)

- ✅ TypeScript-Fehler: 0
- ✅ ESLint-Fehler: 0
- ✅ Dark Mode: Vollständig korrekt
- ✅ RBAC: Vollständig implementiert
- ✅ Validierung: Alle Felder
- ✅ Accessibility: WCAG AA
- ✅ Responsive: Mobile + Desktop
- ✅ Performance: < 2s Ladezeit

---

**Status:** 📋 **PLANUNG ABGESCHLOSSEN - BEREIT FÜR IMPLEMENTIERUNG**

