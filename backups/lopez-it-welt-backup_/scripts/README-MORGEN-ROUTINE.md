# Morgen-Routine - Lopez IT Welt

## Übersicht

Die Morgen-Routine ist ein automatisiertes Skript, das täglich um 8:00 Uhr ausgeführt wird, um den Zustand des Lopez IT Welt Projekts zu überprüfen und zu optimieren.

## Funktionen

### 🔍 System-Status prüfen

- Node.js und npm Versionen überprüfen
- Verfügbaren Speicherplatz prüfen
- Projektgröße berechnen

### 💾 Backup-Status prüfen

- Letztes Backup-Datum überprüfen
- Backup-Größe anzeigen
- Warnung bei zu alten Backups

### 🔧 Code-Qualität prüfen

- ESLint-Prüfung durchführen
- TypeScript-Kompilierung testen
- Code-Metriken sammeln (Dateien, Zeilen)

### 🌍 i18n-Status prüfen

- Sprachdateien überprüfen
- Übersetzungsschlüssel zählen
- Konsistenz zwischen Sprachen prüfen

### 🧪 Tests ausführen

- Unit-Tests ausführen
- E2E-Tests ausführen (falls verfügbar)
- Testergebnisse protokollieren

### 🔨 Build-Status prüfen

- Build-Prozess testen
- Build-Fehler identifizieren

### ⚡ Optimierungen durchführen

- Cache bereinigen (.next, node_modules/.cache, dist)
- Bundle-Analyse durchführen (falls verfügbar)

### 📊 Bericht generieren

- Detaillierten Bericht erstellen
- Fehler und Warnungen auflisten
- Bericht in JSON-Format speichern

## Installation

### Automatische Installation

```bash
# Windows (als Administrator)
scripts\setup-scheduler.bat

# PowerShell (als Administrator)
scripts\setup-scheduler.ps1
```

### Manuelle Installation

```bash
# Scheduler-Aufgabe erstellen (Windows)
schtasks /create /tn "LopezITWelt-MorgenRoutine" /tr "node \"%PROJECT_PATH%\scripts\morgen-routine.js\"" /sc daily /st 08:00 /f

# Scheduler-Aufgabe erstellen (PowerShell)
Register-ScheduledTask -TaskName "LopezITWelt-MorgenRoutine" -Action (New-ScheduledTaskAction -Execute "node" -Argument "`"$ProjectPath\scripts\morgen-routine.js`"") -Trigger (New-ScheduledTaskTrigger -Daily -At "08:00") -Settings (New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries) -Description "Tägliche Morgen-Routine für Lopez IT Welt" -Force
```

## Manuelle Ausführung

### JavaScript-Version

```bash
node scripts/morgen-routine.js
```

### PowerShell-Version

```powershell
.\scripts\morgen-routine.ps1
```

## Konfiguration

### Umgebungsvariablen

```bash
# Erforderlich
NODE_ENV=development
PORT=3000

# Optional
BACKUP_PATH=./backups
LOG_LEVEL=info
```

### Anpassung der Ausführungszeit

Die Standard-Ausführungszeit ist 8:00 Uhr. Um diese zu ändern:

```bash
# Windows
schtasks /change /tn "LopezITWelt-MorgenRoutine" /st 09:00

# PowerShell
Set-ScheduledTask -TaskName "LopezITWelt-MorgenRoutine" -Trigger (New-ScheduledTaskTrigger -Daily -At "09:00")
```

## Ausgabe

### Konsolen-Ausgabe

```
🌅 Starte Morgen-Routine...
📅 Datum: 15.01.2025
⏰ Zeit: 08:00:00

🔍 Prüfe System-Status...
  ✅ Node.js: v18.17.0
  ✅ npm: 9.6.7
  ✅ Freier Speicherplatz: 45.2 GB
  ✅ Projektgröße: 125.8 MB

💾 Prüfe Backup-Status...
  ✅ Letztes Backup: backup-2025-01-14.json (vor 1 Tagen)
  📊 Backup-Größe: 2.3 MB

🔧 Prüfe Code-Qualität...
  ✅ ESLint-Prüfung bestanden
  ✅ TypeScript-Kompilierung erfolgreich
  📊 Code-Metriken: 45 Dateien, 1250 Zeilen

🌍 Prüfe i18n-Status...
  ✅ 3 Sprachdateien gefunden
    de.json: 125 Schlüssel
    en.json: 125 Schlüssel
    es.json: 120 Schlüssel
  ⚠️ 5 fehlende Übersetzungen

🧪 Führe Tests aus...
  ✅ Unit-Tests bestanden
  ✅ E2E-Tests bestanden

🔨 Prüfe Build-Status...
  ✅ Build erfolgreich

⚡ Führe Optimierungen durch...
  ✅ Cache bereinigt: .next
  ✅ Cache bereinigt: node_modules/.cache
  ✅ Bundle-Analyse durchgeführt

📊 Generiere Bericht...
  ✅ Bericht gespeichert: morgen-routine-report.json
  📈 Dauer: 2m 15s
  ❌ Fehler: 0
  ⚠️ Warnungen: 1

✅ Morgen-Routine erfolgreich abgeschlossen
```

### Bericht-Datei

Die Morgen-Routine erstellt eine JSON-Bericht-Datei (`morgen-routine-report.json`):

```json
{
  "timestamp": "2025-01-15T08:00:00.000Z",
  "duration": "2m 15s",
  "status": "completed",
  "errors": 0,
  "warnings": 1,
  "logs": [
    {
      "timestamp": "2025-01-15T08:00:15.123Z",
      "type": "warning",
      "message": "5 fehlende Übersetzungen",
      "error": null
    }
  ]
}
```

## Fehlerbehebung

### Häufige Probleme

#### Node.js nicht gefunden

```bash
# Node.js installieren
# https://nodejs.org/
```

#### npm nicht verfügbar

```bash
# npm überprüfen
npm --version

# Falls nicht verfügbar, Node.js neu installieren
```

#### Berechtigungsfehler

```bash
# Als Administrator ausführen
# Windows: Rechtsklick -> Als Administrator ausführen
# PowerShell: Start-Process powershell -Verb RunAs
```

#### Scheduler-Aufgabe funktioniert nicht

```bash
# Scheduler-Aufgabe überprüfen
schtasks /query /tn "LopezITWelt-MorgenRoutine"

# Scheduler-Aufgabe löschen und neu erstellen
schtasks /delete /tn "LopezITWelt-MorgenRoutine" /f
scripts\setup-scheduler.bat
```

### Logs überprüfen

```bash
# Windows-Ereignisanzeige
eventvwr.msc

# Scheduler-Logs
schtasks /query /tn "LopezITWelt-MorgenRoutine" /fo list
```

## Erweiterung

### Eigene Checks hinzufügen

Um eigene Prüfungen zur Morgen-Routine hinzuzufügen:

1. Öffne `scripts/morgen-routine.js`
2. Füge eine neue Methode hinzu:

```javascript
async customCheck() {
    console.log('🔧 Führe benutzerdefinierte Prüfung durch...');

    // Deine Prüfung hier
    try {
        // Prüfung durchführen
        console.log('  ✅ Benutzerdefinierte Prüfung erfolgreich');
    } catch (error) {
        console.log('  ❌ Benutzerdefinierte Prüfung fehlgeschlagen');
        this.logError('Benutzerdefinierte Prüfung fehlgeschlagen', error);
    }
}
```

3. Rufe die Methode in der `execute()`-Funktion auf:

```javascript
// Nach anderen Prüfungen
await this.customCheck();
```

### Benachrichtigungen

Um Benachrichtigungen bei Problemen zu erhalten:

```javascript
async sendNotification(message, type = 'info') {
    // E-Mail, Slack, Discord, etc.
    console.log(`📧 Benachrichtigung (${type}): ${message}`);
}
```

## Wartung

### Regelmäßige Wartung

- Überprüfe die Berichte wöchentlich
- Behebe gefundene Probleme zeitnah
- Aktualisiere Abhängigkeiten monatlich
- Teste die Morgen-Routine nach größeren Änderungen

### Backup der Konfiguration

```bash
# Scheduler-Aufgaben exportieren
schtasks /query /tn "LopezITWelt-*" /fo csv > scheduler-backup.csv

# Konfiguration sichern
cp scripts/morgen-routine.js scripts/morgen-routine.js.backup
```

## Support

Bei Problemen mit der Morgen-Routine:

1. Überprüfe die Konsolen-Ausgabe
2. Schaue in die Bericht-Datei
3. Prüfe die Windows-Ereignisanzeige
4. Kontaktiere das Entwicklungsteam

## Changelog

### Version 1.0.0 (2025-01-15)

- Erste Version der Morgen-Routine
- Grundlegende System- und Code-Qualitätsprüfungen
- i18n-Status-Überprüfung
- Automatische Optimierungen
- Bericht-Generierung
