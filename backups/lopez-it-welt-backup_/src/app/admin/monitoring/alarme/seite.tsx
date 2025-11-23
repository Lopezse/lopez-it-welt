'use client';

import { useEffect, useState } from 'react';

interface Alarm {
  id: string;
  typ: 'system' | 'sicherheit' | 'leistung' | 'backup' | 'netzwerk';
  schweregrad: 'info' | 'warnung' | 'fehler' | 'kritisch';
  titel: string;
  beschreibung: string;
  zeitstempel: string;
  status: 'aktiv' | 'bestätigt' | 'gelöst';
  quelle: string;
  prioritaet: number;
}

interface AlarmStatistiken {
  gesamt: number;
  aktiv: number;
  bestaetigt: number;
  geloest: number;
  kritisch: number;
  hoch: number;
  mittel: number;
  niedrig: number;
}

export default function AlarmSeite() {
  const [alarme, setAlarme] = useState<Alarm[]>([]);
  const [statistiken, setStatistiken] = useState<AlarmStatistiken>({
    gesamt: 0,
    aktiv: 0,
    bestaetigt: 0,
    geloest: 0,
    kritisch: 0,
    hoch: 0,
    mittel: 0,
    niedrig: 0,
  });
  const [ladezustand, setLadezustand] = useState(true);
  const [filter, setFilter] = useState<
    'alle' | 'aktiv' | 'kritisch' | 'nicht_bestaetigt'
  >('alle');

  useEffect(() => {
    // Mock-Daten für Alarme
    const mockAlarme: Alarm[] = [
      {
        id: '1',
        typ: 'sicherheit',
        schweregrad: 'kritisch',
        titel: 'Kritischer Sicherheitsvorfall',
        beschreibung:
          'Mehrere fehlgeschlagene Login-Versuche von verdächtiger IP-Adresse erkannt',
        zeitstempel: '2025-01-27 15:30:22',
        status: 'aktiv',
        quelle: 'Firewall-System',
        prioritaet: 1,
      },
      {
        id: '2',
        typ: 'leistung',
        schweregrad: 'fehler',
        titel: 'Hohe CPU-Auslastung',
        beschreibung: 'CPU-Auslastung auf Server "web-01" übersteigt 90%',
        zeitstempel: '2025-01-27 15:25:15',
        status: 'bestätigt',
        quelle: 'Performance-Monitor',
        prioritaet: 2,
      },
      {
        id: '3',
        typ: 'system',
        schweregrad: 'warnung',
        titel: 'Festplattenspeicher wird knapp',
        beschreibung: 'Nur noch 15% freier Speicherplatz auf /var/log',
        zeitstempel: '2025-01-27 15:20:08',
        status: 'aktiv',
        quelle: 'System-Monitor',
        prioritaet: 3,
      },
      {
        id: '4',
        typ: 'backup',
        schweregrad: 'fehler',
        titel: 'Backup-Fehler',
        beschreibung: 'Tägliches Backup konnte nicht abgeschlossen werden',
        zeitstempel: '2025-01-27 15:15:45',
        status: 'aktiv',
        quelle: 'Backup-System',
        prioritaet: 2,
      },
      {
        id: '5',
        typ: 'netzwerk',
        schweregrad: 'warnung',
        titel: 'Netzwerk-Latenz erhöht',
        beschreibung: 'Durchschnittliche Antwortzeit über 200ms',
        zeitstempel: '2025-01-27 15:10:30',
        status: 'gelöst',
        quelle: 'Network-Monitor',
        prioritaet: 3,
      },
      {
        id: '6',
        typ: 'sicherheit',
        schweregrad: 'info',
        titel: 'Neue Firewall-Regel hinzugefügt',
        beschreibung: 'Automatische Blockierung von verdächtigem Traffic',
        zeitstempel: '2025-01-27 15:05:12',
        status: 'gelöst',
        quelle: 'Security-System',
        prioritaet: 4,
      },
    ];

    const mockStatistiken: AlarmStatistiken = {
      gesamt: mockAlarme.length,
      aktiv: mockAlarme.filter(a => a.status === 'aktiv').length,
      bestaetigt: mockAlarme.filter(a => a.status === 'bestätigt').length,
      geloest: mockAlarme.filter(a => a.status === 'gelöst').length,
      kritisch: mockAlarme.filter(a => a.schweregrad === 'kritisch').length,
      hoch: mockAlarme.filter(a => a.schweregrad === 'fehler').length,
      mittel: mockAlarme.filter(a => a.schweregrad === 'warnung').length,
      niedrig: mockAlarme.filter(a => a.schweregrad === 'info').length,
    };

    setAlarme(mockAlarme);
    setStatistiken(mockStatistiken);
    setLadezustand(false);
  }, []);

  const getSchweregradFarbe = (schweregrad: string) => {
    switch (schweregrad) {
      case 'kritisch':
        return 'text-rot';
      case 'fehler':
        return 'text-orange';
      case 'warnung':
        return 'text-gelb';
      case 'info':
        return 'text-akzentblau';
      default:
        return 'text-hellgrau';
    }
  };

  const getSchweregradHintergrund = (schweregrad: string) => {
    switch (schweregrad) {
      case 'kritisch':
        return 'bg-rot/20 border-rot/30';
      case 'fehler':
        return 'bg-orange/20 border-orange/30';
      case 'warnung':
        return 'bg-gelb/20 border-gelb/30';
      case 'info':
        return 'bg-akzentblau/20 border-akzentblau/30';
      default:
        return 'bg-hellgrau/20 border-hellgrau/30';
    }
  };

  const getTypIcon = (typ: string) => {
    switch (typ) {
      case 'sicherheit':
        return '🛡️';
      case 'leistung':
        return '⚡';
      case 'system':
        return '🖥️';
      case 'backup':
        return '💾';
      case 'netzwerk':
        return '🌐';
      default:
        return '⚠️';
    }
  };

  const getStatusFarbe = (status: string) => {
    switch (status) {
      case 'aktiv':
        return 'text-rot';
      case 'bestätigt':
        return 'text-gelb';
      case 'gelöst':
        return 'text-gruen';
      default:
        return 'text-hellgrau';
    }
  };

  const gefilterteAlarme = alarme.filter(alarm => {
    switch (filter) {
      case 'aktiv':
        return alarm.status === 'aktiv';
      case 'kritisch':
        return alarm.schweregrad === 'kritisch';
      case 'nicht_bestaetigt':
        return alarm.status !== 'bestätigt';
      default:
        return true;
    }
  });

  const alarmBestaetigen = (id: string) => {
    setAlarme(prev =>
      prev.map(alarm =>
        alarm.id === id ? { ...alarm, status: 'bestätigt' as const } : alarm
      )
    );
  };

  const alarmLoesen = (id: string) => {
    setAlarme(prev =>
      prev.map(alarm =>
        alarm.id === id ? { ...alarm, status: 'gelöst' as const } : alarm
      )
    );
  };

  if (ladezustand) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-dunkelgrau via-hauptblau to-dunkelgrau flex items-center justify-center'>
        <div className='relative'>
          <div className='w-16 h-16 border-4 border-hauptblau border-t-transparent rounded-full animate-spin'></div>
          <div className='absolute -inset-1 bg-hauptblau rounded-full blur opacity-25 animate-pulse'></div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-dunkelgrau via-hauptblau to-dunkelgrau p-6'>
      {/* Animated Background */}
      <div className='fixed inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute -top-40 -right-40 w-80 h-80 bg-akzentblau rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse'></div>
        <div className='absolute -bottom-40 -left-40 w-80 h-80 bg-gelb rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000'></div>
        <div className='absolute top-40 left-40 w-80 h-80 bg-orange rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000'></div>
      </div>

      <div className='relative z-10 space-y-6'>
        {/* Header */}
        <div className='backdrop-blur-xl bg-weiss/10 rounded-2xl border border-weiss/20 p-8 shadow-2xl'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-4xl font-bold bg-gradient-to-r from-weiss to-hellgrau bg-clip-text text-transparent mb-2'>
                Alarme & Warnungen
              </h1>
              <p className='text-hellgrau text-lg'>
                System-Alarme und Benachrichtigungen verwalten
              </p>
            </div>
            <div className='text-right'>
              <div className='backdrop-blur-sm bg-weiss/10 rounded-xl p-4 border border-weiss/20'>
                <p className='text-sm text-hellgrau mb-1'>Aktive Alarme</p>
                <p className='text-2xl font-bold text-rot'>
                  {statistiken.aktiv}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Alarm Statistics */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
          <div className='backdrop-blur-xl bg-weiss/10 rounded-2xl border border-weiss/20 p-6 shadow-2xl text-center'>
            <div className='text-3xl font-bold text-rot mb-2'>
              {statistiken.kritisch}
            </div>
            <div className='text-sm text-hellgrau'>Kritisch</div>
          </div>
          <div className='backdrop-blur-xl bg-weiss/10 rounded-2xl border border-weiss/20 p-6 shadow-2xl text-center'>
            <div className='text-3xl font-bold text-orange mb-2'>
              {statistiken.hoch}
            </div>
            <div className='text-sm text-hellgrau'>Hoch</div>
          </div>
          <div className='backdrop-blur-xl bg-weiss/10 rounded-2xl border border-weiss/20 p-6 shadow-2xl text-center'>
            <div className='text-3xl font-bold text-gelb mb-2'>
              {statistiken.mittel}
            </div>
            <div className='text-sm text-hellgrau'>Mittel</div>
          </div>
          <div className='backdrop-blur-xl bg-weiss/10 rounded-2xl border border-weiss/20 p-6 shadow-2xl text-center'>
            <div className='text-3xl font-bold text-akzentblau mb-2'>
              {statistiken.niedrig}
            </div>
            <div className='text-sm text-hellgrau'>Niedrig</div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className='backdrop-blur-xl bg-weiss/10 rounded-2xl border border-weiss/20 p-6 shadow-2xl'>
          <div className='flex items-center justify-between'>
            <h2 className='text-xl font-bold text-weiss'>Alarm-Filter</h2>
            <div className='flex space-x-2'>
              {[
                { key: 'alle', label: 'Alle', count: statistiken.gesamt },
                { key: 'aktiv', label: 'Aktiv', count: statistiken.aktiv },
                {
                  key: 'kritisch',
                  label: 'Kritisch',
                  count: statistiken.kritisch,
                },
                {
                  key: 'nicht_bestaetigt',
                  label: 'Nicht bestätigt',
                  count: statistiken.aktiv + statistiken.bestaetigt,
                },
              ].map(filterOption => (
                <button
                  key={filterOption.key}
                  onClick={() =>
                    setFilter(
                      filterOption.key as
                        | 'alle'
                        | 'aktiv'
                        | 'kritisch'
                        | 'nicht_bestaetigt'
                    )
                  }
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    filter === filterOption.key
                      ? 'bg-akzentblau text-weiss shadow-lg'
                      : 'bg-weiss/10 text-hellgrau hover:bg-weiss/20'
                  }`}
                >
                  {filterOption.label} ({filterOption.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Alerts List */}
        <div className='backdrop-blur-xl bg-weiss/10 rounded-2xl border border-weiss/20 p-8 shadow-2xl'>
          <h2 className='text-2xl font-bold text-weiss mb-6'>Alarm-Liste</h2>
          <div className='space-y-4'>
            {gefilterteAlarme.length === 0 ? (
              <div className='text-center py-12'>
                <div className='text-6xl mb-4'>✅</div>
                <p className='text-xl text-hellgrau'>Keine Alarme gefunden</p>
              </div>
            ) : (
              gefilterteAlarme.map(alarm => (
                <div
                  key={alarm.id}
                  className='backdrop-blur-sm bg-weiss/5 rounded-xl border border-weiss/10 p-6 hover:bg-weiss/10 transition-all duration-300'
                >
                  <div className='flex items-start justify-between'>
                    <div className='flex items-start space-x-4 flex-1'>
                      <span className='text-3xl'>{getTypIcon(alarm.typ)}</span>
                      <div className='flex-1'>
                        <div className='flex items-center space-x-3 mb-2'>
                          <h3 className='text-lg font-semibold text-weiss'>
                            {alarm.titel}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getSchweregradHintergrund(alarm.schweregrad)} ${getSchweregradFarbe(alarm.schweregrad)}`}
                          >
                            {alarm.schweregrad.toUpperCase()}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusFarbe(alarm.status)}`}
                          >
                            {alarm.status === 'aktiv'
                              ? 'Aktiv'
                              : alarm.status === 'bestätigt'
                                ? 'Bestätigt'
                                : 'Gelöst'}
                          </span>
                        </div>
                        <p className='text-hellgrau mb-3'>
                          {alarm.beschreibung}
                        </p>
                        <div className='flex items-center space-x-6 text-sm text-hellgrau'>
                          <span>Quelle: {alarm.quelle}</span>
                          <span>Zeit: {alarm.zeitstempel}</span>
                          <span>Priorität: {alarm.prioritaet}</span>
                        </div>
                      </div>
                    </div>
                    <div className='flex space-x-2 ml-4'>
                      {alarm.status === 'aktiv' && (
                        <>
                          <button
                            onClick={() => alarmBestaetigen(alarm.id)}
                            className='px-4 py-2 bg-gelb text-dunkelgrau rounded-lg font-medium hover:bg-gelb/80 transition-colors'
                          >
                            Bestätigen
                          </button>
                          <button
                            onClick={() => alarmLoesen(alarm.id)}
                            className='px-4 py-2 bg-gruen text-weiss rounded-lg font-medium hover:bg-gruen/80 transition-colors'
                          >
                            Lösen
                          </button>
                        </>
                      )}
                      {alarm.status === 'bestätigt' && (
                        <button
                          onClick={() => alarmLoesen(alarm.id)}
                          className='px-4 py-2 bg-gruen text-weiss rounded-lg font-medium hover:bg-gruen/80 transition-colors'
                        >
                          Lösen
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Alert Settings */}
        <div className='backdrop-blur-xl bg-weiss/10 rounded-2xl border border-weiss/20 p-8 shadow-2xl'>
          <h2 className='text-2xl font-bold text-weiss mb-6'>
            Benachrichtigungseinstellungen
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='space-y-4'>
              <h3 className='text-lg font-bold text-weiss'>
                E-Mail-Benachrichtigungen
              </h3>
              <div className='space-y-3'>
                <label className='flex items-center space-x-3'>
                  <input
                    type='checkbox'
                    defaultChecked
                    className='rounded text-akzentblau'
                  />
                  <span className='text-hellgrau'>Kritische Alarme</span>
                </label>
                <label className='flex items-center space-x-3'>
                  <input
                    type='checkbox'
                    defaultChecked
                    className='rounded text-akzentblau'
                  />
                  <span className='text-hellgrau'>Hohe Priorität</span>
                </label>
                <label className='flex items-center space-x-3'>
                  <input type='checkbox' className='rounded text-akzentblau' />
                  <span className='text-hellgrau'>Mittlere Priorität</span>
                </label>
                <label className='flex items-center space-x-3'>
                  <input type='checkbox' className='rounded text-akzentblau' />
                  <span className='text-hellgrau'>Niedrige Priorität</span>
                </label>
              </div>
            </div>
            <div className='space-y-4'>
              <h3 className='text-lg font-bold text-weiss'>
                SMS-Benachrichtigungen
              </h3>
              <div className='space-y-3'>
                <label className='flex items-center space-x-3'>
                  <input
                    type='checkbox'
                    defaultChecked
                    className='rounded text-akzentblau'
                  />
                  <span className='text-hellgrau'>Nur kritische Alarme</span>
                </label>
                <label className='flex items-center space-x-3'>
                  <input type='checkbox' className='rounded text-akzentblau' />
                  <span className='text-hellgrau'>24/7 Benachrichtigungen</span>
                </label>
              </div>
              <div className='pt-4'>
                <button className='w-full bg-akzentblau text-weiss py-3 rounded-lg font-medium hover:bg-akzentblau/80 transition-colors'>
                  Einstellungen speichern
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
