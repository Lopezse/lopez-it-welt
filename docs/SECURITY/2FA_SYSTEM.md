# 🔐 ENTERPRISE++ 2FA-SYSTEM

**Stand:** 2025-12-04  
**Status:** ✅ AKTIV  
**Version:** 1.0

---

## 📋 Übersicht

Das Two-Factor Authentication (2FA) System ist Teil des **ADM-04 2FA & Session-Management** Moduls.

| Aspekt | Status |
|--------|--------|
| **Modul-Code** | ADM-04 |
| **Fortschritt** | 100% |
| **Maturity Level** | M5 |
| **Go-Live-Required** | ✅ Ja |

---

## 🔑 Funktionen

### 1. TOTP-Authentifizierung

- **Standard:** RFC 6238 (TOTP)
- **Algorithmus:** SHA-1, 6-stellig, 30-Sekunden-Intervall
- **Kompatible Apps:**
  - Aegis (empfohlen)
  - Google Authenticator
  - Microsoft Authenticator
  - Authy

### 2. QR-Code-Setup

```
POST /api/admin/2fa/setup
```
- Generiert TOTP-Secret
- Liefert QR-Code zur Einrichtung
- Speichert verschlüsseltes Secret in DB

### 3. 2FA-Verifizierung

```
POST /api/admin/2fa/verify
```
- Prüft TOTP-Code
- Aktiviert 2FA für Benutzer
- Protokolliert Aktivierung im Audit-Log

### 4. Security-Recheck

```
POST /api/admin/security/recheck
```
- Erzwingt Passwort + 2FA-Bestätigung
- Token gültig für 10 Minuten
- Für kritische Admin-Aktionen

---

## 🗂️ Datenbank

### Tabelle: lopez_users

| Spalte | Beschreibung |
|--------|--------------|
| `totp_secret` | Verschlüsseltes TOTP-Secret |
| `totp_enabled` | 2FA aktiv (BOOLEAN) |
| `totp_verified_at` | Erstmalige Verifizierung |

### Tabelle: lopez_audit_events

Protokolliert alle 2FA-Ereignisse:
- `2FA_SETUP_STARTED`
- `2FA_ACTIVATED`
- `2FA_DEACTIVATED`
- `2FA_VERIFY_SUCCESS`
- `2FA_VERIFY_FAILED`

---

## 🔒 Sicherheits-Richtlinien

1. **Pflicht für Admins:** Alle Admin-Benutzer müssen 2FA aktivieren
2. **Rate-Limiting:** Max. 5 Fehlversuche pro 15 Minuten
3. **Backup-Codes:** Zukünftig geplant (SEC-Modul)
4. **Session-Bindung:** 2FA-Session an IP gebunden

---

## 📊 Admin-UI

Die 2FA-Verwaltung ist unter folgenden Pfaden verfügbar:

- `/admin/settings/security/2fa` – 2FA-Übersicht
- `/admin/settings/users/[id]/2fa` – 2FA für Benutzer
- `/admin/profile/security` – Eigene 2FA-Einstellungen

---

## ⚠️ WICHTIG

**KEINE Änderungen an 2FA-Logik ohne explizite Freigabe!**

Das 2FA-System ist geschäftskritisch und darf nicht:
- Deaktiviert werden
- Umgangen werden
- Zurückgesetzt werden (außer durch Admin)

---

**Letzte Aktualisierung:** 2025-12-04
