#Requires -Version 5.1
#Requires -RunAsAdministrator

<#
.SYNOPSIS
    Lopez IT Welt - Scheduler Setup für PowerShell
    
.DESCRIPTION
    Dieses Skript richtet automatische Scheduler-Aufgaben für das Lopez IT Welt Projekt ein.
    
.PARAMETER ProjectPath
    Der Pfad zum Projekt (optional, wird automatisch erkannt)
    
.EXAMPLE
    .\setup-scheduler.ps1
    
.EXAMPLE
    .\setup-scheduler.ps1 -ProjectPath "C:\Projects\lopez-it-welt"
#>

param(
    [string]$ProjectPath
)

# Funktionen
function Write-Header {
    param([string]$Title)
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "    $Title" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
}

function Write-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠️ $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ️ $Message" -ForegroundColor Blue
}

# Hauptskript
Write-Header "Lopez IT Welt - Scheduler Setup (PowerShell)"

# Projektpfad ermitteln
if (-not $ProjectPath) {
    $ProjectPath = Split-Path -Parent $PSScriptRoot
}

Write-Info "Projektpfad: $ProjectPath"

# Prüfe ob Projektpfad existiert
if (-not (Test-Path $ProjectPath)) {
    Write-Error "Projektpfad nicht gefunden: $ProjectPath"
    exit 1
}

# Node.js prüfen
try {
    $nodeVersion = node --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Node.js gefunden: $nodeVersion"
    }
    else {
        throw "Node.js nicht gefunden"
    }
}
catch {
    Write-Error "Node.js ist nicht installiert oder nicht im PATH!"
    Write-Info "Bitte installiere Node.js von https://nodejs.org/"
    exit 1
}

# npm prüfen
try {
    $npmVersion = npm --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Success "npm gefunden: $npmVersion"
    }
    else {
        throw "npm nicht gefunden"
    }
}
catch {
    Write-Error "npm ist nicht verfügbar!"
    exit 1
}

Write-Host ""

# Abhängigkeiten installieren
Write-Info "Installiere Abhängigkeiten..."
Set-Location $ProjectPath
try {
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Abhängigkeiten erfolgreich installiert!"
    }
    else {
        throw "npm install fehlgeschlagen"
    }
}
catch {
    Write-Error "Fehler beim Installieren der Abhängigkeiten!"
    exit 1
}

Write-Host ""

# Scheduler-Aufgaben erstellen
Write-Info "Erstelle Scheduler-Aufgaben..."

# Morgen-Routine (täglich um 8:00 Uhr)
Write-Info "Erstelle Morgen-Routine..."
$morgenRoutine = @{
    TaskName    = "LopezITWelt-MorgenRoutine"
    Action      = New-ScheduledTaskAction -Execute "node" -Argument "`"$ProjectPath\scripts\morgen-routine.js`""
    Trigger     = New-ScheduledTaskTrigger -Daily -At "08:00"
    Settings    = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries
    Description = "Tägliche Morgen-Routine für Lopez IT Welt"
}

try {
    Register-ScheduledTask @morgenRoutine -Force
    Write-Success "Morgen-Routine erstellt (täglich 8:00 Uhr)"
}
catch {
    Write-Warning "Fehler beim Erstellen der Morgen-Routine: $($_.Exception.Message)"
}

# Backup-Routine (täglich um 22:00 Uhr)
Write-Info "Erstelle Backup-Routine..."
$backupRoutine = @{
    TaskName    = "LopezITWelt-Backup"
    Action      = New-ScheduledTaskAction -Execute "node" -Argument "`"$ProjectPath\scripts\auto-backup.js`""
    Trigger     = New-ScheduledTaskTrigger -Daily -At "22:00"
    Settings    = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries
    Description = "Tägliche Backup-Routine für Lopez IT Welt"
}

try {
    Register-ScheduledTask @backupRoutine -Force
    Write-Success "Backup-Routine erstellt (täglich 22:00 Uhr)"
}
catch {
    Write-Warning "Fehler beim Erstellen der Backup-Routine: $($_.Exception.Message)"
}

# Quality-Check (wöchentlich Sonntag um 10:00 Uhr)
Write-Info "Erstelle Quality-Check-Routine..."
$qualityCheck = @{
    TaskName    = "LopezITWelt-QualityCheck"
    Action      = New-ScheduledTaskAction -Execute "node" -Argument "`"$ProjectPath\scripts\auto-quality-check.js`""
    Trigger     = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Sunday -At "10:00"
    Settings    = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries
    Description = "Wöchentlicher Quality-Check für Lopez IT Welt"
}

try {
    Register-ScheduledTask @qualityCheck -Force
    Write-Success "Quality-Check-Routine erstellt (wöchentlich Sonntag 10:00 Uhr)"
}
catch {
    Write-Warning "Fehler beim Erstellen der Quality-Check-Routine: $($_.Exception.Message)"
}

# i18n-Monitor (alle 2 Stunden)
Write-Info "Erstelle i18n-Monitor-Routine..."
$i18nMonitor = @{
    TaskName    = "LopezITWelt-I18nMonitor"
    Action      = New-ScheduledTaskAction -Execute "node" -Argument "`"$ProjectPath\scripts\i18n-monitor.js`""
    Trigger     = New-ScheduledTaskTrigger -Once -At (Get-Date) -RepetitionInterval (New-TimeSpan -Hours 2) -RepetitionDuration (New-TimeSpan -Days 365)
    Settings    = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries
    Description = "i18n-Monitor für Lopez IT Welt (alle 2 Stunden)"
}

try {
    Register-ScheduledTask @i18nMonitor -Force
    Write-Success "i18n-Monitor-Routine erstellt (alle 2 Stunden)"
}
catch {
    Write-Warning "Fehler beim Erstellen der i18n-Monitor-Routine: $($_.Exception.Message)"
}

# Auto-Optimize (täglich um 6:00 Uhr)
Write-Info "Erstelle Auto-Optimize-Routine..."
$autoOptimize = @{
    TaskName    = "LopezITWelt-AutoOptimize"
    Action      = New-ScheduledTaskAction -Execute "node" -Argument "`"$ProjectPath\scripts\auto-optimize.js`""
    Trigger     = New-ScheduledTaskTrigger -Daily -At "06:00"
    Settings    = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries
    Description = "Tägliche Auto-Optimize-Routine für Lopez IT Welt"
}

try {
    Register-ScheduledTask @autoOptimize -Force
    Write-Success "Auto-Optimize-Routine erstellt (täglich 6:00 Uhr)"
}
catch {
    Write-Warning "Fehler beim Erstellen der Auto-Optimize-Routine: $($_.Exception.Message)"
}

Write-Host ""

# Scheduler-Aufgaben anzeigen
Write-Info "Erstellte Scheduler-Aufgaben:"
try {
    Get-ScheduledTask -TaskName "LopezITWelt-*" | Format-Table -AutoSize
}
catch {
    Write-Warning "Fehler beim Anzeigen der Scheduler-Aufgaben"
}

Write-Host ""

# Startup-Skript erstellen
Write-Info "Erstelle Startup-Skript..."
$startupScript = Join-Path $ProjectPath "scripts\startup.ps1"
$startupContent = @"
#Requires -Version 5.1

`$ProjectPath = "$ProjectPath"
Set-Location `$ProjectPath

Write-Host "Starte Lopez IT Welt Services..." -ForegroundColor Green
node scripts/startup.js start

Write-Host "Services gestartet. Drücke eine beliebige Taste zum Beenden..." -ForegroundColor Yellow
`$null = `$Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
"@

try {
    Set-Content -Path $startupScript -Value $startupContent -Encoding UTF8
    Write-Success "Startup-Skript erstellt: $startupScript"
}
catch {
    Write-Warning "Fehler beim Erstellen des Startup-Skripts: $($_.Exception.Message)"
}

# Startup-Skript in Windows-Startup registrieren
Write-Info "Registriere Startup-Skript..."
try {
    $startupKey = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Run"
    Set-ItemProperty -Path $startupKey -Name "LopezITWelt" -Value "powershell.exe -ExecutionPolicy Bypass -File `"$startupScript`""
    Write-Success "Startup-Skript registriert"
}
catch {
    Write-Warning "Fehler beim Registrieren des Startup-Skripts: $($_.Exception.Message)"
}

Write-Host ""

# Zusammenfassung
Write-Header "Setup erfolgreich abgeschlossen!"

Write-Host "Nächste Schritte:" -ForegroundColor Yellow
Write-Host "1. Starte das Projekt mit: npm run dev" -ForegroundColor White
Write-Host "2. Überprüfe die Scheduler-Aufgaben im Task-Manager" -ForegroundColor White
Write-Host "3. Teste die automatischen Routinen" -ForegroundColor White
Write-Host ""

Write-Host "Scheduler-Aufgaben können verwaltet werden mit:" -ForegroundColor Yellow
Write-Host "- Get-ScheduledTask -TaskName 'LopezITWelt-*'" -ForegroundColor White
Write-Host "- Unregister-ScheduledTask -TaskName 'LopezITWelt-[AufgabeName]'" -ForegroundColor White
Write-Host ""

Write-Host "Erstellte Routinen:" -ForegroundColor Cyan
Write-Host "• Morgen-Routine: Täglich 8:00 Uhr" -ForegroundColor White
Write-Host "• Backup-Routine: Täglich 22:00 Uhr" -ForegroundColor White
Write-Host "• Quality-Check: Wöchentlich Sonntag 10:00 Uhr" -ForegroundColor White
Write-Host "• i18n-Monitor: Alle 2 Stunden" -ForegroundColor White
Write-Host "• Auto-Optimize: Täglich 6:00 Uhr" -ForegroundColor White
Write-Host ""

Write-Host "Drücke eine beliebige Taste zum Beenden..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 