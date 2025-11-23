# ⏱️ Zeiterfassung ↔ Benutzer-Verknüpfung

**Datum:** 2025-11-01  
**Status:** ✅ IMPLEMENTIERT  
**Version:** 1.0.0  
**Autor:** Lopez IT Welt Team

## 📋 **ÜBERSICHT**

Die Zeiterfassung ist vollständig mit dem Login-System verknüpft. Nach erfolgreichem Login wird automatisch eine Zeiterfassungs-Session gestartet, die bei Logout automatisch beendet wird.

## 🔗 **VERKNÜPFUNGEN**

### **1. Login → Zeiterfassung**

**Automatischer Start:**
- Nach erfolgreichem Login wird automatisch eine Session erstellt
- Session-Modul: `Login-Session`
- Tätigkeit: `System-Login: <username>`
- Status: `active`
- Projekt-ID: `null` (keine Zuordnung bei Login)

**Implementierung:**
- `src/app/api/auth/login/route.ts`
- Direktes Schreiben in `data/time-sessions.json`
- Audit-Log: `DATA_MODIFICATION`

### **2. Logout → Zeiterfassung**

**Automatisches Beenden:**
- Alle aktiven Sessions für den Benutzer werden beendet
- `end_time` wird gesetzt
- `duration_minutes` wird berechnet
- Status: `completed`

**Implementierung:**
- `src/app/api/auth/logout/route.ts`
- Direktes Aktualisieren in `data/time-sessions.json`
- Audit-Log: `DATA_MODIFICATION`

### **3. UserInfo-Komponente**

**Anzeige:**
- Benutzername, Rolle(n), letzter Login, 2FA-Status
- Dropdown: "Mein Konto" / "Abmelden"
- Verbindung mit `/api/auth/me`

**Implementierung:**
- `src/components/admin/UserInfo.tsx`
- Verwendung in `AdminLayout.tsx`

## 📊 **DATENSTRUKTUR**

### **Zeiterfassungs-Session (Login):**

```json
{
  "id": 1,
  "user_id": 1,
  "module": "Login-Session",
  "taetigkeit": "System-Login: r.lopezsr",
  "ausloeser": "Automatische Zeiterfassung nach erfolgreichem Login",
  "problem": false,
  "category": "administration",
  "priority": "high",
  "project_id": null,
  "task_id": null,
  "start_time": "2025-11-01T12:00:00.000Z",
  "status": "active",
  "created_at": "2025-11-01T12:00:00.000Z",
  "updated_at": "2025-11-01T12:00:00.000Z"
}
```

### **Zeiterfassungs-Session (Logout):**

```json
{
  "id": 1,
  "user_id": 1,
  "module": "Login-Session",
  "taetigkeit": "System-Login: r.lopezsr",
  "end_time": "2025-11-01T14:30:00.000Z",
  "duration_minutes": 150,
  "status": "completed",
  "updated_at": "2025-11-01T14:30:00.000Z"
}
```

## 🔍 **AUDIT-TRAIL**

### **Login-Zeiterfassung:**

- **Tabelle:** `lopez_audit_logs`
- **Action:** `INSERT`
- **Compliance-Kategorie:** `DATA_MODIFICATION`
- **Risk-Level:** `LOW`
- **Daten:** Session-ID, Benutzer-ID, Username, Module, Tätigkeit

### **Logout-Zeiterfassung:**

- **Tabelle:** `lopez_audit_logs`
- **Action:** `UPDATE`
- **Compliance-Kategorie:** `DATA_MODIFICATION`
- **Risk-Level:** `LOW`
- **Daten:** Session-ID, Benutzer-ID, Username, End-Zeit, Dauer

## 📋 **IMPLEMENTIERUNGS-DETAILS**

### **Login-Flow:**

1. Benutzer authentifizieren
2. Session erstellen
3. Audit-Log für Login
4. **Zeiterfassung starten:**
   - Prüfe ob aktive Session existiert
   - Falls nicht: Neue Session erstellen
   - Audit-Log für Zeiterfassung
5. JWT-Token zurückgeben

### **Logout-Flow:**

1. Session validieren
2. **Zeiterfassung beenden:**
   - Alle aktiven Sessions für Benutzer finden
   - Sessions beenden (end_time, duration_minutes)
   - Audit-Log für jede beendete Session
3. Session löschen
4. Audit-Log für Logout

## 🧪 **TEST-SZENARIEN**

### **Test 1: Login → Zeiterfassung**

**Schritte:**
1. Login mit `r.lopezsr` / `LopezIT2025!`
2. Prüfe `data/time-sessions.json`
3. Erwartung: Neue Session mit `status: "active"`

**Erwartetes Ergebnis:**
```json
{
  "id": 1,
  "user_id": 1,
  "module": "Login-Session",
  "taetigkeit": "System-Login: r.lopezsr",
  "status": "active",
  "start_time": "2025-11-01T12:00:00.000Z"
}
```

### **Test 2: Logout → Zeiterfassung**

**Schritte:**
1. Logout durchführen
2. Prüfe `data/time-sessions.json`
3. Erwartung: Session mit `status: "completed"` und `end_time`

**Erwartetes Ergebnis:**
```json
{
  "id": 1,
  "status": "completed",
  "end_time": "2025-11-01T14:30:00.000Z",
  "duration_minutes": 150
}
```

### **Test 3: Audit-Logs**

**Schritte:**
1. Login durchführen
2. Logout durchführen
3. Prüfe `lopez_audit_logs` Tabelle

**Erwartete Logs:**
- Login: `AUTHENTICATION` (LOGIN)
- Zeiterfassung Start: `DATA_MODIFICATION` (INSERT)
- Zeiterfassung Ende: `DATA_MODIFICATION` (UPDATE)
- Logout: `AUTHENTICATION` (LOGOUT)

## 🎯 **BEST PRACTICES**

### **Zeiterfassung:**

1. **Nur eine aktive Session pro Benutzer**
   - Prüfe vor Erstellung, ob bereits aktive Session existiert
   - Falls ja: Verwende bestehende Session

2. **Automatische Beendigung bei Logout**
   - Alle aktiven Sessions werden automatisch beendet
   - Dauer wird automatisch berechnet

3. **Audit-Logs für alle Events**
   - Jede Zeiterfassungs-Aktion wird geloggt
   - Compliance-Kategorie: `DATA_MODIFICATION`

### **UserInfo-Komponente:**

1. **Automatisches Laden**
   - Daten werden beim Mounten geladen
   - Token wird aus localStorage/sessionStorage gelesen

2. **Fallback bei Fehlern**
   - Zeige Lade-Animation bei fehlenden Daten
   - Keine Fehler anzeigen (optional)

## 📚 **VERWANDTE DOKUMENTATION**

- [Login & 2FA](./09-04-login-und-2fa.md) - Login-System
- [Benutzer-Rollen](./09-03-benutzer-rollen.md) - RBAC-System
- [Zeiterfassung](../03-ENTWICKLUNG/03-10-zeiterfassung.md) - Zeiterfassungs-System

## 🎉 **FAZIT**

Die Zeiterfassung ist vollständig mit dem Login-System verknüpft. Alle Sessions werden automatisch gestartet und beendet, mit vollständiger Audit-Protokollierung.

**Status:** ✅ Implementiert  
**Priorität:** Hoch  
**Geschätzter Aufwand:** Erledigt

---

**Letzte Aktualisierung:** 2025-11-01








