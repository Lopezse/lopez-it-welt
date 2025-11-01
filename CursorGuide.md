# 🎯 CursorGuide.md – KI-Nutzungsregel

## 🚨 **VERBINDLICHE REGELN FÜR ALLE KI-SYSTEME (Cursor, Copilot, etc.)**

### ⚠️ **AKTUELLER MODUS: STRICT ENFORCEMENT**

- **Status:** Null-Toleranz aktiviert
- **Phase:** Enterprise++ Qualitätskontrolle
- **Ansprechpartner:** Ramiro Lopez Rodriguez
- **Datum:** 2025-01-19

## 🚨 **VERHALTENSKONTROLLE FÜR KI-SYSTEME**

### 🔁 **Regelkreis bei Regelverletzung**

**Wenn eine Regel oder Datei ignoriert wird (z. B. START.md, PROJECT.md, QualityController.md), MUSS die KI:**

#### 1. **Den Fehler benennen:**

- Welche Regel wurde gebrochen?
- Welche Datei wurde ignoriert?

#### 2. **Sofort Rückmeldung geben:**

- Warum wurde diese Regel verletzt?
- Welche Auswirkungen hat das?

#### 3. **Vorschläge zur Selbstkorrektur machen:**

- Was ist notwendig, um das zu reparieren?
- Welcher Commit ist betroffen?

#### 4. **„Self-Repair" anbieten:**

- Fehlerhafte Änderungen zurücknehmen
- Korrektur nach Standard durchführen

#### 5. **Eintrag in STATUS.md:**

- `⚠️ Regelverletzung erkannt – korrigiert am [Datum]`

### 🛡️ **Verpflichtende Maßnahmen bei Regelverstößen:**

**Jede KI MUSS bei Regelverletzungen:**

1. **✅ Sofort stoppen** - Keine weiteren Aktionen
2. **✅ Fehler dokumentieren** - In STATUS.md eintragen
3. **✅ Self-Repair anbieten** - Korrekturvorschläge machen
4. **✅ Freigabe einholen** - Explizite Genehmigung warten
5. **✅ Compliance prüfen** - Vor weiteren Aktionen

---

## 📋 **PFLICHT-CHECKLISTE VOR JEDER AKTION**

### ✅ **1. Dokumentation laden (OBLIGATORISCH)**

```bash
# Diese Dateien MÜSSEN vor jeder Änderung geladen werden:
- START.md
- PROJECT.md
- QualityController.md
- STATUS.md
- CursorGuide.md (diese Datei)
```

### ✅ **2. Regelprüfung (OBLIGATORISCH)**

```bash
# Vor jeder Codeausgabe MUSS geprüft werden:
- strict=true in QualityController.md
- STATUS.md Aktualität (max 2 Stunden alt)
- Geschützte Pfade nicht modifiziert
- Alle Pflichtdateien vorhanden
```

### ✅ **3. Status-Update (OBLIGATORISCH)**

```bash
# Jede Änderung MUSS in STATUS.md dokumentiert werden:
- Zeitstempel
- Art der Änderung
- Betroffene Dateien
- Compliance-Status
```

---

## 🚫 **VERBOTENE AKTIONEN**

### ❌ **Geschützte Pfade (NIEMALS MODIFIZIEREN)**

```
- src/components/layout/*
- src/app/layout.tsx
- tailwind.config.ts
- next.config.js
- package.json (ohne explizite Freigabe)
```

### ❌ **Automatische Änderungen (VERBOTEN)**

```
- Keine automatische Dateierstellung ohne Freigabe
- Keine automatische Konfigurationsänderungen
- Keine automatischen Dependency-Updates
- Keine automatischen Code-Formatierungen
```

### ❌ **Regel-Ignorierung (VERBOTEN)**

```
- Keine Änderungen ohne Dokumentationsprüfung
- Keine Änderungen ohne STATUS.md Update
- Keine Änderungen ohne explizite Freigabe
- Keine Eigeninterpretation der Anforderungen
```

---

## ✅ **ERLAUBTE AKTIONEN**

### ✅ **Nach vollständiger Prüfung erlaubt:**

```
- Code-Änderungen in freigegebenen Bereichen
- Dokumentations-Updates
- Test-Implementierungen
- Bug-Fixes (nach Freigabe)
- Feature-Implementierungen (nach Freigabe)
```

---

## 🔄 **WORKFLOW-PROZESS**

### **Schritt 1: Dokumentation laden**

```bash
# Lade alle Pflichtdateien
node scripts/enforce-rules.js enforce
```

### **Schritt 2: Regelprüfung**

```bash
# Prüfe Compliance
- Alle Pflichtdateien vorhanden?
- STATUS.md aktuell?
- Geschützte Pfade unverändert?
- QualityController.md konform?
```

### **Schritt 3: Freigabe einholen**

```bash
# Warte auf explizite Freigabe
- Beschreibe geplante Änderungen
- Zeige betroffene Dateien
- Warte auf "GO" vom Nutzer
```

### **Schritt 4: Implementierung**

```bash
# Führe Änderungen durch
- Nur freigegebene Bereiche
- Dokumentation in STATUS.md
- Qualitätsstandards einhalten
```

### **Schritt 5: Status-Update**

```bash
# Aktualisiere STATUS.md
- Zeitstempel hinzufügen
- Änderungen dokumentieren
- Compliance-Status prüfen
```

---

## 🚨 **REGELVERLETZUNGEN**

### **Bei jeder Regelverletzung MUSS:**

1. **Fehler benennen:** Welche Regel wurde gebrochen?
2. **Grund angeben:** Warum wurde die Regel verletzt?
3. **Auswirkungen beschreiben:** Was sind die Konsequenzen?
4. **Korrektur vorschlagen:** Wie kann das repariert werden?
5. **STATUS.md aktualisieren:** Verletzung dokumentieren

### **Automatische Korrekturen:**

```bash
# Bei Regelverletzungen automatisch ausführen:
node scripts/enforce-rules.js auto-correct
```

---

## 📊 **QUALITÄTSSTANDARDS**

### **Code-Qualität:**

- TypeScript Strict Mode
- ESLint Regeln
- Test Coverage > 80%
- Prettier Formatierung

### **Performance:**

- Lighthouse Score > 90
- First Contentful Paint < 1.5s
- Time to Interactive < 3.5s

### **Sicherheit:**

- Keine bekannten Vulnerabilities
- Sichere Dependencies
- Verschlüsselte Kommunikation

### **Barrierefreiheit:**

- WCAG 2.1 AA Konformität
- Screen Reader Kompatibilität
- Keyboard Navigation

---

## 💬 **CHAT-REGELN**

### **Verbindliche Regeln für alle Chats:**

1. Änderungen nur nach vollständiger Prüfung gegen QualityController.md
2. Keine automatische Änderung ohne explizite Freigabe
3. Jeder Commit wird in STATUS.md dokumentiert
4. strict=true, autoFix=false bleibt aktiv
5. Keine Eigeninterpretation - 1:1 Umsetzung der Dokumentation

### **Gültigkeit:**

- Dauerhaft
- Ohne Ausnahme
- Für alle Chats verbindlich

### **Prozess:**

1. Analyse der Anforderung
2. Prüfung gegen QualityController.md
3. Dokumentation in STATUS.md
4. Warten auf explizite Freigabe
5. Umsetzung nach Freigabe

---

## 🔧 **AUTOMATISIERUNG**

### **Pre-commit Hook:**

```bash
# Automatisch bei jedem Commit
node scripts/enforce-rules.js pre-commit
```

### **Post-commit Hook:**

```bash
# Automatisch nach jedem Commit
node scripts/enforce-rules.js post-commit
```

### **Manuelle Prüfung:**

```bash
# Bei Bedarf manuell ausführen
node scripts/enforce-rules.js enforce
```

---

## 📝 **STATUS-TRACKING**

### **STATUS.md Pflicht-Einträge:**

- Jede Änderung dokumentieren
- Zeitstempel hinzufügen
- Compliance-Status prüfen
- Nächste Schritte definieren

### **Automatische Updates:**

- Regelverletzungen automatisch eintragen
- Compliance-Status automatisch prüfen
- Verstöße automatisch dokumentieren

---

## 🎯 **ZIELSETZUNG**

### **Enterprise++ Qualität:**

- Null-Toleranz bei Regelverletzungen
- Automatische Qualitätskontrolle
- Vollständige Dokumentation
- Professionelle Standards

### **Nachhaltigkeit:**

- Langfristige Qualitätssicherung
- Automatisierte Prozesse
- Skalierbare Strukturen
- Zertifizierungsreife

---

## 📞 **KONTAKT**

### **Ansprechpartner:**

- **Name:** Ramiro Lopez Rodriguez
- **Projekt:** Lopez IT Welt
- **Phase:** Enterprise++ Qualitätskontrolle
- **Status:** Strict Enforcement aktiv

### **Bei Fragen:**

- Erst alle Dokumentation prüfen
- Dann explizite Freigabe einholen
- Immer STATUS.md aktualisieren
- Qualitätsstandards einhalten

---

## ✅ **BESTÄTIGUNG**

**Ich habe alle Regeln gelesen und verstanden:**

- [ ] Alle Pflichtdateien werden vor jeder Änderung geladen
- [ ] Regelprüfung wird vor jeder Aktion durchgeführt
- [ ] STATUS.md wird bei jeder Änderung aktualisiert
- [ ] Geschützte Pfade werden niemals modifiziert
- [ ] Explizite Freigabe wird vor jeder Änderung eingeholt
- [ ] Qualitätsstandards werden eingehalten
- [ ] Automatische Korrekturen werden bei Regelverletzungen ausgeführt

**Datum:** 2025-01-19
**Status:** ✅ AKTIV UND VERBINDLICH
