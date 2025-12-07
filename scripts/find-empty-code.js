const mysql = require('mysql2/promise');
async function run() {
  const conn = await mysql.createConnection({ host: 'localhost', user: 'root', password: '', database: 'lopez_it_welt' });
  const [rows] = await conn.execute("SELECT id, module_code, module_name FROM module_registry WHERE module_code IS NULL OR module_code = ''");
  console.log('Eintraege mit NULL/leerem module_code:');
  rows.forEach(r => console.log('ID:', r.id, '| code:', JSON.stringify(r.module_code), '| name:', r.module_name));
  await conn.end();
}
run().catch(e => console.error('Fehler:', e.message));









