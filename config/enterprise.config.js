/**
 * 🏗️ Enterprise++ Konfiguration
 * Zentrale Konfiguration für alle Enterprise++ Standards
 */

module.exports = {
    // Projekt-Informationen
    project: {
        name: 'Lopez IT Welt - Enterprise++',
        version: '2.0.0',
        description: 'Enterprise++ strukturiertes Projekt mit allen Sicherheitsmodulen',
        author: 'Ramiro Lopez Rodriguez',
        lastUpdate: '2025-07-01T12:30:00Z'
    },

    // Enterprise++ Einstellungen
    enterprise: {
        strictMode: true,
        zeroTolerance: true,
        requireApproval: true,
        enforceGermanNames: true,
        requireSystemTime: true,
        validateTimestamps: true
    },

    // Sicherheits-Einstellungen
    security: {
        enableKISecurity: true,
        enableAntiRuleBreak: true,
        enableEnterpriseEnforcement: true,
        enableTimeTracking: true,
        enableGitHooks: true,
        enableNotifications: true
    },

    // Monitoring-Einstellungen
    monitoring: {
        enableQualityDashboard: true,
        enableAuditTrail: true,
        enablePerformanceMonitoring: true,
        enableSecurityMonitoring: true,
        enableErrorTracking: true
    },

    // Qualitätsstandards
    quality: {
        testCoverage: 90,
        codeQuality: 'A+',
        securityScore: 95,
        performanceScore: 90,
        documentationCoverage: 100
    },

    // Module-Konfiguration
    modules: {
        // Core-Module
        core: {
            enabled: true,
            path: 'src/app',
            components: ['layout', 'navigation', 'auth']
        },

        // Admin-Module
        admin: {
            enabled: true,
            path: 'src/app/admin',
            components: ['dashboard', 'users', 'monitoring', 'time-tracking', 'tickets']
        },

        // Feature-Module
        features: {
            enabled: true,
            path: 'src/components/Features',
            components: ['Schaltflaeche', 'Karte', 'Warnung', 'Eingabefeld']
        },

        // Security-Module
        security: {
            enabled: true,
            path: 'scripts',
            components: ['ki-sicherheitsmodul', 'anti-rule-break-system', 'enforce-rules-fixed']
        }
    },

    // CI/CD-Konfiguration
    cicd: {
        enableAutomatedTesting: true,
        enableSecurityScans: true,
        enableQualityChecks: true,
        enableDeploymentAutomation: true,
        enableRollbackMechanism: true
    },

    // Dokumentation
    documentation: {
        enableAutoGeneration: true,
        requireApiDocs: true,
        requireComponentDocs: true,
        requireDeploymentDocs: true,
        enableLiveStatus: true
    }
}; 