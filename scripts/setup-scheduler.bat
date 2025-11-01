@echo off
setlocal enabledelayedexpansion

echo ========================================
echo    Lopez IT Welt - Scheduler Setup
echo ========================================
echo.

:: Prüfe Administrator-Rechte
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ERROR: Administrator-Rechte erforderlich!
    echo Bitte führe dieses Skript als Administrator aus.
    pause
    exit /b 1
)

:: Projektpfad ermitteln
set "PROJECT_PATH=%~dp0.."
set "PROJECT_PATH=%PROJECT_PATH:~0,-1%"

echo Projektpfad: %PROJECT_PATH%
echo.

:: Prüfe ob Projektpfad existiert
if not exist "%PROJECT_PATH%" (
    echo ERROR: Projektpfad nicht gefunden: %PROJECT_PATH%
    pause
    exit /b 1
)

:: Node.js prüfen
node --version >nul 2>&1
if %errorLevel% neq 0 (
    echo ERROR: Node.js ist nicht installiert oder nicht im PATH!
    echo Bitte installiere Node.js von https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js gefunden: 
node --version
echo.

:: npm prüfen
npm --version >nul 2>&1
if %errorLevel% neq 0 (
    echo ERROR: npm ist nicht verfügbar!
    pause
    exit /b 1
)

echo npm gefunden:
npm --version
echo.

:: Abhängigkeiten installieren
echo Installiere Abhängigkeiten...
cd /d "%PROJECT_PATH%"
npm install
if %errorLevel% neq 0 (
    echo ERROR: Fehler beim Installieren der Abhängigkeiten!
    pause
    exit /b 1
)

echo.
echo Abhängigkeiten erfolgreich installiert!
echo.

:: Scheduler-Aufgaben erstellen
echo Erstelle Scheduler-Aufgaben...
echo.

:: Morgen-Routine (täglich um 8:00 Uhr)
echo Erstelle Morgen-Routine...
schtasks /create /tn "LopezITWelt-MorgenRoutine" /tr "node \"%PROJECT_PATH%\scripts\morgen-routine.js\"" /sc daily /st 08:00 /f
if %errorLevel% equ 0 (
    echo ✅ Morgen-Routine erstellt (täglich 8:00 Uhr)
) else (
    echo ⚠️ Fehler beim Erstellen der Morgen-Routine
)

:: Backup-Routine (täglich um 22:00 Uhr)
echo Erstelle Backup-Routine...
schtasks /create /tn "LopezITWelt-Backup" /tr "node \"%PROJECT_PATH%\scripts\auto-backup.js\"" /sc daily /st 22:00 /f
if %errorLevel% equ 0 (
    echo ✅ Backup-Routine erstellt (täglich 22:00 Uhr)
) else (
    echo ⚠️ Fehler beim Erstellen der Backup-Routine
)

:: Quality-Check (wöchentlich Sonntag um 10:00 Uhr)
echo Erstelle Quality-Check-Routine...
schtasks /create /tn "LopezITWelt-QualityCheck" /tr "node \"%PROJECT_PATH%\scripts\auto-quality-check.js\"" /sc weekly /d SUN /st 10:00 /f
if %errorLevel% equ 0 (
    echo ✅ Quality-Check-Routine erstellt (wöchentlich Sonntag 10:00 Uhr)
) else (
    echo ⚠️ Fehler beim Erstellen der Quality-Check-Routine
)

:: i18n-Monitor (alle 2 Stunden)
echo Erstelle i18n-Monitor-Routine...
schtasks /create /tn "LopezITWelt-I18nMonitor" /tr "node \"%PROJECT_PATH%\scripts\i18n-monitor.js\"" /sc hourly /mo 2 /f
if %errorLevel% equ 0 (
    echo ✅ i18n-Monitor-Routine erstellt (alle 2 Stunden)
) else (
    echo ⚠️ Fehler beim Erstellen der i18n-Monitor-Routine
)

echo.
echo ========================================
echo    Scheduler-Setup abgeschlossen
echo ========================================
echo.

:: Scheduler-Aufgaben anzeigen
echo Erstellte Scheduler-Aufgaben:
schtasks /query /tn "LopezITWelt-*" /fo table
echo.

:: Startup-Skript erstellen
echo Erstelle Startup-Skript...
set "STARTUP_SCRIPT=%PROJECT_PATH%\scripts\startup.bat"
(
echo @echo off
echo cd /d "%PROJECT_PATH%"
echo echo Starte Lopez IT Welt Services...
echo node scripts/startup.js start
echo pause
) > "%STARTUP_SCRIPT%"

:: Startup-Skript in Windows-Startup registrieren
echo Registriere Startup-Skript...
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Run" /v "LopezITWelt" /t REG_SZ /d "\"%STARTUP_SCRIPT%\"" /f
if %errorLevel% equ 0 (
    echo ✅ Startup-Skript registriert
) else (
    echo ⚠️ Fehler beim Registrieren des Startup-Skripts
)

echo.
echo ========================================
echo    Setup erfolgreich abgeschlossen!
echo ========================================
echo.
echo Nächste Schritte:
echo 1. Starte das Projekt mit: npm run dev
echo 2. Überprüfe die Scheduler-Aufgaben im Task-Manager
echo 3. Teste die automatischen Routinen
echo.
echo Scheduler-Aufgaben können verwaltet werden mit:
echo - schtasks /query /tn "LopezITWelt-*"
echo - schtasks /delete /tn "LopezITWelt-[AufgabeName]"
echo.
pause 