// =====================================================
// ENTERPRISE++ SETTINGS HAUPTSEITE - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-01-19
// Zweck: Enterprise++ Admin-Konfigurationsbereich (SAP/IBM/Siemens Level)
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  FaUsers, FaUserShield, FaShieldAlt, FaKey, FaDesktop, FaFileAlt,
  FaCogs, FaDatabase, FaCloud, FaServer, FaArchive,
  FaBuilding, FaPalette, FaGavel,
  FaLock, FaClipboardCheck, FaBell,
  FaChevronRight
} from "react-icons/fa";

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  // RBAC-Prüfung: Nur Owner/Admin
  useEffect(() => {
    const checkAccess = async () => {
      try {
        // WICHTIG: adm_session Cookie wird automatisch mit credentials: "include" gesendet
        // Kein Header nötig, da Cookie httpOnly ist
        const response = await fetch("/api/auth/admin/me", {
          credentials: "include",
        });

        if (!response.ok) {
          // Redirect mit return-Parameter, damit Benutzer nach Login zurückkommt
          router.push(`/admin/login?redirect=${encodeURIComponent("/admin/settings")}`);
          return;
        }

        const data = await response.json();
        if (data.success && data.data?.roles) {
          const roles = data.data.roles;
          if (roles.includes("Owner") || roles.includes("Admin") || roles.includes("admin") || roles.includes("Super Admin")) {
            setHasAccess(true);
          } else {
            router.push("/admin");
            return;
          }
        } else {
          router.push(`/admin/login?redirect=${encodeURIComponent("/admin/settings")}`);
          return;
        }
      } catch (error) {
        console.error("Fehler bei Zugriffsprüfung:", error);
        router.push(`/admin/login?redirect=${encodeURIComponent("/admin/settings")}`);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [router]);

  // Zeige Loading-State nur kurz, dann Seite
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: "#050509" }}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: "#c99700" }}></div>
          <p className="mt-4 text-sm" style={{ color: "#b3b3b3" }}>Lade Einstellungen...</p>
        </div>
      </div>
    );
  }

  // Wenn kein Zugriff: Redirect (wird bereits im useEffect gemacht)
  // Seite trotzdem rendern, damit kein weißer Bildschirm erscheint

  // Enterprise++ Kategorien (SAP/IBM/Siemens Style)
  const categories = [
    {
      id: "users",
      title: "Benutzer & Rollenverwaltung",
      description: "IAM / RBAC / ABAC - Benutzer, Rollen und Berechtigungen verwalten",
      icon: FaUsers,
      color: "#007bff",
      items: [
        { name: "Benutzerverwaltung", href: "/admin/settings/users", icon: FaUsers, description: "Benutzer anlegen, bearbeiten, deaktivieren" },
        { name: "Rollenverwaltung", href: "/admin/settings/roles", icon: FaUserShield, description: "Rollen erstellen, Berechtigungen zuweisen" },
        { name: "ABAC-Attribute", href: "/admin/settings/abac", icon: FaShieldAlt, description: "Attribute und dynamische Regeln" },
        { name: "Zugriffsrichtlinien", href: "/admin/settings/policies", icon: FaLock, description: "Vordefinierte Rechte-Sets & Policy-Regeln" },
      ],
    },
    {
      id: "security",
      title: "System & Sicherheit",
      description: "2FA, Passwort-Policy, Session-Security, API-Sicherheit, Audit-Logs",
      icon: FaShieldAlt,
      color: "#dc3545",
      items: [
        { name: "Zwei-Faktor-Authentifizierung", href: "/admin/settings/security/2fa", icon: FaShieldAlt, description: "2FA einrichten, zurücksetzen, Backup-Codes" },
        { name: "Passwort-Policy", href: "/admin/settings/security/password-policy", icon: FaKey, description: "Passwort-Regeln und Ablauf" },
        { name: "Session-Management", href: "/admin/settings/security/session", icon: FaDesktop, description: "Session-Timeout, Geräte-Management" },
        { name: "API-Sicherheit", href: "/admin/settings/security/api", icon: FaKey, description: "API-Keys verwalten und regenerieren" },
        { name: "Audit-Logs", href: "/admin/settings/security/audit", icon: FaFileAlt, description: "Vollständige Audit-Logs (Enterprise++)" },
        { name: "Compliance & Richtlinien", href: "/admin/settings/security/compliance", icon: FaClipboardCheck, description: "DSGVO, Aufbewahrungsfristen, Log-Retention" },
      ],
    },
    {
      id: "system",
      title: "Systeme & Module",
      description: "Module aktivieren/deaktivieren, Provider-Einstellungen, Datenbank, Backup",
      icon: FaCogs,
      color: "#28a745",
      items: [
        { name: "Aktivierte Module", href: "/admin/settings/system/modules", icon: FaCogs, description: "Module aktivieren/deaktivieren" },
        { name: "Provider-Einstellungen", href: "/admin/settings/system/providers", icon: FaCloud, description: "OpenAI, Mistral, lokale Provider" },
        { name: "Datenbank & Health", href: "/admin/settings/system/database", icon: FaDatabase, description: "DB-Status, Migrations-Log" },
        { name: "Backup & Recovery", href: "/admin/settings/system/backup", icon: FaArchive, description: "Backup-System verwalten" },
        { name: "Monitoring & Benachrichtigungen", href: "/admin/settings/system/monitoring", icon: FaBell, description: "Schwellenwerte und Benachrichtigungen" },
      ],
    },
    {
      id: "company",
      title: "Unternehmen & Branding",
      description: "Firmenprofil, CI-Farben, Logo, Rechtliches",
      icon: FaBuilding,
      color: "#c99700",
      items: [
        { name: "Firmenprofil", href: "/admin/settings/company/profile", icon: FaBuilding, description: "Firmenname, Adresse, Support-E-Mail" },
        { name: "Branding", href: "/admin/settings/company/branding", icon: FaPalette, description: "CI-Farben, Logo, Social-Links" },
        { name: "Rechtliches", href: "/admin/settings/company/legal", icon: FaGavel, description: "Impressum, Datenschutz" },
      ],
    },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#050509" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: "#f4f4f4" }}>
            Einstellungen
          </h1>
          <p className="text-sm" style={{ color: "#8a8a8a" }}>
            Enterprise++ Admin-Konfigurationsbereich (SAP/IBM/Siemens Level)
          </p>
        </div>

        {/* Kategorien-Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <div
                key={category.id}
                className="rounded-lg border p-6 transition-all duration-200 hover:border-opacity-80"
                style={{
                  backgroundColor: "#111217",
                  borderColor: "#272a33",
                }}
              >
                {/* Kategorie-Header */}
                <div className="flex items-start mb-4">
                  <div
                    className="p-3 rounded-lg mr-4"
                    style={{ backgroundColor: `${category.color}20`, color: category.color }}
                  >
                    <IconComponent className="text-xl" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold mb-1" style={{ color: "#f4f4f4" }}>
                      {category.title}
                    </h2>
                    <p className="text-sm" style={{ color: "#8a8a8a" }}>
                      {category.description}
                    </p>
                  </div>
                </div>

                {/* Unterpunkte */}
                <div className="space-y-2">
                  {category.items.map((item) => {
                    const ItemIcon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center justify-between p-3 rounded-md transition-all duration-200 group"
                        style={{
                          backgroundColor: "#1a1d24",
                          border: "1px solid #272a33",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#1f2329";
                          e.currentTarget.style.borderColor = category.color;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "#1a1d24";
                          e.currentTarget.style.borderColor = "#272a33";
                        }}
                      >
                        <div className="flex items-center flex-1">
                          <ItemIcon className="mr-3 text-sm" style={{ color: category.color }} />
                          <div>
                            <p className="text-sm font-medium" style={{ color: "#f4f4f4" }}>
                              {item.name}
                            </p>
                            <p className="text-xs mt-0.5" style={{ color: "#8a8a8a" }}>
                              {item.description}
                            </p>
                          </div>
                        </div>
                        <FaChevronRight className="text-xs opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "#8a8a8a" }} />
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
