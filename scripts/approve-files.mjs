import fs from "node:fs";

const cfgPath = "freigaben.json";
const files = process.argv.slice(2);

if (!files.length) {
  console.error("Usage: node scripts/approve-files.mjs <file1> <file2> ...");
  process.exit(1);
}

const cfg = JSON.parse(fs.readFileSync(cfgPath, "utf8"));
cfg.mode = "strict";
cfg.allow = Array.from(new Set([...(cfg.allow || []), ...files]));

fs.writeFileSync(cfgPath, JSON.stringify(cfg, null, 2) + "\n", "utf8");
console.log("[approve-files] Added:", files.join(", "));

fs.writeFileSync(cfgPath, JSON.stringify(cfg, null, 2) + "\n", "utf8");
console.log("[approve-files] Added:", files.join(", "));
