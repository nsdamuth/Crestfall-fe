import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const read = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

const loader = read("lib/server/studio/getLoreV2PageData.js");
const service = read("lib/server/services/creations/lorePublicationService.js");
const apiClient = read("lib/server/api/crestfallApiClient.js");
const obsoleteFeProxy = path.join(repoRoot, "app/api/lore/publications/route.js");

assert.match(loader, /listPublicLorePublications/);
assert.match(loader, /limit:\s*100/);
assert.match(loader, /offset:\s*0/);
assert.doesNotMatch(loader, /\/api\/lore\/publications/);
assert.doesNotMatch(loader, /community\/creations\?type=LORE/);
assert.doesNotMatch(loader, /crestfall\.net|crestfall-studio\.com/);

assert.match(service, /crestfallApiRequest/);
assert.match(service, /\/v1\/lore\/publications/);
assert.match(apiClient, /CRESTFALL_API_INTERNAL_URL/);
assert.match(apiClient, /CRESTFALL_API_INTERNAL_SECRET/);
assert.match(apiClient, /x-crestfall-internal-secret/);
assert.equal(fs.existsSync(obsoleteFeProxy), false);

console.log("V2 Lore internal publication request diagnostics passed.");
