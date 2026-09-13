import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../..");
const read = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

// fe/share-og brief 1 (13 Sep 2026): the share rule moved out of the
// page into the one Kit share package. Vault hands the raw visibility
// to the package; the package folds UNLISTED to Internal, blocks
// private with the Vault sentence (ruled word Internal), and keeps the
// Internal note. No page carries share logic of its own.
test("Vault shares through the Kit share package and hands it the raw visibility", () => {
  const vault = read("app/studio/v2/vault/VaultV2Mockup.jsx");
  assert.match(vault, /useKitShareController\(/);
  assert.match(vault, /<KitShareSheet \{\.\.\.share\.sheetProps\} \/>/);
  assert.match(vault, /share\.open\(\{/);
  assert.match(vault, /visibility: item\.rawCreation\?\.visibility \|\| item\.rawCreation\?\.data\?\.visibility \|\| item\.visibility/);
  assert.doesNotMatch(vault, /navigator\.share|navigator\.clipboard/);
  assert.doesNotMatch(vault, /Publish it before sharing a public catalogue link/);

  const rule = read("components/kit/share/shareTypeRule.js");
  assert.match(rule, /value === "UNLISTED" \|\| value === SHARE_VISIBILITIES\.INTERNAL/);
  assert.match(rule, /Private creations are owner-only\. Change visibility to Internal or Public before sharing a link\./);
  assert.match(rule, /Recipients must sign in to Crestfall; this creation will not appear in search or public discovery\./);
});

test("direct profile route keeps public Lore publication specialization only for published Lore", () => {
  const page = read("app/studio/creations/[id]/page.js");
  assert.match(page, /function isPublishedCreation/);
  assert.match(page, /visibility === "PUBLIC" \|\| canonStatus === "CANON"/);
  assert.match(page, /isLoreCreation\(cataloguePageData\.creation\)[\s\S]*isPublishedCreation\(cataloguePageData\.creation\)/);
});
