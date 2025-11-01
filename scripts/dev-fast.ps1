# Enterprise++ Fast Development Script
# Für Windows PowerShell

Write-Host "ENTERPRISE++ FAST DEVELOPMENT MODE" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Setze Umgebungsvariable für Windows
$env:NODE_ENV = "development"

# Lösche Cache für schnelleren Start
if (Test-Path ".next\cache") {
    Write-Host "Loesche Webpack-Cache..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force ".next\cache" -ErrorAction SilentlyContinue
}

# Starte Next.js mit Turbo-Modus
Write-Host "Starte Next.js mit Turbo-Modus..." -ForegroundColor Cyan
Write-Host "Optimiert fuer Development (TypeScript/ESLint deaktiviert)" -ForegroundColor Cyan
Write-Host ""

npx next dev --turbo 