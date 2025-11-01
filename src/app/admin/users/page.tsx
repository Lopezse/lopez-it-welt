'use client';

import { useEffect, useState } from 'react';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'locked';
  created_at: string;
  last_login?: string;
}

interface Role {
  id: number;
  name: string;
  description: string;
  permissions: string[];
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState<Partial<User>>({
    username: '',
    email: '',
    role: 'user',
  });

  // TODO: Implement role management for future features
  // const [roles, setRoles] = useState(['admin', 'user', 'moderator']);

  // TODO: Implement user editing for future features
  // const [editingUser, setEditingUser] = useState<User | null>(null);

  // Benutzer laden
  const loadUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Fehler beim Laden der Benutzer:', error);
    } finally {
      setLoading(false);
    }
  };

  // Rollen laden
  const loadRoles = async () => {
    try {
      const response = await fetch('/api/admin/roles');
      if (response.ok) {
        const data = await response.json();
        // setRoles(data);
      }
    } catch (error) {
      console.error('Fehler beim Laden der Rollen:', error);
    }
  };

  // TODO: Implement user saving for future features
  // const saveUser = async (user: User) => {
  //   // Implementation for future feature
  // };

  // Neuen Benutzer hinzufügen
  const addUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        setNewUser({ username: '', email: '', role: 'user' });
        setShowAddForm(false);
        loadUsers();
      }
    } catch (error) {
      console.error('Fehler beim Hinzufügen:', error);
    }
  };

  // Benutzer löschen
  const deleteUser = async (id: number) => {
    if (!confirm('Benutzer wirklich löschen?')) return;

    try {
      const response = await fetch(`/api/admin/users?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        loadUsers();
      }
    } catch (error) {
      console.error('Fehler beim Löschen:', error);
    }
  };

  useEffect(() => {
    loadUsers();
    loadRoles();
  }, []);

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Lade Benutzer...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='bg-white shadow-sm border-b'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center py-6'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900'>
                Benutzerverwaltung
              </h1>
              <p className='text-gray-600'>
                Benutzer, Rollen und Berechtigungen verwalten
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
            >
              Neuen Benutzer hinzufügen
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className='bg-white shadow-sm border-b'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex space-x-8'>
            <a
              href='/admin'
              className='inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700'
            >
              Dashboard
            </a>
            <a
              href='/admin/texts'
              className='inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700'
            >
              Texte
            </a>
            <a
              href='/admin/users'
              className='inline-flex items-center px-1 pt-1 border-b-2 border-blue-500 text-sm font-medium text-gray-900'
            >
              Benutzer
            </a>
            <a
              href='/admin/customers'
              className='inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700'
            >
              Kunden
            </a>
            <a
              href='/admin/settings'
              className='inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700'
            >
              Einstellungen
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Add User Form */}
        {showAddForm && (
          <div className='mb-8 bg-white p-6 rounded-lg shadow'>
            <h2 className='text-xl font-semibold text-gray-900 mb-4'>
              Neuen Benutzer hinzufügen
            </h2>
            <form onSubmit={addUser} className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Benutzername
                  </label>
                  <input
                    type='text'
                    value={newUser.username}
                    onChange={e =>
                      setNewUser({ ...newUser, username: e.target.value })
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    E-Mail
                  </label>
                  <input
                    type='email'
                    value={newUser.email}
                    onChange={e =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Rolle
                  </label>
                  <select
                    value={newUser.role}
                    onChange={e =>
                      setNewUser({ ...newUser, role: e.target.value })
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  >
                    <option value='user'>Benutzer</option>
                    <option value='admin'>Administrator</option>
                    <option value='support'>Support</option>
                    <option value='technician'>Techniker</option>
                  </select>
                </div>
              </div>
              <div className='flex space-x-4'>
                <button
                  type='submit'
                  className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
                >
                  Benutzer hinzufügen
                </button>
                <button
                  type='button'
                  onClick={() => setShowAddForm(false)}
                  className='px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400'
                >
                  Abbrechen
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Users Table */}
        <div className='bg-white shadow rounded-lg'>
          <div className='px-6 py-4 border-b border-gray-200'>
            <h3 className='text-lg font-medium text-gray-900'>
              Benutzer ({users.length})
            </h3>
          </div>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Benutzer
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Rolle
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Status
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Erstellt
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Letzter Login
                  </th>
                  <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Aktionen
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {users.map(user => (
                  <tr key={user.id}>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <div className='flex-shrink-0 h-10 w-10'>
                          <div className='h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center'>
                            <span className='text-sm font-medium text-gray-700'>
                              {user.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className='ml-4'>
                          <div className='text-sm font-medium text-gray-900'>
                            {user.username}
                          </div>
                          <div className='text-sm text-gray-500'>
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span className='inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800'>
                        {user.role}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : user.status === 'inactive'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {new Date(user.created_at).toLocaleDateString('de-DE')}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {user.last_login
                        ? new Date(user.last_login).toLocaleDateString('de-DE')
                        : 'Nie'}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                      <button
                        // onClick={() => setEditingUser(user)}
                        className='text-blue-600 hover:text-blue-900 mr-4'
                      >
                        Bearbeiten
                      </button>
                      <button
                        onClick={() => deleteUser(user.id)}
                        className='text-red-600 hover:text-red-900'
                      >
                        Löschen
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
