// AI Center Jobs Table Migration
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function run() {
  const pool = await mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'lopez_it_welt_dev',
    multipleStatements: true
  });
  
  try {
    const sqlPath = path.join(__dirname, 'migrations/create_ai_center_jobs.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    await pool.query(sql);
    
    console.log('');
    console.log('========================================');
    console.log('  TABELLE ERSTELLT');
    console.log('========================================');
    console.log('  lopez_ai_center_jobs');
    console.log('  - State Machine für Agent-Jobs');
    console.log('  - Concurrency Lock');
    console.log('  - Retry Counter');
    console.log('========================================');
    
  } catch(e) {
    if (e.code === 'ER_TABLE_EXISTS_ERROR') {
      console.log('Tabelle existiert bereits');
    } else {
      console.error('Fehler:', e.message);
    }
  }
  
  await pool.end();
}

run();







