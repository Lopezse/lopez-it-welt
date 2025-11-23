@echo off
REM =====================================================
REM AUTOMATISCHER CURSOR-START - ANTI-REGELBRUCH-SYSTEM
REM =====================================================
REM 
REM Diese Datei startet automatisch das Anti-Regelbruch-System
REM Einfach doppelklicken oder bei Cursor-Start ausführen
REM 
REM @author Ramiro Lopez Rodriguez
REM @version 2.0.0
REM @date 2025-01-19

echo.
echo =====================================================
echo AUTOMATISCHER CURSOR-START - ANTI-REGELBRUCH-SYSTEM
echo =====================================================
echo.

REM 1. PowerShell-Skript automatisch starten
echo [1/3] PowerShell-Skript wird gestartet...
powershell -ExecutionPolicy Bypass -File ".\scripts\start-cursor-monitoring-simple.ps1" -AutoStart

REM 2. Node.js Monitoring im Hintergrund starten
echo [2/3] Node.js Monitoring wird gestartet...
start /B node scripts\cursor-startup-fix.js

REM 3. Status anzeigen
echo [3/3] Status wird angezeigt...
powershell -ExecutionPolicy Bypass -File ".\scripts\start-cursor-monitoring-simple.ps1" -ShowStatus

echo.
echo =====================================================
echo ANTI-REGELBRUCH-SYSTEM ERFOLGREICH GESTARTET!
echo =====================================================
echo.
echo Das System laeuft jetzt automatisch im Hintergrund.
echo Sie koennen Cursor normal verwenden.
echo.
echo Druecken Sie eine beliebige Taste zum Beenden...
pause >nul 