# =====================================================
# KI-Agenten Service Deployment Script (PowerShell)
# =====================================================
# Erstellt: 2025-07-05 14:30:00
# Autor: Ramiro Lopez Rodriguez
# Zweck: Automatisiertes Deployment des Agent-Services für Windows
# =====================================================

param(
    [Parameter(Position = 0)]
    [string]$Command = "deploy"
)

# =====================================================
# Farben für Output
# =====================================================
$Red = "Red"
$Green = "Green"
$Yellow = "Yellow"
$Blue = "Blue"
$White = "White"

# =====================================================
# Logging Funktionen
# =====================================================
function Write-Info {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor $Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor $Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor $Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor $Red
}

# =====================================================
# Konfiguration
# =====================================================
$ServiceName = "lopez-it-welt-compliance-agent"
$DockerImage = "lopez-it-welt-agent"
$DockerTag = "latest"
$Port = "4001"
$HealthCheckUrl = "http://localhost:$Port/health"

# =====================================================
# Hilfsfunktionen
# =====================================================
function Test-Docker {
    try {
        $null = docker --version
        $null = docker info
        Write-Success "Docker ist verfügbar"
        return $true
    }
    catch {
        Write-Error "Docker ist nicht verfügbar oder nicht gestartet!"
        return $false
    }
}

function Test-DockerCompose {
    try {
        $null = docker-compose --version
        Write-Success "Docker Compose ist verfügbar"
        return $true
    }
    catch {
        Write-Error "Docker Compose ist nicht installiert!"
        return $false
    }
}

function Test-Environment {
    if (-not (Test-Path ".env")) {
        Write-Warning ".env Datei nicht gefunden, erstelle Standard-Konfiguration..."
        
        @"
# =====================================================
# KI-Agenten Service Environment
# =====================================================
NODE_ENV=production
AGENT_PORT=4001
AGENT_API_KEY=your-secure-api-key-here
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your-db-password
DB_NAME=lopez_it_welt_db
"@ | Out-File -FilePath ".env" -Encoding UTF8
        
        Write-Success ".env Datei erstellt"
    }
    
    Write-Success "Environment-Konfiguration geprüft"
}

# =====================================================
# Build Funktionen
# =====================================================
function Build-Image {
    Write-Info "Baue Docker Image..."
    
    try {
        docker build -f Dockerfile.agent -t "${DockerImage}:${DockerTag}" .
        Write-Success "Docker Image erfolgreich gebaut"
        return $true
    }
    catch {
        Write-Error "Docker Build fehlgeschlagen"
        return $false
    }
}

# =====================================================
# Deployment Funktionen
# =====================================================
function Deploy-WithDocker {
    Write-Info "Deploye mit Docker..."
    
    # Stoppe existierenden Container
    $existingContainer = docker ps -q -f "name=$ServiceName"
    if ($existingContainer) {
        Write-Info "Stoppe existierenden Container..."
        docker stop $ServiceName
        docker rm $ServiceName
    }
    
    # Starte neuen Container
    Write-Info "Starte neuen Container..."
    docker run -d `
        --name $ServiceName `
        --restart unless-stopped `
        -p "${Port}:${Port}" `
        --env-file .env `
        "${DockerImage}:${DockerTag}"
    
    Write-Success "Container gestartet"
}

function Deploy-WithCompose {
    Write-Info "Deploye mit Docker Compose..."
    
    # Stoppe existierende Services
    docker-compose -f docker-compose.agent.yml down
    
    # Starte Services
    docker-compose -f docker-compose.agent.yml up -d
    
    Write-Success "Docker Compose Services gestartet"
}

# =====================================================
# Health Check
# =====================================================
function Wait-ForHealth {
    Write-Info "Warte auf Service Health Check..."
    
    $maxAttempts = 30
    $attempt = 1
    
    while ($attempt -le $maxAttempts) {
        try {
            $response = Invoke-WebRequest -Uri $HealthCheckUrl -UseBasicParsing -TimeoutSec 5
            if ($response.StatusCode -eq 200) {
                Write-Success "Service ist gesund und bereit!"
                return $true
            }
        }
        catch {
            # Ignore errors and continue
        }
        
        Write-Info "Versuch $attempt/$maxAttempts - Service noch nicht bereit..."
        Start-Sleep -Seconds 2
        $attempt++
    }
    
    Write-Error "Service Health Check fehlgeschlagen nach $maxAttempts Versuchen"
    return $false
}

# =====================================================
# Monitoring
# =====================================================
function Show-Status {
    Write-Info "Service Status:"
    Write-Host "==================" -ForegroundColor $White
    
    # Container Status
    $container = docker ps -q -f "name=$ServiceName"
    if ($container) {
        Write-Success "Container läuft"
        docker ps --filter "name=$ServiceName" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    }
    else {
        Write-Error "Container läuft nicht"
    }
    
    Write-Host ""
    
    # Health Check
    try {
        $response = Invoke-WebRequest -Uri $HealthCheckUrl -UseBasicParsing
        Write-Success "Health Check: OK"
        $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
    }
    catch {
        Write-Error "Health Check: FAILED"
    }
    
    Write-Host ""
    
    # Logs (letzte 10 Zeilen)
    Write-Info "Letzte Logs:"
    try {
        docker logs --tail 10 $ServiceName
    }
    catch {
        Write-Warning "Keine Logs verfügbar"
    }
}

# =====================================================
# Cleanup
# =====================================================
function Invoke-Cleanup {
    Write-Info "Führe Cleanup durch..."
    
    # Stoppe und entferne Container
    try {
        docker stop $ServiceName | Out-Null
        docker rm $ServiceName | Out-Null
    }
    catch {
        # Ignore errors if container doesn't exist
    }
    
    # Entferne ungenutzte Images
    docker image prune -f | Out-Null
    
    Write-Success "Cleanup abgeschlossen"
}

# =====================================================
# Main Funktion
# =====================================================
function Main {
    switch ($Command.ToLower()) {
        "deploy" {
            Write-Info "Starte KI-Agenten Service Deployment..."
            if (-not (Test-Docker)) { exit 1 }
            Test-Environment
            if (-not (Build-Image)) { exit 1 }
            Deploy-WithDocker
            Wait-ForHealth
            Show-Status
        }
        "deploy-compose" {
            Write-Info "Starte KI-Agenten Service Deployment mit Docker Compose..."
            if (-not (Test-Docker)) { exit 1 }
            if (-not (Test-DockerCompose)) { exit 1 }
            Test-Environment
            Deploy-WithCompose
            Wait-ForHealth
            Show-Status
        }
        "status" {
            Show-Status
        }
        "logs" {
            Write-Info "Zeige Service Logs..."
            docker logs -f $ServiceName
        }
        "stop" {
            Write-Info "Stoppe Service..."
            docker stop $ServiceName
            Write-Success "Service gestoppt"
        }
        "restart" {
            Write-Info "Starte Service neu..."
            docker restart $ServiceName
            Wait-ForHealth
            Show-Status
        }
        "cleanup" {
            Invoke-Cleanup
        }
        "help" {
            Write-Host "KI-Agenten Service Deployment Script (PowerShell)" -ForegroundColor $White
            Write-Host "================================================" -ForegroundColor $White
            Write-Host ""
            Write-Host "Verwendung: .\scripts\deploy-agent.ps1 [COMMAND]" -ForegroundColor $White
            Write-Host ""
            Write-Host "Commands:" -ForegroundColor $White
            Write-Host "  deploy         - Deploy mit Docker" -ForegroundColor $White
            Write-Host "  deploy-compose - Deploy mit Docker Compose" -ForegroundColor $White
            Write-Host "  status         - Zeige Service Status" -ForegroundColor $White
            Write-Host "  logs           - Zeige Service Logs" -ForegroundColor $White
            Write-Host "  stop           - Stoppe Service" -ForegroundColor $White
            Write-Host "  restart        - Starte Service neu" -ForegroundColor $White
            Write-Host "  cleanup        - Führe Cleanup durch" -ForegroundColor $White
            Write-Host "  help           - Zeige diese Hilfe" -ForegroundColor $White
        }
        default {
            Write-Error "Unbekannter Command: $Command"
            Write-Host "Verwende '.\scripts\deploy-agent.ps1 help' für verfügbare Commands" -ForegroundColor $White
            exit 1
        }
    }
}

# =====================================================
# Script ausführen
# =====================================================
Main 