# 🚀 KI-Agenten Service Deployment Guide

## 📋 Übersicht

Dieser Guide beschreibt das Deployment des KI-Agenten-Services als eigenständigen, skalierbaren Service für die Lopez IT Welt.

## 🎯 Ziele

- ✅ **Autonomer Betrieb**: Agent läuft als eigenständiger Service
- ✅ **24/7 Verfügbarkeit**: Dauerhaft erreichbar
- ✅ **Multi-Project Integration**: Von verschiedenen Projekten ansprechbar
- ✅ **Skalierbarkeit**: Einfach erweiterbar und wartbar
- ✅ **Enterprise Ready**: Production-ready mit Monitoring

## 🏗️ Architektur

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js App   │    │   n8n Workflow  │    │  LangChain App  │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │   KI-Agenten Service      │
                    │   (Port 4001)             │
                    │                           │
                    │  ┌─────────────────────┐  │
                    │  │  Compliance Agent   │  │
                    │  └─────────────────────┘  │
                    │  ┌─────────────────────┐  │
                    │  │   Quality Agent     │  │
                    │  └─────────────────────┘  │
                    │  ┌─────────────────────┐  │
                    │  │ Development Agent   │  │
                    │  └─────────────────────┘  │
                    └───────────────────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │      MySQL Database       │
                    └───────────────────────────┘
```

## 🔧 Deployment Varianten

### Variante A: Direkt Importiert
```typescript
// In API Routes
import { complianceAgent } from '../lib/ki-agent';
const result = await complianceAgent.executeTask(task);
```
**Vorteile**: Einfach, schnell
**Nachteile**: Keine Isolation, schwer skalierbar

### Variante B: Cronjob/Scheduler
```bash
# Täglich um 2:00 Uhr
0 2 * * * /usr/bin/node /path/to/agent-scheduler.js
```
**Vorteile**: Automatisiert, regelmäßig
**Nachteile**: Nicht dauerhaft verfügbar

### Variante C: Eigenständiger Service ⭐ (Empfohlen)
```bash
# Service läuft dauerhaft auf Port 4001
curl -X POST http://localhost:4001/compliance/check \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key" \
  -d '{"input": "Prüfe Code auf DSGVO-Konformität"}'
```
**Vorteile**: Dauerhaft verfügbar, skalierbar, isoliert
**Nachteile**: Komplexeres Setup

### Variante D: Docker Deployment
```bash
# Containerisierte Version
docker run -d -p 4001:4001 lopez-it-welt-agent
```
**Vorteile**: Portabel, isoliert, einfach zu deployen
**Nachteile**: Docker-Abhängigkeit

## 🚀 Schnellstart

### 1. Lokaler Start

```bash
# Dependencies installieren
npm install

# Service starten
npx ts-node src/agents/complianceAgentService.ts
```

### 2. Docker Deployment

```bash
# Build und Start
./scripts/deploy-agent.sh deploy

# Oder mit Docker Compose
./scripts/deploy-agent.sh deploy-compose
```

### 3. Health Check

```bash
curl http://localhost:4001/health
```

## 📡 API Endpoints

### Health Check
```http
GET /health
```

### Compliance Check
```http
POST /compliance/check
Content-Type: application/json
X-API-Key: your-api-key

{
  "input": "Prüfe diesen Code auf DSGVO-Konformität",
  "context": {
    "project": "lopez-it-welt",
    "environment": "production"
  },
  "options": {
    "priority": "high"
  }
}
```

### Quality Check
```http
POST /quality/check
Content-Type: application/json
X-API-Key: your-api-key

{
  "input": "Analysiere Code-Qualität",
  "context": {
    "language": "typescript",
    "framework": "next.js"
  }
}
```

### Development Support
```http
POST /development/support
Content-Type: application/json
X-API-Key: your-api-key

{
  "input": "Hilfe bei Next.js Setup",
  "context": {
    "experience": "beginner"
  }
}
```

### Batch Processing
```http
POST /batch/process
Content-Type: application/json
X-API-Key: your-api-key

{
  "agentType": "compliance",
  "tasks": [
    {
      "id": "task1",
      "description": "Prüfe Login-Formular",
      "priority": "high"
    },
    {
      "id": "task2", 
      "description": "Prüfe Datenbank-Query",
      "priority": "medium"
    }
  ]
}
```

## 🔐 Security

### API Key Authentication
```bash
# In .env
AGENT_API_KEY=your-secure-api-key-here
```

### CORS Konfiguration
```bash
# In .env
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
```

### IP Restriction (Optional)
```nginx
# In nginx.conf
allow 192.168.1.0/24;
deny all;
```

## 📊 Monitoring

### Health Monitoring
```bash
# Status prüfen
./scripts/deploy-agent.sh status

# Logs anzeigen
./scripts/deploy-agent.sh logs
```

### Integration mit Monitoring Tools

#### Uptime Kuma
```yaml
# uptime-kuma.yml
- name: "KI-Agent Service"
  url: "http://localhost:4001/health"
  interval: 30
  retries: 3
```

#### Grafana Dashboard
```json
{
  "dashboard": {
    "title": "KI-Agent Service Metrics",
    "panels": [
      {
        "title": "Response Time",
        "targets": [
          {
            "expr": "rate(http_request_duration_seconds_sum[5m])"
          }
        ]
      }
    ]
  }
}
```

## 🔄 Integration Beispiele

### Next.js Integration
```typescript
// lib/agent-client.ts
export class AgentClient {
  private baseUrl = process.env.AGENT_SERVICE_URL || 'http://localhost:4001';
  private apiKey = process.env.AGENT_API_KEY;

  async checkCompliance(input: string, context?: any) {
    const response = await fetch(`${this.baseUrl}/compliance/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.apiKey,
      },
      body: JSON.stringify({ input, context }),
    });

    return response.json();
  }
}

// Verwendung in API Route
export async function POST(req: Request) {
  const { code } = await req.json();
  
  const agentClient = new AgentClient();
  const result = await agentClient.checkCompliance(code);
  
  return Response.json(result);
}
```

### n8n Integration
```javascript
// n8n HTTP Request Node
{
  "method": "POST",
  "url": "http://localhost:4001/compliance/check",
  "headers": {
    "Content-Type": "application/json",
    "X-API-Key": "{{ $env.AGENT_API_KEY }}"
  },
  "body": {
    "input": "{{ $json.code }}",
    "context": {
      "workflow": "{{ $workflow.name }}"
    }
  }
}
```

### LangChain Integration
```python
# langchain_agent.py
from langchain.tools import RequestsGetTool, RequestsPostTool
import os

class ComplianceTool:
    def __init__(self):
        self.base_url = os.getenv('AGENT_SERVICE_URL', 'http://localhost:4001')
        self.api_key = os.getenv('AGENT_API_KEY')
    
    def check_compliance(self, code: str) -> dict:
        import requests
        
        response = requests.post(
            f"{self.base_url}/compliance/check",
            headers={
                "Content-Type": "application/json",
                "X-API-Key": self.api_key
            },
            json={"input": code}
        )
        
        return response.json()

# Verwendung
compliance_tool = ComplianceTool()
result = compliance_tool.check_compliance("function getUserData() { ... }")
```

## 🐳 Docker Deployment

### Einfaches Docker
```bash
# Build
docker build -f Dockerfile.agent -t lopez-it-welt-agent .

# Run
docker run -d \
  --name compliance-agent \
  -p 4001:4001 \
  --env-file .env \
  lopez-it-welt-agent
```

### Docker Compose
```bash
# Alle Services starten
docker-compose -f docker-compose.agent.yml up -d

# Nur Agent ohne Database
docker-compose -f docker-compose.agent.yml up -d compliance-agent

# Mit Database und Cache
docker-compose -f docker-compose.agent.yml --profile with-database --profile with-cache up -d
```

## 🔧 Konfiguration

### Environment Variables
```bash
# .env
NODE_ENV=production
AGENT_PORT=4001
AGENT_API_KEY=your-secure-api-key-here
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your-db-password
DB_NAME=lopez_it_welt_db

# Optional: Redis Cache
REDIS_URL=redis://localhost:6379
```

### PM2 Deployment
```bash
# PM2 installieren
npm install -g pm2

# Service starten
pm2 start src/agents/complianceAgentService.ts --name compliance-agent

# Autostart aktivieren
pm2 startup
pm2 save

# Monitoring
pm2 monit
```

## 🚨 Troubleshooting

### Service startet nicht
```bash
# Logs prüfen
./scripts/deploy-agent.sh logs

# Port prüfen
netstat -tulpn | grep 4001

# Docker Status
docker ps -a | grep compliance-agent
```

### Health Check fehlschlägt
```bash
# Manueller Test
curl -v http://localhost:4001/health

# Container Logs
docker logs compliance-agent

# Environment prüfen
docker exec compliance-agent env
```

### Performance Probleme
```bash
# Memory Usage
docker stats compliance-agent

# CPU Usage
top -p $(docker inspect compliance-agent --format='{{.State.Pid}}')

# Logs mit Timestamps
docker logs -t compliance-agent
```

## 📈 Skalierung

### Horizontal Scaling
```bash
# Mehrere Instanzen
docker run -d -p 4002:4001 --name compliance-agent-2 lopez-it-welt-agent
docker run -d -p 4003:4001 --name compliance-agent-3 lopez-it-welt-agent
```

### Load Balancer
```nginx
# nginx.conf
upstream agent_services {
    server localhost:4001;
    server localhost:4002;
    server localhost:4003;
}

server {
    listen 80;
    location / {
        proxy_pass http://agent_services;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🔄 Updates

### Rolling Update
```bash
# Neue Version deployen
./scripts/deploy-agent.sh deploy

# Oder mit Docker Compose
docker-compose -f docker-compose.agent.yml pull
docker-compose -f docker-compose.agent.yml up -d
```

### Blue-Green Deployment
```bash
# Blue (aktuelle Version)
docker run -d -p 4001:4001 --name agent-blue lopez-it-welt-agent:v1

# Green (neue Version)
docker run -d -p 4002:4001 --name agent-green lopez-it-welt-agent:v2

# Switch Traffic
# ... Load Balancer Konfiguration ändern ...

# Blue stoppen
docker stop agent-blue
```

## 📚 Weitere Ressourcen

- [Docker Documentation](https://docs.docker.com/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practices-performance.html)
- [API Security Best Practices](https://owasp.org/www-project-api-security/)

---

**Erstellt**: 2025-07-02  
**Version**: 1.0.0  
**Autor**: Lopez IT Welt Team 