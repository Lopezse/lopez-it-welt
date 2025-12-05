# KW-REGELN

## Kalenderwochen-System (KW) – Regeln & Standards

### Lopez IT Welt – Enterprise++ Standard

**Version:** 1.0  
**Stand:** 27.11.2025  
**Status:** ✅ **OFFIZIELL AKTIV**

---

## 1. Einleitung

Dieses Dokument definiert alle **Regeln und Standards** für das Kalenderwochen-System (KW) in Lopez IT Welt.

**Ziel:**
- Konsistente Anwendung des KW-Systems
- Klare Struktur für alle Beteiligten
- Enterprise++ Standards einhalten

---

## 2. Grundregeln

### **2.1 KW = Sprint**

**Regel:**
- **1 Kalenderwoche (KW) = 1 Sprint**
- **Sprintnummer = KW-Nummer**
- **Sprintstart = Montag (00:00 Uhr)**
- **Sprintende = Sonntag (23:59 Uhr)**

**Beispiel:**
- Sprint 48 = KW 48 (25.11.2025 – 01.12.2025)
- Sprint 49 = KW 49 (02.12.2025 – 08.12.2025)

---

### **2.2 Dokumentations-Format**

**Standard-Format:**
```
KW XX – Datum von DD.MM.YYYY bis DD.MM.YYYY
```

**Pflicht:**
- Alle Dokumente müssen das KW-Format im Titel/Header enthalten
- Datumsspanne muss immer angegeben werden
- Format: `DD.MM.YYYY` (deutsches Format)

**Beispiele:**
- `KW 48 – 25.11.2025 bis 01.12.2025`
- `KW 49 – 02.12.2025 bis 08.12.2025`

---

## 3. Wochenablauf-Regeln

### **3.1 Montag = Wochenstart / Sprintstart**

**Aktivitäten:**
- ✅ Sprint-Planung durchführen
- ✅ Ziele für die KW definieren
- ✅ Aufgaben verteilen
- ✅ Prioritäten setzen
- ✅ Sprint-Dokumentation erstellen (`docs/KW-SYSTEM/sprints/KW-XX.md`)

**Verantwortlich:**
- **Agent A (Planner):** Sprint-Planung, Ziele definieren
- **Agent B (Builder):** Aufgaben übernehmen, Schätzungen abgeben

---

### **3.2 Dienstag bis Donnerstag = Entwicklung**

**Aktivitäten:**
- ✅ Implementierung
- ✅ Fortschritt dokumentieren
- ✅ Zeitlog führen (`docs/TIMELOG/KW-XX.md`)
- ✅ Status aktualisieren (`docs/STATUS/KW-XX.md`)

**Verantwortlich:**
- **Agent B (Builder):** Implementierung
- **Agent A (Planner):** Planungsanpassungen bei Bedarf

---

### **3.3 Freitag = Wochenrückblick (LinkedIn)**

**Aktivitäten:**
- ✅ Sprint-Review durchführen
- ✅ IST-Ergebnis dokumentieren
- ✅ LinkedIn-Review-Post erstellen (`docs/LINKEDIN/KW-XX-REVIEW.md`)
- ✅ Abnahme durch Agent C vorbereiten

**Verantwortlich:**
- **Agent A (Planner):** Review-Dokumentation
- **Agent B (Builder):** IST-Ergebnis dokumentieren
- **Agent C (Reviewer):** Abnahme durchführen

---

## 4. Sprint-Struktur-Regeln

### **4.1 Jeder Sprint (KW) muss enthalten:**

1. **Ziele**
   - Was soll in dieser KW erreicht werden?
   - Welche Features/Module stehen im Fokus?
   - Welche Meilensteine werden angestrebt?

2. **Aufgaben**
   - Konkrete ToDo-Liste
   - Verantwortlichkeiten (Agent A/B/C)
   - Prioritäten (P1 = kritisch, P2 = hoch, P3 = mittel, P4 = niedrig)
   - Schätzungen (Stunden/Tage)

3. **IST-Ergebnis**
   - Was wurde tatsächlich erreicht?
   - Abweichungen dokumentieren (geplant vs. IST)
   - Lessons Learned
   - Blockierungen dokumentieren

4. **Abnahme (Agent C)**
   - Code-Review durchgeführt?
   - Quality-Assurance bestanden?
   - Freigabe für nächste KW?
   - Offene Punkte?

---

### **4.2 Sprint-Dokumentation**

**Pfad:** `docs/KW-SYSTEM/sprints/KW-XX.md`

**Struktur:**
```markdown
# KW XX – Datum von DD.MM.YYYY bis DD.MM.YYYY

## 1. Ziele
- ...

## 2. Aufgaben
- ...

## 3. IST-Ergebnis
- ...

## 4. Abnahme (Agent C)
- ...
```

---

## 5. Dokumentations-Regeln

### **5.1 STATUS.md**

**Regel:**
- Wochenblöcke einfügen
- Format: `## KW XX – Datum von ... bis ...`
- Pro KW: Ziele, Aufgaben, IST-Ergebnis, Abnahme

**Pflicht:**
- Jede KW muss einen eigenen Block haben
- Block muss vor KW-Start (Montag) erstellt werden
- Block muss nach KW-Ende (Sonntag) aktualisiert werden

---

### **5.2 TIME_LOG.md**

**Regel:**
- Wochenabschnitte einfügen
- Format: `## KW XX – Datum von ... bis ...`
- Pro KW: Zeitaufwand, Aktivitäten, Fortschritt

**Pflicht:**
- Tägliche Einträge (Mo-Fr)
- Zeitaufwand dokumentieren
- Aktivitäten beschreiben

---

### **5.3 CHANGELOG.md**

**Regel:**
- Einträge mit KW ergänzen
- Format: `[KW XX] Beschreibung`
- KW-Filter ermöglichen

**Pflicht:**
- Jeder Eintrag muss KW enthalten
- Format: `[KW XX] YYYY-MM-DD: Beschreibung`

---

## 6. LinkedIn-Review-Regeln

### **6.1 Freitag = Wochenrückblick**

**Regel:**
- Jeden Freitag: LinkedIn-Review-Post erstellen
- Template verwenden: `docs/KW-SYSTEM/templates/LINKEDIN-REVIEW-TEMPLATE.md`
- Datei speichern: `docs/LINKEDIN/KW-XX-REVIEW.md`

**Inhalt:**
- Was wurde erreicht?
- Highlights der Woche
- Herausforderungen
- Ausblick auf nächste KW

---

## 7. Abnahme-Regeln (Agent C)

### **7.1 Abnahme-Kriterien**

**Pflicht:**
- Code-Review durchgeführt
- Quality-Assurance bestanden
- Tests erfolgreich
- Dokumentation vollständig
- Keine kritischen Fehler

**Ergebnis:**
- ✅ **Freigegeben** → Nächste KW kann starten
- ⚠️ **Mit Auflagen** → Auflagen müssen erfüllt werden
- ❌ **Nicht freigegeben** → KW muss wiederholt werden

---

### **7.2 Abnahme-Dokumentation**

**Pfad:** `docs/KW-SYSTEM/sprints/KW-XX.md` (Abschnitt 4)

**Inhalt:**
- Abnahme-Status
- Gefundene Probleme
- Auflagen (falls vorhanden)
- Freigabe-Datum
- Signatur (Agent C)

---

## 8. Versionskontrolle

**Aktuelle Version:** v1.0 (27.11.2025)

**Änderungshistorie:**
- v1.0 (27.11.2025): Erste Version – KW-Regeln definiert

---

*Generated by Enterprise++ KW-System*  
*Last updated: 2025-11-27*  
*Status: ✅ OFFIZIELL AKTIV*




