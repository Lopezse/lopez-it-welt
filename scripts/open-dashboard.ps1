# 🛡️ Anti-Regelbruch-System Dashboard Opener
# Öffnet das sichtbare Dashboard im Browser

Write-Host "🛡️ Anti-Regelbruch-System Dashboard wird geöffnet..." -ForegroundColor Green

# Dashboard-Server starten (falls nicht bereits läuft)
$dashboardProcess = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*anti-rule-break-dashboard.js*" }

if (-not $dashboardProcess) {
    Write-Host "🚀 Dashboard-Server wird gestartet..." -ForegroundColor Yellow
    Start-Process -FilePath "node" -ArgumentList "scripts/anti-rule-break-dashboard.js" -WindowStyle Hidden
    Start-Sleep -Seconds 3
}

# Browser öffnen
Write-Host "🌐 Browser wird geöffnet..." -ForegroundColor Yellow
Start-Process "http://localhost:3001"

Write-Host "✅ Dashboard sollte jetzt im Browser geöffnet sein" -ForegroundColor Green
Write-Host "🌐 URL: http://localhost:3001" -ForegroundColor Cyan
Write-Host "🔄 Dashboard aktualisiert sich automatisch alle 5 Sekunden" -ForegroundColor Cyan 