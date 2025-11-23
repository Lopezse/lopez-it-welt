# 🔌 API-Dokumentation - Lopez IT Welt

**Version:** 1.0  
**Datum:** 2025-07-05  
**Status:** 🚧 IN ENTWICKLUNG  
**Base URL:** `https://api.lopez-it-welt.de/v1`  
**Autor:** Lopez IT Welt Team

## 📋 **ÜBERSICHT**

Die **API-Dokumentation** beschreibt alle verfügbaren Endpunkte des Lopez IT Welt Systems. Die API folgt REST-Prinzipien und verwendet JSON für die Datenübertragung.

## 🔐 **AUTHENTIFIZIERUNG**

### **Bearer Token**

```http
Authorization: Bearer <access_token>
```

### **API-Key (für externe Services)**

```http
X-API-Key: <api_key>
```

## 📊 **ALLGEMEINE ANTWORTEN**

### **Erfolgreiche Antwort**

```json
{
  "success": true,
  "data": {
    // Antwortdaten
  },
  "message": "Operation erfolgreich",
  "timestamp": "2025-07-05T10:30:00Z"
}
```

### **Fehler-Antwort**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Ungültige Eingabedaten",
    "details": [
      {
        "field": "email",
        "message": "Ungültige E-Mail-Adresse"
      }
    ]
  },
  "timestamp": "2025-07-05T10:30:00Z"
}
```

## 👥 **BENUTZER-MANAGEMENT**

### **Benutzer erstellen**

```http
POST /api/users
Content-Type: application/json

{
  "name": "Max Mustermann",
  "email": "max@example.com",
  "password": "secure123",
  "role": "user"
}
```

**Antwort:**

```json
{
  "success": true,
  "data": {
    "id": "usr_123456789",
    "name": "Max Mustermann",
    "email": "max@example.com",
    "role": "user",
    "createdAt": "2025-07-05T10:30:00Z",
    "updatedAt": "2025-07-05T10:30:00Z"
  },
  "message": "Benutzer erfolgreich erstellt"
}
```

### **Benutzer abrufen**

```http
GET /api/users/{user_id}
Authorization: Bearer <access_token>
```

**Antwort:**

```json
{
  "success": true,
  "data": {
    "id": "usr_123456789",
    "name": "Max Mustermann",
    "email": "max@example.com",
    "role": "user",
    "profile": {
      "avatar": "https://example.com/avatar.jpg",
      "bio": "Software-Entwickler",
      "location": "Berlin"
    },
    "createdAt": "2025-07-05T10:30:00Z",
    "updatedAt": "2025-07-05T10:30:00Z"
  }
}
```

### **Benutzer aktualisieren**

```http
PUT /api/users/{user_id}
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Max Mustermann (aktualisiert)",
  "profile": {
    "bio": "Senior Software-Entwickler"
  }
}
```

### **Benutzer löschen**

```http
DELETE /api/users/{user_id}
Authorization: Bearer <access_token>
```

### **Benutzer-Liste abrufen**

```http
GET /api/users?page=1&limit=10&search=max&role=user
Authorization: Bearer <access_token>
```

**Antwort:**

```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "usr_123456789",
        "name": "Max Mustermann",
        "email": "max@example.com",
        "role": "user",
        "createdAt": "2025-07-05T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

## 🔐 **AUTHENTIFIZIERUNG**

### **Anmeldung**

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "max@example.com",
  "password": "secure123"
}
```

**Antwort:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_123456789",
      "name": "Max Mustermann",
      "email": "max@example.com",
      "role": "user"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": 3600
    }
  },
  "message": "Anmeldung erfolgreich"
}
```

### **Abmeldung**

```http
POST /api/auth/logout
Authorization: Bearer <access_token>
```

### **Token erneuern**

```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### **Passwort zurücksetzen**

```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "max@example.com"
}
```

### **Passwort ändern**

```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset_token_here",
  "newPassword": "newSecure123"
}
```

## 🤖 **KI-AGENTEN**

### **KI-Agent erstellen**

```http
POST /api/ai-agents
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Kunden-Support Agent",
  "description": "KI-Agent für Kunden-Support",
  "type": "chatbot",
  "config": {
    "model": "gpt-4",
    "temperature": 0.7,
    "maxTokens": 1000,
    "systemPrompt": "Du bist ein hilfreicher Kunden-Support Agent..."
  },
  "capabilities": ["text_generation", "sentiment_analysis"],
  "isActive": true
}
```

**Antwort:**

```json
{
  "success": true,
  "data": {
    "id": "agent_123456789",
    "name": "Kunden-Support Agent",
    "description": "KI-Agent für Kunden-Support",
    "type": "chatbot",
    "config": {
      "model": "gpt-4",
      "temperature": 0.7,
      "maxTokens": 1000,
      "systemPrompt": "Du bist ein hilfreicher Kunden-Support Agent..."
    },
    "capabilities": ["text_generation", "sentiment_analysis"],
    "isActive": true,
    "createdAt": "2025-07-05T10:30:00Z",
    "updatedAt": "2025-07-05T10:30:00Z"
  },
  "message": "KI-Agent erfolgreich erstellt"
}
```

### **KI-Agent abrufen**

```http
GET /api/ai-agents/{agent_id}
Authorization: Bearer <access_token>
```

### **KI-Agent aktualisieren**

```http
PUT /api/ai-agents/{agent_id}
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Kunden-Support Agent (aktualisiert)",
  "config": {
    "temperature": 0.5
  }
}
```

### **KI-Agent löschen**

```http
DELETE /api/ai-agents/{agent_id}
Authorization: Bearer <access_token>
```

### **KI-Agent-Liste abrufen**

```http
GET /api/ai-agents?page=1&limit=10&type=chatbot&isActive=true
Authorization: Bearer <access_token>
```

### **KI-Agent aktivieren/deaktivieren**

```http
PATCH /api/ai-agents/{agent_id}/toggle
Authorization: Bearer <access_token>
```

## 💬 **CHAT-SYSTEM**

### **Chat-Session erstellen**

```http
POST /api/chat/sessions
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "agentId": "agent_123456789",
  "title": "Kunden-Support Anfrage",
  "metadata": {
    "customerId": "cust_123",
    "category": "technical_support"
  }
}
```

### **Nachricht senden**

```http
POST /api/chat/sessions/{session_id}/messages
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "content": "Hallo, ich habe ein Problem mit meinem Account",
  "type": "user",
  "metadata": {
    "timestamp": "2025-07-05T10:30:00Z"
  }
}
```

**Antwort:**

```json
{
  "success": true,
  "data": {
    "id": "msg_123456789",
    "sessionId": "session_123456789",
    "content": "Hallo, ich habe ein Problem mit meinem Account",
    "type": "user",
    "metadata": {
      "timestamp": "2025-07-05T10:30:00Z"
    },
    "createdAt": "2025-07-05T10:30:00Z"
  }
}
```

### **Chat-Historie abrufen**

```http
GET /api/chat/sessions/{session_id}/messages?page=1&limit=50
Authorization: Bearer <access_token>
```

### **Chat-Session beenden**

```http
PATCH /api/chat/sessions/{session_id}/end
Authorization: Bearer <access_token>
```

## 📊 **ANALYTICS**

### **Chat-Statistiken**

```http
GET /api/analytics/chat?startDate=2025-07-01&endDate=2025-07-05&agentId=agent_123456789
Authorization: Bearer <access_token>
```

**Antwort:**

```json
{
  "success": true,
  "data": {
    "totalSessions": 150,
    "totalMessages": 1250,
    "averageSessionDuration": 300,
    "averageMessagesPerSession": 8.3,
    "satisfactionScore": 4.2,
    "topIssues": [
      {
        "category": "technical_support",
        "count": 45,
        "percentage": 30
      },
      {
        "category": "billing",
        "count": 30,
        "percentage": 20
      }
    ],
    "dailyStats": [
      {
        "date": "2025-07-01",
        "sessions": 25,
        "messages": 200
      }
    ]
  }
}
```

### **Benutzer-Statistiken**

```http
GET /api/analytics/users?startDate=2025-07-01&endDate=2025-07-05
Authorization: Bearer <access_token>
```

### **KI-Agent-Performance**

```http
GET /api/analytics/agents/{agent_id}/performance?startDate=2025-07-01&endDate=2025-07-05
Authorization: Bearer <access_token>
```

## 🔧 **SYSTEM-ADMINISTRATION**

### **System-Status abrufen**

```http
GET /api/admin/system/status
Authorization: Bearer <admin_token>
```

**Antwort:**

```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "uptime": 86400,
    "version": "1.0.0",
    "services": {
      "database": "online",
      "redis": "online",
      "ai_services": "online"
    },
    "metrics": {
      "cpu_usage": 45.2,
      "memory_usage": 67.8,
      "disk_usage": 23.1,
      "active_connections": 125
    }
  }
}
```

### **Logs abrufen**

```http
GET /api/admin/logs?level=error&startDate=2025-07-01&endDate=2025-07-05&limit=100
Authorization: Bearer <admin_token>
```

### **Backup erstellen**

```http
POST /api/admin/backup
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "type": "full",
  "includeLogs": true,
  "includeAnalytics": true
}
```

### **System-Konfiguration abrufen**

```http
GET /api/admin/config
Authorization: Bearer <admin_token>
```

### **System-Konfiguration aktualisieren**

```http
PUT /api/admin/config
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "ai": {
    "defaultModel": "gpt-4",
    "maxTokens": 2000,
    "temperature": 0.7
  },
  "chat": {
    "maxSessionDuration": 3600,
    "maxMessagesPerSession": 100
  },
  "security": {
    "sessionTimeout": 1800,
    "maxLoginAttempts": 5
  }
}
```

## 📝 **FEHLER-CODES**

### **HTTP-Status-Codes**

- `200` - Erfolgreich
- `201` - Erstellt
- `400` - Ungültige Anfrage
- `401` - Nicht autorisiert
- `403` - Verboten
- `404` - Nicht gefunden
- `422` - Validierungsfehler
- `429` - Zu viele Anfragen
- `500` - Server-Fehler

### **Anwendungs-spezifische Fehler-Codes**

```json
{
  "error_codes": {
    "AUTH_INVALID_CREDENTIALS": "Ungültige Anmeldedaten",
    "AUTH_TOKEN_EXPIRED": "Token abgelaufen",
    "AUTH_INSUFFICIENT_PERMISSIONS": "Unzureichende Berechtigungen",
    "USER_NOT_FOUND": "Benutzer nicht gefunden",
    "USER_ALREADY_EXISTS": "Benutzer existiert bereits",
    "AGENT_NOT_FOUND": "KI-Agent nicht gefunden",
    "AGENT_INACTIVE": "KI-Agent ist inaktiv",
    "SESSION_NOT_FOUND": "Chat-Session nicht gefunden",
    "SESSION_EXPIRED": "Chat-Session abgelaufen",
    "VALIDATION_ERROR": "Validierungsfehler",
    "RATE_LIMIT_EXCEEDED": "Rate Limit überschritten",
    "SYSTEM_ERROR": "System-Fehler"
  }
}
```

## 🔄 **WEBHOOKS**

### **Webhook registrieren**

```http
POST /api/webhooks
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "url": "https://example.com/webhook",
  "events": ["chat.message.created", "user.created"],
  "secret": "webhook_secret_key"
}
```

### **Webhook-Events**

```json
{
  "events": {
    "user.created": "Benutzer erstellt",
    "user.updated": "Benutzer aktualisiert",
    "user.deleted": "Benutzer gelöscht",
    "agent.created": "KI-Agent erstellt",
    "agent.updated": "KI-Agent aktualisiert",
    "agent.deleted": "KI-Agent gelöscht",
    "chat.session.created": "Chat-Session erstellt",
    "chat.session.ended": "Chat-Session beendet",
    "chat.message.created": "Chat-Nachricht erstellt",
    "chat.message.received": "Chat-Nachricht empfangen"
  }
}
```

## 📚 **BEISPIELE**

### **Vollständiger Chat-Flow**

```bash
# 1. Benutzer anmelden
curl -X POST https://api.lopez-it-welt.de/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "max@example.com",
    "password": "secure123"
  }'

# 2. Chat-Session erstellen
curl -X POST https://api.lopez-it-welt.de/v1/chat/sessions \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "agentId": "agent_123456789",
    "title": "Kunden-Support"
  }'

# 3. Nachricht senden
curl -X POST https://api.lopez-it-welt.de/v1/chat/sessions/session_123/messages \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Hallo, ich brauche Hilfe",
    "type": "user"
  }'

# 4. Chat-Historie abrufen
curl -X GET https://api.lopez-it-welt.de/v1/chat/sessions/session_123/messages \
  -H "Authorization: Bearer <access_token>"
```

### **KI-Agent-Management**

```bash
# 1. KI-Agent erstellen
curl -X POST https://api.lopez-it-welt.de/v1/ai-agents \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Support Agent",
    "description": "KI-Agent für Kunden-Support",
    "type": "chatbot",
    "config": {
      "model": "gpt-4",
      "temperature": 0.7
    }
  }'

# 2. KI-Agent aktualisieren
curl -X PUT https://api.lopez-it-welt.de/v1/ai-agents/agent_123 \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "config": {
      "temperature": 0.5
    }
  }'

# 3. KI-Agent-Liste abrufen
curl -X GET "https://api.lopez-it-welt.de/v1/ai-agents?page=1&limit=10" \
  -H "Authorization: Bearer <access_token>"
```

## 🔧 **SDK & BIBLIOTHEKEN**

### **JavaScript/TypeScript SDK**

```bash
npm install @lopez-it-welt/sdk
```

```typescript
import { LopezITWeltClient } from '@lopez-it-welt/sdk';

const client = new LopezITWeltClient({
  apiKey: 'your_api_key',
  baseUrl: 'https://api.lopez-it-welt.de/v1',
});

// Benutzer erstellen
const user = await client.users.create({
  name: 'Max Mustermann',
  email: 'max@example.com',
  password: 'secure123',
});

// Chat-Session erstellen
const session = await client.chat.createSession({
  agentId: 'agent_123',
  title: 'Kunden-Support',
});

// Nachricht senden
const message = await client.chat.sendMessage(session.id, {
  content: 'Hallo, ich brauche Hilfe',
  type: 'user',
});
```

### **Python SDK**

```bash
pip install lopez-it-welt-sdk
```

```python
from lopez_it_welt import LopezITWeltClient

client = LopezITWeltClient(
    api_key='your_api_key',
    base_url='https://api.lopez-it-welt.de/v1'
)

# Benutzer erstellen
user = client.users.create({
    'name': 'Max Mustermann',
    'email': 'max@example.com',
    'password': 'secure123'
})

# Chat-Session erstellen
session = client.chat.create_session({
    'agent_id': 'agent_123',
    'title': 'Kunden-Support'
})
```

## 📞 **SUPPORT**

### **API-Support**

- **E-Mail:** api-support@lopez-it-welt.de
- **Dokumentation:** https://docs.lopez-it-welt.de/api
- **Status-Seite:** https://status.lopez-it-welt.de
- **GitHub Issues:** https://github.com/lopez-it-welt/api/issues

### **Rate Limits**

- **Standard:** 1000 Anfragen/Stunde
- **Premium:** 10000 Anfragen/Stunde
- **Enterprise:** Unbegrenzt

### **Versionierung**

- **Aktuelle Version:** v1
- **Deprecation Policy:** 12 Monate Vorankündigung
- **Breaking Changes:** Nur in Major-Versionen

---

**Letzte Aktualisierung:** 2025-07-05  
**Nächste Überprüfung:** 2025-07-06
