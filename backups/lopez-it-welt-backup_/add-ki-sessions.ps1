# KI-Zeiterfassung Einträge erstellen
Write-Host "🤖 Erstelle KI-Zeiterfassungseinträge..." -ForegroundColor Green

# Eintrag 1: Website-Fehler-Analyse
$body1 = @{
    module      = "Website-Fehler-Analyse"
    description = "Kritische Website-Fehler analysiert: UTF-8 Encoding-Fehler in time-tracking.ts identifiziert, doppelte Server-Instanzen beendet, Webpack-Cache gelöscht"
    category    = "debug"
    priority    = "high"
    start_time  = "2025-06-25T15:42:00.000Z"
    status      = "completed"
} | ConvertTo-Json

try {
    $response1 = Invoke-RestMethod -Uri "http://localhost:3000/api/admin/time-tracking/sessions" -Method POST -ContentType "application/json" -Body $body1
    Write-Host "✅ Eintrag 1 erstellt: Website-Fehler-Analyse" -ForegroundColor Green
}
catch {
    Write-Host "❌ Fehler bei Eintrag 1: $($_.Exception.Message)" -ForegroundColor Red
}

# Eintrag 2: time-tracking.ts Wiederherstellung
$body2 = @{
    module      = "time-tracking.ts Wiederherstellung"
    description = "time-tracking.ts neu erstellt mit korrektem UTF-8 Encoding, minimale Version implementiert, API-Fehler behoben"
    category    = "umsetzung"
    priority    = "high"
    start_time  = "2025-06-25T15:43:15.000Z"
    status      = "completed"
} | ConvertTo-Json

try {
    $response2 = Invoke-RestMethod -Uri "http://localhost:3000/api/admin/time-tracking/sessions" -Method POST -ContentType "application/json" -Body $body2
    Write-Host "✅ Eintrag 2 erstellt: time-tracking.ts Wiederherstellung" -ForegroundColor Green
}
catch {
    Write-Host "❌ Fehler bei Eintrag 2: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "🎯 KI-Zeiterfassung abgeschlossen!" -ForegroundColor Green 