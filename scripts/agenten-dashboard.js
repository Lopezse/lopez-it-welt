#!/usr/bin/env node

/**
 * 📊 Agenten-Dashboard für Lopez IT Welt
 * 
 * **Zweck:** Visuelle Übersicht über Agenten-System-Aktivitäten
 * **Status:** Aktiv
 * **Version:** 1.0.0
 * **Datum:** 2025-07-05
 */

const { AgentenSystem } = require('./agenten-system.js');
const { AgentenAktivator } = require('./agenten-aktivator.js');
const fs = require('fs');
const path = require('path');

class AgentenDashboard {
    constructor() {
        this.agentenSystem = new AgentenSystem();
        this.aktivator = new AgentenAktivator();
        this.dashboardDatei = './data/agenten-dashboard.json';
    }

    /**
     * Dashboard-Daten generieren
     */
    async generiereDashboardDaten() {
        const status = this.agentenSystem.generiereSystemStatus();
        const offeneAufgaben = this.agentenSystem.identifiziereOffeneAufgaben();
        const gedaechtnis = this.agentenSystem.gedaechtnis.ladeGedaechtnis();

        const dashboardDaten = {
            version: '1.0.0',
            generiert: new Date().toISOString(),
            systemStatus: status,
            offeneAufgaben: offeneAufgaben,
            kategorienUebersicht: this.generiereKategorienUebersicht(gedaechtnis),
            aktivitaetenLog: this.ladeAktivitaetenLog(),
            naechsteSchritte: status.naechsteSchritte,
            performance: this.generierePerformanceDaten(gedaechtnis)
        };

        // Dashboard speichern
        if (!fs.existsSync('./data')) {
            fs.mkdirSync('./data', { recursive: true });
        }

        fs.writeFileSync(this.dashboardDatei, JSON.stringify(dashboardDaten, null, 2));
        return dashboardDaten;
    }

    /**
     * Kategorien-Übersicht generieren
     */
    generiereKategorienUebersicht(gedaechtnis) {
        const kategorien = {};

        Object.entries(gedaechtnis.gefundeneInformationen).forEach(([kategorie, dateien]) => {
            kategorien[kategorie] = {
                anzahl: dateien.length,
                dateien: dateien.map(d => ({
                    titel: d.titel,
                    status: d.status,
                    prioritaet: d.prioritaet
                })),
                statusVerteilung: this.analysiereStatusVerteilung(dateien),
                prioritaetsVerteilung: this.analysierePrioritaetsVerteilung(dateien)
            };
        });

        return kategorien;
    }

    /**
     * Status-Verteilung analysieren
     */
    analysiereStatusVerteilung(dateien) {
        const verteilung = {};
        dateien.forEach(datei => {
            verteilung[datei.status] = (verteilung[datei.status] || 0) + 1;
        });
        return verteilung;
    }

    /**
     * Prioritäts-Verteilung analysieren
     */
    analysierePrioritaetsVerteilung(dateien) {
        const verteilung = {};
        dateien.forEach(datei => {
            verteilung[datei.prioritaet] = (verteilung[datei.prioritaet] || 0) + 1;
        });
        return verteilung;
    }

    /**
     * Aktivitäten-Log laden
     */
    ladeAktivitaetenLog() {
        const logDatei = './data/agenten-aktivitaeten.log';
        if (fs.existsSync(logDatei)) {
            const logInhalt = fs.readFileSync(logDatei, 'utf8');
            const zeilen = logInhalt.split('\n').filter(zeile => zeile.trim());
            return zeilen.slice(-20); // Letzte 20 Einträge
        }
        return [];
    }

    /**
     * Performance-Daten generieren
     */
    generierePerformanceDaten(gedaechtnis) {
        const dateien = gedaechtnis.analysierteDateien;

        return {
            gesamtGroesse: dateien.reduce((sum, datei) => sum + datei.groesse, 0),
            durchschnittlicheGroesse: Math.round(dateien.reduce((sum, datei) => sum + datei.groesse, 0) / dateien.length),
            groessteDatei: dateien.reduce((max, datei) => datei.groesse > max.groesse ? datei : max, { groesse: 0 }),
            neuesteDatei: dateien.reduce((neueste, datei) => new Date(datei.letzteAenderung) > new Date(neueste.letzteAenderung) ? datei : neueste, { letzteAenderung: '1970-01-01' }),
            kategorienAnzahl: Object.keys(gedaechtnis.gefundeneInformationen).length
        };
    }

    /**
     * Dashboard anzeigen
     */
    zeigeDashboard() {
        console.log('\n📊 AGENTEN-SYSTEM DASHBOARD');
        console.log('=============================\n');

        this.generiereDashboardDaten().then(dashboard => {
            // System-Status
            console.log('🔄 SYSTEM-STATUS:');
            console.log(`   Status: ${dashboard.systemStatus.systemStatus}`);
            console.log(`   Analysierte Dateien: ${dashboard.systemStatus.gesamtDateien}`);
            console.log(`   Kategorien: ${dashboard.systemStatus.kategorien.length}`);
            console.log(`   Offene Aufgaben: ${dashboard.systemStatus.offeneAufgaben}`);
            console.log(`   Letzte Aktualisierung: ${dashboard.systemStatus.letzteAktualisierung}`);

            // Compliance-Status anzeigen
            const complianceStatus = this.agentenSystem.gedaechtnis.ladeGedaechtnis().complianceStatus;
            if (complianceStatus) {
                console.log('\n⚖️ COMPLIANCE-STATUS:');
                console.log('=====================');
                console.log(`   Gefundene Regeln: ${complianceStatus.regeln?.length || 0}`);
                console.log(`   Gefundene Gesetze: ${complianceStatus.gesetze?.length || 0}`);
                console.log(`   KI-Richtlinien: ${complianceStatus.kiRichtlinien?.length || 0}`);
                console.log(`   ID-Regeln: ${complianceStatus.idRegeln?.length || 0}`);
                console.log(`   Klassen-Regeln: ${complianceStatus.klassenRegeln?.length || 0}`);
                console.log(`   Letzte Prüfung: ${complianceStatus.letztePruefung || 'Nicht verfügbar'}\n`);

                // Regeln nach Typ anzeigen
                if (complianceStatus.regeln && complianceStatus.regeln.length > 0) {
                    console.log('📋 ALLGEMEINE REGELN:');
                    complianceStatus.regeln.slice(0, 3).forEach((regel, index) => {
                        console.log(`   ${index + 1}. ${regel.regel} (${regel.prioritaet})`);
                        console.log(`      Typ: ${regel.typ} | Quelle: ${regel.quelle}`);
                    });
                    if (complianceStatus.regeln.length > 3) {
                        console.log(`   ... und ${complianceStatus.regeln.length - 3} weitere Regeln`);
                    }
                    console.log('');
                }

                // KI-Richtlinien anzeigen
                if (complianceStatus.kiRichtlinien && complianceStatus.kiRichtlinien.length > 0) {
                    console.log('🤖 KI-RICHTLINIEN:');
                    complianceStatus.kiRichtlinien.slice(0, 3).forEach((regel, index) => {
                        console.log(`   ${index + 1}. ${regel.regel} (${regel.prioritaet})`);
                        console.log(`      Quelle: ${regel.quelle}`);
                    });
                    if (complianceStatus.kiRichtlinien.length > 3) {
                        console.log(`   ... und ${complianceStatus.kiRichtlinien.length - 3} weitere KI-Richtlinien`);
                    }
                    console.log('');
                }

                // ID-Regeln anzeigen
                if (complianceStatus.idRegeln && complianceStatus.idRegeln.length > 0) {
                    console.log('🆔 ID-REGELN:');
                    complianceStatus.idRegeln.slice(0, 3).forEach((regel, index) => {
                        console.log(`   ${index + 1}. ${regel.regel} (${regel.prioritaet})`);
                        console.log(`      Quelle: ${regel.quelle}`);
                    });
                    if (complianceStatus.idRegeln.length > 3) {
                        console.log(`   ... und ${complianceStatus.idRegeln.length - 3} weitere ID-Regeln`);
                    }
                    console.log('');
                }

                // Klassen-Regeln anzeigen
                if (complianceStatus.klassenRegeln && complianceStatus.klassenRegeln.length > 0) {
                    console.log('🏗️ KLASSEN-REGELN:');
                    complianceStatus.klassenRegeln.slice(0, 3).forEach((regel, index) => {
                        console.log(`   ${index + 1}. ${regel.regel} (${regel.prioritaet})`);
                        console.log(`      Quelle: ${regel.quelle}`);
                    });
                    if (complianceStatus.klassenRegeln.length > 3) {
                        console.log(`   ... und ${complianceStatus.klassenRegeln.length - 3} weitere Klassen-Regeln`);
                    }
                    console.log('');
                }

                // Gesetze anzeigen
                if (complianceStatus.gesetze && complianceStatus.gesetze.length > 0) {
                    console.log('⚖️ AKTIVE GESETZE:');
                    complianceStatus.gesetze.slice(0, 3).forEach((gesetz, index) => {
                        console.log(`   ${index + 1}. ${gesetz.gesetz} (${gesetz.prioritaet})`);
                        console.log(`      Quelle: ${gesetz.quelle}`);
                    });
                    if (complianceStatus.gesetze.length > 3) {
                        console.log(`   ... und ${complianceStatus.gesetze.length - 3} weitere Gesetze`);
                    }
                    console.log('');
                }
            }

            // System-Erkenntnisse anzeigen
            const systemErkenntnisse = this.agentenSystem.gedaechtnis.ladeGedaechtnis().systemErkenntnisse || {};

            if (Object.keys(systemErkenntnisse).length > 0) {
                console.log('\n🧠 SYSTEM-ERKENNTNISSE:');
                console.log('========================');

                Object.entries(systemErkenntnisse).forEach(([kategorie, info]) => {
                    console.log(`\n📋 ${kategorie.toUpperCase()}:`);
                    console.log(`   Status: ${info.status}`);
                    console.log(`   Priorität: ${info.prioritaet}`);

                    if (info.erkenntnisse && info.erkenntnisse.length > 0) {
                        console.log('   ✅ Erkenntnisse:');
                        info.erkenntnisse.forEach(erkenntnis => {
                            if (typeof erkenntnis === 'string') {
                                console.log(`      • ${erkenntnis}`);
                            } else if (erkenntnis.text) {
                                console.log(`      • ${erkenntnis.text}`);
                            }
                        });
                    }

                    if (info.naechsteSchritte && info.naechsteSchritte.length > 0) {
                        console.log('   🎯 Nächste Schritte:');
                        info.naechsteSchritte.forEach(schritt => {
                            if (typeof schritt === 'string') {
                                console.log(`      • ${schritt}`);
                            } else if (schritt.text) {
                                console.log(`      • ${schritt.text}`);
                            }
                        });
                    }
                });
                console.log('');
            }

            // Kategorien-Übersicht
            console.log('\n🏷️  KATEGORIEN-ÜBERSICHT:');
            Object.entries(dashboard.kategorienUebersicht).forEach(([kategorie, data]) => {
                console.log(`   ${kategorie}: ${data.anzahl} Dateien`);
                console.log(`     Status: ${JSON.stringify(data.statusVerteilung)}`);
                console.log(`     Prioritäten: ${JSON.stringify(data.prioritaetsVerteilung)}`);
            });

            // Offene Aufgaben
            console.log('\n📋 OFFENE AUFGABEN:');
            dashboard.offeneAufgaben.forEach((aufgabe, index) => {
                console.log(`   ${index + 1}. [${aufgabe.prioritaet.toUpperCase()}] ${aufgabe.beschreibung}`);
            });

            // Nächste Schritte
            console.log('\n🎯 NÄCHSTE SCHRITTE:');
            dashboard.naechsteSchritte.forEach((schritt, index) => {
                console.log(`   ${index + 1}. [${schritt.prioritaet.toUpperCase()}] ${schritt.beschreibung}`);
            });

            // Performance
            console.log('\n📈 PERFORMANCE:');
            console.log(`   Gesamtgröße: ${Math.round(dashboard.performance.gesamtGroesse / 1024)} KB`);
            console.log(`   Durchschnittliche Dateigröße: ${Math.round(dashboard.performance.durchschnittlicheGroesse / 1024)} KB`);
            console.log(`   Größte Datei: ${dashboard.performance.groessteDatei.pfad} (${Math.round(dashboard.performance.groessteDatei.groesse / 1024)} KB)`);
            console.log(`   Neueste Datei: ${dashboard.performance.neuesteDatei.pfad}`);
            console.log(`   Kategorien: ${dashboard.performance.kategorienAnzahl}`);

            // Letzte Aktivitäten
            console.log('\n📝 LETZTE AKTIVITÄTEN:');
            dashboard.aktivitaetenLog.slice(-5).forEach(aktivitaet => {
                console.log(`   ${aktivitaet}`);
            });

            console.log('\n✅ Dashboard erfolgreich generiert!');
        });
    }

    /**
     * Interaktives Dashboard starten
     */
    starteInteraktivesDashboard() {
        console.log('🎮 Starte interaktives Dashboard...');
        console.log('Drücke Ctrl+C zum Beenden\n');

        // Initial Dashboard anzeigen
        this.zeigeDashboard();

        // Periodische Updates
        setInterval(() => {
            console.log('\n🔄 Dashboard wird aktualisiert...');
            this.zeigeDashboard();
        }, 30000); // Alle 30 Sekunden
    }

    /**
     * Spezifische Kategorie analysieren
     */
    analysiereKategorie(kategorieName) {
        return this.generiereDashboardDaten().then(dashboard => {
            const kategorie = dashboard.kategorienUebersicht[kategorieName];
            if (kategorie) {
                console.log(`\n📊 ANALYSE KATEGORIE: ${kategorieName}`);
                console.log('================================');
                console.log(`Anzahl Dateien: ${kategorie.anzahl}`);
                console.log(`Status-Verteilung: ${JSON.stringify(kategorie.statusVerteilung)}`);
                console.log(`Prioritäten-Verteilung: ${JSON.stringify(kategorie.prioritaetsVerteilung)}`);

                console.log('\n📁 DATEIEN:');
                kategorie.dateien.forEach((datei, index) => {
                    console.log(`${index + 1}. ${datei.titel} [${datei.status}] [${datei.prioritaet}]`);
                });
            } else {
                console.log(`❌ Kategorie "${kategorieName}" nicht gefunden`);
            }
        });
    }

    /**
     * Aufgaben-Report generieren
     */
    generiereAufgabenReport() {
        return this.generiereDashboardDaten().then(dashboard => {
            console.log('\n📋 AUFGABEN-REPORT');
            console.log('===================');

            const aufgabenNachPrioritaet = {};
            dashboard.offeneAufgaben.forEach(aufgabe => {
                if (!aufgabenNachPrioritaet[aufgabe.prioritaet]) {
                    aufgabenNachPrioritaet[aufgabe.prioritaet] = [];
                }
                aufgabenNachPrioritaet[aufgabe.prioritaet].push(aufgabe);
            });

            Object.entries(aufgabenNachPrioritaet).forEach(([prioritaet, aufgaben]) => {
                console.log(`\n🎯 ${prioritaet.toUpperCase()} PRIORITÄT (${aufgaben.length} Aufgaben):`);
                aufgaben.forEach((aufgabe, index) => {
                    console.log(`   ${index + 1}. ${aufgabe.beschreibung}`);
                    if (aufgabe.datei) {
                        console.log(`      📁 Datei: ${aufgabe.datei}`);
                    }
                });
            });
        });
    }
}

// 🚀 HAUPTFUNKTION
async function main() {
    console.log('📊 Agenten-Dashboard für Lopez IT Welt');
    console.log('=======================================\n');

    const dashboard = new AgentenDashboard();

    // Dashboard anzeigen
    await dashboard.zeigeDashboard();

    // Interaktives Dashboard starten (optional)
    if (process.argv.includes('--interaktiv')) {
        dashboard.starteInteraktivesDashboard();
    }

    // Kategorie-Analyse (optional)
    const kategorieIndex = process.argv.indexOf('--kategorie');
    if (kategorieIndex !== -1 && process.argv[kategorieIndex + 1]) {
        await dashboard.analysiereKategorie(process.argv[kategorieIndex + 1]);
    }

    // Aufgaben-Report (optional)
    if (process.argv.includes('--aufgaben-report')) {
        await dashboard.generiereAufgabenReport();
    }
}

// Script ausführen
if (require.main === module) {
    main().catch(console.error);
}

module.exports = {
    AgentenDashboard
}; 