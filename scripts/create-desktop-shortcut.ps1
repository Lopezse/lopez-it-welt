# Desktop-Verknüpfung für Cursor Anti-Regelbruch-System erstellen
# 
# @author Ramiro Lopez Rodriguez
# @version 2.0.0
# @date 2025-01-19

Write-Host "Desktop-Verknuepfung wird erstellt..." -ForegroundColor Yellow

# Desktop-Pfad ermitteln
$desktopPath = [Environment]::GetFolderPath("Desktop")
$projectPath = Get-Location
$batchFile = "$projectPath\CURSOR-START.bat"

Write-Host "Desktop-Pfad: $desktopPath" -ForegroundColor Green
Write-Host "Projekt-Pfad: $projectPath" -ForegroundColor Green
Write-Host "Batch-Datei: $batchFile" -ForegroundColor Green

# Prüfen ob Batch-Datei existiert
if (!(Test-Path $batchFile)) {
    Write-Host "Fehler: CURSOR-START.bat nicht gefunden!" -ForegroundColor Red
    Write-Host "Bitte stellen Sie sicher, dass Sie im Projektverzeichnis sind." -ForegroundColor Red
    exit 1
}

# WScript.Shell Objekt erstellen
$WshShell = New-Object -comObject WScript.Shell

# Verknüpfung erstellen
$Shortcut = $WshShell.CreateShortcut("$desktopPath\Cursor Anti-Regelbruch-System.lnk")
$Shortcut.TargetPath = $batchFile
$Shortcut.WorkingDirectory = $projectPath.ToString()
$Shortcut.Description = "Startet das Cursor Anti-Regelbruch-System automatisch"
$Shortcut.IconLocation = "$projectPath\assets\logo\logo.svg"
$Shortcut.Save()

Write-Host "Desktop-Verknuepfung erfolgreich erstellt!" -ForegroundColor Green
Write-Host "Verknuepfung: $desktopPath\Cursor Anti-Regelbruch-System.lnk" -ForegroundColor Green
Write-Host ""
Write-Host "Sie koennen jetzt die Verknuepfung auf dem Desktop doppelklicken!" -ForegroundColor Cyan 