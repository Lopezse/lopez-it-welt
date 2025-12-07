const fs = require('fs');

// Dateien mit executeQueryPool-Problem
const files = [
  'src/app/api/admin/fix-admin-user/route.ts',
  'src/app/api/admin/create-admin/route.ts',
  'src/app/api/admin/quick-setup/route.ts',
  'src/app/api/admin/test-db/route.ts',
  'src/app/api/admin/audit-logs/route.ts',
  'src/app/api/admin/settings/ai/route.ts',
  'src/app/api/admin/settings/company/route.ts',
  'src/app/api/admin/settings/notifications/route.ts',
];

let fixed = 0;

files.forEach(file => {
  if (!fs.existsSync(file)) {
    console.log('SKIP: ' + file);
    return;
  }
  
  let content = fs.readFileSync(file, 'utf8');
  const original = content;
  
  // Pattern 1: Single line { query: "...", values: [...] }
  content = content.replace(
    /executeQueryPool\(\{\s*query:\s*("[^"]+"|'[^']+'|`[^`]+`),\s*values:\s*(\[[^\]]*\]),?\s*\}\)/g,
    'executeQueryPool($1, $2)'
  );
  
  // Pattern 2: Multiline
  content = content.replace(
    /executeQueryPool\(\{\s*\n\s*query:\s*("[^"]+"|'[^']+'|`[^`]+`),\s*\n\s*values:\s*(\[[^\]]*\]),?\s*\n\s*\}\)/g,
    'executeQueryPool($1, $2)'
  );
  
  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('FIXED: ' + file);
    fixed++;
  } else {
    console.log('NO CHANGE: ' + file);
  }
});

console.log('\nTotal fixed: ' + fixed);


