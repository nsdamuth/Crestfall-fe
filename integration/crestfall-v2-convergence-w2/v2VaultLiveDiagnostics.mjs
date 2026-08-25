import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  canArchiveVaultItem,
  canDeleteVaultItem,
  getVaultVisibility,
  projectCreationToVaultItem,
} from "../../lib/shared/presentation/vaultPresentation.js";
import {
  getAssetKindForCreationType,
  getTypeBucketForCreationType,
} from "../../lib/shared/presentation/typeBuckets.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");

const results = [];
function test(name, fn) {
  fn();
  results.push(name);
}

test("raw Crestfall creation types project into the five V2 Vault buckets", () => {
  assert.equal(getAssetKindForCreationType("CHARACTER"), "character");
  assert.equal(getAssetKindForCreationType("ROOM_TEMPLATE"), "story");
  assert.equal(getAssetKindForCreationType("STORYLINE"), "adventure");
  assert.equal(getAssetKindForCreationType("OUTFIT"), "look");
  assert.equal(getAssetKindForCreationType("LOCATION_REGISTRY"), "world");
  assert.equal(getTypeBucketForCreationType("LOCATION_REGISTRY"), "worlds");
});

test("UNLISTED is presented as Internal and official canon as Canon", () => {
  assert.equal(getVaultVisibility({ visibility: "UNLISTED" }), "INTERNAL");
  assert.equal(
    getVaultVisibility({ visibility: "PUBLIC", canonStatus: "OFFICIAL" }),
    "CANON"
  );
});

test("owned summary rows project into V2 card data without dropping live metadata", () => {
  const item = projectCreationToVaultItem({
    id: "creation-a",
    type: "ROOM_TEMPLATE",
    title: "Lantern District",
    visibility: "UNLISTED",
    status: "DRAFT",
    canonStatus: "NONE",
    updatedAt: "2026-08-24T20:00:00Z",
    stats: { likes: 7, messages: 31 },
    featuredMedia: [{ id: "m1", imageUrl: "/cover.png" }],
    data: { tags: ["mystery"] },
  });

  assert.equal(item.id, "creation-a");
  assert.equal(item.assetKind, "story");
  assert.equal(item.visibility, "INTERNAL");
  assert.equal(item.imageSrc, "/cover.png");
  assert.equal(item.hearts, 7);
  assert.equal(item.plays, 31);
  assert.equal(item.rawCreation.id, "creation-a");
});

test("Vault lifecycle actions honor Crestfall archive/delete constraints", () => {
  assert.equal(canArchiveVaultItem({ status: "DRAFT", canonStatus: "NONE" }), true);
  assert.equal(canArchiveVaultItem({ status: "ARCHIVED", canonStatus: "NONE" }), false);
  assert.equal(canArchiveVaultItem({ status: "DRAFT", canonStatus: "OFFICIAL" }), false);
  assert.equal(canDeleteVaultItem({ status: "DRAFT", canonStatus: "NONE" }), true);
  assert.equal(canDeleteVaultItem({ status: "APPROVED", canonStatus: "NONE" }), false);
  assert.equal(canDeleteVaultItem({ status: "ARCHIVED", canonStatus: "NONE" }), true);
});

test("/studio/v2/vault now loads real owned creation summaries", () => {
  const page = read("app/studio/v2/vault/page.jsx");
  const live = read("app/studio/v2/vault/VaultV2Live.jsx");

  assert.match(page, /getMyCreationsPageData/);
  assert.match(page, /VaultV2Live/);
  assert.match(live, /projectCreationsToVaultItems/);
  assert.match(live, /<VaultV2Mockup[\s\S]*live[\s\S]*items=\{items\}/);
});

test("live Vault uses persisted engagement and real Story launch", () => {
  const surface = read("app/studio/v2/vault/VaultV2Mockup.jsx");

  assert.match(surface, /useCreationEngagementState/);
  assert.match(surface, /startStoryFromCreation/);
  assert.match(surface, /router\.push\(`\/studio\/story-rooms\//);
  assert.match(surface, /archiveCreation/);
  assert.match(surface, /deleteCreation/);
  assert.match(surface, /router\.refresh\(\)/);
});

test("V2 owner card lifecycle menu no longer hardcodes Archive as an obsolete stub", () => {
  const card = read("components/kit/creation-card/KitCreationCard.view.jsx");

  assert.doesNotMatch(card, /Archive is not wired yet \(CR-056\)/);
  assert.match(card, /disabled=\{!onArchive\}/);
  assert.match(card, /disabled=\{!onDelete\}/);
});

console.log(`V2 Vault live diagnostics: ${results.length}/${results.length} PASS`);
results.forEach((name) => console.log(`PASS ${name}`));
