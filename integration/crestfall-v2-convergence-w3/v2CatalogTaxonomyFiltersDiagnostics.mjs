import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../..");
const read = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

const taxonomyPath = path.join(
  repoRoot,
  "app/studio/v2/catalog/creationCatalogFilterTaxonomy.js"
);
const taxonomy = await import(pathToFileURL(taxonomyPath).href);

test("catalogue taxonomy mirrors the five Full Studio domains", () => {
  assert.deepEqual(
    taxonomy.CATALOG_CREATION_DOMAINS.map((domain) => domain.label),
    [
      "Characters & Visual Assets",
      "Stories & Sessions",
      "Worlds & Continuity",
      "Rules & Mechanics",
      "Templates & Generation",
    ]
  );

  const byId = Object.fromEntries(
    taxonomy.CATALOG_CREATION_DOMAINS.map((domain) => [
      domain.id,
      domain.options.map((option) => option.value),
    ])
  );

  assert.deepEqual(byId.storiesSessions, [
    "SCENARIO",
    "NARRATOR",
    "ROOM_TEMPLATE",
    "STORYLINE",
    "LORE",
  ]);
  assert.deepEqual(byId.worldsContinuity, [
    "LOCATION",
    "NPC_REGISTRY",
    "LOCATION_REGISTRY",
    "FACTION_REGISTRY",
    "ORGANIZATION_REGISTRY",
    "EVENT_REGISTRY",
    "QUEST_REGISTRY",
    "ITEM_REGISTRY",
  ]);
  assert.deepEqual(byId.rulesMechanics, [
    "STATS_POOLS_PROFILE",
    "PROGRESSION_PROFILE",
    "SKILLS_PROFILE",
    "ABILITY_SPELL_PROFILE",
    "WALLET_PROFILE",
    "MECHANICS_MODULE",
    "ACTOR_MECHANICS_PROFILE",
    "RULES_CODEX",
  ]);
});

test("domain selections combine as one OR-set of creation types", () => {
  assert.deepEqual(
    taxonomy.getSelectedCatalogCreationTypes({
      storiesSessions: ["SCENARIO", "STORYLINE"],
      worldsContinuity: ["ITEM_REGISTRY"],
      rulesMechanics: ["SKILLS_PROFILE"],
    }),
    ["SCENARIO", "STORYLINE", "ITEM_REGISTRY", "SKILLS_PROFILE"]
  );
});

test("tag projection stays presentation-local and can read existing raw summaries", () => {
  assert.deepEqual(
    taxonomy.getCatalogTags({
      tags: ["Aethelgard"],
      rawCreation: { tags: ["Open World"], data: { tags: ["RPG", "aethelgard"] } },
    }),
    ["Aethelgard", "Open World", "RPG"]
  );
});

test("Vault exposes all five domain dropdowns plus independent lifecycle/tag facets", () => {
  const source = read("app/studio/v2/vault/VaultV2Mockup.jsx");

  assert.match(source, /buildDomainFilterGroups\(pool\)/);
  assert.match(source, /id: "visibility"/);
  assert.match(source, /id: "status"/);
  assert.match(source, /id: "tags"/);
  assert.match(source, /getSelectedCatalogCreationTypes\(selectedValues\)/);
  assert.doesNotMatch(source, /id: "type"/);
  assert.doesNotMatch(source, /label: "Remix"/);
  assert.doesNotMatch(source, /TYPE_BUCKET_OPTIONS|ASSET_KIND_TO_TYPE_BUCKET/);
});

test("Community exposes the same five domain dropdowns with curation kept separate", () => {
  const source = read("app/studio/v2/community/CommunityV2Mockup.jsx");

  assert.match(source, /buildDomainFilterGroups\(pool\)/);
  assert.match(source, /id: "curation"/);
  assert.match(source, /id: "rating"/);
  assert.match(source, /id: "rendering"/);
  assert.match(source, /id: "tags"/);
  assert.match(source, /getSelectedCatalogCreationTypes\(selectedValues\)/);
  assert.doesNotMatch(source, /id: "type"/);
  assert.doesNotMatch(source, /label: "Remix"/);
  assert.doesNotMatch(source, /TYPE_BUCKET_OPTIONS|ASSET_KIND_TO_TYPE_BUCKET/);
});

test("W3N remains presentation-only", () => {
  const taxonomySource = read("app/studio/v2/catalog/creationCatalogFilterTaxonomy.js");
  const vault = read("app/studio/v2/vault/VaultV2Mockup.jsx");
  const community = read("app/studio/v2/community/CommunityV2Mockup.jsx");

  for (const source of [taxonomySource, vault, community]) {
    assert.doesNotMatch(source, /crestfallApiRequest|postgraphile|supabase|services\/api/);
  }
  assert.doesNotMatch(taxonomySource, /@\/lib\//);
});
