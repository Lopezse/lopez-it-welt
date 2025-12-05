# 🎯 DIREKTER AUFTRAG FÜR AGENT B (BUILDER)

## P8-E Phase 5: REST-API Endpoints implementieren

**Version:** 1.0  
**Stand:** 28.11.2025  
**Status:** 🚀 **BEREIT FÜR IMPLEMENTIERUNG**  
**Koordiniert durch:** Agent A (Planner & Coordinator)

---

## 📋 AUFTRAG

**Agent B (Builder), bitte implementiere P8-E Phase 5 (REST-API Endpoints) gemäß den folgenden Spezifikationen.**

---

## ✅ AUSGANGSLAGE

**Abgeschlossene Phasen:**
- ✅ Phase 1: Datenbank – FERTIG
- ✅ Phase 2: TypeScript-Modelle & Log-Engine-Basis – FERTIG
- ✅ Phase 3: Log Processor / Pipeline – FERTIG
- ✅ Phase 4: Analytics Engine – FERTIG

**Verfügbare Komponenten:**
- ✅ LogStorage, SearchEngine, LogPipeline (Phase 3)
- ✅ TrendAnalyzer, PatternDetector, AnomalyDetector, LogRuleRegistry (Phase 4)

---

## 🎯 ZU IMPLEMENTIEREN

### **1. GET /api/orchestrator/logs**

**Datei:** `src/app/api/orchestrator/logs/route.ts` (GET-Handler)

**Funktionen:**
- Logs abrufen mit Suche & Filter
- Query-Parameter: `q`, `category`, `log_level`, `severity`, `log_rule_id`, `start_time`, `end_time`, `limit`, `offset`, `sort`
- RBAC: `logs.view` (prüfen mit bestehender RBAC-Middleware)
- PD-Filter: Automatisch aktiv (LogStorage gibt keine PD zurück)

**Integration:**
- `LogStorage.getLogs()` – Ruft Logs ab
- `SearchEngine.fullTextSearch()` – Bei Volltext-Suche (wenn `q` Parameter vorhanden)

**Response-Format:**
```json
{
  "success": true,
  "data": {
    "logs": [...],
    "total": 1000,
    "limit": 100,
    "offset": 0
  }
}
```

**Details:** Siehe `P8-E-API-SPEC.md` Abschnitt 3.1

---

### **2. GET /api/orchestrator/logs/[id]**

**Datei:** `src/app/api/orchestrator/logs/[id]/route.ts`

**Funktionen:**
- Log-Detail abrufen
- RBAC: `logs.view`
- PD-Filter: Automatisch aktiv (LogStorage gibt keine PD zurück)
- DSFA-Hinweise: Bei High/Critical-Risk-Logs (aus Log-Regel)

**Integration:**
- `LogStorage.getLog(logId)` – Ruft Log ab
- `LogRuleRegistry.getLogRule()` – Ruft Log-Regel ab (für DSFA-Hinweise)

**Response-Format:**
```json
{
  "success": true,
  "data": {
    "id": "log-123",
    "log_rule_id": "SEC-LOG-001",
    "log_level": "ERROR",
    "category": "Security",
    "severity": "critical",
    "message": "...",
    "context": {...},
    "metadata": {...},
    "timestamp": "2025-11-28T10:00:00Z",
    "dsfa_hint": "High-Risk Log - DSFA Review empfohlen" // Optional
  }
}
```

**Details:** Siehe `P8-E-API-SPEC.md` Abschnitt 3.2

---

### **3. POST /api/orchestrator/logs/search**

**Datei:** `src/app/api/orchestrator/logs/search/route.ts`

**Funktionen:**
- Erweiterte Log-Suche
- Request-Body: `SearchQuery` (siehe `types.ts`)
- RBAC: `logs.view`
- Volltext-Suche: Über SearchEngine
- PD-Filter: Automatisch aktiv

**Integration:**
- `SearchEngine.searchLogs(query)` – Sucht Logs
- `SearchEngine.facetedSearch(query)` – Bei Faceted-Search
- `SearchEngine.highlightResults(logs, query)` – Highlighting für Suchergebnisse

**Request-Body:**
```json
{
  "query": "error",
  "category": "Security",
  "log_level": "ERROR",
  "severity": "critical",
  "start_time": "2025-11-28T00:00:00Z",
  "end_time": "2025-11-28T23:59:59Z",
  "limit": 100,
  "offset": 0
}
```

**Response-Format:**
```json
{
  "success": true,
  "data": {
    "logs": [...],
    "total": 1000,
    "limit": 100,
    "offset": 0
  }
}
```

**Details:** Siehe `P8-E-API-SPEC.md` Abschnitt 3.3

---

### **4. GET /api/orchestrator/logs/analytics/trends**

**Datei:** `src/app/api/orchestrator/logs/analytics/trends/route.ts`

**Funktionen:**
- Log-Trends abrufen
- Query-Parameter: `period` (hour, day, week, month), `category`, `start_time`, `end_time`
- RBAC: `logs.view`
- Integration: TrendAnalyzer

**Integration:**
- `LogStorage.getLogs()` – Ruft Logs ab (mit Filter)
- `TrendAnalyzer.analyzeTrends(logs, period)` – Analysiert Trends

**Response-Format:**
```json
{
  "success": true,
  "data": {
    "trends": [
      {
        "metric": "error_rate",
        "period": "day",
        "direction": "increasing",
        "confidence": 0.85,
        "data_points": [...]
      }
    ]
  }
}
```

**Details:** Siehe `P8-E-API-SPEC.md` Abschnitt 3.4

---

### **5. GET /api/orchestrator/logs/analytics/patterns**

**Datei:** `src/app/api/orchestrator/logs/analytics/patterns/route.ts`

**Funktionen:**
- Log-Patterns abrufen
- Query-Parameter: `period`, `category`, `start_time`, `end_time`
- RBAC: `logs.view`
- Integration: PatternDetector

**Integration:**
- `LogStorage.getLogs()` – Ruft Logs ab (mit Filter)
- `PatternDetector.detectPatterns(logs)` – Erkennt Patterns

**Response-Format:**
```json
{
  "success": true,
  "data": {
    "patterns": [
      {
        "type": "frequent",
        "pattern": "ERROR: API timeout",
        "frequency": 15,
        "confidence": 0.9
      }
    ]
  }
}
```

**Details:** Siehe `P8-E-API-SPEC.md` Abschnitt 3.5

---

### **6. GET /api/orchestrator/logs/analytics/anomalies**

**Datei:** `src/app/api/orchestrator/logs/analytics/anomalies/route.ts`

**Funktionen:**
- Log-Anomalien abrufen
- Query-Parameter: `period`, `category`, `start_time`, `end_time`
- RBAC: `logs.view`
- Integration: AnomalyDetector

**Integration:**
- `LogStorage.getLogs()` – Ruft Logs ab (mit Filter)
- `AnomalyDetector.detectAnomalies(logs)` – Erkennt Anomalien

**Response-Format:**
```json
{
  "success": true,
  "data": {
    "anomalies": [
      {
        "type": "statistical",
        "metric": "log_volume",
        "value": 5000,
        "expected": 1000,
        "z_score": 4.5,
        "confidence": 0.95
      }
    ]
  }
}
```

**Details:** Siehe `P8-E-API-SPEC.md` Abschnitt 3.6

---

### **7. POST /api/orchestrator/logs**

**Datei:** `src/app/api/orchestrator/logs/route.ts` (POST-Handler)

**Funktionen:**
- Log erstellen (nur System)
- Request-Body: `RawLog` (siehe `types.ts`)
- Authentifizierung: System-Token (Header: `x-system-token`)
- DSFA-Check: Bei High/Critical-Risk-Logs (über ApprovalManager)
- PD-Filter: Automatisch aktiv (LogPipeline filtert PD)

**System-Token-Prüfung:**
```typescript
const systemToken = request.headers.get("x-system-token");
if (systemToken !== process.env.SYSTEM_INTERNAL_TOKEN) {
  return NextResponse.json(
    { success: false, error: "Nur für System-Interne Verwendung", error_code: "FORBIDDEN" },
    { status: 403 }
  );
}
```

**Referenz:** Siehe `src/app/api/orchestrator/alerts/route.ts` (Zeile 124-133)

**Integration:**
- `LogPipeline.processLog(rawLog)` – Verarbeitet Raw-Log durch Pipeline
- `ApprovalManager.checkApprovalStatus()` – Prüft P7-Approval (bei High/Critical-Risk)

**Request-Body:**
```json
{
  "log_rule_id": "SEC-LOG-001",
  "log_level": "ERROR",
  "category": "Security",
  "severity": "critical",
  "message": "Unauthorized access attempt detected",
  "context": {...},
  "metadata": {...}
}
```

**Response-Format:**
```json
{
  "success": true,
  "data": {
    "id": "log-123",
    "log_rule_id": "SEC-LOG-001",
    "timestamp": "2025-11-28T10:00:00Z"
  }
}
```

**Details:** Siehe `P8-E-API-SPEC.md` Abschnitt 3.7

---

## 🔒 RBAC-INTEGRATION

**Pfad:** `src/lib/rbac-system.ts` (bestehend)

**Berechtigungen:**
- `logs.view` – Für GET-Endpoints (Logs abrufen, Suchen, Analytics)
- System-Token – Für POST /logs (nur System, Header: `x-system-token`)

**Implementierung (Pattern aus bestehenden APIs):**
```typescript
import { AdminAuthService } from "@/lib/admin-auth-service";
import { RBACService } from "@/lib/rbac-system";

// Authentifizierung
const sessionToken =
  request.headers.get("authorization")?.replace("Bearer ", "") ||
  request.cookies.get("adm_session")?.value;

if (!sessionToken) {
  return NextResponse.json(
    { success: false, error: "Nicht authentifiziert", error_code: "UNAUTHORIZED" },
    { status: 401 }
  );
}

const session = await AdminAuthService.validateSession(sessionToken);
if (!session) {
  return NextResponse.json(
    { success: false, error: "Ungültige Session", error_code: "UNAUTHORIZED" },
    { status: 401 }
  );
}

// RBAC-Prüfung
const hasPermission = await RBACService.checkPermission({
  user_id: session.userId.toString(),
  resource: "logs",
  action: "view"
});

if (!hasPermission) {
  return NextResponse.json(
    { success: false, error: "Keine Berechtigung für logs.view", error_code: "FORBIDDEN" },
    { status: 403 }
  );
}
```

**Referenz:** Siehe `src/app/api/orchestrator/alerts/route.ts` (Zeile 39-73) für das korrekte Pattern

---

## 🛡️ DSFA-CHECK-INTEGRATION

**Pfad:** `src/lib/ki-orchestrator/level2/ApprovalManager.ts` (bestehend)

**DSFA-Check:**
- Bei POST /logs: Prüfe, ob Log-Regel High/Critical-Risk ist
- Wenn High/Critical-Risk: Prüfe P7-Approval-Status
- Wenn nicht freigegeben: Blockiere Log-Erstellung

**Implementierung:**
```typescript
import { ApprovalManager } from "@/lib/ki-orchestrator/level2/ApprovalManager";
import { getLogRule } from "@/lib/ki-orchestrator/level2/logs/LogRuleRegistry";

// In POST /logs
const logRule = await getLogRule(rawLog.log_rule_id);
if (logRule?.dsfa_relevance === 'high' || logRule?.dsfa_relevance === 'critical') {
  const approvalManager = new ApprovalManager();
  const approval = await approvalManager.checkApprovalStatus(logRule.id);
  if (!approval.approved) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'DSFA-Freigabe erforderlich', 
        error_code: "DSFA_APPROVAL_REQUIRED",
        details: { log_rule_id: logRule.id, dsfa_relevance: logRule.dsfa_relevance }
      },
      { status: 403 }
    );
  }
}
```

**Referenz:** Siehe `src/app/api/orchestrator/approvals/check/route.ts` für ApprovalManager-Usage

---

## ⚡ RATE-LIMITING

**Regeln:**
- Standard: 100 Requests/Minute
- Admin: 1000 Requests/Minute
- Log Admin: 500 Requests/Minute

**Implementierung:**
- Rate-Limiting-Middleware verwenden (bestehend)
- Fehler-Response bei Überschreitung: `429 Too Many Requests`

---

## 📋 FEHLERBEHANDLUNG

**Standard-Error-Response:**
```json
{
  "success": false,
  "error": "Error message",
  "error_code": "ERROR_CODE",
  "details": {}
}
```

**HTTP-Status-Codes:**
- `200` – Erfolg
- `400` – Bad Request
- `401` – Unauthorized
- `403` – Forbidden
- `404` – Not Found
- `429` – Too Many Requests
- `500` – Internal Server Error

**Implementierung:**
- Try-Catch in allen Endpoints
- Fehler-Logging mit `logger.error()`
- Graceful Error-Responses

---

## ✅ ERFOLGSKRITERIEN

**Phase 5 ist produktionsreif, wenn:**
- ✅ Alle 7 Endpoints funktionieren
- ✅ RBAC funktioniert (logs.view, system.*)
- ✅ DSFA-Check funktioniert (bei POST /logs)
- ✅ PD-Filter aktiv (keine PD in Responses)
- ✅ Rate-Limiting funktioniert
- ✅ Volltext-Suche funktioniert
- ✅ Analytics-Endpoints funktionieren
- ✅ 0 TypeScript-Fehler
- ✅ 0 ESLint-Fehler
- ✅ Fehlerbehandlung korrekt

---

## 📚 REFERENZEN

**Hauptdokumente:**
- `P8-E-API-SPEC.md` – Vollständige API-Spezifikationen
- `P8-E-IMPLEMENTATION-ORDER.md` – Vollständiger Implementierungsauftrag
- `P8-E-HANDBOOK-FOR-BUILDER.md` – Detaillierte Spezifikationen
- `P8-E-PHASE5-AUFTRAG.md` – Detaillierter Phase-5-Auftrag

**Verfügbare Komponenten:**
- `LogStorage` – `src/lib/ki-orchestrator/level2/logs/storage/LogStorage.ts`
- `SearchEngine` – `src/lib/ki-orchestrator/level2/logs/storage/SearchEngine.ts`
- `LogPipeline` – `src/lib/ki-orchestrator/level2/logs/pipeline/LogPipeline.ts`
- `TrendAnalyzer` – `src/lib/ki-orchestrator/level2/logs/analytics/TrendAnalyzer.ts`
- `PatternDetector` – `src/lib/ki-orchestrator/level2/logs/analytics/PatternDetector.ts`
- `AnomalyDetector` – `src/lib/ki-orchestrator/level2/logs/analytics/AnomalyDetector.ts`
- `LogRuleRegistry` – `src/lib/ki-orchestrator/level2/logs/LogRuleRegistry.ts`
- `ApprovalManager` – `src/lib/ki-orchestrator/level2/ApprovalManager.ts`

---

## 🚀 START

**Agent B, bitte beginne mit der Implementierung von Phase 5 (REST-API Endpoints).**

**Reihenfolge:**
1. GET /api/orchestrator/logs (route.ts GET-Handler)
2. GET /api/orchestrator/logs/[id] (route.ts)
3. POST /api/orchestrator/logs/search (route.ts)
4. GET /api/orchestrator/logs/analytics/trends (route.ts)
5. GET /api/orchestrator/logs/analytics/patterns (route.ts)
6. GET /api/orchestrator/logs/analytics/anomalies (route.ts)
7. POST /api/orchestrator/logs (route.ts POST-Handler)

**Nach Abschluss:**
- Agent C prüft Phase 5
- Agent A aktualisiert den Status
- Agent B kann mit Phase 6 (Admin-UI) fortfahren

---

**Viel Erfolg bei der Implementierung! 🚀**

**Agent A (Planner & Coordinator)**  
*Status dokumentiert, Phase 5 bereit für Implementierung*

