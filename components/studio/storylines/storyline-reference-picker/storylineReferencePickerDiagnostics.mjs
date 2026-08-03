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

test("Storyline Reference Picker shell stays thin and owns the portal binding", () => {
  const shell = read(
    "components/studio/storylines/StorylineReferencePickerModal.jsx"
  );
  assert.match(shell, /createPortal/);
  assert.match(shell, /useStorylineReferencePickerViewModel/);
  assert.match(shell, /StorylineReferencePickerModalView/);
  assert.match(shell, /portalTarget/);
  assert.doesNotMatch(shell, /useState|useEffect|selectedReferenceIds\.filter/);
});

test("ViewModel owns portal lifecycle, Escape dismissal, and scroll restoration", () => {
  const viewModel = read(
    "components/studio/storylines/storyline-reference-picker/useStorylineReferencePickerViewModel.js"
  );
  assert.match(viewModel, /document\.createElement\("div"\)/);
  assert.match(viewModel, /document\.body\.style\.overflow = "hidden"/);
  assert.match(viewModel, /previousOverflow/);
  assert.match(viewModel, /event\.key === "Escape"/);
  assert.match(viewModel, /portalNode\.remove\(\)/);
  assert.match(viewModel, /crestfallStorylineReferencePickerPortal/);
  assert.doesNotMatch(viewModel, /<div|<StorylineReferencePickerModalView/);
});

test("ViewModel owns tab state, filtering, normalization, and selection protection", () => {
  const viewModel = read(
    "components/studio/storylines/storyline-reference-picker/useStorylineReferencePickerViewModel.js"
  );
  assert.match(viewModel, /STORY_TAB/);
  assert.match(viewModel, /SCENARIO_TAB/);
  assert.match(viewModel, /matchesQuery/);
  assert.match(viewModel, /No description provided\./);
  assert.match(viewModel, /selectedReferenceIds/);
  assert.match(viewModel, /selectedReferenceIds\.includes\(itemId\)/);
  assert.match(viewModel, /onSelect\?\.\(selected\)/);
});

test("portable View receives only display-ready items and semantic callbacks", () => {
  const view = read(
    "components/studio/storylines/storyline-reference-picker/StorylineReferencePickerModal.view.jsx"
  );
  assert.match(view, /tabs\.map/);
  assert.match(view, /items\.map/);
  assert.match(view, /item\.kindLabel/);
  assert.match(view, /item\.isSelected/);
  assert.match(view, /onSelectItem/);
  assert.doesNotMatch(view, /createPortal|document\.|window\.|selectedReferenceIds/);
  assert.doesNotMatch(view, /stories|scenarios/);
});

test("contract and fixtures document populated, selected, and empty states", () => {
  const contract = read(
    "components/studio/storylines/storyline-reference-picker/StorylineReferencePickerModal.contract.js"
  );
  const fixtures = read(
    "components/studio/storylines/storyline-reference-picker/StorylineReferencePickerModal.fixtures.js"
  );
  assert.match(contract, /STORYLINE_REFERENCE_PICKER_VIEW_CONTRACT_VERSION/);
  assert.match(contract, /StorylineReferencePickerItem/);
  assert.match(contract, /onSelectItem/);
  assert.match(fixtures, /storylineReferencePickerFixture/);
  assert.match(fixtures, /storylineReferencePickerEmptyFixture/);
  assert.match(fixtures, /selectedReferenceIds/);
});

test("preview is development-only and exercises the actual binding shell", () => {
  const page = read("app/dev/ui-preview/storyline-reference-picker/page.jsx");
  const preview = read(
    "app/dev/ui-preview/storyline-reference-picker/StorylineReferencePickerPreviewClient.jsx"
  );
  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
  assert.match(preview, /StorylineReferencePickerModal/);
  assert.match(preview, /storylineReferencePickerFixture/);
  assert.match(preview, /storylineReferencePickerEmptyFixture/);
  assert.match(preview, /Last selection/);
});

test("documentation and focused diagnostic command remain explicit", () => {
  const readme = read(
    "components/studio/storylines/storyline-reference-picker/README.md"
  );
  const packageJson = read("package.json");
  assert.match(readme, /Portable Skin/);
  assert.match(readme, /Escape-to-close/);
  assert.match(readme, /body scroll restoration/);
  assert.match(readme, /Mechanics Module field decomposition remains deferred/);
  assert.match(readme, /\/dev\/ui-preview\/storyline-reference-picker/);
  assert.match(packageJson, /diagnostics:loom:storyline-reference-picker/);
});
