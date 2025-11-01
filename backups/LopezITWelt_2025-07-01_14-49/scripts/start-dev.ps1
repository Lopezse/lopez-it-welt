# Konfiguration
$config = @{
    Port = 3000
    LogFile = "dev-server.log"
    MaxPortAttempts = 5
}

# Logging-Funktion
function Write-Log {
    param(
        [string]$Message,
        [string]$Level = "INFO"
    )
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logMessage = "[$timestamp] [$Level] $Message"
    $logMessage | Out-File -FilePath $config.LogFile -Append
    Write-Host $logMessage
}

# Port-Prüfung
function Test-Port {
    param([int]$Port)
    $listener = New-Object System.Net.Sockets.TcpListener([System.Net.IPAddress]::Loopback, $Port)
    try {
        $listener.Start()
        $listener.Stop()
        return $true
    }
    catch {
        return $false
    }
}

# Hauptlogik
try {
    Write-Log "Starte Entwicklungsserver..."
    
    # 1. Beende alle Node-Prozesse
    Write-Log "Beende alle Node-Prozesse..."
    Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
    
    # 2. Lösche Caches
    Write-Log "Lösche Caches..."
    if (Test-Path ".next") { 
        Remove-Item -Recurse -Force ".next" -ErrorAction SilentlyContinue
        Write-Log "Next.js Cache gelöscht"
    }
    if (Test-Path "node_modules/.cache") { 
        Remove-Item -Recurse -Force "node_modules/.cache" -ErrorAction SilentlyContinue
        Write-Log "Node modules Cache gelöscht"
    }
    
    # 3. Port-Management
    $currentPort = $config.Port
    $attempts = 0
    
    while (-not (Test-Port -Port $currentPort) -and $attempts -lt $config.MaxPortAttempts) {
        Write-Log "Port $currentPort ist belegt. Versuche Port $($currentPort + 1)..."
        $currentPort++
        $attempts++
    }
    
    if ($attempts -eq $config.MaxPortAttempts) {
        Write-Log "Kein freier Port gefunden. Beende Skript." "ERROR"
        exit 1
    }
    
    # 4. Starte Server
    Write-Log "Starte Entwicklungsserver auf Port $currentPort..."
    $env:NODE_ENV = "development"
    npx next dev --port $currentPort
    
} catch {
    Write-Log "Kritischer Fehler: $_" "ERROR"
    Write-Log "Stack Trace: $($_.ScriptStackTrace)" "ERROR"
    exit 1
} 