import { NextRequest, NextResponse } from 'next/server';
import { TimeTrackingServerService } from '../../../../../../../lib/time-tracking-server';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const sessionId = parseInt(resolvedParams.id);

    console.log(`⏹️ Stopping session ${sessionId}`);

    // Prüfen ob Session existiert
    const sessions = TimeTrackingServerService.getSessions();
    const session = sessions.find(s => s.id === sessionId);

    if (!session) {
      console.log(`❌ Session ${sessionId} nicht gefunden`);
      return NextResponse.json(
        { error: `Session ${sessionId} nicht gefunden` },
        { status: 404 }
      );
    }

    console.log(`📋 Session ${sessionId} gefunden:`, session.status);

    const stoppedSession = TimeTrackingServerService.completeSession({
      id: sessionId,
      status: 'completed',
      end_time: new Date().toISOString(),
    });

    if (!stoppedSession) {
      console.log(`❌ Session ${sessionId} konnte nicht gestoppt werden`);
      return NextResponse.json(
        { error: 'Session nicht gefunden oder nicht aktiv' },
        { status: 404 }
      );
    }

    console.log(`✅ Session ${sessionId} erfolgreich gestoppt`);
    return NextResponse.json(stoppedSession);
  } catch (error) {
    console.error('❌ Fehler beim Stoppen der Session:', error);
    return NextResponse.json(
      { error: 'Fehler beim Stoppen der Session' },
      { status: 500 }
    );
  }
}
