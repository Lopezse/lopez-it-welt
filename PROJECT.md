# 📋 PROJECT.md - Lopez IT Welt Enterprise++

**Projekt:** Lopez IT Welt Enterprise++  
**Version:** 2.0.0  
**Status:** ✅ AKTIV  
**Letzte Aktualisierung:** 2025-11-01  
**Autor:** Lopez IT Welt Team

---

## 🎯 **PROJEKT-ÜBERSICHT**

Lopez IT Welt ist eine moderne IT-Plattform für Managed Services, Cloud-Lösungen und SaaS-Angebote. Das Projekt zielt darauf ab, eine sichere, skalierbare und benutzerfreundliche Plattform zu entwickeln, die den deutschen Compliance-Anforderungen entspricht.

---

## 👤 **BENUTZERSTRUKTUR**

### **Chef – Ramiro Lopez Rodriguez**
- **E-Mail:** `ramiro-lopez-rodriguez@lopez-it-welt.de`
- **Login:** `r.lopezsr`
- **Rolle:** Chef (Vollzugriff)
- **Berechtigungen:** `["*"]` (Alle Rechte)

### **CTO – Ramiro Lopez Mc Lean**
- **E-Mail:** `ramiro-lopez-mc-lean@lopez-it-welt.de`
- **Login:** `r.mclean`
- **Rolle:** CTO (Technische Leitung)
- **Berechtigungen:** `["customers.*", "reports.*", "settings.*", "monitoring.*", "backup.*"]`

---

## 🌍 **DOMAIN- & E-MAIL-STANDARD**

### **Hauptdomain:**
- **Domain:** `lopez-it-welt.de`
- **Zweck:** Primäre Domain für alle Systeme
- **Standard:** Alle E-Mails verwenden diese Domain

### **Optionale Zweitdomain:**
- **Domain:** `lopezitwelt.de`
- **Zweck:** Alternative Domain für Kundenkontakt (optional)
- **Verwendung:** Nur für Kontakt/Support + Hauptuser

### **Enterprise-Systemdomain:**
- **Domain:** `lopez-enterprise.com`
- **Zweck:** System/Monitoring
- **Verwendung:** Nur `alertmanager@lopez-enterprise.com` und `dev@lopez-enterprise.com`

---

## 📧 **E-MAIL-ADRESSEN**

### **Kontakt- & Support-E-Mails:**
- `kontakt@lopez-it-welt.de` - Hauptkontakt
- `support@lopez-it-welt.de` - Support
- `postmaster@lopez-it-welt.de` - Postmaster
- `admin@lopez-it-welt.de` - Admin-Bereich
- `admin-support@lopez-it-welt.de` - Admin-Support
- `accessibility@lopez-it-welt.de` - Barrierefreiheit

### **System- / Backend-E-Mails:**
- `noreply@lopez-it-welt.de` - System-Benachrichtigungen
- `devops@lopez-it-welt.de` - DevOps
- `security@lopez-it-welt.de` - Security
- `analytics@lopez-it-welt.de` - Analytics
- `api@lopez-it-welt.de` - API
- `api-support@lopez-it-welt.de` - API-Support

### **Enterprise-System:**
- `alertmanager@lopez-enterprise.com` - Alert Manager
- `dev@lopez-enterprise.com` - Development

### **Steuer / ELSTER:**
- `steuer@lopez-it-welt.de` - Steuer & ELSTER
  - ELSTER-Konto erstellt
  - Aktivierungs-ID per E-Mail erwartet
  - Aktivierungsbrief unterwegs
  - Zertifikat später speichern unter: `D:\Lopez_IT_Welt\Finanzen\ELSTER\ELSTER_Zertifikat_2025.pfx`

### **Zweitdomain (Optional):**
- `ramiro.lopezrodriguez@lopezitwelt.de` - Chef (optional)
- `ramiro.lopezmclean@lopezitwelt.de` - CTO (optional)
- `kontakt@lopezitwelt.de` - Kontakt (optional)
- `support@lopezitwelt.de` - Support (optional)

---

## 🔒 **DNS-SICHERHEITSSTANDARD**

### **SPF (Sender Policy Framework):**
```
v=spf1 include:spf.netcup.net -all
```

### **DKIM (DomainKeys Identified Mail):**
```
default._domainkey → key1._domainkey.webhosting.systems
```

### **DMARC (Domain-based Message Authentication):**
```
v=DMARC1; p=none; rua=mailto:postmaster@lopez-it-welt.de
```

---

## 🧪 **TEST-ADRESSEN**

### **Nur erlaubte Testadresse:**
- `test@example.org` - Einzige erlaubte Test-E-Mail-Adresse

### **Entfernt / Nicht erlaubt:**
- ❌ `chef@lopez-it-welt.de`
- ❌ `cto@lopez-it-welt.de`
- ❌ `lopez-team.de` E-Mails
- ❌ Private T-Online-E-Mail
- ❌ `max@example.com`
- ❌ `test@example.com`
- ❌ `editor@example.com`

---

## 🔐 **LOGIN-KONVENTIONEN**

### **Admin-Login:**
- **Identifier:** Username ODER E-Mail (Dual-Login)
- **2FA:** TOTP Pflicht (Aegis-kompatibel, 30s, 6-stellig)
- **Passwort-Policy:** min 12 Zeichen, Groß/Klein/Zahl/Sonderz
- **Lockout:** 5 Fehlversuche → 15 Min Sperre

### **Shop-Login:**
- **Identifier:** E-Mail (kein Username)
- **2FA:** Optional (vorbereitet, noch nicht erzwingen)
- **Passwort-Policy:** min 10 Zeichen

---

## 🏗️ **TECHNOLOGIE-STACK**

- **Frontend:** Next.js 14, React 18, TypeScript
- **Backend:** Next.js API Routes, Node.js
- **Datenbank:** MySQL/MariaDB (utf8mb4_unicode_ci)
- **Styling:** Tailwind CSS
- **i18n:** Deutsch, Englisch, Spanisch
- **Compliance:** GoBD, DSGVO, ISO 27001

---

## 📊 **SYSTEM-STATUS**

### **Implementierte Module:**
- ✅ Office & Finance Management
- ✅ RBAC & Benutzer-Rollen
- ✅ Login & 2FA (Aegis-kompatibel)
- ✅ Dual-Auth (Admin vs. Shop)
- ✅ Zeiterfassung (automatisch bei Login/Logout)
- ✅ Audit-Logging (GoBD/DSGVO/ISO 27001)
- ✅ A/B-Testing Core
- ✅ Admin-Dashboard

### **Compliance:**
- ✅ GoBD-konform (§14 UStG)
- ✅ DSGVO-konform
- ✅ ISO 27001-konform
- ✅ Audit-Trail für alle Änderungen
- ✅ Hash-Verifikation (SHA-256)

---

## 📚 **DOKUMENTATION**

Alle Dokumentation befindet sich im `docs/` Verzeichnis:
- `docs/09-IMPLEMENTIERUNG/` - Implementierungs-Dokumentation
- `docs/06-ADMIN-BEREICH/` - Admin-Dokumentation
- `docs/07-OFFICE-MANAGEMENT/` - Office & Finance Management
- `docs/03-ENTWICKLUNG/` - Entwicklung & APIs

---

## 📞 **KONTAKT**

**Lopez IT Welt**  
Ramiro Lopez Rodriguez  
Alte Bahnhofstraße 13  
31515 Wunstorf  
Deutschland

**Telefon:** +49 (0) 5031 7005576  
**WhatsApp:** +49 15251574657  
**E-Mail:** kontakt@lopez-it-welt.de

---

**Status:** ✅ Dokumentation aktuell  
**Letzte Aktualisierung:** 2025-11-01






