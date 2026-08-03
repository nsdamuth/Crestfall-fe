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

test("Storyline Builder shell stays thin and composes authoring slots", () => {
  const shell = read("components/studio/storylines/StorylineBuilderShell.jsx");
  assert.match(shell, /useStorylineBuilderShellViewModel/);
  assert.match(shell, /StorylineBuilderShellView/);
  assert.match(shell, /StorylineNodeListEditor/);
  assert.match(shell, /StorylineOpenWorldSettings/);
  assert.match(shell, /nodeEditorSlot/);
  assert.match(shell, /openWorldSettingsSlot/);
  assert.doesNotMatch(
    shell,
    /createStorylineDraft|buildStorylineCreationPayload|useState|useRouter/
  );
});

test("ViewModel owns normalization, references, validation, persistence, and navigation", () => {
  const viewModel = read(
    "components/studio/storylines/storyline-builder-shell/useStorylineBuilderShellViewModel.js"
  );
  for (const token of [
    "useStorylineReferenceOptions",
    "createStorylineDraft",
    "buildStorylineCreationPayload",
    "normalizeStorylineData",
    "validateStorylineData",
    "extractStorylineCreationFromResponse",
    "router.push",
    "A Storyline title is required.",
    "Draft saved.",
  ]) {
    assert.match(viewModel, new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.match(viewModel, /\/studio\/my-creations\/\$\{creation\.id\}\/edit/);
  assert.doesNotMatch(viewModel, /<section|<input|<textarea|<select/);
});

test("Portable View receives explicit values, callbacks, and slots", () => {
  const view = read(
    "components/studio/storylines/storyline-builder-shell/StorylineBuilderShell.view.jsx"
  );
  for (const token of [
    "titleValue",
    "onChangeTitle",
    "visibilityOptions",
    "contentRatingOptions",
    "saveButtonLabel",
    "nodeEditorSlot",
    "openWorldSettingsSlot",
  ]) {
    assert.match(view, new RegExp(token));
  }
  assert.doesNotMatch(
    view,
    /createStorylineDraft|storylineClient|useRouter|useStorylineReferenceOptions|form\./
  );
  assert.doesNotMatch(view, /StorylineNodeListEditor|StorylineOpenWorldSettings/);
});

test("existing authoring fields and save behavior remain represented", () => {
  const viewModel = read(
    "components/studio/storylines/storyline-builder-shell/useStorylineBuilderShellViewModel.js"
  );
  const view = read(
    "components/studio/storylines/storyline-builder-shell/StorylineBuilderShell.view.jsx"
  );
  const combined = `${viewModel}\n${view}`;
  for (const text of [
    "Storyline Builder",
    "Untitled Storyline",
    "Title",
    "Description",
    "Visibility",
    "Content Rating",
    "Private",
    "Unlisted",
    "SFW",
    "Tags",
    "One tag per line",
    "Save Draft",
  ]) {
    assert.match(combined, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.match(viewModel, /mode: "full"/);
});

test("contract, fixtures, and compatibility export document the boundary", () => {
  const contract = read(
    "components/studio/storylines/storyline-builder-shell/StorylineBuilderShell.contract.js"
  );
  const fixtures = read(
    "components/studio/storylines/storyline-builder-shell/StorylineBuilderShell.fixtures.js"
  );
  const compatibility = read(
    "components/studio/storylines/hooks/useStorylineBuilderViewModel.js"
  );
  assert.match(contract, /STORYLINE_BUILDER_SHELL_VIEW_CONTRACT_VERSION/);
  assert.match(contract, /StorylineBuilderShellViewProps/);
  assert.match(contract, /nodeEditorSlot/);
  assert.match(contract, /openWorldSettingsSlot/);
  assert.match(fixtures, /storylineBuilderReadyFixture/);
  assert.match(fixtures, /storylineBuilderEmptyFixture/);
  assert.match(fixtures, /storylineBuilderSavingFixture/);
  assert.match(fixtures, /storylineBuilderErrorFixture/);
  assert.match(compatibility, /storyline-builder-shell\/useStorylineBuilderShellViewModel/);
});

test("development preview is protected and exercises both real child editors", () => {
  const page = read("app/dev/ui-preview/storyline-builder-shell/page.jsx");
  const preview = read(
    "app/dev/ui-preview/storyline-builder-shell/StorylineBuilderShellPreviewClient.jsx"
  );
  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
  assert.match(preview, /StorylineBuilderShellView/);
  assert.match(preview, /StorylineNodeListEditor/);
  assert.match(preview, /StorylineOpenWorldSettings/);
  assert.match(preview, /storylineBuilderReadyFixture/);
  assert.match(preview, /Preview draft captured without persistence\./);
});

test("create route, documentation, and diagnostic command remain explicit", () => {
  const route = read("app/studio/create/storyline/page.js");
  const readme = read(
    "components/studio/storylines/storyline-builder-shell/README.md"
  );
  const packageJson = read("package.json");
  assert.match(route, /StorylineBuilderShell/);
  assert.match(readme, /Portable Skin/);
  assert.match(readme, /createStorylineDraft/);
  assert.match(readme, /Mechanics Module field decomposition remains deferred/);
  assert.match(readme, /\/dev\/ui-preview\/storyline-builder-shell/);
  assert.match(packageJson, /diagnostics:loom:storyline-builder-shell/);
});
