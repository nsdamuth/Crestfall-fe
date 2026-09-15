import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { filterVaultItems, sortVaultItems } from "./vaultVisibility.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../..");
const read = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

// Three owned creations: two private, one public. The folder holds
// one private and the public one; the other private sits outside it.
const ITEMS = [
  { id: "v1", type: "CHARACTER", assetKind: "character", title: "Ashwynn Vale", subtitle: "Character", isOwn: true, visibility: "PRIVATE", plays: 40, hearts: 3, recency: 20 },
  { id: "v2", type: "STORY", assetKind: "story", title: "The Hollow Road", subtitle: "Story", isOwn: true, visibility: "PRIVATE", plays: 12, hearts: 1, recency: 19 },
  { id: "v9", type: "CHARACTER", assetKind: "character", title: "Delphine Roux", subtitle: "Character", isOwn: true, visibility: "PUBLIC", plays: 3400, hearts: 610, recency: 12 },
];

// G2 (ASSET-FOLDERS AF6): a folder holding two creations, Visibility
// set to Private, and a sort yields the one private creation, and the
// steps run in that order (filter, sort, then membership).
test("a folder holding a private and a public creation with Visibility Private and a sort yields the one private creation", () => {
  const result = filterVaultItems(ITEMS, {
    selectedValues: { visibility: ["PRIVATE"] },
    sort: "popular",
    folderItemIds: ["v2", "v9"],
  });
  assert.deepEqual(result.map((item) => item.id), ["v2"]);
});

test("membership composes with the sort: two private creations in a folder keep the sort's order", () => {
  const byPlays = filterVaultItems(ITEMS, {
    selectedValues: { visibility: ["PRIVATE"] },
    sort: "popular",
    folderItemIds: ["v2", "v1"],
  });
  assert.deepEqual(byPlays.map((item) => item.id), ["v1", "v2"]);
  const byNewest = filterVaultItems(ITEMS, {
    selectedValues: { visibility: ["PRIVATE"] },
    sort: "recent",
    folderItemIds: ["v2", "v1"],
  });
  assert.deepEqual(byNewest.map((item) => item.id), ["v1", "v2"]);
  const byLikes = filterVaultItems(ITEMS, { sort: "hearts", folderItemIds: ["v2", "v1", "v9"] });
  assert.deepEqual(byLikes.map((item) => item.id), ["v9", "v1", "v2"]);
});

test("membership composes with the search query and with the catalog type filter", () => {
  const searched = filterVaultItems(ITEMS, { query: "road", folderItemIds: ["v1", "v2"] });
  assert.deepEqual(searched.map((item) => item.id), ["v2"]);
  const typed = filterVaultItems(ITEMS, {
    selectedValues: { charactersVisuals: ["CHARACTER"] },
    folderItemIds: ["v1", "v2", "v9"],
  });
  assert.deepEqual(typed.map((item) => item.id), ["v1", "v9"]);
});

test("the root row All (null membership) shows every creation that passes the other steps; an empty folder shows none", () => {
  const all = filterVaultItems(ITEMS, { sort: "recent", folderItemIds: null });
  assert.deepEqual(all.map((item) => item.id), ["v1", "v2", "v9"]);
  const empty = filterVaultItems(ITEMS, { sort: "recent", folderItemIds: [] });
  assert.deepEqual(empty, []);
});

test("Remixes leaves the list in its current order (no remix count yet, CR-059)", () => {
  const reversed = [ITEMS[2], ITEMS[1], ITEMS[0]];
  assert.deepEqual(sortVaultItems(reversed, "remixes").map((item) => item.id), ["v9", "v2", "v1"]);
});

test("the Vault page runs the one pure filter with the folder's own items plus its sub-folders' after the other steps", () => {
  const page = read("app/studio/v2/vault/VaultV2Mockup.jsx");
  assert.match(page, /filterVaultItems\(/);
  assert.match(page, /getDescendantIds\(/);
  assert.match(page, /folderItemIds/);
  assert.doesNotMatch(page, /sorted\.sort\(/);
});
