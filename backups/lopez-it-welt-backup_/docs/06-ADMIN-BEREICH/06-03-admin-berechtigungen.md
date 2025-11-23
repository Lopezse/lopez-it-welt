# 🔐 Admin-Berechtigungen - Lopez IT Welt

**Version:** 1.0  
**Datum:** 2025-07-05  
**Status:** 🚧 IN ENTWICKLUNG  
**Autor:** Lopez IT Welt Team

## 📋 **ÜBERSICHT**

Das **Admin-Berechtigungssystem** definiert die vollständige Rollen- und Berechtigungsstruktur für das Lopez IT Welt System. Es implementiert ein feingranulares RBAC (Role-Based Access Control) System mit erweiterten Sicherheitsfunktionen.

## 🎯 **BERECHTIGUNGS-STRUKTUR**

### **Rollen-Hierarchie**

```typescript
// Rollen-Definitionen
enum UserRole {
  // Basis-Rollen
  USER = 'user',
  MODERATOR = 'moderator',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',

  // Spezialisierte Rollen
  SUPPORT_AGENT = 'support_agent',
  ANALYST = 'analyst',
  DEVELOPER = 'developer',
  SECURITY_OFFICER = 'security_officer',

  // Enterprise-Rollen
  ORG_ADMIN = 'org_admin',
  ORG_MEMBER = 'org_member',
  ORG_VIEWER = 'org_viewer',
}

// Berechtigungs-Level
enum PermissionLevel {
  NONE = 0,
  READ = 1,
  WRITE = 2,
  DELETE = 3,
  ADMIN = 4,
}
```

### **Berechtigungs-Kategorien**

```typescript
// Berechtigungs-Definitionen
interface Permission {
  id: string;
  name: string;
  description: string;
  category: PermissionCategory;
  level: PermissionLevel;
  resource: string;
  actions: string[];
}

enum PermissionCategory {
  // Benutzer-Management
  USER_MANAGEMENT = 'user_management',
  USER_PROFILES = 'user_profiles',
  USER_ACTIVITY = 'user_activity',

  // KI-Agenten
  AGENT_MANAGEMENT = 'agent_management',
  AGENT_CONFIGURATION = 'agent_configuration',
  AGENT_MONITORING = 'agent_monitoring',

  // Chat-System
  CHAT_SESSIONS = 'chat_sessions',
  CHAT_MESSAGES = 'chat_messages',
  CHAT_ANALYTICS = 'chat_analytics',

  // System-Administration
  SYSTEM_CONFIGURATION = 'system_configuration',
  SYSTEM_MONITORING = 'system_monitoring',
  SYSTEM_LOGS = 'system_logs',

  // Sicherheit
  SECURITY_MANAGEMENT = 'security_management',
  AUDIT_LOGS = 'audit_logs',
  ACCESS_CONTROL = 'access_control',

  // Analytics & Reporting
  ANALYTICS = 'analytics',
  REPORTING = 'reporting',
  DATA_EXPORT = 'data_export',

  // Enterprise-Features
  ORGANIZATION_MANAGEMENT = 'organization_management',
  BILLING = 'billing',
  SUBSCRIPTIONS = 'subscriptions',
}
```

## 🔐 **DETAILBEREICHTIGUNGEN**

### **Benutzer-Management**

```typescript
// Benutzer-Berechtigungen
const UserPermissions = {
  // Benutzer anzeigen
  VIEW_USERS: {
    id: 'view_users',
    name: 'Benutzer anzeigen',
    description: 'Benutzer-Liste und Details anzeigen',
    category: PermissionCategory.USER_MANAGEMENT,
    level: PermissionLevel.READ,
    resource: 'users',
    actions: ['read'],
  },

  // Benutzer erstellen
  CREATE_USERS: {
    id: 'create_users',
    name: 'Benutzer erstellen',
    description: 'Neue Benutzer anlegen',
    category: PermissionCategory.USER_MANAGEMENT,
    level: PermissionLevel.WRITE,
    resource: 'users',
    actions: ['create'],
  },

  // Benutzer bearbeiten
  UPDATE_USERS: {
    id: 'update_users',
    name: 'Benutzer bearbeiten',
    description: 'Benutzerdaten ändern',
    category: PermissionCategory.USER_MANAGEMENT,
    level: PermissionLevel.WRITE,
    resource: 'users',
    actions: ['update'],
  },

  // Benutzer löschen
  DELETE_USERS: {
    id: 'delete_users',
    name: 'Benutzer löschen',
    description: 'Benutzer permanent entfernen',
    category: PermissionCategory.USER_MANAGEMENT,
    level: PermissionLevel.DELETE,
    resource: 'users',
    actions: ['delete'],
  },

  // Benutzer sperren/entsperren
  MANAGE_USER_STATUS: {
    id: 'manage_user_status',
    name: 'Benutzer-Status verwalten',
    description: 'Benutzer aktivieren/deaktivieren',
    category: PermissionCategory.USER_MANAGEMENT,
    level: PermissionLevel.WRITE,
    resource: 'users',
    actions: ['suspend', 'activate'],
  },

  // Benutzer-Rollen verwalten
  MANAGE_USER_ROLES: {
    id: 'manage_user_roles',
    name: 'Benutzer-Rollen verwalten',
    description: 'Rollen und Berechtigungen zuweisen',
    category: PermissionCategory.USER_MANAGEMENT,
    level: PermissionLevel.ADMIN,
    resource: 'users',
    actions: ['assign_role', 'remove_role'],
  },
};
```

### **KI-Agenten-Management**

```typescript
// KI-Agenten-Berechtigungen
const AgentPermissions = {
  // Agenten anzeigen
  VIEW_AGENTS: {
    id: 'view_agents',
    name: 'KI-Agenten anzeigen',
    description: 'Agenten-Liste und Details anzeigen',
    category: PermissionCategory.AGENT_MANAGEMENT,
    level: PermissionLevel.READ,
    resource: 'agents',
    actions: ['read'],
  },

  // Agenten erstellen
  CREATE_AGENTS: {
    id: 'create_agents',
    name: 'KI-Agenten erstellen',
    description: 'Neue KI-Agenten anlegen',
    category: PermissionCategory.AGENT_MANAGEMENT,
    level: PermissionLevel.WRITE,
    resource: 'agents',
    actions: ['create'],
  },

  // Agenten konfigurieren
  CONFIGURE_AGENTS: {
    id: 'configure_agents',
    name: 'KI-Agenten konfigurieren',
    description: 'Agenten-Einstellungen ändern',
    category: PermissionCategory.AGENT_CONFIGURATION,
    level: PermissionLevel.WRITE,
    resource: 'agents',
    actions: ['configure', 'update_settings'],
  },

  // Agenten testen
  TEST_AGENTS: {
    id: 'test_agents',
    name: 'KI-Agenten testen',
    description: 'Agenten-Funktionalität testen',
    category: PermissionCategory.AGENT_MANAGEMENT,
    level: PermissionLevel.READ,
    resource: 'agents',
    actions: ['test'],
  },

  // Agenten löschen
  DELETE_AGENTS: {
    id: 'delete_agents',
    name: 'KI-Agenten löschen',
    description: 'Agenten permanent entfernen',
    category: PermissionCategory.AGENT_MANAGEMENT,
    level: PermissionLevel.DELETE,
    resource: 'agents',
    actions: ['delete'],
  },

  // Agenten-Monitoring
  MONITOR_AGENTS: {
    id: 'monitor_agents',
    name: 'KI-Agenten überwachen',
    description: 'Agenten-Performance und Metriken einsehen',
    category: PermissionCategory.AGENT_MONITORING,
    level: PermissionLevel.READ,
    resource: 'agents',
    actions: ['monitor', 'view_metrics'],
  },
};
```

### **System-Administration**

```typescript
// System-Berechtigungen
const SystemPermissions = {
  // System-Konfiguration
  CONFIGURE_SYSTEM: {
    id: 'configure_system',
    name: 'System konfigurieren',
    description: 'System-Einstellungen ändern',
    category: PermissionCategory.SYSTEM_CONFIGURATION,
    level: PermissionLevel.ADMIN,
    resource: 'system',
    actions: ['configure', 'update_settings'],
  },

  // System-Monitoring
  MONITOR_SYSTEM: {
    id: 'monitor_system',
    name: 'System überwachen',
    description: 'System-Performance und Status einsehen',
    category: PermissionCategory.SYSTEM_MONITORING,
    level: PermissionLevel.READ,
    resource: 'system',
    actions: ['monitor', 'view_metrics'],
  },

  // System-Logs
  VIEW_SYSTEM_LOGS: {
    id: 'view_system_logs',
    name: 'System-Logs anzeigen',
    description: 'System-Logs und Fehler einsehen',
    category: PermissionCategory.SYSTEM_LOGS,
    level: PermissionLevel.READ,
    resource: 'logs',
    actions: ['read', 'search'],
  },

  // Backup & Restore
  MANAGE_BACKUPS: {
    id: 'manage_backups',
    name: 'Backups verwalten',
    description: 'Backups erstellen und wiederherstellen',
    category: PermissionCategory.SYSTEM_CONFIGURATION,
    level: PermissionLevel.ADMIN,
    resource: 'backups',
    actions: ['create', 'restore', 'delete'],
  },

  // Datenbank-Management
  MANAGE_DATABASE: {
    id: 'manage_database',
    name: 'Datenbank verwalten',
    description: 'Datenbank-Operationen durchführen',
    category: PermissionCategory.SYSTEM_CONFIGURATION,
    level: PermissionLevel.ADMIN,
    resource: 'database',
    actions: ['migrate', 'backup', 'restore'],
  },
};
```

### **Sicherheits-Management**

```typescript
// Sicherheits-Berechtigungen
const SecurityPermissions = {
  // Sicherheits-Einstellungen
  MANAGE_SECURITY: {
    id: 'manage_security',
    name: 'Sicherheit verwalten',
    description: 'Sicherheits-Einstellungen konfigurieren',
    category: PermissionCategory.SECURITY_MANAGEMENT,
    level: PermissionLevel.ADMIN,
    resource: 'security',
    actions: ['configure', 'update'],
  },

  // Audit-Logs
  VIEW_AUDIT_LOGS: {
    id: 'view_audit_logs',
    name: 'Audit-Logs anzeigen',
    description: 'Audit-Logs und Aktivitäten einsehen',
    category: PermissionCategory.AUDIT_LOGS,
    level: PermissionLevel.READ,
    resource: 'audit',
    actions: ['read', 'search', 'export'],
  },

  // Zugriffskontrolle
  MANAGE_ACCESS_CONTROL: {
    id: 'manage_access_control',
    name: 'Zugriffskontrolle verwalten',
    description: 'IP-Whitelist und Zugriffsregeln verwalten',
    category: PermissionCategory.ACCESS_CONTROL,
    level: PermissionLevel.ADMIN,
    resource: 'access_control',
    actions: ['configure', 'update', 'block', 'unblock'],
  },

  // Sicherheits-Events
  VIEW_SECURITY_EVENTS: {
    id: 'view_security_events',
    name: 'Sicherheits-Events anzeigen',
    description: 'Sicherheits-Events und Bedrohungen einsehen',
    category: PermissionCategory.SECURITY_MANAGEMENT,
    level: PermissionLevel.READ,
    resource: 'security_events',
    actions: ['read', 'monitor'],
  },
};
```

## 👥 **ROLLEN-DEFINITIONEN**

### **Standard-Rollen**

```typescript
// Rollen-Konfiguration
const RoleDefinitions = {
  // Super Admin - Vollzugriff
  [UserRole.SUPER_ADMIN]: {
    name: 'Super Administrator',
    description: 'Vollständiger Systemzugriff',
    permissions: Object.values({
      ...UserPermissions,
      ...AgentPermissions,
      ...SystemPermissions,
      ...SecurityPermissions,
    }),
    level: PermissionLevel.ADMIN,
  },

  // Admin - Erweiterte Rechte
  [UserRole.ADMIN]: {
    name: 'Administrator',
    description: 'Erweiterte Verwaltungsrechte',
    permissions: [
      UserPermissions.VIEW_USERS,
      UserPermissions.CREATE_USERS,
      UserPermissions.UPDATE_USERS,
      UserPermissions.MANAGE_USER_STATUS,
      AgentPermissions.VIEW_AGENTS,
      AgentPermissions.CREATE_AGENTS,
      AgentPermissions.CONFIGURE_AGENTS,
      AgentPermissions.MONITOR_AGENTS,
      SystemPermissions.MONITOR_SYSTEM,
      SystemPermissions.VIEW_SYSTEM_LOGS,
    ],
    level: PermissionLevel.WRITE,
  },

  // Moderator - Begrenzte Rechte
  [UserRole.MODERATOR]: {
    name: 'Moderator',
    description: 'Begrenzte Verwaltungsrechte',
    permissions: [
      UserPermissions.VIEW_USERS,
      UserPermissions.UPDATE_USERS,
      AgentPermissions.VIEW_AGENTS,
      AgentPermissions.MONITOR_AGENTS,
    ],
    level: PermissionLevel.READ,
  },

  // Support Agent - Support-spezifische Rechte
  [UserRole.SUPPORT_AGENT]: {
    name: 'Support Agent',
    description: 'Support-spezifische Berechtigungen',
    permissions: [
      UserPermissions.VIEW_USERS,
      UserPermissions.UPDATE_USERS,
      AgentPermissions.VIEW_AGENTS,
      AgentPermissions.TEST_AGENTS,
      SystemPermissions.MONITOR_SYSTEM,
    ],
    level: PermissionLevel.READ,
  },

  // Analyst - Analytics-Rechte
  [UserRole.ANALYST]: {
    name: 'Analyst',
    description: 'Analytics und Reporting-Rechte',
    permissions: [
      UserPermissions.VIEW_USERS,
      AgentPermissions.VIEW_AGENTS,
      AgentPermissions.MONITOR_AGENTS,
      SystemPermissions.MONITOR_SYSTEM,
    ],
    level: PermissionLevel.READ,
  },
};
```

### **Enterprise-Rollen**

```typescript
// Enterprise-Rollen
const EnterpriseRoleDefinitions = {
  // Organisations-Admin
  [UserRole.ORG_ADMIN]: {
    name: 'Organisations-Administrator',
    description: 'Vollzugriff innerhalb der Organisation',
    permissions: [
      // Benutzer-Management innerhalb der Organisation
      {
        ...UserPermissions.VIEW_USERS,
        scope: 'organization',
      },
      {
        ...UserPermissions.CREATE_USERS,
        scope: 'organization',
      },
      {
        ...UserPermissions.UPDATE_USERS,
        scope: 'organization',
      },
      // Agenten-Management innerhalb der Organisation
      {
        ...AgentPermissions.VIEW_AGENTS,
        scope: 'organization',
      },
      {
        ...AgentPermissions.CREATE_AGENTS,
        scope: 'organization',
      },
      {
        ...AgentPermissions.CONFIGURE_AGENTS,
        scope: 'organization',
      },
      // Organisations-spezifische Berechtigungen
      {
        id: 'manage_organization',
        name: 'Organisation verwalten',
        description: 'Organisations-Einstellungen verwalten',
        category: PermissionCategory.ORGANIZATION_MANAGEMENT,
        level: PermissionLevel.ADMIN,
        resource: 'organization',
        actions: ['configure', 'update', 'manage_members'],
      },
    ],
    level: PermissionLevel.ADMIN,
  },

  // Organisations-Mitglied
  [UserRole.ORG_MEMBER]: {
    name: 'Organisations-Mitglied',
    description: 'Standard-Mitgliedsrechte',
    permissions: [
      {
        ...UserPermissions.VIEW_USERS,
        scope: 'organization',
      },
      {
        ...AgentPermissions.VIEW_AGENTS,
        scope: 'organization',
      },
      {
        ...AgentPermissions.MONITOR_AGENTS,
        scope: 'organization',
      },
    ],
    level: PermissionLevel.READ,
  },

  // Organisations-Viewer
  [UserRole.ORG_VIEWER]: {
    name: 'Organisations-Viewer',
    description: 'Nur Lese-Rechte',
    permissions: [
      {
        ...UserPermissions.VIEW_USERS,
        scope: 'organization',
      },
      {
        ...AgentPermissions.VIEW_AGENTS,
        scope: 'organization',
      },
    ],
    level: PermissionLevel.READ,
  },
};
```

## 🔄 **BERECHTIGUNGS-PRÜFUNG**

### **Berechtigungs-Checker**

```typescript
// Berechtigungs-Prüfung
class PermissionChecker {
  // Prüfe einzelne Berechtigung
  static hasPermission(
    user: User,
    permission: Permission,
    resource?: string
  ): boolean {
    const userPermissions = this.getUserPermissions(user);

    return userPermissions.some(
      p => p.id === permission.id && (!resource || p.resource === resource)
    );
  }

  // Prüfe mehrere Berechtigungen
  static hasAnyPermission(
    user: User,
    permissions: Permission[],
    resource?: string
  ): boolean {
    return permissions.some(permission =>
      this.hasPermission(user, permission, resource)
    );
  }

  // Prüfe alle Berechtigungen
  static hasAllPermissions(
    user: User,
    permissions: Permission[],
    resource?: string
  ): boolean {
    return permissions.every(permission =>
      this.hasPermission(user, permission, resource)
    );
  }

  // Prüfe Berechtigungs-Level
  static hasPermissionLevel(
    user: User,
    requiredLevel: PermissionLevel,
    resource?: string
  ): boolean {
    const userPermissions = this.getUserPermissions(user);

    return userPermissions.some(
      p => p.level >= requiredLevel && (!resource || p.resource === resource)
    );
  }

  // Hole Benutzer-Berechtigungen
  private static getUserPermissions(user: User): Permission[] {
    const role = user.role;
    const roleDefinition = RoleDefinitions[role];

    if (!roleDefinition) {
      return [];
    }

    return roleDefinition.permissions;
  }
}
```

### **Middleware für API-Routen**

```typescript
// Berechtigungs-Middleware
export function requirePermission(permission: Permission) {
  return async (
    req: NextApiRequest,
    res: NextApiResponse,
    next: () => void
  ) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: 'Nicht authentifiziert' });
    }

    if (!PermissionChecker.hasPermission(user, permission)) {
      return res.status(403).json({ error: 'Keine Berechtigung' });
    }

    next();
  };
}

// Beispiel-Verwendung
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Prüfe Berechtigung für Benutzer-Erstellung
  if (req.method === 'POST') {
    const hasPermission = PermissionChecker.hasPermission(
      req.user,
      UserPermissions.CREATE_USERS
    );

    if (!hasPermission) {
      return res
        .status(403)
        .json({ error: 'Keine Berechtigung zum Erstellen von Benutzern' });
    }
  }

  // API-Logik hier...
}
```

## 🛡️ **SICHERHEITS-FEATURES**

### **Session-Management**

```typescript
// Session-Sicherheit
interface SessionSecurity {
  // Session-Timeout
  sessionTimeout: number; // in Sekunden

  // Max. gleichzeitige Sessions
  maxConcurrentSessions: number;

  // IP-Bindung
  bindToIP: boolean;

  // User-Agent-Bindung
  bindToUserAgent: boolean;

  // Geografische Einschränkungen
  allowedCountries: string[];
  blockedCountries: string[];
}

// Session-Validierung
class SessionValidator {
  static validateSession(session: Session): boolean {
    // Prüfe Session-Timeout
    if (session.expiresAt < new Date()) {
      return false;
    }

    // Prüfe IP-Bindung
    if (session.bindToIP && session.ipAddress !== session.currentIP) {
      return false;
    }

    // Prüfe User-Agent-Bindung
    if (
      session.bindToUserAgent &&
      session.userAgent !== session.currentUserAgent
    ) {
      return false;
    }

    return true;
  }
}
```

### **Audit-Logging**

```typescript
// Audit-Log-System
interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: any;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
}

// Audit-Logger
class AuditLogger {
  static async log(
    userId: string,
    action: string,
    resource: string,
    details: any,
    req: NextApiRequest
  ): Promise<void> {
    const auditLog: AuditLog = {
      id: generateId(),
      userId,
      action,
      resource,
      details,
      ipAddress:
        (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress!,
      userAgent: req.headers['user-agent'] || '',
      timestamp: new Date(),
    };

    await saveAuditLog(auditLog);
  }
}
```

## 📊 **BERECHTIGUNGS-ANALYTICS**

### **Berechtigungs-Übersicht**

```typescript
// Berechtigungs-Report
interface PermissionReport {
  // Benutzer-Statistiken
  userStats: {
    totalUsers: number;
    usersByRole: Record<UserRole, number>;
    activeUsers: number;
    inactiveUsers: number;
  };

  // Berechtigungs-Statistiken
  permissionStats: {
    mostUsedPermissions: Permission[];
    leastUsedPermissions: Permission[];
    permissionUsageByRole: Record<UserRole, Permission[]>;
  };

  // Sicherheits-Statistiken
  securityStats: {
    failedAccessAttempts: number;
    suspiciousActivities: number;
    blockedIPs: number;
    auditLogsCount: number;
  };
}
```

---

**Letzte Aktualisierung:** 2025-07-05  
**Nächste Überprüfung:** 2025-07-06
