"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FaBars,
  FaBell,
  FaBook,
  FaCalendarAlt,
  FaChartLine,
  FaChevronDown,
  FaChevronRight,
  FaClock,
  FaCog,
  FaCogs,
  FaDatabase,
  FaEnvelope,
  FaFileAlt,
  FaFileCode,
  FaHistory,
  FaHome,
  FaListAlt,
  FaPlus,
  FaProjectDiagram,
  FaShieldAlt,
  FaStickyNote,
  FaTicketAlt,
  FaTimes,
  FaTools,
  FaUsers,
} from "react-icons/fa";

interface SubNavItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  badge?: string;
  badgeColor?: string;
  dynamicBadge?: boolean;
}

interface NavItem {
  name: string;
  href?: string;
  icon: React.ComponentType<any>;
  description: string;
  badge?: string;
  badgeColor?: string;
  subItems?: SubNavItem[];
  isExpanded?: boolean;
}

const navigation: NavItem[] = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: FaHome,
    description: "Übersicht & KPIs",
    subItems: [],
  },
  {
    name: "Content Management",
    icon: FaFileAlt,
    description: "Inhalte verwalten & bearbeiten",
    subItems: [
      {
        name: "Seitenverwaltung",
        href: "/admin/content/pages",
        icon: FaFileAlt,
      },
      {
        name: "Header & Footer",
        href: "/admin/content/header-footer",
        icon: FaCog,
      },
      { name: "Hero-Section", href: "/admin/content/hero", icon: FaChartLine },
      {
        name: "Texte & Übersetzungen",
        href: "/admin/content/texts",
        icon: FaBook,
      },
      { name: "Medien-Upload", href: "/admin/content/media", icon: FaDatabase },
      {
        name: "Menü-Navigation",
        href: "/admin/content/navigation",
        icon: FaProjectDiagram,
      },
      {
        name: "A/B-Testing & Experimente",
        href: "/admin/ab-experiments",
        icon: FaChartLine,
      },
    ],
  },
  {
    name: "Kundenverwaltung",
    icon: FaUsers,
    description: "Zentrale Kunden- und Firmenverwaltung",
    subItems: [
      { name: "Kundenliste", href: "/admin/customers", icon: FaUsers },
      {
        name: "Neuen Kunden hinzufügen",
        href: "/admin/customers/new",
        icon: FaPlus,
      },
      {
        name: "Kunden-Import",
        href: "/admin/customers/import",
        icon: FaDatabase,
      },
      {
        name: "Kunden-Statistiken",
        href: "/admin/customers/stats",
        icon: FaChartLine,
      },
    ],
  },
  {
    name: "System-Einstellungen",
    icon: FaCogs,
    description: "Technische Konfiguration",
    subItems: [
      { name: "Benutzerverwaltung", href: "/admin/users", icon: FaUsers },
      { name: "Rollen & Rechte", href: "/admin/roles", icon: FaShieldAlt },
      {
        name: "Audit-Logs",
        href: "/admin/audit-logs",
        icon: FaShieldAlt,
        badge: "3",
        badgeColor: "bg-red-500",
      },
      { name: "API & Integrationen", href: "/admin/system/apis", icon: FaCog },
      { name: "Sicherheit", href: "/admin/system/security", icon: FaShieldAlt },
      { name: "Backup & Recovery", href: "/admin/backup", icon: FaDatabase },
      {
        name: "System-Monitoring",
        href: "/admin/monitoring",
        icon: FaDatabase,
      },
    ],
  },
  {
    name: "Marketing & Kommunikation",
    icon: FaBell,
    description: "Marketing-Tools & Content",
    subItems: [
      { name: "Blog-Artikel", href: "/admin/marketing/blog", icon: FaFileAlt },
      { name: "News & Updates", href: "/admin/marketing/news", icon: FaBell },
      { name: "Newsletter", href: "/admin/marketing/newsletter", icon: FaBell },
      {
        name: "SEO & Meta-Tags",
        href: "/admin/marketing/seo",
        icon: FaChartLine,
      },
    ],
  },
  {
    name: "Projekte",
    icon: FaProjectDiagram,
    description: "Projektmanagement",
    subItems: [
      {
        name: "Projektübersicht",
        href: "/admin/projects",
        icon: FaProjectDiagram,
      },
      { name: "Kanban", href: "/admin/projects/kanban", icon: FaChartLine },
      {
        name: "Kalender",
        href: "/admin/projects/calendar",
        icon: FaCalendarAlt,
      },
    ],
  },
  {
    name: "Support",
    icon: FaTools,
    description: "IT-Support & Tickets",
    subItems: [
      {
        name: "Tickets",
        href: "/admin/support",
        icon: FaTicketAlt,
        badge: "7",
        badgeColor: "bg-red-500",
      },
      {
        name: "Kontakt-Nachrichten",
        href: "/admin/support/contact-messages",
        icon: FaEnvelope,
        badge: "0",
        badgeColor: "bg-red-500",
        dynamicBadge: true,
      },
      {
        name: "Wissensdatenbank",
        href: "/admin/support/knowledge",
        icon: FaBook,
      },
    ],
  },
  {
    name: "Dokumentation",
    icon: FaBook,
    description: "System-Dokumentation & Anleitungen",
    subItems: [
      {
        name: "System-Dokumentation",
        href: "/admin/docs?category=system",
        icon: FaFileCode,
      },
      {
        name: "How-To Anleitungen",
        href: "/admin/docs?category=howto",
        icon: FaListAlt,
      },
      {
        name: "Change-Log",
        href: "/admin/docs?category=changelog",
        icon: FaHistory,
      },
      {
        name: "Interne Hinweise",
        href: "/admin/docs?category=internal",
        icon: FaStickyNote,
      },
    ],
  },
  {
    name: "Zeiterfassung",
    href: "/admin/time-tracking",
    icon: FaClock,
    description: "Zeiterfassung & Analytics",
    subItems: [],
  },
  {
    name: "Office & Finanzen",
    icon: FaFileAlt,
    description: "CRM, Projekte, Aufträge, Rechnungen",
    subItems: [
      {
        name: "CRM & Projekte",
        href: "/admin/office/projects",
        icon: FaProjectDiagram,
      },
      {
        name: "Aufträge & Aufgaben",
        href: "/admin/office/orders",
        icon: FaListAlt,
      },
      {
        name: "Kalender",
        href: "/admin/office/calendar",
        icon: FaCalendarAlt,
      },
      {
        name: "Rechnungen",
        href: "/admin/office/invoices",
        icon: FaFileAlt,
      },
      {
        name: "E-Rechnung",
        href: "/admin/office/einvoice",
        icon: FaFileCode,
      },
      {
        name: "Reporting",
        href: "/admin/office/reporting",
        icon: FaChartLine,
      },
      {
        name: "Audit & Compliance",
        href: "/admin/office/audit",
        icon: FaShieldAlt,
      },
      {
        name: "Lohnabrechnung",
        href: "/admin/office/payroll",
        icon: FaFileAlt,
      },
    ],
  },
];

export default function AdminNavigation() {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [contactStats, setContactStats] = useState({
    new_messages: 0,
    urgent: 0,
  });

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
          // Wenn Response nicht OK, Fallback auf Standardwerte
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
          // Fallback auf Standardwerte
          setContactStats({
            new_messages: 0,
            urgent: 0,
          });
        }
      } catch (error) {
        console.error("Fehler beim Laden der Kontakt-Statistiken:", error);
        // Fallback auf Standardwerte bei Fehler
        setContactStats({
          new_messages: 0,
          urgent: 0,
        });
      }
    };

    loadContactStats();
    // Update every 30 seconds
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

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div
              className="flex items-center justify-center h-10 w-10 rounded-lg text-white font-bold shadow-lg"
              style={{
                background: "linear-gradient(135deg, #007BFF 0%, #0056B3 100%)",
                fontSize: "16px",
                fontWeight: "bold",
                boxShadow: "0 4px 8px rgba(0, 123, 255, 0.3)",
              }}
            >
              LW
            </div>
            <div className="ml-3">
              <h1 className="text-lg font-semibold">
                <span style={{ color: "#FFD700" }}>Lopez</span>
                <span style={{ color: "#007BFF" }}> IT Welt</span>
              </h1>
            </div>
          </div>
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      {/* Sidebar */}
      <nav
        className={`bg-white shadow-sm border-r border-gray-200 min-h-screen transition-all duration-300 ${
          sidebarCollapsed ? "w-16" : "w-64"
        } ${isMobileOpen ? "fixed inset-y-0 left-0 z-50" : "hidden lg:block"}`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div
              className="flex items-center justify-center h-12 w-12 rounded-lg text-white font-bold shadow-lg"
              style={{
                background: "linear-gradient(135deg, #007BFF 0%, #0056B3 100%)",
                fontSize: "18px",
                fontWeight: "bold",
                boxShadow: "0 4px 8px rgba(0, 123, 255, 0.3)",
              }}
            >
              LW
            </div>
            {!sidebarCollapsed && (
              <div className="ml-3">
                <h1 className="text-lg font-semibold">
                  <span style={{ color: "#FFD700" }}>Lopez</span>
                  <span style={{ color: "#007BFF" }}> IT Welt</span>
                </h1>
                <p className="text-sm text-gray-500">Dashboard</p>
              </div>
            )}
          </div>
        </div>

        {/* Collapse Toggle */}
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={toggleSidebar}
            className="w-full flex items-center justify-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            {sidebarCollapsed ? (
              <FaChevronRight className="h-4 w-4" />
            ) : (
              <FaChevronDown className="h-4 w-4" />
            )}
            {!sidebarCollapsed && <span className="ml-2">Sidebar einklappen</span>}
          </button>
        </div>

        {/* Navigation */}
        <div className="p-4">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const isActive = isItemActive(item);
              const isExpanded = expandedItems.has(item.name);
              const hasSubItems = item.subItems && item.subItems.length > 0;
              const Icon = item.icon;

              return (
                <li key={item.name}>
                  {/* Main Item */}
                  <div className="space-y-1">
                    {item.href ? (
                      // Direct Link Item
                      <Link
                        href={item.href}
                        className={`group flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                        onClick={() => setIsMobileOpen(false)}
                      >
                        <Icon
                          className={`mr-3 h-5 w-5 flex-shrink-0 ${
                            isActive ? "text-blue-700" : "text-gray-400 group-hover:text-gray-500"
                          }`}
                        />
                        {!sidebarCollapsed && (
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="truncate">{item.name}</span>
                              {item.badge && (
                                <span
                                  className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white rounded-full ${item.badgeColor} ml-2`}
                                >
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1 truncate">
                              {item.description}
                            </p>
                          </div>
                        )}
                      </Link>
                    ) : (
                      // Accordion Item
                      <button
                        onClick={() => toggleExpanded(item.name)}
                        className={`group w-full flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        <Icon
                          className={`mr-3 h-5 w-5 flex-shrink-0 ${
                            isActive ? "text-blue-700" : "text-gray-400 group-hover:text-gray-500"
                          }`}
                        />
                        {!sidebarCollapsed && (
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="truncate">{item.name}</span>
                              <div className="flex items-center space-x-2">
                                {item.badge && (
                                  <span
                                    className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white rounded-full ${item.badgeColor}`}
                                  >
                                    {item.badge}
                                  </span>
                                )}
                                {hasSubItems &&
                                  (isExpanded ? (
                                    <FaChevronDown className="h-3 w-3" />
                                  ) : (
                                    <FaChevronRight className="h-3 w-3" />
                                  ))}
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 truncate">
                              {item.description}
                            </p>
                          </div>
                        )}
                      </button>
                    )}

                    {/* Sub Items */}
                    {hasSubItems && isExpanded && !sidebarCollapsed && (
                      <ul className="ml-6 space-y-1">
                        {item.subItems!.map((subItem) => {
                          const isSubActive = isSubItemActive(subItem);
                          const SubIcon = subItem.icon;

                          return (
                            <li key={subItem.name}>
                              <Link
                                href={subItem.href}
                                className={`group flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
                                  isSubActive
                                    ? "bg-blue-100 text-blue-700"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                                onClick={() => setIsMobileOpen(false)}
                              >
                                <SubIcon
                                  className={`mr-3 h-4 w-4 flex-shrink-0 ${
                                    isSubActive
                                      ? "text-blue-700"
                                      : "text-gray-400 group-hover:text-gray-500"
                                  }`}
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <span className="truncate">{subItem.name}</span>
                                    {subItem.badge && (
                                      <span
                                        className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white rounded-full ${subItem.badgeColor} ml-2`}
                                      >
                                        {subItem.dynamicBadge
                                          ? contactStats.new_messages
                                          : subItem.badge}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Benachrichtigungen */}
        {!sidebarCollapsed && (
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer">
              <FaBell className="mr-3 h-4 w-4 text-gray-400" />
              <span>Benachrichtigungen</span>
              <span className="ml-auto inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                4
              </span>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
