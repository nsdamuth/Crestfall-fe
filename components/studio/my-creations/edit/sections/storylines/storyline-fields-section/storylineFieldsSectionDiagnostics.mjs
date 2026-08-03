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

test("Storyline Fields Shell remains a thin LOOM binding", () => {
  const shell = read(
    "components/studio/my-creations/edit/sections/storylines/StorylineFieldsSection.jsx"
  );
  assert.match(shell, /useStorylineFieldsSectionViewModel/);
  assert.match(shell, /<StorylineFieldsSectionView/);
  assert.match(shell, /<StorylineNodeListEditor/);
  assert.match(shell, /<StorylineOpenWorldSettings/);
  assert.doesNotMatch(shell, /normalizeStorylineData|form\.data|Object\.entries/);
});

test("Storyline Fields View is persistence and application-editor free", () => {
  const view = read(
    "components/studio/my-creations/edit/sections/storylines/storyline-fields-section/StorylineFieldsSection.view.jsx"
  );
  assert.doesNotMatch(view, /\bfetch\s*\(|supabase|PostGraphile|\/api\//);
  assert.doesNotMatch(view, /form\.data|updateDataField|normalizeStorylineData/);
  assert.doesNotMatch(
    view,
    /StorylineNodeListEditor|StorylineOpenWorldSettings|useStorylineReferenceOptions/
  );
  assert.match(view, /editorSlot/);
});

test("Storyline Fields ViewModel owns normalization and storage mapping", () => {
  const viewModel = read(
    "components/studio/my-creations/edit/sections/storylines/storyline-fields-section/useStorylineFieldsSectionViewModel.js"
  );
  assert.match(viewModel, /normalizeStorylineData/);
  assert.match(viewModel, /useStorylineReferenceOptions/);
  assert.match(viewModel, /Object\.entries\(normalized\)/);
  assert.match(viewModel, /updateDataField\?\.\(field, value\)/);
  assert.match(viewModel, /editorMode/);
  assert.doesNotMatch(viewModel, /<\w+/);
});

test("Storyline Fields contract and fixtures cover all sections", () => {
  const contract = read(
    "components/studio/my-creations/edit/sections/storylines/storyline-fields-section/StorylineFieldsSection.contract.js"
  );
  const fixtures = read(
    "components/studio/my-creations/edit/sections/storylines/storyline-fields-section/StorylineFieldsSection.fixtures.js"
  );
  assert.match(contract, /STORYLINE_FIELDS_SECTION_VIEW_CONTRACT_VERSION/);
  assert.match(contract, /StorylineNodeListEditor/);
  assert.match(contract, /StorylineOpenWorldSettings/);
  assert.match(fixtures, /storylineFieldsSequenceFixture/);
  assert.match(fixtures, /storylineFieldsTransitionsFixture/);
  assert.match(fixtures, /storylineFieldsOpenWorldFixture/);
});

test("Storyline Fields preview is development-only", () => {
  const page = read("app/dev/ui-preview/storyline-fields-section/page.jsx");
  const preview = read(
    "app/dev/ui-preview/storyline-fields-section/StorylineFieldsSectionPreviewClient.jsx"
  );
  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
  assert.match(preview, /StorylineFieldsSectionView/);
  assert.match(preview, /MockSequenceEditor/);
  assert.match(preview, /MockOpenWorldEditor/);
});

test("Creation Edit retains the public Storyline Fields Shell", () => {
  const editShell = read("components/studio/my-creations/creation-edit-shell/CreationEditSectionContent.jsx");
  assert.match(editShell, /import StorylineFieldsSection from/);
  assert.match(editShell, /<StorylineFieldsSection/);
  assert.match(editShell, /\["sequence", "transitions", "openWorld"\]/);
});

test("Storyline Fields package documents payload and preview boundaries", () => {
  const readme = read(
    "components/studio/my-creations/edit/sections/storylines/storyline-fields-section/README.md"
  );
  assert.match(readme, /Portable LOOM boundary/);
  assert.match(readme, /normalizeStorylineData/);
  assert.match(readme, /creation\.data/);
  assert.match(readme, /\/dev\/ui-preview\/storyline-fields-section/);
});
