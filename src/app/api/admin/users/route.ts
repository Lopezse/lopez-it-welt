import { NextRequest, NextResponse } from 'next/server';

// Mock-Daten für Benutzer (später durch echte Datenbank ersetzen)
let users: User[] = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@lopez-it-welt.de',
    role: 'admin',
    status: 'active' as const,
    created_at: '2025-01-01T00:00:00Z',
    last_login: '2025-06-25T10:00:00Z',
  },
  {
    id: 2,
    username: 'support',
    email: 'support@lopez-it-welt.de',
    role: 'support',
    status: 'active' as const,
    created_at: '2025-01-15T00:00:00Z',
    last_login: '2025-06-24T15:30:00Z',
  },
  {
    id: 3,
    username: 'techniker',
    email: 'techniker@lopez-it-welt.de',
    role: 'technician',
    status: 'active' as const,
    created_at: '2025-02-01T00:00:00Z',
    last_login: '2025-06-25T08:45:00Z',
  },
];

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'locked';
  created_at: string;
  last_login?: string | null;
}

export async function GET() {
  try {
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: 'Fehler beim Laden der Benutzer' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, role, password } = body;

    // Validierung
    if (!username || !email || !role || !password) {
      return NextResponse.json(
        { error: 'Alle Felder sind erforderlich' },
        { status: 400 }
      );
    }

    // Prüfen ob Benutzer bereits existiert
    if (
      users.find(user => user.username === username || user.email === email)
    ) {
      return NextResponse.json(
        { error: 'Benutzer oder E-Mail bereits vorhanden' },
        { status: 400 }
      );
    }

    const newUser: User = {
      id: users.length + 1,
      username,
      email,
      role,
      status: 'active',
      created_at: new Date().toISOString(),
      last_login: null,
    };

    users.push(newUser);

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Fehler beim Erstellen des Benutzers' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'Benutzer nicht gefunden' },
        { status: 404 }
      );
    }

    users[userIndex] = { ...users[userIndex], ...updateData };

    return NextResponse.json(users[userIndex]);
  } catch (error) {
    return NextResponse.json(
      { error: 'Fehler beim Aktualisieren des Benutzers' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '0');

    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'Benutzer nicht gefunden' },
        { status: 404 }
      );
    }

    users.splice(userIndex, 1);

    return NextResponse.json({ message: 'Benutzer erfolgreich gelöscht' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Fehler beim Löschen des Benutzers' },
      { status: 500 }
    );
  }
}
