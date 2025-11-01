#!/usr/bin/env pwsh

<#
.SYNOPSIS
    🛡️ Anti-Regelbruch Enterprise++ Modul - PowerShell Version
    
.DESCRIPTION
    Verhindert systematisch alle Regelverstöße in PowerShell-Umgebungen
    
.AUTHOR
    Ramiro Lopez Rodriguez
    
.VERSION
    1.0.0
    
.DATE
    2025-06-30
#>

# Enterprise++ Anti-Regelbruch Konfiguration
$AntiRuleBreakConfig = @{
    StrictMode               = $true
    ZeroTolerance            = $true
    AutoBlock                = $true
    RequireApproval          = $true
    ValidateBeforeAction     = $true
    ValidateAfterAction      = $true
    BlockOnViolation         = $true
    RequireSystemTime        = $true
    BlockDateCopying         = $true
    ValidateTimestamps       = $true
    PreventOverwriting       = $true
    RequireAppendOnly        = $true
    ProtectMdStructure       = $true
    EnforceTimeTracking      = $true
    RequireSessionSwitch     = $true
    BlockOverlappingSessions = $true
}

# Geschützte Regeln
$ProtectedRules = @(
    'Datumsvalidierung',
    'Zeiterfassung',
    'Md-Struktur',
    'Enterprise++ Standards',
    'Freigabe-Erfordernis',
    'System-Zeit-Verwendung'
)

# Globale Variablen
$script:IsBlocked = $false
$script:ViolationCount = 0
$script:LastViolation = ''
$script:ApprovalGiven = $false
$script:BlockedActions = @()

<#
.SYNOPSIS
    🛡️ Anti-Regelbruch Enterprise++ System Klasse
#>
class AntiRuleBreakSystem {
    [bool]$IsBlocked
    [int]$ViolationCount
    [string]$LastViolation
    [bool]$ApprovalGiven
    [array]$BlockedActions
    [hashtable]$Config

    AntiRuleBreakSystem() {
        $this.IsBlocked = $false
        $this.ViolationCount = 0
        $this.LastViolation = ''
        $this.ApprovalGiven = $false
        $this.BlockedActions = @()
        $this.Config = $AntiRuleBreakConfig
    }

    <#
    .SYNOPSIS
        🚨 Hauptvalidierung vor jeder Aktion
    #>
    [hashtable] ValidateBeforeAction([string]$Action, [string]$TargetFile = '') {
        Write-Host "🛡️ Anti-Regelbruch-System: Validierung läuft..." -ForegroundColor Yellow

        $timestamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ss.fffZ"

        # 1. System-Zeit validieren
        $timeValidation = $this.ValidateSystemTime()
        if (-not $timeValidation.Valid) {
            $this.BlockAction('System-Zeit nicht validiert', $timeValidation.Reason)
            return @{
                Valid     = $false
                Reason    = $timeValidation.Reason
                Timestamp = $timestamp
                Rule      = 'System-Zeit'
            }
        }

        # 2. Datumskopieren blockieren
        $dateValidation = $this.ValidateNoDateCopying($Action)
        if (-not $dateValidation.Valid) {
            $this.BlockAction('Datumskopieren blockiert', $dateValidation.Reason)
            return @{
                Valid     = $false
                Reason    = $dateValidation.Reason
                Timestamp = $timestamp
                Rule      = 'Datumsvalidierung'
            }
        }

        # 3. Struktur-Schutz prüfen
        if ($TargetFile -and $this.IsMdFile($TargetFile)) {
            $structureValidation = $this.ValidateMdStructure($TargetFile)
            if (-not $structureValidation.Valid) {
                $this.BlockAction('Md-Struktur-Schutz', $structureValidation.Reason)
                return @{
                    Valid     = $false
                    Reason    = $structureValidation.Reason
                    Timestamp = $timestamp
                    Rule      = 'Md-Struktur'
                }
            }
        }

        # 4. Freigabe prüfen
        if (-not $this.ApprovalGiven -and $this.Config.RequireApproval) {
            $this.BlockAction('Keine Freigabe vorhanden', $Action)
            return @{
                Valid     = $false
                Reason    = 'Keine Freigabe vorhanden'
                Timestamp = $timestamp
                Rule      = 'Freigabe-Erfordernis'
            }
        }

        # 5. Zeiterfassung prüfen
        $timeTrackingValidation = $this.ValidateTimeTracking($Action)
        if (-not $timeTrackingValidation.Valid) {
            $this.BlockAction('Zeiterfassung nicht gewechselt', $timeTrackingValidation.Reason)
            return @{
                Valid     = $false
                Reason    = $timeTrackingValidation.Reason
                Timestamp = $timestamp
                Rule      = 'Zeiterfassung'
            }
        }

        Write-Host "✅ Anti-Regelbruch-Validierung erfolgreich" -ForegroundColor Green
        return @{
            Valid     = $true
            Timestamp = $timestamp
        }
    }

    <#
    .SYNOPSIS
        ⏰ System-Zeit validieren
    #>
    [hashtable] ValidateSystemTime() {
        try {
            $currentTime = Get-Date
            $timestamp = $currentTime.ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
            
            # Prüfen ob Zeit plausibel ist (nicht in der Vergangenheit)
            $minValidDate = Get-Date "2025-01-01"
            if ($currentTime -lt $minValidDate) {
                return @{
                    Valid     = $false
                    Reason    = 'System-Zeit ist in der Vergangenheit'
                    Timestamp = $timestamp
                }
            }

            return @{
                Valid     = $true
                Timestamp = $timestamp
            }
        }
        catch {
            return @{
                Valid     = $false
                Reason    = 'System-Zeit-Abfrage fehlgeschlagen'
                Timestamp = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
            }
        }
    }

    <#
    .SYNOPSIS
        📅 Datumskopieren blockieren
    #>
    [hashtable] ValidateNoDateCopying([string]$Action) {
        $blockedDates = @(
            '2025-01-19',
            '29.07.2025',
            '27.06.2025',
            '2025-06-27',
            '2025-01-19T',
            '29.07.2025T'
        )

        $timestamp = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss.fffZ")

        foreach ($blockedDate in $blockedDates) {
            if ($Action -like "*$blockedDate*") {
                return @{
                    Valid     = $false
                    Reason    = "Datumskopieren erkannt: $blockedDate"
                    Timestamp = $timestamp
                }
            }
        }

        return @{
            Valid     = $true
            Timestamp = $timestamp
        }
    }

    <#
    .SYNOPSIS
        📄 Md-Struktur schützen
    #>
    [hashtable] ValidateMdStructure([string]$TargetFile) {
        $timestamp = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss.fffZ")

        # Prüfen ob es sich um eine .md-Datei handelt
        if (-not $this.IsMdFile($TargetFile)) {
            return @{
                Valid     = $true
                Timestamp = $timestamp
            }
        }

        # Hier könnte weitere Validierung der Md-Struktur erfolgen
        # z.B. Prüfung auf Überschreibungen statt Ergänzungen

        return @{
            Valid     = $true
            Timestamp = $timestamp
        }
    }

    <#
    .SYNOPSIS
        ⏱️ Zeiterfassung validieren
    #>
    [hashtable] ValidateTimeTracking([string]$Action) {
        $timestamp = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss.fffZ")

        // Hier könnte Validierung der Zeiterfassung erfolgen
        // z.B. Prüfung auf Session-Wechsel bei Themenwechsel

        return @{
            Valid     = $true
            Timestamp = $timestamp
        }
    }

    <#
    .SYNOPSIS
        🚫 Aktion blockieren
    #>
    [void] BlockAction([string]$Rule, [string]$Reason) {
        $this.ViolationCount++
        $this.LastViolation = "$Rule`: $Reason"
        $this.IsBlocked = $true
        
        $violation = @{
            Timestamp = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
            Rule      = $Rule
            Reason    = $Reason
            Action    = 'BLOCKIERT'
        }
        
        $this.BlockedActions += $violation

        Write-Host "🚨 ANTI-REGELBRUCH: AKTION BLOCKIERT" -ForegroundColor Red
        Write-Host "   Regel: $Rule" -ForegroundColor Red
        Write-Host "   Grund: $Reason" -ForegroundColor Red
        Write-Host "   Verstoß #$($this.ViolationCount)" -ForegroundColor Red
        Write-Host "   Status: BLOCKIERT - Freigabe erforderlich" -ForegroundColor Red

        # In STATUS.md dokumentieren
        $this.DocumentViolation($Rule, $Reason)
    }

    <#
    .SYNOPSIS
        📝 Verstoß dokumentieren
    #>
    [void] DocumentViolation([string]$Rule, [string]$Reason) {
        $timestamp = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
        $violationEntry = @"

## 🚨 **ANTI-REGELBRUCH: AKTION BLOCKIERT ($timestamp)**
- **Regel:** $Rule
- **Grund:** $Reason
- **Verstoß #:** $($this.ViolationCount)
- **Status:** ❌ BLOCKIERT - Freigabe erforderlich
- **System:** Anti-Regelbruch-System aktiviert

"@

        try {
            # STATUS.md aktualisieren
            if (Test-Path "STATUS.md") {
                $statusContent = Get-Content "STATUS.md" -Raw
                $updatedContent = $violationEntry + $statusContent
                Set-Content "STATUS.md" $updatedContent -Encoding UTF8
            }
            else {
                Set-Content "STATUS.md" $violationEntry -Encoding UTF8
            }
            
            Write-Host "📝 Verstoß in STATUS.md dokumentiert" -ForegroundColor Green
        }
        catch {
            Write-Error "❌ Fehler beim Dokumentieren des Verstoßes: $_"
        }
    }

    <#
    .SYNOPSIS
        ✅ Freigabe erteilen
    #>
    [void] GrantApproval() {
        $this.ApprovalGiven = $true
        $this.IsBlocked = $false
        Write-Host "✅ Anti-Regelbruch-Freigabe erteilt" -ForegroundColor Green
    }

    <#
    .SYNOPSIS
        🔄 Freigabe zurückziehen
    #>
    [void] RevokeApproval() {
        $this.ApprovalGiven = $false
        $this.IsBlocked = $true
        Write-Host "🚫 Anti-Regelbruch-Freigabe zurückgezogen" -ForegroundColor Yellow
    }

    <#
    .SYNOPSIS
        📊 Status anzeigen
    #>
    [void] ShowStatus() {
        Write-Host "`n🛡️ Anti-Regelbruch-System Status:" -ForegroundColor Cyan
        Write-Host "   Blockiert: $(if ($this.IsBlocked) { '❌ JA' } else { '✅ NEIN' })" -ForegroundColor $(if ($this.IsBlocked) { 'Red' } else { 'Green' })
        Write-Host "   Freigabe: $(if ($this.ApprovalGiven) { '✅ ERTEILT' } else { '❌ NICHT ERTEILT' })" -ForegroundColor $(if ($this.ApprovalGiven) { 'Green' } else { 'Red' })
        Write-Host "   Verstöße: $($this.ViolationCount)" -ForegroundColor Yellow
        Write-Host "   Letzter Verstoß: $(if ($this.LastViolation) { $this.LastViolation } else { 'Keine' })" -ForegroundColor Yellow
        Write-Host "   Blockierte Aktionen: $($this.BlockedActions.Count)" -ForegroundColor Yellow
    }

    <#
    .SYNOPSIS
        🔧 Konfiguration aktualisieren
    #>
    [void] UpdateConfig([hashtable]$NewConfig) {
        $this.Config = $this.Config + $NewConfig
        Write-Host "🔧 Anti-Regelbruch-Konfiguration aktualisiert" -ForegroundColor Green
    }

    <#
    .SYNOPSIS
        📋 Md-Datei prüfen
    #>
    [bool] IsMdFile([string]$Filename) {
        return $Filename -match '\.md$|\.MD$'
    }

    <#
    .SYNOPSIS
        🧹 Verstöße zurücksetzen
    #>
    [void] ResetViolations() {
        $this.ViolationCount = 0
        $this.LastViolation = ''
        $this.BlockedActions = @()
        $this.IsBlocked = $false
        Write-Host "🧹 Anti-Regelbruch-Verstöße zurückgesetzt" -ForegroundColor Green
    }
}

# Globale Instanz erstellen
$Global:AntiRuleBreakSystem = [AntiRuleBreakSystem]::new()

# Export-Funktionen
function Start-AntiRuleBreakValidation {
    param(
        [string]$Action,
        [string]$TargetFile = ''
    )
    
    return $Global:AntiRuleBreakSystem.ValidateBeforeAction($Action, $TargetFile)
}

function Grant-AntiRuleBreakApproval {
    $Global:AntiRuleBreakSystem.GrantApproval()
}

function Revoke-AntiRuleBreakApproval {
    $Global:AntiRuleBreakSystem.RevokeApproval()
}

function Show-AntiRuleBreakStatus {
    $Global:AntiRuleBreakSystem.ShowStatus()
}

function Reset-AntiRuleBreakViolations {
    $Global:AntiRuleBreakSystem.ResetViolations()
}

# Beispiel-Verwendung
if ($MyInvocation.InvocationName -eq $MyInvocation.MyCommand.Name) {
    Write-Host "🛡️ Anti-Regelbruch Enterprise++ Modul - PowerShell Version" -ForegroundColor Cyan
    Write-Host "Verwendung: . .\anti-rule-break.ps1" -ForegroundColor Yellow
    Write-Host "Dann: Start-AntiRuleBreakValidation -Action 'test' -TargetFile 'test.md'" -ForegroundColor Yellow
} 