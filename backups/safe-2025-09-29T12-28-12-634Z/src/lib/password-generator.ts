/**
 * 🔐 Enterprise++ Password Generator
 *
 * Generiert sichere Passwörter nach Enterprise-Standards:
 * - Secure Mode: Maximale Sicherheit
 * - Memorable Mode: Einprägsame Passwörter
 * - Numeric Mode: Nur Zahlen
 * - Alphanumeric Mode: Buchstaben und Zahlen
 *
 * @author Lopez IT Welt Enterprise++
 * @version 1.0.0
 * @date 2025-09-19
 */

export enum PasswordGeneratorMode {
  SECURE = "secure",
  MEMORABLE = "memorable",
  NUMERIC = "numeric",
  ALPHANUMERIC = "alphanumeric",
}

export interface PasswordGeneratorOptions {
  mode: PasswordGeneratorMode;
  length: number;
  includeSpecialChars: boolean;
  excludeSimilarChars: boolean;
  excludeAmbiguousChars: boolean;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
}

export interface GeneratedPassword {
  password: string;
  strength: number; // 0-100
  entropy: number; // Bits
  mode: PasswordGeneratorMode;
  options: PasswordGeneratorOptions;
}

export class PasswordGenerator {
  private static readonly DEFAULT_LENGTH = 16;
  private static readonly MIN_LENGTH = 8;
  private static readonly MAX_LENGTH = 64;

  // Zeichen-Sets
  private static readonly LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
  private static readonly UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  private static readonly NUMBERS = "0123456789";
  private static readonly SPECIAL_CHARS = '!@#$%^&*(),.?":{}|<>';

  // Ähnliche Zeichen (verwirrend)
  private static readonly SIMILAR_CHARS = "il1Lo0O";

  // Mehrdeutige Zeichen
  private static readonly AMBIGUOUS_CHARS = "{}[]()\/~,;.<>";

  // Wörter für memorable Passwörter
  private static readonly WORDS = [
    "secure",
    "password",
    "access",
    "system",
    "enterprise",
    "digital",
    "technology",
    "innovation",
    "solution",
    "service",
    "management",
    "security",
    "protection",
    "authentication",
    "verification",
    "encryption",
    "confidential",
    "private",
    "sicher",
    "passwort",
    "zugang",
    "system",
    "unternehmen",
    "digital",
    "technologie",
    "innovation",
    "lösung",
    "dienst",
    "verwaltung",
    "sicherheit",
    "schutz",
    "authentifizierung",
    "verifikation",
    "verschlüsselung",
    "vertraulich",
    "privat",
  ];

  /**
   * Generiert ein Passwort nach den angegebenen Optionen
   */
  static generate(options: Partial<PasswordGeneratorOptions> = {}): GeneratedPassword {
    const fullOptions = this.mergeWithDefaults(options);
    const password = this.generatePassword(fullOptions);
    const strength = this.calculateStrength(password);
    const entropy = this.calculateEntropy(password);

    return {
      password,
      strength,
      entropy,
      mode: fullOptions.mode,
      options: fullOptions,
    };
  }

  /**
   * Generiert ein Passwort im Secure Mode
   */
  static generateSecure(length: number = this.DEFAULT_LENGTH): GeneratedPassword {
    return this.generate({
      mode: PasswordGeneratorMode.SECURE,
      length,
      includeSpecialChars: true,
      excludeSimilarChars: true,
      excludeAmbiguousChars: true,
      includeUppercase: true,
      includeLowercase: true,
      includeNumbers: true,
    });
  }

  /**
   * Generiert ein einprägsames Passwort
   */
  static generateMemorable(length: number = this.DEFAULT_LENGTH): GeneratedPassword {
    return this.generate({
      mode: PasswordGeneratorMode.MEMORABLE,
      length,
      includeSpecialChars: true,
      excludeSimilarChars: true,
      excludeAmbiguousChars: false,
      includeUppercase: true,
      includeLowercase: true,
      includeNumbers: true,
    });
  }

  /**
   * Generiert ein numerisches Passwort
   */
  static generateNumeric(length: number = this.DEFAULT_LENGTH): GeneratedPassword {
    return this.generate({
      mode: PasswordGeneratorMode.NUMERIC,
      length,
      includeSpecialChars: false,
      excludeSimilarChars: false,
      excludeAmbiguousChars: false,
      includeUppercase: false,
      includeLowercase: false,
      includeNumbers: true,
    });
  }

  /**
   * Generiert ein alphanumerisches Passwort
   */
  static generateAlphanumeric(length: number = this.DEFAULT_LENGTH): GeneratedPassword {
    return this.generate({
      mode: PasswordGeneratorMode.ALPHANUMERIC,
      length,
      includeSpecialChars: false,
      excludeSimilarChars: true,
      excludeAmbiguousChars: false,
      includeUppercase: true,
      includeLowercase: true,
      includeNumbers: true,
    });
  }

  /**
   * Generiert das eigentliche Passwort
   */
  private static generatePassword(options: PasswordGeneratorOptions): string {
    switch (options.mode) {
      case PasswordGeneratorMode.SECURE:
        return this.generateSecurePassword(options);
      case PasswordGeneratorMode.MEMORABLE:
        return this.generateMemorablePassword(options);
      case PasswordGeneratorMode.NUMERIC:
        return this.generateNumericPassword(options);
      case PasswordGeneratorMode.ALPHANUMERIC:
        return this.generateAlphanumericPassword(options);
      default:
        return this.generateSecurePassword(options);
    }
  }

  /**
   * Generiert ein sicheres Passwort
   */
  private static generateSecurePassword(options: PasswordGeneratorOptions): string {
    let charset = "";

    if (options.includeLowercase) charset += this.LOWERCASE;
    if (options.includeUppercase) charset += this.UPPERCASE;
    if (options.includeNumbers) charset += this.NUMBERS;
    if (options.includeSpecialChars) charset += this.SPECIAL_CHARS;

    // Ähnliche Zeichen entfernen
    if (options.excludeSimilarChars) {
      charset = this.removeChars(charset, this.SIMILAR_CHARS);
    }

    // Mehrdeutige Zeichen entfernen
    if (options.excludeAmbiguousChars) {
      charset = this.removeChars(charset, this.AMBIGUOUS_CHARS);
    }

    return this.randomString(charset, options.length);
  }

  /**
   * Generiert ein einprägsames Passwort
   */
  private static generateMemorablePassword(options: PasswordGeneratorOptions): string {
    const words = this.WORDS.filter((word) => word.length <= 8);
    const wordCount = Math.floor(options.length / 6); // ~6 Zeichen pro Wort
    const remainingLength = options.length - wordCount * 6;

    let password = "";

    // Wörter hinzufügen
    for (let i = 0; i < wordCount; i++) {
      const word = words[Math.floor(Math.random() * words.length)];
      password += this.capitalizeFirst(word);
    }

    // Zusätzliche Zeichen hinzufügen
    if (remainingLength > 0) {
      let charset = "";
      if (options.includeNumbers) charset += this.NUMBERS;
      if (options.includeSpecialChars) charset += this.SPECIAL_CHARS;

      if (charset) {
        password += this.randomString(charset, remainingLength);
      }
    }

    return password.substring(0, options.length);
  }

  /**
   * Generiert ein numerisches Passwort
   */
  private static generateNumericPassword(options: PasswordGeneratorOptions): string {
    return this.randomString(this.NUMBERS, options.length);
  }

  /**
   * Generiert ein alphanumerisches Passwort
   */
  private static generateAlphanumericPassword(options: PasswordGeneratorOptions): string {
    let charset = "";

    if (options.includeLowercase) charset += this.LOWERCASE;
    if (options.includeUppercase) charset += this.UPPERCASE;
    if (options.includeNumbers) charset += this.NUMBERS;

    // Ähnliche Zeichen entfernen
    if (options.excludeSimilarChars) {
      charset = this.removeChars(charset, this.SIMILAR_CHARS);
    }

    return this.randomString(charset, options.length);
  }

  /**
   * Generiert eine zufällige Zeichenkette
   */
  private static randomString(charset: string, length: number): string {
    let result = "";
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return result;
  }

  /**
   * Entfernt Zeichen aus einem Zeichensatz
   */
  private static removeChars(charset: string, charsToRemove: string): string {
    return charset
      .split("")
      .filter((char) => !charsToRemove.includes(char))
      .join("");
  }

  /**
   * Macht den ersten Buchstaben groß
   */
  private static capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  /**
   * Berechnet die Passwort-Stärke (0-100)
   */
  private static calculateStrength(password: string): number {
    let score = 0;

    // Länge
    if (password.length >= 8) score += 20;
    if (password.length >= 12) score += 20;
    if (password.length >= 16) score += 20;

    // Zeichen-Typen
    if (/[a-z]/.test(password)) score += 10;
    if (/[A-Z]/.test(password)) score += 10;
    if (/\d/.test(password)) score += 10;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 10;

    return Math.min(score, 100);
  }

  /**
   * Berechnet die Entropie in Bits
   */
  private static calculateEntropy(password: string): number {
    const charset = this.getCharset(password);
    const length = password.length;
    return Math.log2(Math.pow(charset.length, length));
  }

  /**
   * Ermittelt den verwendeten Zeichensatz
   */
  private static getCharset(password: string): string {
    let charset = "";
    if (/[a-z]/.test(password)) charset += this.LOWERCASE;
    if (/[A-Z]/.test(password)) charset += this.UPPERCASE;
    if (/\d/.test(password)) charset += this.NUMBERS;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) charset += this.SPECIAL_CHARS;
    return charset;
  }

  /**
   * Füllt Optionen mit Standardwerten auf
   */
  private static mergeWithDefaults(
    options: Partial<PasswordGeneratorOptions>,
  ): PasswordGeneratorOptions {
    return {
      mode: options.mode || PasswordGeneratorMode.SECURE,
      length: Math.max(
        Math.min(options.length || this.DEFAULT_LENGTH, this.MAX_LENGTH),
        this.MIN_LENGTH,
      ),
      includeSpecialChars: options.includeSpecialChars ?? true,
      excludeSimilarChars: options.excludeSimilarChars ?? true,
      excludeAmbiguousChars: options.excludeAmbiguousChars ?? true,
      includeUppercase: options.includeUppercase ?? true,
      includeLowercase: options.includeLowercase ?? true,
      includeNumbers: options.includeNumbers ?? true,
    };
  }
}
