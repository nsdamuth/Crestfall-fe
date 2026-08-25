import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../..");
const read = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

test("V2 Lore route is live and server-backed", () => {
  const page = read("app/studio/v2/lore/page.jsx");
  const loader = read("lib/server/studio/getLoreV2PageData.js");

  assert.match(page, /getLoreV2PageData/);
  assert.match(page, /<Lore[\s\S]*live/);
  assert.match(loader, /\/api\/community\/creations\?type=LORE/);
  assert.match(loader, /\/api\/creations\?view=summary&type=LORE/);
});

test("Lore live projection keeps public and owned LORE data distinct", () => {
  const projection = read("lib/shared/presentation/lorePresentation.js");
  assert.match(projection, /projectPublicLoreCreations/);
  assert.match(projection, /projectOwnedLoreCreations/);
  assert.match(projection, /normalizeUpper\(creation\?\.type\) === "LORE"/);
  assert.match(projection, /assetKind: "lore"/);
});

test("public Lore opens the existing published Lore reading surface", () => {
  const vm = read("app/studio/v2/lore/lore/useLoreViewModel.js");
  assert.match(vm, /`\/studio\/creations\/\$\{encodeURIComponent\(item\.id\)\}`/);
  assert.match(
    vm,
    /onOpenAssetDetail: live[\s\S]*\/studio\/creations\/[\s\S]*: isMine[\s\S]*openNotice/
  );
});

test("owned Lore opens the V2 saved-creation editor", () => {
  const vm = read("app/studio/v2/lore/lore/useLoreViewModel.js");
  assert.match(vm, /`\/studio\/v2\/editor\/\$\{encodeURIComponent\(item\.id\)\}\?origin=lore`/);
});

test("live Lore engagement persists through the shared reaction hook", () => {
  const vm = read("app/studio/v2/lore/lore/useLoreViewModel.js");
  assert.match(vm, /useCreationEngagementState/);
  assert.match(vm, /toggleCreationLike\(item\)/);
  assert.match(vm, /toggleCreationBookmark\(item\)/);
});

test("live Lore does not invent a world/faction facet absent from the public summary contract", () => {
  const vm = read("app/studio/v2/lore/lore/useLoreViewModel.js");
  assert.match(vm, /if \(!live\) \{[\s\S]*id: "world"/);
});

test("fixture harness remains preview-only", () => {
  const shell = read("app/studio/v2/lore/Lore.jsx");
  assert.match(shell, /live \|\| process\.env\.NODE_ENV === "production" \? null/);
});
