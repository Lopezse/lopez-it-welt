# Quality Checks für Lopez IT Welt
param(
    [string]$ProjectPath = ".",
    [string]$ConfigPath = "./config"
)

# Initialisierung
$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

# Funktionen
function Initialize-Environment {
    Write-Host "Initialisiere Umgebung..."
    Set-Location $ProjectPath
    npm install
}

function Invoke-Checks {
    Write-Host "Führe Prüfungen durch..."
    npm run check:all
}

function New-Report {
    Write-Host "Generiere Bericht..."
    npm run generate:report
}

function Send-TeamNotification {
    Write-Host "Benachrichtige Team..."
    npm run notify:team
}

# Hauptablauf
try {
    Initialize-Environment
    Invoke-Checks
    New-Report
    Send-TeamNotification
    Write-Host "✅ Alle Prüfungen erfolgreich abgeschlossen"
} catch {
    Write-Error "❌ Fehler bei der Ausführung: $_"
    exit 1
} 