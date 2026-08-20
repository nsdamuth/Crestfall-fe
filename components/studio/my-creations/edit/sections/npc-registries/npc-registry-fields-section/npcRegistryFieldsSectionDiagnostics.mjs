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

function exists(relativePath) {
  return fs.existsSync(path.join(repoRoot, relativePath));
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
  for (const token of [
    "imageUrl",
    "registryNotes",
    "referenceWarning",
    "footer",
    "Registry Notes",
  ]) {
    assert.match(view, new RegExp(token));
  }
});

test("NPC Registry Fields ViewModel owns hydrated linked-Character presentation", () => {
  const viewModel = read(
    "components/studio/my-creations/edit/sections/npc-registries/npc-registry-fields-section/useNpcRegistryFieldsSectionViewModel.js"
  );
  assert.match(viewModel, /useNpcRegistryEditor/);
  assert.match(viewModel, /getEntryName/);
  assert.match(viewModel, /buildEntryCards/);
  assert.match(viewModel, /buildRelationshipCards/);
  assert.match(viewModel, /buildKnowledgeCards/);
  assert.match(viewModel, /buildAliasCards/);
  for (const token of [
    "hydratedCharacter",
    "linkedReferenceUnavailable",
    "referenceStatus",
    "referenceWarning",
    "registryNotes",
    "Mechanics follow the linked Character creation",
  ]) {
    assert.match(viewModel, new RegExp(token));
  }
  assert.match(viewModel, /updateDataField\?\.\("scope"/);
  assert.doesNotMatch(viewModel, /<\w+/);
});

test("NPC Registry editor hydrates for display and serializes before persistence", () => {
  const editor = read("components/studio/registries/hooks/useNpcRegistryEditor.js");
  for (const token of [
    "hydrateNpcRegistryEntries",
    "serializeNpcRegistryEntry",
    "serializeNpcRegistryEntries",
    "hydratedRegistry",
    "entries: hydrateNpcRegistryEntries",
    "registry: hydratedRegistry",
  ]) {
    assert.match(editor, new RegExp(token));
  }
  assert.match(
    editor,
    /updateDataField\(\s*"entries",\s*serializeNpcRegistryEntries\(nextRegistry\.entries\)/s
  );
  assert.match(editor, /setEntryDraft\(serializeNpcRegistryEntry\(entry\)\)/);
  assert.match(editor, /const nextEntry = serializeNpcRegistryEntry\(entryDraft\)/);
});

test("NPC Registry Fields contract and fixtures cover recovery presentation", () => {
  const contract = read(
    "components/studio/my-creations/edit/sections/npc-registries/npc-registry-fields-section/NpcRegistryFieldsSection.contract.js"
  );
  const fixtures = read(
    "components/studio/my-creations/edit/sections/npc-registries/npc-registry-fields-section/NpcRegistryFieldsSection.fixtures.js"
  );
  assert.match(
    contract,
    /NPC_REGISTRY_FIELDS_SECTION_VIEW_CONTRACT_VERSION = "1\.3\.0"/
  );
  assert.match(contract, /applicationOwnedControls/);
  for (const token of ["imageUrl", "registryNotes", "footer", "referenceWarning"]) {
    assert.match(contract, new RegExp(token));
  }
  assert.match(fixtures, /npcRegistryFieldsOverviewFixture/);
  assert.match(fixtures, /npcRegistryFieldsEntriesFixture/);
  assert.match(fixtures, /npcRegistryFieldsRelationshipsFixture/);
  assert.match(fixtures, /npcRegistryFieldsKnowledgeFixture/);
  assert.match(fixtures, /npcRegistryFieldsAliasesFixture/);
  assert.match(fixtures, /imageUrl/);
  assert.match(fixtures, /registryNotes/);
});

test("NPC Registry Fields preview remains development-only when present", () => {
  const pagePath = "app/dev/ui-preview/npc-registry-fields-section/page.jsx";
  const previewPath =
    "app/dev/ui-preview/npc-registry-fields-section/NpcRegistryFieldsSectionPreviewClient.jsx";
  if (!exists(pagePath) && !exists(previewPath)) return;

  assert.equal(exists(pagePath), true);
  assert.equal(exists(previewPath), true);
  const page = read(pagePath);
  const preview = read(previewPath);
  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
  assert.match(preview, /NpcRegistryFieldsSectionView/);
});

test("Creation Edit registry-as-data dispatch retains all NPC Registry sections", () => {
  const componentMap = read(
    "components/studio/my-creations/creation-edit-shell/creationEditSectionComponentMap.js"
  );
  assert.match(componentMap, /import NpcRegistryFieldsSection from/);
  assert.match(componentMap, /const NPC_REGISTRY_SECTIONS = \{/);
  for (const section of ["overview", "entries", "relationships", "knowledge", "aliases"]) {
    assert.match(
      componentMap,
      new RegExp(`${section}: familySection\\(NpcRegistryFieldsSection, "${section}"\\)`)
    );
  }
});

test("NPC Registry Fields package documents storage, recovery, and preview boundaries", () => {
  const readme = read(
    "components/studio/my-creations/edit/sections/npc-registries/npc-registry-fields-section/README.md"
  );
  assert.match(readme, /Portable LOOM boundary/);
  assert.match(readme, /creation\.data\.knowledge_rules/);
  assert.match(readme, /\/dev\/ui-preview\/npc-registry-fields-section/);
  assert.match(readme, /W48 linked-Character recovery convergence/);
  assert.match(readme, /hydratedCharacter/);
  assert.match(readme, /presentation-only/);
});
