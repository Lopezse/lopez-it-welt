# 🏢 ENTERPRISE++ ADMIN-SYSTEM ARCHITEKTUR

**Stand:** 2025-12-04  
**Status:** ✅ PRODUKTIONSREIF  
**Version:** 1.0

---

## 📋 Übersicht

Das Admin-System bildet das Herzstück von Lopez IT Welt und umfasst die Module **ADM-01 bis ADM-07** (alle 100% fertig).

---

## 📊 Modul-Status

| Code | Name | Status | Maturity |
|------|------|--------|----------|
| ADM-01 | Admin-Dashboard | ✅ 100% | M5 |
| ADM-02 | Benutzerverwaltung | ✅ 100% | M5 |
| ADM-03 | Rollen & Rechte (RBAC/ABAC) | ✅ 100% | M5 |
| ADM-04 | 2FA & Session-Management | ✅ 100% | M5 |
| ADM-05 | Audit-Logs | ✅ 100% | M5 |
| ADM-06 | Dynamic Settings | ✅ 100% | M5 |
| ADM-07 | Modul-Registry (SOLL/IST) | ✅ 100% | M5 |

---

## 🗂️ Verzeichnisstruktur

```
src/app/admin/
├── page.tsx                    # Dashboard (ADM-01)
├── layout.tsx                  # Admin-Layout mit Sidebar
├── settings/
│   ├── users/                  # Benutzerverwaltung (ADM-02)
│   ├── roles/                  # Rollenverwaltung (ADM-03)
│   ├── security/
│   │   ├── 2fa/               # 2FA-Einstellungen (ADM-04)
│   │   └── api/               # API-Sicherheit
│   └── system/                # System-Einstellungen (ADM-06)
├── audit/                      # Audit-Logs (ADM-05)
└── agent-system/              # Modul-Registry (ADM-07)
```

---

## 🔐 Sicherheitsarchitektur

### RBAC (Role-Based Access Control)

| Rolle | Berechtigungen |
|-------|---------------|
| **Super Admin** | Alle Rechte |
| **Admin** | Verwaltung, kein System-Zugriff |
| **Editor** | Inhalte bearbeiten |
| **Viewer** | Nur Lesen |

### ABAC (Attribute-Based Access Control)

Zusätzliche Bedingungen:
- IP-basierte Einschränkungen
- Zeitbasierte Zugriffskontrolle
- Ressourcen-spezifische Regeln

### Session-Management

- JWT-basierte Sessions
- Sichere HTTP-Only Cookies
- Session-Timeout: 24 Stunden
- IP-Bindung optional

---

## 🗄️ Datenbank-Tabellen

### Benutzer & Auth

| Tabelle | Beschreibung |
|---------|--------------|
| `lopez_users` | Benutzer-Stammdaten |
| `lopez_user_sessions` | Aktive Sessions |
| `lopez_roles` | Rollen-Definitionen |
| `lopez_permissions` | Berechtigungen |
| `lopez_role_permissions` | Rollen-Berechtigungen-Mapping |

### Audit & Logging

| Tabelle | Beschreibung |
|---------|--------------|
| `lopez_audit_events` | Sicherheits-Events |
| `lopez_login_attempts` | Login-Versuche |

### Settings

| Tabelle | Beschreibung |
|---------|--------------|
| `lopez_settings` | System-Einstellungen |

---

## 📡 API-Endpunkte

### Benutzer (ADM-02)

```
GET    /api/admin/users           # Liste
POST   /api/admin/users           # Erstellen
PATCH  /api/admin/users/[id]      # Bearbeiten
DELETE /api/admin/users/[id]      # Deaktivieren
```

### Rollen (ADM-03)

```
GET    /api/admin/roles           # Liste
POST   /api/admin/roles           # Erstellen
PATCH  /api/admin/roles/[id]      # Bearbeiten
```

### Audit (ADM-05)

```
GET    /api/admin/audit-logs      # Logs abrufen
```

### Settings (ADM-06)

```
GET    /api/admin/settings        # Alle Einstellungen
PATCH  /api/admin/settings        # Einstellung ändern
```

### Agent-System (ADM-07)

```
GET    /api/admin/agent-system    # Module laden
POST   /api/admin/agent-system    # Initialisieren
PATCH  /api/admin/agent-system    # Progress aktualisieren
```

---

## 🔒 Enterprise++ Standards

1. **Keine CMD/Terminal für Endbenutzer** – Nur UI
2. **Vollständiges Audit-Logging** – Jede Aktion protokolliert
3. **DSGVO-Konformität** – Datenschutz integriert
4. **Rollenbasierte Zugriffskontrolle** – Least-Privilege-Prinzip

---

**Letzte Aktualisierung:** 2025-12-04
