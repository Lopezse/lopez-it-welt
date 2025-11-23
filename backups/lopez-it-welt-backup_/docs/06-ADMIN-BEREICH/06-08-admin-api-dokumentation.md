# 🔌 Admin-API-Dokumentation - Lopez IT Welt

**Version:** 1.0  
**Datum:** 2025-07-05  
**Status:** 🚧 IN ENTWICKLUNG  
**Base URL:** `https://admin-api.lopez-it-welt.de/v1`  
**Autor:** Lopez IT Welt Team

## 📋 **ÜBERSICHT**

Die **Admin-API-Dokumentation** beschreibt alle verfügbaren Admin-Endpunkte des Lopez IT Welt Systems. Diese API ist speziell für Administratoren und System-Management konzipiert.

## 🔐 **AUTHENTIFIZIERUNG**

### **Admin-Token**

```http
Authorization: Bearer <admin_token>
```

### **API-Key (für externe Admin-Tools)**

```http
X-Admin-API-Key: <admin_api_key>
```

## 📊 **ALLGEMEINE ANTWORTEN**

### **Erfolgreiche Admin-Antwort**

```json
{
  "success": true,
  "data": {
    // Antwortdaten
  },
  "message": "Admin-Operation erfolgreich",
  "timestamp": "2025-07-05T10:30:00Z",
  "adminId": "admin_123456789"
}
```

### **Admin-Fehler-Antwort**

```json
{
  "success": false,
  "error": {
    "code": "ADMIN_PERMISSION_DENIED",
    "message": "Unzureichende Admin-Berechtigungen",
    "details": [
      {
        "field": "permission",
        "message": "Admin-Rolle erforderlich"
      }
    ]
  },
  "timestamp": "2025-07-05T10:30:00Z"
}
```

## 👥 **ADMIN-BENUTZER-MANAGEMENT**

### **Admin-Benutzer erstellen**

```http
POST /api/admin/users
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Admin Mustermann",
  "email": "admin@lopez-it-welt.de",
  "password": "secureAdmin123",
  "role": "admin",
  "permissions": [
    "user_management",
    "system_configuration",
    "security_management"
  ],
  "organizationId": "org_123456789"
}
```

**Antwort:**

```json
{
  "success": true,
  "data": {
    "id": "admin_123456789",
    "name": "Admin Mustermann",
    "email": "admin@lopez-it-welt.de",
    "role": "admin",
    "permissions": [
      "user_management",
      "system_configuration",
      "security_management"
    ],
    "organizationId": "org_123456789",
    "isActive": true,
    "createdAt": "2025-07-05T10:30:00Z",
    "updatedAt": "2025-07-05T10:30:00Z"
  },
  "message": "Admin-Benutzer erfolgreich erstellt"
}
```

### **Admin-Benutzer abrufen**

```http
GET /api/admin/users/{admin_id}
Authorization: Bearer <admin_token>
```

**Antwort:**

```json
{
  "success": true,
  "data": {
    "id": "admin_123456789",
    "name": "Admin Mustermann",
    "email": "admin@lopez-it-welt.de",
    "role": "admin",
    "permissions": [
      "user_management",
      "system_configuration",
      "security_management"
    ],
    "organizationId": "org_123456789",
    "lastLoginAt": "2025-07-05T09:15:00Z",
    "isActive": true,
    "createdAt": "2025-07-05T10:30:00Z",
    "updatedAt": "2025-07-05T10:30:00Z"
  }
}
```

### **Admin-Benutzer aktualisieren**

```http
PUT /api/admin/users/{admin_id}
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Admin Mustermann (aktualisiert)",
  "permissions": [
    "user_management",
    "system_configuration",
    "security_management",
    "analytics_access"
  ],
  "isActive": true
}
```

### **Admin-Benutzer löschen**

```http
DELETE /api/admin/users/{admin_id}
Authorization: Bearer <admin_token>
```

### **Admin-Benutzer-Liste abrufen**

```http
GET /api/admin/users?page=1&limit=10&role=admin&isActive=true
Authorization: Bearer <admin_token>
```

**Antwort:**

```json
{
  "success": true,
  "data": {
    "admins": [
      {
        "id": "admin_123456789",
        "name": "Admin Mustermann",
        "email": "admin@lopez-it-welt.de",
        "role": "admin",
        "permissions": ["user_management", "system_configuration"],
        "lastLoginAt": "2025-07-05T09:15:00Z",
        "isActive": true,
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

## 🎛️ **SYSTEM-KONFIGURATION**

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
    "components": {
      "database": {
        "status": "online",
        "responseTime": 15,
        "connections": 25
      },
      "redis": {
        "status": "online",
        "memoryUsage": 67.5,
        "hitRate": 89.2
      },
      "api": {
        "status": "online",
        "responseTime": 45,
        "requestsPerMinute": 120
      },
      "frontend": {
        "status": "online",
        "responseTime": 120,
        "activeUsers": 45
      }
    },
    "metrics": {
      "cpuUsage": 45.2,
      "memoryUsage": 67.8,
      "diskUsage": 23.1,
      "networkTraffic": {
        "inbound": 1024000,
        "outbound": 2048000
      }
    },
    "alerts": {
      "critical": 0,
      "warning": 2,
      "info": 5
    }
  }
}
```

### **System-Konfiguration abrufen**

```http
GET /api/admin/system/config
Authorization: Bearer <admin_token>
```

**Antwort:**

```json
{
  "success": true,
  "data": {
    "general": {
      "siteName": "Lopez IT Welt",
      "siteDescription": "KI-Agenten Plattform",
      "maintenanceMode": false,
      "registrationEnabled": true,
      "emailVerificationRequired": true
    },
    "ai": {
      "defaultModel": "gpt-4",
      "maxTokens": 2000,
      "temperature": 0.7,
      "timeout": 30000
    },
    "security": {
      "sessionTimeout": 1800,
      "maxLoginAttempts": 5,
      "passwordPolicy": {
        "minLength": 8,
        "requireUppercase": true,
        "requireLowercase": true,
        "requireNumbers": true,
        "requireSpecialChars": true
      },
      "twoFactorRequired": false
    },
    "email": {
      "smtp": {
        "host": "smtp.gmail.com",
        "port": 587,
        "secure": true
      },
      "fromAddress": "noreply@lopez-it-welt.de",
      "templates": {
        "welcome": "welcome-template",
        "passwordReset": "password-reset-template",
        "verification": "verification-template"
      }
    },
    "storage": {
      "provider": "s3",
      "bucket": "lopez-it-welt-storage",
      "region": "eu-central-1",
      "maxFileSize": 10485760
    }
  }
}
```

### **System-Konfiguration aktualisieren**

```http
PUT /api/admin/system/config
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "general": {
    "maintenanceMode": true,
    "registrationEnabled": false
  },
  "ai": {
    "maxTokens": 3000,
    "temperature": 0.5
  },
  "security": {
    "sessionTimeout": 3600,
    "maxLoginAttempts": 3
  }
}
```

### **System-Backup erstellen**

```http
POST /api/admin/system/backup
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "type": "full",
  "includeLogs": true,
  "includeAnalytics": true,
  "compression": true,
  "encryption": true
}
```

**Antwort:**

```json
{
  "success": true,
  "data": {
    "backupId": "backup_123456789",
    "type": "full",
    "size": 104857600,
    "compression": true,
    "encryption": true,
    "status": "completed",
    "downloadUrl": "https://admin-api.lopez-it-welt.de/v1/admin/system/backup/backup_123456789/download",
    "createdAt": "2025-07-05T10:30:00Z"
  },
  "message": "System-Backup erfolgreich erstellt"
}
```

### **System-Backup wiederherstellen**

```http
POST /api/admin/system/backup/{backup_id}/restore
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "confirmRestore": true,
  "validateBackup": true
}
```

## 📊 **MONITORING & ANALYTICS**

### **System-Metriken abrufen**

```http
GET /api/admin/monitoring/metrics?startDate=2025-07-01&endDate=2025-07-05&interval=hourly
Authorization: Bearer <admin_token>
```

**Antwort:**

```json
{
  "success": true,
  "data": {
    "systemMetrics": {
      "cpu": [
        {
          "timestamp": "2025-07-05T10:00:00Z",
          "value": 45.2
        }
      ],
      "memory": [
        {
          "timestamp": "2025-07-05T10:00:00Z",
          "value": 67.8
        }
      ],
      "disk": [
        {
          "timestamp": "2025-07-05T10:00:00Z",
          "value": 23.1
        }
      ]
    },
    "applicationMetrics": {
      "requests": [
        {
          "timestamp": "2025-07-05T10:00:00Z",
          "count": 1200,
          "averageResponseTime": 45
        }
      ],
      "errors": [
        {
          "timestamp": "2025-07-05T10:00:00Z",
          "count": 5,
          "rate": 0.4
        }
      ]
    },
    "userMetrics": {
      "activeUsers": [
        {
          "timestamp": "2025-07-05T10:00:00Z",
          "count": 45
        }
      ],
      "newUsers": [
        {
          "timestamp": "2025-07-05T10:00:00Z",
          "count": 3
        }
      ]
    }
  }
}
```

### **Performance-Alerts abrufen**

```http
GET /api/admin/monitoring/alerts?severity=critical&status=active
Authorization: Bearer <admin_token>
```

**Antwort:**

```json
{
  "success": true,
  "data": {
    "alerts": [
      {
        "id": "alert_123456789",
        "type": "high_cpu_usage",
        "severity": "critical",
        "message": "CPU-Auslastung über 90%",
        "metric": "cpu_usage",
        "value": 92.5,
        "threshold": 90,
        "timestamp": "2025-07-05T10:25:00Z",
        "status": "active",
        "acknowledged": false
      }
    ],
    "summary": {
      "total": 1,
      "critical": 1,
      "warning": 0,
      "info": 0
    }
  }
}
```

### **Alert bestätigen**

```http
PATCH /api/admin/monitoring/alerts/{alert_id}/acknowledge
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "acknowledgedBy": "admin_123456789",
  "comment": "CPU-Last wird überwacht"
}
```

## 🔍 **LOGGING & AUDIT**

### **System-Logs abrufen**

```http
GET /api/admin/logs?level=error&startDate=2025-07-01&endDate=2025-07-05&limit=100
Authorization: Bearer <admin_token>
```

**Antwort:**

```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": "log_123456789",
        "timestamp": "2025-07-05T10:25:00Z",
        "level": "error",
        "category": "application",
        "message": "Database connection failed",
        "context": {
          "userId": "user_123456789",
          "ipAddress": "192.168.1.100",
          "userAgent": "Mozilla/5.0..."
        },
        "data": {
          "error": "Connection timeout",
          "database": "mysql",
          "retryCount": 3
        },
        "stackTrace": "Error: Connection timeout..."
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 100,
      "total": 25,
      "totalPages": 1
    }
  }
}
```

### **Audit-Logs abrufen**

```http
GET /api/admin/audit?action=user_created&startDate=2025-07-01&endDate=2025-07-05
Authorization: Bearer <admin_token>
```

**Antwort:**

```json
{
  "success": true,
  "data": {
    "auditEvents": [
      {
        "id": "audit_123456789",
        "timestamp": "2025-07-05T10:30:00Z",
        "userId": "admin_123456789",
        "action": "user_created",
        "resource": "users",
        "resourceId": "user_987654321",
        "oldValue": null,
        "newValue": {
          "name": "Max Mustermann",
          "email": "max@example.com",
          "role": "user"
        },
        "ipAddress": "192.168.1.100",
        "userAgent": "Mozilla/5.0...",
        "metadata": {
          "adminId": "admin_123456789",
          "reason": "New user registration"
        }
      }
    ],
    "summary": {
      "totalEvents": 15,
      "eventsByAction": {
        "user_created": 5,
        "user_updated": 8,
        "user_deleted": 2
      },
      "eventsByUser": {
        "admin_123456789": 10,
        "admin_987654321": 5
      }
    }
  }
}
```

### **Logs exportieren**

```http
POST /api/admin/logs/export
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "type": "system_logs",
  "startDate": "2025-07-01",
  "endDate": "2025-07-05",
  "level": ["error", "warn"],
  "format": "csv",
  "includeContext": true
}
```

**Antwort:**

```json
{
  "success": true,
  "data": {
    "exportId": "export_123456789",
    "type": "system_logs",
    "format": "csv",
    "size": 1048576,
    "downloadUrl": "https://admin-api.lopez-it-welt.de/v1/admin/logs/export/export_123456789/download",
    "expiresAt": "2025-07-12T10:30:00Z"
  },
  "message": "Log-Export erfolgreich erstellt"
}
```

## 🔒 **SECURITY-MANAGEMENT**

### **Security-Events abrufen**

```http
GET /api/admin/security/events?startDate=2025-07-01&endDate=2025-07-05&type=suspicious_activity
Authorization: Bearer <admin_token>
```

**Antwort:**

```json
{
  "success": true,
  "data": {
    "securityEvents": [
      {
        "id": "security_123456789",
        "timestamp": "2025-07-05T10:25:00Z",
        "type": "suspicious_activity",
        "userId": "user_123456789",
        "ipAddress": "192.168.1.100",
        "description": "Multiple failed login attempts",
        "riskLevel": "high",
        "details": {
          "attempts": 15,
          "timeframe": "5 minutes",
          "userAgent": "Mozilla/5.0..."
        },
        "action": "ip_blocked",
        "status": "resolved"
      }
    ],
    "summary": {
      "totalEvents": 25,
      "eventsByType": {
        "failed_login": 15,
        "suspicious_activity": 5,
        "access_denied": 5
      },
      "riskLevels": {
        "low": 10,
        "medium": 10,
        "high": 5
      }
    }
  }
}
```

### **IP-Adresse blockieren**

```http
POST /api/admin/security/block-ip
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "ipAddress": "192.168.1.100",
  "reason": "Multiple failed login attempts",
  "duration": 3600,
  "adminId": "admin_123456789"
}
```

### **IP-Adresse entsperren**

```http
POST /api/admin/security/unblock-ip
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "ipAddress": "192.168.1.100",
  "reason": "Manual unblock",
  "adminId": "admin_123456789"
}
```

### **Security-Report generieren**

```http
POST /api/admin/security/report
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "startDate": "2025-07-01",
  "endDate": "2025-07-05",
  "includeThreats": true,
  "includeCompliance": true,
  "format": "pdf"
}
```

## 📈 **REPORTING**

### **Report generieren**

```http
POST /api/admin/reports/generate
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "type": "business_overview",
  "startDate": "2025-07-01",
  "endDate": "2025-07-05",
  "format": "pdf",
  "includeCharts": true,
  "includeData": true
}
```

**Antwort:**

```json
{
  "success": true,
  "data": {
    "reportId": "report_123456789",
    "type": "business_overview",
    "format": "pdf",
    "size": 2097152,
    "downloadUrl": "https://admin-api.lopez-it-welt.de/v1/admin/reports/report_123456789/download",
    "expiresAt": "2025-07-12T10:30:00Z",
    "generatedAt": "2025-07-05T10:30:00Z"
  },
  "message": "Report erfolgreich generiert"
}
```

### **Geplante Reports abrufen**

```http
GET /api/admin/reports/scheduled
Authorization: Bearer <admin_token>
```

**Antwort:**

```json
{
  "success": true,
  "data": {
    "scheduledReports": [
      {
        "id": "scheduled_123456789",
        "name": "Täglicher Business-Überblick",
        "type": "business_overview",
        "schedule": "0 8 * * *",
        "recipients": ["admin@lopez-it-welt.de"],
        "enabled": true,
        "lastRun": "2025-07-05T08:00:00Z",
        "nextRun": "2025-07-06T08:00:00Z"
      }
    ]
  }
}
```

### **Report-Schedule erstellen**

```http
POST /api/admin/reports/schedule
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Wöchentliche System-Performance",
  "type": "system_performance",
  "schedule": "0 9 * * 1",
  "recipients": ["devops@lopez-it-welt.de"],
  "format": "pdf",
  "enabled": true
}
```

## 🚨 **ALERTING**

### **Alerts abrufen**

```http
GET /api/admin/alerts?status=active&severity=critical
Authorization: Bearer <admin_token>
```

### **Alert-Regel erstellen**

```http
POST /api/admin/alerts/rules
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "High CPU Usage Alert",
  "metric": "cpu_usage",
  "condition": "gt",
  "threshold": 90,
  "duration": 300,
  "severity": "critical",
  "channels": ["email", "slack"],
  "recipients": ["admin@lopez-it-welt.de"],
  "enabled": true
}
```

### **Alert-Regel aktualisieren**

```http
PUT /api/admin/alerts/rules/{rule_id}
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "threshold": 85,
  "duration": 600,
  "channels": ["email", "slack", "sms"]
}
```

## 📊 **ANALYTICS**

### **Analytics-Daten abrufen**

```http
GET /api/admin/analytics?type=user_activity&startDate=2025-07-01&endDate=2025-07-05&groupBy=day
Authorization: Bearer <admin_token>
```

**Antwort:**

```json
{
  "success": true,
  "data": {
    "userActivity": {
      "totalUsers": 150,
      "activeUsers": 45,
      "newUsers": 12,
      "userGrowth": 8.7,
      "sessions": [
        {
          "date": "2025-07-05",
          "sessions": 120,
          "duration": 300,
          "messages": 850
        }
      ]
    },
    "systemPerformance": {
      "uptime": 99.9,
      "averageResponseTime": 45,
      "errorRate": 0.1,
      "throughput": 1200
    },
    "revenue": {
      "totalRevenue": 5000,
      "revenueGrowth": 15.2,
      "subscriptions": 25,
      "churnRate": 2.1
    }
  }
}
```

## 🔧 **SYSTEM-TOOLS**

### **Datenbank-Migration ausführen**

```http
POST /api/admin/system/migrate
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "direction": "up",
  "targetVersion": "latest",
  "validateOnly": false
}
```

### **Cache leeren**

```http
POST /api/admin/system/cache/clear
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "type": "all",
  "confirm": true
}
```

### **System-Neustart**

```http
POST /api/admin/system/restart
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "confirm": true,
  "reason": "Configuration update",
  "scheduledAt": "2025-07-05T23:00:00Z"
}
```

## 📝 **FEHLER-CODES**

### **Admin-spezifische Fehler-Codes**

```json
{
  "error_codes": {
    "ADMIN_PERMISSION_DENIED": "Unzureichende Admin-Berechtigungen",
    "ADMIN_ROLE_REQUIRED": "Admin-Rolle erforderlich",
    "SYSTEM_MAINTENANCE": "System in Wartung",
    "BACKUP_IN_PROGRESS": "Backup läuft",
    "MIGRATION_IN_PROGRESS": "Migration läuft",
    "CONFIGURATION_INVALID": "Ungültige Konfiguration",
    "SYSTEM_OVERLOAD": "System überlastet",
    "SECURITY_VIOLATION": "Sicherheitsverstoß",
    "AUDIT_LOG_FULL": "Audit-Log voll",
    "REPORT_GENERATION_FAILED": "Report-Generierung fehlgeschlagen"
  }
}
```

## 📞 **SUPPORT**

### **Admin-Support**

- **E-Mail:** admin-support@lopez-it-welt.de
- **Dokumentation:** https://admin-docs.lopez-it-welt.de
- **Status-Seite:** https://status.lopez-it-welt.de
- **Emergency:** +49 123 456789

### **Rate Limits**

- **Standard:** 1000 Anfragen/Stunde
- **Admin:** 5000 Anfragen/Stunde
- **Super-Admin:** Unbegrenzt

---

**Letzte Aktualisierung:** 2025-07-05  
**Nächste Überprüfung:** 2025-07-06
