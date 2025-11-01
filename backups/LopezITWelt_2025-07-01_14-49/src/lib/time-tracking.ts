// Time Tracking Service
import {
  CompleteSessionData,
  CreateSessionData,
  TimeSession,
} from './time-tracking-types';

// Client-kompatible Version ohne fs
export class TimeTrackingService {
  static getSessions(): TimeSession[] {
    // Im Client: Leeres Array zurueckgeben, da Daten ueber API geladen werden
    if (typeof window !== 'undefined') {
      return [];
    }

    // Server-seitig: Hier wuerde die fs-Logik stehen
    return [];
  }

  static getStats() {
    // Im Client: Leere Stats zurueckgeben, da Daten ueber API geladen werden
    if (typeof window !== 'undefined') {
      return {
        totalSessions: 0,
        activeSessions: 0,
        totalTime: 0,
        todayTime: 0,
        statusStats: { active: 0, completed: 0, interrupted: 0 },
        categoryStats: {},
        problemStats: {},
        moduleStats: {},
        ausloeserStats: {},
      };
    }

    // Server-seitig: Hier wuerde die fs-Logik stehen
    return {
      totalSessions: 0,
      activeSessions: 0,
      totalTime: 0,
      todayTime: 0,
      statusStats: { active: 0, completed: 0, interrupted: 0 },
      categoryStats: {},
      problemStats: {},
      moduleStats: {},
      ausloeserStats: {},
    };
  }

  static createSession(data: CreateSessionData): TimeSession {
    // Im Client: Session ueber API erstellen
    if (typeof window !== 'undefined') {
      // API-Call wird in den Komponenten gemacht
      const session: TimeSession = {
        id: Date.now(),
        user_id: data.user_id,
        module: data.module,
        taetigkeit: data.taetigkeit,
        ausloeser: data.ausloeser,
        problem: data.problem,
        category: data.category || 'development',
        priority: data.priority || 'medium',
        start_time: data.start_time || new Date().toISOString(),
        status: data.status || 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // console.log('⏱️ Timer gestartet für Session:', session.id);
      return session;
    }

    // Server-seitig: Hier wuerde die fs-Logik stehen
    const session: TimeSession = {
      id: Date.now(),
      user_id: data.user_id,
      module: data.module,
      taetigkeit: data.taetigkeit,
      ausloeser: data.ausloeser,
      problem: data.problem,
      category: data.category || 'development',
      priority: data.priority || 'medium',
      start_time: data.start_time || new Date().toISOString(),
      status: data.status || 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // console.log('⏱️ Timer gestartet für Session:', session.id);
    return session;
  }

  static completeSession(data: CompleteSessionData): TimeSession | null {
    // Im Client: Session ueber API beenden
    if (typeof window !== 'undefined') {
      // API-Call wird in den Komponenten gemacht
      // console.log(`✅ Session beendet: ID ${data.id}`);
      return null;
    }

    // Server-seitig: Hier wuerde die fs-Logik stehen
    // console.log(`✅ Session beendet: ID ${data.id}`);
    return null;
  }

  static getActiveSessions(): TimeSession[] {
    // Im Client: Leeres Array zurueckgeben
    if (typeof window !== 'undefined') {
      return [];
    }

    // Server-seitig: Hier wuerde die fs-Logik stehen
    return [];
  }

  static getSessionById(id: number): TimeSession | null {
    // Im Client: null zurueckgeben
    if (typeof window !== 'undefined') {
      return null;
    }

    // Server-seitig: Hier wuerde die fs-Logik stehen
    return null;
  }

  static updateSession(
    id: number,
    updateData: Partial<TimeSession>
  ): TimeSession | null {
    // Im Client: Session ueber API aktualisieren
    if (typeof window !== 'undefined') {
      // API-Call wird in den Komponenten gemacht
      // console.log(`✅ Session aktualisiert: ID ${id}`);
      return null;
    }

    // Server-seitig: Hier wuerde die fs-Logik stehen
    // console.log(`✅ Session aktualisiert: ID ${id}`);
    return null;
  }
}

// Re-export der Typen
export type { CompleteSessionData, CreateSessionData, TimeSession };
