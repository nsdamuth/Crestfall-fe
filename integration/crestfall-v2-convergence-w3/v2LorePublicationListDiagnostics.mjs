import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const read = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

const loader = read("lib/server/studio/getLoreV2PageData.js");
const proxy = read("app/api/lore/publications/route.js");
const service = read("lib/server/services/creations/lorePublicationService.js");

assert.match(loader, /\/api\/lore\/publications\?limit=100&offset=0/);
assert.doesNotMatch(loader, /community\/creations\?type=LORE/);
assert.match(proxy, /listPublicLorePublications/);
assert.match(service, /\/v1\/lore\/publications/);
assert.doesNotMatch(proxy, /supabase|postgraphile/i);

console.log("V2 Lore publication list diagnostics passed.");
