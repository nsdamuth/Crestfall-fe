import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../..");
const read = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

test("Vault shares authenticated UNLISTED links without making them public", () => {
  const vault = read("app/studio/v2/vault/VaultV2Mockup.jsx");
  assert.match(vault, /item\.rawCreation\?\.visibility/);
  assert.match(vault, /sourceVisibility === "UNLISTED"/);
  assert.match(vault, /!isUnlisted && !\["PUBLIC", "CANON"\]\.includes\(item\.visibility\)/);
  assert.match(vault, /Recipients must sign in to Crestfall/);
  assert.match(vault, /will not appear in search or public discovery/);
  assert.match(vault, /item\.visibility === "PRIVATE"/);
  assert.match(vault, /Private creations are owner-only/);
  assert.doesNotMatch(vault, /Publish it before sharing a public catalogue link/);
});

test("direct profile route keeps public Lore publication specialization only for published Lore", () => {
  const page = read("app/studio/creations/[id]/page.js");
  assert.match(page, /function isPublishedCreation/);
  assert.match(page, /visibility === "PUBLIC" \|\| canonStatus === "CANON"/);
  assert.match(page, /isLoreCreation\(cataloguePageData\.creation\)[\s\S]*isPublishedCreation\(cataloguePageData\.creation\)/);
});
