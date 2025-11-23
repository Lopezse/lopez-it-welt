@echo off
chcp 65001 >nul
title Anti-Regelbruch-System Dashboard

echo.
echo 🛡️ Anti-Regelbruch-System Dashboard
echo ====================================
echo.

echo 🚀 Dashboard wird gestartet...
echo 🌐 Browser wird geöffnet...
echo.

REM Dashboard-Server starten
start /min node scripts/anti-rule-break-dashboard.js

REM Kurz warten
timeout /t 3 /nobreak >nul

REM Browser öffnen
start http://localhost:3001

echo ✅ Dashboard ist bereit!
echo 🌐 URL: http://localhost:3001
echo 🔄 Aktualisiert sich automatisch alle 5 Sekunden
echo.
echo 🛑 Zum Beenden: Schließen Sie das Browser-Fenster
echo.

pause 