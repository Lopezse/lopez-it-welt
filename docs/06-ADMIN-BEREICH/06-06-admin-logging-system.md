# 📝 Admin-Logging-System - Lopez IT Welt

**Version:** 1.0  
**Datum:** 2025-07-05  
**Status:** 🚧 IN ENTWICKLUNG  
**Autor:** Lopez IT Welt Team

## 📋 **ÜBERSICHT**

Das **Admin-Logging-System** implementiert ein umfassendes Logging- und Audit-System für das Lopez IT Welt System. Es gewährleistet Transparenz, Compliance und Troubleshooting-Fähigkeiten für alle System-Aktivitäten.

## 🎯 **LOGGING-STRUKTUR**

### **Log-Level**

```typescript
// Log-Level-Definitionen
enum LogLevel {
  TRACE = 0,
  DEBUG = 1,
  INFO = 2,
  WARN = 3,
  ERROR = 4,
  FATAL = 5,
}

// Log-Kategorien
enum LogCategory {
  // System-Logs
  SYSTEM = "system",
  APPLICATION = "application",
  DATABASE = "database",
  NETWORK = "network",

  // Benutzer-Logs
  USER_ACTIVITY = "user_activity",
  AUTHENTICATION = "authentication",
  AUTHORIZATION = "authorization",

  // Business-Logs
  BUSINESS = "business",
  TRANSACTIONS = "transactions",
  ANALYTICS = "analytics",

  // Sicherheits-Logs
  SECURITY = "security",
  AUDIT = "audit",
  COMPLIANCE = "compliance",

  // Performance-Logs
  PERFORMANCE = "performance",
  MONITORING = "monitoring",
  METRICS = "metrics",
}
```

### **Log-Format**

```typescript
// Log-Entry-Struktur
interface LogEntry {
  // Basis-Informationen
  id: string;
  timestamp: Date;
  level: LogLevel;
  category: LogCategory;
  message: string;

  // Kontext-Informationen
  context: {
    userId?: string;
    sessionId?: string;
    requestId?: string;
    ipAddress?: string;
    userAgent?: string;
    url?: string;
    method?: string;
  };

  // Zusätzliche Daten
  data: any;
  tags: string[];

  // Performance-Metriken
  performance?: {
    duration: number;
    memoryUsage: number;
    cpuUsage: number;
  };

  // Stack-Trace (für Fehler)
  stackTrace?: string;

  // Korrelations-ID
  correlationId?: string;
}
```

## 🛠️ **LOGGING-IMPLEMENTATION**

### **Winston-Logger**

```typescript
// Winston-Logger-Konfiguration
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

// Logger-Konfiguration
const loggerConfig = {
  // Log-Level
  level: process.env.LOG_LEVEL || "info",

  // Log-Format
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
      return JSON.stringify({
        timestamp,
        level,
        message,
        ...meta,
      });
    }),
  ),

  // Transport-Konfiguration
  transports: [
    // Console-Transport
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    }),

    // Datei-Transport für alle Logs
    new DailyRotateFile({
      filename: "logs/application-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxSize: "20m",
      maxFiles: "14d",
      level: "info",
    }),

    // Datei-Transport für Fehler
    new DailyRotateFile({
      filename: "logs/error-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxSize: "20m",
      maxFiles: "30d",
      level: "error",
    }),

    // Datei-Transport für Audit-Logs
    new DailyRotateFile({
      filename: "logs/audit-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxSize: "20m",
      maxFiles: "90d",
      level: "info",
    }),
  ],
};

// Logger-Instanz erstellen
const logger = winston.createLogger(loggerConfig);

// Logger-Export
export default logger;
```

### **Strukturierte Logging-Funktionen**

```typescript
// Logging-Service
class LoggingService {
  // Info-Log
  static info(message: string, context?: LogContext, data?: any): void {
    logger.info(message, {
      category: LogCategory.APPLICATION,
      context,
      data,
      timestamp: new Date(),
    });
  }

  // Debug-Log
  static debug(message: string, context?: LogContext, data?: any): void {
    logger.debug(message, {
      category: LogCategory.APPLICATION,
      context,
      data,
      timestamp: new Date(),
    });
  }

  // Warn-Log
  static warn(message: string, context?: LogContext, data?: any): void {
    logger.warn(message, {
      category: LogCategory.APPLICATION,
      context,
      data,
      timestamp: new Date(),
    });
  }

  // Error-Log
  static error(message: string, error?: Error, context?: LogContext, data?: any): void {
    logger.error(message, {
      category: LogCategory.APPLICATION,
      context,
      data,
      stackTrace: error?.stack,
      timestamp: new Date(),
    });
  }

  // Fatal-Log
  static fatal(message: string, error?: Error, context?: LogContext, data?: any): void {
    logger.error(message, {
      category: LogCategory.SYSTEM,
      context,
      data,
      stackTrace: error?.stack,
      timestamp: new Date(),
    });
  }

  // Audit-Log
  static audit(action: string, userId: string, resource: string, details?: any): void {
    logger.info(`AUDIT: ${action}`, {
      category: LogCategory.AUDIT,
      context: {
        userId,
        action,
        resource,
      },
      data: details,
      timestamp: new Date(),
    });
  }

  // Security-Log
  static security(event: string, userId?: string, ipAddress?: string, details?: any): void {
    logger.warn(`SECURITY: ${event}`, {
      category: LogCategory.SECURITY,
      context: {
        userId,
        ipAddress,
        event,
      },
      data: details,
      timestamp: new Date(),
    });
  }

  // Performance-Log
  static performance(operation: string, duration: number, context?: LogContext): void {
    logger.info(`PERFORMANCE: ${operation}`, {
      category: LogCategory.PERFORMANCE,
      context,
      data: {
        operation,
        duration,
        timestamp: new Date(),
      },
    });
  }
}

// Log-Context-Interface
interface LogContext {
  userId?: string;
  sessionId?: string;
  requestId?: string;
  ipAddress?: string;
  userAgent?: string;
  url?: string;
  method?: string;
  correlationId?: string;
}
```

## 🔍 **AUDIT-LOGGING**

### **Audit-Trail-System**

```typescript
// Audit-Trail-Interface
interface AuditTrail {
  id: string;
  timestamp: Date;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  oldValue?: any;
  newValue?: any;
  ipAddress: string;
  userAgent: string;
  sessionId: string;
  metadata: any;
}

// Audit-Service
class AuditService {
  // Audit-Event erstellen
  static async logAuditEvent(
    userId: string,
    action: string,
    resource: string,
    resourceId?: string,
    oldValue?: any,
    newValue?: any,
    metadata?: any,
  ): Promise<void> {
    const auditEvent: AuditTrail = {
      id: generateId(),
      timestamp: new Date(),
      userId,
      action,
      resource,
      resourceId,
      oldValue,
      newValue,
      ipAddress: getClientIP(),
      userAgent: getClientUserAgent(),
      sessionId: getSessionId(),
      metadata: metadata || {},
    };

    // Audit-Event in Datenbank speichern
    await this.saveAuditEvent(auditEvent);

    // Audit-Event loggen
    LoggingService.audit(action, userId, resource, {
      resourceId,
      oldValue,
      newValue,
      metadata,
    });
  }

  // Benutzer-Aktivitäten auditieren
  static async logUserActivity(userId: string, activity: string, details?: any): Promise<void> {
    await this.logAuditEvent(userId, "USER_ACTIVITY", "user", userId, undefined, undefined, {
      activity,
      details,
    });
  }

  // Datenbank-Änderungen auditieren
  static async logDataChange(
    userId: string,
    table: string,
    recordId: string,
    action: "CREATE" | "UPDATE" | "DELETE",
    oldValue?: any,
    newValue?: any,
  ): Promise<void> {
    await this.logAuditEvent(userId, action, table, recordId, oldValue, newValue);
  }

  // Sicherheits-Events auditieren
  static async logSecurityEvent(userId: string, event: string, details?: any): Promise<void> {
    await this.logAuditEvent(
      userId,
      "SECURITY_EVENT",
      "security",
      undefined,
      undefined,
      undefined,
      { event, details },
    );
  }
}
```

### **Audit-Query-System**

```typescript
// Audit-Query-Interface
interface AuditQuery {
  userId?: string;
  action?: string;
  resource?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

// Audit-Query-Service
class AuditQueryService {
  // Audit-Events abfragen
  static async queryAuditEvents(query: AuditQuery): Promise<AuditTrail[]> {
    const whereConditions: any = {};

    if (query.userId) {
      whereConditions.userId = query.userId;
    }

    if (query.action) {
      whereConditions.action = query.action;
    }

    if (query.resource) {
      whereConditions.resource = query.resource;
    }

    if (query.startDate || query.endDate) {
      whereConditions.timestamp = {};

      if (query.startDate) {
        whereConditions.timestamp.$gte = query.startDate;
      }

      if (query.endDate) {
        whereConditions.timestamp.$lte = query.endDate;
      }
    }

    const auditEvents = await AuditTrail.find(whereConditions)
      .sort({ timestamp: -1 })
      .limit(query.limit || 100)
      .skip(query.offset || 0);

    return auditEvents;
  }

  // Audit-Report generieren
  static async generateAuditReport(
    startDate: Date,
    endDate: Date,
    userId?: string,
  ): Promise<AuditReport> {
    const query: AuditQuery = {
      startDate,
      endDate,
      userId,
    };

    const auditEvents = await this.queryAuditEvents(query);

    // Statistiken berechnen
    const statistics = this.calculateAuditStatistics(auditEvents);

    // Häufige Aktionen
    const frequentActions = this.getFrequentActions(auditEvents);

    // Benutzer-Aktivitäten
    const userActivities = this.getUserActivities(auditEvents);

    return {
      period: { startDate, endDate },
      totalEvents: auditEvents.length,
      statistics,
      frequentActions,
      userActivities,
      events: auditEvents,
    };
  }

  // Audit-Export
  static async exportAuditEvents(
    query: AuditQuery,
    format: "csv" | "json" | "pdf",
  ): Promise<Buffer> {
    const auditEvents = await this.queryAuditEvents(query);

    switch (format) {
      case "csv":
        return this.exportToCSV(auditEvents);
      case "json":
        return this.exportToJSON(auditEvents);
      case "pdf":
        return this.exportToPDF(auditEvents);
      default:
        throw new Error(`Unbekanntes Export-Format: ${format}`);
    }
  }
}
```

## 🔒 **SECURITY-LOGGING**

### **Security-Event-Logging**

```typescript
// Security-Event-Typen
enum SecurityEventType {
  // Authentifizierung
  LOGIN_SUCCESS = "login_success",
  LOGIN_FAILED = "login_failed",
  LOGOUT = "logout",
  PASSWORD_CHANGE = "password_change",
  PASSWORD_RESET = "password_reset",

  // Autorisierung
  ACCESS_GRANTED = "access_granted",
  ACCESS_DENIED = "access_denied",
  PERMISSION_CHANGE = "permission_change",

  // Bedrohungen
  SUSPICIOUS_ACTIVITY = "suspicious_activity",
  BRUTE_FORCE_ATTEMPT = "brute_force_attempt",
  SQL_INJECTION_ATTEMPT = "sql_injection_attempt",
  XSS_ATTEMPT = "xss_attempt",

  // Daten-Sicherheit
  DATA_ACCESS = "data_access",
  DATA_EXPORT = "data_export",
  DATA_DELETION = "data_deletion",

  // System-Sicherheit
  CONFIGURATION_CHANGE = "configuration_change",
  BACKUP_CREATED = "backup_created",
  BACKUP_RESTORED = "backup_restored",
}

// Security-Logging-Service
class SecurityLoggingService {
  // Security-Event loggen
  static async logSecurityEvent(
    eventType: SecurityEventType,
    userId?: string,
    details?: any,
  ): Promise<void> {
    const securityEvent = {
      id: generateId(),
      timestamp: new Date(),
      eventType,
      userId,
      ipAddress: getClientIP(),
      userAgent: getClientUserAgent(),
      sessionId: getSessionId(),
      details: details || {},
    };

    // Security-Event in Datenbank speichern
    await this.saveSecurityEvent(securityEvent);

    // Security-Event loggen
    LoggingService.security(eventType, userId, getClientIP(), details);

    // Bei kritischen Events Alert auslösen
    if (this.isCriticalEvent(eventType)) {
      await this.triggerSecurityAlert(securityEvent);
    }
  }

  // Login-Versuch loggen
  static async logLoginAttempt(email: string, success: boolean, reason?: string): Promise<void> {
    const eventType = success ? SecurityEventType.LOGIN_SUCCESS : SecurityEventType.LOGIN_FAILED;

    await this.logSecurityEvent(eventType, undefined, {
      email,
      success,
      reason,
    });

    // Bei fehlgeschlagenen Versuchen Rate-Limiting prüfen
    if (!success) {
      await this.checkRateLimiting(email);
    }
  }

  // Zugriffs-Versuch loggen
  static async logAccessAttempt(
    userId: string,
    resource: string,
    granted: boolean,
    reason?: string,
  ): Promise<void> {
    const eventType = granted ? SecurityEventType.ACCESS_GRANTED : SecurityEventType.ACCESS_DENIED;

    await this.logSecurityEvent(eventType, userId, {
      resource,
      granted,
      reason,
    });
  }

  // Verdächtige Aktivität loggen
  static async logSuspiciousActivity(
    userId: string,
    activity: string,
    riskLevel: "low" | "medium" | "high",
    details?: any,
  ): Promise<void> {
    await this.logSecurityEvent(SecurityEventType.SUSPICIOUS_ACTIVITY, userId, {
      activity,
      riskLevel,
      details,
    });
  }

  // Kritische Events prüfen
  private static isCriticalEvent(eventType: SecurityEventType): boolean {
    const criticalEvents = [
      SecurityEventType.BRUTE_FORCE_ATTEMPT,
      SecurityEventType.SQL_INJECTION_ATTEMPT,
      SecurityEventType.XSS_ATTEMPT,
      SecurityEventType.SUSPICIOUS_ACTIVITY,
    ];

    return criticalEvents.includes(eventType);
  }
}
```

## 📊 **PERFORMANCE-LOGGING**

### **Performance-Monitoring**

```typescript
// Performance-Metriken
interface PerformanceMetrics {
  // Request-Metriken
  request: {
    duration: number;
    method: string;
    url: string;
    statusCode: number;
    responseSize: number;
  };

  // Datenbank-Metriken
  database: {
    queryCount: number;
    totalQueryTime: number;
    slowQueries: SlowQuery[];
  };

  // Cache-Metriken
  cache: {
    hitCount: number;
    missCount: number;
    hitRate: number;
  };

  // Memory-Metriken
  memory: {
    heapUsed: number;
    heapTotal: number;
    external: number;
  };

  // CPU-Metriken
  cpu: {
    usage: number;
    loadAverage: number;
  };
}

// Performance-Logging-Service
class PerformanceLoggingService {
  // Request-Performance loggen
  static logRequestPerformance(
    method: string,
    url: string,
    duration: number,
    statusCode: number,
    responseSize: number,
  ): void {
    LoggingService.performance("HTTP_REQUEST", duration, {
      method,
      url,
      statusCode,
      responseSize,
    });
  }

  // Datenbank-Performance loggen
  static logDatabasePerformance(query: string, duration: number, rowsAffected: number): void {
    LoggingService.performance("DATABASE_QUERY", duration, {
      query: this.sanitizeQuery(query),
      rowsAffected,
    });

    // Langsame Queries separat loggen
    if (duration > 1000) {
      // > 1 Sekunde
      LoggingService.warn("SLOW_QUERY_DETECTED", undefined, {
        query: this.sanitizeQuery(query),
        duration,
        rowsAffected,
      });
    }
  }

  // Cache-Performance loggen
  static logCachePerformance(
    operation: "get" | "set" | "delete",
    key: string,
    hit: boolean,
    duration: number,
  ): void {
    LoggingService.performance("CACHE_OPERATION", duration, {
      operation,
      key,
      hit,
    });
  }

  // Memory-Performance loggen
  static logMemoryPerformance(): void {
    const memoryUsage = process.memoryUsage();

    LoggingService.info("MEMORY_USAGE", undefined, {
      heapUsed: memoryUsage.heapUsed,
      heapTotal: memoryUsage.heapTotal,
      external: memoryUsage.external,
      rss: memoryUsage.rss,
    });
  }

  // Query sanitieren
  private static sanitizeQuery(query: string): string {
    // Sensible Daten aus Query entfernen
    return query.replace(/password\s*=\s*['"][^'"]*['"]/gi, "password=***");
  }
}
```

## 🔍 **LOG-ANALYSIS**

### **Log-Analyse-Tools**

```typescript
// Log-Analyse-Service
class LogAnalysisService {
  // Log-Patterns erkennen
  static async detectLogPatterns(
    startDate: Date,
    endDate: Date,
    category?: LogCategory,
  ): Promise<LogPattern[]> {
    const logs = await this.getLogs(startDate, endDate, category);

    // Häufige Fehler-Patterns
    const errorPatterns = this.findErrorPatterns(logs);

    // Performance-Patterns
    const performancePatterns = this.findPerformancePatterns(logs);

    // Sicherheits-Patterns
    const securityPatterns = this.findSecurityPatterns(logs);

    return [...errorPatterns, ...performancePatterns, ...securityPatterns];
  }

  // Anomalien erkennen
  static async detectAnomalies(startDate: Date, endDate: Date): Promise<LogAnomaly[]> {
    const logs = await this.getLogs(startDate, endDate);

    // Statistische Anomalien
    const statisticalAnomalies = this.findStatisticalAnomalies(logs);

    // Verhaltens-Anomalien
    const behavioralAnomalies = this.findBehavioralAnomalies(logs);

    // Zeitbasierte Anomalien
    const temporalAnomalies = this.findTemporalAnomalies(logs);

    return [...statisticalAnomalies, ...behavioralAnomalies, ...temporalAnomalies];
  }

  // Log-Statistiken generieren
  static async generateLogStatistics(startDate: Date, endDate: Date): Promise<LogStatistics> {
    const logs = await this.getLogs(startDate, endDate);

    return {
      totalLogs: logs.length,
      logsByLevel: this.groupByLevel(logs),
      logsByCategory: this.groupByCategory(logs),
      logsByHour: this.groupByHour(logs),
      errorRate: this.calculateErrorRate(logs),
      averageResponseTime: this.calculateAverageResponseTime(logs),
    };
  }
}
```

## 📈 **LOG-VISUALIZATION**

### **Log-Dashboard**

```typescript
// Log-Dashboard-Interface
interface LogDashboard {
  // Real-Time-Logs
  realTimeLogs: LogEntry[];

  // Log-Statistiken
  statistics: {
    totalLogs: number;
    errorCount: number;
    warningCount: number;
    infoCount: number;
  };

  // Log-Trends
  trends: {
    logsByHour: DataPoint[];
    errorsByHour: DataPoint[];
    performanceByHour: DataPoint[];
  };

  // Aktive Alerts
  alerts: LogAlert[];

  // Top-Fehler
  topErrors: ErrorSummary[];

  // Performance-Metriken
  performanceMetrics: PerformanceMetrics;
}

// Log-Dashboard-Service
class LogDashboardService {
  // Dashboard-Daten abrufen
  static async getDashboardData(): Promise<LogDashboard> {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    return {
      realTimeLogs: await this.getRecentLogs(100),
      statistics: await this.getLogStatistics(oneHourAgo, now),
      trends: await this.getLogTrends(oneHourAgo, now),
      alerts: await this.getActiveAlerts(),
      topErrors: await this.getTopErrors(oneHourAgo, now),
      performanceMetrics: await this.getPerformanceMetrics(),
    };
  }

  // Log-Filter
  static async filterLogs(filters: LogFilter): Promise<LogEntry[]> {
    const query: any = {};

    if (filters.level) {
      query.level = filters.level;
    }

    if (filters.category) {
      query.category = filters.category;
    }

    if (filters.userId) {
      query["context.userId"] = filters.userId;
    }

    if (filters.startDate || filters.endDate) {
      query.timestamp = {};

      if (filters.startDate) {
        query.timestamp.$gte = filters.startDate;
      }

      if (filters.endDate) {
        query.timestamp.$lte = filters.endDate;
      }
    }

    return await LogEntry.find(query)
      .sort({ timestamp: -1 })
      .limit(filters.limit || 100);
  }
}
```

---

**Letzte Aktualisierung:** 2025-07-05  
**Nächste Überprüfung:** 2025-07-06
