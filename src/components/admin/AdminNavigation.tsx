"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FaBars,
  FaBell,
  FaBook,
  FaBrain,
  FaCalendarAlt,
  FaChartLine,
  FaCheckCircle,
  FaCheckSquare,
  FaChevronDown,
  FaChevronRight,
  FaClock,
  FaCog,
  FaCogs,
  FaDatabase,
  FaEnvelope,
  FaExclamationTriangle,
  FaFileAlt,
  FaFileCode,
  FaFileInvoice,
  FaHistory,
  FaHome,
  FaLayerGroup,
  FaListAlt,
  FaPlus,
  FaProjectDiagram,
  FaRobot,
  FaShieldAlt,
  FaSignOutAlt,
  FaStickyNote,
  FaSearch,
  FaClipboardList,
  FaTicketAlt,
  FaTimes,
  FaTools,
  FaUsers
} from "react-icons/fa";
import LinkedInIcon from "./LinkedInIcon";

// Icon-Map für dynamisches Laden
const iconMap: Record<string, React.ComponentType<any>> = {
  FaHome,
  FaFileAlt,
  FaUsers,
  FaShieldAlt,
  FaCog,
  FaBell,
  FaProjectDiagram,
  FaTools,
  FaBook,
  FaChartLine,
  FaDatabase,
  FaEnvelope,
  FaTicketAlt,
  FaListAlt,
  FaHistory,
  FaStickyNote,
  FaCheckSquare,
  FaCheckCircle,
  FaPlus,
  FaCalendarAlt,
  FaCogs,
  FaFileInvoice,
  FaClock,
  FaLayerGroup,
  FaRobot,
  LinkedInIcon: LinkedInIcon as any,
};

interface SubNavItem {
  id?: number;
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  badge?: string;
  badgeColor?: string;
  dynamicBadge?: boolean;
  badgeApiEndpoint?: string;
  requiredPermission?: string; // Enterprise++ RBAC
}

interface NavItem {
  id?: number;
  name: string;
  href?: string;
  icon: React.ComponentType<any>;
  description?: string;
  badge?: string;
  badgeColor?: string;
  dynamicBadge?: boolean;
  badgeApiEndpoint?: string;
  subItems?: SubNavItem[];
  isExpanded?: boolean;
  requiredPermission?: string; // Enterprise++ RBAC
}

// Enterprise++ Navigation Structure (IBM Carbon / SAP Fiori Style)
// 6 Hauptkategorien mit automatisch gruppierten Unterpunkten
// Jeder Eintrag hat eine requiredPermission für RBAC-Kontrolle
const enterpriseNavigation: NavItem[] = [
  // 1. Dashboard
  {
    name: "Dashboard",
    href: "/admin",
    icon: FaHome,
    requiredPermission: "admin.dashboard.view",
    subItems: [],
  },
  // 2. Operations
  {
    name: "Operations",
    icon: FaCogs,
    requiredPermission: "admin.operations.view",
    subItems: [
      { name: "Monitoring", href: "/admin/monitoring", icon: FaChartLine, requiredPermission: "admin.operations.monitoring.view" },
      { name: "Logs", href: "/admin/logs", icon: FaFileAlt, requiredPermission: "admin.operations.logs.view" },
      { name: "Unified Ops", href: "/admin/uoc", icon: FaProjectDiagram, requiredPermission: "admin.operations.view" },
      { name: "Backups", href: "/admin/backup", icon: FaDatabase, requiredPermission: "admin.operations.backups.view" },
      { name: "System Status", href: "/admin/monitoring/system", icon: FaExclamationTriangle, requiredPermission: "admin.operations.monitoring.view" },
    ],
  },
  // 3. Kunden & Projekte
  {
    name: "Kunden & Projekte",
    icon: FaUsers,
    requiredPermission: "admin.customers.view",
    subItems: [
      { name: "Kundenliste", href: "/admin/customers", icon: FaUsers, requiredPermission: "admin.customers.view" },
      { name: "Neuer Kunde", href: "/admin/customers/new", icon: FaPlus, requiredPermission: "admin.customers.create" },
      { name: "Projekte", href: "/admin/office/projects", icon: FaProjectDiagram, requiredPermission: "admin.projects.view" },
      { name: "Neues Projekt", href: "/admin/office/projects/new", icon: FaPlus, requiredPermission: "admin.projects.create" },
      { name: "Support Tickets", href: "/admin/support", icon: FaTicketAlt, badge: "7", badgeColor: "bg-red-500", requiredPermission: "admin.tickets.view" },
      { name: "Kontakt-Nachrichten", href: "/admin/support/contact-messages", icon: FaEnvelope, dynamicBadge: true, badgeApiEndpoint: "/api/admin/contact-messages/stats", requiredPermission: "admin.tickets.view" },
    ],
  },
  // 4. Inhalte & Medien
  {
    name: "Inhalte & Medien",
    icon: FaFileAlt,
    requiredPermission: "admin.content.view",
    subItems: [
      { name: "Seitenverwaltung", href: "/admin/content/pages", icon: FaFileAlt, requiredPermission: "admin.content.view" },
      { name: "Header & Footer", href: "/admin/content/header-footer", icon: FaCog, requiredPermission: "admin.content.edit" },
      { name: "Medien-Upload", href: "/admin/content/media", icon: FaDatabase, requiredPermission: "admin.media.view" },
      { name: "Media-KI Dashboard", href: "/admin/media/ai/dashboard", icon: FaChartLine, requiredPermission: "admin.media.ai.view" },
      { name: "Blog-Artikel", href: "/admin/marketing/blog", icon: FaFileAlt, requiredPermission: "admin.marketing.view" },
      { name: "News & Updates", href: "/admin/marketing/news", icon: FaBell, requiredPermission: "admin.marketing.view" },
      { name: "SEO & Meta-Tags", href: "/admin/marketing/seo", icon: FaChartLine, requiredPermission: "admin.marketing.edit" },
    ],
  },
  // 5. Finanzen
  {
    name: "Finanzen",
    icon: FaFileInvoice,
    requiredPermission: "admin.finance.view",
    subItems: [
      { name: "Rechnungen", href: "/admin/office/invoices", icon: FaFileInvoice, requiredPermission: "admin.finance.invoices.view" },
      { name: "Umsatz-Reports", href: "/admin/reports/revenue", icon: FaChartLine, requiredPermission: "admin.finance.reports.view" },
      { name: "Zeiterfassung", href: "/admin/time-tracking", icon: FaClock, requiredPermission: "admin.finance.view" },
      { name: "E-Rechnung", href: "/admin/office/einvoice", icon: FaFileCode, requiredPermission: "admin.finance.invoices.view" },
      { name: "Lohnbuchhaltung", href: "/admin/office/payroll", icon: FaUsers, requiredPermission: "admin.finance.payroll.view" },
    ],
  },
  // 6. AI Center (Enterprise++ KI-Zentrale)
  {
    name: "AI Center",
    icon: FaBrain,
    requiredPermission: "admin.ai.view",
    subItems: [
      { name: "Übersicht", href: "/admin/ai", icon: FaBrain, requiredPermission: "admin.ai.view" },
      { name: "Projekt-Analyzer", href: "/admin/ai/project-analyzer", icon: FaSearch, requiredPermission: "admin.ai.view" },
      { name: "Entwicklungsaufträge", href: "/admin/ai/dev-tasks", icon: FaClipboardList, requiredPermission: "admin.ai.view" },
      { name: "Executive Reports", href: "/admin/ai/reports", icon: FaFileAlt, requiredPermission: "admin.ai.reports.view" },
      { name: "Customer Insights", href: "/admin/customers", icon: FaUsers, requiredPermission: "admin.ai.customers.view" },
    ],
  },
  // 7. Agent-System (Enterprise++ PLAN • BUILD • RUN)
  {
    name: "Agent-System",
    icon: FaRobot,
    requiredPermission: "admin.system.agents.view",
    subItems: [
      { name: "Module & Fortschritt", href: "/admin/agent-system", icon: FaLayerGroup, requiredPermission: "admin.system.agents.view" },
      { name: "Go-Live Check", href: "/admin/agent-system", icon: FaCheckCircle, requiredPermission: "admin.system.agents.view" },
      { name: "Risiko-Analyse", href: "/admin/agent-system", icon: FaExclamationTriangle, requiredPermission: "admin.system.agents.view" },
    ],
  },
  // 7. System & Sicherheit
  {
    name: "System & Sicherheit",
    icon: FaShieldAlt,
    requiredPermission: "admin.system.view",
    subItems: [
      { name: "Compliance", href: "/admin/compliance/dsgvo", icon: FaShieldAlt, requiredPermission: "admin.system.compliance.view" },
      { name: "Rollen & Rechte", href: "/admin/roles", icon: FaUsers, requiredPermission: "admin.system.roles.view" },
      { name: "Admin-Privilegien", href: "/admin/privileges", icon: FaShieldAlt, requiredPermission: "admin.system.privileges.view" },
      { name: "Orchestrator", href: "/admin/orchestrator", icon: FaCogs, requiredPermission: "admin.system.orchestrator.view" },
      { name: "Navigation", href: "/admin/navigation", icon: FaProjectDiagram, requiredPermission: "admin.system.navigation.edit" },
      { name: "Audit-Logs", href: "/admin/audit-logs", icon: FaHistory, dynamicBadge: true, badgeApiEndpoint: "/api/admin/audit-logs/count", badgeColor: "bg-red-500", requiredPermission: "admin.system.audit.view" },
      { name: "Qualitäts-Dashboard", href: "/admin/quality", icon: FaCheckCircle, requiredPermission: "admin.system.view" },
      { name: "Module Registry", href: "/admin/system/modules", icon: FaLayerGroup, requiredPermission: "admin.system.modules.view" },
      { name: "Einstellungen", href: "/admin/settings", icon: FaCog, requiredPermission: "admin.settings.view" },
    ],
  },
];

// Fallback-Navigation (wird verwendet, wenn API fehlschlägt)
const fallbackNavigation: NavItem[] = enterpriseNavigation;

export default function AdminNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [navigation, setNavigation] = useState<NavItem[]>(fallbackNavigation);
  const [loadingNavigation, setLoadingNavigation] = useState(false);
  const [contactStats, setContactStats] = useState({
    new_messages: 0,
    urgent: 0,
  });
  const [dynamicBadges, setDynamicBadges] = useState<Record<string, string>>({});
  const [userData, setUserData] = useState<{
    name: string;
    role: string;
    initials: string;
  } | null>(null);

  // Enterprise++ RBAC State
  // WICHTIG: isSuperAdmin startet mit true für Entwicklung (alle Menüs sichtbar)
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(true); // Default: true für Entwicklung
  const [permissionsLoaded, setPermissionsLoaded] = useState(false);

  // Enterprise++ RBAC: Load user permissions
  useEffect(() => {
    const loadPermissions = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const response = await fetch("/api/auth/permissions", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setUserPermissions(data.data.permissions || []);
            // Wenn API erfolgreich, verwende tatsächlichen isSuperAdmin-Wert
            setIsSuperAdmin(data.data.isSuperAdmin ?? true);
          } else {
            // API Fehler aber Response ok → Fallback
            setIsSuperAdmin(true);
          }
        } else {
          // Response nicht ok → Fallback für Entwicklung
          console.warn("Permissions API nicht verfügbar, verwende Super Admin Fallback");
          setIsSuperAdmin(true);
        }
      } catch (error) {
        console.warn("Permissions konnten nicht geladen werden, verwende Super Admin Fallback");
        // Fallback für Entwicklung: Super Admin (alle Menüs sichtbar)
        setUserPermissions([]);
        setIsSuperAdmin(true);
      } finally {
        setPermissionsLoaded(true);
      }
    };

    loadPermissions();
  }, []);

  // Enterprise++ RBAC: Check if user has permission
  const hasPermission = (requiredPermission?: string): boolean => {
    // Kein Permission erforderlich → immer sichtbar
    if (!requiredPermission) return true;
    // Super Admin → alles sichtbar
    if (isSuperAdmin) return true;
    // Permissions noch nicht geladen → sichtbar (wird nach Laden gefiltert)
    if (!permissionsLoaded) return true;
    // Prüfe ob Permission vorhanden
    return userPermissions.includes(requiredPermission);
  };

  // Enterprise++ RBAC: Filter navigation based on permissions
  const filterNavigationByPermissions = (navItems: NavItem[]): NavItem[] => {
    // Wenn Super Admin → alle Items anzeigen ohne Filterung
    if (isSuperAdmin) {
      return navItems;
    }

    return navItems
      .filter(item => hasPermission(item.requiredPermission))
      .map(item => ({
        ...item,
        subItems: item.subItems?.filter(subItem => hasPermission(subItem.requiredPermission)),
      }))
      .filter(item => !item.subItems || item.subItems.length > 0 || item.href);
  };

  // Load navigation from database
  useEffect(() => {
    const loadNavigation = async () => {
      try {
        const response = await fetch("/api/admin/navigation", {
          cache: "no-store",
        });

        if (!response.ok) {
          console.warn("Navigation API fehlgeschlagen, verwende Fallback");
          return;
        }

        const data = await response.json();

        if (!data || !Array.isArray(data) || data.length === 0) {
          console.warn("Navigation API gab leere Daten zurück, behalte Fallback");
          return;
        }

        // Transform database data to NavItem format
        const transformedNavigation: NavItem[] = data.map((item: any) => {
          const icon = iconMap[item.icon_name] || FaFileAlt;

          const subItems: SubNavItem[] = (item.subItems || []).map((subItem: any) => {
            const subIcon = iconMap[subItem.icon_name] || FaFileAlt;
            return {
              id: subItem.id,
              name: subItem.name,
              href: subItem.href,
              icon: subIcon,
              badge: subItem.badge_text,
              badgeColor: subItem.badge_color,
              dynamicBadge: subItem.dynamic_badge,
              badgeApiEndpoint: subItem.badge_api_endpoint,
            };
          });

          return {
            id: item.id,
            name: item.name,
            href: item.href,
            icon,
            description: item.description,
            badge: item.badge_text,
            badgeColor: item.badge_color,
            dynamicBadge: item.dynamic_badge,
            badgeApiEndpoint: item.badge_api_endpoint,
            subItems,
          };
        });

        // Nur aktualisieren, wenn transformierte Navigation nicht leer ist
        if (transformedNavigation.length > 0) {
          setNavigation(transformedNavigation);
        } else {
          console.warn("Transformierte Navigation ist leer, behalte Fallback");
        }
      } catch (error) {
        console.error("Fehler beim Laden der Navigation:", error);
      }
    };

    loadNavigation();
  }, []);

  // Load user data for avatar
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!token) {
          // Fallback-Daten
          setUserData({
            name: "Ramiro Lopez Rodriguez",
            role: "Owner – Lopez IT Welt",
            initials: "RL",
          });
          return;
        }

        const response = await fetch("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data?.user) {
            const user = data.data.user;
            const firstName = user.first_name || "Ramiro";
            const lastName = user.last_name || "Lopez Rodriguez";
            setUserData({
              name: `${firstName} ${lastName}`,
              role: data.data.roles?.[0] || "Owner – Lopez IT Welt",
              initials: `${firstName.charAt(0)}${lastName.charAt(0)}`,
            });
          } else {
            setUserData({
              name: "Ramiro Lopez Rodriguez",
              role: "Owner – Lopez IT Welt",
              initials: "RL",
            });
          }
        } else {
          setUserData({
            name: "Ramiro Lopez Rodriguez",
            role: "Owner – Lopez IT Welt",
            initials: "RL",
          });
        }
      } catch (error) {
        console.error("Fehler beim Laden der Benutzer-Daten:", error);
        setUserData({
          name: "Ramiro Lopez Rodriguez",
          role: "Owner – Lopez IT Welt",
          initials: "RL",
        });
      }
    };

    loadUserData();
  }, []);

  // Load dynamic badges
  useEffect(() => {
    const loadDynamicBadges = async () => {
      const badgesToLoad: Array<{ key: string; endpoint: string }> = [];

      navigation.forEach((item) => {
        if (item.dynamicBadge && item.badgeApiEndpoint) {
          badgesToLoad.push({ key: `item-${item.id || item.name}`, endpoint: item.badgeApiEndpoint });
        }
        item.subItems?.forEach((subItem) => {
          if (subItem.dynamicBadge && subItem.badgeApiEndpoint) {
            badgesToLoad.push({ key: `subitem-${subItem.id || subItem.name}`, endpoint: subItem.badgeApiEndpoint });
          }
        });
      });

      const badgePromises = badgesToLoad.map(async ({ key, endpoint }) => {
        try {
          const response = await fetch(endpoint, { cache: "no-store" });
          if (response.ok) {
            const data = await response.json();
            return { key, value: data.count?.toString() || data.total?.toString() || "0" };
          }
        } catch (error) {
          console.error(`Fehler beim Laden des Badges für ${endpoint}:`, error);
        }
        return { key, value: "0" };
      });

      const results = await Promise.all(badgePromises);
      const badgeMap: Record<string, string> = {};
      results.forEach(({ key, value }) => {
        badgeMap[key] = value;
      });
      setDynamicBadges(badgeMap);
    };

    if (!loadingNavigation) {
      loadDynamicBadges();
      const interval = setInterval(loadDynamicBadges, 30000);
      return () => clearInterval(interval);
    }
  }, [navigation, loadingNavigation]);

  // Load sidebar state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem("admin-sidebar-state");
    if (savedState) {
      const { expandedItems: savedExpanded, collapsed: savedCollapsed } = JSON.parse(savedState);
      setExpandedItems(new Set(savedExpanded));
      setSidebarCollapsed(savedCollapsed);
    }
  }, []);

  // Save sidebar state to localStorage
  const saveSidebarState = (expanded: Set<string>, collapsed: boolean) => {
    const state = {
      expandedItems: Array.from(expanded),
      collapsed,
    };
    localStorage.setItem("admin-sidebar-state", JSON.stringify(state));
  };

  const toggleExpanded = (itemName: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemName)) {
      newExpanded.delete(itemName);
    } else {
      newExpanded.add(itemName);
    }
    setExpandedItems(newExpanded);
    saveSidebarState(newExpanded, sidebarCollapsed);
  };

  const toggleSidebar = () => {
    const newCollapsed = !sidebarCollapsed;
    setSidebarCollapsed(newCollapsed);
    saveSidebarState(expandedItems, newCollapsed);
  };

  // Load contact stats for badge updates
  useEffect(() => {
    const loadContactStats = async () => {
      try {
        const response = await fetch("/api/admin/contact-messages/stats", {
          cache: "no-store",
        });
        if (!response.ok) {
          setContactStats({
            new_messages: 0,
            urgent: 0,
          });
          return;
        }
        const data = await response.json();
        if (data.success) {
          setContactStats({
            new_messages: data.stats?.new_messages || 0,
            urgent: data.stats?.urgent || 0,
          });
        } else {
          setContactStats({
            new_messages: 0,
            urgent: 0,
          });
        }
      } catch (error) {
        console.error("Fehler beim Laden der Kontakt-Statistiken:", error);
        setContactStats({
          new_messages: 0,
          urgent: 0,
        });
      }
    };

    loadContactStats();
    const interval = setInterval(loadContactStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const isItemActive = (item: NavItem) => {
    if (item.href && pathname === item.href) return true;
    if (item.subItems) {
      return item.subItems.some((subItem) => pathname === subItem.href);
    }
    return false;
  };

  const isSubItemActive = (subItem: SubNavItem) => {
    return pathname === subItem.href;
  };

  const handleLogout = async () => {
    try {
      // Admin-Logout über API (Cookie wird automatisch mitgesendet)
      const response = await fetch("/api/auth/admin/logout", {
        method: "POST",
        credentials: "include", // WICHTIG: Cookies mitsenden
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.warn("⚠️ Logout-API-Fehler, aber Logout wird fortgesetzt");
      }

      // Alle lokalen Storage-Daten löschen
      localStorage.removeItem("token");
      localStorage.removeItem("sessionToken");
      localStorage.removeItem("adm_token");
      localStorage.removeItem("adm_session");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("sessionToken");
      sessionStorage.removeItem("adm_token");
      sessionStorage.removeItem("adm_session");

      // Zur Admin-Login-Seite weiterleiten
      router.push("/admin/login");
    } catch (error) {
      console.error("❌ Fehler beim Logout:", error);
      // Auch bei Fehler: Lokale Daten löschen und weiterleiten
      localStorage.clear();
      sessionStorage.clear();
      router.push("/admin/login");
    }
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden border-b px-4 py-3" style={{ backgroundColor: "#111217", borderColor: "#272a33" }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-lg font-semibold">
              <span style={{ color: "#c99700" }}>Lopez</span>{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #007bff 0%, #0056b3 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  color: "#007bff",
                  fontWeight: "700",
                  display: "inline-block",
                }}
              >
                IT Welt
              </span>
            </h1>
          </div>
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#ffd700]"
            style={{ color: "#b3b3b3" }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#1f2329"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          >
            {isMobileOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar - Enterprise++ Design (IBM Carbon / SAP Fiori Style) */}
      <nav
        className={`h-screen transition-all duration-300 flex flex-col ${sidebarCollapsed ? "w-16" : "w-64"
          } ${isMobileOpen ? "fixed inset-y-0 left-0 z-50" : "hidden lg:block lg:fixed lg:left-0 lg:top-0 lg:bottom-0 lg:z-40"}`}
        style={{ backgroundColor: "#111217", borderRight: "1px solid #272a33" }}
      >
        {/* Logo-Bereich (Enterprise++ CI) */}
        <div className="p-4 flex-shrink-0" style={{ paddingBottom: "20px" }}>
          {!sidebarCollapsed ? (
            <div className="min-w-0">
              <h1 className="text-base font-semibold truncate">
                <span style={{ color: "#c99700" }}>Lopez</span>{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #007bff 0%, #0056b3 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    color: "#007bff",
                    fontWeight: "700",
                    display: "inline-block",
                  }}
                >
                  IT Welt
                </span>
              </h1>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <span className="text-lg font-semibold" style={{ color: "#c99700" }}>L</span>
            </div>
          )}
        </div>

        {/* Benutzerbox (Enterprise++ CI) - Direkt unter Branding */}
        {!sidebarCollapsed && userData && (
          <div className="px-4 pb-4 flex-shrink-0 border-b" style={{ borderColor: "#272a33", paddingTop: "0" }}>
            <div className="flex items-center space-x-3 mb-3">
              <div
                className="flex items-center justify-center h-8 w-8 rounded-full font-medium flex-shrink-0"
                style={{
                  backgroundColor: "#1c1f27",
                  color: "#f4f4f4",
                  fontSize: "12px",
                }}
              >
                {userData.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: "#f4f4f4" }}>
                  {userData.name}
                </p>
                <p className="text-xs truncate" style={{ color: "#8a8a8a" }}>
                  {userData.role}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => router.push("/admin/settings")}
                className="flex-1 flex items-center justify-center px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#007bff] focus:ring-offset-2 focus:ring-offset-[#111217]"
                style={{
                  backgroundColor: "transparent",
                  border: "1px solid #272a33",
                  color: "#b3b3b3"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#1f2329";
                  e.currentTarget.style.borderColor = "#3a3d47";
                  e.currentTarget.style.color = "#f4f4f4";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.borderColor = "#272a33";
                  e.currentTarget.style.color = "#b3b3b3";
                }}
              >
                <FaCog className="mr-2 flex-shrink-0" style={{ width: "16px", height: "16px" }} />
                <span>Einstellungen</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#da1e28] focus:ring-offset-2 focus:ring-offset-[#111217]"
                style={{
                  backgroundColor: "transparent",
                  border: "1px solid #272a33",
                  color: "#da1e28"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#1f2329";
                  e.currentTarget.style.borderColor = "#3a3d47";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.borderColor = "#272a33";
                }}
              >
                <FaSignOutAlt className="flex-shrink-0" style={{ width: "16px", height: "16px" }} />
              </button>
            </div>
          </div>
        )}

        {/* Collapsed Avatar (nur Icon) - Direkt unter Branding */}
        {sidebarCollapsed && userData && (
          <div className="px-2 pb-2 flex-shrink-0 border-b" style={{ borderColor: "#272a33" }}>
            <div
              className="flex items-center justify-center h-8 w-8 rounded-full font-medium mx-auto cursor-pointer"
              style={{
                backgroundColor: "#1c1f27",
                color: "#f4f4f4",
                fontSize: "12px",
              }}
              onClick={() => setSidebarCollapsed(false)}
            >
              {userData.initials}
            </div>
          </div>
        )}

        {/* Navigation - Scrollbar nur wenn nötig */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
          <div className="p-2">
            <ul className="space-y-1">
              {navigation && navigation.length > 0 ? (
                filterNavigationByPermissions(navigation).map((item) => {
                  const isActive = isItemActive(item);
                  const isExpanded = expandedItems.has(item.name);
                  const hasSubItems = item.subItems && item.subItems.length > 0;
                  const Icon = item.icon;

                  return (
                    <li key={item.name}>
                      {/* Main Item */}
                      <div className="space-y-1">
                        {item.href ? (
                          // Direct Link Item (z.B. Dashboard)
                          <Link
                            href={item.href}
                            className="group flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-150"
                            style={isActive ? {
                              backgroundColor: "#1f2329",
                              color: "#ffd700",
                              borderLeft: "3px solid #ffd700",
                            } : {
                              color: "#b3b3b3",
                            }}
                            onMouseEnter={(e) => {
                              if (!isActive) {
                                e.currentTarget.style.backgroundColor = "#1f2329";
                                e.currentTarget.style.color = "#f4f4f4";
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isActive) {
                                e.currentTarget.style.backgroundColor = "transparent";
                                e.currentTarget.style.color = "#b3b3b3";
                              }
                            }}
                            onClick={() => setIsMobileOpen(false)}
                          >
                            <Icon
                              className="flex-shrink-0"
                              style={{
                                width: "20px",
                                height: "20px",
                                color: isActive ? "#ffd700" : "#8a8a8a",
                                marginRight: sidebarCollapsed ? "0" : "12px"
                              }}
                            />
                            {!sidebarCollapsed && (
                              <span className="truncate flex-1">{item.name}</span>
                            )}
                          </Link>
                        ) : (
                          // Accordion Item (mit Sub-Items)
                          <button
                            onClick={() => toggleExpanded(item.name)}
                            className="group w-full flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-150"
                            style={isActive ? {
                              backgroundColor: "#1f2329",
                              color: "#ffd700",
                              borderLeft: "3px solid #ffd700",
                            } : {
                              color: "#b3b3b3",
                            }}
                            onMouseEnter={(e) => {
                              if (!isActive) {
                                e.currentTarget.style.backgroundColor = "#1f2329";
                                e.currentTarget.style.color = "#f4f4f4";
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isActive) {
                                e.currentTarget.style.backgroundColor = "transparent";
                                e.currentTarget.style.color = "#b3b3b3";
                              }
                            }}
                          >
                            <Icon
                              className="flex-shrink-0"
                              style={{
                                width: "20px",
                                height: "20px",
                                color: isActive ? "#ffd700" : "#8a8a8a",
                                marginRight: sidebarCollapsed ? "0" : "12px"
                              }}
                            />
                            {!sidebarCollapsed && (
                              <>
                                <span className="truncate flex-1 text-left">{item.name}</span>
                                {hasSubItems && (
                                  <span style={{ color: "#8a8a8a", marginLeft: "8px" }}>
                                    {isExpanded ? (
                                      <FaChevronDown style={{ width: "12px", height: "12px" }} />
                                    ) : (
                                      <FaChevronRight style={{ width: "12px", height: "12px" }} />
                                    )}
                                  </span>
                                )}
                              </>
                            )}
                          </button>
                        )}

                        {/* Sub Items */}
                        {hasSubItems && isExpanded && !sidebarCollapsed && (
                          <ul className="ml-2 space-y-0.5" style={{ borderLeft: "1px solid #272a33", paddingLeft: "8px" }}>
                            {item.subItems!.map((subItem) => {
                              const isSubActive = isSubItemActive(subItem);
                              const SubIcon = subItem.icon;

                              return (
                                <li key={subItem.name}>
                                  <Link
                                    href={subItem.href}
                                    className="group flex items-center px-3 py-2 rounded-md text-sm transition-all duration-150"
                                    style={isSubActive ? {
                                      backgroundColor: "#1f2329",
                                      color: "#ffd700",
                                    } : {
                                      color: "#b3b3b3",
                                    }}
                                    onMouseEnter={(e) => {
                                      if (!isSubActive) {
                                        e.currentTarget.style.backgroundColor = "#1f2329";
                                        e.currentTarget.style.color = "#f4f4f4";
                                      }
                                    }}
                                    onMouseLeave={(e) => {
                                      if (!isSubActive) {
                                        e.currentTarget.style.backgroundColor = "transparent";
                                        e.currentTarget.style.color = "#b3b3b3";
                                      }
                                    }}
                                    onClick={() => setIsMobileOpen(false)}
                                  >
                                    <SubIcon
                                      className="flex-shrink-0"
                                      style={{
                                        width: "16px",
                                        height: "16px",
                                        color: isSubActive ? "#ffd700" : "#8a8a8a",
                                        marginRight: "10px"
                                      }}
                                    />
                                    <span className="truncate flex-1">{subItem.name}</span>
                                    {(subItem.badge || (subItem.dynamicBadge && dynamicBadges[`subitem-${subItem.id || subItem.name}`])) && (
                                      <span
                                        className="inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white rounded-full ml-2 flex-shrink-0"
                                        style={{
                                          backgroundColor: subItem.badgeColor === "bg-red-500" ? "#da1e28" : "#272a33",
                                          minWidth: "18px"
                                        }}
                                      >
                                        {subItem.dynamicBadge
                                          ? dynamicBadges[`subitem-${subItem.id || subItem.name}`] || subItem.badge || "0"
                                          : subItem.badge}
                                      </span>
                                    )}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </div>
                    </li>
                  );
                })
              ) : (
                <div className="text-center text-sm py-4" style={{ color: "#8a8a8a" }}>
                  <p>Navigation wird geladen...</p>
                </div>
              )}
            </ul>
          </div>
        </div>

      </nav>
    </>
  );
}
