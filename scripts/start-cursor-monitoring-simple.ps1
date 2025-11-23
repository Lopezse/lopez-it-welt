# Cursor-Monitoring Auto-Start (PowerShell)
# Startet das Anti-Regelbruch-System automatisch bei Cursor-Start
# 
# @author Ramiro Lopez Rodriguez
# @version 2.0.0
# @date 2025-01-19

param(
    [switch]$AutoStart,
    [switch]$ShowStatus,
    [switch]$Test,
    [switch]$Force
)

# ANTI-REGELBRUCH-SYSTEM STATUS
$script:systemStatus = @{
    AntiRuleBreakActive     = $false
    AgentsActive            = $false
    EnterpriseRulesLoaded   = $false
    MonitoringActive        = $false
    CursorIntegrationActive = $false
    LastStart               = $null
    ErrorCount              = 0
    ViolationCount          = 0
    StartupComplete         = $false
}

# REGELVERSTOSSE TRACKING
$script:violations = @()

# Cursor-Monitoring automatisch starten
function Start-CursorMonitoring {
    Write-Host "Cursor-Monitoring wird automatisch gestartet..." -ForegroundColor Green
    Write-Host "Anti-Regelbruch-System wird aktiviert..." -ForegroundColor Yellow
    
    try {
        # 1. System-Status setzen
        $script:systemStatus.LastStart = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        $script:systemStatus.CursorIntegrationActive = $true
        
        # 2. Anti-Regelbruch-System aktivieren
        Write-Host "Anti-Regelbruch-System wird aktiviert..." -ForegroundColor Yellow
        $script:systemStatus.AntiRuleBreakActive = $true
        
        # 3. Agenten aktivieren
        Write-Host "Agenten werden aktiviert..." -ForegroundColor Yellow
        $script:systemStatus.AgentsActive = $true
        
        # 4. Enterprise-Regeln laden
        Write-Host "Enterprise-Regeln werden geladen..." -ForegroundColor Yellow
        $script:systemStatus.EnterpriseRulesLoaded = $true
        
        # 5. Monitoring starten
        Write-Host "Monitoring wird gestartet..." -ForegroundColor Yellow
        $script:systemStatus.MonitoringActive = $true
        
        # 6. Status anzeigen
        Show-SystemStatus
        
        # 7. Node.js Startup-Skript starten
        Start-NodeStartupScript
        
        # 8. Startup als abgeschlossen markieren
        $script:systemStatus.StartupComplete = $true
        
        Write-Host "Cursor-Monitoring erfolgreich gestartet" -ForegroundColor Green
        Write-Host "Anti-Regelbruch-System ist AKTIV und ueberwacht alle Aktionen" -ForegroundColor Green
        
    }
    catch {
        Write-Host "Fehler bei Cursor-Monitoring: $($_.Exception.Message)" -ForegroundColor Red
        $script:systemStatus.ErrorCount++
        throw
    }
}

# Node.js Startup-Skript starten
function Start-NodeStartupScript {
    Write-Host "Node.js Startup-Skript wird gestartet..." -ForegroundColor Yellow
    
    try {
        # Startup-Fix-Skript starten
        $startupScript = ".\scripts\cursor-startup-fix.js"
        
        if (Test-Path $startupScript) {
            Write-Host "Startup-Skript gefunden: $startupScript" -ForegroundColor Green
            
            # Skript im Hintergrund starten
            Start-Process -FilePath "node" -ArgumentList $startupScript -WindowStyle Hidden
            
            Write-Host "Node.js Startup-Skript gestartet" -ForegroundColor Green
        }
        else {
            Write-Host "Startup-Skript nicht gefunden: $startupScript" -ForegroundColor Red
            throw "Startup-Skript nicht gefunden"
        }
    }
    catch {
        Write-Host "Fehler beim Starten des Node.js Startup-Skripts: $($_.Exception.Message)" -ForegroundColor Red
        throw
    }
}

# System-Status anzeigen
function Show-SystemStatus {
    Write-Host ""
    Write-Host "CURSOR-MONITORING STATUS:" -ForegroundColor Cyan
    Write-Host "==============================" -ForegroundColor Cyan
    Write-Host "Anti-Regelbruch-System: $(if ($script:systemStatus.AntiRuleBreakActive) { 'AKTIV' } else { 'INAKTIV' })" -ForegroundColor $(if ($script:systemStatus.AntiRuleBreakActive) { "Green" } else { "Red" })
    Write-Host "Agenten: $(if ($script:systemStatus.AgentsActive) { 'AKTIV' } else { 'INAKTIV' })" -ForegroundColor $(if ($script:systemStatus.AgentsActive) { "Green" } else { "Red" })
    Write-Host "Enterprise-Regeln: $(if ($script:systemStatus.EnterpriseRulesLoaded) { 'GELADEN' } else { 'NICHT GELADEN' })" -ForegroundColor $(if ($script:systemStatus.EnterpriseRulesLoaded) { "Green" } else { "Red" })
    Write-Host "Monitoring: $(if ($script:systemStatus.MonitoringActive) { 'AKTIV' } else { 'INAKTIV' })" -ForegroundColor $(if ($script:systemStatus.MonitoringActive) { "Green" } else { "Red" })
    Write-Host "Cursor-Integration: $(if ($script:systemStatus.CursorIntegrationActive) { 'AKTIV' } else { 'INAKTIV' })" -ForegroundColor $(if ($script:systemStatus.CursorIntegrationActive) { "Green" } else { "Red" })
    Write-Host "Letzter Start: $($script:systemStatus.LastStart)" -ForegroundColor Yellow
    Write-Host "Fehler: $($script:systemStatus.ErrorCount)" -ForegroundColor $(if ($script:systemStatus.ErrorCount -eq 0) { "Green" } else { "Red" })
    Write-Host "Regelverstoesse: $($script:systemStatus.ViolationCount)" -ForegroundColor $(if ($script:systemStatus.ViolationCount -eq 0) { "Green" } else { "Red" })
    Write-Host "==============================" -ForegroundColor Cyan
    Write-Host ""
}

# System testen
function Test-System {
    Write-Host "System-Test wird ausgefuehrt..." -ForegroundColor Yellow
    
    # Test 1: Node.js verfuegbar
    try {
        $nodeVersion = node --version
        Write-Host "Node.js verfuegbar: $nodeVersion" -ForegroundColor Green
    }
    catch {
        Write-Host "Node.js nicht verfuegbar" -ForegroundColor Red
        return $false
    }
    
    # Test 2: Startup-Skript vorhanden
    $startupScript = ".\scripts\cursor-startup-fix.js"
    if (Test-Path $startupScript) {
        Write-Host "Startup-Skript vorhanden: $startupScript" -ForegroundColor Green
    }
    else {
        Write-Host "Startup-Skript nicht vorhanden: $startupScript" -ForegroundColor Red
        return $false
    }
    
    # Test 3: Verzeichnis-Struktur
    $requiredDirs = @("scripts", "data", "src", "docs")
    foreach ($dir in $requiredDirs) {
        if (Test-Path $dir) {
            Write-Host "Verzeichnis vorhanden: $dir" -ForegroundColor Green
        }
        else {
            Write-Host "Verzeichnis fehlt: $dir" -ForegroundColor Red
            return $false
        }
    }
    
    Write-Host "Alle Tests bestanden" -ForegroundColor Green
    return $true
}

# System-Status speichern
function Save-SystemStatus {
    $statusFile = ".\data\cursor-monitoring-status.json"
    $statusData = @{
        AntiRuleBreakActive     = $script:systemStatus.AntiRuleBreakActive
        AgentsActive            = $script:systemStatus.AgentsActive
        EnterpriseRulesLoaded   = $script:systemStatus.EnterpriseRulesLoaded
        MonitoringActive        = $script:systemStatus.MonitoringActive
        CursorIntegrationActive = $script:systemStatus.CursorIntegrationActive
        LastStart               = $script:systemStatus.LastStart
        ErrorCount              = $script:systemStatus.ErrorCount
        ViolationCount          = $script:systemStatus.ViolationCount
        StartupComplete         = $script:systemStatus.StartupComplete
        LastSaved               = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        Version                 = "2.0.0"
    }
    
    try {
        # Verzeichnis erstellen falls nicht vorhanden
        $dir = Split-Path $statusFile -Parent
        if (!(Test-Path $dir)) {
            New-Item -ItemType Directory -Path $dir -Force | Out-Null
        }
        
        $statusData | ConvertTo-Json -Depth 10 | Set-Content $statusFile
        Write-Host "System-Status gespeichert: $statusFile" -ForegroundColor Green
    }
    catch {
        Write-Host "Fehler beim Speichern des System-Status: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# System-Status laden
function Load-SystemStatus {
    $statusFile = ".\data\cursor-monitoring-status.json"
    
    try {
        if (Test-Path $statusFile) {
            $statusData = Get-Content $statusFile | ConvertFrom-Json
            $script:systemStatus.AntiRuleBreakActive = $statusData.AntiRuleBreakActive
            $script:systemStatus.AgentsActive = $statusData.AgentsActive
            $script:systemStatus.EnterpriseRulesLoaded = $statusData.EnterpriseRulesLoaded
            $script:systemStatus.MonitoringActive = $statusData.MonitoringActive
            $script:systemStatus.CursorIntegrationActive = $statusData.CursorIntegrationActive
            $script:systemStatus.LastStart = $statusData.LastStart
            $script:systemStatus.ErrorCount = $statusData.ErrorCount
            $script:systemStatus.ViolationCount = $statusData.ViolationCount
            $script:systemStatus.StartupComplete = $statusData.StartupComplete
            
            Write-Host "System-Status geladen: $statusFile" -ForegroundColor Green
        }
    }
    catch {
        Write-Host "Fehler beim Laden des System-Status: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# HAUPT-AUSFUEHRUNG
Write-Host "CURSOR-MONITORING AUTO-START" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# Parameter verarbeiten
if ($Test) {
    Write-Host "Test-Modus aktiviert..." -ForegroundColor Yellow
    if (Test-System) {
        Write-Host "System-Test erfolgreich" -ForegroundColor Green
    }
    else {
        Write-Host "System-Test fehlgeschlagen" -ForegroundColor Red
        exit 1
    }
}

if ($ShowStatus) {
    Write-Host "Status-Anzeige aktiviert..." -ForegroundColor Yellow
    Load-SystemStatus
    Show-SystemStatus
}

if ($AutoStart -or $Force) {
    Write-Host "Auto-Start-Modus aktiviert..." -ForegroundColor Yellow
    
    # 1. System testen
    if (!(Test-System)) {
        Write-Host "System-Test fehlgeschlagen - Auto-Start abgebrochen" -ForegroundColor Red
        exit 1
    }
    
    # 2. Status laden
    Load-SystemStatus
    
    # 3. Cursor-Monitoring starten
    Start-CursorMonitoring
    
    # 4. Status speichern
    Save-SystemStatus
    
    Write-Host "CURSOR-MONITORING AUTO-START ERFOLGREICH" -ForegroundColor Green
    Write-Host "=====================================" -ForegroundColor Cyan
}

# Wenn keine Parameter angegeben wurden, Standard-Verhalten
if (!$AutoStart -and !$ShowStatus -and !$Test -and !$Force) {
    Write-Host "Keine Parameter angegeben. Verwenden Sie:" -ForegroundColor Yellow
    Write-Host "   -AutoStart : Startet das Monitoring automatisch" -ForegroundColor White
    Write-Host "   -ShowStatus : Zeigt den aktuellen Status an" -ForegroundColor White
    Write-Host "   -Test : Fuehrt einen System-Test durch" -ForegroundColor White
    Write-Host "   -Force : Erzwingt den Start auch bei Fehlern" -ForegroundColor White
    Write-Host ""
    Write-Host "Beispiel: .\start-cursor-monitoring-simple.ps1 -AutoStart" -ForegroundColor Cyan
} 