#Requires -Version 5.1

<#
.SYNOPSIS
    Lopez IT Welt - Morgen-Routine für PowerShell
    
.DESCRIPTION
    Dieses Skript führt die tägliche Morgen-Routine für das Lopez IT Welt Projekt aus.
    
.PARAMETER ProjectPath
    Der Pfad zum Projekt (optional, wird automatisch erkannt)
    
.EXAMPLE
    .\morgen-routine.ps1
    
.EXAMPLE
    .\morgen-routine.ps1 -ProjectPath "C:\Projects\lopez-it-welt"
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
Write-Header "Lopez IT Welt - Morgen-Routine"

$startTime = Get-Date
Write-Info "Startzeit: $($startTime.ToString('dd.MM.yyyy HH:mm:ss'))"
Write-Host ""

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
        Write-Success "Node.js: $nodeVersion"
    }
    else {
        throw "Node.js nicht gefunden"
    }
}
catch {
    Write-Error "Node.js ist nicht installiert oder nicht im PATH!"
    exit 1
}

# npm prüfen
try {
    $npmVersion = npm --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Success "npm: $npmVersion"
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

# System-Status prüfen
Write-Info "Prüfe System-Status..."

# Speicherplatz prüfen
try {
    $drive = Get-WmiObject -Class Win32_LogicalDisk -Filter "DeviceID='$($ProjectPath.Substring(0,2))'"
    $freeSpaceGB = [math]::Round($drive.FreeSpace / 1GB, 2)
    Write-Success "Freier Speicherplatz: $freeSpaceGB GB"
}
catch {
    Write-Warning "Speicherplatz konnte nicht geprüft werden"
}

# Projektgröße berechnen
try {
    $projectSize = (Get-ChildItem -Path $ProjectPath -Recurse -File | Measure-Object -Property Length -Sum).Sum
    $projectSizeMB = [math]::Round($projectSize / 1MB, 2)
    Write-Success "Projektgröße: $projectSizeMB MB"
}
catch {
    Write-Warning "Projektgröße konnte nicht berechnet werden"
}

Write-Host ""

# Backup-Status prüfen
Write-Info "Prüfe Backup-Status..."
$backupDir = Join-Path $ProjectPath "backups"

if (Test-Path $backupDir) {
    try {
        $backupFiles = Get-ChildItem -Path $backupDir -File | Where-Object { $_.Extension -match '\.(json|zip)$' } | Sort-Object LastWriteTime -Descending
        
        if ($backupFiles.Count -gt 0) {
            $latestBackup = $backupFiles[0]
            $daysSinceBackup = (Get-Date) - $latestBackup.LastWriteTime
            $backupSizeMB = [math]::Round($latestBackup.Length / 1MB, 2)
            
            Write-Success "Letztes Backup: $($latestBackup.Name) (vor $($daysSinceBackup.Days) Tagen)"
            Write-Success "Backup-Größe: $backupSizeMB MB"
            
            if ($daysSinceBackup.Days -gt 7) {
                Write-Warning "Backup ist älter als 7 Tage"
            }
        }
        else {
            Write-Warning "Keine Backups gefunden"
        }
    }
    catch {
        Write-Warning "Backup-Status konnte nicht geprüft werden"
    }
}
else {
    Write-Warning "Backup-Verzeichnis nicht gefunden"
}

Write-Host ""

# Code-Qualität prüfen
Write-Info "Prüfe Code-Qualität..."

Set-Location $ProjectPath

# ESLint
try {
    npm run lint 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Success "ESLint-Prüfung bestanden"
    }
    else {
        Write-Warning "ESLint-Prüfung fehlgeschlagen"
    }
}
catch {
    Write-Warning "ESLint-Prüfung nicht verfügbar"
}

# TypeScript
try {
    npx tsc --noEmit 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Success "TypeScript-Kompilierung erfolgreich"
    }
    else {
        Write-Error "TypeScript-Kompilierung fehlgeschlagen"
    }
}
catch {
    Write-Warning "TypeScript-Kompilierung nicht verfügbar"
}

# Code-Metriken
try {
    $sourceFiles = Get-ChildItem -Path $ProjectPath -Recurse -Include "*.ts", "*.tsx", "*.js", "*.jsx" -File
    $totalLines = ($sourceFiles | Get-Content | Measure-Object -Line).Lines
    
    Write-Success "Code-Metriken: $($sourceFiles.Count) Dateien, $totalLines Zeilen"
}
catch {
    Write-Warning "Code-Metriken konnten nicht berechnet werden"
}

Write-Host ""

# i18n-Status prüfen
Write-Info "Prüfe i18n-Status..."
$i18nDir = Join-Path $ProjectPath "src\i18n\locales"

if (Test-Path $i18nDir) {
    try {
        $languageFiles = Get-ChildItem -Path $i18nDir -Filter "*.json" -File
        Write-Success "$($languageFiles.Count) Sprachdateien gefunden"
        
        $translations = @{}
        foreach ($file in $languageFiles) {
            $content = Get-Content -Path $file.FullName -Raw | ConvertFrom-Json
            $keys = Get-ObjectKeys -Object $content
            $translations[$file.Name] = $keys
            Write-Info "$($file.Name): $($keys.Count) Schlüssel"
        }
        
        # Konsistenz prüfen
        if ($translations.ContainsKey("de.json")) {
            $baseKeys = $translations["de.json"]
            $inconsistencies = 0
            
            foreach ($lang in $translations.Keys) {
                if ($lang -ne "de.json") {
                    $langKeys = $translations[$lang]
                    $missingKeys = $baseKeys | Where-Object { $_ -notin $langKeys }
                    $inconsistencies += $missingKeys.Count
                }
            }
            
            if ($inconsistencies -gt 0) {
                Write-Warning "$inconsistencies fehlende Übersetzungen"
            }
            else {
                Write-Success "Alle Übersetzungen konsistent"
            }
        }
    }
    catch {
        Write-Warning "i18n-Status konnte nicht geprüft werden"
    }
}
else {
    Write-Error "i18n-Verzeichnis nicht gefunden"
}

Write-Host ""

# Tests ausführen
Write-Info "Führe Tests aus..."

# Unit-Tests
try {
    npm test 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Unit-Tests bestanden"
    }
    else {
        Write-Error "Unit-Tests fehlgeschlagen"
    }
}
catch {
    Write-Warning "Unit-Tests nicht verfügbar"
}

# E2E-Tests
try {
    if (Test-Path (Join-Path $ProjectPath "cypress")) {
        npm run test:e2e 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Success "E2E-Tests bestanden"
        }
        else {
            Write-Warning "E2E-Tests fehlgeschlagen"
        }
    }
}
catch {
    Write-Warning "E2E-Tests nicht verfügbar"
}

Write-Host ""

# Build-Status prüfen
Write-Info "Prüfe Build-Status..."

try {
    npm run build 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Build erfolgreich"
    }
    else {
        Write-Error "Build fehlgeschlagen"
    }
}
catch {
    Write-Warning "Build-Skript nicht verfügbar"
}

Write-Host ""

# Optimierungen durchführen
Write-Info "Führe Optimierungen durch..."

# Cache bereinigen
try {
    $cacheDirs = @(".next", "node_modules\.cache", "dist")
    foreach ($cacheDir in $cacheDirs) {
        $cachePath = Join-Path $ProjectPath $cacheDir
        if (Test-Path $cachePath) {
            Remove-Item -Path $cachePath -Recurse -Force
            Write-Success "Cache bereinigt: $cacheDir"
        }
    }
}
catch {
    Write-Warning "Cache-Bereinigung fehlgeschlagen"
}

# Bundle-Analyse
try {
    if (Test-Path (Join-Path $ProjectPath "next.config.js")) {
        npm run analyze 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Bundle-Analyse durchgeführt"
        }
        else {
            Write-Warning "Bundle-Analyse nicht verfügbar"
        }
    }
}
catch {
    Write-Warning "Bundle-Analyse nicht verfügbar"
}

Write-Host ""

# Bericht generieren
Write-Info "Generiere Bericht..."

$endTime = Get-Date
$duration = $endTime - $startTime

$report = @{
    timestamp   = $startTime.ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
    duration    = "$($duration.Minutes)m $($duration.Seconds)s"
    status      = "completed"
    projectPath = $ProjectPath
    nodeVersion = $nodeVersion
    npmVersion  = $npmVersion
}

# Bericht speichern
$reportFile = Join-Path $ProjectPath "morgen-routine-report.json"
try {
    $report | ConvertTo-Json -Depth 10 | Set-Content -Path $reportFile -Encoding UTF8
    Write-Success "Bericht gespeichert: $reportFile"
}
catch {
    Write-Warning "Bericht konnte nicht gespeichert werden"
}

Write-Host ""
Write-Header "Morgen-Routine abgeschlossen"

Write-Success "Dauer: $($duration.Minutes)m $($duration.Seconds)s"
Write-Info "Bericht: $reportFile"

Write-Host ""
Write-Host "Nächste Schritte:" -ForegroundColor Yellow
Write-Host "1. Überprüfe den generierten Bericht" -ForegroundColor White
Write-Host "2. Behebe gefundene Probleme" -ForegroundColor White
Write-Host "3. Starte das Projekt mit: npm run dev" -ForegroundColor White

# Hilfsfunktion für Objekt-Schlüssel
function Get-ObjectKeys {
    param(
        [Parameter(Mandatory = $true)]
        [PSCustomObject]$Object,
        [string]$Prefix = ""
    )
    
    $keys = @()
    
    foreach ($property in $Object.PSObject.Properties) {
        $fullKey = if ($Prefix) { "$Prefix.$($property.Name)" } else { $property.Name }
        
        if ($property.Value -and $property.Value.GetType().Name -eq "PSCustomObject") {
            $keys += Get-ObjectKeys -Object $property.Value -Prefix $fullKey
        }
        else {
            $keys += $fullKey
        }
    }
    
    return $keys
} 