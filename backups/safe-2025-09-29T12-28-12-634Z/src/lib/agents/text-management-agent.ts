// =====================================================
// Text Management Agent - Zentrale Texte
// =====================================================
// Erstellt: 2025-07-05 14:30:00
// Autor: Ramiro Lopez Rodriguez
// Zweck: Automatische Verwaltung zentraler Texte
// =====================================================

import { KIAgent } from "../ki-agent";
import { MemorySystem } from "../memory-system";

interface TextData {
  key: string;
  value: string;
  language: string;
  category: string;
  description?: string;
}

interface TextValidationResult {
  isValid: boolean;
  errors: string[];
  suggestions: string[];
}

export class TextManagementAgent extends KIAgent {
  private memory: MemorySystem;

  constructor() {
    super();
    this.memory = new MemorySystem();
  }

  async loadTextsFromDatabase(): Promise<TextData[]> {
    try {
      // Text-Management-Agent: Texte aus Datenbank laden...

      // Simuliere Datenbankabfrage
      const texts: TextData[] = [
        {
          key: "hero_headline",
          value: "Lopez IT Welt",
          language: "de",
          category: "homepage",
          description: "Hauptüberschrift der Startseite",
        },
        {
          key: "hero_subtitle",
          value: "Professionelle IT-Dienstleistungen mit Fokus auf Barrierefreiheit",
          language: "de",
          category: "homepage",
          description: "Untertitel der Startseite",
        },
        {
          key: "footer_company",
          value: "Lopez IT Welt",
          language: "de",
          category: "footer",
          description: "Firmenname im Footer",
        },
        {
          key: "nav_home",
          value: "Startseite",
          language: "de",
          category: "navigation",
          description: "Navigation Home",
        },
        {
          key: "nav_services",
          value: "Leistungen",
          language: "de",
          category: "navigation",
          description: "Navigation Services",
        },
      ];

      // ${texts.length} Texte aus Datenbank geladen
      return texts;
    } catch (error) {
      // Fehler beim Laden der Texte: ${error}
      throw error;
    }
  }

  async updateText(
    key: string,
    newValue: string,
    language: string = "de",
  ): Promise<{
    success: boolean;
    validation: TextValidationResult;
    message: string;
  }> {
    try {
      // Text-Management-Agent: Text "${key}" aktualisieren...

      // 1. Text validieren
      const validation = await this.validateText(key, newValue, language);

      if (!validation.isValid) {
        return {
          success: false,
          validation,
          message: "Text-Validierung fehlgeschlagen",
        };
      }

      // 2. Datenbank-Update simulieren
      // Text "${key}" erfolgreich aktualisiert

      return {
        success: true,
        validation,
        message: "Text erfolgreich aktualisiert",
      };
    } catch (error) {
      // Fehler beim Aktualisieren des Texts: ${error}
      throw error;
    }
  }

  async createTextComponent(texts: TextData[]): Promise<string> {
    try {
      // Text-Management-Agent: Text-Komponente erstellen...

      const textMap = texts.reduce(
        (acc, text) => {
          acc[text.key] = text.value;
          return acc;
        },
        {} as Record<string, string>,
      );

      const component = `
import React from 'react';

interface TextData {
  [key: string]: string;
}

interface TextComponentProps {
  textKey: string;
  fallback?: string;
  className?: string;
}

export const TextComponent: React.FC<TextComponentProps> = ({ 
  textKey, 
  fallback = '', 
  className = '' 
}) => {
  const texts: TextData = ${JSON.stringify(textMap, null, 2)};
  
  const text = texts[textKey] || fallback;
  
  return (
    <span className={className}>
      {text}
    </span>
  );
};

export const useTexts = () => {
  const texts: TextData = ${JSON.stringify(textMap, null, 2)};
  
  const getText = (key: string, fallback: string = '') => {
    return texts[key] || fallback;
  };
  
  return { texts, getText };
};

export default TextComponent;
      `;

      // Text-Komponente erfolgreich erstellt
      return component;
    } catch (error) {
      // Fehler beim Erstellen der Text-Komponente: ${error}
      throw error;
    }
  }

  async generateTextKeys(componentPath: string): Promise<string[]> {
    try {
      // Text-Management-Agent: Text-Keys aus Komponente extrahieren...

      const fs = require("fs");
      const content = fs.readFileSync(componentPath, "utf8");

      // Suche nach statischen Texten
      const textMatches = content.match(/>([^<>{]+)</g) || [];
      const keys: string[] = [];

      textMatches.forEach((match) => {
        const text = match.replace(/[><]/g, "").trim();
        if (text.length > 0 && text.length < 100) {
          const key = this.generateKeyFromText(text);
          keys.push(key);
        }
      });

      // ${keys.length} Text-Keys extrahiert
      return keys;
    } catch (error) {
      // Fehler beim Extrahieren der Text-Keys: ${error}
      throw error;
    }
  }

  private generateKeyFromText(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9äöüß]/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_|_$/g, "");
  }

  async validateText(key: string, value: string, language: string): Promise<TextValidationResult> {
    const errors: string[] = [];
    const suggestions: string[] = [];

    // Validierung
    if (!key || key.trim().length === 0) {
      errors.push("❌ Text-Key ist leer");
    }

    if (!value || value.trim().length === 0) {
      errors.push("❌ Text-Wert ist leer");
    }

    if (value.length > 500) {
      errors.push("❌ Text ist zu lang (max. 500 Zeichen)");
      suggestions.push("✅ Text kürzen oder in mehrere Keys aufteilen");
    }

    if (key.includes(" ")) {
      errors.push("❌ Text-Key enthält Leerzeichen");
      suggestions.push("✅ Text-Key mit Unterstrichen formatieren");
    }

    // Deutsche Validierung
    if (language === "de") {
      if (!value.includes("ä") && value.toLowerCase().includes("ae")) {
        suggestions.push("✅ Deutsche Umlaute verwenden (ä statt ae)");
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      suggestions,
    };
  }

  async migrateStaticTexts(componentPath: string): Promise<{
    success: boolean;
    migratedKeys: string[];
    component: string;
  }> {
    try {
      // Text-Management-Agent: Statische Texte migrieren...

      const fs = require("fs");
      const content = fs.readFileSync(componentPath, "utf8");

      // Statische Texte finden und ersetzen
      let migratedContent = content;
      const migratedKeys: string[] = [];

      const textMatches = content.match(/>([^<>{]+)</g) || [];

      textMatches.forEach((match) => {
        const text = match.replace(/[><]/g, "").trim();
        if (text.length > 0 && text.length < 100) {
          const key = this.generateKeyFromText(text);
          migratedKeys.push(key);

          // Ersetze statischen Text durch TextComponent
          const replacement = `><TextComponent textKey="${key}" fallback="${text}" />`;
          migratedContent = migratedContent.replace(match, replacement);
        }
      });

      // Import hinzufügen
      if (!migratedContent.includes("import TextComponent")) {
        migratedContent = `import TextComponent from '../TextComponent';\n${migratedContent}`;
      }

      // ${migratedKeys.length} statische Texte migriert

      return {
        success: true,
        migratedKeys,
        component: migratedContent,
      };
    } catch (error) {
      // Fehler beim Migrieren der statischen Texte: ${error}
      throw error;
    }
  }

  async createTranslationFile(texts: TextData[], targetLanguage: string): Promise<string> {
    try {
      // Text-Management-Agent: Übersetzungsdatei für ${targetLanguage} erstellen...

      const translations = texts.reduce(
        (acc, text) => {
          acc[text.key] = `[${targetLanguage.toUpperCase()}] ${text.value}`;
          return acc;
        },
        {} as Record<string, string>,
      );

      const translationFile = `
// ${targetLanguage.toUpperCase()} Übersetzungen
// Erstellt: ${new Date().toISOString()}
// Automatisch generiert vom Text-Management-Agent

export const ${targetLanguage}Translations = ${JSON.stringify(translations, null, 2)};

export default ${targetLanguage}Translations;
      `;

      // Übersetzungsdatei für ${targetLanguage} erstellt
      return translationFile;
    } catch (error) {
      // Fehler beim Erstellen der Übersetzungsdatei: ${error}
      throw error;
    }
  }
}
