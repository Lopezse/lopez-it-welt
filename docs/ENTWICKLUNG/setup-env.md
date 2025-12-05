# 🔧 Environment-Variablen Setup - Entwickler-Anleitung

**Erstellt:** 2025-01-27  
**Zweck:** Anleitung für lokale Entwicklungsumgebung

---

## 📋 Schnellstart

### 1. .env Datei erstellen

```bash
# Im Projekt-Hauptverzeichnis
cp .env.example .env
```

### 2. .env Datei ausfüllen

Öffne `.env` und fülle die Werte aus:

```env
# OpenAI (optional, für Phase 3.2)
OPENAI_API_KEY=sk-your-actual-key-here
MEDIA_AI_PROVIDER=mock

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your-password
```

### 3. System starten

```bash
npm run dev
```

---

## 🔐 Secrets beschaffen

### OpenAI API Key

1. Registrierung: https://platform.openai.com/api-keys
2. Neuen Key erstellen
3. Key in Passwortmanager speichern (1Password, Bitwarden, etc.)
4. Key in `.env` eintragen

**WICHTIG:** Key niemals ins Repository committen!

---

## 📁 Dateien

- **`.env.example`** - Vorlage (im Repository)
- **`.env`** - Lokale Konfiguration (NICHT im Repository)
- **`.gitignore`** - Schützt `.env` Dateien

---

## ⚠️ Wichtige Hinweise

1. **`.env` niemals committen:**
   - `.env` ist in `.gitignore`
   - Nur `.env.example` wird committet

2. **Keys in Passwortmanager:**
   - Echte Keys in Passwortmanager speichern
   - `.env` nur für lokale Entwicklung

3. **Production:**
   - Keys über Environment-Variablen setzen
   - Keine `.env` Datei auf Server

---

## 🔍 Troubleshooting

### "Environment variable not found"

**Problem:** Variable nicht in `.env` gesetzt

**Lösung:**
1. Prüfe, ob `.env` Datei existiert
2. Prüfe, ob Variable korrekt geschrieben ist
3. System neu starten

### "OpenAI API Key not found"

**Problem:** `MEDIA_AI_PROVIDER=openai`, aber Key fehlt

**Lösung:**
1. `MEDIA_AI_PROVIDER=mock` setzen (temporär)
2. Oder `OPENAI_API_KEY` in `.env` setzen

---

**Weitere Informationen:**
- Secret-Handling-Policy: `docs/SICHERHEIT/secret-handling-policy.md`
- Konzept: `docs/KONZEPT/enterprise-secret-handling-konzept.md`





