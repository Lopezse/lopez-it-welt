# 🛡️ Professional Backup System für Lopez IT Welt
# Verwendet robocopy mit Exclusions und Cleanup

param(
    [string]$SourcePath = "D:\Projekte\lopez-it-welt",
    [string]$BackupRoot = "D:\Backups\LopezITWelt",
    [int]$RetentionDays = 7,
    [switch]$Verbose
)

# 🎨 Farben für bessere Übersicht
function Write-Success { param($Message) Write-Host "✅ $Message" -ForegroundColor Green }
function Write-Warning { param($Message) Write-Host "⚠️ $Message" -ForegroundColor Yellow }
function Write-Error { param($Message) Write-Host "❌ $Message" -ForegroundColor Red }
function Write-Info { param($Message) Write-Host "ℹ️ $Message" -ForegroundColor Cyan }

# 📅 Timestamp für Backup-Ordner
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$backupPath = Join-Path $BackupRoot "LopezITWelt_$timestamp"
$logFile = Join-Path $BackupRoot "backup.log"

# 📋 Backup-Konfiguration
$excludeDirs = @(
    "node_modules",
    ".git", 
    ".next",
    ".swc",
    "coverage",
    "backups",
    "temp-cleanup",
    "i18n-backups",
    "enterprise-reports"
)

$excludeFiles = @(
    "*.log",
    "*.tmp", 
    "*.bak",
    "*.cache",
    "Thumbs.db",
    ".DS_Store"
)

# 🚀 Hauptfunktion
function Start-ProfessionalBackup {
    Write-Info "🛡️ Starte Professional Backup System..."
    Write-Info "Quelle: $SourcePath"
    Write-Info "Ziel: $backupPath"
    Write-Info "Retention: $RetentionDays Tage"
    
    # 1. Prüfe Quellpfad
    if (-not (Test-Path $SourcePath)) {
        Write-Error "Quellpfad nicht gefunden: $SourcePath"
        exit 1
    }
    
    # 2. Erstelle Backup-Root
    if (-not (Test-Path $BackupRoot)) {
        New-Item -ItemType Directory -Path $BackupRoot -Force | Out-Null
        Write-Success "Backup-Root erstellt: $BackupRoot"
    }
    
    # 3. Erstelle Backup-Ordner
    New-Item -ItemType Directory -Path $backupPath -Force | Out-Null
    Write-Success "Backup-Ordner erstellt: $backupPath"
    
    # 4. Baue robocopy-Befehl
    $robocopyArgs = @(
        "`"$SourcePath`"",
        "`"$backupPath`"",
        "/MIR", # Spiegelt Verzeichnis
        "/R:1", # 1 Retry bei Fehler
        "/W:1", # 1 Sekunde warten
        "/NFL", # Keine Dateiliste
        "/NDL", # Keine Verzeichnisliste
        "/NP", # Keine Fortschrittsanzeige
        "/NJH", # Keine Job-Header
        "/NJS", # Keine Job-Summary
        "/NC", # Keine Klassen
        "/NS", # Keine Größen
        "/TEE"            # Output zu Konsole und Log
    )
    
    # Exclude Directories
    foreach ($dir in $excludeDirs) {
        $robocopyArgs += "/XD"
        $robocopyArgs += "`"$dir`""
    }
    
    # Exclude Files
    foreach ($file in $excludeFiles) {
        $robocopyArgs += "/XF"
        $robocopyArgs += "`"$file`""
    }
    
    # 5. Führe Backup aus
    Write-Info "🔄 Starte robocopy..."
    $robocopyCmd = "robocopy " + ($robocopyArgs -join " ")
    
    if ($Verbose) {
        Write-Info "Befehl: $robocopyCmd"
    }
    
    # Backup mit Logging
    $startTime = Get-Date
    $logEntry = "=== BACKUP START: $startTime ==="
    Add-Content -Path $logFile -Value $logEntry
    
    try {
        $result = Invoke-Expression $robocopyCmd
        $endTime = Get-Date
        $duration = $endTime - $startTime
        
        # robocopy Exit Codes interpretieren
        if ($result -le 7) {
            Write-Success "Backup erfolgreich abgeschlossen in $($duration.TotalSeconds.ToString('F1')) Sekunden"
            $logEntry = "✅ BACKUP SUCCESS: $endTime (Dauer: $($duration.TotalSeconds.ToString('F1'))s)"
        }
        else {
            Write-Warning "Backup mit Warnungen abgeschlossen (Exit Code: $result)"
            $logEntry = "⚠️ BACKUP WARNING: $endTime (Exit Code: $result)"
        }
        
        Add-Content -Path $logFile -Value $logEntry
        
    }
    catch {
        Write-Error "Backup fehlgeschlagen: $($_.Exception.Message)"
        $logEntry = "❌ BACKUP FAILED: $endTime - $($_.Exception.Message)"
        Add-Content -Path $logFile -Value $logEntry
        exit 1
    }
    
    # 6. Cleanup alte Backups
    Write-Info "🧹 Bereinige alte Backups..."
    Remove-OldBackups
    
    # 7. Backup-Statistik
    Show-BackupStats
    
    Write-Success "🎯 Professional Backup abgeschlossen!"
}

# 🧹 Cleanup-Funktion
function Remove-OldBackups {
    try {
        $backups = Get-ChildItem -Path $BackupRoot -Directory | 
        Where-Object { $_.Name -like "LopezITWelt_*" } |
        Sort-Object CreationTime -Descending
        
        if ($backups.Count -gt $RetentionDays) {
            $toDelete = $backups | Select-Object -Skip $RetentionDays
            
            foreach ($backup in $toDelete) {
                Write-Info "🗑️ Lösche altes Backup: $($backup.Name)"
                Remove-Item -Path $backup.FullName -Recurse -Force
                Add-Content -Path $logFile -Value "🗑️ DELETED: $($backup.Name)"
            }
            
            Write-Success "$($toDelete.Count) alte Backups gelöscht"
        }
        else {
            Write-Info "Keine alten Backups zu löschen"
        }
    }
    catch {
        Write-Warning "Cleanup fehlgeschlagen: $($_.Exception.Message)"
    }
}

# 📊 Backup-Statistik
function Show-BackupStats {
    try {
        $backupSize = (Get-ChildItem -Path $backupPath -Recurse -File | 
            Measure-Object -Property Length -Sum).Sum
        
        $backupSizeMB = [math]::Round($backupSize / 1MB, 2)
        
        Write-Info "📊 Backup-Statistik:"
        Write-Info "  Größe: $backupSizeMB MB"
        Write-Info "  Pfad: $backupPath"
        Write-Info "  Log: $logFile"
        
        # Zeige verfügbare Backups
        $availableBackups = Get-ChildItem -Path $BackupRoot -Directory | 
        Where-Object { $_.Name -like "LopezITWelt_*" } |
        Sort-Object CreationTime -Descending
        
        Write-Info "  Verfügbare Backups: $($availableBackups.Count)"
        
    }
    catch {
        Write-Warning "Statistik konnte nicht erstellt werden"
    }
}

# 🚀 Hauptausführung
try {
    Start-ProfessionalBackup
}
catch {
    Write-Error "Kritischer Fehler: $($_.Exception.Message)"
    Add-Content -Path $logFile -Value "💥 CRITICAL ERROR: $($_.Exception.Message)"
    exit 1
} 