import { useCallback, useEffect, useState } from 'react';

interface Text {
  id: number;
  modul: string;
  feld: string;
  sprache: string;
  inhalt: string;
}

interface UseTextsReturn {
  texts: { [key: string]: string };
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useTexts(
  module: string,
  language: string = 'de'
): UseTextsReturn {
  const [texts, setTexts] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTexts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/admin/texts');
      if (!response.ok) {
        throw new Error('Fehler beim Laden der Texte');
      }

      const allTexts: Text[] = await response.json();

      // Filtere Texte für das gewünschte Modul und die Sprache
      const filteredTexts = allTexts.filter(
        text => text.modul === module && text.sprache === language
      );

      // Konvertiere zu einem Objekt mit Feld als Schlüssel
      const textObject: { [key: string]: string } = {};
      filteredTexts.forEach(text => {
        textObject[text.feld] = text.inhalt;
      });

      setTexts(textObject);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
    } finally {
      setLoading(false);
    }
  }, [module, language]);

  useEffect(() => {
    loadTexts();
  }, [loadTexts]);

  return {
    texts,
    loading,
    error,
    refresh: loadTexts,
  };
}

// Hilfsfunktion für einfache Textabfrage
export function getText(
  texts: { [key: string]: string },
  field: string,
  fallback: string = ''
): string {
  return texts[field] || fallback;
}
