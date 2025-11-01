# Auftrag für den nächsten Chat / Entwickler / KI

**Stand:** 29.07.2025
**Projekt:** Lopez IT Welt – Kompletter Neuaufbau nach deutschen, barrierefreien und gesetzlichen Vorgaben

## ✅ Warum Modularaufbau so wichtig ist:

| Vorteil                          | Erklärung                                                                                                             |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| 🔧 **Flexibel erweiterbar**      | Du kannst neue Funktionen (z. B. Shop, Kundenverwaltung, Newsletter) jederzeit nachrüsten – ohne den Rest anzufassen. |
| 🔄 **Wartungsfreundlich**        | Einzelne Module lassen sich austauschen oder verbessern, ohne dass du andere Bereiche beschädigst.                    |
| 🚀 **Schneller Online gehen**    | Du kannst sofort starten und später schrittweise erweitern.                                                           |
| 🔐 **Sicherer & strukturierter** | Rechte, Daten und Inhalte können pro Modul sauber getrennt werden.                                                    |
| 🧠 **KI-gestützt entwickelbar**  | Die KI kann gezielt an Modulen arbeiten – z. B. nur den Shop oder nur das Login verbessern.                           |
| 🗂️ **Datenbank ist vorbereitet** | Du kannst Tabellen, APIs und Benutzerrechte pro Modul definieren.                                                     |

### 🔍 Was heißt "modular" konkret bei dir?

**Basis-Module (bereits geplant oder in Arbeit):**

- **Header/Footer** – statisch sichtbar, fix integriert
- **Startseite** – zentraler Einstiegspunkt mit Sprachauswahl
- **Login/Registrierung** – bereits mit Next.js umgesetzt
- **Adminbereich** – Zugriff auf Inhalte, Texte, später auch Kundendaten
- **Sprachmodul** – DE / EN / ES

**Zukünftige Module (einzeln nachrüstbar):**

- **Shop-Modul** (Produktdatenbank, Warenkorb, Kasse)
- **Kundencenter** (Supportanfragen, Auftragsstatus, Rechnungen)
- **Newsletter-Modul** (z. B. mit Mailchimp oder Sendinblue API)
- **Statistikmodul** (Besucherzahlen, Umsätze, Klickverhalten)
- **Backup- & Recovery-Modul** (Sicherung deiner Daten mit Restore-Funktion)
- **Datenpflege-Modul für Kundenprojekte** (wie du bereits erwähnt hast)

## ✅ Was bereits erledigt ist:

1. **Next.js App Router** - ✅ Implementiert
2. **Deutsche Tailwind-Konfiguration** - ✅ Implementiert
3. **Barrierefreie Komponenten** - ✅ Implementiert
4. **Mehrsprachigkeit (DE/EN/ES)** - ✅ Implementiert
5. **Anmeldung und Registrierung** - ✅ Implementiert
6. **Responsive Design** - ✅ Implementiert
7. **Header & Footer** - ✅ Implementiert

## 🚨 **KRITISCHE PROBLEME - SOFORT BEHEBEN (2025-01-19)**

### ❌ **WEBSITE-FUNKTIONALITÄT DEFEKT**

**Status:** Server läuft auf Port 3002, aber mit kritischen Fehlern

**Identifizierte Probleme:**

1. **Webpack-Cache-Fehler** - `ENOENT: no such file or directory, rename`
2. **Module-Import-Fehler** - `Cannot find module './923.js'`
3. **API-Fehler** - `/api/admin/texts` 500 Error
4. **Static Assets 404** - CSS/JS Dateien nicht gefunden
5. **Fast Refresh Probleme** - Vollständige Neuladezyklen erforderlich

**Sofortige Aktionen (HEUTE):**

1. **Webpack-Cache bereinigen** - `.next/cache` löschen
2. **Static Assets reparieren** - CSS/JS Pfade korrigieren
3. **API-Routen debuggen** - `/api/admin/texts` Fehler beheben
4. **Module-Import prüfen** - Fehlende Module identifizieren

## 🎯 Was für morgen zu tun ist:

### **🚀 NEUE PRIORITÄT: Website-Builder mit Shop-Integration (PRIORITÄT: SEHR HOCH)**

**Revolutionäres Konzept - Potentiell Million-Dollar-Idee!**

**Kernidee:**

- **Drag & Drop Website-Builder** → Kunden erstellen ihre Website selbst
- **Integrierter Shop** → E-Commerce direkt in die Website
- **Kunden-Selbstverwaltung** → Jeder Kunde hat seinen Admin-Bereich
- **Moderne Technologie** → Next.js statt WordPress

**⚠️ WICHTIGE KLARSTELLUNG:**

- **WordPress wird NICHT verwendet** → Nur als Vergleich für Benutzerfreundlichkeit
- **Eigener Website-Builder** → So einfach wie WordPress, aber mit Next.js-Technologie
- **Keine WordPress-Abhängigkeit** → Vollständig eigenes System

**Differenzierung:**

- **Gegenüber WordPress:** Moderne Technologie, bessere Performance
- **Gegenüber Wix/Shopify:** Einmalige Lizenz, Datenhoheit beim Kunden
- **Gegenüber anderen Buildern:** Vollständige Shop-Integration

**Geschäftsmodell:**

- **Basis-Paket:** €299 (Website-Builder)
- **Shop-Paket:** €599 (E-Commerce Integration)
- **Premium-Paket:** €999 (Analytics, SEO, Support)
- **Enterprise:** €2.999 (API, White-Label, Custom Development)

**Technische Umsetzung:**

1. **Phase 1 (3 Monate):** Drag & Drop Interface, Basis-Module, Shop-Integration
2. **Phase 2 (6 Monate):** Erweiterte Module, Template-System, Analytics
3. **Phase 3 (12 Monate):** API-System, White-Label, Multi-Tenant

**Status:** ✅ Konzept dokumentiert in `docs/business-plan/website-builder-shop-concept.md`

### **1. Server-Infrastruktur einrichten (PRIORITÄT: HOCH)**

**Netcup RS 2000 G11 Server:**

- **Debian 12 minimal** installieren
- **Root-Zugang sichern** (SSH nur mit Key, Root-PW deaktivieren)
- **Benutzer mit sudo-Rechten** anlegen
- **Grundsicherung** via ufw, fail2ban, SSH-Port ändern

**Lokaler Backup-Server:**

- **Debian installieren** (z. B. zu Hause)
- **VPN-Zugang einrichten** (WireGuard oder Tailscale)
- **Sicherer Remote-Backup-Speicher** konfigurieren

### **2. Webseite (Frontend + Backend) (PRIORITÄT: HOCH)**

**Struktur:**

- **Next.js 14 + TailwindCSS + Framer Motion**
- **Header.tsx & Footer.tsx** fest eingebaut (wie PHP-Includes)
- **Hauptinhalt dynamisch wechselbar** - children-System

**Internationalisierung:**

- **Sprachen:** 🇩🇪 DE / 🇬🇧 EN / 🇪🇸 ES
- **Texte in JSON oder Datenbank** verwalten
- **Umschaltung im Header**

**Module (Seitenbereiche als Komponenten):**

- **Home, Leistungen, Kontakt, Login, Admin-Bereich, Impressum, Datenschutz**
- **Später erweiterbar:** Shop, Kundenportal, Newsletter

### **3. Sicherheit & Enterprise++ Features (PRIORITÄT: HOCH)**

**Sicherheit:**

- **Enterprise++ Firewall** (Netzwerk-Zonen, Ports, Monitoring)
- **Automatische Sicherheitsupdates** (unattended-upgrades)
- **Zero Trust Architektur** - Kein Dienst ohne Authentifizierung
- **HTTPS mit Let's Encrypt** + automatischer Erneuerung

**Backup-Konzept:**

- **Tägliche Datenbank-Backups** (cron + mysqldump)
- **Projekt-Backup** (ZIP inkl. /public, /src, /docs, /config)
- **Übertragung über VPN** auf lokalen Server
- **Wiederherstellungspunkte** im Adminbereich auswählbar

### **4. Adminbereich (zentraler IT-Hub) (PRIORITÄT: HOCH)**

- **Login mit 2FA** + Passwort-Hashing (Argon2)
- **Textverwaltung** aller Seiten
- **Kunden- und Projektverwaltung**
- **Support-Dokumentation** (Ticket-System optional)
- **Technische Infos** (Systemstände, Logs, Backups)
- **Benutzerrollen:** Admin / Support / Extern

### **5. Datenbank & Inhalte (PRIORITÄT: HOCH)**

**MySQL/MariaDB über XAMPP lokal entwickeln**
**Später 1:1 auf Server migrieren**

**Tabellen für:**

- Kunden
- Projekte
- Texte (mehrsprachig)
- Backups
- Zugriffsprotokolle
- Admin-Daten
- Produkte (für Shop)

### **6. KI-Integration mit Cursor (PRIORITÄT: MITTEL)**

- **.md-Struktur festgelegt:** START.md, PROJECT.md, STATUS.md, QualityController.md
- **strict = true, autoFix = false**
- **Cursor wird NUR über Aufgabenliste aktiv**
- **Jeder Commit muss dokumentiert werden**
- **Änderungen NUR mit Freigabe**
- **Auto-Erkennung** von Sicherheitslücken, Formatierungsfehlern, Optimierungspotenzial
- **Admin kann Textbefehle schreiben** wie: "Pflege mir folgenden Text in /app/impressum ein…"

### **6.1. ZEITERFASSUNG - STRICHTE PFLICHT OHNE TOLERANZ (PRIORITÄT: KRITISCH)**

**Status:** ✅ **VOLLSTÄNDIG IMPLEMENTIERT - AB SOFORT VERBINDLICH**

**🚨 STRICHTE REGELN - KEINE AUSNAHMEN:**

1. **Bei jedem Themenwechsel:** Aktuelle Zeiterfassung SOFORT beenden (Stopp)
2. **Neue Aufgabe starten:** Neue Zeiterfassung SOFORT starten (Start)
3. **Keine Überlappungen:** Niemals zwei aktive Sessions gleichzeitig
4. **Keine Toleranz:** Keine "5 Minuten später" oder "nach dem Meeting"
5. **Sofortige Aktion:** Bei Task-Wechsel sofort handeln, nicht aufschieben

**📋 VERBINDLICHE WORKFLOW-REGELN:**

- **Planung → Entwicklung:** Session beenden, neue starten
- **Entwicklung → Debugging:** Session beenden, neue starten
- **Debugging → Dokumentation:** Session beenden, neue starten
- **Dokumentation → Testing:** Session beenden, neue starten
- **Jeder Modul-Wechsel:** Session beenden, neue starten
- **Jede Pause > 5 Minuten:** Session pausieren oder beenden

**🎯 ZWECKE DER STRICTEN ZEITERFASSUNG:**

- **Nachvollziehbarkeit:** Jeder Task ist klar dokumentiert
- **DSGVO-Compliance:** Vollständige Arbeitszeit-Dokumentation
- **Prozessoptimierung:** Identifikation von Zeitfressern
- **Qualitätssicherung:** Messbare Verbesserungen
- **Audit-Sicherheit:** Lückenlose Dokumentation für Prüfungen

**⚠️ KONSEQUENZEN BEI VERSTÖSSEN:**

- **Datenverlust:** Überlappende Sessions werden automatisch bereinigt
- **Statistik-Fehler:** Ungenaue Zeitauswertungen
- **Compliance-Risiko:** DSGVO-Verstöße möglich
- **Prozess-Chaos:** Unübersichtliche Arbeitszeiterfassung

**✅ KONTROLLMECHANISMEN:**

- **Automatische Erkennung:** System warnt bei überlappenden Sessions
- **KI-Monitoring:** Cursor überwacht Zeiterfassung-Konsistenz
- **Tägliche Prüfung:** Automatische Validierung der Session-Daten
- **Wöchentliche Reports:** Übersicht über Zeiterfassung-Qualität

### **6.2. DATUMSVALIDIERUNG - STRICHTE PFLICHT OHNE TOLERANZ (PRIORITÄT: KRITISCH)**

**Status:** ✅ **AB SOFORT VERBINDLICH**

**🚨 STRICHTE DATUMS-REGELN - KEINE AUSNAHMEN:**

1. **Vor jeder Datumseingabe:** Aktuelles Datum prüfen (27.06.2025)
2. **Nicht aus bestehenden Dateien kopieren:** Immer aktuelles Datum verwenden
3. **Format standardisieren:** DD.MM.YYYY (27.06.2025) oder YYYY-MM-DD (2025-06-27)
4. **Doppelte Prüfung:** Nach jeder Datumseingabe validieren
5. **Keine automatischen Daten:** Niemals Daten aus bestehenden Dateien übernehmen

**🚨 STRICHTE UHRZEIT-REGELN - KEINE AUSNAHMEN:**

1. **Vor jeder Zeitangabe:** Aktuelle Uhrzeit prüfen (z.B. 14:30 Uhr)
2. **Nicht aus bestehenden Dateien kopieren:** Immer aktuelle Uhrzeit verwenden
3. **Format standardisieren:** HH:MM (24-Stunden-Format, z.B. 14:30)
4. **Zeitzone berücksichtigen:** Deutschland (UTC+1/UTC+2)
5. **Doppelte Prüfung:** Nach jeder Zeitangabe validieren

**📋 VERBINDLICHE DATUMS-WORKFLOW-REGELN:**

- **Vor jeder .md-Änderung:** Aktuelles Datum prüfen
- **Bei neuen Einträgen:** Immer aktuelles Datum verwenden
- **Bei Datumsänderungen:** Doppelte Validierung durchführen
- **Bei Copy-Paste:** Datum immer manuell korrigieren

**📋 VERBINDLICHE UHRZEIT-WORKFLOW-REGELN:**

- **Vor jeder .md-Änderung:** Aktuelle Uhrzeit prüfen
- **Bei neuen Einträgen:** Immer aktuelle Uhrzeit verwenden
- **Bei Zeitangaben:** Doppelte Validierung durchführen
- **Bei Copy-Paste:** Uhrzeit immer manuell korrigieren

**🎯 ZWECKE DER STRICTEN DATUMSVALIDIERUNG:**

- **Korrekte Dokumentation:** Immer aktuelle Daten verwenden
- **Nachvollziehbarkeit:** Klare zeitliche Zuordnung
- **Professionelle Qualität:** Keine veralteten Daten
- **Audit-Sicherheit:** Lückenlose zeitliche Dokumentation

**🎯 ZWECKE DER STRICTEN UHRZEITVALIDIERUNG:**

- **Präzise Zeitangaben:** Immer aktuelle Uhrzeit verwenden
- **Zeitliche Nachvollziehbarkeit:** Exakte Zeitstempel
- **Prozessoptimierung:** Genaue Zeitmessung
- **Audit-Sicherheit:** Lückenlose zeitliche Dokumentation

**⚠️ KONSEQUENZEN BEI VERSTÖSSEN:**

- **Dokumentationsfehler:** Falsche zeitliche Zuordnung
- **Verwirrung:** Unklare Projektchronologie
- **Qualitätsverlust:** Unprofessionelle Dokumentation
- **Audit-Risiko:** Falsche zeitliche Nachweise

**✅ KONTROLLMECHANISMEN:**

- **Datumsvalidierung:** Vor jeder Eingabe prüfen
- **Uhrzeitvalidierung:** Vor jeder Zeitangabe prüfen
- **Format-Kontrolle:** Standardisiertes Datums- und Zeitformat
- **Aktualitätsprüfung:** Immer aktuelle Daten verwenden
- **Doppelte Validierung:** Nach Eingabe erneut prüfen

### **6.3. KI-FEHLERBEHEBUNGSRICHTLINIEN - STRICHTE PFLICHT OHNE TOLERANZ (PRIORITÄT: KRITISCH)**

**Status:** ✅ **AB SOFORT VERBINDLICH**

**🚨 STRICHTE KI-FEHLERBEHEBUNGS-REGELN - KEINE AUSNAHMEN:**

1. **Bei jedem Fehler:** Sofort analysieren und dokumentieren
2. **Fehler in .md-Dateien:** Kritische Fehler in STATUS.md dokumentieren
3. **Zeiterfassung wechseln:** Bei Fehlerbehebung neue Session starten
4. **Bestehende Strukturen respektieren:** Niemals .md-Inhalte überschreiben
5. **Systematische Korrektur:** Fehler beheben und Lektionen lernen

**📋 VERBINDLICHE KI-FEHLERBEHEBUNGS-WORKFLOW-REGELN:**

- **Fehlererkennung:** Sofort in STATUS.md dokumentieren
- **Zeiterfassung:** Aktuelle Session beenden, neue für Fehlerbehebung starten
- **Analyse:** Grund, Auswirkung und Lektion dokumentieren
- **Korrektur:** Fehler systematisch beheben
- **Validierung:** Korrektur überprüfen und dokumentieren

**🎯 ZWECKE DER STRICTEN KI-FEHLERBEHEBUNG:**

- **Kontinuierliche Verbesserung:** Aus Fehlern lernen
- **Qualitätssicherung:** Fehler systematisch beheben
- **Dokumentation:** Alle Fehler und Korrekturen nachvollziehbar
- **Prozessoptimierung:** Wiederholte Fehler vermeiden

**⚠️ KONSEQUENZEN BEI VERSTÖSSEN:**

- **Qualitätsverlust:** Unbehobene Fehler akkumulieren
- **Verwirrung:** Inkonsistente Dokumentation
- **Prozess-Chaos:** Unsystematische Fehlerbehebung
- **Vertrauensverlust:** Unzuverlässige KI-Unterstützung

**✅ KONTROLLMECHANISMEN:**

- **Fehler-Tracking:** Alle Fehler in STATUS.md dokumentiert
- **Zeiterfassung-Kontrolle:** Bei jedem Fehler Session gewechselt
- **Struktur-Respekt:** Bestehende .md-Inhalte nicht überschrieben
- **Systematische Korrektur:** Fehler beheben und validieren

### **7. Dokumentation & Qualitätssicherung (PRIORITÄT: MITTEL)**

- **Developer-Docs** mit MkDocs oder Markdown
- **PDF-Version** mit Titelseite, Inhaltsverzeichnis, CI
- **Technische Dokumentation** je Modul
- **.md-Pflichtstruktur:** README.md, START.md, PROJECT.md, STATUS.md, QualityController.md

### **8. Wirtschaft & Business-Teil (PRIORITÄT: MITTEL)**

- **Domainprüfung + Domainreservierung** (über Netcup)
- **Eigene Nameserver einrichten** (optional)
- **Kundenpreise & Leistungen** definieren
- **AGB, Datenschutz, Impressum** + Mailvorlagen
- **Businessplan** mit Leistungsübersicht
- **Preisstruktur** für Dienstleistungen & Shop

### **9. Shop (später modular aktivierbar) (PRIORITÄT: NIEDRIG)**

- **Produktdatenbank** mit Kategorien
- **Mehrsprachige Produktbeschreibungen**
- **Warenkorb, Checkout**
- **Kundenkonto**
- **Bestellhistorie**
- **Admin-Funktionen:** Produktpflege, Lager, Rabattaktionen

## 🔧 Technische Details:

### **Domains:**

- **lopez-it-welt.de** - Öffentliche Website (Next.js)
- **lopez-team.de** - Admin-Bereich (Next.js + MySQL)
- **Status:** Beide Domains beim Hoster, später auf Server migrieren
- **SSL-Zertifikate:** Für beide Domains erforderlich

### **Domain-Trennung (NEU - 2025-01-19):**

**Saubere Trennung für Sicherheit und Struktur:**

**Öffentliche Website (lopez-it-welt.de):**

- Port: 3000
- Zielgruppe: Kunden, Besucher
- Features: Home, Leistungen, Kontakt, Impressum, Datenschutz
- SEO-optimiert, öffentlich indexierbar

**Admin-Bereich (lopez-team.de):**

- Port: 3001
- Zielgruppe: Admin, Team-Mitglieder
- Features: Dashboard, Zeiterfassung, Analytics, Kundenverwaltung
- Nicht indexierbar, erweiterte Sicherheit

**Shop-Admin-Kommunikation (NEU - 2025-01-19):**
**Vollständige Integration zwischen Shop und Admin-Bereich:**

**API-Kommunikation:**

- ✅ **RESTful APIs** - Shop ↔ Admin Datenaustausch
- ✅ **WebSocket-Verbindung** - Echtzeit-Updates
- ✅ **Shared Database** - Gemeinsame MySQL-Datenbank
- ✅ **JWT-Token-Auth** - Sichere Authentifizierung

**Shop → Admin Kommunikation:**

- 📦 **Bestellungen** - Automatische Benachrichtigung
- 💳 **Zahlungen** - Status-Updates an Admin
- 📧 **Kundenanfragen** - Support-Tickets
- 📊 **Analytics** - Verkaufsdaten, Besucherstatistiken
- 🚨 **Alarme** - Lagerbestand, Fehler, Sicherheitswarnungen

**Ticket-System (NEU - 2025-01-19):**
**Vollständiges Support-Ticket-System zwischen Shop und Admin:**

**Ticket-Typen:**

- 🛒 **Bestellungsprobleme** - Falsche Lieferung, fehlende Artikel
- 💳 **Zahlungsprobleme** - Transaktionsfehler, Rückerstattungen
- 🚚 **Versandprobleme** - Lieferverzögerungen, Paketverlust
- 🛠️ **Technische Probleme** - Website-Fehler, Login-Probleme
- 📝 **Allgemeine Anfragen** - Produktinfos, Preisanfragen

**Ticket-Workflow:**

1. **Kunde erstellt Ticket** (lopez-it-welt.de)
2. **Shop sendet an Admin** (lopez-team.de)
3. **Admin bearbeitet Ticket** mit Priorität und Status
4. **Automatische Updates** an Kunde und Shop
5. **Ticket-Archivierung** nach Abschluss

**Ticket-Status:**

- 🔴 **Offen** - Neu erstellt, wartet auf Bearbeitung
- 🟡 **In Bearbeitung** - Admin arbeitet daran
- 🟢 **Wartend auf Kunde** - Antwort erforderlich
- 🔵 **Gelöst** - Problem behoben
- ⚫ **Geschlossen** - Ticket abgeschlossen

**Prioritätsstufen:**

- 🚨 **Kritisch** - Website down, Zahlungsfehler
- ⚠️ **Hoch** - Bestellungsprobleme, Lieferverzögerungen
- 📋 **Normal** - Allgemeine Anfragen
- 💡 **Niedrig** - Feedback, Verbesserungsvorschläge

**Admin → Shop Kommunikation:**

- 🛍️ **Produktverwaltung** - Preise, Verfügbarkeit, Beschreibungen
- 🏷️ **Rabatte** - Automatische Anwendung von Gutscheinen
- 📢 **Ankündigungen** - Wartungsarbeiten, neue Features
- 🔧 **Konfiguration** - Shop-Einstellungen, Zahlungsmethoden
- 📈 **A/B-Tests** - Conversion-Optimierung
- 🎫 **Ticket-Updates** - Status-Änderungen, Antworten an Kunden

**Technische Umsetzung:**

```javascript
// Shop API für Admin-Kommunikation
POST / api / shop / orders; // Neue Bestellung
POST / api / shop / payments; // Zahlungsstatus
POST / api / shop / analytics; // Verkaufsdaten
POST / api / shop / alerts; // Warnungen
POST / api / shop / tickets; // Neues Support-Ticket

// Admin API für Shop-Kommunikation
PUT / api / admin / products; // Produktaktualisierung
PUT / api / admin / pricing; // Preisänderungen
POST / api / admin / announcements; // Ankündigungen
PUT / api / admin / config; // Shop-Konfiguration
POST / api / admin / tickets / notify; // Ticket-Benachrichtigungen
GET / api / admin / tickets; // Alle Tickets abrufen
PUT / api / admin / tickets / [id] / status; // Ticket-Status aktualisieren
```

**Sicherheitsfeatures:**

- 🔐 **API-Keys** - Für jede Domain
- 🛡️ **Rate Limiting** - Schutz vor Überlastung
- 🔒 **CORS-Konfiguration** - Nur erlaubte Domains
- 📝 **Audit-Logs** - Alle Kommunikation protokolliert

**Deployment-Skripte:**

```bash
# Öffentliche Website starten
npm run dev:public    # Port 3000

# Admin-Bereich starten
npm run dev:admin     # Port 3001

# Beide gleichzeitig
npm run dev:both
```

**Sicherheitsvorteile:**

- ✅ Isolierte Umgebungen
- ✅ Separate SSL-Zertifikate
- ✅ Unterschiedliche Sicherheitsrichtlinien
- ✅ Admin-Bereich nicht öffentlich sichtbar
- ✅ Einfache Wartung und Updates
- ✅ Sichere API-Kommunikation zwischen Domains

### **Datenbank:**

- **XAMPP** mit **phpMyAdmin** (bereits vorhanden)
- **MySQL** für robuste, bewährte Datenbank
- **Lokale Entwicklung** - sicher und schnell

### **Architektur:**

- **Modular** und **zukunftssicher**
- **Hoster-kompatibel** (PHP/MySQL)
- **Performance-optimiert** mit Caching
- **Domain-getrennt** - Website und Admin isoliert

## ⚠️ Wichtige Hinweise:

1. **Nichts zerstören!** - Bestehende Website funktioniert (Status 200)
2. **Schrittweise vorgehen** - Parallel-Entwicklung
3. **Pflichtenheft befolgen** - `.md`-Dateien sind verbindliche Rechtlinien
4. **Testen nach jedem Schritt** - Sicherheit geht vor

## 🚨 **WICHTIG FÜR KI-ENTWICKLER:**

### ✅ **MODULARE ARCHITEKTUR BEREITS IMPLEMENTIERT!**

**NICHT neu entwickeln - nur erweitern!**

**Bestehende Module:**

- `src/components/Core/` - Header, Footer, Layout ✅
- `src/components/Features/` - Button, Card, FAQ ✅
- `src/components/navigation/` - Sprachumschalter ✅
- `src/components/auth/` - Login/Registrierung ✅

**Regeln für KI-Entwicklung:**

1. **Bestehende Module verwenden** - Nicht neu erfinden
2. **Nur Inhalte anpassen** - Design, Texte, Logo
3. **Neue Module hinzufügen** - Shop, Admin, etc.
4. **Modulare Struktur beibehalten** - Saubere Trennung

**Verboten:**

- ❌ Komplette Neuentwicklung
- ❌ Bestehende Module zerstören
- ❌ Architektur ändern

## 🔍 **VERBINDLICHE REGELPRÜFUNG - PFLICHT FÜR ALLE ENTWICKLER/KI**

### ⚠️ **VOR JEDER AKTION MUSS GEPRÜFT WERDEN:**

**Pflichtdateien prüfen:**

- ✅ `START.md` - Enterprise++ Initialisierung
- ✅ `PROJECT.md` - Projektplan und Status
- ✅ `QualityController.md` - Qualitätsstandards
- ✅ `CursorGuide.md` - Enforcement-Regeln (statt Enforcement.md)

### 📋 **PRÜFUNGS-CHECKLISTE:**

1. **✅ Dokumentation laden** - Alle Pflichtdateien lesen
2. **✅ Regelprüfung** - Gegen QualityController.md prüfen
3. **✅ Status-Update** - In STATUS.md dokumentieren
4. **✅ Freigabe einholen** - Explizite Genehmigung warten

### 🚨 **BEI REGELVERSTÖSSEN:**

**Verpflichtende Maßnahmen:**

1. **✅ Erklärung** - Welche Regel verletzt wurde
2. **✅ Grund für Verstoß** - Warum es passiert ist
3. **✅ Self-Repair-Vorschlag** - Wie es korrigiert wird
4. **✅ Eintrag in STATUS.md** - Verletzung dokumentieren

### 🛡️ **ARBEITSREGEL:**

**"Arbeite nur, wenn ALLE Regeln eingehalten werden."**

- **Strict Mode** - Null-Toleranz für Regelverstöße
- **Qualitätsstandards** - 100% Compliance erforderlich
- **Dokumentation** - Jede Aktion muss nachvollziehbar sein

## 📋 Nächste Schritte:

1. **MySQL-Datenbank-Struktur** erstellen
2. **PHP API-System** entwickeln
3. **Admin-Interface** implementieren
4. **Dynamische Inhalte** integrieren
5. **Testing und Optimierung**

---

**Wichtiger Hinweis:**
Die Website funktioniert bereits perfekt! Nur die Inhalte sollen dynamisch aus der Datenbank kommen. Keine Zerstörung der bestehenden Funktionalität!

---

**Zeitaufwand-Schätzung:** 8-12 Stunden für vollständige Implementierung

## 🛠️ How-To: Datenbank flexibel erweitern & anpassen

### 1. Neues Feld zu einer Tabelle hinzufügen

```sql
ALTER TABLE <tabellenname> ADD COLUMN <spaltenname> <datentyp>;
```

**Beispiel:**

```sql
ALTER TABLE kunden ADD COLUMN geburtsdatum DATE;
```

### 2. Feld umbenennen

```sql
ALTER TABLE <tabellenname> CHANGE <altername> <neuername> <datentyp>;
```

**Beispiel:**

```sql
ALTER TABLE kunden CHANGE firmenname unternehmen VARCHAR(100);
```

### 3. Feld löschen

```sql
ALTER TABLE <tabellenname> DROP COLUMN <spaltenname>;
```

**Beispiel:**

```sql
ALTER TABLE kunden DROP COLUMN telefon;
```

### 4. Neue Tabelle anlegen

```sql
CREATE TABLE <neuetabelle> (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ...
);
```

**Beispiel:**

```sql
CREATE TABLE rechnungen (
  id INT AUTO_INCREMENT PRIMARY KEY,
  kunde_id INT,
  betrag DECIMAL(10,2),
  datum DATE
);
```

### 5. Tabelle löschen

```sql
DROP TABLE <tabellenname>;
```

**Beispiel:**

```sql
DROP TABLE backups;
```

### 6. Spalte als "NULL" erlauben oder Pflichtfeld machen

```sql
ALTER TABLE <tabellenname> MODIFY <spaltenname> <datentyp> NULL;
ALTER TABLE <tabellenname> MODIFY <spaltenname> <datentyp> NOT NULL;
```

**Beispiel:**

```sql
ALTER TABLE kunden MODIFY email VARCHAR(100) NOT NULL;
```

---

**Tipp:**

- Alle Änderungen kannst du in phpMyAdmin im SQL-Tab ausführen.
- Vor größeren Änderungen immer ein Backup machen!

### Qualitätssicherung: Automatisierte Datenbank-Tasks

- [ ] Automatisierte Testdaten-Erstellung (Skript/Task, kein phpMyAdmin)
- [ ] Automatisiertes Löschen/Zurücksetzen der Testdaten
- [ ] Migrationen und Strukturänderungen als Skript/Task
- [ ] Jeder Task ist versioniert und dokumentiert
- [ ] Keine manuellen Änderungen in phpMyAdmin!
- [ ] Adminbereich bietet "Testdaten einfügen/löschen"-Funktion
- [ ] Jeder Task wird im STATUS.md protokolliert

## 🎯 **MYSQL-LERNSYSTEM - VOLLSTÄNDIG IMPLEMENTIERT (2025-01-19)**

### ✅ **ERFOLGREICH ERSTELLT:**

- **`database/work_sessions_schema.sql`** - Vollständige MySQL-Datenbankstruktur
- **`database/dashboard_queries.sql`** - 10 Kategorien von Dashboard-Abfragen
- **Automatische Trigger** - Dauer-Berechnung, Statistiken
- **Views** - Für einfache Abfragen und Analysen
- **Beispiel-Daten** - Für Tests und Demonstration

### 🎯 **LERNSYSTEM-FEATURES:**

**Zeiterfassung:**

- Start/Endzeit mit automatischer Dauer-Berechnung
- Status-Tracking (gut/schlecht/abgebrochen/pausiert)
- Kategorisierung (Planung, Umsetzung, Debug, Dokumentation, etc.)
- Prioritäten (niedrig/mittel/hoch/kritisch)

**Lernsystem:**

- **Ursachenanalyse** - Warum wurde es abgebrochen/verschoben?
- **Lektionen-Dokumentation** - Was habe ich gelernt?
- **Nächste Schritte** - Was mache ich beim nächsten Mal anders?

**Statistiken:**

- Erfolgsrate - Wie oft läuft etwas gut?
- Trend-Analysen - Entwicklung über Zeit
- Kategorie-Verteilung - Wo verbringe ich Zeit?
- Warnungen - Lange Sessions, häufige Probleme

### 📊 **DASHBOARD-ABFRAGEN (10 KATEGORIEN):**

1. **Übersicht-Abfragen** - Letzte Sessions, heute gearbeitete Zeit
2. **Statistik-Abfragen** - Erfolgsrate, wöchentliche Übersicht
3. **Kategorie-Analysen** - Durchschnittliche Dauer, Zeitverteilung
4. **Lernsystem-Analysen** - Häufigste Ursachen, Lektionen-Trends
5. **Produktivitäts-Analysen** - Tagesproduktivität, stündliche Produktivität
6. **Prioritäts-Analysen** - Zeitverteilung nach Priorität
7. **Trend-Analysen** - Monatliche Trends, Entwicklung über Zeit
8. **Warnungen und Alarme** - Lange Sessions, häufige Probleme
9. **Export-Abfragen** - Vollständige Daten für Export
10. **Performance-Optimierung** - Sessions ohne Endzeit

### 🚀 **NÄCHSTE SCHRITTE:**

**API-Integration:**

- Next.js API-Endpoints erstellen
- MySQL-Verbindung in Next.js
- CRUD-Operationen für Sessions
- Dashboard-Komponenten für Visualisierung

**Timer-Funktionalität:**

- Aktive Sessions verwalten
- Automatische Pause/Resume
- Browser-Refresh-Resistenz
- Offline-Support

**Automatisierung:**

- Integration in bestehende Admin-Bereiche
- Automatische Session-Erkennung
- KI-gestützte Kategorisierung
- Intelligente Empfehlungen

### 📋 **VERWENDUNG:**

**Neue Session starten:**

```sql
INSERT INTO work_sessions (beschreibung, start_time, kategorie, prioritaet)
VALUES ('Website-Builder API entwickeln', NOW(), 'umsetzung', 'hoch');
```

**Session beenden:**

```sql
UPDATE work_sessions
SET
    end_time = NOW(),
    status = 'gut',
    bemerkung = 'API funktioniert perfekt',
    lektion = 'Strukturierte Planung zahlt sich aus'
WHERE id = 1;
```

**Problem dokumentieren:**

```sql
UPDATE work_sessions
SET
    end_time = NOW(),
    status = 'schlecht',
    ursache = 'Next.js 15 Kompatibilitätsprobleme',
    lektion = 'Immer erst Tests mit neuer Version',
    naechster_schritt = 'Next.js 14 beibehalten bis Probleme gelöst'
WHERE id = 2;
```

### 🎯 **ZIEL:**

Systematisches Lernen aus jedem Arbeitstag für kontinuierliche Verbesserung!

**Ticket-System API-Endpoints (VOLLSTÄNDIG IMPLEMENTIERT - 2025-01-19):**

**Shop → Admin:**

- `POST /api/shop/tickets` - Kunde erstellt Support-Ticket
- Automatische Benachrichtigung an Admin-Team
- E-Mail-Bestätigung an Kunde
- Prioritäts-basierte Benachrichtigungen

**Admin → Shop:**

- `POST /api/admin/tickets/notify` - Admin empfängt Ticket-Benachrichtigungen
- `GET /api/admin/tickets` - Alle Tickets mit Filter und Statistiken
- `PUT /api/admin/tickets/[id]/status` - Ticket-Status aktualisieren
- Automatische E-Mail-Updates an Kunden
- WebSocket-Updates für Echtzeit-Kommunikation

**Ticket-Verwaltung im Admin-Bereich:**

- ✅ Vollständige Admin-Seite: `/admin/tickets`
- ✅ Statistiken und Dashboard
- ✅ Filter nach Status, Priorität, Typ
- ✅ Ticket-Details mit Modal
- ✅ Status-Updates mit Workflow
- ✅ Automatische Kategorisierung
- ✅ Prioritäts-basierte Benachrichtigungen

**Vollständige Ticket-System-Implementierung (2025-01-19):**

**✅ API-Endpoints erstellt:**

- `src/app/api/shop/tickets/route.ts` - Shop-Ticket-API
- `src/app/api/admin/tickets/notify/route.ts` - Admin-Benachrichtigungen
- `src/app/api/admin/tickets/route.ts` - Admin-Ticket-Verwaltung
- `src/app/api/admin/tickets/[id]/status/route.ts` - Status-Updates

**✅ Admin-Interface:**

- `src/app/admin/tickets/page.tsx` - Vollständige Ticket-Verwaltung
- Statistiken, Filter, Details-Modal
- Status-Workflow mit Buttons
- Responsive Design

**✅ Features implementiert:**

- Automatische Ticket-Kategorisierung
- Prioritäts-basierte E-Mail-Benachrichtigungen
- WebSocket-Updates (simuliert)
- Analytics-Tracking
- Mock-Daten für Demo

**✅ Workflow:**

1. Kunde erstellt Ticket → Shop-API
2. Admin wird benachrichtigt → Notify-API
3. Admin bearbeitet Ticket → Admin-Interface
4. Status-Updates → Status-API
5. Kunde wird informiert → E-Mail-System

**Status: VOLLSTÄNDIG FUNKTIONSFÄHIG** 🎉

**⚠️ WICHTIGER HINWEIS (2025-01-19):**
**Der Shop existiert noch NICHT!**

**Was wurde implementiert:**

- ✅ **API-Infrastruktur** für zukünftige Shop-Integration
- ✅ **Admin-Interface** für Ticket-Verwaltung
- ✅ **Mock-Daten** für Tests und Demo
- ✅ **Vollständige API-Endpoints** bereit für Shop-Integration

**Was fehlt noch:**

- ❌ **Shop-Frontend** (Produktkatalog, Warenkorb, Checkout)
- ❌ **Shop-Backend** (Produktdatenbank, Bestellungen, Zahlungen)
- ❌ **Shop-Admin-Integration** (Produktverwaltung, Lager, etc.)

**Nächste Schritte für Shop-Entwicklung:**

1. **Shop-Modul erstellen** - Produktkatalog, Warenkorb, Checkout
2. **Produktdatenbank** - MySQL-Tabellen für Produkte, Kategorien
3. **Shop-Admin-Bereich** - Produktverwaltung, Bestellungen
4. **Ticket-System integrieren** - Support-Tickets aus Shop
5. **Zahlungssystem** - PayPal, Kreditkarten, etc.

**Das Ticket-System ist die GRUNDLAGE für die zukünftige Shop-Integration!** 🚀

## 🛍️ **SHOP-ENTWICKLUNGS-ROADMAP (2025-01-19)**

### **Phase 1: Grundlagen (2-3 Wochen)**

**Priorität: HOCH**

**1.1 Datenbank-Schema:**

```sql
-- Produkte
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  stock INT DEFAULT 0,
  category_id INT,
  image_url VARCHAR(500),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Kategorien
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  parent_id INT NULL,
  sort_order INT DEFAULT 0
);

-- Bestellungen
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status ENUM('pending', 'paid', 'shipped', 'delivered', 'cancelled'),
  payment_method VARCHAR(50),
  shipping_address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**1.2 Shop-Module:**

- `src/app/shop/` - Shop-Hauptseite
- `src/app/shop/products/` - Produktkatalog
- `src/app/shop/cart/` - Warenkorb
- `src/app/shop/checkout/` - Checkout-Prozess
- `src/app/shop/orders/` - Bestellübersicht

**1.3 Shop-API:**

- `GET /api/shop/products` - Produktliste
- `GET /api/shop/products/[id]` - Produktdetails
- `POST /api/shop/cart/add` - Zum Warenkorb hinzufügen
- `POST /api/shop/orders` - Bestellung erstellen

### **Phase 2: Admin-Integration (1-2 Wochen)**

**Priorität: HOCH**

**2.1 Shop-Admin-Bereich:**

- `src/app/admin/shop/products/` - Produktverwaltung
- `src/app/admin/shop/orders/` - Bestellverwaltung
- `src/app/admin/shop/categories/` - Kategorieverwaltung

**2.2 Shop-Admin-API:**

- `POST /api/admin/shop/products` - Produkt erstellen
- `PUT /api/admin/shop/products/[id]` - Produkt aktualisieren
- `GET /api/admin/shop/orders` - Bestellungen abrufen
- `PUT /api/admin/shop/orders/[id]/status` - Bestellstatus aktualisieren

### **Phase 3: Ticket-System-Integration (1 Woche)**

**Priorität: MITTEL**

**3.1 Shop → Admin Tickets:**

- Support-Button in Shop integrieren
- Ticket-Erstellung aus Bestellungen
- Automatische Ticket-Kategorisierung

**3.2 Admin → Shop Updates:**

- Bestellstatus-Updates an Shop
- Produktverfügbarkeit-Updates
- Wartungsankündigungen

### **Phase 4: Zahlungssystem (2-3 Wochen)**

**Priorität: HOCH**

**4.1 Zahlungsmethoden:**

- PayPal Integration
- Kreditkarten (Stripe)
- Banküberweisung
- Rechnung

**4.2 Zahlungs-API:**

- `POST /api/shop/payments/process` - Zahlung verarbeiten
- `GET /api/shop/payments/[id]/status` - Zahlungsstatus
- `POST /api/shop/payments/refund` - Rückerstattung

### **Phase 5: Erweiterte Features (2-4 Wochen)**

**Priorität: NIEDRIG**

**5.1 Kundenbereich:**

- Kundenkonto mit Bestellhistorie
- Wunschliste
- Bewertungen und Reviews

**5.2 Marketing:**

- Newsletter-Integration
- Gutschein-System
- A/B-Tests für Conversion

**5.3 Analytics:**

- Verkaufsstatistiken
- Produkt-Performance
- Kundenverhalten

## 🎯 **AKTUELLER STATUS:**

**✅ Bereits implementiert:**

- Ticket-System API-Infrastruktur
- Admin-Ticket-Verwaltung
- Mock-Daten für Tests

**🔄 Nächste Schritte:**

1. **MySQL-Datenbank-Schema** für Shop erstellen
2. **Shop-Frontend** mit Produktkatalog entwickeln
3. **Shop-Admin-Bereich** für Produktverwaltung
4. **Ticket-System** in Shop integrieren

**Das Ticket-System ist die perfekte Grundlage für die Shop-Entwicklung!** 🚀
