# 🎛️ Admin UI und Navigation - Lopez IT Welt Enterprise++

## 📋 Admin-Interface Übersicht

**Design-System:** Enterprise++ (IBM/SAP inspiriert)  
**Navigation:** Collapsible Sidebar mit Accordion  
**Responsive:** Mobile-First mit Hamburger-Menu  
**State-Management:** localStorage Persistierung  
**Letzte Aktualisierung:** 2024-12-19

## 🏗️ Navigation-Architektur

### **Haupt-Navigation**

```typescript
interface NavigationStructure {
  mainSections: MainSection[];
  userProfile: UserProfileSection;
  notifications: NotificationSection;
  settings: SettingsSection;
}

interface MainSection {
  id: string;
  title: string;
  icon: IconComponent;
  subItems: SubItem[];
  isExpanded: boolean;
  isActive: boolean;
  badge?: number;
}

interface SubItem {
  id: string;
  title: string;
  href: string;
  icon: IconComponent;
  isActive: boolean;
  badge?: number;
}
```

### **Modulare Struktur**

```typescript
const navigationStructure = {
  // Content Management
  contentManagement: {
    title: "Content Management",
    icon: "FaFileAlt",
    subItems: [
      { title: "Seiten", href: "/admin/content/pages", icon: "FaFile" },
      {
        title: "Header & Footer",
        href: "/admin/content/header-footer",
        icon: "FaHeader",
      },
      { title: "Hero-Section", href: "/admin/content/hero", icon: "FaRocket" },
      {
        title: "Texte & Übersetzungen",
        href: "/admin/content/texts",
        icon: "FaLanguage",
      },
      {
        title: "Medien-Upload",
        href: "/admin/content/media",
        icon: "FaImages",
      },
      {
        title: "Menü-Navigation",
        href: "/admin/content/menus",
        icon: "FaBars",
      },
      {
        title: "A/B-Testing Content",
        href: "/admin/content/ab-testing",
        icon: "FaFlask",
      },
    ],
  },

  // System-Einstellungen
  systemSettings: {
    title: "System-Einstellungen",
    icon: "FaCogs",
    subItems: [
      {
        title: "Benutzer-Management",
        href: "/admin/system/users",
        icon: "FaUsers",
      },
      {
        title: "Rollen & Rechte",
        href: "/admin/system/roles",
        icon: "FaShieldAlt",
      },
      {
        title: "API & Integrations",
        href: "/admin/system/api",
        icon: "FaPlug",
      },
      { title: "Sicherheit", href: "/admin/system/security", icon: "FaLock" },
      {
        title: "Backups & Logs",
        href: "/admin/system/backups",
        icon: "FaDatabase",
      },
      {
        title: "System-Monitoring",
        href: "/admin/system/monitoring",
        icon: "FaChartLine",
      },
    ],
  },

  // Marketing & Kommunikation
  marketing: {
    title: "Marketing & Kommunikation",
    icon: "FaLightbulb",
    subItems: [
      { title: "Blog-Artikel", href: "/admin/marketing/blog", icon: "FaBlog" },
      {
        title: "News & Updates",
        href: "/admin/marketing/news",
        icon: "FaNewspaper",
      },
      {
        title: "Newsletter",
        href: "/admin/marketing/newsletter",
        icon: "FaEnvelope",
      },
      {
        title: "SEO & Meta-Tags",
        href: "/admin/marketing/seo",
        icon: "FaSearch",
      },
    ],
  },
};
```

## 🎨 Design-System

### **Farbschema (Enterprise++)**

```typescript
const colorScheme = {
  // Primärfarben
  primary: {
    50: "#eff6ff",
    100: "#dbeafe",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    900: "#1e3a8a",
  },

  // Grautöne
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
  },

  // Status-Farben
  status: {
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    info: "#3b82f6",
  },
};
```

### **Typography**

```typescript
const typography = {
  // Überschriften
  headings: {
    h1: "text-3xl font-bold text-gray-900",
    h2: "text-2xl font-semibold text-gray-800",
    h3: "text-xl font-medium text-gray-700",
    h4: "text-lg font-medium text-gray-700",
  },

  // Text
  body: {
    base: "text-base text-gray-600",
    small: "text-sm text-gray-500",
    large: "text-lg text-gray-700",
  },

  // Navigation
  nav: {
    main: "text-sm font-medium text-gray-700 hover:text-blue-600",
    sub: "text-sm text-gray-600 hover:text-blue-500",
    active: "text-blue-600 font-semibold",
  },
};
```

## 🧩 Sidebar-Komponente

### **Collapsible Sidebar**

```typescript
// AdminNavigation.tsx
interface AdminNavigationProps {
  currentPath: string;
  user: User;
  notifications: Notification[];
}

const AdminNavigation: React.FC<AdminNavigationProps> = ({
  currentPath,
  user,
  notifications
}) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // State aus localStorage laden
  useEffect(() => {
    const savedExpanded = localStorage.getItem('admin-expanded-items');
    const savedCollapsed = localStorage.getItem('admin-sidebar-collapsed');

    if (savedExpanded) {
      setExpandedItems(JSON.parse(savedExpanded));
    }
    if (savedCollapsed) {
      setSidebarCollapsed(JSON.parse(savedCollapsed));
    }
  }, []);

  // State in localStorage speichern
  useEffect(() => {
    localStorage.setItem('admin-expanded-items', JSON.stringify(expandedItems));
  }, [expandedItems]);

  useEffect(() => {
    localStorage.setItem('admin-sidebar-collapsed', JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);

  // Accordion-Toggle
  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Sidebar-Toggle
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Mobile-Toggle
  const toggleMobile = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={toggleMobile}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            aria-label="Toggle navigation"
          >
            {isMobileOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
          <div className="flex items-center space-x-2">
            <img src="/logo.png" alt="Logo" className="h-8 w-8" />
            <span className="text-lg font-semibold text-gray-900">
              Lopez IT Welt
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleMobile}
        />
      )}

      {/* Sidebar */}
      <nav className={`
        fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200
        transform transition-transform duration-300 ease-in-out
        ${sidebarCollapsed ? 'w-16' : 'w-64'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        lg:static lg:inset-0
      `}>
        {/* Logo Section */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!sidebarCollapsed && (
            <div className="flex items-center space-x-2">
              <img src="/logo.png" alt="Logo" className="h-8 w-8" />
              <span className="text-lg font-semibold text-gray-900">
                Lopez IT Welt
              </span>
            </div>
          )}

          {/* Collapse Toggle */}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            aria-label="Toggle sidebar"
          >
            {sidebarCollapsed ? <FaChevronRight size={16} /> : <FaChevronDown size={16} />}
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          {navigationStructure.map(section => (
            <div key={section.id} className="mb-2">
              {/* Main Section */}
              <button
                onClick={() => toggleExpanded(section.id)}
                className={`
                  w-full flex items-center justify-between px-4 py-3 text-sm font-medium
                  ${isItemActive(section.id)
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <section.icon size={16} />
                  {!sidebarCollapsed && (
                    <span>{section.title}</span>
                  )}
                </div>
                {!sidebarCollapsed && (
                  <div className="flex items-center space-x-2">
                    {section.badge && (
                      <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                        {section.badge}
                      </span>
                    )}
                    {expandedItems.includes(section.id) ?
                      <FaChevronDown size={12} /> :
                      <FaChevronRight size={12} />
                    }
                  </div>
                )}
              </button>

              {/* Sub Items */}
              {expandedItems.includes(section.id) && !sidebarCollapsed && (
                <div className="ml-8 space-y-1">
                  {section.subItems.map(subItem => (
                    <Link
                      key={subItem.id}
                      href={subItem.href}
                      className={`
                        flex items-center space-x-3 px-4 py-2 text-sm
                        ${isSubItemActive(subItem.href)
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:text-blue-500 hover:bg-gray-50'
                        }
                      `}
                    >
                      <subItem.icon size={14} />
                      <span>{subItem.title}</span>
                      {subItem.badge && (
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                          {subItem.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* User Profile & Notifications */}
        {!sidebarCollapsed && (
          <div className="border-t border-gray-200 p-4">
            {/* Notifications */}
            <div className="mb-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Benachrichtigungen
              </h3>
              <div className="space-y-2">
                {notifications.slice(0, 3).map(notification => (
                  <div key={notification.id} className="text-sm text-gray-600">
                    {notification.message}
                  </div>
                ))}
              </div>
            </div>

            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <img
                src={user.avatar || '/default-avatar.png'}
                alt="User Avatar"
                className="h-8 w-8 rounded-full"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user.role}
                </p>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};
```

## 📱 Responsive Design

### **Mobile-First Approach**

```typescript
// Responsive Breakpoints
const breakpoints = {
  sm: '640px',   // Mobile
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px'   // Large Desktop
};

// Mobile Navigation
const MobileNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden">
      {/* Hamburger Menu */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-md text-gray-600 hover:text-gray-900"
        aria-label="Open navigation"
      >
        <FaBars size={24} />
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-white">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <img src="/logo.png" alt="Logo" className="h-8 w-8" />
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-md text-gray-600"
            >
              <FaTimes size={24} />
            </button>
          </div>

          {/* Navigation */}
          <div className="p-4">
            {/* Navigation Items */}
          </div>
        </div>
      )}
    </div>
  );
};
```

### **Touch-Friendly Design**

```css
/* Touch Targets */
.touch-target {
  min-height: 44px;
  min-width: 44px;
}

/* Hover States für Touch-Geräte */
@media (hover: hover) {
  .hover-effect:hover {
    background-color: #f3f4f6;
  }
}

/* Focus States */
.focus-visible:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
```

## ♿ Accessibility (WCAG 2.1 AA)

### **Keyboard Navigation**

```typescript
// Keyboard Event Handler
const handleKeyDown = (event: KeyboardEvent, action: () => void) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    action();
  }
};

// Focus Management
const focusManagement = {
  // Fokus auf erstes Element setzen
  focusFirst: (container: HTMLElement) => {
    const firstFocusable = container.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    ) as HTMLElement;
    firstFocusable?.focus();
  },

  // Fokus innerhalb Container halten
  trapFocus: (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    container.addEventListener("keydown", handleTabKey);
    return () => container.removeEventListener("keydown", handleTabKey);
  },
};
```

### **ARIA-Labels und -States**

```typescript
// ARIA-Attribute
const ariaAttributes = {
  // Navigation
  nav: {
    "aria-label": "Hauptnavigation",
    role: "navigation",
  },

  // Accordion
  button: {
    "aria-expanded": expandedItems.includes(itemId),
    "aria-controls": `submenu-${itemId}`,
    "aria-label": `${section.title} ${expandedItems.includes(itemId) ? "einklappen" : "ausklappen"}`,
  },

  // Submenu
  submenu: {
    id: `submenu-${itemId}`,
    "aria-labelledby": `button-${itemId}`,
    role: "menu",
  },

  // Current Page
  currentLink: {
    "aria-current": "page",
  },
};
```

## 🎯 Active State Management

### **Aktive Navigation erkennen**

```typescript
// Navigation State Manager
class NavigationStateManager {
  // Aktive Hauptsektion finden
  static getActiveMainSection(pathname: string): string | null {
    const pathSegments = pathname.split("/").filter(Boolean);

    if (pathSegments.length < 3) return null;

    const [, section] = pathSegments;
    return section;
  }

  // Aktive Unterseite finden
  static getActiveSubItem(pathname: string): string | null {
    return pathname;
  }

  // Ist Item aktiv?
  static isItemActive(itemId: string, pathname: string): boolean {
    const activeSection = this.getActiveMainSection(pathname);
    return activeSection === itemId;
  }

  // Ist Sub-Item aktiv?
  static isSubItemActive(href: string, pathname: string): boolean {
    return pathname === href || pathname.startsWith(href + "/");
  }
}
```

### **Breadcrumb-Integration**

```typescript
// Breadcrumb Generator
const generateBreadcrumbs = (pathname: string) => {
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = [{ name: "Dashboard", href: "/admin/dashboard" }];

  segments.forEach((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const name = segment.charAt(0).toUpperCase() + segment.slice(1);
    breadcrumbs.push({ name, href });
  });

  return breadcrumbs;
};
```

## 🔔 Notification System

### **Notification-Types**

```typescript
interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    href: string;
  };
}

// Notification Manager
class NotificationManager {
  // Notification erstellen
  static create(notification: Omit<Notification, "id" | "timestamp" | "read">) {
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      timestamp: new Date(),
      read: false,
    };

    // In State speichern
    this.addToState(newNotification);

    // Persistieren
    this.persistNotification(newNotification);

    return newNotification;
  }

  // Notification als gelesen markieren
  static markAsRead(notificationId: string) {
    this.updateNotification(notificationId, { read: true });
  }

  // Alle Notifications laden
  static async loadNotifications(): Promise<Notification[]> {
    const response = await fetch("/api/notifications");
    return response.json();
  }
}
```

## 📊 Performance-Optimierung

### **Lazy Loading**

```typescript
// Lazy-loaded Navigation Items
const LazyNavigationItem = lazy(() => import('./NavigationItem'));

// Suspense Wrapper
const NavigationWithSuspense = () => (
  <Suspense fallback={<NavigationSkeleton />}>
    <LazyNavigationItem />
  </Suspense>
);
```

### **Memoization**

```typescript
// Memoized Navigation Component
const MemoizedNavigation = memo(AdminNavigation, (prevProps, nextProps) => {
  return (
    prevProps.currentPath === nextProps.currentPath &&
    prevProps.user.id === nextProps.user.id &&
    prevProps.notifications.length === nextProps.notifications.length
  );
});
```

## 📚 Verwandte Dokumentation

- [Definition of Done](../01-PROJEKT-MANAGEMENT/01-03-definition-of-done.md) - Zentrale DoD-Kriterien
- [Rechte und Rollen](../04-ENTERPRISE/04-11-rechte-und-rollen.md) - Berechtigungskonzept
- [CMS und Inhalte](../05-QUALITAET/05-04-cms-und-inhalte.md) - Content Management

---

**Nächste Schritte:**

- [ ] Advanced Search implementieren
- [ ] Quick Actions hinzufügen
- [ ] Theme-Switcher integrieren
- [ ] Keyboard-Shortcuts
- [ ] Advanced Notifications
