# 🎯 DIREKTER AUFTRAG FÜR AGENT B (BUILDER)

## E.1.1: Rechnungen komplettieren

**Version:** 1.0  
**Stand:** 29.11.2025  
**Status:** 🚀 **BEREIT FÜR IMPLEMENTIERUNG**  
**Koordiniert durch:** Agent A (Planner & Coordinator)

---

## 📋 AUFTRAG

**Agent B (Builder), bitte implementiere E.1.1 (Rechnungen komplettieren) gemäß den folgenden Spezifikationen.**

---

## ✅ AUSGANGSLAGE

**Bereits vorhanden:**
- ✅ `/admin/office/invoices` (Liste + Anlegen)
- ✅ API-Endpoints: `GET /api/invoices`, `POST /api/invoices`, `GET /api/invoices/[id]`, `PUT /api/invoices/[id]`, `DELETE /api/invoices/[id]`, `POST /api/invoices/pdf`, `PUT /api/invoices/status`
- ✅ PDF-Generierung (API vorhanden)
- ✅ Hash-Berechnung (GoBD-konform)

**Fehlt noch:**
- ❌ Detailansicht (`/admin/office/invoices/[id]`)
- ❌ Bearbeiten-Formular
- ❌ Löschen-Funktion (mit Bestätigung)
- ❌ Zahlungsstatus ändern (Dropdown)
- ❌ Export (CSV, PDF, Excel)
- ❌ Audit-Logs-Viewer pro Rechnung

---

## 🎯 ZU IMPLEMENTIEREN

### **1. Detailansicht (`/admin/office/invoices/[id]/page.tsx`)**

**Pfad:** `src/app/admin/office/invoices/[id]/page.tsx`

**Funktionen:**
```typescript
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { InvoiceDetailView } from "@/components/admin/invoices/InvoiceDetailView";
import { InvoiceEditForm } from "@/components/admin/invoices/InvoiceEditForm";
import { InvoiceAuditLogs } from "@/components/admin/invoices/InvoiceAuditLogs";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useOfficePermissions } from "@/lib/hooks/useOfficePermissions"; // Falls vorhanden

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const invoiceId = params.id as string;
  
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "audit">("details");
  
  // ... Implementierung
}
```

**Komponenten:**
- `InvoiceDetailView` – Rechnung-Detail anzeigen
- `InvoiceEditForm` – Bearbeiten-Formular (wenn `editMode === true`)
- `InvoiceAuditLogs` – Audit-Logs-Viewer (Tab "Audit")
- `ErrorBanner` – Fehlerbehandlung
- `ConfirmDialog` – Löschen-Bestätigung

**UI-Elemente:**
- Breadcrumbs: "Admin > Office & Finanzen > Rechnungen > [Rechnungsnummer]"
- Header: Rechnungsnummer, Status-Badge, Bearbeiten-Button, Löschen-Button, Export-Buttons (CSV, PDF, Excel)
- Tabs: "Details", "Audit-Logs"
- Detail-Ansicht: Rechnungsdaten (Kunde, Datum, Betrag, Status, etc.)
- Zahlungsstatus ändern: Dropdown (draft, sent, paid, storno)
- Export-Buttons: CSV, PDF, Excel

**RBAC:** `office.manage` (Bearbeiten, Löschen), `office.view` (Anzeigen)

**Dark Mode:** ✅ Vollständig unterstützt

**Referenzen:**
- `src/app/admin/orchestrator/alerts/[id]/page.tsx` (Pattern für Detail-Seite)
- `src/app/api/invoices/[id]/route.ts` (API-Endpoint)

---

### **2. Bearbeiten-Formular (`InvoiceEditForm.tsx`)**

**Pfad:** `src/components/admin/invoices/InvoiceEditForm.tsx`

**Props:**
```typescript
interface InvoiceEditFormProps {
  invoice: Invoice;
  onSave: (invoice: Invoice) => Promise<void>;
  onCancel: () => void;
}
```

**Funktionen:**
- Formular für Rechnung bearbeiten
- Validierung (Pflichtfelder, Datum, Betrag)
- Speichern-Button (ruft `PUT /api/invoices/[id]` auf)
- Abbrechen-Button

**UI-Elemente:**
- Formular-Felder: Kunde, Datum, Betrag, Status, etc.
- Validierung (Fehler-Anzeige)
- Speichern-Button, Abbrechen-Button

**Dark Mode:** ✅ Vollständig unterstützt

**Referenzen:**
- `src/components/admin/invoices/InvoiceForm.tsx` (falls vorhanden, als Basis)
- `src/app/api/invoices/[id]/route.ts` (PUT-Endpoint)

---

### **3. Löschen-Funktion**

**Integration in:** `InvoiceDetailPage`

**Funktionen:**
- Löschen-Button (nur bei `office.manage` Berechtigung)
- Bestätigungs-Dialog (`ConfirmDialog`)
- Löschen-API-Call (`DELETE /api/invoices/[id]`)
- Nach Löschen: Redirect zu `/admin/office/invoices`

**UI-Elemente:**
- Löschen-Button (rot, mit Warnung)
- Bestätigungs-Dialog: "Möchten Sie diese Rechnung wirklich löschen?"

**RBAC:** `office.manage` (nur bei Berechtigung)

**Referenzen:**
- `src/components/ui/ConfirmDialog.tsx`
- `src/app/api/invoices/[id]/route.ts` (DELETE-Endpoint)

---

### **4. Zahlungsstatus ändern**

**Integration in:** `InvoiceDetailPage` oder `InvoiceDetailView`

**Funktionen:**
- Dropdown für Status (draft, sent, paid, storno)
- Status-Änderung (`PUT /api/invoices/status`)
- Status-Badge (farbcodiert)

**UI-Elemente:**
- Dropdown (Select) für Status
- Status-Badge (draft=grau, sent=gelb, paid=grün, storno=rot)
- Speichern-Button (wenn Status geändert)

**RBAC:** `office.manage` (nur bei Berechtigung)

**Referenzen:**
- `src/components/ui/StatusBadge.tsx`
- `src/app/api/invoices/status/route.ts` (PUT-Endpoint)

---

### **5. Export-Funktionen**

**Integration in:** `InvoiceDetailPage` (Header)

**Funktionen:**
- CSV-Export (Button)
- PDF-Export (Button, bereits vorhanden)
- Excel-Export (Button)

**CSV-Export:**
- Rechnungsdaten als CSV
- API-Endpoint: `GET /api/invoices/[id]?format=csv` (neu zu erstellen oder Client-seitig)

**PDF-Export:**
- Bereits vorhanden: `POST /api/invoices/pdf`
- Button hinzufügen in Detail-Ansicht

**Excel-Export:**
- Rechnungsdaten als Excel
- API-Endpoint: `GET /api/invoices/[id]?format=excel` (neu zu erstellen oder Client-seitig)

**UI-Elemente:**
- Export-Buttons (CSV, PDF, Excel) im Header
- Download startet automatisch

**Referenzen:**
- `src/app/api/invoices/pdf/route.ts` (PDF-Export)
- Bestehende Export-Patterns (falls vorhanden)

---

### **6. Audit-Logs-Viewer (`InvoiceAuditLogs.tsx`)**

**Pfad:** `src/components/admin/invoices/InvoiceAuditLogs.tsx`

**Props:**
```typescript
interface InvoiceAuditLogsProps {
  invoiceId: string;
}
```

**Funktionen:**
- Audit-Logs pro Rechnung anzeigen
- Filter (Zeitraum, Aktion, Benutzer)
- Export (CSV, PDF)

**UI-Elemente:**
- Audit-Logs-Liste (Tabelle)
- Filter-Bar (Zeitraum, Aktion, Benutzer)
- Export-Buttons (CSV, PDF)
- Spalten: Zeitstempel, Aktion, Benutzer, Details

**API:**
- `GET /api/audit-logs?resource_type=invoice&resource_id=[invoiceId]` (falls vorhanden)
- Oder: `GET /api/invoices/[id]/audit-logs` (neu zu erstellen)

**Dark Mode:** ✅ Vollständig unterstützt

**Referenzen:**
- `src/app/admin/audit-logs/page.tsx` (Pattern für Audit-Logs-Viewer)

---

## ✅ ERFOLGSKRITERIEN

**E.1.1 ist produktionsreif, wenn:**
- ✅ Detailansicht funktioniert (`/admin/office/invoices/[id]`)
- ✅ Bearbeiten-Formular funktioniert
- ✅ Löschen-Funktion funktioniert (mit Bestätigung)
- ✅ Zahlungsstatus ändern funktioniert
- ✅ Export funktioniert (CSV, PDF, Excel)
- ✅ Audit-Logs-Viewer funktioniert
- ✅ RBAC korrekt implementiert (`office.manage`, `office.view`)
- ✅ Fehlerbehandlung korrekt (ErrorBanner, ConfirmDialog)
- ✅ Dark Mode vollständig unterstützt
- ✅ 0 TypeScript-Fehler
- ✅ 0 ESLint-Fehler
- ✅ Enterprise++ Standards eingehalten

---

## 📚 REFERENZEN

**Hauptdokumente:**
- `E.1-HANDBOOK-FOR-BUILDER.md` E.1.1 – Vollständiger Implementierungsauftrag
- `E.1-OVERVIEW.md` – Gesamtübersicht
- `E.1-STATUS-ANALYSE.md` – Status-Analyse

**Bestehende APIs:**
- `GET /api/invoices` – Rechnungen-Liste
- `POST /api/invoices` – Rechnung erstellen
- `GET /api/invoices/[id]` – Rechnung-Detail
- `PUT /api/invoices/[id]` – Rechnung bearbeiten
- `DELETE /api/invoices/[id]` – Rechnung löschen
- `POST /api/invoices/pdf` – PDF-Generierung
- `PUT /api/invoices/status` – Status ändern

**Bestehende Seiten (Patterns):**
- `src/app/admin/orchestrator/alerts/[id]/page.tsx` (Detail-Seite Pattern)
- `src/app/admin/orchestrator/incidents/[id]/page.tsx` (Detail-Seite Pattern, falls vorhanden)

**Bestehende Komponenten:**
- `src/components/ui/ErrorBanner.tsx` – Fehlerbehandlung
- `src/components/ui/WarningBanner.tsx` – Warnungen
- `src/components/ui/StatusBadge.tsx` – Status-Badges
- `src/components/ui/ConfirmDialog.tsx` – Bestätigungs-Dialog

**Bestehende Rechnungen-UI:**
- `src/app/admin/office/invoices/page.tsx` (Liste + Anlegen)

---

## 🚀 START

**Agent B, bitte beginne mit der Implementierung von E.1.1 (Rechnungen komplettieren).**

**Reihenfolge:**
1. Detailansicht implementieren (`/admin/office/invoices/[id]/page.tsx`)
2. Bearbeiten-Formular implementieren (`InvoiceEditForm.tsx`)
3. Löschen-Funktion implementieren (mit Bestätigung)
4. Zahlungsstatus ändern implementieren (Dropdown)
5. Export-Funktionen implementieren (CSV, PDF, Excel)
6. Audit-Logs-Viewer implementieren (`InvoiceAuditLogs.tsx`)

**Nach Abschluss:**
- Agent C prüft E.1.1 (Code-Review, Quality-Assurance, DSGVO/DSFA-Konformität)
- Agent A aktualisiert Status und bereitet E.1.2 vor

---

**Viel Erfolg bei der Implementierung! 🚀**

**Agent A (Planner & Coordinator)**  
*Status dokumentiert, E.1.1 bereit für Implementierung*



