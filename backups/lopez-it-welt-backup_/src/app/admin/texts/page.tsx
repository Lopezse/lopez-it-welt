'use client';

import { useEffect, useState } from 'react';

interface Text {
  id: number;
  modul: string;
  feld: string;
  sprache: string;
  inhalt: string;
}

export default function TextsPage() {
  const [texts, setTexts] = useState<Text[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<Text | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newText, setNewText] = useState<Partial<Text>>({
    modul: '',
    feld: '',
    sprache: 'de',
    inhalt: '',
  });
  const [filter, setFilter] = useState({
    modul: '',
    sprache: 'de',
  });

  // Texte aus der Datenbank laden
  const loadTexts = async () => {
    try {
      const response = await fetch('/api/admin/texts');
      if (response.ok) {
        const data = await response.json();
        setTexts(data);
      }
    } catch (error) {
      console.error('Fehler beim Laden der Texte:', error);
    } finally {
      setLoading(false);
    }
  };

  // Text speichern
  const saveText = async (text: Text) => {
    try {
      const response = await fetch('/api/admin/texts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(text),
      });

      if (response.ok) {
        setEditingText(null);
        loadTexts(); // Texte neu laden
      }
    } catch (error) {
      console.error('Fehler beim Speichern:', error);
    }
  };

  // Neuen Text hinzufügen
  const addText = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/texts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newText),
      });

      if (response.ok) {
        setNewText({ modul: '', feld: '', sprache: 'de', inhalt: '' });
        setShowAddForm(false);
        loadTexts(); // Texte neu laden
      }
    } catch (error) {
      console.error('Fehler beim Hinzufügen:', error);
    }
  };

  // Text löschen
  const deleteText = async (id: number) => {
    if (!confirm('Text wirklich löschen?')) return;

    try {
      const response = await fetch(`/api/admin/texts?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        loadTexts(); // Texte neu laden
      }
    } catch (error) {
      console.error('Fehler beim Löschen:', error);
    }
  };

  useEffect(() => {
    loadTexts();
  }, []);

  // Gefilterte Texte
  const filteredTexts = texts.filter(
    text =>
      (!filter.modul || text.modul.includes(filter.modul)) &&
      (!filter.sprache || text.sprache === filter.sprache)
  );

  // Module für Filter
  const modules = Array.from(new Set(texts.map(text => text.modul)));

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Lade Texte...</p>
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
                Textverwaltung
              </h1>
              <p className='text-gray-600'>
                Alle Website-Texte verwalten und bearbeiten
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
            >
              Neuen Text hinzufügen
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
              className='inline-flex items-center px-1 pt-1 border-b-2 border-blue-500 text-sm font-medium text-gray-900'
            >
              Texte
            </a>
            <a
              href='/admin/users'
              className='inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700'
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
        {/* Add Text Form */}
        {showAddForm && (
          <div className='mb-8 bg-white p-6 rounded-lg shadow'>
            <h2 className='text-xl font-semibold text-gray-900 mb-4'>
              Neuen Text hinzufügen
            </h2>
            <form onSubmit={addText} className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Modul
                  </label>
                  <input
                    type='text'
                    required
                    value={newText.modul}
                    onChange={e =>
                      setNewText({ ...newText, modul: e.target.value })
                    }
                    placeholder='z.B. home, leistungen, kontakt'
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Feld
                  </label>
                  <input
                    type='text'
                    required
                    value={newText.feld}
                    onChange={e =>
                      setNewText({ ...newText, feld: e.target.value })
                    }
                    placeholder='z.B. title, subtitle, welcome'
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Sprache
                  </label>
                  <select
                    value={newText.sprache}
                    onChange={e =>
                      setNewText({ ...newText, sprache: e.target.value })
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  >
                    <option value='de'>Deutsch</option>
                    <option value='en'>English</option>
                    <option value='es'>Español</option>
                  </select>
                </div>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Inhalt
                </label>
                <textarea
                  required
                  value={newText.inhalt}
                  onChange={e =>
                    setNewText({ ...newText, inhalt: e.target.value })
                  }
                  rows={4}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>
              <div className='flex space-x-4'>
                <button
                  type='submit'
                  className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
                >
                  Text hinzufügen
                </button>
                <button
                  type='button'
                  onClick={() => setShowAddForm(false)}
                  className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50'
                >
                  Abbrechen
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filter */}
        <div className='mb-6 bg-white p-4 rounded-lg shadow'>
          <h3 className='text-lg font-medium text-gray-900 mb-4'>Filter</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Modul
              </label>
              <select
                value={filter.modul}
                onChange={e => setFilter({ ...filter, modul: e.target.value })}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              >
                <option value=''>Alle Module</option>
                {modules.map(module => (
                  <option key={module} value={module}>
                    {module}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Sprache
              </label>
              <select
                value={filter.sprache}
                onChange={e =>
                  setFilter({ ...filter, sprache: e.target.value })
                }
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              >
                <option value=''>Alle Sprachen</option>
                <option value='de'>Deutsch</option>
                <option value='en'>English</option>
                <option value='es'>Español</option>
              </select>
            </div>
          </div>
        </div>

        {/* Texts Table */}
        <div className='bg-white rounded-lg shadow overflow-hidden'>
          <div className='px-6 py-4 border-b border-gray-200'>
            <h2 className='text-lg font-medium text-gray-900'>
              Texte ({filteredTexts.length} von {texts.length})
            </h2>
          </div>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Modul
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Feld
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Sprache
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Inhalt
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Aktionen
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {filteredTexts.map(text => (
                  <tr key={text.id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                      {text.modul}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                      {text.feld}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          text.sprache === 'de'
                            ? 'bg-blue-100 text-blue-800'
                            : text.sprache === 'en'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {text.sprache.toUpperCase()}
                      </span>
                    </td>
                    <td className='px-6 py-4 text-sm text-gray-900'>
                      {editingText?.id === text.id ? (
                        <textarea
                          value={editingText.inhalt}
                          onChange={e =>
                            setEditingText({
                              ...editingText,
                              inhalt: e.target.value,
                            })
                          }
                          rows={3}
                          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                      ) : (
                        <div className='max-w-xs truncate' title={text.inhalt}>
                          {text.inhalt}
                        </div>
                      )}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                      {editingText?.id === text.id ? (
                        <div className='flex space-x-2'>
                          <button
                            onClick={() => saveText(editingText)}
                            className='px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700'
                          >
                            Speichern
                          </button>
                          <button
                            onClick={() => setEditingText(null)}
                            className='px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50'
                          >
                            Abbrechen
                          </button>
                        </div>
                      ) : (
                        <div className='flex space-x-2'>
                          <button
                            onClick={() => setEditingText(text)}
                            className='px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50'
                          >
                            Bearbeiten
                          </button>
                          <button
                            onClick={() => deleteText(text.id)}
                            className='px-3 py-1 border border-gray-300 text-red-600 rounded text-sm hover:bg-gray-50 hover:text-red-800'
                          >
                            Löschen
                          </button>
                        </div>
                      )}
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
