/**
 * 🔒 Enterprise++ Password Strength Analyzer
 *
 * Implementiert 4-Stufen-System nach Siemens/IBM/SAP Standards:
 * - Schwach (0-25%) - Rot
 * - Mittel (26-50%) - Orange
 * - Stark (51-75%) - Gelb
 * - Sehr Stark (76-100%) - Grün
 *
 * @author Lopez IT Welt Enterprise++
 * @version 1.0.0
 * @date 2025-09-19
 */

export enum PasswordStrength {
  WEAK = "weak",
  MEDIUM = "medium",
  STRONG = "strong",
  VERY_STRONG = "very_strong",
}

export interface PasswordStrengthResult {
  strength: PasswordStrength;
  score: number; // 0-100
  percentage: number; // 0-100
  color: string;
  text: string;
  icon: string;
  requirements: PasswordRequirement[];
  suggestions: string[];
}

export interface PasswordRequirement {
  text: string;
  met: boolean;
  weight: number;
}

export class PasswordStrengthAnalyzer {
  private static readonly MIN_LENGTH = 12;
  private static readonly MAX_LENGTH = 32;
  private static readonly COMMON_WORDS = [
    "password",
    "123456",
    "admin",
    "user",
    "login",
    "welcome",
    "passwort",
    "benutzer",
    "anmelden",
    "willkommen",
    "test",
    "qwerty",
    "abc123",
    "password123",
    "admin123",
    "user123",
  ];

  private static readonly PERSONAL_INFO_PATTERNS = [
    /\d{4}/, // Geburtsjahr
    /\d{2}\.\d{2}\.\d{4}/, // Geburtsdatum
    /\d{2}\/\d{2}\/\d{4}/, // Geburtsdatum US
    /\d{2}-\d{2}-\d{4}/, // Geburtsdatum ISO
  ];

  /**
   * Analysiert die Passwort-Stärke nach Enterprise-Standards
   */
  static analyze(password: string): PasswordStrengthResult {
    if (!password) {
      return this.getEmptyResult();
    }

    const requirements = this.checkRequirements(password);
    const score = this.calculateScore(password, requirements);
    const strength = this.determineStrength(score);
    const suggestions = this.generateSuggestions(password, requirements);

    // Debug-Logs (entfernt für Produktion)
    // PasswordStrengthAnalyzer:
    //   Password: ${password}
    //   Length: ${password.length}
    //   Requirements: ${requirements.map(r => `${r.text}: ${r.met} (${r.weight})`)}
    //   Score: ${score}
    //   Strength: ${strength}
    //   Color: ${this.getColor(strength)}

    return {
      strength,
      score,
      percentage: score,
      color: this.getColor(strength),
      text: this.getText(strength),
      icon: this.getIcon(strength),
      requirements,
      suggestions,
    };
  }

  /**
   * Überprüft alle Passwort-Anforderungen
   */
  private static checkRequirements(password: string): PasswordRequirement[] {
    return [
      {
        text: `Mindestens ${this.MIN_LENGTH} Zeichen`,
        met: password.length >= this.MIN_LENGTH,
        weight: 20,
      },
      {
        text: "Großbuchstaben (A-Z)",
        met: /[A-Z]/.test(password),
        weight: 15,
      },
      {
        text: "Kleinbuchstaben (a-z)",
        met: /[a-z]/.test(password),
        weight: 15,
      },
      {
        text: "Zahlen (0-9)",
        met: /\d/.test(password),
        weight: 15,
      },
      {
        text: "Sonderzeichen (!@#$%^&*)",
        met: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        weight: 20,
      },
      {
        text: "Keine aufeinanderfolgenden Zeichen",
        met: !this.hasConsecutiveChars(password),
        weight: 10,
      },
      {
        text: "Keine häufigen Wörter",
        met: !this.hasCommonWords(password),
        weight: 15,
      },
      {
        text: "Keine persönlichen Informationen",
        met: !this.hasPersonalInfo(password),
        weight: 10,
      },
    ];
  }

  /**
   * Berechnet den Passwort-Score (0-100)
   */
  private static calculateScore(password: string, requirements: PasswordRequirement[]): number {
    let score = 0;

    // Basis-Score aus Anforderungen
    requirements.forEach((req) => {
      if (req.met) {
        score += req.weight;
      }
    });

    // Bonus für Länge (nur wenn Mindestlänge erreicht)
    if (password.length >= this.MIN_LENGTH) {
      score += Math.min((password.length - this.MIN_LENGTH) * 1, 10);
    }

    // Bonus für Zeichen-Vielfalt (nur wenn Mindestlänge erreicht)
    if (password.length >= this.MIN_LENGTH) {
      const uniqueChars = new Set(password).size;
      score += Math.min(uniqueChars * 1, 10);
    }

    // Bonus für Komplexität (nur wenn Mindestlänge erreicht)
    if (password.length >= this.MIN_LENGTH) {
      const complexity = this.calculateComplexity(password);
      score += complexity * 5;
    }

    // Strafen für zu kurze Passwörter
    if (password.length < this.MIN_LENGTH) {
      score = Math.max(score - (this.MIN_LENGTH - password.length) * 10, 0);
    }

    return Math.min(Math.round(score), 100);
  }

  /**
   * Berechnet die Komplexität des Passworts
   */
  private static calculateComplexity(password: string): number {
    let complexity = 0;

    // Verschiedene Zeichen-Typen
    if (/[a-z]/.test(password)) complexity += 0.25;
    if (/[A-Z]/.test(password)) complexity += 0.25;
    if (/\d/.test(password)) complexity += 0.25;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) complexity += 0.25;

    return complexity;
  }

  /**
   * Bestimmt die Passwort-Stärke basierend auf dem Score
   */
  private static determineStrength(score: number): PasswordStrength {
    if (score >= 76) return PasswordStrength.VERY_STRONG;
    if (score >= 51) return PasswordStrength.STRONG;
    if (score >= 26) return PasswordStrength.MEDIUM;
    return PasswordStrength.WEAK;
  }

  /**
   * Prüft auf aufeinanderfolgende Zeichen
   */
  private static hasConsecutiveChars(password: string): boolean {
    for (let i = 0; i < password.length - 2; i++) {
      const char1 = password.charCodeAt(i);
      const char2 = password.charCodeAt(i + 1);
      const char3 = password.charCodeAt(i + 2);

      if (char2 === char1 + 1 && char3 === char2 + 1) {
        return true;
      }
    }
    return false;
  }

  /**
   * Prüft auf häufige Wörter
   */
  private static hasCommonWords(password: string): boolean {
    const lowerPassword = password.toLowerCase();
    return this.COMMON_WORDS.some(
      (word) =>
        lowerPassword.includes(word) || lowerPassword.includes(word.split("").reverse().join("")),
    );
  }

  /**
   * Prüft auf persönliche Informationen
   */
  private static hasPersonalInfo(password: string): boolean {
    return this.PERSONAL_INFO_PATTERNS.some((pattern) => pattern.test(password));
  }

  /**
   * Generiert Verbesserungsvorschläge
   */
  private static generateSuggestions(
    password: string,
    requirements: PasswordRequirement[],
  ): string[] {
    const suggestions: string[] = [];

    requirements.forEach((req) => {
      if (!req.met) {
        suggestions.push(req.text);
      }
    });

    if (password.length < 16) {
      suggestions.push("Verwende mindestens 16 Zeichen für maximale Sicherheit");
    }

    if (new Set(password).size < 8) {
      suggestions.push("Verwende mehr verschiedene Zeichen");
    }

    return suggestions;
  }

  /**
   * Gibt die Farbe für die Stärke zurück
   */
  private static getColor(strength: PasswordStrength): string {
    const colors = {
      [PasswordStrength.WEAK]: "bg-red-500 border-red-500 text-white",
      [PasswordStrength.MEDIUM]: "bg-orange-500 border-orange-500 text-white",
      [PasswordStrength.STRONG]: "bg-yellow-500 border-yellow-500 text-black",
      [PasswordStrength.VERY_STRONG]: "bg-green-500 border-green-500 text-white",
    };
    return colors[strength];
  }

  /**
   * Gibt den Text für die Stärke zurück
   */
  private static getText(strength: PasswordStrength): string {
    const texts = {
      [PasswordStrength.WEAK]: "Schwach",
      [PasswordStrength.MEDIUM]: "Mittel",
      [PasswordStrength.STRONG]: "Stark",
      [PasswordStrength.VERY_STRONG]: "Sehr Stark",
    };
    return texts[strength];
  }

  /**
   * Gibt das Icon für die Stärke zurück
   */
  private static getIcon(strength: PasswordStrength): string {
    const icons = {
      [PasswordStrength.WEAK]: "🔴",
      [PasswordStrength.MEDIUM]: "🟠",
      [PasswordStrength.STRONG]: "🟡",
      [PasswordStrength.VERY_STRONG]: "🟢",
    };
    return icons[strength];
  }

  /**
   * Gibt ein leeres Ergebnis zurück
   */
  private static getEmptyResult(): PasswordStrengthResult {
    return {
      strength: PasswordStrength.WEAK,
      score: 0,
      percentage: 0,
      color: "bg-gray-300 border-gray-300 text-gray-600",
      text: "Passwort eingeben",
      icon: "⚪",
      requirements: [],
      suggestions: [],
    };
  }
}
