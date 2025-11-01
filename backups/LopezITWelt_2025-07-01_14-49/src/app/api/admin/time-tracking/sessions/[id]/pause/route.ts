import { NextRequest, NextResponse } from 'next/server';
import { TimeTrackingServerService } from '../../../../../../../lib/time-tracking-server';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const sessionId = parseInt(resolvedParams.id);

    console.log(`🔄 Pausing session ${sessionId}`);

    // Prüfen ob Session existiert
    const sessions = TimeTrackingServerService.getSessions();
    const session = sessions.find((s: any) => s.id === sessionId);

    if (!session) {
      console.log(`❌ Session ${sessionId} nicht gefunden`);
      return NextResponse.json(
        { error: `Session ${sessionId} nicht gefunden` },
        { status: 404 }
      );
    }

    console.log(`📋 Session ${sessionId} gefunden:`, session.status);

    const pausedSession = TimeTrackingServerService.updateSession(sessionId, {
      status: 'paused',
    });

    if (!pausedSession) {
      console.log(`❌ Session ${sessionId} konnte nicht pausiert werden`);
      return NextResponse.json(
        { error: 'Session nicht gefunden oder nicht aktiv' },
        { status: 404 }
      );
    }

    console.log(`✅ Session ${sessionId} erfolgreich pausiert`);
    return NextResponse.json(pausedSession);
  } catch (error) {
    console.error('❌ Fehler beim Pausieren der Session:', error);
    return NextResponse.json(
      { error: 'Fehler beim Pausieren der Session' },
      { status: 500 }
    );
  }
}
