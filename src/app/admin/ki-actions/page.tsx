'use client';
import { useEffect, useState } from 'react';
import { Card } from '../../../components/Features/Card';
import { KISession } from '../../../lib/ki-action-tracker';

export default function KIActionsPage() {
  const [sessions, setSessions] = useState<KISession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await fetch('/api/admin/ki-sessions');
      if (response.ok) {
        const sessionsData = await response.json();
        setSessions(sessionsData);
      }
    } catch (error) {
      console.error('Fehler beim Laden der KI-Sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Lade KI-Sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>
          🧠 KI-Aktionen & Automatische Zeiterfassung
        </h1>
        <p className='text-gray-600'>
          Intelligente Erfassung aller KI-gestützten Entwicklungsarbeiten
        </p>
      </div>

      <div className='space-y-4'>
        {sessions.map(session => (
          <Card key={session.session_id}>
            <div className='mb-3'>
              <h3 className='text-lg font-semibold text-gray-900'>
                {session.modul}
              </h3>
              <p className='text-sm text-gray-600'>{session.session_id}</p>
            </div>

            <div className='mb-3'>
              <p className='text-sm text-gray-700 mb-2'>
                <span className='font-medium'>Trigger:</span>{' '}
                {session.triggered_by}
              </p>
              <p className='text-sm text-gray-700 mb-2'>
                <span className='font-medium'>Zusammenfassung:</span>{' '}
                {session.summary}
              </p>
              <p className='text-sm text-gray-600'>
                <span className='font-medium'>Tools:</span> {session.tool_used}
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600'>
              <div>
                <span className='font-medium'>Start:</span>{' '}
                {formatDateTime(session.start_time)}
              </div>
              {session.end_time && (
                <div>
                  <span className='font-medium'>Ende:</span>{' '}
                  {formatDateTime(session.end_time)}
                </div>
              )}
              {session.duration_minutes && (
                <div>
                  <span className='font-medium'>Dauer:</span>{' '}
                  {session.duration_minutes} Min
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
