'use client';

import { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';

interface AdminLayoutClientProps {
  children: React.ReactNode;
}

export default function AdminLayoutClient({
  children,
}: AdminLayoutClientProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className='min-h-screen bg-gray-50 flex'>
      {/* Sidebar */}
      <AdminSidebar
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div className='flex-1 flex flex-col'>
        {/* Topbar */}
        <AdminTopbar
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Main Content */}
        <main className='flex-1 p-6 overflow-auto'>
          <div className='max-w-7xl mx-auto'>{children}</div>
        </main>
      </div>
    </div>
  );
}
