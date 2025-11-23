export interface KIAction {
  id: string;
  type:
    | 'session_start'
    | 'session_end'
    | 'task_complete'
    | 'error'
    | 'interaction';
  module: string;
  taetigkeit: string;
  ausloeser: string;
  problem?: string;
  timestamp: string;
  duration_minutes?: number;
}

export interface KISession {
  session_id: string;
  modul: string;
  start_time: string;
  end_time?: string;
  duration_minutes?: number;
  triggered_by: string;
  summary: string;
  tool_used: string;
  status: 'active' | 'completed' | 'interrupted';
  created_at: string;
  updated_at: string;
}

class KIActionTracker {
  private currentSession: KIAction | null = null;
  private sessionStartTime: Date | null = null;
  private lastActionTime: Date | null = null;
  private currentKISession: KISession | null = null;
  private interactions: KIAction[] = [];
  private errors: KIAction[] = [];

  // Trigger-Erkennung für Sprach-/Textbefehle
  private triggerKeywords = [
    'mach',
    'erstelle',
    'baue',
    'entwickle',
    'implementiere',
    'programmiere',
    'login',
    'register',
    'dashboard',
    'admin',
    'shop',
    'api',
    'database',
    'fix',
    'repariere',
    'korrigiere',
    'debug',
    'optimize',
    'verbessere',
  ];

  private endKeywords = [
    'danke',
    'fertig',
    'erledigt',
    'abgeschlossen',
    'done',
    'complete',
    'stopp',
    'ende',
    'beende',
    'stop',
    'finish',
  ];

  // Automatische Trigger-Erkennung
  detectTrigger(input: string): boolean {
    const lowerInput = input.toLowerCase();
    return this.triggerKeywords.some(keyword => lowerInput.includes(keyword));
  }

  // Automatische Ende-Erkennung
  detectEnd(input: string): boolean {
    const lowerInput = input.toLowerCase();
    return this.endKeywords.some(keyword => lowerInput.includes(keyword));
  }

  // Intelligente Session-Erstellung basierend auf Trigger
  startSessionFromTrigger(trigger: string, module?: string): void {
    const sessionId = `ki_${new Date().toISOString().split('T')[0]}-${module?.toUpperCase() || 'TASK'}-${Math.random().toString(36).substr(2, 6)}`;

    // Modul aus Trigger extrahieren
    const extractedModule = this.extractModuleFromTrigger(trigger);
    const finalModule = module || extractedModule || 'general';

    // Zusammenfassung aus Trigger generieren
    const summary = this.generateSummaryFromTrigger(trigger);

    this.currentKISession = {
      session_id: sessionId,
      modul: finalModule,
      start_time: new Date().toISOString(),
      triggered_by: `Sprach-/Textbefehl: ${trigger}`,
      summary: summary,
      tool_used: 'Cursor + GPT-4 + Next.js + Tailwind',
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.sessionStartTime = new Date();
    this.lastActionTime = new Date();

    // In Time-Tracking eintragen
    this.createTimeTrackingSession(finalModule, summary, trigger);

    // console.log(`🤖 KI-Session gestartet: ${finalModule} - ${summary}`);
    // console.log(`📝 Trigger: "${trigger}"`);
  }

  // Standard startSession Methode für direkte Aufrufe
  startSession(module: string, taetigkeit: string, ausloeser: string): void {
    const sessionId = `ki_${new Date().toISOString().split('T')[0]}-${module.toUpperCase()}-${Math.random().toString(36).substr(2, 6)}`;

    this.currentKISession = {
      session_id: sessionId,
      modul: module,
      start_time: new Date().toISOString(),
      triggered_by: ausloeser,
      summary: taetigkeit,
      tool_used: 'Cursor + GPT-4 + Next.js + Tailwind',
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.sessionStartTime = new Date();
    this.lastActionTime = new Date();

    // In Time-Tracking eintragen
    this.createTimeTrackingSession(module, taetigkeit, ausloeser);

    // console.log('🤖 KI-Session gestartet:', module, taetigkeit);
  }

  // Modul aus Trigger extrahieren
  private extractModuleFromTrigger(trigger: string): string {
    const lowerTrigger = trigger.toLowerCase();

    if (lowerTrigger.includes('login')) return 'login-page';
    if (lowerTrigger.includes('register')) return 'register-page';
    if (lowerTrigger.includes('dashboard')) return 'admin-dashboard';
    if (lowerTrigger.includes('admin')) return 'admin-system';
    if (lowerTrigger.includes('shop')) return 'e-commerce';
    if (lowerTrigger.includes('api')) return 'api-development';
    if (lowerTrigger.includes('database')) return 'database';
    if (lowerTrigger.includes('fix') || lowerTrigger.includes('repariere'))
      return 'bugfix';
    if (
      lowerTrigger.includes('optimize') ||
      lowerTrigger.includes('verbessere')
    )
      return 'optimization';

    return 'general-development';
  }

  // Zusammenfassung aus Trigger generieren
  private generateSummaryFromTrigger(trigger: string): string {
    const lowerTrigger = trigger.toLowerCase();

    if (lowerTrigger.includes('login'))
      return 'Login-System erstellt mit E-Mail, Passwort, Validierung';
    if (lowerTrigger.includes('register'))
      return 'Registrierung erstellt mit Benutzerdaten, E-Mail-Bestätigung';
    if (lowerTrigger.includes('dashboard'))
      return 'Admin-Dashboard erstellt mit Statistiken und Verwaltung';
    if (lowerTrigger.includes('shop'))
      return 'E-Commerce-System erstellt mit Produkten, Warenkorb, Checkout';
    if (lowerTrigger.includes('api'))
      return 'API-Endpoints erstellt mit CRUD-Operationen';
    if (lowerTrigger.includes('database'))
      return 'Datenbankstruktur erstellt mit Tabellen und Beziehungen';
    if (lowerTrigger.includes('fix'))
      return 'Bugfix durchgeführt und Probleme behoben';
    if (lowerTrigger.includes('optimize'))
      return 'Performance-Optimierung durchgeführt';

    return `Task ausgeführt: ${trigger}`;
  }

  // Automatisch Session beenden
  endSession(problem?: string): void {
    if (!this.currentKISession || !this.sessionStartTime) {
      // console.log(`❌ Keine aktive KI-Session zum Beenden`);
      return;
    }

    const endTime = new Date();
    const durationMs = endTime.getTime() - this.sessionStartTime.getTime();
    const durationMinutes = Math.round(durationMs / (1000 * 60));

    // KI-Session aktualisieren
    this.currentKISession.end_time = endTime.toISOString();
    this.currentKISession.duration_minutes = durationMinutes;
    this.currentKISession.status = 'completed';
    this.currentKISession.updated_at = endTime.toISOString();

    // In JSON-Datei speichern
    this.saveSessionToDatabase(this.currentKISession);

    // Session in Time-Tracking beenden
    this.completeTimeTrackingSession(problem);

    // console.log(`✅ KI-Session beendet: ${this.currentKISession.modul} (${durationMinutes} Min)`);
    // console.log(`📊 Zusammenfassung: ${this.currentKISession.summary}`);

    this.currentKISession = null;
    this.sessionStartTime = null;
    this.lastActionTime = null;
  }

  // Automatisch Interaktion erfassen
  logInteraction(
    module: string,
    taetigkeit: string,
    ausloeser: string,
    problem?: string
  ) {
    // console.log(`📝 KI-Interaktion: ${module} - ${taetigkeit}`);

    const action: KIAction = {
      id: `interaction_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      type: 'interaction',
      module,
      taetigkeit,
      ausloeser,
      problem,
      timestamp: new Date().toISOString(),
    };

    this.interactions.push(action);
  }

  // Automatisch Fehler erfassen
  logError(
    module: string,
    taetigkeit: string,
    ausloeser: string,
    error: string
  ) {
    // console.log(`❌ KI-Fehler: ${module} - ${taetigkeit} - ${error}`);

    const action: KIAction = {
      id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      type: 'error',
      module,
      taetigkeit,
      ausloeser,
      problem: error,
      timestamp: new Date().toISOString(),
    };

    this.errors.push(action);

    // Time-Tracking Session für Fehler erstellen
    this.createTimeTrackingSession(
      module,
      taetigkeit,
      ausloeser,
      error,
      'interrupted'
    );
  }

  // Hilfsmethoden für Time-Tracking
  private async createTimeTrackingSession(
    module: string,
    taetigkeit: string,
    ausloeser: string,
    problem?: string,
    status: 'active' | 'completed' | 'interrupted' = 'active'
  ) {
    try {
      const response = await fetch('/api/admin/time-tracking/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 1, // KI-User
          module,
          taetigkeit,
          ausloeser,
          problem,
          category: 'ki_interaction',
          priority: 'high',
          status,
        }),
      });

      if (response.ok) {
        const session = await response.json();
        console.log(`✅ KI-Time-Tracking Session erstellt: ${session.module}`);
        return session;
      }
    } catch (error) {
      console.error(
        '❌ Fehler beim Erstellen der KI-Time-Tracking Session:',
        error
      );
    }
  }

  private async completeTimeTrackingSession(problem?: string) {
    try {
      // Aktive Sessions finden und beenden
      const response = await fetch('/api/admin/time-tracking/sessions');
      if (response.ok) {
        const sessions = await response.json();
        const activeSessions = sessions.filter(
          (s: { user_id: number; status: string; category: string }) =>
            s.user_id === 1 &&
            s.status === 'active' &&
            s.category === 'ki_interaction'
        );

        for (const session of activeSessions) {
          await fetch(
            `/api/admin/time-tracking/sessions/${session.id}/complete`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                status: 'completed',
                problem,
              }),
            }
          );
        }
      }
    } catch (error) {
      console.error(
        '❌ Fehler beim Beenden der KI-Time-Tracking Sessions:',
        error
      );
    }
  }

  // KI-Session in JSON-Datei speichern
  async saveSessionToDatabase(session: KISession): Promise<void> {
    try {
      const response = await fetch('/api/admin/ki-sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(session),
      });

      if (response.ok) {
        // console.log('💾 KI-Session gespeichert:', session.session_id);
      }
    } catch (error) {
      console.error('Fehler beim Speichern der KI-Session:', error);
    }
  }

  // Aktuelle Session abrufen
  getCurrentSession(): KISession | null {
    return this.currentKISession;
  }

  // Alle Sessions abrufen
  async getAllSessions(): Promise<KISession[]> {
    try {
      const response = await fetch('/api/admin/ki-sessions');
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('❌ Fehler beim Abrufen der KI-Sessions:', error);
    }
    return [];
  }

  // Intelligente Trigger-Erkennung für aktuelle Aktionen
  detectAndStartSession(input: string): boolean {
    if (this.detectTrigger(input)) {
      this.startSessionFromTrigger(input);
      return true;
    }
    return false;
  }

  // Intelligente Ende-Erkennung für aktuelle Aktionen
  detectAndEndSession(input: string): boolean {
    if (this.detectEnd(input)) {
      this.endSession('Benutzer hat Session beendet');
      return true;
    }
    return false;
  }

  endCurrentSession() {
    if (!this.currentKISession) {
      // console.log('❌ Keine aktive KI-Session zum Beenden');
      return;
    }

    const endTime = new Date();
    const durationMs =
      endTime.getTime() - new Date(this.currentKISession.start_time).getTime();
    // const durationMinutes = Math.round(durationMs / (1000 * 60));

    // console.log(
    //   `✅ KI-Session beendet: ${this.currentKISession.modul} (${durationMs} ms)`
    // );

    this.currentKISession = null;
  }
}

// Singleton-Instanz exportieren
const kiTracker = new KIActionTracker();
export default kiTracker;

// Automatische Session-Beendigung beim Verlassen der Seite
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    kiTracker.endSession('Seite verlassen');
  });

  // DEAKTIVIERT: Automatische Session-Beendigung bei Tab-Wechsel
  // document.addEventListener('visibilitychange', () => {
  //     if (document.hidden) {
  //         kiTracker.logInteraction(
  //             'Global-Layout',
  //             'Tab verlassen/versteckt',
  //             'Visibility-Change'
  //         );
  //     } else {
  //         kiTracker.logInteraction(
  //             'Global-Layout',
  //             'Tab wieder aktiv',
  //             'Visibility-Change'
  //         );
  //     }
  // });
}
