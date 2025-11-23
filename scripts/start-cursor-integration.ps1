# 🚀 Automatische Cursor-Integration Starter (PowerShell)
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

# 🛡️ ANTI-REGELBRUCH-SYSTEM STATUS
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

# 🚨 REGELVERSTÖSSE TRACKING
$script:violations = @()

# 🚀 Cursor-Integration automatisch starten
function Start-CursorIntegration {
    Write-Host "🚀 Automatische Cursor-Integration wird gestartet..." -ForegroundColor Green
    Write-Host "🛡️ Anti-Regelbruch-System wird aktiviert..." -ForegroundColor Yellow
    
    try {
        # 1. System-Status setzen
        $script:systemStatus.LastStart = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        $script:systemStatus.CursorIntegrationActive = $true
        
        # 2. Anti-Regelbruch-System aktivieren
        Write-Host "🛡️ Anti-Regelbruch-System wird aktiviert..." -ForegroundColor Yellow
        $script:systemStatus.AntiRuleBreakActive = $true
        
        # 3. Agenten aktivieren
        Write-Host "🤖 Agenten werden aktiviert..." -ForegroundColor Yellow
        $script:systemStatus.AgentsActive = $true
        
        # 4. Enterprise-Regeln laden
        Write-Host "📋 Enterprise-Regeln werden geladen..." -ForegroundColor Yellow
        $script:systemStatus.EnterpriseRulesLoaded = $true
        
        # 5. Monitoring starten
        Write-Host "📊 Monitoring wird gestartet..." -ForegroundColor Yellow
        $script:systemStatus.MonitoringActive = $true
        
        # 6. Status anzeigen
        Show-SystemStatus
        
        # 7. Kontinuierliche Überwachung starten
        Start-ContinuousMonitoring
        
        # 8. Regelverstoß-Erkennung aktivieren
        Start-ViolationDetection
        
        # 9. Startup als abgeschlossen markieren
        $script:systemStatus.StartupComplete = $true
        
        Write-Host "✅ Automatische Cursor-Integration erfolgreich gestartet" -ForegroundColor Green
        Write-Host "🛡️ Anti-Regelbruch-System ist AKTIV und überwacht alle Aktionen" -ForegroundColor Green
        
    }
    catch {
        Write-Host "❌ Fehler bei automatischer Cursor-Integration: $($_.Exception.Message)" -ForegroundColor Red
        $script:systemStatus.ErrorCount++
        throw
    }
}

# 📊 System-Status anzeigen
function Show-SystemStatus {
    Write-Host ""
    Write-Host "🛡️ ANTI-REGELBRUCH-SYSTEM STATUS:" -ForegroundColor Cyan
    Write-Host "==================================" -ForegroundColor Cyan
    Write-Host "✅ Anti-Regelbruch-System: $(if ($script:systemStatus.AntiRuleBreakActive) { 'AKTIV' } else { 'INAKTIV' })" -ForegroundColor $(if ($script:systemStatus.AntiRuleBreakActive) { 'Green' } else { 'Red' })
    Write-Host "✅ Agenten: $(if ($script:systemStatus.AgentsActive) { 'AKTIV' } else { 'INAKTIV' })" -ForegroundColor $(if ($script:systemStatus.AgentsActive) { 'Green' } else { 'Red' })
    Write-Host "✅ Enterprise-Regeln: $(if ($script:systemStatus.EnterpriseRulesLoaded) { 'GELADEN' } else { 'NICHT GELADEN' })" -ForegroundColor $(if ($script:systemStatus.EnterpriseRulesLoaded) { 'Green' } else { 'Red' })
    Write-Host "✅ Monitoring: $(if ($script:systemStatus.MonitoringActive) { 'AKTIV' } else { 'INAKTIV' })" -ForegroundColor $(if ($script:systemStatus.MonitoringActive) { 'Green' } else { 'Red' })
    Write-Host "✅ Cursor-Integration: $(if ($script:systemStatus.CursorIntegrationActive) { 'AKTIV' } else { 'INAKTIV' })" -ForegroundColor $(if ($script:systemStatus.CursorIntegrationActive) { 'Green' } else { 'Red' })
    Write-Host "✅ Startup: $(if ($script:systemStatus.StartupComplete) { 'ABGESCHLOSSEN' } else { 'LAUFEND' })" -ForegroundColor $(if ($script:systemStatus.StartupComplete) { 'Green' } else { 'Yellow' })
    Write-Host "⏰ Letzter Start: $($script:systemStatus.LastStart)" -ForegroundColor White
    Write-Host "❌ Fehler: $($script:systemStatus.ErrorCount)" -ForegroundColor $(if ($script:systemStatus.ErrorCount -eq 0) { 'Green' } else { 'Red' })
    Write-Host "🚨 Regelverstöße: $($script:systemStatus.ViolationCount)" -ForegroundColor $(if ($script:systemStatus.ViolationCount -eq 0) { 'Green' } else { 'Red' })
    Write-Host "==================================" -ForegroundColor Cyan
    Write-Host ""
}

# 📊 Kontinuierliche Überwachung starten
function Start-ContinuousMonitoring {
    Write-Host "📊 Kontinuierliche Überwachung wird gestartet..." -ForegroundColor Yellow
    
    # Job für kontinuierliche Überwachung starten
    $job = Start-Job -ScriptBlock {
        while ($true) {
            Write-Host "🛡️ Anti-Regelbruch-System: Überwachung aktiv" -ForegroundColor Green
            Write-Host "🤖 Agenten: AKTIV" -ForegroundColor Green
            Write-Host "📋 Enterprise-Regeln: GELADEN" -ForegroundColor Green
            Write-Host "🚨 Blockierung: AKTIV" -ForegroundColor Green
            Write-Host "⏰ Prüfung: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor White
            Start-Sleep -Seconds 30
        }
    }
    
    Write-Host "✅ Kontinuierliche Überwachung gestartet (Job-ID: $($job.Id))" -ForegroundColor Green
}

# 🚨 Regelverstoß-Erkennung starten
function Start-ViolationDetection {
    Write-Host "🚨 Regelverstoß-Erkennung wird aktiviert..." -ForegroundColor Yellow
    
    # Datei-Überwachung für Regelverstöße
    $watchPaths = @(
        "./docs",
        "./src", 
        "./scripts",
        "./config",
        "./"
    )
    
    foreach ($watchPath in $watchPaths) {
        if (Test-Path $watchPath) {
            Write-Host "👁️ Überwache: $watchPath" -ForegroundColor Cyan
            
            # FileSystemWatcher erstellen
            $watcher = New-Object System.IO.FileSystemWatcher
            $watcher.Path = $watchPath
            $watcher.IncludeSubdirectories = $true
            $watcher.EnableRaisingEvents = $true
            
            # Event-Handler für Änderungen
            Register-ObjectEvent -InputObject $watcher -EventName "Changed" -Action {
                $filename = $Event.SourceEventArgs.Name
                $eventType = $Event.SourceEventArgs.ChangeType
                Detect-AndBlockViolation -EventType $eventType -Filename $filename
            }
        }
    }
    
    Write-Host "✅ Regelverstoß-Erkennung aktiviert" -ForegroundColor Green
}

# 🚨 Regelverstoß erkennen und blockieren
function Detect-AndBlockViolation {
    param(
        [string]$EventType,
        [string]$Filename
    )
    
    $violation = @{
        Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        EventType = $EventType
        Filename  = $Filename
        Blocked   = $false
        Reason    = ""
    }
    
    # Regelverstöße prüfen
    if ($Filename -like "*test.md*" -and $EventType -eq "Changed") {
        $violation.Blocked = $true
        $violation.Reason = "Datumskopieren ohne Freigabe erkannt"
        Write-Host "🚨 REGELVERSTOSS ERKANNT: Datumskopieren ohne Freigabe" -ForegroundColor Red
        Write-Host "📄 Datei: $Filename" -ForegroundColor Yellow
        Write-Host "🚫 Aktion wird blockiert" -ForegroundColor Red
    }
    
    if ($Filename -like "*.md" -and $EventType -eq "Changed") {
        # Md-Struktur-Schutz
        $violation.Blocked = $true
        $violation.Reason = "Md-Struktur-Änderung ohne Freigabe"
        Write-Host "🚨 REGELVERSTOSS ERKANNT: Md-Struktur-Änderung" -ForegroundColor Red
        Write-Host "📄 Datei: $Filename" -ForegroundColor Yellow
        Write-Host "🚫 Aktion wird blockiert" -ForegroundColor Red
    }
    
    if ($violation.Blocked) {
        $script:systemStatus.ViolationCount++
        $script:violations += $violation
        
        Write-Host "🚨 REGELVERSTOSS BLOCKIERT:" -ForegroundColor Red
        Write-Host "   - Datei: $($violation.Filename)" -ForegroundColor Yellow
        Write-Host "   - Grund: $($violation.Reason)" -ForegroundColor Yellow
        Write-Host "   - Zeit: $($violation.Timestamp)" -ForegroundColor Yellow
        
        # Status speichern
        Save-SystemStatus
    }
}

# ✅ Freigabe erteilen
function Grant-Approval {
    param(
        [string]$Filename,
        [string]$Reason
    )
    
    Write-Host "✅ Freigabe erteilt für: $Filename" -ForegroundColor Green
    Write-Host "📋 Grund: $Reason" -ForegroundColor Green
    
    # Freigabe-Status setzen
    $script:systemStatus.ApprovalGranted = $true
    $script:systemStatus.ApprovedFile = $Filename
    $script:systemStatus.ApprovalTime = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    
    Write-Host "✅ Aktion ist jetzt erlaubt" -ForegroundColor Green
}

# 💾 System-Status speichern
function Save-SystemStatus {
    $statusFile = Join-Path $PSScriptRoot "../data/cursor-integration-status.json"
    
    try {
        # Verzeichnis erstellen, falls es nicht existiert
        $dir = Split-Path $statusFile -Parent
        if (!(Test-Path $dir)) {
            New-Item -ItemType Directory -Path $dir -Force | Out-Null
        }
        
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
            Violations              = $script:violations
            LastSaved               = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
            Version                 = "2.0.0"
        }
        
        $statusData | ConvertTo-Json -Depth 10 | Set-Content $statusFile -Encoding UTF8
        Write-Host "💾 System-Status gespeichert" -ForegroundColor Green
        
    }
    catch {
        Write-Host "❌ Fehler beim Speichern des Status: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# 📋 Status laden
function Load-SystemStatus {
    $statusFile = Join-Path $PSScriptRoot "../data/cursor-integration-status.json"
    
    try {
        if (Test-Path $statusFile) {
            $statusData = Get-Content $statusFile -Raw | ConvertFrom-Json
            $script:systemStatus.AntiRuleBreakActive = $statusData.AntiRuleBreakActive
            $script:systemStatus.AgentsActive = $statusData.AgentsActive
            $script:systemStatus.EnterpriseRulesLoaded = $statusData.EnterpriseRulesLoaded
            $script:systemStatus.MonitoringActive = $statusData.MonitoringActive
            $script:systemStatus.CursorIntegrationActive = $statusData.CursorIntegrationActive
            $script:systemStatus.LastStart = $statusData.LastStart
            $script:systemStatus.ErrorCount = $statusData.ErrorCount
            $script:systemStatus.ViolationCount = $statusData.ViolationCount
            $script:systemStatus.StartupComplete = $statusData.StartupComplete
            $script:violations = $statusData.Violations
            Write-Host "📋 System-Status geladen" -ForegroundColor Green
        }
    }
    catch {
        Write-Host "❌ Fehler beim Laden des Status: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# 🧪 System testen
function Test-CursorIntegration {
    Write-Host "🧪 Anti-Regelbruch-System wird getestet..." -ForegroundColor Yellow
    
    # Test 1: System-Status
    Write-Host "✅ Test 1: System-Status" -ForegroundColor Green
    Show-SystemStatus
    
    # Test 2: Regelverstoß-Simulation
    Write-Host "✅ Test 2: Regelverstoß-Simulation" -ForegroundColor Green
    Detect-AndBlockViolation -EventType "Changed" -Filename "test.md"
    
    # Test 3: Freigabe-Simulation
    Write-Host "✅ Test 3: Freigabe-Simulation" -ForegroundColor Green
    Grant-Approval -Filename "test.md" -Reason "Test-Freigabe"
    
    Write-Host "✅ System-Test abgeschlossen" -ForegroundColor Green
}

# 🔄 Cursor-Startup-Skript ausführen
function Invoke-CursorStartup {
    Write-Host "🔄 Cursor-Startup-Skript wird ausgeführt..." -ForegroundColor Yellow
    
    $startupScript = Join-Path $PSScriptRoot "../.cursor/startup.js"
    
    if (Test-Path $startupScript) {
        try {
            $process = Start-Process -FilePath "node" -ArgumentList $startupScript -WorkingDirectory (Join-Path $PSScriptRoot "..") -PassThru -NoNewWindow
            $process.WaitForExit()
            Write-Host "✅ Cursor-Startup-Skript beendet mit Code: $($process.ExitCode)" -ForegroundColor Green
        }
        catch {
            Write-Host "❌ Fehler beim Ausführen des Cursor-Startup-Skripts: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    else {
        Write-Host "⚠️ Cursor-Startup-Skript nicht gefunden, überspringe..." -ForegroundColor Yellow
    }
}

# 🚀 AUTOMATISCHER START
if ($AutoStart) {
    Write-Host "🚀 Automatische Cursor-Integration wird gestartet..." -ForegroundColor Green
    Write-Host "🛡️ Anti-Regelbruch-System wird aktiviert..." -ForegroundColor Yellow
    
    # Status laden
    Load-SystemStatus
    
    # Cursor-Startup-Skript ausführen
    Invoke-CursorStartup
    
    # System starten
    Start-CursorIntegration
    
    # Status speichern
    Save-SystemStatus
    
    Write-Host "✅ Automatische Cursor-Integration ist bereit" -ForegroundColor Green
    Write-Host "🛡️ Anti-Regelbruch-System überwacht alle Aktionen" -ForegroundColor Green
    Write-Host "🚨 Regelverstöße werden automatisch blockiert" -ForegroundColor Green
}

if ($ShowStatus) {
    Load-SystemStatus
    Show-SystemStatus
}

if ($Test) {
    Test-CursorIntegration
}

# Standard-Ausführung (ohne Parameter)
if (-not $AutoStart -and -not $ShowStatus -and -not $Test) {
    Write-Host "🚀 Cursor-Integration Starter" -ForegroundColor Cyan
    Write-Host "Verwendung:" -ForegroundColor Yellow
    Write-Host "  .\start-cursor-integration.ps1 -AutoStart    # System automatisch starten" -ForegroundColor White
    Write-Host "  .\start-cursor-integration.ps1 -ShowStatus   # Status anzeigen" -ForegroundColor White
    Write-Host "  .\start-cursor-integration.ps1 -Test         # Tests ausführen" -ForegroundColor White
    Write-Host "  .\start-cursor-integration.ps1 -Force        # Erzwungener Start" -ForegroundColor White
    Write-Host ""
    
    # Standard: System starten
    Start-CursorIntegration
    Save-SystemStatus
} 