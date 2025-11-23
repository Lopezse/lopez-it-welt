'use client';

import { useState } from 'react';

interface AdminTopbarProps {
  onToggleSidebar: () => void;
}

export default function AdminTopbar({ onToggleSidebar }: AdminTopbarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications] = useState([
    { id: 1, message: 'Neue Zeiterfassung verfügbar', type: 'info' },
    { id: 2, message: 'System-Update erforderlich', type: 'warning' },
  ]);

  return (
    <header className='backdrop-blur-xl bg-weiss/10 border-b border-weiss/20 px-6 py-4 shadow-2xl'>
      <div className='flex items-center justify-between'>
        {/* Left side - Menu button and search */}
        <div className='flex items-center space-x-4'>
          {/* Menu button */}
          <button
            onClick={onToggleSidebar}
            className='p-2 rounded-xl bg-weiss/10 backdrop-blur-sm border border-weiss/20 hover:bg-weiss/20 transition-all duration-300 hover:scale-110'
            title='Menü umschalten'
          >
            <svg
              className='w-5 h-5 text-weiss'
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

          {/* Search */}
          <div className='relative'>
            <svg
              className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-hellgrau'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
              />
            </svg>
            <input
              type='text'
              placeholder='Suchen...'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className='pl-10 pr-4 py-2 bg-weiss/10 backdrop-blur-sm border border-weiss/20 rounded-xl focus:ring-2 focus:ring-hauptblau focus:border-transparent w-64 text-weiss placeholder-hellgrau'
            />
          </div>
        </div>

        {/* Right side - Notifications, language, user */}
        <div className='flex items-center space-x-4'>
          {/* Language selector */}
          <div className='relative'>
            <select className='appearance-none bg-weiss/10 backdrop-blur-sm border border-weiss/20 rounded-xl px-3 py-2 pr-8 focus:ring-2 focus:ring-hauptblau focus:border-transparent text-weiss'>
              <option value='de' className='bg-dunkelgrau'>
                🇩🇪 DE
              </option>
              <option value='en' className='bg-dunkelgrau'>
                🇬🇧 EN
              </option>
              <option value='es' className='bg-dunkelgrau'>
                🇪🇸 ES
              </option>
            </select>
            <svg
              className='absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-hellgrau'
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
          </div>

          {/* Notifications */}
          <div className='relative'>
            <button className='p-2 rounded-xl bg-weiss/10 backdrop-blur-sm border border-weiss/20 hover:bg-weiss/20 transition-all duration-300 hover:scale-110 relative'>
              <svg
                className='w-5 h-5 text-weiss'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M15 17h5l-5 5v-5zM10.5 3.75a6 6 0 00-6 6v3.75a6 6 0 006 6h7.5a6 6 0 006-6v-3.75a6 6 0 00-6-6h-7.5z'
                />
              </svg>
              {notifications.length > 0 && (
                <span className='absolute -top-1 -right-1 bg-rot text-weiss text-xs rounded-full w-5 h-5 flex items-center justify-center'>
                  {notifications.length}
                </span>
              )}
            </button>
          </div>

          {/* User menu */}
          <div className='relative'>
            <button className='flex items-center space-x-2 p-2 rounded-xl bg-weiss/10 backdrop-blur-sm border border-weiss/20 hover:bg-weiss/20 transition-all duration-300'>
              <svg
                className='w-8 h-8 text-weiss'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                />
              </svg>
              <div className='hidden md:block text-left'>
                <p className='text-sm font-medium text-weiss'>Admin</p>
                <p className='text-xs text-hellgrau'>Administrator</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
