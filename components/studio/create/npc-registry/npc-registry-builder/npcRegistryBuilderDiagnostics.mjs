import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

function read(path) {
  return readFileSync(path, "utf8");
}

test("NPC Registry Builder Shell remains a focused LOOM binding", () => {
  const shell = read(
    "components/studio/create/npc-registry/NpcRegistryBuilder.jsx"
  );
  assert.match(shell, /useNpcRegistryBuilderViewModel/);
  assert.match(shell, /<NpcRegistryBuilderView/);
  assert.match(shell, /<NpcEntryModal/);
  assert.match(shell, /<RelationshipModal/);
  assert.match(shell, /<KnowledgeRuleModal/);
  assert.match(shell, /<AliasRuleModal/);
  assert.doesNotMatch(shell, /\bfetch\s*\(|useState|useRouter/);
});

test("NPC Registry Builder View is API, persistence, and application-Shell free", () => {
  const view = read(
    "components/studio/create/npc-registry/npc-registry-builder/NpcRegistryBuilder.view.jsx"
  );
  assert.doesNotMatch(
    view,
    /\bfetch\s*\(|\/api\/|supabase|PostGraphile|createNpcRegistryDraft|buildNpcRegistryCreationPayload|router\./
  );
  assert.doesNotMatch(
    view,
    /import .*NpcEntryModal|import .*RelationshipModal|import .*KnowledgeRuleModal|import .*AliasRuleModal/
  );
  assert.match(view, /entryModalContent/);
  assert.match(view, /relationshipModalContent/);
  assert.match(view, /knowledgeModalContent/);
  assert.match(view, /aliasModalContent/);
});

test("NPC Registry Builder ViewModel owns loading, drafts, payload, save, and navigation", () => {
  const viewModel = read(
    "components/studio/create/npc-registry/npc-registry-builder/useNpcRegistryBuilderViewModel.js"
  );
  assert.match(viewModel, /fetchNpcRegistryCharacterOptions/);
  assert.match(viewModel, /buildNpcRegistryCreationPayload/);
  assert.match(viewModel, /createNpcRegistryDraft/);
  assert.match(viewModel, /removeEntryReferences/);
  assert.match(viewModel, /router\.push\("\/studio\/my-creations"\)/);
  assert.doesNotMatch(viewModel, /\bfetch\s*\(|<\w+/);
});

test("Legacy NPC Registry Builder hook delegates to the LOOM ViewModel", () => {
  const legacyHook = read(
    "components/studio/registries/hooks/useNpcRegistryBuilder.js"
  );
  assert.match(legacyHook, /useNpcRegistryBuilderViewModel/);
  assert.match(legacyHook, /return compatibilityProps/);
  assert.doesNotMatch(
    legacyHook,
    /createNpcRegistryDraft|buildNpcRegistryCreationPayload|useRouter|useState/
  );
});

test("NPC Registry Builder contract and fixtures cover major registry states", () => {
  const contract = read(
    "components/studio/create/npc-registry/npc-registry-builder/NpcRegistryBuilder.contract.js"
  );
  const fixtures = read(
    "components/studio/create/npc-registry/npc-registry-builder/NpcRegistryBuilder.fixtures.js"
  );
  assert.match(contract, /NPC_REGISTRY_BUILDER_VIEW_CONTRACT_VERSION/);
  assert.match(contract, /NPC_REGISTRY_BUILDER_TABS/);
  assert.match(fixtures, /npcRegistryBuilderOverviewFixture/);
  assert.match(fixtures, /npcRegistryBuilderEntriesFixture/);
  assert.match(fixtures, /npcRegistryBuilderRelationshipsFixture/);
  assert.match(fixtures, /npcRegistryBuilderKnowledgeFixture/);
  assert.match(fixtures, /npcRegistryBuilderAliasesFixture/);
  assert.match(fixtures, /npcRegistryBuilderSavingFixture/);
  assert.match(fixtures, /npcRegistryBuilderErrorFixture/);
});

test("NPC Registry Builder preview is development-only", () => {
  const page = read("app/dev/ui-preview/npc-registry-builder/page.jsx");
  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
});

test("Create NPC Registry page retains the public Builder Shell", () => {
  const page = read("app/studio/create/npc-registry/page.js");
  assert.match(
    page,
    /import NpcRegistryBuilder from "@\/components\/studio\/create\/npc-registry\/NpcRegistryBuilder"/
  );
  assert.match(page, /<NpcRegistryBuilder \/>/);
});
