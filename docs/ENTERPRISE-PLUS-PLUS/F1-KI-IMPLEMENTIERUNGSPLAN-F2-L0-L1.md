# F1-KI-IMPLEMENTIERUNGSPLAN: F.2 + L0/L1

## Konkreter Implementierungsplan für AiProvider (F.2) und LLaMA (L0/L1)

**Version:** 1.0  
**Stand:** 2025-11-29  
**Status:** 🚀 **BEREIT FÜR IMPLEMENTIERUNG**  
**Methode:** Schrittweise, testgetrieben, ohne Breaking Changes  
**Enterprise++ Standard:** IBM/SAP/Siemens-Niveau

---

## 📋 EXECUTIVE SUMMARY

Dieser Plan definiert die **konkrete, schrittweise Implementierung** von:
- **F.2:** AiProvider-System (allgemeines Interface, Mock, Adapter)
- **L0:** LLaMA lokal testen (Windows-PC, Ollama)
- **L1:** LLaMA auf Netcup-Server (optional)

**Kernprinzipien:**
- ✅ **Keine Breaking Changes:** Bestehender Code bleibt unverändert
- ✅ **Testgetrieben:** Tests zuerst, dann Implementierung
- ✅ **Schrittweise:** Jeder Schritt ist testbar und rückgängig machbar
- ✅ **Budgetfreundlich:** 0 € zusätzliche Kosten

---

## PHASE F.2: AI-PROVIDER-SYSTEM

### **F.2.1: Basis-Interface finalisieren (1 Tag)**

**Ziel:** `AiProvider`-Interface produktionsreif machen

**Schritte:**
1. ✅ `src/lib/ai/core/ai-provider.ts` prüfen
   - Interface ist bereits erstellt
   - `AiRequestContext` ist bereits hinzugefügt
   - ✅ Fertig

2. ✅ Types exportieren
   - `AiProvider`, `AiOptions`, `AiRequestContext`
   - `VisionAiProvider`, `EmbeddingAiProvider`
   - `ProviderError`

3. ✅ Dokumentation aktualisieren
   - JSDoc-Kommentare prüfen
   - Beispiele ergänzen

**Erfolgskriterien:**
- ✅ Interface ist vollständig dokumentiert
- ✅ Alle Types sind exportiert
- ✅ Keine Linter-Fehler

---

### **F.2.2: Mock-Provider aktivieren (1 Tag)**

**Ziel:** Mock-Provider für Tests nutzbar machen

**Schritte:**
1. ✅ `src/lib/ai/providers/mock-ai-provider.draft.ts` → `.ts` umbenennen
   - Datei umbenennen (`.draft.ts` entfernen)
   - Status-Kommentar aktualisieren

2. ✅ Factory-Integration
   - `src/lib/ai/core/ai-provider-factory.ts` erstellen
   - Mock-Provider in Factory integrieren

3. ✅ Tests schreiben
   - Unit-Tests für Mock-Provider
   - Integrationstests

**Erfolgskriterien:**
- ✅ Mock-Provider kann über Factory erstellt werden
- ✅ Tests bestehen
- ✅ Mock-Provider gibt erwartete Antworten zurück

**Dateien:**
- `src/lib/ai/providers/mock-ai-provider.ts` (umbenannt)
- `src/lib/ai/core/ai-provider-factory.ts` (neu)
- `src/lib/ai/__tests__/mock-ai-provider.test.ts` (neu)

---

### **F.2.3: OpenAI-Provider (allgemein) implementieren (2-3 Tage)**

**Ziel:** Allgemeiner OpenAI-Provider (nicht nur Media)

**Schritte:**
1. ✅ `src/lib/ai/providers/openai-provider.ts` erstellen
   - Implementiert `AiProvider`
   - `requestText()` implementieren
   - `requestJson()` implementieren
   - `isAvailable()` implementieren
   - `estimateCost()` implementieren

2. ✅ Secret-Management
   - Nutzt `SecretManager` (bereits vorhanden)
   - `OPENAI_API_KEY` aus ENV laden

3. ✅ Tests schreiben
   - Unit-Tests (mit gemocktem OpenAI-Client)
   - Integrationstests (optional, nur wenn API-Key vorhanden)

4. ✅ Factory-Integration
   - OpenAI-Provider in Factory integrieren

**Erfolgskriterien:**
- ✅ OpenAI-Provider implementiert `AiProvider`
- ✅ `requestText()` funktioniert
- ✅ `requestJson()` funktioniert
- ✅ Tests bestehen
- ✅ Factory kann OpenAI-Provider erstellen

**Dateien:**
- `src/lib/ai/providers/openai-provider.ts` (neu)
- `src/lib/ai/__tests__/openai-provider.test.ts` (neu)

---

### **F.2.4: LLaMA-Provider implementieren (2-3 Tage)**

**Ziel:** LLaMA-Provider für Self-Hosted LLaMA

**Schritte:**
1. ✅ `src/lib/ai/providers/llama-provider.ts` erstellen
   - Implementiert `AiProvider`
   - Nutzt Ollama API (`http://localhost:11434`)
   - `requestText()` implementieren
   - `requestJson()` implementieren (JSON-Extraktion)
   - `isAvailable()` implementieren
   - `estimateCost()` implementieren (Self-Hosted = 0 €)

2. ✅ Konfiguration
   - `LLAMA_SERVER_URL` aus ENV (Default: `http://localhost:11434`)
   - `LLAMA_MODEL` aus ENV (Default: `llama3.2:1b`)

3. ✅ Tests schreiben
   - Unit-Tests (mit gemocktem Ollama-API)
   - Integrationstests (nur wenn Ollama läuft)

4. ✅ Factory-Integration
   - LLaMA-Provider in Factory integrieren

**Erfolgskriterien:**
- ✅ LLaMA-Provider implementiert `AiProvider`
- ✅ `requestText()` funktioniert mit Ollama
- ✅ `requestJson()` extrahiert JSON aus Text
- ✅ Tests bestehen
- ✅ Factory kann LLaMA-Provider erstellen

**Dateien:**
- `src/lib/ai/providers/llama-provider.ts` (neu)
- `src/lib/ai/__tests__/llama-provider.test.ts` (neu)

---

### **F.2.5: Adapter-Pattern (optional, für Migration) (1-2 Tage)**

**Ziel:** Adapter für schrittweise Migration

**Schritte:**
1. ✅ `src/lib/ai/adapters/openai-media-to-ai-provider.draft.ts` → `.ts` umbenennen
   - Datei umbenennen (`.draft.ts` entfernen)
   - Status-Kommentar aktualisieren

2. ✅ Tests schreiben
   - Unit-Tests für Adapter
   - Integrationstests mit bestehendem Media-Provider

3. ✅ Dokumentation
   - Migrations-Strategie dokumentieren
   - Verwendungsbeispiele

**Erfolgskriterien:**
- ✅ Adapter kann bestehenden Media-Provider wrappen
- ✅ Tests bestehen
- ✅ Dokumentation ist vollständig

**Dateien:**
- `src/lib/ai/adapters/openai-media-to-ai-provider.ts` (umbenannt)
- `src/lib/ai/__tests__/adapter.test.ts` (neu)

---

### **F.2.6: Integration & Tests (1 Tag)**

**Ziel:** Alles zusammenführen und testen

**Schritte:**
1. ✅ Integrationstests
   - Alle Provider zusammen testen
   - Factory-Tests
   - End-to-End-Tests

2. ✅ Dokumentation aktualisieren
   - README für `src/lib/ai/`
   - Verwendungsbeispiele
   - Migration-Guide

3. ✅ Code-Review
   - Linter-Fehler beheben
   - TypeScript-Fehler beheben
   - Code-Qualität prüfen

**Erfolgskriterien:**
- ✅ Alle Tests bestehen
- ✅ Keine Linter-Fehler
- ✅ Dokumentation ist vollständig
- ✅ Code ist produktionsreif

---

## PHASE L0: LLaMA LOKAL TESTEN

### **L0.1: Ollama Installation prüfen (bereits erledigt)**

**Status:** ✅ **BEREITS ERLEDIGT**
- ✅ Ollama installiert (Windows, Winget)
- ✅ PATH aktualisiert
- ✅ `ollama` Befehl funktioniert

---

### **L0.2: LLaMA-Modell laden & testen (1 Tag)**

**Ziel:** Kleines LLaMA-Modell laden und erste Tests durchführen

**Schritte:**
1. ✅ Modell laden
   ```bash
   ollama pull llama3.2:1b
   ```

2. ✅ Erste Tests
   ```bash
   ollama run llama3.2:1b "Hallo, wie geht es dir?"
   ```

3. ✅ Media-KI-Tests
   - Prompt für Bild-Tagging testen
   - Prompt für DSGVO-Helfer testen
   - Ergebnisse dokumentieren

4. ✅ Vergleich mit OpenAI
   - Gleiche Prompts mit OpenAI testen
   - Qualität vergleichen
   - Geschwindigkeit vergleichen
   - Ergebnisse dokumentieren

**Erfolgskriterien:**
- ✅ LLaMA-Modell läuft lokal
- ✅ Erste Tests erfolgreich
- ✅ Vergleich mit OpenAI dokumentiert

**Dokumentation:**
- `docs/ENTERPRISE-PLUS-PLUS/L0-TEST-ERGEBNISSE.md` (neu)

---

### **L0.3: LLaMA-Provider Integration (siehe F.2.4)**

**Status:** ✅ **Teil von F.2.4**
- LLaMA-Provider implementieren
- Integration mit AiProvider-System

---

### **L0.4: Erweiterte Tests (1 Tag)**

**Ziel:** Verschiedene Use-Cases testen

**Schritte:**
1. ✅ Media-KI-Tests
   - Bild-Tagging-Prompts
   - Alt-Text-Generierung
   - Quality-Checks

2. ✅ DSGVO-Helfer-Tests
   - DSGVO-Text-Analyse
   - Compliance-Prüfung

3. ✅ Code-Analyse-Tests
   - TypeScript-Code-Analyse
   - Best-Practices-Prüfung

4. ✅ Performance-Tests
   - Antwortzeit messen
   - Token-Verbrauch messen
   - Vergleich mit OpenAI

**Erfolgskriterien:**
- ✅ Alle Use-Cases getestet
- ✅ Performance dokumentiert
- ✅ Vergleich mit OpenAI dokumentiert

**Dokumentation:**
- `docs/ENTERPRISE-PLUS-PLUS/L0-TEST-ERGEBNISSE.md` (aktualisiert)

---

## PHASE L1: LLaMA AUF NETCUP-SERVER (OPTIONAL)

### **L1.1: Voraussetzungen prüfen (1 Tag)**

**Ziel:** Prüfen, ob L1 möglich ist

**Schritte:**
1. ✅ Server-Spezifikationen prüfen
   - CPU, RAM, GPU (falls vorhanden)
   - Verfügbarer Speicherplatz
   - Netzwerk-Bandbreite

2. ✅ Ollama auf Server installieren
   - Linux-Installation (nicht Windows)
   - Systemd-Service einrichten
   - Firewall-Regeln prüfen

3. ✅ Modell auf Server laden
   - Kleines Modell (llama3.2:1b)
   - Tests durchführen

**Erfolgskriterien:**
- ✅ Ollama läuft auf Server
- ✅ Modell ist geladen
- ✅ API ist erreichbar

---

### **L1.2: LLaMA-Provider konfigurieren (siehe F.2.4)**

**Status:** ✅ **Teil von F.2.4**
- LLaMA-Provider mit Server-URL konfigurieren
- `LLAMA_SERVER_URL` auf Netcup-Server setzen

---

### **L1.3: Integration & Tests (1 Tag)**

**Ziel:** LLaMA auf Server in System integrieren

**Schritte:**
1. ✅ LLaMA-Provider konfigurieren
   - `LLAMA_SERVER_URL` in ENV setzen
   - Tests durchführen

2. ✅ Performance-Tests
   - Antwortzeit messen (Server vs. lokal)
   - Netzwerk-Latenz messen

3. ✅ Verfügbarkeit prüfen
   - Server-Ausfall-Szenarien
   - Fallback-Mechanismus testen

**Erfolgskriterien:**
- ✅ LLaMA läuft auf Server
- ✅ Integration funktioniert
- ✅ Performance akzeptabel

---

## ZEITPLAN

### **Woche 1: F.2 Basis + L0 Tests**

**Tag 1-2:**
- F.2.1: Basis-Interface finalisieren
- F.2.2: Mock-Provider aktivieren

**Tag 3-4:**
- L0.2: LLaMA-Modell laden & testen
- L0.4: Erweiterte Tests

**Tag 5:**
- Integration & Dokumentation

---

### **Woche 2: F.2 Provider-Implementierung**

**Tag 1-3:**
- F.2.3: OpenAI-Provider (allgemein)

**Tag 4-5:**
- F.2.4: LLaMA-Provider

---

### **Woche 3: F.2 Abschluss + L1 (optional)**

**Tag 1-2:**
- F.2.5: Adapter-Pattern (optional)
- F.2.6: Integration & Tests

**Tag 3-5:**
- L1.1: Voraussetzungen prüfen
- L1.2: LLaMA-Provider konfigurieren
- L1.3: Integration & Tests

---

## ERFOLGSKRITERIEN (GESAMT)

### **F.2: AiProvider-System**

- ✅ `AiProvider`-Interface ist produktionsreif
- ✅ Mock-Provider funktioniert
- ✅ OpenAI-Provider (allgemein) funktioniert
- ✅ LLaMA-Provider funktioniert
- ✅ Factory kann alle Provider erstellen
- ✅ Tests bestehen
- ✅ Dokumentation ist vollständig

---

### **L0: LLaMA lokal**

- ✅ Ollama läuft lokal
- ✅ LLaMA-Modell ist geladen
- ✅ Erste Tests erfolgreich
- ✅ Vergleich mit OpenAI dokumentiert
- ✅ LLaMA-Provider integriert

---

### **L1: LLaMA auf Server (optional)**

- ✅ Ollama läuft auf Server
- ✅ LLaMA-Modell ist geladen
- ✅ Integration funktioniert
- ✅ Performance akzeptabel

---

## RISIKEN & MITIGATION

### **Risiko 1: LLaMA-Qualität zu niedrig**

**Mitigation:**
- ✅ Größeres Modell testen (llama3.2:3b, mistral:7b)
- ✅ Prompt-Engineering optimieren
- ✅ Fallback auf OpenAI behalten

---

### **Risiko 2: Performance-Probleme**

**Mitigation:**
- ✅ Caching implementieren
- ✅ Batch-Processing optimieren
- ✅ Monitoring einrichten

---

### **Risiko 3: Breaking Changes**

**Mitigation:**
- ✅ Bestehender Code bleibt unverändert
- ✅ Adapter-Pattern für Migration
- ✅ Feature-Flags für neue Implementierungen

---

## NÄCHSTE SCHRITTE

1. ✅ **F.2.1 starten:** Basis-Interface finalisieren
2. ✅ **F.2.2 starten:** Mock-Provider aktivieren
3. ✅ **L0.2 starten:** LLaMA-Modell laden & testen
4. ✅ **F.2.3 starten:** OpenAI-Provider (allgemein)
5. ✅ **F.2.4 starten:** LLaMA-Provider

---

## ZUSAMMENFASSUNG

**Kernpunkte:**
- ✅ **Schrittweise:** Jeder Schritt ist testbar
- ✅ **Keine Breaking Changes:** Bestehender Code bleibt unverändert
- ✅ **Testgetrieben:** Tests zuerst, dann Implementierung
- ✅ **Budgetfreundlich:** 0 € zusätzliche Kosten
- ✅ **Produktionsreif:** Enterprise++-Standards

**Status:**
- 🚀 **BEREIT FÜR IMPLEMENTIERUNG**
- ⏳ **Start mit F.2.1 (Basis-Interface)**

---

**Enterprise++ KI-Architekt-Agent**  
*Analyse → Planung → Kontrolle*  
*Stand: 2025-11-29*  
*Bereit für Implementierung*



