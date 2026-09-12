import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../..");
const read = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

test("live Vault loads only the signed-in owner's creations", () => {
  const page = read("app/studio/v2/vault/page.jsx");
  const live = read("app/studio/v2/vault/VaultV2Live.jsx");

  assert.match(page, /getMyCreationsPageData/);
  assert.doesNotMatch(page, /getCommunityCreationsPageData|communityResult|communityCreations/);
  assert.match(live, /projectCreationsToVaultItems\(creations, \{ isOwn: true \}\)/);
  assert.doesNotMatch(live, /projectCommunityCreations|bookmarkCandidates|communityCreations/);
});

test("Vault presentation never merges bookmarked Community creations into membership", () => {
  const view = read("app/studio/v2/vault/VaultV2Mockup.jsx");

  assert.match(view, /const sourceItems = ownedItems/);
  assert.doesNotMatch(view, /savedCandidates|bookmarkCandidates/);
  assert.match(view, /Everything you create stays findable here/);
  assert.doesNotMatch(view, /Saved from the Community, not your own work/);
});
