// Server-seitige Time Tracking Service (nur für API-Routen)
import fs from 'fs';
import path from 'path';
import {
  CompleteSessionData,
  CreateSessionData,
  TimeSession,
} from './time-tracking-types';

// Datenbank-Datei-Pfade
const DATA_DIR = path.join(process.cwd(), 'data');
const SESSIONS_FILE = path.join(DATA_DIR, 'time-sessions.json');

// Hilfsfunktionen
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadSessions(): TimeSession[] {
  ensureDataDir();
  if (fs.existsSync(SESSIONS_FILE)) {
    try {
      const data = fs.readFileSync(SESSIONS_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Fehler beim Laden der Sessions:', error);
    }
  }
  return [];
}

function saveSessions(sessions: TimeSession[]) {
  ensureDataDir();
  try {
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions, null, 2));
  } catch (error) {
    console.error('Fehler beim Speichern der Sessions:', error);
  }
}

export class TimeTrackingServerService {
  static getSessions(): TimeSession[] {
    return loadSessions();
  }

  static getStats() {
    const sessions = loadSessions();
    const totalSessions = sessions.length;
    const activeSessions = sessions.filter(s => s.status === 'active').length;
    const totalTime = sessions.reduce(
      (sum, s) => sum + (s.duration_minutes || 0),
      0
    );
    const today = new Date().toDateString();
    const todayTime = sessions
      .filter(s => new Date(s.start_time).toDateString() === today)
      .reduce((sum, s) => sum + (s.duration_minutes || 0), 0);

    const statusStats = {
      active: sessions.filter(s => s.status === 'active').length,
      completed: sessions.filter(s => s.status === 'completed').length,
      interrupted: sessions.filter(s => s.status === 'interrupted').length,
    };

    const categoryStats: { [key: string]: number } = {};
    sessions.forEach(session => {
      if (session.duration_minutes) {
        categoryStats[session.category] =
          (categoryStats[session.category] || 0) + session.duration_minutes;
      }
    });

    // Neue Analysen für KI-Optimierung
    const problemStats: { [key: string]: number } = {};
    const moduleStats: { [key: string]: number } = {};
    const ausloeserStats: { [key: string]: number } = {};

    sessions.forEach(session => {
      if (session.problem) {
        problemStats[session.problem] =
          (problemStats[session.problem] || 0) + 1;
      }
      if (session.duration_minutes) {
        moduleStats[session.module] =
          (moduleStats[session.module] || 0) + session.duration_minutes;
      }
      if (session.ausloeser) {
        ausloeserStats[session.ausloeser] =
          (ausloeserStats[session.ausloeser] || 0) + 1;
      }
    });

    // console.log('📊 Time-Tracking Analytics geladen:', analytics);

    return {
      totalSessions,
      activeSessions,
      totalTime,
      todayTime,
      statusStats,
      categoryStats,
      problemStats,
      moduleStats,
      ausloeserStats,
    };
  }

  static createSession(data: CreateSessionData): TimeSession {
    const sessions = loadSessions();
    const now = new Date().toISOString();

    const maxId =
      sessions.length > 0 ? Math.max(...sessions.map(s => s.id)) : 0;

    const session: TimeSession = {
      id: maxId + 1,
      user_id: data.user_id,
      module: data.module,
      taetigkeit: data.taetigkeit, // Pflichtfeld
      ausloeser: data.ausloeser,
      problem: data.problem,
      category: data.category || 'development',
      priority: data.priority || 'medium',
      start_time: data.start_time || now,
      status: data.status || 'active',
      created_at: now,
      updated_at: now,
    };

    sessions.push(session);
    saveSessions(sessions);

    // console.log('⏱️ Neue Time-Tracking Session erstellt:', session);

    return session;
  }

  static completeSession(data: CompleteSessionData): TimeSession | null {
    const sessions = loadSessions();
    const sessionIndex = sessions.findIndex(s => s.id === data.id);

    if (sessionIndex === -1) {
      console.error(`❌ Session mit ID ${data.id} nicht gefunden`);
      return null;
    }

    const session = sessions[sessionIndex];
    const endTime = data.end_time || new Date().toISOString();

    // Dauer berechnen
    const startTime = new Date(session.start_time);
    const endTimeDate = new Date(endTime);
    const durationMs = endTimeDate.getTime() - startTime.getTime();
    const durationMinutes = Math.round(durationMs / (1000 * 60));

    // Session aktualisieren
    const updatedSession: TimeSession = {
      ...session,
      end_time: endTime,
      duration_minutes: durationMinutes,
      status: data.status,
      problem: data.problem || session.problem,
      updated_at: new Date().toISOString(),
    };

    sessions[sessionIndex] = updatedSession;
    saveSessions(sessions);

    // console.log('✅ Time-Tracking Session beendet:', data.id);

    return updatedSession;
  }

  static getActiveSessions(): TimeSession[] {
    const sessions = loadSessions();
    return sessions.filter(s => s.status === 'active');
  }

  static getSessionById(id: number): TimeSession | null {
    const sessions = loadSessions();
    return sessions.find(s => s.id === id) || null;
  }

  static updateSession(
    id: number,
    updateData: Partial<TimeSession>
  ): TimeSession | null {
    const sessions = loadSessions();
    const sessionIndex = sessions.findIndex(s => s.id === id);

    if (sessionIndex === -1) {
      console.error(`❌ Session mit ID ${id} nicht gefunden`);
      return null;
    }

    const updatedSession: TimeSession = {
      ...sessions[sessionIndex],
      ...updateData,
      updated_at: new Date().toISOString(),
    };

    sessions[sessionIndex] = updatedSession;
    saveSessions(sessions);

    // console.log(
    //   `✅ Session aktualisiert: ${updatedSession.module} - ${updatedSession.taetigkeit}`
    // );
    return updatedSession;
  }
}
