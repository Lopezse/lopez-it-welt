#!/usr/bin/env node

/**
 * Time-Tracking System Reparatur-Skript
 * Behebt kritische Fehler im Time-Tracking-System
 */

const fs = require('fs').promises;
const path = require('path');

// Datei-Pfade
const SESSIONS_FILE = path.join(process.cwd(), 'data', 'time-sessions.json');
const KI_SESSIONS_FILE = path.join(process.cwd(), 'data', 'ki-sessions.json');

async function repairTimeTracking() {
  console.log('🔧 Time-Tracking System Reparatur gestartet...\n');

  try {
    // 1. Sessions-Datei bereinigen
    console.log('1️⃣ Sessions-Datei bereinigen...');
    await cleanupSessionsFile();

    // 2. KI-Sessions-Datei bereinigen
    console.log('2️⃣ KI-Sessions-Datei bereinigen...');
    await cleanupKISessionsFile();

    // 3. Test-Sessions erstellen
    console.log('3️⃣ Test-Sessions erstellen...');
    await createTestSessions();

    console.log('\n✅ Time-Tracking System erfolgreich repariert!');
    console.log('📊 Status:');
    console.log('   - Sessions-Datei: Bereinigt');
    console.log('   - KI-Sessions-Datei: Bereinigt');
    console.log('   - Test-Sessions: Erstellt');
    console.log('\n🚀 Server kann jetzt neu gestartet werden!');
  } catch (error) {
    console.error('❌ Fehler bei der Reparatur:', error);
    process.exit(1);
  }
}

async function cleanupSessionsFile() {
  try {
    // Prüfen ob Datei existiert
    try {
      await fs.access(SESSIONS_FILE);
    } catch {
      console.log('   - Sessions-Datei existiert nicht, wird erstellt...');
      await fs.mkdir(path.dirname(SESSIONS_FILE), { recursive: true });
      await fs.writeFile(SESSIONS_FILE, JSON.stringify([], null, 2));
      return;
    }

    // Datei lesen und bereinigen
    const data = await fs.readFile(SESSIONS_FILE, 'utf-8');
    let sessions = JSON.parse(data);

    // Doppelte Sessions entfernen
    const uniqueSessions = [];
    const seenIds = new Set();

    for (const session of sessions) {
      if (!seenIds.has(session.id)) {
        seenIds.add(session.id);
        uniqueSessions.push(session);
      }
    }

    // Aktive Sessions beenden
    const cleanedSessions = uniqueSessions.map(session => {
      if (session.status === 'active') {
        return {
          ...session,
          status: 'completed',
          end_time: session.end_time || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      }
      return session;
    });

    // Speichern
    await fs.writeFile(SESSIONS_FILE, JSON.stringify(cleanedSessions, null, 2));
    console.log(`   - ${cleanedSessions.length} Sessions bereinigt`);
  } catch (error) {
    console.error('   ❌ Fehler beim Bereinigen der Sessions:', error);
    throw error;
  }
}

async function cleanupKISessionsFile() {
  try {
    // Prüfen ob Datei existiert
    try {
      await fs.access(KI_SESSIONS_FILE);
    } catch {
      console.log('   - KI-Sessions-Datei existiert nicht, wird erstellt...');
      await fs.mkdir(path.dirname(KI_SESSIONS_FILE), { recursive: true });
      await fs.writeFile(KI_SESSIONS_FILE, JSON.stringify([], null, 2));
      return;
    }

    // Datei lesen und bereinigen
    const data = await fs.readFile(KI_SESSIONS_FILE, 'utf-8');
    let kiSessions = JSON.parse(data);

    // Doppelte Sessions entfernen
    const uniqueKISessions = [];
    const seenIds = new Set();

    for (const session of kiSessions) {
      if (!seenIds.has(session.id)) {
        seenIds.add(session.id);
        uniqueKISessions.push(session);
      }
    }

    // Speichern
    await fs.writeFile(
      KI_SESSIONS_FILE,
      JSON.stringify(uniqueKISessions, null, 2)
    );
    console.log(`   - ${uniqueKISessions.length} KI-Sessions bereinigt`);
  } catch (error) {
    console.error('   ❌ Fehler beim Bereinigen der KI-Sessions:', error);
    throw error;
  }
}

async function createTestSessions() {
  try {
    // Test-Sessions erstellen
    const testSessions = [
      {
        id: 1,
        user_id: 1,
        module: 'Admin-Dashboard',
        start_time: new Date(Date.now() - 3600000).toISOString(), // 1 Stunde zurück
        end_time: new Date().toISOString(),
        duration_minutes: 60,
        taetigkeit: 'Dashboard-Test und System-Überprüfung',
        status: 'completed',
        problem: 'Time-Tracking-System hatte Fehler',
        ausloeser: 'Automatische Reparatur nach System-Fehlern',
        category: 'administration',
        priority: 'high',
        created_at: new Date(Date.now() - 3600000).toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 2,
        user_id: 1,
        module: 'Time-Tracking-Page-Component',
        start_time: new Date().toISOString(),
        end_time: null,
        duration_minutes: null,
        taetigkeit: 'Zeiterfassung-Bereich laden und Sessions verwalten',
        status: 'active',
        problem: 'Manuelle Zeiterfassung ist ineffizient',
        ausloeser: 'Automatische Zeiterfassung beim Laden der Admin-Seite',
        category: 'administration',
        priority: 'high',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    // Test-Sessions speichern
    await fs.writeFile(SESSIONS_FILE, JSON.stringify(testSessions, null, 2));
    console.log(`   - ${testSessions.length} Test-Sessions erstellt`);
  } catch (error) {
    console.error('   ❌ Fehler beim Erstellen der Test-Sessions:', error);
    throw error;
  }
}

// Skript ausführen
if (require.main === module) {
  repairTimeTracking();
}

module.exports = { repairTimeTracking };
