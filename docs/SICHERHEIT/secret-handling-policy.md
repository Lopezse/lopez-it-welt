# 🔐 Secret-Handling Policy - Lopez IT Welt

**Erstellt:** 2025-01-27  
**Status:** ✅ Aktiv  
**Gültigkeit:** Für alle Entwickler und Admins

---

## 📋 Kernprinzip

**"Secrets are never stored, only referenced"**

Secrets (API-Keys, Passwörter, Tokens) werden **niemals** im Code, Repository oder in der Datenbank gespeichert. Sie werden ausschließlich über Umgebungsvariablen referenziert.

---

## 🚫 Verbotene Praktiken

### ❌ **NIEMALS:**

1. **Keys im Code:**
   ```typescript
   // ❌ FALSCH
   const apiKey = "sk-abc123...";
   ```

2. **Keys im Repository:**
   - Keine `.env` Dateien committen
   - Keine Keys in Kommentaren
   - Keine Keys in Config-Dateien

3. **Keys in der Datenbank:**
   ```sql
   -- ❌ FALSCH
   INSERT INTO providers (api_key) VALUES ('sk-abc123...');
   ```

4. **Keys in Logs:**
   ```typescript
   // ❌ FALSCH
   console.log("API Key:", process.env.OPENAI_API_KEY);
   ```

5. **Keys in UI/Responses:**
   ```typescript
   // ❌ FALSCH
   return { apiKey: config.apiKey };
   ```

---

## ✅ Erlaubte Praktiken

### ✅ **KORREKT:**

1. **Secret-Referenzen:**
   ```typescript
   // ✅ RICHTIG
   const secretRef = "ENV:OPENAI_API_KEY";
   const apiKey = SecretManager.loadSecret(secretRef);
   ```

2. **Secret-Referenzen in DB:**
   ```sql
   -- ✅ RICHTIG
   INSERT INTO providers (secret_ref) VALUES ('ENV:OPENAI_API_KEY');
   ```

3. **Secret-Maskierung in Logs:**
   ```typescript
   // ✅ RICHTIG
   console.log("API Key:", SecretManager.maskSecret(apiKey));
   // Output: "sk-***masked***"
   ```

---

## 📁 Secret-Speicherung

### **Für Menschen (Admin/Inhaber):**

1. **Passwortmanager (empfohlen):**
   - 1Password, Bitwarden, LastPass, etc.
   - Key-Name: "Lopez IT Welt - OpenAI API Key"
   - Dokumentation: Wo ist Key gespeichert?

2. **Verschlüsselte Datei (optional):**
   - Key in verschlüsselter Datei (z.B. mit GPG)
   - Passwort für Entschlüsselung in Passwortmanager
   - Nur für lokale Entwicklung

3. **.env Datei (lokal):**
   - Key in `.env` Datei (nicht im Repository)
   - `.env` ist in `.gitignore`
   - Nur für lokale Entwicklung

### **Für das System:**

1. **Environment-Variablen:**
   - Production: Über Deployment-Tool gesetzt
   - Development: Über `.env` Datei geladen
   - Key wird zur Laufzeit geladen, nie gespeichert

---

## 🔄 Key-Rollover-Prozess

### **Vorbereitung:**

1. Neuen Key in OpenAI erstellen:
   - https://platform.openai.com/api-keys
   - Neuen Key generieren
   - Key in Passwortmanager speichern

2. Backup des alten Keys (falls nötig):
   - Alten Key dokumentieren (falls Rollback nötig)
   - Alten Key in Passwortmanager behalten (temporär)

### **Durchführung:**

1. **Neuen Key in .env setzen:**
   ```env
   OPENAI_API_KEY=sk-new-key-here
   ```

2. **System testen (Mock-Modus):**
   ```env
   MEDIA_AI_PROVIDER=mock
   ```
   - System starten
   - Funktionen testen

3. **System auf neuen Key umstellen:**
   ```env
   MEDIA_AI_PROVIDER=openai
   ```
   - System starten
   - Funktionen mit echtem Key testen

4. **Alten Key in OpenAI deaktivieren:**
   - https://platform.openai.com/api-keys
   - Alten Key deaktivieren/löschen

5. **Dokumentation aktualisieren:**
   - Passwortmanager aktualisieren
   - Alten Key entfernen

### **Rollback (falls Probleme):**

1. `MEDIA_AI_PROVIDER=mock` setzen
2. Alten Key wieder aktivieren (falls noch möglich)
3. Problem analysieren
4. Nach Fix: Neuen Key erneut testen

---

## 🛡️ Sicherheits-Checkliste

### **Vor jedem Commit:**

- [ ] Keine Keys im Code?
- [ ] Keine `.env` Dateien staged?
- [ ] Secrets-Scanner ausgeführt?
- [ ] Pre-commit Hook aktiv?

### **Vor jedem Deployment:**

- [ ] Keys nur in Environment-Variablen?
- [ ] Keine Keys in Config-Dateien?
- [ ] Keine Keys in Datenbank?
- [ ] Log-Maskierung aktiv?

### **Regelmäßig:**

- [ ] Secrets-Scanner ausführen
- [ ] Code-Review auf Keys prüfen
- [ ] Logs auf Keys prüfen
- [ ] Key-Rollover durchführen (alle 90 Tage)

---

## 📝 Verantwortlichkeiten

### **Entwickler:**
- Keys nie im Code speichern
- Nur Secret-Referenzen verwenden
- Secrets-Scanner vor Commit ausführen
- Keys in Passwortmanager speichern

### **Admin/Inhaber:**
- Keys in Passwortmanager verwalten
- Key-Rollover durchführen
- Dokumentation aktuell halten
- Zugriff auf Keys kontrollieren

### **System:**
- Keys zur Laufzeit laden
- Keys niemals speichern
- Keys niemals loggen
- Keys niemals in Responses

---

## 🔍 Troubleshooting

### **"Environment variable not found"**

**Problem:** `OPENAI_API_KEY` nicht in `.env` gesetzt

**Lösung:**
1. `.env` Datei erstellen (von `.env.example` kopieren)
2. `OPENAI_API_KEY=sk-your-key-here` eintragen
3. System neu starten

### **"Secret reference format invalid"**

**Problem:** Falsches Format in `secret_ref`

**Lösung:**
- Format: `ENV:VARIABLE_NAME` oder `MOCK`
- Beispiel: `ENV:OPENAI_API_KEY`

### **"OpenAI API Key not found"**

**Problem:** Key fehlt, aber Provider ist `openai`

**Lösung:**
1. `MEDIA_AI_PROVIDER=mock` setzen (temporär)
2. Oder `OPENAI_API_KEY` in `.env` setzen
3. System neu starten

---

## 📚 Weiterführende Dokumentation

- **Konzept:** `docs/KONZEPT/enterprise-secret-handling-konzept.md`
- **Implementierung:** `docs/ABNAHME/secret-handling-implementation.md`
- **SecretManager:** `src/lib/media/ai/secret-manager.ts`

---

**Status:** ✅ Policy aktiv  
**Letzte Aktualisierung:** 2025-01-27





