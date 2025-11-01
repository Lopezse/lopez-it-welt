'use client';

export function KISicherheit() {
  return (
    <section className='py-16 bg-gradient-to-br from-dunkelgrau via-hauptblau to-dunkelgrau'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='text-center mb-12'>
          <h2 className='text-4xl font-bold text-weiss mb-4'>
            KI-Sicherheit & Datenschutz
          </h2>
          <p className='text-xl text-hellgrau max-w-3xl mx-auto'>
            Sichere und DSGVO-konforme KI-Integration für Ihre Geschäftsprozesse
          </p>
        </div>

        {/* Features Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12'>
          {/* Datenschutz */}
          <div className='backdrop-blur-xl bg-weiss/10 rounded-2xl border border-weiss/20 p-8 text-center hover:bg-weiss/20 transition-all duration-300'>
            <div className='text-5xl mb-4'>🔒</div>
            <h3 className='text-xl font-bold text-weiss mb-4'>DSGVO-konform</h3>
            <p className='text-hellgrau mb-4'>
              Alle unsere KI-Lösungen sind vollständig DSGVO-konform und
              schützen Ihre Daten
            </p>
            <ul className='text-left space-y-2 text-sm text-hellgrau'>
              <li className='flex items-center'>
                <span className='text-gruen mr-2'>✓</span>
                Datenverschlüsselung
              </li>
              <li className='flex items-center'>
                <span className='text-gruen mr-2'>✓</span>
                Anonymisierung
              </li>
              <li className='flex items-center'>
                <span className='text-gruen mr-2'>✓</span>
                Recht auf Löschung
              </li>
            </ul>
          </div>

          {/* Sichere APIs */}
          <div className='backdrop-blur-xl bg-weiss/10 rounded-2xl border border-weiss/20 p-8 text-center hover:bg-weiss/20 transition-all duration-300'>
            <div className='text-5xl mb-4'>🛡️</div>
            <h3 className='text-xl font-bold text-weiss mb-4'>Sichere APIs</h3>
            <p className='text-hellgrau mb-4'>
              Enterprise-Sicherheitsstandards für alle API-Verbindungen und
              Datenübertragungen
            </p>
            <ul className='text-left space-y-2 text-sm text-hellgrau'>
              <li className='flex items-center'>
                <span className='text-gruen mr-2'>✓</span>
                HTTPS-Verschlüsselung
              </li>
              <li className='flex items-center'>
                <span className='text-gruen mr-2'>✓</span>
                API-Key-Authentifizierung
              </li>
              <li className='flex items-center'>
                <span className='text-gruen mr-2'>✓</span>
                Rate Limiting
              </li>
            </ul>
          </div>

          {/* Lokale Verarbeitung */}
          <div className='backdrop-blur-xl bg-weiss/10 rounded-2xl border border-weiss/20 p-8 text-center hover:bg-weiss/20 transition-all duration-300'>
            <div className='text-5xl mb-4'>🏠</div>
            <h3 className='text-xl font-bold text-weiss mb-4'>
              Lokale Verarbeitung
            </h3>
            <p className='text-hellgrau mb-4'>
              Sensible Daten werden lokal verarbeitet und verlassen niemals Ihr
              System
            </p>
            <ul className='text-left space-y-2 text-sm text-hellgrau'>
              <li className='flex items-center'>
                <span className='text-gruen mr-2'>✓</span>
                On-Premise Lösungen
              </li>
              <li className='flex items-center'>
                <span className='text-gruen mr-2'>✓</span>
                Datenhoheit
              </li>
              <li className='flex items-center'>
                <span className='text-gruen mr-2'>✓</span>
                Offline-Funktionalität
              </li>
            </ul>
          </div>

          {/* Audit-Trail */}
          <div className='backdrop-blur-xl bg-weiss/10 rounded-2xl border border-weiss/20 p-8 text-center hover:bg-weiss/20 transition-all duration-300'>
            <div className='text-5xl mb-4'>📋</div>
            <h3 className='text-xl font-bold text-weiss mb-4'>Audit-Trail</h3>
            <p className='text-hellgrau mb-4'>
              Vollständige Protokollierung aller KI-Interaktionen für Compliance
              und Sicherheit
            </p>
            <ul className='text-left space-y-2 text-sm text-hellgrau'>
              <li className='flex items-center'>
                <span className='text-gruen mr-2'>✓</span>
                Aktivitätsprotokoll
              </li>
              <li className='flex items-center'>
                <span className='text-gruen mr-2'>✓</span>
                Benutzer-Tracking
              </li>
              <li className='flex items-center'>
                <span className='text-gruen mr-2'>✓</span>
                Compliance-Reports
              </li>
            </ul>
          </div>

          {/* KI-Ethik */}
          <div className='backdrop-blur-xl bg-weiss/10 rounded-2xl border border-weiss/20 p-8 text-center hover:bg-weiss/20 transition-all duration-300'>
            <div className='text-5xl mb-4'>🤖</div>
            <h3 className='text-xl font-bold text-weiss mb-4'>KI-Ethik</h3>
            <p className='text-hellgrau mb-4'>
              Ethische KI-Entwicklung mit Transparenz, Fairness und
              Verantwortlichkeit
            </p>
            <ul className='text-left space-y-2 text-sm text-hellgrau'>
              <li className='flex items-center'>
                <span className='text-gruen mr-2'>✓</span>
                Bias-Erkennung
              </li>
              <li className='flex items-center'>
                <span className='text-gruen mr-2'>✓</span>
                Erklärbare KI
              </li>
              <li className='flex items-center'>
                <span className='text-gruen mr-2'>✓</span>
                Menschliche Aufsicht
              </li>
            </ul>
          </div>

          {/* Backup & Recovery */}
          <div className='backdrop-blur-xl bg-weiss/10 rounded-2xl border border-weiss/20 p-8 text-center hover:bg-weiss/20 transition-all duration-300'>
            <div className='text-5xl mb-4'>💾</div>
            <h3 className='text-xl font-bold text-weiss mb-4'>
              Backup & Recovery
            </h3>
            <p className='text-hellgrau mb-4'>
              Automatische Backups und Disaster Recovery für Ihre KI-Systeme
            </p>
            <ul className='text-left space-y-2 text-sm text-hellgrau'>
              <li className='flex items-center'>
                <span className='text-gruen mr-2'>✓</span>
                Tägliche Backups
              </li>
              <li className='flex items-center'>
                <span className='text-gruen mr-2'>✓</span>
                Verschlüsselte Speicherung
              </li>
              <li className='flex items-center'>
                <span className='text-gruen mr-2'>✓</span>
                Schnelle Wiederherstellung
              </li>
            </ul>
          </div>
        </div>

        {/* Security Badges */}
        <div className='text-center mb-12'>
          <div className='flex flex-wrap justify-center gap-6'>
            <div className='flex items-center space-x-2 bg-weiss/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-weiss/20'>
              <span className='text-gruen'>✓</span>
              <span className='text-weiss text-sm'>DSGVO-konform</span>
            </div>
            <div className='flex items-center space-x-2 bg-weiss/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-weiss/20'>
              <span className='text-gruen'>✓</span>
              <span className='text-weiss text-sm'>ISO 27001</span>
            </div>
            <div className='flex items-center space-x-2 bg-weiss/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-weiss/20'>
              <span className='text-gruen'>✓</span>
              <span className='text-weiss text-sm'>
                End-to-End Verschlüsselung
              </span>
            </div>
            <div className='flex items-center space-x-2 bg-weiss/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-weiss/20'>
              <span className='text-gruen'>✓</span>
              <span className='text-weiss text-sm'>Deutsche Server</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className='text-center'>
          <p className='text-hellgrau mb-4'>
            Sichere KI-Lösungen für Ihr Unternehmen
          </p>
          <button className='px-8 py-3 bg-akzentblau text-weiss rounded-lg hover:bg-akzentblau/80 transition-colors font-semibold'>
            Sicherheitsberatung anfordern
          </button>
        </div>
      </div>
    </section>
  );
}

export default KISicherheit;
