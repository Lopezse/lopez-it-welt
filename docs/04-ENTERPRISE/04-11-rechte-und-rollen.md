# 🔐 Rechte und Rollen - Lopez IT Welt Enterprise++

## 📋 Rollenübersicht

**Authentifizierung:** NextAuth.js + JWT  
**Autorisierung:** Rollenbasierte Zugriffskontrolle (RBAC)  
**Audit-Logging:** Vollständige Nachverfolgung  
**Letzte Aktualisierung:** 2024-12-19

## 👥 Rollen-Definitionen

### **1. Admin (System-Administrator)**

```typescript
interface AdminRole {
  name: "admin";
  description: "Vollzugriff auf alle Systemfunktionen";
  level: 100;
  permissions: [
    "users.create",
    "users.read",
    "users.update",
    "users.delete",
    "roles.create",
    "roles.read",
    "roles.update",
    "roles.delete",
    "content.create",
    "content.read",
    "content.update",
    "content.delete",
    "system.config",
    "system.monitor",
    "system.backup",
    "ab_test.create",
    "ab_test.read",
    "ab_test.update",
    "ab_test.delete",
    "audit.read",
    "logs.read",
  ];
}
```

**Verantwortlichkeiten:**

- Vollzugriff auf alle Systemfunktionen
- Benutzer- und Rollenverwaltung
- System-Konfiguration und -Monitoring
- Backup und Wiederherstellung
- Sicherheits-Audits

### **2. Editor (Content-Manager)**

```typescript
interface EditorRole {
  name: "editor";
  description: "Content Management und Redaktion";
  level: 50;
  permissions: [
    "content.create",
    "content.read",
    "content.update",
    "media.upload",
    "media.read",
    "media.update",
    "translations.read",
    "translations.update",
    "ab_test.read",
    "ab_test.update",
  ];
}
```

**Verantwortlichkeiten:**

- Seiten und Inhalte erstellen/bearbeiten
- Medien-Upload und -Verwaltung
- Übersetzungen verwalten
- A/B-Test-Varianten bearbeiten

### **3. Support (Kunden-Support)**

```typescript
interface SupportRole {
  name: "support";
  description: "Kunden-Support und Ticket-Management";
  level: 30;
  permissions: [
    "content.read",
    "users.read",
    "tickets.create",
    "tickets.read",
    "tickets.update",
    "logs.read",
  ];
}
```

**Verantwortlichkeiten:**

- Support-Tickets bearbeiten
- Benutzer-Probleme lösen
- System-Logs einsehen
- Basis-Content-Informationen abrufen

### **4. Viewer (Nur-Lese-Zugriff)**

```typescript
interface ViewerRole {
  name: "viewer";
  description: "Nur-Lese-Zugriff auf ausgewählte Bereiche";
  level: 10;
  permissions: ["content.read", "media.read", "translations.read", "ab_test.read"];
}
```

**Verantwortlichkeiten:**

- Inhalte einsehen (keine Bearbeitung)
- Medien anzeigen
- Übersetzungen lesen
- A/B-Test-Ergebnisse betrachten

## 🔑 Berechtigungs-Matrix

### **Content Management**

| Aktion                 | Admin | Editor | Support | Viewer |
| ---------------------- | ----- | ------ | ------- | ------ |
| Seiten erstellen       | ✅    | ✅     | ❌      | ❌     |
| Seiten bearbeiten      | ✅    | ✅     | ❌      | ❌     |
| Seiten löschen         | ✅    | ❌     | ❌      | ❌     |
| Seiten veröffentlichen | ✅    | ✅     | ❌      | ❌     |
| Seiten einsehen        | ✅    | ✅     | ✅      | ✅     |
| Medien hochladen       | ✅    | ✅     | ❌      | ❌     |
| Medien verwalten       | ✅    | ✅     | ❌      | ❌     |
| Medien anzeigen        | ✅    | ✅     | ✅      | ✅     |

### **Benutzer-Management**

| Aktion                   | Admin | Editor | Support | Viewer |
| ------------------------ | ----- | ------ | ------- | ------ |
| Benutzer erstellen       | ✅    | ❌     | ❌      | ❌     |
| Benutzer bearbeiten      | ✅    | ❌     | ❌      | ❌     |
| Benutzer löschen         | ✅    | ❌     | ❌      | ❌     |
| Benutzer einsehen        | ✅    | ❌     | ✅      | ❌     |
| Rollen verwalten         | ✅    | ❌     | ❌      | ❌     |
| Berechtigungen verwalten | ✅    | ❌     | ❌      | ❌     |

### **System-Administration**

| Aktion                  | Admin | Editor | Support | Viewer |
| ----------------------- | ----- | ------ | ------- | ------ |
| System-Einstellungen    | ✅    | ❌     | ❌      | ❌     |
| Monitoring              | ✅    | ❌     | ❌      | ❌     |
| Backups                 | ✅    | ❌     | ❌      | ❌     |
| Logs einsehen           | ✅    | ❌     | ✅      | ❌     |
| A/B-Tests konfigurieren | ✅    | ❌     | ❌      | ❌     |
| A/B-Tests verwalten     | ✅    | ✅     | ❌      | ❌     |

## 🔐 Authentifizierung (AuthN)

### **Login-Prozess**

```typescript
// Login-Flow
interface LoginFlow {
  1: "Eingabe von E-Mail und Passwort";
  2: "Validierung der Credentials";
  3: "Generierung von JWT-Token";
  4: "Session-Erstellung";
  5: "Rollen und Berechtigungen laden";
  6: "Redirect zur entsprechenden Seite";
}

// JWT-Token-Struktur
interface JWTPayload {
  sub: string; // User ID
  email: string; // E-Mail
  role: string; // Rolle
  permissions: string[]; // Berechtigungen
  iat: number; // Issued At
  exp: number; // Expires At
}
```

### **Passwort-Sicherheit**

```typescript
// Passwort-Policy
const passwordPolicy = {
  minLength: 12,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  maxAge: 90, // Tage
  historyCount: 5, // Letzte 5 Passwörter nicht wiederverwenden
  lockoutAttempts: 5,
  lockoutDuration: 15, // Minuten
};

// Passwort-Hashing
import bcrypt from "bcrypt";

const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};
```

### **Zwei-Faktor-Authentifizierung (2FA)**

```typescript
// 2FA-Implementierung (Optional)
interface TwoFactorAuth {
  method: "totp" | "sms" | "email";
  secret: string;
  backupCodes: string[];
  enabled: boolean;
  lastUsed: Date;
}

// TOTP (Time-based One-Time Password)
import speakeasy from "speakeasy";

const generateSecret = (): string => {
  return speakeasy.generateSecret({
    name: "Lopez IT Welt",
    issuer: "lopez-it-welt.de",
    length: 32,
  });
};

const verifyToken = (secret: string, token: string): boolean => {
  return speakeasy.totp.verify({
    secret,
    encoding: "base32",
    token,
    window: 2,
  });
};
```

## 🛡️ Autorisierung (AuthZ)

### **Middleware-Implementierung**

```typescript
// Berechtigungs-Middleware
import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "@/lib/auth";

export function withAuth(requiredPermissions: string[]) {
  return function (handler: Function) {
    return async function (request: NextRequest) {
      // JWT-Token verifizieren
      const token = request.headers.get("authorization")?.replace("Bearer ", "");
      if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const payload = await verifyJWT(token);
      if (!payload) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }

      // Berechtigungen prüfen
      const hasPermission = requiredPermissions.every((permission) =>
        payload.permissions.includes(permission),
      );

      if (!hasPermission) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      // Request mit User-Info erweitern
      request.user = payload;
      return handler(request);
    };
  };
}

// Verwendung
export const GET = withAuth(["content.read"])(async (request: NextRequest) => {
  // Handler-Logik
});
```

### **Ressourcen-basierte Berechtigungen**

```typescript
// Ressourcen-spezifische Berechtigungen
interface ResourcePermission {
  resource: "page" | "media" | "user" | "ab_test";
  action: "create" | "read" | "update" | "delete";
  conditions?: {
    ownerOnly?: boolean;
    publishedOnly?: boolean;
    language?: string;
  };
}

// Beispiel: Seiten-Berechtigungen
const pagePermissions = {
  "content.read": {
    resource: "page",
    action: "read",
    conditions: { publishedOnly: true },
  },
  "content.update": {
    resource: "page",
    action: "update",
    conditions: { ownerOnly: true },
  },
};
```

## 📊 Audit-Logging

### **Audit-Einträge**

```typescript
// Audit-Log-Struktur
interface AuditLogEntry {
  id: number;
  userId: number | null;
  action: string;
  resourceType: string;
  resourceId: number | null;
  oldValues: Record<string, any> | null;
  newValues: Record<string, any> | null;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
}

// Audit-Logging Service
class AuditLogger {
  static async log(
    userId: number | null,
    action: string,
    resourceType: string,
    resourceId: number | null,
    oldValues: Record<string, any> | null,
    newValues: Record<string, any> | null,
    request: Request,
  ) {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        resourceType,
        resourceId,
        oldValues: oldValues ? JSON.stringify(oldValues) : null,
        newValues: newValues ? JSON.stringify(newValues) : null,
        ipAddress: request.headers.get("x-forwarded-for") || "unknown",
        userAgent: request.headers.get("user-agent") || "unknown",
      },
    });
  }
}
```

### **Sicherheits-Events**

```typescript
// Sicherheits-relevante Events
const securityEvents = [
  "user.login",
  "user.logout",
  "user.login_failed",
  "user.password_changed",
  "user.role_changed",
  "user.deleted",
  "permission.granted",
  "permission.revoked",
  "content.published",
  "content.deleted",
  "system.config_changed",
];

// Event-Handler
class SecurityEventHandler {
  static async handle(event: string, data: any) {
    // Sofortige Benachrichtigung bei kritischen Events
    if (criticalEvents.includes(event)) {
      await this.sendAlert(event, data);
    }

    // Audit-Log erstellen
    await AuditLogger.log(
      data.userId,
      event,
      data.resourceType,
      data.resourceId,
      data.oldValues,
      data.newValues,
      data.request,
    );
  }
}
```

## 🔒 Session-Sicherheit

### **Session-Management**

```typescript
// Session-Konfiguration
const sessionConfig = {
  maxAge: 24 * 60 * 60, // 24 Stunden
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
};

// Session-Validierung
class SessionManager {
  static async validateSession(sessionId: string): Promise<boolean> {
    const session = await redis.get(`session:${sessionId}`);
    if (!session) return false;

    const sessionData = JSON.parse(session);
    const now = Date.now();

    // Session abgelaufen?
    if (sessionData.expiresAt < now) {
      await this.destroySession(sessionId);
      return false;
    }

    // Session verlängern
    await this.extendSession(sessionId);
    return true;
  }

  static async destroySession(sessionId: string): Promise<void> {
    await redis.del(`session:${sessionId}`);
  }
}
```

### **Rate Limiting**

```typescript
// Rate Limiting für Login-Versuche
import rateLimit from "express-rate-limit";

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minuten
  max: 5, // Maximal 5 Versuche
  message: "Zu viele Login-Versuche, bitte versuchen Sie es später erneut",
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: "Rate limit exceeded",
      retryAfter: Math.round(req.rateLimit.resetTime / 1000),
    });
  },
});
```

## 🚨 Sicherheits-Monitoring

### **Suspicious Activity Detection**

```typescript
// Verdächtige Aktivitäten erkennen
class SecurityMonitor {
  static async detectSuspiciousActivity(userId: number, action: string) {
    const recentActions = await this.getRecentActions(userId, 1); // Letzte Stunde

    // Verdächtige Patterns
    const suspiciousPatterns = [
      { pattern: "multiple_failed_logins", threshold: 3 },
      { pattern: "rapid_content_changes", threshold: 10 },
      { pattern: "unusual_access_patterns", threshold: 5 },
    ];

    for (const pattern of suspiciousPatterns) {
      if (await this.checkPattern(userId, pattern, recentActions)) {
        await this.triggerSecurityAlert(userId, pattern);
      }
    }
  }

  static async triggerSecurityAlert(userId: number, pattern: string) {
    // Admin benachrichtigen
    await this.notifyAdmins(`Suspicious activity detected for user ${userId}: ${pattern}`);

    // User temporär sperren
    await this.temporarilyLockUser(userId, 30); // 30 Minuten
  }
}
```

### **Security Headers**

```typescript
// Security Headers Middleware
export function securityHeaders(req: NextRequest, res: NextResponse) {
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-XSS-Protection", "1; mode=block");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  // Content Security Policy
  res.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
      "style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' data: https:; " +
      "font-src 'self' data:; " +
      "connect-src 'self' https:; " +
      "frame-ancestors 'none';",
  );

  return res;
}
```

## 📋 Berechtigungs-Checkliste

### **Für neue Features:**

- [ ] Berechtigungen definiert
- [ ] Rollen-Matrix aktualisiert
- [ ] Middleware implementiert
- [ ] Tests geschrieben
- [ ] Dokumentation erstellt

### **Für Benutzer-Erstellung:**

- [ ] E-Mail validiert
- [ ] Passwort-Policy erfüllt
- [ ] Rolle zugewiesen
- [ ] Berechtigungen konfiguriert
- [ ] Audit-Log erstellt

### **Für Rollen-Änderungen:**

- [ ] Änderung dokumentiert
- [ ] Betroffene Benutzer benachrichtigt
- [ ] Audit-Log erstellt
- [ ] Tests durchgeführt
- [ ] Rollback-Plan erstellt

## 🔄 Workflow-Beispiele

### **Benutzer-Erstellung**

```typescript
// 1. Admin erstellt neuen Benutzer
const newUser = await prisma.user.create({
  data: {
    email: "test@example.org",
    passwordHash: await hashPassword("securePassword123!"),
    firstName: "Max",
    lastName: "Mustermann",
    roleId: editorRole.id,
  },
});

// 2. Audit-Log erstellen
await AuditLogger.log(
  adminUser.id,
  "user.created",
  "user",
  newUser.id,
  null,
  { email: newUser.email, role: "editor" },
  request,
);

// 3. Willkommens-E-Mail senden
await EmailService.sendWelcomeEmail(newUser.email, newUser.firstName);
```

### **Berechtigungs-Änderung**

```typescript
// 1. Rolle ändern
await prisma.user.update({
  where: { id: userId },
  data: { roleId: newRoleId },
});

// 2. Session invalidieren
await SessionManager.invalidateUserSessions(userId);

// 3. Benutzer benachrichtigen
await NotificationService.sendRoleChangeNotification(userId, newRole);
```

## 📚 Verwandte Dokumentation

- [Definition of Done](../01-PROJEKT-MANAGEMENT/01-03-definition-of-done.md) - Zentrale DoD-Kriterien
- [Sicherheit und Compliance](../04-ENTERPRISE/04-12-sicherheit-und-compliance.md) - Security-Standards
- [Admin-UI und Navigation](../06-ADMIN-BEREICH/06-10-admin-ui-und-navigation.md) - Admin-Interface

---

**Nächste Schritte:**

- [ ] 2FA-Implementierung planen
- [ ] Advanced Security Features definieren
- [ ] Compliance-Audit durchführen
- [ ] Penetration Testing planen
- [ ] Security-Training für Admins
