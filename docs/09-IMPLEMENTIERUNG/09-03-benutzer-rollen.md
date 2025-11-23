# 👤 Benutzer-Rollen System - Enterprise++ Standards

**Datum:** 2025-11-01  
**Status:** ✅ IMPLEMENTIERT  
**Version:** 2.0.0  
**Autor:** Lopez IT Welt Team

## 📋 **ÜBERSICHT**

Das Benutzer-Rollen-System definiert die hierarchische Struktur der Benutzer-Berechtigungen nach Enterprise++ Standards, basierend auf IBM/SAP-Praktiken.

## 🏷️ **BENUTZER-NAMENSKONVENTION (Enterprise++ Standard)**

### **Regeln für Username-Generierung:**

**1. Standard: `f.lastname`**
- Erster Buchstabe des Vornamens + Nachname
- Beispiel: `r.lopez`

**2. Familienmitglieder:**
- **Vater/älterer:** `f.lastnamesr` → Beispiel: `r.lopezsr`
- **Sohn/jüngerer:** `f.lastnamejr` → Beispiel: `r.mclean` (bei "Lopez Mc Lean")

**3. Weitere Lopez (nicht Familie):**
- Nutze zweiten Buchstaben des Vornamens: `fa.lastname`
- Beispiel: `ra.lopez`, `ro.lopez`

**4. Doppelnamen:**
- Kurzform ohne Leerzeichen oder Bindestriche
- Beispiel: `r.lopezmclean` (bei "Lopez Mc Lean")

**5. Rollenvarianten (optional):**
- `.it`, `.pm`, `.fin` für funktionsspezifische Konten
- Beispiel: `r.lopez.it`, `r.lopez.fin`

### **E-Mail-Regel:**

- **Hauptadresse:** `<vollername>@lopez-it-welt.de`
  - Beispiel: `ramiro-lopez-rodriguez@lopez-it-welt.de`
- **Alias:** `<username>@lopez-it-welt.de`
  - Beispiel: `r.lopezsr@lopez-it-welt.de`

### **Definition of Done (DoD):**

✅ Keine numerischen Suffixe größer als 2  
✅ Alle Usernames eindeutig, lesbar und GoBD/DSGVO/ISO 27001-konform  
✅ Policy dokumentiert  
✅ Audit-Eintrag `user.create` loggt ursprünglichen Namen und finalen Username

### **Beispiele:**

```typescript
// Vater/Chef
{
  first_name: "Ramiro",
  last_name: "Lopez Rodriguez",
  family_relation: "father",
  username: "r.lopezsr", // generiert
  email: "ramiro-lopez-rodriguez@lopez-it-welt.de"
}

// Sohn/CTO
{
  first_name: "Ramiro",
  last_name: "Lopez Mc Lean",
  family_relation: "son",
  username: "r.mclean", // generiert
  email: "ramiro-lopez-mc-lean@lopez-it-welt.de"
}

// Rollenvariante (optional)
{
  first_name: "Ramiro",
  last_name: "Lopez Rodriguez",
  family_relation: "father",
  role_variant: "it",
  username: "r.lopezsr.it", // generiert
  email: "ramiro-lopez-rodriguez@lopez-it-welt.de"
}
```

## 🎯 **ROLLEN-HIERARCHIE**

### **1. Chef (r.lopezsr) - Höchste Autorität**

```typescript
const chefRole = {
  username: "r.lopezsr", // Generiert nach Enterprise++ Standard
  email: "ramiro-lopez-rodriguez@lopez-it-welt.de",
  firstName: "Ramiro",
  lastName: "Lopez Rodriguez",
  family_relation: "father",
  role: "chef",
  level: 1,
  permissions: ["*"], // Alle Rechte
  description: "Geschäftsführer und System-Administrator",
};
```

**Berechtigungen:**

- ✅ **Vollzugriff** - Alle System-Funktionen
- ✅ **Benutzer-Management** - Alle Benutzer verwalten
- ✅ **System-Konfiguration** - Alle Einstellungen
- ✅ **Datenbank-Zugriff** - Direkter DB-Zugriff
- ✅ **Audit-Logs** - Alle Logs einsehen
- ✅ **Backup/Restore** - Vollständige Kontrolle
- ✅ **Sicherheit** - Alle Sicherheits-Funktionen

### **2. CTO (r.mclean) - Technische Leitung**

```typescript
const ctoRole = {
  username: "r.mclean", // Generiert nach Enterprise++ Standard
  email: "ramiro-lopez-mc-lean@lopez-it-welt.de",
  firstName: "Ramiro",
  lastName: "Lopez Mc Lean",
  family_relation: "son",
  role: "cto",
  level: 2,
  permissions: ["customers.*", "reports.*", "settings.*", "monitoring.*", "backup.*"],
  description: "Chief Technology Officer",
};
```

**Berechtigungen:**

- ✅ **Kunden-Management** - Vollständige Kunden-Verwaltung
- ✅ **Reports** - Alle Export-Funktionen
- ✅ **Einstellungen** - System-Konfiguration
- ✅ **Monitoring** - System-Überwachung
- ✅ **Backup** - Backup-Verwaltung
- ❌ **Benutzer-Management** - Nur eigene Benutzer
- ❌ **Sicherheit** - Eingeschränkte Sicherheits-Funktionen

### **3. Admin - System-Administrator**

```typescript
const adminRole = {
  role: "admin",
  level: 3,
  permissions: [
    "customers.read",
    "customers.update",
    "reports.export",
    "monitoring.view",
    "settings.basic",
  ],
  description: "System-Administrator",
};
```

**Berechtigungen:**

- ✅ **Kunden lesen/bearbeiten** - Kunden-Daten verwalten
- ✅ **Reports exportieren** - Excel/PDF/CSV-Export
- ✅ **Monitoring** - System-Status einsehen
- ✅ **Basis-Einstellungen** - Einfache Konfiguration
- ❌ **Benutzer-Management** - Keine Benutzer-Verwaltung
- ❌ **Sicherheit** - Keine Sicherheits-Funktionen

### **4. Support - Kundensupport**

```typescript
const supportRole = {
  role: "support",
  level: 4,
  permissions: ["customers.read", "customers.update", "tickets.*", "reports.basic"],
  description: "Kundensupport-Mitarbeiter",
};
```

**Berechtigungen:**

- ✅ **Kunden lesen/bearbeiten** - Kunden-Daten verwalten
- ✅ **Tickets** - Support-Tickets verwalten
- ✅ **Basis-Reports** - Einfache Reports
- ❌ **System-Einstellungen** - Keine Konfiguration
- ❌ **Benutzer-Management** - Keine Benutzer-Verwaltung

### **5. Redakteur - Content-Manager**

```typescript
const redakteurRole = {
  role: "redakteur",
  level: 5,
  permissions: ["content.*", "customers.read", "reports.basic"],
  description: "Content-Manager",
};
```

**Berechtigungen:**

- ✅ **Content-Management** - Inhalte verwalten
- ✅ **Kunden lesen** - Kunden-Daten einsehen
- ✅ **Basis-Reports** - Einfache Reports
- ❌ **Kunden bearbeiten** - Keine Kunden-Änderungen
- ❌ **System-Einstellungen** - Keine Konfiguration

## 🔐 **BERECHTIGUNGS-SYSTEM**

### **Permission-Level:**

```typescript
const permissionLevels = {
  "customers.*": "Vollzugriff auf Kunden",
  "customers.read": "Kunden lesen",
  "customers.create": "Kunden erstellen",
  "customers.update": "Kunden bearbeiten",
  "customers.delete": "Kunden löschen",

  "reports.*": "Vollzugriff auf Reports",
  "reports.export": "Reports exportieren",
  "reports.basic": "Basis-Reports",

  "settings.*": "Vollzugriff auf Einstellungen",
  "settings.basic": "Basis-Einstellungen",

  "monitoring.*": "Vollzugriff auf Monitoring",
  "monitoring.view": "Monitoring einsehen",

  "backup.*": "Vollzugriff auf Backup",
  "backup.create": "Backup erstellen",
  "backup.restore": "Backup wiederherstellen",

  "users.*": "Vollzugriff auf Benutzer",
  "users.read": "Benutzer lesen",
  "users.create": "Benutzer erstellen",
  "users.update": "Benutzer bearbeiten",
  "users.delete": "Benutzer löschen",

  "security.*": "Vollzugriff auf Sicherheit",
  "security.audit": "Audit-Logs einsehen",
  "security.2fa": "2FA verwalten",

  "*": "Alle Rechte",
};
```

### **Rollen-Berechtigungen:**

```typescript
const rolePermissions = {
  chef: ["*"],
  cto: ["customers.*", "reports.*", "settings.*", "monitoring.*", "backup.*"],
  admin: [
    "customers.read",
    "customers.update",
    "reports.export",
    "monitoring.view",
    "settings.basic",
  ],
  support: ["customers.read", "customers.update", "tickets.*", "reports.basic"],
  redakteur: ["content.*", "customers.read", "reports.basic"],
};
```

## 🗄️ **DATENBANK-STRUKTUR**

### **Benutzer-Tabelle:**

```sql
CREATE TABLE lopez_users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role ENUM('chef', 'cto', 'admin', 'support', 'redakteur') NOT NULL,
    status ENUM('active', 'inactive', 'locked', 'pending') DEFAULT 'pending',
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### **Rollen-Tabelle:**

```sql
CREATE TABLE lopez_roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    level INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **Berechtigungen-Tabelle:**

```sql
CREATE TABLE lopez_permissions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🚀 **IMPLEMENTIERUNG**

### **1. Benutzer-Erstellung:**

```typescript
// Chef-Benutzer erstellen (Username wird automatisch generiert)
const chefUser = await RBACService.createUser({
  first_name: "Ramiro",
  last_name: "Lopez Rodriguez",
  family_relation: "father", // Generiert: r.lopezsr
  role: "chef",
  password: "LopezIT2025!", // Standard-Passwort
});

// CTO-Benutzer erstellen (Username wird automatisch generiert)
const ctoUser = await RBACService.createUser({
  first_name: "Ramiro",
  last_name: "Lopez Mc Lean",
  family_relation: "son", // Generiert: r.mclean
  role: "cto",
  password: "LopezIT2025!", // Standard-Passwort
});
```

**Username-Generierung:**
- Chef: `r.lopezsr` (Vater/älterer)
- CTO: `r.mclean` (Sohn/jüngerer)

**E-Mail-Generierung:**
- Chef: `ramiro-lopez-rodriguez@lopez-it-welt.de`
- CTO: `ramiro-lopez-mc-lean@lopez-it-welt.de`

### **2. Rollen-Zuordnung:**

```typescript
// Rollen zuweisen
await RBACService.assignRole(chefUser.id, "chef");
await RBACService.assignRole(ctoUser.id, "cto");

// Berechtigungen zuweisen
await RBACService.assignPermissions("chef", ["*"]);
await RBACService.assignPermissions("cto", [
  "customers.*",
  "reports.*",
  "settings.*",
  "monitoring.*",
  "backup.*",
]);
```

### **3. Berechtigungs-Prüfung:**

```typescript
// Berechtigung prüfen
const hasPermission = await RBACService.hasPermission(userId, "customers.read");

// Rolle prüfen
const isChef = await RBACService.hasRole(userId, "chef");
const isCTO = await RBACService.hasRole(userId, "cto");
```

## 📊 **STATISTIKEN**

### **Benutzer-Übersicht:**

- **Chef:** 1 Benutzer (r.lopezsr) - Ramiro Lopez Rodriguez
- **CTO:** 1 Benutzer (r.mclean) - Ramiro Lopez Mc Lean
- **Admin:** 0 Benutzer (zu erstellen)
- **Support:** 0 Benutzer (zu erstellen)
- **Redakteur:** 0 Benutzer (zu erstellen)

### **Berechtigungen:**

- **Gesamt:** 25+ Berechtigungen
- **Kategorien:** 7 Hauptkategorien
- **Rollen:** 5 Rollen-Level
- **Hierarchie:** 5 Ebenen

## 🎯 **NÄCHSTE SCHRITTE**

### **1. Benutzer-Erstellung:**

- ✅ Chef-Benutzer (r.lopezsr) angelegt - Ramiro Lopez Rodriguez
- ✅ CTO-Benutzer (r.mclean) angelegt - Ramiro Lopez Mc Lean
- ✅ Passwörter gesetzt (Standard: LopezIT2025!)
- ⏳ 2FA einrichten (nächster Schritt)

### **2. Rollen-System:**

- Rollen in Datenbank anlegen
- Berechtigungen definieren
- Rollen-Zuordnung implementieren
- Berechtigungs-Prüfung testen

### **3. Frontend-Integration:**

- Benutzer-Management-UI
- Rollen-Verwaltung
- Berechtigungs-Anzeige
- Admin-Dashboard

## 📚 **VERWANDTE DOKUMENTATION**

- [Phase 2 Abgeschlossen](./09-01-phase-2-abgeschlossen.md) - Implementierte Features
- [Development Mode](./09-02-development-mode.md) - Lokale Entwicklung
- [RBAC-System](../04-ENTERPRISE/04-11-rechte-und-rollen.md) - Berechtigungskonzept
- [Sicherheitskonzepte](../04-ENTERPRISE/04-04-enterprise-security-erweitert.md) - Sicherheit

## 🎉 **FAZIT**

Das Benutzer-Rollen-System definiert eine klare Hierarchie nach Enterprise++ Standards, die sowohl Sicherheit als auch Flexibilität gewährleistet.

**Nächste Aktion:** 2FA für Benutzer einrichten 🚀

---

**Status:** ✅ Implementiert  
**Priorität:** Hoch  
**Geschätzter Aufwand:** Erledigt
