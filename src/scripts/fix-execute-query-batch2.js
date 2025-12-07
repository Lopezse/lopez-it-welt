/**
 * Batch-Fix für executeQueryPool Format in settings-Routen
 * Enterprise++ TypeScript Cleanup
 */

const fs = require('fs');
const path = require('path');

const files = [
  'src/app/api/admin/settings/ai/route.ts',
  'src/app/api/admin/settings/company/route.ts',
  'src/app/api/admin/settings/notifications/route.ts',
  'src/app/api/admin/settings/notifications/templates/[id]/route.ts',
  'src/app/api/admin/settings/notifications/templates/route.ts',
  'src/app/api/admin/settings/profile/avatar/route.ts',
  'src/app/api/admin/settings/profile/login-history/route.ts',
  'src/app/api/admin/settings/profile/route.ts',
  'src/app/api/admin/settings/security/route.ts',
  'src/app/api/admin/settings/security/tokens/[id]/route.ts',
  'src/app/api/admin/settings/security/tokens/route.ts',
  'src/app/api/admin/settings/system/status/route.ts'
];

let totalFixed = 0;

files.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  Datei nicht gefunden: ${file}`);
    return;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  const original = content;
  
  // Pattern: executeQueryPool({ query: "...", values: [...] })
  // Replace with: executeQueryPool("...", [...])
  const pattern = /executeQueryPool\(\s*\{\s*query:\s*([`"'][^`"']*[`"'])\s*,\s*values:\s*(\[[^\]]*\])\s*\}\s*\)/g;
  
  content = content.replace(pattern, (match, query, values) => {
    return `executeQueryPool(${query}, ${values})`;
  });
  
  // Auch mit Template-Strings
  const patternTemplate = /executeQueryPool\(\s*\{\s*query:\s*(`[^`]*`)\s*,\s*values:\s*(\[[^\]]*\])\s*\}\s*\)/g;
  content = content.replace(patternTemplate, (match, query, values) => {
    return `executeQueryPool(${query}, ${values})`;
  });
  
  if (content !== original) {
    fs.writeFileSync(fullPath, content);
    const fixes = (original.match(/executeQueryPool\(\s*\{/g) || []).length - 
                  (content.match(/executeQueryPool\(\s*\{/g) || []).length;
    console.log(`✅ ${file} - ${fixes || 1} Fix(es)`);
    totalFixed += fixes || 1;
  } else {
    console.log(`ℹ️  ${file} - Kein Muster gefunden`);
  }
});

console.log(`\n📊 Total: ${totalFixed} Fixes angewendet`);

