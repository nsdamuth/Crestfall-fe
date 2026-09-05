import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  createStructuredRegistryEntryFromSample,
  listStructuredRegistrySamples,
} from "./structured-registry-sample-library/structuredRegistrySampleLibrary.js";

const currentFile = fileURLToPath(import.meta.url);
const featureDir = path.dirname(currentFile);
const repoRoot = path.resolve(featureDir, "../../../..");

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

test("Quest and Event receive educational sample coverage", () => {
  const questSamples = listStructuredRegistrySamples("QUEST_REGISTRY");
  const eventSamples = listStructuredRegistrySamples("EVENT_REGISTRY");

  assert.ok(questSamples.length >= 10);
  assert.ok(eventSamples.length >= 8);
  assert.equal(listStructuredRegistrySamples("FACTION_REGISTRY").length, 0);
  assert.equal(listStructuredRegistrySamples("ORGANIZATION_REGISTRY").length, 0);

  const missingPerson = createStructuredRegistryEntryFromSample(
    "QUEST_REGISTRY",
    "quest.sample.missing_person.v1"
  );
  assert.equal(missingPerson.category, "Job Posting");
  assert.equal(missingPerson.id, undefined);
});

test("Educational samples never embed Creation authority", () => {
  for (const registryType of ["QUEST_REGISTRY", "EVENT_REGISTRY"]) {
    for (const sample of listStructuredRegistrySamples(registryType)) {
      const serialized = JSON.stringify(sample.entry);
      assert.doesNotMatch(serialized, /"creationId"\s*:\s*"[^\"]+"/);
      assert.doesNotMatch(serialized, /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i);
    }
  }
});

test("Document tools are gated to Quest and Event", () => {
  const vm = read(
    "components/studio/create/structured-registry/structured-registry-document-tools/useStructuredRegistryDocumentToolsViewModel.js"
  );
  const controls = read(
    "components/studio/create/structured-registry/structured-registry-document-tools/StructuredRegistryDocumentTools.view.jsx"
  );

  assert.match(vm, /QUEST_REGISTRY/);
  assert.match(vm, /EVENT_REGISTRY/);
  assert.doesNotMatch(vm, /NPC_REGISTRY|LOCATION_REGISTRY|ITEM_REGISTRY/);
  assert.match(controls, /Sample library/);
  assert.match(controls, /JSON editor/);
});

test("JSON editor follows the Mechanics authoring interaction language", () => {
  const view = read(
    "components/studio/create/structured-registry/structured-registry-json-editor/StructuredRegistryJsonEditorModal.view.jsx"
  );
  const vm = read(
    "components/studio/create/structured-registry/structured-registry-json-editor/useStructuredRegistryJsonEditorViewModel.js"
  );

  for (const text of [
    "Loom Authoring Tool",
    "Copy JSON",
    "Download AI guide",
    "Format JSON",
    "Reset from builder",
    "Validate & apply",
  ]) {
    assert.match(view, new RegExp(text.replace(/[&]/g, "&"), "i"));
  }
  assert.match(vm, /buildStructuredRegistryJsonAiAuthoringGuide/);
  assert.match(vm, /normal page Save action/);
});

test("AI guide and validator preserve identity and Creation-link boundaries", () => {
  const guide = read(
    "components/studio/create/structured-registry/structured-registry-json-editor/structuredRegistryJsonAiAuthoringGuide.js"
  );
  const validation = read(
    "components/studio/create/structured-registry/structured-registry-json-editor/structuredRegistryJsonEditor.validation.js"
  );

  assert.match(guide, /Preserve existing entry IDs exactly/);
  assert.match(guide, /New entries may omit/);
  assert.match(guide, /Never invent a Creation UUID or Creation ID/);
  assert.match(guide, /Current Registry JSON/);
  assert.match(validation, /Do not invent, move, or add Creation relationships in JSON/);
  assert.match(validation, /Duplicate registry-local entry id/);
  assert.match(validation, /registry_kind/);
  assert.match(validation, /registry_version/);
});

test("Quest vocabulary adds Job Posting without changing Investigation default", () => {
  const config = read("components/studio/registries/structuredRegistryConfigs.js");
  const questBlock = config.slice(config.indexOf("QUEST_REGISTRY:"));
  const investigationIndex = questBlock.indexOf('"Investigation"');
  const jobPostingIndex = questBlock.indexOf('"Job Posting"');

  assert.ok(investigationIndex >= 0);
  assert.ok(jobPostingIndex > investigationIndex);
});

test("Shared builder applies samples and JSON through the normal builder state", () => {
  const hook = read(
    "components/studio/registries/hooks/useStructuredRegistryBuilder.js"
  );
  const shell = read(
    "components/studio/create/structured-registry/StructuredRegistryBuilder.jsx"
  );

  assert.match(hook, /addEntryFromTemplate/);
  assert.match(hook, /replaceData/);
  assert.match(hook, /normalizeStructuredRegistryEntry/);
  assert.match(hook, /normalizeStructuredRegistryData/);
  assert.match(shell, /StructuredRegistryDocumentToolsControls/);
  assert.match(shell, /StructuredRegistryDocumentToolsSurfaces/);
  assert.doesNotMatch(shell, /createCreationDraft|fetch\s*\(|supabase/i);
});
