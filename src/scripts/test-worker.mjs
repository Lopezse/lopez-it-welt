// AI Center Worker Test
const API = 'http://localhost:3000/api/admin/ai-center';
const WORKER = 'test-' + Date.now();

console.log('');
console.log('========================================');
console.log('  AI CENTER WORKER TEST');
console.log('========================================');

async function test() {
  // 1. Job abrufen
  console.log('1. Hole nächsten Job...');
  const r1 = await fetch(API + '/jobs/next', { 
    headers: { 'X-Worker-ID': WORKER } 
  });
  const d1 = await r1.json();
  
  console.log('   Response:', JSON.stringify(d1, null, 2));
  
  if (!d1.data || !d1.data.job) {
    console.log('   ⚠️ Keine Jobs verfügbar');
    return;
  }
  
  const job = d1.data.job;
  console.log(`   ✅ Job #${job.id} gefunden (Agent ${job.agent})`);
  
  // 2. Job abschließen
  console.log('');
  console.log('2. Schließe Job ab...');
  const r2 = await fetch(API + '/jobs/' + job.id + '/complete', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json', 
      'X-Worker-ID': WORKER 
    },
    body: JSON.stringify({ 
      result: { success: true, message: 'Test erfolgreich' }, 
      logs: 'Worker-Test durchgeführt',
      next_agent: 'C'  // Agent-C als nächstes starten
    })
  });
  const d2 = await r2.json();
  console.log('   Response:', JSON.stringify(d2, null, 2));
  
  console.log('');
  console.log('========================================');
  console.log('  ✅ TEST ERFOLGREICH!');
  console.log('========================================');
}

test().catch(e => {
  console.error('❌ Fehler:', e.message);
  process.exit(1);
});







