'use client';
import { useEffect } from 'react';
import kiTracker from '../../lib/ki-action-tracker';

export function KITrackingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Globale Trigger-Erkennung für alle Benutzer-Eingaben
    const handleUserInput = (event: Event) => {
      const target = event.target as HTMLInputElement | HTMLTextAreaElement;
      if (
        target &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')
      ) {
        const input = target.value.toLowerCase();

        // Trigger-Erkennung
        if (kiTracker.detectAndStartSession(input)) {
          // console.log(
          //   '🤖 KI-Session automatisch gestartet durch Benutzer-Eingabe'
          // );
        }

        // Ende-Erkennung
        if (kiTracker.detectAndEndSession(input)) {
          // console.log(
          //   '✅ KI-Session automatisch beendet durch Benutzer-Eingabe'
          // );
        }
      }
    };

    // Event-Listener für alle Eingabefelder
    document.addEventListener('input', handleUserInput);
    document.addEventListener('keydown', handleUserInput);

    // Automatische Session-Beendigung beim Verlassen der Seite
    const handleBeforeUnload = () => {
      kiTracker.endSession('Seite verlassen');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup
    return () => {
      document.removeEventListener('input', handleUserInput);
      document.removeEventListener('keydown', handleUserInput);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return <>{children}</>;
}
