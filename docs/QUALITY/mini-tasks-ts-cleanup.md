# 📋 TypeScript Mini-Tasks (Enterprise++ Cleanup)

> **Stand:** 2025-12-07  
> **Status:** GEPLANT  
> **Vorgehen:** Kontrollierte Mini-Tasks statt Bulk-Fix

---

## 🎯 Übersicht

| Task-ID | Bereich | Fehler | Status |
|---------|---------|--------|--------|
| KI-ORCH-TS-01 | MySQL2 QueryResult im ki-orchestrator | 7 | ⏳ Geplant |
| FIN-TS-01 | Invoice/Policy Typ-Konsolidierung | 4 | ⏳ Geplant |
| UI-TS-01 | Recharts Tooltip/Props + UI-Komponenten | 11 | ⏳ Geplant |
| MISC-TS-01 | Sonstige Fehler | 4 | ⏳ Geplant |

---

## 📦 KI-ORCH-TS-01: MySQL2 QueryResult Typen

### Ziel
Die TypeScript-Fehler im ki-orchestrator beheben, die durch MySQL2 `QueryResult` Constraint verursacht werden.

### Betroffene Dateien
```
src/lib/ki-orchestrator/level2/alerts/AlertEngine.ts (3 Fehler)
src/lib/ki-orchestrator/level2/incidents/IncidentManager.ts (4 Fehler)
src/app/api/orchestrator/incidents/[id]/route.ts (1 Fehler)
```

### Problem
`connection.execute<T>()` erwartet `T extends QueryResult`, aber wir übergeben `Alert[]`, `Incident[]`, etc.

### Lösung
1. Import von `RowDataPacket` aus `mysql2/promise`
2. Type-Assertion verwenden: `connection.execute<RowDataPacket[]>(...)`
3. Cast zu eigenem Typ: `const alerts = rows as Alert[]`

### Akzeptanzkriterien
- [ ] 0 TS-Fehler in den betroffenen Dateien
- [ ] ki-orchestrator funktioniert weiterhin
- [ ] Audit-Status: OK

### Nach Abschluss
```
pnpm tsc --noEmit | grep "AlertEngine\|IncidentManager"
→ 0 Fehler erwartet
```

---

## 📦 FIN-TS-01: Invoice/Policy Typ-Konsolidierung

### Ziel
Die Duplicate-Type-Fehler für `Invoice` und `Policy` beheben.

### Betroffene Dateien
```
src/app/admin/office/invoices/[id]/page.tsx (2 Fehler)
src/app/admin/policies/page.tsx (1 Fehler)
src/app/api/admin/invoices/[id]/pdf/route.ts (1 Fehler)
```

### Problem
Zwei verschiedene `Invoice`-Typen und zwei verschiedene `Policy`-Typen existieren im Projekt.

### Lösung
1. **Analyse:** Welcher Typ ist die "Single Source of Truth"?
2. **Konsolidierung:** Nur EINEN Typ verwenden
3. **Re-Export:** Falls nötig, aus zentraler Stelle re-exportieren

### Single Source of Truth (zu ermitteln)
- `Invoice`: `src/lib/customer/invoice-service.ts` ODER `src/types/...`
- `Policy`: `src/lib/...` ODER `src/types/...`

### Akzeptanzkriterien
- [ ] 0 TS-Fehler in den betroffenen Dateien
- [ ] Dokumentation: Welcher Typ ist SSOT
- [ ] Keine Breaking Changes in der API

---

## 📦 UI-TS-01: Recharts Tooltip/Props + UI-Komponenten

### Ziel
Die TypeScript-Fehler in UI-Komponenten beheben (Recharts, Props-Inkompatibilitäten).

### Betroffene Dateien
```
src/components/orchestrator/uoc/APIPerformanceChart.tsx (1 Fehler)
src/components/orchestrator/uoc/UnifiedChart.tsx (3 Fehler)
src/components/orchestrator/uoc/LiveUpdateToastContainer.tsx (1 Fehler)
src/components/Core/Hauptbereiche.tsx (1 Fehler)
src/components/layout/MainLayout.tsx (1 Fehler)
src/components/navigation/Sprachumschalter.tsx (1 Fehler)
src/components/ui/Heading.tsx (2 Fehler)
src/components/admin/dashboard/DashboardConfig.tsx (2 Fehler)
```

### Problem
- Recharts Tooltip `contentStyle` Props sind inkompatibel
- UI-Komponenten-Props stimmen nicht mit Interfaces überein
- Komplexe Union-Types in Heading.tsx

### Lösung
1. **Recharts:** Type-Assertion `as any` für Tooltip-Props (Bibliotheks-Inkompatibilität)
2. **UI-Komponenten:** Props-Interfaces erweitern oder anpassen
3. **Heading.tsx:** Typ vereinfachen oder `@ts-expect-error` mit Kommentar

### Akzeptanzkriterien
- [ ] 0 TS-Fehler in den betroffenen Dateien
- [ ] Keine Layout-Änderungen
- [ ] Keine Logik-Änderungen

---

## 📦 MISC-TS-01: Sonstige Fehler

### Ziel
Verbleibende Fehler, die nicht in die anderen Kategorien passen.

### Betroffene Dateien
```
src/app/admin/audit-logs/page.tsx (1 Fehler) - FilterState
```

### Lösung
Pro Fehler einzeln analysieren und fixen.

---

## 📊 Fortschritts-Tracking

Nach jedem Mini-Task wird hier dokumentiert:

| Task | Vorher | Nachher | Status | Datum |
|------|--------|---------|--------|-------|
| KI-ORCH-TS-01 | 8 | **0** | ✅ | 2025-12-07 |
| FIN-TS-01 | 4 | **0** | ✅ | 2025-12-07 |
| UI-TS-01 | 12 | **0** | ✅ | 2025-12-07 |
| MISC-TS-01 | 2 | **0** | ✅ | 2025-12-07 |

### UI-TS-01 Änderungen (2025-12-07)
- `APIPerformanceChart.tsx`: `className` → `wrapperClassName` für Recharts Tooltip
- `UnifiedChart.tsx`: 3x `className` → `wrapperClassName` für Recharts Tooltip
- `Heading.tsx`: HeadingTag Union-Type statt keyof JSX.IntrinsicElements
- `DashboardConfig.tsx`: `role_name` zu Interface, Widget-Callback korrigiert
- `SectionWrapper.tsx`: `divider` Prop hinzugefügt
- `Footer.tsx` (Core): `showFooter` Prop hinzugefügt
- `Button.tsx` (Features): `variante`, `groesse` Props + `text` Variante
- `Button.tsx` (ui): `variante`, `groesse` Props (deprecated)
- `LiveUpdateToastContainer.tsx`: `type` → `eventType`
- **Funktion unverändert ✅**

### MISC-TS-01 Änderungen (2025-12-07)
- `audit-logs/page.tsx`: FilterState → Record<string, string> Cast
- `IncidentManager.ts`: `||`/`??` Mix mit Klammern korrigiert
- **Funktion unverändert ✅**

### KI-ORCH-TS-01 Änderungen (2025-12-07)
- `AlertEngine.ts`: RowDataPacket Import + 3x execute-Typen korrigiert
- `IncidentManager.ts`: RowDataPacket Import + 4x execute-Typen korrigiert
- `incidents/[id]/route.ts`: RowDataPacket Import + execute-Typ korrigiert
- **Muster:** `execute<CustomType[]>` → `execute<RowDataPacket[]>` + Cast
- **Orchestrator-Funktionalität unverändert ✅**
- **CORE-01 Schutz eingehalten ✅**

### FIN-TS-01 Änderungen (2025-12-07)
- **NEU:** `src/lib/finance/types.ts` erstellt (Single Source of Truth)
- Zentrale Types: `AdminInvoice`, `InvoiceItem`, `AdminPolicy`, `AdminPolicyInput`
- `InvoiceDetailView.tsx`: Import aus finance/types
- `InvoiceEditForm.tsx`: Import aus finance/types
- `invoices/[id]/page.tsx`: Import aus finance/types
- `policies/page.tsx`: Import aus finance/types
- `PolicyEditor.tsx`: Import aus finance/types (AdminPolicyInput)
- `invoices/[id]/pdf/route.ts`: Customer-Typ explizit gecastet
- **Keine fachlichen Änderungen ✅**
- **Keine Felder umbenannt/entfernt ✅**
- **PDF-Generierung unverändert ✅**
- **CORE-01 Schutz eingehalten ✅**

---

**Erstellt:** 2025-12-07  
**Vorgehen:** Siemens/IBM/SAP Enterprise++ Standard

