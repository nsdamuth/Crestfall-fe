import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../../../../..");

function readFeature(fileName) {
  return fs.readFileSync(path.join(here, fileName), "utf8");
}

function readRepo(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

test("Outfit Prompt Guidance Shell remains a thin LOOM binding", () => {
  const shell = readRepo(
    "components/studio/my-creations/edit/sections/outfits/OutfitPromptGuidanceSection.jsx"
  );

  assert.match(shell, /useOutfitPromptGuidanceSectionViewModel/);
  assert.match(shell, /<OutfitPromptGuidanceSectionView \{\.\.\.viewProps\}/);
  assert.doesNotMatch(shell, /form\.data|clothing_mode|updateDataField\?\.\(/);
});

test("Outfit Prompt Guidance View is API and persistence free", () => {
  const view = readFeature("OutfitPromptGuidanceSection.view.jsx");

  assert.doesNotMatch(view, /\bfetch\s*\(|\/api\/|supabase|PostGraphile/);
  assert.doesNotMatch(
    view,
    /normal_clothing_prompt|prompt_guidance|clothing_sections|image_prompt|negative_prompt|updateDataField|form\.data/
  );
  assert.match(view, /onClothingModeChange\?\.\(option\.value\)/);
  assert.match(view, /onClothingSectionChange\?\.\(field\.id, value\)/);
});

test("Outfit Prompt Guidance ViewModel owns normalization and storage mapping", () => {
  const viewModel = readFeature("useOutfitPromptGuidanceSectionViewModel.js");

  for (const fieldName of [
    "clothing_mode",
    "normal_clothing_prompt",
    "prompt_guidance",
    "signature_clothing",
    "clothing_sections",
    "image_prompt",
    "negative_prompt",
    "usage_notes",
    "compatibility_notes",
  ]) {
    assert.match(viewModel, new RegExp(fieldName));
  }
  assert.match(viewModel, /ASSET_IMAGE_PROMPT_MAX_LENGTH = 2000/);
  assert.match(viewModel, /ASSET_NEGATIVE_PROMPT_MAX_LENGTH = 2000/);
  assert.doesNotMatch(viewModel, /<\w+/);
});

test("Outfit Prompt Guidance contract and fixtures cover key visual states", () => {
  const contract = readFeature("OutfitPromptGuidanceSection.contract.js");
  const fixtures = readFeature("OutfitPromptGuidanceSection.fixtures.js");

  assert.match(contract, /OUTFIT_PROMPT_GUIDANCE_SECTION_VIEW_CONTRACT_VERSION/);
  assert.match(contract, /OutfitPromptGuidanceSectionViewProps/);
  assert.match(fixtures, /outfitPromptGuidanceNormalFixture/);
  assert.match(fixtures, /outfitPromptGuidanceAdvancedFixture/);
  assert.match(fixtures, /outfitPromptGuidanceEmptyFixture/);
  assert.match(fixtures, /outfitPromptGuidanceLongContentFixture/);
  assert.match(fixtures, /outfitPromptGuidanceMissingCallbacksFixture/);
});

test("Outfit Prompt Guidance preview is development-only", () => {
  const page = readRepo(
    "app/dev/ui-preview/outfit-prompt-guidance-section/page.jsx"
  );
  const preview = readRepo(
    "app/dev/ui-preview/outfit-prompt-guidance-section/OutfitPromptGuidanceSectionPreviewClient.jsx"
  );

  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
  assert.match(preview, /OutfitPromptGuidanceSectionView/);
});

test("Creation Edit retains the public Outfit Prompt Guidance Shell", () => {
  const editShell = readRepo(
    "components/studio/my-creations/creation-edit-shell/CreationEditSectionContent.jsx"
  );

  assert.match(editShell, /import OutfitPromptGuidanceSection from/);
  assert.match(editShell, /<OutfitPromptGuidanceSection/);
});

test("Outfit Prompt Guidance package includes its documented handoff", () => {
  const readme = readFeature("README.md");

  assert.match(readme, /Portable LOOM boundary/);
  assert.match(readme, /form\.data\.clothing_mode/);
  assert.match(readme, /normal_clothing_prompt/);
  assert.match(readme, /\/dev\/ui-preview\/outfit-prompt-guidance-section/);
});
