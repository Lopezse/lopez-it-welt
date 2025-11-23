@echo off
title DESKTOP-VERKNÜPFUNG ERSTELLEN
color 0B

echo.
echo =====================================================
echo    DESKTOP-VERKNÜPFUNG ERSTELLEN
echo =====================================================
echo.
echo Eine Desktop-Verknuepfung wird erstellt...
echo.

REM PowerShell-Skript ausführen
powershell -ExecutionPolicy Bypass -File ".\scripts\create-desktop-shortcut.ps1"

echo.
echo =====================================================
echo    VERKNÜPFUNG ERSTELLT!
echo =====================================================
echo.
echo Sie finden jetzt auf dem Desktop:
echo "Cursor Anti-Regelbruch-System"
echo.
echo Doppelklicken Sie darauf, um das System zu starten!
echo.
pause 