#!/usr/bin/env node

/**
 * 🚀 Agenten-Aktivator für Lopez IT Welt
 * 
 * **Zweck:** Automatische Aktivierung und Verwaltung des Agenten-Systems
 * **Status:** Aktiv
 * **Version:** 1.0.0
 * **Datum:** 2025-07-05
 */

const { AgentenSystem } = require('./agenten-system.js');
const fs = require('fs');
const path = require('path');

class AgentenAktivator {
    constructor() {
        this.agentenSystem = new AgentenSystem();
        this.konfigurationsDatei = './config/agenten-konfiguration.json';
        this.initKonfiguration();
    }

    /**
     * Konfiguration initialisieren
     */
    initKonfiguration() {
        if (!fs.existsSync('./config')) {
            fs.mkdirSync('./config', { recursive: true });
        }

        if (!fs.existsSync(this.konfigurationsDatei)) {
            const konfiguration = {
                version: '1.0.0',
                erstellt: new Date().toISOString(),
                autoStart: true,
                ueberwachungsIntervall: 300000, // 5 Minuten
                maxGedaechtnisGroesse: 100, // MB
                aktivierteModule: [
                    'system-analyse',
                    'aufgaben-identifikation',
                    'status-generierung',
                    'bericht-generierung'
                ],
                benachrichtigungen: {
                    email: false,
                    console: true,
                    log: true
                }
            };

            fs.writeFileSync(this.konfigurationsDatei, JSON.stringify(konfiguration, null, 2));
        }
    }

    /**
     * Konfiguration laden
     */
    ladeKonfiguration() {
        try {
            const data = fs.readFileSync(this.konfigurationsDatei, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('❌ Fehler beim Laden der Konfiguration:', error);
            return null;
        }
    }

    /**
     * Agenten-System aktivieren
     */
    async aktiviereSystem() {
        console.log('🚀 Aktiviere Agenten-System...');

        const konfiguration = this.ladeKonfiguration();
        if (!konfiguration) {
            console.error('❌ Konfiguration konnte nicht geladen werden');
            return false;
        }

        try {
            // System-Analyse durchführen
            console.log('📊 Führe System-Analyse durch...');
            await this.agentenSystem.fuehreSystemAnalyseDurch();

            // Status generieren
            console.log('📈 Generiere System-Status...');
            const status = this.agentenSystem.generiereSystemStatus();

            // Offene Aufgaben identifizieren
            console.log('📋 Identifiziere offene Aufgaben...');
            const offeneAufgaben = this.agentenSystem.identifiziereOffeneAufgaben();

            // Bericht generieren
            console.log('📄 Generiere Bericht...');
            this.agentenSystem.generiereBericht();

            // Benachrichtigungen senden
            if (konfiguration.benachrichtigungen.console) {
                this.sendeConsoleBenachrichtigung(status, offeneAufgaben);
            }

            console.log('✅ Agenten-System erfolgreich aktiviert!');
            return true;

        } catch (error) {
            console.error('❌ Fehler beim Aktivieren des Systems:', error);
            return false;
        }
    }

    /**
     * Console-Benachrichtigung senden
     */
    sendeConsoleBenachrichtigung(status, offeneAufgaben) {
        console.log('\n🔔 AGENTEN-SYSTEM BENACHRICHTIGUNG');
        console.log('====================================');
        console.log(`📊 System-Status: ${status.systemStatus}`);
        console.log(`📁 Analysierte Dateien: ${status.gesamtDateien}`);
        console.log(`📋 Offene Aufgaben: ${offeneAufgaben.length}`);

        if (offeneAufgaben.length > 0) {
            console.log('\n⚠️  OFFENE AUFGABEN:');
            offeneAufgaben.forEach((aufgabe, index) => {
                console.log(`${index + 1}. [${aufgabe.prioritaet.toUpperCase()}] ${aufgabe.beschreibung}`);
            });
        }

        console.log('\n🎯 EMPFOHLENE NÄCHSTE SCHRITTE:');
        status.naechsteSchritte.forEach((schritt, index) => {
            console.log(`${index + 1}. ${schritt.beschreibung}`);
        });
    }

    /**
     * Kontinuierliche Überwachung starten
     */
    starteUeberwachung() {
        const konfiguration = this.ladeKonfiguration();
        if (!konfiguration) return;

        console.log(`🔄 Starte kontinuierliche Überwachung (Intervall: ${konfiguration.ueberwachungsIntervall / 1000}s)`);

        setInterval(async () => {
            console.log('\n🔄 Führe periodische System-Prüfung durch...');
            await this.agentenSystem.fuehreSystemAnalyseDurch();

            const status = this.agentenSystem.generiereSystemStatus();
            const offeneAufgaben = this.agentenSystem.identifiziereOffeneAufgaben();

            if (offeneAufgaben.length > 0) {
                console.log(`⚠️  ${offeneAufgaben.length} offene Aufgaben gefunden`);
            }

        }, konfiguration.ueberwachungsIntervall);
    }

    /**
     * Spezifische Aufgabe ausführen
     */
    async fuehreAufgabeAus(aufgabenTyp) {
        console.log(`🎯 Führe Aufgabe aus: ${aufgabenTyp}`);

        switch (aufgabenTyp) {
            case 'system-analyse':
                await this.agentenSystem.fuehreSystemAnalyseDurch();
                break;

            case 'status-generierung':
                const status = this.agentenSystem.generiereSystemStatus();
                console.log('📊 System-Status:', status);
                break;

            case 'aufgaben-identifikation':
                const aufgaben = this.agentenSystem.identifiziereOffeneAufgaben();
                console.log('📋 Offene Aufgaben:', aufgaben);
                break;

            case 'bericht-generierung':
                this.agentenSystem.generiereBericht();
                break;

            default:
                console.error(`❌ Unbekannter Aufgaben-Typ: ${aufgabenTyp}`);
                break;
        }
    }

    /**
     * System-Status abrufen
     */
    getSystemStatus() {
        return this.agentenSystem.generiereSystemStatus();
    }

    /**
     * Offene Aufgaben abrufen
     */
    getOffeneAufgaben() {
        return this.agentenSystem.identifiziereOffeneAufgaben();
    }
}

// 🚀 HAUPTFUNKTION
async function main() {
    console.log('🚀 Agenten-Aktivator für Lopez IT Welt');
    console.log('=======================================\n');

    const aktivator = new AgentenAktivator();

    // System aktivieren
    const erfolg = await aktivator.aktiviereSystem();

    if (erfolg) {
        // Kontinuierliche Überwachung starten
        aktivator.starteUeberwachung();

        console.log('\n🎉 Agenten-System ist jetzt vollständig aktiv!');
        console.log('📊 Das System überwacht automatisch alle .md-Dateien');
        console.log('🧠 Das Gedächtnis speichert alle Aktivitäten');
        console.log('📋 Offene Aufgaben werden automatisch identifiziert');
        console.log('📈 Berichte werden automatisch generiert');

        console.log('\n💡 VERFÜGBARE FUNKTIONEN:');
        console.log('- Automatische .md-Datei-Analyse');
        console.log('- Intelligente Aufgaben-Identifikation');
        console.log('- Kontinuierliche System-Überwachung');
        console.log('- Automatische Bericht-Generierung');
        console.log('- Gedächtnis-basierte Lernfähigkeit');

    } else {
        console.error('❌ Agenten-System konnte nicht aktiviert werden');
    }
}

// Script ausführen
if (require.main === module) {
    main().catch(console.error);
}

module.exports = {
    AgentenAktivator
}; 