import { NextRequest } from "next/server";
import { AuthService, SessionData } from "./auth-service";

/**
 * Extrahiert und validiert die Session aus einem NextRequest
 * @param request NextRequest Objekt
 * @returns SessionData oder null
 */
export async function getSession(request: NextRequest): Promise<SessionData & { user: { id: number; email: string }; roles: string[]; sessionId?: string } | null> {
  try {
    // Session-Token aus Header oder Cookie extrahieren
    const sessionToken =
      request.headers.get("authorization")?.replace("Bearer ", "") ||
      request.cookies.get("session_token")?.value;

    if (!sessionToken) {
      return null;
    }

    // Session validieren
    const session = await AuthService.validateSession(sessionToken);
    if (!session) {
      return null;
    }

    // Rollen laden (vereinfacht - in Produktion sollte RBACService verwendet werden)
    const roles = session.roles || [];

    return {
      ...session,
      user: {
        id: session.userId,
        email: session.email,
      },
      roles,
      sessionId: sessionToken,
    };
  } catch (error) {
    console.error("Fehler beim Extrahieren der Session:", error);
    return null;
  }
}

