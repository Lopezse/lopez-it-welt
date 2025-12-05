// Test: API Statistiken abrufen
async function run() {
  try {
    console.log('=== API-TEST: /api/admin/agent-system?view=statistics ===');
    const res = await fetch('http://localhost:3000/api/admin/agent-system?view=statistics');
    const data = await res.json();
    
    if (data.success) {
      console.log('');
      console.log('✅ API Response erfolgreich:');
      console.log('');
      console.log('totalModules:', data.data.totalModules);
      console.log('modulesByStatus.open:', data.data.modulesByStatus?.open);
      console.log('modulesByStatus.in_progress:', data.data.modulesByStatus?.in_progress);
      console.log('modulesByStatus.done:', data.data.modulesByStatus?.done);
      console.log('overallProgress:', data.data.overallProgress + '%');
      console.log('');
      console.log('=== UI sollte anzeigen ===');
      console.log('Gesamtfortschritt:', data.data.overallProgress + '%');
      console.log('SOLL-Module:', data.data.totalModules);
      console.log('In Arbeit:', data.data.modulesByStatus?.in_progress);
      console.log('Fertig:', data.data.modulesByStatus?.done);
    } else {
      console.log('❌ API Fehler:', data.error);
    }
  } catch (e) {
    console.error('❌ Verbindungsfehler:', e.message);
    console.log('');
    console.log('Ist der Server gestartet? (npm run dev)');
  }
}

run();



