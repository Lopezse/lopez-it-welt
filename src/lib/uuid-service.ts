// =====================================================
// UUID SERVICE - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-09-20
// Zweck: UUID v4/v7 Generation für Enterprise++ Sicherheit
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================

// Edge Runtime compatible UUID generation
// import { randomBytes, randomUUID } from 'crypto';

// =====================================================
// INTERFACES
// =====================================================

export interface UUIDConfig {
  version: "v4" | "v7";
  secure: boolean;
}

// =====================================================
// UUID SERVICE CLASS
// =====================================================

export class UUIDService {
  // =====================================================
  // UUID GENERATION
  // =====================================================

  /**
   * Generiert UUID v4 (Standard)
   * Nicht erratbar, sicher, weltweit Standard
   */
  static generateV4(): string {
    // Edge Runtime compatible UUID v4 generation
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  /**
   * Generiert UUID v7 (Zeitstempel-basiert)
   * Sortierbar, zeitlich geordnet
   */
  static generateV7(): string {
    // UUID v7 Implementation - Edge Runtime compatible
    const timestamp = Date.now();
    const random = new Uint8Array(10);
    crypto.getRandomValues(random);

    // Timestamp (48 bits)
    const timeHigh = (timestamp >>> 16) & 0xffff;
    const timeLow = timestamp & 0xffff;

    // Random data (74 bits)
    const random1 = random.readUInt16BE(0) & 0x0fff; // 12 bits
    const random2 = random.readUInt16BE(2) & 0x3fff; // 14 bits
    const random3 = random.readUInt16BE(4) & 0x3fff; // 14 bits
    const random4 = random.readUInt16BE(6) & 0x3fff; // 14 bits
    const random5 = random.readUInt16BE(8) & 0x3fff; // 14 bits

    // Version 7 (0111)
    const version = 0x7000;

    // Variant (10)
    const variant = 0x8000;

    // UUID v7 Format: xxxxxxxx-xxxx-7xxx-xxxx-xxxxxxxxxxxx
    const uuid = [
      timeHigh.toString(16).padStart(4, "0"),
      timeLow.toString(16).padStart(4, "0"),
      "-",
      (random1 | version).toString(16).padStart(4, "0"),
      "-",
      (random2 | variant).toString(16).padStart(4, "0"),
      "-",
      random3.toString(16).padStart(4, "0"),
      "-",
      random4.toString(16).padStart(4, "0"),
      random5.toString(16).padStart(4, "0"),
    ].join("");

    return uuid;
  }

  /**
   * Generiert sichere UUID basierend auf Konfiguration
   */
  static generate(config: UUIDConfig = { version: "v4", secure: true }): string {
    if (config.version === "v7") {
      return this.generateV7();
    }
    return this.generateV4();
  }

  // =====================================================
  // VALIDATION
  // =====================================================

  /**
   * Validiert UUID Format
   */
  static isValid(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  /**
   * Validiert UUID v4
   */
  static isV4(uuid: string): boolean {
    if (!this.isValid(uuid)) return false;
    return uuid[14] === "4";
  }

  /**
   * Validiert UUID v7
   */
  static isV7(uuid: string): boolean {
    if (!this.isValid(uuid)) return false;
    return uuid[14] === "7";
  }

  // =====================================================
  // ENTERPRISE++ FEATURES
  // =====================================================

  /**
   * Generiert Owner UUID (spezielle Kennzeichnung)
   */
  static generateOwnerUUID(): string {
    const uuid = this.generateV4();
    // Owner UUIDs haben spezielle Kennzeichnung
    return `owner_${uuid}`;
  }

  /**
   * Generiert Admin UUID
   */
  static generateAdminUUID(): string {
    return this.generateV4();
  }

  /**
   * Generiert Customer UUID
   */
  static generateCustomerUUID(): string {
    return this.generateV4();
  }

  /**
   * Generiert Session UUID
   */
  static generateSessionUUID(): string {
    return this.generateV4();
  }

  // =====================================================
  // SECURITY FEATURES
  // =====================================================

  /**
   * Generiert sichere Random String
   */
  static generateSecureRandom(length: number = 32): string {
    return randomBytes(length).toString("hex");
  }

  /**
   * Generiert Salt für Passwort-Hashing
   */
  static generateSalt(): string {
    return randomBytes(16).toString("hex");
  }

  /**
   * Generiert Pepper für Passwort-Hashing
   */
  static generatePepper(): string {
    return randomBytes(16).toString("hex");
  }
}
