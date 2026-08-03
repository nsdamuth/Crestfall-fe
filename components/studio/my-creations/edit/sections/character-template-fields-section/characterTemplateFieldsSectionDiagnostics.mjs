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

test("Character Template Fields Shell remains a LOOM binding", () => {
  const shell = read(
    "components/studio/my-creations/edit/sections/character-templates/CharacterTemplateFieldsSection.jsx"
  );
  assert.match(shell, /useCharacterTemplateFieldsSectionViewModel/);
  assert.match(shell, /<CharacterTemplateFieldsSectionView/);
  assert.match(shell, /<KibbePresetModal/);
  assert.match(shell, /<PersonalityModal/);
  assert.doesNotMatch(shell, /form\.data|updateDataField\?\.\(/);
});

test("Character Template Fields View is API, persistence, and application-picker free", () => {
  const view = read(
    "components/studio/my-creations/edit/sections/character-template-fields-section/CharacterTemplateFieldsSection.view.jsx"
  );
  assert.doesNotMatch(view, /\bfetch\s*\(|supabase|PostGraphile|\/api\//);
  assert.doesNotMatch(view, /updateDataField|form\.data|template_category|template_tags|hips_waist_shoulders/);
  assert.doesNotMatch(view, /SkinToneModal|HairEyesModal|PersonalityModal|TraitModal|MultiTraitModal|KibbePresetModal|CrestfallOptionModal/);
});

test("Character Template Fields ViewModel owns nested storage mapping and compatibility normalization", () => {
  const viewModel = read(
    "components/studio/my-creations/edit/sections/character-template-fields-section/useCharacterTemplateFieldsSectionViewModel.js"
  );
  assert.match(viewModel, /data\.fields/);
  assert.match(viewModel, /template_category/);
  assert.match(viewModel, /template_tags/);
  assert.match(viewModel, /hips_waist_shoulders/);
  assert.match(viewModel, /normalizeCharacterTemplateProportions/);
  assert.match(viewModel, /parseCharacterTemplateTags/);
  assert.doesNotMatch(viewModel, /<\w+/);
});

test("Character Template Fields contract and fixtures cover all five edit tabs", () => {
  const contract = read(
    "components/studio/my-creations/edit/sections/character-template-fields-section/CharacterTemplateFieldsSection.contract.js"
  );
  const fixtures = read(
    "components/studio/my-creations/edit/sections/character-template-fields-section/CharacterTemplateFieldsSection.fixtures.js"
  );
  assert.match(contract, /CHARACTER_TEMPLATE_FIELDS_SECTION_VIEW_CONTRACT_VERSION/);
  assert.match(contract, /applicationOwnedControls/);
  assert.match(fixtures, /characterTemplateFieldsTemplateFixture/);
  assert.match(fixtures, /characterTemplateFieldsIdentityFixture/);
  assert.match(fixtures, /characterTemplateFieldsAppearanceFixture/);
  assert.match(fixtures, /characterTemplateFieldsBodyFixture/);
  assert.match(fixtures, /characterTemplateFieldsBehaviorFixture/);
});

test("Character Template Fields preview is development-only", () => {
  const page = read(
    "app/dev/ui-preview/character-template-fields-section/page.jsx"
  );
  const preview = read(
    "app/dev/ui-preview/character-template-fields-section/CharacterTemplateFieldsSectionPreviewClient.jsx"
  );
  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
  assert.match(preview, /CharacterTemplateFieldsSectionView/);
});

test("Creation Edit retains the public Character Template Fields Shell", () => {
  const editShell = read("components/studio/my-creations/creation-edit-shell/CreationEditSectionContent.jsx");
  assert.match(editShell, /import CharacterTemplateFieldsSection from/);
  assert.match(editShell, /<CharacterTemplateFieldsSection/);
  assert.match(editShell, /section="template"/);
  assert.match(editShell, /section="behavior"/);
});

test("Character Template Fields package includes its documented handoff", () => {
  const readme = read(
    "components/studio/my-creations/edit/sections/character-template-fields-section/README.md"
  );
  assert.match(readme, /Portable LOOM boundary/);
  assert.match(readme, /creation\.data\.fields/);
  assert.match(readme, /\/dev\/ui-preview\/character-template-fields-section/);
});
