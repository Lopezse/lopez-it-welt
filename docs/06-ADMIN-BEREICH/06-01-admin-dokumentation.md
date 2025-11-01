# ⚙️ Admin-Dokumentation - Vollständige Admin-Bereich Dokumentation

**Version:** 1.0  
**Datum:** 2025-07-05  
**Status:** 🚧 IN ENTWICKLUNG  
**Autor:** Lopez IT Welt Team

## 📋 **ÜBERSICHT**

Die **Admin-Dokumentation** definiert die vollständige Dokumentation für den Admin-Bereich des Lopez IT Welt Systems. Sie stellt sicher, dass alle Admin-Funktionen einheitlich, sicher und benutzerfreundlich sind.

## 🎯 **ADMIN-BEREICH ARCHITEKTUR**

### **🏗️ Admin-Struktur**

```
src/app/admin/
├── 📁 page.tsx                    // Admin-Dashboard
├── 📁 users/
│   ├── page.tsx                   // Benutzer-Verwaltung
│   ├── [id]/page.tsx              // Benutzer-Details
│   └── create/page.tsx            // Benutzer erstellen
├── 📁 texts/
│   ├── page.tsx                   // Text-Management
│   ├── [id]/page.tsx              // Text-Details
│   └── create/page.tsx            // Text erstellen
├── 📁 settings/
│   ├── page.tsx                   // Einstellungen
│   ├── security/page.tsx          // Sicherheits-Einstellungen
│   └── system/page.tsx            // System-Einstellungen
├── 📁 analytics/
│   ├── page.tsx                   // Analytics-Dashboard
│   ├── performance/page.tsx       // Performance-Analytics
│   └── security/page.tsx          // Security-Analytics
└── 📁 logs/
    ├── page.tsx                   // Log-Übersicht
    ├── audit/page.tsx             // Audit-Logs
    └── errors/page.tsx            // Error-Logs
```

### **🔐 Admin-Authentifizierung**

```typescript
// src/lib/admin-auth.ts
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }
  
  if (session.user.role !== 'admin') {
    redirect('/');
  }
  
  return session;
}

export async function requireAdminOrRedirect() {
  try {
    return await requireAdmin();
  } catch (error) {
    redirect('/login');
  }
}
```

## 📊 **ADMIN-DASHBOARD**

### **Dashboard-Komponente**

```typescript
// src/app/admin/page.tsx
import { requireAdmin } from '@/lib/admin-auth';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { SystemStatus } from '@/components/admin/SystemStatus';
import { QuickActions } from '@/components/admin/QuickActions';

export default async function AdminPage() {
  const session = await requireAdmin();

  return (
    <div className="admin-dashboard">
      <h1>Admin-Dashboard</h1>
      
      <SystemStatus />
      
      <div className="dashboard-grid">
        <AdminDashboard />
        <QuickActions />
      </div>
    </div>
  );
}
```

### **System-Status**

```typescript
// src/components/admin/SystemStatus.tsx
'use client';

import { useState, useEffect } from 'react';

interface SystemMetrics {
  uptime: string;
  memoryUsage: number;
  cpuUsage: number;
  activeUsers: number;
  totalRequests: number;
}

export function SystemStatus() {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSystemMetrics();
    const interval = setInterval(fetchSystemMetrics, 30000); // 30 Sekunden
    
    return () => clearInterval(interval);
  }, []);

  const fetchSystemMetrics = async () => {
    try {
      const response = await fetch('/api/admin/system/metrics');
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error('Fehler beim Laden der System-Metriken:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Lade System-Status...</div>;
  }

  if (!metrics) {
    return <div>Fehler beim Laden der System-Metriken</div>;
  }

  return (
    <div className="system-status">
      <h2>System-Status</h2>
      
      <div className="metrics-grid">
        <div className="metric">
          <span className="label">Uptime:</span>
          <span className="value">{metrics.uptime}</span>
        </div>
        
        <div className="metric">
          <span className="label">Memory Usage:</span>
          <span className="value">{metrics.memoryUsage}%</span>
        </div>
        
        <div className="metric">
          <span className="label">CPU Usage:</span>
          <span className="value">{metrics.cpuUsage}%</span>
        </div>
        
        <div className="metric">
          <span className="label">Active Users:</span>
          <span className="value">{metrics.activeUsers}</span>
        </div>
        
        <div className="metric">
          <span className="label">Total Requests:</span>
          <span className="value">{metrics.totalRequests}</span>
        </div>
      </div>
    </div>
  );
}
```

### **Quick-Actions**

```typescript
// src/components/admin/QuickActions.tsx
'use client';

import Link from 'next/link';

export function QuickActions() {
  const actions = [
    {
      title: 'Benutzer verwalten',
      description: 'Benutzer hinzufügen, bearbeiten oder löschen',
      href: '/admin/users',
      icon: '👥'
    },
    {
      title: 'Texte verwalten',
      description: 'Website-Texte bearbeiten und übersetzen',
      href: '/admin/texts',
      icon: '📝'
    },
    {
      title: 'Einstellungen',
      description: 'System- und Sicherheits-Einstellungen',
      href: '/admin/settings',
      icon: '⚙️'
    },
    {
      title: 'Analytics',
      description: 'Performance- und Security-Analytics',
      href: '/admin/analytics',
      icon: '📊'
    },
    {
      title: 'Logs',
      description: 'Audit- und Error-Logs einsehen',
      href: '/admin/logs',
      icon: '📋'
    }
  ];

  return (
    <div className="quick-actions">
      <h2>Schnell-Aktionen</h2>
      
      <div className="actions-grid">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="action-card"
          >
            <div className="action-icon">{action.icon}</div>
            <div className="action-content">
              <h3>{action.title}</h3>
              <p>{action.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

## 👥 **BENUTZER-VERWALTUNG**

### **Benutzer-Übersicht**

```typescript
// src/app/admin/users/page.tsx
import { requireAdmin } from '@/lib/admin-auth';
import { UserManagement } from '@/components/admin/UserManagement';

export default async function UsersPage() {
  await requireAdmin();

  return (
    <div className="users-page">
      <h1>Benutzer-Verwaltung</h1>
      
      <UserManagement />
    </div>
  );
}
```

### **Benutzer-Management-Komponente**

```typescript
// src/components/admin/UserManagement.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: string;
  lastLogin: string;
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Fehler beim Laden der Benutzer:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Benutzer wirklich löschen?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setUsers(users.filter(user => user.id !== userId));
      } else {
        alert('Fehler beim Löschen des Benutzers');
      }
    } catch (error) {
      console.error('Fehler beim Löschen des Benutzers:', error);
      alert('Fehler beim Löschen des Benutzers');
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Lade Benutzer...</div>;
  }

  return (
    <div className="user-management">
      <div className="user-management-header">
        <div className="search-box">
          <input
            type="text"
            placeholder="Benutzer suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Link href="/admin/users/create" className="btn-primary">
          Neuen Benutzer erstellen
        </Link>
      </div>

      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>E-Mail</th>
              <th>Rolle</th>
              <th>Erstellt</th>
              <th>Letzter Login</th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge role-${user.role}`}>
                    {user.role}
                  </span>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  {user.lastLogin
                    ? new Date(user.lastLogin).toLocaleDateString()
                    : 'Nie'
                  }
                </td>
                <td>
                  <div className="actions">
                    <Link
                      href={`/admin/users/${user.id}`}
                      className="btn-secondary"
                    >
                      Bearbeiten
                    </Link>
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="btn-danger"
                      disabled={user.role === 'admin'}
                    >
                      Löschen
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

### **Benutzer erstellen**

```typescript
// src/app/admin/users/create/page.tsx
import { requireAdmin } from '@/lib/admin-auth';
import { CreateUserForm } from '@/components/admin/CreateUserForm';

export default async function CreateUserPage() {
  await requireAdmin();

  return (
    <div className="create-user-page">
      <h1>Neuen Benutzer erstellen</h1>
      
      <CreateUserForm />
    </div>
  );
}
```

### **Benutzer-Erstellungs-Formular**

```typescript
// src/components/admin/CreateUserForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function CreateUserForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        router.push('/admin/users');
      } else {
        const error = await response.json();
        alert(`Fehler: ${error.message}`);
      }
    } catch (error) {
      console.error('Fehler beim Erstellen des Benutzers:', error);
      alert('Fehler beim Erstellen des Benutzers');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="create-user-form">
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">E-Mail</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Passwort</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="role">Rolle</label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="user">Benutzer</option>
          <option value="admin">Administrator</option>
        </select>
      </div>

      <div className="form-actions">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
        >
          {loading ? 'Erstelle...' : 'Benutzer erstellen'}
        </button>
        
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-secondary"
        >
          Abbrechen
        </button>
      </div>
    </form>
  );
}
```

## 📝 **TEXT-MANAGEMENT**

### **Text-Übersicht**

```typescript
// src/app/admin/texts/page.tsx
import { requireAdmin } from '@/lib/admin-auth';
import { TextManagement } from '@/components/admin/TextManagement';

export default async function TextsPage() {
  await requireAdmin();

  return (
    <div className="texts-page">
      <h1>Text-Management</h1>
      
      <TextManagement />
    </div>
  );
}
```

### **Text-Management-Komponente**

```typescript
// src/components/admin/TextManagement.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Text {
  id: string;
  key: string;
  value: string;
  language: string;
  createdAt: string;
  updatedAt: string;
}

export function TextManagement() {
  const [texts, setTexts] = useState<Text[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [languageFilter, setLanguageFilter] = useState('all');

  useEffect(() => {
    fetchTexts();
  }, []);

  const fetchTexts = async () => {
    try {
      const response = await fetch('/api/admin/texts');
      const data = await response.json();
      setTexts(data);
    } catch (error) {
      console.error('Fehler beim Laden der Texte:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteText = async (textId: string) => {
    if (!confirm('Text wirklich löschen?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/texts/${textId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setTexts(texts.filter(text => text.id !== textId));
      } else {
        alert('Fehler beim Löschen des Texts');
      }
    } catch (error) {
      console.error('Fehler beim Löschen des Texts:', error);
      alert('Fehler beim Löschen des Texts');
    }
  };

  const filteredTexts = texts.filter(text => {
    const matchesSearch = text.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         text.value.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLanguage = languageFilter === 'all' || text.language === languageFilter;
    
    return matchesSearch && matchesLanguage;
  });

  if (loading) {
    return <div>Lade Texte...</div>;
  }

  return (
    <div className="text-management">
      <div className="text-management-header">
        <div className="filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="Texte suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="language-filter">
            <select
              value={languageFilter}
              onChange={(e) => setLanguageFilter(e.target.value)}
            >
              <option value="all">Alle Sprachen</option>
              <option value="de">Deutsch</option>
              <option value="en">Englisch</option>
              <option value="es">Spanisch</option>
            </select>
          </div>
        </div>
        
        <Link href="/admin/texts/create" className="btn-primary">
          Neuen Text erstellen
        </Link>
      </div>

      <div className="texts-table">
        <table>
          <thead>
            <tr>
              <th>Schlüssel</th>
              <th>Wert</th>
              <th>Sprache</th>
              <th>Erstellt</th>
              <th>Aktualisiert</th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {filteredTexts.map((text) => (
              <tr key={text.id}>
                <td>{text.key}</td>
                <td>
                  <div className="text-value">
                    {text.value.length > 50
                      ? `${text.value.substring(0, 50)}...`
                      : text.value
                    }
                  </div>
                </td>
                <td>
                  <span className={`language-badge language-${text.language}`}>
                    {text.language}
                  </span>
                </td>
                <td>{new Date(text.createdAt).toLocaleDateString()}</td>
                <td>{new Date(text.updatedAt).toLocaleDateString()}</td>
                <td>
                  <div className="actions">
                    <Link
                      href={`/admin/texts/${text.id}`}
                      className="btn-secondary"
                    >
                      Bearbeiten
                    </Link>
                    <button
                      onClick={() => deleteText(text.id)}
                      className="btn-danger"
                    >
                      Löschen
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

## ⚙️ **EINSTELLUNGEN**

### **Einstellungen-Übersicht**

```typescript
// src/app/admin/settings/page.tsx
import { requireAdmin } from '@/lib/admin-auth';
import { SettingsOverview } from '@/components/admin/SettingsOverview';

export default async function SettingsPage() {
  await requireAdmin();

  return (
    <div className="settings-page">
      <h1>Einstellungen</h1>
      
      <SettingsOverview />
    </div>
  );
}
```

### **Einstellungen-Übersicht-Komponente**

```typescript
// src/components/admin/SettingsOverview.tsx
'use client';

import Link from 'next/link';

export function SettingsOverview() {
  const settingsCategories = [
    {
      title: 'Sicherheits-Einstellungen',
      description: 'Passwort-Richtlinien, Session-Management, Security-Headers',
      href: '/admin/settings/security',
      icon: '🔒'
    },
    {
      title: 'System-Einstellungen',
      description: 'Performance, Caching, Logging, Monitoring',
      href: '/admin/settings/system',
      icon: '⚙️'
    },
    {
      title: 'E-Mail-Einstellungen',
      description: 'SMTP-Konfiguration, E-Mail-Templates, Newsletter',
      href: '/admin/settings/email',
      icon: '📧'
    },
    {
      title: 'Backup-Einstellungen',
      description: 'Automatische Backups, Backup-Speicherung, Wiederherstellung',
      href: '/admin/settings/backup',
      icon: '💾'
    }
  ];

  return (
    <div className="settings-overview">
      <div className="settings-grid">
        {settingsCategories.map((category) => (
          <Link
            key={category.href}
            href={category.href}
            className="settings-card"
          >
            <div className="settings-icon">{category.icon}</div>
            <div className="settings-content">
              <h3>{category.title}</h3>
              <p>{category.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

## 📊 **ANALYTICS**

### **Analytics-Dashboard**

```typescript
// src/app/admin/analytics/page.tsx
import { requireAdmin } from '@/lib/admin-auth';
import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard';

export default async function AnalyticsPage() {
  await requireAdmin();

  return (
    <div className="analytics-page">
      <h1>Analytics-Dashboard</h1>
      
      <AnalyticsDashboard />
    </div>
  );
}
```

### **Analytics-Dashboard-Komponente**

```typescript
// src/components/admin/AnalyticsDashboard.tsx
'use client';

import { useState, useEffect } from 'react';

interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  bounceRate: number;
  avgSessionDuration: number;
  topPages: Array<{
    page: string;
    views: number;
  }>;
  userGrowth: Array<{
    date: string;
    users: number;
  }>;
}

export function AnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      const response = await fetch('/api/admin/analytics');
      const data = await response.json();
      setAnalyticsData(data);
    } catch (error) {
      console.error('Fehler beim Laden der Analytics-Daten:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Lade Analytics-Daten...</div>;
  }

  if (!analyticsData) {
    return <div>Fehler beim Laden der Analytics-Daten</div>;
  }

  return (
    <div className="analytics-dashboard">
      <div className="analytics-overview">
        <div className="metric-card">
          <h3>Seitenaufrufe</h3>
          <div className="metric-value">{analyticsData.pageViews.toLocaleString()}</div>
        </div>
        
        <div className="metric-card">
          <h3>Eindeutige Besucher</h3>
          <div className="metric-value">{analyticsData.uniqueVisitors.toLocaleString()}</div>
        </div>
        
        <div className="metric-card">
          <h3>Absprungrate</h3>
          <div className="metric-value">{analyticsData.bounceRate}%</div>
        </div>
        
        <div className="metric-card">
          <h3>Durchschnittliche Session-Dauer</h3>
          <div className="metric-value">{Math.round(analyticsData.avgSessionDuration / 60)} Min</div>
        </div>
      </div>

      <div className="analytics-details">
        <div className="top-pages">
          <h3>Top-Seiten</h3>
          <div className="pages-list">
            {analyticsData.topPages.map((page, index) => (
              <div key={index} className="page-item">
                <span className="page-name">{page.page}</span>
                <span className="page-views">{page.views.toLocaleString()} Aufrufe</span>
              </div>
            ))}
          </div>
        </div>

        <div className="user-growth">
          <h3>Benutzer-Wachstum</h3>
          <div className="growth-chart">
            {/* Hier würde ein Chart-Komponente eingefügt werden */}
            <div className="chart-placeholder">
              Chart wird hier angezeigt
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

## 📋 **LOGS**

### **Log-Übersicht**

```typescript
// src/app/admin/logs/page.tsx
import { requireAdmin } from '@/lib/admin-auth';
import { LogOverview } from '@/components/admin/LogOverview';

export default async function LogsPage() {
  await requireAdmin();

  return (
    <div className="logs-page">
      <h1>Log-Übersicht</h1>
      
      <LogOverview />
    </div>
  );
}
```

### **Log-Übersicht-Komponente**

```typescript
// src/components/admin/LogOverview.tsx
'use client';

import Link from 'next/link';

export function LogOverview() {
  const logCategories = [
    {
      title: 'Audit-Logs',
      description: 'Alle Benutzer-Aktionen und System-Ereignisse',
      href: '/admin/logs/audit',
      icon: '📋',
      count: '1,234'
    },
    {
      title: 'Error-Logs',
      description: 'Fehler und Exceptions im System',
      href: '/admin/logs/errors',
      icon: '❌',
      count: '56'
    },
    {
      title: 'Security-Logs',
      description: 'Sicherheits-relevante Ereignisse',
      href: '/admin/logs/security',
      icon: '🔒',
      count: '89'
    },
    {
      title: 'Performance-Logs',
      description: 'Performance-Metriken und Bottlenecks',
      href: '/admin/logs/performance',
      icon: '⚡',
      count: '234'
    }
  ];

  return (
    <div className="log-overview">
      <div className="log-categories">
        {logCategories.map((category) => (
          <Link
            key={category.href}
            href={category.href}
            className="log-category-card"
          >
            <div className="log-icon">{category.icon}</div>
            <div className="log-content">
              <h3>{category.title}</h3>
              <p>{category.description}</p>
              <div className="log-count">{category.count} Einträge</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

---

**Letzte Aktualisierung:** 2025-07-05  
**Nächste Überprüfung:** 2025-07-06 