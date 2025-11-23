#!/usr/bin/env node

/**
 * 🧠 Agenten-System für Lopez IT Welt
 *
 * **Zweck:** Automatische Verarbeitung und Analyse aller .md-Dateien
 * **Status:** Aktiv
 * **Version:** 1.0.0
 * **Datum:** 2025-07-05
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// 🧠 AGENTEN-GEDÄCHTNIS-SYSTEM
class AgentenGedaechtnis {
  constructor() {
    this.gedaechtnisDatei = "./data/agenten-gedaechtnis.json";
    this.aktivitaetenLog = "./data/agenten-aktivitaeten.log";
    this.offeneAufgaben = "./data/offene-aufgaben.json";
    this.initGedaechtnis();
  }

  /**
   * Gedächtnis initialisieren
   */
  initGedaechtnis() {
    if (!fs.existsSync("./data")) {
      fs.mkdirSync("./data", { recursive: true });
    }

    if (!fs.existsSync(this.gedaechtnisDatei)) {
      const initialGedaechtnis = {
        version: "1.0.0",
        erstellt: new Date().toISOString(),
        letzteAktualisierung: new Date().toISOString(),
        analysierteDateien: [],
        gefundeneInformationen: {},
        offeneAufgaben: [],
        abgeschlosseneAufgaben: [],
        systemStatus: "aktiv",
        systemErkenntnisse: {
          contentManagement: {
            status: "teilweise_implementiert",
            erkenntnisse: [
              "Datenbank-API existiert: src/app/api/admin/texts/route.ts",
              "Admin-Interface existiert: src/app/admin/texts/page.tsx",
              "i18n-System existiert: src/components/Features/I18nProvider.tsx",
              "Fehlende Verbindung: i18n lädt aus statischen JSON-Dateien, nicht aus Datenbank",
              "Fehlende Public API: Kein /api/texts Endpunkt für Frontend",
              "Mock-Daten vorhanden: Umfangreiche Testdaten mit mehrsprachigen Texten",
            ],
            naechsteSchritte: [
              "Public API erstellen: /api/texts für Frontend-Zugriff",
              "i18n-System erweitern für Datenbank-Loading",
              "Echte Datenbank-Integration implementieren",
              "Dynamisches Laden zur Laufzeit aktivieren",
            ],
            prioritaet: "hoch",
            kategorie: "content-management",
          },
          datenbankTechnologie: {
            status: "definiert",
            erkenntnisse: [
              "Datenbank-Technologie: XAMPP MySQL",
              "Entwicklungsumgebung: XAMPP mit MySQL",
              "MySQL-Pfad: C:\\xampp\\mysql",
              "Host: localhost (Standard XAMPP)",
              "Port: 3306 (Standard MySQL)",
              "Benutzer: root (Standard XAMPP)",
              "Passwort: leer (Standard XAMPP)",
              "Datenbank: lopez_it_welt (zu erstellen)",
              "XAMPP-Installation: C:\\xampp\\",
            ],
            naechsteSchritte: [
              "MySQL-Verbindung in API implementieren",
              "Datenbank-Schema für site_texts erstellen",
              "XAMPP MySQL-Integration testen",
              "Produktions-Datenbank konfigurieren",
              "MySQL-Pfad in Konfiguration verwenden",
            ],
            prioritaet: "hoch",
            kategorie: "datenbank",
          },
          technischeArchitektur: {
            vorhandeneKomponenten: [
              "src/app/api/admin/texts/route.ts - Vollständige CRUD-API",
              "src/app/admin/texts/page.tsx - Admin-Interface",
              "src/components/Features/I18nProvider.tsx - i18n-System",
              "src/i18n/locales/ - Statische Übersetzungsdateien",
            ],
            fehlendeKomponenten: [
              "src/app/api/texts/route.ts - Public API für Frontend",
              "Datenbank-Integration im i18n-System",
              "Dynamisches Laden zur Laufzeit",
              "XAMPP MySQL-Verbindung",
            ],
          },
        },
        aktivitaeten: [],
        letzteAktualisierung: new Date().toISOString(),
      };
      fs.writeFileSync(this.gedaechtnisDatei, JSON.stringify(initialGedaechtnis, null, 2));
    }
  }

  /**
   * Gedächtnis laden
   */
  ladeGedaechtnis() {
    try {
      const data = fs.readFileSync(this.gedaechtnisDatei, "utf8");
      return JSON.parse(data);
    } catch (error) {
      console.error("❌ Fehler beim Laden des Gedächtnisses:", error);
      return null;
    }
  }

  /**
   * Gedächtnis speichern
   */
  speichereGedaechtnis(gedaechtnis) {
    try {
      gedaechtnis.letzteAktualisierung = new Date().toISOString();
      fs.writeFileSync(this.gedaechtnisDatei, JSON.stringify(gedaechtnis, null, 2));
      return true;
    } catch (error) {
      console.error("❌ Fehler beim Speichern des Gedächtnisses:", error);
      return false;
    }
  }

  /**
   * Aktivität protokollieren
   */
  protokolliereAktivitaet(aktivitaet) {
    const timestamp = new Date().toISOString();
    const logEintrag = `[${timestamp}] ${aktivitaet}\n`;

    try {
      fs.appendFileSync(this.aktivitaetenLog, logEintrag);
    } catch (error) {
      console.error("❌ Fehler beim Protokollieren:", error);
    }
  }

  /**
   * Offene Aufgabe hinzufügen
   */
  fuegeOffeneAufgabeHinzu(aufgabe) {
    const gedaechtnis = this.ladeGedaechtnis();
    if (gedaechtnis) {
      const neueAufgabe = {
        id: crypto.randomUUID(),
        aufgabe: aufgabe,
        erstellt: new Date().toISOString(),
        status: "offen",
        prioritaet: "normal",
      };

      gedaechtnis.offeneAufgaben.push(neueAufgabe);
      this.speichereGedaechtnis(gedaechtnis);
      this.protokolliereAktivitaet(`Neue offene Aufgabe hinzugefügt: ${aufgabe}`);
    }
  }

  /**
   * Aufgabe als abgeschlossen markieren
   */
  markiereAufgabeAbgeschlossen(aufgabenId) {
    const gedaechtnis = this.ladeGedaechtnis();
    if (gedaechtnis) {
      const aufgabeIndex = gedaechtnis.offeneAufgaben.findIndex((a) => a.id === aufgabenId);
      if (aufgabeIndex !== -1) {
        const aufgabe = gedaechtnis.offeneAufgaben[aufgabeIndex];
        aufgabe.status = "abgeschlossen";
        aufgabe.abgeschlossen = new Date().toISOString();

        gedaechtnis.abgeschlosseneAufgaben.push(aufgabe);
        gedaechtnis.offeneAufgaben.splice(aufgabeIndex, 1);

        this.speichereGedaechtnis(gedaechtnis);
        this.protokolliereAktivitaet(`Aufgabe abgeschlossen: ${aufgabe.aufgabe}`);
      }
    }
  }

  /**
   * System-Erkenntnis hinzufügen
   */
  fuegeSystemErkenntnisHinzu(kategorie, erkenntnis) {
    const gedaechtnis = this.ladeGedaechtnis();

    if (!gedaechtnis.systemErkenntnisse) {
      gedaechtnis.systemErkenntnisse = {};
    }

    if (!gedaechtnis.systemErkenntnisse[kategorie]) {
      gedaechtnis.systemErkenntnisse[kategorie] = {
        erkenntnisse: [],
        naechsteSchritte: [],
        prioritaet: "normal",
        status: "unbekannt",
      };
    }

    gedaechtnis.systemErkenntnisse[kategorie].erkenntnisse.push({
      text: erkenntnis,
      timestamp: new Date().toISOString(),
    });

    this.speichereGedaechtnis(gedaechtnis);
  }

  /**
   * Nächsten Schritt hinzufügen
   */
  fuegeNaechstenSchrittHinzu(kategorie, schritt) {
    const gedaechtnis = this.ladeGedaechtnis();

    if (!gedaechtnis.systemErkenntnisse) {
      gedaechtnis.systemErkenntnisse = {};
    }

    if (!gedaechtnis.systemErkenntnisse[kategorie]) {
      gedaechtnis.systemErkenntnisse[kategorie] = {
        erkenntnisse: [],
        naechsteSchritte: [],
        prioritaet: "normal",
        status: "unbekannt",
      };
    }

    gedaechtnis.systemErkenntnisse[kategorie].naechsteSchritte.push({
      text: schritt,
      timestamp: new Date().toISOString(),
      status: "offen",
    });

    this.speichereGedaechtnis(gedaechtnis);
  }
}

// 🔍 .MD-DATEI-ANALYSATOR
class MdDateiAnalysator {
  constructor(gedaechtnis) {
    this.gedaechtnis = gedaechtnis;
  }

  /**
   * Alle .md-Dateien finden
   */
  findeAlleMdDateien(verzeichnis = ".") {
    const mdDateien = [];

    function durchsucheVerzeichnis(dir) {
      try {
        const eintraege = fs.readdirSync(dir);

        for (const eintrag of eintraege) {
          const vollerPfad = path.join(dir, eintrag);
          const stat = fs.statSync(vollerPfad);

          if (stat.isDirectory() && !eintrag.startsWith(".") && eintrag !== "node_modules") {
            durchsucheVerzeichnis(vollerPfad);
          } else if (eintrag.endsWith(".md")) {
            mdDateien.push(vollerPfad);
          }
        }
      } catch (error) {
        console.error(`❌ Fehler beim Durchsuchen von ${dir}:`, error);
      }
    }

    durchsucheVerzeichnis(verzeichnis);
    return mdDateien;
  }

  /**
   * .md-Datei analysieren
   */
  analysiereMdDatei(dateiPfad) {
    try {
      const inhalt = fs.readFileSync(dateiPfad, "utf8");
      const stat = fs.statSync(dateiPfad);

      const analyse = {
        pfad: dateiPfad,
        groesse: stat.size,
        zeilen: inhalt.split("\n").length,
        letzteAenderung: stat.mtime.toISOString(),
        hash: crypto.createHash("md5").update(inhalt).digest("hex"),
        titel: this.extrahiereTitel(inhalt),
        kategorien: this.extrahiereKategorien(inhalt),
        schluesselwoerter: this.extrahiereSchluesselwoerter(inhalt),
        status: this.analysiereStatus(inhalt),
        prioritaet: this.bestimmePrioritaet(inhalt),
      };

      return analyse;
    } catch (error) {
      console.error(`❌ Fehler beim Analysieren von ${dateiPfad}:`, error);
      return null;
    }
  }

  /**
   * Titel aus .md-Datei extrahieren
   */
  extrahiereTitel(inhalt) {
    const titelMatch = inhalt.match(/^#\s+(.+)$/m);
    return titelMatch ? titelMatch[1].trim() : "Unbekannter Titel";
  }

  /**
   * Kategorien aus .md-Datei extrahieren
   */
  extrahiereKategorien(inhalt) {
    const kategorien = [];

    // Enterprise++ Kategorien
    if (inhalt.includes("Enterprise++") || inhalt.includes("enterprise")) {
      kategorien.push("enterprise");
    }

    // Projekt-Management Kategorien
    if (inhalt.includes("Projekt") || inhalt.includes("Status") || inhalt.includes("Roadmap")) {
      kategorien.push("projekt-management");
    }

    // Technische Kategorien
    if (inhalt.includes("API") || inhalt.includes("Datenbank") || inhalt.includes("Deployment")) {
      kategorien.push("technisch");
    }

    // Admin-Bereich Kategorien
    if (
      inhalt.includes("Admin") ||
      inhalt.includes("Dashboard") ||
      inhalt.includes("Zeiterfassung")
    ) {
      kategorien.push("admin");
    }

    // KI-Agenten Kategorien
    if (inhalt.includes("KI") || inhalt.includes("Agent") || inhalt.includes("Gedächtnis")) {
      kategorien.push("ki-agenten");
    }

    // Erweiterte Kategorien mit Content-Management
    if (
      inhalt.includes("Content-Management") ||
      inhalt.includes("CMS") ||
      inhalt.includes("Webseite") ||
      inhalt.includes("Text") ||
      inhalt.includes("Dynamisch")
    ) {
      kategorien.push("content-management");
    }

    return kategorien;
  }

  /**
   * Schlüsselwörter aus .md-Datei extrahieren
   */
  extrahiereSchluesselwoerter(inhalt) {
    const woerter = inhalt
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter((wort) => wort.length > 3)
      .filter(
        (wort) =>
          ![
            "und",
            "der",
            "die",
            "das",
            "den",
            "dem",
            "des",
            "eine",
            "einer",
            "eines",
            "mit",
            "von",
            "für",
            "auf",
            "in",
            "an",
            "bei",
            "seit",
            "nach",
            "vor",
            "über",
            "unter",
            "zwischen",
            "durch",
            "ohne",
            "gegen",
            "um",
            "wegen",
            "trotz",
            "während",
            "innerhalb",
            "außerhalb",
          ].includes(wort),
      );

    // Häufigste Wörter finden
    const wortHaeufigkeit = {};
    woerter.forEach((wort) => {
      wortHaeufigkeit[wort] = (wortHaeufigkeit[wort] || 0) + 1;
    });

    return Object.entries(wortHaeufigkeit)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([wort, anzahl]) => ({ wort, anzahl }));
  }

  /**
   * Status aus .md-Datei analysieren
   */
  analysiereStatus(inhalt) {
    if (inhalt.includes("✅") || inhalt.includes("ABGESCHLOSSEN")) {
      return "abgeschlossen";
    } else if (inhalt.includes("🚧") || inhalt.includes("IN ENTWICKLUNG")) {
      return "in_entwicklung";
    } else if (inhalt.includes("❌") || inhalt.includes("FEHLER")) {
      return "fehler";
    } else if (inhalt.includes("⚠️") || inhalt.includes("WARNUNG")) {
      return "warnung";
    } else {
      return "unbekannt";
    }
  }

  /**
   * Priorität bestimmen
   */
  bestimmePrioritaet(inhalt) {
    if (inhalt.includes("KRITISCH") || inhalt.includes("WICHTIG")) {
      return "hoch";
    } else if (inhalt.includes("NORMAL") || inhalt.includes("Standard")) {
      return "normal";
    } else if (inhalt.includes("NIEDRIG") || inhalt.includes("Optional")) {
      return "niedrig";
    } else {
      return "normal";
    }
  }
}

class ComplianceAgent {
  constructor(gedaechtnis) {
    this.gedaechtnis = gedaechtnis;
    this.regeln = [];
    this.gesetze = [];
    this.kiRichtlinien = [];
    this.idRegeln = [];
    this.klassenRegeln = [];
    this.complianceStatus = "unbekannt";
  }

  /**
   * Alle Arten von Regeln und Gesetzen aus .md-Dateien extrahieren
   */
  extrahiereRegelnUndGesetze(dateien) {
    const regeln = [];
    const gesetze = [];
    const kiRichtlinien = [];
    const idRegeln = [];
    const klassenRegeln = [];

    dateien.forEach((datei) => {
      // Prüfe ob datei.inhalt existiert
      if (!datei.inhalt) {
        console.warn(`Warnung: Kein Inhalt für Datei ${datei.pfad}`);
        return;
      }

      const inhalt = datei.inhalt.toLowerCase();

      // Allgemeine Regeln extrahieren
      if (
        inhalt.includes("regel") ||
        inhalt.includes("richtlinie") ||
        inhalt.includes("vorschrift") ||
        inhalt.includes("standard")
      ) {
        const regelMatches = inhalt.match(
          /(?:regel|richtlinie|vorschrift|standard)[:\s]*([^.\n]+)/gi,
        );
        if (regelMatches) {
          regelMatches.forEach((match) => {
            regeln.push({
              quelle: datei.pfad,
              regel: match.trim(),
              prioritaet: this.bestimmeRegelPrioritaet(match),
              status: "aktiv",
              typ: "allgemein",
            });
          });
        }
      }

      // ID-Regeln extrahieren
      if (
        inhalt.includes("id") ||
        inhalt.includes("identifier") ||
        inhalt.includes("namenskonvention")
      ) {
        const idMatches = inhalt.match(/(?:id|identifier|namenskonvention)[:\s]*([^.\n]+)/gi);
        if (idMatches) {
          idMatches.forEach((match) => {
            idRegeln.push({
              quelle: datei.pfad,
              regel: match.trim(),
              prioritaet: this.bestimmeRegelPrioritaet(match),
              status: "aktiv",
              typ: "id",
            });
          });
        }
      }

      // Klassen-Regeln extrahieren
      if (
        inhalt.includes("klasse") ||
        inhalt.includes("class") ||
        inhalt.includes("struktur") ||
        inhalt.includes("architektur")
      ) {
        const klassenMatches = inhalt.match(
          /(?:klasse|class|struktur|architektur)[:\s]*([^.\n]+)/gi,
        );
        if (klassenMatches) {
          klassenMatches.forEach((match) => {
            klassenRegeln.push({
              quelle: datei.pfad,
              regel: match.trim(),
              prioritaet: this.bestimmeRegelPrioritaet(match),
              status: "aktiv",
              typ: "klasse",
            });
          });
        }
      }

      // KI-Richtlinien extrahieren
      if (
        inhalt.includes("ki") ||
        inhalt.includes("ai") ||
        inhalt.includes("intelligence") ||
        inhalt.includes("agent") ||
        inhalt.includes("automation")
      ) {
        const kiMatches = inhalt.match(/(?:ki|ai|intelligence|agent|automation)[:\s]*([^.\n]+)/gi);
        if (kiMatches) {
          kiMatches.forEach((match) => {
            kiRichtlinien.push({
              quelle: datei.pfad,
              regel: match.trim(),
              prioritaet: this.bestimmeRegelPrioritaet(match),
              status: "aktiv",
              typ: "ki",
            });
          });
        }
      }

      // Gesetze extrahieren
      if (
        inhalt.includes("gesetz") ||
        inhalt.includes("dsgvo") ||
        inhalt.includes("gdpr") ||
        inhalt.includes("compliance") ||
        inhalt.includes("recht") ||
        inhalt.includes("legal")
      ) {
        const gesetzMatches = inhalt.match(
          /(?:gesetz|dsgvo|gdpr|compliance|recht|legal)[:\s]*([^.\n]+)/gi,
        );
        if (gesetzMatches) {
          gesetzMatches.forEach((match) => {
            gesetze.push({
              quelle: datei.pfad,
              gesetz: match.trim(),
              prioritaet: "hoch", // Gesetze sind immer hoch-prioritär
              status: "aktiv",
              typ: "gesetz",
            });
          });
        }
      }

      // Deutsche Namenskonventionen
      if (inhalt.includes("deutsche") || inhalt.includes("german") || inhalt.includes("sprache")) {
        const sprachMatches = inhalt.match(/(?:deutsche|german|sprache)[:\s]*([^.\n]+)/gi);
        if (sprachMatches) {
          sprachMatches.forEach((match) => {
            regeln.push({
              quelle: datei.pfad,
              regel: match.trim(),
              prioritaet: "hoch",
              status: "aktiv",
              typ: "sprache",
            });
          });
        }
      }

      // Qualitätsrichtlinien
      if (
        inhalt.includes("qualität") ||
        inhalt.includes("quality") ||
        inhalt.includes("standard")
      ) {
        const qualitaetMatches = inhalt.match(/(?:qualität|quality|standard)[:\s]*([^.\n]+)/gi);
        if (qualitaetMatches) {
          qualitaetMatches.forEach((match) => {
            regeln.push({
              quelle: datei.pfad,
              regel: match.trim(),
              prioritaet: this.bestimmeRegelPrioritaet(match),
              status: "aktiv",
              typ: "qualitaet",
            });
          });
        }
      }

      // Sicherheitsrichtlinien
      if (
        inhalt.includes("sicherheit") ||
        inhalt.includes("security") ||
        inhalt.includes("schutz")
      ) {
        const sicherheitMatches = inhalt.match(/(?:sicherheit|security|schutz)[:\s]*([^.\n]+)/gi);
        if (sicherheitMatches) {
          sicherheitMatches.forEach((match) => {
            regeln.push({
              quelle: datei.pfad,
              regel: match.trim(),
              prioritaet: "hoch",
              status: "aktiv",
              typ: "sicherheit",
            });
          });
        }
      }

      // Enterprise-Richtlinien
      if (
        inhalt.includes("enterprise") ||
        inhalt.includes("business") ||
        inhalt.includes("unternehmen")
      ) {
        const enterpriseMatches = inhalt.match(
          /(?:enterprise|business|unternehmen)[:\s]*([^.\n]+)/gi,
        );
        if (enterpriseMatches) {
          enterpriseMatches.forEach((match) => {
            regeln.push({
              quelle: datei.pfad,
              regel: match.trim(),
              prioritaet: this.bestimmeRegelPrioritaet(match),
              status: "aktiv",
              typ: "enterprise",
            });
          });
        }
      }
    });

    this.regeln = regeln;
    this.gesetze = gesetze;
    this.kiRichtlinien = kiRichtlinien;
    this.idRegeln = idRegeln;
    this.klassenRegeln = klassenRegeln;

    return {
      regeln,
      gesetze,
      kiRichtlinien,
      idRegeln,
      klassenRegeln,
    };
  }

  /**
   * Priorität einer Regel bestimmen
   */
  bestimmeRegelPrioritaet(regel) {
    const regelText = regel.toLowerCase();

    if (
      regelText.includes("kritisch") ||
      regelText.includes("wichtig") ||
      regelText.includes("muss") ||
      regelText.includes("pflicht")
    ) {
      return "hoch";
    } else if (
      regelText.includes("soll") ||
      regelText.includes("empfohlen") ||
      regelText.includes("best practice")
    ) {
      return "normal";
    } else if (regelText.includes("optional") || regelText.includes("kann")) {
      return "niedrig";
    } else {
      return "normal";
    }
  }

  /**
   * Compliance-Status prüfen
   */
  pruefeCompliance(aktuelleAktivitaet) {
    const verstoesse = [];
    const warnungen = [];

    // Prüfe gegen alle Regeltypen
    const alleRegeln = [
      ...this.regeln,
      ...this.kiRichtlinien,
      ...this.idRegeln,
      ...this.klassenRegeln,
    ];

    alleRegeln.forEach((regel) => {
      if (regel.status === "aktiv") {
        const complianceCheck = this.pruefeRegelCompliance(regel, aktuelleAktivitaet);
        if (complianceCheck.verstoß) {
          verstoesse.push({
            regel: regel.regel,
            quelle: regel.quelle,
            typ: regel.typ,
            verstoß: complianceCheck.verstoß,
            prioritaet: regel.prioritaet,
          });
        }
        if (complianceCheck.warnung) {
          warnungen.push({
            regel: regel.regel,
            quelle: regel.quelle,
            typ: regel.typ,
            warnung: complianceCheck.warnung,
            prioritaet: regel.prioritaet,
          });
        }
      }
    });

    // Prüfe gegen Gesetze
    this.gesetze.forEach((gesetz) => {
      if (gesetz.status === "aktiv") {
        const complianceCheck = this.pruefeGesetzCompliance(gesetz, aktuelleAktivitaet);
        if (complianceCheck.verstoß) {
          verstoesse.push({
            gesetz: gesetz.gesetz,
            quelle: gesetz.quelle,
            typ: gesetz.typ,
            verstoß: complianceCheck.verstoß,
            prioritaet: "kritisch", // Gesetzesverstoß ist immer kritisch
          });
        }
      }
    });

    this.complianceStatus =
      verstoesse.length > 0 ? "verstoß" : warnungen.length > 0 ? "warnung" : "konform";

    return {
      status: this.complianceStatus,
      verstoesse,
      warnungen,
      regeln: this.regeln.length,
      gesetze: this.gesetze.length,
      kiRichtlinien: this.kiRichtlinien.length,
      idRegeln: this.idRegeln.length,
      klassenRegeln: this.klassenRegeln.length,
    };
  }

  /**
   * Prüfe Regel-Compliance (erweitert)
   */
  pruefeRegelCompliance(regel, aktivitaet) {
    const regelText = regel.regel.toLowerCase();
    const aktivitaetText = aktivitaet.toLowerCase();

    // Sprach-Compliance
    if (regel.typ === "sprache" && !aktivitaetText.includes("deutsch")) {
      return { verstoß: "Nicht auf Deutsch kommuniziert" };
    }

    // ID-Compliance
    if (regel.typ === "id") {
      if (regelText.includes("camelcase") && /[A-Z][a-z]/.test(aktivitaetText)) {
        return {
          warnung: "CamelCase-Namenskonvention möglicherweise nicht eingehalten",
        };
      }
      if (regelText.includes("snake_case") && /_/.test(aktivitaetText)) {
        return {
          warnung: "Snake_case-Namenskonvention möglicherweise nicht eingehalten",
        };
      }
    }

    // Klassen-Compliance
    if (regel.typ === "klasse") {
      if (regelText.includes("klasse") && aktivitaetText.includes("function")) {
        return { warnung: "Klassen-Struktur möglicherweise nicht eingehalten" };
      }
    }

    // KI-Compliance
    if (regel.typ === "ki") {
      if (regelText.includes("agent") && !aktivitaetText.includes("agent")) {
        return {
          warnung: "KI-Agenten-Richtlinien möglicherweise nicht eingehalten",
        };
      }
      if (regelText.includes("gedächtnis") && !aktivitaetText.includes("gedächtnis")) {
        return {
          warnung: "KI-Gedächtnis-Richtlinien möglicherweise nicht eingehalten",
        };
      }
    }

    // Qualitäts-Compliance
    if (regel.typ === "qualitaet") {
      if (regelText.includes("qualität") && aktivitaetText.includes("fehler")) {
        return {
          warnung: "Qualitätsstandards möglicherweise nicht eingehalten",
        };
      }
    }

    // Sicherheits-Compliance
    if (regel.typ === "sicherheit") {
      if (regelText.includes("sicherheit") && aktivitaetText.includes("passwort")) {
        return { verstoß: "Sicherheitsrichtlinien möglicherweise verletzt" };
      }
    }

    // Enterprise-Compliance
    if (regel.typ === "enterprise") {
      if (regelText.includes("enterprise") && aktivitaetText.includes("test")) {
        return {
          warnung: "Enterprise-Standards möglicherweise nicht eingehalten",
        };
      }
    }

    return { verstoß: null, warnung: null };
  }

  /**
   * Prüfe Gesetz-Compliance
   */
  pruefeGesetzCompliance(gesetz, aktivitaet) {
    const gesetzText = gesetz.gesetz.toLowerCase();
    const aktivitaetText = aktivitaet.toLowerCase();

    // DSGVO/GDPR Prüfungen
    if (gesetzText.includes("dsgvo") || gesetzText.includes("gdpr")) {
      if (aktivitaetText.includes("personendaten") && !aktivitaetText.includes("einwilligung")) {
        return {
          verstoß: "DSGVO: Personendaten ohne Einwilligung verarbeitet",
        };
      }
    }

    return { verstoß: null, warnung: null };
  }

  /**
   * Compliance-Report generieren
   */
  generiereComplianceReport() {
    return {
      status: this.complianceStatus,
      regeln: this.regeln.length,
      gesetze: this.gesetze.length,
      kiRichtlinien: this.kiRichtlinien.length,
      idRegeln: this.idRegeln.length,
      klassenRegeln: this.klassenRegeln.length,
      verstoesse: this.letzteCompliancePruefung?.verstoesse || [],
      warnungen: this.letzteCompliancePruefung?.warnungen || [],
      timestamp: new Date().toISOString(),
    };
  }
}

// 🤖 AGENTEN-SYSTEM
class AgentenSystem {
  constructor() {
    this.gedaechtnis = new AgentenGedaechtnis();
    this.analysator = new MdDateiAnalysator(this.gedaechtnis);
    this.complianceAgent = new ComplianceAgent(this.gedaechtnis);
  }

  /**
   * Vollständige System-Analyse mit Compliance-Überwachung
   */
  async fuehreSystemAnalyseDurch() {
    console.log("🔍 Starte System-Analyse...");
    this.gedaechtnis.protokolliereAktivitaet("System-Analyse gestartet");

    // Alle .md-Dateien finden
    const mdDateien = this.analysator.findeAlleMdDateien();
    console.log(`📁 Gefundene .md-Dateien: ${mdDateien.length}`);

    // Gedächtnis laden
    const gedaechtnis = this.gedaechtnis.ladeGedaechtnis();

    // Sicherstellen, dass analysierteDateien existiert
    if (!gedaechtnis.analysierteDateien) {
      gedaechtnis.analysierteDateien = [];
    }

    // Sicherstellen, dass gefundeneInformationen existiert
    if (!gedaechtnis.gefundeneInformationen) {
      gedaechtnis.gefundeneInformationen = {};
    }

    // Jede Datei analysieren
    for (const dateiPfad of mdDateien) {
      const analyse = this.analysator.analysiereMdDatei(dateiPfad);
      if (analyse) {
        gedaechtnis.analysierteDateien.push(analyse);

        // Informationen extrahieren
        if (analyse.kategorien.length > 0) {
          analyse.kategorien.forEach((kategorie) => {
            if (!gedaechtnis.gefundeneInformationen[kategorie]) {
              gedaechtnis.gefundeneInformationen[kategorie] = [];
            }
            gedaechtnis.gefundeneInformationen[kategorie].push({
              datei: analyse.pfad,
              titel: analyse.titel,
              status: analyse.status,
              prioritaet: analyse.prioritaet,
            });
          });
        }
      }
    }

    // Compliance-Überwachung
    const { regeln, gesetze, kiRichtlinien, idRegeln, klassenRegeln } =
      this.complianceAgent.extrahiereRegelnUndGesetze(gedaechtnis.analysierteDateien);

    // Compliance-Status speichern
    if (!gedaechtnis.complianceStatus) {
      gedaechtnis.complianceStatus = {};
    }
    gedaechtnis.complianceStatus.regeln = regeln;
    gedaechtnis.complianceStatus.gesetze = gesetze;
    gedaechtnis.complianceStatus.kiRichtlinien = kiRichtlinien;
    gedaechtnis.complianceStatus.idRegeln = idRegeln;
    gedaechtnis.complianceStatus.klassenRegeln = klassenRegeln;
    gedaechtnis.complianceStatus.letztePruefung = new Date().toISOString();

    // Gedächtnis speichern
    this.gedaechtnis.speichereGedaechtnis(gedaechtnis);

    console.log("✅ System-Analyse abgeschlossen");
    console.log(`📋 Gefundene Regeln: ${regeln.length}`);
    console.log(`⚖️ Gefundene Gesetze: ${gesetze.length}`);
    this.gedaechtnis.protokolliereAktivitaet("System-Analyse abgeschlossen");

    return gedaechtnis;
  }

  /**
   * Compliance-Überwachung für aktuelle Aktivität
   */
  ueberwacheCompliance(aktivitaet) {
    const complianceErgebnis = this.complianceAgent.pruefeCompliance(aktivitaet);

    if (complianceErgebnis.verstoesse.length > 0) {
      console.log("🚨 COMPLIANCE-VERSTOß ERKANNT:");
      complianceErgebnis.verstoesse.forEach((verstoß) => {
        console.log(`   ❌ ${verstoß.verstoß} (${verstoß.prioritaet})`);
      });
    }

    if (complianceErgebnis.warnungen.length > 0) {
      console.log("⚠️ COMPLIANCE-WARNUNGEN:");
      complianceErgebnis.warnungen.forEach((warnung) => {
        console.log(`   ⚠️ ${warnung.warnung} (${warnung.prioritaet})`);
      });
    }

    return complianceErgebnis;
  }

  /**
   * Offene Aufgaben identifizieren
   */
  identifiziereOffeneAufgaben() {
    const gedaechtnis = this.gedaechtnis.ladeGedaechtnis();
    const offeneAufgaben = [];

    for (const datei of gedaechtnis.analysierteDateien) {
      if (datei.status === "in_entwicklung" || datei.status === "fehler") {
        offeneAufgaben.push({
          typ: "datei_verbesserung",
          beschreibung: `${datei.titel} (${datei.pfad}) - Status: ${datei.status}`,
          prioritaet: datei.prioritaet,
          datei: datei.pfad,
        });
      }
    }

    // Kategorie-spezifische Aufgaben
    if (gedaechtnis.gefundeneInformationen.enterprise) {
      offeneAufgaben.push({
        typ: "enterprise_optimierung",
        beschreibung: "Enterprise++ Standards überprüfen und optimieren",
        prioritaet: "hoch",
      });
    }

    if (gedaechtnis.gefundeneInformationen.ki_agenten) {
      offeneAufgaben.push({
        typ: "ki_agenten_entwicklung",
        beschreibung: "KI-Agenten-System weiterentwickeln",
        prioritaet: "hoch",
      });
    }

    // Erweiterte Aufgaben-Identifikation
    function identifiziereAufgaben(dateien) {
      const aufgaben = [];

      // Spezielle Aufgaben für Content-Management
      const contentManagementAufgaben = [
        {
          titel: "Datenbank-basiertes Content-Management System",
          beschreibung: "Implementierung eines CMS, das Webseiten-Text aus der Datenbank lädt",
          prioritaet: "hoch",
          kategorie: "content-management",
          status: "fehler",
          datei: "docs/03-ENTWICKLUNG/03-05-content-management-system.md",
        },
        {
          titel: "Content-API für dynamische Texte",
          beschreibung: "API-Endpunkte für das Laden und Bearbeiten von Webseiten-Content",
          prioritaet: "hoch",
          kategorie: "content-management",
          status: "fehler",
          datei: "src/app/api/content",
        },
        {
          titel: "Datenbank-Schema für Content-Management",
          beschreibung: "Tabellen für Texte, Übersetzungen und Content-Versionierung",
          prioritaet: "hoch",
          kategorie: "content-management",
          status: "fehler",
          datei: "database/content_schema.sql",
        },
        {
          titel: "Admin-Interface für Content-Bearbeitung",
          beschreibung: "Admin-Bereich zum Bearbeiten von Webseiten-Texten",
          prioritaet: "normal",
          kategorie: "content-management",
          status: "fehler",
          datei: "src/components/admin/ContentEditor.tsx",
        },
        {
          titel: "Frontend-Integration für dynamische Texte",
          beschreibung: "React-Komponenten die Content aus der Datenbank laden",
          prioritaet: "hoch",
          kategorie: "content-management",
          status: "fehler",
          datei: "src/hooks/useContent.ts",
        },
      ];

      aufgaben.push(...contentManagementAufgaben);

      // Bestehende Aufgaben-Identifikation
      dateien.forEach((datei) => {
        const inhalt = datei.inhalt.toLowerCase();
        const kategorien = datei.kategorien;

        // Technische Aufgaben
        if (kategorien.includes("technisch")) {
          if (inhalt.includes("api") && inhalt.includes("dokumentation")) {
            aufgaben.push({
              titel: "API-Dokumentation - Lopez IT Welt",
              beschreibung: "Vollständige API-Dokumentation für alle Endpunkte",
              prioritaet: "normal",
              kategorie: "technisch",
              status: "in_entwicklung",
              datei: datei.pfad,
            });
          }

          if (inhalt.includes("datenbank") && inhalt.includes("schema")) {
            aufgaben.push({
              titel: "Datenbank-Schema - Lopez IT Welt",
              beschreibung: "Vollständiges Datenbank-Schema für alle Tabellen",
              prioritaet: "normal",
              kategorie: "technisch",
              status: "in_entwicklung",
              datei: datei.pfad,
            });
          }

          if (inhalt.includes("deployment") && inhalt.includes("guide")) {
            aufgaben.push({
              titel: "Deployment-Guide - Lopez IT Welt",
              beschreibung: "Anleitung für Deployment und Installation",
              prioritaet: "normal",
              kategorie: "technisch",
              status: "in_entwicklung",
              datei: datei.pfad,
            });
          }
        }

        // Enterprise Aufgaben
        if (kategorien.includes("enterprise")) {
          if (inhalt.includes("architektur") && inhalt.includes("erweitert")) {
            aufgaben.push({
              titel: "Enterprise-Architektur Erweitert - Lopez IT Welt",
              beschreibung: "Erweiterte Enterprise-Architektur-Dokumentation",
              prioritaet: "normal",
              kategorie: "enterprise",
              status: "in_entwicklung",
              datei: datei.pfad,
            });
          }

          if (inhalt.includes("skalierbarkeit") && inhalt.includes("erweitert")) {
            aufgaben.push({
              titel: "Enterprise-Skalierbarkeit Erweitert - Lopez IT Welt",
              beschreibung: "Erweiterte Skalierbarkeits-Dokumentation",
              prioritaet: "normal",
              kategorie: "enterprise",
              status: "in_entwicklung",
              datei: datei.pfad,
            });
          }

          if (inhalt.includes("monitoring") && inhalt.includes("erweitert")) {
            aufgaben.push({
              titel: "Enterprise-Monitoring Erweitert - Lopez IT Welt",
              beschreibung: "Erweiterte Monitoring-Dokumentation",
              prioritaet: "normal",
              kategorie: "enterprise",
              status: "in_entwicklung",
              datei: datei.pfad,
            });
          }

          if (
            inhalt.includes("backup") &&
            inhalt.includes("disaster") &&
            inhalt.includes("recovery")
          ) {
            aufgaben.push({
              titel: "Enterprise-Backup & Disaster Recovery Erweitert - Lopez IT Welt",
              beschreibung: "Erweiterte Backup und Disaster Recovery Dokumentation",
              prioritaet: "normal",
              kategorie: "enterprise",
              status: "in_entwicklung",
              datei: datei.pfad,
            });
          }
        }

        // Admin Aufgaben
        if (kategorien.includes("admin")) {
          if (inhalt.includes("admin") && inhalt.includes("dokumentation")) {
            aufgaben.push({
              titel: "Admin-Dokumentation - Vollständige Admin-Bereich Dokumentation",
              beschreibung: "Vollständige Admin-Bereich Dokumentation",
              prioritaet: "normal",
              kategorie: "admin",
              status: "in_entwicklung",
              datei: datei.pfad,
            });
          }

          if (inhalt.includes("admin") && inhalt.includes("dashboard")) {
            aufgaben.push({
              titel: "Admin-Dashboard - Lopez IT Welt",
              beschreibung: "Admin-Dashboard Dokumentation",
              prioritaet: "normal",
              kategorie: "admin",
              status: "in_entwicklung",
              datei: datei.pfad,
            });
          }

          if (inhalt.includes("admin") && inhalt.includes("berechtigungen")) {
            aufgaben.push({
              titel: "Admin-Berechtigungen - Lopez IT Welt",
              beschreibung: "Admin-Berechtigungen Dokumentation",
              prioritaet: "normal",
              kategorie: "admin",
              status: "in_entwicklung",
              datei: datei.pfad,
            });
          }

          if (inhalt.includes("admin") && inhalt.includes("monitoring")) {
            aufgaben.push({
              titel: "Admin-Monitoring - Lopez IT Welt",
              beschreibung: "Admin-Monitoring Dokumentation",
              prioritaet: "normal",
              kategorie: "admin",
              status: "in_entwicklung",
              datei: datei.pfad,
            });
          }

          if (inhalt.includes("admin") && inhalt.includes("backup")) {
            aufgaben.push({
              titel: "Admin-Backup-System - Lopez IT Welt",
              beschreibung: "Admin-Backup-System Dokumentation",
              prioritaet: "normal",
              kategorie: "admin",
              status: "in_entwicklung",
              datei: datei.pfad,
            });
          }

          if (inhalt.includes("admin") && inhalt.includes("logging")) {
            aufgaben.push({
              titel: "Admin-Logging-System - Lopez IT Welt",
              beschreibung: "Admin-Logging-System Dokumentation",
              prioritaet: "normal",
              kategorie: "admin",
              status: "in_entwicklung",
              datei: datei.pfad,
            });
          }

          if (inhalt.includes("admin") && inhalt.includes("reporting")) {
            aufgaben.push({
              titel: "Admin-Reporting-System - Lopez IT Welt",
              beschreibung: "Admin-Reporting-System Dokumentation",
              prioritaet: "normal",
              kategorie: "admin",
              status: "in_entwicklung",
              datei: datei.pfad,
            });
          }

          if (inhalt.includes("admin") && inhalt.includes("api")) {
            aufgaben.push({
              titel: "Admin-API-Dokumentation - Lopez IT Welt",
              beschreibung: "Admin-API-Dokumentation",
              prioritaet: "normal",
              kategorie: "admin",
              status: "in_entwicklung",
              datei: datei.pfad,
            });
          }

          if (inhalt.includes("admin") && inhalt.includes("troubleshooting")) {
            aufgaben.push({
              titel: "Admin-Troubleshooting-Guide - Lopez IT Welt",
              beschreibung: "Admin-Troubleshooting-Guide",
              prioritaet: "normal",
              kategorie: "admin",
              status: "in_entwicklung",
              datei: datei.pfad,
            });
          }
        }

        // PC-Verkauf Aufgaben
        if (inhalt.includes("pc-verkauf") || inhalt.includes("hardware")) {
          aufgaben.push({
            titel: "PC-Verkauf & Hardware - Dokumentation",
            beschreibung: "PC-Verkauf und Hardware-Dokumentation",
            prioritaet: "normal",
            kategorie: "technisch",
            status: "fehler",
            datei: datei.pfad,
          });
        }
      });

      // Spezielle hoch-prioritäre Aufgaben
      aufgaben.push({
        titel: "Enterprise++ Standards überprüfen und optimieren",
        beschreibung: "Enterprise++ Standards überprüfen und optimieren",
        prioritaet: "hoch",
        kategorie: "enterprise",
        status: "in_entwicklung",
        datei: "system-anforderung",
      });

      return aufgaben;
    }
  }

  // System-Status generieren
  generiereSystemStatus() {
    const gedaechtnis = this.gedaechtnis.ladeGedaechtnis();
    const offeneAufgaben = this.identifiziereOffeneAufgaben();

    // Sicherstellen, dass alle Arrays existieren
    if (!gedaechtnis.analysierteDateien) {
      gedaechtnis.analysierteDateien = [];
    }
    if (!gedaechtnis.gefundeneInformationen) {
      gedaechtnis.gefundeneInformationen = {};
    }

    // Eindeutiger Name für Aufgaben-Array im Status
    let statusAufgabenArray =
      !offeneAufgaben || !Array.isArray(offeneAufgaben) ? [] : offeneAufgaben;

    const status = {
      gesamtDateien: gedaechtnis.analysierteDateien.length,
      kategorien: Object.keys(gedaechtnis.gefundeneInformationen),
      offeneAufgaben: statusAufgabenArray.length,
      systemStatus: "aktiv",
      letzteAktualisierung: gedaechtnis.letzteAktualisierung,
      naechsteSchritte: this.bestimmeNaechsteSchritte(statusAufgabenArray),
    };

    return status;
  }

  // Nächste Schritte bestimmen
  bestimmeNaechsteSchritte(offeneAufgaben) {
    const schritte = [];

    // Eindeutiger Name für Aufgaben-Array in Schrittemethode
    const schritteAufgabenArray = Array.isArray(offeneAufgaben) ? offeneAufgaben : [];

    // Prioritäten-basierte Schritte
    const hochPrioritaet = schritteAufgabenArray.filter((a) => a.prioritaet === "hoch");
    if (hochPrioritaet.length > 0) {
      schritte.push({
        prioritaet: "hoch",
        beschreibung: `${hochPrioritaet.length} hoch-prioritäre Aufgaben bearbeiten`,
        aufgaben: hochPrioritaet,
      });
    }

    // System-Optimierung
    schritte.push({
      prioritaet: "normal",
      beschreibung: "Agenten-System weiterentwickeln",
      aufgaben: [
        {
          typ: "system_entwicklung",
          beschreibung: "Automatisierte Agenten-Logik implementieren",
        },
      ],
    });

    return schritte;
  }

  // Bericht generieren
  generiereBericht() {
    const status = this.generiereSystemStatus();
    const gedaechtnis = this.gedaechtnis.ladeGedaechtnis();

    console.log("\n📊 AGENTEN-SYSTEM BERICHT");
    console.log("========================");
    console.log(`📁 Analysierte Dateien: ${status.gesamtDateien}`);
    console.log(`🏷️  Kategorien: ${status.kategorien.join(", ")}`);
    console.log(`📋 Offene Aufgaben: ${status.offeneAufgaben}`);
    console.log(`🔄 Letzte Aktualisierung: ${status.letzteAktualisierung}`);

    console.log("\n🎯 NÄCHSTE SCHRITTE:");
    status.naechsteSchritte.forEach((schritt, index) => {
      console.log(`${index + 1}. [${schritt.prioritaet.toUpperCase()}] ${schritt.beschreibung}`);
    });

    console.log("\n📈 KATEGORIE-ÜBERSICHT:");
    Object.entries(gedaechtnis.gefundeneInformationen).forEach(([kategorie, dateien]) => {
      console.log(`  ${kategorie}: ${dateien.length} Dateien`);
    });
  }

  // Kontinuierliche Überwachung
  starteKontinuierlicheUeberwachung() {
    console.log("🔍 Starte kontinuierliche Überwachung...");

    // Alle 30 Sekunden prüfen
    setInterval(() => {
      this.ueberwacheAktuelleAktivitaet();
    }, 30000);

    // Compliance-Checks alle 60 Sekunden
    setInterval(() => {
      this.fuehreComplianceCheckDurch();
    }, 60000);
  }

  // Aktuelle Aktivität überwachen
  ueberwacheAktuelleAktivitaet() {
    const timestamp = new Date().toISOString();
    console.log(`\n[${timestamp}] 🔍 Überwache aktuelle Aktivität...`);

    // Prüfe auf neue Dateien
    const neueDateien = this.analysator.findeAlleMdDateien();
    const gedaechtnis = this.gedaechtnis.ladeGedaechtnis();

    const bekannteDateien = new Set(gedaechtnis.analysierteDateien.map((d) => d.pfad));
    const wirklichNeueDateien = neueDateien.filter((datei) => !bekannteDateien.has(datei.pfad));

    if (wirklichNeueDateien.length > 0) {
      console.log(`📁 Neue Dateien gefunden: ${wirklichNeueDateien.length}`);
      this.analysator.analysiereDateien(wirklichNeueDateien);
    }

    // Compliance-Überwachung
    this.ueberwacheCompliance("datei_erstellung");
  }

  // Compliance-Check durchführen
  fuehreComplianceCheckDurch() {
    console.log("⚖️ Führe Compliance-Check durch...");

    const complianceAgent = new ComplianceAgent(this.gedaechtnis);
    const gedaechtnis = this.gedaechtnis.ladeGedaechtnis();

    if (gedaechtnis.analysierteDateien.length > 0) {
      const regelnUndGesetze = complianceAgent.extrahiereRegelnUndGesetze(
        gedaechtnis.analysierteDateien,
      );

      console.log(`📋 Gefundene Regeln: ${regelnUndGesetze.regeln.length}`);
      console.log(`⚖️ Gefundene Gesetze: ${regelnUndGesetze.gesetze.length}`);
      console.log(`🤖 KI-Richtlinien: ${regelnUndGesetze.kiRichtlinien.length}`);

      // Compliance-Status prüfen
      const complianceStatus = complianceAgent.pruefeCompliance("system_ueberwachung");
      console.log(`✅ Compliance-Status: ${complianceStatus.status}`);
    }
  }
}

// 🚀 HAUPTFUNKTION
async function main() {
  console.log("🤖 Agenten-System für Lopez IT Welt");
  console.log("=====================================\n");

  const agentenSystem = new AgentenSystem();

  // System-Analyse durchführen
  await agentenSystem.fuehreSystemAnalyseDurch();

  // Bericht generieren
  agentenSystem.generiereBericht();

  // Kontinuierliche Überwachung starten
  agentenSystem.starteKontinuierlicheUeberwachung();

  console.log("\n✅ Agenten-System erfolgreich aktiviert!");
  console.log("🔍 Kontinuierliche Überwachung läuft...");
  console.log("⏹️  Drücke Ctrl+C zum Beenden\n");
}

// Script ausführen
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  AgentenSystem,
  AgentenGedaechtnis,
  MdDateiAnalysator,
};
