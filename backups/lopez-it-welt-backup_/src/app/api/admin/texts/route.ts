import { NextResponse } from 'next/server';

// Mock-Datenbankverbindung (später durch echte MySQL-Verbindung ersetzen)
const mockTexts = [
  {
    id: 1,
    modul: 'home',
    feld: 'welcome',
    sprache: 'de',
    inhalt: 'Willkommen auf der Lopez IT Welt!',
  },
  {
    id: 2,
    modul: 'home',
    feld: 'welcome',
    sprache: 'en',
    inhalt: 'Welcome to Lopez IT World!',
  },
  {
    id: 3,
    modul: 'home',
    feld: 'welcome',
    sprache: 'es',
    inhalt: '¡Bienvenido a Lopez IT World!',
  },
  {
    id: 4,
    modul: 'home',
    feld: 'hero_title',
    sprache: 'de',
    inhalt: 'Professionelle IT-Dienstleistungen',
  },
  {
    id: 5,
    modul: 'home',
    feld: 'hero_title',
    sprache: 'en',
    inhalt: 'Professional IT Services',
  },
  {
    id: 6,
    modul: 'home',
    feld: 'hero_title',
    sprache: 'es',
    inhalt: 'Servicios IT Profesionales',
  },
  {
    id: 7,
    modul: 'home',
    feld: 'hero_subtitle',
    sprache: 'de',
    inhalt: 'Ihre IT-Partner für moderne Lösungen',
  },
  {
    id: 8,
    modul: 'home',
    feld: 'hero_subtitle',
    sprache: 'en',
    inhalt: 'Your IT partner for modern solutions',
  },
  {
    id: 9,
    modul: 'home',
    feld: 'hero_subtitle',
    sprache: 'es',
    inhalt: 'Su socio IT para soluciones modernas',
  },
  {
    id: 19,
    modul: 'home',
    feld: 'cta_primary',
    sprache: 'de',
    inhalt: 'Jetzt beraten lassen',
  },
  {
    id: 20,
    modul: 'home',
    feld: 'cta_primary',
    sprache: 'en',
    inhalt: 'Get consultation now',
  },
  {
    id: 21,
    modul: 'home',
    feld: 'cta_primary',
    sprache: 'es',
    inhalt: 'Obtener consulta ahora',
  },
  {
    id: 22,
    modul: 'home',
    feld: 'cta_secondary',
    sprache: 'de',
    inhalt: 'Mehr erfahren',
  },
  {
    id: 23,
    modul: 'home',
    feld: 'cta_secondary',
    sprache: 'en',
    inhalt: 'Learn more',
  },
  {
    id: 24,
    modul: 'home',
    feld: 'cta_secondary',
    sprache: 'es',
    inhalt: 'Saber más',
  },
  {
    id: 25,
    modul: 'home',
    feld: 'shop_title',
    sprache: 'de',
    inhalt: 'Unsere Dienstleistungen',
  },
  {
    id: 26,
    modul: 'home',
    feld: 'shop_title',
    sprache: 'en',
    inhalt: 'Our Services',
  },
  {
    id: 27,
    modul: 'home',
    feld: 'shop_title',
    sprache: 'es',
    inhalt: 'Nuestros Servicios',
  },
  {
    id: 28,
    modul: 'home',
    feld: 'shop_subtitle',
    sprache: 'de',
    inhalt: 'Entdecken Sie unsere professionellen IT-Dienstleistungen',
  },
  {
    id: 29,
    modul: 'home',
    feld: 'shop_subtitle',
    sprache: 'en',
    inhalt: 'Discover our professional IT services',
  },
  {
    id: 30,
    modul: 'home',
    feld: 'shop_subtitle',
    sprache: 'es',
    inhalt: 'Descubra nuestros servicios IT profesionales',
  },
  {
    id: 31,
    modul: 'home',
    feld: 'cta_title',
    sprache: 'de',
    inhalt: 'Bereit für den nächsten Schritt?',
  },
  {
    id: 32,
    modul: 'home',
    feld: 'cta_title',
    sprache: 'en',
    inhalt: 'Ready for the next step?',
  },
  {
    id: 33,
    modul: 'home',
    feld: 'cta_title',
    sprache: 'es',
    inhalt: '¿Listo para el siguiente paso?',
  },
  {
    id: 34,
    modul: 'home',
    feld: 'cta_description',
    sprache: 'de',
    inhalt:
      'Kontaktieren Sie uns und lassen Sie uns gemeinsam Ihre IT-Ziele erreichen.',
  },
  {
    id: 35,
    modul: 'home',
    feld: 'cta_description',
    sprache: 'en',
    inhalt: "Contact us and let's achieve your IT goals together.",
  },
  {
    id: 36,
    modul: 'home',
    feld: 'cta_description',
    sprache: 'es',
    inhalt: 'Contáctenos y logremos juntos sus objetivos IT.',
  },
  {
    id: 37,
    modul: 'home',
    feld: 'cta_button',
    sprache: 'de',
    inhalt: 'Kontakt aufnehmen',
  },
  {
    id: 38,
    modul: 'home',
    feld: 'cta_button',
    sprache: 'en',
    inhalt: 'Contact us',
  },
  {
    id: 39,
    modul: 'home',
    feld: 'cta_button',
    sprache: 'es',
    inhalt: 'Contáctenos',
  },
  {
    id: 10,
    modul: 'leistungen',
    feld: 'title',
    sprache: 'de',
    inhalt: 'Unsere Leistungen',
  },
  {
    id: 11,
    modul: 'leistungen',
    feld: 'title',
    sprache: 'en',
    inhalt: 'Our Services',
  },
  {
    id: 12,
    modul: 'leistungen',
    feld: 'title',
    sprache: 'es',
    inhalt: 'Nuestros Servicios',
  },
  { id: 13, modul: 'kontakt', feld: 'title', sprache: 'de', inhalt: 'Kontakt' },
  { id: 14, modul: 'kontakt', feld: 'title', sprache: 'en', inhalt: 'Contact' },
  {
    id: 15,
    modul: 'kontakt',
    feld: 'title',
    sprache: 'es',
    inhalt: 'Contacto',
  },
  {
    id: 16,
    modul: 'footer',
    feld: 'copyright',
    sprache: 'de',
    inhalt: '© 2024 Lopez IT Welt. Alle Rechte vorbehalten.',
  },
  {
    id: 17,
    modul: 'footer',
    feld: 'copyright',
    sprache: 'en',
    inhalt: '© 2024 Lopez IT Welt. All rights reserved.',
  },
  {
    id: 18,
    modul: 'footer',
    feld: 'copyright',
    sprache: 'es',
    inhalt: '© 2024 Lopez IT Welt. Todos los derechos reservados.',
  },
];

export async function GET() {
  try {
    // Hier würde echte Datenbankabfrage stehen
    // SELECT * FROM texte ORDER BY modul, feld, sprache
    return NextResponse.json(mockTexts);
  } catch (error) {
    console.error('Fehler beim Laden der Texte:', error);
    return NextResponse.json(
      { error: 'Fehler beim Laden der Texte' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { modul, feld, sprache, inhalt } = body;

    // Validierung
    if (!modul || !feld || !sprache || !inhalt) {
      return NextResponse.json(
        { error: 'Alle Felder sind erforderlich' },
        { status: 400 }
      );
    }

    // Hier würde echte Datenbank-INSERT stehen
    // INSERT INTO texte (modul, feld, sprache, inhalt) VALUES (?, ?, ?, ?)

    const newText = {
      id: mockTexts.length + 1,
      modul,
      feld,
      sprache,
      inhalt,
    };

    return NextResponse.json(newText, { status: 201 });
  } catch (error) {
    console.error('Fehler beim Erstellen des Textes:', error);
    return NextResponse.json(
      { error: 'Fehler beim Erstellen des Textes' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, modul, feld, sprache, inhalt } = body;

    // Validierung
    if (!id || !modul || !feld || !sprache || !inhalt) {
      return NextResponse.json(
        { error: 'Alle Felder sind erforderlich' },
        { status: 400 }
      );
    }

    // Hier würde echte Datenbank-UPDATE stehen
    // UPDATE texte SET modul = ?, feld = ?, sprache = ?, inhalt = ? WHERE id = ?

    const updatedText = { id, modul, feld, sprache, inhalt };
    return NextResponse.json(updatedText);
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Textes:', error);
    return NextResponse.json(
      { error: 'Fehler beim Aktualisieren des Textes' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID ist erforderlich' },
        { status: 400 }
      );
    }

    // Hier würde echte Datenbank-DELETE stehen
    // DELETE FROM texte WHERE id = ?

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Fehler beim Löschen des Textes:', error);
    return NextResponse.json(
      { error: 'Fehler beim Löschen des Textes' },
      { status: 500 }
    );
  }
}
