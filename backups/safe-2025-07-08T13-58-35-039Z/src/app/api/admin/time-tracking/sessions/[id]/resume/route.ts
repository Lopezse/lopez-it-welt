import { NextRequest, NextResponse } from "next/server";
import { TimeTrackingServerService } from "../../../../../../../lib/time-tracking-server";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const sessionId = parseInt(resolvedParams.id);

    console.log(`▶️ Resuming session ${sessionId}`);

    // Prüfen ob Session existiert
    const sessions = TimeTrackingServerService.getSessions();
    const session = sessions.find((s) => s.id === sessionId);

    if (!session) {
      console.log(`❌ Session ${sessionId} nicht gefunden`);
      return NextResponse.json({ error: `Session ${sessionId} nicht gefunden` }, { status: 404 });
    }

    console.log(`📋 Session ${sessionId} gefunden:`, session.status);

    const resumedSession = TimeTrackingServerService.updateSession(sessionId, {
      status: "active",
    });

    if (!resumedSession) {
      console.log(`❌ Session ${sessionId} konnte nicht fortgesetzt werden`);
      return NextResponse.json(
        { error: "Session nicht gefunden oder nicht pausiert" },
        { status: 404 },
      );
    }

    console.log(`✅ Session ${sessionId} erfolgreich fortgesetzt`);
    return NextResponse.json(resumedSession);
  } catch (error) {
    console.error("❌ Fehler beim Fortsetzen der Session:", error);
    return NextResponse.json({ error: "Fehler beim Fortsetzen der Session" }, { status: 500 });
  }
}
