@echo off
title CURSOR ANTI-REGELBRUCH-SYSTEM STARTEN
color 0A

echo.
echo =====================================================
echo    CURSOR ANTI-REGELBRUCH-SYSTEM - EINFACH STARTEN
echo =====================================================
echo.
echo Das System wird jetzt automatisch gestartet...
echo.

REM PowerShell-Skript starten
powershell -ExecutionPolicy Bypass -File ".\scripts\start-cursor-monitoring-simple.ps1" -AutoStart

echo.
echo =====================================================
echo    SYSTEM ERFOLGREICH GESTARTET!
echo =====================================================
echo.
echo Sie koennen jetzt Cursor normal verwenden.
echo Das Anti-Regelbruch-System laeuft im Hintergrund.
echo.
pause 