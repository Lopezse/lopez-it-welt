# 🔐 Admin Access Control & Dual-Auth System

**Datum:** 2025-11-01  
**Status:** ✅ IMPLEMENTIERT  
**Version:** 2.0.0  
**Autor:** Lopez IT Welt Team

## 📋 **ÜBERSICHT**

Das System trennt sauber zwischen Admin- und Shop-Authentifizierung (IBM/SAP-Style). Zwei separate Auth-Bereiche mit klaren Policies, korrekten Formularen und Guards.

## 🏗️ **ARCHITEKTUR-TRENNUNG (REALMS)**

### **Namespaces:**

**ADMIN:**
- Cookies/Session-Keys mit Präfix `adm_` (`adm_session`, `adm_csrf`)
- Routen: `/admin/*`, `/api/admin/*`, `/api/auth/admin/*`
- User-Quelle: `lopez_users` Tabelle (RBAC: admin, finance_manager, project_lead, …)

**SHOP:**
- Cookies/Session-Keys mit Präfix `shp_` (`shp_session`, `shp_csrf`)
- Routen: `/shop/*`, `/account/*`, `/api/shop/*`, `/api/auth/shop/*`
- User-Quelle: `lopez_customers` Tabelle (rollenlos bzw. customer)

## 🔐 **LOGIN-POLICIES**

### **ADMIN Login:**

- **Identifier:** Username ODER E-Mail (Dual-Login)
- **2FA:** TOTP Pflicht (Aegis kompatibel, 30s, 6-stellig)
- **Passwort-Policy:** min 12 Zeichen, Groß/Klein/Zahl/Sonderz
- **Lockout:** 5 Fehlversuche → 15 Min Sperre

### **SHOP Login:**

- **Identifier:** E-Mail (kein Username)
- **2FA:** optional (vorbereiten, noch nicht erzwingen)
- **Passwort-Policy:** min 10 Zeichen

## 📝 **UI/FORMULARE**

### **Admin Login Page (`/admin/login`):**

- Feld-Label: "Benutzername oder E-Mail"
- Validierung: akzeptiert `r.lopezsr` oder `ramiro-lopez-rodriguez@…`
- 2FA-Step nach Passwort (Pflicht)

### **Shop Login Page (`/account/login`):**

- Feld-Label: "E-Mail"
- Validierung: muss @ enthalten
- 2FA optional (falls aktiviert)

## 🔌 **ENDPOINTS & MIDDLEWARE**

### **ADMIN:**

- `POST /api/auth/admin/login` → akzeptiert `username|email`
- `POST /api/auth/admin/logout`
- `GET /api/auth/admin/me` → `{id,name,email,roles[],mfa_enabled,last_login_at}`
- Guards: `middleware.ts` muss `/admin/*` und `/api/admin/*` auf `adm_session` prüfen, sonst 302 → `/admin/login`

### **SHOP:**

- `POST /api/auth/shop/login` → nur Email
- `POST /api/auth/shop/logout`
- `GET /api/auth/shop/me`
- Guards: `/account/*`, `/shop/checkout/*` verlangen `shp_session`

## 🛡️ **RBAC & SCOPES (nur ADMIN)**

- Server-seitig erzwingen (kein reines UI-Hiding)
- Rollen wie dokumentiert (deny_overrides_allow: true)
- Time-Tracking-Scopes: admin/finance_manager sehen alle, andere nur eigene

## ⏱️ **ZEITERFASSUNG-KOPPLUNG (nur ADMIN)**

- Bei ADMIN-Login: auto-Start `work_sessions` (status=active, project_id=null)
- Bei ADMIN-Logout: offene Sessions des Users beenden (end_time/duration)
- SHOP: keine Zeiterfassung auslösen

## 📊 **AUDIT-LOGGING (GoBD/ISO)**

### **Kategorien:**

- `AUTHENTICATION` (login, logout, mfa_challenge, mfa_failed, lockout)
- `SECURITY_EVENT` (unauthorized /admin, CSRF fail)
- `DATA_MODIFICATION` (auto time-session start/stop)

### **Log-Felder:**

- `realm` (ADMIN|SHOP) - in `new_values` JSON gespeichert
- `user_id`, `ip`, `user_agent`, `route`, `result`

## 🧪 **TESTS (manuell)**

### **ADMIN:**

1. Login mit `r.lopezsr` (ohne @) → OK
2. Login mit `ramiro-lopez-rodriguez@…` → OK
3. 2FA Pflicht (Aegis) → Code akzeptiert/abgelehnt korrekt
4. Direktaufruf `/admin/office/calendar` ohne Session → Redirect `/admin/login`
5. RBAC: `r.mclean` darf Settings nicht öffnen → 403
6. Zeiterfassung: nach Login Eintrag, nach Logout beendet

### **SHOP:**

1. Login nur mit E-Mail (username ohne @ → Fehler)
2. Direktaufruf `/account/orders` ohne Session → Redirect `/account/login`

## 📚 **IMPLEMENTIERUNGS-DETAILS**

### **AdminAuthService:**

- `src/lib/admin-auth-service.ts`
- Login mit Username ODER Email
- 2FA Pflicht
- Lockout-Mechanismus (5 Fehlversuche → 15 Min)
- Session-Token mit `adm_` Präfix

### **ShopAuthService:**

- `src/lib/shop-auth-service.ts`
- Login nur mit Email
- 2FA optional
- Session-Token mit `shp_` Präfix

### **Middleware Guards:**

- `src/middleware/admin-guard.ts` - für `/admin/*` und `/api/admin/*`
- `src/middleware/shop-guard.ts` - für `/account/*` und `/api/shop/*`
- Automatische Redirects zu Login-Seiten

## ✅ **DEFINITION OF DONE (DoD)**

- ✅ ADMIN akzeptiert Username oder E-Mail; SHOP nur E-Mail
- ✅ Middleware schützt getrennt: `/admin/*` vs `/account/*`
- ✅ 2FA Pflicht für ADMIN, optional für SHOP
- ✅ RBAC server-seitig aktiv; unerlaubte Calls → 403 + Audit
- ✅ ADMIN-Login/Logout koppeln Zeiterfassung (Start/Stop)
- ✅ Audit-Trail vollständig (AUTHENTICATION, SECURITY_EVENT, DATA_MODIFICATION)
- ✅ Doku aktualisiert

## 📚 **VERWANDTE DOKUMENTATION**

- [Login & 2FA](./09-04-login-und-2fa.md) - Login-System
- [Benutzer-Rollen](./09-03-benutzer-rollen.md) - RBAC-System
- [Zeiterfassung](./09-05-zeitverknüpfung.md) - Zeiterfassungs-Verknüpfung

## 🎉 **FAZIT**

Das Dual-Auth-System ist vollständig implementiert. Admin- und Shop-Bereiche sind sauber getrennt, mit eigenen Policies, Guards und Audit-Logs.

**Status:** ✅ Implementiert  
**Priorität:** Hoch  
**Geschätzter Aufwand:** Erledigt

---

**Letzte Aktualisierung:** 2025-11-01



