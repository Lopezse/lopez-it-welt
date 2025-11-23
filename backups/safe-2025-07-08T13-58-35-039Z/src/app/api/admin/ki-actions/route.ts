import { NextRequest, NextResponse } from "next/server";

interface KIAction {
  id: number;
  timestamp: string;
  action: string;
  description: string;
  status: "success" | "error" | "pending";
  details?: string;
  user_id?: number;
}

// In-Memory KI-Actions (später durch echte Datenbank ersetzen)
let kiActions: KIAction[] = [];

// Korrekte aktuelle Zeit (Deutschland)
function getCurrentTime(): string {
  const now = new Date();
  // Deutschland ist UTC+1 (Winter) oder UTC+2 (Sommer)
  const germanyTime = new Date(now.getTime() + 1 * 60 * 60 * 1000); // UTC+1
  return germanyTime.toISOString();
}

export async function GET() {
  try {
    return NextResponse.json(kiActions);
  } catch (error) {
    console.error("Fehler beim Abrufen der KI-Actions:", error);
    return NextResponse.json({ error: "Fehler beim Abrufen der KI-Actions" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, description, status = "success", details, user_id } = body;

    if (!action || !description) {
      return NextResponse.json(
        { error: "action und description sind Pflichtfelder" },
        { status: 400 },
      );
    }

    const now = getCurrentTime();
    const maxId = kiActions.length > 0 ? Math.max(...kiActions.map((a) => a.id)) : 0;

    const kiAction: KIAction = {
      id: maxId + 1,
      timestamp: now,
      action,
      description,
      status,
      details,
      user_id,
    };

    kiActions.push(kiAction);

    console.log(`✅ Neue KI-Action erstellt: ${action} - ${description}`);
    return NextResponse.json(kiAction, { status: 201 });
  } catch (error) {
    console.error("Fehler beim Erstellen der KI-Action:", error);
    return NextResponse.json({ error: "Fehler beim Erstellen der KI-Action" }, { status: 500 });
  }
}
