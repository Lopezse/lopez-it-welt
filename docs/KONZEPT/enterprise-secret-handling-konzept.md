# 🔐 Enterprise Secret-Handling Konzept - OpenAI API Key

**Erstellt:** 2025-01-27  
**Status:** Konzept & Analyse (keine Implementierung)  
**Zweck:** Enterprise-Level Secret-Management für OpenAI-API-Key

---

## 📋 Executive Summary

Dieses Dokument definiert das fachliche und technische Konzept für das Secret-Handling des OpenAI-API-Keys nach Enterprise-Standards (IBM, SAP, Siemens). Der Key wird **niemals** im Code, Repository oder in der Datenbank gespeichert, sondern ausschließlich über Umgebungsvariablen referenziert.

**Kernprinzip:** "Secrets are never stored, only referenced"

---

## 1️⃣ Ist-Stand Secret-Handling

### 1.1 Aktuelle Situation

**OpenAI-Key:**
- ❌ Nicht vorhanden (System läuft im Mock-Modus)
- ✅ Code erwartet `process.env.OPENAI_API_KEY` (korrekt)
- ✅ Keine hardcoded Keys im Code gefunden
- ✅ Keine `.env` Dateien im Repository

**Bestehende Secret-Handling-Patterns:**
- ✅ `.gitignore` schützt `.env*` Dateien korrekt
- ✅ `scripts/secrets-scanner.js` vorhanden (automatische Erkennung)
- ✅ Secrets werden über `process.env` geladen
- ⚠️ 2FA-Secrets werden in DB gespeichert (aber das sind User-Secrets, nicht API-Keys)

### 1.2 Potenzielle Risiko-Stellen

#### ✅ **Sicher (aktuell):**
1. **Code:**
   - Keine hardcoded Keys gefunden
   - Alle Secrets über `process.env` geladen

2. **Logging:**
   - `process.env.NODE_ENV` und `process.env.PORT` werden geloggt (unproblematisch)
   - Keine kompletten `process.env` Objekte werden geloggt
   - Fehlerbehandlung gibt nur `error.message` zurück (nicht `process.env`)

3. **Fehlerbehandlung:**
   - Development-Modus: `error.message` wird zurückgegeben (OK)
   - Production-Modus: Keine Details zurückgegeben (OK)
   - **Gefunden:** `src/app/api/invoices/route.ts` Zeile 328-333 gibt Stack-Trace zurück (nur Development)

4. **Admin-UI:**
   - Keine API-Keys werden in UI angezeigt
   - Config-Anzeige zeigt nur Provider-Namen, keine Keys

#### ⚠️ **Potenzielle Risiken (zu beachten):**

1. **Fehlerbehandlung könnte Keys leaken:**
   - Wenn `process.env` Objekt versehentlich geloggt wird
   - Wenn Error-Response versehentlich `process.env` enthält
   - **Aktuell:** Nicht gefunden, aber Risiko besteht

2. **Development-Modus:**
   - `process.env.NODE_ENV === "development"` gibt mehr Details zurück
   - Stack-Traces könnten Keys enthalten (wenn Key in Error-Message)
   - **Aktuell:** Nur `error.message`, kein `process.env`

3. **Datenbank:**
   - Keine API-Keys in DB gespeichert (gut)
   - 2FA-Secrets werden in DB gespeichert (OK, da User-Secrets)
   - **Potenzial:** Secret-Referenz könnte in DB gespeichert werden (z.B. `"ENV:OPENAI_API_KEY"`)

### 1.3 Bestehende Strukturen

**Config-System:**
- `src/lib/media/ai/config.ts` - Zentrale Config
- `MEDIA_AI_PROVIDER` - Provider-Auswahl über `process.env`
- `AIServiceConfig` Interface hat `api_key?: string` Feld (wird aktuell nicht verwendet)

**Provider-System:**
- `src/lib/media/ai/providers/types.ts` - Provider-Interface
- `MediaAIProvider` Interface definiert
- **Potenzial:** Secret-Referenz könnte hier integriert werden

**Secrets-Scanner:**
- `scripts/secrets-scanner.js` - Automatische Erkennung
- Pre-commit Hook möglich
- Git-Hook möglich

---

## 2️⃣ Zielbild (Enterprise-Secret-Handling)

### 2.1 Kernprinzipien

**1. Secrets werden niemals gespeichert:**
- ❌ Nicht im Code
- ❌ Nicht im Repository
- ❌ Nicht in der Datenbank
- ❌ Nicht in Logs
- ❌ Nicht in UI

**2. Secrets werden nur referenziert:**
- ✅ Über Umgebungsvariablen (`process.env.OPENAI_API_KEY`)
- ✅ In DB: Nur Referenz (z.B. `secret_ref = "ENV:OPENAI_API_KEY"`)
- ✅ In Config: Nur Referenz (z.B. `api_key_ref = "ENV:OPENAI_API_KEY"`)

**3. Secret-Quelle:**
- ✅ `.env` Datei (lokal, nicht im Repository)
- ✅ Passwortmanager (für Menschen)
- ✅ Verschlüsselte Datei (optional)
- ✅ Environment-Variablen (Production)

### 2.2 Architektur-Konzept

#### **Schicht 1: Secret-Speicherung (außerhalb des Systems)**

```
┌─────────────────────────────────────┐
│  Secret-Speicherung (außerhalb)    │
├─────────────────────────────────────┤
│  • .env Datei (lokal)              │
│  • Passwortmanager (1Password, etc)│
│  • Verschlüsselte Datei (optional) │
│  • Environment-Variablen (Prod)    │
└─────────────────────────────────────┘
           │
           │ process.env.OPENAI_API_KEY
           ▼
┌─────────────────────────────────────┐
│  Application Layer                  │
├─────────────────────────────────────┤
│  • Config liest process.env         │
│  • Provider verwendet process.env   │
│  • Kein Key wird gespeichert        │
└─────────────────────────────────────┘
           │
           │ secret_ref = "ENV:OPENAI_API_KEY"
           ▼
┌─────────────────────────────────────┐
│  Database (nur Referenz)           │
├─────────────────────────────────────┤
│  • secret_ref VARCHAR(255)          │
│  • provider VARCHAR(50)             │
│  • KEIN api_key Feld                │
└─────────────────────────────────────┘
```

#### **Schicht 2: Secret-Referenz-System**

**Datenbank-Schema (Konzept):**
```sql
-- Optionale Tabelle für Provider-Konfiguration
CREATE TABLE lopez_media_ai_providers (
    id VARCHAR(36) PRIMARY KEY,
    provider_name VARCHAR(50) NOT NULL, -- "openai", "google", "mock"
    secret_ref VARCHAR(255) NOT NULL,   -- "ENV:OPENAI_API_KEY"
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_provider (provider_name),
    INDEX idx_active (is_active)
);
```

**Secret-Referenz-Format:**
- `ENV:OPENAI_API_KEY` - Umgebungsvariable
- `ENV:OPENAI_API_KEY_ALT` - Alternative Umgebungsvariable
- `MOCK` - Mock-Provider (kein Key nötig)
- Später: `VAULT:openai-key` (für externe Vaults)

**Config-Struktur (Konzept):**
```typescript
interface ProviderConfig {
    provider: "mock" | "openai" | "google" | "azure";
    secretRef: string; // "ENV:OPENAI_API_KEY"
    // KEIN api_key Feld!
}

// Verwendung:
const apiKey = process.env[secretRef.replace("ENV:", "")];
```

### 2.3 Vergleich mit Enterprise-Standards

#### **IBM Pattern:**
- Secrets in IBM Key Protect / HashiCorp Vault
- Application referenziert Secret über ID/Path
- Secret wird zur Laufzeit geladen
- **Unser Ansatz:** Ähnlich, aber mit `.env` statt Vault (für kleine Unternehmen)

#### **SAP Pattern:**
- Secrets in SAP Credential Store
- Application verwendet Secret-Name
- Secret wird zur Laufzeit geladen
- **Unser Ansatz:** Ähnlich, aber mit `ENV:VARIABLE_NAME` Format

#### **Siemens Pattern:**
- Secrets in Siemens Secrets Manager
- Application referenziert Secret über Alias
- Secret wird zur Laufzeit geladen
- **Unser Ansatz:** Ähnlich, aber mit einfachem `ENV:` Prefix

**Gemeinsamkeiten:**
- ✅ Secrets werden nie im Code gespeichert
- ✅ Secrets werden nur referenziert
- ✅ Secrets werden zur Laufzeit geladen
- ✅ Secrets werden nie in Logs/UI angezeigt

**Unterschiede:**
- Enterprise: Externe Vaults (AWS Secrets Manager, Azure Key Vault, etc.)
- Unser Ansatz: `.env` Datei + Passwortmanager (für kleine Unternehmen ausreichend)

---

## 3️⃣ Risikoanalyse

### 3.1 Risiko: Key im Code

**Szenario:**
```typescript
// ❌ FALSCH
const apiKey = "sk-abc123...";
```

**Risiko:**
- 🔴 **KRITISCH:** Key landet im Repository
- 🔴 Key ist in Git-Historie sichtbar
- 🔴 Key ist für alle mit Repository-Zugriff sichtbar

**Mitigation:**
- ✅ Secrets-Scanner erkennt hardcoded Keys
- ✅ Pre-commit Hook blockiert Commits mit Keys
- ✅ Code-Review prüft auf Keys
- ✅ `.gitignore` schützt `.env` Dateien

**Empfehlung:**
- Secrets-Scanner in CI/CD Pipeline integrieren
- Pre-commit Hook aktivieren
- Code-Review-Checkliste: "Keine Keys im Code"

---

### 3.2 Risiko: Key in Datenbank

**Szenario:**
```sql
-- ❌ FALSCH
INSERT INTO lopez_media_ai_providers (provider_name, api_key)
VALUES ('openai', 'sk-abc123...');
```

**Risiko:**
- 🔴 **KRITISCH:** Key ist in DB gespeichert
- 🔴 Key ist in DB-Backups sichtbar
- 🔴 Key ist für alle mit DB-Zugriff sichtbar
- 🔴 Key könnte in Logs landen (SQL-Queries)

**Mitigation:**
- ✅ Nur Secret-Referenz in DB speichern (`secret_ref = "ENV:OPENAI_API_KEY"`)
- ✅ Kein `api_key` Feld in DB-Schema
- ✅ DB-Backups enthalten keine Keys
- ✅ SQL-Logging deaktivieren oder maskieren

**Empfehlung:**
- Migration prüfen: Kein `api_key` Feld
- DB-Schema dokumentieren: Nur Referenzen
- Backup-Policy: Keys sind nicht in Backups

---

### 3.3 Risiko: Key im Admin-UI

**Szenario:**
```typescript
// ❌ FALSCH
<div>API Key: {config.apiKey}</div>
```

**Risiko:**
- 🟡 **HOCH:** Key ist in Browser sichtbar
- 🟡 Key ist in Browser-Cache/History
- 🟡 Key könnte gescreenshotet werden
- 🟡 Key könnte in Browser-DevTools sichtbar sein

**Mitigation:**
- ✅ UI zeigt nur Provider-Status, nicht Key
- ✅ UI zeigt nur `secret_ref` (z.B. "ENV:OPENAI_API_KEY"), nicht Key-Wert
- ✅ API-Endpunkte geben keine Keys zurück
- ✅ Response-Filter entfernt Keys aus Responses

**Empfehlung:**
- UI-Review: Keine Keys anzeigen
- API-Response-Filter implementieren
- Browser-DevTools-Test: Keys nicht sichtbar

---

### 3.4 Risiko: Key in Logs

**Szenario:**
```typescript
// ❌ FALSCH
console.log("API Key:", process.env.OPENAI_API_KEY);
console.log("Config:", JSON.stringify(config)); // enthält Key
```

**Risiko:**
- 🟡 **HOCH:** Key ist in Log-Dateien sichtbar
- 🟡 Key ist in Log-Aggregation-Tools sichtbar
- 🟡 Key könnte in Error-Reports landen

**Mitigation:**
- ✅ Keine `process.env` Objekte loggen
- ✅ Keine Config-Objekte mit Keys loggen
- ✅ Log-Maskierung für Keys implementieren
- ✅ Error-Responses enthalten keine Keys

**Empfehlung:**
- Logging-Policy: Keine Secrets loggen
- Log-Maskierung implementieren
- Log-Review: Keys nicht sichtbar

---

### 3.5 Risiko: Key in Error-Responses

**Szenario:**
```typescript
// ❌ FALSCH
catch (error) {
    return { error: error.message, config: config }; // enthält Key
}
```

**Risiko:**
- 🟡 **HOCH:** Key ist in HTTP-Response sichtbar
- 🟡 Key ist in Browser-Network-Tab sichtbar
- 🟡 Key könnte in Error-Tracking-Tools landen

**Mitigation:**
- ✅ Error-Responses enthalten keine Keys
- ✅ Config-Objekte werden nicht in Responses zurückgegeben
- ✅ Response-Filter entfernt Keys
- ✅ Development-Modus: Nur `error.message`, nicht `process.env`

**Empfehlung:**
- Response-Filter implementieren
- Error-Handling-Review: Keine Keys
- API-Testing: Keys nicht in Responses

---

### 3.6 Minimalmaßnahmen für kleine Unternehmen

**Ohne AWS/Azure Secrets Manager:**

1. **.env Datei (lokal):**
   - ✅ Key in `.env` Datei (nicht im Repository)
   - ✅ `.env` in `.gitignore`
   - ✅ `.env.example` mit Platzhaltern

2. **Passwortmanager:**
   - ✅ Key in Passwortmanager (1Password, Bitwarden, etc.)
   - ✅ Dokumentation: Wo ist Key gespeichert?
   - ✅ Key-Rollover-Prozess definiert

3. **Verschlüsselte Datei (optional):**
   - ✅ Key in verschlüsselter Datei (z.B. mit GPG)
   - ✅ Passwort für Entschlüsselung in Passwortmanager
   - ✅ Nur für lokale Entwicklung

4. **Production:**
   - ✅ Environment-Variablen auf Server
   - ✅ Keine `.env` Datei auf Server
   - ✅ Key nur über Deployment-Tool gesetzt

**Enterprise-Niveau erreichen:**
- ✅ Secrets werden nie gespeichert (nur referenziert)
- ✅ Secrets werden zur Laufzeit geladen
- ✅ Secrets werden nie geloggt/angezeigt
- ✅ Secret-Rollover-Prozess definiert

**Unterschied zu Enterprise:**
- Enterprise: Externe Vaults (AWS Secrets Manager, etc.)
- Unser Ansatz: `.env` + Passwortmanager (ausreichend für kleine Unternehmen)

---

## 4️⃣ Empfohlene Architektur

### 4.1 Secret-Referenz-System

#### **Konzept:**

```
┌─────────────────────────────────────────────┐
│  Secret-Quelle (außerhalb)                 │
│  • .env: OPENAI_API_KEY=sk-...            │
│  • Passwortmanager: Key gespeichert        │
└─────────────────────────────────────────────┘
                    │
                    │ process.env.OPENAI_API_KEY
                    ▼
┌─────────────────────────────────────────────┐
│  Config-Layer                                │
│  • Liest secret_ref aus DB                  │
│  • secret_ref = "ENV:OPENAI_API_KEY"        │
│  • Lädt Key aus process.env                 │
└─────────────────────────────────────────────┘
                    │
                    │ apiKey (zur Laufzeit)
                    ▼
┌─────────────────────────────────────────────┐
│  Provider-Layer                              │
│  • OpenAIMediaAIProvider                    │
│  • Verwendet apiKey (nie speichert)         │
└─────────────────────────────────────────────┘
```

#### **Datenbank-Schema (Konzept):**

```sql
-- Provider-Konfiguration (nur Referenzen, keine Keys)
CREATE TABLE lopez_media_ai_providers (
    id VARCHAR(36) PRIMARY KEY,
    provider_name VARCHAR(50) NOT NULL UNIQUE, -- "openai", "google", "mock"
    secret_ref VARCHAR(255) NOT NULL,         -- "ENV:OPENAI_API_KEY"
    model_version VARCHAR(50) NULL,           -- "gpt-4-vision-preview"
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_provider (provider_name),
    INDEX idx_active (is_active)
);

-- Beispiel-Eintrag:
INSERT INTO lopez_media_ai_providers (id, provider_name, secret_ref, is_active)
VALUES (
    UUID(),
    'openai',
    'ENV:OPENAI_API_KEY',  -- NUR Referenz, kein Key!
    TRUE
);
```

#### **Config-Struktur (Konzept):**

```typescript
// src/lib/media/ai/config.ts

interface ProviderSecretRef {
    type: "ENV" | "MOCK" | "VAULT"; // Später erweiterbar
    reference: string; // "OPENAI_API_KEY" oder "openai-key"
}

interface ProviderConfig {
    provider: "mock" | "openai" | "google" | "azure";
    secretRef: ProviderSecretRef;
    modelVersion?: string;
    isActive: boolean;
}

class SecretManager {
    /**
     * Lädt Secret basierend auf Referenz
     * 
     * @param secretRef Secret-Referenz (z.B. "ENV:OPENAI_API_KEY")
     * @returns Secret-Wert (zur Laufzeit geladen)
     * @throws Error wenn Secret nicht gefunden
     */
    static loadSecret(secretRef: string): string {
        if (secretRef.startsWith("ENV:")) {
            const envVar = secretRef.replace("ENV:", "");
            const value = process.env[envVar];
            if (!value) {
                throw new Error(`Environment variable ${envVar} not found`);
            }
            return value;
        }
        
        if (secretRef === "MOCK") {
            return ""; // Mock benötigt keinen Key
        }
        
        throw new Error(`Unknown secret reference format: ${secretRef}`);
    }
    
    /**
     * Prüft, ob Secret vorhanden ist (ohne es zu loggen)
     */
    static hasSecret(secretRef: string): boolean {
        try {
            const secret = this.loadSecret(secretRef);
            return secret.length > 0;
        } catch {
            return false;
        }
    }
}
```

#### **Provider-Integration (Konzept):**

```typescript
// src/lib/media/ai/providers/OpenAIMediaAIProvider.ts

export class OpenAIMediaAIProvider implements MediaAIProvider {
    private apiKey: string;
    private secretRef: string;
    
    constructor(secretRef: string) {
        this.secretRef = secretRef;
        // Key wird zur Laufzeit geladen, nie gespeichert
        this.apiKey = SecretManager.loadSecret(secretRef);
    }
    
    getName(): string {
        return "openai";
    }
    
    // ... restliche Implementierung
}
```

### 4.2 .env Struktur

```env
# =====================================================
# LOPEZ IT WELT - ENVIRONMENT VARIABLES
# =====================================================
# WICHTIG: Diese Datei enthält Secrets!
# Niemals ins Repository committen!
# =====================================================

# OpenAI Configuration
OPENAI_API_KEY=sk-your-actual-key-here
MEDIA_AI_PROVIDER=openai
OPENAI_MODEL=gpt-4-vision-preview

# Kosten-Limits
MEDIA_AI_DAILY_LIMIT_USD=10.00
MEDIA_AI_MONTHLY_LIMIT_USD=200.00

# Cron-Job Security
CRON_SECRET=your-secure-secret-here

# Database (Beispiel)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your-db-password
```

### 4.3 .env.example Struktur

```env
# =====================================================
# LOPEZ IT WELT - ENVIRONMENT VARIABLES (EXAMPLE)
# =====================================================
# Kopiere diese Datei zu .env und fülle die Werte aus
# =====================================================

# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-api-key-here
MEDIA_AI_PROVIDER=mock|openai|google|azure|local
OPENAI_MODEL=gpt-4-vision-preview

# Kosten-Limits
MEDIA_AI_DAILY_LIMIT_USD=10.00
MEDIA_AI_MONTHLY_LIMIT_USD=200.00

# Cron-Job Security
CRON_SECRET=your-secure-secret-here

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your-db-password
```

---

## 5️⃣ Konkrete ToDos für die spätere Implementierung

### 5.1 Dateien die erstellt werden müssen

#### **Neue Dateien:**

1. **`.env.example`** (Repository)
   - Platzhalter für alle Environment-Variablen
   - Dokumentation welche Variablen benötigt werden
   - Keine echten Keys

2. **`docs/SICHERHEIT/secret-handling-policy.md`** (Repository)
   - Policy: Wie werden Secrets behandelt?
   - Regeln: Keys nie in Git, immer in Passwortmanager
   - Key-Rollover-Prozess

3. **`src/lib/media/ai/secret-manager.ts`** (Repository)
   - `SecretManager` Klasse
   - `loadSecret()` Methode
   - `hasSecret()` Methode
   - Maskierung für Logs

4. **`database/migrations/004_add_provider_secret_ref.sql`** (Repository)
   - Tabelle `lopez_media_ai_providers`
   - Nur `secret_ref` Feld, kein `api_key` Feld
   - Beispiel-Einträge

#### **Dateien die angepasst werden müssen:**

1. **`src/lib/media/ai/config.ts`**
   - `SecretManager` integrieren
   - `secret_ref` statt `api_key` verwenden
   - Provider-Config erweitern

2. **`src/lib/media/ai/providers/OpenAIMediaAIProvider.ts`** (wird erstellt in Phase 3.2)
   - `SecretManager.loadSecret()` verwenden
   - Key zur Laufzeit laden, nie speichern

3. **`src/lib/media/ai/MediaAIService.ts`**
   - Provider-Factory erweitern
   - Secret-Referenz aus DB/Config laden

4. **`.gitignore`** (bereits vorhanden, prüfen)
   - Sicherstellen, dass `.env*` ignoriert wird
   - `.env.example` sollte NICHT ignoriert werden

5. **`scripts/secrets-scanner.js`**
   - Erweitern um `OPENAI_API_KEY` Pattern
   - Pre-commit Hook aktivieren

### 5.2 Policies die dokumentiert werden müssen

#### **Secret-Handling-Policy:**

```markdown
# Secret-Handling Policy - Lopez IT Welt

## Grundregeln

1. **Keys werden NIEMALS im Code gespeichert**
   - Keine hardcoded Keys
   - Keine Keys in Kommentaren
   - Keine Keys in Config-Dateien (nur Referenzen)

2. **Keys werden NIEMALS ins Repository committet**
   - .env Dateien sind in .gitignore
   - .env.example enthält nur Platzhalter
   - Pre-commit Hook prüft auf Keys

3. **Keys werden NIEMALS in der Datenbank gespeichert**
   - Nur Secret-Referenzen (z.B. "ENV:OPENAI_API_KEY")
   - Kein api_key Feld in DB-Schema

4. **Keys werden NIEMALS geloggt oder angezeigt**
   - Keine process.env Objekte loggen
   - Keine Keys in Error-Responses
   - Keine Keys in Admin-UI

5. **Keys werden in Passwortmanager gespeichert**
   - 1Password, Bitwarden, oder ähnlich
   - Dokumentation: Wo ist Key gespeichert?
   - Key-Rollover-Prozess definiert
```

#### **Key-Rollover-Prozess:**

```markdown
# Key-Rollover-Prozess - OpenAI API Key

## Vorbereitung

1. Neuen Key in OpenAI erstellen
2. Neuen Key in Passwortmanager speichern
3. Backup des alten Keys (falls nötig)

## Durchführung

1. Neuen Key in .env setzen:
   ```env
   OPENAI_API_KEY=sk-new-key-here
   ```

2. System testen (Mock-Modus):
   ```env
   MEDIA_AI_PROVIDER=mock
   ```

3. System auf neuen Key umstellen:
   ```env
   MEDIA_AI_PROVIDER=openai
   ```

4. System testen (mit neuem Key)

5. Alten Key in OpenAI deaktivieren

6. Dokumentation aktualisieren

## Rollback

Falls Probleme auftreten:
1. MEDIA_AI_PROVIDER=mock setzen
2. Alten Key wieder aktivieren (falls noch möglich)
3. Problem analysieren
```

### 5.3 Code-Änderungen (Konzept, nicht implementieren)

#### **SecretManager Klasse:**

```typescript
// src/lib/media/ai/secret-manager.ts (KONZEPT)

export class SecretManager {
    /**
     * Lädt Secret basierend auf Referenz
     */
    static loadSecret(secretRef: string): string {
        // Implementierung
    }
    
    /**
     * Maskiert Secret für Logs
     */
    static maskSecret(secret: string): string {
        // Implementierung: "sk-***masked***"
    }
}
```

#### **Config-Erweiterung:**

```typescript
// src/lib/media/ai/config.ts (KONZEPT)

// Statt:
const apiKey = process.env.OPENAI_API_KEY;

// Verwenden:
const secretRef = "ENV:OPENAI_API_KEY";
const apiKey = SecretManager.loadSecret(secretRef);
```

#### **Provider-Integration:**

```typescript
// src/lib/media/ai/providers/OpenAIMediaAIProvider.ts (KONZEPT)

export class OpenAIMediaAIProvider implements MediaAIProvider {
    private apiKey: string;
    
    constructor(secretRef: string) {
        // Key zur Laufzeit laden, nie speichern
        this.apiKey = SecretManager.loadSecret(secretRef);
    }
}
```

### 5.4 Testing-Strategie

#### **Unit-Tests:**

```typescript
// Tests für SecretManager
describe("SecretManager", () => {
    it("should load secret from ENV reference", () => {
        process.env.TEST_KEY = "test-value";
        const secret = SecretManager.loadSecret("ENV:TEST_KEY");
        expect(secret).toBe("test-value");
    });
    
    it("should throw error if secret not found", () => {
        expect(() => {
            SecretManager.loadSecret("ENV:NONEXISTENT");
        }).toThrow();
    });
    
    it("should mask secret for logs", () => {
        const masked = SecretManager.maskSecret("sk-abc123...");
        expect(masked).toBe("sk-***masked***");
    });
});
```

#### **Integration-Tests:**

```typescript
// Tests für Provider mit Secret-Referenz
describe("OpenAIMediaAIProvider", () => {
    it("should load API key from secret reference", () => {
        process.env.OPENAI_API_KEY = "sk-test-key";
        const provider = new OpenAIMediaAIProvider("ENV:OPENAI_API_KEY");
        // Provider sollte Key geladen haben
    });
});
```

#### **Security-Tests:**

```typescript
// Tests für Secret-Leakage
describe("Secret Security", () => {
    it("should not log secrets", () => {
        // Prüfe, dass Secrets nicht in Logs landen
    });
    
    it("should not expose secrets in API responses", () => {
        // Prüfe, dass Secrets nicht in Responses landen
    });
    
    it("should not store secrets in database", () => {
        // Prüfe, dass nur Referenzen in DB sind
    });
});
```

---

## 6️⃣ Vergleich: Enterprise vs. Unser Ansatz

### 6.1 Enterprise-Pattern (IBM, SAP, Siemens)

**Gemeinsamkeiten:**
- ✅ Secrets werden nie im Code gespeichert
- ✅ Secrets werden nur referenziert
- ✅ Secrets werden zur Laufzeit geladen
- ✅ Secrets werden nie geloggt/angezeigt
- ✅ Secret-Rollover-Prozess definiert

**Unterschiede:**

| Aspekt | Enterprise | Unser Ansatz |
|--------|-----------|--------------|
| **Secret-Speicherung** | Externe Vaults (AWS Secrets Manager, Azure Key Vault, HashiCorp Vault) | `.env` Datei + Passwortmanager |
| **Secret-Referenz** | Vault-Path (z.B. `vault://secrets/openai-key`) | ENV-Format (z.B. `ENV:OPENAI_API_KEY`) |
| **Skalierung** | Für große Teams/Organisationen | Für kleine Unternehmen/Einzelunternehmer |
| **Kosten** | Vault-Service-Kosten | Kostenlos (`.env` + Passwortmanager) |
| **Komplexität** | Höher (Vault-Integration) | Niedriger (`.env` + `process.env`) |

**Fazit:**
- Unser Ansatz erreicht **Enterprise-Niveau** bei Secret-Handling
- Unterschied ist nur die **Secret-Quelle** (Vault vs. `.env`)
- **Prinzipien sind identisch:** Secrets werden nie gespeichert, nur referenziert

---

## 7️⃣ Zusammenfassung & Empfehlungen

### 7.1 Ist-Stand

**✅ Positiv:**
- Keine hardcoded Keys im Code
- `.gitignore` schützt `.env` Dateien
- Secrets-Scanner vorhanden
- Code verwendet `process.env` (korrekt)

**⚠️ Zu beachten:**
- Keine zentrale Secret-Referenz-Struktur
- Keine Policy dokumentiert
- Kein Key-Rollover-Prozess definiert
- Potenzial für Secret-Leakage in Logs/Responses

### 7.2 Zielbild

**Enterprise-Level Secret-Handling:**
- ✅ Secrets werden nie gespeichert (nur referenziert)
- ✅ Secret-Referenz-System (`ENV:OPENAI_API_KEY`)
- ✅ Secret-Manager-Klasse
- ✅ Policy dokumentiert
- ✅ Key-Rollover-Prozess definiert

### 7.3 Risiken

**Kritische Risiken:**
- 🔴 Key im Code → Repository-Leakage
- 🔴 Key in DB → Backup-Leakage
- 🟡 Key in Logs → Log-Leakage
- 🟡 Key in UI → Browser-Leakage

**Mitigation:**
- ✅ Secrets-Scanner + Pre-commit Hook
- ✅ Nur Referenzen in DB
- ✅ Log-Maskierung
- ✅ Response-Filter

### 7.4 Empfohlene Umsetzung

**Phase 1: Foundation (vor Phase 3.2)**
1. `.env.example` erstellen
2. Secret-Handling-Policy dokumentieren
3. SecretManager-Klasse implementieren
4. Secret-Referenz-System in DB (optional)

**Phase 2: Integration (während Phase 3.2)**
1. OpenAI-Provider mit SecretManager integrieren
2. Config-System erweitern
3. Tests implementieren

**Phase 3: Sicherheit (nach Phase 3.2)**
1. Log-Maskierung implementieren
2. Response-Filter implementieren
3. Security-Tests implementieren

---

## 📋 Checkliste für Implementierung

### Vor Phase 3.2 (OpenAI-Integration):

- [ ] `.env.example` erstellen
- [ ] `docs/SICHERHEIT/secret-handling-policy.md` erstellen
- [ ] `src/lib/media/ai/secret-manager.ts` implementieren
- [ ] `database/migrations/004_add_provider_secret_ref.sql` erstellen (optional)
- [ ] `src/lib/media/ai/config.ts` erweitern (Secret-Referenz)
- [ ] Secrets-Scanner erweitern (OPENAI_API_KEY Pattern)
- [ ] Pre-commit Hook aktivieren
- [ ] Key-Rollover-Prozess dokumentieren

### Während Phase 3.2 (OpenAI-Integration):

- [ ] `OpenAIMediaAIProvider` mit SecretManager integrieren
- [ ] Provider-Factory erweitern
- [ ] Tests implementieren

### Nach Phase 3.2 (Sicherheit):

- [ ] Log-Maskierung implementieren
- [ ] Response-Filter implementieren
- [ ] Security-Tests implementieren
- [ ] Code-Review: Keine Keys im Code

---

**Status:** ✅ Konzept abgeschlossen  
**Nächster Schritt:** Implementierung in Phase 3.2 vorbereiten





