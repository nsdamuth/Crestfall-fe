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

test("Location Prompt Guidance Shell stays thin", () => {
  const shell = read(
    "components/studio/my-creations/edit/sections/locations/LocationPromptGuidanceSection.jsx"
  );
  assert.match(shell, /useLocationPromptGuidanceSectionViewModel/);
  assert.match(shell, /LocationPromptGuidanceSectionView/);
  assert.doesNotMatch(shell, /SharedFields/);
  assert.doesNotMatch(shell, /form\.data/);
  assert.doesNotMatch(shell, /updateDataField\?\.\(/);
});

test("Location Prompt Guidance View is portable and semantic", () => {
  const view = read(
    "components/studio/my-creations/edit/sections/locations/location-prompt-guidance-section/LocationPromptGuidanceSection.view.jsx"
  );
  assert.match(view, /SectionTitle/);
  assert.match(view, /TextAreaField/);
  assert.match(view, /onChangePromptGuidance/);
  assert.match(view, /onChangeRegistryNotes/);
  assert.match(view, /maxLength=\{imagePromptMaxLength\}/);
  assert.doesNotMatch(view, /form\b/);
  assert.doesNotMatch(view, /updateDataField/);
  assert.doesNotMatch(view, /prompt_guidance/);
  assert.doesNotMatch(view, /registry_notes/);
});

test("Location Prompt Guidance ViewModel owns fallback, limits, and storage mapping", () => {
  const viewModel = read(
    "components/studio/my-creations/edit/sections/locations/location-prompt-guidance-section/useLocationPromptGuidanceSectionViewModel.js"
  );
  assert.match(viewModel, /normalizeLocationPromptGuidanceData/);
  assert.match(viewModel, /source\.prompt_guidance \|\| source\.prompt/);
  assert.match(viewModel, /LOCATION_IMAGE_PROMPT_MAX_LENGTH = 2000/);
  assert.match(viewModel, /LOCATION_NEGATIVE_PROMPT_MAX_LENGTH = 2000/);
  assert.match(viewModel, /limitLocationPromptValue/);
  assert.match(viewModel, /updateDataField\?\.\("prompt_guidance"/);
  assert.match(viewModel, /"image_prompt"/);
  assert.match(viewModel, /"negative_prompt"/);
  assert.match(viewModel, /updateDataField\?\.\("registry_notes"/);
  assert.doesNotMatch(viewModel, /<\w+/);
});

test("Location Prompt Guidance contract and fixtures cover current and legacy states", () => {
  const contract = read(
    "components/studio/my-creations/edit/sections/locations/location-prompt-guidance-section/LocationPromptGuidanceSection.contract.js"
  );
  const fixtures = read(
    "components/studio/my-creations/edit/sections/locations/location-prompt-guidance-section/LocationPromptGuidanceSection.fixtures.js"
  );
  assert.match(contract, /LOCATION_PROMPT_GUIDANCE_SECTION_VIEW_CONTRACT_VERSION/);
  assert.match(contract, /legacyReadFields/);
  assert.match(contract, /"prompt"/);
  assert.match(contract, /imagePrompt: 2000/);
  assert.match(contract, /negativePrompt: 2000/);
  assert.match(fixtures, /locationPromptGuidanceCompleteFixture/);
  assert.match(fixtures, /locationPromptGuidanceLegacyFixture/);
  assert.match(fixtures, /locationPromptGuidanceSparseFixture/);
  assert.match(fixtures, /locationPromptGuidanceEmptyFixture/);
});

test("Location Prompt Guidance preview is development-only", () => {
  const page = read("app/dev/ui-preview/location-prompt-guidance-section/page.jsx");
  const preview = read(
    "app/dev/ui-preview/location-prompt-guidance-section/LocationPromptGuidanceSectionPreviewClient.jsx"
  );
  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
  assert.match(preview, /LocationPromptGuidanceSectionView/);
  assert.match(preview, /Legacy Prompt Fallback/);
});

test("Creation Edit retains the public Location Prompt Guidance Shell", () => {
  const editShell = read("components/studio/my-creations/creation-edit-shell/CreationEditSectionContent.jsx");
  assert.match(editShell, /import LocationPromptGuidanceSection from/);
  assert.match(editShell, /<LocationPromptGuidanceSection/);
  assert.match(editShell, /updateDataField=\{updateDataField\}/);
});

test("Location Prompt Guidance package documents payload and preview boundaries", () => {
  const readme = read(
    "components/studio/my-creations/edit/sections/locations/location-prompt-guidance-section/README.md"
  );
  const packageJson = read("package.json");
  assert.match(readme, /Portable LOOM boundary/);
  assert.match(readme, /legacy `prompt` fallback/);
  assert.match(readme, /2,000-character limits/);
  assert.match(readme, /\/dev\/ui-preview\/location-prompt-guidance-section/);
  assert.match(packageJson, /diagnostics:loom:location-prompt-guidance-section/);
});
