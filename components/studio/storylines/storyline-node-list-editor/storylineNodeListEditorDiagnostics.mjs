import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../..");

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

test("Storyline Node List Editor shell stays thin and owns the picker slot", () => {
  const shell = read("components/studio/storylines/StorylineNodeListEditor.jsx");
  assert.match(shell, /useStorylineNodeListEditorViewModel/);
  assert.match(shell, /StorylineNodeListEditorView/);
  assert.match(shell, /StorylineReferencePickerModal/);
  assert.match(shell, /referencePickerSlot/);
  assert.doesNotMatch(
    shell,
    /normalizeStorylineData|validateStorylineData|createStorylineNode|createStorylineTrigger/
  );
});

test("ViewModel owns Storyline normalization, validation, modes, and mutations", () => {
  const viewModel = read(
    "components/studio/storylines/storyline-node-list-editor/useStorylineNodeListEditorViewModel.js"
  );
  for (const token of [
    "normalizeStorylineData",
    "validateStorylineData",
    "createStorylineNode",
    "createStorylineTrigger",
    "STORYLINE_NON_TERMINAL_TRANSITION_POLICIES",
    "STORYLINE_TRIGGER_MODES",
    "STORYLINE_TRIGGER_TYPES",
    "EDITOR_MODES",
    "commitNodes",
    "updateTrigger",
  ]) {
    assert.match(viewModel, new RegExp(token));
  }
  assert.match(viewModel, /COMPLETE_STORYLINE/);
  assert.match(viewModel, /OPEN_WORLD_UNTIL_TRIGGER/);
  assert.doesNotMatch(viewModel, /<article|<textarea|<select/);
});

test("Portable View consumes display-ready nodes and semantic callbacks only", () => {
  const view = read(
    "components/studio/storylines/storyline-node-list-editor/StorylineNodeListEditor.view.jsx"
  );
  assert.match(view, /nodes\.map/);
  assert.match(view, /node\.transitionOptions\.map/);
  assert.match(view, /node\.triggerModeOptions\.map/);
  assert.match(view, /node\.triggerTypeOptions\.map/);
  assert.match(view, /onMoveNodeUp/);
  assert.match(view, /onChangeTransitionPolicy/);
  assert.match(view, /onAddTrigger/);
  assert.match(view, /referencePickerSlot/);
  assert.doesNotMatch(
    view,
    /normalizeStorylineData|validateStorylineData|createStorylineNode|StorylineReferencePickerModal/
  );
  assert.doesNotMatch(view, /data\?\.|onChange\?\.\(\{|fetch\(/);
});

test("all existing authoring modes and controls remain represented", () => {
  const viewModel = read(
    "components/studio/storylines/storyline-node-list-editor/useStorylineNodeListEditorViewModel.js"
  );
  const view = read(
    "components/studio/storylines/storyline-node-list-editor/StorylineNodeListEditor.view.jsx"
  );
  const combined = `${viewModel}\n${view}`;
  for (const text of [
    "Narrative Sequence",
    "Node Transitions",
    "Add Story or Scenario",
    "Completion Guidance",
    "Transition After Completion",
    "Next-Node Triggers",
    "Open-World Guidance",
    "Consequence / Pressure Guidance",
    "Storyline authoring errors",
    "Draft readiness notes",
  ]) {
    assert.match(combined, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.match(viewModel, /new Set\(\["full", "sequence", "transitions"\]\)/);
});

test("contract and fixtures cover portable nodes and representative inputs", () => {
  const contract = read(
    "components/studio/storylines/storyline-node-list-editor/StorylineNodeListEditor.contract.js"
  );
  const fixtures = read(
    "components/studio/storylines/storyline-node-list-editor/StorylineNodeListEditor.fixtures.js"
  );
  assert.match(contract, /STORYLINE_NODE_LIST_EDITOR_VIEW_CONTRACT_VERSION/);
  assert.match(contract, /StorylineEditorNode/);
  assert.match(contract, /StorylineEditorTrigger/);
  assert.match(contract, /referencePickerSlot/);
  assert.match(fixtures, /storylineNodeListConfiguredFixture/);
  assert.match(fixtures, /storylineNodeListEmptyFixture/);
  assert.match(fixtures, /storylineNodeListLegacyFixture/);
  assert.match(fixtures, /ordered_nodes/);
});

test("development preview exercises the actual Binding Shell and all modes", () => {
  const page = read("app/dev/ui-preview/storyline-node-list-editor/page.jsx");
  const preview = read(
    "app/dev/ui-preview/storyline-node-list-editor/StorylineNodeListEditorPreviewClient.jsx"
  );
  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
  assert.match(preview, /StorylineNodeListEditor/);
  assert.match(preview, /storylineNodeListConfiguredFixture/);
  assert.match(preview, /storylineNodeListLegacyFixture/);
  assert.match(preview, /full/);
  assert.match(preview, /sequence/);
  assert.match(preview, /transitions/);
  assert.match(preview, /Last normalized payload/);
});

test("Storyline integrations, documentation, and diagnostic command remain explicit", () => {
  const builder = read("components/studio/storylines/StorylineBuilderShell.jsx");
  const fieldsShell = read(
    "components/studio/my-creations/edit/sections/storylines/StorylineFieldsSection.jsx"
  );
  const readme = read(
    "components/studio/storylines/storyline-node-list-editor/README.md"
  );
  const packageJson = read("package.json");
  assert.match(builder, /StorylineNodeListEditor/);
  assert.match(fieldsShell, /StorylineNodeListEditor/);
  assert.match(readme, /Portable Skin/);
  assert.match(readme, /Mechanics Module field decomposition remains deferred/);
  assert.match(readme, /\/dev\/ui-preview\/storyline-node-list-editor/);
  assert.match(packageJson, /diagnostics:loom:storyline-node-list-editor/);
});
