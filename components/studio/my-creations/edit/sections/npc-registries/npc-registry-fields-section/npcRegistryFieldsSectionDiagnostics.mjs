import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../../../../..");

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

test("NPC Registry Fields Shell remains a LOOM binding", () => {
  const shell = read(
    "components/studio/my-creations/edit/sections/npc-registries/NpcRegistryFieldsSection.jsx"
  );
  assert.match(shell, /useNpcRegistryFieldsSectionViewModel/);
  assert.match(shell, /<NpcRegistryFieldsSectionView/);
  assert.match(shell, /<NpcEntryModal/);
  assert.match(shell, /<RelationshipModal/);
  assert.match(shell, /<KnowledgeRuleModal/);
  assert.match(shell, /<AliasRuleModal/);
  assert.doesNotMatch(shell, /form\.data|updateDataField\?\.\(/);
});

test("NPC Registry Fields View is API, persistence, and application-modal free", () => {
  const view = read(
    "components/studio/my-creations/edit/sections/npc-registries/npc-registry-fields-section/NpcRegistryFieldsSection.view.jsx"
  );
  assert.doesNotMatch(view, /\bfetch\s*\(|supabase|PostGraphile|\/api\//);
  assert.doesNotMatch(view, /updateDataField|form\.data|knowledge_rules|creationId/);
  assert.doesNotMatch(
    view,
    /NpcEntryModal|RelationshipModal|KnowledgeRuleModal|AliasRuleModal|useNpcRegistryEditor/
  );
});

test("NPC Registry Fields ViewModel owns registry interpretation", () => {
  const viewModel = read(
    "components/studio/my-creations/edit/sections/npc-registries/npc-registry-fields-section/useNpcRegistryFieldsSectionViewModel.js"
  );
  assert.match(viewModel, /useNpcRegistryEditor/);
  assert.match(viewModel, /getEntryName/);
  assert.match(viewModel, /buildEntryCards/);
  assert.match(viewModel, /buildRelationshipCards/);
  assert.match(viewModel, /buildKnowledgeCards/);
  assert.match(viewModel, /buildAliasCards/);
  assert.match(viewModel, /updateDataField\?\.\("scope"/);
  assert.doesNotMatch(viewModel, /<\w+/);
});

test("NPC Registry Fields contract and fixtures cover all five tabs", () => {
  const contract = read(
    "components/studio/my-creations/edit/sections/npc-registries/npc-registry-fields-section/NpcRegistryFieldsSection.contract.js"
  );
  const fixtures = read(
    "components/studio/my-creations/edit/sections/npc-registries/npc-registry-fields-section/NpcRegistryFieldsSection.fixtures.js"
  );
  assert.match(contract, /NPC_REGISTRY_FIELDS_SECTION_VIEW_CONTRACT_VERSION/);
  assert.match(contract, /applicationOwnedControls/);
  assert.match(fixtures, /npcRegistryFieldsOverviewFixture/);
  assert.match(fixtures, /npcRegistryFieldsEntriesFixture/);
  assert.match(fixtures, /npcRegistryFieldsRelationshipsFixture/);
  assert.match(fixtures, /npcRegistryFieldsKnowledgeFixture/);
  assert.match(fixtures, /npcRegistryFieldsAliasesFixture/);
});

test("NPC Registry Fields preview is development-only", () => {
  const page = read("app/dev/ui-preview/npc-registry-fields-section/page.jsx");
  const preview = read(
    "app/dev/ui-preview/npc-registry-fields-section/NpcRegistryFieldsSectionPreviewClient.jsx"
  );
  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
  assert.match(preview, /NpcRegistryFieldsSectionView/);
});

test("Creation Edit retains the public NPC Registry Fields Shell", () => {
  const editShell = read("components/studio/my-creations/creation-edit-shell/CreationEditSectionContent.jsx");
  assert.match(editShell, /import NpcRegistryFieldsSection from/);
  assert.match(editShell, /<NpcRegistryFieldsSection/);
  assert.match(editShell, /section="overview"/);
  assert.match(editShell, /section="entries"/);
  assert.match(editShell, /section="relationships"/);
  assert.match(editShell, /section="knowledge"/);
  assert.match(editShell, /section="aliases"/);
});

test("NPC Registry Fields package documents storage and preview boundaries", () => {
  const readme = read(
    "components/studio/my-creations/edit/sections/npc-registries/npc-registry-fields-section/README.md"
  );
  assert.match(readme, /Portable LOOM boundary/);
  assert.match(readme, /creation\.data\.knowledge_rules/);
  assert.match(readme, /\/dev\/ui-preview\/npc-registry-fields-section/);
});
