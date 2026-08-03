import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../../../..");

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

test("Character Body Shell remains a thin LOOM binding", () => {
  const shell = read(
    "components/studio/my-creations/edit/sections/BodySection.jsx"
  );
  assert.match(shell, /useCharacterBodySectionViewModel/);
  assert.match(shell, /<CharacterBodySectionView/);
  assert.match(shell, /<KibbePresetModal/);
  assert.match(shell, /<MultiTraitModal/);
  assert.doesNotMatch(shell, /form\.data|updateDataField\?\.\(/);
});

test("Character Body View is API, persistence, and application-modal free", () => {
  const view = read(
    "components/studio/my-creations/edit/sections/character-body-section/CharacterBodySection.view.jsx"
  );
  assert.doesNotMatch(view, /\bfetch\s*\(|supabase|PostGraphile|\/api\//);
  assert.doesNotMatch(
    view,
    /updateDataField|form\.data|["'\`]body_type|["'\`]body_notes|["'\`]proportions/
  );
  assert.doesNotMatch(view, /TraitModal|MultiTraitModal|KibbePresetModal/);
});

test("Character Body ViewModel owns normalization and storage mapping", () => {
  const viewModel = read(
    "components/studio/my-creations/edit/sections/character-body-section/useCharacterBodySectionViewModel.js"
  );
  assert.match(viewModel, /normalizeCharacterProportions/);
  assert.match(viewModel, /body_type/);
  assert.match(viewModel, /body_notes/);
  assert.match(viewModel, /proportions/);
  assert.doesNotMatch(viewModel, /<\w+/);
});

test("Character Body contract and fixtures cover portable states", () => {
  const contract = read(
    "components/studio/my-creations/edit/sections/character-body-section/CharacterBodySection.contract.js"
  );
  const fixtures = read(
    "components/studio/my-creations/edit/sections/character-body-section/CharacterBodySection.fixtures.js"
  );
  assert.match(contract, /CHARACTER_BODY_SECTION_VIEW_CONTRACT_VERSION/);
  assert.match(contract, /kibbePresetControl/);
  assert.match(contract, /onChangeBodyNotes/);
  assert.match(fixtures, /characterBodySectionPopulatedFixture/);
  assert.match(fixtures, /characterBodySectionEmptyFixture/);
  assert.match(fixtures, /characterBodySectionLongContentFixture/);
  assert.match(fixtures, /characterBodySectionMissingCallbacksFixture/);
});

test("Character Body preview is development-only", () => {
  const page = read("app/dev/ui-preview/character-body-section/page.jsx");
  const preview = read(
    "app/dev/ui-preview/character-body-section/CharacterBodySectionPreviewClient.jsx"
  );
  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
  assert.match(preview, /CharacterBodySectionView/);
});

test("Creation Edit retains the public Character Body Shell", () => {
  const editShell = read("components/studio/my-creations/creation-edit-shell/CreationEditSectionContent.jsx");
  assert.match(editShell, /import BodySection from/);
  assert.match(editShell, /<BodySection/);
});

test("Character Body package includes its documented handoff", () => {
  const readme = read(
    "components/studio/my-creations/edit/sections/character-body-section/README.md"
  );
  assert.match(readme, /Portable LOOM boundary/);
  assert.match(readme, /body_notes/);
  assert.match(readme, /\/dev\/ui-preview\/character-body-section/);
});
