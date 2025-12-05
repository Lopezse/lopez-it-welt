/**
 * ENTERPRISE++ PHASE 1: REPORT-GENERATOR (READ ONLY)
 * =====================================================
 * Erstellt Markdown-Reports aus der Analyse.
 * KEINE DB-Änderungen!
 * =====================================================
 */

const fs = require('fs');
const path = require('path');

// Lade Analyse-Ergebnisse
const results = JSON.parse(fs.readFileSync('scripts/progress-analysis-results.json', 'utf8'));

const PROGRESS_DIR = 'docs/AGENT_SYSTEM/PROGRESS';

// Stelle sicher, dass Verzeichnis existiert
if (!fs.existsSync(PROGRESS_DIR)) {
  fs.mkdirSync(PROGRESS_DIR, { recursive: true });
}

console.log('=====================================================');
console.log('ENTERPRISE++ PHASE 1: REPORT-GENERATOR');
console.log('=====================================================');
console.log('');

// 1. Einzel-Reports erstellen
console.log('=== Einzel-Reports erstellen ===');

for (const mod of results) {
  const filename = `${mod.code}_${mod.name.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30)}.md`;
  const filepath = path.join(PROGRESS_DIR, filename);
  
  const statusEmoji = mod.progressPercent >= 100 ? '✅' : 
                      mod.progressPercent >= 50 ? '🔄' : 
                      mod.progressPercent > 0 ? '⚠️' : '⬚';
  
  const content = `# ${mod.code} – ${mod.name}

**Kategorie:** ${mod.category}  
**Risk-Level:** ${mod.riskLevel || 'N/A'}  
**Priority-Level:** ${mod.priorityLevel || 'N/A'}  
**Analyse-Datum:** ${new Date().toISOString().split('T')[0]}  
**Status:** ${statusEmoji} ${mod.progressPercent}%

---

## 📊 Fortschritts-Übersicht

| Metrik | Wert |
|--------|------|
| **Berechneter IST-Fortschritt** | **${mod.progressPercent}%** |
| **SOLL-Funktionen** | ${mod.sollFunctions?.length || 0} |
| **IST-Funktionen** | ${mod.istFunctions?.length || 0} |
| **Fehlende Funktionen** | ${mod.missingFunctions?.length || 0} |
| **Gefundene Dateien** | ${mod.foundFiles?.length || 0} |
| **Unsicher** | ${mod.uncertain ? 'Ja' : 'Nein'} |

---

## ✅ SOLL-Funktionen (Pflichtenheft)

${mod.sollFunctions?.length > 0 ? mod.sollFunctions.map(f => `- ${f}`).join('\n') : '- Keine Spezifikation vorhanden'}

---

## ✅ IST-Funktionen (implementiert)

${mod.istFunctions?.length > 0 ? mod.istFunctions.map(f => `- ✅ ${f}`).join('\n') : '- Keine implementiert'}

---

## ❌ Fehlende Funktionen

${mod.missingFunctions?.length > 0 ? mod.missingFunctions.map(f => `- ❌ ${f}`).join('\n') : '- Keine (vollständig)'}

---

## 📁 Gefundene Dateien

${mod.foundFiles?.length > 0 ? 
  '```\n' + mod.foundFiles.slice(0, 20).join('\n') + 
  (mod.foundFiles.length > 20 ? `\n... und ${mod.foundFiles.length - 20} weitere` : '') + 
  '\n```' : 
  'Keine relevanten Dateien gefunden.'}

---

## 💡 Empfehlung

**${mod.recommendation}**

${mod.uncertain ? '\n⚠️ **ACHTUNG:** Diese Einschätzung ist unsicher. Manuelle Prüfung empfohlen.\n' : ''}

---

## 📋 Nächste Schritte

${mod.progressPercent >= 100 ? 
  '- [x] Modul vollständig implementiert\n- [ ] Code-Review durchführen\n- [ ] Tests schreiben/prüfen' :
  mod.progressPercent >= 50 ?
  '- [ ] Fehlende Funktionen implementieren\n- [ ] Tests schreiben\n- [ ] Dokumentation aktualisieren' :
  '- [ ] Implementierung starten\n- [ ] SOLL-Anforderungen prüfen\n- [ ] Ressourcen planen'}

---

**HINWEIS:** Dieser Report wurde automatisch generiert (PHASE 1 - READ ONLY).  
Die Werte wurden NICHT in die Datenbank geschrieben.  
Manuelle Validierung empfohlen.
`;

  fs.writeFileSync(filepath, content);
  console.log(`  ✅ ${filename}`);
}

// 2. Gesamt-Report erstellen
console.log('');
console.log('=== Gesamt-Report erstellen ===');

const stats = {
  total: results.length,
  done: results.filter(r => r.progressPercent >= 100).length,
  inProgress: results.filter(r => r.progressPercent > 0 && r.progressPercent < 100).length,
  open: results.filter(r => r.progressPercent === 0).length,
  avgProgress: Math.round(results.reduce((sum, r) => sum + r.progressPercent, 0) / results.length),
  uncertain: results.filter(r => r.uncertain)
};

// Sortiere nach Fortschritt
const sortedResults = [...results].sort((a, b) => b.progressPercent - a.progressPercent);

// Gruppiere nach Kategorie
const byCategory = {};
for (const r of results) {
  if (!byCategory[r.category]) {
    byCategory[r.category] = [];
  }
  byCategory[r.category].push(r);
}

const overallReport = `# 📊 ENTERPRISE++ MODUL-FORTSCHRITTSANALYSE

**Analyse-Datum:** ${new Date().toISOString()}  
**Status:** PHASE 1 – Analyse-only, KEINE DB-Updates  
**Modus:** READ ONLY

---

## 🎯 Zusammenfassung

| Metrik | Wert |
|--------|------|
| **Gesamt Module** | ${stats.total} |
| **Fertig (100%)** | ${stats.done} |
| **In Arbeit (1-99%)** | ${stats.inProgress} |
| **Offen (0%)** | ${stats.open} |
| **Durchschnittlicher Fortschritt** | **${stats.avgProgress}%** |
| **Unsichere Einschätzungen** | ${stats.uncertain.length} |

### Fortschrittsbalken

\`\`\`
[${Array(Math.round(stats.avgProgress / 5)).fill('█').join('')}${Array(20 - Math.round(stats.avgProgress / 5)).fill('░').join('')}] ${stats.avgProgress}%
\`\`\`

---

## 📋 Alle Module (sortiert nach Fortschritt)

| Code | Name | Kategorie | Fortschritt | Status |
|------|------|-----------|-------------|--------|
${sortedResults.map(r => {
  const statusEmoji = r.progressPercent >= 100 ? '✅ done' : 
                      r.progressPercent >= 50 ? '🔄 in_progress' : 
                      r.progressPercent > 0 ? '⚠️ in_progress' : '⬚ open';
  return `| ${r.code} | ${r.name} | ${r.category} | ${r.progressPercent}% | ${statusEmoji} |`;
}).join('\n')}

---

## 📂 Nach Kategorie

${Object.entries(byCategory).map(([cat, mods]) => {
  const catAvg = Math.round(mods.reduce((s, m) => s + m.progressPercent, 0) / mods.length);
  const catDone = mods.filter(m => m.progressPercent >= 100).length;
  return `### ${cat}

**Durchschnitt:** ${catAvg}% | **Fertig:** ${catDone}/${mods.length}

| Code | Name | Fortschritt |
|------|------|-------------|
${mods.map(m => `| ${m.code} | ${m.name} | ${m.progressPercent}% |`).join('\n')}
`;
}).join('\n')}

---

## ⚠️ Unsichere Einschätzungen

${stats.uncertain.length > 0 ? 
`Die folgenden Module haben unsichere Fortschrittswerte (keine eindeutigen Dateien gefunden):

| Code | Name | Grund |
|------|------|-------|
${stats.uncertain.map(u => `| ${u.code} | ${u.name} | ${u.foundFiles?.length === 0 ? 'Keine Dateien gefunden' : 'Unklare Zuordnung'} |`).join('\n')}

**Empfehlung:** Manuelle Überprüfung dieser Module.` :
'Keine unsicheren Einschätzungen.'}

---

## ✅ Bestätigungen

- [x] **module_registry wurde NICHT verändert**
- [x] **module_progress wurde NICHT verändert**
- [x] **Keine Business-Tabellen wurden verändert**
- [x] **Nur SELECT-Abfragen wurden ausgeführt**
- [x] **Nur neue Markdown-Dateien wurden erstellt**

---

## 📝 PHASE 1 Abschluss

**PHASE 1 = Analyse-only, keine DB-Updates durchgeführt.**

### Module mit unsicherer Einschätzung:

${stats.uncertain.length > 0 ? 
  stats.uncertain.map(u => `- ${u.code} ${u.name}`).join('\n') :
  '- Keine'}

### Nächste Schritte (PHASE 2 – optional, nur mit Freigabe):

1. Review der berechneten Fortschrittswerte
2. Manuelle Validierung unsicherer Module
3. Bei Freigabe: UPDATE module_progress mit neuen Werten
4. ADM-Module bleiben bei 100% (keine Änderung)

---

## 📁 Einzelne Modul-Reports

Für Details zu jedem Modul siehe:

${results.map(r => `- [${r.code} ${r.name}](./${r.code}_${r.name.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30)}.md)`).join('\n')}

---

**Erstellt:** ${new Date().toISOString()}  
**Generator:** Enterprise++ Phase 1 Analysis  
**KEINE DATENBANK-ÄNDERUNGEN DURCHGEFÜHRT**
`;

fs.writeFileSync(path.join(PROGRESS_DIR, 'ALL_MODULE_PROGRESS_REPORT.md'), overallReport);
console.log('  ✅ ALL_MODULE_PROGRESS_REPORT.md');

console.log('');
console.log('=====================================================');
console.log('PHASE 1 ABGESCHLOSSEN');
console.log('=====================================================');
console.log(`  ${results.length} Einzel-Reports erstellt`);
console.log('  1 Gesamt-Report erstellt');
console.log('  KEINE DB-Änderungen durchgeführt');
console.log('');
console.log('Reports unter: docs/AGENT_SYSTEM/PROGRESS/');



