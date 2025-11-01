'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const navigation = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z',
    description: 'Übersicht und Statistiken',
    gradient: 'from-hauptblau to-akzentblau',
  },
  {
    name: 'Zeiterfassung',
    href: '/admin/time-tracking',
    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    description: 'Zeiterfassung und Abrechnung',
    gradient: 'from-gruen to-akzentblau',
    submenu: [
      { name: 'Aktuelle Sessions', href: '/admin/time-tracking' },
      { name: 'Übersicht', href: '/admin/time-tracking/overview' },
      { name: 'Analytics', href: '/admin/time-tracking/analytics' },
      { name: 'Export', href: '/admin/time-tracking/export' },
    ],
  },
  {
    name: 'CRM',
    href: '/admin/crm',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    description: 'Kundenverwaltung',
    gradient: 'from-hauptblau to-gelb',
    submenu: [
      { name: 'Kunden', href: '/admin/crm/customers' },
      { name: 'Kontakte', href: '/admin/crm/contacts' },
      { name: 'Projekte', href: '/admin/crm/projects' },
      { name: 'Verträge', href: '/admin/crm/contracts' },
    ],
  },
  {
    name: 'Tickets',
    href: '/admin/tickets',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    description: 'Support-Tickets',
    gradient: 'from-orange to-rot',
    submenu: [
      { name: 'Offene Tickets', href: '/admin/tickets/open' },
      { name: 'Alle Tickets', href: '/admin/tickets' },
      { name: 'Ticket-Statistiken', href: '/admin/tickets/stats' },
      { name: 'Ticket-Vorlagen', href: '/admin/tickets/templates' },
    ],
  },
  {
    name: 'Projekte',
    href: '/admin/projects',
    icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
    description: 'Projektverwaltung',
    gradient: 'from-hauptblau to-akzentblau',
    submenu: [
      { name: 'Aktive Projekte', href: '/admin/projects/active' },
      { name: 'Alle Projekte', href: '/admin/projects' },
      { name: 'Projekt-Statistiken', href: '/admin/projects/stats' },
      { name: 'Projekt-Vorlagen', href: '/admin/projects/templates' },
    ],
  },
  {
    name: 'Shop',
    href: '/admin/shop',
    icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
    description: 'E-Commerce-Verwaltung',
    gradient: 'from-gruen to-gelb',
    submenu: [
      { name: 'Bestellungen', href: '/admin/shop/orders' },
      { name: 'Produkte', href: '/admin/shop/products' },
      { name: 'Kategorien', href: '/admin/shop/categories' },
      { name: 'Shop-Statistiken', href: '/admin/shop/stats' },
    ],
  },
  {
    name: 'Rechnungen',
    href: '/admin/invoices',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    description: 'Rechnungswesen',
    gradient: 'from-gelb to-orange',
    submenu: [
      { name: 'Offene Rechnungen', href: '/admin/invoices/open' },
      { name: 'Alle Rechnungen', href: '/admin/invoices' },
      { name: 'Rechnungsvorlagen', href: '/admin/invoices/templates' },
      { name: 'Finanzberichte', href: '/admin/invoices/reports' },
    ],
  },
  {
    name: 'Monitoring',
    href: '/admin/monitoring',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    description: 'System-Monitoring',
    gradient: 'from-akzentblau to-hauptblau',
    submenu: [
      { name: 'Server-Status', href: '/admin/monitoring/servers' },
      { name: 'Security-Übersicht', href: '/admin/monitoring/security' },
      { name: 'Alarme & Warnungen', href: '/admin/monitoring/alerts' },
      { name: 'System-Logs', href: '/admin/monitoring/logs' },
      { name: 'Performance', href: '/admin/monitoring/performance' },
      { name: 'Angriffs-Statistiken', href: '/admin/monitoring/attack-stats' },
    ],
  },
  {
    name: 'Backups',
    href: '/admin/backups',
    icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
    description: 'Backup-Verwaltung',
    gradient: 'from-gruen to-akzentblau',
    submenu: [
      { name: 'Backup-Status', href: '/admin/backups/status' },
      { name: 'Backup-Historie', href: '/admin/backups/history' },
      { name: 'Wiederherstellung', href: '/admin/backups/restore' },
      { name: 'Backup-Einstellungen', href: '/admin/backups/settings' },
    ],
  },
  {
    name: 'Dokumentation',
    href: '/admin/documentation',
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    description: 'IT-Dokumentation',
    gradient: 'from-dunkelgrau to-hellgrau',
    submenu: [
      { name: 'System-Doku', href: '/admin/documentation/system' },
      { name: 'Prozess-Doku', href: '/admin/documentation/processes' },
      { name: 'Anleitungen', href: '/admin/documentation/guides' },
      { name: 'Wissensdatenbank', href: '/admin/documentation/knowledge' },
    ],
  },
  {
    name: 'Support',
    href: '/admin/support',
    icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z',
    description: 'Support-Verwaltung',
    gradient: 'from-rot to-orange',
    submenu: [
      { name: 'Support-Tickets', href: '/admin/support/tickets' },
      { name: 'FAQ-Verwaltung', href: '/admin/support/faq' },
      { name: 'Support-Statistiken', href: '/admin/support/stats' },
      { name: 'Support-Einstellungen', href: '/admin/support/settings' },
    ],
  },
  {
    name: 'KI-Aktionen',
    href: '/admin/ki-actions',
    icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
    description: 'KI-gestützte Automatisierung',
    gradient: 'from-gelb to-orange',
    submenu: [
      { name: 'KI-Sessions', href: '/admin/ki-actions/sessions' },
      { name: 'KI-Statistiken', href: '/admin/ki-actions/stats' },
      { name: 'KI-Einstellungen', href: '/admin/ki-actions/settings' },
      { name: 'KI-Logs', href: '/admin/ki-actions/logs' },
    ],
  },
  {
    name: 'Benutzer',
    href: '/admin/users',
    icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z',
    description: 'Benutzerverwaltung',
    gradient: 'from-hauptblau to-akzentblau',
    submenu: [
      { name: 'Alle Benutzer', href: '/admin/users' },
      { name: 'Rollen & Rechte', href: '/admin/users/roles' },
      { name: 'Benutzer-Statistiken', href: '/admin/users/stats' },
      { name: 'Benutzer-Einstellungen', href: '/admin/users/settings' },
    ],
  },
  {
    name: 'Einstellungen',
    href: '/admin/settings',
    icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
    description: 'Systemeinstellungen',
    gradient: 'from-dunkelgrau to-hellgrau',
    submenu: [
      { name: 'Allgemeine Einstellungen', href: '/admin/settings/general' },
      { name: 'Sicherheit', href: '/admin/settings/security' },
      { name: 'Backup-Einstellungen', href: '/admin/settings/backup' },
      { name: 'System-Updates', href: '/admin/settings/updates' },
    ],
  },
];

export default function AdminSidebar({
  isCollapsed,
  onToggleCollapse,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev =>
      prev.includes(itemName)
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const isItemExpanded = (itemName: string) => expandedItems.includes(itemName);
  const isActive = (href: string) => pathname === href;
  const isSubmenuActive = (submenu: any[]) =>
    submenu?.some(item => pathname === item.href);

  return (
    <div
      className={`relative h-screen transition-all duration-500 ease-in-out ${isCollapsed ? 'w-20' : 'w-72'}`}
    >
      {/* Glassmorphism Background */}
      <div className='absolute inset-0 bg-gradient-to-br from-dunkelgrau via-hauptblau to-dunkelgrau backdrop-blur-xl'></div>

      {/* Animated Background Elements */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute -top-40 -right-40 w-80 h-80 bg-akzentblau rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse'></div>
        <div className='absolute -bottom-40 -left-40 w-80 h-80 bg-gelb rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000'></div>
        <div className='absolute top-40 left-40 w-80 h-80 bg-orange rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000'></div>
      </div>

      {/* Content */}
      <div className='relative z-10 h-full flex flex-col'>
        {/* Logo Section */}
        <div className='p-6 border-b border-weiss/10'>
          <div className='flex items-center justify-between'>
            {!isCollapsed && (
              <div className='flex items-center space-x-3'>
                <div className='relative'>
                  <div className='w-10 h-10 bg-gradient-to-r from-hauptblau to-akzentblau rounded-xl flex items-center justify-center shadow-lg'>
                    <span className='text-weiss font-bold text-lg'>L</span>
                  </div>
                  <div className='absolute -inset-1 bg-gradient-to-r from-hauptblau to-akzentblau rounded-xl blur opacity-25 animate-pulse'></div>
                </div>
                <div>
                  <h2 className='text-xl font-bold bg-gradient-to-r from-weiss to-hellgrau bg-clip-text text-transparent'>
                    Lopez IT Welt
                  </h2>
                  <p className='text-xs text-hellgrau font-medium'>Admin</p>
                </div>
              </div>
            )}
            <button
              onClick={onToggleCollapse}
              className='p-2 rounded-xl bg-weiss/10 backdrop-blur-sm border border-weiss/20 hover:bg-weiss/20 transition-all duration-300 hover:scale-110'
            >
              <svg
                className='w-4 h-4 text-weiss'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M4 6h16M4 12h16M4 18h16'
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className='flex-1 p-4 space-y-2 overflow-y-auto'>
          {navigation.map(item => {
            const hasSubmenu = item.submenu && item.submenu.length > 0;
            const isExpanded = isItemExpanded(item.name);
            const isActiveItem =
              isActive(item.href) || isSubmenuActive(item.submenu || []);

            return (
              <div key={item.name} className='relative'>
                <Link
                  href={item.href}
                  className={`group relative flex items-center p-3 rounded-xl transition-all duration-300 ${
                    isActiveItem
                      ? 'bg-gradient-to-r from-weiss/20 to-weiss/10 backdrop-blur-sm border border-weiss/20 shadow-lg'
                      : 'hover:bg-weiss/10 backdrop-blur-sm border border-transparent hover:border-weiss/20'
                  }`}
                  title={isCollapsed ? item.description : undefined}
                  onClick={
                    hasSubmenu
                      ? e => {
                          e.preventDefault();
                          toggleExpanded(item.name);
                        }
                      : undefined
                  }
                >
                  {/* Active Indicator */}
                  {isActiveItem && (
                    <div className='absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-hauptblau to-akzentblau rounded-r-full'></div>
                  )}

                  {/* Icon */}
                  <div
                    className={`relative p-2 rounded-lg transition-all duration-300 ${
                      isActiveItem
                        ? 'bg-gradient-to-r ' + item.gradient + ' shadow-lg'
                        : 'bg-weiss/10 group-hover:bg-weiss/20'
                    }`}
                  >
                    <svg
                      className={`w-5 h-5 ${isCollapsed ? 'mx-auto' : 'mr-3'} transition-all duration-300 ${
                        isActiveItem
                          ? 'text-weiss'
                          : 'text-hellgrau group-hover:text-weiss'
                      }`}
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d={item.icon}
                      />
                    </svg>
                    {isActiveItem && (
                      <div className='absolute -inset-1 bg-gradient-to-r from-hauptblau to-akzentblau rounded-lg blur opacity-25 animate-pulse'></div>
                    )}
                  </div>

                  {!isCollapsed && (
                    <div className='flex-1 flex items-center justify-between'>
                      <div>
                        <span
                          className={`text-sm font-medium transition-all duration-300 ${
                            isActiveItem
                              ? 'text-weiss'
                              : 'text-hellgrau group-hover:text-weiss'
                          }`}
                        >
                          {item.name}
                        </span>
                        <p className='text-xs text-hellgrau group-hover:text-hellgrau transition-colors'>
                          {item.description}
                        </p>
                      </div>
                      {hasSubmenu && (
                        <svg
                          className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''} ${
                            isActiveItem ? 'text-weiss' : 'text-hellgrau'
                          }`}
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M19 9l-7 7-7-7'
                          />
                        </svg>
                      )}
                    </div>
                  )}
                </Link>

                {/* Submenu */}
                {hasSubmenu && !isCollapsed && isExpanded && (
                  <div className='ml-6 mt-2 space-y-1'>
                    {item.submenu.map(subItem => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className={`block px-3 py-2 rounded-lg transition-all duration-300 text-sm ${
                          isActive(subItem.href)
                            ? 'bg-gradient-to-r from-weiss/20 to-weiss/10 text-weiss backdrop-blur-sm'
                            : 'text-hellgrau hover:bg-weiss/10 hover:text-weiss backdrop-blur-sm'
                        }`}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        {!isCollapsed && (
          <div className='p-4 border-t border-weiss/10'>
            <div className='flex items-center space-x-3 p-3 rounded-xl bg-weiss/10 backdrop-blur-sm border border-weiss/20'>
              <div className='relative'>
                <div className='w-2 h-2 bg-gruen rounded-full animate-pulse'></div>
                <div className='absolute -inset-1 bg-gruen rounded-full blur opacity-25 animate-pulse'></div>
              </div>
              <div>
                <span className='text-xs font-medium text-weiss'>
                  System Online
                </span>
                <p className='text-xs text-hellgrau'>Alle Dienste verfügbar</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
